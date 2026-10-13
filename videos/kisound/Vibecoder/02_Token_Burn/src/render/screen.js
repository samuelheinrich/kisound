// The readable 2D layer: the sequencer demo, prompts, diff, export comparison, tabs and the usage journal.
// Full-frame views (1920 × 1080 logical pixels) for the 2D shots, and the same drawing primitives for the
// laptop display and the project panels in 3D, so both dimensions show the same state at the same time.
import {SHOT,LANG} from './config.js';
import {clamp,smooth,ease,lerp} from './timeline.js';
import {TXT,JOB,JOBS,ROWS,KICK,BASS,pattern,saved,hasLevelSlider,hasBassSlider,bassSlider,playhead,version,usage,clockText,tabs,tabMotion,
 exportLanes,exportState,EXPORT,settingsSaved,jobState,RELOAD1,FIX_LINE,RELOAD2,COMPARE2,PASS2,doneJobs,fmt,af,at,jobOutput} from './model.js';
export const THEMES={
 night:{bg:'#10141C',panel:'#182030',panel2:'#1E2738',line:'#33415A',ink:'#F4F3EA',dim:'#93A0B6',input:'#44DDE5',output:'#FF6534',pass:'#D1F85D',warn:'#FFB347',cell:'#26324A',kick:'#F4F3EA',bass:'#FF6534',shadow:'rgba(0,0,0,.35)'},
 day:{bg:'#DDDFD1',panel:'#EEF0E6',panel2:'#E5E8DC',line:'#AEB3A3',ink:'#161A20',dim:'#59616D',input:'#0B8C95',output:'#E2541F',pass:'#5E8C00',warn:'#B36B00',cell:'#CDD1C3',kick:'#161A20',bass:'#E2541F',shadow:'rgba(40,40,30,.16)'},
};
export const themeAt=t=>t>=SHOT.S044.start?'day':'night';
const F={sans:'"Space Grotesk",system-ui,sans-serif',mono:'"JetBrains Mono",monospace',credit:'"Michroma",sans-serif'};
export function font(g,size,w=500,fam='sans'){g.font=`${w} ${size}px ${F[fam]}`;}
export function text(g,s,x,y,size,col,w=500,fam='sans',align='left'){font(g,size,w,fam);g.fillStyle=col;g.textAlign=align;g.textBaseline='alphabetic';g.fillText(String(s),x,y);g.textAlign='left';}
export function fitText(g,s,x,y,maxW,size,col,w=500,fam='sans',align='left'){let z=size;font(g,z,w,fam);while(z>10&&g.measureText(s).width>maxW){z-=1;font(g,z,w,fam);}text(g,s,x,y,z,col,w,fam,align);return z;}
export function wrapLines(g,s,maxW,size,w=500,fam='sans'){font(g,size,w,fam);const words=String(s).split(' '),out=[];let cur='';for(const word of words){const n=cur?cur+' '+word:word;if(g.measureText(n).width>maxW&&cur){out.push(cur);cur=word;}else cur=n;}if(cur)out.push(cur);return out;}
export function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
export function panel(g,x,y,w,h,C,{fill=C.panel,stroke=C.line,r=18,lw=2,shadow=true}={}){if(shadow){g.fillStyle=C.shadow;rr(g,x+6,y+10,w,h,r);g.fill();}g.fillStyle=fill;rr(g,x,y,w,h,r);g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;rr(g,x,y,w,h,r);g.stroke();}}
export function cursor(g,x,y,C,s=1){g.save();g.translate(x,y);g.scale(s,s);g.beginPath();g.moveTo(0,0);g.lineTo(0,38);g.lineTo(10,29);g.lineTo(17,45);g.lineTo(24,42);g.lineTo(17,27);g.lineTo(30,27);g.closePath();g.fillStyle=C.ink;g.fill();g.strokeStyle=C.bg;g.lineWidth=3;g.stroke();g.restore();}
const typed=(s,t,t0,cps=34)=>t<t0?'':String(s).slice(0,Math.floor((t-t0)*cps));
const caret=t=>Math.floor(t*2.2)%2===0;

