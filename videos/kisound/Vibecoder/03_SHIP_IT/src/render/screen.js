// The readable 2D layer: file list, terminal, name comparison, upload, browser, lyrics, link and player. Full-frame
// views (1920 × 1080 logical pixels) for the 2D shots; the same primitives draw the laptop display and the panels of
// the 3D shots, so both dimensions show the same state at the same time.
import {SHOT,LANG,DURATION} from './config.js';
import {clamp,smooth,ease,lerp} from './timeline.js';
import {TXT,TRACKS,coverName,BAD_TRACK,EXPECTED,ON_DISK,UNDERSCORE_AT,MISSING_PATH,MV_CMD,COMMIT_HASH,URL_HOME,URL_TRACK,STATIONS,UPLOAD,
 TRACKS_READY,UNDERSCORE_FLASH,TYPE_MV,ENTER_MV,PATH_FIXED,CHECK_FAIL,CHECK_PASS,COMMIT,ENTER_DEPLOY,UPLOAD_START,UPLOAD_DONE,RELOAD1,HARD_RELOAD,NEW_PAGE,
 DE_OK,SWITCH_EN,EN_OK,LYRIC_SAME,LIVE_VERIFIED,LINK_COPIED,PLAY,NEXT_NOTE,station,packet,terminal,upload,uploaded,browser,fileOnDisk,nextCommit,af,at} from './model.js';
export const C={bg:'#10141C',bg2:'#0B0E14',panel:'#161C27',panel2:'#1C2431',line:'#2E3949',ink:'#F4F3EA',dim:'#8E98A9',faint:'#566173',
 orange:'#FF6534',red:'#F04D4D',pass:'#D1F85D',cyan:'#44DDE5',amber:'#FFB347',shadow:'rgba(0,0,0,.4)'};
const F={sans:'"Space Grotesk",system-ui,sans-serif',mono:'"JetBrains Mono",monospace',credit:'"Michroma",sans-serif'};
export function font(g,size,w=500,fam='sans'){g.font=`${w} ${size}px ${F[fam]}`;}
export function text(g,s,x,y,size,col,w=500,fam='sans',align='left'){font(g,size,w,fam);g.fillStyle=col;g.textAlign=align;g.textBaseline='alphabetic';g.fillText(String(s),x,y);g.textAlign='left';}
export function fitText(g,s,x,y,maxW,size,col,w=500,fam='sans',align='left'){let z=size;font(g,z,w,fam);while(z>10&&g.measureText(s).width>maxW){z-=1;font(g,z,w,fam);}text(g,s,x,y,z,col,w,fam,align);return z;}
export function rr(g,x,y,w,h,r){g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath();}
export function panel(g,x,y,w,h,{fill=C.panel,stroke=C.line,r=18,lw=2,shadow=true,dash=null}={}){if(shadow){g.fillStyle=C.shadow;rr(g,x+6,y+12,w,h,r);g.fill();}if(fill){g.fillStyle=fill;rr(g,x,y,w,h,r);g.fill();}if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;if(dash)g.setLineDash(dash);rr(g,x,y,w,h,r);g.stroke();g.setLineDash([]);}}
export function cursor(g,x,y,s=1){g.save();g.translate(x,y);g.scale(s,s);g.beginPath();g.moveTo(0,0);g.lineTo(0,38);g.lineTo(10,29);g.lineTo(17,45);g.lineTo(24,42);g.lineTo(17,27);g.lineTo(30,27);g.closePath();g.fillStyle=C.ink;g.fill();g.strokeStyle=C.bg;g.lineWidth=3;g.stroke();g.restore();}
const caret=t=>Math.floor(t*2.4)%2===0;
export const STATE_COL={off:C.faint,run:C.orange,pass:C.pass,fail:C.red,preview:C.orange,wait:C.dim};
function chip(g,x,y,label,col,{size=26,fill=null,w=null,h=null,filled=false}={}){font(g,size,600);const tw=g.measureText(label).width,W=w??tw+size*1.3,H=h??size*1.7;g.fillStyle=filled?col:(fill||'rgba(0,0,0,0)');rr(g,x,y,W,H,H/2);g.fill();g.strokeStyle=col;g.lineWidth=2.5;rr(g,x,y,W,H,H/2);g.stroke();text(g,label,x+W/2,y+H/2+size*.36,size,filled?C.bg:col,600,'sans','center');return W;}
// the measured level of the recording for the player waveform (set once from the analysis)
let WAVE=null;
export function setAnalysis(tl){const rows=tl.rows,n=160;WAVE=Array.from({length:n},(_,i)=>{const r=rows[Math.min(rows.length-1,Math.floor(i/n*rows.length))];return clamp((r[1]+42)/34);});}

