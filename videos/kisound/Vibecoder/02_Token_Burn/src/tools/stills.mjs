// Renders single frames through the export-facing frame API: node src/tools/stills.mjs [--out dir] [--w 1280] t1 t2 …
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {startServer} from '../render/serve.mjs';
import {FPS} from '../render/config.js';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),args=process.argv.slice(2),opt=k=>{const i=args.indexOf(k);return i<0?null:args.splice(i,2)[1];};
const out=path.resolve(opt('--out')||path.join(root,'output/qa/stills')),w=+(opt('--w')||1280),h=Math.round(w*9/16),debug=args.includes('--debug')?(args.splice(args.indexOf('--debug'),1),'&debug=1'):'';const lang=opt('--lang')||'de';
fs.mkdirSync(out,{recursive:true});const server=await startServer(0),base=`http://127.0.0.1:${server.address().port}`;
const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true,args:['--no-sandbox']});
try{
 const page=await browser.newPage();await page.setViewport({width:w,height:h,deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(`${base}/?w=${w}&h=${h}&lang=${lang}${debug}`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:90000});
 const err=await page.evaluate(()=>window.__error);if(err)throw Error(err);
 for(const t of args.map(Number)){const ms=Date.now();await page.evaluate(n=>window.renderFrame(n),Math.round(t*FPS));const file=path.join(out,`${lang}-${t.toFixed(2).padStart(6,'0')}.png`);await page.screenshot({path:file});console.log(file,`${Date.now()-ms} ms`);}
 if(errors.length){console.error(errors.join('\n'));process.exitCode=1;}
}finally{await browser.close();server.close();}
