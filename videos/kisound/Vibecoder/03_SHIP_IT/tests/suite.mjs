// Shared checks for one version; tests/de.test.mjs and tests/en.test.mjs choose the language before importing.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const C=await import('../src/render/config.js'),{Timeline}=await import('../src/render/timeline.js'),M=await import('../src/render/model.js');
const {LANG,DURATION,FPS,FRAMES,SAMPLES,SHOTS,SHOT,CHAPTERS,SOURCE_SHA256,GAPS,GAP_LIMIT,FADE_START,DROPS,DROP_MIN,TITLE_HOOKS}=C;
const read=p=>JSON.parse(fs.readFileSync(new URL(p,import.meta.url),'utf8'));
const data=read(`../variants/${LANG}/ASTRA-AUDIO-ANALYSE.json`),timeline=read(`../variants/${LANG}/TIMELINE.json`),keywords=read(`../variants/${LANG}/KEYWORDS.json`),cues=read('../_revisions/REGIE-CUES-original.json'),manifest=read('../SOURCE-MANIFEST.json');
const tl=new Timeline(data),rows=data.features_100ms.rows,col=k=>data.features_100ms.columns.indexOf(k);
const inShot=(x,id)=>x>=SHOT[id].start&&x<SHOT[id].end;
test(`${LANG}: source, exact duration and 60-fps raster`,()=>{assert.equal(data.source.sha256,SOURCE_SHA256);assert.equal(data.summary.samples_per_channel,SAMPLES);assert.equal(DURATION,SAMPLES/48000);
 assert.equal(FRAMES,Math.ceil(DURATION*FPS));assert.equal(FRAMES,manifest.variants[LANG].frames_60fps);assert.ok(Math.abs(DURATION-manifest.variants[LANG].duration_s)<1e-9);assert.equal(timeline.source_audio_sha256,SOURCE_SHA256);});
test(`${LANG}: the 34 shots keep the start times of the screenplay and cover the track without gaps`,()=>{
 assert.equal(SHOTS.length,34);assert.equal(cues.shots.length,34);cues.shots.forEach((c,i)=>{assert.equal(SHOTS[i].id,c.id);assert.equal(SHOTS[i].start,c.starts_s[LANG],c.id);assert.equal(SHOTS[i].zone,c.zone);assert.equal(SHOTS[i].mode,c.mode);});
 timeline.shots.forEach((s,i)=>{assert.equal(SHOTS[i].start,s.start_s,s.id);assert.ok(Math.abs(SHOTS[i].end-s.end_s)<1e-6,s.id);});
 for(const r of[SHOTS,CHAPTERS]){assert.equal(r[0].start,0);assert.equal(r.at(-1).end,DURATION);r.forEach((x,i)=>{assert.ok(x.end>x.start,x.id);if(i)assert.equal(r[i-1].end,x.start);});}});
test(`${LANG}: every analysis event and lyric start lands in exactly one shot, as in TIMELINE.json`,()=>{const ev=tl.shots.flatMap(s=>s.eventIds),ly=tl.shots.flatMap(s=>s.lyricIds);
 assert.equal(ev.length,data.events.length);assert.equal(new Set(ev).size,ev.length);assert.equal(ly.length,data.lyrics.segments.length);assert.equal(new Set(ly).size,ly.length);
 // the analysis leaves out source segments it marks as excluded (EN: one strongly overlapping 'Tracks.'); they are never shown
 const excluded=new Set((data.lyrics.excluded_source_segments||[]).map(x=>x.id));
 timeline.shots.forEach((s,i)=>{assert.deepEqual(tl.shots[i].eventIds,s.analysis_event_ids,s.id);assert.deepEqual(tl.shots[i].lyricIds.map(id=>data.lyrics.segments.find(l=>l.id===id).source_segment_id),s.lyrics_starting_here.map(l=>l.id).filter(id=>!excluded.has(id)),s.id);});
 assert.equal(timeline.shots.flatMap(s=>s.lyrics_starting_here).length,data.lyrics.segments.length+excluded.size);});
