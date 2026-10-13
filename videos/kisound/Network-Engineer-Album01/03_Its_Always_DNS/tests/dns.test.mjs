import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,SILENCE,BLACKOUT,DROPS,FADE_START} from '../src/render/config.js';
import {TRANSACTIONS,MESSAGES,RESOLVER_CACHE,resolverCache,laptopBCache,zoneView,status,ticketAt,clueState,CLUES,digOutput,DIG_FOR_MODE,KINETIC_SECTIONS,word,WORD_NOTE,LOGS,FLUSH1,FIX1,FIX2,txPos,activeMessages} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url)));const tl=new Timeline(data);
const range=(a,b,s)=>Array.from({length:Math.floor((b-a)/s)+1},(_,i)=>a+i*s);
const rows=data.features_100ms.rows,ci=data.features_100ms.columns.indexOf('rms_dbfs');

test('source, exact duration and frame raster',()=>{
 assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.ok(Math.abs(data.summary.duration_s-DURATION)<1e-6);
 assert.equal(FRAMES,Math.ceil(DURATION*FPS));assert.ok((FRAMES-1)/FPS<DURATION);
});
test('chapters and shots cover the whole track without gaps',()=>{
 for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}
});
test('every analysis event and lyric segment lands in exactly one shot',()=>{
 const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);
 assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);
});
test('the timeout and the blackout sit on measured silence',()=>{
 for(const t of range(SILENCE[0]+.1,SILENCE[1]-.4,.1)){const r=rows.reduce((b,x)=>Math.abs(x[0]-t)<Math.abs(b[0]-t)?x:b);assert.ok(r[ci]<-45,`${t}: ${r[ci]}`);}
 for(const t of range(BLACKOUT[0]+.1,BLACKOUT[1]-.1,.1)){const r=rows.reduce((b,x)=>Math.abs(x[0]-t)<Math.abs(b[0]-t)?x:b);assert.ok(r[ci]<-45,`${t}: ${r[ci]}`);}
 assert.equal(status((SILENCE[0]+SILENCE[1])/2).code,'TIMEOUT');assert.ok(TRANSACTIONS.TO.msgs.every(m=>m.kind==='timeout'));
});
test('hops of a transaction follow each other and connect',()=>{
 for(const x of Object.values(TRANSACTIONS))x.msgs.forEach((m,i)=>{assert.ok(m.t1>m.t0,`${x.id}`);if(i){assert.ok(Math.abs(m.t0-x.msgs[i-1].t1)<1e-9,`${x.id} gap`);if(x.id!=='TO')assert.equal(m.from,x.msgs[i-1].to,`${x.id} hop ${i}`);}});
 for(const t of range(0,DURATION,.5))for(const x of Object.values(TRANSACTIONS))if(t>=x.t0&&t<=x.t1)assert.ok(txPos(x.id,t).every(Number.isFinite));
});
test('each top-level domain is learned from the root exactly once; later names skip the root',()=>{
 const visits=[];for(const x of Object.values(TRANSACTIONS))x.msgs.forEach((m,i)=>{if(m.to.startsWith('root-'))visits.push({tx:x.id,tld:x.msgs[i+1].label.split(' ')[0]});});
 const tlds=visits.map(v=>v.tld);assert.equal(new Set(tlds).size,tlds.length,JSON.stringify(visits));assert.deepEqual(new Set(tlds),new Set(['.com','.net','.arpa','.ch','.org']));
 // a TLD is only asked when the domain's own name servers are not cached yet
 const askedTld=Object.values(TRANSACTIONS).flatMap(x=>x.msgs.filter(m=>['com','net','org','ch','arpa'].includes(m.to)).map(()=>x.name.split(' ')[0]));
 assert.equal(new Set(askedTld).size,askedTld.length,`domain asked twice at its TLD: ${askedTld}`);
});
test('case #4040: NXDOMAIN cached negatively, flush alone does not help, the zone fix does',()=>{
 assert.ok(resolverCache(40).some(e=>e.name==='app.itsalwaysdns.com'&&e.negative));assert.equal(status(40).code,'NXDOMAIN');
 assert.ok(laptopBCache(40).some(e=>e.ttl===86400),'the engineer laptop still says yes');
 assert.ok(!resolverCache(FLUSH1+.01).some(e=>e.name==='app.itsalwaysdns.com'),'flushed');
 assert.equal(TRANSACTIONS.Q2.msgs.at(-1).kind,'nxdomain','asked again after the flush: still NXDOMAIN');
 assert.equal(zoneView('internal',FIX1-.01).find(r=>r.name==='app').state,'missing');assert.notEqual(zoneView('internal',FIX1+.01).find(r=>r.name==='app').state,'missing');
 assert.ok(zoneView('external',20).some(r=>r.name==='app'&&r.state==='ok'),'external view always had it');
 assert.equal(TRANSACTIONS.OK1.msgs.at(-1).kind,'answer');assert.ok(TRANSACTIONS.OK1.t0>FIX1);assert.equal(status(95).code,'NOERROR');
 assert.equal(ticketAt(100).id,4040);assert.equal(clueState(CLUES.find(c=>c.id==='dns'),95),'ok');
});
test('NXDOMAIN and timeout are different findings',()=>{
 assert.ok(digOutput('nx',20).some(l=>/status: NXDOMAIN/.test(l)));assert.ok(digOutput('timeout',131).some(l=>/no servers could be reached/.test(l)));
 assert.ok(!digOutput('timeout',131).some(l=>/NXDOMAIN/.test(l)));assert.equal(TRANSACTIONS.TYPO.msgs.find(m=>m.from==='com').kind,'nxdomain');
});
test('CNAME chains cross zones; in-zone chains are never chased hop by hop',()=>{
 for(const x of Object.values(TRANSACTIONS))x.msgs.forEach((m,i)=>{if(m.kind!=='cname')return;const target=m.label.replace(/^CNAME /,'').split(' ')[0],next=x.msgs[i+1];
  if(next&&next.kind==='query'&&next.to===m.from)assert.ok(target.endsWith('example.net')===false&&m.from!==next.to||x.id==='OK2',`${x.id}: same server asked again for an in-zone target`);});
 const cn2=TRANSACTIONS.CN2.msgs.map(m=>m.to);assert.ok(cn2.includes('nsex')&&cn2.filter(n=>n==='ns1int').length===2);
 assert.equal(zoneView('internal',FIX2-.01).find(r=>r.name==='lb').state,'missing');assert.equal(status(256).code,'NOERROR');assert.equal(status(260.9).code,'NXDOMAIN');
});
test('cache entries: TTLs run down, flushes and expiries remove them',()=>{
 for(const e of RESOLVER_CACHE){assert.ok(e.ttl>0);const mid=e.at+.1;if(mid<e.until&&mid<DURATION){const c=resolverCache(mid).find(x=>x.at===e.at&&x.name===e.name);assert.ok(c&&c.remaining<=e.ttl);}}
 assert.ok(resolverCache(170).length<resolverCache(155).length+3);assert.ok(!resolverCache(176).some(e=>e.name==='7.100.51.198.in-addr.arpa'),'short TTL expired');
});
test('kinetic words come from the analysed lyrics and all have a note entry',()=>{
 const ws=data.lyrics.segments.filter(l=>KINETIC_SECTIONS.has(l.section)).map(l=>word(l.text));assert.ok(ws.length>=30);
 for(const w of ws)assert.ok(w in WORD_NOTE||w.replace("IT'S",'ITS') in WORD_NOTE,w);
});
test('dig output exists for every mode that shows a terminal',()=>{for(const k of new Set(Object.values(DIG_FOR_MODE)))assert.ok(digOutput(k,100).length>=3,k);});
test('the film ends on the hard cut, not on a guessed fade',()=>{assert.ok(FADE_START>DURATION-.3);assert.equal(tl.visibility(FADE_START),1);assert.equal(tl.visibility(DURATION),0);assert.ok(DROPS.every(d=>d>0&&d<DURATION));});
test('query log stays readable',()=>{for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.45);});
test('messages are pure functions of time',()=>{const a=JSON.stringify(activeMessages(150.5).map(m=>m.tx+m.t0));activeMessages(20);activeMessages(250);assert.equal(JSON.stringify(activeMessages(150.5).map(m=>m.tx+m.t0)),a);});
