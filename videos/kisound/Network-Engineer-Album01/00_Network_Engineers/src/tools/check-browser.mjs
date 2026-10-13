import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
import {startServer} from '../render/serve.mjs';
import {DURATION,SHOTS,CHAPTERS} from '../render/config.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),out=path.join(root,'output/qa');fs.mkdirSync(out,{recursive:true});
const quick=process.argv.includes('--quick');const errors=[],warnings=[];
const server=await startServer(0);let browser;
const report={mode:quick?'quick':'full',audio_end_s:DURATION,screenshots:[],errors,warnings,measurements:{}};
try{
 browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage();await page.setViewport({width:1280,height:720,deviceScaleFactor:1});
 page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warn')warnings.push(m.text());});
 const base=`http://127.0.0.1:${server.address().port}`;
 await page.goto(base+'/?w=1280&h=720&t=12',{waitUntil:'networkidle0'});
 await page.waitForFunction('window.__ready || window.__error',{timeout:60000});
 assert.equal(await page.evaluate(()=>window.__error),undefined);
 const times=quick?[12,38,52.5,54.8,58.5,64,80,97.5,115,132.8,155,180,194,205]:[12,20,26,38,48,52.5,54.8,58.5,64,69,80,87,97.5,106,115,128,132.8,135,145,150,155,161,166,175,180,190,198.6,205,206.8];
 for(const t of times){
  await page.evaluate(t=>window.renderFrame(Math.round(t*60)),t);
  const file=`frame-${t.toFixed(3).padStart(7,'0')}.png`;await page.screenshot({path:path.join(out,file)});report.screenshots.push({time_s:t,file});
 }
 // Same timestamp must have the same composed pixels after arbitrary scene order.
 const draw=async t=>{await page.evaluate(t=>window.renderFrame(Math.round(t*60)),t);return crypto.createHash('sha256').update(await page.screenshot()).digest('hex');};
 report.determinism=[];
 for(const t of [16,40,64,101,115,133,190]){
  const before=await draw(t);await page.evaluate(()=>{window.renderTime(205);window.renderTime(60);window.renderTime(1);});
  const after=await draw(t);assert.equal(before,after,`Pixel determinism at ${t}`);report.determinism.push({time_s:t,identical:true});
 }
 if(!quick){
  const sweep=[...Array.from({length:208},(_,i)=>Math.min(i,DURATION)),DURATION,...SHOTS.flatMap(s=>[Math.max(0,s.start-.001),s.start,Math.min(DURATION,s.start+.001)])];
  for(let i=0;i<sweep.length;i+=20){
   const states=await page.evaluate(ts=>ts.map(t=>window.renderTime(t)),sweep.slice(i,i+20));
   for(const st of states){assert.ok(st.camera.every(Number.isFinite));assert.ok(st.target.every(Number.isFinite));assert.ok(st.visibility>=0&&st.visibility<=1);}
  }
  report.timeline_samples=sweep.length;
 }
 report.measurements.render_720p_ms=await page.evaluate(()=>{
  const result=[];for(const t of [20,40,64,101,115,190]){window.renderFrame(t*60);const start=performance.now();for(let k=0;k<12;k++)window.renderFrame(t*60+k);result.push({time_s:t,ms_per_frame:(performance.now()-start)/12});}return result;
 });
 await page.goto(base+'/?res=1080',{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready || window.__error',{timeout:60000});
 assert.equal(await page.evaluate(()=>window.__error),undefined);
 assert.ok(Math.abs(await page.evaluate(()=>window.player.audioDuration)-DURATION)<.002);
 await page.click('#play');await new Promise(r=>setTimeout(r,800));assert.ok(await page.evaluate(()=>window.player.current())>.4);await page.click('#play');
 const paused=await page.evaluate(()=>window.player.current());await new Promise(r=>setTimeout(r,120));assert.equal(await page.evaluate(()=>window.player.current()),paused);
 await page.evaluate(()=>window.player.seek(133.8));await page.keyboard.down('Shift');await page.keyboard.press('ArrowRight');await page.keyboard.up('Shift');
 assert.ok(Math.abs(await page.evaluate(()=>window.player.current())-(Math.round(133.8*60)+1)/60)<1e-8);
 await page.select('#chapter','178.6');assert.equal(await page.evaluate(()=>window.player.current()),178.6);
 await page.select('#rate','0.5');assert.equal(await page.evaluate(()=>window.player.state.rate),.5);
 await page.click('#mute');assert.equal(await page.evaluate(()=>window.player.state.muted),true);
 await page.click('#debug');assert.equal(await page.evaluate(()=>window.film.debug),true);
 await page.evaluate(duration=>window.player.seek(duration),DURATION);assert.equal(await page.evaluate(()=>window.player.current()),DURATION);
 await page.evaluate(()=>{window.player.seek(window.FILM.DURATION-.1);window.player.state.loop=false;});await page.click('#play');await new Promise(r=>setTimeout(r,500));
 assert.equal(await page.evaluate(()=>window.player.state.playing),false);assert.equal(await page.evaluate(()=>window.player.current()),DURATION);
 await page.click('#loop');await page.evaluate(()=>window.player.seek(window.FILM.DURATION-.1));await page.click('#play');await new Promise(r=>setTimeout(r,600));
 assert.equal(await page.evaluate(()=>window.player.state.playing),true);assert.ok(await page.evaluate(()=>window.player.current())<1);await page.click('#play');
 await page.evaluate(()=>{window.player.seek(80);window.film.debug=false;});await new Promise(r=>setTimeout(r,100));
 await page.screenshot({path:path.join(out,'browser-player.png')});
 report.measurements.render_1080p_ms=await page.evaluate(()=>{
  const result=[];for(const t of [20,40,64,101,115,190]){window.renderFrame(t*60);const start=performance.now();for(let k=0;k<12;k++)window.renderFrame(t*60+k);result.push({time_s:t,ms_per_frame:(performance.now()-start)/12});}return result;
 });
 if(!quick){
  report.measurements.playback_1080p=[];
  for(const time of [18,35,110,172]){
   const result=await page.evaluate(async t=>{
    const p=window.player;p.pause();p.seek(t);p.state.rate=1;p.state.loop=false;
    await p.play();const started=performance.now(),audioStart=p.current(),frames=[];
    await new Promise(resolve=>{let last=performance.now();function frame(now){frames.push(now-last);last=now;if(now-started>=2000)resolve();else requestAnimationFrame(frame);}requestAnimationFrame(frame);});
    const elapsed=(performance.now()-started)/1000,advance=p.current()-audioStart;p.pause();
    frames.sort((a,b)=>a-b);
    return{start_s:t,wall_s:elapsed,audio_advance_s:advance,frames:frames.length,mean_fps:frames.length/elapsed,p95_frame_ms:frames[Math.floor(frames.length*.95)]};
   },time);
   assert.ok(Math.abs(result.audio_advance_s-result.wall_s)<.2,'Audio master clock drift');report.measurements.playback_1080p.push(result);
  }
  await page.evaluate(()=>window.player.seek(80));
 }
 await page.select('#resolution','720');await page.waitForFunction('window.__ready || window.__error',{timeout:60000});
 await page.waitForFunction('window.FILM?.H === 720',{timeout:60000});assert.ok(Math.abs(await page.evaluate(()=>window.player.current())-80)<.001);
 report.player_checks='play, pause, seek, frame step, chapter, rate, mute, debug, exact end, loop, resolution with time preservation';
 assert.equal(errors.length,0,errors.join('\n'));report.status='passed';
}catch(e){report.status='failed';report.failure=String(e.stack||e);process.exitCode=1;}
finally{if(browser)await browser.close();await new Promise(r=>server.close(r));fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({status:report.status,failure:report.failure,errors,measurements:report.measurements},null,2));}
