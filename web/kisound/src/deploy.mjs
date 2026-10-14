// Uploads dist/ to the web space (account root is the site root, no shell).
//   npm run deploy                 plan only, nothing is transferred
//   npm run deploy -- --test       connect and list the remote root
//   npm run deploy -- --live       upload new and changed files (assets first, HTML last)
//   npm run deploy -- --live --prune   also delete old build files (only hashed names like x.0123456789.js)
// Server, account and keychain service come from local environment variables.
// The password comes from the macOS keychain or KISOUND_DEPLOY_PASSWORD.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import SftpClient from 'ssh2-sftp-client';
import * as ftp from 'basic-ftp';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..'),dist=path.join(root,'dist');
const cfg=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8')).deploy||{};
const deployHost=process.env.KISOUND_DEPLOY_HOST?.trim(),deployUser=process.env.KISOUND_DEPLOY_USER?.trim();
const keychainService=process.env.KISOUND_DEPLOY_KEYCHAIN_SERVICE?.trim();
const args=process.argv.slice(2),live=args.includes('--live'),prune=args.includes('--prune'),test=args.includes('--test');
const protocol=(args.find(a=>a.startsWith('--protocol='))?.split('=')[1]||cfg.protocol||'sftp').toLowerCase(),remoteRoot=(cfg.root||'/').replace(/\/?$/,'/');
const HASHED=/\.[0-9a-f]{10}\.[a-z0-9]+$/,ALWAYS=/\.(html|xml|txt)$|^\.htaccess$|build-manifest\.json$/;
if(!deployHost||!deployUser){console.error('KISOUND_DEPLOY_HOST und KISOUND_DEPLOY_USER müssen lokal gesetzt sein.');process.exit(1);}
if(!test&&!fs.existsSync(path.join(dist,'index.html'))){console.error('dist/ fehlt: zuerst npm run build und npm run check.');process.exit(1);}
function password(){
 if(process.env.KISOUND_DEPLOY_PASSWORD)return process.env.KISOUND_DEPLOY_PASSWORD;
 if(!keychainService){console.error('KISOUND_DEPLOY_KEYCHAIN_SERVICE fehlt (alternativ KISOUND_DEPLOY_PASSWORD setzen).');process.exit(1);}
 try{return execFileSync('security',['find-generic-password','-s',keychainService,'-a',deployUser,'-w'],{stdio:['ignore','pipe','ignore']}).toString().trim();}
 catch{console.error('Kein Passwort im lokalen Schlüsselbund gefunden.');process.exit(1);}
}
// One small interface over both protocols.
async function connect(){
 const pass=password();
 if(protocol==='sftp'){const c=new SftpClient();await c.connect({host:deployHost,port:22,username:deployUser,password:pass,readyTimeout:20000});
  return{list:async p=>(await c.list(p)).map(e=>({name:e.name,dir:e.type==='d',size:e.size})),mkdir:p=>c.mkdir(p,true),put:(l,r)=>c.fastPut(l,r),remove:p=>c.delete(p),close:()=>c.end()};}
 const c=new ftp.Client(30000);await c.access({host:deployHost,user:deployUser,password:pass,secure:protocol!=='ftp'});   // ftps (explicit TLS) unless plain ftp is forced
 return{list:async p=>(await c.list(p)).map(e=>({name:e.name,dir:e.isDirectory,size:e.size})),mkdir:p=>c.ensureDir(p).then(()=>c.cd('/')),put:(l,r)=>c.uploadFrom(l,r),remove:p=>c.remove(p),close:()=>c.close()};
}
const localFiles=(dir,rel='')=>fs.readdirSync(path.join(dir,rel),{withFileTypes:true}).flatMap(e=>{const r=rel?`${rel}/${e.name}`:e.name;return e.isDirectory()?localFiles(dir,r):[{rel:r,size:fs.statSync(path.join(dir,r)).size}];});
async function remoteFiles(c,rel=''){
 const out=[];let entries=[];try{entries=await c.list(remoteRoot+rel);}catch{return out;}
 for(const e of entries){if(e.name==='.'||e.name==='..')continue;const r=rel?`${rel}/${e.name}`:e.name;if(e.dir)out.push(...await remoteFiles(c,r));else out.push({rel:r,size:e.size});}
 return out;
}
let c;
try{c=await connect();}
catch(e){const auth=/authentication|530|login/i.test(String(e.message));console.error(auth?'Anmeldung abgelehnt. Passwort im Schlüsselbund prüfen.':'Verbindung fehlgeschlagen. Server und Netzwerk prüfen.');process.exit(1);}
try{
 console.log(`Verbunden: ${protocol.toUpperCase()}, Ziel ${remoteRoot}`);
 if(test){const top=await c.list(remoteRoot);console.log(top.filter(e=>e.name!=='.'&&e.name!=='..').map(e=>`  ${e.dir?'d':'-'} ${e.name}${e.dir?'/':''}  ${e.dir?'':e.size}`).join('\n')||'  (leer)');}
 else{
  const local=localFiles(dist),remote=new Map((await remoteFiles(c)).map(f=>[f.rel,f.size]));
  const upload=local.filter(f=>!remote.has(f.rel)||remote.get(f.rel)!==f.size||ALWAYS.test(path.basename(f.rel)));
  upload.sort((a,b)=>/\.html$/.test(a.rel)-/\.html$/.test(b.rel));   // assets before pages
  const localSet=new Set(local.map(f=>f.rel)),stale=[...remote.keys()].filter(r=>!localSet.has(r)&&HASHED.test(r));
  const mb=upload.reduce((s,f)=>s+f.size,0)/1e6;
  console.log(`${upload.length} von ${local.length} Dateien zu übertragen (${mb.toFixed(1)} MB), ${stale.length} alte Build-Dateien${prune?' werden gelöscht':' (nur mit --prune löschen)'}.`);
  if(!live){upload.slice(0,40).forEach(f=>console.log(`  ↑ ${f.rel}`));if(upload.length>40)console.log(`  … ${upload.length-40} weitere`);stale.forEach(r=>console.log(`  ✕ ${r}`));console.log('\nProbelauf. Übertragen: npm run deploy -- --live');}
  else{
   const dirs=new Set();for(const f of upload){const d=path.posix.dirname(f.rel);if(d!=='.'&&!dirs.has(d)){await c.mkdir(remoteRoot+d);dirs.add(d);}}
   let n=0;for(const f of upload){await c.put(path.join(dist,f.rel),remoteRoot+f.rel);n++;if(n%10===0||n===upload.length)console.log(`  ${n}/${upload.length}`);}
   if(prune)for(const r of stale){await c.remove(remoteRoot+r);console.log(`  ✕ ${r}`);}
   console.log(`Fertig: ${n} Dateien übertragen.`);
  }
 }
}finally{await c.close();}