// ---- the sequencer: four rows, sixteen steps; ids are the same for the 3D model (row:step)
export function drawGrid(g,x,y,w,h,t,C,{pat=pattern(t),ghost=null,head=true,labels=true,emptyMark=false,highlight=null,label=24,cellPad=6}={}){
 const lw=labels?Math.min(170,w*.14):0,gw=w-lw,cw=gw/16,ch=h/4,ph=playhead(t);
 ROWS.forEach((r,ri)=>{
  const yy=y+ri*ch;if(labels)text(g,r,x,yy+ch*.62,label,ri===3?C.bass:C.dim,500,'mono');
  for(let s=0;s<16;s++){const xx=x+lw+s*cw,on=pat[r].includes(s),gh=ghost&&ghost[r]?.includes(s)&&!on;
   g.fillStyle=on?(r==='bass'?C.bass:C.kick):s%4===0?C.panel2:C.cell;rr(g,xx+cellPad/2,yy+cellPad/2,cw-cellPad,ch-cellPad,Math.min(10,cw*.18));g.fill();
   if(gh){g.strokeStyle=C.bass;g.setLineDash([6,6]);g.lineWidth=2;rr(g,xx+cellPad/2+2,yy+cellPad/2+2,cw-cellPad-4,ch-cellPad-4,8);g.stroke();g.setLineDash([]);}
   if(head&&s===ph){g.fillStyle=on?'rgba(255,255,255,.28)':'rgba(68,221,229,.16)';rr(g,xx+cellPad/2,yy+cellPad/2,cw-cellPad,ch-cellPad,8);g.fill();}
  }
  if(emptyMark&&r==='bass'&&!pat.bass.length){g.strokeStyle=C.output;g.lineWidth=3;g.setLineDash([12,9]);rr(g,x+lw-4,yy+2,gw+8,ch-4,12);g.stroke();g.setLineDash([]);}
  if(highlight===r){g.strokeStyle=C.input;g.lineWidth=3;rr(g,x+lw-4,yy+2,gw+8,ch-4,12);g.stroke();}
 });
}
export function slider(g,x,y,w,label,v,C,col,size=26,building=0){
 text(g,label,x,y-14,size,C.dim,500);g.fillStyle=C.cell;rr(g,x,y,w,10,5);g.fill();g.fillStyle=col;rr(g,x,y,w*v,10,5);g.fill();g.beginPath();g.arc(x+w*v,y+5,15,0,7);g.fillStyle=C.ink;g.fill();
 if(building){g.strokeStyle=col;g.setLineDash([8,8]);g.lineWidth=2;rr(g,x-14,y-50,w+28,80,12);g.globalAlpha=building;g.stroke();g.globalAlpha=1;g.setLineDash([]);}
}
export function promptBox(g,x,y,w,h,C,{value='',placeholder=TXT.ask,focus=false,t=0,size=34,send=true,sendDown=0}={}){
 panel(g,x,y,w,h,C,{fill:C.panel2,stroke:focus?C.input:C.line,lw:focus?3:2,r:16});
 const tw=w-(send?220:60),lines=value?wrapLines(g,value,tw,size):[];
 if(!value)text(g,placeholder,x+30,y+h/2+size*.35,size,C.dim,400);
 lines.slice(-2).forEach((l,i,a)=>text(g,l,x+30,y+h/2+size*.35+(i-(a.length-1)/2)*size*1.25,size,C.ink,500));
 if(focus&&caret(t)){font(g,size,500);const last=lines.at(-1)||'',cw=g.measureText(last).width;g.fillStyle=C.input;g.fillRect(x+32+cw,y+h/2-size*.55+(lines.length>1?size*.62:0),3,size*1.05);}
 if(send){const bx=x+w-180,by=y+(h-64)/2;g.fillStyle=sendDown?C.input:'transparent';rr(g,bx,by,150,64,14);g.fill();g.strokeStyle=C.input;g.lineWidth=3;rr(g,bx,by,150,64,14);g.stroke();text(g,TXT.send,bx+75,by+43,28,sendDown?C.bg:C.input,600,'sans','center');return{bx,by};}
 return null;
}
export function tabBar(g,x,y,w,h,t,C,{size=30}={}){
 const list=tabs(t),mo=tabMotion(t);let xx=x;const tw=Math.min(300,(w-20)/Math.max(4,list.length+(mo?.op==='close'?1:0)));
 const all=mo?.op==='close'?[...list.slice(0),{key:mo.key,name:TXT.tabs[mo.key],closing:1}]:list;
 for(const tab of all){let k=1;if(mo&&tab.key===mo.key)k=mo.op==='open'?ease(mo.u):1-ease(mo.u);const ww=tw*k;if(ww<4)continue;
  g.save();g.globalAlpha=clamp(k*1.4);panel(g,xx,y,ww-10,h,C,{fill:tab.key===list.at(-1)?.key?C.panel2:C.panel,r:12,shadow:false});g.beginPath();g.rect(xx,y,ww-14,h);g.clip();text(g,tab.name,xx+22,y+h*.64,size,C.ink,500);text(g,'×',xx+ww-44,y+h*.64,size,C.dim,400);g.restore();xx+=ww;}
 return{count:list.length};
}
export function card(g,x,y,w,h,C,title,sub,{col=C.ink,fill=C.panel,stroke=C.line,size=40,mono=false}={}){panel(g,x,y,w,h,C,{fill,stroke,r:16});fitText(g,title,x+28,y+h*.46,w-56,size,col,600,mono?'mono':'sans');if(sub)fitText(g,sub,x+28,y+h*.46+size*.95,w-56,size*.62,C.dim,400);}
export function note(g,x,y,w,h,title,sub,rot=-.03){g.save();g.translate(x+w/2,y+h/2);g.rotate(rot);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(-w/2+10,-h/2+14,w,h);g.fillStyle='#F3E7A8';g.fillRect(-w/2,-h/2,w,h);g.fillStyle='rgba(0,0,0,.06)';g.fillRect(-w/2,-h/2,w,34);
 fitText(g,title,-w/2+36,-h/2+h*.48,w-72,Math.min(76,h*.24),'#1B1A16',600);if(sub)fitText(g,sub,-w/2+38,-h/2+h*.48+56,w-76,32,'#5B5546',400);g.restore();}
