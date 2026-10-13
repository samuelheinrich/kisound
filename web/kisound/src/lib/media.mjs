// Derived media with a content cache: transcodes and image conversions run once per source version.
// Outputs get a short content hash in their file name, so the web server may cache them forever.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';

export const sha=(file,len=64)=>{const h=crypto.createHash('sha256');const fd=fs.openSync(file,'r'),buf=Buffer.alloc(1<<20);let n;while((n=fs.readSync(fd,buf,0,buf.length,null))>0)h.update(buf.subarray(0,n));fs.closeSync(fd);return h.digest('hex').slice(0,len);};
export class Media{
 constructor(cacheDir){this.dir=cacheDir;fs.mkdirSync(cacheDir,{recursive:true});}
 // Key from path, size and mtime: cheap, and a changed source always gets a new derivative.
 key(src,recipe){const st=fs.statSync(src);return crypto.createHash('sha1').update(`${path.resolve(src)}|${st.size}|${st.mtimeMs}|${recipe}`).digest('hex').slice(0,16);}
 cached(src,recipe,ext,make){const out=path.join(this.dir,`${this.key(src,recipe)}.${ext}`);if(!fs.existsSync(out)){const tmp=out+'.tmp.'+ext;make(tmp);fs.renameSync(tmp,out);}return out;}
 audio(wav,{format='mp3',bitrate='192k'}={}){
  return this.cached(wav,`audio:${format}:${bitrate}`,format,tmp=>{
   // Plain stereo stream, no tags or cover art: the page carries the metadata.
   const codec=format==='mp3'?['-c:a','libmp3lame','-b:a',bitrate]:['-c:a','aac','-b:a',bitrate,'-movflags','+faststart'];
   execFileSync('ffmpeg',['-v','error','-y','-i',wav,'-map_metadata','-1','-vn',...codec,tmp]);
  });
 }
 image(src,width,quality=82){
  return this.cached(src,`webp:${width}:${quality}`,'webp',tmp=>execFileSync('cwebp',['-quiet','-q',String(quality),'-resize',String(width),'0',src,'-o',tmp]));
 }
 // Waveform in three bands for the players: low (<200 Hz), mid (200–2000 Hz), high (>2 kHz), RMS per bin,
 // normalised so the loudest bin's total is 1. One-pole filters on a mono 11.025 kHz decode.
 wave(wav,bins=900){
  return this.cached(wav,`wave:${bins}:v1`,'json',tmp=>{
   const raw=execFileSync('ffmpeg',['-v','error','-i',wav,'-ac','1','-ar','11025','-f','f32le','-'],{maxBuffer:1<<28});
   const x=new Float32Array(raw.buffer,raw.byteOffset,raw.length/4),rate=11025,a1=1-Math.exp(-2*Math.PI*200/rate),a2=1-Math.exp(-2*Math.PI*2000/rate);
   const per=x.length/bins,out=[];let l1=0,l2=0;
   for(let b=0;b<bins;b++){let sl=0,sm=0,sh=0,n=0;for(let i=Math.floor(b*per);i<Math.floor((b+1)*per);i++){l1+=a1*(x[i]-l1);l2+=a2*(x[i]-l2);const lo=l1,mi=l2-l1,hi=x[i]-l2;sl+=lo*lo;sm+=mi*mi;sh+=hi*hi;n++;}out.push([sl,sm,sh].map(v=>Math.sqrt(v/Math.max(1,n))));}
   const max=Math.max(...out.map(([l,m,h])=>Math.hypot(l,m,h)))||1;
   fs.writeFileSync(tmp,JSON.stringify({duration:x.length/rate,bins:out.map(v=>v.map(y=>Math.round(y/max*1000)/1000))}));
  });
 }
 dims(file){const[w,h]=execFileSync('ffprobe',['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','csv=p=0',file]).toString().trim().split(',').map(Number);return{width:w,height:h};}
 jpeg(src,width){
  return this.cached(src,`jpg:${width}`,'jpg',tmp=>execFileSync('ffmpeg',['-v','error','-y','-i',src,'-vf',`scale=${width}:-2`,'-q:v','3',tmp]));
 }
 duration(file){return Number(execFileSync('ffprobe',['-v','error','-show_entries','format=duration','-of','csv=p=0',file]).toString().trim());}
}
// Copies a file into dist under a hashed name: name.<hash>.ext
export function publish(src,distDir,rel,name){
 const ext=path.extname(src),hash=sha(src,10),file=`${name}.${hash}${ext}`,dest=path.join(distDir,rel,file);
 fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(src,dest);return file;
}
