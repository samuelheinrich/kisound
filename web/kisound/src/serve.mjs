// Serves dist/ like the production web server: index.html per directory, MIME types, byte ranges
// (needed for seeking in <audio>). Optional extra roots for checks: {'/__src/': '/abs/dir'}.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json','.mp3':'audio/mpeg','.m4a':'audio/mp4','.wav':'audio/wav','.webp':'image/webp','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.ttf':'font/ttf','.xml':'application/xml','.txt':'text/plain'};
export function startServer(port=0,extra={}){return new Promise((resolve,reject)=>{
 const server=http.createServer((req,res)=>{
  try{
   let p=decodeURIComponent(new URL(req.url,'http://x').pathname),base=root;
   for(const[prefix,dir]of Object.entries(extra))if(p.startsWith(prefix)){base=dir;p='/'+p.slice(prefix.length);}
   let f=path.resolve(base,'.'+p);if(f!==base&&!f.startsWith(base+path.sep)){res.writeHead(403);res.end();return;}
   if(fs.existsSync(f)&&fs.statSync(f).isDirectory()){if(!p.endsWith('/')){res.writeHead(301,{Location:p+'/'});res.end();return;}f=path.join(f,'index.html');}
   if(!fs.existsSync(f)){res.writeHead(404,{'Content-Type':'text/plain'});res.end('Nicht gefunden');return;}
   const size=fs.statSync(f).size,type=types[path.extname(f)]||'application/octet-stream',range=/bytes=(\d*)-(\d*)/.exec(req.headers.range||'');
   if(range){const a=range[1]?+range[1]:size-+range[2],b=range[1]&&range[2]?+range[2]:size-1;res.writeHead(206,{'Content-Type':type,'Content-Range':`bytes ${a}-${b}/${size}`,'Content-Length':b-a+1,'Accept-Ranges':'bytes'});fs.createReadStream(f,{start:a,end:b}).pipe(res);return;}
   res.writeHead(200,{'Content-Type':type,'Content-Length':size,'Accept-Ranges':'bytes','Cache-Control':'no-store'});if(req.method==='HEAD'){res.end();return;}fs.createReadStream(f).pipe(res);
  }catch{res.writeHead(400);res.end();}
 });server.once('error',reject);server.listen(port,'127.0.0.1',()=>resolve(server));
});}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const port=Number(process.argv.find(a=>/^\d+$/.test(a))||8140);
 startServer(port).then(s=>console.log(`kisound.ch (dist): http://127.0.0.1:${s.address().port}/  · Beenden: Ctrl+C`)).catch(e=>{console.error(e.code==='EADDRINUSE'?`Port ${port} belegt: npm run serve -- 8141`:e);process.exitCode=1;});
}
