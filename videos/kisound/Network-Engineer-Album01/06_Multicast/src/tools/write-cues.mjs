// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,SOURCE_START,T_SPT} from '../render/config.js';
import {SCHEDULE,QUERIES,MESSAGES,REGISTER,REGISTER_STOP,SPT_JOIN,SPT_PRUNE,SEGMENTS,SEATS,SHOT_SEATS} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;
const network=[
 {time_s:SOURCE_START,action:'Quelle sendet an R1 (erste Gesangszeile)'},{time_s:REGISTER[0],action:'R1 → RP: Register'},{time_s:REGISTER_STOP[0],action:'RP → R1: Register-Stop (keine Empfänger)'},
 ...SCHEDULE.map(e=>({time_s:e.t,action:`${e.op==='join'?'Join':'Leave'} ${e.seat.ip} (${SEGMENTS[e.seat.seg].switch}, VLAN ${SEGMENTS[e.seat.seg].vlan})`})),
 ...MESSAGES.filter(m=>m.kind==='join'||m.kind==='prune').map(m=>({time_s:m.t1,action:`${m.from} → ${m.to}: ${m.label}`})),
 ...QUERIES.map(q=>({time_s:q.t,action:q.kind==='group'?`Group-specific Query VLAN ${SEGMENTS[q.seg].vlan}`:'General Query auf allen 8 VLANs'})),
 {time_s:T_SPT,action:'SPT-Switchover R6/R7 (Drop)'},
].sort((a,b)=>a.time_s-b.time_s).map(r=>({...r,time_s:+r.time_s.toFixed(3),origin:'redaktionell (Netzwerkszenario)'}));
const shots=tl.shots.map(s=>{const h=SHOT_SEATS.get(s.id);return{id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,target:s.target,seat:h?{ip:h.ip,tier:h.tier,core:h.core,switch:SEGMENTS[h.seg].switch}:null,event_ids:s.eventIds,lyric_ids:s.lyricIds};});
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.multicast.cues.v1',duration_s:DURATION,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,chapters:CHAPTERS,shots,network,spt:{join_s:SPT_JOIN,prune_s:SPT_PRUNE}},null,1)+'\n');
const md=[`# Multicast — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV.`,`Stadion: ${SEATS.length} Empfänger in ${SEGMENTS.length} Segmenten. ${shots.length} Einstellungen, ${CHAPTERS.length} Kapitel, ${shots.filter(s=>['chase','ride','flyby'].includes(s.camera)).length} POV-Fahrten zu verschiedenen Sitzen. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Drops (100-ms-Zeilen, Sub-Band springt von ~0 auf >0,5): ${DROPS.map(d=>d.toFixed(2).replace('.',',')).join(' · ')} s. Schlussblende ab ${String(FADE_START).replace('.',',')} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.mode} | ${s.seat?`${s.seat.ip} (${s.seat.tier}, ${s.seat.core})`:s.target??'–'} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## Netzwerkereignisse`,``,`| Zeit | Aktion |`,`| --- | --- |`,...network.map(n=>`| ${tc(n.time_s)} | ${n.action} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${network.length} Netzwerkereignisse geschrieben.`);
