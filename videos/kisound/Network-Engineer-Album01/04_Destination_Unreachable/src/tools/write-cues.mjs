// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,GAP} from '../render/config.js';
import {FLIGHTS,EVIDENCE,TRACES,traceLines,GROW,SHIFT,NODES} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,target:s.target,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
const evidence=EVIDENCE.map(e=>({time_s:+e.t.toFixed(3),type:e.type,from:NODES[e.from].ip,label:e.label}));
const lost=FLIGHTS.filter(f=>f.fate==='null').map(f=>({time_s:+f.t1.toFixed(3),id:f.id,to:NODES[f.dst].ip,kind:f.kind}));
const traces=TRACES.map(id=>({id,lines:traceLines(id,DURATION)}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.unreachable.cues.v1',duration_s:DURATION,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,gap_s:GAP,grow_s:GROW,shift_s:SHIFT,chapters:CHAPTERS,shots,evidence,lost,traces},null,1)+'\n');
const md=[`# Destination Unreachable — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV.`,
 `${shots.length} Einstellungen, ${CHAPTERS.length} Kapitel, ${FLIGHTS.length} Paketflüge, ${evidence.length} empfangene ICMP-/Reply-Meldungen, ${lost.length} Pakete in Null0 verschwunden. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Bass-Einsätze: ${DROPS.map(d=>d.toFixed(2).replace('.',',')).join(' · ')} s. Pegellücke vor dem ersten Drop ${GAP.map(v=>String(v).replace('.',',')).join('–')} s. RTBH /32 → /24 bei ${String(GROW).replace('.',',')} s, Metrikwechsel bei ${String(SHIFT).replace('.',',')} s. Schlussblende ab ${String(FADE_START).replace('.',',')} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.mode} | ${s.target??'–'} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## Traceroutes`,``,...traces.flatMap(t=>[`**${t.id}**`,'```',...t.lines,'```','']),
 `## Empfangene Meldungen`,``,`| Zeit | Typ | von | Meldung |`,`| --- | --- | --- | --- |`,...evidence.map(e=>`| ${tc(e.time_s)} | ${e.type} | ${e.from} | ${e.label} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${evidence.length} Meldungen, ${lost.length} verschwundene Pakete geschrieben.`);