// ---- a track cover in the album style: dark square, two-line title, first line warm white, second orange
export function drawCover(g,x,y,s,track,{dim=0,credit=true}={}){
 const[,,a,b]=track;g.save();g.beginPath();g.rect(x,y,s,s);g.clip();
 const gr=g.createLinearGradient(x,y,x,y+s);gr.addColorStop(0,'#141A24');gr.addColorStop(.62,'#10141C');gr.addColorStop(1,'#2A1A12');g.fillStyle=gr;g.fillRect(x,y,s,s);
 g.fillStyle='rgba(255,101,52,.16)';g.beginPath();g.ellipse(x+s*.5,y+s*.98,s*.6,s*.16,0,0,7);g.fill();
 g.strokeStyle='rgba(255,101,52,.85)';g.lineWidth=Math.max(1,s*.012);g.beginPath();g.moveTo(x+s*.1,y+s*.86);g.lineTo(x+s*.42,y+s*.8);g.lineTo(x+s*.9,y+s*.83);g.stroke();
 for(const k of[.2,.42,.64]){g.fillStyle='#FF6534';g.beginPath();g.arc(x+s*(.1+k*1.1),y+s*(.86-k*.06+.02),s*.016,0,7);g.fill();}
 let z=s*.27;font(g,z,700);while(z>6&&Math.max(g.measureText(a).width,g.measureText(b).width)>s*.86){z-=1;font(g,z,700);}
 text(g,a,x+s/2,y+s*.12+z*.9,z,'#F4F3EA',700,'sans','center');text(g,b,x+s/2,y+s*.12+z*1.82,z,'#FF6534',700,'sans','center');
 if(credit&&s>=120){text(g,'SAMUEL HEINRICH',x+s/2,y+s*.95,Math.max(6,s*.035),'#F4F3EA',400,'credit','center');}
 if(dim){g.fillStyle=`rgba(16,20,28,${dim})`;g.fillRect(x,y,s,s);}
 g.restore();
}
// ---- the release rail as a strip of five stations (bottom of the screen views, also on the laptop)
export function drawRail(g,x,y,w,t,{size=24,packetDot=true}={}){
 const n=STATIONS.length,step=w/(n-1);g.strokeStyle=C.line;g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x+w,y);g.stroke();
 const p=packet(t);g.strokeStyle=C.orange;g.lineWidth=3;g.beginPath();g.moveTo(x,y);g.lineTo(x+step*clamp(p,0,n-1),y);g.stroke();
 STATIONS.forEach((name,i)=>{const st=station(i,t),col=STATE_COL[st],cx=x+i*step;g.fillStyle=C.bg;g.beginPath();g.arc(cx,y,size*.62,0,7);g.fill();g.strokeStyle=col;g.lineWidth=3;if(st==='preview')g.setLineDash([5,5]);g.stroke();g.setLineDash([]);
  if(st==='pass'||st==='fail'||st==='run'){g.fillStyle=col;g.globalAlpha=st==='run'?.55+.45*Math.abs(Math.sin(t*6)):1;g.beginPath();g.arc(cx,y,size*.36,0,7);g.fill();g.globalAlpha=1;}
  text(g,name,cx,y+size*1.9,size*.8,st==='off'?C.faint:C.ink,600,'sans','center');const lbl=TXT.status[st];if(st!=='off')text(g,lbl,cx,y+size*2.9,size*.66,col,600,'sans','center');});
 if(packetDot){const px=x+step*clamp(p,0,n-1);g.fillStyle=C.orange;g.save();g.translate(px,y-size*1.15);g.rotate(Math.PI/4);g.fillRect(-size*.26,-size*.26,size*.52,size*.52);g.restore();}
}
// ---- terminal: last lines, commands typed, decisive status lines as badges
export function drawTerminal(g,x,y,w,h,t,{size=34,lines=8,title=true,next=false}={}){
 panel(g,x,y,w,h,{fill:'#0D1118',r:16});
 if(title){g.fillStyle=C.panel2;rr(g,x,y,w,size*1.6,16);g.fill();g.fillRect(x,y+size,w,size*.6);[0,1,2].forEach(i=>{g.fillStyle=['#3a4352','#3a4352','#3a4352'][i];g.beginPath();g.arc(x+size*.9+i*size*.8,y+size*.8,size*.22,0,7);g.fill();});
  text(g,'kisound-web — zsh',x+w/2,y+size*1.05,size*.6,C.dim,500,'mono','center');}
 const L=terminal(t);if(next){const c=nextCommit(t);if(c!==null)L.push({kind:'cmd',text:c,cursor:true});}
 const lh=size*1.5,top=y+(title?size*1.6:0)+size*1.4,show=L.slice(-lines);
 show.forEach((l,i)=>{const yy=top+i*lh;const fade=1;
  if(l.kind==='cmd'){font(g,size,500,'mono');text(g,TXT.prompt,x+size*.9,yy,size,C.faint,500,'mono');const px=x+size*.9+g.measureText(TXT.prompt+' ').width;text(g,l.text,px,yy,size,C.ink,500,'mono');if(l.cursor&&caret(t)){font(g,size,500,'mono');g.fillStyle=C.cyan;g.fillRect(px+g.measureText(l.text).width+4,yy-size*.8,size*.55,size);}}
  else if(l.kind==='pass'||l.kind==='fail'){const col=l.kind==='pass'?C.pass:C.red;font(g,size*1.05,700,'mono');const tw=g.measureText(l.text).width;g.fillStyle=col;rr(g,x+size*.7,yy-size*1.0,tw+size*.9,size*1.35,8);g.fill();text(g,l.text,x+size*1.15,yy,size*1.05,C.bg,700,'mono');}
  else if(l.kind==='err'){fitText(g,l.text,x+size*.9,yy,w-size*1.8,size,C.red,500,'mono');}
  else if(l.kind==='ok'){fitText(g,l.text,x+size*.9,yy,w-size*1.8,size,C.pass,500,'mono');}
  else fitText(g,l.text,x+size*.9,yy,w-size*1.8,size,C.dim,400,'mono');
 });
}
// ---- the name comparison: reference vs file on disk, character by character in one monospace grid
function nameRow(g,name,x,y,size,{bad=-1,col=C.ink,badCol=C.red,collapse=0,glow=0}={}){font(g,size,600,'mono');const cw=g.measureText('M').width;let xx=x;
 for(let i=0;i<name.length;i++){const ch=name[i];if(i===bad){const k=1-collapse;if(k<=.01)continue;g.save();g.globalAlpha=k;if(glow){g.fillStyle=`rgba(240,77,77,${.22*glow})`;rr(g,xx-4,y-size*1.0,cw*k+8,size*1.3,6);g.fill();}text(g,ch,xx,y,size,badCol,700,'mono');g.restore();xx+=cw*k;continue;}
  text(g,ch,xx,y,size,col,600,'mono');xx+=cw;}
 return{cw,end:xx};
}
export function drawCompare(g,t,{macro=false}={}){
 const fixed=t>=PATH_FIXED,collapse=ease(clamp((t-ENTER_MV)/.3)),flash=t>=UNDERSCORE_FLASH?1:0;
 if(!macro){
  text(g,TXT.ref,180,250,34,C.dim,500);text(g,TXT.disk,180,560,34,C.dim,500);
  panel(g,160,280,1600,170,{fill:'#0D1118',stroke:fixed?C.pass:C.red,lw:3});panel(g,160,590,1600,170,{fill:'#0D1118',stroke:fixed?C.pass:C.line,lw:3});
  const size=64,r1=nameRow(g,EXPECTED,220,392,size),r2=nameRow(g,fileOnDisk(t),220,702,size,{bad:fixed?-1:UNDERSCORE_AT,badCol:C.ink});
  // the scan line runs over both names; every equal column gets a tick until the first difference
  const s=SHOT.S007,u=clamp((t-s.start-.35)/Math.max(.6,(s.end-s.start)*.7)),stop=UNDERSCORE_AT,k=Math.min(stop,Math.floor(u*(stop+1)));
  for(let i=0;i<k;i++){g.fillStyle=C.pass;g.fillRect(220+i*r1.cw+r1.cw*.2,475,r1.cw*.6,5);}
  if(u*(stop+1)>=stop){const xx=220+stop*r1.cw;g.strokeStyle=C.red;g.lineWidth=4;g.beginPath();g.moveTo(xx-2,300);g.lineTo(xx-2,740);g.stroke();text(g,'≠',xx-2,540,60,C.red,700,'sans','center');}
  chip(g,1430,320,fixed?TXT.found:TXT.notFound,fixed?C.pass:C.red,{size:28});
  return;
 }
 // macro: the characters around the difference, very large
 const size=150,x0=260,cut=UNDERSCORE_AT-6;const a=EXPECTED.slice(cut,cut+9),b=ON_DISK.slice(cut,cut+10);
 text(g,TXT.ref,x0,190,34,C.dim,500);text(g,TXT.disk,x0,540,34,C.dim,500);
 const r=nameRow(g,a,x0,380,size,{col:C.ink});
 const glow=flash*(fixed?0:.6+.4*Math.abs(Math.sin((t-UNDERSCORE_FLASH)*5)));
 const rb=nameRow(g,b,x0,730,size,{bad:6,badCol:fixed?C.pass:C.red,collapse,glow});
 if(!fixed&&flash){const xx=x0+6*r.cw;g.strokeStyle=C.red;g.lineWidth=5;rr(g,xx-10,560,r.cw+20,200,14);g.stroke();text(g,TXT.extra,xx+r.cw/2,840,40,C.red,600,'sans','center');}
 if(fixed){text(g,`${TXT.same} · ${TXT.renamed}`,x0,860,44,C.pass,600);}
 // the command that fixes it, typed in the line below
 const v=t<TYPE_MV?'':t>=ENTER_MV?MV_CMD:MV_CMD.slice(0,Math.ceil((t-TYPE_MV)/(ENTER_MV-TYPE_MV)*MV_CMD.length));
 panel(g,160,900,1600,86,{fill:'#0D1118',r:12,shadow:false});font(g,34,500,'mono');text(g,TXT.prompt,190,955,34,C.faint,500,'mono');const px=190+g.measureText(TXT.prompt+' ').width;fitText(g,v,px,955,1520-px,34,C.ink,500,'mono');
}
// ---- the file list of the release
export function drawFiles(g,t,{x=160,y=110,w=1600,size=34}={}){
 const s=SHOT.S004;text(g,`${TXT.albumName} · ${TXT.release} · ${TXT.album}`,x,y,30,C.dim,500);
 const head=TXT.listHead,cols=[x+130,x+560,x+900];head.forEach((h,i)=>text(g,h,cols[i],y+70,26,C.faint,600));
 TRACKS.forEach((tr,i)=>{const k=ease(clamp((t-s.start-.12*i)/.3)),yy=y+110+i*108;if(k<=0)return;g.save();g.globalAlpha=k;g.translate((1-k)*40,0);
  panel(g,x,yy,w,100,{fill:C.panel,r:14,shadow:false});drawCover(g,x+14,yy+10,80,tr,{credit:false});
  text(g,`${tr[0]}_${tr[1]}`,cols[0],yy+62,size,C.ink,600,'mono');text(g,'DE · EN',cols[1],yy+62,size,C.dim,500,'mono');fitText(g,i===BAD_TRACK?fileOnDisk(t):coverName(tr),cols[2],yy+62,x+w-cols[2]-30,size,C.ink,500,'mono');
  g.restore();});
}
// ---- four folders of the release on the laptop (S003): tracks, covers, audio, lyrics
export function drawFolders(g,t){text(g,`${TXT.albumName} · ${TXT.release}`,120,170,56,C.dim,500);
 TXT.folders.forEach((f,i)=>{const k=ease(clamp((t-SHOT.S003.start-.5-i*.15)/.35)),x=120+i*440,y=300;g.save();g.globalAlpha=k;
  g.fillStyle=i===0&&t>=TRACKS_READY?'#3A2418':C.panel2;rr(g,x,y+40,400,300,22);g.fill();rr(g,x,y,170,70,16);g.fill();g.strokeStyle=t>=TRACKS_READY?C.orange:C.line;g.lineWidth=5;rr(g,x,y+40,400,300,22);g.stroke();
  text(g,f,x+36,y+200,64,C.ink,600,'mono');text(g,TXT.folderSub[i],x+36,y+280,44,C.dim,500);g.restore();});
 drawRail(g,560,900,800,t,{size:30});}
