// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,BEAT_CUT} from '../render/config.js';
import {BROADCASTS,COPIES,BLOCKS,LOGS,RING_CLOSED,B001_T,MGMT_LOST,SHUT_CMD,PORT_DOWN,MGMT_BACK,TEST_OK,passes,macFlaps} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`,de=v=>String(v).replace('.',',');
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,target:s.target,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
const milestones={ring_closed_s:RING_CLOSED,b001_s:B001_T,management_lost_s:MGMT_LOST,shutdown_cmd_s:SHUT_CMD,port_down_s:PORT_DOWN,management_back_s:MGMT_BACK,test_ok_s:TEST_OK};
const b001=COPIES.filter(c=>c.b.id==='B-001').map(c=>({id:c.id,fork_s:+c.fork.toFixed(3),end_s:+c.end.t.toFixed(3),passes:passes(c,0,70).slice(0,12).map(p=>`${p.sw}@${p.t.toFixed(2)}`)}));
const blocks=Object.entries(BLOCKS).map(([id,b])=>({id,title:b.title,window_s:b.win,lines:b.lines.map(([t,text,kind])=>({reveal_s:t,text,kind:kind||null}))}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.broadcaststorm.cues.v1',duration_s:DURATION,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,beat_cut_s:BEAT_CUT,milestones,broadcasts:BROADCASTS.length,ring_copies:COPIES.length,mac_flaps:macFlaps(DURATION),b001,chapters:CHAPTERS,shots,blocks,logs:LOGS},null,1)+'\n');
const md=[`# Broadcast Storm — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV \`04_Broadcast_Storm_1.0.wav\`.`,``,
 `${shots.length} Einstellungen (Schnittliste des Drehbuchs), ${CHAPTERS.length} Kapitel, ${BROADCASTS.length} Broadcasts → ${COPIES.length} Ringkopien, ${macFlaps(DURATION)} MAC-Flaps auf SW3. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Ablauf: Ring geschlossen ${de(RING_CLOSED)} s · B-001 ${de(B001_T)} s · Management weg ${de(MGMT_LOST)} s · shutdown ab ${de(SHUT_CMD)} s · Gi1/0/24 down ${de(PORT_DOWN)} s · Management zurück ${de(MGMT_BACK)} s · Unicast-Test ok ${de(TEST_OK)} s.`,
 `Bass-Einsätze ${DROPS.map(de).join(' · ')} s. Beat-Bruch nach «Zieh das Kabel» ${de(BEAT_CUT)} s. Schlussblende ab ${de(FADE_START)} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.mode} | ${s.target??'–'} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## B-001 und seine zwei Ringkopien`,``,...b001.map(c=>`- **${c.id}**: Gabelung ${de(c.fork_s)} s, Ende ${de(c.end_s)} s; Durchläufe ${c.passes.join(' · ')} …`),``,
 `## Bildschirmtexte`,``,...blocks.flatMap(b=>[`**${b.id} · ${b.title}** (${b.window_s.map(de).join('–')} s)`,'```',...b.lines.map(l=>`[${l.reveal_s.toFixed(2).padStart(6)}] ${l.text}`),'```','']),
 `## Log`,``,`| Zeit | Tag | Meldung |`,`| --- | --- | --- |`,...LOGS.map(l=>`| ${tc(l.time_s)} | ${l.tag} | ${l.message.replace(/\|/g,'\\|')} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${BROADCASTS.length} Broadcasts, ${COPIES.length} Ringkopien geschrieben.`);
