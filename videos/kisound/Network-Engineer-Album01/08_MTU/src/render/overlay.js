import {TITLES} from './config.js';
import {smooth,clamp} from './timeline.js';
import {LOGS,status,upload,termLines,TERM_FOR_MODE,KINETIC_SECTIONS,word,WORD_NOTE,FILE_BYTES,HOST_IP,SRV_IP} from './model.js';
export const DOCK={x:64,y:132,w:600,h:300};
const C={data:'#ff4fd8',icmp:'#ffb534',drop:'#ff4f5e',ok:'#3fe6a0',cyan:'#59e3ff',white:'#e8edf2',dim:'#86a8bc'};
const TERM_COLORS=[[/100% packet loss|no reply|drop|DROP|TYPE=3|too long|Frag needed/,'#ff8b95'],[/bytes from|accept|mtu 1400|frag-needed|done|█/,'#7ff5c0'],[/^\$|^fw#/,'#ffd24a'],[/^ICMP|code 4|next-hop/,'#ffc56b']];
export function text(g,s,x,y,size=22,col=C.white){g.font=`${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
export const technical=shot=>shot.zone==='path'&&shot.mode in TERM_FOR_MODE;
export function drawDock(g,t,shot){
 const{x,y,w}=DOCK,lines=termLines(TERM_FOR_MODE[shot.mode],t),chars=Math.floor(Math.max(0,t-shot.start)*150),typed=[];let n=chars;
 for(const l of lines){if(n<=0)break;typed.push(l.slice(0,n));n-=Math.max(1,l.length)+6;}
 const h=58+lines.length*25;g.fillStyle='rgba(4,12,24,.9)';g.fillRect(x,y,w,h);g.strokeStyle='#27496a';g.lineWidth=1;g.strokeRect(x,y,w,h);g.fillStyle='#0d2440';g.fillRect(x,y,w,30);
 text(g,/^fw/.test(lines[0])?'terminal · firewall':'terminal · host A',x+16,y+21,15,C.dim);
 g.save();g.beginPath();g.rect(x,y+30,w,h-30);g.clip();typed.forEach((l,i)=>{const c=TERM_COLORS.find(([re])=>re.test(l));text(g,l,x+16,y+60+i*25,15,c?c[1]:'#cfe6f2');});g.restore();
}
export function drawHeader(g,t,shot){

 if(shot.zone==='lab'){const band=g.createLinearGradient(0,0,0,130);band.addColorStop(0,'rgba(6,18,36,.82)');band.addColorStop(1,'rgba(6,18,36,0)');g.fillStyle=band;g.fillRect(0,0,1920,130);}
 const st=status(t);text(g,`HOST A ${HOST_IP} → SERVER B ${SRV_IP} · report.pdf`,64,61,18,'#accada');
 g.textAlign='right';text(g,`${st.code} · ${st.text}`,1856,61,18,C[st.color]);g.textAlign='left';
 if(shot.zone==='lab'){text(g,'MEASUREMENT HALL · same byte scale as the path, ×1.6',64,90,15,'#9fc3dd');}
}
export function drawWords(g,t,tl,h,lab=false){
 const segs=tl.analysis.lyrics.segments.filter(l=>KINETIC_SECTIONS.has(l.section)),i=segs.findLastIndex(l=>t>=l.start_s);if(i<0)return;
 const l=segs[i],next=segs[i+1]?.start_s??l.start_s+1.6,end=Math.min(next,l.start_s+1.7);if(t>=end+.1)return;
 const w=word(l.text),note=WORD_NOTE[w]??'',age=t-l.start_s,pop=1+.18*Math.exp(-age/.07),alpha=1-smooth(end-.05,end+.1,t);
 const col=/FRAGMENT|NARROW|STRANDED|TOO BIG/.test(w)?'#ffb1c0':/LOWER|RETRY|UNDERSTAND|FOURTEEN/.test(w)?'#9ff5cf':/JUMBO|PATH/.test(w)?'#9feaf6':'#f3f8fb';
 g.save();g.globalAlpha=alpha;g.textAlign='center';g.translate(960,h*.56);g.scale(pop,pop);g.font=`400 ${w.length>14?96:120}px "Michroma"`;if(lab){g.fillStyle='#0b2140';g.fillText(w,0,0);}else{g.fillStyle=col;g.shadowColor='rgba(47,168,255,.55)';g.shadowBlur=24;g.fillText(w,0,0);}
 g.shadowBlur=0;if(note){g.font='24px "JetBrains Mono"';g.fillStyle=lab?'#a8500a':'#ffd9a8';g.fillText(note,0,56);}g.restore();
}
// The user's view: a plain upload dialog, stuck before the fix and complete after it.
export function drawUser(g,t,shot,h){
 if(shot.mode!=='pain'&&shot.mode!=='done')return;const u=upload(t),a=smooth(shot.start,shot.start+.25,t)*(shot.mode==='done'?smooth(117.3,117.6,t):1);if(a<=0)return;
 const W=760,H=250,x=1856-W,y=h-H-170;g.save();g.globalAlpha=a;g.fillStyle='rgba(236,242,248,.97)';g.fillRect(x,y,W,H);g.fillStyle='#d4dfea';g.fillRect(x,y,W,44);
 g.font='500 22px "Space Grotesk"';g.fillStyle='#2b4766';g.fillText('Upload',x+20,y+30);g.font='600 34px "Space Grotesk"';g.fillStyle='#10233a';g.fillText(u.done?'report.pdf uploaded':'Uploading report.pdf',x+28,y+98);
 g.fillStyle='#c9d6e3';g.fillRect(x+28,y+130,W-56,22);g.fillStyle=u.done?'#1fae73':'#2f8fe0';g.fillRect(x+28,y+130,(W-56)*u.pct,22);
 g.font='22px "JetBrains Mono"';g.fillStyle=u.done?'#1fae73':'#a33a4a';g.fillText(u.done?`✓ ${(FILE_BYTES/1000).toFixed(1)} kB · done`:`${Math.round(u.pct*100)} % · waiting for server${'.'.repeat(1+Math.floor(t*3)%3)}`,x+28,y+196);
 if(!u.done){g.save();g.translate(x+W-60,y+98);g.rotate(t*5);g.strokeStyle='#2f8fe0';g.lineWidth=5;g.beginPath();g.arc(0,0,18,0,Math.PI*1.4);g.stroke();g.restore();}
 g.restore();
}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t)*(1-smooth(b[2],b[3],t)));}
export function drawTitles(g,h,alpha,t){
 if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.6);shade.addColorStop(0,'rgba(2,8,18,.72)');shade.addColorStop(.7,'rgba(2,8,18,.28)');shade.addColorStop(1,'rgba(2,8,18,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.6);
 const y=h*.27;g.textAlign='center';g.font='400 200px "Michroma"';const blue=g.createLinearGradient(0,y-180,0,y);blue.addColorStop(0,'#7fdcff');blue.addColorStop(.5,'#2fa8ff');blue.addColorStop(1,'#0b6fb8');g.fillStyle=blue;g.shadowColor='rgba(47,168,255,.5)';g.shadowBlur=34;g.fillText('MTU',960,y);
 g.shadowBlur=0;g.textAlign='left';g.font='400 30px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tracking=11,widths=[...name].map(c=>g.measureText(c).width),total=widths.reduce((a,b)=>a+b,0)+tracking*(name.length-1);let x=960-total/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+78);x+=widths[i]+tracking;});
 g.strokeStyle='#ff9a3c';g.lineWidth=2;g.shadowColor='#ff9a3c';g.shadowBlur=10;for(const[a,b]of[[960-total/2-110,960-total/2-34],[960+total/2+34,960+total/2+110]]){g.beginPath();g.moveTo(a,y+68);g.lineTo(b,y+68);g.stroke();}
 if(t>130){g.shadowBlur=0;g.textAlign='center';g.font='24px "JetBrains Mono"';g.fillStyle='#ffd9a8';g.fillText('REDUCE AND RETRY',960,y+132);}g.restore();
}
const TAG_COL={drop:C.drop,fw:C.icmp,ping:C.cyan,host:C.ok,app:C.ok};
export function drawLog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+6).slice(-3);if(!rows.length)return;const shade=g.createLinearGradient(0,h-180,0,h);shade.addColorStop(0,'rgba(3,8,15,0)');shade.addColorStop(1,'rgba(3,8,15,.8)');g.fillStyle=shade;g.fillRect(0,h-180,1920,180);rows.forEach((r,i)=>{g.save();g.globalAlpha=(i===rows.length-1?1:.45)*(1-smooth(r.time_s+5.5,r.time_s+6,t));const y=h-52-(rows.length-1-i)*32,stamp=`${String(Math.floor(r.time_s/60)).padStart(2,'0')}:${(r.time_s%60).toFixed(2).padStart(5,'0')}`;text(g,stamp,64,y,18,C.dim);const tag=`${r.tag}: `;text(g,tag,178,y,18,TAG_COL[r.tag]||C.cyan);const width=g.measureText(tag).width;text(g,r.message.slice(0,Math.ceil(clamp((t-r.time_s)/.5)*r.message.length)),178+width,y,18);g.restore();});}
