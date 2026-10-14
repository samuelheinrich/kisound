#!/usr/bin/env node
// Installed beside export-video.mjs. No per-song npm script/config is required.
import fs from 'node:fs';import path from 'node:path';import os from 'node:os';import{fileURLToPath,pathToFileURL}from'node:url';
const modulePath=process.env.KISOUND_EXPORT_MODULE||path.join(path.dirname(fileURLToPath(import.meta.url)),'export-video.mjs');
const {options,preflight,exportVideo,resumePlan}=await import(pathToFileURL(modulePath).href);
export function projectRoot(start){
 let p=path.resolve(start);
 while(true){if(fs.existsSync(path.join(p,'src/render/index.html'))&&fs.existsSync(path.join(p,'src/render/render.mjs')))return p;const parent=path.dirname(p);if(parent===p)throw new Error('Kein Video-Projekt gefunden. Im Songordner starten oder --project "/Pfad/zum/Song" angeben.');p=parent;}
}
export function findAudio(root,explicit,config){
 if(explicit)return path.resolve(root,explicit);
 if(config.audio)return path.resolve(root,config.audio);
 const dir=path.join(root,'assets/audio');
 const candidates=fs.existsSync(dir)?fs.readdirSync(dir).filter(f=>/\.(wav|flac|mp3|m4a|aac|aif|aiff)$/i.test(f)&&fs.statSync(path.join(dir,f)).isFile()):[];
 if(candidates.length!==1)throw new Error(`Audio nicht eindeutig (${candidates.length} Dateien in assets/audio). --audio "Pfad/zur/finalen.wav" angeben oder render-export.json anlegen.`);
 return path.join(dir,candidates[0]);
}
export async function main(argv=process.argv.slice(2)){
 const args=[...argv];if(['1080p','4k'].includes(args[0]))args.splice(0,1,'--resolution',args[0]);
 if(args.includes('--help')){console.log(`Globaler kisound-Export\n\n  kisound-render 1080p\n  kisound-render 4k\n  kisound-render 4k --check\n  kisound-render --resume "/Pfad/zum/kisound-export-Ordner"\n  kisound-render 4k --project "/Pfad/zum/Song"\n  kisound-render 4k --audio "assets/audio/final.wav"\n\nErkennt den Projektordner auch aus dessen Unterordnern. Nutzt render-export.json,\nfalls vorhanden; sonst genau eine Audiodatei unter assets/audio. Kein npm-Eintrag\npro Song notwendig. Weitere Optionen wie --out, --jobs, --encoder, --chrome und\n--temp-dir entsprechen export-video.mjs. Standard: 20-Sekunden-Abschnitte,\n1 Renderprozess, 2 Wiederholungen; --chunk-seconds 5..60 und --retries 0..5.\n--resume übernimmt alle gespeicherten Einstellungen (ohne 4k/1080p). --check startet keinen Render.\n`);return;}
 const parsed=options(args);
 if(parsed.resume){
  const plan=await resumePlan(parsed);
  console.log(`Wiederaufnahme: ${plan.resume}\nProjekt: ${plan.project}\nZiel: ${plan.output}`);
  if(parsed.check){console.log('Checkpoint und Quellen geprüft. Kein Render gestartet.');return plan;}
  await exportVideo(plan);return plan;
 }
 const root=projectRoot(parsed.project);
 const variantFile=parsed.lang?path.join(root,`render-export.${parsed.lang}.json`):null;
 const configFile=variantFile&&fs.existsSync(variantFile)?variantFile:path.join(root,'render-export.json');
 const config=fs.existsSync(configFile)?JSON.parse(fs.readFileSync(configFile,'utf8')):{};
 if(parsed.lang&&config.lang&&parsed.lang!==config.lang)throw new Error(`Keine passende Exportkonfiguration für --lang ${parsed.lang}: ${configFile}`);
 if(config.schema&&config.schema!=='kisound.render-export.v1')throw new Error('Unbekanntes Schema in render-export.json.');
 const audio=findAudio(root,parsed.audio,config);
 const name=path.basename(root).replace(/[^\p{L}\p{N}_-]/gu,'_');
 const effective={...config,schema:'kisound.render-export.v1',outputName:config.outputName||name,
  title:config.title||path.basename(root).replace(/^\d+[_-]/,'').replace(/[_-]/g,' '),artist:config.artist||'Samuel Heinrich',audio,
  timelineModule:path.resolve(root,config.timelineModule||'src/render/config.js'),renderer:path.resolve(root,config.renderer||'src/render/render.mjs')};
 // Feed the shared preflight a transient configuration, never edit the song.
 const temp=fs.mkdtempSync(path.join(os.tmpdir(),'kisound-global-check-'));
 let plan;
 try{
  for(const folder of ['src','node_modules'])fs.symlinkSync(path.join(root,folder),path.join(temp,folder),'dir');
  fs.writeFileSync(path.join(temp,'render-export.json'),JSON.stringify(effective));
  plan=await preflight({...parsed,project:temp,audio,
   out:parsed.out?path.resolve(root,parsed.out):path.join(root,'output',`${effective.outputName}_${parsed.resolution}_${new Date().toISOString().replace(/[-:.]/g,'')}.mp4`)});
  plan.project=root;
 }finally{fs.rmSync(temp,{recursive:true,force:true});}
 console.log(`Projekt: ${root}\nBild: ${plan.width} × ${plan.height}, ${plan.fps} fps\nAudio: ${plan.audio}\nZiel: ${plan.output}`);
 if(parsed.check){console.log('Prüfung bestanden. Kein Render gestartet, Projekt unverändert.');return plan;}
 await exportVideo(plan);return plan;
}
if(process.argv[1]&&fs.realpathSync(process.argv[1])===fileURLToPath(import.meta.url))main().catch(e=>{console.error(`Fehler: ${e.message}`);process.exitCode=1;});