// ---- the album card (S013) and its link field (not yet live)
export function drawAlbumCard(g,t,{x=200,y=150}={}){
 panel(g,x,y,1520,700,{fill:C.panel,r:24});
 const s=88*2.6;TRACKS.forEach((tr,i)=>drawCover(g,x+50+(i%3)*(s+16),y+70+Math.floor(i/3)*(s+16),s,tr,{credit:false}));
 const tx=x+50+3*(s+16)+40;text(g,TXT.albumN,tx,y+140,34,C.orange,600,'credit');text(g,TXT.albumName,tx,y+250,110,C.ink,700);text(g,TXT.tracksN,tx,y+320,40,C.dim,500);
 chip(g,tx,y+380,TXT.ready,C.orange,{size:34});
 panel(g,tx,y+500,1520-(tx-x)-60,90,{fill:C.bg2,stroke:C.line,r:14,shadow:false,dash:[10,8]});fitText(g,URL_TRACK,tx+30,y+558,1520-(tx-x)-120,30,C.faint,500,'mono');text(g,`${TXT.link} · ${TXT.notLive}`,tx,y+640,28,C.faint,500);
}
// ---- link and play as preview (S015): dashed, disabled
export function drawPreview(g,t){
 text(g,TXT.preview,960,200,40,C.dim,500,'sans','center');
 panel(g,220,300,1480,150,{fill:C.bg2,stroke:C.orange,r:20,dash:[14,10],shadow:false});text(g,`https://${URL_TRACK}`,280,395,52,'rgba(244,243,234,.5)',500,'mono');
 panel(g,220,520,1480,330,{fill:C.bg2,stroke:C.orange,r:20,dash:[14,10],shadow:false});drawCover(g,270,560,250,TRACKS[2],{dim:.45});
 g.strokeStyle='rgba(255,101,52,.7)';g.lineWidth=5;g.beginPath();g.arc(700,685,70,0,7);g.stroke();g.fillStyle='rgba(255,101,52,.7)';g.beginPath();g.moveTo(680,645);g.lineTo(735,685);g.lineTo(680,725);g.closePath();g.fill();
 text(g,'SHIP IT',820,665,64,'rgba(244,243,234,.55)',700);text(g,'Samuel Heinrich · Vibecoder',820,720,32,C.faint,500);text(g,TXT.notLive,1660,810,30,C.orange,500,'sans','right');
}
// ---- upload: three groups counted separately, no provider, no credentials
export function drawUpload(g,t,{x=160,y=230,w=1600}={}){
 const n=upload(t),cw=(w-80)/3;text(g,`npm run deploy -- --live`,x,y,34,C.dim,500,'mono');
 TXT.groups.forEach((name,i)=>{const xx=x+i*(cw+40),done=n[i]>=UPLOAD[i];panel(g,xx,y+50,cw,520,{fill:C.panel,stroke:done?C.pass:C.line,r:20,lw:3});
  text(g,name,xx+40,y+130,44,C.ink,600);font(g,150,700);text(g,`${n[i]}`,xx+40,y+340,150,done?C.pass:C.ink,700);font(g,150,700);const nw=g.measureText(`${n[i]}`).width;text(g,`/${UPLOAD[i]}`,xx+50+nw,y+340,64,C.dim,600);
  g.fillStyle=C.cell||'#26324A';g.fillRect(xx+40,y+420,cw-80,10);g.fillStyle=done?C.pass:C.orange;g.fillRect(xx+40,y+420,(cw-80)*n[i]/UPLOAD[i],10);
  const k=n[i];if(k>0){const tr=TRACKS[Math.min(5,Math.floor((k-1)/(UPLOAD[i]/6)))],lang=UPLOAD[i]>6?((k-1)%2?'en':'de'):'';const slug=`${tr[0]}-${tr[1].toLowerCase().replace(/_/g,'-')}`;
   fitText(g,[`${slug}/cover.webp`,`${slug}/audio-${lang}.mp3`,`${slug}/lyrics-${lang}`][i],xx+40,y+500,cw-80,26,C.dim,400,'mono');}});
 const tot=uploaded(t),all=UPLOAD.reduce((a,b)=>a+b,0);text(g,`${tot} / ${all}`,x,y+660,40,tot===all?C.pass:C.ink,600,'mono');
 if(t>=UPLOAD_DONE){chip(g,x+220,y+620,TXT.uploadDone,C.pass,{size:30,filled:true});text(g,TXT.noBrowser,x+w,y+662,30,C.dim,500,'sans','right');}
}
// ---- the website in a browser window: the cached page, the new page, the language switch
function siteHeader(g,x,y,w,lang,s){const nav=lang==='en'?TXT.navEn:TXT.nav;text(g,'kisound',x+40*s,y+58*s,38*s,C.ink,700);let xx=x+w-560*s;for(const n of nav){text(g,n,xx,y+56*s,24*s,C.dim,500);font(g,24*s,500);xx+=g.measureText(n).width+34*s;}
 font(g,24*s,600);const bx=x+w-130*s;text(g,'DE',bx,y+56*s,24*s,lang==='de'?C.ink:C.faint,700);text(g,'|',bx+42*s,y+56*s,24*s,C.faint,500);text(g,'EN',bx+60*s,y+56*s,24*s,lang==='en'?C.ink:C.faint,700);
 g.fillStyle=C.orange;g.fillRect(lang==='de'?bx:bx+60*s,y+66*s,34*s,3*s);}
