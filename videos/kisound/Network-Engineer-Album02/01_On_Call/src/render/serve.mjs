import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const types={'.html':'text/html','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.ttf':'font/ttf','.png':'image/png','.wav':'audio/wav','.glb':'model/gltf-binary'};
export function startServer(port=0){return new Promise((resolve,reject)=>{
 const server=http.createServer((req,res)=>{
  try{
   const p=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
   if(p==='/favicon.ico'){res.writeHead(204);res.end();return;}
   const f=path.resolve(root,'.'+(p==='/'?'/src/render/index.html':p));
   if(!f.startsWith(root+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);res.end('Datei fehlt');return;}
   res.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream','Cache-Control':'no-store'});
   const stream=fs.createReadStream(f);stream.on('error',()=>res.destroy());stream.pipe(res);
  }catch{res.writeHead(400);res.end('Ungültiger Pfad');}
 });server.once('error',reject);server.listen(port,'127.0.0.1',()=>resolve(server));
});}
if(process.argv[1]===fileURLToPath(import.meta.url)){
 const port=Number(process.argv.find(a=>/^\d+$/.test(a))||8150);
 startServer(port).then(server=>{
  const url=`http://127.0.0.1:${server.address().port}/`;
  console.log(`On Call: ${url}\n720p: ?res=720 · Diagnose: ?debug=1 · Beenden: Ctrl+C`);
  if(process.argv.includes('--open'))spawn('open',['-a','Google Chrome',url],{stdio:'ignore',detached:true}).unref();
 }).catch(e=>{console.error(e.code==='EADDRINUSE'?`Port ${port} belegt. Anderen Port wählen: npm run preview -- 8151`:e);process.exitCode=1;});
}
