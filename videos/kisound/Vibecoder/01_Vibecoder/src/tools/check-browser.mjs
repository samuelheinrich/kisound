// Browser QA for both independent versions. No MP4 is exported.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {startServer} from '../render/serve.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),out=path.join(root,'output/qa');fs.mkdirSync(out,{recursive:true});
const quick=process.argv.includes('--quick'),only=process.argv.includes('--lang')?[process.argv[process.argv.indexOf('--lang')+1]]:['de','en'];
const report={schema:'kisound.vibecoder01.browser-qa.v1',mode:quick?'quick':'full',status:'running',versions:{}};
const server=await startServer(0),base=`http://127.0.0.1:${server.address().port}`;let browser;
const sha=data=>crypto.createHash('sha256').update(data).digest('hex');
try{
 browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 for(const lang of only){
  const r=report.versions[lang]={errors:[],screenshots:[],determinism:[],player:{}};
  const page=await browser.newPage();await page.setViewport({width:960,height:540,deviceScaleFactor:1});
  page.on('pageerror',e=>r.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')r.errors.push(m.text());});
  await page.goto(`${base}/?w=960&h=540&lang=${lang}`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:90000});
  assert.equal(await page.evaluate(()=>window.__error),undefined);
  const info=await page.evaluate(async()=>{const c=await import('/src/render/config.js');return{shots:c.SHOTS,chapters:c.CHAPTERS,duration:c.DURATION,frames:c.FRAMES,lang:c.LANG};});
  assert.equal(info.lang,lang);assert.equal(info.shots.length,72);
  const inspect=await page.evaluate(()=>Object.fromEntries(['catalog_export','track_pattern','tool_selection','orange_rail','Arbeitsmonitor'].map(name=>{
   const o=window.film.scene.getObjectByName(name);return[name,o?.userData.inspect?.(window.FILM.DURATION-.5)];
  })));
  assert.equal(inspect.catalog_export?.status,'verified');assert.equal(inspect.track_pattern?.status,'ready');
  assert.equal(inspect.tool_selection?.status,'verified');assert.equal(inspect.orange_rail?.verified,3);
  assert.equal(inspect.Arbeitsmonitor?.tool,'verified');r.inspector=true;
  const dir=path.join(out,`browser-${lang}`);fs.mkdirSync(dir,{recursive:true});
  const chosen=quick?info.shots.filter((_,i)=>i%6===0):info.shots;
  for(const s of chosen){const t=(s.start+s.end)/2,state=await page.evaluate(t=>window.renderTime(t),t);
   assert.equal(state.shot,s.id);assert.ok(state.camera.every(Number.isFinite));assert.ok(state.visibility>0&&state.visibility<=1);
   const file=`${s.id}.png`;await page.screenshot({path:path.join(dir,file)});r.screenshots.push(file);
  }
  const samples=quick?[0,info.duration]:[...Array.from({length:Math.ceil(info.duration)},(_,i)=>i),info.duration,...info.shots.flatMap(s=>[Math.max(0,s.start-.001),s.start,s.start+.001])];
  for(let i=0;i<samples.length;i+=32){const states=await page.evaluate(ts=>ts.map(t=>window.renderTime(t)),samples.slice(i,i+32));for(const s of states)assert.ok(s.camera.every(Number.isFinite));}
  r.timeline_samples=samples.length;
  for(const t of quick?[2,89,172]:[2,35,49.8,88,104,123,147,159,172,188,203,info.duration-.4]){
   const snap=async()=>{await page.evaluate(t=>window.renderTime(t),t);return sha(await page.screenshot());};
   const before=await snap();await page.evaluate(()=>{window.renderTime(190);window.renderTime(8);window.renderTime(127);});
   assert.equal(await snap(),before,`frame deterministic at ${lang} ${t}`);r.determinism.push(t);
  }
  await page.goto(`${base}/?res=720&lang=${lang}`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:90000});
  assert.equal(await page.evaluate(()=>window.__error),undefined);r.player.duration=await page.evaluate(()=>window.player.audioDuration);
  assert.ok(Math.abs(r.player.duration-info.duration)<.002);await page.click('#play');
  await page.waitForFunction('window.player.current()>.2',{timeout:5000,polling:50});await page.click('#play');
  assert.equal(await page.evaluate(()=>window.player.state.playing),false);
  await page.select('#chapter',String(info.chapters[8].start));assert.equal(await page.evaluate(()=>window.player.current()),info.chapters[8].start);
  r.player.passed=true;await page.screenshot({path:path.join(dir,'player.png')});
  if(!quick&&lang==='de'){await page.setViewport({width:3840,height:2160,deviceScaleFactor:1});await page.goto(`${base}/?w=3840&h=2160&t=159&lang=de`,{waitUntil:'networkidle0'});
   await page.waitForFunction('window.__ready||window.__error',{timeout:90000});assert.equal(await page.evaluate(()=>window.__error),undefined);
   await page.screenshot({path:path.join(dir,'final-title-4k.png')});r.four_k=await page.evaluate(()=>window.FILM);assert.equal(r.four_k.FRAMES,info.frames);}
  assert.deepEqual(r.errors,[]);await page.close();
 }
 report.status='passed';
}catch(e){report.status='failed';report.failure=String(e.stack||e);process.exitCode=1;}
finally{if(browser)await browser.close();await new Promise(r=>server.close(r));fs.writeFileSync(path.join(out,quick?'browser-report-quick.json':'browser-report.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify({status:report.status,failure:report.failure,versions:Object.fromEntries(Object.entries(report.versions).map(([k,v])=>[k,{shots:v.screenshots.length,samples:v.timeline_samples,determinism:v.determinism.length,player:v.player.passed,inspector:v.inspector,errors:v.errors.length}]))},null,2));}
