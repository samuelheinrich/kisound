import {TITLES} from './config.js';
import {smooth,clamp} from './timeline.js';
import {LOGS,STATUS,clock,KINETIC_SECTIONS,KINETIC_TEXT,word,WORD_NOTE,BLOCKS,blockLines,dockBlocks,changeExecuted,ALARM} from './model.js';
import {wrap} from './world.js';
const C={amber:'#ffb13d',red:'#ff8b97',ok:'#8fe3b8',white:'#e6eef3',dim:'#88a6b8',cyan:'#8fe9ff'};
export function text(g,s,x,y,size=22,col=C.white,w='400'){g.font=`${w} ${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
export function drawHeader(g,t,zone,cam){
 text(g,`INCIDENT-2042 · R-EDGE · SITE-2`,64,61,18,'#accada');
 g.textAlign='right';text(g,`${clock(t)} · ${STATUS(t)}`,1856,61,18,t>=169.7?C.ok:t>=ALARM?'#ffd59a':C.dim);g.textAlign='left';
 if(zone==='router'&&cam!=='aisle'){text(g,'R-EDGE INTERN · ZEITLUPE',64,90,15,C.cyan);}
 g.textAlign='right';text(g,'Szenario / simulierte Werte',1856,1048,14,'rgba(150,180,200,.6)');g.textAlign='left';
}
// The active screen block stays readable across cuts (dock, at most a third of the width, at most two blocks).
const DOCK_W=620,COLS=58;
const KC={cmd:'#f3d48a',bad:C.red,ok:C.ok,amber:C.amber,warn:'#ffb0b8',head:'#f2f7fa'};
export function drawDock(g,t,h){
 const ids=dockBlocks(t);if(!ids.length)return null;let y=118;const out={x:64,y,w:DOCK_W,h:0,ids};
 for(const id of ids){const b=BLOCKS[id],lines=blockLines(id,t);if(!lines.length)continue;const rows=lines.flatMap(l=>wrap(l.text,COLS).map(s=>[s,l.kind]));const shown=rows.slice(-8),bh=46+shown.length*22+14;
  g.fillStyle='rgba(3,9,16,.84)';g.fillRect(64,y,DOCK_W,bh);g.strokeStyle=id==='B05'?C.amber:'rgba(95,224,255,.45)';g.lineWidth=2;g.strokeRect(65,y+1,DOCK_W-2,bh-2);
  text(g,`${id} · ${b.title}`,80,y+28,15,C.dim,'500');if(id==='B05'){g.textAlign='right';text(g,changeExecuted(t)?'AUSGEFÜHRT':'VORSCHAU · Enter ausstehend',64+DOCK_W-14,y+28,14,C.amber,'600');g.textAlign='left';}
  shown.forEach(([s,k],i)=>text(g,s,80,y+56+i*22,15,KC[k]||C.white));y+=bh+12;if(id===ids[0])g.globalAlpha*=.8;}
 out.h=y-out.y;return out;
}
// The hook "On Call." as large type at its sung onset, straight from the analysed lyric segments.
export function drawWords(g,t,tl,h,low=false){
 const segs=tl.analysis.lyrics.segments.filter(l=>KINETIC_SECTIONS.has(l.section)&&KINETIC_TEXT.has(l.text)),i=segs.findLastIndex(l=>t>=l.start_s);if(i<0)return null;
 const l=segs[i],end=l.start_s+Math.max(1.0,Math.min(1.9,l.end_s-l.start_s+.3));if(t>=end+.1)return null;
 const w=word(l.text),note=WORD_NOTE[l.id]??'',age=t-l.start_s,pop=1+.18*Math.exp(-age/.07),alpha=1-smooth(end-.08,end+.1,t);
 g.save();g.globalAlpha*=alpha;g.textAlign='center';g.translate(960,h*(low?.82:.55));g.scale(pop,pop);g.font='400 150px "Michroma"';
 const wOn=g.measureText('ON ').width,wAll=g.measureText('ON CALL').width,x0=-wAll/2;g.textAlign='left';
 g.shadowColor='rgba(95,224,255,.5)';g.shadowBlur=30;g.fillStyle='#eef6fa';g.fillText('ON',x0,0);const blue=g.createLinearGradient(0,-120,0,0);blue.addColorStop(0,'#7fdcff');blue.addColorStop(1,'#1f8fe6');g.fillStyle=blue;g.fillText('CALL',x0+wOn,0);
 g.shadowBlur=0;g.textAlign='center';if(note){g.font='26px "JetBrains Mono"';g.fillStyle='#ffd9a8';g.fillText(note,0,62);}g.restore();return{id:l.id,word:w};
}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t)*(1-smooth(b[2],b[3],t)));}
export function drawTitles(g,h,alpha){
 if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.6);shade.addColorStop(0,'rgba(2,4,9,.8)');shade.addColorStop(.7,'rgba(2,4,9,.3)');shade.addColorStop(1,'rgba(2,4,9,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.6);
 const y=h*.24;g.font='400 128px "Michroma"';const wOn=g.measureText('ON ').width,wAll=g.measureText('ON CALL').width,x0=960-wAll/2;
 const metal=g.createLinearGradient(0,y-110,0,y);metal.addColorStop(0,'#fbfdfe');metal.addColorStop(.55,'#c9d7e1');metal.addColorStop(1,'#eef5f9');g.fillStyle=metal;g.shadowColor='rgba(255,255,255,.25)';g.shadowBlur=14;g.fillText('ON',x0,y);
 const blue=g.createLinearGradient(0,y-110,0,y);blue.addColorStop(0,'#7fdcff');blue.addColorStop(1,'#1d8fe6');g.fillStyle=blue;g.shadowColor='rgba(47,168,255,.55)';g.shadowBlur=28;g.fillText('CALL',x0+wOn,y);
 g.shadowBlur=0;g.font='400 30px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tracking=11,widths=[...name].map(c=>g.measureText(c).width),total=widths.reduce((a,b)=>a+b,0)+tracking*(name.length-1);let x=960-total/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+92);x+=widths[i]+tracking;});
 g.strokeStyle='#ff9a3c';g.lineWidth=2;g.shadowColor='#ff9a3c';g.shadowBlur=10;for(const[a,b]of[[960-total/2-120,960-total/2-36],[960+total/2+36,960+total/2+120]]){g.beginPath();g.moveTo(a,y+82);g.lineTo(b,y+82);g.stroke();}g.restore();
}
const TAG_COL={acl:C.red,test:'#cfe6f2',cfg:C.amber,flow:C.cyan,ok:C.ok,link:'#9feaf6'};
export function drawLog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+5).slice(-3);if(!rows.length)return;const shade=g.createLinearGradient(0,h-170,0,h);shade.addColorStop(0,'rgba(2,4,9,0)');shade.addColorStop(1,'rgba(2,4,9,.82)');g.fillStyle=shade;g.fillRect(0,h-170,1920,170);
 rows.forEach((r,i)=>{g.save();g.globalAlpha*=(i===rows.length-1?1:.5)*(1-smooth(r.time_s+4.5,r.time_s+5,t));const y=h-56-(rows.length-1-i)*30;text(g,clock(r.time_s),64,y,17,C.dim);const tag=`${r.tag}: `;text(g,tag,150,y,17,TAG_COL[r.tag]||C.amber);const w=g.measureText(tag).width;text(g,r.message.slice(0,Math.ceil(clamp((t-r.time_s)/.4)*r.message.length)),150+w,y,17);g.restore();});}
