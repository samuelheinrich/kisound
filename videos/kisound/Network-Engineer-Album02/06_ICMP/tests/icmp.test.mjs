import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,DROPS,GAPS,FADE_START,LIGHT_DIM} from '../src/render/config.js';
import {T,ADDR,FLIGHTS,BY_ID,received,pmtu,routeX,traceLines,BLOCKS,blockLines,LOGS,KINETIC,WORD_NOTE,activeFlights,pointAt,ST,GEO,segAt} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),tl=new Timeline(data);
const script=fs.readFileSync(new URL('../_revisions/ASTRA-DREHBUCH-original.md',import.meta.url),'utf8'),revised=fs.readFileSync(new URL('../ASTRA-DREHBUCH.md',import.meta.url),'utf8');
const lyric=id=>data.lyrics.segments.find(l=>l.id===id),rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
test('source, exact duration and frame raster',()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.equal(data.summary.samples_per_channel,SAMPLES);assert.equal(FRAMES,Math.ceil(DURATION*FPS));});
test('chapters and shots cover the whole track without gaps',()=>{for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test('the cut list keeps the 81 start times of the ASTRA script; locations follow the revised screenplay',()=>{const st=[...script.matchAll(/^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \| (\w+) \|/gm)],rv=[...revised.matchAll(/^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \| (\w+) \| (\w+) \|/gm)];assert.equal(st.length,81);assert.equal(rv.length,81);assert.equal(SHOTS.length,81);
 st.forEach((m,i)=>{assert.equal(SHOTS[i].id,m[1]);assert.ok(Math.abs(SHOTS[i].start-+m[2])<1e-6,m[1]);assert.equal(rv[i][2],m[2]);assert.equal(SHOTS[i].zone,rv[i][4].toLowerCase(),m[1]);assert.equal(SHOTS[i].mode,rv[i][5],m[1]);});
 const zones=new Set(SHOTS.map(s=>s.zone));for(const z of['room','desktop','globe','dc','header'])assert.ok(zones.has(z),z);});
test('every event and lyric lands in exactly one shot, as in the script',()=>{const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);
 for(const m of script.matchAll(/^\| (S\d{3}) \|.*\| (L\d{3}) · /gm))assert.ok(tl.shots.find(s=>s.id===m[1]).lyricIds.includes(m[2]),`${m[2]} in ${m[1]}`);});
test('bass, gaps and the hard end follow the measurements',()=>{const si=col('sub_20_60_drive'),ri=col('rms_dbfs');for(const d of DROPS){const b=rows.filter(r=>r[0]>d-1.6&&r[0]<d-.3).map(r=>r[si]),a=rows.filter(r=>r[0]>=d-.1&&r[0]<d+.6).map(r=>r[si]);assert.ok(Math.max(...a)>.55&&Math.min(...b)<.2,String(d));}
 for(const[a,b]of GAPS)assert.ok(Math.min(...rows.filter(r=>r[0]>=a&&r[0]<=b).map(r=>r[ri]))<-30,String(a));assert.ok(!data.events.some(e=>e.type==='fade_candidate'),'no measured fade – hard end');assert.ok(FADE_START>DURATION-.5);assert.ok(data.events.some(e=>Math.abs(e.time_s-LIGHT_DIM)<.01));});
test('type/code values are IPv4 ICMP and every error answer goes from the reporting node back to H with a quote',()=>{
 const want={'E-01':[8,0],'E-02':[0,0],'I-M1':[3,4],'TE-1':[11,0],'TE-2':[11,0],'PU-3':[3,3],'RD-1':[5,1]};for(const[id,[ty,co]]of Object.entries(want)){const f=BY_ID.get(id);assert.equal(f.type,ty,id);assert.equal(f.code,co,id);}
 for(const f of FLIGHTS.filter(f=>f.kind==='icmp'&&f.type!==0)){assert.equal(f.dst,ADDR.H,f.id);assert.equal(f.nodes.at(-1),'H',f.id);assert.ok(BY_ID.get(f.quote),`${f.id} quotes its original`);assert.equal(f.src,ADDR[f.nodes[0]],f.id);}
 assert.equal(BY_ID.get('E-02').quote,undefined,'echo reply has no error quote');assert.equal(BY_ID.get('I-M1').mtu,1400);assert.equal(BY_ID.get('RD-1').gw,ADDR.G2);
});
test('PMTUD: P-M1 (1500, DF) dies at R2’s 1400 opening, I-M1 returns, P-M2 is a new 1400-byte datagram',()=>{
 const m1=BY_ID.get('P-M1'),m2=BY_ID.get('P-M2');assert.equal(m1.fate,'drop');assert.equal(m1.nodes[m1.cut],'GATE');assert.ok(Math.abs(m1.t1-T.pm1Drop)<1e-6);assert.equal(m1.size,1500);assert.equal(m1.df,1);
 assert.equal(m2.size,1400);assert.notEqual(m2.ipid,m1.ipid);assert.ok(m2.t0>T.pmtu);assert.equal(pmtu(T.pmtu-1e-3),null);assert.equal(pmtu(T.pmtu),1400);assert.equal(20+8+1372,1400);
 assert.ok(!activeFlights(100).some(f=>f.id==='P-M1'),'no shrinking or revival of P-M1');assert.equal(m2.fate,'deliver');
});
test('traceroute: three new probes with TTL 1/2/3; hop lines only after their answers; D reached via port unreachable',()=>{
 assert.deepEqual(['T-1','T-2','T-3'].map(id=>BY_ID.get(id).ttl),[1,2,3]);assert.equal(BY_ID.get('T-1').nodes.at(-1),'G1');assert.equal(BY_ID.get('T-2').nodes.at(-1),'R2');assert.equal(BY_ID.get('T-3').nodes.at(-1),'D');
 assert.equal(BY_ID.get('TE-1').t1,T.line1);assert.equal(BY_ID.get('TE-2').t1,T.line2);assert.equal(BY_ID.get('PU-3').t1,T.line3);assert.equal(traceLines(T.line3-1e-3).length,2);assert.equal(traceLines(T.line3).length,3);
 assert.ok(Math.abs(BY_ID.get('T-3').t1-T.t3AtD)<1e-6);assert.equal(BY_ID.get('T-3').dport,33436);
});
test('redirect: same LAN, G1 forwards to G2 and reports 5/1; only a new packet after validation goes via G2',()=>{
 const r1=BY_ID.get('R-1'),r2=BY_ID.get('R-2');assert.deepEqual(r1.nodes,['H','G1','G2','X']);assert.deepEqual(r2.nodes,['H','G2','X']);assert.ok(r2.t0>=T.validated);assert.equal(routeX(T.validated-1e-3),ADDR.G1);assert.equal(routeX(T.validated),ADDR.G2);
 assert.ok(BY_ID.get('RD-1').t1<T.validated);for(const n of['H','G1','G2'])assert.deepEqual(GEO[n],GEO.H,'H, G1, G2 in the same office (one LAN)');assert.ok(BLOCKS.B05.lines.find(l=>/Erst danach/.test(l[1]))[0]>=T.validated);
});
test('results only after their events; ≤6 lines per page and ≥4 s',()=>{
 assert.ok(BLOCKS.B01.lines.filter(l=>/64 bytes|received/.test(l[1])).every(l=>l[0]>=BY_ID.get('E-02').t1));assert.ok(BLOCKS.B02.lines.find(l=>/Type 3 Code 4/.test(l[1]))[0]>=T.im1);
 for(const[id,b]of Object.entries(BLOCKS)){const pages=b.pages?b.pages.map((_,i)=>b.lines.filter(l=>l[3]===i)):[b.lines];for(const p of pages)assert.ok(p.length<=6,id);if(b.pages)b.pages.forEach((p,i)=>assert.ok((b.pages[i+1]??b.win[1])-p>=4,`${id}/${i}`));}
 assert.equal(received(T.echoBack-1e-3).length,0);assert.equal(received(DURATION).length,6,'E-02, I-M1, TE-1, TE-2, PU-3, RD-1');
});
test('kinetic words, addresses, logs, determinism',()=>{for(const id of Object.keys(KINETIC)){assert.ok(lyric(id),id);assert.ok(WORD_NOTE[id],id);}
 const ok=/^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.)/;const text=[...Object.values(BLOCKS).flatMap(b=>b.lines.map(l=>l[1])),...LOGS.map(l=>l.message),...Object.values(ADDR)].join('\n');for(const ip of text.match(/\b\d+\.\d+\.\d+\.\d+\b/g))assert.match(ip,ok,ip);
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.4,LOGS[i].message);
 const snap=t=>JSON.stringify(activeFlights(t).map(f=>pointAt(f,t)));const a=snap(126);snap(30);snap(160);assert.equal(snap(126),a);});
test('real places and timings: Zürich → Frankfurt → New York, RTTs that fit the distances, the hops where they really are',()=>{
 assert.deepEqual(GEO.R2,GEO.GATE);assert.ok(GEO.D[1]<-70&&GEO.R2[1]>5&&GEO.H[1]>5,'New York west, Frankfurt and Zürich in Europe');
 assert.match(BLOCKS.B01.lines.find(l=>/64 bytes/.test(l[1]))[1],/ttl=62 time=92\.4 ms/);assert.deepEqual(traceLines(T.line3).map(l=>+l.match(/([\d.]+) ms/)[1]),[1.2,9.6,92.1]);
 const t1=BY_ID.get('T-1'),t2=BY_ID.get('T-2'),m1=BY_ID.get('P-M1');assert.equal(segAt(t1,t1.t1).b,'G1','TTL 1 runs out at the home router');assert.equal(segAt(t2,t2.t1).b,'R2','TTL 2 runs out in Frankfurt');assert.equal(segAt(m1,m1.t1).b,'GATE','P-M1 dies at the tunnel in Frankfurt');
 const s=segAt(BY_ID.get('T-3'),BY_ID.get('T-3').t1);assert.equal(s.b,'D');assert.ok(s.end);});
