// Sequential, frame-exact, resumable export. No browser is launched by --check.
import fs from 'node:fs';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const SCHEMA='kisound.render-checkpoint.v1';
const read=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const stateFile=dir=>path.join(dir,'checkpoint.json');
const ratio=value=>{const [n,d]=String(value).split('/').map(Number);return n/(d||1);};
const exists=file=>fs.existsSync(file);
async function atomicJSON(file,value){
 const temp=file+'.writing';
 await fsp.writeFile(temp,JSON.stringify(value,null,2)+'\n');
 await fsp.rename(temp,file);
}
export function frameRanges(frames,fps,seconds){
 if(!Number.isInteger(frames)||frames<1||!Number.isFinite(fps)||fps<=0||!Number.isFinite(seconds)||seconds<=0)throw new Error('Ungültiges Abschnittsraster.');
 const size=Math.max(1,Math.round(fps*seconds));
 return Array.from({length:Math.ceil(frames/size)},(_,i)=>({index:i,from:i*size,to:Math.min(frames,(i+1)*size),file:`chunk-${String(i).padStart(5,'0')}.mp4`}));
}
export function validateSegment(plan,range,info){
 const v=info.streams?.find(s=>s.codec_type==='video');
 if(!v||v.codec_name!=='h264'||v.width!==plan.width||v.height!==plan.height||
  Number(v.nb_frames)!==range.to-range.from||!Number.isFinite(ratio(v.avg_frame_rate))||Math.abs(ratio(v.avg_frame_rate)-plan.fps)>.001||
  !Number.isFinite(Number(v.duration))||Math.abs(Number(v.duration)-(range.to-range.from)/plan.fps)>1/plan.fps+.001)
  throw new Error(`Abschnitt ${range.index+1}: Codec, Auflösung, Bildzahl, Dauer oder FPS stimmen nicht.`);
 return {frames:Number(v.nb_frames),timeBase:v.time_base,pixelFormat:v.pix_fmt};
}
export async function fingerprint(plan,sha256){
 const files=new Map();
 const visit=async(file,label,ancestors=new Set())=>{
  const real=await fsp.realpath(file),stat=await fsp.stat(real);
  if(stat.isDirectory()){
   if(ancestors.has(real))throw new Error(`Zyklischer Quellpfad: ${file}`);
   const next=new Set([...ancestors,real]);
   for(const name of (await fsp.readdir(real)).sort())await visit(path.join(file,name),label+'/'+name,next);
  }else if(stat.isFile())files.set(label,await sha256(real));
 };
 for(const name of ['src','assets','package.json','package-lock.json','render-export.json']){
  const file=path.join(plan.project,name);if(exists(file))await visit(file,name);
 }
 // Runtime data such as ASTRA-AUDIO-ANALYSE.json is often in the project root.
 for(const name of (await fsp.readdir(plan.project)).sort()){
  const file=path.join(plan.project,name);
  if(/\.(json|js|mjs|html|css|glsl|wgsl)$/i.test(name)&&!name.startsWith('.')&&
   ![plan.output,plan.log,plan.manifest].includes(file)&&(await fsp.stat(file)).isFile())await visit(file,'root/'+name);
 }
 await visit(plan.audio,'selected-audio');
 await visit(plan.renderer,'selected-renderer');
 const tools=path.dirname(fileURLToPath(import.meta.url));
 for(const name of ['render.mjs','export-video.mjs','render-checkpoints.mjs','kisound-render.mjs'])await visit(path.join(tools,name),'tools/'+name);
 // Include all options that can affect rendered pixels, encoding or audio/metadata.
 const keys=['project','audio','renderer','width','height','fps','frames','duration','audioDuration','encoder','jobs','quality','crf','preset','chrome','chunkSeconds','title','artist'];
 const settings=Object.fromEntries(keys.map(k=>[k,plan[k]]));
 const sources=Object.fromEntries([...files].sort(([a],[b])=>a.localeCompare(b)));
 return{sha256:crypto.createHash('sha256').update(JSON.stringify({settings,sources})).digest('hex'),sources};
}
function readState(dir){
 const state=read(stateFile(dir));
 if(state.schema!==SCHEMA||!state.plan||!Array.isArray(state.completed))throw new Error('Kein unterstützter Checkpoint in '+dir);
 const p=state.plan;
 if(!Number.isInteger(p.frames)||p.frames<1||!Number.isFinite(p.fps)||p.fps<=0||!Number.isFinite(p.chunkSeconds)||p.chunkSeconds<5||p.chunkSeconds>60||!Number.isInteger(p.retries)||p.retries<0||p.retries>5)throw new Error('Ungültige Checkpoint-Einstellungen.');
 return state;
}
export async function loadResume(o){
 const dir=await fsp.realpath(o.resume),state=readState(dir);
 if(state.status==='complete')throw new Error('Dieser Export ist bereits abgeschlossen.');
 const p={...state.plan,resume:dir,check:!!o.check,keepTemp:o.keepTemp||state.plan.keepTemp};
 for(const file of [p.audio,p.renderer,p.chrome])if(!exists(file))throw new Error('Datei für Wiederaufnahme fehlt: '+file);
 for(const file of [p.output,p.manifest])if(exists(file))throw new Error('Zieldatei existiert bereits: '+file);
 // Source compatibility is checked by the same code for --check and the actual export.
 const sha=async file=>{const h=crypto.createHash('sha256');for await(const b of fs.createReadStream(file))h.update(b);return h.digest('hex');};
 if((await fingerprint(p,sha)).sha256!==state.inputs.sha256)throw new Error('Quellen oder Renderer wurden seit dem Checkpoint verändert. Neuen Export starten.');
 return p;
}
export async function acquireLock(dir){
 const file=path.join(dir,'export.lock');
 for(let attempt=0;attempt<2;attempt++){
  try{
   const handle=await fsp.open(file,'wx');
   await handle.writeFile(JSON.stringify({pid:process.pid,host:os.hostname()}));await handle.close();
   return async()=>fsp.unlink(file);
  }catch(error){
   if(error.code!=='EEXIST')throw error;
   const lock=read(file);
   if(lock.host!==os.hostname()||!Number.isInteger(lock.pid)||lock.pid<=0)throw new Error('Arbeitsordner ist gesperrt: '+file);
   try{process.kill(lock.pid,0);throw new Error('Export läuft bereits (PID '+lock.pid+').');}
   catch(e){if(e.code!=='ESRCH')throw e;}
   await fsp.unlink(file);
  }
 }
 throw new Error('Arbeitsordner konnte nicht gesperrt werden.');
}
export function createRunner(plan,scratch,log){
 let active,aborted=false;
 const kill=(proc,signal)=>{try{if(process.platform==='win32')proc.kill(signal);else process.kill(-proc.pid,signal);}catch{}};
 const stop=()=>{aborted=true;active?.stop();};
 process.on('SIGINT',stop);process.on('SIGTERM',stop);
 return{
  get aborted(){return aborted;},
  async run(cmd,args,temp=scratch){
   if(aborted)throw new Error('Abgebrochen.');
   return new Promise((resolve,reject)=>{
    const child=spawn(cmd,args,{cwd:plan.project,env:{...process.env,TMPDIR:temp},detached:process.platform!=='win32',stdio:['ignore','pipe','pipe']});
    let failure,escalation;
    const terminate=()=>{kill(child,'SIGTERM');escalation??=setTimeout(()=>kill(child,'SIGKILL'),5000);};
    active={stop:terminate};
    // A crashed Chrome can leave inherited pipes open. Clean the process group on
    // exit, not only on close; allow the renderer's finally block to close Chrome.
    child.on('exit',(code,signal)=>{if(code!==0||signal)terminate();});
    const timer=setTimeout(()=>{failure=new Error('Renderabschnitt nach 15 Minuten ohne Abschluss beendet.');terminate();},900000);
    child.stdout.on('data',b=>log(b.toString()));child.stderr.on('data',b=>log(b.toString()));
    child.on('error',e=>{failure=e;});
    child.on('close',(code,signal)=>{
     clearTimeout(timer);if(escalation)clearTimeout(escalation);active=null;
     if(failure||code!==0||aborted)reject(failure||new Error(`${path.basename(cmd)} beendet: ${signal||code}${aborted?' / abgebrochen':''}`));else resolve();
    });
   });
  },
  dispose(){process.off('SIGINT',stop);process.off('SIGTERM',stop);active?.stop();},
 };
}
export async function renderWithCheckpoints(plan,deps){
 const {probe,sha256,rendererArgs,muxArgs,validateOutput}=deps;
 const scratch=plan.resume||await fsp.mkdtemp(path.join(plan.tempDir,'kisound-export-'));
 const unlock=await acquireLock(scratch);
 let logHandle,runner,success=false;
 const log=s=>{process.stdout.write(s);if(logHandle!==undefined)fs.writeSync(logHandle,s);};
 try{
  for(const file of [plan.output,plan.manifest,...(plan.resume?[]:[plan.log])])if(exists(file))throw new Error('Datei existiert bereits: '+file);
  const inputs=await fingerprint(plan,sha256);
  let state;
  if(plan.resume){
   state=readState(scratch);
   if(inputs.sha256!==state.inputs.sha256)throw new Error('Quellen oder Einstellungen verändert. Neuen Export starten.');
  }else{
   state={schema:SCHEMA,status:'rendering',createdAt:new Date().toISOString(),plan,inputs,completed:[]};
   await atomicJSON(stateFile(scratch),state);
  }
  await fsp.mkdir(path.dirname(plan.output),{recursive:true});
  logHandle=fs.openSync(plan.log,plan.resume?'a':'wx');
  log(`\nkisound export mit Checkpoints\n${JSON.stringify(plan,null,2)}\nArbeitsordner: ${scratch}\n`);
  runner=(deps.runnerFactory||createRunner)(plan,scratch,log);
  const ranges=frameRanges(plan.frames,plan.fps,plan.chunkSeconds);
  let encoding;
  for(const range of ranges){
   const file=path.join(scratch,range.file);
   const saved=state.completed.find(r=>r.index===range.index&&r.from===range.from&&r.to===range.to);
   let reusable=false;
   if(saved&&exists(file)){
    try{validateSegment(plan,range,probe(file));reusable=await sha256(file)===saved.sha256;}
    catch(e){log(`Checkpoint ${range.index+1} ungültig: ${e.message}\n`);}
   }
   if(reusable)log(`Abschnitt ${range.index+1}/${ranges.length} geprüft, wird übernommen.\n`);
   else{
    state.completed=state.completed.filter(r=>r.index!==range.index);
    await atomicJSON(stateFile(scratch),state);
    for(let attempt=0;;attempt++){
     if(runner.aborted)throw new Error('Abgebrochen.');
     const attemptDir=await fsp.mkdtemp(path.join(scratch,'attempt-'));
     await fsp.rm(file,{force:true});
     try{
      log(`\nAbschnitt ${range.index+1}/${ranges.length}: Frames ${range.from}–${range.to-1}, Versuch ${attempt+1}/${plan.retries+1}\n`);
      await runner.run(process.execPath,rendererArgs(plan,file,range),attemptDir);
      validateSegment(plan,range,probe(file));
      state.completed.push({...range,sha256:await sha256(file)});
      await atomicJSON(stateFile(scratch),state);
      await fsp.rm(attemptDir,{recursive:true,force:true});
      break;
     }catch(e){
      log(`Abschnitt fehlgeschlagen: ${e.message}\n`);
      if(runner.aborted||attempt>=plan.retries)throw e;
      // Keep the last failed attempt for diagnosis; earlier attempts are no longer
      // needed after the renderer has closed its browser and encoder.
      await fsp.rm(attemptDir,{recursive:true,force:true});
     }
    }
   }
   const current=validateSegment(plan,range,probe(file));
   const signature=JSON.stringify({timeBase:current.timeBase,pixelFormat:current.pixelFormat});
   if(encoding&&encoding!==signature)throw new Error('Abschnitte haben unterschiedliche Zeitbasen/Pixelformate.');
   encoding=signature;
  }
  if((await fingerprint(plan,sha256)).sha256!==inputs.sha256)throw new Error('Quelldateien wurden während des Exports verändert. Neuen Export starten.');
  const list=path.join(scratch,'chunks.txt'),video=path.join(scratch,'video.mp4'),final=path.join(scratch,'complete.mp4');
  // Relative, generated filenames: no escaping of user-supplied paths in concat syntax.
  await fsp.writeFile(list,ranges.map(r=>`file '${r.file}'`).join('\n')+'\n');
  await fsp.rm(video,{force:true});await fsp.rm(final,{force:true});
  log('\nAbschnitte ohne erneute Bildcodierung zusammenfügen …\n');
  await runner.run('ffmpeg',['-n','-hide_banner','-loglevel','error','-f','concat','-safe','1','-i',list,'-map','0:v:0','-c','copy','-movflags','+faststart',video]);
  log('\nOriginalaudio vollständig einbetten …\n');await runner.run('ffmpeg',muxArgs(plan,video,final));
  const verified=validateOutput(plan,probe(final));
  log('\nVollständigen Videostream auf Decodierfehler prüfen …\n');
  await runner.run('ffmpeg',['-v','error','-xerror','-err_detect','explode','-i',final,'-map','0:v:0','-f','null','-']);
  const manifest={schema:'kisound.render-export.result.v1',status:'passed',completedAt:new Date().toISOString(),
   project:plan.project,output:plan.output,sourceAudio:plan.audio,sourceAudioSha256:await sha256(plan.audio),
   sha256:await sha256(final),bytes:(await fsp.stat(final)).size,inputFingerprint:inputs.sha256,
   settings:{width:plan.width,height:plan.height,fps:plan.fps,encoder:plan.encoder,jobs:plan.jobs,quality:plan.quality,crf:plan.crf,preset:plan.preset,chunkSeconds:plan.chunkSeconds},
   chunks:ranges.length,verification:{...verified,fullVideoDecode:true}};
  if(runner.aborted)throw new Error('Abgebrochen.');
  await fsp.copyFile(final,plan.output,fs.constants.COPYFILE_EXCL);
  await fsp.writeFile(plan.manifest,JSON.stringify(manifest,null,2)+'\n',{flag:'wx'});
  state.status='complete';await atomicJSON(stateFile(scratch),state);
  success=true;log(`\nFertig: ${plan.output}\nPrüfbericht: ${plan.manifest}\n`);
 }catch(e){
  log(`\nExport fehlgeschlagen: ${e.message}\nArbeitsordner bleibt erhalten: ${scratch}\n`);
  if(exists(stateFile(scratch)))log(`Wiederaufnahme: kisound-render --resume ${JSON.stringify(scratch)}\n`);
  throw e;
 }finally{
  runner?.dispose();if(logHandle!==undefined)fs.closeSync(logHandle);
  await unlock();
  if(success&&!plan.keepTemp)await fsp.rm(scratch,{recursive:true,force:true});
 }
}
