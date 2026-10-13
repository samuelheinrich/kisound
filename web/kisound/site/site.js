// Audio player of the site: a dock at the bottom with cover, ±10 s and a section waveform.
// Any element with data-audio starts its track; .wave-inline elements show the waveform of a track
// on its page and start playback at the clicked position. Bundled with wave.js by the build.
import {drawWave,fmtTime} from './wave.js';
// Language: both languages are in the page; html[data-lang] picks one (set in <head> before the first paint).
// The switch stores the choice; embedded live code pages follow through the storage event.
function applyLang(l){
 const h=document.documentElement;h.dataset.lang=l;h.lang=l==='de'?'de-CH':'en';document.title=h.dataset[l==='de'?'titleDe':'titleEn']||document.title;
 for(const el of document.querySelectorAll('[data-i18n]')){let m;try{m=JSON.parse(el.dataset.i18n);}catch{continue;}for(const[k,v]of Object.entries(m))el.setAttribute(k,v[l==='de'?0:1]??v[0]);}
}
applyLang(document.documentElement.dataset.lang==='en'?'en':'de');
document.getElementById('lang-toggle')?.addEventListener('click',()=>{const l=document.documentElement.dataset.lang==='en'?'de':'en';try{localStorage.setItem('kisound.lang',l);}catch{}applyLang(l);});
window.addEventListener('storage',e=>{if(e.key==='kisound.lang'&&e.newValue)applyLang(e.newValue==='en'?'en':'de');});
// Sung versions (DE/EN recordings of one track): html[data-version] shows the matching lyrics, waveform and facts;
// the choice is stored for every track and shared with the embedded live code (storage event, iframe reload).
// Choosing a sung version also chooses the language of the page and the player, before the iframe reloads.
const version=()=>document.documentElement.dataset.version||document.documentElement.dataset.lang||'de';
function applyVersion(v,{store=true,reloadFrame=true}={}){
 const h=document.documentElement,changed=h.dataset.version!==v;h.dataset.version=v;if(store){try{localStorage.setItem('kisound.version',v);}catch{}}
 for(const b of document.querySelectorAll('[data-version-set]'))b.setAttribute('aria-pressed',String(b.dataset.versionSet===v));
 for(const a of document.querySelectorAll('a[data-live-link]'))a.href=`live/?v=${v}`;
 const f=document.querySelector('.film-frame iframe');if(f&&reloadFrame&&changed&&document.querySelector('[data-version-set]'))f.src=`live/?embed=1&v=${v}`;
 window.dispatchEvent(new Event('resize'));
}
if(document.querySelector('[data-version-set]')){const v=document.querySelector(`[data-version-set="${version()}"]`)?version():document.querySelector('[data-version-set]').dataset.versionSet;applyVersion(v,{store:false,reloadFrame:false});}
document.addEventListener('click',e=>{const b=e.target.closest('[data-version-set]');if(!b)return;e.preventDefault();const v=b.dataset.versionSet;
 if(v==='de'||v==='en'){try{localStorage.setItem('kisound.lang',v);}catch{}applyLang(v);}applyVersion(v);});
window.addEventListener('storage',e=>{if(e.key==='kisound.version'&&e.newValue&&document.querySelector('[data-version-set]'))applyVersion(e.newValue,{store:false,reloadFrame:false});});
const audio=new Audio();audio.preload='none';
const $=id=>document.getElementById(id),dock=$('dock'),waves=new Map();
let queue=[],index=-1,cur=null,pendingSeek=null,hover=null;
const loadWave=url=>{if(!url)return Promise.resolve(null);if(!waves.has(url))waves.set(url,fetch(url).then(r=>r.json()).catch(()=>null));return waves.get(url);};
const info=el=>{const base={audio:el.dataset.audio,title:el.dataset.title,sub:el.dataset.sub||'',cover:el.dataset.cover||'',wave:el.dataset.wave||'',video:el.dataset.video||'',key:el.dataset.audio};
 // a track with sung versions plays the chosen one; the row keeps its key so play/pause still toggles
 if(el.dataset.versions){try{const all=JSON.parse(el.dataset.versions),v=all[version()]||Object.values(all)[0];return{...base,...v,key:el.dataset.audio};}catch{}}return base;};