function header(g,t,C,label=''){text(g,`${TXT.app} · ${version(t)}`,96,86,28,C.dim,500);if(label)text(g,label,1824,86,28,C.dim,500,'sans','right');}
export function usageStrip(g,x,y,w,t,C,{size=26}={}){const u=usage(t);g.fillStyle=C.cell;g.fillRect(x,y,w,6);g.fillStyle=C.output;g.fillRect(x,y,w*clamp(u.total/34000),6);text(g,`${TXT.usage} ${fmt(u.total)} ${TXT.tokens} · DEMO`,x,y-14,size,C.dim,500,'mono');}
// ---- the app as it looks on the laptop display (also the reference for every 2D view)
export function drawApp(g,W,H,t,{theme=themeAt(t),focus=false}={}){g.save();g.scale(W/1280,H/800);drawAppRaw(g,t,theme,{focus});g.restore();}
function drawAppRaw(g,t,theme,{focus=false}={}){
 const C=THEMES[theme];g.fillStyle=C.bg;g.fillRect(0,0,1280,800);
 tabBar(g,16,12,900,48,t,C,{size:20});text(g,`${version(t)}`,1250,46,22,C.dim,500,'mono','right');
 panel(g,16,76,770,520,C,{r:14,shadow:false});text(g,TXT.app,40,116,24,C.ink,600);drawGrid(g,40,140,722,300,t,C,{label:18,cellPad:4});
 let sx=150;if(hasLevelSlider(t)){slider(g,sx,500,220,'kick level',.62,C,C.kick,18);sx+=300;}if(hasBassSlider(t))slider(g,sx,500,220,'bass',Math.max(.15,bassSlider(t)),C,C.bass,18);
 if(exportState(t)!=='none'){const st=exportState(t),col=st==='ready'?C.pass:st==='failed'?C.output:C.dim;panel(g,560,540,206,44,C,{fill:C.panel2,r:10,shadow:false,stroke:col});text(g,`${TXT.exportBtn} ${st==='ready'?'✓':st==='failed'?'×':'…'}`,580,570,20,col,600);}
 panel(g,802,76,462,520,C,{r:14,shadow:false});text(g,'Agent',826,116,24,C.ink,600);
 const sent=JOBS.filter(j=>t>=j.sent);let yy=160;
 for(const j of sent.slice(-2)){const lines=wrapLines(g,TXT.jobs[j.id],400,19);g.fillStyle=C.input;g.fillRect(826,yy-18,4,lines.length*26);lines.forEach((l,i)=>text(g,l,842,yy+i*26,19,C.ink,500));yy+=lines.length*26+14;
  const rep=t>=j.done?TXT.replies[j.id]:[`${TXT.running} …`];rep.forEach((l,i)=>text(g,l,842,yy+i*26,19,C.output,500,'mono'));yy+=rep.length*26+22;}
 const typing=jobState('P06',t)==='typing';
 promptBox(g,802,612,462,92,C,{value:typing?typed(TXT.jobs.P06,t,JOB.P06.typed,9):'',focus:focus||typing,t,size:20,send:true});
 usageStrip(g,16,760,1248,t,C,{size:20});text(g,clockText(t),1264,740,20,C.dim,500,'mono','right');
}
// ---- full-frame 2D views of the screen shots
const W=1920,H=1080;
function bg(g,C){g.fillStyle=C.bg;g.fillRect(0,0,W,H);}
const V={
 S002(g,t,L,d,C){header(g,t,C);const k=ease(clamp((L-d*.12)/(d*.33))),done=t>=JOB.P01.typed;
  panel(g,1010,190,780,520,C);text(g,'v0.3',1050,262,40,C.ink,600,'mono');text(g,`✓ ${TXT.tested}`,1750,262,34,C.pass,600,'sans','right');drawGrid(g,1050,300,700,330,t,C,{label:22,cellPad:5});
  const bx=promptBox(g,130,820,1660,140,C,{value:done?typed(TXT.jobs.P01,t,JOB.P01.typed,40):'',focus:done,t,size:38});
  const nx=lerp(150,180,k),ny=lerp(220,820,k),nw=lerp(700,560,k),nh=lerp(440,140,k);if(!done)note(g,nx,ny,nw,nh,TXT.note,k<.6?TXT.noteSub:'',lerp(-.04,0,k));
  cursor(g,done?560:nx+nw*.55,done?900:ny+nh*.5,C,1.2);},
 S005(g,t,L,d,C){header(g,t,C);const z=ease(clamp((L-d*.45)/(d*.4)));g.save();g.translate(W/2,H/2);g.scale(1+z*.55,1+z*.55);g.translate(-W/2-z*330,-H/2+z*140);
  panel(g,140,150,1640,640,C);text(g,TXT.app,190,220,38,C.ink,600);drawGrid(g,190,250,1540,380,t,C,{label:30});
  slider(g,360,720,360,'kick level',.62,C,C.kick,26,1-clamp((L-1)/2)*.4);g.restore();
  ['v0.1','v0.2','v0.3'].forEach((v,i)=>{panel(g,240+i*500,850,440,150,C,{fill:C.panel2});text(g,v,270+i*500,915,34,C.ink,600,'mono');text(g,[TXT.before,'…',TXT.after][i],270+i*500,962,26,C.dim,400);drawGrid(g,420+i*500,880,230,96,t,C,{labels:false,head:false,cellPad:2});});},
 S008(g,t,L,d,C){header(g,t,C);const k=ease(clamp((L-.4)/1.4));
  panel(g,130,190,1050,620,C);drawGrid(g,170,240,970,420,t,C,{label:28});slider(g,300,740,330,'kick level',.62,C,C.kick,24);
  card(g,lerp(1240,1480,k),lerp(300,690,k),lerp(500,300,k),lerp(170,110,k),C,TXT.call,'',{col:C.dim,size:lerp(44,30,k)});
  g.globalAlpha=k;card(g,lerp(1980,1240,k),300,560,300,C,TXT.newIdea,TXT.bassSlider,{col:C.output,stroke:C.output,size:52});g.globalAlpha=1;},
 S009(g,t,L,d,C){header(g,t,C);const z=ease(clamp(L/1.2));g.save();g.translate(W/2,H*.62);g.scale(1+z*.12,1+z*.12);g.translate(-W/2,-H*.62);
  panel(g,130,170,1660,700,C);drawGrid(g,170,220,1580,440,t,C,{label:32,ghost:{bass:BASS}});
  slider(g,300,760,360,'kick level',.62,C,C.kick,26);slider(g,820,760,520,TXT.bassSlider,Math.max(.05,bassSlider(t)),C,C.bass,26);g.restore();
  text(g,TXT.secondLane,96,1010,36,C.output,600);},
 S011(g,t,L,d,C){header(g,t,C);const spin=clamp((t-RELOAD1+.6)/.6);
  panel(g,130,150,420,90,C,{fill:C.panel2,stroke:spin>0&&spin<1?C.input:C.line});text(g,`${spin>0&&spin<1?'↻':'⟳'} ${TXT.reload}`,170,210,40,C.ink,600);
  text(g,t>=RELOAD1?`${TXT.saved}: kick · snare · hats · bass`:`${TXT.saved} …`,620,210,30,C.dim,500,'mono');
  panel(g,130,290,1660,520,C);drawGrid(g,170,330,1580,440,t,C,{label:32,emptyMark:t>=RELOAD1});
  if(t>=RELOAD1){text(g,TXT.bassEmpty,1750,880,44,C.output,600,'sans','right');ROWS.slice(0,3).forEach((r,i)=>text(g,`${r} ✓ ${TXT.kept}`,170+i*330,880,28,C.dim,500,'mono'));}
  text(g,'BASS PREVIEW',170,990,26,C.dim,600,'mono');g.fillStyle=C.cell;g.fillRect(420,972,640,18);const n=pattern(t).bass.length;g.fillStyle=C.bass;g.fillRect(420,972,640*n/4,18);text(g,`${n}/4`,1090,990,26,C.dim,500,'mono');},
 S012(g,t,L,d,C){header(g,t,C,'load()');const fix=t>=FIX_LINE,k=ease(clamp((t-FIX_LINE)/.8));
  panel(g,96,190,600,270,C);text(g,'saved.tracks.bass',130,260,34,C.dim,500,'mono');text(g,'[ 2, 6, 10, 14 ]',130,350,52,C.bass,600,'mono');text(g,`localStorage · ${TXT.kept}`,130,420,26,C.dim,400);
  panel(g,760,170,1064,400,C);const code=['tracks.kick  = saved.tracks.kick;','tracks.snare = saved.tracks.snare;','tracks.hats  = saved.tracks.hats;'];
  code.forEach((c,i)=>text(g,'  '+c,790,250+i*70,34,C.ink,500,'mono'));
  if(fix){g.globalAlpha=k;g.fillStyle='rgba(209,248,93,.13)';g.fillRect(776,250+3*70-48,1032,66);text(g,'+ tracks.bass  = saved.tracks.bass;',790,250+3*70,34,C.pass,600,'mono');g.globalAlpha=1;}
  else{g.strokeStyle=C.output;g.setLineDash([10,8]);g.lineWidth=2;g.strokeRect(780,250+3*70-46,1020,62);g.setLineDash([]);}
  panel(g,96,650,1728,300,C);drawGrid(g,140,690,1640,220,t,C,{label:30,emptyMark:!fix,pat:fix&&k>.6?{...pattern(t),bass:BASS.slice()}:pattern(t),head:false});
  if(fix){g.strokeStyle=C.pass;g.lineWidth=4;g.globalAlpha=k;g.beginPath();g.moveTo(400,460);g.bezierCurveTo(400,600,700,620,760,880);g.stroke();g.globalAlpha=1;}},
 S016(g,t,L,d,C){header(g,t,C,'P03');const out=clamp((t-JOB.P03.sent)/1.4);
  text(g,TXT.inLbl,140,220,40,C.input,700,'mono');text(g,TXT.outLbl,1000,220,40,C.output,700,'mono');g.fillStyle=C.line;g.fillRect(940,180,2,780);
  const px=lerp(140,-760,ease(out));card(g,px,280,760,240,C,'P03',TXT.jobs.P03,{col:C.input,stroke:C.input,size:44});
  text(g,`${fmt(JOB.P03.input)} ${TXT.tokens}`,140,620,48,C.input,600,'mono');
  const rows=[[TXT.reply,TXT.replies.P03[0]],[TXT.change,'compare-view.js'],[TXT.test,'v0.5 ↔ v0.6 ✓']];
  rows.forEach(([a,b],i)=>{const s=JOB.P03.sent+1+i*1.1;if(t<s)return;g.globalAlpha=clamp((t-s)/.35);card(g,1000,280+i*190,780,160,C,a,b,{col:i===2?C.pass:C.output,size:38});g.globalAlpha=1;});
  text(g,t>=JOB.P03.sent+3.4?`${fmt(JOB.P03.output)} ${TXT.tokens}`:`${TXT.running} …`,1000,900,48,C.output,600,'mono');if(t>JOB.P03.sent+3.2)text(g,'?',1760,960,64,C.dim,600);},
 S019(g,t,L,d,C){const s=.82;g.save();g.translate(W*(1-s)/2,H*(1-s)/2-30);g.scale(s,s);drawAppFrame(g,t,C);g.restore();const k=smooth(0,d*.8,L);g.fillStyle=C.output;g.fillRect(0,H-26,W*k,10);cursor(g,980,560,C,caret(t+.2)?1.1:0);},
 S021(g,t,L,d,C){const k=ease(clamp((L-.5)/.5));g.globalAlpha=.16;drawTitleText(g,W/2,330,190,C.ink,C.output);g.globalAlpha=1;
  card(g,lerp(1600,1270,k),720,500,170,C,TXT.call,'',{col:C.dim});const kk=ease(clamp((L-.9)/.3));
  promptBox(g,180,600,1560,150,C,{value:'',placeholder:TXT.ask,focus:true,t,size:40,send:false});g.globalAlpha=kk;card(g,lerp(1900,1240,kk),700,560,200,C,'+1',TXT.oneMoreSub,{col:C.input,stroke:C.input,size:54});g.globalAlpha=1;},
 S023(g,t,L,d,C){header(g,t,C);['v0.5','v0.6'].forEach((v,i)=>{const x=100+i*880;panel(g,x,180,840,700,C,{stroke:i?C.input:C.line});text(g,v,x+40,250,44,C.ink,600,'mono');if(i&&t>=JOB.P03.done)text(g,`✓ ${TXT.test}`,x+800,250,32,C.pass,600,'sans','right');
   drawGrid(g,x+40,290,760,330,t,C,{label:24,cellPad:5,pat:{kick:KICK,snare:[],hats:[],bass:BASS}});slider(g,x+140,700,240,'kick level',.62,C,C.kick,22);slider(g,x+470,700,240,'bass',.72,C,C.bass,22);if(i)slider(g,x+140,820,240,'swing',.35,C,C.input,22);});
  text(g,`${TXT.before} · ${TXT.after}`,960,1010,30,C.dim,500,'sans','center');},
 S024(g,t,L,d,C){header(g,t,C);tabBar(g,100,250,1720,110,t,C,{size:40});const n=tabs(t).length;text(g,`${n} Tabs`,960,600,140,C.ink,600,'sans','center');
  const m=tabMotion(t);if(m)text(g,m.op==='open'?'+1':'−1',960,720,64,m.op==='open'?C.input:C.output,700,'mono','center');usageStrip(g,100,980,1720,t,C,{size:34});},
 S027(g,t,L,d,C){header(g,t,C);const vs=[['v0.4','kick level'],['v0.5','bass · reload ✓'],['v0.6','compare']],k=ease(clamp((L-.8)/(Math.min(d,5)*.6)));
  vs.forEach(([v,s],i)=>{const x=110+i*440;panel(g,x,300,400,460,C);text(g,v,x+30,370,44,C.ink,600,'mono');text(g,s,x+30,420,28,C.dim,500);drawGrid(g,x+30,470,340,220,t,C,{labels:false,head:false,cellPad:3,pat:{kick:KICK,snare:[],hats:[],bass:i?BASS:[]}});});
  g.strokeStyle=C.input;g.setLineDash([14,10]);g.lineWidth=3;rr(g,1430,300,400,460,18);g.stroke();g.setLineDash([]);text(g,TXT.freeSlot,1630,550,40,C.input,600,'sans','center');cursor(g,lerp(700,1600,k),lerp(880,520,k),C,1.2);},
 S030(g,t,L,d,C){header(g,t,C,TXT.exportBtn);const st=exportState(t);
  text(g,st==='failed'?TXT.exportFail:TXT.exportNot,96,210,64,st==='failed'?C.output:C.warn,700);
  panel(g,96,280,820,540,C);text(g,TXT.inputLanes,130,340,34,C.ink,600);drawGrid(g,130,380,750,400,t,C,{label:26,head:false,pat:{kick:KICK,snare:[],hats:[],bass:BASS}});
  panel(g,1000,280,820,540,C,{stroke:C.output});text(g,TXT.exportLanes(3),1034,340,34,C.ink,600);drawGrid(g,1034,380,750,300,t,C,{label:26,head:false,pat:{kick:KICK,snare:[],hats:[],bass:[]}});
  ROWS.slice(0,3).forEach((r,i)=>{});g.fillStyle=C.bg;g.fillRect(1034,680,750,100);g.strokeStyle=C.output;g.setLineDash([12,9]);g.lineWidth=3;rr(g,1030,684,758,92,12);g.stroke();g.setLineDash([]);text(g,'bass ?',1060,742,30,C.output,600,'mono');
  if(t>=EXPORT.cause){g.globalAlpha=clamp((t-EXPORT.cause)/.4);text(g,TXT.cause,96,930,44,C.ink,600);g.globalAlpha=1;}},
 S031(g,t,L,d,C){header(g,t,C,TXT.exportBtn);const fixed=t>=EXPORT.fix,k=clamp((t-EXPORT.compare)/1.2),ready=t>=EXPORT.ready;
  panel(g,96,160,1728,110,C,{fill:C.panel2});text(g,'exportTracks()',130,230,36,C.ink,600,'mono');if(fixed)text(g,"+ tracks.bass",620,230,36,C.pass,600,'mono');text(g,'P04',1790,230,32,C.input,600,'mono','right');
  panel(g,96,310,820,470,C);text(g,TXT.inputLanes,130,370,32,C.ink,600);drawGrid(g,130,400,750,340,t,C,{label:24,head:false,pat:{kick:KICK,snare:[],hats:[],bass:BASS}});
  panel(g,1000,310,820,470,C,{stroke:ready?C.pass:C.line});text(g,TXT.exportLanes(exportLanes(t)),1034,370,32,C.ink,600);drawGrid(g,1034,400,750,340,t,C,{label:24,head:false,pat:{kick:KICK,snare:[],hats:[],bass:fixed?BASS:[]}});
  const cells=Math.floor(64*k);for(let i=0;i<64;i++){g.fillStyle=i<cells?C.pass:C.cell;g.fillRect(96+i*27,830,22,22);}text(g,`${cells}/64 · ${TXT.steps}`,96,910,32,cells===64?C.pass:C.dim,600,'mono');
  if(ready){text(g,`✓ ${TXT.ready}`,1824,910,40,C.pass,700,'sans','right');}},
 S032(g,t,L,d,C){drawLedger(g,t,C,{highlight:'P04',sub:TXT.oneMoreSub});},
 S034(g,t,L,d,C){header(g,t,C);const s=.74;g.save();g.translate(80,140);g.scale(s,s);drawAppFrame(g,t,C);g.restore();
  panel(g,1440,160,380,120,C,{stroke:C.pass});text(g,TXT.savedOk,1480,236,40,C.pass,600);
  card(g,1440,330,380,130,C,'export.json','4 × 16 · v0.7',{col:C.ink,size:36,mono:true});
  panel(g,1440,520,380,110,C,{fill:C.panel2});text(g,TXT.close,1630,590,38,C.ink,600,'sans','center');
  const hold=L<d*.62;cursor(g,hold?1610:lerp(1610,700,ease(clamp((L-d*.62)/.5))),hold?600:lerp(600,950,ease(clamp((L-d*.62)/.5))),C,1.2);
  promptBox(g,80,880,1300,150,C,{value:typed(TXT.jobs.P05,t,S034start(),28),focus:!hold,t,size:34,send:true});},
 S037(g,t,L,d,C){drawLedger(g,t,C,{highlight:'P05',title:TXT.oneMore,titleK:clamp(L/.25)*(1-smooth(d-.5,d-.2,L))});},
 S039(g,t,L,d,C){header(g,t,C);['v0.7','v0.8'].forEach((v,i)=>{const x=100+i*880;panel(g,x,180,840,700,C,{stroke:i?C.pass:C.line});text(g,v,x+40,250,44,C.ink,600,'mono');
   drawGrid(g,x+40,290,760,300,t,C,{label:24,cellPad:5,pat:{kick:KICK,snare:[],hats:[],bass:BASS}});slider(g,x+140,670,240,'kick level',.62,C,C.kick,22);slider(g,x+470,670,240,'bass',.72,C,C.bass,22);slider(g,x+140,790,240,'swing',.35,C,C.input,22);
   text(g,`${TXT.exportBtn} ✓`,x+470,800,30,C.pass,600);if(i)text(g,`${TXT.settings} ✓ ${settingsSaved(t)?TXT.kept:'…'}`,x+470,850,30,settingsSaved(t)?C.pass:C.dim,600);});
  if(settingsSaved(t))text(g,`✓ ${TXT.compare}: ${TXT.equal} · ${TXT.result}`,960,1000,36,C.pass,600,'sans','center');},
 S044(g,t,L,d,C){header(g,t,C,'P05');[[100,180],[100,560],[1380,180]].forEach(([x,y],i)=>{g.globalAlpha=.45;panel(g,x,y,440,320,C);drawGrid(g,x+30,y+40,380,200,t,C,{labels:false,head:false,cellPad:3});g.globalAlpha=1;});
  panel(g,620,220,700,640,C,{stroke:C.output});text(g,TXT.reply,660,290,40,C.output,700);
  const lines=[`${TXT.change}:`,TXT.replies.P05[0],`${TXT.test}:`,TXT.replies.P05[1],'PASS'];let y=360;const row=Math.min(lines.length-1,Math.floor(L/Math.max(.8,d/6)));
  lines.forEach((l,i)=>{const ls=wrapLines(g,l,620,34);ls.forEach((x,j)=>text(g,x,660,y+j*46,34,i===4?C.pass:i%2?C.ink:C.dim,i%2?500:600,i===1||i===3?'mono':'sans'));if(i===row){g.fillStyle=C.output;g.fillRect(640,y-30,6,36+(ls.length-1)*46);}y+=ls.length*46+(i%2?24:6);});},
 S048(g,t,L,d,C){const k=ease(clamp(L/.6));g.globalAlpha=.16;drawTitleText(g,W/2,320,190,C.ink,C.output);g.globalAlpha=1;
  doneJobs(t).forEach((j,i)=>card(g,110,560+i*82-k*20,520,70,C,`${j.id} ✓`,'',{col:C.dim,size:28,mono:true}));promptBox(g,lerp(1100,700,k),640,1120,150,C,{value:'',focus:true,t,size:40,send:false});},
 S051(g,t,L,d,C){header(g,t,C);tabBar(g,100,330,1720,110,t,C,{size:40});const n=tabs(t).length;text(g,`${n} Tabs`,960,680,120,C.ink,600,'sans','center');usageStrip(g,100,980,1720,t,C,{size:34});},
 S054(g,t,L,d,C){g.globalAlpha=.35;const s=.8;g.save();g.translate(W*(1-s)/2,40);g.scale(s,s);drawAppFrame(g,t,C);g.restore();g.globalAlpha=1;g.fillStyle=C.bg;g.globalAlpha=.55;g.fillRect(0,0,W,H);g.globalAlpha=1;
  const v=typed(TXT.jobs.P06,t,JOB.P06.typed,9),done=v.length>=TXT.jobs.P06.length;const b=promptBox(g,160,430,1600,220,C,{value:v,focus:true,t,size:72,send:true});
  if(done){const k=ease(clamp((L-(d-1.6))/1.2));cursor(g,lerp(1000,b.bx+90,k),lerp(820,b.by+40,k),C,1.4);}},
 S055(g,t,L,d,C){const k=clamp(L/.12),s=L<.55?lerp(.7,1,ease(k)):lerp(1,.18,ease(clamp((L-.55)/.5)));g.globalAlpha=.35;drawAppFrame(g,t,C,.82);g.globalAlpha=1;g.fillStyle=C.bg;g.globalAlpha=.4;g.fillRect(0,0,W,H);g.globalAlpha=1;
  const x=lerp(960,1610,ease(clamp((L-.55)/.5))),y=lerp(560,600,ease(clamp((L-.55)/.5)));g.save();g.translate(x,y);g.scale(s,s);text(g,'SEND',0,90,300,C.input,700,'sans','center');g.restore();},
};
function S034start(){return SHOT.S034.start+.4;}
export const VIEWS=Object.keys(V);
export function drawView(id,g,t,{theme=themeAt(t)}={}){const C=THEMES[theme],s=SHOT[id];bg(g,C);V[id](g,t,t-s.start,s.end-s.start,C);}
// the app inside a frame, for 2D compositions
export function drawAppFrame(g,t,C,s=1){const theme=C===THEMES.day?'day':'night';g.save();if(s!==1){g.translate(W*(1-s)/2,H*(1-s)/2);g.scale(s,s);}
 panel(g,40,40,1840,1000,C,{fill:C.panel2,r:24});g.beginPath();rr(g,60,60,1800,960,18);g.clip();g.translate(60,60);g.scale(1800/1280,960/800);drawAppRaw(g,t,theme);g.restore();}
