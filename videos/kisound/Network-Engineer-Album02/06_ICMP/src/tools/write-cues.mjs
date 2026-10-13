// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,GAPS,LIGHT_DIM} from '../render/config.js';
import {FLIGHTS,BLOCKS,LOGS,T} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`,de=v=>String(v).replace('.',',');
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
const pk=FLIGHTS.map(f=>({id:f.id,kind:f.kind,header:f.hdr,src:f.src,dst:f.dst,type:f.type??null,code:f.code??null,quote:f.quote??null,start_s:+f.t0.toFixed(3),end_s:+f.t1.toFixed(3),fate:f.fate,path:f.nodes.join('→')}));
const blocks=Object.entries(BLOCKS).map(([id,b])=>({id,title:b.title,window_s:b.win,lines:b.lines.map(([t,text,kind])=>({reveal_s:t,text,kind:kind||null}))}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.icmp.cues.v1',duration_s:DURATION,light_dim_s:LIGHT_DIM,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,gaps_s:GAPS,milestones:T,chapters:CHAPTERS,shots,packets:pk,blocks,logs:LOGS},null,1)+'\n');
const md=[`# ICMP — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV \`06_ICMP_1.0.wav\`.`,``,
 `${shots.length} Einstellungen (Schnittliste des Drehbuchs), ${CHAPTERS.length} Kapitel, ${pk.length} Pakete. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Bass-Einsätze ${DROPS.map(de).join(' · ')} s. Pegellücken ${GAPS.map(g=>g.map(de).join('–')).join(', ')} s. Licht dimmt ab ${de(LIGHT_DIM)} s, hartes Ende.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Pakete`,``,`| ID | Art | Header | Quelle → Ziel | Start | Ende | Ausgang | Zitat |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,...pk.map(p=>`| ${p.id} | ${p.kind} | ${p.header} | ${p.src} → ${p.dst} | ${tc(p.start_s)} | ${tc(p.end_s)} | ${p.fate} | ${p.quote??'–'} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Station | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- |`,...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## Bildschirmtexte`,``,...blocks.flatMap(b=>[`**${b.id} · ${b.title}** (${b.window_s.map(de).join('–')} s)`,'```',...b.lines.map(l=>`[${l.reveal_s.toFixed(2).padStart(6)}] ${l.text}`),'```','']),
 `## Log`,``,`| Zeit | Tag | Meldung |`,`| --- | --- | --- |`,...LOGS.map(l=>`| ${tc(l.time_s)} | ${l.tag} | ${l.message} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${pk.length} Pakete geschrieben.`);
