import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {VARIANTS,LANGS} from '../render/config.js';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'SOURCE-MANIFEST.json'),'utf8'));
const hash=p=>new Promise((resolve,reject)=>{const h=crypto.createHash('sha256'),s=fs.createReadStream(p);s.on('data',b=>h.update(b));s.on('error',reject);s.on('end',()=>resolve(h.digest('hex')));});
const out={schema:'kisound.vibecoder01.assets.v1',variants:{}};
for(const lang of LANGS){
 const spec=manifest.variants[lang],v=VARIANTS[lang],files=spec.inputs;
 for(const [kind,entry] of Object.entries(files)){
  const p=path.resolve(root,entry.path);if(!fs.existsSync(p))throw Error(`${lang}: ${kind} fehlt: ${p}`);
  if(await hash(p)!==entry.sha256)throw Error(`${lang}: ${kind} weicht vom Quellenmanifest ab`);
 }
 const promptFile=path.resolve(root,files.prompt.path),prompt=fs.readFileSync(promptFile,'utf8');
 if(!/^STATUS:\s*Final\s*$/m.test(prompt))throw Error(`${lang}: Prompt ist nicht final`);
 const release=prompt.match(/^RELEASE AUDIO:\s*(.+)$/m)?.[1].trim();
 if(!release)throw Error(`${lang}: RELEASE AUDIO fehlt`);
 const audio=path.resolve(path.dirname(promptFile),release),source=path.resolve(root,files.audio.path);
 if(audio!==source||path.basename(source)!==v.wav)throw Error(`${lang}: Release-Auswahl stimmt nicht mit der WAV überein`);
 const analysisPath=path.join(root,'variants',lang,'ASTRA-AUDIO-ANALYSE.json'),analysis=JSON.parse(fs.readFileSync(analysisPath,'utf8'));
 if(await hash(analysisPath)!==files.analysis.sha256)throw Error(`${lang}: Projektanalyse weicht vom Quellenmanifest ab`);
 if(analysis.source.sha256!==v.sha256||analysis.summary.samples_per_channel!==v.samples)throw Error(`${lang}: Analysequelle oder Dauer falsch`);
 if(analysis.source.transcript_sha256!==files.transcript.sha256)throw Error(`${lang}: Transkript passt nicht zur Analyse`);
 const target=path.join(root,'assets/audio',v.audio);fs.mkdirSync(path.dirname(target),{recursive:true});
 if(!fs.existsSync(target)||await hash(target)!==v.sha256)fs.copyFileSync(source,target);
 out.variants[lang]={source,sha256:v.sha256,audio:path.relative(root,target),duration_s:v.samples/48000,samples_per_channel:v.samples,
  transcript_sha256:files.transcript.sha256,analysis_sha256:files.analysis.sha256,prompt_sha256:files.prompt.sha256};
 console.log(`${lang.toUpperCase()}: finale WAV, Prompt, Transkript und Analyse geprüft; ${out.variants[lang].duration_s.toFixed(2)} s.`);
}
const cover=path.resolve(root,manifest.variants.de.inputs.cover.path);out.cover={path:cover,sha256:manifest.variants.de.inputs.cover.sha256};
out.fonts=[];for(const name of['Michroma-Regular.ttf','SpaceGrotesk.ttf','JetBrainsMono.ttf'])out.fonts.push({name,sha256:await hash(path.join(root,'assets/fonts',name))});
fs.writeFileSync(path.join(root,'assets/manifest.json'),JSON.stringify(out,null,2)+'\n');
