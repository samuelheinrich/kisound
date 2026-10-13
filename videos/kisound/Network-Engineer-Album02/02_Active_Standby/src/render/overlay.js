import {TITLES} from './config.js';
import {smooth,clamp} from './timeline.js';
import {LOGS,STATUS,KINETIC,word,WORD_NOTE,BLOCKS,blockLines,dockBlocks,previewB06,HA_DOWN,haUp} from './model.js';
import {wrap} from './world.js';
import {drawEcg} from './display.js';
const C={a:'#ffa45a',b:'#6fe0ff',red:'#ff8b97',ok:'#8fe3b8',white:'#e6eef3',dim:'#88a6b8',amber:'#ffb13d'};
export function text(g,s,x,y,size=22,col=C.white,w='400'){g.font=`${w} ${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
export function drawHeader(g,t){
 text(g,'FGCP A-P · group 22 · LAN 192.0.2.1',64,61,18,'#accada');g.textAlign='right';const st=STATUS(t);text(g,st,1856,61,18,/SPLIT|down/.test(st)?C.red:/B Primary/.test(st)?C.b:C.a);
 text(g,'Szenario / simulierte Werte',1856,1048,14,'rgba(150,180,200,.6)');g.textAlign='left';
}
const DOCK_W=620,COLS=58,KC={cmd:'#f3d48a',bad:C.red,ok:C.ok,amber:C.amber,warn:'#ffb0b8',a:C.a,b:C.b,ov:'#cfe6f2'},PANE={A:'A',B:'B',SWL:'SW-LAN',SWW:'SW-WAN',ov:''};
export function drawDock(g,t){
 const ids=dockBlocks(t);if(!ids.length)return null;let y=96;const out={x:64,y,w:DOCK_W,h:0,ids};
 for(const id of ids){const lines=blockLines(id,t);if(!lines.length)continue;const rows=lines.flatMap(l=>wrap(l.text,COLS).map(s=>[s,l.kind,l.pane])).slice(-9),bh=44+rows.length*22+12;
  g.fillStyle='rgba(3,9,16,.84)';g.fillRect(64,y,DOCK_W,bh);g.strokeStyle=id==='B06'?C.amber:'rgba(140,200,230,.4)';g.lineWidth=2;g.strokeRect(65,y+1,DOCK_W-2,bh-2);
  text(g,`${id} · ${BLOCKS[id].title}`,80,y+27,15,C.dim,'500');if(id==='B06'){g.textAlign='right';text(g,previewB06(t)?'VORSCHAU · Enter ausstehend':'AUSGEFÜHRT',64+DOCK_W-14,y+27,14,C.amber,'600');g.textAlign='left';}
  rows.forEach(([s,k,p],i)=>{const bar=p==='A'?C.a:p==='B'?C.b:p==='ov'?'#5a6a78':'#c9d6e0';g.fillStyle=bar;g.fillRect(70,y+42+i*22,3,18);text(g,s,80,y+56+i*22,15,KC[k]||C.white);});y+=bh+10;}
 out.h=y-out.y;return out;
}
// Clinical heartbeat monitor: B receives from A (top), A receives from B (bottom).
export function drawMonitor(g,t,h){const x=1340,y=h-232,w=516,hh=72;g.fillStyle='rgba(2,8,10,.8)';g.fillRect(x-10,y-34,w+20,2*hh+52);text(g,'ha1 · Heartbeat-Monitor (Szenario: 1 pro Takt)',x,y-12,14,'#7fbfa0');drawEcg(g,x,y,w,hh,t,'B',4,C.a);drawEcg(g,x,y+hh+8,w,hh,t,'A',4,C.b);return{x,y,w,h:2*hh+8};}
export function drawWords(g,t,tl,h){
 const segs=tl.analysis.lyrics.segments.filter(l=>KINETIC[l.id]),i=segs.findLastIndex(l=>t>=l.start_s);if(i<0)return null;
 const l=segs[i],dev=KINETIC[l.id],end=l.start_s+Math.max(1.1,Math.min(2.2,l.end_s-l.start_s+.5));if(t>=end+.1)return null;
 const w=word(l.text),note=WORD_NOTE[l.id]??'',age=t-l.start_s,pop=1+.18*Math.exp(-age/.07),alpha=1-smooth(end-.08,end+.1,t),x=dev==='A'?560:dev==='B'?1360:960;
 g.save();g.globalAlpha*=alpha;g.textAlign='center';g.translate(x,h*.7);g.scale(pop,pop);g.font=`400 ${w.length>8?118:132}px "Michroma"`;
 const grad=g.createLinearGradient(0,-110,0,0);if(dev==='A'){grad.addColorStop(0,'#ffd2a8');grad.addColorStop(1,'#ff7a1a');}else if(dev==='B'){grad.addColorStop(0,'#9fe8ff');grad.addColorStop(1,'#1f8fe6');}else{grad.addColorStop(0,'#ffc0c8');grad.addColorStop(1,'#ff3b4e');}
 g.fillStyle=grad;g.shadowColor=dev==='A'?'rgba(255,138,42,.55)':dev==='B'?'rgba(63,212,255,.55)':'rgba(255,59,78,.6)';g.shadowBlur=30;g.fillText(w,0,0);g.shadowBlur=0;if(note){g.font='24px "JetBrains Mono"';g.fillStyle='#ffd9a8';g.fillText(note,0,58);}g.restore();return{id:l.id,word:w,dev};
}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t)*(1-smooth(b[2],b[3],t)));}
export function drawTitles(g,h,alpha){
 if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.6);shade.addColorStop(0,'rgba(2,4,9,.82)');shade.addColorStop(.7,'rgba(2,4,9,.3)');shade.addColorStop(1,'rgba(2,4,9,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.6);
 const y=h*.17;g.textAlign='center';g.font='400 112px "Michroma"';const metal=g.createLinearGradient(0,y-100,0,y);metal.addColorStop(0,'#fbfdfe');metal.addColorStop(.55,'#c9d7e1');metal.addColorStop(1,'#eef5f9');g.fillStyle=metal;g.shadowColor='rgba(255,255,255,.25)';g.shadowBlur=14;g.fillText('ACTIVE /',960,y);
 const blue=g.createLinearGradient(0,y+20,0,y+130);blue.addColorStop(0,'#7fdcff');blue.addColorStop(1,'#1d8fe6');g.fillStyle=blue;g.shadowColor='rgba(47,168,255,.55)';g.shadowBlur=28;g.fillText('STANDBY',960,y+128);
 g.shadowBlur=0;g.textAlign='left';g.font='400 30px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tr=11,ws=[...name].map(c=>g.measureText(c).width),tot=ws.reduce((a,b)=>a+b,0)+tr*(name.length-1);let x=960-tot/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+206);x+=ws[i]+tr;});
 g.strokeStyle='#ff9a3c';g.lineWidth=2;g.shadowColor='#ff9a3c';g.shadowBlur=10;for(const[a,b]of[[960-tot/2-120,960-tot/2-36],[960+tot/2+36,960+tot/2+120]]){g.beginPath();g.moveTo(a,y+196);g.lineTo(b,y+196);g.stroke();}g.restore();
}
const TAG={ha:'#e6f3fa',sw:C.red,warn:C.red,cfg:C.amber,ok:C.ok};
export function drawLog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+5).slice(-3);if(!rows.length)return;rows.forEach((r,i)=>{g.save();g.globalAlpha*=(i===rows.length-1?1:.5)*(1-smooth(r.time_s+4.5,r.time_s+5,t));const y=h-56-(rows.length-1-i)*30;g.fillStyle='rgba(2,4,9,.7)';g.fillRect(56,y-22,1240,30);const tag=`${r.tag}: `;text(g,tag,64,y,17,TAG[r.tag]||C.amber);const w=g.measureText(tag).width;const msg=r.message.length>104?r.message.slice(0,103)+'…':r.message;text(g,msg.slice(0,Math.ceil(clamp((t-r.time_s)/.4)*msg.length)),64+w,y,17);g.restore();});}
