import {TITLES} from './config.js';
import {smooth,clamp} from './timeline.js';
import {LOGS,STATUS,KINETIC,WORD_NOTE,BLOCKS,blockLines,dockBlocks,proofs,link,route,T} from './model.js';
import {wrap} from './world.js';
const C={blue:'#8fcbff',orange:'#ffbf7a',cyan:'#8fe9ff',red:'#ff8b97',ok:'#8fe3b8',white:'#e6eef3',dim:'#88a6b8',amber:'#ffb13d'};
export function text(g,s,x,y,size=22,col=C.white,w='400'){g.font=`${w} ${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
export function drawHeader(g,t){text(g,'R-EDGE · Prod 192.0.2.10 → 198.51.100.20:443 via Gi0/0/1 · Mgmt 10.99.0.0/24 · Console Kanal 7',64,61,18,'#accada');g.textAlign='right';text(g,STATUS(t),1856,61,18,C.cyan);text(g,'Szenario / simulierte Werte',1856,1048,14,'rgba(150,180,200,.6)');g.textAlign='left';}
const DOCK_W=620,COLS=58,KC={cmd:'#f3d48a',bad:C.red,ok:C.ok,amber:C.amber,ov:'#cfe6f2',head:'#ffffff'};
export function drawDock(g,t){const ids=dockBlocks(t);if(!ids.length)return null;let y=96;const out={x:64,y,w:DOCK_W,h:0,ids};
 for(const id of ids){const lines=blockLines(id,t);if(!lines.length)continue;const rows=lines.flatMap(l=>wrap(l.text,COLS).map(s=>[s,l.kind])).slice(-8),bh=44+rows.length*22+12;
  g.fillStyle='rgba(3,9,16,.84)';g.fillRect(64,y,DOCK_W,bh);g.strokeStyle='rgba(143,233,255,.4)';g.lineWidth=2;g.strokeRect(65,y+1,DOCK_W-2,bh-2);text(g,`${id} · ${BLOCKS[id].title}`,80,y+27,15,C.dim,'500');rows.forEach(([s,k],i)=>text(g,s,80,y+56+i*22,15,KC[k]||C.white));y+=bh+10;}
 out.h=y-out.y;return out;}
// The three proofs in their order (Link → Route → Service), then the confirmation and the saved configuration.
export function drawMeter(g,t,h){const pr=proofs(t),x=1480,y=h-236;g.fillStyle='rgba(3,6,10,.8)';g.fillRect(x-12,y-30,388,196);text(g,'Nachweise (Szenario)',x,y-8,14,C.dim);
 const rows=[['Gi0/0/1',t<T.noShut?'admin down':link(t),t<T.noShut?C.red:pr.link?C.ok:C.amber],['Route',t<T.route?'nicht nutzbar':'installiert',pr.route?C.ok:C.dim],['Service P-O1',pr.service?'HTTP 200':'ausstehend',pr.service?C.ok:C.dim],['Bestätigung P-O2',pr.confirm?'HTTP 200':'—',pr.confirm?C.ok:C.dim],['Konfiguration',pr.saved?'gespeichert':'nicht gespeichert',pr.saved?C.ok:C.dim],['Console Kanal 7',t>=T.prompt?'erreichbar':'bereit','#9feaff']];
 rows.forEach(([k,v,c],i)=>{text(g,k,x,y+22+i*26,16,C.dim);g.textAlign='right';text(g,v,x+364,y+22+i*26,17,c,'600');g.textAlign='left';});return{x,y};}
export function drawWords(g,t,tl,h){const segs=tl.analysis.lyrics.segments.filter(l=>KINETIC[l.id]),i=segs.findLastIndex(l=>t>=l.start_s);if(i<0)return null;
 const l=segs[i],next=segs[i+1]?.start_s??1e9,end=Math.min(next-.05,l.start_s+Math.max(1.0,Math.min(1.9,l.end_s-l.start_s+.4)));if(t>=end+.1)return null;const w=KINETIC[l.id],note=WORD_NOTE[l.id]??'',age=t-l.start_s,pop=1+.18*Math.exp(-age/.07),alpha=1-smooth(end-.08,end+.1,t);
 const cx=960;g.save();g.globalAlpha*=alpha;g.textAlign='center';g.translate(cx,h*.56);g.scale(pop,pop);g.font=`400 ${w.length>14?96:w.length>8?118:150}px "Michroma"`;
 const grad=g.createLinearGradient(0,-120,0,0);grad.addColorStop(0,'#d8fbff');grad.addColorStop(1,'#25c6ea');
 g.fillStyle=grad;g.shadowColor='rgba(63,224,255,.45)';g.shadowBlur=28;g.fillText(w,0,0);g.shadowBlur=0;if(note){g.font='24px "JetBrains Mono"';g.fillStyle='#ffd9a8';g.fillText(note,0,58);}g.restore();return{id:l.id,word:w};}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t)*(1-smooth(b[2],b[3],t)));}
export function drawTitles(g,h,alpha){if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.55);shade.addColorStop(0,'rgba(2,4,9,.82)');shade.addColorStop(.7,'rgba(2,4,9,.3)');shade.addColorStop(1,'rgba(2,4,9,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.55);
 const y=h*.22;g.textAlign='center';g.font='400 128px "Michroma"';const metal=g.createLinearGradient(0,y-130,0,y);metal.addColorStop(0,'#fbfdfe');metal.addColorStop(.55,'#c9d7e1');metal.addColorStop(1,'#eef5f9');g.fillStyle=metal;g.shadowColor='rgba(255,255,255,.3)';g.shadowBlur=16;g.fillText('OUT OF BAND',960,y);
 g.shadowBlur=0;g.textAlign='left';g.font='400 30px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tr=11,ws=[...name].map(c=>g.measureText(c).width),tot=ws.reduce((a,b)=>a+b,0)+tr*(name.length-1);let x=960-tot/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+92);x+=ws[i]+tr;});
 g.strokeStyle='#ff9a3c';g.lineWidth=2;g.shadowColor='#ff9a3c';g.shadowBlur=10;for(const[a,b]of[[960-tot/2-120,960-tot/2-36],[960+tot/2+36,960+tot/2+120]]){g.beginPath();g.moveTo(a,y+82);g.lineTo(b,y+82);g.stroke();}g.restore();}
const TAG={prod:C.red,mgmt:'#9feaff',con:'#9feaff',link:C.ok,route:C.ok,svc:C.white,ok:C.ok};
export function drawLog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+5).slice(-3);rows.forEach((r,i)=>{g.save();g.globalAlpha*=(i===rows.length-1?1:.5)*(1-smooth(r.time_s+4.5,r.time_s+5,t));const y=h-56-(rows.length-1-i)*30;g.fillStyle='rgba(2,4,9,.7)';g.fillRect(56,y-22,1300,30);const tag=`${r.tag}: `;text(g,tag,64,y,17,TAG[r.tag]||C.amber);const w=g.measureText(tag).width;text(g,r.message.slice(0,Math.ceil(clamp((t-r.time_s)/.4)*r.message.length)),64+w,y,17);g.restore();});}
