import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as C from '../src/render/config.js';
import {Timeline} from '../src/render/timeline.js';
import * as M from '../src/render/model.js';

const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const analysis=read(`../variants/${C.LANG}/ASTRA-AUDIO-ANALYSE.json`),source=read('../SOURCE-MANIFEST.json'),screenplay=read('../REGIE-CUES.json');
const tl=new Timeline(analysis),manifest=source.variants[C.LANG];
const mid=id=>(C.SHOT[id].start+C.SHOT[id].end)/2;

test(`${C.LANG}: final audio, analysis and 60-fps duration agree`,()=>{
 assert.equal(analysis.source.sha256,C.SOURCE_SHA256);assert.equal(analysis.summary.samples_per_channel,C.SAMPLES);
 assert.equal(C.DURATION,C.SAMPLES/48000);assert.equal(C.FRAMES,Math.ceil(C.DURATION*C.FPS));
 assert.equal(manifest.frames_60fps,C.FRAMES);assert.equal(manifest.duration_s,C.DURATION);
 assert.equal(analysis.source.transcript_sha256,manifest.inputs.transcript.sha256);
});
test(`${C.LANG}: all 72 authored cuts are used in order and cover the WAV`,()=>{
 assert.equal(C.SHOTS.length,72);assert.equal(screenplay.shots.length,72);
 assert.equal(C.SHOTS[0].start,0);assert.equal(C.SHOTS.at(-1).end,C.DURATION);
 C.SHOTS.forEach((s,i)=>{const q=screenplay.shots[i];assert.equal(s.id,q.id);assert.equal(s.start,q.starts_s[C.LANG]);assert.equal(s.end,q.ends_s[C.LANG]);assert.equal(s.zone,q.zone);assert.equal(s.mode,q.mode);assert.ok(s.end>s.start);if(i)assert.equal(C.SHOTS[i-1].end,s.start);});
 assert.equal(C.CHAPTERS.length,11);assert.equal(C.CHAPTERS[0].start,0);assert.equal(C.CHAPTERS.at(-1).end,C.DURATION);
});
test(`${C.LANG}: every measured event and lyric starts in exactly one cut`,()=>{
 const events=tl.shots.flatMap(s=>s.eventIds),lyrics=tl.shots.flatMap(s=>s.lyricIds);
 assert.equal(events.length,analysis.events.length);assert.equal(lyrics.length,analysis.lyrics.segments.length);
 assert.equal(new Set(events).size,events.length);assert.equal(new Set(lyrics).size,lyrics.length);
 tl.shots.forEach((s,i)=>{assert.deepEqual(s.eventIds,screenplay.shots[i].events[C.LANG],s.id);assert.deepEqual(s.lyricIds,screenplay.shots[i].cues[C.LANG].map(n=>`L${String(n).padStart(3,'0')}`),s.id);});
});
test(`${C.LANG}: catalog, pattern and app only pass after their on-screen proof`,()=>{
 assert.equal(M.clock(mid('S028')),'08:00');assert.equal(M.clock(mid('S029')),'12:00');
 assert.equal(M.clock(mid('S038')),'20:00');assert.equal(M.clock(mid('S066')),'22:00');
 assert.equal(M.catalog(mid('S009')),'stuck');assert.equal(M.testState(mid('S013'),'file'),'pass');
 assert.equal(M.testState(mid('S013'),'status'),'wait');assert.equal(M.testState(mid('S014'),'status'),'pass');
 assert.equal(M.catalog(mid('S023')),'edge_fail');assert.equal(M.testState(mid('S023'),'edge'),'fail');
 assert.equal(M.catalog(mid('S026')),'verified');assert.equal(M.testState(mid('S026'),'edge'),'pass');
 assert.equal(M.pattern(mid('S031')),'sketch');assert.equal(M.pattern(mid('S037')),'ready');
 assert.equal(M.app(mid('S043')),'lost');assert.equal(M.app(mid('S044')),'wrong_key');assert.equal(M.app(mid('S045')),'wrong_selection');
 assert.equal(M.testState(mid('S045'),'reload'),'fail');assert.equal(M.app(mid('S047')),'verified');assert.equal(M.testState(mid('S047'),'reload'),'pass');
});
test(`${C.LANG}: film state is independent of seek order`,()=>{
 for(const t of[2,35,61,89,117,142,159,173,C.DURATION-.2]){
  const a=JSON.stringify(M.filmState(t));M.filmState(208);M.filmState(13);M.filmState(116);assert.equal(JSON.stringify(M.filmState(t)),a);
 }
});
test(`${C.LANG}: measured level and vocal end control the closing, with no early black`,()=>{
 const last=analysis.events.find(e=>e.type==='last_vocal_end');assert.equal(last.time_s,C.LAST_VOCAL);
 assert.equal(analysis.events.find(e=>e.type==='fade_candidate').time_s,C.FADE_CANDIDATE);
 assert.equal(tl.atmosphere(C.FADE_CANDIDATE),1);assert.equal(tl.atmosphere(C.DURATION),0);
 assert.ok(tl.visibility(C.LAST_VOCAL-.01)>.7);assert.equal(tl.visibility(C.DURATION),0);
 for(const drop of C.DROPS){const rows=analysis.features_100ms.rows,col=analysis.features_100ms.columns.indexOf('sub_20_60_drive');
  const mean=(a,b)=>{const v=rows.filter(r=>r[0]>=drop+a&&r[0]<=drop+b).map(r=>r[col]);return v.reduce((x,y)=>x+y,0)/v.length;};
  const before=mean(-1.6,-.3),after=mean(-.1,.6);
  const peak=Math.max(...rows.filter(r=>r[0]>=drop-.1&&r[0]<=drop+.6).map(r=>r[col]));
  assert.ok(before<.2,`${drop} before`);assert.ok(peak>.55&&after>.4&&after-before>.35,`${drop} after`);}
});
test(`${C.LANG}: dialogue is assigned to the bridge, final request remains open`,()=>{
 assert.equal(M.bridgeText(mid('S051')).who,'HARD CODER');assert.equal(M.bridgeText(mid('S052')).who,'VIBECODER');
 assert.equal(M.bridgeText(mid('S054')).who,'HARD CODER');assert.equal(M.bridgeText(mid('S055')).who,'VIBECODER');
 assert.ok(M.filmState(mid('S062')).nextOpen);assert.ok(M.filmState(mid('S066')).nextOpen);
 if(C.LANG==='en'){
  const uncertain=analysis.lyrics.segments.find(s=>s.start_s===203.74);assert.ok(uncertain?.review_required);
  assert.ok(uncertain.start_s>=C.SHOT.S062.start&&uncertain.start_s<C.SHOT.S062.end);
  const drawn=fs.readFileSync(new URL('../src/render/draw.js',import.meta.url),'utf8');assert.ok(!drawn.includes('Break it down'));
 }
});
