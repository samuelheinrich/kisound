import {TITLES} from './config.js';
import {smooth,clamp} from './timeline.js';
import {LOGS,STATUS,swallowed,KINETIC_SECTIONS,word,WORD_NOTE} from './model.js';
const C={amber:'#ffb648',deny:'#ff8b95',ok:'#7ff5c0',white:'#e8edf2',dim:'#86a8bc'};
export function text(g,s,x,y,size=22,col=C.white){g.font=`${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
export function drawHeader(g,t){
 text(g,'PROBE HOST 192.0.2.10 → 203.0.113.45 · site B',64,61,18,'#accada');
 g.textAlign='right';text(g,t<9?'no reply':`${STATUS(t)} · ${swallowed(t)} packets gone`,1856,61,18,C.deny);g.textAlign='left';
}
// Chant and break callouts as large type, straight from the analysed lyric segments.
export function drawWords(g,t,tl,h,low=false){
 const segs=tl.analysis.lyrics.segments.filter(l=>KINETIC_SECTIONS.has(l.section)),i=segs.findLastIndex(l=>t>=l.start_s);if(i<0)return;
 const l=segs[i],next=segs[i+1]?.start_s??l.start_s+1.4,end=Math.min(next,l.start_s+Math.max(.6,Math.min(1.6,l.end_s-l.start_s+.4)));if(t>=end+.08)return;
 const w=word(l.text),note=WORD_NOTE[w]??'',age=t-l.start_s,pop=1+.22*Math.exp(-age/.06),alpha=1-smooth(end-.05,end+.08,t);
 const col=/UNREACHABLE|BLACKHOLE|FALL|DIE|LOST|GONE|NO /.test(w)?'#ff9aa6':/TIME|TTL|ICMP|HOP|TRACE/.test(w)?'#e8f4ff':'#9fdcf0';
 g.save();g.globalAlpha=alpha;g.textAlign='center';g.translate(960,h*(low?.84:.56));g.scale(pop,pop);g.font=`400 ${w.length>16?84:w.length>9?108:136}px "Michroma"`;g.fillStyle=col;g.shadowColor='rgba(89,227,255,.45)';g.shadowBlur=26;g.fillText(w,0,0);
 g.shadowBlur=0;if(note){g.font='24px "JetBrains Mono"';g.fillStyle='#ffd9a8';g.fillText(note,0,56);}g.restore();
}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t)*(1-smooth(b[2],b[3],t)));}
export function drawTitles(g,h,alpha){
 if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.62);shade.addColorStop(0,'rgba(3,4,8,.78)');shade.addColorStop(.7,'rgba(3,4,8,.3)');shade.addColorStop(1,'rgba(3,4,8,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.62);
 const y=h*.2;g.textAlign='center';g.font='400 96px "Michroma"';const metal=g.createLinearGradient(0,y-90,0,y);metal.addColorStop(0,'#f8fcfd');metal.addColorStop(.55,'#cfdde6');metal.addColorStop(1,'#eef6fa');g.fillStyle=metal;g.shadowColor='rgba(255,255,255,.25)';g.shadowBlur=14;g.fillText('DESTINATION',960,y);
 g.font='400 96px "Michroma"';const blue=g.createLinearGradient(0,y+20,0,y+130);blue.addColorStop(0,'#6fd4ff');blue.addColorStop(1,'#1d8fe0');g.fillStyle=blue;g.shadowColor='rgba(47,168,255,.5)';g.shadowBlur=26;g.fillText('UNREACHABLE',960,y+125);
 g.shadowBlur=0;g.textAlign='left';g.font='400 30px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tracking=11,widths=[...name].map(c=>g.measureText(c).width),total=widths.reduce((a,b)=>a+b,0)+tracking*(name.length-1);let x=960-total/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+200);x+=widths[i]+tracking;});
 g.strokeStyle='#ff4057';g.lineWidth=2;g.shadowColor='#ff4057';g.shadowBlur=10;for(const[a,b]of[[960-total/2-110,960-total/2-34],[960+total/2+34,960+total/2+110]]){g.beginPath();g.moveTo(a,y+190);g.lineTo(b,y+190);g.stroke();}g.restore();
}
const TAG_COL={icmp3:C.deny,icmp11:'#e8f4ff',timeout:C.deny,route:'#ffd24a',ospf:'#9feaf6'};
export function drawLog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+5).slice(-3);if(!rows.length)return;const shade=g.createLinearGradient(0,h-180,0,h);shade.addColorStop(0,'rgba(3,4,8,0)');shade.addColorStop(1,'rgba(3,4,8,.82)');g.fillStyle=shade;g.fillRect(0,h-180,1920,180);rows.forEach((r,i)=>{g.save();g.globalAlpha=(i===rows.length-1?1:.45)*(1-smooth(r.time_s+4.5,r.time_s+5,t));const y=h-52-(rows.length-1-i)*32,stamp=`${String(Math.floor(r.time_s/60)).padStart(2,'0')}:${(r.time_s%60).toFixed(2).padStart(5,'0')}`;text(g,stamp,64,y,18,C.dim);const tag=`${r.tag}: `;text(g,tag,178,y,18,TAG_COL[r.tag]||C.amber);const width=g.measureText(tag).width;text(g,r.message.slice(0,Math.ceil(clamp((t-r.time_s)/.4)*r.message.length)),178+width,y,18);g.restore();});}
