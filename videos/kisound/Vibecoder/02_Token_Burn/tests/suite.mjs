// Shared checks for one version; tests/de.test.mjs and tests/en.test.mjs choose the language before importing.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const C=await import('../src/render/config.js'),{Timeline}=await import('../src/render/timeline.js'),M=await import('../src/render/model.js');
const {LANG,DURATION,FPS,FRAMES,SAMPLES,SHOTS,SHOT,CHAPTERS,SOURCE_SHA256,GAPS,FADE_START,KEYWORDS,CUTS}=C;
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const data=read(`../variants/${LANG}/ASTRA-AUDIO-ANALYSE.json`),timeline=read(`../variants/${LANG}/TIMELINE.json`),keywords=read(`../variants/${LANG}/KEYWORDS.json`),cues=read('../_revisions/REGIE-CUES-original.json'),manifest=read('../SOURCE-MANIFEST.json');
const tl=new Timeline(data),rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
test(`${LANG}: source, exact duration and 60-fps raster`,()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(data.summary.samples_per_channel,SAMPLES);assert.equal(DURATION,SAMPLES/48000);
 assert.equal(FRAMES,Math.ceil(DURATION*FPS));assert.equal(FRAMES,manifest.variants[LANG].frames_60fps);assert.ok(Math.abs(DURATION-manifest.variants[LANG].duration_s)<1e-9);});
test(`${LANG}: the 58 shots keep the start times of the screenplay and cover the track without gaps`,()=>{
 assert.equal(SHOTS.length,58);assert.equal(cues.shots.length,58);cues.shots.forEach((c,i)=>{assert.equal(SHOTS[i].id,c.id);assert.equal(SHOTS[i].start,c.starts_s[LANG],c.id);assert.equal(SHOTS[i].zone,c.zone);assert.equal(SHOTS[i].mode,c.mode);});
 timeline.shots.forEach((s,i)=>{assert.equal(SHOTS[i].start,s.start_s,s.id);assert.ok(Math.abs(SHOTS[i].end-s.end_s)<1e-6,s.id);});
 for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test(`${LANG}: every analysis event and lyric start lands in exactly one shot, as in TIMELINE.json`,()=>{const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);
 assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);assert.equal(new Set(ly).size,ly.length);
 timeline.shots.forEach((s,i)=>{assert.deepEqual(tl.shots[i].eventIds,s.analysis_event_ids,s.id);assert.deepEqual(tl.shots[i].lyricIds.map(id=>data.lyrics.segments.find(l=>l.id===id).source_segment_id),s.lyrics_starting_here.map(l=>l.id),s.id);});});
test(`${LANG}: six TOKEN BURN hits at their ASR anchors, each readable for at least 0.9 s`,async()=>{const {envelope,ENTRY,EXIT}=await import('../src/render/type.js');
 assert.equal(KEYWORDS.length,6);keywords.keywords.forEach((k,i)=>{const K=KEYWORDS[i];assert.equal(K.id,k.id);assert.equal(K.shot,k.shot_id);assert.equal(K.start,k.start_s);assert.equal(K.visualEnd,k.visual_end_s);
  const s=SHOT[K.shot];assert.equal(s.start,K.start,`${K.id} starts its shot`);const steady=(s.end-EXIT)-(K.start+ENTRY);assert.ok(steady>=.9,`${K.id} steady ${steady}`);assert.ok(s.end-EXIT>=K.visualEnd,`${K.id} stays until visual_end`);
  assert.equal(envelope(K.id,K.start+ENTRY+.01).alpha,1);assert.equal(envelope(K.id,s.end-EXIT-.01).alpha,1);});});
test(`${LANG}: gaps and the end follow the measurements`,()=>{const ri=col('rms_dbfs');for(const[a,b]of GAPS)assert.ok(Math.min(...rows.filter(r=>r[0]>=a&&r[0]<=b).map(r=>r[ri]))<-30,String(a));
 assert.ok(Math.abs(FADE_START-data.events.find(e=>e.type==='fade_candidate').time_s)<1e-6);assert.equal(tl.visibility(DURATION),0);assert.ok(tl.visibility(FADE_START-.01)>.99);
 let last=1;for(let t=FADE_START;t<=DURATION;t+=.05){const v=tl.visibility(t);assert.ok(v<=last+1e-9,'end fade is monotonic');last=v;}});
test(`${LANG}: requests in order and finished in the shots of the screenplay`,()=>{const where={P01:'S007',P02:'S013',P03:'S023',P04:'S031',P05:'S039'};
 for(const j of M.JOBS){assert.ok(j.typed<j.sent&&j.sent<j.done,j.id);if(where[j.id]){const s=SHOT[where[j.id]];assert.ok(j.done>=s.start&&j.done<s.end,`${j.id} done in ${where[j.id]}`);}}
 assert.equal(M.JOB.P06.done,Infinity,'P06 is still running at the end');assert.ok(M.JOB.P06.sent>=SHOT.S055.start&&M.JOB.P06.sent<SHOT.S055.end,'SEND in S055');assert.ok(M.JOB.P06.typed>=SHOT.S054.start);});
