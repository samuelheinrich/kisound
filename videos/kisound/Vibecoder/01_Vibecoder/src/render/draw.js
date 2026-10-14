import {LANG,HEX,SHOT,CHAPTERS,DURATION} from './config.js';
import {clamp,lerp,ease,smooth} from './timeline.js';
import {TXT,artifactStatus,beatSteps,catalog,pattern,app,inputText,bridgeText,testState,loopPhase,clock,shotProgress} from './model.js';

export const W=1920,H=1080;
const C={...HEX,muted:'#8C9BAD',soft:'#D6DFE8',redSoft:'#F7A29F',greenSoft:'#E0F8B5'};
const F={sans:'"Space Grotesk",system-ui,sans-serif',mono:'"JetBrains Mono",monospace',display:'"Michroma",sans-serif'};
const V=id=>Number(id.slice(1));
export function font(g,size=32,weight=500,family='sans'){g.font=`${weight} ${size}px ${F[family]}`;}
export function text(g,s,x,y,size=32,color=C.ink,weight=500,family='sans',align='left'){
 font(g,size,weight,family);g.fillStyle=color;g.textBaseline='alphabetic';g.textAlign=align;g.fillText(String(s),x,y);g.textAlign='left';
}
function fit(g,s,x,y,w,size=32,color=C.ink,weight=500,family='sans'){
 let n=size;font(g,n,weight,family);while(n>14&&g.measureText(String(s)).width>w){n-=2;font(g,n,weight,family);}text(g,s,x,y,n,color,weight,family);
}
function rr(g,x,y,w,h,r=16){g.beginPath();g.roundRect(x,y,w,h,r);}
export function panel(g,x,y,w,h,{fill=C.panel,stroke=C.line,r=16,lw=2,shadow=true}={}){
 if(shadow){g.fillStyle='rgba(0,0,0,.28)';rr(g,x+8,y+12,w,h,r);g.fill();}
 g.fillStyle=fill;rr(g,x,y,w,h,r);g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=lw;rr(g,x,y,w,h,r);g.stroke();}
}
function line(g,x1,y1,x2,y2,color=C.orange,width=4){g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}
function pill(g,s,x,y,color=C.orange,{w=null,size=22}={}){font(g,size,700,'mono');const width=w??g.measureText(s).width+36;panel(g,x,y,width,44,{fill:C.deep,stroke:color,r:10,lw:2,shadow:false});text(g,s,x+18,y+29,size,color,700,'mono');return width;}
function status(g,state,x,y,w=200){const color=state==='pass'?C.green:state==='fail'?C.red:state==='working'||state==='partial'?C.orange:C.muted;
 const label=state==='pass'?TXT.pass:state==='fail'?TXT.fail:state==='working'?TXT.running:state==='partial'?TXT.checked:TXT.pending;
 pill(g,label,x,y,color,{w,size:20});}
function fullBg(g,t,a,{light=false}={}){const gr=g.createLinearGradient(0,0,W,H);gr.addColorStop(0,light?'#E4E2D8':C.deep);gr.addColorStop(.55,light?'#CFD3CE':C.night);gr.addColorStop(1,light?'#B7C3C1':'#261912');g.fillStyle=gr;g.fillRect(0,0,W,H);
 g.save();g.globalAlpha=light?.09:.12;g.strokeStyle=light?'#15212C':'#9BB1C6';g.lineWidth=1;for(let x=0;x<W;x+=64)line(g,x,0,x,H,light?'#263D4D':'#71849A',1);for(let y=0;y<H;y+=64)line(g,0,y,W,y,light?'#263D4D':'#71849A',1);g.restore();
 const glow=g.createRadialGradient(1540,350,40,1540,350,700);glow.addColorStop(0,`rgba(255,101,52,${.07+.07*a.energy})`);glow.addColorStop(1,'rgba(255,101,52,0)');g.fillStyle=glow;g.fillRect(0,0,W,H);
}
function header(g,t,shot){const ch=CHAPTERS.find(c=>c.key===shot.chapter);text(g,'KISOUND  /  01',80,70,22,C.cyan,500,'display');text(g,ch?.title.toUpperCase()||'',80,112,30,C.ink,700);text(g,`${clock(t)}    ${LANG.toUpperCase()}`,W-80,74,22,C.dim,500,'mono','right');
 line(g,80,134,1840,134,C.line,2);}
