// Public player for code videos on kisound.ch. It replaces the project's own player.js at build time
// and accepts both project contracts: startPlayer({film,width,height,initialTime}) and the older
// startPlayer({film,duration,fps,W,H,…}) of Last Hop. Simple mode for visitors, expert mode with every
// control of the local preview. The audio clock drives the film; the film is a pure function of time.
import {DURATION,FPS,CHAPTERS} from 'kisound:config';
import {drawWave,fmtTime} from '../site/wave.js';
import {createTech} from './tech.js';
const PAGE=window.KISOUND_PAGE||{};
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmtFine=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;
const store={get(k){try{return localStorage.getItem(k);}catch{return null;}},set(k,v){try{localStorage.setItem(k,v);}catch{}}};
const status=s=>{const el=document.getElementById('load-status');if(el)el.textContent=s;};
// Two languages, same switch as the site (localStorage 'kisound.lang', html[data-lang]). Chapter names
// come from the project; PAGE.chapterNames maps German titles to English.
const S={
 de:{start:'Wiedergabe starten',pauseA:'Wiedergabe pausieren',kicker:'Live-Code',note:'Kein Video: wird gerade in deinem Browser berechnet · Kopfhörer empfohlen',noteAt:'Start bei {t} · Kopfhörer empfohlen',again:'Nochmals abspielen',rotate:'Querformat empfohlen',
  close:'Schliessen',scrub:'Abspielposition',trackT:'Zur Trackseite',back10T:'10 s zurück (←, Shift: 1 Bild)',back10A:'10 Sekunden zurück',playT:'Play/Pause (Leertaste)',fwd10T:'10 s vor (→)',fwd10A:'10 Sekunden vor',
  muteT:'Stumm (M)',muteA:'Stummschaltung',vol:'Lautstärke',expert:'Experte',expertT:'Expertenmodus (E)',fsT:'Vollbild (F)',fsA:'Vollbild',chapter:'Kapitel',rate:'Geschwindigkeit',res:'Auflösung',loop:'↻ Schleife',loopT:'Schleife (L)',debugT:'Cue-Diagnose (D)',tech:'⚙ Technik',techT:'Technische Ansichten: Drahtgitter, Normalen, Tiefe, Bounding Boxes, Objektinspektor, Parameter, Leistung (X)',
  hint:'Leertaste · ←/→ 1 s · Shift+←/→ 1 Bild · Alt+←/→ 10 s · 1–9 Kapitel · M/F/D/E · X Technik · T Text · V Fassung · A Übersicht · I Details · N weiter',nav:'Alben & Tracks',navT:'Alle Alben und Tracks (A)',autoplay:'Autoplay',autoplayT:'Am Ende automatisch zum nächsten Track',details:'Track-Details',detailsT:'Text, Audioanalyse und Infos zum Track (I)',closeDetails:'Details schliessen',trackPage:'Ganze Trackseite öffnen',loadD:'Details laden …',errD:'Details konnten nicht geladen werden.',home:'Startseite',homeT:'Zurück zur Startseite von kisound.ch',cc:'Text',ccT:'Liedtext zur richtigen Zeit einblenden (T)',upnext:'Als Nächstes',nowBtn:'▶ Jetzt',cancel:'Abbrechen',inS:'in {s} s',nextT:'Nächster Track (N)',blocked:'Autoplay vom Browser angehalten – zum Starten tippen',audioOnly:'nur Audio',playing:'läuft',closeNav:'Übersicht schliessen',slow:'Der Code rendert mit {fps} statt 60 Bildern pro Sekunde.',go:'Auf {r}p wechseln',loadA:'Audio laden … {p} %',prepA:'Audio vorbereiten …',errA:'Audio konnte nicht geladen werden.',code:'{kb} KB Code · kein Video',kind:'Live-Code',version:'Fassung',versionT:'Gesungene Fassung: {v}'},
 en:{start:'Start playback',pauseA:'Pause playback',kicker:'Live code',note:'Not a video: computed right now in your browser · headphones recommended',noteAt:'Starts at {t} · headphones recommended',again:'Play again',rotate:'Landscape recommended',
  close:'Close',scrub:'Playback position',trackT:'Back to the track page',back10T:'Back 10 s (←, Shift: 1 frame)',back10A:'Back 10 seconds',playT:'Play/Pause (Space)',fwd10T:'Forward 10 s (→)',fwd10A:'Forward 10 seconds',
  muteT:'Mute (M)',muteA:'Mute',vol:'Volume',expert:'Expert',expertT:'Expert mode (E)',fsT:'Fullscreen (F)',fsA:'Fullscreen',chapter:'Chapter',rate:'Speed',res:'Resolution',loop:'↻ Loop',loopT:'Loop (L)',debugT:'Cue diagnostics (D)',tech:'⚙ Tech',techT:'Technical views: wireframe, normals, depth, bounding boxes, object inspector, parameters, performance (X)',
  hint:'Space · ←/→ 1 s · Shift+←/→ 1 frame · Alt+←/→ 10 s · 1–9 chapters · M/F/D/E · X tech · T lyrics · V version · A overview · I details · N next',nav:'Albums & tracks',navT:'All albums and tracks (A)',autoplay:'Autoplay',autoplayT:'Continue with the next track at the end',details:'Track details',detailsT:'Lyrics, audio analysis and notes on the track (I)',closeDetails:'Close details',trackPage:'Open the full track page',loadD:'Loading details …',errD:'Could not load the details.',home:'Home',homeT:'Back to the kisound.ch home page',cc:'Lyrics',ccT:'Show the lyrics at the right time (T)',upnext:'Up next',nowBtn:'▶ Now',cancel:'Cancel',inS:'in {s} s',nextT:'Next track (N)',blocked:'Autoplay paused by the browser – tap to start',audioOnly:'audio only',playing:'playing',closeNav:'Close overview',slow:'The code renders at {fps} instead of 60 frames per second.',go:'Switch to {r}p',loadA:'Loading audio … {p} %',prepA:'Preparing audio …',errA:'Could not load the audio.',code:'{kb} KB of code · not a video',kind:'Live code',version:'Version',versionT:'Sung version: {v}'}};
