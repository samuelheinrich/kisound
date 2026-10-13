// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline,normalizeAnalysis} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,GAP} from '../render/config.js';
import {FLIGHTS,S_FLIGHTS,FIX,LEARN,FILE_DONE,FILE_BYTES,FILE_SEGMENTS,PATH_MTU,resolveTarget} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const raw=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),analysis=normalizeAnalysis(raw),tl=new Timeline(raw);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;
const network=[
 ...FLIGHTS.filter(f=>f.fate==='drop').map(f=>({time_s:f.t1,action:`R2 verwirft ${f.id}: ${f.size} B mit DF an Tunnel-MTU 1400`})),
 ...FLIGHTS.filter(f=>f.kind==='icmp').map(f=>({time_s:f.keys[1][0],action:`${f.id} (ICMP 3/4, mtu 1400) an der Firewall ${f.fate==='block'?'verworfen':'durchgelassen'}`})),
 {time_s:FIX,action:'Firewall: icmp destination-unreachable / frag-needed wird akzeptiert'},{time_s:LEARN,action:`Host A lernt Path MTU ${PATH_MTU}`},
 {time_s:S_FLIGHTS[0].t0,action:`Neusendung in ${PATH_MTU}-Byte-Paketen beginnt (${FILE_SEGMENTS} Segmente, ${FILE_BYTES} B)`},{time_s:FILE_DONE,action:'report.pdf vollständig angekommen'},
].sort((a,b)=>a.time_s-b.time_s).map(r=>({...r,time_s:+r.time_s.toFixed(3),origin:'redaktionell (Netzszenario)'}));
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,target:s.target?resolveTarget(s):null,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.mtu.cues.v1',duration_s:DURATION,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,gap_s:GAP,chapters:CHAPTERS,shots,network},null,1)+'\n');
const md=[`# MTU — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV.`,
 `${shots.length} Einstellungen, ${CHAPTERS.length} Kapitel, ${FLIGHTS.length} Paketflüge. ${shots.filter(s=>['chase','ride','flyby','tunnel'].includes(s.camera)).length} POV-Fahrten. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Zeilen sind genau einer Einstellung zugeordnet.`,``,
 `Strukturelle Einsätze: ${DROPS.map(d=>d.toFixed(2).replace('.',',')).join(' · ')} s. Pegellücke (erster stiller Drop) ${GAP.map(v=>String(v).replace('.',',')).join('–')} s. Schlussblende ab ${String(FADE_START).replace('.',',')} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.mode} | ${s.target??'–'} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## Netzereignisse`,``,`| Zeit | Aktion |`,`| --- | --- |`,...network.map(n=>`| ${tc(n.time_s)} | ${n.action} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${network.length} Netzereignisse geschrieben.`);
