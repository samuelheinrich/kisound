// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,GAPS} from '../render/config.js';
import {FLIGHTS,FIX,RETEST,OK_A,VERIFY,BLOCKS,LOGS,counter} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`,de=v=>String(v).replace('.',',');
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,target:s.target,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
const key=FLIGHTS.filter(f=>f.kind!=='ambient').map(f=>({id:f.id,name:f.name??null,kind:f.kind,test:f.test??null,start_s:+f.t0.toFixed(3),end_s:+f.t1.toFixed(3),fate:f.fate,path:f.nodes.join('→'),header:`${f.proto??''} ${f.flags??''} ${f.src??''} → ${f.dstAddr??''}`.trim()}));
const blocks=Object.entries(BLOCKS).map(([id,b])=>({id,title:b.title,window_s:b.win,pages_s:b.pages??null,lines:b.lines.map(([t,text,kind])=>({reveal_s:t,text,kind:kind||null}))}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.oncall.cues.v1',duration_s:DURATION,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,gaps_s:GAPS,fix_s:FIX,retest_s:RETEST,test_a_ok_s:OK_A,verify_s:VERIFY,counter:{before:counter(80),after:counter(DURATION)},chapters:CHAPTERS,shots,flights:key,blocks,logs:LOGS},null,1)+'\n');
const md=[`# On Call — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV (aktueller Kandidat \`01_On_Call_0.2.wav\`).`,``,
 `${shots.length} Einstellungen (Schnittliste des Drehbuchs), ${CHAPTERS.length} Kapitel, ${FLIGHTS.length} Paketflüge (davon ${key.length} benannte Test-/Diagnosepakete). Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Bass-Einsätze ${DROPS.map(de).join(' · ')} s. Pegellücken ${GAPS.map(g=>g.map(de).join('–')).join(' und ')} s. Eingriff (Binding entfernt) ${de(FIX)} s, derselbe Test ab ${de(RETEST)} s, HTTP 200 bei ${de(OK_A)} s, APP-B/APP-C/CTRL-D bei ${['B','C','D'].map(k=>de(VERIFY[k])).join(' / ')} s. Counter QUARANTINE Regel 10: ${counter(80)} → ${counter(DURATION)}. Schlussblende ab ${de(FADE_START)} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.mode} | ${s.target??'–'} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## Test- und Diagnosepakete`,``,`| ID | Name | Art | Start | Ende | Ausgang | Header |`,`| --- | --- | --- | --- | --- | --- | --- |`,...key.map(f=>`| ${f.id} | ${f.name??'–'} | ${f.kind} | ${tc(f.start_s)} | ${tc(f.end_s)} | ${f.fate} | ${f.header} |`),``,
 `## Bildschirmtexte`,``,...blocks.flatMap(b=>[`**${b.id} · ${b.title}** (${b.window_s.map(de).join('–')} s${b.pages_s?`, Seiten ab ${b.pages_s.map(de).join(' / ')} s`:''})`,'```',...b.lines.map(l=>`[${l.reveal_s.toFixed(2).padStart(6)}] ${l.text}`),'```','']),
 `## Router-Log`,``,`| Zeit | Tag | Meldung |`,`| --- | --- | --- |`,...LOGS.map(l=>`| ${tc(l.time_s)} | ${l.tag} | ${l.message.replace(/\|/g,'\\|')} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${key.length} benannte Pakete, ${blocks.length} Bildschirmblöcke geschrieben.`);
