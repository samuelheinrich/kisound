import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {Timeline} from '../src/render/timeline.js';
import {radioState,position,EXCHANGES} from '../src/render/roaming.js';
import {DURATION,FPS,FRAMES,SHOTS,CHAPTERS,SOURCE_SHA256} from '../src/render/config.js';
const data=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url)));const tl=new Timeline(data);
test('source and exact duration',()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(DURATION,8490287/48000);assert.equal(FRAMES,10613);assert.ok((FRAMES-1)/FPS<DURATION&&FRAMES/FPS>DURATION);});
test('full scene coverage and correct boundaries',()=>{for(const rows of[SHOTS,CHAPTERS]){assert.equal(rows[0].start,0);assert.equal(rows.at(-1).end,DURATION);for(let i=0;i<rows.length;i++){assert.ok(rows[i].end>rows[i].start);if(i)assert.equal(rows[i-1].end,rows[i].start);}}});
test('all cues except early fade candidate assigned once',()=>{const ids=tl.shots.flatMap(s=>s.eventIds);assert.equal(ids.length,40);assert.equal(new Set(ids).size,40);assert.ok(!ids.includes('E039'));assert.equal(tl.shots.flatMap(s=>s.lyricIds).length,data.lyrics.segments.length);});
test('window centre interpolation and independent repeatable animation data',()=>{const r=data.features_100ms.rows;const t=(r[100][0]+r[101][0])/2;assert.ok(Math.abs(tl.sample(t).rms_dbfs-(r[100][1]+r[101][1])/2)<1e-8);const before=tl.sample(66.9);tl.sample(175);tl.sample(0);assert.deepEqual(tl.sample(66.9),before);});
test('late fade follows measured fall, not candidate or last voice',()=>{for(const t of[162.56,170.9,174.1,175.4])assert.equal(tl.visibility(t),1);assert.equal(tl.visibility(DURATION),0);});
test('client moves continuously, changes BSSID only on authored roams',()=>{let last=-Infinity;for(let t=0;t<DURATION;t+=.01){const x=position(t);assert.ok(x>=last-1e-8);last=x;}assert.equal(radioState(60).ap,0);assert.equal(radioState(65).ap,1);assert.equal(radioState(120).ap,2);assert.equal(radioState(160).ap,3);});
test('DFS vacates channel while retaining AP identity',()=>{const a=radioState(77),b=radioState(82),c=radioState(84);assert.equal(a.ap,b.ap);assert.equal(b.ap,c.ap);assert.equal(a.channel,52);assert.equal(c.channel,36);assert.equal(b.connected,false);assert.equal(c.connected,true);});
test('four-way sequence directions and order are explicit',()=>{const e=EXCHANGES.filter(e=>e.label.startsWith('EAPOL'));assert.equal(e.length,4);assert.deepEqual(e.map(e=>e.direction),['ap-client','client-ap','ap-client','client-ap']);e.forEach((x,i)=>{assert.ok(x.to>x.at);if(i)assert.ok(x.at>=e[i-1].to);});});

import {telemetry,dfsState,frameFlight} from '../src/render/roaming.js';
import {sequence} from '../src/render/protocol-model.js';
test('RF model coherent: dBm levels and SNR difference',()=>{
 for(let t=0;t<DURATION;t+=.17){const r=telemetry(t);assert.ok(r.rssi>=-100&&r.rssi<=-30);assert.ok(r.noiseDbm<r.rssi);assert.ok(Math.abs(r.snr-(r.rssi-r.noiseDbm))<1e-9);}
 assert.equal(telemetry(62).rssi,-72);
});
test('radar preview does not fabricate a second channel change',()=>{
 assert.equal(dfsState(43,true).moved,false);assert.equal(dfsState(77.8).detected,false);
 assert.equal(dfsState(78).stage,'RADAR DETECTED');assert.equal(dfsState(78.6).stage,'CSA / COUNTDOWN');
 assert.equal(dfsState(79).channel,radioState(79).channel);assert.equal(dfsState(84).stage,'RESUMED');
});
test('RTS/CTS and action exchanges finish within each authored insert',()=>{
 for(const shot of SHOTS.filter(s=>['rts','action'].includes(s.camera))){
  const seq=sequence(shot,shot.start+(shot.camera==='action'?shot.end-shot.start:2.4)*.98);
  assert.equal(seq.length,4);assert.ok(seq.every(e=>e.progress===1));
  assert.deepEqual(seq.map(e=>e.direction),shot.camera==='action'?['client-ap','ap-client','ap-client','client-ap']:['client-ap','ap-client','client-ap','ap-client']);
 }
});
test('packet camera reaches the AP then returns to the client',()=>{
 const t=.5/1.45,p=frameFlight(t);assert.equal(p.returning,true);assert.ok(Math.abs(p.pos[0]+4)<1e-8);assert.ok(Math.abs(p.pos[1]-4.8)<1e-8);
 const back=frameFlight(1/1.45);assert.ok(Math.abs(back.pos[0]-clientPose(1/1.45).x)<1e-8);
});
test('rapid hall editing preserves readable handshake and final title',()=>{
 assert.ok(SHOTS.length>=80);const h=SHOTS.filter(s=>s.zone==='hall'&&!['closing','sticky'].includes(s.camera));assert.ok(h.every(s=>s.end-s.start<=2.36));
 assert.equal(tl.shot(117.4).camera,'keys');assert.equal(tl.shot(119.5).camera,'roam');assert.equal(tl.shot(174).camera,'closing');
});

import {clientPose,ROAMS} from '../src/render/roaming.js';
import {FLOOR_PATH,routePoint} from '../src/render/layout.js';
test('five right-angle turns and continuous device movement through the floor plan',()=>{
 assert.equal(FLOOR_PATH.length-2,5);
 for(let i=1;i<FLOOR_PATH.length-1;i++){const a=FLOOR_PATH[i-1],b=FLOOR_PATH[i],c=FLOOR_PATH[i+1];assert.equal((b[0]-a[0])*(c[0]-b[0])+(b[1]-a[1])*(c[1]-b[1]),0);}
 let prev=clientPose(0);const segments=new Set();
 for(let t=.01;t<DURATION;t+=.01){const p=clientPose(t);assert.ok(Math.hypot(p.x-prev.x,p.z-prev.z)<.08,'no teleport');assert.ok(Number.isFinite(p.dx+p.dz));segments.add(p.segment);prev=p;}
 assert.equal(segments.size,6);
});
test('late roaming shows retries, clean target roams recover at the actual BSSID change',()=>{
 for(const e of ROAMS){const before=telemetry(e.time-.001),after=telemetry(e.time);
  assert.equal(before.ap,e.from);assert.equal(after.ap,e.to);assert.ok(Math.abs(before.rssi-e.rssi)<.01);assert.ok(after.rssi>before.rssi+12);assert.equal(after.retry,0);assert.equal(after.recentRoam,e);
  assert.equal(tl.shot(e.time).zone,'hall');
 }
 assert.ok(telemetry(62).retry>.99);assert.equal(telemetry(118.69).retry,0);
 assert.equal(telemetry(55.42).rssi,-67);
});