test(`${LANG}: sung hooks start at their ASR anchor, every title is readable for at least 0.9 s and only shown where the mark can stand`,async()=>{
 const {envelope,ENTRY,EXIT,hookAt}=await import('../src/render/type.js');
 const anchored=TITLE_HOOKS.filter(h=>h.anchor);assert.deepEqual(anchored.map(h=>h.id),keywords.keywords.map(k=>k.id),'one title per KEYWORDS.json anchor');
 for(const k of keywords.keywords){const h=TITLE_HOOKS.find(x=>x.id===k.id);assert.equal(h.start,Math.max(k.start_s,SHOT[h.shot].start),`${k.id} starts at its anchor`);assert.equal(h.shot,k.shot_id,`${k.id} in ${k.shot_id}`);}
 const titleShots=new Set(['S002','S010','S022','S011','S012','S023','S024','S030','S031','S033']);
 TITLE_HOOKS.forEach((h,i)=>{const steady=(h.until-EXIT)-(h.start+ENTRY);assert.ok(steady>=.9,`${h.id} steady ${steady.toFixed(2)} s`);
  if(i)assert.ok(TITLE_HOOKS[i-1].until<=h.start,`${h.id} does not overlap the previous title`);
  for(let t=h.start;t<h.until;t+=.05)assert.ok(titleShots.has(tl.shot(t).id),`${h.id} at ${t.toFixed(2)} in a shot that carries the mark`);
  assert.equal(envelope(h,h.start+ENTRY+.01).alpha,1);assert.equal(envelope(h,h.until-EXIT-.01).alpha,1);assert.equal(hookAt(h.start+.5).id,h.id);});
 for(const k of keywords.keywords)if(k.review_required)assert.ok(TITLE_HOOKS.find(h=>h.id===k.id),'review-marked hooks stay titles, never subtitles');});
test(`${LANG}: gaps, drops and the end follow the measurements`,()=>{const ri=col('rms_dbfs'),si=col('sub_20_60_drive');
 for(const[a,b]of GAPS)assert.ok(Math.min(...rows.filter(r=>r[0]>=a&&r[0]<=b).map(r=>r[ri]))<GAP_LIMIT,`gap ${a}`);
 const mean=(t,a,b)=>{const v=rows.filter(r=>r[0]>=t+a&&r[0]<=t+b).map(r=>r[si]);return v.reduce((x,y)=>x+y,0)/v.length;};
 const found=[];for(const r of rows){const t=r[0];if(t<1.6)continue;if(mean(t,-1.6,-.3)<.2&&mean(t,-.1,.6)>DROP_MIN&&(!found.length||t-found.at(-1)>2))found.push(+t.toFixed(2));}
 assert.deepEqual(DROPS,found,'drops = every measured sub-bass re-entry');
 const last=data.events.find(e=>e.type==='last_vocal_end').time_s;assert.equal(FADE_START,last,'the fade starts after the last transcribed vocal');assert.ok(data.lyrics.segments.every(l=>l.end_s<=FADE_START+1e-9));
 assert.equal(tl.visibility(DURATION),0);assert.ok(tl.visibility(FADE_START-.01)>.99);let v0=1;for(let t=FADE_START;t<=DURATION;t+=.02){const v=tl.visibility(t);assert.ok(v<=v0+1e-9,'end fade is monotonic');v0=v;}});