function artifactRail(g,t,{y=976}={}){const items=artifactStatus(t),x0=80,step=600;line(g,x0+80,y,x0+2*step+80,y,C.line,5);const n=items.filter(i=>i.state==='pass').length;line(g,x0+80,y,x0+n*step+80,y,C.orange,5);
 items.forEach((i,k)=>{const x=x0+k*step;g.fillStyle=i.state==='pass'?C.green:i.state==='fail'?C.red:['working','partial'].includes(i.state)?C.orange:C.panel2;g.beginPath();g.arc(x+80,y,15,0,Math.PI*2);g.fill();text(g,String(k+1).padStart(2,'0'),x+8,y+9,20,C.dim,500,'mono');fit(g,i.title,x+112,y+9,380,22,C.ink,600);});}
function progress(g,t){const w=1760,p=clamp(t/DURATION);line(g,80,1038,1840,1038,C.line,3);line(g,80,1038,80+w*p,1038,C.orange,3);text(g,`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(2).padStart(5,'0')}`,1840,1058,16,C.dim,500,'mono','right');}
function frame(g,t,shot,a,{rail=true}={}){fullBg(g,t,a);header(g,t,shot);if(rail)artifactRail(g,t);progress(g,t);}

function bigMetric(g,label,value,x,y,w,{color=C.ink,sub=''}={}){panel(g,x,y,w,200,{fill:C.panel});text(g,label,x+32,y+50,20,C.dim,600,'mono');fit(g,value,x+32,y+137,w-64,76,color,700,'sans');if(sub)fit(g,sub,x+32,y+176,w-64,20,C.dim,500,'mono');}
function exportScreen(g,t,shot){const id=V(shot.id),state=catalog(t),ready=state==='verified'||state==='first_pass',bar=ready?1:state==='diff'?lerp(.99,1,shotProgress(t,shot)):.99;
 text(g,TXT.catalog,100,230,52,C.ink,700);status(g,state==='edge_fail'?'fail':ready?'pass':'working',1540,185,250);
 panel(g,96,275,1728,492,{fill:C.panel});text(g,'export/catalog.csv',144,340,28,C.dim,500,'mono');text(g,`${Math.round(bar*100)}%`,1650,353,72,ready?C.green:C.orange,700,'mono','right');
 line(g,144,388,1776,388,C.line,16);line(g,144,388,144+1632*bar,388,C.orange,16);
 TXT.catalogRows.forEach((r,i)=>{const yy=476+i*78;panel(g,144,yy-41,1632,66,{fill:i%2?C.deep:C.panel2,stroke:null,r:8,shadow:false});text(g,r[0],172,yy,22,C.cyan,600,'mono');text(g,r[1],278,yy,30,C.ink,600,'mono');text(g,r[2]+' BPM',1540,yy,22,C.dim,500,'mono');});
 const st=ready?C.green:C.orange;text(g,state==='stuck'?TXT.missing:state==='edge_fail'?TXT.fail:state==='verified'?TXT.complete:TXT.running,1660,737,28,st,700,'mono','right');
 if(id===6||id===8){panel(g,1160,783,630,88,{fill:C.deep,stroke:C.orange,shadow:false});fit(g,TXT.catalogRequest,1190,837,560,22,C.ink,500);}
}
function promptScreen(g,t,shot,{request=inputText(t),answer=null}={}){const id=V(shot.id),isFix=[17,22,44].includes(id);
 text(g,isFix?TXT.ask:TXT.input,100,236,44,C.ink,700);panel(g,100,282,1720,322,{fill:C.panel2,stroke:C.cyan,lw:3});
 text(g,'>_',150,370,50,C.cyan,600,'mono');fit(g,request,265,370,1480,40,C.ink,500);
 line(g,150,449,1770,449,C.line,2);text(g,TXT.expected,150,518,24,C.dim,700,'mono');fit(g,answer??(id<29?L('Datei + Status = COMPLETE','File + status = COMPLETE'):id<43?L('Ein Screen · ein Knopf · ein Flow','One screen · one button · one flow'):L('Auswahl bleibt nach Reload','Selection survives reload')),390,520,1280,32,C.orange,600);
 pill(g,'SEND  ↗',150,647,C.orange,{w:250,size:26});text(g,TXT.agent+' / '+TXT.diff,460,676,24,C.dim,500,'mono');
}
function L(de,en){return LANG==='de'?de:en;}
function diffScreen(g,t,shot){const id=V(shot.id),isApp=id>=43&&id<58;const a=isApp?app(t):catalog(t),ok=isApp?a==='verified':a==='verified'||a==='first_pass';
 text(g,isApp?TXT.tool:TXT.catalog,100,230,52,C.ink,700);pill(g,'DIFF',1560,188,C.orange,{w:240});
 panel(g,100,282,1720,520,{fill:C.deep,stroke:C.line});text(g,'01',152,370,24,C.muted,500,'mono');text(g,isApp?'const saved = store.get("last_id")':'writeCatalog(rows)',265,370,34,C.dim,500,'mono');
 text(g,'02',152,455,24,C.muted,500,'mono');text(g,isApp?'- store.set("track", selected.id)':'- status = "RUNNING"',265,455,38,C.red,600,'mono');
 panel(g,138,504,1644,94,{fill:'#2E261F',stroke:C.orange,r:10,shadow:false});text(g,'03',152,568,24,C.muted,500,'mono');
 text(g,isApp?'+ store.set("last_id", selected.id)':'+ status = file.closed ? "COMPLETE" : "RUNNING"',265,568,38,C.orange,600,'mono');
 text(g,'04',152,670,24,C.muted,500,'mono');text(g,isApp?'reload(); assert(selected.id === saved.id)':'assert(file.rows === expected.rows)',265,670,32,C.ink,500,'mono');
 text(g,'05',152,745,24,C.muted,500,'mono');text(g,ok?'PASS':a==='edge_fail'||a==='wrong_key'?'FAIL':'RUN TEST',265,745,36,ok?C.green:a==='edge_fail'||a==='wrong_key'?C.red:C.cyan,700,'mono');
}
function testsScreen(g,t,shot){const id=V(shot.id),isApp=id>=43&&id<57,which=isApp?'reload':id===23?'edge':null;
 text(g,isApp?L('Gleicher Reload-Test','Same reload test'):L('Zwei verschiedene Beweise','Two distinct proofs'),100,230,52,C.ink,700);
 const A=isApp?[['TRACK_ID','VIBECODER'],['STORAGE_KEY','last_id'],['RELOAD','same selection']]:[['CATALOG_FILE','3 rows'],['STATUS','COMPLETE'],['EDGE_CASE','2nd export']];
 A.forEach(([k,v],i)=>{const x=100+i*585,st=isApp?testState(t,'reload'):testState(t,['file','status','edge'][i]);panel(g,x,300,550,430,{fill:C.panel,stroke:st==='pass'?C.green:st==='fail'?C.red:C.line,lw:3});text(g,k,x+36,370,24,C.dim,600,'mono');fit(g,v,x+36,480,478,48,C.ink,700);status(g,st,x+36,624,440);});
 if(which){const st=testState(t,which);text(g,st==='fail'?TXT.return:TXT.checked,100,830,38,st==='fail'?C.red:C.green,700);}
}
function traceScreen(g,t,shot){const names=[TXT.input,TXT.agent,TXT.diff,TXT.test],x0=96,ww=390,gap=46,y=320;const id=V(shot.id);
 text(g,L('Ich sehe den Weg. Die Mitte bleibt offen.','I know the path. The middle stays opaque.'),100,230,48,C.ink,700);
 names.forEach((n,i)=>{const x=x0+i*(ww+gap),center=i===1;panel(g,x,y,ww,390,{fill:center?'#11151B':C.panel,stroke:center?C.muted:i===3?C.green:C.cyan,lw:3});text(g,n,x+32,y+74,30,center?C.dim:C.ink,700,'mono');
  if(center){text(g,'?',x+ww/2,y+260,160,C.muted,600,'sans','center');}else if(i===0){fit(g,inputText(t),x+32,y+190,ww-64,26,C.ink,500);}else if(i===2){text(g,'+ 1 line',x+32,y+210,42,C.orange,600,'mono');}else{pill(g,id>=26?'PASS':'2 / 2',x+32,y+192,C.green,{w:260,size:28});}});
 for(let i=0;i<3;i++){line(g,x0+ww+i*(ww+gap)+4,y+195,x0+(i+1)*(ww+gap)-8,y+195,C.orange,5);text(g,'›',x0+(i+1)*(ww+gap)-20,y+205,48,C.orange,600);}
 if(id===20)text(g,L('ERGEBNIS SEHEN ≠ ALLE DRÄHTE KENNEN','SEE RESULTS ≠ KNOW EVERY WIRE'),100,802,30,C.dim,500,'mono');
}
function candidateScreen(g,t){text(g,TXT.noon,100,230,54,C.ink,700);TXT.catalogRows.forEach((r,i)=>{const x=100+i*585,match=[.34,.48,.57][i];panel(g,x,310,550,455,{fill:C.panel,stroke:C.line});text(g,r[1],x+36,392,38,C.ink,700);text(g,r[2]+' BPM',x+36,450,28,C.dim,500,'mono');
  for(let j=0;j<16;j++){const yy=530+Math.sin(j*1.9+i)*35;g.fillStyle=j%4===0?C.cyan:C.line;g.fillRect(x+38+j*29,yy,18,88-Math.abs(yy-530));}
  line(g,x+38,680,x+520,680,C.orange,4);status(g,'fail',x+36,704,260);});}