test(`${LANG}: bass bug – empty after the first reload, the fix line comes before the passing test`,()=>{
 assert.equal(M.bassCount(SHOT.S009.start),0);assert.equal(M.bassCount(SHOT.S009.end-.01),4,'second voice: four bass steps in S009');assert.equal(M.bassCount(M.RELOAD1-.01),4);
 for(let t=M.RELOAD1;t<M.RELOAD2;t+=.1)assert.equal(M.bassCount(t),0,'bass empty after reload until the fixed load path runs');
 assert.ok(M.RELOAD1>=SHOT.S011.start&&M.RELOAD1<SHOT.S011.end);assert.ok(M.FIX_LINE>=SHOT.S012.start&&M.FIX_LINE<SHOT.S012.end);assert.ok(M.FIX_LINE<M.RELOAD2&&M.RELOAD2<M.COMPARE2&&M.COMPARE2<M.PASS2);
 assert.equal(M.bassCount(M.PASS2),4);assert.deepEqual(M.saved(SHOT.S011.start).bass,M.BASS,'saved.tracks.bass holds the four steps');
 for(let t=M.PASS2;t<DURATION;t+=1)assert.equal(M.bassCount(t),4,'pattern storage from P02 stays');});
test(`${LANG}: export – three lanes until the fix, PASS only after all 64 steps are compared`,()=>{const E=M.EXPORT;
 assert.equal(M.exportState(SHOT.S030.start+.01),LANG==='en'?'failed':'notReady');assert.equal(M.exportLanes(E.fix-.01),3);assert.equal(M.exportLanes(E.fix),4);
 assert.ok(E.fix<E.compare&&E.compare+1.2<=E.ready,'the 64-step comparison completes before the file is ready');assert.ok(E.ready<SHOT.S031.end);assert.equal(M.exportState(SHOT.S032.start),'ready');});
test(`${LANG}: the desk clock shows 01:00, 02:00, 03:00 in their shots and never runs backwards`,()=>{
 for(const[id,txt]of[['S007','01:00'],['S014','02:00'],['S028','03:00']])for(let t=SHOT[id].start;t<SHOT[id].end;t+=.2)assert.equal(M.clockText(t),txt,id);
 let last=-1;for(let t=0;t<=DURATION;t+=.25){const m=M.clockMinutes(t);assert.ok(m>=last);last=m;}});
test(`${LANG}: tabs – one closes, two open, three times; the count grows by one each time`,()=>{assert.equal(M.tabs(0).length,3);
 for(const[id,n]of[['S024',4],['S040',5],['S051',6]]){assert.equal(M.tabs(SHOT[id].start).length,n-1);assert.equal(M.tabs(SHOT[id].end-.01).length,n);const ev=M.TABS.filter(e=>e[0]>=SHOT[id].start&&e[0]<SHOT[id].end).map(e=>e[1]);assert.deepEqual(ev,['close','open','open']);}});
test(`${LANG}: usage is cumulative and fictional – input and output separate, never reset`,()=>{let last=-1;for(let t=0;t<=DURATION;t+=.1){const u=M.usage(t);assert.ok(u.total>=last);assert.equal(u.total,u.input+u.output);last=u.total;}
 const after5=M.usage(M.JOB.P05.done);assert.equal(after5.total,22600);assert.equal(after5.credits,27.58);const end=M.usage(DURATION);assert.ok(end.total<=32300&&end.output-after5.output<=1900);assert.ok(end.credits<=39.18);
 assert.deepEqual(M.JOBS.map(j=>j.input+j.output),[1600,3000,4000,6000,8000,9700]);assert.ok(M.STRINGS[LANG].demo.startsWith('DEMO'));});
test(`${LANG}: in S050 export, settings and preview carry the same version`,()=>{const t=(SHOT.S050.start+SHOT.S050.end)/2;assert.equal(M.version(t),'v0.8');assert.equal(M.exportState(t),'ready');assert.ok(M.settingsSaved(t));});
test(`${LANG}: chapters start at shot boundaries`,()=>{for(const c of CHAPTERS)assert.equal(c.start,SHOT[c.shot].start);assert.equal(CHAPTERS.length,13);});
test(`${LANG}: time determinism of the model`,()=>{for(const t of[3,47.3,96,150.2,201,DURATION]){const a=JSON.stringify([M.usage(t),M.tabs(t),M.pattern(t),M.clockText(t)]);M.usage(100);M.tabs(12);assert.equal(JSON.stringify([M.usage(t),M.tabs(t),M.pattern(t),M.clockText(t)]),a);}});