test(`${LANG}: the release states run in the order of the screenplay, each event in its shot`,()=>{
 let last=0;for(let t=0;t<=DURATION;t+=.02){const i=M.STATE_ORDER.indexOf(M.releaseState(t));assert.ok(i>=last,`state goes back at ${t.toFixed(2)}`);last=i;}
 const where={ENTER_BUILD:'S005',BUILD_PASS:'S005',ENTER_CHECK1:'S006',CHECK_FAIL:'S006',UNDERSCORE_FLASH:'S008',ENTER_MV:'S008',PATH_FIXED:'S008',ENTER_CHECK2:'S009',CHECK_PASS:'S009',ENTER_COMMIT:'S009',COMMIT:'S009',
  ENTER_DEPLOY:'S016',UPLOAD_DONE:'S017',RELOAD1:'S018',HARD_RELOAD:'S019',NEW_PAGE:'S019',DE_OK:'S020',SWITCH_EN:'S020',EN_OK:'S020',LYRIC_SAME:'S021',LIVE_VERIFIED:'S021',LINK_COPIED:'S025',PLAY:'S026',NEXT_NOTE:'S033',TRACKS_READY:'S003'};
 for(const[k,id]of Object.entries(where))assert.ok(inShot(M[k],id),`${k} ${M[k].toFixed(2)} in ${id}`);
 const order=['TRACKS_READY','ENTER_BUILD','BUILD_PASS','ENTER_CHECK1','CHECK_FAIL','ENTER_MV','PATH_FIXED','ENTER_CHECK2','CHECK_PASS','ENTER_COMMIT','COMMIT','ENTER_DEPLOY','UPLOAD_DONE','RELOAD1','HARD_RELOAD','NEW_PAGE','DE_OK','SWITCH_EN','EN_OK','LIVE_VERIFIED','LINK_COPIED','PLAY','NEXT_NOTE'];
 order.forEach((k,i)=>{if(i)assert.ok(M[order[i-1]]<M[k],`${order[i-1]} before ${k}`);});});
test(`${LANG}: no station claims a later state – build before check, check passes only after the fix, LIVE only after the browser check`,()=>{
 for(let t=0;t<=DURATION;t+=.02){const s=M.stations(t);
  for(let i=1;i<4;i++)if(s[i]==='pass')assert.equal(s[i-1],'pass',`${M.STATIONS[i]} passes before ${M.STATIONS[i-1]} at ${t.toFixed(2)}`);
  if(s[2]==='fail')assert.ok(t>=M.CHECK_FAIL&&t<M.ENTER_CHECK2);if(s[2]==='pass')assert.ok(t>=M.CHECK_PASS&&t>M.PATH_FIXED);
  if(s[3]!=='off')assert.ok(t>=M.ENTER_DEPLOY&&M.ENTER_DEPLOY>M.COMMIT,'deploy only from the committed, checked state');
  if(s[4]==='pass')assert.ok(t>=M.LIVE_VERIFIED&&t>=M.EN_OK);if(s[4]==='preview')assert.ok(t>=SHOT.S010.start&&t<M.ENTER_DEPLOY);}
 assert.equal(M.station(4,(SHOT.S011.start+SHOT.S011.end)/2),'preview','chorus 1: LIVE is only a preview');assert.equal(M.station(4,(SHOT.S023.start+SHOT.S023.end)/2),'pass','chorus 2: LIVE is real');
 assert.equal(M.station(1,M.CHECK_FAIL+.1),'pass','build stays green while the check is red');});
test(`${LANG}: the missing cover is exactly one extra underscore, and the rename restores the referenced name`,()=>{
 const{EXPECTED,ON_DISK,UNDERSCORE_AT,MV_CMD,MISSING_PATH}=M;assert.equal(ON_DISK.length,EXPECTED.length+1);assert.equal(ON_DISK[UNDERSCORE_AT],'_');
 assert.equal(ON_DISK.slice(0,UNDERSCORE_AT)+ON_DISK.slice(UNDERSCORE_AT+1),EXPECTED);assert.equal(ON_DISK.slice(0,UNDERSCORE_AT),EXPECTED.slice(0,UNDERSCORE_AT),'all columns before it match');assert.notEqual(ON_DISK[UNDERSCORE_AT],EXPECTED[UNDERSCORE_AT]);
 assert.equal(MV_CMD,`mv ${ON_DISK} ${EXPECTED}`);assert.ok(MISSING_PATH.endsWith('/'+EXPECTED));assert.equal(M.fileOnDisk(M.PATH_FIXED-.01),ON_DISK);assert.equal(M.fileOnDisk(M.PATH_FIXED),EXPECTED);
 const term=M.terminal(M.CHECK_PASS+.01).map(l=>l.text);assert.equal(term.filter(x=>x==='npm run check').length,2,'the same check runs twice');assert.ok(term.includes(MV_CMD));});
