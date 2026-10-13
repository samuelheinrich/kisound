import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,DROPS,GAPS,FADE_START} from '../src/render/config.js';
import {T,ADDR,PACKETS,NAMED,REPLAY,BY_ID,QT_CAP,position,replayPosition,queued,tcpAck,policerDrops,tailDrops,rtpReceived,BLOCKS,blockLines,LOGS,KINETIC,WORD_NOTE,VOICE,voiceOf,visible} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),tl=new Timeline(data);
const script=fs.readFileSync(new URL('../_revisions/ASTRA-DREHBUCH-original.md',import.meta.url),'utf8');
const lyric=id=>data.lyrics.segments.find(l=>l.id===id),rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
test('source, exact duration and frame raster',()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.equal(data.summary.samples_per_channel,SAMPLES);assert.equal(FRAMES,Math.ceil(DURATION*FPS));});
test('chapters and shots cover the whole track without gaps',()=>{for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test('the cut list is the shooting script: 57 shots with its start times and stations',()=>{const st=[...script.matchAll(/^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \| (\w+) \|/gm)];assert.equal(st.length,57);assert.equal(SHOTS.length,57);
 const cam={HALLE:'hall',CLASS:'class',QUEUE:'queue',SCHED:'sched',POLICE:'police',TCP:'tcp',ZIEL:'ziel'};st.forEach((m,i)=>{assert.equal(SHOTS[i].id,m[1]);assert.ok(Math.abs(SHOTS[i].start-+m[2])<1e-6,m[1]);assert.equal(SHOTS[i].camera,cam[m[4]],m[1]);});});
test('every event and lyric lands in exactly one shot, as in the script',()=>{const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);
 for(const m of script.matchAll(/^\| (S\d{3}) \|.*\| (L\d{3}) · /gm))assert.ok(tl.shots.find(s=>s.id===m[1]).lyricIds.includes(m[2]),`${m[2]} in ${m[1]}`);});
test('bass, gaps and the fade follow the measurements',()=>{const si=col('sub_20_60_drive'),ri=col('rms_dbfs');for(const d of DROPS){const b=rows.filter(r=>r[0]>d-1.6&&r[0]<d-.3).map(r=>r[si]),a=rows.filter(r=>r[0]>=d-.1&&r[0]<d+.6).map(r=>r[si]);assert.ok(Math.max(...a)>.55&&Math.min(...b)<.2,String(d));}
 for(const[a,b]of GAPS)assert.ok(Math.min(...rows.filter(r=>r[0]>=a&&r[0]<=b).map(r=>r[ri]))<-30,String(a));assert.ok(Math.abs(FADE_START-data.events.find(e=>e.type==='fade_candidate').time_s)<.01);});
test('policer: 1.2 Mbit/s offered, about 1.0 conform; Q-RX is the first excess at 90.62 s and is never buffered',()=>{
 const burst=PACKETS.filter(p=>p.burst),drop=burst.filter(p=>p.fate==='police'),after=burst.filter(p=>p.tPol>=T.polResult);
 assert.ok(Math.abs(burst[0].tPol-T.burst)<.05);assert.ok(burst.every(p=>p.tPol<T.burstEnd));assert.equal(burst.length,72,'7.2 s × 10/s = 1.2 Mbit/s against 0.2');
 const rx=NAMED['Q-RX'];assert.ok(Math.abs(rx.tPol-T.polResult)<1e-6);assert.equal(rx.fate,'police');assert.equal(rx.tQ,undefined);assert.equal(rx.tDep,undefined);
 assert.ok(Math.abs(after.filter(p=>p.conform).length/after.length-5/6)<.05,'after the budget is spent 1.0 of 1.2 conforms');assert.ok(PACKETS.filter(p=>p.fate==='police').every(p=>p.burst),'no drops outside the controlled burst');
 assert.equal(policerDrops(T.polResult-1e-3),0);assert.equal(policerDrops(T.polResult),1);assert.ok(position(rx,T.polResult+.5).phase==='drop');assert.equal(position(rx,T.polResult+1.5),null);
 assert.ok(BLOCKS.B03.lines.filter(l=>/conformed|exceeded/.test(l[1])).every(l=>l[0]>=T.polResult));});
test('scheduler: strict priority for EF, FIFO for bulk, a running frame is never interrupted, one server',()=>{
 const served=PACKETS.filter(p=>p.fate==='deliver').sort((a,b)=>a.tDep-b.tDep);for(let i=1;i<served.length;i++)assert.ok(served[i].tDep>=served[i-1].tEnd-1e-9,'non-preemptive single server');
 for(const p of served.filter(p=>p.cls==='tcp'&&p.tDep>0)){const waitingRtp=served.find(q=>q.cls==='rtp'&&q.tQ<=p.tDep-1e-9&&q.tDep>p.tDep);assert.equal(waitingRtp,undefined,`${p.id}: EF waits behind bulk`);}
 const bulk=served.filter(p=>p.cls==='tcp').sort((a,b)=>a.tQ-b.tQ);for(let i=1;i<bulk.length;i++)assert.ok(bulk[i].tDep>bulk[i-1].tDep,'bulk FIFO');
 assert.equal(tailDrops(DURATION),0,'no live tail drop – only the stored window shows one');for(const t of[20,60,104.14,173.02,200])assert.ok(queued('tcp',t)<=QT_CAP);
 assert.ok(Math.abs(queued('tcp',T.rxResult)-48)<=3,'B04 bulk queue example 48');assert.ok(queued('rtp',T.rxResult)<=2);});
test('TCP: Q-B17 only in the stored window, Q-B18 is a new frame with the same byte range; ACK waits and then rises',()=>{
 assert.equal(BY_ID.get('Q-B17'),undefined,'Q-B17 is not a live carrier');assert.equal(REPLAY.seq,24001);assert.ok(REPLAY.tDrop>=65.38&&REPLAY.tDrop<68.6);assert.equal(replayPosition(REPLAY.tDrop+.5).phase,'drop');
 const b18=NAMED['Q-B18'];assert.equal(b18.seq,24001);assert.equal(b18.len,1200);assert.ok(b18.retrans);assert.notEqual(b18.id,REPLAY.id);assert.ok(b18.tIn>=68.6&&b18.tIn<69);assert.equal(b18.fate,'deliver');
 assert.equal(tcpAck(50),null);assert.equal(tcpAck(b18.tRx-1e-3),24001);assert.equal(tcpAck(b18.tRx),25201);assert.ok(tcpAck(178.44)>tcpAck(173.02)&&tcpAck(173.02)>tcpAck(120));});
test('shaper: Q-BS is accepted by 104.14 s, waits with its identity and leaves exactly once during S029',()=>{
 const bs=NAMED['Q-BS'];assert.ok(bs.tQ<=T.shapeDemo);assert.ok(bs.tDep>=113.68&&bs.tDep<117.12,String(bs.tDep));assert.equal(PACKETS.filter(p=>p.name==='Q-BS').length,1);
 for(const t of[104.14,107,111,113.6])assert.equal(position(bs,t).phase,'queue');assert.equal(position(bs,bs.tDep+.1).phase,'serve');assert.notEqual(bs.fate,'police');});
test('break: Q-RN is classified at 126.1, marked at 127.84, queued at 129.78 and served after that',()=>{
 const rn=NAMED['Q-RN'],at=t=>position(rn,t);assert.ok(Math.abs(at(126.5).pos[0]-(-32))<.01);assert.equal(at(126.5).marked,false);assert.ok(at(128.2).marked);assert.ok(Math.abs(rn.tQ-129.78)<1e-6);assert.ok(rn.tDep>=rn.tQ&&rn.tDep<130.48);
 const rtp=PACKETS.filter(p=>p.cls==='rtp'&&p!==rn);assert.equal(rtp.filter(p=>p.tIn>rn.tIn&&p.tIn<rn.tQ).length,0,'nothing enters behind Q-RN while it is on the ramp');for(let t=rn.tIn;t<rn.tQ;t+=.05)for(const p of rtp.filter(p=>p.tIn<rn.tIn)){const q=position(p,t);if(q?.phase==='ramp')assert.ok(q.pos[0]>at(t).pos[0],`${p.id} overtaken at ${t}`);}});
test('screen texts: results only after their events; ≤6 lines per page and ≥4 s; B04 results from 173.02 s',()=>{
 for(const[id,b]of Object.entries(BLOCKS)){const pages=b.pages?b.pages.map((_,i)=>b.lines.filter(l=>l[3]===i)):[b.lines];for(const p of pages)assert.ok(p.length<=6,id);if(b.pages)b.pages.forEach((p,i)=>assert.ok((b.pages[i+1]??b.win[1])-p>=4,`${id}/${i}`));}
 assert.ok(BLOCKS.B04.lines.filter(l=>l[2]==='ok'||/Q-RX|Q-BS/.test(l[1])).every(l=>l[0]>=173.02));assert.ok(BLOCKS.B04.lines.filter(l=>l[0]<173.02).slice(1,4).every(l=>/^erwartet/.test(l[1])));
 assert.equal(BLOCKS.B02.lines.length,28);assert.ok(BLOCKS.B02.lines.some(l=>l[1]==='  shape average 100000000'));assert.equal(blockLines('B02',41).length,6);});
test('voices, kinetic words, addresses, logs, determinism',()=>{for(const id of Object.keys(KINETIC)){assert.ok(lyric(id),id);assert.ok(WORD_NOTE[id],id);}
 for(const id of['L009','L016','L021','L044'])assert.equal(voiceOf(id),'B');for(const id of['L017','L025','L041'])assert.equal(voiceOf(id),'A');assert.equal(voiceOf('L033'),'AB');assert.ok(Object.keys(VOICE).every(id=>lyric(id)));
 const ok=/^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.)/;const text=[...Object.values(BLOCKS).flatMap(b=>b.lines.map(l=>l[1])),...LOGS.map(l=>l.message),...Object.values(ADDR)].join('\n');for(const ip of text.match(/\b\d+\.\d+\.\d+\.\d+\b/g))assert.match(ip,ok,ip);
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.4,LOGS[i].message);assert.ok(rtpReceived(DURATION)>300);
 const snap=t=>JSON.stringify(visible(t).map(p=>position(p,t)));const a=snap(126);snap(30);snap(160);assert.equal(snap(126),a);});