async function load(track,{at=0,autoplay=true}={}){
 cur=track;audio.src=track.audio;pendingSeek=at>0?at:null;dock.hidden=false;document.body.classList.add('docked');
 $('dock-title').textContent=track.title;$('dock-sub').textContent=track.sub;$('dock-cover').src=track.cover;$('dock-cover').hidden=!track.cover;
 const v=$('dock-video');v.hidden=!track.video;if(track.video)v.href=track.video;
 if(autoplay)audio.play().catch(()=>{});
 if('mediaSession'in navigator)navigator.mediaSession.metadata=new MediaMetadata({title:track.title,artist:track.sub,artwork:track.cover?[{src:track.cover,sizes:'240x240',type:'image/webp'}]:[]});
 cur.waveData=await loadWave(track.wave);draw();sync();
}
audio.addEventListener('loadedmetadata',()=>{if(pendingSeek!=null){audio.currentTime=pendingSeek;pendingSeek=null;}});
function playButtons(){return[...document.querySelectorAll('.row-play[data-audio]')];}
function sync(){
 for(const b of document.querySelectorAll('[data-audio]')){const on=cur&&b.dataset.audio===cur.key;b.classList.toggle('on',on);
  const icon=on&&!audio.paused?'❚❚':'▶';if(b.classList.contains('row-play'))b.textContent=icon;else{const i=b.querySelector('.ico');if(i)i.textContent=icon;}}
 $('dock-play').textContent=audio.paused?'▶':'❚❚';
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-audio]:not(.wave-inline)');
 if(b){e.preventDefault();if(cur&&cur.key===b.dataset.audio){audio.paused?audio.play():audio.pause();return;}queue=playButtons();index=queue.findIndex(x=>x.dataset.audio===b.dataset.audio);void load(info(b));return;}
 if(e.target.closest('[data-playall]')){queue=playButtons();index=0;if(queue[0])void load(info(queue[0]));}
});
// Inline waveforms on track pages: click to start or jump.
for(const el of document.querySelectorAll('.wave-inline')){
 const canvas=el.querySelector('canvas');let data=null;
 const paint=()=>{if(data)drawWave(canvas,{bins:data.bins,sections:data.sections,duration:data.duration,time:cur?.key===el.dataset.audio?audio.currentTime:0,hover:el._hover??null});};
 loadWave(el.dataset.wave).then(d=>{data=d;paint();});el._paint=paint;
 const tAt=e=>{const r=canvas.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*(data?.duration||0);};
 el.addEventListener('pointermove',e=>{el._hover=e.pointerType==='mouse'?tAt(e):null;paint();});el.addEventListener('pointerleave',()=>{el._hover=null;paint();});
 el.addEventListener('click',e=>{const t=tAt(e);if(cur?.key===el.dataset.audio){audio.currentTime=t;if(audio.paused)audio.play();}else{queue=[el];index=0;void load(info(el),{at:t});}});
 window.addEventListener('resize',paint);
}
function draw(){
 const d=cur?.waveData;if(d)drawWave($('dock-wave').querySelector('canvas'),{bins:d.bins,sections:d.sections,duration:audio.duration||d.duration,time:audio.currentTime,hover});
 else{const c=$('dock-wave').querySelector('canvas'),g=c.getContext('2d');c.width=c.clientWidth;c.height=c.clientHeight;g.fillStyle='#ff9a3c';g.fillRect(0,c.height/2-1,c.width*(audio.currentTime/(audio.duration||1)),2);}
 $('dock-time').textContent=`${fmtTime(audio.currentTime)} / ${fmtTime(audio.duration||d?.duration)}`;
 for(const el of document.querySelectorAll('.wave-inline'))el._paint?.();
}
const wave=$('dock-wave'),tAt=e=>{const r=wave.getBoundingClientRect();return Math.max(0,Math.min(1,(e.clientX-r.left)/r.width))*(audio.duration||cur?.waveData?.duration||0);};
let dragging=false;
wave?.addEventListener('pointerdown',e=>{dragging=true;wave.setPointerCapture(e.pointerId);audio.currentTime=tAt(e);draw();});
wave?.addEventListener('pointermove',e=>{hover=e.pointerType==='mouse'?tAt(e):null;if(dragging)audio.currentTime=tAt(e);draw();});
wave?.addEventListener('pointerup',()=>{dragging=false;});wave?.addEventListener('pointerleave',()=>{hover=null;draw();});
$('dock-play')?.addEventListener('click',()=>audio.paused?audio.play():audio.pause());
$('dock-back')?.addEventListener('click',()=>{audio.currentTime=Math.max(0,audio.currentTime-10);draw();});
$('dock-fwd')?.addEventListener('click',()=>{audio.currentTime=Math.min(audio.duration||0,audio.currentTime+10);draw();});
$('dock-close')?.addEventListener('click',()=>{audio.pause();dock.hidden=true;document.body.classList.remove('docked');});
document.addEventListener('keydown',e=>{if(!cur||dock.hidden||['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if(e.code==='Space'){e.preventDefault();audio.paused?audio.play():audio.pause();}});
audio.addEventListener('timeupdate',draw);audio.addEventListener('play',()=>{sync();loop();});audio.addEventListener('pause',sync);
audio.addEventListener('ended',()=>{if(index+1<queue.length&&queue[index+1].classList.contains('row-play')){index++;void load(info(queue[index]));}else sync();});
function loop(){if(!audio.paused){draw();requestAnimationFrame(loop);}}
if('mediaSession'in navigator){try{navigator.mediaSession.setActionHandler('seekbackward',()=>{audio.currentTime-=10;});navigator.mediaSession.setActionHandler('seekforward',()=>{audio.currentTime+=10;});}catch{}}
window.addEventListener('resize',draw);
// Soft zoom for images marked data-zoom (audio analysis): an overlay on the same page, closed by click, × or Esc.
document.addEventListener('click',e=>{
 const a=e.target.closest('a[data-zoom]');if(!a||e.metaKey||e.ctrlKey||e.shiftKey)return;e.preventDefault();
 const box=document.createElement('div'),en=document.documentElement.dataset.lang==='en';box.className='zoom';box.setAttribute('role','dialog');box.setAttribute('aria-modal','true');
 box.innerHTML=`<button class="zoom-close" type="button" aria-label="${en?'Close':'Schliessen'}">×</button><figure><img alt=""></figure>`;
 const im=box.querySelector('img');im.src=a.href;im.alt=a.querySelector('img')?.alt||'';document.body.append(box);document.body.classList.add('zoomed');
 const close=()=>{box.classList.remove('open');document.body.classList.remove('zoomed');document.removeEventListener('keydown',key);setTimeout(()=>box.remove(),260);a.focus({preventScroll:true});};
 const key=ev=>{if(ev.key==='Escape')close();};document.addEventListener('keydown',key);box.addEventListener('click',close);
 requestAnimationFrame(()=>box.classList.add('open'));box.querySelector('.zoom-close').focus({preventScroll:true});
});
