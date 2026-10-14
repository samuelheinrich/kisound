#!/usr/bin/env node
// Shared local export entry point. --check never launches Chrome or an encoder.
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {parseArgs} from 'node:util';
import {fileURLToPath,pathToFileURL} from 'node:url';

const HELP=`kisound — Musikvideo exportieren

node tools/export-video.mjs --project <Songordner> --resolution 1080p|4k

  --project PATH        Songordner (Standard: aktueller Ordner)
  --resolution 1080p|4k  1920×1080 oder 3840×2160; Standard 1080p
  --check               Nur Voraussetzungen und Einstellungen prüfen, KEIN Export
  --out PATH            MP4-Pfad, relativ zum Songordner oder absolut
                        Standard: output/<Name>_<Auflösung><fps>_<Zeitstempel>.mp4
  --audio PATH          Audiodatei; sonst audio aus render-export.json
  --lang CODE           Sprachfassung im Browser (z. B. de oder en)
  --title TEXT          Metadaten-Titel überschreiben
  --artist TEXT         Metadaten-Interpret überschreiben
  --encoder vt|x264      Standard: vt auf macOS, sonst x264
  --jobs 1..4           Standard: 1 (weniger gleichzeitiger GPU-Speicher)
  --quality 1..100      VideoToolbox-Qualität; Standard 85
  --crf 0..51           x264-CRF; Standard 16 (1080p) / 14 (4K)
  --preset NAME         x264-Preset; Standard medium
  --chrome PATH         Chrome-Pfad; alternativ CHROME_PATH
  --temp-dir PATH       Lokaler Arbeitsdatenträger; Standard Betriebssystem-Temp
  --chunk-seconds 5..60  Videodauer pro Abschnitt; Standard 20 s
  --retries 0..5        Wiederholungen pro fehlgeschlagenem Abschnitt; Standard 2
  --resume PATH         Gespeicherten Arbeitsordner fortsetzen (optional --check)
  --keep-temp           Temporäre Daten auch nach Erfolg behalten
  --help                Diese Hilfe

Pro Song: render-export.json. Kein Überschreiben vorhandener Dateien.
FPS und Bildzahl werden aus dem vorhandenen Film übernommen.
`;

