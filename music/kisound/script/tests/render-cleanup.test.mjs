// Exercise failure cleanup with fake browser/HTTP server; no Chrome, network or song.
import test from 'node:test';
import assert from 'node:assert/strict';
import fsp from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);
test('TargetCloseError closes the browser and encoder and exits promptly',async t=>{
 const dir=await fsp.mkdtemp(path.join(os.tmpdir(),'kisound-cleanup-'));
 t.after(()=>fsp.rm(dir,{recursive:true,force:true}));
 const pkg=path.join(dir,'node_modules/puppeteer-core');
 await fsp.mkdir(path.join(pkg,'lib/esm/puppeteer'),{recursive:true});
 await fsp.writeFile(path.join(pkg,'package.json'),'{"type":"module"}');
 await fsp.writeFile(path.join(pkg,'lib/esm/puppeteer/puppeteer-core.js'),`
 import {EventEmitter} from 'node:events';import fs from 'node:fs';
 class Page extends EventEmitter {
  async setViewport(){} async goto(){} async waitForFunction(){}
  async evaluate(arg){
   if(arg==='window.__error')return null;
   if(arg==='window.FILM')return {FPS:60,FRAMES:12452};
   if(typeof arg==='function')throw new Error('TargetCloseError: Target closed (test)');
  }
 }
 class Browser extends EventEmitter {
  process(){return new EventEmitter();} async newPage(){return new Page();}
  async close(){fs.writeFileSync(process.env.CLOSE_MARKER,'closed');}
 }
 export default {launch:async()=>new Browser()};`);
 const entry=path.join(dir,'entry.mjs');
 await fsp.writeFile(entry,`import {run} from ${JSON.stringify(new URL('../render.mjs',import.meta.url).href)};import http from 'node:http';
 // No socket binding: this test targets cleanup, not serving pages.
 http.createServer=()=>({once(){return this;},listen(port,host,ready){ready();},address(){return {port:12345};},close(){},closeAllConnections(){}});
 await run(new URL('./',import.meta.url));`);
 await assert.rejects(exec(process.execPath,[entry,'--width','128','--height','72','--encoder','x264','--from','3600','--to','4800','--out',path.join(dir,'test.mp4')],
  {cwd:dir,timeout:12000,env:{...process.env,TMPDIR:dir,CLOSE_MARKER:path.join(dir,'closed')}}),e=>{
   assert.equal(e.killed,false);assert.match(e.stderr,/TargetCloseError: Target closed/);return true;
  });
 assert.equal(await fsp.readFile(path.join(dir,'closed'),'utf8'),'closed');
});
