import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,DROPS,GAP,FADE_START} from '../src/render/config.js';
import {NODES,FLIGHTS,BY_ID,EVIDENCE,GROW,SHIFT,forward,traceLines,TRACES,revealed,voidRadius,swallowed,pointAt,activeFlights,ROUTES,RTBH,LOGS,KINETIC_SECTIONS,word,WORD_NOTE} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),tl=new Timeline(data);
const lyric=(txt,n=0)=>data.lyrics.segments.filter(l=>l.text===txt)[n];
const rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
test('source, exact duration and frame raster',()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.ok(Math.abs(data.summary.duration_s-DURATION)<1e-6);assert.equal(FRAMES,Math.ceil(DURATION*FPS));assert.ok((FRAMES-1)/FPS<DURATION);});
test('chapters and shots cover the whole track without gaps',()=>{for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test('every analysis event and lyric segment lands in exactly one shot',()=>{const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);});
test('drops are cold sub re-entries; the first one follows the measured gap',()=>{
 const si=col('sub_20_60_drive');for(const d of DROPS){const b=rows.filter(r=>r[0]>d-1.6&&r[0]<d-.3).map(r=>r[si]),a=rows.filter(r=>r[0]>=d-.1&&r[0]<d+.6).map(r=>r[si]);assert.ok(Math.max(...a)>.55&&Math.min(...b)<.2,String(d));}
 const ri=col('rms_dbfs');assert.ok(Math.min(...rows.filter(r=>r[0]>=GAP[0]-.06&&r[0]<=GAP[1]+.06).map(r=>r[ri]))<-30);assert.ok(DROPS[0]>GAP[1]);assert.ok(FADE_START>data.events.find(e=>e.type==='fade_candidate').time_s);
});
test('two faults: R4 discards silently, R2 answers with net unreachable',()=>{
 for(const f of FLIGHTS.filter(f=>f.fate==='null')){assert.equal(f.nodes.at(-1),'R4',f.id);assert.ok(!FLIGHTS.some(g=>g.cause===f.id),`${f.id}: Null0 sends no ICMP`);}
 for(const f of FLIGHTS.filter(f=>f.fate==='noroute')){assert.equal(f.nodes.at(-1),'R2');const u=FLIGHTS.filter(g=>g.cause===f.id);assert.equal(u.length,1);assert.equal(u[0].kind,'du');assert.deepEqual(u[0].nodes,['R2','R1','S']);}
 assert.ok(ROUTES.R2(0).some(r=>r[0]==='198.51.100.0/24'&&/missing/.test(r[1])));assert.ok(ROUTES.R4(0).some(r=>r[1]==='Null0'));
});
test('traceroute: hops 1–4 answer with time exceeded, from hop 5 on only * * *',()=>{
 for(const id of TRACES){const end=Math.max(...FLIGHTS.filter(f=>f.id.startsWith(id)).map(f=>f.tGone))+2,l=traceLines(id,end);
  assert.match(l[1],/^ 1  192\.0\.2\.1 /);assert.match(l[2],/^ 2  198\.18\.0\.2 /);assert.match(l[3],/^ 3  198\.18\.0\.1?3 /);assert.match(l[4],/^ 4  198\.18\.0\.4 /);assert.ok(l.slice(5).every(x=>/\* \* \*/.test(x)),id);}
 for(const f of FLIGHTS.filter(f=>f.kind==='probe'&&f.fate==='expire')){const te=BY_ID.get(`${f.id}t`);assert.ok(te&&te.kind==='te');assert.equal(te.nodes[0],f.nodes[f.ttl]);}
});
test('the blackhole grows from /32 to /24 on its line and takes the second server',()=>{
 const g=lyric('The blackhole grows.');assert.ok(GROW>=g.start_s-.01&&GROW<g.end_s);assert.equal(RTBH(GROW-.01),'203.0.113.45/32');assert.equal(RTBH(GROW),'203.0.113.0/24');
 assert.equal(BY_ID.get('K0').fate,'deliver');assert.ok(BY_ID.get('K0r').t1<lyric('Send it again.').start_s);assert.equal(BY_ID.get('K1').fate,'null');
 const fall=BY_ID.get('K1');assert.ok(Math.abs(fall.t1-lyric('Watch it fall.').start_s)<.2,'falls on "Watch it fall"');assert.ok(voidRadius(150)>voidRadius(40));
});
test('metrics shift: after SHIFT the path runs through R3b and still ends in R4',()=>{
 const s=lyric('Metrics shift and tables turn,');assert.ok(Math.abs(SHIFT-s.start_s)<.01);assert.deepEqual(forward('D',SHIFT-.1).path,['S','R1','R2','R3','R4']);assert.deepEqual(forward('D',SHIFT).path,['S','R1','R2','R3b','R4']);
});
test('the probe host only learns from answers: fog lifts on hops 1–4 and never beyond R4',()=>{
 const r=revealed(DURATION);for(const id of['R1','R2','R3','R3b','R4','D2'])assert.ok(r.has(id),id);for(const id of['R5','FWB','D','C','RC'])assert.ok(!r.has(id),id);
 assert.ok(EVIDENCE.every(e=>e.t<=DURATION));
});
test('lines that name an ICMP land on one',()=>{
 const near=(kind,t,d=1.6)=>EVIDENCE.some(e=>e.type===kind&&Math.abs(FLIGHTS.find(f=>f.id===`${e.cause}${kind==='te'?'t':'u'}`)?.t0-t)<d);
 assert.ok(near('du',lyric('Destination unreachable.').start_s),'pulse: unreachable');assert.ok(near('te',lyric('Time exceeded.').start_s),'pulse: time exceeded');
 assert.ok(near('du',lyric('Destination unreachable.',1).start_s),'hook: unreachable');assert.ok(near('te',lyric('TTL expired.',1).start_s,.4),'break: TTL expired');
 for(const k of[2,3,4,5,6])assert.ok(near('du',data.lyrics.segments.filter(l=>l.text==='Destination unreachable.')[k].start_s,1.2),`finale ${k}`);
});
test('kinetic words come from the analysed lyrics and all have a note',()=>{const ws=data.lyrics.segments.filter(l=>KINETIC_SECTIONS.has(l.section)).map(l=>word(l.text));assert.ok(ws.length>=30);for(const w of ws)assert.ok(w in WORD_NOTE,w);});
test('camera targets, documentation addresses, log spacing, pure time',()=>{
 for(const s of SHOTS.filter(s=>s.target?.startsWith('f:'))){const f=BY_ID.get(s.target.slice(2));assert.ok(f,s.id);assert.ok(f.t0<s.end&&f.tGone>s.start-.3,`${s.id} ${s.target}`);}
 for(const s of SHOTS.filter(s=>s.target?.startsWith('n:')))assert.ok(NODES[s.target.slice(2)],s.id);
 for(const n of Object.values(NODES))assert.ok(/^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|198\.18\.)/.test(n.ip),n.ip);
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.45);
 const a=JSON.stringify(activeFlights(120).map(f=>f.id));activeFlights(30);activeFlights(200);assert.equal(JSON.stringify(activeFlights(120).map(f=>f.id)),a);assert.ok(swallowed(DURATION)>40);
});