const lang=()=>document.documentElement.dataset.lang==='en'?'en':'de';
const tr=(k,v={})=>S[lang()][k].replace(/\{(\w+)\}/g,(_,x)=>v[x]??'');
const pick=v=>v&&typeof v==='object'?v[lang()]??v.de:v;
const chapterName=title=>lang()==='en'?(PAGE.chapterNames?.[title]??title):title;
// Chapters come as {title,start} or as [label, start] tuples.
const chapters=CHAPTERS.map(c=>Array.isArray(c)?{title:c[0],start:c[1]}:c).sort((a,b)=>a.start-b.start);

async function loadAudio(ctx){
 const res=await fetch(PAGE.audio);if(!res.ok)throw Error(tr('errA'));
 const total=Number(res.headers.get('content-length'))||0,reader=total?res.body?.getReader():null;let data;
 if(reader&&total){const buf=new Uint8Array(total);let n=0;for(;;){const{done,value}=await reader.read();if(done)break;buf.set(value,n);n+=value.length;status(tr('loadA',{p:Math.round(n/total*100)}));}data=buf.buffer.slice(0,n);}
 else data=await res.arrayBuffer();
 status(tr('prepA'));return ctx.decodeAudioData(data);
}

export async function startPlayer(opts){
 const film=opts.film,width=opts.width??opts.W,height=opts.height??opts.H,q=new URLSearchParams(location.search);
 const initialTime=opts.initialTime??Number(q.get('t')||0);
 try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch{}   // iOS: play despite the silent switch
 const ctx=new AudioContext({latencyHint:'interactive'}),gain=ctx.createGain();gain.connect(ctx.destination);
 const [buffer,wave]=await Promise.all([loadAudio(ctx),PAGE.wave?fetch(PAGE.wave).then(r=>r.json()).catch(()=>null):null]);
 const lead=PAGE.audioOffset||0,END=Math.min(DURATION,buffer.duration-lead);   // the film never runs past the audio
 if(Math.abs(buffer.duration-lead-DURATION)>.5)console.warn(`Audiodauer ${buffer.duration.toFixed(3)} s, Filmdauer ${DURATION.toFixed(3)} s.`);
 const embedded=window.top!==window,canFullscreen=!!document.fullscreenEnabled,fullscreenFallback=!canFullscreen&&embedded,hasCues=typeof film.debug==='boolean';
 const ui=document.createElement('div');ui.id='ui';ui.className='fresh';
 ui.innerHTML=`
 <div id="poster" role="button" tabindex="0" data-a="aria-label:start">
  <div class="poster-inner">
   <div class="poster-kicker" id="poster-kicker"></div>
   <div class="poster-title">${PAGE.title||''}</div>
   <div class="poster-sub">${PAGE.subtitle||''}</div>
   <div class="poster-play"><span>▶</span></div>
   <div class="poster-code" id="poster-code"></div>
   <div class="poster-vers" id="poster-vers" hidden><span data-t="version"></span></div>
   <div class="poster-note" id="poster-note"></div>
   <div class="poster-rotate" data-t="rotate"></div>
  </div>
 </div>
 <div id="topbar">
  <button id="nav-open" data-a="title:navT;aria-label:navT" aria-expanded="false"><span class="burger">☰</span><span data-t="nav"></span></button>
  <div id="top-title"><strong>${PAGE.title||''}</strong><span>${PAGE.subtitle||''}</span></div>
  <span class="spacer"></span>
  ${PAGE.details?`<button id="details" data-a="title:detailsT" aria-expanded="false" aria-controls="info"><span class="i-mark" aria-hidden="true">ⓘ</span> <span data-t="details"></span></button>`:PAGE.trackUrl?`<a id="details" href="${PAGE.trackUrl}" data-a="title:detailsT"><span data-t="details"></span> ↗</a>`:''}
 </div>
 <aside id="nav" hidden data-a="aria-label:nav"><a id="nav-home" href="${esc(PAGE.base||'/')}" data-a="title:homeT"><span class="nh-arrow" aria-hidden="true">←</span><span class="nh-brand">KISOUND</span><span class="nh-label" data-t="home"></span></a><div id="nav-head"><strong data-t="nav"></strong><label id="auto-label" data-a="title:autoplayT"><input type="checkbox" id="autoplay"><span data-t="autoplay"></span></label><button id="nav-close" data-a="aria-label:closeNav">×</button></div><div id="nav-list"></div></aside>
 ${PAGE.details?`<aside id="info" hidden data-a="aria-label:details"><div id="info-head"><strong data-t="details"></strong><button id="info-close" data-a="aria-label:closeDetails">×</button></div><div id="info-body"></div></aside>`:''}
 <div id="lyric" aria-hidden="true"><span></span></div>
 <div id="upnext" hidden><img id="upnext-cover" alt="" width="56" height="56"><div class="upnext-text"><span class="upnext-kicker"><span data-t="upnext"></span> <span id="upnext-count"></span></span><strong id="upnext-title"></strong><span id="upnext-label"></span></div><div class="upnext-actions"><button id="upnext-go" data-t="nowBtn"></button><button id="upnext-cancel" data-t="cancel"></button></div></div>
 <div id="toast" hidden><span id="toast-text"></span><button id="toast-go"></button><button id="toast-close" data-a="aria-label:close">×</button></div>
 <div id="bar">
  <div id="scrub" role="slider" tabindex="0" data-a="aria-label:scrub" aria-valuemin="0" aria-valuemax="${END}"><canvas></canvas></div>
  <div id="row">
   <button id="back10" data-a="title:back10T;aria-label:back10A">↺ 10</button>
   <button id="play" data-a="title:playT">▶</button>
   <button id="fwd10" data-a="title:fwd10T;aria-label:fwd10A">10 ↻</button><button id="next-btn" data-a="title:nextT;aria-label:nextT" hidden>⏭</button>
   <span id="clock"></span><span id="chapter-name"></span>
   <span class="spacer"></span>
   <span class="code-chip" id="code-chip"></span>
   <span class="vers" id="vers" hidden></span>
   <button id="cc" data-a="title:ccT" aria-pressed="false" hidden><span class="cc-mark">≡</span> <span data-t="cc"></span></button>
   <button id="mute" data-a="title:muteT;aria-label:muteA">🔊</button><input id="volume" type="range" min="0" max="1" step="0.01" value="1" data-a="aria-label:vol">
   <button id="expert" data-t="expert" data-a="title:expertT" aria-pressed="false"></button>
   <button id="fullscreen" data-a="title:fsT;aria-label:fsA">⛶</button>
  </div>
  <div id="expert-row">
   <select id="chapter" data-a="aria-label:chapter"></select>
   <select id="rate" data-a="aria-label:rate"><option value="0.25">0.25×</option><option value="0.5">0.5×</option><option value="1" selected>1×</option></select>
   <select id="resolution" data-a="aria-label:res"><option value="540">540p</option><option value="720">720p</option><option value="1080">1080p</option></select>
   <button id="loop" data-t="loop" data-a="title:loopT"></button><button id="debug" data-a="title:debugT">Cues</button><button id="tech" data-t="tech" data-a="title:techT" aria-pressed="false"></button>
   <span id="fine-clock"></span>
   <span class="hint" data-t="hint"></span>
  </div>
 </div>`;
 document.body.append(ui);const $=id=>document.getElementById(id),stage=$('stage'),bar=$('bar');
 chapters.forEach(c=>{const o=document.createElement('option');o.value=c.start;$('chapter').append(o);});
 // Every visible string of the player, in the current language; runs again when the site switches language.
 let noteKey='note',noteVars={},lastKey='';
 function applyLang(){
  const l=lang();document.documentElement.lang=l==='de'?'de-CH':'en';document.title=`${PAGE.title||''} · ${tr('kind')} · kisound`;
  for(const el of ui.querySelectorAll('[data-t]'))el.textContent=tr(el.dataset.t);
  for(const el of ui.querySelectorAll('[data-a]'))for(const pair of el.dataset.a.split(';')){const[attr,key]=pair.split(':');el.setAttribute(attr,tr(key));}
  [...$('chapter').options].forEach((o,i)=>{o.textContent=`${String(i+1).padStart(2,'0')} ${chapterName(chapters[i].title)}`;});
  $('poster-kicker').textContent=pick(PAGE.kicker)||tr('kicker');$('poster-note').textContent=tr(noteKey,noteVars);
  const kb=PAGE.codeBytes?Math.round(PAGE.codeBytes/1024):0;$('poster-code').textContent=kb?`</> ${tr('code',{kb})}`:'';$('code-chip').textContent=kb?`</> ${kb} KB`:'';$('code-chip').title=kb?tr('code',{kb}):'';
  setPlayIcon();lastKey='';if(typeof versionTitles==='function'&&vkeys?.length>1)versionTitles();if(typeof tech!=='undefined'&&tech?.open)tech.applyLang();if(typeof infoAttrs==='function')infoAttrs();
 }
 const setNote=(k,v={})=>{noteKey=k;noteVars=v;$('poster-note').textContent=tr(k,v);};
 // Language versions of the recording: one button per version; switching keeps the scene (shot starts of both
 // versions are mapped piecewise linearly) and continues playing when it was playing. The sung language is also
 // the language of the controls: the choice is stored as the site language as well (the track page follows).
 const V=PAGE.versions,vkeys=V?Object.keys(V):[];
 function mapTime(t,from,to){const a=V[from]?.cues,b=V[to]?.cues;if(a&&b&&a.length===b.length&&a.length>1){let i=0;while(i<a.length-1&&a[i+1]<=t)i++;const a1=a[i+1]??V[from].duration??DURATION,b1=b[i+1]??V[to].duration??DURATION;return b[i]+(b1-b[i])*Math.min(1,Math.max(0,(t-a[i])/Math.max(1e-6,a1-a[i])));}
  return t/(V[from]?.duration||DURATION)*(V[to]?.duration||DURATION);}
 function switchVersion(k){if(!V||k===PAGE.version||!V[k])return;const was=state.playing,t=current();pause();store.set('kisound.version',k);if(S[k])store.set('kisound.lang',k);const url=new URL(location.href);url.searchParams.set('v',k);url.searchParams.set('t',mapTime(t,PAGE.version,k).toFixed(2));
  if(was)url.searchParams.set('autoplay','1');else url.searchParams.delete('autoplay');location.href=url;}
 function versionButtons(el){for(const k of vkeys){const b=document.createElement('button');b.type='button';b.dataset.v=k;b.textContent=k.toUpperCase();b.setAttribute('aria-pressed',String(k===PAGE.version));b.onclick=e=>{e.stopPropagation();switchVersion(k);};el.append(b);}}
 if(vkeys.length>1){versionButtons($('vers'));versionButtons($('poster-vers'));$('vers').hidden=false;$('poster-vers').hidden=false;}
 const versionTitles=()=>{for(const b of ui.querySelectorAll('[data-v]')){const lab=V[b.dataset.v].label;b.title=tr('versionT',{v:lab?.[lang()]||b.dataset.v.toUpperCase()});}};
 window.addEventListener('storage',e=>{if(e.key!=='kisound.lang'||!e.newValue)return;document.documentElement.dataset.lang=e.newValue==='en'?'en':'de';applyLang();});
 $('resolution').value=String(height);if(!canFullscreen&&!fullscreenFallback)$('fullscreen').hidden=true;if(!hasCues)$('debug').hidden=true;
 const chapterAt=t=>chapters.filter(c=>c.start<=t).at(-1)||chapters[0]||{title:'',start:0};
 const state={played:false,playing:false,offset:clamp(initialTime,0,END),started:0,rate:1,source:null,loop:false,muted:false,volume:1,generation:0,expert:q.get('expert')==='1'||store.get('kisound.expert')==='1',hover:null};
 const current=()=>clamp(state.offset+(state.playing?Math.max(0,ctx.currentTime-state.started)*state.rate:0),0,END);
 // technical views of the expert mode (player/tech.js): generic for every piece, off by default
 const tech=createTech({film,lang,current,playing:()=>state.playing});if(tech){ui.append(tech.el);}else $('tech').hidden=true;
 const stopSource=()=>{if(state.source){state.source.onended=null;try{state.source.stop();}catch{}state.source.disconnect();state.source=null;}};
 const startSource=()=>{const src=ctx.createBufferSource();src.buffer=buffer;src.playbackRate.value=state.rate;src.connect(gain);state.started=ctx.currentTime+.025;src.start(state.started,state.offset+lead);state.source=src;};
 const setPlayIcon=()=>{$('play').textContent=state.playing?'❚❚':'▶';$('play').setAttribute('aria-label',tr(state.playing?'pauseA':'start'));ui.classList.toggle('playing',state.playing);};
 const pause=()=>{state.offset=current();state.playing=false;state.generation++;stopSource();setPlayIcon();if(navigator.mediaSession)navigator.mediaSession.playbackState='paused';};
 const play=async()=>{
  if(state.playing)return;const generation=++state.generation;await ctx.resume();if(generation!==state.generation)return;
  if(state.offset>=END)state.offset=0;startSource();state.playing=true;state.played=true;ui.classList.remove('fresh');$('upnext').hidden=true;live.countdownEnd=0;setPlayIcon();$('poster').hidden=true;if(navigator.mediaSession)navigator.mediaSession.playbackState='playing';wake();
 };
 const seek=t=>{const was=state.playing;pause();state.offset=clamp(t,0,END);state.played=true;film.render(state.offset);if(was&&state.offset<END)void play();};
 const toggle=()=>state.playing?pause():void play();
 const reloadWith=params=>{pause();const url=new URL(location.href);for(const[k,v]of Object.entries(params))url.searchParams.set(k,v);url.searchParams.set('t',state.offset.toFixed(3));location.href=url;};
 // Layout: simple mode overlays the bar on the film, expert mode reserves space below it.
 function fit(){ui.style.setProperty('--bar-h',`${Math.round(bar.getBoundingClientRect().height)}px`);const reserve=state.expert?bar.getBoundingClientRect().height:0,w=innerWidth,h=innerHeight-reserve,s=Math.min(w/width,h/height);stage.style.transform=`translate(${(w-width*s)/2}px,${(h-height*s)/2}px) scale(${s})`;drawTrack(current());}
 function setExpert(on){state.expert=on;store.set('kisound.expert',on?'1':'0');ui.classList.toggle('expert',on);$('expert').setAttribute('aria-pressed',String(on));if(!on&&film.debug){film.debug=false;$('debug').classList.remove('on');}if(!on&&tech?.open){tech.setOpen(false);$('tech').setAttribute('aria-pressed','false');}requestAnimationFrame(fit);}
 const tc=$('scrub').querySelector('canvas');
 // Fallback without a prepared waveform: loudness from the decoded audio, one band.
 const bins=wave?.bins||(()=>{const d=buffer.getChannelData(0),n=600,per=Math.floor(d.length/n),out=[];let max=1e-6;for(let b=0;b<n;b++){let s=0;for(let i=b*per;i<(b+1)*per;i+=8)s+=d[i]*d[i];const v=Math.sqrt(s/(per/8));out.push(v);max=Math.max(max,v);}return out.map(v=>[v/max,0,0]);})();
 const sections=wave?.sections?.length?wave.sections:chapters.map((c,i)=>({label:c.title,start:c.start,end:chapters[i+1]?.start??END}));
 function drawTrack(t){drawWave(tc,{bins,sections,duration:END,time:t,hover:state.hover});}
 // The bar overlays the film in simple mode, so it hides after 1.5 s without pointer, touch or key input
 // (playing or paused); not while the poster is up, while the pointer rests on the bar, or in expert mode.
 let idleTimer=0;function wake(){ui.classList.remove('idle');clearTimeout(idleTimer);idleTimer=setTimeout(()=>{if(state.played&&!state.expert&&!bar.matches(':hover')&&!$('topbar').matches(':hover')&&!$('nav').matches(':hover')&&!$('info')?.matches(':hover')&&!$('upnext').matches(':hover')&&!dragging){ui.classList.add('idle');closeNav();}},2000);}
 for(const ev of['pointermove','pointerdown','keydown','touchstart'])window.addEventListener(ev,wake,{passive:true});
 let dragging=false,resume=false;const tAt=e=>{const r=tc.getBoundingClientRect();return clamp((e.clientX-r.left)/r.width*END,0,END);};
 $('scrub').onpointerdown=e=>{dragging=true;resume=state.playing;pause();seek(tAt(e));$('scrub').setPointerCapture(e.pointerId);};
 $('scrub').onpointermove=e=>{state.hover=e.pointerType==='mouse'?tAt(e):null;if(dragging)seek(tAt(e));};$('scrub').onpointerleave=()=>{state.hover=null;};
 $('scrub').onpointerup=()=>{if(!dragging)return;dragging=false;if(resume&&state.offset<END)void play();};$('scrub').onpointercancel=()=>{dragging=false;resume=false;};
 $('poster').onclick=()=>void play();$('poster').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();void play();}};
 $('play').onclick=toggle;$('back10').onclick=()=>seek(current()-10);$('fwd10').onclick=()=>seek(current()+10);$('chapter').onchange=e=>seek(+e.target.value);
 $('loop').onclick=()=>$('loop').classList.toggle('on',state.loop=!state.loop);
 const volume=()=>{gain.gain.setValueAtTime(state.muted?0:state.volume,ctx.currentTime);$('mute').textContent=state.muted||!state.volume?'🔇':'🔊';};
 $('mute').onclick=()=>{state.muted=!state.muted;volume();};$('volume').oninput=e=>{state.volume=+e.target.value;state.muted=false;volume();};
 $('rate').onchange=e=>{const was=state.playing;pause();state.rate=+e.target.value;if(was)void play();};
 $('resolution').onchange=e=>reloadWith({res:e.target.value,expert:state.expert?'1':'0'});
 $('debug').onclick=()=>$('debug').classList.toggle('on',film.debug=!film.debug);
 $('expert').onclick=()=>setExpert(!state.expert);
 $('tech').onclick=()=>{if(!tech)return;tech.toggle();$('tech').setAttribute('aria-pressed',String(tech.open));};
 $('fullscreen').onclick=()=>{
  if(canFullscreen){const p=document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen();p?.catch(console.warn);}
  else if(fullscreenFallback){pause();const url=new URL(location.href);url.searchParams.delete('embed');url.searchParams.set('t',state.offset.toFixed(2));window.top.location.href=url;}   // iPhone: open the film page itself
 };
 window.addEventListener('keydown',e=>{
  if(['SELECT','INPUT'].includes(e.target.tagName)||e.metaKey||e.ctrlKey)return;
  if(['Space','ArrowLeft','ArrowRight','Home','End'].includes(e.code))e.preventDefault();
  const k=e.key.toLowerCase();
  if(e.code==='Space')toggle();
  else if(e.code==='ArrowRight'||e.code==='ArrowLeft'){const d=e.code==='ArrowRight'?1:-1;seek(e.shiftKey?(Math.round(current()*FPS)+d)/FPS:current()+d*(e.altKey?10:1));}
  else if(e.code==='Home')seek(0);else if(e.code==='End')seek(END);
  else if(k==='l')$('loop').click();else if(k==='m')$('mute').click();else if(k==='f'&&!$('fullscreen').hidden)$('fullscreen').click();
  else if(k==='e')$('expert').click();else if(k==='d'&&state.expert&&hasCues)$('debug').click();else if(k==='x'&&state.expert&&tech)$('tech').click();
  else if(/^[1-9]$/.test(e.key)&&chapters[+e.key-1])seek(chapters[+e.key-1].start);
  else if(k==='v'&&vkeys.length>1)switchVersion(vkeys[(vkeys.indexOf(PAGE.version)+1)%vkeys.length]);else if(k==='t'&&!$('cc').hidden)$('cc').click();else if(k==='a'&&!$('nav-open').hidden)$('nav-open').click();else if(k==='n'&&live.next)goLive(live.next);else if(k==='i'&&info&&!embedded)$('details').click();else if(e.code==='Escape'){closeNav();closeInfo();}
 });
 if(navigator.mediaSession){
  navigator.mediaSession.metadata=new MediaMetadata({title:PAGE.title||'',artist:PAGE.artist||'',album:PAGE.album||'',artwork:PAGE.artwork?[{src:PAGE.artwork,sizes:'240x240',type:'image/webp'}]:[]});
  navigator.mediaSession.setActionHandler('play',()=>void play());navigator.mediaSession.setActionHandler('pause',pause);
  try{navigator.mediaSession.setActionHandler('seekto',d=>seek(d.seekTime));navigator.mediaSession.setActionHandler('seekbackward',()=>seek(current()-10));navigator.mediaSession.setActionHandler('seekforward',()=>seek(current()+10));}catch{}
 }
 let frames=0,since=0,offered=false;
 function watchFps(now){
  if(!state.playing||offered){frames=0;since=now;return;}frames++;
  if(now-since>5000){const fps=frames/(now-since)*1000;frames=0;since=now;
   if(fps<42&&height>540){offered=true;const lower=height>720?720:540;$('toast-text').textContent=tr('slow',{fps:Math.round(fps)});$('toast-go').textContent=tr('go',{r:lower});$('toast-go').onclick=()=>reloadWith({res:String(lower)});$('toast').hidden=false;}}
 }
 $('toast-close').onclick=()=>$('toast').hidden=true;
 window.addEventListener('resize',fit);setExpert(state.expert);
 if('ResizeObserver'in window)new ResizeObserver(()=>ui.style.setProperty('--bar-h',`${Math.round(bar.getBoundingClientRect().height)}px`)).observe(bar);
 applyLang();if(state.offset>0)setNote('noteAt',{t:fmtTime(state.offset)});

 // ---- Site extras: overview of all albums and tracks, autoplay into the next piece, timed lyrics. They live in the
 // same auto-hiding layer as the controls. Embedded on a track page only the lyrics button remains.
 const nav=$('nav'),lyricEl=$('lyric'),upnext=$('upnext'),base=PAGE.base||'';
 const live={next:null,autoplay:store.get('kisound.autoplay')!=='0',cc:store.get('kisound.cc')==='1',lyrics:null,shown:null,countdownEnd:0};
 if(embedded)ui.classList.add('embedded');
 function openNav(){closeInfo();nav.hidden=false;requestAnimationFrame(()=>nav.classList.add('open'));$('nav-open').setAttribute('aria-expanded','true');wake();}
 function closeNav(){if(!nav.classList.contains('open'))return;nav.classList.remove('open');$('nav-open').setAttribute('aria-expanded','false');setTimeout(()=>{if(!nav.classList.contains('open'))nav.hidden=true;},320);}
 function goLive(item){pause();const res=q.get('res');location.href=`${base}${item.live}?autoplay=1${res?`&res=${res}`:''}`;}
 $('nav-open').onclick=()=>nav.classList.contains('open')?closeNav():openNav();$('nav-close').onclick=closeNav;
 document.getElementById('film')?.addEventListener('pointerdown',()=>{closeNav();closeInfo();});
 // Track details: a drawer like the overview, from the right; filled on first open from the build's details fragment,
 // so the film keeps running. Blocks of other sung versions are dropped (the page plays one version).
 const info=$('info');let infoLoad=null;
 function infoAttrs(){const box=$('info');if(!box)return;const l=lang()==='de'?0:1;for(const el of box.querySelectorAll('[data-i18n]')){try{for(const[k,v]of Object.entries(JSON.parse(el.dataset.i18n)))el.setAttribute(k,v[l]??v[0]);}catch{}}}
 function loadInfo(){if(infoLoad)return infoLoad;const body=$('info-body');body.textContent=tr('loadD');
  infoLoad=fetch(PAGE.details).then(r=>{if(!r.ok)throw Error(String(r.status));return r.json();}).then(d=>{body.innerHTML=d.html;
   if(PAGE.version)for(const el of body.querySelectorAll('[data-dv]'))if(el.dataset.dv!==PAGE.version)el.remove();
   if(PAGE.trackUrl){const a=document.createElement('a');a.id='info-page';a.href=PAGE.trackUrl;a.innerHTML='<span data-t="trackPage"></span> ↗';body.append(a);a.firstChild.textContent=tr('trackPage');}
   infoAttrs();}).catch(()=>{body.textContent=tr('errD');infoLoad=null;});return infoLoad;}
 function openInfo(){if(!info)return;closeNav();info.hidden=false;requestAnimationFrame(()=>info.classList.add('open'));$('details').setAttribute('aria-expanded','true');void loadInfo();wake();}
 function closeInfo(){if(!info?.classList.contains('open'))return;info.classList.remove('open');$('details').setAttribute('aria-expanded','false');setTimeout(()=>{if(!info.classList.contains('open'))info.hidden=true;},320);}
 if(info){$('details').onclick=()=>info.classList.contains('open')?closeInfo():openInfo();$('info-close').onclick=closeInfo;}
 $('autoplay').checked=live.autoplay;$('autoplay').onchange=e=>{live.autoplay=e.target.checked;store.set('kisound.autoplay',live.autoplay?'1':'0');if(!live.autoplay)cancelUpnext();};
 function buildNav(cat){
  const flat=cat.albums.flatMap(a=>a.tracks.filter(t=>t.live).map(t=>({...t,album:a.title}))),i=flat.findIndex(t=>t.key===PAGE.trackKey);
  live.next=i>=0?flat[i+1]||null:null;$('next-btn').hidden=!live.next;
  const list=$('nav-list');list.textContent='';
  for(const a of cat.albums){
   const here=a.tracks.some(t=>t.key===PAGE.trackKey),sec=document.createElement('section');sec.className='nav-album'+(here?' open':'');
   sec.innerHTML=`<button class="nav-album-head" aria-expanded="${here}"><img src="${base}${a.cover}" alt="" width="40" height="40" loading="lazy"><span class="nav-album-name"><strong>${esc(a.title)}</strong><small>${a.tracks.filter(t=>t.live).length} × &lt;/&gt;</small></span><span class="chev">▾</span></button>
    <ol>${a.tracks.map(t=>{const cur=t.key===PAGE.trackKey;return`<li${cur?' class="current"':''}><a href="${base}${t.live?`${t.live}?autoplay=1`:t.page}"${t.live?` data-key="${t.key}"`:' class="audio-only"'}><span class="n">${t.n}</span><span class="tt">${esc(t.title)}</span><span class="d">${cur?'<em data-t="playing"></em>':t.live?fmtTime(t.dur):'<em data-t="audioOnly"></em>'}</span></a></li>`;}).join('')}</ol>`;
   const head=sec.querySelector('.nav-album-head');head.onclick=()=>head.setAttribute('aria-expanded',String(sec.classList.toggle('open')));list.append(sec);
  }
  for(const el of list.querySelectorAll('[data-t]'))el.textContent=tr(el.dataset.t);
  for(const el of list.querySelectorAll('a[data-key]'))el.addEventListener('click',e=>{if(el.dataset.key===PAGE.trackKey){e.preventDefault();closeNav();seek(0);void play();}else pause();});
  list.querySelector('li.current')?.scrollIntoView({block:'center'});
 }
 if(!embedded&&PAGE.catalog&&!PAGE.catalog.startsWith('__'))fetch(PAGE.catalog).then(r=>r.json()).then(buildNav).catch(()=>{$('nav-open').hidden=true;});else $('nav-open').hidden=true;
 // up next: at the end of a piece, with an 8-second countdown while autoplay is on
 function showUpnext(){if(!live.next||embedded)return;const n=live.next;$('upnext-cover').src=`${base}${n.cover}`;$('upnext-title').textContent=n.title;$('upnext-label').textContent=`${pick(n.label)||''} · ${n.album}`;
  upnext.hidden=false;live.countdownEnd=live.autoplay?performance.now()+8000:0;$('upnext-count').textContent='';$('upnext-cancel').hidden=!live.autoplay;}
 function cancelUpnext(){live.countdownEnd=0;$('upnext-count').textContent='';$('upnext-cancel').hidden=true;}
 $('upnext-go').onclick=()=>live.next&&goLive(live.next);$('upnext-cancel').onclick=cancelUpnext;$('next-btn').onclick=()=>live.next&&goLive(live.next);
 // timed lyrics from the transcript of the release audio, shown quietly above the controls
 if(PAGE.lyrics){$('cc').hidden=false;fetch(PAGE.lyrics).then(r=>r.json()).then(d=>{live.lyrics=d.segments||[];lyricEl.lang=d.lang||'';}).catch(()=>{$('cc').hidden=true;});}
 function setCC(on){live.cc=on;store.set('kisound.cc',on?'1':'0');$('cc').setAttribute('aria-pressed',String(on));live.shown=null;if(!on)lyricEl.classList.remove('show');}
 $('cc').onclick=()=>setCC(!live.cc);setCC(live.cc);
 function lyricAt(t){const L=live.lyrics;let lo=0,hi=L.length-1,f=-1;while(lo<=hi){const m=(lo+hi)>>1;if(L[m][0]<=t){f=m;lo=m+1;}else hi=m-1;}return f>=0&&t<L[f][1]+.35?L[f][2]:'';}
 function liveTick(t,now){
  if(live.cc&&live.lyrics){const line=state.played?lyricAt(t):'';if(line!==live.shown){live.shown=line;if(line){lyricEl.firstChild.textContent=line;lyricEl.classList.add('show');}else lyricEl.classList.remove('show');}}
  if(live.countdownEnd){const left=Math.ceil((live.countdownEnd-now)/1000);if(left<=0){live.countdownEnd=0;goLive(live.next);}else $('upnext-count').textContent=tr('inS',{s:left});}
 }
 // arriving through autoplay: start at once if the browser allows sound without a new gesture, else wait for a tap
 if(q.get('autoplay')==='1'&&!embedded){const url=new URL(location.href);url.searchParams.delete('autoplay');history.replaceState(null,'',url);
  (async()=>{const ok=await Promise.race([ctx.resume().then(()=>true,()=>false),new Promise(r=>setTimeout(()=>r(false),700))]);if(ok&&ctx.state==='running')void play();else setNote('blocked');})();}
 const loading=document.getElementById('loading');if(loading)loading.style.display='none';   // projects without their own loading screen handling
 const tick=now=>{
  let t=current();if(state.playing&&t>=END){const loop=state.loop;pause();state.offset=loop?0:END;t=state.offset;if(loop)void play();else{$('poster').hidden=false;setNote('again');state.offset=0;showUpnext();}}
  const shown=!state.played&&state.offset===0&&PAGE.posterTime?PAGE.posterTime:t;   // before the first play: a characteristic frame behind the poster
  const key=`${shown}:${film.debug}:${tech?.rev??0}`;if(key!==lastKey){film.render(shown);lastKey=key;}
  watchFps(now);const chapter=chapterAt(t);
  $('clock').textContent=`${fmtTime(t)} / ${fmtTime(END)}`;$('chapter-name').textContent=chapterName(chapter.title);$('fine-clock').textContent=fmtFine(t);
  $('chapter').value=String(chapter.start);$('scrub').setAttribute('aria-valuenow',String(t));drawTrack(t);liveTick(t,now);
  requestAnimationFrame(tick);
 };requestAnimationFrame(tick);
 // registered here as well: not every project's main.js keeps the return value
 const api={play,pause,seek,current,state,audioDuration:buffer.duration-lead,context:ctx};window.player=api;return api;
}
