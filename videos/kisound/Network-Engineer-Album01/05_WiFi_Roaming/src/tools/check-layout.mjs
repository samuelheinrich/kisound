import puppeteer from 'puppeteer-core';import fs from 'node:fs';import path from 'node:path';import assert from 'node:assert/strict';import{fileURLToPath}from'node:url';
import{startServer}from'../render/serve.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),out=path.join(root,'output/qa-v3');fs.mkdirSync(out,{recursive:true});
const server=await startServer(0);let browser;const report={status:'running',errors:[],frames:[]};
try{
 browser=await puppeteer.launch({executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
 const page=await browser.newPage();await page.setViewport({width:1280,height:720});page.on('pageerror',e=>report.errors.push(String(e)));
 await page.goto(`http://127.0.0.1:${server.address().port}/?w=1280&h=720`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error');assert.equal(await page.evaluate(()=>window.__error),undefined);
 for(const t of[18,28.5,40.1,46.3,51,61.8,62.5,63.8,68.7,79,91.7,117.4,118.9,129.8,149.1,153.9,172]){
  await page.evaluate(t=>window.renderFrame(Math.round(t*60)),t);const file=`layout-${t.toFixed(3).padStart(7,'0')}.png`;await page.screenshot({path:path.join(out,file)});report.frames.push({t,file});
 }
 assert.equal(report.errors.length,0);report.status='passed';
}catch(e){report.status='failed';report.failure=String(e.stack);process.exitCode=1;}finally{if(browser)await browser.close();await new Promise(r=>server.close(r));fs.writeFileSync(path.join(out,'layout-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report));}
