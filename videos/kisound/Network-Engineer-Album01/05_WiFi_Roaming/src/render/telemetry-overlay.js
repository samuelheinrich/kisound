import {FLOOR_PATH,OFFICES,CAMPUS_APS} from './layout.js';
import {telemetry,radioState,EXCHANGES,dfsState,ROAMS} from './roaming.js';
import {sequence} from './protocol-model.js';
import {clamp,smooth} from './timeline.js';
const C={cyan:'#62def1',amber:'#ffbc6c',green:'#8df1bb',white:'#e6f4fa',dim:'#83a5b9',red:'#ff7687',grid:'#284355'};
const mono='"JetBrains Mono"',sans='"Space Grotesk"';
function text(g,s,x,y,size=22,color=C.white){g.fillStyle=color;g.font=`${size}px ${mono}`;g.fillText(s,x,y);}
function panel(g,x,y,w,h){g.fillStyle='rgba(5,18,30,.9)';g.fillRect(x,y,w,h);g.strokeStyle='#315367';g.lineWidth=1;g.strokeRect(x,y,w,h);g.fillStyle=C.cyan;g.fillRect(x,y,4,34);}
function path(g,points,color,width=2){g.strokeStyle=color;g.lineWidth=width;g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();}
function arrow(g,x1,x2,y,color,width=3){path(g,[[x1,y],[x2,y]],color,width);const d=Math.sign(x2-x1);path(g,[[x2-d*12,y-8],[x2,y],[x2-d*12,y+8]],color,width);}
const LOGS=[
 [0,.7,'DOT11-6-SCAN','Scanning.'],[4.48,5.88,'DOT11-6-ASSOC','Associating.'],[9.26,10.66,'WLAN-6-SECURITY','Authenticating.'],[10.66,12.18,'LINK-5-UP','Connected.'],
 [33.24,34.68,'WLAN-4-RSSI','RSSI low; evaluating candidates.'],[43.72,44.76,'DOT11-6-BEACON','Beacon received in hallway.'],
 [55.42,56.1,'WLAN-6-TARGET','Scenario target -67 dBm reached.'],[61.8,62.6,'DOT11-4-RETRY','Late roam / -72 dBm / retransmitting.'],[63.54,65.82,'DOT11-5-ROAM','AP-01 -> AP-02 / link recovered.'],[77.941,78.5,'DFS-4-RADAR','Radar detected on channel 52.'],[78.5,78.8,'DOT11-5-CSA','Channel switch announced: 52 -> 36.'],[83.1,84,'DFS-5-RESUME','AP-02 resumed on channel 36.'],
 [110.96,111.4,'DOT11-6-PROBE','Probe request.'],[112.42,113.42,'DOT11-6-PROBE','Probe response.'],[113.76,114.46,'DOT11-6-AUTH','Authenticating.'],[114.46,115.76,'DOT11-6-ASSOC','Associating.'],
 [116.74,117.88,'WPA-6-EAPOL','Four-way handshake.'],[117.94,118.3,'WPA-5-KEYS','Keys installed locally.'],[118.7,120.26,'DOT11-5-ROAM','AP-02 -> AP-03 / target -67 dBm.'],
 [135.86,136.64,'DOT11-6-SCAN','Scanning.'],[138.52,139.3,'DOT11-6-ROAM','Roaming.'],[143.7,145,'DOT11-6-SCAN','Scanning.'],[153.66,155,'DOT11-5-ROAM','AP-03 -> AP-04 / target -67 dBm.'],[161.16,162.56,'WLAN-6-MOBILITY','Still moving.'],
];
export function drawSyslog(g,t,h){
 const live=LOGS.filter(([s,e])=>s<=t&&t<e+5.6).slice(-3);if(!live.length)return;
 const shade=g.createLinearGradient(0,h-240,0,h);shade.addColorStop(0,'rgba(3,9,17,0)');shade.addColorStop(1,'rgba(3,9,17,.95)');g.fillStyle=shade;g.fillRect(0,h-240,1920,240);
 live.forEach(([s,e,tag,msg],i)=>{
  const rank=live.length-i-1,alpha=(1-smooth(e+5,e+5.6,t))*(rank? .5:.98),typed=clamp((t-s)/Math.max(.25,(e-s)*.75)),y=h-69-rank*34;
  g.save();g.globalAlpha=alpha;const stamp=`${String(Math.floor(s/60)).padStart(2,'0')}:${(s%60).toFixed(2).padStart(5,'0')}`;
  text(g,stamp,64,y,20,C.dim);text(g,`%${tag}:`,184,y,20,tag.includes('-4-')?C.amber:C.cyan);
  g.font=`20px ${mono}`;const x=184+g.measureText(`%${tag}: `).width,part=msg.slice(0,Math.ceil(msg.length*typed));text(g,part,x,y,20);
  if(rank===0&&typed<1){g.fillStyle=C.cyan;g.fillRect(x+g.measureText(part).width+4,y-18,10,21);}g.restore();
 });
}
// Technical overlays occupy a compact left dock. Film offsets the projection so
// the corresponding physical demonstration occupies the unobstructed right area.
export function drawTechnical(g,t,shot,tl){
 if(shot.zone==='device')drawApp(g,t,shot);
 if(shot.zone==='spectrum')drawSpectrum(g,t,shot);
 if(shot.zone==='protocol')drawProtocol(g,t,shot);
 if(shot.zone==='hall'){
  drawRoamingHUD(g,t);drawFloorPlan(g,t);
  if(['mimo','meeting'].includes(shot.camera)){panel(g,1320,110,520,122);text(g,'DL MU-MIMO / 3 CLIENTS',1340,148,25,C.cyan);text(g,'Same channel / spatial streams',1340,190,20,C.dim);}
  if(shot.camera==='packet'){panel(g,1350,110,490,112);text(g,'802.11 FRAME CAM',1370,147,25,C.amber);text(g,'DATA -> AP / ACK -> CLIENT',1370,188,19);}
 }
}
function wrap(g,s,x,y,max,size=18,col=C.dim){
 g.font=`${size}px ${mono}`;let row='',line=0;for(const word of s.split(' ')){const test=row?row+' '+word:word;if(g.measureText(test).width>max&&row){text(g,row,x,y+line*(size+7),size,col);line++;row=word;}else row=test;}text(g,row,x,y+line*(size+7),size,col);
}
function thresholdGraph(g,t,x,y,w,h,seconds=10,showSnr=false){
 const Y=v=>y+h*(1-clamp((v+80)/35));
 for(const value of[-50,-60,-70,-80]){path(g,[[x,Y(value)],[x+w,Y(value)]],C.grid,1);text(g,`${value}`,x-34,Y(value)+5,14,C.dim);}
 for(const[v,col,label]of[[-67,C.green,'-67 TARGET'],[-72,C.red,'-72 LATE']]){g.setLineDash([6,7]);path(g,[[x,Y(v)],[x+w,Y(v)]],col,1.5);g.setLineDash([]);text(g,label,x+w-102,Y(v)-6,14,col);}
 path(g,Array.from({length:81},(_,i)=>{const r=telemetry(Math.max(0,t-seconds+seconds*i/80));return[x+w*i/80,Y(r.rssi)];}),telemetry(t).retry>.15?C.red:C.cyan,3);
 if(showSnr){path(g,Array.from({length:81},(_,i)=>[x+w*i/80,y+h*(1-clamp(telemetry(Math.max(0,t-seconds+seconds*i/80)).snr/50))]),C.green,1.6);text(g,'SNR 0–50 dB / right',x+w-186,y-17,14,C.green);text(g,'50',x+w+7,y+5,13,C.green);text(g,'0',x+w+7,y+h,13,C.green);}
 text(g,`-${seconds}s`,x,y+h+21,14,C.dim);text(g,'NOW',x+w-32,y+h+21,14,C.dim);
}
function drawRoamingHUD(g,t){
 const r=telemetry(t),bad=r.retry>.15,col=bad?C.red:r.recentRoam?C.green:C.cyan;
 panel(g,64,110,530,244);text(g,`AP-0${r.ap+1}   ${r.rssi.toFixed(0)} dBm`,86,150,28,col);
 text(g,bad?'LATE / RETRY=1':r.recentRoam?`ROAM ${r.recentRoam.from+1} -> ${r.ap+1}`:r.rssi<=-67?'TARGET REACHED / CLIENT HOLDS':'MOVING / SIGNAL MARGIN',86,182,17,col);
 thresholdGraph(g,t,121,207,437,93);text(g,'SCENARIO / client-dependent thresholds',86,338,15,C.dim);
}
function drawFloorPlan(g,t){
 const r=radioState(t),x=1480,y=620;panel(g,x,y,362,266);text(g,'ROAMING ROUTE',x+18,y+31,20,C.cyan);
 const X=v=>x+28+(v+16)*3.1,Y=v=>y+64+(v+25)*1.82;
 OFFICES.forEach(o=>{g.fillStyle='#163646';g.fillRect(X(o.x-o.w/2),Y(o.z-o.d/2),o.w*3.1,o.d*1.82);});
 path(g,FLOOR_PATH.map(([a,b])=>[X(a),Y(b)]),'#779bb0',3);
 CAMPUS_APS.forEach((p,i)=>{g.fillStyle=i===r.ap?C.green:C.dim;g.beginPath();g.arc(X(p[0]),Y(p[2]),5,0,Math.PI*2);g.fill();text(g,String(i+1),X(p[0])+8,Y(p[2])+5,15);});
 path(g,[[X(r.x),Y(r.z)],[X(CAMPUS_APS[r.ap][0]),Y(CAMPUS_APS[r.ap][2])]],r.retry>.15?C.red:C.green,1.5);
 g.fillStyle=r.retry>.15?C.red:C.amber;g.fillRect(X(r.x)-5,Y(r.z)-5,10,10);
 text(g,'■ CLIENT   ● AP',x+18,y+246,15,C.dim);
}
function drawApp(g,t,shot){
 const r=telemetry(t),x=64,y=145;panel(g,x,y,665,639);
 text(g,'RADIO INSPECTOR',x+24,y+40,29,C.cyan);text(g,'SCENARIO / NOT A LIVE CAPTURE',x+24,y+70,16,C.dim);
 text(g,`${r.rssi.toFixed(0)} dBm`,x+25,y+127,34,r.retry>.15?C.red:C.white);text(g,`${r.snr.toFixed(0)} dB`,x+261,y+127,34,C.green);
 text(g,'RSSI',x+25,y+153,17,C.dim);text(g,'SNR',x+261,y+153,17,C.dim);text(g,`Noise ${r.noiseDbm.toFixed(0)} dBm`,x+432,y+123,18,C.amber);
 thresholdGraph(g,t,x+68,y+196,548,179,12,true);
 r.candidates.forEach((v,i)=>{const bx=x+28+(i%2)*320,by=y+456+Math.floor(i/2)*88,col=i===r.ap?C.cyan:C.dim;text(g,`AP-0${i+1}  ${v.toFixed(0)} dBm`,bx,by,20,col);for(let k=0;k<8;k++){g.fillStyle=k/8<clamp((v+95)/55)?col:'#263c4a';g.fillRect(bx+k*24,by+44-k*3,17,7+k*3);}});
 if(shot.camera==='portal'){panel(g,x+20,y+175,625,200);text(g,'APPLICATION / CAPTIVE PORTAL',x+39,y+214,23,C.amber);wrap(g,'Guest sign-in follows connectivity. Separate from the radio roam.',x+39,y+260,570,21);}
 text(g,'-67 target / -72 late in this scenario',x+24,y+617,17,C.dim);
}
function drawSpectrum(g,t,shot){
 const mode=shot.camera,dfs=['dfs','radar'].includes(mode),x=64,y=145,w=690;
 if(dfs){
  const {moved,detected,stage}=dfsState(t,mode==='radar');panel(g,x,y,w,647);
  text(g,'DFS / RADAR',x+24,y+42,29,C.amber);text(g,'AP-02 / SAME BSSID',x+24,y+80,23);
  const cx=x+345,cy=y+246,r=120;
  for(let i=1;i<=3;i++){g.strokeStyle='#365d6c';g.beginPath();g.arc(cx,cy,r*i/3,0,Math.PI*2);g.stroke();}
  path(g,[[cx-r,cy],[cx+r,cy]],C.grid);path(g,[[cx,cy-r],[cx,cy+r]],C.grid);
  const theta=t*2.8;g.fillStyle='rgba(99,226,190,.18)';g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,r,theta-.6,theta);g.closePath();g.fill();path(g,[[cx,cy],[cx+Math.cos(theta)*r,cy+Math.sin(theta)*r]],C.green,3);
  g.fillStyle=detected?C.red:C.dim;g.beginPath();g.arc(cx+62,cy-49,7,0,Math.PI*2);g.fill();
  text(g,stage,x+24,y+410,25,moved?C.green:C.amber);
  text(g,'CH 52',x+30,y+473,29,moved?C.dim:C.amber);text(g,'5260 MHz',x+30,y+502,18,C.dim);
  arrow(g,x+238,x+406,y+466,C.cyan,3);text(g,moved?'CH 36':'CSA',x+470,y+473,29,moved?C.green:C.amber);text(g,moved?'5180 MHz':'802.11h',x+470,y+502,18,C.dim);
  wrap(g,moved?'Old DFS channel vacated. AP and BSSID remain the same.':detected?'Radar detected. Announce the new channel, then switch.':'Monitor the DFS channel. No channel switch yet.',x+24,y+557,635,21);return;
 }
 const bands=['bands','six'].includes(mode),width=['width','power'].includes(mode),scan=mode==='scan',overlap=mode==='overlap';
 panel(g,x,y,w,537);text(g,bands?'5 / 6 GHz PROPAGATION':width?'CHANNEL WIDTH / POWER':scan?'SCAN / CHANNEL DWELL':'CHANNEL OVERLAP',x+24,y+43,27,C.cyan);
 text(g,'SCHEMATIC SPECTRUM',x+24,y+78,17,C.dim);
 const gx=x+65,gy=y+139,gw=587,gh=249;
 for(let i=0;i<=4;i++){path(g,[[gx,gy+i*gh/4],[gx+gw,gy+i*gh/4]],C.grid,1);text(g,`${-i*20}`,x+21,gy+i*gh/4+6,16,C.dim);}text(g,'RELATIVE dB',gx,gy-21,16,C.dim);
 if(bands){
  for(let k=0;k<2;k++){path(g,Array.from({length:101},(_,i)=>{const u=i/100,loss=12+u*(k?34:28)+(u>.43?(k?16:13):0);return[gx+u*gw,gy+loss/80*gh];}),k?C.amber:C.cyan,3);}
  const wx=gx+gw*.43;g.fillStyle='rgba(134,160,175,.24)';g.fillRect(wx,gy,20,gh);text(g,'WALL',wx-18,gy-5,16,C.dim);
  text(g,'5 GHz',gx+20,gy+120,20,C.cyan);text(g,'6 GHz',gx+20,gy+163,20,C.amber);text(g,'DISTANCE ->',gx+390,gy+gh+30,18,C.dim);
  wrap(g,'Equal reference TX power. Walls and antennas affect the actual result.',x+24,y+458,635,20);return;
 }
 const min=overlap?2400:5160,max=overlap?2485:5340,centres=overlap?[2412,2422,2437,2462]:width?(mode==='power'?[5180,5260]:[5210,5290]):[5180,5220,5260,5300];
 const labels=overlap?['1','3','6','11']:width?(mode==='power'?['36','52']:['42','58']):['36','44','52','60'];
 const cols=[C.cyan,C.amber,C.green,'#b8b5ff'],active=Math.floor((t-shot.start)*4)%4;
 centres.forEach((f,i)=>{const bw=width?(mode==='power'?20:80):20,amp=mode==='power'?.52:1;g.save();g.globalAlpha*=scan&&active!==i?.25:1;
  path(g,Array.from({length:161},(_,j)=>{const mhz=min+(max-min)*j/160,d=(mhz-f)/(bw/2);return[gx+j/160*gw,gy+gh-Math.exp(-Math.pow(d,4))*.9*amp*gh];}),cols[i],3);g.restore();
  text(g,labels[i],gx+(f-min)/(max-min)*gw-10,gy+gh+27,17,cols[i]);
 });
 if(scan){const f=centres[active],sx=gx+(f-min)/(max-min)*gw;path(g,[[sx,gy],[sx,gy+gh]],C.white,2);text(g,`DWELL ${f} MHz`,gx+285,gy-21,18);}
 text(g,`${min}–${max} MHz / CHANNEL`,gx,gy+gh+61,17,C.dim);
 wrap(g,overlap?'2.4 GHz / overlapping 20 MHz cells':width?(mode==='power'?'20 MHz / reduced TX power':'80 MHz / wider occupied spectrum'):'Scan changes the monitored channel.',x+24,y+494,638,20,C.dim);
}
function drawProtocol(g,t,shot){
 const x=64,y=145,w=738;
 if(shot.camera==='identity'){
  panel(g,x,y,w,448);text(g,'SAME SSID / DIFFERENT BSSID',x+25,y+45,26,C.cyan);
  ['AP-02','AP-03'].forEach((name,i)=>{const yy=y+115+i*137;text(g,name,x+28,yy,34);text(g,'NIGHTWALK',x+220,yy,25,C.cyan);text(g,`02:00:00:00:05:0${i+2}`,x+220,yy+39,19,C.dim);});
  text(g,'CLIENT SELECTS THE TARGET AP',x+25,y+396,23,C.green);return;
 }
 const seq=sequence(shot,t),keys=shot.camera==='keys',action=shot.camera==='action',exchange=shot.camera==='exchange',retry=shot.camera==='retry';
 const title=keys?'FOUR-WAY HANDSHAKE':action?'MANAGEMENT / ACTION FRAMES':exchange?'LINK ESTABLISHMENT':retry?'RELIABILITY / RETRY BIT':'MEDIUM ACCESS / RTS + CTS';
 panel(g,x,y,w,650);text(g,title,x+25,y+44,27,C.cyan);
 text(g,keys?'WPA2-PSK / PMK already available':action?'802.11k candidates / 802.11v advice':exchange?'PROBE / AUTH / REASSOCIATION':'RTS -> CTS -> DATA -> ACK',x+25,y+78,19,C.dim);
 const left=x+68,right=x+w-60,top=y+186,step=seq.length===6?61:94;
 text(g,'CLIENT',left-35,y+132,20,C.cyan);text(g,'AP',right-14,y+132,20,C.amber);
 path(g,[[left,top-30],[left,y+559]],C.grid,2);path(g,[[right,top-30],[right,y+559]],C.grid,2);
 seq.forEach((e,i)=>{
  const yy=top+i*step,dir=e.direction==='client-ap',from=dir?left:right,to=dir?right:left,col=dir?C.cyan:C.amber,p=e.progress;
  g.save();g.globalAlpha*=p>0?1:.36;
  text(g,`${i+1} ${e.label}`,left+23,yy-16,keys?21:18,col);
  if(e.label==='NO ACK'){g.setLineDash([7,10]);path(g,[[from,yy],[to,yy]],C.red);g.setLineDash([]);}else arrow(g,from,to,yy,col,2);
  text(g,e.detail,left+23,yy+22,14,C.dim);
  if(p>0&&p<1&&e.label!=='NO ACK'){g.fillStyle=C.white;g.fillRect(from+(to-from)*p-11,yy-6,22,12);}
  if(p>=1){g.fillStyle=C.green;g.beginPath();g.arc(to,yy,5,0,Math.PI*2);g.fill();}g.restore();
 });
 wrap(g,keys?(t>=117.94?'Keys installed locally at both ends.':'Nonces + MIC exchanged / not 802.11r FT'):action?'The client accepts or rejects the recommendation.':exchange?'Expanded protocol timing for the film.':retry?'No ACK: retry with the same sequence number.':'Optional protection. Neighbours defer via NAV.',x+25,y+595,680,20,keys&&t>=117.94?C.green:C.dim);
}