export function drawPattern(g,t,{x=100,y=278,w=1720,h=565,large=true,energy=0}={}){
 panel(g,x,y,w,h,{fill:C.panel});text(g,TXT.sound,x+36,y+62,large?34:22,C.ink,700);text(g,'133 BPM  /  4 × 16',x+w-36,y+62,large?24:18,C.dim,500,'mono','right');
 const steps=beatSteps(t),labels=['KICK','SNARE','HATS','BASS'],left=x+190,top=y+132,cw=(w-245)/16,rowH=(h-175)/4;
 steps.forEach((row,r)=>{text(g,labels[r],x+36,top+r*rowH+38,large?24:17,r===3?C.orange:C.dim,600,'mono');row.forEach((on,c)=>{const xx=left+c*cw,yy=top+r*rowH;panel(g,xx+4,yy+3,cw-10,rowH-17,{fill:on?r===3?C.orange:C.cyan:C.deep,stroke:on?null:C.line,r:5,shadow:false});if(on&&r===3&&energy>0){g.fillStyle=`rgba(255,168,118,${.08+.16*energy})`;g.fillRect(xx+4,yy+3,cw-10,rowH-17);}});});
}
function appScreen(g,t,shot,{small=false}={}){const st=app(t),bad=['lost','wrong_key','wrong_selection'].includes(st),verified=st==='verified';
 text(g,TXT.tool,100,230,52,C.ink,700);panel(g,100,278,1720,580,{fill:C.panel});text(g,'TRACK / 01',156,355,24,C.dim,500,'mono');
 panel(g,156,394,932,128,{fill:C.deep,stroke:bad?C.red:verified?C.green:C.line,lw:3});fit(g,bad?TXT.catalogRows[0][1]:TXT.ownTrack,194,475,840,40,bad?C.red:C.ink,700);
 panel(g,1150,394,600,128,{fill:C.orange,stroke:null});text(g,L('PAKET EXPORTIEREN ↗','EXPORT PACKAGE ↗'),1450,473,34,C.deep,700,'sans','center');
 text(g,TXT.selected,156,602,24,C.dim,600,'mono');text(g,bad?TXT.fail:verified?TXT.complete:TXT.running,156,678,58,bad?C.red:verified?C.green:C.orange,700,'mono');
 if(bad){text(g,L('Soll: VIBECODER / OWN BEAT','Expected: VIBECODER / OWN BEAT'),156,763,28,C.greenSoft,500,'mono');}
 if(verified)pill(g,'RELOAD PASS',1330,744,C.green,{w:420,size:28});
}
function cycleScreen(g,t){const labels=TXT.cycle,active=loopPhase(t);text(g,L('SAGEN. BAUEN. PRÜFEN. ZURÜCK.','SPECIFY. BUILD. TEST. RETURN.'),100,250,52,C.ink,700);
 labels.forEach((n,i)=>{const x=100+i*438,lit=i===active;panel(g,x,370,390,360,{fill:lit?'#3D251B':C.panel,stroke:lit?C.orange:C.line,lw:3});text(g,String(i+1).padStart(2,'0'),x+34,435,26,lit?C.orange:C.dim,600,'mono');text(g,n,x+34,590,58,lit?C.orange:C.ink,700,'mono');});
}
function titleScreen(g,t,shot,a){const n=V(shot.id),small=n===2;fullBg(g,t,a);
 if(n===54){
  text(g,'HARD CODER',W/2,240,34,C.red,700,'mono','center');
  panel(g,180,340,1560,330,{fill:'#261B1E',stroke:C.red,lw:4,r:24});
  fit(g,TXT.hardcoder2,260,540,1400,116,C.ink,700,'sans');
  line(g,260,770,1660,770,C.orange,9);
  [TXT.catalog,TXT.sound,TXT.tool].forEach((label,i)=>{const x=260+i*475;fit(g,label,x,850,370,24,C.ink,600);pill(g,'PASS',x,882,C.green,{w:170,size:22});});
  return;
 }
 const scale=small?.82:1+Math.min(.03,a.sub*.03),yy=small?120:80;g.save();g.translate(W/2,H/2);g.scale(scale,scale);g.translate(-W/2,-H/2);
 text(g,'VIBE',W/2,yy+440,small?230:320,C.ink,700,'sans','center');text(g,'CODER',W/2,yy+755,small?230:320,C.orange,700,'sans','center');g.restore();
 if(n===2){line(g,280,875,1640,875,C.orange,14);text(g,L('EINE IDEE. EIN TEST.','AN IDEA. A TEST.'),W/2,958,32,C.dim,600,'mono','center');}
 else{const labels=n===43?L('RELOAD: AUSWAHL VERLOREN','RELOAD: SELECTION LOST'):'SPEC  /  BUILD  /  TEST  /  FIX';text(g,labels,W/2,944,32,n===43?C.red:C.dim,600,'mono','center');}
}
function bridgeScreen(g,t,shot){const b=bridgeText(t),isOther=b?.who==='HARD CODER';text(g,isOther?'HARD CODER':'VIBECODER',100,230,34,isOther?C.red:C.orange,600,'mono');
 panel(g,100,315,1720,390,{fill:isOther?'#261B1E':C.panel,stroke:isOther?C.red:C.orange,lw:3,r:20});fit(g,b?.text||TXT.reply1,160,540,1600,70,C.ink,700);
 text(g,L('DIE BLACKBOX BLEIBT DUNKEL','THE BLACK BOX STAYS OPAQUE'),100,820,27,C.dim,600,'mono');
}
function finalScreen(g,t,shot,a){const items=artifactStatus(t);text(g,L('DREI EIGENE ERGEBNISSE','THREE WORKING THINGS'),100,226,52,C.ink,700);
 items.forEach((i,k)=>{const x=100+k*585;panel(g,x,310,550,460,{fill:C.panel,stroke:C.orange,lw:3});text(g,String(k+1).padStart(2,'0'),x+36,378,30,C.orange,600,'mono');fit(g,i.title,x+36,485,478,38,C.ink,700);status(g,i.state,x+36,660,250);});
 line(g,100,830,1820,830,C.orange,10);const p=(Math.sin(t*2)+1)/2;g.fillStyle=C.orange;g.beginPath();g.arc(100+1720*p,830,12+12*a.sub,0,Math.PI*2);g.fill();
}
function chantPhase(t,lyric){return Math.min(3,Math.floor(4*clamp((t-lyric.start_s)/(lyric.end_s-lyric.start_s))));}
function isChant(lyric){return lyric?.text?.trim()==='Prompt. Run. Check. Go.';}
function outroSteps(g,t,lyric,{x=100,y=390,w=390,h=310,gap=48}={}){const active=chantPhase(t,lyric);
 ['PROMPT','RUN','CHECK','GO'].forEach((word,i)=>{const xx=x+i*(w+gap),lit=i===active;panel(g,xx,y,w,h,{fill:lit?'#3D251B':C.panel,stroke:lit?C.orange:C.line,lw:3});text(g,word,xx+35,y+h*.56,h*.16,lit?C.orange:C.ink,700,'mono');});}
