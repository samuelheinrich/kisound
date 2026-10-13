import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,DROPS,GAPS,FADE_START} from '../src/render/config.js';
import {T,ADDR,ST,PATH,FLIGHTS,BY_ID,activeFlights,pointAt,shutter,link,route,proofs,consoleSession,serialActivity,BLOCKS,blockLines,LOGS,KINETIC,WORD_NOTE} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),tl=new Timeline(data);
const script=fs.readFileSync(new URL('../_revisions/ASTRA-DREHBUCH-original.md',import.meta.url),'utf8'),revised=fs.readFileSync(new URL('../ASTRA-DREHBUCH.md',import.meta.url),'utf8');
const lyric=id=>data.lyrics.segments.find(l=>l.id===id),rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
const line=(id,re)=>BLOCKS[id].lines.find(l=>re.test(l[1]));
test('source, exact duration and frame raster',()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.equal(data.summary.samples_per_channel,SAMPLES);assert.equal(FRAMES,Math.ceil(DURATION*FPS));});
test('chapters and shots cover the whole track without gaps',()=>{for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test('the cut list keeps the 64 start times of the ASTRA script; locations and camera follow the revised screenplay',()=>{const st=[...script.matchAll(/^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \| (\w+) \|/gm)],rv=[...revised.matchAll(/^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \| (\w+) \| (\w+) \|/gm)];assert.equal(st.length,64);assert.equal(rv.length,64);assert.equal(SHOTS.length,64);
 st.forEach((m,i)=>{assert.equal(SHOTS[i].id,m[1]);assert.ok(Math.abs(SHOTS[i].start-+m[2])<1e-6,m[1]);assert.equal(rv[i][2],m[2]);assert.equal(SHOTS[i].camera,rv[i][4].toLowerCase(),m[1]);assert.equal(SHOTS[i].mode,rv[i][5],m[1]);assert.equal(SHOTS[i].zone,rv[i][4]==='LAPTOP'?'config':'world',m[1]);});
 const aisle=SHOTS.filter(s=>s.camera==='aisle').map(s=>s.mode),to=aisle.filter(m=>m.endsWith('_to')).length,away=aisle.filter(m=>m.startsWith('away')).length;assert.ok(to>=4&&away>=3,'travels alternate towards and away from the engineer');assert.equal(new Set(aisle).size,aisle.length,'every travel takes a different route');});
test('every event and lyric lands in exactly one shot, as in the script',()=>{const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);
 for(const m of script.matchAll(/^\| (S\d{3}) \|.*\| (L\d{3}) · /gm))assert.ok(tl.shots.find(s=>s.id===m[1]).lyricIds.includes(m[2]),`${m[2]} in ${m[1]}`);});
test('bass entries, gaps and the fade follow the measurements',()=>{const si=col('sub_20_60_drive'),ri=col('rms_dbfs');for(const d of DROPS){const b=rows.filter(r=>r[0]>d-1.6&&r[0]<d-.3).map(r=>r[si]),a=rows.filter(r=>r[0]>=d-.1&&r[0]<d+.6).map(r=>r[si]);assert.ok(Math.max(...a)>.55&&Math.min(...b)<.2,String(d));}
 for(const[a,b]of GAPS)assert.ok(Math.min(...rows.filter(r=>r[0]>=a&&r[0]<=b).map(r=>r[ri]))<-30,String(a));assert.ok(Math.abs(FADE_START-data.events.find(e=>e.type==='fade_candidate').time_s)<.01);});
test('the uplink is administratively down from 0 s until exactly 147.88 s; no in-band answer ever arrives',()=>{
 for(let t=0;t<T.noShut;t+=.5)assert.equal(shutter(t),0,String(t));assert.equal(shutter(T.noShut),0);assert.ok(shutter(T.noShut+.5)>0);assert.equal(shutter(T.shutterOpen),1);
 const syn=FLIGHTS.filter(f=>f.kind==='syn');assert.equal(syn.length,7);for(const f of syn){assert.equal(f.fate,'drop');assert.ok(f.t1<T.noShut);assert.ok(Math.hypot(...pointAt(f,f.t1).map((v,i)=>v-ST.GI1[i]))>4,'dies at the neighbour, before the down uplink');assert.equal(f.src,ADDR.prodAdmin);assert.equal(f.dst,ADDR.gi1);}
 assert.ok(line('B01',/timed out/)[0]>T.inband[3]);assert.ok(!FLIGHTS.some(f=>(f.kind==='req'||f.kind==='resp'||f.kind==='traffic')&&f.t0<T.po1),'no production service traffic before the recovery test');});
test('management and console are a separate, pre-existing path: own network, air gap, serial channel 7 into the console port',()=>{
 for(const p of[...PATH.mgmt,...PATH.serial])assert.ok(p[2]<=0,'OOB and console cable at the rear of the rack (hot aisle)');for(const p of PATH.prod)assert.ok(p[2]>=1.2||p[2]<=-3.6||p[1]>=2.4,'production cabling at rack fronts (cold aisles) or overhead in the duct');
 const segDist=(p,a,b)=>{const ab=b.map((v,i)=>v-a[i]),ap=p.map((v,i)=>v-a[i]),l=ab.reduce((s,v)=>s+v*v,0),k=Math.max(0,Math.min(1,ap.reduce((s,v,i)=>s+v*ab[i],0)/l));return Math.hypot(...p.map((v,i)=>v-a[i]-k*ab[i]));};
 for(const p of[...PATH.mgmt,...PATH.serial])for(let i=1;i<PATH.prod.length;i++)assert.ok(segDist(p,PATH.prod[i-1],PATH.prod[i])>.9,'separate cables, no shared route');assert.deepEqual(PATH.serial.at(-1).map(v=>+v.toFixed(2)),[ST.CONPORT[0],ST.CONPORT[1],-.04]);assert.equal(PATH.serial[0][0],ST.CONS7[0]);
 for(const f of FLIGHTS.filter(f=>f.kind==='mgmt')){assert.ok(f.t0>=T.mgmtSsh);assert.ok([ADDR.mgmt,ADDR.cons].includes(f.src)&&[ADDR.mgmt,ADDR.cons].includes(f.dst));}
 assert.equal(consoleSession(T.prompt-1e-3),false);assert.equal(consoleSession(T.prompt),true);assert.equal(serialActivity(T.picocom-1e-3),0);assert.ok(serialActivity(T.prompt+.2)>.5);
 assert.ok(BLOCKS.B02.lines.every(l=>!/10\.0\.12\./.test(l[1])),'console session never uses the production addresses');assert.ok(line('B06',/Console-Kanal 7/));});
test('recovery order: no shutdown → link up → line protocol up → route installed → new service test P-O1 → saved',()=>{
 assert.ok(T.noShut<T.linkUp&&T.linkUp<T.lineUp&&T.lineUp<T.route&&T.route<T.po1&&T.po1<T.po1Ok&&T.po1Ok<T.save&&T.save<T.saved);
 assert.equal(link(T.linkUp-1e-3),'down');assert.equal(link(T.linkUp),'up/down');assert.equal(link(T.lineUp),'up/up');assert.match(route(T.route-1e-3),/nicht nutzbar/);assert.equal(route(T.route),'installiert');
 const p=proofs(T.po1Ok-1e-3);assert.ok(p.link&&p.route&&!p.service);assert.ok(proofs(T.po1Ok).service);assert.ok(!proofs(T.saved-1e-3).saved&&proofs(T.saved).saved);
 const o1=BY_ID.get('P-O1'),r1=BY_ID.get('P-O1R');assert.equal(o1.t0,T.po1);assert.equal(r1.t1,T.po1Ok);assert.deepEqual(o1.pts,PATH.prod);assert.deepEqual(r1.pts,[...PATH.prod].reverse());
 const o2=BY_ID.get('P-O2'),r2=BY_ID.get('P-O2R');assert.notEqual(o2,o1);assert.ok(o2.t0>=212.06);assert.ok(r2.t1<=T.po2Ok);assert.deepEqual(r2.pts,[...PATH.prod].reverse(),'the answer returns on the production path, not via the console');});
test('screen texts: results only after their events, ≤6 lines per page and ≥4 s, P-O2 line only from 221.06 s',()=>{
 for(const[id,b]of Object.entries(BLOCKS)){const pages=b.pages?b.pages.map((_,i)=>b.lines.filter(l=>l[3]===i)):[b.lines];for(const p of pages)assert.ok(p.length<=6,id);if(b.pages)b.pages.forEach((p,i)=>assert.ok((b.pages[i+1]??b.win[1])-p>=4,`${id}/${i}`));for(const l of b.lines)assert.ok(l[0]>=b.win[0]&&l[0]<b.win[1],`${id}: ${l[1]}`);}
 assert.equal(line('B04',/LINK-3/)[0],T.linkUp);assert.equal(line('B04',/LINEPROTO/)[0],T.lineUp);assert.equal(line('B04',/no shutdown/)[0],T.noShut);assert.ok(BLOCKS.B05.lines.filter(l=>/static|10\.0\.12\.2|Routing entry/.test(l[1])).every(l=>l[0]>=T.route));
 assert.ok(BLOCKS.B06.lines.filter(l=>/HTTP 200|status/.test(l[1])).every(l=>l[0]>=T.po1Ok));assert.equal(line('B07',/\[OK\]/)[0],T.saved);assert.equal(line('B07',/P-O2/)[0],T.po2Doc);assert.ok(T.po2Doc>=T.po2Ok);
 assert.ok(!blockLines('B07',T.po2Doc-1e-3).some(l=>/P-O2/.test(l.text)));assert.ok(blockLines('B07',T.po2Doc).some(l=>/P-O2/.test(l.text)));assert.ok(line('B03',/^ shutdown$/)&&line('B03',/^\+ shutdown$/));});
test('kinetic words, addresses, logs, determinism',()=>{for(const id of Object.keys(KINETIC)){assert.ok(lyric(id),id);assert.ok(WORD_NOTE[id],id);}assert.deepEqual(Object.keys(KINETIC),['L017','L018','L021','L041','L042','L045']);
 const ok=/^(192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|10\.)/;const text=[...Object.values(BLOCKS).flatMap(b=>b.lines.map(l=>l[1])),...LOGS.map(l=>l.message),...Object.values(ADDR).map(a=>a.replace(/:\d+$/,''))].join('\n');for(const ip of text.match(/\b\d+\.\d+\.\d+\.\d+\b/g).filter(ip=>!/^255\./.test(ip)))assert.match(ip,ok,ip);
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.4,LOGS[i].message);
 const snap=t=>JSON.stringify(activeFlights(t).map(f=>pointAt(f,t)));const a=snap(160);snap(30);snap(215);assert.equal(snap(160),a);});