export function drawSite(g,x,y,w,h,t,{page='new',lang='de',s=1,scroll=0,active=false}={}){
 g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.fillStyle=page==='old'?'#12161D':C.bg;g.fillRect(x,y,w,h);g.translate(0,-scroll);
 siteHeader(g,x,y,w,lang,s);
 if(page==='old'){// the cached page: album 02 on top, desaturated
  const cs=300*s;g.fillStyle='#1A2230';g.fillRect(x+40*s,y+120*s,cs,cs);g.strokeStyle='#4a6a8a';g.lineWidth=3*s;for(let i=0;i<7;i++){g.beginPath();g.moveTo(x+60*s,y+(160+i*36)*s);g.lineTo(x+(320)*s,y+(200+i*28)*s);g.stroke();}
  text(g,TXT.newest,x+380*s,y+170*s,26*s,C.faint,600);text(g,TXT.oldAlbum,x+380*s,y+250*s,64*s,'#AEB4BE',700);text(g,TXT.oldSub,x+380*s,y+300*s,30*s,C.faint,500);
  for(let i=0;i<4;i++){g.fillStyle='#1A202B';g.fillRect(x+40*s+i*230*s,y+480*s,210*s,210*s);}
 }else{const cs=200*s;TRACKS.forEach((tr,i)=>drawCover(g,x+40*s+(i%3)*(cs+12*s),y+120*s+Math.floor(i/3)*(cs+12*s),cs,tr,{credit:false}));
  const tx=x+40*s+3*(cs+12*s)+40*s;chip(g,tx,y+130*s,lang==='en'?'New':'Neu',C.orange,{size:24*s});text(g,TXT.albumName,tx,y+270*s,96*s,C.ink,700);text(g,lang==='en'?TXT.albumSubEn:TXT.albumSub,tx,y+330*s,32*s,C.dim,500);
  // track list
  TRACKS.forEach((tr,i)=>{const yy=y+(580+i*74)*s;g.fillStyle=active&&i===2?'#1F2632':i%2?'#131822':'#151B25';g.fillRect(x+40*s,yy,w-80*s,66*s);text(g,`${tr[0]}`,x+64*s,yy+44*s,26*s,C.faint,500,'mono');text(g,`${tr[2]} ${tr[3]}`.replace('HALLUCI NATION','HALLUCINATION'),x+130*s,yy+44*s,28*s,i===2&&active?C.orange:C.ink,600);text(g,'DE · EN',x+w-200*s,yy+44*s,24*s,C.dim,500,'mono');});
 }
 g.restore();
}
export function drawBrowser(g,x,y,w,h,t,{page,lang='de',url=URL_HOME,s=1,scroll=0,loading=false,hard=false,active=false}={}){
 panel(g,x,y,w,h,{fill:C.panel2,r:18});const bh=96*s;
 [0,1,2].forEach(i=>{g.fillStyle='#3a4352';g.beginPath();g.arc(x+34*s+i*30*s,y+34*s,9*s,0,7);g.fill();});
 g.fillStyle='#10141C';rr(g,x+150*s,y+16*s,w-320*s,44*s,22*s);g.fill();text(g,url,x+190*s,y+47*s,24*s,C.ink,500,'mono');
 // reload button: turns while loading; the hard reload shows its shortcut
 const rx=x+w-120*s,ry=y+38*s;g.save();g.translate(rx,ry);if(loading)g.rotate(t*14);g.strokeStyle=loading?C.orange:C.dim;g.lineWidth=3.5*s;g.beginPath();g.arc(0,0,13*s,.4,5.6);g.stroke();g.fillStyle=loading?C.orange:C.dim;g.beginPath();g.moveTo(13*s,-7*s);g.lineTo(19*s,4*s);g.lineTo(6*s,2*s);g.closePath();g.fill();g.restore();
 if(hard)chip(g,rx-210*s,y+16*s,'⇧⌘R',C.orange,{size:22*s,filled:true});
 drawSite(g,x+6*s,y+bh-20*s,w-12*s,h-bh+14*s,t,{page,lang,s,scroll,active});
 if(loading){g.fillStyle='rgba(16,20,28,.55)';g.fillRect(x+6*s,y+bh-20*s,w-12*s,h-bh+14*s);g.fillStyle=C.orange;g.fillRect(x+6*s,y+bh-22*s,(w-12*s)*clamp((t*3)%1),4*s);}
}
// ---- lyrics: the UI language changes, the lyric line stays in the language of the recording
export function drawLyrics(g,t){
 const s=SHOT.S021,k=ease(clamp((t-s.start)/.5)),same=t>=LYRIC_SAME;
 [['de',140],['en',1000]].forEach(([lang,x],i)=>{g.save();g.globalAlpha=i?k:1;panel(g,x,170,780,640,{fill:C.panel2,r:18});
  const nav=lang==='en'?TXT.navEn:TXT.nav;text(g,lang==='en'?'UI · EN':'UI · DE',x+40,240,30,C.orange,600);text(g,nav.join('   '),x+40,300,26,C.dim,500);
  text(g,'03 · SHIP IT',x+40,400,56,C.ink,700);text(g,lang==='en'?TXT.lyricsEn:TXT.lyricsDe,x+40,470,24,C.faint,500);
  g.fillStyle=same?'rgba(209,248,93,.12)':'rgba(255,255,255,.04)';rr(g,x+24,520,732,150,12);g.fill();
  const lines=wrap(g,TXT.lyricLine,680,40);lines.forEach((l,j)=>text(g,l,x+44,580+j*54,40,C.ink,500));g.restore();});
 if(same){text(g,'=',960,612,90,C.pass,700,'sans','center');text(g,TXT.lyricSame,960,890,40,C.pass,600,'sans','center');}
 text(g,`UI · DE  ≠  UI · EN  ·  ${TXT.uiChanges}`,960,120,32,C.dim,500,'sans','center');
}
function wrap(g,s,maxW,size){font(g,size,500);const words=s.split(' '),out=[];let cur='';for(const w of words){const n=cur?cur+' '+w:w;if(g.measureText(n).width>maxW&&cur){out.push(cur);cur=w;}else cur=n;}if(cur)out.push(cur);return out;}
// ---- the link goes out (S025) and play (S026)
export function drawShare(g,t){
 const copied=t>=LINK_COPIED;panel(g,200,380,1520,170,{fill:C.bg2,stroke:copied?C.pass:C.orange,r:22,lw:4});text(g,`https://${URL_TRACK}`,260,490,58,C.ink,500,'mono');
 const bx=1300;chip(g,bx,600,copied?`${TXT.copied} ✓`:TXT.copy,copied?C.pass:C.orange,{size:40,filled:copied});
 if(!copied)cursor(g,bx+150,640,1.4);
}
export function drawPlayer(g,t,{x=220,y=230,w=1480,h=620,s=1}={}){
 panel(g,x,y,w,h,{fill:C.panel,r:24*s});drawCover(g,x+50*s,y+50*s,360*s,TRACKS[2]);
 const playing=t>=PLAY,px=x+520*s,py=y+170*s;g.fillStyle=playing?C.orange:'rgba(0,0,0,0)';g.beginPath();g.arc(px,py,70*s,0,7);g.fill();g.strokeStyle=C.orange;g.lineWidth=5*s;g.beginPath();g.arc(px,py,70*s,0,7);g.stroke();
 g.fillStyle=playing?C.bg:C.orange;if(playing){g.fillRect(px-24*s,py-30*s,16*s,60*s);g.fillRect(px+8*s,py-30*s,16*s,60*s);}else{g.beginPath();g.moveTo(px-22*s,py-36*s);g.lineTo(px+38*s,py);g.lineTo(px-22*s,py+36*s);g.closePath();g.fill();}
 text(g,'SHIP IT',px+120*s,py-10*s,72*s,C.ink,700);text(g,'Samuel Heinrich · Vibecoder',px+120*s,py+44*s,30*s,C.dim,500);
 // the waveform of this recording (measured level); the playhead starts at the click
 const wx=x+50*s,wy=y+500*s,ww=w-100*s,pos=playing?clamp((t-PLAY)/DURATION*6):0;
 if(WAVE)WAVE.forEach((v,i)=>{const xx=wx+i/WAVE.length*ww,hh=4*s+v*80*s;g.fillStyle=i/WAVE.length<pos?C.orange:'#3A4556';g.fillRect(xx,wy-hh/2,ww/WAVE.length*.6,hh);});
 if(!playing&&t<PLAY)cursor(g,px+30*s,py+40*s,1.3*s);
}
// ---- S032: the released page as one consistent state, slow pan
export function drawRelease(g,t){
 const s=SHOT.S032,u=ease(clamp((t-s.start)/(s.end-s.start)));
 drawBrowser(g,120,60,1320,960,t,{page:'new',lang:LANG,url:URL_TRACK,s:.9,scroll:lerp(0,330,u),active:true});
 // the checks next to the page: link, DE, EN, player
 const items=[[`${TXT.link} ✓`,C.pass],['DE ✓',C.pass],['EN ✓',C.pass],[`▶ ${TXT.play}`,C.orange]];items.forEach(([l,c],i)=>{const k=ease(clamp((t-s.start-.4-i*.35)/.4));g.save();g.globalAlpha=k;chip(g,1490,180+i*120,l,c,{size:34,w:330});g.restore();});
 const k=ease(clamp((t-s.start-2.2)/.6));g.save();g.globalAlpha=k;drawPlayer(g,t,{x:1470,y:700,w:420,h:300,s:.32});g.restore();
}
// ---- one view per 2D shot
export const VIEWS={
 S004:(g,t)=>drawFiles(g,t),
 S005:(g,t)=>drawTerminal(g,140,120,1640,760,t,{size:50,lines:6}),
 S006:(g,t)=>drawTerminal(g,140,120,1640,760,t,{size:50,lines:6}),
 S007:(g,t)=>drawCompare(g,t),
 S008:(g,t)=>drawCompare(g,t,{macro:true}),
 S013:(g,t)=>drawAlbumCard(g,t),
 S015:(g,t)=>drawPreview(g,t),
 S017:(g,t)=>drawUpload(g,t),
 S018:(g,t)=>{const b=browser(t);drawBrowser(g,160,70,1600,840,t,{page:b.page,loading:b.loading});chip(g,160,950,`${TXT.uploadDone} ✓`,C.pass,{size:30});if(b.cacheChip)chip(g,1760-430,950,TXT.cache,C.amber,{size:30,w:430,filled:true});},
 S019:(g,t)=>{const b=browser(t);drawBrowser(g,160,70,1600,840,t,{page:b.page,loading:b.loading,hard:t>=HARD_RELOAD-.25});if(t>=HARD_RELOAD-.25)chip(g,160,950,`${TXT.hard} · ⇧⌘R`,C.orange,{size:30});if(t>=NEW_PAGE)chip(g,1760-330,950,TXT.fresh,C.pass,{size:30,w:330,filled:true});},
 S020:(g,t)=>{const b=browser(t);drawBrowser(g,160,70,1600,840,t,{page:'new',lang:b.lang});if(b.deOk)chip(g,160,950,`DE ✓ ${TXT.checked}`,C.pass,{size:30});if(b.enOk)chip(g,480,950,`EN ✓ ${TXT.checked}`,C.pass,{size:30});},
 S021:(g,t)=>drawLyrics(g,t),
 S025:(g,t)=>drawShare(g,t),
 S026:(g,t)=>drawPlayer(g,t),
 S032:(g,t)=>drawRelease(g,t),
};
// rail strip under the screen views (not under the macro and the full-page shots)
const RAIL_SHOTS=new Set(['S004','S005','S006','S007','S013','S015','S017']);
export function drawView(id,g,t){g.fillStyle=C.bg;g.fillRect(0,0,1920,1080);VIEWS[id](g,t);if(RAIL_SHOTS.has(id))drawRail(g,560,965,800,t,{size:22});}
// ---- the laptop display: the app that belongs to this moment (terminal, comparison, upload, browser, player)
export function laptopView(t){if(t>=SHOT.S034.start)return'player';if(t>=NEXT_NOTE)return'terminal';if(t>=PLAY)return'player';if(t>=RELOAD1-.4)return'browser';if(t>=ENTER_DEPLOY+.3)return'upload';if(t>=UNDERSCORE_FLASH-.6&&t<PATH_FIXED+.6)return'compare';if(t>=SHOT.S005.start)return'terminal';return t>=SHOT.S003.start?'folders':'home';}
export function drawLaptop(g,W,H,t){g.save();g.scale(W/1920,H/1200);g.fillStyle=C.bg;g.fillRect(0,0,1920,1200);const v=laptopView(t);
 if(v==='terminal')drawTerminal(g,60,60,1800,1080,t,{size:40,lines:9,next:true});
 else if(v==='compare'){g.translate(0,40);drawCompare(g,t,{macro:false});}
 else if(v==='upload'){g.translate(0,60);drawUpload(g,t);}
 else if(v==='browser'){const b=browser(t);drawBrowser(g,40,40,1840,1120,t,{page:b.page,lang:t>=LIVE_VERIFIED?LANG:b.lang,loading:b.loading,url:t>=LINK_COPIED?URL_TRACK:URL_HOME,active:t>=LINK_COPIED});}
 else if(v==='player'){g.translate(0,120);drawPlayer(g,t);}
 else if(v==='folders')drawFolders(g,t);
 else{drawSite(g,0,0,1920,1200,t,{page:'old'});}
 g.restore();}
