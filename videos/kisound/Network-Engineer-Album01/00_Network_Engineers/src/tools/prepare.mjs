import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {SETS,SOURCE_WAV,SOURCE_SHA256,DURATION} from '../render/config.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const repo=path.resolve(root,'../../../..');
const source=process.env.NETWORK_ENGINEERS_SOURCE || path.join(repo,'music/kisound/Network-Engineer-Album01/00_Network_Engineers');
const hash=p=>new Promise((resolve,reject)=>{const h=crypto.createHash('sha256'),s=fs.createReadStream(p);s.on('data',b=>h.update(b));s.on('error',reject);s.on('end',()=>resolve(h.digest('hex')));});
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json')));
const wav=path.join(source,SOURCE_WAV), transcript=path.join(source,'00_Network_Engineers_Transkript.json');
if(await hash(wav)!==SOURCE_SHA256)throw new Error('WAV-Prüfsumme stimmt nicht mit der freigegebenen Analyse überein');
if(await hash(transcript)!==analysis.source.transcript_sha256)throw new Error('Transkript wurde seit der Analyse geändert; Zuordnung prüfen');
fs.mkdirSync(path.join(root,'assets/audio'),{recursive:true});
fs.copyFileSync(wav,path.join(root,'assets/audio/network-engineers.wav'));
const sets=[];
for(const id of SETS){
 const from=path.resolve(root,'../../assets/sets',id),to=path.join(root,'assets/sets',id);
 const validation=JSON.parse(fs.readFileSync(path.join(from,'validation.json')));
 if(validation.status==='ERROR')throw new Error(`Set nicht validiert: ${id}`);
 fs.mkdirSync(to,{recursive:true});
 for(const name of [id+'.glb',id+'.anchors.json','validation.json'])fs.copyFileSync(path.join(from,name),path.join(to,name));
 sets.push({id,source:from,sha256:await hash(path.join(to,id+'.glb'))});
}
fs.writeFileSync(path.join(root,'assets/manifest.json'),JSON.stringify({source:wav,sha256:SOURCE_SHA256,transcript,transcript_sha256:analysis.source.transcript_sha256,duration_s:DURATION,analysis_sha256:await hash(path.join(root,'ASTRA-AUDIO-ANALYSE.json')),sets},null,2)+'\n');
console.log(`WAV und Transkript geprüft; ${SETS.length} Sets vorbereitet. Dauer ${DURATION.toFixed(9)} s.`);
