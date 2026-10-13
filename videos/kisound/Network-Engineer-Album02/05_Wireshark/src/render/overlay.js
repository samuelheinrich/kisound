import {TITLES} from './config.js';
import {smooth,clamp} from './timeline.js';
import {LOGS,STATUS,KINETIC,WORD_NOTE,BLOCKS,blockLines,dockBlocks,outputDrops,bulkRate,guiState,CAP_STOP} from './model.js';
import {wrap} from './world.js';
const C={cyan:'#8fe9ff',red:'#ff8b97',ok:'#8fe3b8',white:'#e6eef3',dim:'#88a6b8',amber:'#ffb13d'};
export function text(g,s,x,y,size=22,col=C.white,w='400'){g.font=`${w} ${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
export function drawHeader(g,t){text(g,'192.0.2.10:51000 → 198.51.100.20:443 · SW-A ↔ SW-B',64,61,18,'#accada');g.textAlign='right';const st=STATUS(t);text(g,st,1856,61,18,/HTTP 200|gestoppt/.test(st)?C.ok:/Befund|Versuch/.test(st)?C.amber:C.cyan);text(g,'Szenario / simulierte Werte',1856,1048,14,'rgba(150,180,200,.6)');g.textAlign='left';}
const DOCK_W=620,COLS=58,KC={cmd:'#f3d48a',bad:C.red,ok:C.ok,amber:C.amber,ov:'#cfe6f2'};
export function drawDock(g,t){const ids=dockBlocks(t);if(!ids.length)return null;let y=96;const out={x:64,y,w:DOCK_W,h:0,ids};
 for(const id of ids){const lines=blockLines(id,t);if(!lines.length)continue;const rows=lines.flatMap(l=>wrap(l.text,COLS).map(s=>[s,l.kind])).slice(-8),bh=44+rows.length*22+12;
  g.fillStyle='rgba(3,9,16,.84)';g.fillRect(64,y,DOCK_W,bh);g.strokeStyle='rgba(143,233,255,.4)';g.lineWidth=2;g.strokeRect(65,y+1,DOCK_W-2,bh-2);text(g,`${id} · ${BLOCKS[id].title}`,80,y+27,15,C.dim,'500');rows.forEach(([s,k],i)=>text(g,s,80,y+56+i*22,15,KC[k]||C.white));y+=bh+10;}
 out.h=y-out.y;return out;}
// Capture panel (simulated values): both analysers, capture drops, the uplink counter, bulk rate.
export function drawMeter(g,t,h){const x=1420,y=h-206,w=436;g.fillStyle='rgba(3,6,10,.8)';g.fillRect(x-12,y-30,w+24,166);const a=guiState('BEFORE',t),b=guiState('AFTER',t),st=t>=CAP_STOP;
 text(g,`Capture · ${st?'gestoppt':'läuft'}`,x,y-8,14,st?C.amber:'#ff8b97');text(g,`BEFORE ${a.total.toLocaleString('de-CH')} · Drops 0`,x,y+20,15,C.white);text(g,`AFTER  ${b.total.toLocaleString('de-CH')} · Drops 0`,x,y+46,15,C.white);
 const od=outputDrops(t);text(g,`SW-A Gi1/0/48 output drops ${od}`,x,y+76,15,od>3800?C.red:C.dim);text(g,`Bulk-Quelle ${bulkRate(t)} Mbit/s · Uplink 100 Mbit/s`,x,y+104,15,bulkRate(t)>50?C.amber:C.ok);return{x,y,w};}
export function drawWords(g,t,tl,h){const segs=tl.analysis.lyrics.segments.filter(l=>KINETIC[l.id]),i=segs.findLastIndex(l=>t>=l.start_s);if(i<0)return null;
 const l=segs[i],end=l.start_s+Math.max(1.1,Math.min(1.9,l.end_s-l.start_s+.5));if(t>=end+.1)return null;const w=KINETIC[l.id],note=WORD_NOTE[l.id]??'',age=t-l.start_s,pop=1+.18*Math.exp(-age/.07),alpha=1-smooth(end-.08,end+.1,t);
 g.save();g.globalAlpha*=alpha;g.textAlign='center';g.translate(960,h*.56);g.scale(pop,pop);g.font='400 140px "Michroma"';const wW=g.measureText('WIRE').width,all=g.measureText('WIRESHARK').width;g.textAlign='left';
 const metal=g.createLinearGradient(0,-120,0,0);metal.addColorStop(0,'#fbfdfe');metal.addColorStop(1,'#c9d7e1');g.fillStyle=metal;g.shadowColor='rgba(143,233,255,.5)';g.shadowBlur=28;g.fillText('WIRE',-all/2,0);const blue=g.createLinearGradient(0,-120,0,0);blue.addColorStop(0,'#7fdcff');blue.addColorStop(1,'#1d8fe6');g.fillStyle=blue;g.fillText('SHARK',-all/2+wW,0);
 g.shadowBlur=0;g.textAlign='center';if(note){g.font='24px "JetBrains Mono"';g.fillStyle='#ffd9a8';g.fillText(note,0,60);}g.restore();return{id:l.id,word:w};}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t)*(1-smooth(b[2],b[3],t)));}
export function drawTitles(g,h,alpha){if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.55);shade.addColorStop(0,'rgba(2,4,9,.82)');shade.addColorStop(.7,'rgba(2,4,9,.3)');shade.addColorStop(1,'rgba(2,4,9,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.55);
 const y=h*.22;g.font='400 128px "Michroma"';const wW=g.measureText('WIRE').width,all=g.measureText('WIRESHARK').width,x0=960-all/2;const metal=g.createLinearGradient(0,y-110,0,y);metal.addColorStop(0,'#fbfdfe');metal.addColorStop(.55,'#c9d7e1');metal.addColorStop(1,'#eef5f9');g.fillStyle=metal;g.shadowColor='rgba(255,255,255,.25)';g.shadowBlur=14;g.fillText('WIRE',x0,y);
 const blue=g.createLinearGradient(0,y-110,0,y);blue.addColorStop(0,'#7fdcff');blue.addColorStop(1,'#1d8fe6');g.fillStyle=blue;g.shadowColor='rgba(47,168,255,.55)';g.shadowBlur=28;g.fillText('SHARK',x0+wW,y);
 g.shadowBlur=0;g.font='400 30px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tr=11,ws=[...name].map(c=>g.measureText(c).width),tot=ws.reduce((a,b)=>a+b,0)+tr*(name.length-1);let x=960-tot/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+92);x+=ws[i]+tr;});
 g.strokeStyle='#ff9a3c';g.lineWidth=2;g.shadowColor='#ff9a3c';g.shadowBlur=10;for(const[a,b]of[[960-tot/2-120,960-tot/2-36],[960+tot/2+36,960+tot/2+120]]){g.beginPath();g.moveTo(a,y+82);g.lineTo(b,y+82);g.stroke();}g.restore();}
const TAG={cap:C.cyan,drop:C.red,flt:C.white,rec:'#b9c8d4',find:C.amber,cfg:C.amber,ok:C.ok};
export function drawLog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+5).slice(-3);rows.forEach((r,i)=>{g.save();g.globalAlpha*=(i===rows.length-1?1:.5)*(1-smooth(r.time_s+4.5,r.time_s+5,t));const y=h-56-(rows.length-1-i)*30;g.fillStyle='rgba(2,4,9,.7)';g.fillRect(56,y-22,1320,30);const tag=`${r.tag}: `;text(g,tag,64,y,17,TAG[r.tag]||C.amber);const w=g.measureText(tag).width;text(g,r.message.slice(0,Math.ceil(clamp((t-r.time_s)/.4)*r.message.length)),64+w,y,17);g.restore();});}
