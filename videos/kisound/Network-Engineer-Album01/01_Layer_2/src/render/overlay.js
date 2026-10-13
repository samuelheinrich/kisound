import {TITLES} from './config.js';
import {smooth,clamp} from './timeline.js';
import {networkState,arpState,frameState,tunnelState,lldpNeighbours,DEVICES,HOSTS,taggedFrame} from './protocol-model.js';
export const DOCK={x:64,y:136,w:510,h:552};
const C={cyan:'#59d8ed',violet:'#b39bff',amber:'#ffb96a',green:'#80e3bd',red:'#ff747a',white:'#daedf5',dim:'#86a8bc',grid:'#284759'};
const mono='"JetBrains Mono"';
export function text(g,s,x,y,size=22,col=C.white){g.font=`${size}px ${mono}`;g.fillStyle=col;g.fillText(String(s),x,y);}
function wrap(g,s,x,y,width,size=18,col=C.dim){g.font=`${size}px ${mono}`;let row='',line=0;for(const word of s.split(' ')){const test=row?row+' '+word:word;if(g.measureText(test).width>width&&row){text(g,row,x,y+line*(size+7),size,col);row=word;line++;}else row=test;}text(g,row,x,y+line*(size+7),size,col);}
function panel(g,title,sub){const{x,y,w,h}=DOCK;g.fillStyle='rgba(5,18,30,.91)';g.fillRect(x,y,w,h);g.strokeStyle='#315367';g.lineWidth=1;g.strokeRect(x,y,w,h);g.fillStyle=C.cyan;g.fillRect(x,y,4,34);text(g,title,x+24,y+43,26,C.cyan);text(g,sub,x+24,y+78,16,C.dim);return{x:x+24,y:y+125,w:w-48};}
function arrow(g,x1,y1,x2,y2,col=C.cyan){g.strokeStyle=col;g.lineWidth=3;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();const a=Math.atan2(y2-y1,x2-x1);g.beginPath();g.moveTo(x2-12*Math.cos(a-.55),y2-12*Math.sin(a-.55));g.lineTo(x2,y2);g.lineTo(x2-12*Math.cos(a+.55),y2-12*Math.sin(a+.55));g.stroke();}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t));}
export function drawTitles(g,h,alpha){
 if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.68);shade.addColorStop(0,'rgba(2,8,16,.74)');shade.addColorStop(.65,'rgba(2,8,16,.40)');shade.addColorStop(1,'rgba(2,8,16,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.68);
 const y=h*.27;g.font='400 112px "Michroma"';g.textBaseline='alphabetic';const left='LAYER ',right='2',wl=g.measureText(left).width,wr=g.measureText(right).width,x=960-(wl+wr)/2;
 const metallic=g.createLinearGradient(0,y-95,0,y);metallic.addColorStop(0,'#f6fafb');metallic.addColorStop(.48,'#d3e0e6');metallic.addColorStop(.55,'#a7bac7');metallic.addColorStop(1,'#ecf5fa');g.shadowColor='rgba(119,203,234,.32)';g.shadowBlur=20;g.fillStyle=metallic;g.fillText(left,x,y);
 const blue=g.createLinearGradient(0,y-95,0,y);blue.addColorStop(0,'#51d5ed');blue.addColorStop(.5,'#0bafd7');blue.addColorStop(1,'#007ba8');g.fillStyle=blue;g.fillText(right,x+wl,y);
 g.shadowBlur=0;g.font='400 28px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tracking=10,widths=[...name].map(c=>g.measureText(c).width),total=widths.reduce((a,b)=>a+b,0)+tracking*(name.length-1);let nx=960-total/2;[...name].forEach((c,i)=>{g.fillText(c,nx,y+82);nx+=widths[i]+tracking;});
 g.strokeStyle='#edaa58';g.lineWidth=2;g.shadowColor='#edaa58';g.shadowBlur=10;for(const[a,b]of[[960-total/2-95,960-total/2-32],[960+total/2+32,960+total/2+95]]){g.beginPath();g.moveTo(a,y+72);g.lineTo(b,y+72);g.stroke();}g.restore();
}
export function drawTechnical(g,t,shot){
 const m=shot.mode,n=networkState(t);if(['osi','domain','final','wire','known'].includes(m))return;
 if(m==='arp'){
  const a=arpState(t),{x,y,w}=panel(g,'ARP / IPv4 → MAC','VLAN 10 / SAME SUBNET');text(g,'HOST-A',x,y,24,C.cyan);text(g,HOSTS[0].ip,x,y+32,21);text(g,'HOST-B',x+273,y,24,C.cyan);text(g,HOSTS[1].ip,x+273,y+32,21);
  arrow(g,a.reply?x+362:x+75,y+80,a.reply?x+75:x+362,y+80,a.reply?C.green:C.amber);text(g,a.stage,x,y+126,21,a.cache.length?C.green:C.amber);text(g,'ETHERTYPE 0x0806',x,y+166,18,C.dim);
  text(g,a.reply?'REPLY DA':'REQUEST DA',x,y+207,18,C.dim);text(g,a.reply?a.replyDA:a.requestDA,x,y+239,22);
  text(g,'HOST-A / ARP CACHE',x,y+292,20,C.cyan);text(g,a.cache.length?HOSTS[1].ip+' →': 'No entry yet',x,y+327,20);if(a.cache.length)text(g,HOSTS[1].mac,x,y+359,22);
  wrap(g,'Host ARP cache maps IP to MAC. The switch learns source MAC to port.',x,y+397,w,17);return;
 }
 if(m==='vlans'){
  const{x,y,w}=panel(g,'VLAN 10 / VLAN 3','SEPARATE BROADCAST DOMAINS');
  for(const [i,id,hosts,col]of[[0,10,'HOST-A / HOST-B / HOST-C',C.cyan],[1,3,'HOST-D / HOST-E',C.violet]]){
   const yy=y+i*130;g.strokeStyle=col;g.lineWidth=2;g.strokeRect(x,yy,w,106);text(g,`VLAN ${id}`,x+14,yy+31,25,col);text(g,hosts,x+14,yy+61,17);arrow(g,x+18,yy+83,x+w-18,yy+83,col);
  }
  text(g,'TRUNK: TAGGED 10,3',x,y+297,22,C.amber);text(g,'ACCESS: ASSIGNED VLAN',x,y+336,20,C.dim);
  wrap(g,'One trunk carries both VLANs. Broadcasts remain inside their own domain.',x,y+389,w,19);return;
 }
 if(['tag','trunk','access'].includes(m)){
  const f=frameState(t,shot),{x,y,w}=panel(g,'802.1Q / FRAME TAG',f.access?'ACCESS / UNTAGGED':'TRUNK / TAGGED VLANS');
  for(const [i,k,val]of[[0,'DEST MAC',f.da],[1,'SRC MAC',f.sa],[2,'TPID',f.tagged?'0x8100':'—'],[3,'PCP / DEI','0 / 0'],[4,'VLAN ID',f.tagged?f.vlan:'Access VLAN '+f.vlan],[5,'ETHERTYPE',f.etherType]]){text(g,k,x,y+i*54,17,C.dim);text(g,val,x,y+26+i*54,22,i===4?C.violet:C.white);}
  wrap(g,'4-byte tag between source MAC and EtherType. Access egress removes the tag.',x,y+356,w,17);return;
 }
 if(['setup','encapsulate','transport','decapsulate'].includes(m)){
  const s=tunnelState(t),{x,y,w}=panel(g,'L2TPv3 / PSEUDOWIRE','ETHERNET OVER IP');text(g,s.stage,x,y,21,C.amber);
  const blocks=[['OUTER IP / PROTO 115','192.0.2.1 → 198.51.100.2',C.amber],['L2TPv3','Session ID / Ethernet PW',C.amber],['INNER ETHERNET','MAC addresses / VLAN 10',C.cyan]];
  blocks.forEach(([k,v,col],i)=>{g.strokeStyle=col;g.strokeRect(x,y+38+i*84,w,72);text(g,k,x+13,y+65+i*84,20,col);text(g,v,x+13,y+93+i*84,17);});
  text(g,'ENCAPSULATE → TRANSPORT',x,y+334,20,C.cyan);text(g,'→ DECAPSULATE',x,y+365,20,C.cyan);wrap(g,'Two endpoints emulate an Ethernet link. Inner VLAN retained. Local FCS regenerated.',x,y+400,w,17);return;
 }
 if(m==='lldp'){
  const{x,y,w}=panel(g,'LLDP / NEIGHBOURS','ONE LINK / LOCAL ANNOUNCEMENTS');text(g,'SW-01',x,y,26,C.green);lldpNeighbours('SW-01').forEach((r,i)=>{text(g,`P${r.localPort} → ${r.device} / P${r.remotePort}`,x,y+65+i*65,22);});text(g,'CHASSIS ID',x,y+210,17,C.dim);text(g,'PORT ID / TTL',x,y+246,22);wrap(g,'Announcements stop at the direct neighbour. No network-wide flooding.',x,y+325,w,20);return;
 }
 if(['lacp','flows'].includes(m)){
  const{x,y,w}=panel(g,'LACP / PORT-CHANNEL','TWO MEMBERS / ONE LOGICAL LINK');text(g,n.lacp,x,y,18,C.green);for(let i=0;i<2;i++){text(g,`MEMBER ${i+1} / P${i?27:25}`,x,y+65+i*70,22,i?C.amber:C.cyan);arrow(g,x+30,y+91+i*70,x+w-35,y+91+i*70,i?C.amber:C.cyan);}
  text(g,'PO-01',x,y+232,28,C.green);text(g,'FLOW A → MEMBER 1',x,y+280,21,C.cyan);text(g,'FLOW B → MEMBER 2',x,y+316,21,C.amber);wrap(g,'Stable per-flow distribution. A single flow does not gain the sum of both link rates.',x,y+373,w,18);return;
 }
 if(['stp','bpdu','recover','loop'].includes(m)){
  const{x,y,w}=panel(g,m==='loop'?'LOOP DEMO / STP OFF':'STP / LOOP PREVENTION',m==='loop'?'REDUNDANT FORWARDING CYCLE':'CLASSIC STP / PORT STATES');
  text(g,m==='loop'?'FRAME COPIES':'ROOT BRIDGE',x,y,18,C.dim);text(g,m==='loop'?'RECIRCULATING':n.root,x,y+37,28,m==='loop'?C.red:C.amber);
  DEVICES.forEach((d,i)=>{text(g,`${d.id} / BID ${d.priority}`,x,y+92+i*36,21,i?C.dim:C.amber);});
  text(g,'SW-03 / P26',x,y+244,21);text(g,n.port,x,y+283,27,n.blocked?C.amber:n.loop?C.red:C.green);
  wrap(g,m==='loop'?'Duplicate frames persist in the active cycle. MAC learning can flap between ports.':n.converging?'BPDUs restore the tree. Listening and learning precede forwarding.':'Physical redundancy remains. Blocking stops user traffic; BPDUs can still be received.',x,y+345,w,19);return;
 }
 const{x,y,w}=panel(g,m==='unknown'?'UNKNOWN UNICAST':m==='broadcast'?'BROADCAST DOMAIN':m==='move'?'MAC MOVE':'MAC TABLE / LEARNING','VLAN + MAC → INGRESS PORT');
 text(g,'SW-01',x,y,25,C.cyan);text(g,'VLAN / SOURCE MAC / PORT',x,y+43,17,C.dim);
 n.macEntries.slice(0,4).forEach((e,i)=>{text(g,`V${e.vlan}  ${e.mac}`,x,y+88+i*61,18,e.vlan===3?C.violet:C.cyan);text(g,`→ P${e.port}`,x+355,y+88+i*61,21,e.flapping?C.red:C.amber);});
 wrap(g,m==='unknown'?'Host ARP cache is resolved; switch FDB entry was aged out. Flood only within VLAN 10.':m==='broadcast'?'Broadcasts stay within their VLAN. No ingress reflection; no blocked egress.':m==='move'?`HOST-A now on P${n.hostAPort}. Source learning updates the existing entry.`:'Learn the source address. Look up the destination address to select the egress.',x,y+365,w,19);
}
export const LOGS=[
 [9.02,'L2-6-DOMAIN','Switching domain active.'],[21.7,'ARP-6-REQUEST','VLAN 10 / broadcast request.'],[26.8,'ARP-6-REPLY','Unicast reply received.'],[30.211,'ARP-5-RESOLVED','10.0.10.22 resolved.'],
 [31.7,'FDB-6-MISS','Unknown unicast / VLAN 10 flood.'],[35.4,'FDB-6-HIT','Destination learned / selected egress.'],[38.94,'FDB-6-LEARN','Source MAC learned on ingress.'],[42.9,'DOT1Q-6-TAG','802.1Q / VLAN tag inserted.'],[46.62,'STP-5-ROOT','SW-01 selected as root bridge.'],[48.76,'STP-5-PORT','SW-03 P26 / blocking.'],[61.3,'STP-6-BPDU','Root information received.'],[63.5,'LINK-5-UP','Trunk up / VLAN 10,3 allowed.'],[64.4,'L2-6-ACCESS','Access egress / tag removed.'],[66.92,'FDB-5-MOVE','HOST-A / P1 → P3.'],
 [70.5,'L2TP-6-CONTROL','Control connection establishing.'],[74.3,'L2TP-5-SESSION','Ethernet pseudowire up.'],[81,'L2TP-6-EGRESS','Inner Ethernet frame delivered.'],[84,'STP-4-DEMO','Loop demo / STP disabled.'],[89.831,'FDB-4-FLAP','Source MAC alternates between ports.'],[106.9,'STP-5-ENABLE','Spanning tree enabled.'],[108.591,'STP-6-LEARNING','Port transition / learning.'],[113,'STP-5-PORT','SW-03 P26 blocking / tree restored.'],[142.5,'FDB-6-LEARN','VLAN 3 source learned.'],[146.48,'DOT1Q-6-TAG','802.1Q / trunk encapsulation.'],[150.16,'STP-6-BPDU','Stable root / redundant path blocked.'],[165.92,'LINK-5-UP','Trunk up.'],[166.72,'L2-6-ACCESS','Access egress.'],[167.86,'FDB-5-MOVE','HOST-A / P3 → P7.'],[171.76,'LLDP-6-NEIGHBOUR','Direct neighbour identified.'],[178.5,'LACP-6-PARTNER','Actor / partner negotiation.'],[183.7,'LACP-5-BUNDLE','PO-01 collecting / distributing.'],[185.92,'L2-6-FLOW','Stable flow-to-member selection.'],
].map(([time_s,tag,message],i)=>({id:`LOG${String(i+1).padStart(3,'0')}`,time_s,tag,message,origin:'redaktionelles Netzwerkszenario'}));
export function drawSyslog(g,t,h){
 const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+7).slice(-3);if(!rows.length)return;
 const shade=g.createLinearGradient(0,h-188,0,h);shade.addColorStop(0,'rgba(3,9,17,0)');shade.addColorStop(1,'rgba(3,9,17,.88)');g.fillStyle=shade;g.fillRect(0,h-188,1920,188);
 rows.forEach((r,i)=>{g.save();g.globalAlpha=(i===rows.length-1?1:.45)*(1-smooth(r.time_s+6.5,r.time_s+7,t));const y=h-55-(rows.length-1-i)*33,stamp=`${String(Math.floor(r.time_s/60)).padStart(2,'0')}:${(r.time_s%60).toFixed(2).padStart(5,'0')}`;
  text(g,stamp,64,y,19,C.dim);const tag=`%${r.tag}: `;text(g,tag,180,y,19,r.tag.includes('-4-')?C.amber:C.cyan);const width=g.measureText(tag).width;const typed=r.message.slice(0,Math.ceil(clamp((t-r.time_s)/.55)*r.message.length));text(g,typed,180+width,y,19);g.restore();});
}