function numberOption(value,name,min,max,integer=false){
 const n=Number(value);if(!Number.isFinite(n)||n<min||n>max||(integer&&!Number.isInteger(n)))throw new Error(`${name}: erwartet ${integer?'Ganzzahl ':''}${min}–${max}.`);return n;
}
export function options(argv,defaultRoot=process.cwd()){
 const strings=['project','resolution','out','audio','lang','title','artist','encoder','jobs','quality','crf','preset','chrome','temp-dir','chunk-seconds','retries','resume'];
 const specification=Object.fromEntries(strings.map(k=>[k,{type:'string'}]));
 for(const k of ['check','keep-temp','help'])specification[k]={type:'boolean'};
 const {values:a}=parseArgs({args:argv,options:specification,strict:true,allowPositionals:false});
 if(a.help)return{help:true};
 if(a.lang&&!/^[a-z]{2,3}$/.test(a.lang))throw new Error('--lang erwartet einen Sprachcode wie de oder en.');
 if(a.resume){
  const extra=Object.keys(a).filter(k=>!['resume','check','keep-temp'].includes(k));
  if(extra.length)throw new Error('--resume übernimmt die gespeicherten Einstellungen. Andere Optionen entfernen: '+extra.join(', '));
  return{resume:path.resolve(a.resume),check:!!a.check,keepTemp:!!a['keep-temp']};
 }
 const res=a.resolution||'1080p';if(!['1080p','4k'].includes(res))throw new Error('--resolution muss 1080p oder 4k sein.');
 const encoder=a.encoder||(process.platform==='darwin'?'vt':'x264');if(!['vt','x264'].includes(encoder))throw new Error('--encoder muss vt oder x264 sein.');
 const jobs=numberOption(a.jobs??1,'--jobs',1,4,true);
 if(process.platform!=='darwin'&&(encoder==='vt'||jobs>1))throw new Error('VideoToolbox und parallele ProRes-Segmente benötigen macOS. --encoder x264 --jobs 1 verwenden.');
 const preset=a.preset||'medium';if(!['ultrafast','superfast','veryfast','faster','fast','medium','slow','slower','veryslow','placebo'].includes(preset))throw new Error('Ungültiges x264-Preset.');
 return{...a,project:path.resolve(a.project||defaultRoot),resolution:res,width:res==='4k'?3840:1920,height:res==='4k'?2160:1080,encoder,jobs,
  chunkSeconds:numberOption(a['chunk-seconds']??20,'--chunk-seconds',5,60),retries:numberOption(a.retries??2,'--retries',0,5,true),
  quality:numberOption(a.quality??85,'--quality',1,100,true),crf:numberOption(a.crf??(res==='4k'?14:16),'--crf',0,51),preset,
  chrome:a.chrome||process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  tempDir:path.resolve(a['temp-dir']||os.tmpdir()),keepTemp:!!a['keep-temp'],check:!!a.check};
}
function readJSON(file){try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch(e){throw new Error(`${file}: ${e.message}`);}}
function requireFile(file,label){if(!fs.existsSync(file)||!fs.statSync(file).isFile())throw new Error(`${label} fehlt: ${file}`);}
function probe(file){
 try{return JSON.parse(execFileSync('ffprobe',['-v','error','-show_streams','-show_format','-of','json',file],{encoding:'utf8',maxBuffer:4*1024*1024,stdio:['ignore','pipe','pipe']}));}
 catch(e){throw new Error(`ffprobe fehlgeschlagen (${file}): ${e.stderr?.toString()||e.message}`);}
}
export function makePlan(o,config,timing,audioInfo,now=new Date()){
 if(config.schema!=='kisound.render-export.v1')throw new Error('render-export.json: schema muss kisound.render-export.v1 sein.');
 const {FPS,FRAMES,DURATION}=timing;
 if(!Number.isFinite(FPS)||FPS<=0||FPS>240||!Number.isInteger(FRAMES)||FRAMES<=0||!Number.isFinite(DURATION)||DURATION<=0)throw new Error('Film-Konfiguration benötigt gültige FPS, FRAMES und DURATION.');
 if(Math.abs(FRAMES/FPS-DURATION)>1/FPS+.001)throw new Error('FPS, FRAMES und DURATION passen nicht zusammen.');
 const stream=audioInfo.streams?.find(s=>s.codec_type==='audio');
 const audioDuration=Number(stream?.duration??audioInfo.format?.duration);
 if(!stream||!Number.isFinite(audioDuration)||audioDuration<=0)throw new Error('Audiodauer ist nicht bestimmbar.');
 if(Math.abs(audioDuration-DURATION)>.5)throw new Error(`Audio (${audioDuration}s) und Film (${DURATION}s) weichen über 0,5 s ab. Quelle/Timeline prüfen.`);
 if(audioDuration>FRAMES/FPS+.01)throw new Error('Das Audio endet nach dem letzten Videobild. Film-Timeline zuerst verlängern.');
 const name=config.outputName||path.basename(o.project);
 if(typeof name!=='string'||!name.length||!/^[\p{L}\p{N}_-]+$/u.test(name))throw new Error('outputName darf nur Buchstaben, Ziffern, _ und - enthalten.');
 const stamp=now.toISOString().replace(/[-:.]/g,'');
 const file=`${name}_${o.resolution}${String(FPS).replace('.','_')}_${stamp}.mp4`;
 const output=path.resolve(o.project,o.out||path.join('output',file));
 if(path.extname(output).toLowerCase()!=='.mp4')throw new Error('--out muss eine .mp4-Datei sein.');
 return{...o,fps:FPS,frames:FRAMES,duration:DURATION,audioDuration,output,lang:o.lang||config.lang,
  title:o.title??config.title??name,artist:o.artist??config.artist??'',
  audio:path.resolve(o.project,o.audio||config.audio),
  renderer:path.resolve(o.project,config.renderer||'src/render/render.mjs'),
  log:output+'.log',manifest:output+'.json'};
}
export function rendererArgs(plan,video,range){
 return[plan.renderer,'--width',String(plan.width),'--height',String(plan.height),'--mb','1',
  '--jobs',String(plan.jobs),'--encoder',plan.encoder,'--q',String(plan.quality),'--crf',String(plan.crf),
  '--preset',plan.preset,'--chrome',plan.chrome,'--out',video,...(plan.lang?['--lang',plan.lang]:[]),...(range?['--from',String(range.from),'--to',String(range.to)]:[])];
}
export function muxArgs(plan,video,output){
 // Intentionally no -shortest: keep the final ceil(duration*fps) video frame.
 return['-n','-hide_banner','-loglevel','error','-i',video,'-i',plan.audio,'-map','0:v:0','-map','1:a:0',
  '-c:v','copy','-c:a','aac','-b:a','320k','-ar','48000','-metadata',`title=${plan.title}`,
  '-metadata',`artist=${plan.artist}`,'-movflags','+faststart',output];
}
function availableEncoders(){try{return execFileSync('ffmpeg',['-hide_banner','-encoders'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});}catch(e){throw new Error(`FFmpeg fehlt oder startet nicht: ${e.message}`);}}
function freeOutput(plan){for(const file of[plan.output,plan.log,plan.manifest])if(fs.existsSync(file))throw new Error(`Datei existiert bereits, nichts wird überschrieben: ${file}`);}
export async function preflight(o){
 const file=path.join(o.project,'render-export.json');requireFile(file,'Song-Konfiguration');const config=readJSON(file);
 if(!(o.audio||config.audio)||typeof(o.audio||config.audio)!=='string')throw new Error('audio in render-export.json oder --audio fehlt.');
 const timingFile=path.resolve(o.project,config.timelineModule||'src/render/config.js');
 requireFile(timingFile,'Film-Timeline');requireFile(path.join(o.project,'src/render/index.html'),'Render-Seite');
 requireFile(path.join(o.project,'node_modules/puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'),'Lokales puppeteer-core (npm ci im Songordner)');
 requireFile(o.chrome,'Chrome (--chrome oder CHROME_PATH)');
 const audio=path.resolve(o.project,o.audio||config.audio);requireFile(audio,'Audiodatei');
 const timing=await import(pathToFileURL(timingFile).href);
 const plan=makePlan(o,config,timing,probe(audio));requireFile(plan.renderer,'Render-Einstieg');freeOutput(plan);
 const encoders=availableEncoders();
 for(const enc of[plan.encoder==='vt'?'h264_videotoolbox':'libx264','aac',...(plan.jobs>1?['prores_videotoolbox']:[])]){
  if(!new RegExp(`\\b${enc}\\b`).test(encoders))throw new Error(`FFmpeg-Encoder ${enc} fehlt. Ggf. --encoder x264 --jobs 1 verwenden.`);
 }
 if(!fs.existsSync(plan.tempDir)||!fs.statSync(plan.tempDir).isDirectory())throw new Error(`Temporärer Ordner fehlt: ${plan.tempDir}`);
 fs.accessSync(plan.tempDir,fs.constants.W_OK);
 return plan;
}
export function validateOutput(plan,info){
 const video=info.streams?.find(s=>s.codec_type==='video'),audio=info.streams?.find(s=>s.codec_type==='audio');
 const ratio=s=>{const[n,d]=String(s).split('/').map(Number);return n/(d||1);};
 if(!video||!audio)throw new Error('Fertige Datei benötigt Bild und Ton.');
 if(video.width!==plan.width||video.height!==plan.height||Number(video.nb_frames)!==plan.frames||!Number.isFinite(ratio(video.avg_frame_rate))||Math.abs(ratio(video.avg_frame_rate)-plan.fps)>.001)throw new Error('Auflösung, Bildzahl oder Bildrate stimmen nicht mit dem Auftrag überein.');
 if(video.codec_name!=='h264'||audio.codec_name!=='aac')throw new Error('Unerwarteter Video-/Audiocodec.');
 if(!Number.isFinite(Number(audio.duration))||Math.abs(Number(audio.duration)-plan.audioDuration)>.08)throw new Error('Audiodauer im Export stimmt nicht mit der Quelle überein.');
 return {frames:Number(video.nb_frames),width:video.width,height:video.height,fps:ratio(video.avg_frame_rate),videoDuration:Number(video.duration),audioDuration:Number(audio.duration)};
}
async function sha256(file){const h=crypto.createHash('sha256');for await(const chunk of fs.createReadStream(file))h.update(chunk);return h.digest('hex');}
// The checkpoint implementation is separate so its failure/recovery paths are testable
// without launching Chrome or rendering a music video.
export async function resumePlan(o){
 const {loadResume}=await import('./render-checkpoints.mjs');
 return loadResume(o);
}
export async function exportVideo(plan){
 const {renderWithCheckpoints}=await import('./render-checkpoints.mjs');
 return renderWithCheckpoints(plan,{probe,sha256,rendererArgs,muxArgs,validateOutput});
}
export async function main(argv=process.argv.slice(2),defaultRoot=process.cwd()){
 const o=options(argv,defaultRoot);if(o.help){console.log(HELP);return;}
 const p=o.resume?await resumePlan(o):await preflight(o);
 console.log(`Projekt: ${p.project}\nBild: ${p.width} × ${p.height}, ${p.fps} fps, ${p.frames} Frames\nAudio: ${p.audio}\nEncoder: ${p.encoder}, ${p.jobs} Prozess(e)\nZiel: ${p.output}`);
 if(p.check){console.log('Prüfung bestanden. Kein Browser gestartet, kein Video gerendert, keine Exportdateien angelegt.');return p;}
 await exportVideo(p);return p;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 main().catch(e=>{console.error(`Fehler: ${e.message}`);process.exitCode=1;});
}
