// Checks dist/ in headless Chrome: every page without errors or broken media, the interactive film
// playing (standalone and embedded), and the sync of the web audio against the release WAV.
// The measured leading offsets go to audio-offsets.json; the build passes them to the player.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {startServer} from './serve.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8')),music=path.resolve(root,config.sources.music);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'dist/build-manifest.json'),'utf8'));
const out=path.join(root,'.cache/check');fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
// --only vibecoder or --only vibecoder/03-ship-it[,…]: audio sync and live code only for these (the pages are always checked)
const onlyIx=process.argv.indexOf('--only'),only=onlyIx>0?process.argv[onlyIx+1].split(','):null,wanted=(a,t)=>!only||only.some(o=>o===a.slug||o===`${a.slug}/${t.slug}`);
const all=process.argv.includes('--all-audio'),server=await startServer(0,{'/__src/':music}),base=`http://127.0.0.1:${server.address().port}/`;
const report={status:'running',pages:[],audio:[],interactive:[],errors:[]};let browser;
const shot=async(page,name)=>{await page.screenshot({path:path.join(out,name)});return name;};
try{
 browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage();await page.setViewport({width:1280,height:800});
 const pageErrors=[];page.on('pageerror',e=>pageErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')pageErrors.push(m.text());});
 page.on('response',r=>{if(r.status()>=400&&!r.url().includes('favicon'))pageErrors.push(`${r.status()} ${r.url()}`);});
 // 1. Audio sync: cross-correlation of WAV and web encode at three positions, 0.5 s windows, ±60 ms.
 await page.goto(base,{waitUntil:'load'});
 for(const a of manifest.albums)for(const t0 of a.tracks)for(const t of t0.versions?t0.versions.map(v=>({...t0,...v,slug:`${t0.slug}-${v.lang}`})):[t0]){
  if(!t.final||(!t.interactive&&!all)||!wanted(a,t0))continue;
  const r=await page.evaluate(async(wav,enc)=>{
   const ctx=new OfflineAudioContext(1,1,48000),dec=async u=>ctx.decodeAudioData(await(await fetch(u)).arrayBuffer());
   const[w,m]=await Promise.all([dec(wav),dec(enc)]),mono=b=>{const a=b.getChannelData(0),c=b.numberOfChannels>1?b.getChannelData(1):a,o=new Float32Array(a.length);for(let i=0;i<a.length;i++)o[i]=(a[i]+c[i])/2;return o;};
   const W=mono(w),M=mono(m),N=24000,L=2880,lags=[];
   for(const at of[.2,.5,.8]){const s=Math.floor(W.length*at);let best=0,bestLag=0;
    for(let lag=-L;lag<=L;lag++){let sum=0;for(let i=0;i<N;i+=2)sum+=W[s+i]*M[s+i+lag];if(sum>best){best=sum;bestLag=lag;}}lags.push(bestLag);}
   lags.sort((x,y)=>x-y);return{lag_samples:lags[1],all:lags,wav_duration:w.duration,enc_duration:m.duration};
  },`/__src/${t.wav}`,`/${t.audio}`);
  const offset=r.lag_samples/48000;report.audio.push({track:`${a.slug}/${t.slug}`,audio:t.audio,...r,offset_s:offset});
  console.log(`Audio ${t.slug}: Versatz ${(offset*1000).toFixed(2)} ms (Lags ${r.all.join(', ')}), Dauer WAV ${r.wav_duration.toFixed(3)} s / Web ${r.enc_duration.toFixed(3)} s`);
  assert.ok(new Set(r.all).size===1||Math.max(...r.all)-Math.min(...r.all)<=2,`${t.slug}: uneinheitlicher Versatz ${r.all}`);
 }
 const offsetsFile=path.join(root,'audio-offsets.json'),old=fs.existsSync(offsetsFile)?JSON.parse(fs.readFileSync(offsetsFile,'utf8')):{},next={...old};
 for(const a of report.audio)next[a.audio]=+a.offset_s.toFixed(6);fs.writeFileSync(offsetsFile,JSON.stringify(next,null,1)+'\n');
 const stale=report.audio.filter(a=>Math.abs((manifest.albums.flatMap(x=>x.tracks).flatMap(t=>t.versions||[t]).find(t=>t.audio===a.audio)?.audio_offset_s??a.offset_s)-a.offset_s)>1e-6);
 if(stale.length)report.rebuild_needed=stale.map(a=>a.track);
 // 2. Every page: no script errors, no failed requests, all images decoded.
 const pages=['',...manifest.albums.flatMap(a=>[`${a.slug}/`,...a.tracks.map(t=>`${a.slug}/${t.slug}/`)]),'impressum/'];
 for(const p of pages){
  pageErrors.length=0;await page.goto(base+p,{waitUntil:'networkidle0'});
  const broken=await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>{i.loading='eager';return i.decode().catch(()=>{});}));return[...document.images].filter(i=>i.getAttribute('src')&&!i.naturalWidth).map(i=>i.src);});
  report.pages.push({page:p,errors:[...pageErrors],broken_images:broken});assert.equal(broken.length,0,`${p}: ${broken}`);
 }
 await page.goto(base,{waitUntil:'networkidle0'});await shot(page,'home.png');
 const album=manifest.albums[0];await page.goto(base+album.slug+'/',{waitUntil:'networkidle0'});await shot(page,'album.png');
 await page.click('.row-play:not(.muted)');   // the first playable row (a track without final audio is muted)await new Promise(r=>setTimeout(r,1500));
 report.dock=await page.evaluate(()=>({visible:!document.getElementById('dock').hidden,cover:document.getElementById('dock-cover').naturalWidth,time:document.getElementById('dock-time').textContent}));
 assert.ok(report.dock.visible&&report.dock.cover>0,'Player-Leiste oder Cover fehlt');
 await page.click('#dock-fwd');await new Promise(r=>setTimeout(r,300));await shot(page,'album-dock.png');
  // every track may have live code; then any released track serves for the inline waveform
 const plain=album.tracks.find(t=>t.final&&!t.interactive)??album.tracks.find(t=>t.final);await page.goto(`${base}${album.slug}/${plain.slug}/`,{waitUntil:'networkidle0'});
 await page.evaluate(()=>{const r=document.querySelector('.wave-inline').getBoundingClientRect();return r;});const wr=await page.$eval('.wave-inline',el=>{const r=el.getBoundingClientRect();return{x:r.x+r.width*.4,y:r.y+r.height/2};});
 await page.mouse.click(wr.x,wr.y);await new Promise(r=>setTimeout(r,1200));report.inline_wave_jump=await page.evaluate(()=>document.getElementById('dock-time').textContent);await shot(page,'track.png');
 // 3. Interactive films: standalone page, simple and expert mode, then embedded on the track page.
 for(const a of manifest.albums)for(const t0 of a.tracks.filter(t=>t.interactive&&wanted(a,t)))for(const vl of t0.versions?t0.versions.map(v=>v.lang):[null]){
  const t={...t0,slug:vl?`${t0.slug}-${vl}`:t0.slug},url=`${base}${a.slug}/${t0.slug}/live/`,q=vl?`v=${vl}&`:'',r={track:t.slug};pageErrors.length=0;
  await page.setViewport({width:1280,height:720});await page.goto(url+`?${q}res=720`,{waitUntil:'networkidle0'});
  await page.waitForFunction('window.__ready||window.__error',{timeout:120000});assert.equal(await page.evaluate(()=>window.__error),undefined);
  if(vl){r.version=await page.evaluate(()=>({v:window.KISOUND_PAGE.version,lang:window.FILM.LANG,dur:window.player.audioDuration}));assert.equal(r.version.v,vl);assert.equal(r.version.lang,vl,'film runs the chosen version');}
  r.poster=await shot(page,`${t.slug}-poster.png`);
  await page.click('#poster');await new Promise(res=>setTimeout(res,1500));r.played_s=await page.evaluate(()=>window.player.current());assert.ok(r.played_s>.9,`${t.slug}: Wiedergabe läuft nicht`);
  const sp=config.albums.find(x=>x.slug===a.slug).interactive[t.number],at=vl&&sp[`poster_${vl}`]!=null?sp[`poster_${vl}`]:sp.poster;await page.evaluate(t=>window.player.seek(t),at);await new Promise(res=>setTimeout(res,400));r.simple=await shot(page,`${t.slug}-simple.png`);
  r.skip=await page.evaluate(()=>{const before=window.player.current();document.getElementById('fwd10').click();return window.player.current()-before;});assert.ok(Math.abs(r.skip-10)<.1,`${t.slug}: +10 springt ${r.skip} s`);
  await page.keyboard.press('e');await new Promise(res=>setTimeout(res,300));r.expert_visible=await page.evaluate(()=>getComputedStyle(document.getElementById('expert-row')).display!=='none');assert.ok(r.expert_visible);
  r.expert=await shot(page,`${t.slug}-expert.png`);await page.keyboard.press('e');
  // track details open as a drawer while the film keeps running; the overview starts with the way home
  r.details=await page.evaluate(async()=>{const b=document.getElementById('details'),t0=window.player.current();b.click();for(let i=0;i<50&&!document.querySelector('#info-body h2');i++)await new Promise(res=>setTimeout(res,100));
   const d={title:document.querySelector('#info-body h2')?.textContent,playing:window.player.state.playing&&window.player.current()>t0,home:document.getElementById('nav-home')?.getAttribute('href')};b.click();return d;});
  assert.ok(r.details.title&&r.details.playing,`${t.slug}: Track-Details ${JSON.stringify(r.details)}`);assert.ok(r.details.home,`${t.slug}: Weg zur Startseite fehlt`);await page.evaluate(()=>window.player.pause());
  r.fps=await page.evaluate(async at=>{const p=window.player;p.seek(at);await p.play();const s=performance.now();let n=0;await new Promise(res=>{const f=now=>{n++;now-s>2000?res():requestAnimationFrame(f);};requestAnimationFrame(f);});p.pause();return n/(performance.now()-s)*1000;},at);
  r.errors=[...pageErrors];assert.equal(r.errors.length,0,`${t.slug}: ${r.errors}`);
  // phone portrait
  await page.setViewport({width:390,height:844,deviceScaleFactor:2,isMobile:true,hasTouch:true});await page.goto(url+`?${q}res=540&t=${at}`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:120000});r.mobile=await shot(page,`${t.slug}-mobile.png`);
  await page.goto(`${base}${a.slug}/${t0.slug}/`,{waitUntil:'networkidle0'});r.track_page_mobile=await shot(page,`${t.slug}-track-mobile.png`);
  // embedded on the track page (desktop)
  await page.setViewport({width:1280,height:800,deviceScaleFactor:1});await page.goto(`${base}${a.slug}/${t0.slug}/`,{waitUntil:'networkidle0'});
  const frame=page.frames().find(f=>f.url().includes('/live/'));await frame.waitForFunction('window.__ready||window.__error',{timeout:120000});assert.equal(await frame.evaluate(()=>window.__error),undefined);
  r.embedded_resolution=await frame.evaluate(()=>window.FILM.H);r.track_page=await shot(page,`${t.slug}-track.png`);report.interactive.push(r);
  console.log(`Live-Code ${t.slug}: spielt, ${r.fps.toFixed(0)} fps (720p, Headless), Experte ok, eingebettet ${r.embedded_resolution}p`);
 }
 // 3b. Sung versions: the track page switch changes the embedded film, lyrics and waveform; the choice is kept.
 for(const a of manifest.albums)for(const t of a.tracks.filter(t=>t.versions&&t.interactive&&wanted(a,t))){
  await page.setViewport({width:1280,height:800,deviceScaleFactor:1});await page.goto(`${base}${a.slug}/${t.slug}/`,{waitUntil:'networkidle0'});await page.evaluate(()=>localStorage.removeItem('kisound.version'));
  for(const v of t.versions.map(x=>x.lang)){await page.click(`[data-version-set="${v}"]`);await new Promise(r=>setTimeout(r,600));
   const frame=page.frames().find(f=>f.url().includes('/live/')&&f.url().includes(`v=${v}`));assert.ok(frame,`iframe follows version ${v}`);await frame.waitForFunction('window.__ready||window.__error',{timeout:120000});
   const st=await page.evaluate(()=>({v:document.documentElement.dataset.version,lang:document.documentElement.dataset.lang,lyrics:[...document.querySelectorAll('.lyrics')].filter(e=>e.offsetParent!==null).map(e=>e.lang),waves:[...document.querySelectorAll('.wave-inline')].filter(e=>e.offsetParent!==null).length,stored:localStorage.getItem('kisound.version')}));
   assert.equal(st.v,v);assert.equal(st.lang,v,'the sung version sets the language');assert.deepEqual(st.lyrics,[v==='de'?'de':'en']);assert.equal(st.waves,1);assert.equal(st.stored,v);assert.equal(await frame.evaluate(()=>window.FILM.LANG),v);await shot(page,`${t.slug}-version-${v}.png`);
   report.versions=[...(report.versions||[]),{track:t.slug,version:v,...st}];}
  // the live page itself: V switches the version and keeps the scene; the controls switch to its language
  await page.evaluate(()=>localStorage.setItem('kisound.lang','de'));await page.goto(`${base}${a.slug}/${t.slug}/live/?v=de&t=90&res=540`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:120000});
  await page.evaluate(()=>document.querySelector('#vers [data-v="en"]').click());await page.waitForFunction('window.KISOUND_PAGE&&window.KISOUND_PAGE.version==="en"&&window.__ready',{timeout:120000});
  // the same shot in both versions: the EN time must fall into the EN shot whose index the DE time had (cue lists of the piece)
  const mapped=await page.evaluate(()=>{const V=window.KISOUND_PAGE.versions,de=V.de.cues,en=V.en.cues;let i=0;while(i<de.length-1&&de[i+1]<=90)i++;return{t:+new URL(location.href).searchParams.get('t'),lang:window.FILM.LANG,ui:document.getElementById('expert').textContent,shot:i,from:en[i],to:en[i+1]??V.en.duration};});assert.equal(mapped.lang,'en');assert.equal(mapped.ui,'Expert','controls follow the sung version');assert.ok(mapped.t>=mapped.from&&mapped.t<mapped.to,`scene kept: ${mapped.t} not in EN shot ${mapped.shot} ${mapped.from}–${mapped.to}`);report.version_switch=mapped;
  await page.evaluate(()=>localStorage.removeItem('kisound.version'));console.log(`Fassungen ${t.slug}: Umschalter Trackseite und Player ok (90 s DE → ${mapped.t} s EN)`);}
 // 4. Languages: the browser language decides the first view (headless Chrome: en-US), the switch
 // changes the page and the embedded live code, and the choice survives a reload. Lyrics stay as written.
 {const a=manifest.albums[0],t=a.tracks.find(x=>x.interactive);await page.setViewport({width:1280,height:800,deviceScaleFactor:1});
  await page.goto(base,{waitUntil:'networkidle0'});await page.evaluate(()=>localStorage.removeItem('kisound.lang'));await page.goto(`${base}${a.slug}/${t.slug}/`,{waitUntil:'networkidle0'});
  const frame=page.frames().find(f=>f.url().includes('/live/'));await frame.waitForFunction('window.__ready||window.__error',{timeout:120000});
  const vis=sel=>page.evaluate(s=>[...document.querySelectorAll(s)].filter(e=>e.offsetParent!==null).map(e=>e.textContent.trim()),sel);
  const first=await page.evaluate(()=>document.documentElement.dataset.lang);assert.equal(first,'en','browser language en-US → English');
  const lyricsBefore=await page.$eval('.lyrics .verse',e=>e.textContent);
  await page.click('#lang-toggle');await new Promise(r=>setTimeout(r,400));
  const after=await page.evaluate(()=>({lang:document.documentElement.dataset.lang,title:document.title,nav:[...document.querySelectorAll('.top nav a')].filter(e=>e.offsetParent!==null).map(e=>e.innerText.trim())}));
  assert.equal(after.lang,'de');assert.ok(after.nav.includes('Alben'),JSON.stringify(after.nav));
  const frameLang=await frame.evaluate(()=>({lang:document.documentElement.dataset.lang,expert:document.getElementById('expert').textContent}));assert.equal(frameLang.lang,'de','embedded live code follows the switch');assert.equal(frameLang.expert,'Experte');
  assert.equal(await page.$eval('.lyrics .verse',e=>e.textContent),lyricsBefore,'lyrics are not translated');
  await page.reload({waitUntil:'networkidle0'});assert.equal(await page.evaluate(()=>document.documentElement.dataset.lang),'de','choice is kept');
  report.languages={first,after,frame:frameLang,heading_de:await vis('.track-body h2'),kept:'de'};await shot(page,'track-de.png');
  await page.click('#lang-toggle');await new Promise(r=>setTimeout(r,300));report.languages.heading_en=await vis('.track-body h2');await shot(page,'track-en.png');
  await page.goto(base,{waitUntil:'networkidle0'});await shot(page,'home-en.png');console.log(`Sprachen: Browser en-US → ${first}, Umschalten → ${after.lang}, eingebetteter Live-Code → ${frameLang.lang}, Lyrics unverändert`);}
 const errs=report.pages.filter(p=>p.errors.length);assert.equal(errs.length,0,JSON.stringify(errs));
 report.status='passed';
}catch(e){report.status='failed';report.failure=String(e.stack||e);process.exitCode=1;}
finally{if(browser)await browser.close();server.close();fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,1)+'\n');
 console.log(`\nPrüfung ${report.status==='passed'?'bestanden':'FEHLGESCHLAGEN'}: ${report.pages.length} Seiten, ${report.audio.length} Audio-Messungen, ${report.interactive.length} Live-Code-Stücke${only?` (nur ${only.join(', ')})`:''}. Bericht: .cache/check/report.json`);
 if(report.failure)console.log(report.failure);if(report.rebuild_needed)console.log(`Versatz neu gemessen für ${report.rebuild_needed.join(', ')}: npm run build ausführen.`);}
