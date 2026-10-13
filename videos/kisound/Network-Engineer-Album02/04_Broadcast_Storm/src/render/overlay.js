import {TITLES} from './config.js';
import {smooth,clamp} from './timeline.js';
import {LOGS,STATUS,KINETIC,WORD_NOTE,BLOCKS,blockLines,dockBlocks,bcastRate,cpu,mgmtOk,aliveCopies} from './model.js';
import {wrap} from './world.js';
const C={yellow:'#ffd23a',red:'#ff8b97',ok:'#8fe3b8',white:'#e6eef3',dim:'#88a6b8',amber:'#ffb13d'};
export function text(g,s,x,y,size=22,col=C.white,w='400'){g.font=`${w} ${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
export function drawHeader(g,t){text(g,'VLAN 120 · SW1–SW2–SW3 · H1 192.0.2.10',64,61,18,'#accada');g.textAlign='right';const st=STATUS(t);text(g,st,1856,61,18,/STORM|wachsen|Suche/.test(st)?C.red:/down|ruhig/.test(st)?C.ok:C.yellow);text(g,'Szenario / simulierte Werte',1856,1048,14,'rgba(150,180,200,.6)');g.textAlign='left';}
const DOCK_W=620,COLS=58,KC={cmd:'#f3d48a',bad:C.red,ok:C.ok,amber:C.amber,ov:'#cfe6f2',head:'#ffffff'};
export function drawDock(g,t){const ids=dockBlocks(t);if(!ids.length)return null;let y=96;const out={x:64,y,w:DOCK_W,h:0,ids};
 for(const id of ids){const lines=blockLines(id,t);if(!lines.length)continue;const rows=lines.flatMap(l=>wrap(l.text,COLS).map(s=>[s,l.kind])).slice(-8),bh=44+rows.length*22+12;
  g.fillStyle='rgba(3,9,16,.84)';g.fillRect(64,y,DOCK_W,bh);g.strokeStyle='rgba(255,210,58,.4)';g.lineWidth=2;g.strokeRect(65,y+1,DOCK_W-2,bh-2);text(g,`${id} · ${BLOCKS[id].title}`,80,y+27,15,C.dim,'500');rows.forEach(([s,k],i)=>text(g,s,80,y+56+i*22,15,KC[k]||C.white));y+=bh+10;}
 out.h=y-out.y;return out;}
// A small load meter (simulated values): broadcast rate (log scale), CPU, circulating copies, management.
export function drawMeter(g,t,h){const x=1440,y=h-210,w=416;g.fillStyle='rgba(3,6,10,.8)';g.fillRect(x-12,y-30,w+24,170);text(g,'Last · Szenario',x,y-8,14,'#c9b46a');const r=bcastRate(t),k=Math.log10(r+1)/Math.log10(620001);
 const bar=(yy,label,v,col,val)=>{text(g,label,x,yy,15,C.dim);g.fillStyle='#1a2430';g.fillRect(x+130,yy-13,w-230,14);g.fillStyle=col;g.fillRect(x+130,yy-13,(w-230)*clamp(v),14);g.textAlign='right';text(g,val,x+w,yy,15,col);g.textAlign='left';};
 bar(y+22,'Broadcast',k,k>.9?'#ff6b78':C.yellow,`${r.toLocaleString('de-CH')} fps`);bar(y+54,'CPU SW3',cpu(t)/100,cpu(t)>80?'#ff6b78':C.ok,`${cpu(t)}%`);const n=aliveCopies(t).length;bar(y+86,'Kopien (Bild)',n/200,n>100?'#ff6b78':C.yellow,String(n));
 text(g,mgmtOk(t)?'Management: erreichbar':'Management: Timeout',x,y+118,15,mgmtOk(t)?C.ok:C.amber);return{x,y,w};}
export function drawWords(g,t,tl,h){const segs=tl.analysis.lyrics.segments.filter(l=>KINETIC[l.id]),i=segs.findLastIndex(l=>t>=l.start_s);if(i<0)return null;
 const l=segs[i],end=l.start_s+Math.max(1.0,Math.min(2.0,l.end_s-l.start_s+.4));if(t>=end+.1)return null;const w=KINETIC[l.id],note=WORD_NOTE[l.id]??'',age=t-l.start_s,pop=1+.2*Math.exp(-age/.06),alpha=1-smooth(end-.08,end+.1,t);
 g.save();g.globalAlpha*=alpha;g.textAlign='center';g.translate(960,h*.56);g.scale(pop,pop);g.font=`400 ${w.length>12?108:132}px "Michroma"`;
 const grad=g.createLinearGradient(0,-110,0,0);if(/PORT DOWN/.test(w)){grad.addColorStop(0,'#c8ffe4');grad.addColorStop(1,'#3fd08a');}else if(/KABEL/.test(w)){grad.addColorStop(0,'#ffe3a8');grad.addColorStop(1,'#ffb13d');}else{grad.addColorStop(0,'#fff6c8');grad.addColorStop(1,'#ffc41a');}
 g.fillStyle=grad;g.shadowColor='rgba(255,196,26,.5)';g.shadowBlur=30;g.fillText(w,0,0);g.shadowBlur=0;if(note){g.font='24px "JetBrains Mono"';g.fillStyle='#ffe0b0';g.fillText(note,0,58);}g.restore();return{id:l.id,word:w};}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t)*(1-smooth(b[2],b[3],t)));}
export function drawTitles(g,h,alpha){if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.6);shade.addColorStop(0,'rgba(2,4,9,.82)');shade.addColorStop(.7,'rgba(2,4,9,.3)');shade.addColorStop(1,'rgba(2,4,9,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.6);
 const y=h*.17;g.textAlign='center';g.font='400 112px "Michroma"';const metal=g.createLinearGradient(0,y-100,0,y);metal.addColorStop(0,'#fbfdfe');metal.addColorStop(.55,'#c9d7e1');metal.addColorStop(1,'#eef5f9');g.fillStyle=metal;g.shadowColor='rgba(255,255,255,.25)';g.shadowBlur=14;g.fillText('BROADCAST',960,y);
 const blue=g.createLinearGradient(0,y+20,0,y+130);blue.addColorStop(0,'#7fdcff');blue.addColorStop(1,'#1d8fe6');g.fillStyle=blue;g.shadowColor='rgba(47,168,255,.55)';g.shadowBlur=28;g.fillText('STORM',960,y+128);
 g.shadowBlur=0;g.textAlign='left';g.font='400 30px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tr=11,ws=[...name].map(c=>g.measureText(c).width),tot=ws.reduce((a,b)=>a+b,0)+tr*(name.length-1);let x=960-tot/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+206);x+=ws[i]+tr;});
 g.strokeStyle='#ff9a3c';g.lineWidth=2;g.shadowColor='#ff9a3c';g.shadowBlur=10;for(const[a,b]of[[960-tot/2-120,960-tot/2-36],[960+tot/2+36,960+tot/2+120]]){g.beginPath();g.moveTo(a,y+196);g.lineTo(b,y+196);g.stroke();}g.restore();}
const TAG={link:'#9feaf6',arp:C.yellow,sw:C.red,cpu:C.red,mgmt:C.amber,drop:C.red,task:C.amber,ok:C.ok};
export function drawLog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+5).slice(-3);rows.forEach((r,i)=>{g.save();g.globalAlpha*=(i===rows.length-1?1:.5)*(1-smooth(r.time_s+4.5,r.time_s+5,t));const y=h-56-(rows.length-1-i)*30;g.fillStyle='rgba(2,4,9,.7)';g.fillRect(56,y-22,1340,30);const tag=`${r.tag}: `;text(g,tag,64,y,17,TAG[r.tag]||C.amber);const w=g.measureText(tag).width,msg=r.message.length>112?r.message.slice(0,111)+'…':r.message;text(g,msg.slice(0,Math.ceil(clamp((t-r.time_s)/.4)*msg.length)),64+w,y,17);g.restore();});}
