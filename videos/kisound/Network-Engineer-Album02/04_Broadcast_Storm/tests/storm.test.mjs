import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,DROPS,FADE_START,BEAT_CUT} from '../src/render/config.js';
import {RING_CLOSED,B001_T,MGMT_LOST,SHUT_CMD,PORT_DOWN,MGMT_BACK,TEST_OK,BROADCASTS,COPIES,copyAlive,aliveCopies,copyPos,passes,macPort,macFlaps,bcastRate,cpu,mgmtOk,queueFill,ringClosed,BLOCKS,blockLines,LOGS,KINETIC,WORD_NOTE,UNICAST,HOSTS,ADDR,PORT_POS,FABRIC_MID,PERIM} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),tl=new Timeline(data);
const script=fs.readFileSync(new URL('../_revisions/ASTRA-DREHBUCH-original.md',import.meta.url),'utf8');
const lyric=id=>data.lyrics.segments.find(l=>l.id===id),rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
test('source, exact duration and frame raster',()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.equal(data.summary.samples_per_channel,SAMPLES);assert.equal(FRAMES,Math.ceil(DURATION*FPS));});
test('chapters and shots cover the whole track without gaps',()=>{for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test('the cut list is the shooting script: 58 shots with its start times',()=>{const st=[...script.matchAll(/^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \|/gm)].map(m=>[m[1],+m[2]]);assert.equal(st.length,58);assert.equal(SHOTS.length,58);st.forEach(([id,s],i)=>{assert.equal(SHOTS[i].id,id);assert.ok(Math.abs(SHOTS[i].start-s)<1e-6,id);});});
test('every event and lyric lands in exactly one shot, as in the script',()=>{const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);
 for(const m of script.matchAll(/^\| (S\d{3}) \|.*\| (L\d{3}) · /gm))assert.ok(tl.shots.find(s=>s.id===m[1]).lyricIds.includes(m[2]),`${m[2]} in ${m[1]}`);});
test('bass re-entries, beat cut and close follow the measurements',()=>{
 const si=col('sub_20_60_drive'),ri=col('rms_dbfs');for(const d of DROPS){const b=rows.filter(r=>r[0]>d-1.6&&r[0]<d-.3).map(r=>r[si]),a=rows.filter(r=>r[0]>=d-.1&&r[0]<d+.6).map(r=>r[si]);assert.ok(Math.max(...a)>.55&&Math.min(...b)<.2,String(d));}
 const lv=t=>rows.reduce((p,r)=>Math.abs(r[0]-t)<Math.abs(p[0]-t)?r:p)[ri];assert.ok(lv(BEAT_CUT+.15)<lv(BEAT_CUT-.6)-4,'level drops after «Zieh das Kabel»');
 const quiet=rows.filter(r=>r[0]>PORT_DOWN-2.5&&r[0]<PORT_DOWN+3).map(r=>r[si]);assert.ok(Math.max(...quiet)<.2,'no sub bass around the port-down');assert.ok(Math.abs(FADE_START-data.events.find(e=>e.type==='fade_candidate').time_s)<.31);
});
test('the ring: open chain, closed by the stray patch on «Falscher Port», opened once by the shutdown',()=>{
 assert.ok(Math.abs(RING_CLOSED-lyric('L002').start_s)<1e-6);assert.ok(!ringClosed(RING_CLOSED-1e-3)&&ringClosed(RING_CLOSED));
 assert.ok(PORT_DOWN>=SHUT_CMD&&PORT_DOWN<=164.18);assert.ok(Math.abs(SHUT_CMD-lyric('L037').start_s)<1e-6);assert.ok(!ringClosed(PORT_DOWN));
 assert.ok(BLOCKS.B04.lines.at(-1)[0]>=PORT_DOWN&&/administratively down/.test(BLOCKS.B04.lines.at(-1)[1]));
});
test('flooding: one broadcast → exactly two ring copies, same header; ethernet has no hop limit',()=>{
 for(const b of BROADCASTS){const c=COPIES.filter(c=>c.b===b);assert.equal(c.length,2,b.id);assert.deepEqual(c.map(x=>x.dir).sort(),['a','b']);}
 assert.equal(BROADCASTS[0].id,'B-001');assert.ok(BROADCASTS[0].t>RING_CLOSED);assert.match(BROADCASTS[0].what,/Who has 192\.0\.2\.1\? Tell 192\.0\.2\.10/);
 const a=COPIES[0];assert.ok(a.end.t>PORT_DOWN&&a.end.why==='portdown','B-001 copies circle until the ring opens – no TTL');
 const p=passes(a,0,70);assert.ok(p.length>15);const seq=p.map(x=>x.sw).join(',');assert.ok(!/(SW\d),\1/.test(seq),'a copy never re-enters the switch it just left (no flood back out of the ingress)');
});
test('after the port-down no copy survives a further lap; nothing circles afterwards',()=>{
 const lap=4;for(const c of COPIES)assert.ok(c.end.t<=PORT_DOWN+lap||c.end.why==='queue',c.id);assert.equal(aliveCopies(PORT_DOWN+lap).length,0);assert.equal(aliveCopies(180).length,0);
 assert.ok(aliveCopies(100).length>50,'storm at its height');assert.ok(aliveCopies(30).length===2,'only B-001/a and /b early on');
});
test('MAC flapping on SW3 only while the ring is closed; stable at Gi1/0/1 afterwards',()=>{assert.ok(macFlaps(80)>10);assert.equal(macFlaps(DURATION),macFlaps(PORT_DOWN+4));assert.equal(macPort(DURATION),'Gi1/0/1');assert.ok(['Gi1/0/1','Gi1/0/24'].includes(macPort(60)));});
test('consequences recover with delay; management and test only after separate checks',()=>{
 assert.ok(cpu(70)>=90&&cpu(PORT_DOWN+1)>=90&&cpu(195)<30,'CPU recovers late');assert.ok(!mgmtOk(100)&&!mgmtOk(180)&&mgmtOk(MGMT_BACK));assert.ok(queueFill(PORT_DOWN+1)>.5&&queueFill(195)===0,'buffers do not empty instantly');
 assert.ok(bcastRate(100)===620000&&bcastRate(190)<100);assert.equal(UNICAST[0].ok,false);assert.ok(UNICAST[1].t0>PORT_DOWN&&UNICAST[1].ok);assert.equal(UNICAST[1].t1,TEST_OK);
 assert.ok(BLOCKS.B05.lines.find(l=>/Client-Service-Test/.test(l[1]))[0]>=TEST_OK);assert.ok(BLOCKS.B05.lines.find(l=>/Management antwortet/.test(l[1]))[0]>=MGMT_BACK);
 assert.ok(!LOGS.some(l=>/MACFLAP/.test(l.message)&&l.time_s>=PORT_DOWN),'no new flap lines after the port-down');
});
test('screen texts: ≤6 lines per page/tab, ≥4 s per page, the console path before the shutdown',()=>{
 for(const[id,b]of Object.entries(BLOCKS)){const groups=b.pages?b.pages.map((_,i)=>b.lines.filter(l=>l[3]===i)):b.panes?b.panes.map((_,i)=>b.lines.filter(l=>l[3]===i)):[b.lines];for(const g of groups)assert.ok(g.length<=6,id);
  if(b.pages)b.pages.forEach((p,i)=>assert.ok((b.pages[i+1]??b.win[1])-p>=4,`${id} page ${i}`));if(b.panes)b.panes.forEach(p=>assert.ok(b.win[1]-p>=4,`${id} tab`));}
 assert.ok(BLOCKS.C01.lines.find(l=>/timed out/.test(l[1]))[0]<SHUT_CMD);assert.ok(BLOCKS.B03.lines.every(l=>l[0]<SHUT_CMD));
});
test('kinetic words with notes; addresses, logs, determinism',()=>{
 for(const id of Object.keys(KINETIC)){assert.ok(lyric(id),id);assert.ok(WORD_NOTE[id],id);}
 const ok=/^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.)/;const text=[...Object.values(BLOCKS).flatMap(b=>b.lines.map(l=>l[1])),...LOGS.map(l=>l.message),...Object.values(HOSTS).map(h=>h.ip)].join('\n');for(const ip of text.match(/\b\d+\.\d+\.\d+\.\d+\b/g))assert.match(ip,ok,ip);
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.4,LOGS[i].message);
 const snap=t=>JSON.stringify(aliveCopies(t).slice(0,40).map(c=>copyPos(c,t)));const a=snap(100);snap(30);snap(170);assert.equal(snap(100),a);
});
