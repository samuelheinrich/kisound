import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {DURATION,FPS,FRAMES,SAMPLES,SHOTS,CHAPTERS,SOURCE_SHA256,SOURCE_START,T_SPT,DROPS,FADE_START} from '../src/render/config.js';
import {EDGES,SEGMENTS,SEATS,CORES,KEY,SILENT,MEMBERSHIP,MESSAGES,LOGS,LMQ,SPT_JOIN,SPT_PRUNE,REGISTER,REGISTER_STOP,HOOK_TARGETS,hookWord,packets,receiving,member,edgeOn,within,seatId,counters,mroute,pickSeat,SHOT_SEATS} from '../src/render/model.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url)));const tl=new Timeline(data);
const range=(a,b,step)=>Array.from({length:Math.floor((b-a)/step)+1},(_,i)=>a+i*step);

test('source, exact duration and frame raster',()=>{
 assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(SAMPLES,12508808);assert.equal(DURATION,12508808/48000);
 assert.ok(Math.abs(data.summary.duration_s-DURATION)<1e-6);assert.equal(FRAMES,15637);assert.ok((FRAMES-1)/FPS<DURATION&&FRAMES/FPS>DURATION);
});
test('chapters and shots cover the whole track without gaps',()=>{
 for(const rows of[SHOTS,CHAPTERS]){assert.equal(rows[0].start,0);assert.equal(rows.at(-1).end,DURATION);rows.forEach((r,i)=>{assert.ok(r.end>r.start,r.id);if(i)assert.equal(rows[i-1].end,r.start);});}
 for(const s of SHOTS)assert.ok(['arena','compare','segment'].includes(s.zone),s.id);
});
test('every analysis event and every lyric segment lands in exactly one shot',()=>{
 const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);
 assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,data.events.length);
 assert.equal(ly.length,data.lyrics.segments.length);assert.equal(new Set(ly).size,ly.length);
});
test('register phase: the source reaches only R1 until a receiver exists',()=>{
 assert.ok(REGISTER[0]>SOURCE_START&&REGISTER[1]<=REGISTER_STOP[0]);
 for(const t of range(SOURCE_START,31.29,.05)){for(const e of Object.values(EDGES))if(e.kind==='l3'&&e.id!=='SRC>R1'&&e.from==='R1')assert.equal(within(e.on,t),false,`${e.id} @ ${t}`);assert.ok(packets(t).every(p=>p.edge.id==='SRC>R1'),`data beyond R1 @ ${t}`);assert.equal(SEATS.filter(s=>receiving(s.id,t)).length,0);}
 assert.equal(edgeOn('SRC>R1',SOURCE_START-.01),false);assert.equal(edgeOn('SRC>R1',SOURCE_START),true);
});
test('first stream leaves R1 on the measured drop and reaches the first receiver right after E010',()=>{
 assert.equal(EDGES['R1>R2'].on[0][0],31.3);assert.ok(Math.abs(DROPS[0]-31.3)<.1);
 const h=seatId(KEY.first);let t=31.3;while(!receiving(h.id,t))t+=.01;const e010=data.events.find(e=>e.id==='E010').time_s;
 assert.ok(t>e010&&t<e010+1.5,`arrival ${t}`);
});
test('stadium: 288 receivers in 28 segments; schedule consistent; silent segments never fed',()=>{
 assert.equal(SEATS.length,288);assert.equal(SEGMENTS.length,28);assert.equal(CORES.length,4);
 for(const[id,list]of MEMBERSHIP)list.forEach((m,i)=>{assert.ok(m.leave>m.join,id);if(i)assert.ok(m.join>=list[i-1].leave,id);});
 assert.equal(SILENT.size,3);for(const i of SILENT){const seg=SEGMENTS[i];assert.equal(seg.seats.some(s=>MEMBERSHIP.has(s.id)),false);assert.deepEqual(EDGES[`${seg.router}>${seg.switch}`].on,[]);}
 // the back half (R3, R4) stays dark until the verse-2 join climbs the core ring
 const back=SEATS.filter(s=>s.core==='R3'||s.core==='R4');assert.ok(back.every(s=>!(MEMBERSHIP.get(s.id)||[]).some(m=>m.join<117.18)));
 assert.ok(counters(250).listening>=180);assert.ok(new Set(SEATS.filter(s=>MEMBERSHIP.has(s.id)).map(s=>s.tier)).size===3);
});
test('no forwarding toward segments, ports or routers without members',()=>{
 for(const t of range(0,DURATION,.25)){
  for(const seg of SEGMENTS){
   for(const s of seg.seats){if(!edgeOn(`${seg.switch}>${s.id}`,t))continue;const list=MEMBERSHIP.get(s.id);assert.ok(list.some(m=>t>=m.join&&t<m.leave+LMQ),`${s.id} @ ${t}`);}
   if(edgeOn(`${seg.router}>${seg.switch}`,t))assert.ok(seg.seats.some(s=>edgeOn(`${seg.switch}>${s.id}`,t)||(MEMBERSHIP.get(s.id)||[]).some(m=>t>=m.join&&t<m.leave+LMQ)),`${seg.switch} @ ${t}`);
  }
 }
});
test('state built by a join is fed with data once the join has climbed (no orphaned branches)',()=>{
 // Joins climb upward, so downstream state may exist briefly before its upstream forwards (first join: 4.7 s).
 for(const e of Object.values(EDGES))for(const[a,b]of e.on){const probe=Math.min(b,a+5)-.01;if(probe<=a)continue;assert.ok(e.routes.some(r=>r.edges.every(x=>within(x.on,probe))),`${e.id} @ ${a}`);}
 for(const t of range(SOURCE_START,DURATION-.1,.5))for(const p of packets(t))assert.ok(p.u>=-1e-9&&p.u<=p.edge.length+1e-9);
});
test('SPT switchover: R3, R4, R5 move from the ring to R1 without a gap for their receivers',()=>{
 for(const c of['R3','R4','R5']){assert.equal(edgeOn(`R1>${c}`,SPT_JOIN-.01),false,c);assert.equal(edgeOn(`R1>${c}`,SPT_JOIN),true,c);}
 for(const id of['R2>R3','R3>R4','R2>R5']){assert.equal(edgeOn(id,SPT_PRUNE-.01),true,id);assert.equal(edgeOn(id,SPT_PRUNE+2*.45+.01),false,id);assert.equal(MESSAGES.find(m=>m.kind==='prune'&&m.edge===id).label,'(S,G,rpt) PRUNE');}
 assert.ok(SPT_JOIN>T_SPT&&SPT_PRUNE>SPT_JOIN);
 for(const k of[KEY.verse2,KEY.verse2b])for(const t of range(130,145,.01))assert.ok(receiving(seatId(k).id,t),`${k} @ ${t}`);
 assert.equal(mroute('R3',140).sg.iif,'R1');assert.equal(mroute('R3',125).star.iif,'R2');assert.equal(mroute('R4',125).star.iif,'R3');
});
test('verse 2: the join from the back half climbs the core ring to the RP',()=>{
 const joins=MESSAGES.filter(m=>m.kind==='join'&&m.t0>117&&m.t0<120.2).map(m=>`${m.from}>${m.to}`);
 const seg=SEGMENTS[seatId(KEY.verse2).seg];assert.deepEqual(joins,[`${seg.router}>R4`,'R4>R3','R3>R2']);
});
test('leave in the hook removes one port; the segment keeps listening',()=>{
 const h=seatId(KEY.hookLeave),seg=SEGMENTS[h.seg],leave=130.1;assert.ok(member(h,leave-.01));assert.ok(!member(h,leave));
 assert.ok(edgeOn(`${seg.switch}>${h.id}`,leave+LMQ-.01));assert.ok(!edgeOn(`${seg.switch}>${h.id}`,leave+LMQ+.01));assert.ok(edgeOn(`${seg.router}>${seg.switch}`,leave+5));
 assert.ok(MESSAGES.some(m=>m.kind==='query'&&m.edge===`${seg.switch}>${h.id}`&&m.t0>leave&&m.t0<leave+1),'group-specific query reaches the leaving port');
});
test('every POV camera target resolves to a live receiver in the requested tier and core',()=>{
 for(const s of SHOTS.filter(s=>['chase','ride','flyby'].includes(s.camera))){
  const h=SHOT_SEATS.get(s.id);if(s.target.startsWith('key:'))continue;
  const[,tier,core]=s.target.split(':');assert.ok(receiving(h.id,s.start+.01),`${s.id} ${h.id}`);if(tier!=='any')assert.equal(h.tier,tier,s.id);if(core!=='any')assert.equal(h.core,core,s.id);
 }
 const targets=SHOTS.filter(s=>['chase','ride','flyby'].includes(s.camera)).map(s=>SHOT_SEATS.get(s.id).id);
 assert.ok(targets.length>=20);assert.equal(new Set(targets).size,targets.length,'no POV path repeats');
});
test('PIM joins arrive exactly when forwarding starts on their edge',()=>{
 for(const e of Object.values(EDGES)){if(e.kind!=='l3'||e.id==='SRC>R1')continue;for(const[a]of e.on)assert.ok(MESSAGES.some(m=>m.kind==='join'&&m.edge===e.id&&m.reverse&&Math.abs(m.t1-a)<1e-9),`${e.id} @ ${a}`);}
});
test('packets and counters are pure functions of absolute time',()=>{
 const key=t=>packets(t).map(p=>`${p.edge.id}:${p.n}:${p.u.toFixed(6)}`).join('|');
 const a=key(140.5);packets(30);packets(250);packets(12);assert.equal(key(140.5),a);assert.ok(packets(140.5).length>300);
 assert.deepEqual(counters(200),counters(200));assert.equal(counters(10).copies,0);assert.equal(counters(200).copies,1);
});
test('hook words come from the analysed lyrics and all have a target',()=>{
 const words=data.lyrics.segments.filter(l=>l.section==='Hook').map(l=>hookWord(l.text));
 assert.deepEqual(words,Object.keys(HOOK_TARGETS));
});
test('fade starts at the measured end fall, not at the last vocal or the fade candidate',()=>{
 const e050=data.events.find(e=>e.id==='E050').time_s;assert.ok(FADE_START>e050);
 for(const t of[3,209.7,e050,FADE_START])assert.equal(tl.visibility(t),1);assert.equal(tl.visibility(DURATION),0);
});
test('syslog stays readable during fast waves',()=>{for(let i=1;i<LOGS.length;i++)assert.ok(LOGS[i].time_s-LOGS[i-1].time_s>=.45);});
