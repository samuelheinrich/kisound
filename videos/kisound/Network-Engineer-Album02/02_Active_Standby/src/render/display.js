// Two separate local consoles side by side (never a shared cluster view in split brain), each with its own
// heartbeat trace. Pure function of time; used by the console zone.
import {dynamicTexture,wrap} from './world.js';
import {BLOCKS,blockLines,previewB06,HEARTBEATS,haUp,HA_DOWN,HA_UP,RELEASE,role,inSync} from './model.js';
export const DW=2560,DH=1440;
const C={bg:'#04080d',text:'#d8e7ef',dim:'#7c9aae',a:'#ff9a4a',b:'#5fdcff',red:'#ff5d6c',ok:'#74d6a4',amber:'#ffb13d',ecg:'#4fe39a'};
const KC={cmd:'#f3d48a',bad:C.red,ok:C.ok,amber:C.amber,warn:'#ffb0b8',a:C.a,b:C.b,ov:'#cfe6f2'};
const font=(g,s,w='400',f='JetBrains Mono')=>{g.font=`${w} ${s}px "${f}"`;};
// Which block drives the consoles at t (newest started, still within its window, or the last one held).
const ORDER=['B05R','B06','B05','B04','B03','B02','B01'];
export function consoleBlock(t){for(const id of ORDER){const b=BLOCKS[id];if(t>=b.lines[0][0]&&t<b.win[1])return id;}for(const id of ORDER){if(t>=BLOCKS[id].win[1])return id;}return null;}
// Heartbeat trace: QRS spikes at arrivals within the last `span` seconds.
export function drawEcg(g,x,y,w,h,t,to,span=4,col=C.ecg){
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle='rgba(2,10,8,.85)';g.fillRect(x,y,w,h);g.strokeStyle='rgba(79,227,154,.12)';g.lineWidth=1;for(let gx=x;gx<x+w;gx+=w/16){g.beginPath();g.moveTo(gx,y);g.lineTo(gx,y+h);g.stroke();}
 const up=haUp(t),mid=y+h*.62;g.strokeStyle=up?col:C.red;g.lineWidth=Math.max(2,h/40);g.shadowColor=g.strokeStyle;g.shadowBlur=8;g.beginPath();g.moveTo(x,mid);
 const beats=HEARTBEATS.filter(b=>b.to===to&&b.t1<=t&&b.t1>t-span);let cx=x;
 for(const b of beats){const bx=x+w*(1-(t-b.t1)/span);g.lineTo(bx-w*.012,mid);g.lineTo(bx-w*.006,mid+h*.06);g.lineTo(bx,mid-h*.48);g.lineTo(bx+w*.006,mid+h*.2);g.lineTo(bx+w*.012,mid);cx=bx+w*.012;}
 g.lineTo(x+w,mid);g.stroke();g.shadowBlur=0;font(g,Math.round(h/6.5),'600');g.fillStyle=up?col:C.red;g.fillText(up?`Heartbeat ${to==='B'?'A → B':'B → A'}`:'KEIN HEARTBEAT · ha1 down',x+12,y+h/5.5);g.restore();
}
export function createDisplay(){const d=dynamicTexture(DW,DH);return{tex:d.tex,update(t){const id=consoleBlock(t),lines=id?blockLines(id,t):[];const key=JSON.stringify([id,lines.map(l=>l.text+l.typing),Math.floor(t*20),Math.floor(t*1.6)%2]);d.set(key,g=>draw(g,t,id,lines));return id;}};}
function pane(g,x,y,w,h,title,col,lines,t,blink){
 g.fillStyle='#08121c';g.fillRect(x,y,w,h);g.strokeStyle=col;g.lineWidth=5;g.strokeRect(x+2.5,y+2.5,w-5,h-5);g.fillStyle=col;g.fillRect(x,y,w,58);font(g,30,'600','Space Grotesk');g.fillStyle='#071018';g.fillText(title,x+22,y+40);
 let yy=y+120;font(g,34);for(const l of lines){for(const part of wrap(l.text,54)){g.fillStyle=KC[l.kind]||C.text;g.fillText(part,x+28,yy);yy+=50;}if(l.typing&&blink){g.fillStyle=C.b;g.fillRect(x+28+g.measureText(wrap(l.text,54).at(-1)).width+4,yy-50-30,16,36);}}
}
function draw(g,t,id,lines){
 g.fillStyle=C.bg;g.fillRect(0,0,DW,DH);const blink=Math.floor(t*1.6)%2;
 const sw=id==='B03'||id==='B06',L=sw?'SWL':'A',R=sw?'SWW':'B';
 const titleL=sw?'SW-LAN · IOS XE · Console':`A · lokale Console · ${role('A',t)==='primary'?'Primary':'Secondary'}`,titleR=sw?'SW-WAN · IOS XE · Console':`B · lokale Console · ${role('B',t)==='primary'?'Primary':'Secondary'}`;
 pane(g,60,120,1200,820,titleL,sw?'#c9d6e0':C.a,lines.filter(l=>l.pane===L),t,blink);pane(g,1300,120,1200,820,titleR,sw?'#c9d6e0':C.b,lines.filter(l=>l.pane===R),t,blink);
 if(id==='B06'&&previewB06(t)){g.fillStyle=C.amber;g.fillRect(60,960,560,52);font(g,30,'700');g.fillStyle='#1b1205';g.fillText('VORSCHAU · Enter ausstehend',80,996);}
 const ov=lines.filter(l=>l.pane==='ov');font(g,34,'500');ov.forEach((l,i)=>{g.fillStyle=KC[l.kind]||C.text;g.fillText(l.text,id==='B06'&&previewB06(t)?660:60,1000+i*48);});
 drawEcg(g,60,1170,1200,210,t,'A',4,C.a);drawEcg(g,1300,1170,1200,210,t,'B',4,C.b);
 font(g,24);g.fillStyle=C.dim;g.textAlign='right';g.fillText(`Szenario / simulierte Werte · FortiOS 7.6.1 · Sync ${inSync(t)?'in-sync':'unterbrochen'}`,DW-60,1130);g.textAlign='left';
}
