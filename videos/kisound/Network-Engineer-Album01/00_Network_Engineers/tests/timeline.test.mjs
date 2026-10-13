import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { Timeline } from '../src/render/timeline.js';
import { DURATION,FPS,FRAMES,SHOTS,CHAPTERS,SOURCE_SHA256,ACTIONS } from '../src/render/config.js';
const analysis=JSON.parse(fs.readFileSync(new URL('../ASTRA-AUDIO-ANALYSE.json',import.meta.url)));
const tl=new Timeline(analysis);
test('source identity, exact duration and final frame',()=>{
 assert.equal(analysis.source.sha256,SOURCE_SHA256);
 assert.equal(DURATION,9960968/48000);assert.equal(FRAMES,12452);
 assert.ok((FRAMES-1)/FPS<DURATION);assert.ok(FRAMES/FPS>=DURATION);
});
test('shots and chapters cover the entire audio without gaps',()=>{
 for(const rows of [SHOTS,CHAPTERS]){
  assert.equal(rows[0].start,0);assert.equal(rows.at(-1).end,DURATION);
  rows.forEach((r,i)=>{assert.ok(r.end>r.start);if(i)assert.equal(rows[i-1].end,r.start);});
 }
 assert.equal(tl.shot(DURATION).id,SHOTS.at(-1).id);
});
test('all authored events exist and occur within their associated shot',()=>{
 const seen=new Set();
 for(const shot of SHOTS){
  for(const id of shot.eventIds){
   const e=tl.event(id);assert.ok(e,id);assert.ok(e.time_s>=shot.start-.0001&&e.time_s<=shot.end+.0001,`${id} outside ${shot.id}`);
   assert.ok(!seen.has(id),`duplicate ${id}`);seen.add(id);
  }
  for(const id of shot.lyricIds){const l=tl.lyric(id);assert.ok(l);assert.ok(l.start_s>=shot.start-.0001&&l.start_s<shot.end);}
 }
 for(const id of Object.keys(ACTIONS))assert.ok(seen.has(id),id);
 assert.ok(!seen.has('E038'));assert.equal(seen.size,analysis.events.length-1);
});
test('interpolation uses original window centres, including the last short row',()=>{
 const rows=analysis.features_100ms.rows,mid=(rows[70][0]+rows[71][0])/2;
 assert.ok(Math.abs(tl.sample(mid).rms_dbfs-(rows[70][1]+rows[71][1])/2)<1e-8);
 assert.equal(tl.sample(0).rms_dbfs,rows[0][1]);
 for(const t of [0,.05,22.82,133.8,206.1,DURATION])for(const [key,value] of Object.entries(tl.sample(t)))assert.ok(value===null||Number.isFinite(value),key);
});
test('seeking backwards cannot change animation data or network state',()=>{
 const before={sample:tl.sample(70),pulse:tl.pulse(91.2,['E017']),network:tl.network(70)};
 for(const t of [190,0,140,23,207]){tl.sample(t);tl.pulse(t,['E017']);tl.network(t);}
 assert.deepEqual({sample:tl.sample(70),pulse:tl.pulse(91.2,['E017']),network:tl.network(70)},before);
 assert.equal(tl.pulse(91.16,['E017']),0);assert.equal(tl.pulse(91.161,['E017']),1);
});
test('closing fade follows the late measured fall, not end of vocals or candidate E038',()=>{
 for(const t of [163.18,178.6,198.6,201.6,205.5,206.1])assert.equal(tl.visibility(t),1);
 assert.ok(tl.visibility(206.7)>0&&tl.visibility(206.7)<1);assert.equal(tl.visibility(DURATION),0);
});
test('recovered service uses alternate path while primary stays isolated',()=>{
 assert.equal(tl.network(40).fault,0);assert.equal(tl.network(80).fault,1);
 assert.equal(tl.network(80).failover,1);assert.equal(tl.network(80).recovered,1);
 assert.equal(tl.network(120).online,1);assert.equal(tl.network(125).verified,1);
});