test(`${LANG}: upload counts covers, audio and lyrics separately and completes exactly at UPLOAD_DONE`,()=>{
 assert.deepEqual(M.upload(M.ENTER_DEPLOY),[0,0,0]);let last=[0,0,0];for(let t=M.ENTER_DEPLOY;t<=M.UPLOAD_DONE+1;t+=.02){const u=M.upload(t);u.forEach((n,i)=>assert.ok(n>=last[i]&&n<=M.UPLOAD[i]));last=u;}
 assert.deepEqual(M.upload(M.UPLOAD_DONE),M.UPLOAD);assert.ok(M.uploaded(M.UPLOAD_DONE-.05)<30);
 const words=JSON.stringify(M.STRINGS).toLowerCase();for(const bad of['password','passwort','ftp','cyon','token:','keychain'])assert.ok(!words.includes(bad),`no credentials or provider: ${bad}`);});
test(`${LANG}: a normal reload still shows the cached page; only the hard reload shows album three`,()=>{
 assert.equal(M.browser(M.RELOAD1+.5).page,'old');assert.equal(M.browser(M.HARD_RELOAD-.01).page,'old');assert.equal(M.browser(M.NEW_PAGE).page,'new');
 assert.ok(M.browser(M.RELOAD1+.4).cacheChip);assert.ok(!M.browser(M.NEW_PAGE).cacheChip);assert.equal(M.browser(M.DE_OK).lang,'de');assert.equal(M.browser(M.EN_OK).lang,'en');});
test(`${LANG}: lyrics stay in the language of this recording`,()=>{
 const prompt=fs.readFileSync(new URL(`../../../../../music/kisound/Vibecoder/03_SHIP_IT/final/${LANG}/03_SHIP_IT_1.0.txt`,import.meta.url),'utf8');
 const lyrics=prompt.split('LYRIC PROMPT:')[1].split('STYLE PROMPT:')[0].split('\n').map(s=>s.trim());assert.ok(lyrics.includes(M.TXT.lyricLine),'the shown lyric line is a line of the final prompt');
 for(const w of M.TXT.bridge)assert.ok(lyrics.includes(w),`bridge card ${w} is a lyric line`);});
test(`${LANG}: bridge cards in order inside the bridge; EN cards at their ASR words`,()=>{const c=M.bridgeCards(DURATION);assert.equal(c.length,LANG==='en'?7:8);
 c.forEach((x,i)=>{assert.ok(x.start>=SHOT.S027.start&&x.start<SHOT.S029.end,x.text);if(i)assert.ok(x.start>c[i-1].start);});
 if(LANG==='en')c.forEach(x=>{const w=x.text.replace('.','').toLowerCase();assert.ok(data.lyrics.segments.some(l=>Math.abs(l.start_s-x.start)<1e-6&&l.text.toLowerCase().startsWith(w)),x.text);});
 else{const seg=data.lyrics.segments;assert.equal(c[0].start,seg.find(l=>l.text.startsWith('Tracks')).start_s);assert.equal(c[1].start,seg.find(l=>l.text.startsWith('Covers')).start_s);}});
test(`${LANG}: six Enter presses, each the Enter of a typed command`,()=>{assert.equal(M.ENTERS.length,6);assert.equal(M.enterCount(DURATION),6);
 const cmds=M.terminal(DURATION).filter(l=>l.kind==='cmd');assert.equal(cmds.length,6);assert.ok(cmds.every(l=>l.done));
 for(const e of M.ENTERS)assert.ok(M.enterPress(e).down>.9&&M.enterPress(e+.7).ring===0);});
test(`${LANG}: chapters start at shot boundaries`,()=>{for(const c of CHAPTERS)assert.equal(c.start,SHOT[c.shot].start);assert.equal(CHAPTERS.length,13);});
test(`${LANG}: time determinism of the model`,()=>{for(const t of[3,47.3,61,99.2,120.5,DURATION]){const f=()=>JSON.stringify([M.releaseState(t),M.stations(t),M.packet(t),M.upload(t),M.browser(t),M.terminal(t)]);const a=f();M.upload(80);M.terminal(12);assert.equal(f(),a);}});
