// Browser QA for both versions: frames at every shot, finite cameras, time determinism, the local player and a
// 4K still. node src/tools/check-browser.mjs [--quick] [--lang de|en]
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {startServer} from '../render/serve.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),out=path.join(root,'output/qa');fs.mkdirSync(out,{recursive:true});
const quick=process.argv.includes('--quick'),only=process.argv.includes('--lang')?[process.argv[process.argv.indexOf('--lang')+1]]:['de','en'];
const server=await startServer(0),base=`http://127.0.0.1:${server.address().port}`,report={schema:'kisound.token-burn.browser-qa.v1',mode:quick?'quick':'full',status:'running',versions:{}};let browser;
try{
 browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 for(const lang of only){
  const r=report.versions[lang]={errors:[],screenshots:[],determinism:[],playback:[]},page=await browser.newPage();await page.setViewport({width:1280,height:720,deviceScaleFactor:1});
  page.on('pageerror',e=>r.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')r.errors.push(m.text());});
  await page.goto(`${base}/?w=1280&h=720&lang=${lang}`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:90000});assert.equal(await page.evaluate(()=>window.__error),undefined);
  const info=await page.evaluate(async()=>{const c=await import('/src/render/config.js');return{shots:c.SHOTS,DURATION:c.DURATION,FRAMES:c.FRAMES,LANG:c.LANG,chapter:c.CHAPTERS[6].start};});assert.equal(info.LANG,lang);
  const times=quick?info.shots.filter((s,i)=>i%8===0).map(s=>+((s.start+s.end)/2).toFixed(2)):info.shots.map(s=>+((s.start+s.end)/2).toFixed(2));
  const dir=path.join(out,`browser-${lang}`);fs.mkdirSync(dir,{recursive:true});
  for(const t of times){await page.evaluate(t=>window.renderFrame(Math.round(t*60)),t);const file=`${lang}-${t.toFixed(2).padStart(6,'0')}.png`;await page.screenshot({path:path.join(dir,file)});r.screenshots.push(file);}
  const all=quick?times:[...Array.from({length:Math.ceil(info.DURATION)},(_,i)=>i),info.DURATION,...info.shots.flatMap(s=>[Math.max(0,s.start-.001),s.start,s.start+.001])];
  for(let i=0;i<all.length;i+=16){const states=await page.evaluate(ts=>ts.map(t=>window.renderTime(t)),all.slice(i,i+16));for(const s of states){assert.ok(s.camera.every(Number.isFinite));assert.ok(s.target.every(Number.isFinite));}}r.timeline_samples=all.length;
  for(const t of quick?[9,96,190]:[4,15,47,80,98,120,143,151,170,190,214,236]){const snap=async()=>{await page.evaluate(t=>window.renderFrame(Math.round(t*60)),t);return crypto.createHash('sha256').update(await page.screenshot()).digest('hex');};const before=await snap();await page.evaluate(()=>{window.renderTime(200);window.renderTime(3);window.renderTime(150);});assert.equal(await snap(),before,`Determinismus ${lang} ${t}`);r.determinism.push(t);}
  await page.goto(`${base}/?res=720&lang=${lang}`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:90000});assert.equal(await page.evaluate(()=>window.__error),undefined);
  assert.ok(Math.abs(await page.evaluate(()=>window.player.audioDuration)-info.DURATION)<.002,'audio = timeline');
  await page.click('#play');await page.waitForFunction('window.player.current()>.3',{timeout:3000,polling:50});await page.click('#play');assert.equal(await page.evaluate(()=>window.player.state.playing),false);
  await page.select('#chapter',String(info.chapter));assert.equal(await page.evaluate(()=>window.player.current()),info.chapter);
  if(!quick)for(const t of[10,80,150,200])r.playback.push(await page.evaluate(async t=>{const p=window.player;p.seek(t);await p.play();const start=performance.now();let n=0;await new Promise(res=>{const f=now=>{n++;if(now-start>=1500)res();else requestAnimationFrame(f);};requestAnimationFrame(f);});const ms=performance.now()-start;p.pause();return{time_s:t,mean_fps:+(n/ms*1000).toFixed(1)};},t));
  await page.screenshot({path:path.join(dir,'player.png')});
  if(!quick){await page.setViewport({width:3840,height:2160,deviceScaleFactor:1});await page.goto(`${base}/?w=3840&h=2160&t=80&lang=${lang}`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:90000});assert.equal(await page.evaluate(()=>window.__error),undefined);
   const h=info.shots.find(s=>s.id==='S020');await page.evaluate(n=>window.renderFrame(n),Math.round((h.start+1.2)*60));await page.screenshot({path:path.join(dir,'title-4k.png')});r.film=await page.evaluate(()=>window.FILM);assert.equal(r.film.FRAMES,info.FRAMES);}
  assert.equal(r.errors.length,0,r.errors.join('\n'));await page.close();
 }
 report.status='passed';
}catch(e){report.status='failed';report.failure=String(e.stack||e);process.exitCode=1;}
finally{if(browser)await browser.close();await new Promise(r=>server.close(r));fs.writeFileSync(path.join(out,quick?'browser-report-quick.json':'browser-report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,failure:report.failure,versions:Object.fromEntries(Object.entries(report.versions).map(([k,v])=>[k,{screenshots:v.screenshots.length,samples:v.timeline_samples,determinism:v.determinism.length,playback:v.playback}]))},null,1));}
