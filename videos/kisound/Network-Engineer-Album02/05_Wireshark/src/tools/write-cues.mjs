// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,GAPS,AMBIENT_DIM} from '../render/config.js';
import {FLIGHTS,QUEUE_DROPS,BLOCKS,LOGS,BEFORE_ROWS,AFTER_ROWS,IP_FILTER,STREAM_FILTER,FINDING,BULK_LIMIT,NEW_TEST,HTTP_OK,CAP_STOP} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`,de=v=>String(v).replace('.',',');
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,target:s.target,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
const milestones={ip_filter_s:IP_FILTER,stream_filter_s:STREAM_FILTER,finding_s:FINDING,bulk_limit_s:BULK_LIMIT,new_test_s:NEW_TEST,http_ok_s:HTTP_OK,capture_stop_s:CAP_STOP};
const named=FLIGHTS.filter(f=>f.name).map(f=>({id:f.id,name:f.name,kind:f.kind,start_s:+f.t0.toFixed(3),end_s:+f.t1.toFixed(3),fate:f.fate,replay:!!f.replay}));
const blocks=Object.entries(BLOCKS).map(([id,b])=>({id,title:b.title,window_s:b.win,lines:b.lines.map(([t,text,kind])=>({reveal_s:t,text,kind:kind||null}))}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.wireshark.cues.v1',duration_s:DURATION,ambient_dim_s:AMBIENT_DIM,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,gaps_s:GAPS,milestones,queue_drops_s:QUEUE_DROPS.map(x=>+x.toFixed(3)),chapters:CHAPTERS,shots,named_flights:named,before_rows:BEFORE_ROWS,after_rows:AFTER_ROWS,blocks,logs:LOGS},null,1)+'\n');
const row=r=>`| ${r.no} | ${r.time} | ${r.src} | ${r.dst} | ${r.proto} | ${r.info.replace(/\|/g,'\\|')} |`;
const md=[`# Wireshark — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV \`05_Wireshark_1.0.wav\`.`,``,
 `${shots.length} Einstellungen (Schnittliste des Drehbuchs), ${CHAPTERS.length} Kapitel, ${FLIGHTS.length} Paketflüge (Originale, Mirror-Kopien, Bulk, Vergleich), ${QUEUE_DROPS.length} Output-Drops im Messfenster. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Ablauf: IP-Filter ${de(IP_FILTER)} s · tcp.stream == 7 ${de(STREAM_FILTER)} s · Befund ${de(FINDING)} s · Bulk 95 → 20 Mbit/s ${de(BULK_LIMIT)} s · neuer Test ${de(NEW_TEST)} s · HTTP 200 ${de(HTTP_OK)} s · Capture STOPPED ${de(CAP_STOP)} s.`,
 `Bass-Einsätze ${DROPS.map(de).join(' · ')} s. Pegellücken ${GAPS.map(g=>g.map(de).join('–')).join(', ')} s. Umfeld abgedunkelt ab ${de(AMBIENT_DIM)} s, Blende nach «Warum» ab ${de(FADE_START)} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.mode} | ${s.target??'–'} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## Simulierte PCAP-Zeilen`,``,`**BEFORE (SW-A, Stream 7)**`,``,`| No. | Time | Source | Destination | Protocol | Info |`,`| --- | --- | --- | --- | --- | --- |`,...BEFORE_ROWS.map(row),``,`**AFTER (SW-B, Stream 3)**`,``,`| No. | Time | Source | Destination | Protocol | Info |`,`| --- | --- | --- | --- | --- | --- |`,...AFTER_ROWS.map(row),``,
 `## Benannte Pakete`,``,`| ID | Name | Art | Start | Ende | Ausgang |`,`| --- | --- | --- | --- | --- | --- |`,...named.map(f=>`| ${f.id} | ${f.name} | ${f.kind}${f.replay?' (Wiedergabe)':''} | ${tc(f.start_s)} | ${tc(f.end_s)} | ${f.fate} |`),``,
 `## Bildschirmtexte`,``,...blocks.flatMap(b=>[`**${b.id} · ${b.title}** (${b.window_s.map(de).join('–')} s)`,'```',...b.lines.map(l=>`[${l.reveal_s.toFixed(2).padStart(6)}] ${l.text}`),'```','']),
 `## Log`,``,`| Zeit | Tag | Meldung |`,`| --- | --- | --- |`,...LOGS.map(l=>`| ${tc(l.time_s)} | ${l.tag} | ${l.message.replace(/\|/g,'\\|')} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${named.length} benannte Pakete geschrieben.`);
