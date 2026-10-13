import { DURATION,FPS,CHAPTERS } from './config.js';
import { clamp } from './timeline.js';
export async function startPlayer({film,width,height,initialTime=0}){
 const ctx=new AudioContext({sampleRate:48000,latencyHint:'interactive'}),gain=ctx.createGain();gain.connect(ctx.destination);
 const response=await fetch('/assets/audio/wifi-roaming.wav');
 if(!response.ok)throw new Error('Originalaudio fehlt. Bitte npm run prepare ausführen.');
 const buffer=await ctx.decodeAudioData(await response.arrayBuffer());
 if(Math.abs(buffer.duration-DURATION)>.002)throw new Error('Die geladene Audiodauer passt nicht zur Timeline.');
 const el=document.createElement('div');el.id='player';
 el.innerHTML=`<button id="play" aria-label="Wiedergabe starten" title="Play/Pause (Leertaste)">▶</button>
 <div id="player-title">05 / WIFI ROAMING <span style="color:#7190a7"> · Browservorschau</span></div><div id="clock"></div>
 <div id="scrub" role="slider" tabindex="0" aria-label="Abspielposition" aria-valuemin="0" aria-valuemax="${DURATION}"><canvas></canvas></div>
 <div id="controls"><select id="chapter" title="Kapitel" aria-label="Kapitel"></select>
 <select id="rate" title="Geschwindigkeit" aria-label="Geschwindigkeit"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1" selected>1×</option></select>
 <select id="resolution" title="Auflösung" aria-label="Auflösung"><option value="720">720p</option><option value="1080">1080p</option></select>
 <button id="loop" title="Schleife (L)" aria-label="Schleife">↻</button><button id="mute" title="Stumm (M)" aria-label="Stummschaltung">Ton</button>
 <input id="volume" type="range" min="0" max="1" step="0.01" value="1" aria-label="Lautstärke">
 <button id="debug" title="Diagnoseanzeigen (D)">Cues</button><button id="fullscreen" title="Vollbild (F)" aria-label="Vollbild">⛶</button></div>`;
 document.body.append(el);const $=id=>document.getElementById(id),stage=$('stage');
 CHAPTERS.forEach((c,i)=>{const o=document.createElement('option');o.value=c.start;o.textContent=`${String(i+1).padStart(2,'0')} ${c.title}`;$('chapter').append(o);});
 $('resolution').value=String(height);$('debug').classList.toggle('on',film.debug);
 const state={playing:false,offset:clamp(initialTime,0,DURATION),started:0,rate:1,source:null,loop:false,muted:false,volume:1,generation:0};
 const current=()=>clamp(state.offset+(state.playing?Math.max(0,ctx.currentTime-state.started)*state.rate:0),0,DURATION);
 const stopSource=()=>{if(state.source){state.source.onended=null;try{state.source.stop();}catch{}state.source.disconnect();state.source=null;}};
 const startSource=()=>{const src=ctx.createBufferSource();src.buffer=buffer;src.playbackRate.value=state.rate;src.connect(gain);state.started=ctx.currentTime+.025;src.start(state.started,state.offset);state.source=src;};
 const pause=()=>{state.offset=current();state.playing=false;state.generation++;stopSource();$('play').textContent='▶';$('play').setAttribute('aria-label','Wiedergabe starten');};
 const play=async()=>{
  if(state.playing)return;const generation=++state.generation;await ctx.resume();if(generation!==state.generation)return;
  if(state.offset>=DURATION)state.offset=0;startSource();state.playing=true;$('play').textContent='❚❚';$('play').setAttribute('aria-label','Wiedergabe pausieren');
 };
 const seek=t=>{const was=state.playing;pause();state.offset=clamp(t,0,DURATION);film.render(state.offset);if(was&&state.offset<DURATION)void play();};
 const toggle=()=>state.playing?pause():void play();
 const format=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;
 const tc=$('scrub').querySelector('canvas');
 function drawTrack(t){
  const r=tc.getBoundingClientRect(),dpr=devicePixelRatio||1;
  if(tc.width!==Math.round(r.width*dpr)||tc.height!==Math.round(r.height*dpr)){tc.width=Math.round(r.width*dpr);tc.height=Math.round(r.height*dpr);}
  const g=tc.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,r.width,r.height);
  const rows=film.tl.rows,X=s=>s/DURATION*r.width;
  for(let x=0;x<r.width;x+=2){const row=rows[Math.min(rows.length-1,Math.floor(x/r.width*rows.length))],h=2+clamp((row[1]+45)/35)*18;
   g.fillStyle=x<X(t)?'#68bcae':'#2b4054';g.fillRect(x,24-h/2,1.3,h);
  }
  CHAPTERS.forEach((c,i)=>{const x=X(c.start);g.fillStyle='#648499';g.fillRect(x,8,1,30);g.font='8px monospace';g.fillText(String(i+1),x+3,7);});
  g.fillStyle='#e3f3f3';g.fillRect(X(t),8,2,31);
 }
 function fit(){const bar=el.getBoundingClientRect().height,w=innerWidth,h=innerHeight-bar,s=Math.min(w/width,h/height);stage.style.transform=`translate(${(w-width*s)/2}px,${(h-height*s)/2}px) scale(${s})`;drawTrack(current());}
 let dragging=false,resume=false;
 const tAt=e=>{const r=tc.getBoundingClientRect();return clamp((e.clientX-r.left)/r.width*DURATION,0,DURATION);};
 $('scrub').onpointerdown=e=>{dragging=true;resume=state.playing;pause();seek(tAt(e));$('scrub').setPointerCapture(e.pointerId);};
 $('scrub').onpointermove=e=>{if(dragging)seek(tAt(e));};
 const finishDrag=()=>{if(!dragging)return;dragging=false;if(resume&&state.offset<DURATION)void play();};
 $('scrub').onpointerup=finishDrag;$('scrub').onpointercancel=()=>{dragging=false;resume=false;};
 $('play').onclick=toggle;$('chapter').onchange=e=>seek(+e.target.value);
 $('loop').onclick=()=>{$('loop').classList.toggle('on',state.loop=!state.loop);};
 const volume=()=>{gain.gain.setValueAtTime(state.muted?0:state.volume,ctx.currentTime);$('mute').classList.toggle('on',state.muted);$('mute').textContent=state.muted?'Stumm':'Ton';};
 $('mute').onclick=()=>{state.muted=!state.muted;volume();};$('volume').oninput=e=>{state.volume=+e.target.value;volume();};
 $('rate').onchange=e=>{const was=state.playing;pause();state.rate=+e.target.value;if(was)void play();};
 $('resolution').onchange=e=>{pause();const url=new URL(location.href);url.searchParams.set('res',e.target.value);url.searchParams.set('t',state.offset.toFixed(6));url.searchParams.set('debug',film.debug?'1':'0');location.href=url;};
 $('debug').onclick=()=>{$('debug').classList.toggle('on',film.debug=!film.debug);};
 $('fullscreen').onclick=()=>{const promise=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();promise?.catch(console.warn);};
 window.addEventListener('keydown',e=>{
  if(['SELECT','INPUT'].includes(e.target.tagName))return;
  if(['Space','ArrowLeft','ArrowRight','Home','End'].includes(e.code))e.preventDefault();
  if(e.code==='Space')toggle();
  else if(e.code==='ArrowRight'||e.code==='ArrowLeft'){const d=e.code==='ArrowRight'?1:-1;seek(e.shiftKey?(Math.round(current()*FPS)+d)/FPS:current()+d);}
  else if(e.code==='Home')seek(0);else if(e.code==='End')seek(DURATION);
  else if(e.key.toLowerCase()==='l')$('loop').click();else if(e.key.toLowerCase()==='m')$('mute').click();
  else if(e.key.toLowerCase()==='d')$('debug').click();else if(e.key.toLowerCase()==='f')$('fullscreen').click();
  else if(/^[1-9]$/.test(e.key))seek(CHAPTERS[+e.key-1].start);
 });
 window.addEventListener('resize',fit);fit();
 let last=performance.now(),avg=60,lastFrameKey='';
 const tick=()=>{
  let t=current();if(state.playing&&t>=DURATION){const loop=state.loop;pause();state.offset=loop?0:DURATION;t=state.offset;if(loop)void play();}
  const key=`${t}:${film.debug}`;
  if(key!==lastFrameKey){film.render(t);lastFrameKey=key;}
  const now=performance.now();if(state.playing)avg=.95*avg+.05*1000/Math.max(1,now-last);last=now;
  $('clock').textContent=`${format(t)} / ${format(DURATION)} · ${state.playing?avg.toFixed(0)+' fps':'Pause'}`;
  const chapter=film.tl.chapter(t);$('chapter').value=String(chapter.start);$('scrub').setAttribute('aria-valuenow',String(t));drawTrack(t);
  requestAnimationFrame(tick);
 };tick();
 return{play,pause,seek,current,state,audioDuration:buffer.duration,context:ctx};
}