// ---- the usage journal (S032, S037): one row per request, input and output separate, running total
export function drawLedger(g,t,C,{highlight=null,title=null,titleK=0,sub=null}={}){
 const u=usage(t),cols=TXT.cols,X=[110,440,720,1000,1280,1580];text(g,TXT.ledger,110,150,56,C.ink,700);text(g,TXT.demo,1810,150,28,C.output,600,'mono','right');
 if(title){g.globalAlpha=titleK;text(g,title,960,300,120,C.input,700,'sans','center');g.globalAlpha=1;}
 const y0=title?400:250;cols.forEach((c,i)=>text(g,c,X[i]+(i?200:0),y0,28,C.dim,600,i?'mono':'sans',i?'right':'left'));g.fillStyle=C.line;g.fillRect(100,y0+20,1720,2);
 const rows=u.rows,start=Math.max(0,rows.length-(title?4:5));
 rows.slice(start).forEach((r,i)=>{const y=y0+90+i*96,hi=r.id===highlight,age=rows.length-start-1-i;let k=1;if(hi){const s=JOB[r.id].sent;k=ease(clamp((t-Math.max(s,SHOT[title?'S037':'S032'].start+.3))/.5));}
  g.save();g.globalAlpha=(hi?1:Math.max(.42,1-age*.18))*k;g.translate((1-k)*-120,0);if(hi){g.fillStyle=C.panel2;rr(g,96,y-60,1728,86,12);g.fill();g.strokeStyle=C.input;g.lineWidth=2;rr(g,96,y-60,1728,86,12);g.stroke();}
  const credits=(r.input/1000+2*r.output/1000).toFixed(2);
  text(g,r.id,X[0],y,40,C.ink,600,'mono');text(g,fmt(r.input),X[1]+200,y,40,C.input,500,'mono','right');text(g,r.running?TXT.running:fmt(r.output),X[2]+200,y,40,r.running?C.dim:C.output,500,'mono','right');
  text(g,fmt(r.total),X[3]+200,y,40,C.ink,600,'mono','right');text(g,r.running?'–':clockText(r.doneAt),X[4]+200,y,40,C.dim,500,'mono','right');text(g,r.running?'–':credits.replace('.',LANG==='de'?',':'.'),X[5]+200,y,40,C.dim,500,'mono','right');g.restore();});
 const yb=y0+90+Math.min(rows.length,title?4:5)*96+30;g.fillStyle=C.line;g.fillRect(100,yb-50,1720,2);
 text(g,'Σ',X[0],yb,44,C.ink,700,'mono');text(g,fmt(u.input),X[1]+200,yb,44,C.input,600,'mono','right');text(g,fmt(u.output),X[2]+200,yb,44,C.output,600,'mono','right');text(g,fmt(u.total),X[3]+200,yb,44,C.ink,700,'mono','right');text(g,clockText(t),X[4]+200,yb,40,C.dim,500,'mono','right');text(g,u.credits.toFixed(2).replace('.',LANG==='de'?',':'.'),X[5]+200,yb,44,C.ink,600,'mono','right');
 if(sub)text(g,sub,110,1010,36,C.input,600);
 g.fillStyle=C.output;g.fillRect(0,1060,1920*clamp(u.total/34000),8);
}
// ---- the title: two lines, TOKEN and BURN, one shared block (also used inside the 3D type)
export function drawTitleText(g,cx,cy,size,inkTop,inkBottom){font(g,size,700);g.textAlign='center';g.textBaseline='alphabetic';g.fillStyle=inkTop;g.fillText('TOKEN',cx,cy-size*.06);g.fillStyle=inkBottom;g.fillText('BURN',cx,cy+size*.88);g.textAlign='left';}
// project panels: one surface of the app, drawn into a 1024 × 640 canvas (3D project views)
export function drawPanel(kind,g,w,h,t,forceTheme=null){const theme=forceTheme||themeAt(t),C=THEMES[theme];g.fillStyle=C.bg;g.fillRect(0,0,w,h);g.save();g.scale(w/1024,h/640);
 panel(g,8,8,1008,624,C,{r:22,shadow:false,stroke:C.line,lw:3});const [type,arg]=kind.split(':');
 if(type==='job'){const j=JOB[arg];text(g,arg,48,96,52,C.input,700,'mono');wrapLines(g,TXT.jobs[arg],920,46).forEach((l,i)=>text(g,l,48,190+i*62,46,C.ink,500));text(g,`${TXT.inLbl} ${fmt(j.input)}`,48,580,40,C.input,600,'mono');if(t>=j.done)text(g,`${TXT.outLbl} ${fmt(j.output)}`,976,580,40,C.output,600,'mono','right');}
 else if(type==='reply'){text(g,TXT.reply,48,96,48,C.output,700);(t>=JOB[arg].done?TXT.replies[arg]:[`${TXT.running} …`]).forEach((l,i)=>wrapLines(g,l,920,40).forEach((x,j)=>text(g,x,48,200+i*120+j*52,40,C.ink,500,'mono')));}
 else if(type==='grid'){text(g,`${TXT.preview} · ${version(t)}`,48,90,44,C.ink,600);drawGrid(g,48,130,928,400,t,C,{label:30,emptyMark:arg==='bug'});if(arg==='pass'&&t>=PASS2)text(g,'PASS',976,600,56,C.pass,700,'sans','right');}
 else if(type==='version'){const v=arg,n=+v.slice(3);text(g,v,48,100,64,C.ink,700,'mono');text(g,{4:'kick level',5:'bass · reload ✓',6:'compare',7:'export ✓',8:TXT.settings+' ✓'}[n]||'',48,160,36,C.dim,500);drawGrid(g,48,210,928,330,t,C,{labels:false,head:false,pat:{kick:KICK,snare:[],hats:[],bass:n>=5?BASS:[]}});}
 else if(type==='export'){text(g,TXT.exportBtn,48,96,52,C.ink,700);text(g,`export.json · ${version(t)}`,48,160,36,exportState(t)==='ready'?C.pass:C.dim,500,'mono');drawGrid(g,48,210,928,330,t,C,{labels:true,head:false,label:28,pat:{kick:KICK,snare:[],hats:[],bass:exportLanes(t)===4?BASS:[]}});}
 else if(type==='settings'){text(g,TXT.settings,48,96,52,C.ink,700);text(g,version(t),976,96,44,C.dim,600,'mono','right');[['kick level',.62,C.kick],['bass',.72,C.bass],['swing',.35,C.input],['tempo 136',.55,C.ink]].forEach(([l,v,c],i)=>slider(g,60+(i%2)*470,260+Math.floor(i/2)*190,400,l,v,C,c,32));}
 else if(type==='tab'){text(g,TXT.tabs[arg]||arg,48,96,52,C.ink,700);drawGrid(g,48,150,928,380,t,C,{labels:false,head:false});}
 else if(type==='title'){drawTitleText(g,512,300,200,C.ink,C.output);}
 else if(type==='overview'){text(g,TXT.versions,48,90,44,C.ink,600);['v0.4','v0.5','v0.6','v0.7','v0.8'].forEach((v,i)=>{const x=40+i*196;panel(g,x,130,180,440,C,{fill:C.panel2,r:12,shadow:false,stroke:v===version(t)?C.pass:C.line});text(g,v,x+16,180,30,C.ink,600,'mono');
   drawGrid(g,x+14,210,152,120,t,C,{labels:false,head:false,cellPad:2,pat:{kick:KICK,snare:[],hats:[],bass:i>=1?BASS:[]}});text(g,['level','bass','compare','export','settings'][i],x+16,380,24,C.dim,500);});}
 else if(type==='empty'){text(g,TXT.reply,48,96,48,C.output,700);g.fillStyle=C.cell;for(let i=0;i<4;i++)g.fillRect(48,170+i*90,[700,820,560,300][i],26);}
 g.restore();}
