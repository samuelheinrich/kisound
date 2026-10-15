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
  const cafeProof=await page.evaluate(t=>{window.renderTime(t);const w=window.film.world;
   return{cards:w.cards.filter(c=>c.group.visible).length,rail:w.rail.visible,
    walls:['Cafédecke','Caféfront','Caférückwand','Cafélinkswand','Caférechtswand'].every(name=>!!w.places.groups.cafe.getObjectByName(name))};
  },(info.shots[4].start+info.shots[4].end)/2);
  assert.deepEqual(cafeProof,{cards:0,rail:false,walls:true},`${lang}: the café orbit stays clear`);
  const cheers=await page.evaluate(()=>window.film.tl.cheerBeats);
  assert.ok(cheers.length>=4&&cheers.length<=10,`${lang}: sparse measured bass gestures`);
  const cheerPose=await page.evaluate(t=>{window.renderTime(t+.35);const p=window.film.world.places.traveler;
   return{hands:p.arms.map(a=>a.hand.position.y),beat:window.film.tl.cheer(t+.35)};},cheers[0]);
  assert.ok(cheerPose.beat>.9&&cheerPose.hands.every(y=>y>2),`${lang}: both hands lift on the bass`);
  const inspect=await page.evaluate(()=>Object.fromEntries(['catalog_export','track_pattern','tool_selection','orange_rail','Laptop Display'].map(name=>{
   const o=window.film.scene.getObjectByName(name);return[name,o?.userData.inspect?.(window.FILM.DURATION-.5)];
  })));
  assert.equal(inspect.catalog_export?.status,'verified');assert.equal(inspect.track_pattern?.status,'ready');
  assert.equal(inspect.tool_selection?.status,'verified');assert.equal(inspect.orange_rail?.verified,3);
  assert.equal(inspect['Laptop Display']?.tool,'verified');r.inspector=true;
  const dir=path.join(out,`browser-${lang}`);fs.mkdirSync(dir,{recursive:true});
  await page.evaluate(t=>window.renderTime(t+.35),cheers[0]);await page.screenshot({path:path.join(dir,'bass-cheer.png')});
  const call=await page.evaluate(()=>{const tl=window.film.tl;return tl.cheerBeats.find(t=>tl.shot(t).id==='S021');});
  assert.ok(Number.isFinite(call),`${lang}: the first VIBECODER call has a measured gesture`);
  const callHands=await page.evaluate(t=>{window.renderTime(t+.35);return window.film.world.places.traveler.arms.map(a=>a.hand.position.y);},call);
  assert.ok(callHands.every(y=>y>2),`${lang}: both hands are above the hood around the first call`);
  await page.screenshot({path:path.join(dir,'first-call-hands.png')});
  const rideBeats=await page.evaluate(()=>window.film.tl.rideBeats);
  assert.ok(rideBeats.length>=8,`${lang}: the coaster has repeated measured gestures`);
  const rideHands=await page.evaluate(t=>{window.renderTime(t+.35);const p=window.film.world.places;
   return{hands:p.groups.coaster.userData.rider.arms.map(a=>a.hand.position.y),pov:p.pov};},rideBeats[0]);
  assert.ok(rideHands.hands.every(y=>y>2)&&rideHands.pov<.1,`${lang}: both hands lift in the car`);
  await page.screenshot({path:path.join(dir,'ride-both-hands.png')});
  const singleHands=await page.evaluate(t=>{window.renderTime(t+.35);return window.film.world.places.groups.coaster.userData.rider.arms.map(a=>a.hand.position.y);},rideBeats[1]);
  assert.ok(singleHands[0]>2&&singleHands[1]<1.3,`${lang}: the next beat pumps one arm`);
  const povBeat=await page.evaluate(()=>{const tl=window.film.tl;return tl.rideBeats.find(t=>tl.shot(t).id==='S058');});
  assert.ok(Number.isFinite(povBeat),`${lang}: a gesture lands in the rider's view`);
  const povHands=await page.evaluate(t=>{window.renderTime(t+.35);const p=window.film.world.places;
   return{hands:p.povTyping.arms.map(a=>a.hand.position.toArray()),laptop:p.povLaptop.group.visible};},povBeat);
  assert.ok(povHands.laptop&&povHands.hands.some(([x,y])=>Math.abs(x)>.55&&y>.6),`${lang}: the laptop stays visible between raised POV hands`);
  await page.screenshot({path:path.join(dir,'ride-pov-hands.png')});
  r.motion={first_call:call,ride_beats:rideBeats.length};
  const flashTime=info.shots[35].start+.70;
  const storm=await page.evaluate(t=>{window.renderTime(t);const p=window.film.world.places.groups.forest;
   return{bolt:p.userData.bolt.visible,rain:p.userData.rain.lines.visible};},flashTime);
  assert.deepEqual(storm,{bolt:true,rain:true},`${lang}: the mountain has rain and lightning`);
  await page.screenshot({path:path.join(dir,'storm-flash.png')});
  const chosen=quick?info.shots.filter((_,i)=>i%6===0):info.shots;
  for(const s of chosen){const t=(s.start+s.end)/2,state=await page.evaluate(t=>window.renderTime(t),t);
   assert.equal(state.shot,s.id);assert.ok(state.camera.every(Number.isFinite));assert.ok(state.visibility>0&&state.visibility<=1);
   if(s.mode!=='2D'){
    const visible=await page.evaluate(()=>Object.entries(window.film.world.places.groups).filter(([,group])=>group.visible).map(([name])=>name));
    assert.deepEqual(visible,[state.place],`${lang} ${s.id} uses its assigned place`);
   }
   const file=`${s.id}.png`;await page.screenshot({path:path.join(dir,file)});r.screenshots.push(file);
  }
  const device=await page.evaluate(([ride,exit])=>{window.renderTime(ride);const during=window.film.world.places.povLaptop.group.visible;
   window.renderTime(exit);return{during,after:window.film.world.places.traveler.laptop.visible};},[
   (info.shots[57].start+info.shots[57].end)/2,(info.shots[65].start+info.shots[65].end)/2]);
  assert.deepEqual(device,{during:true,after:true});r.device=device;
  const route=await page.evaluate(()=>{
   const c=window.film.world.places.groups.coaster.userData.track;
   const a=c.getPointAt(0),b=c.getPointAt(1),top=Math.max(...Array.from({length:101},(_,i)=>c.getPointAt(i/100).y));
   const face=window.film.world.places.traveler.face;
   return{start:a.y,end:b.y,top,screenRatio:face.geometry.parameters.width/face.geometry.parameters.height};
  });
  assert.ok(route.start<1.5&&route.end<1.5&&route.top>8&&Math.abs(route.screenRatio-16/9)<.02);
  const ride=await page.evaluate(shots=>{
   const frames=shots.filter(s=>Number(s.id.slice(1))>=53&&Number(s.id.slice(1))<=65).map(s=>{
    const state=window.renderTime((s.start+s.end)/2);
    return{id:s.id,flat:state.flat,pov:window.film.world.places.pov,
     cards:window.film.world.cards.filter(c=>c.group.visible).length,
     rider:window.film.world.places.groups.coaster.userData.rider.group.visible};
   });return frames;
  },info.shots);
  assert.deepEqual(ride.filter(s=>s.flat).map(s=>s.id),['S062']);
  for(const id of['S053','S059','S061','S064'])assert.equal(ride.find(s=>s.id===id).rider,true,`${lang} ${id} shows the rider`);
  for(const id of['S058','S060','S063'])assert.ok(ride.find(s=>s.id===id).pov>.5,`${lang} ${id} uses POV`);
  assert.equal(ride.find(s=>s.id==='S059').cards,3);r.ride={start:'S053',flat:['S062'],third:['S053','S059','S061','S064']};
  for(const id of['S011','S017','S030','S062']){
   const shot=info.shots.find(s=>s.id===id),near=shot.start+.002,mid=(shot.start+shot.end)/2;
   const states=await page.evaluate(ts=>ts.map(t=>window.renderTime(t)),[near,mid]);
   assert.ok(states[0].screenZoom<.02&&states[1].screenZoom>.95,`${lang} ${id} zooms into the laptop`);
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
