import * as THREE from 'three';
import {Film} from './film.js';
import {Timeline,clamp} from './timeline.js';
import {DURATION,FPS,FRAMES,SOURCE_SHA256} from './config.js';
// Web interface: a hosting page may set window.KISOUND_PAGE {analysis, defaultRes}; the local preview needs nothing.
const PAGE=window.KISOUND_PAGE||{},q=new URLSearchParams(location.search),isPlayer=!q.has('w'),RES=[540,720,1080];
const wanted=Number(q.get('res')||PAGE.defaultRes||1080),height=isPlayer?(RES.includes(wanted)?wanted:1080):Number(q.get('h')||540),width=isPlayer?height*16/9:Number(q.get('w')||960);
const progress=(n,s)=>{document.getElementById('load-progress').value=n;document.getElementById('load-status').textContent=s;};
async function boot(){
 progress(0,'Analyse und Schriften laden …');const res=await fetch(PAGE.analysis||'/ASTRA-AUDIO-ANALYSE.json');if(!res.ok)throw Error('Audioanalyse fehlt');const analysis=await res.json();if(analysis.source.sha256!==SOURCE_SHA256)throw Error('Analyse gehört nicht zur festgelegten WAV');
 await Promise.all([document.fonts.load('500 32px "Space Grotesk"'),document.fonts.load('400 24px "JetBrains Mono"'),document.fonts.load('400 112px "Michroma"')]);const timeline=new Timeline(analysis);progress(1,'QoS-Maschine aufbauen …');
 const stage=document.getElementById('stage');stage.style.width=width+'px';stage.style.height=height+'px';const canvas=document.createElement('canvas'),overlay=document.createElement('canvas');overlay.width=width;overlay.height=height;stage.append(canvas,overlay);
 const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance',preserveDrawingBuffer:true});renderer.setPixelRatio(1);renderer.setSize(width,height);renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.outputColorSpace=THREE.SRGBColorSpace;
 const film=new Film({renderer,width,height,overlay,timeline,debug:q.get('debug')==='1'});window.film=film;window.renderTime=t=>film.render(t);window.renderFrame=n=>{film.render(clamp(n/FPS,0,DURATION));renderer.getContext().finish();return true;};window.FILM={FPS,FRAMES,W:width,H:height,DURATION};
 progress(2,'Originalaudio vorbereiten …');if(isPlayer){const{startPlayer}=await import('./player.js');window.player=await startPlayer({film,width,height,initialTime:Number(q.get('t')||0)});}else film.render(Number(q.get('t')||0));
 progress(4,'Bereit');document.getElementById('loading').remove();window.__ready=true;
}
boot().catch(e=>{window.__error=String(e.stack||e);console.error(e);document.getElementById('load-status').textContent='Vorschau konnte nicht geladen werden';const el=document.getElementById('error');el.hidden=false;el.textContent=e.message+'\n\nVorbereitung prüfen: npm run prepare';});
