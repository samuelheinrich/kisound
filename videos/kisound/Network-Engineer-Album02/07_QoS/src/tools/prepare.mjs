import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {SOURCE_WAV,SOURCE_SHA256,DURATION,SAMPLES} from '../render/config.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),repo=path.resolve(root,'../../../..');
const source=process.env.QOS_SOURCE||path.join(repo,'music/kisound/Network-Engineer-Album02/07_QoS');
const hash=p=>new Promise((resolve,reject)=>{const h=crypto.createHash('sha256'),s=fs.createReadStream(p);s.on('data',b=>h.update(b));s.on('error',reject);s.on('end',()=>resolve(h.digest('hex')));});
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),wav=path.join(source,SOURCE_WAV),transcriptFile=path.join(source,'07_QoS_Transkript.json');
const transcript=JSON.parse(fs.readFileSync(transcriptFile,'utf8'));
// Album 02 has no final release prompt yet. With a *_1.0.txt its RELEASE AUDIO decides; until then the
// transcript's source_audio names the current candidate, which the analysis was made from.
const final=fs.readdirSync(source).find(f=>/_1\.0\.txt$/.test(f));
const prompt=path.join(source,final||'07_QoS_1.0.txt');let status;
if(final){const selected=fs.readFileSync(prompt,'utf8').match(/^RELEASE AUDIO:\s*(.+)$/m)?.[1].trim();if(selected!==SOURCE_WAV)throw Error(`Release-Auswahl ${selected} passt nicht zu ${SOURCE_WAV}: Analyse und Stück neu ausrichten`);status='final';}
else{if(transcript.source_audio!==SOURCE_WAV||transcript.source_audio_sha256!==SOURCE_SHA256)throw Error('Transkript nennt einen anderen Audio-Kandidaten');status='kandidat';}
if(analysis.source.sha256!==SOURCE_SHA256||Math.abs(analysis.summary.duration_s-DURATION)>1e-3||analysis.summary.samples_per_channel!==SAMPLES)throw Error('Analysequelle oder Dauer passt nicht');
if(await hash(wav)!==SOURCE_SHA256)throw Error('WAV-Prüfsumme passt nicht zur Analyse');
if(await hash(transcriptFile)!==analysis.source.transcript_sha256)throw Error('Transkript wurde seit der Analyse geändert');
const audio=path.join(root,'assets/audio/qos.wav');fs.mkdirSync(path.dirname(audio),{recursive:true});if(!fs.existsSync(audio)||await hash(audio)!==SOURCE_SHA256)fs.copyFileSync(wav,audio);
const fonts=[];for(const name of['Michroma-Regular.ttf','SpaceGrotesk.ttf','JetBrainsMono.ttf'])fonts.push({filename:name,sha256:await hash(path.join(root,'assets/fonts',name))});
const cover=fs.readdirSync(source).find(f=>/cover\.png$/i.test(f));
fs.writeFileSync(path.join(root,'assets/manifest.json'),JSON.stringify({schema:'kisound.qos.assets.v1',release_status:status,source:wav,sha256:SOURCE_SHA256,transcript:transcriptFile,transcript_sha256:analysis.source.transcript_sha256,analysis_sha256:await hash(path.join(root,'ASTRA-AUDIO-ANALYSE.json')),duration_s:DURATION,samples_per_channel:SAMPLES,sample_rate_hz:48000,channels:2,bit_depth:16,project_prompt:prompt,project_prompt_sha256:await hash(prompt),cover:cover?path.join(source,cover):null,cover_sha256:cover?await hash(path.join(source,cover)):null,fonts,geometry:'Prozedurale Three.js-Geometrie; keine externen Modelle'},null,2)+'\n');
console.log(`WAV und Transkript geprüft (${status==='final'?'finale Release-Auswahl':'aktueller Audio-Kandidat, noch keine Release-Auswahl'}). QoS: ${DURATION.toFixed(9)} s.`);
