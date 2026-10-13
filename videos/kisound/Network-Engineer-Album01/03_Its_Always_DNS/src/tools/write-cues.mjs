// Writes UMSETZUNG-CUES.md/.json from the code, so the cue sheet can never drift from the film.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {Timeline} from '../render/timeline.js';
import {CHAPTERS,DURATION,DROPS,FADE_START,TITLES,SILENCE,BLACKOUT} from '../render/config.js';
import {TRANSACTIONS,RESOLVER_CACHE,TICKETS,FLUSH1,FIX1,FLUSH2,FIX2} from '../render/model.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const analysis=JSON.parse(fs.readFileSync(path.join(root,'ASTRA-AUDIO-ANALYSE.json'))),tl=new Timeline(analysis);
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;
const RESULT={answer:'Antwort',nxdomain:'NXDOMAIN',timeout:'Timeout',cname:'CNAME',referral:'Referral',icmp:'ICMP',query:'Anfrage'};
const transactions=Object.values(TRANSACTIONS).sort((a,b)=>a.t0-b.t0).map(x=>({id:x.id,start_s:+x.t0.toFixed(3),end_s:+x.t1.toFixed(3),name:x.name,path:[x.msgs[0].from,...x.msgs.map(m=>m.to)].filter((n,i,a)=>a.indexOf(n)===i).join(' → '),result:RESULT[x.msgs.at(-1).kind]??x.msgs.at(-1).kind}));
const network=[
 ...TICKETS.map(k=>({time_s:k.opened,action:`Ticket #${k.id} geöffnet: ${k.text} (${k.name})`})),
 ...TICKETS.filter(k=>k.closed<DURATION).map(k=>({time_s:k.closed,action:`Ticket #${k.id} geschlossen`})),
 {time_s:FLUSH1,action:'rndc flushname app — Negativ-Cache gelöscht (hilft allein nicht)'},{time_s:FIX1,action:'Interne View: app A 203.0.113.42 ergänzt, Serial erhöht'},
 {time_s:SILENCE[0],action:'Resolver nicht erreichbar — Timeout (≠ NXDOMAIN)'},{time_s:SILENCE[1],action:'Resolver wieder erreichbar'},
 {time_s:FLUSH2,action:'rndc flushtree intranet'},{time_s:FIX2,action:'Interne View: lb A ergänzt — CNAME-Kette löst auf'},
].sort((a,b)=>a.time_s-b.time_s).map(r=>({...r,time_s:+r.time_s.toFixed(3),origin:'redaktionell (DNS-Szenario)'}));
const shots=tl.shots.map(s=>({id:s.id,start_s:s.start,end_s:s.end,zone:s.zone,camera:s.camera,mode:s.mode,target:s.target,event_ids:s.eventIds,lyric_ids:s.lyricIds}));
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.json'),JSON.stringify({schema:'kisound.dns.cues.v1',duration_s:DURATION,fade_start_s:FADE_START,titles:TITLES,drops_s:DROPS,silence_s:SILENCE,blackout_s:BLACKOUT,chapters:CHAPTERS,shots,transactions,network,cache_entries:RESOLVER_CACHE.length},null,1)+'\n');
const md=[`# It’s Always DNS — Schnitt- und Cue-Zuordnung`,``,`Automatisch erzeugt aus \`src/render/config.js\` und \`src/render/model.js\` (\`npm run cues\`). Zeiten beziehen sich auf die Original-WAV.`,
 `${shots.length} Einstellungen, ${CHAPTERS.length} Kapitel, ${transactions.length} DNS-Transaktionen, ${RESOLVER_CACHE.length} Cache-Einträge. ${shots.filter(s=>['chase','ride','flyby'].includes(s.camera)).length} POV-Fahrten mit einem Paket. Alle ${analysis.events.length} Analyse-Events und ${analysis.lyrics.segments.length} Lyric-Segmente sind genau einer Einstellung zugeordnet.`,``,
 `Drops: ${DROPS.map(d=>d.toFixed(2).replace('.',',')).join(' · ')} s. Blackout ${BLACKOUT.map(v=>String(v).replace('.',',')).join('–')} s, digitale Stille (Timeout) ${SILENCE.map(v=>String(v).replace('.',',')).join('–')} s. Harter Schluss, Blende erst ab ${String(FADE_START).replace('.',',')} s.`,``,
 `## Kapitel`,``,`| ID | Start | Titel | Handlung |`,`| --- | --- | --- | --- |`,...CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${c.title} | ${c.action} |`),``,
 `## Einstellungen`,``,`| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |`,`| --- | --- | --- | --- | --- | --- | --- | --- |`,
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)} | ${tc(s.end_s)} | ${s.zone} / ${s.camera} | ${s.mode} | ${s.target??'–'} | ${s.event_ids.join(', ')||'–'} | ${s.lyric_ids.join(', ')||'–'} |`),``,
 `## DNS-Transaktionen`,``,`| ID | Start | Name | Weg | Ergebnis |`,`| --- | --- | --- | --- | --- |`,...transactions.map(x=>`| ${x.id} | ${tc(x.start_s)} | ${x.name} | ${x.path} | ${x.result} |`),``,
 `## Fallereignisse`,``,`| Zeit | Aktion |`,`| --- | --- |`,...network.map(n=>`| ${tc(n.time_s)} | ${n.action} |`),``];
fs.writeFileSync(path.join(root,'UMSETZUNG-CUES.md'),md.join('\n'));console.log(`${shots.length} Einstellungen, ${transactions.length} Transaktionen, ${network.length} Fallereignisse geschrieben.`);