function outroScreen(g,t,shot,lyric){const chant=isChant(lyric);text(g,chant?'PROMPT. RUN. CHECK. GO.':L('DER WEG BLEIBT','THE PATH HOLDS'),100,280,72,C.ink,700,'mono');
 if(chant)outroSteps(g,t,lyric);
 else{const items=artifactStatus(t);items.forEach((item,i)=>{const x=100+i*585;panel(g,x,390,550,310,{fill:C.panel,stroke:C.green,lw:3});fit(g,item.title,x+35,490,478,36,C.ink,700);status(g,item.state,x+35,585,280);});}
 if(V(shot.id)===69)pill(g,'RELOAD PASS',100,785,C.green,{w:500,size:32});
}
export function drawFlat(g,t,shot,a,lyric){const id=V(shot.id);if([2,21,54].includes(id)){titleScreen(g,t,shot,a);return;}frame(g,t,shot,a);
 if([4,6,8].includes(id))exportScreen(g,t,shot);
 else if([11,17,22,39,44,62].includes(id))promptScreen(g,t,shot);
 else if([12,26,49].includes(id))diffScreen(g,t,shot);
 else if([13,14,23,45,47].includes(id))testsScreen(g,t,shot);
 else if([18,20,53].includes(id))traceScreen(g,t,shot);
 else if([30,34].includes(id))candidateScreen(g,t);
 else if([31,32,35,36].includes(id))drawPattern(g,t,{energy:a.sub});
 else if([40,41].includes(id))appScreen(g,t,shot);
 else if([43].includes(id))appScreen(g,t,shot);
 else if([51,52,55].includes(id))bridgeScreen(g,t,shot);
 else if([57,59,60,61,63,64,65].includes(id))finalScreen(g,t,shot,a);
 else if([67,68,69].includes(id))outroScreen(g,t,shot,lyric);
 else cycleScreen(g,t);
}
export function drawHud(g,t,shot,a,{hybrid=false,lyric=null}={}){const ch=CHAPTERS.find(c=>c.key===shot.chapter);g.save();
 const top=g.createLinearGradient(0,0,0,220);top.addColorStop(0,'rgba(11,16,24,.82)');top.addColorStop(1,'rgba(11,16,24,0)');g.fillStyle=top;g.fillRect(0,0,W,220);
 text(g,'KISOUND  /  01',80,72,22,C.cyan,500,'display');text(g,ch?.title.toUpperCase()||'',80,120,36,C.ink,700);
 text(g,`${clock(t)}  ${LANG.toUpperCase()}`,1840,72,22,C.soft,500,'mono','right');
 if(hybrid&&V(shot.id)<67){const id=V(shot.id),x=1060,y=574;
  const note=id>=62?L('NÄCHSTE IDEE','NEXT IDEA'):id>=40?L('AUSWAHL SPEICHERN','SAVE SELECTION'):id>=31?TXT.sound:L('DATEI → STATUS → TEST','FILE → STATUS → TEST');
  panel(g,x,y,760,318,{fill:'rgba(16,20,28,.92)',stroke:C.orange,r:16,lw:3});
  text(g,TXT.cycle[id%4],x+36,y+78,34,C.orange,700,'mono');
  fit(g,note,x+36,y+155,688,40,C.ink,700);
  const state=id>=40?app(t):id>=31?pattern(t):catalog(t);
  status(g,['verified','first_pass','ready'].includes(state)?'pass':['lost','wrong_key','wrong_selection','edge_fail'].includes(state)?'fail':'working',x+36,y+215,320);
 }
 if(V(shot.id)>=51&&V(shot.id)<=56){
  const b=bridgeText(t);if(b){const other=b.who==='HARD CODER';
   panel(g,80,570,900,282,{fill:other?'rgba(38,27,30,.96)':'rgba(16,20,28,.96)',stroke:other?C.red:C.orange,lw:3,r:16});
   text(g,b.who,118,636,29,other?C.red:C.orange,700,'mono');
   fit(g,b.text,118,746,825,47,C.ink,700);
   text(g,L('WAS BELEGT IST, BLEIBT SICHTBAR','THE PROOF STAYS VISIBLE'),118,811,22,C.dim,600,'mono');
  }
 }
 if(V(shot.id)>=67&&isChant(lyric)){
  panel(g,80,626,1760,220,{fill:'rgba(11,16,24,.94)',stroke:C.orange,lw:3,r:18});
  outroSteps(g,t,lyric,{x:112,y:664,w:400,h:144,gap:32});
 }
 if(shot.id==='S066'){
  const k=smooth(SHOT.S066.start+.2,SHOT.S066.start+.8,t);g.globalAlpha=k;
  text(g,'VIBE',105,350,154,C.ink,700,'sans');text(g,'CODER',105,505,154,C.orange,700,'sans');
  text(g,TXT.artist,112,560,23,C.ink,400,'display');g.globalAlpha=1;
 }
 artifactRail(g,t,{y:1004});progress(g,t);g.restore();
}
export function drawArtifactCard(g,type,t,{w=512,h=352}={}){g.save();g.clearRect(0,0,w,h);g.fillStyle=C.panel;g.fillRect(0,0,w,h);g.strokeStyle=C.line;g.lineWidth=5;g.strokeRect(3,3,w-6,h-6);
 const title=type==='catalog'?TXT.catalog:type==='pattern'?TXT.sound:TXT.tool,state=type==='catalog'?catalog(t):type==='pattern'?pattern(t):app(t),good=state==='verified'||state==='ready',fileReady=type==='catalog'&&['file_pass','first_pass','edge_fail','edge_fix','verified'].includes(state),appFail=type==='tool'&&['lost','wrong_key','wrong_selection'].includes(state);
 g.fillStyle=C.orange;g.fillRect(24,28,6,50);fit(g,title,48,67,w-72,28,C.ink,700);
 if(type==='catalog'){
  text(g,fileReady?'100%':'99%',32,173,78,fileReady?C.green:C.orange,700,'mono');line(g,32,212,w-32,212,C.line,8);line(g,32,212,fileReady?w-32:w-64,212,C.orange,8);
  text(g,good?'3 ROWS  ·  VERIFIED':fileReady?'3 ROWS  ·  FILE PASS':'3 ROWS  ·  WAIT',32,275,22,C.dim,500,'mono');
 }else if(type==='pattern'){
  const steps=beatSteps(t);steps.forEach((r,i)=>r.forEach((on,j)=>{g.fillStyle=on?i===3?C.orange:C.cyan:C.deep;g.fillRect(35+j*27,120+i*47,20,32);}));
 }else{
  panel(g,28,118,w-56,72,{fill:C.deep,stroke:appFail?C.red:good?C.green:C.line,r:8,shadow:false});fit(g,TXT.ownTrack,45,162,w-90,23,C.ink,700);
  panel(g,28,218,w-56,75,{fill:appFail?C.red:C.orange,stroke:null,r:8,shadow:false});text(g,good?'RELOAD PASS':appFail?'RELOAD FAIL':'EXPORT ↗',w/2,265,30,C.deep,700,'mono','center');
 }
 g.restore();}
