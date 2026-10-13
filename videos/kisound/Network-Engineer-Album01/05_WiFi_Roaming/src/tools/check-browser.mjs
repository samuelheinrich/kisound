import puppeteer from 'puppeteer-core';import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
import{startServer}from'../render/serve.mjs';import{DURATION,SHOTS,FPS}from'../render/config.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),out=path.join(root,'output/qa-v3');fs.mkdirSync(out,{recursive:true});
const quick=process.argv.includes('--quick'),server=await startServer(0),base=`http://127.0.0.1:${server.address().port}`;let browser;
const report={mode:quick?'quick':'full',errors:[],screenshots:[],determinism:[]};
try{
 browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
 const page=await browser.newPage();await page.setViewport({width:1280,height:720,deviceScaleFactor:1});page.on('pageerror',e=>report.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
 await page.goto(base+'/?w=1280&h=720',{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:60000});assert.equal(await page.evaluate(()=>window.__error),undefined);
 const times=quick?[3,16,27,35,40,46,51,57,64,69,79,89,95,102,107,112,117.4,125,140,164,172]:[3,...SHOTS.map(s=>(s.start+s.end)/2),45.7,46.3,55.42,61.8,63.5,63.8,68.4,68.7,91.7,118.6,118.9,129.8,149.1,153.5,153.9,77.8,78.1,78.6,78.9,116.88,117.14,117.4,117.7,118.1,175.9];
 for(const t of times){await page.evaluate(t=>window.renderFrame(Math.round(t*60)),t);const file=`frame-${t.toFixed(3).padStart(7,'0')}.png`;await page.screenshot({path:path.join(out,file)});report.screenshots.push({time_s:t,file});}
 for(const t of[15,51,79,112,140,172]){
  const shot=async()=>{await page.evaluate(t=>window.renderFrame(Math.round(t*60)),t);return crypto.createHash('sha256').update(await page.screenshot()).digest('hex');};
  const before=await shot();await page.evaluate(()=>{window.renderTime(170);window.renderTime(6);window.renderTime(90);});assert.equal(await shot(),before,`Determinism ${t}`);report.determinism.push(t);
 }
 if(!quick){const times=[...Array.from({length:177},(_,i)=>i),DURATION,...SHOTS.flatMap(s=>[Math.max(0,s.start-.001),s.start,s.start+.001])];
  for(let i=0;i<times.length;i+=15){const states=await page.evaluate(ts=>ts.map(t=>window.renderTime(t)),times.slice(i,i+15));for(const s of states)assert.ok(s.camera.every(Number.isFinite));}report.timeline_samples=times.length;
 }
 await page.goto(base+'/?res=1080',{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:60000});assert.equal(await page.evaluate(()=>window.__error),undefined);
 assert.ok(Math.abs(await page.evaluate(()=>window.player.audioDuration)-DURATION)<.002);
 await page.click('#play');await new Promise(r=>setTimeout(r,600));assert.ok(await page.evaluate(()=>window.player.current())>.3);await page.click('#play');
 await page.select('#chapter','121.68');assert.equal(await page.evaluate(()=>window.player.current()),121.68);
 await page.keyboard.down('Shift');await page.keyboard.press('ArrowRight');await page.keyboard.up('Shift');assert.ok(Math.abs(await page.evaluate(()=>window.player.current())-(Math.round(121.68*60)+1)/60)<1e-8);
 await page.select('#rate','0.5');assert.equal(await page.evaluate(()=>window.player.state.rate),.5);
 await page.click('#mute');assert.equal(await page.evaluate(()=>window.player.state.muted),true);
 await page.evaluate(d=>window.player.seek(d),DURATION);assert.equal(await page.evaluate(()=>window.player.current()),DURATION);
 await page.evaluate(()=>window.player.seek(27));await new Promise(r=>setTimeout(r,60));await page.screenshot({path:path.join(out,'browser-player.png')});
 report.playback=[];
 if(!quick)for(const t of[18,23.6,46,51,79,112,140]){
  report.playback.push(await page.evaluate(async t=>{const p=window.player;p.seek(t);p.state.rate=1;await p.play();const start=performance.now();let n=0;await new Promise(resolve=>{function f(now){n++;if(now-start>1800)resolve();else requestAnimationFrame(f);}requestAnimationFrame(f);});const ms=performance.now()-start;p.pause();return{time_s:t,mean_fps:n/ms*1000};},t));
 }
 assert.equal(report.errors.length,0);report.status='passed';
}catch(e){report.status='failed';report.failure=String(e.stack||e);process.exitCode=1;}
finally{if(browser)await browser.close();await new Promise(r=>server.close(r));fs.writeFileSync(path.join(out,'browser-report.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));}
