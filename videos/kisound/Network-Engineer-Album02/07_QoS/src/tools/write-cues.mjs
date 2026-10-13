// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,GAPS} from '../render/config.js';
import {PACKETS,NAMED,REPLAY,BLOCKS,LOGS,T,tailDrops,policerDrops} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`,de=v=>String(v).replace('.',',');
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
const r3=v=>v==null?null:+v.toFixed(3),pk=[...Object.entries(NAMED).map(([name,p])=>({name,id:p.id,cls:p.cls,enter_s:r3(p.tIn),policer_s:r3(p.tPol),queue_s:r3(p.tQ),depart_s:r3(p.tDep),receive_s:r3(p.tRx),fate:p.fate})),{name:REPLAY.name,id:'replay',cls:'tcp',enter_s:REPLAY.keys[0][0],policer_s:null,queue_s:REPLAY.tDrop,depart_s:null,receive_s:null,fate:'taildrop (gespeichertes Fenster)'}].sort((a,b)=>a.enter_s-b.enter_s);
const sim={carriers:PACKETS.length,rtp:PACKETS.filter(p=>p.cls==='rtp').length,tcp:PACKETS.filter(p=>p.cls==='tcp').length,policer_drops:policerDrops(DURATION),tail_drops_live:tailDrops(DURATION)};
const blocks=Object.entries(BLOCKS).map(([id,b])=>({id,title:b.title,window_s:b.win,lines:b.lines.map(([t,text,kind])=>({reveal_s:t,text,kind:kind||null}))}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.qos.cues.v1',duration_s:DURATION,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,gaps_s:GAPS,milestones:T,chapters:CHAPTERS,shots,named_carriers:pk,simulation:sim,blocks,logs:LOGS},null,1)+'\n');
const md=[`# QoS — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV \`07_QoS_1.0.wav\`.`,``,
 `${shots.length} Einstellungen (Schnittliste des Drehbuchs), ${CHAPTERS.length} Kapitel, ${pk.length} benannte Träger (Simulation: ${sim.carriers} Träger, ${sim.policer_drops} Policer-Drops, ${sim.tail_drops_live} Live-Tail-Drops). Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Bass-Einsätze ${DROPS.map(de).join(' · ')} s. Pegellücken ${GAPS.map(g=>g.map(de).join('–')).join(', ')} s. Blende ab ${de(FADE_START)} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Benannte Träger`,``,`| Name | Klasse | Eingang | Policer | Queue | Ausgabe | Empfang | Ausgang |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,...pk.map(p=>`| ${p.name} | ${p.cls} | ${tc(p.enter_s)} | ${p.policer_s==null?'–':tc(p.policer_s)} | ${p.queue_s==null?'–':tc(p.queue_s)} | ${p.depart_s==null?'–':tc(p.depart_s)} | ${p.receive_s==null?'–':tc(p.receive_s)} | ${p.fate} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Station | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- |`,...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## Bildschirmtexte`,``,...blocks.flatMap(b=>[`**${b.id} · ${b.title}** (${b.window_s.map(de).join('–')} s)`,'```',...b.lines.map(l=>`[${l.reveal_s.toFixed(2).padStart(6)}] ${l.text}`),'```','']),
 `## Log`,``,`| Zeit | Tag | Meldung |`,`| --- | --- | --- |`,...LOGS.map(l=>`| ${tc(l.time_s)} | ${l.tag} | ${l.message} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${pk.length} benannte Träger geschrieben.`);
