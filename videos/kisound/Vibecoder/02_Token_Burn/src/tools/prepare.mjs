// Checks both final versions against the music repository and copies the two release WAVs (unchanged) into
// assets/audio. Release selection: final/<lang>/02_Token_Burn_1.0.txt → RELEASE AUDIO (relative to that folder).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {VARIANTS,LANGS} from '../render/config.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),repo=path.resolve(root,'../../../..');
const source=process.env.TOKEN_BURN_SOURCE||path.join(repo,'music/kisound/Vibecoder/02_Token_Burn');
const hash=p=>new Promise((resolve,reject)=>{const h=crypto.createHash('sha256'),s=fs.createReadStream(p);s.on('data',b=>h.update(b));s.on('error',reject);s.on('end',()=>resolve(h.digest('hex')));});
const sourceManifest=JSON.parse(fs.readFileSync(path.join(root,'SOURCE-MANIFEST.json'),'utf8')),out={schema:'kisound.token-burn.assets.v1',variants:{}};
for(const lang of LANGS){
 const V=VARIANTS[lang],dir=path.join(source,'final',lang),promptFile=path.join(dir,'02_Token_Burn_1.0.txt'),prompt=fs.readFileSync(promptFile,'utf8');
 if(!/^STATUS:\s*Final\s*$/m.test(prompt))throw Error(`${lang}: Prompt ist nicht final`);
 const rel=prompt.match(/^RELEASE AUDIO:\s*(.+)$/m)?.[1].trim(),wav=path.resolve(dir,rel);
 if(path.basename(wav)!==V.wav)throw Error(`${lang}: Release-Auswahl ${rel} passt nicht zu ${V.wav}`);
 const analysisFile=path.join(root,'variants',lang,'ASTRA-AUDIO-ANALYSE.json'),analysis=JSON.parse(fs.readFileSync(analysisFile,'utf8')),transcriptFile=path.join(dir,'02_Token_Burn_Transkript.json');
 if(analysis.source.sha256!==V.sha256||analysis.summary.samples_per_channel!==V.samples)throw Error(`${lang}: Analysequelle oder Dauer passt nicht`);
 const [wavSha,trSha,anSha]=await Promise.all([hash(wav),hash(transcriptFile),hash(analysisFile)]);
 if(wavSha!==V.sha256)throw Error(`${lang}: WAV-Prüfsumme passt nicht`);
 if(trSha!==analysis.source.transcript_sha256)throw Error(`${lang}: Transkript wurde seit der Analyse geändert`);
 if(anSha!==sourceManifest.variants[lang].inputs.analysis.sha256)throw Error(`${lang}: Analyse im Projekt weicht vom Quellenmanifest ab`);
 const audio=path.join(root,'assets/audio',V.audio);fs.mkdirSync(path.dirname(audio),{recursive:true});if(!fs.existsSync(audio)||await hash(audio)!==V.sha256)fs.copyFileSync(wav,audio);
 out.variants[lang]={release_status:'final',prompt:promptFile,prompt_sha256:await hash(promptFile),source:wav,sha256:wavSha,transcript:transcriptFile,transcript_sha256:trSha,analysis:path.relative(root,analysisFile),analysis_sha256:anSha,
  duration_s:V.samples/48000,samples_per_channel:V.samples,sample_rate_hz:48000,channels:2,bit_depth:16,audio:path.relative(root,audio)};
 console.log(`${lang.toUpperCase()}: WAV, Transkript und Analyse geprüft (${(V.samples/48000).toFixed(4)} s).`);
}
const cover=path.join(source,'02_Token_Burn_cover.png');
out.cover=fs.existsSync(cover)?cover:null;out.cover_sha256=out.cover?await hash(cover):null;
out.fonts=[];for(const name of['Michroma-Regular.ttf','SpaceGrotesk.ttf','JetBrainsMono.ttf'])out.fonts.push({filename:name,sha256:await hash(path.join(root,'assets/fonts',name))});
out.geometry='Prozedurale Three.js-Geometrie und Canvas-Texturen; keine externen Modelle oder Rasterbilder';
fs.writeFileSync(path.join(root,'assets/manifest.json'),JSON.stringify(out,null,2)+'\n');
