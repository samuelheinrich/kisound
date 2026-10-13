import {TITLES,SILENCE} from './config.js';
import {smooth,clamp} from './timeline.js';
import {LOGS,status,ticketAt,digOutput,DIG_FOR_MODE,KINETIC_SECTIONS,word,WORD_NOTE} from './model.js';
export const DOCK={x:64,y:132,w:600,h:470};
const C={query:'#ffd24a',answer:'#3fe6a0',nx:'#ff4fa3',timeout:'#ff6f7d',cyan:'#59d8ed',white:'#e8edf2',dim:'#86a8bc',faint:'#4f6b80'};
const CODE_COL={NXDOMAIN:C.nx,NOERROR:C.answer,TIMEOUT:C.timeout,QUERY:C.query,CLOSED:C.dim,IDLE:C.dim};
const DIG_COLORS=[[/status: NXDOMAIN|NXDOMAIN|no such name|cannot resolve|missing/,'#ff7cbf'],[/status: NOERROR|ANSWER SECTION|works|✓|^\+ /,'#7ff5c0'],[/timed out|no servers/,'#ff8a95'],[/^\$|^engineer\$/,'#ffd24a'],[/^;;/,'#8fb2c8']];
export function text(g,s,x,y,size=22,col=C.white){g.font=`${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
// The dock shows dig, ping or traceroute in the DNS world; on the desk the monitor shows it instead.
export const technicalModes=new Set(['incident','vanish','checks','stale','split','reverse','cname','flush','requery','fix','resolved','negative','recover','cname2','stale2','split2','reverse2','cname3','flush2','requery2','fix2','ping']);
export function digKind(shot){return shot.camera==='ping'?'ping':shot.camera==='trace'?'trace':DIG_FOR_MODE[shot.mode]||'nx';}
export function drawDock(g,t,shot){
 const{x,y,w,h}=DOCK,lines=digOutput(digKind(shot),t),chars=Math.floor(Math.max(0,t-shot.start)*140),typed=[];let n=chars;
 for(const l of lines){if(n<=0)break;typed.push(l.slice(0,n));n-=l.length+6;}
 g.fillStyle='rgba(3,8,15,.9)';g.fillRect(x,y,w,h);g.strokeStyle='#27496a';g.lineWidth=1;g.strokeRect(x,y,w,h);g.fillStyle='#0d2236';g.fillRect(x,y,w,30);
 text(g,'terminal · engineer@helpdesk',x+16,y+21,15,C.dim);for(const[i,c]of['#ff6f7d','#ffd24a','#3fe6a0'].entries()){g.fillStyle=c;g.beginPath();g.arc(x+w-20-i*18,y+15,5,0,Math.PI*2);g.fill();}
 g.save();g.beginPath();g.rect(x,y+30,w,h-30);g.clip();
 typed.forEach((l,i)=>{const c=DIG_COLORS.find(([re])=>re.test(l));text(g,l,x+16,y+62+i*25,16,c?c[1]:'#cfe6f2');});
 if(Math.floor(t*2)%2===0){const last=typed.at(-1)||'';g.font='16px "JetBrains Mono"';g.fillStyle=C.white;g.fillRect(x+16+g.measureText(last).width+2,y+48+(typed.length-1)*25,9,17);}
 g.restore();
}
export function drawHeader(g,t,shot){
 const k=ticketAt(t),st=status(t);
 text(g,t<9?'HELPDESK · NIGHT SHIFT':`CASE #${k.id} · ${k.name}`,64,61,18,'#accada');g.textAlign='right';
 if(st.code!=='IDLE')text(g,`${st.code}${st.code==='NOERROR'?' · resolved':st.code==='NXDOMAIN'?' · name does not exist':''}`,1856,61,18,CODE_COL[st.code]);
 g.textAlign='left';
}
// Hook and bridge words as large type, straight from the analysed lyric segments.
export function drawWords(g,t,tl,h){
 const segs=tl.analysis.lyrics.segments.filter(l=>KINETIC_SECTIONS.has(l.section)),i=segs.findLastIndex(l=>t>=l.start_s);if(i<0)return;
 const l=segs[i],next=segs[i+1]?.start_s??l.start_s+1.4,end=Math.min(next,l.start_s+1.5);if(t>=end+.1)return;
 const w=word(l.text),note=WORD_NOTE[w]??WORD_NOTE[w.replace("IT'S",'ITS')]??'',age=t-l.start_s,pop=1+.2*Math.exp(-age/.07),alpha=1-smooth(end-.05,end+.1,t);
 const col=/NXDOMAIN|SAYS NO|MESS/.test(w)?'#ff9ccc':/YES|FIX|DNS$/.test(w)?'#9ff5cf':/TTL/.test(w)?'#ffe08a':'#f3f8fb';
 g.save();g.globalAlpha=alpha;g.textAlign='center';g.translate(960,h*.55);g.scale(pop,pop);g.font=`400 ${w.length>14?92:w.length>9?112:140}px "Michroma"`;g.fillStyle=col;g.shadowColor='rgba(255,79,163,.5)';g.shadowBlur=26;g.fillText(w,0,0);
 g.shadowBlur=0;if(note){g.font='24px "JetBrains Mono"';g.fillStyle='#ffd9a8';g.fillText(note,0,56);}g.restore();
}
// The 2.3 s of digital silence: no picture, only the client giving up.
export function drawTimeout(g,t,h){
 if(t<SILENCE[0]||t>=SILENCE[1]+.25)return false;
 const a=1-smooth(SILENCE[1],SILENCE[1]+.25,t);g.save();g.globalAlpha=a;g.fillStyle='#000';g.fillRect(0,0,1920,h);
 const lines=digOutput('timeout',t),chars=Math.floor((t-SILENCE[0])*60);let n=chars;g.font='30px "JetBrains Mono"';
 lines.forEach((l,i)=>{if(n<=0)return;const s=l.slice(0,n);n-=l.length+4;g.fillStyle=/timed out|no servers/.test(l)?'#ff6f7d':l.startsWith('$')?'#ffd24a':'#cfe6f2';g.fillText(s,240,h*.38+i*48);});
 g.restore();return true;
}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t)*(1-smooth(b[2],b[3],t)));}
export function drawTitles(g,h,alpha){
 if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.64);shade.addColorStop(0,'rgba(2,6,13,.75)');shade.addColorStop(.7,'rgba(2,6,13,.3)');shade.addColorStop(1,'rgba(2,6,13,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.64);
 const y=h*.2;g.textAlign='center';g.font='400 84px "Michroma"';const metal=g.createLinearGradient(0,y-80,0,y);metal.addColorStop(0,'#f8fcfd');metal.addColorStop(.5,'#d6e6ef');metal.addColorStop(.58,'#9fbbc9');metal.addColorStop(1,'#eaf6fc');
 g.fillStyle=metal;g.shadowColor='rgba(90,166,255,.35)';g.shadowBlur=18;g.fillText("IT'S ALWAYS",960,y);
 g.font='400 168px "Michroma"';const blue=g.createLinearGradient(0,y+20,0,y+180);blue.addColorStop(0,'#5fd0ff');blue.addColorStop(.5,'#1d9fe6');blue.addColorStop(1,'#0b6fb8');g.fillStyle=blue;g.shadowColor='rgba(29,159,230,.45)';g.shadowBlur=30;g.fillText('DNS',960,y+180);
 g.shadowBlur=0;g.textAlign='left';g.font='400 30px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tracking=11,widths=[...name].map(c=>g.measureText(c).width),total=widths.reduce((a,b)=>a+b,0)+tracking*(name.length-1);let x=960-total/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+262);x+=widths[i]+tracking;});
 g.strokeStyle='#ff9a3c';g.lineWidth=2;g.shadowColor='#ff9a3c';g.shadowBlur=10;for(const[a,b]of[[960-total/2-110,960-total/2-34],[960+total/2+34,960+total/2+110]]){g.beginPath();g.moveTo(a,y+252);g.lineTo(b,y+252);g.stroke();}g.restore();
}
const TAG_COL={query:C.query,answer:C.answer,nxdomain:C.nx,resolver:C.timeout,ticket:C.cyan,rndc:C.white,zone:C.answer};
export function drawLog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+6).slice(-3);if(!rows.length)return;const shade=g.createLinearGradient(0,h-180,0,h);shade.addColorStop(0,'rgba(3,8,15,0)');shade.addColorStop(1,'rgba(3,8,15,.86)');g.fillStyle=shade;g.fillRect(0,h-180,1920,180);rows.forEach((r,i)=>{g.save();g.globalAlpha=(i===rows.length-1?1:.45)*(1-smooth(r.time_s+5.5,r.time_s+6,t));const y=h-52-(rows.length-1-i)*32,stamp=`${String(Math.floor(r.time_s/60)).padStart(2,'0')}:${(r.time_s%60).toFixed(2).padStart(5,'0')}`;text(g,stamp,64,y,18,C.dim);const tag=`${r.tag}: `;text(g,tag,178,y,18,TAG_COL[r.tag]||C.cyan);const width=g.measureText(tag).width;text(g,r.message.slice(0,Math.ceil(clamp((t-r.time_s)/.5)*r.message.length)),178+width,y,18);g.restore();});}
