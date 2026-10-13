import {TITLES,DURATION} from './config.js';
import {smooth,clamp} from './timeline.js';
import {networkState,neighbour,lsdb,ROUTERS,shortest,graph,LOGS} from './protocol-model.js';
export const DOCK={x:64,y:136,w:510,h:552};
const C={cyan:'#59d8ed',violet:'#b39bff',amber:'#ffb96a',green:'#80e3bd',red:'#ff747a',white:'#daedf5',dim:'#86a8bc'};
export function text(g,s,x,y,size=22,col=C.white){g.font=`${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
function wrap(g,s,x,y,width,size=18,col=C.dim){g.font=`${size}px "JetBrains Mono"`;let row='',i=0;for(const word of s.split(' ')){const test=row?row+' '+word:word;if(g.measureText(test).width>width&&row){text(g,row,x,y+i*(size+7),size,col);row=word;i++;}else row=test;}text(g,row,x,y+i*(size+7),size,col);}
function panel(g,title,sub){const{x,y,w,h}=DOCK;g.fillStyle='rgba(5,18,30,.91)';g.fillRect(x,y,w,h);g.strokeStyle='#315367';g.lineWidth=1;g.strokeRect(x,y,w,h);g.fillStyle=C.cyan;g.fillRect(x,y,4,34);text(g,title,x+24,y+43,25,C.cyan);text(g,sub,x+24,y+78,16,C.dim);return{x:x+24,y:y+125,w:w-48};}
export const technicalModes=new Set(['hello','states','twoway','roles','drother','bdr','dr','exstart','dbd','loading','aligned','spf','multi','area1','areas','summary','ecmp','adjacency','lsa','cost','drother-data','flood','root-r1','root-r4','fault','failover','full','recovery']);
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t));}
export function drawTitles(g,h,alpha){
 if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.64);shade.addColorStop(0,'rgba(2,8,16,.70)');shade.addColorStop(.7,'rgba(2,8,16,.26)');shade.addColorStop(1,'rgba(2,8,16,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.64);
 const y=h*.215;g.textAlign='center';g.font='400 112px "Michroma"';const metal=g.createLinearGradient(0,y-100,0,y);metal.addColorStop(0,'#f8fcfd');metal.addColorStop(.48,'#d5e4eb');metal.addColorStop(.55,'#9fbbc9');metal.addColorStop(1,'#edf8fc');g.fillStyle=metal;g.shadowColor='rgba(119,203,234,.35)';g.shadowBlur=18;g.fillText('OSPF',960,y);
 g.font='400 100px "Michroma"';const blue=g.createLinearGradient(0,y+25,0,y+126);blue.addColorStop(0,'#51d5ed');blue.addColorStop(.5,'#0bafd7');blue.addColorStop(1,'#007ba8');g.fillStyle=blue;g.fillText('NEIGHBORS',960,y+125);
 g.shadowBlur=0;g.textAlign='left';g.font='400 28px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tracking=10,widths=[...name].map(c=>g.measureText(c).width),total=widths.reduce((a,b)=>a+b,0)+tracking*(name.length-1);let x=960-total/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+206);x+=widths[i]+tracking;});
 g.strokeStyle='#edaa58';g.lineWidth=2;g.shadowColor='#edaa58';g.shadowBlur=10;for(const[a,b]of[[960-total/2-95,960-total/2-32],[960+total/2+32,960+total/2+95]]){g.beginPath();g.moveTo(a,y+196);g.lineTo(b,y+196);g.stroke();}g.restore();
}
export function pairFor(shot){if(shot.mode==='area1')return['R7','R8'];if(shot.mode==='full')return['R6','R4'];if(shot.mode==='twoway'&&shot.start>140||['drother','adjacency','drother-data'].includes(shot.mode))return['R6','R7'];if(shot.mode==='bdr')return['R6','R5'];if(shot.mode==='recovery')return['R2','R4'];return['R1','R2'];}
export function drawTechnical(g,t,shot){
 const n=networkState(t),m=shot.mode,pair=pairFor(shot),p=neighbour(...pair,t);
 if(['hello','states','twoway','full','area1','recovery'].includes(m)){
  const{x,y,w}=panel(g,'HELLO / NEIGHBOUR',`${pair.join(' ↔ ')} / ${p.network_type.toUpperCase()}`);text(g,p.state.toUpperCase(),x,y,29,p.state==='Full'?C.green:p.state==='Down'?C.red:C.amber);text(g,`AREA ${p.area===0?'0.0.0.0':'0.0.0.1'}`,x,y+52,22);
  text(g,'ROUTER-ID / RECEIVED',x,y+103,17,C.dim);text(g,ROUTERS.find(r=>r.id===pair[1]).rid,x,y+136,25,C.cyan);text(g,'NEIGHBOURS IN HELLO',x,y+189,17,C.dim);
  const bidirectional=!['Down','Init'].includes(p.state);text(g,bidirectional?ROUTERS.find(r=>r.id===pair[0]).rid:'Own Router-ID absent',x,y+225,22,bidirectional?C.green:C.amber);
  text(g,'HELLO 10s / DEAD 40s',x,y+278,21);text(g,'IP PROTOCOL 89',x,y+316,20,C.dim);wrap(g,'Protocol timers are compressed for the film. Two-Way confirms mutual visibility.',x,y+365,w,18);return;
 }
 if(['roles','drother','bdr','dr','adjacency','drother-data'].includes(m)){
  const{x,y,w}=panel(g,'BROADCAST / ROLES','ROLE IS LOCAL TO THIS SEGMENT');
  for(const [i,id]of['R4','R5','R6','R7'].entries()){const r=ROUTERS.find(r=>r.id===id);text(g,`${id}  ${r.role}`,x,y+i*57,23,r.role==='DR'?C.amber:r.role==='BDR'?C.violet:C.cyan);text(g,`priority ${r.priority}`,x+260,y+i*57,18,C.dim);}
  text(g,'R6 ↔ R4 / '+neighbour('R6','R4',t).state.toUpperCase(),x,y+255,22,C.green);text(g,'R6 ↔ R5 / '+neighbour('R6','R5',t).state.toUpperCase(),x,y+291,22,C.green);text(g,'R6 ↔ R7 / '+neighbour('R6','R7',t).state.toUpperCase(),x,y+327,22,C.cyan);wrap(g,'DROTHERs forward user traffic directly. DR/BDR organise protocol exchange.',x,y+366,w,18);return;
 }
 if(['multi','areas','summary'].includes(m)){
  const{x,y,w}=panel(g,'ABR / TWO AREAS','R7 / SEPARATE LINK-STATE DATABASES');
  text(g,'AREA 0 → R7 → AREA 1',x,y,22);text(g,'TYPE 1 / 2: AREA SCOPE',x,y+65,20,C.cyan);text(g,n.area1Full?'TYPE 3: NEW ADVERTISEMENT':'TYPE 3: PENDING',x,y+110,19,C.violet);text(g,'198.51.100.0/24',x,y+167,24,C.violet);text(g,n.area1Full?'R7 advertises metric 11':'R7 / R8 database sync',x,y+212,21);text(g,n.area1Full?'R1 total metric 41':'Route not installed yet',x,y+257,22,C.green);text(g,'INTRA-AREA: O',x,y+308,20,C.cyan);text(g,'INTER-AREA: O IA',x,y+345,20,C.violet);wrap(g,'The ABR creates Type-3 LSAs. It does not relay the full topology into another area.',x,y+366,w,17);return;
 }
 if(['exstart','dbd','loading','aligned','lsa','flood'].includes(m)){
  const{x,y,w}=panel(g,'LSDB / RELIABLE EXCHANGE','PACKET TYPE ≠ LSA TYPE');
  const steps=[['2','DBD / LSA HEADERS'],['3','LSR / REQUEST'],['4','LSU / FULL LSAs'],['5','LSAck / CONFIRM']];steps.forEach(([k,v],i)=>{text(g,`${k}  ${v}`,x,y+i*48,21,i===2?C.amber:C.cyan);});
  text(g,'AREA 0 / LSA SET',x,y+215,19,C.dim);lsdb(t,0).slice(0,4).forEach((l,i)=>text(g,`T${l.type} ${l.advertiser}  seq ${l.sequence}`,x,y+251+i*31,19));
  wrap(g,'DBD compares headers. Missing or newer information is requested, updated and acknowledged.',x,y+366,w,17);return;
 }
 const{x,y,w}=panel(g,m==='cost'?'INTERFACE COST':m==='fault'||m==='failover'?'LINK CHANGE / SPF':'SPF / EQUAL COST',shot.mode==='root-r4'?'ROOT R4 / LOCAL SHORTEST-PATH TREE':'ROOT R1 / AUTHORED NETWORK');
 text(g,`R1–R2 COST ${n.cost12}`,x,y,25,C.amber);text(g,`R2–R4 ${n.linkDown?'DOWN':'UP'}`,x,y+48,22,n.linkDown?C.red:C.green);
 const root=shot.mode==='root-r4'?'R4':'R1',s=shortest(graph(t,{root}));text(g,'192.0.2.0/24',x,y+114,25,C.cyan);text(g,`O / metric ${root==='R1'?n.route.metric:s.dist.D0}`,x,y+155,22);text(g,`via ${root==='R1'?n.route.nextHops.join(', '):'local'}`,x,y+192,22,C.green);
 text(g,'198.51.100.0/24',x,y+252,24,C.violet);text(g,n.area1Full?`O IA / metric ${root==='R1'?n.interArea.metric:s.dist.D1}`:'Area 1 forming …',x,y+291,21);text(g,n.converging?'LSDB UPDATE → SPF':'ROUTES INSTALLED',x,y+339,20,n.converging?C.amber:C.green);
 wrap(g,'Equal costs produce multiple next hops. The example keeps each flow on one selected path.',x,y+366,w,17);
}
export function drawSyslog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+7).slice(-3);if(!rows.length)return;const shade=g.createLinearGradient(0,h-188,0,h);shade.addColorStop(0,'rgba(3,9,17,0)');shade.addColorStop(1,'rgba(3,9,17,.88)');g.fillStyle=shade;g.fillRect(0,h-188,1920,188);rows.forEach((r,i)=>{g.save();g.globalAlpha=(i===rows.length-1?1:.45)*(1-smooth(r.time_s+6.5,r.time_s+7,t));const y=h-55-(rows.length-1-i)*33,stamp=`${String(Math.floor(r.time_s/60)).padStart(2,'0')}:${(r.time_s%60).toFixed(2).padStart(5,'0')}`;text(g,stamp,64,y,19,C.dim);const tag=`%${r.tag}: `;text(g,tag,180,y,19,r.tag.includes('-4-')?C.amber:C.cyan);const width=g.measureText(tag).width;text(g,r.message.slice(0,Math.ceil(clamp((t-r.time_s)/.55)*r.message.length)),180+width,y,19);g.restore();});}