// ---- 3D panels: compact versions of the same surfaces (1024 × 640 canvas)
export function drawPanel(kind,g,W,H,t){g.save();g.scale(W/1920,H/1200);g.fillStyle=C.bg;g.fillRect(0,0,1920,1200);
 if(kind==='terminal')drawTerminal(g,40,40,1840,1120,t,{size:52,lines:7});
 else if(kind==='commit'){panel(g,60,80,1800,1040,{fill:C.panel,stroke:t>=CHECK_PASS?C.pass:C.line,r:30,lw:6});text(g,'git commit',140,250,64,C.dim,500,'mono');text(g,COMMIT_HASH,140,450,180,C.orange,700,'mono');fitText(g,TXT.commitMsg,140,620,1640,96,C.ink,600);text(g,TXT.files,140,760,64,C.dim,500);chip(g,140,880,`${TXT.checkPass} · ${TXT.zeroErrors}`,C.pass,{size:64,filled:true});}
 else if(kind==='upload'){g.translate(0,100);drawUpload(g,t);}
 else if(kind==='browser'){const b=browser(t);drawBrowser(g,30,30,1860,1140,t,{page:b.page,lang:b.lang,loading:b.loading});}
 else if(kind.startsWith('bridge:')){const i=+kind.slice(7);panel(g,60,80,1800,1040,{fill:C.panel,stroke:C.orange,r:40,lw:8});fitText(g,TXT.bridge[i],960,700,1600,360,C.ink,700,'sans','center');}
 else if(kind==='album'){g.translate(-60,60);drawAlbumCard(g,t,{x:140,y:120});}
 else if(kind==='proof'){panel(g,60,200,1800,800,{fill:C.panel,stroke:C.pass,r:30,lw:6});text(g,TXT.ref,140,360,64,C.dim,500);fitText(g,EXPECTED,140,560,1640,110,C.ink,600,'mono');chip(g,140,700,`✓ ${TXT.found}`,C.pass,{size:72,filled:true});}
 g.restore();}
