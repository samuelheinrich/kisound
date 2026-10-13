import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,DROPS,GAP,FADE_START} from '../src/render/config.js';
import {FLIGHTS,BY_ID,SESSIONS,SESSION_BY_ID,RULES,BLOCK_T,HOSTS,PUBLIC_IP,stateTable,sessionState,ringHit,labelAt,pointAt,activeFlights,LOGS,KINETIC_SECTIONS,word,WORD_NOTE,DENY_IN,BLOCK_X,DPI_X} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url))),tl=new Timeline(data);
const lyric=txt=>data.lyrics.segments.find(l=>l.text===txt);
test('source, exact duration and frame raster',()=>{
 assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,SAMPLES/48000);assert.ok(Math.abs(data.summary.duration_s-DURATION)<1e-6);assert.equal(FRAMES,Math.ceil(DURATION*FPS));assert.ok((FRAMES-1)/FPS<DURATION);
});
test('chapters and shots cover the whole track without gaps',()=>{for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test('every analysis event and lyric segment lands in exactly one shot',()=>{
 const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);
});
test('drops are bass re-entries and the gap dims the light',()=>{
 const rows=data.features_100ms.rows,si=data.features_100ms.columns.indexOf('sub_20_60_drive');
 for(const d of DROPS){const before=rows.filter(r=>r[0]>d-1.6&&r[0]<d-.3).map(r=>r[si]),after=rows.filter(r=>r[0]>=d-.1&&r[0]<d+.6).map(r=>r[si]);assert.ok(Math.max(...after)>.55,`${d} after`);assert.ok(Math.min(...before)<.2,`${d} before`);}
 assert.ok(data.events.some(e=>e.type==='level_gap'&&Math.abs(e.time_s-(GAP[0]+GAP[1])/2)<.1));assert.ok(FADE_START>data.events.find(e=>e.type==='fade_candidate').time_s);
});
test('new sessions are checked against the policy; everything else of a session takes the state path',()=>{
 for(const s of SESSIONS){const fl=FLIGHTS.filter(f=>f.session===s.id).sort((a,b)=>a.tGate-b.tGate);assert.equal(fl[0].check,'policy',s.id);assert.equal(fl[0].rule,s.rule);
  for(const f of fl.slice(1))assert.ok(['state','none'].includes(f.check),`${f.id} should not re-check the policy`);
  assert.ok(fl.slice(1).every(f=>f.tGate>=fl[0].tGate),`${s.id}: nothing passes before the first packet created the entry`);}
});
test('TCP follows SYN → SYN-ACK → ACK, and the entry walks the states in order',()=>{
 const order=['SYN_SENT','SYN_RECV','ESTABLISHED','FIN_WAIT','TIME_WAIT'];
 for(const s of SESSIONS.filter(s=>s.proto==='tcp')){const k=['syn','sa','ack'].map(x=>BY_ID.get(s.id+x));assert.ok(k[0].t1<=k[1].t0&&k[1].t1<=k[2].t0,s.id);
  const st=s.events.map(e=>e[1]).filter(v=>order.includes(v));assert.deepEqual(st,[...st].sort((a,b)=>order.indexOf(a)-order.indexOf(b)),s.id);}
 assert.ok(SESSIONS.filter(s=>s.proto==='tcp').every(s=>s.closed!=null),'every tcp session ends (FIN or reset)');
});
test('UDP has no handshake; syslog never gets a reply and expires 30 s after its last packet',()=>{
 const u=SESSION_BY_ID.get('U1');assert.ok(FLIGHTS.filter(f=>f.session==='U1').every(f=>f.from==='LOG'));const last=Math.max(...FLIGHTS.filter(f=>f.session==='U1').map(f=>f.tGate));
 assert.equal(sessionState(u,last+29.9),'UNREPLIED');assert.equal(sessionState(u,last+30.01),null);
 const exp=SHOTS.find(s=>s.mode==='expire');assert.ok(u.closed>exp.start&&u.closed<exp.end,'the expiry happens on screen');
 const d=SESSION_BY_ID.get('D0');assert.equal(sessionState(d,BY_ID.get('D0r').tGate+.01),'REPLIED');
});
test('unsolicited packets die: implicit deny before the blocklist, blocklist after it',()=>{
 for(const f of FLIGHTS.filter(f=>f.kind==='probe'||f.check==='nostate')){assert.equal(f.fate,'drop',f.id);const x=pointAt(f,f.t1)[0];
  if(f.from==='X'&&f.t1>=BLOCK_T){assert.equal(f.dropReason,'blocklist');assert.ok(Math.abs(x-BLOCK_X)<.05);}else{assert.ok(['deny','nostate'].includes(f.dropReason));assert.ok(Math.abs(x-DENY_IN)<.05);}}
 assert.equal(BY_ID.get('X7').dropReason,'nostate','ACK without a session finds no match');
 const write=lyric('Write the rule and lock it.');assert.ok(BLOCK_T>write.start_s&&BLOCK_T<write.end_s+.2,'rule 0 is written on the line');assert.equal(RULES[0].since,BLOCK_T);
});
test('hook and break land on their lines',()=>{
 assert.ok(Math.abs(BY_ID.get('T0syn').tGate-lyric('Session open.').start_s)<.4);assert.ok(Math.abs(BY_ID.get('T0sa').tGate-lyric('State is known.').start_s)<.1);
 assert.ok(Math.abs(BY_ID.get('Z0').t1-23.15)<.01,'lone packet dies on the transient');
 assert.ok(Math.abs(BY_ID.get('T10syn').tGate-lyric('SYN.').start_s)<.1);assert.ok(Math.abs(BY_ID.get('T10ack').tGate-lyric('ACK.').start_s)<.1);assert.ok(Math.abs(BY_ID.get('T10d1').tGate-lyric('Session match.').start_s)<.15);
 assert.ok(BY_ID.get('X7').t1>lyric('No match, knock it.').start_s&&BY_ID.get('X7').t1<lyric('No match, knock it.').end_s+.8);
});
test('NAT: inside addresses never appear outside; DNAT and hairpin reach the DMZ',()=>{
 for(const f of FLIGHTS.filter(f=>f.session&&SESSION_BY_ID.get(f.session).nat&&!SESSION_BY_ID.get(f.session).hairpin)){const s=SESSION_BY_ID.get(f.session);
  for(const u of[.2,.5,.8]){const t=f.t0+u*(f.t1-f.t0),x=pointAt(f,t)[0];if(x>4)assert.ok(!labelAt(f,t).includes(s.orig),`${f.id} leaks ${s.orig}`);}}
 const t5=BY_ID.get('T5syn'),h1=BY_ID.get('H1syn');assert.equal(t5.to,'DMZ');assert.equal(h1.to,'DMZ');assert.ok(h1.pts.some(p=>p[0]>3),'hairpin turns at the firewall');assert.equal(h1.pts.at(-1)[0]<0,true);
});
test('IPS: the clean download passes, the EICAR test file is dropped and the session reset',()=>{
 const ok=BY_ID.get('E1d1'),bad=BY_ID.get('E1d2'),rst=BY_ID.get('E1rst');assert.equal(ok.fate,'deliver');assert.equal(bad.fate,'drop');assert.equal(bad.dropReason,'ips');assert.ok(Math.abs(pointAt(bad,bad.t1)[0]-DPI_X)<.05);
 assert.ok(rst.t0>bad.t0);assert.equal(sessionState(SESSION_BY_ID.get('E1'),SESSION_BY_ID.get('E1').closed+.01),null);
});
test('the state table empties towards the end and starts with the first session',()=>{
 assert.equal(stateTable(9).length,0);assert.equal(stateTable(10.3)[0].id,'T0');assert.ok(stateTable(150).length>stateTable(255).length);assert.ok(stateTable(DURATION).length<=2);
});
test('kinetic words come from the analysed lyrics and all have a note',()=>{
 const ws=data.lyrics.segments.filter(l=>KINETIC_SECTIONS.has(l.section)).map(l=>word(l.text));assert.ok(ws.length>=30);for(const w of ws)assert.ok(w in WORD_NOTE,w);
});
test('camera targets, documentation addresses, log spacing, pure time',()=>{
 for(const s of SHOTS.filter(s=>s.target)){const f=BY_ID.get(s.target.slice(2));assert.ok(f,s.id);assert.ok(f.t0<s.end&&f.tEnd>s.start-.3,`${s.id} ${s.target}`);}
 for(const h of Object.values(HOSTS))assert.ok(/^(10\.|172\.16\.|192\.0\.2\.|198\.51\.100\.|203\.0\.113\.)/.test(h.ip),h.ip);assert.ok(/^203\.0\.113\./.test(PUBLIC_IP));
 for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.4);
 const a=JSON.stringify(activeFlights(120).map(f=>f.id));activeFlights(30);activeFlights(200);assert.equal(JSON.stringify(activeFlights(120).map(f=>f.id)),a);
});
