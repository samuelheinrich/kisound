// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,GAP,BREAKDOWNS} from '../render/config.js';
import {FLIGHTS,SESSIONS,RULES,BLOCK_T,HOSTS} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;
const sessions=SESSIONS.map(s=>({id:s.id,proto:s.proto,app:s.app,inside:s.orig,nat:s.nat,destination:s.to,rule:s.rule,opened_s:+s.events[0][0].toFixed(3),closed_s:s.closed<DURATION?+s.closed.toFixed(3):null,states:s.events.map(([t,v])=>[+t.toFixed(3),v])}));
const drops=FLIGHTS.filter(f=>f.fate==='drop').map(f=>({time_s:+f.t1.toFixed(3),id:f.id,from:HOSTS[f.from].ip,reason:f.dropReason,label:f.label}));
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,target:s.target,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.firewall.cues.v1',duration_s:DURATION,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,breakdowns_s:BREAKDOWNS,gap_s:GAP,chapters:CHAPTERS,shots,rules:RULES,blocklist_s:BLOCK_T,sessions,drops},null,1)+'\n');
const md=[`# Firewall State Table — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV.`,
 `${shots.length} Einstellungen, ${CHAPTERS.length} Kapitel, ${SESSIONS.length} Sessions, ${FLIGHTS.length} Paketflüge, ${drops.length} verworfene Pakete. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Bass-Einsätze: ${DROPS.map(d=>d.toFixed(2).replace('.',',')).join(' · ')} s. Pegellücke ${GAP.map(v=>String(v).replace('.',',')).join('–')} s. Blocklist-Regel ab ${String(BLOCK_T).replace('.',',')} s. Schlussblende ab ${String(FADE_START).replace('.',',')} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.mode} | ${s.target??'–'} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## Sessions`,``,`| ID | Proto | Inside | NAT | Ziel | Regel | offen | zu |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,...sessions.map(s=>`| ${s.id} | ${s.proto} | ${s.inside} | ${s.nat??'–'} | ${s.destination} | ${s.rule} | ${tc(s.opened_s)} | ${s.closed_s!=null?tc(s.closed_s):'–'} |`),``,
 `## Verworfene Pakete`,``,`| Zeit | Paket | Grund |`,`| --- | --- | --- |`,...drops.map(d=>`| ${tc(d.time_s)} | ${d.label} | ${d.reason} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${sessions.length} Sessions, ${drops.length} Drops geschrieben.`);
