// Stills for the video cards, rendered from the built film page in headless Chrome (single-frame mode
// ?w=&h=&t=). Cached by film bundle and time, so an unchanged film is not rendered again.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import puppeteer from 'puppeteer-core';
import {startServer} from '../serve.mjs';
export async function renderPosters(jobs,cacheDir){
 const todo=jobs.filter(j=>!fs.existsSync(j.cacheFile=path.join(cacheDir,`poster-${j.js.replace(/\.js$/,'')}-${j.time}${(j.url.match(/[?&]v=(\w+)/)||[])[1]?'-'+j.url.match(/[?&]v=(\w+)/)[1]:''}.webp`)));
 if(todo.length){
  const server=await startServer(0),base=`http://127.0.0.1:${server.address().port}/`;
  const browser=await puppeteer.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
  try{
   const page=await browser.newPage();await page.setViewport({width:1280,height:720});
   for(const j of todo){
    await page.goto(`${base}${j.url}${j.url.includes('?')?'&':'?'}w=1280&h=720&t=${j.time}`,{waitUntil:'networkidle0'});await page.waitForFunction('window.__ready||window.__error',{timeout:120000});
    const err=await page.evaluate(()=>{document.getElementById('loading')?.remove();return window.__error;});if(err)throw Error(`${j.url}: ${err}`);
    const png=j.cacheFile.replace(/\.webp$/,'.png');await page.screenshot({path:png});execFileSync('cwebp',['-quiet','-q','82',png,'-o',j.cacheFile]);fs.rmSync(png);
   }
  }finally{await browser.close();server.close();}
 }
 return jobs.map(j=>j.cacheFile);
}
