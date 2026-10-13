// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,GAPS} from '../render/config.js';
import {FLIGHTS,HEARTBEATS,SYNCS,BLOCKS,LOGS,HA_DOWN,B_PRIMARY,LAN_SHUT,WAN_SHUT,HA_UP,ELECTED,IN_SYNC,RELEASE} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`,de=v=>String(v).replace('.',',');
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,target:s.target,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
const milestones={ha_down_s:HA_DOWN,b_primary_s:B_PRIMARY,lan_shut_a_s:LAN_SHUT,wan_shut_a_s:WAN_SHUT,ha_up_s:HA_UP,elected_s:ELECTED,in_sync_s:IN_SYNC,release_a_s:RELEASE};
const drops=FLIGHTS.filter(f=>f.fate==='drop').map(f=>({id:f.id,time_s:+f.t1.toFixed(3),at:f.unit,reason:f.reason}));
const syncs=SYNCS.map(y=>({id:y.id,from:y.from,to:y.to,start_s:+y.t0.toFixed(3),end_s:+y.t1.toFixed(3),seq:y.seq,resync:!!y.resync}));
const blocks=Object.entries(BLOCKS).map(([id,b])=>({id,title:b.title,window_s:b.win,pages_s:b.pages??null,lines:b.lines.map(([t,text,kind,pane])=>({reveal_s:t,text,kind:kind||null,pane}))}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.activestandby.cues.v1',duration_s:DURATION,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,gaps_s:GAPS,milestones,heartbeats:HEARTBEATS.length,chapters:CHAPTERS,shots,syncs,broken_sessions:drops,blocks,logs:LOGS},null,1)+'\n');
const md=[`# Active / Standby — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV \`02_Active_Standby_1.0.wav\`.`,``,
 `${shots.length} Einstellungen (Schnittliste des Drehbuchs), ${CHAPTERS.length} Kapitel, ${FLIGHTS.length} Paketflüge, ${HEARTBEATS.length} Heartbeats, ${SYNCS.length} Zustandskopien, ${drops.length} im Split Brain unterbrochene Sessions. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Ablauf: ha1 down ${de(HA_DOWN)} s · B Primary ${de(B_PRIMARY)} s · A port1 aus ${de(LAN_SHUT)} s · A port2 aus ${de(WAN_SHUT)} s · ha1 up ${de(HA_UP)} s · Wahl B ${de(ELECTED)} s · in-sync ${de(IN_SYNC)} s · A-Links frei ${de(RELEASE)} s.`,
 `Bass-Einsätze ${DROPS.map(de).join(' · ')} s. Pegellücken ${GAPS.map(g=>g.map(de).join('–')).join(' und ')} s. Schlussblende ab ${de(FADE_START)} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.mode} | ${s.target??'–'} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## Zustandskopien S-17`,``,`| ID | Richtung | Start | Ankunft | seq |`,`| --- | --- | --- | --- | --- |`,...syncs.map(y=>`| ${y.id} | ${y.from}→${y.to}${y.resync?' (Resync)':''} | ${tc(y.start_s)} | ${tc(y.end_s)} | ${y.seq} |`),``,
 `## Bildschirmtexte`,``,...blocks.flatMap(b=>[`**${b.id} · ${b.title}** (${b.window_s.map(de).join('–')} s)`,'```',...b.lines.map(l=>`[${l.reveal_s.toFixed(2).padStart(6)}] ${(l.pane+'   ').slice(0,3)} ${l.text}`),'```','']),
 `## Log`,``,`| Zeit | Tag | Meldung |`,`| --- | --- | --- |`,...LOGS.map(l=>`| ${tc(l.time_s)} | ${l.tag} | ${l.message.replace(/\|/g,'\\|')} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${syncs.length} Zustandskopien, ${drops.length} unterbrochene Sessions geschrieben.`);
