import {TITLES,SOURCE_START,T_SPT} from './config.js';
import {smooth,clamp} from './timeline.js';
import {GROUP,SOURCE_IP,RP_IP,SEGMENTS,CORES,KEY,SILENT,MESSAGES,LOGS,REGISTER,REGISTER_STOP,SPT_JOIN,SPT_PRUNE,hookWord,counters,snoopingTable,mroute,member,receiving,seatId,edgeOn,upstream} from './model.js';
import {SEG} from './zones/segment.js';
export const DOCK={x:64,y:136,w:510,h:560};
const C={cyan:'#59d8ed',orange:'#ff9a3c',warm:'#ffd9a8',emerald:'#3fe6a0',violet:'#b39bff',red:'#ff6f7d',white:'#daedf5',dim:'#86a8bc',faint:'#4f6b80'};
export function text(g,s,x,y,size=22,col=C.white){g.font=`${size}px "JetBrains Mono"`;g.fillStyle=col;g.fillText(String(s),x,y);}
function wrap(g,s,x,y,width,size=17,col=C.dim){g.font=`${size}px "JetBrains Mono"`;let row='',i=0;for(const word of s.split(' ')){const test=row?row+' '+word:word;if(g.measureText(test).width>width&&row){text(g,row,x,y+i*(size+7),size,col);row=word;i++;}else row=test;}text(g,row,x,y+i*(size+7),size,col);}
function panel(g,title,sub,accent=C.cyan){const{x,y,w,h}=DOCK;g.fillStyle='rgba(4,13,25,.9)';g.fillRect(x,y,w,h);g.strokeStyle='#27496a';g.lineWidth=1;g.strokeRect(x,y,w,h);g.fillStyle=accent;g.fillRect(x,y,4,34);text(g,title,x+24,y+43,24,accent);text(g,sub,x+24,y+78,16,C.dim);return{x:x+24,y:y+122,w:w-48,bottom:y+h-118};}
// A step list: done steps green, the running one bright, pending ones faint.
function steps(g,x,y,list,t){list.forEach(([label,t0,t1],i)=>{const done=t>=t1,run=t>=t0&&t<t1,col=done?C.emerald:run?C.warm:C.faint;text(g,done?'✓':run?'›':'·',x,y+i*40,20,col);text(g,label,x+30,y+i*40,19,col);});}
function table(g,x,y,r){if(!r)return 0;text(g,r.entry,x,y,19,C.cyan);text(g,`IIF  ${r.iif}`,x,y+30,18);text(g,`OIL  ${r.oil.length?r.oil.join(' · '):'—'}`,x,y+58,18,r.oil.length?C.orange:C.faint);if(r.flags)text(g,`     ${r.flags}`,x,y+86,16,C.dim);return r.flags?118:90;}
export const technicalModes=new Set(['register','firstjoin','unicast','anycast','multicast','igmp-report','snooping','igmp-query','count','pim-hello','rp-source','pim-join','tree','spt','flood','snoop-on','layers','outro-query','query','rp-memory']);
// Story seats and the routers on their paths come from the model, so the panels follow the scenario.
const FIRST=seatId(KEY.first),FIRST_SEG=SEGMENTS[FIRST.seg],V2=seatId(KEY.verse2),V2_SEG=SEGMENTS[V2.seg];
const first=MESSAGES.filter(m=>m.t0>=26&&m.t0<32);
const chainUp=(router,spt)=>{const out=[router];let n=router;while(n!=='R1'){n=upstream(n,spt);out.push(n);}return out;};
export function drawTechnical(g,t,shot){
 const m=shot.mode,seg=SEGMENTS[SEG],ports=seg.seats.length;
 if(m==='register'){const{x,y,w,bottom}=panel(g,'PIM-SM / REGISTER','SOURCE ACTIVE · NO RECEIVERS YET',C.orange);text(g,`S  ${SOURCE_IP}`,x,y,22,C.orange);text(g,`G  ${GROUP}`,x,y+34,22,C.cyan);
  steps(g,x,y+92,[['DATA → R1 (FHR)',SOURCE_START,SOURCE_START+.3],['REGISTER → RP (unicast)',...REGISTER],['RP: no (*,G) receivers',REGISTER[1],REGISTER_STOP[0]],['REGISTER-STOP → R1',...REGISTER_STOP],['R1 forwards nowhere',REGISTER_STOP[1],REGISTER_STOP[1]+.4]],t);
  wrap(g,'The RP learns the source from the encapsulated Register. Without receivers it answers with Register-Stop.',x,bottom,w);return;}
 if(m==='firstjoin'){const{x,y,w,bottom}=panel(g,'FIRST RECEIVER',`VLAN ${FIRST_SEG.vlan} · ${FIRST.ip}`,C.emerald);
  const rep=first.find(x=>x.kind==='report'),j1=first.find(x=>x.from===FIRST_SEG.router),j2=first.find(x=>x.from==='R2');let arrive=31.3;while(!receiving(FIRST.id,arrive)&&arrive<40)arrive+=.05;
  steps(g,x,y,[[`IGMP REPORT ${GROUP}`,rep.t0,rep.t0+1.6],[`${FIRST_SEG.router} → RP  (*,G) JOIN`,j1.t0,j1.t1],['RP → R1  (S,G) JOIN',j2.t0,j2.t1],[`DATA  R1 → RP → ${FIRST_SEG.router} → ${FIRST_SEG.switch}`,j2.t1,arrive],['RECEIVING',arrive,arrive+.3]],t);
  wrap(g,'Hops and timers are stretched for the film. The RP joins toward the source once a receiver exists.',x,bottom,w);return;}
 if(m==='unicast'){const{x,y,w,bottom}=panel(g,'UNICAST','ONE PATH · ONE NAME',C.orange);text(g,'SOURCE LINK',x,y,18,C.dim);text(g,'3 COPIES',x+200,y,26,C.orange);text(g,'RECEIVERS',x,y+48,18,C.dim);text(g,'3',x+200,y+48,26);
  ['10.1.1.11','10.1.1.12','10.1.1.13'].forEach((ip,i)=>text(g,`copy ${i+1} → dst ${ip}`,x,y+118+i*34,19,C.warm));text(g,'10.1.1.14 · not interested',x,y+232,18,C.faint);
  wrap(g,'Every receiver gets its own copy. Load on the source link grows with each listener.',x,bottom,w);return;}
 if(m==='anycast'){const{x,y,w,bottom}=panel(g,'ANYCAST','SAME ADDRESS · CLOSEST INSTANCE',C.cyan);text(g,'ADDRESS',x,y,18,C.dim);text(g,'192.0.2.53',x+170,y,24,C.cyan);text(g,'INSTANCES',x,y+46,18,C.dim);text(g,'A · B · C',x+170,y+46,22);
  text(g,'CLIENT 1 → A   metric 2',x,y+116,19,C.warm);text(g,'CLIENT 2 → C   metric 2',x,y+152,19,C.warm);text(g,'B              metric 5',x,y+188,19,C.faint);
  wrap(g,'Routing delivers to the topologically nearest instance. Different routes, same address — still one-to-one.',x,bottom,w);return;}
 if(m==='multicast'){const{x,y,w,bottom}=panel(g,'MULTICAST',`GROUP ${GROUP}`,C.emerald);const n=t>=54.7?3:2;text(g,'SOURCE LINK',x,y,18,C.dim);text(g,'1 COPY',x+200,y,26,C.orange);text(g,'MEMBERS',x,y+48,18,C.dim);text(g,String(n),x+200,y+48,26,C.emerald);
  text(g,`router replicates → ${n}`,x,y+118,19,C.warm);text(g,t>=54.1?'10.1.1.13 · REPORT → joined':'10.1.1.13 · listening soon',x,y+154,18,t>=54.1?C.emerald:C.faint);text(g,'10.1.1.14 · not joined · no copy',x,y+190,18,C.faint);
  wrap(g,'One copy per link. The router copies the stream only toward members of the group.',x,bottom,w);return;}
 if(m==='igmp-report'){const h=seatId(KEY.igmp),{x,y,w,bottom}=panel(g,'IGMPv2 MEMBERSHIP REPORT',`HOST ${h.ip} · ${h.port}`,C.emerald);
  [['TYPE','0x16'],['GROUP',GROUP],['DST IP',GROUP],['TTL','1'],['DST MAC','01:00:5e:01:01:01']].forEach(([k,v],i)=>{text(g,k,x,y+i*36,18,C.dim);text(g,v,x+150,y+i*36,20,i===1?C.emerald:C.white);});
  text(g,`${seg.router} Vlan${seg.vlan} → OIL`,x,y+210,19,edgeOn(`${seg.router}>${seg.switch}`,t)?C.orange:C.faint);
  wrap(g,`The report stays in the local segment (TTL 1). The router keeps VLAN ${seg.vlan} in its outgoing list for the group.`,x,bottom,w);return;}
 if(m==='snooping'||m==='snoop-on'){const rows=snoopingTable(SEG,t),{x,y,w,bottom}=panel(g,m==='snooping'?`IGMP SNOOPING · ${seg.switch}`:'WITH IGMP SNOOPING',`VLAN ${seg.vlan} · GROUP ${GROUP}`,C.emerald);
  text(g,`Gi1/0/25 → ${seg.router}   mrouter`,x,y,18,C.violet);rows.slice(0,7).forEach((h,i)=>text(g,`${h.port.padEnd(9)} ${h.ip}`,x,y+36+i*28,18,C.emerald));text(g,`${rows.length} of ${ports} access ports forward`,x,y+44+Math.min(7,rows.length)*28,17,C.dim);
  wrap(g,m==='snooping'?'The switch listens to IGMP and forwards the group only to ports with members.':'No flood for the silent: ports without members stay dark.',x,bottom,w);return;}
 if(m==='flood'){const n=seg.seats.filter(h=>member(h,t)).length,{x,y,w,bottom}=panel(g,'WITHOUT IGMP SNOOPING',`COMPARISON · VLAN ${seg.vlan}`,C.red);
  text(g,'PORTS FORWARDING',x,y,18,C.dim);text(g,`${ports} / ${ports}`,x+250,y,24,C.red);text(g,'MEMBERS',x,y+46,18,C.dim);text(g,String(n),x+250,y+46,24,C.emerald);text(g,'UNWANTED COPIES',x,y+92,18,C.dim);text(g,String(ports-n),x+250,y+92,24,C.red);
  wrap(g,'A switch that does not listen to IGMP floods the group to every port of the VLAN. Shown here only as a comparison.',x,bottom,w);return;}
 if(m==='igmp-query'||m==='query'||m==='outro-query'){const q=[75.1,130.74,190.64,197.18,252].filter(v=>v<=t+.01).at(-1)??75.1,{x,y,w,bottom}=panel(g,'IGMP GENERAL QUERY','QUERIERS · DST 224.0.0.1',C.violet);
  if(m==='igmp-query'){[['TYPE','0x11'],['DST IP','224.0.0.1'],['GROUP','0.0.0.0'],['MAX RESP','10 s']].forEach(([k,v],i)=>{text(g,k,x,y+i*34,18,C.dim);text(g,v,x+150,y+i*34,20);});
   const replies=MESSAGES.filter(r=>r.kind==='report'&&r.edge.startsWith(`${seg.switch}>`)&&r.reverse&&r.t0>76&&r.t0<80);text(g,`REPLIES · VLAN ${seg.vlan}`,x,y+160,17,C.dim);replies.slice(0,8).forEach((r,i)=>{const h=seatId(r.from.slice(1)),done=t>=r.t1;text(g,`${done?'✓':'·'} ${h.ip}`,x+(i%2)*220,y+196+(i>>1)*30,18,done?C.emerald:C.faint);});}
  else{const counts=SEGMENTS.map(s=>s.seats.filter(h=>member(h,q)).length),reply=counts.filter(Boolean).length;
   [['VLANS QUERIED',String(SEGMENTS.length),C.violet],['REPLYING',String(reply),C.emerald],['SILENT',String(SEGMENTS.length-reply),C.red],['MEMBERS',String(counts.reduce((a,b)=>a+b,0)),C.emerald]].forEach(([k,v,col],i)=>{text(g,k,x,y+i*50,18,C.dim);text(g,v,x+260,y+i*50+3,28,col);});
   SEGMENTS.filter((s,i)=>!counts[i]).slice(0,3).forEach((s,i)=>text(g,`VLAN ${s.vlan}  ${s.switch} · no reply`,x,y+214+i*28,17,C.red));}
  wrap(g,'The querier asks who still listens; members answer within the max response time. Silence ages a group out.',x,bottom,w);return;}
 if(m==='count'){const c=counters(t),{x,y,w,bottom}=panel(g,'ONE TO MANY','NOT ONE BY ONE',C.orange);
  [['SOURCE LINK',`${c.copies} copy`,C.orange],['LISTENING',String(c.listening),C.emerald],['SEGMENTS',`${c.segments} / ${SEGMENTS.length}`,C.cyan],['TREE LINKS',String(c.links),C.warm]].forEach(([k,v,col],i)=>{text(g,k,x,y+i*62,18,C.dim);text(g,v,x+220,y+i*62+4,34,col);});
  wrap(g,'Each link carries the stream once, however many receivers listen behind it.',x,bottom,w);return;}
 if(m==='pim-hello'){const{x,y,w,bottom}=panel(g,'PIM NEIGHBOURS','HELLO → 224.0.0.13 · LAYER 3',C.cyan);
  const links=[['R1','R2'],['R1','R3'],['R1','R4'],['R1','R5'],['R2','R3'],['R3','R4'],['R2','R5']];links.forEach(([a,b],i)=>{const seen=MESSAGES.some(m=>m.kind==='hello'&&m.from===b&&m.to===a&&t>=m.t1);text(g,`${a} ↔ ${b}`,x,y+i*31,19);text(g,seen?'UP':'…',x+170,y+i*31,19,seen?C.emerald:C.faint);});
  const lhr=MESSAGES.filter(m=>m.kind==='hello'&&/^R([6-9]|1\d)$/.test(m.from)&&t>=m.t1).length;text(g,`+ 12 core ↔ LHR links  ${lhr?'UP':'…'}`,x,y+links.length*31+6,18,lhr?C.emerald:C.faint);
  wrap(g,'PIM builds the distribution tree between routers. IGMP stays at the edge, between hosts and their router.',x,bottom,w);return;}
 if(m==='rp-source'||m==='rp-memory'){const r=mroute('R2',t),{x,y,w,bottom}=panel(g,'RENDEZVOUS POINT · R2',`RP ${RP_IP} · PIM-SM`,C.violet);const h=table(g,x,y,r.star);table(g,x,y+h+14,r.sg);
  wrap(g,m==='rp-source'?'The source\'s router registered here; receivers\' routers join here. In PIM-SM the RP is where both meet.':'The RP keeps the source it learned. Later routers can still find the group through it.',x,bottom,w);return;}
 if(m==='pim-join'){const j=MESSAGES.filter(x=>x.kind==='join'&&x.t0>117&&x.t0<120.5),{x,y,w,bottom}=panel(g,'(*,G) JOIN → RP',`${V2.ip} · VLAN ${V2_SEG.vlan} · ${V2_SEG.router}`,C.cyan);const via=chainUp(V2_SEG.router,false);
  steps(g,x,y,[[`IGMP REPORT ${GROUP}`,117.18,117.98],...j.map(m=>[`${m.from} → ${m.to}  ${m.label}`,m.t0,m.t1]),[`DATA  ${via.slice(0,-1).reverse().join(' → ')}`,j.at(-1).t1,j.at(-1).t1+1.4]],t);
  wrap(g,'Each router on the way creates (*,G) state and forwards the join until it reaches the tree — here across the core ring.',x,bottom,w);return;}
 if(m==='tree'||m==='spt'){const r=mroute('R3',t),{x,y,w,bottom}=panel(g,m==='spt'?'SPT SWITCHOVER · CORE':'SHARED TREE · R3',m==='spt'?`(${SOURCE_IP}, ${GROUP})`:`RP ${RP_IP}`,m==='spt'?C.orange:C.cyan);
  if(m==='spt'){steps(g,x,y,[['LHRs (S,G) JOIN → core',T_SPT,T_SPT+.3],['R3 · R4 · R5 (S,G) JOIN → R1',SPT_JOIN-.45,SPT_JOIN],['(S,G,rpt) PRUNE on the ring',SPT_JOIN,SPT_PRUNE],['ring stops carrying S',SPT_PRUNE,SPT_PRUNE+.8]],t);table(g,x,y+178,r.sg);
   wrap(g,'Timing is staged here; many routers switch to the shortest path right after the first packet.',x,bottom,w);}
  else{const h=table(g,x,y,r.star);table(g,x,y+h+14,r.sg);wrap(g,`Branches split only where a downstream router asked. ${[...SILENT].map(i=>SEGMENTS[i].switch).join(', ')} never had members and stay dark.`,x,bottom,w);}return;}
 if(m==='layers'){const u=smooth(156.38,160.18,t),b=seatId(KEY.bridge),bs=SEGMENTS[b.seg],chain=chainUp(bs.router,true),{x,y,w,bottom}=panel(g,'ACCESS → CORE','ONE TRANSMISSION · MANY DOORS',C.orange);
  const rows=[[bs.switch,'IGMP snooping · layer 2'],...chain.map(r=>[r,r==='R1'?'FHR · source side':r==='R2'?'RP · PIM-SM core':CORES.includes(r)?'core · PIM-SM':'querier · PIM DR'])];
  rows.forEach(([k,v],i)=>{const on=u>=i/rows.length;text(g,k,x,y+i*56,24,on?C.orange:C.faint);text(g,v,x+90,y+i*56,18,on?C.white:C.faint);});
  wrap(g,'From the access port up to the core, the same stream exists once on every link.',x,bottom,w);}
}
export function titleOpacity(t){const a=TITLES.intro,b=TITLES.outro;return Math.max(smooth(a[0],a[1],t)*(1-smooth(a[2],a[3],t)),smooth(b[0],b[1],t));}
export function drawTitles(g,h,alpha){
 if(!alpha)return;g.save();g.globalAlpha=alpha;const shade=g.createLinearGradient(0,0,0,h*.62);shade.addColorStop(0,'rgba(2,7,15,.72)');shade.addColorStop(.7,'rgba(2,7,15,.25)');shade.addColorStop(1,'rgba(2,7,15,0)');g.fillStyle=shade;g.fillRect(0,0,1920,h*.62);
 const y=h*.25;g.textAlign='center';g.font='400 124px "Michroma"';const metal=g.createLinearGradient(0,y-110,0,y);metal.addColorStop(0,'#f8fcfd');metal.addColorStop(.46,'#d6e6ef');metal.addColorStop(.56,'#8fb7d3');metal.addColorStop(1,'#eaf6fc');
 g.fillStyle=metal;g.shadowColor='rgba(90,166,255,.38)';g.shadowBlur=22;g.fillText('MULTICAST',960,y);
 g.shadowBlur=0;g.textAlign='left';g.font='400 30px "Michroma"';g.fillStyle='#e2edf3';const name='SAMUEL HEINRICH',tracking=11,widths=[...name].map(c=>g.measureText(c).width),total=widths.reduce((a,b)=>a+b,0)+tracking*(name.length-1);let x=960-total/2;[...name].forEach((c,i)=>{g.fillText(c,x,y+92);x+=widths[i]+tracking;});
 g.strokeStyle='#ff9a3c';g.lineWidth=2;g.shadowColor='#ff9a3c';g.shadowBlur=10;for(const[a,b]of[[960-total/2-110,960-total/2-34],[960+total/2+34,960+total/2+110]]){g.beginPath();g.moveTo(a,y+82);g.lineTo(b,y+82);g.stroke();}g.restore();
}
const HOOK_SUB={'MEMBERSHIP REPORT':'IGMP · a host announces the group','JOIN':'a new member becomes part of the tree','LEAVE':'IGMPv2 · a host leaves the group','QUERY':'IGMP · group-specific query','GROUP':GROUP,'SOURCE':SOURCE_IP,'R-P':`Rendezvous Point · ${RP_IP}`,'P-I-M':'Protocol Independent Multicast','I-G-M-P':'Internet Group Management Protocol'};
export function drawHook(g,t,tl,h){
 const hook=tl.analysis.lyrics.segments.filter(l=>l.section==='Hook'),i=hook.findLastIndex(l=>t>=l.start_s);if(i<0)return;const l=hook[i],next=hook[i+1]?.start_s??l.start_s+1.4;
 const age=t-l.start_s,end=Math.min(next,l.start_s+1.4);if(t>=end+.12)return;const word=hookWord(l.text),pop=1+.18*Math.exp(-age/.07),alpha=1-smooth(end-.05,end+.12,t);
 g.save();g.globalAlpha=alpha;g.textAlign='center';g.translate(960,h*.56);g.scale(pop,pop);g.font=`400 ${word.length>12?96:132}px "Michroma"`;g.fillStyle='#f3f8fb';g.shadowColor='rgba(255,154,60,.55)';g.shadowBlur=26;g.fillText(word,0,0);
 g.shadowBlur=0;g.font='24px "JetBrains Mono"';g.fillStyle='#ffc58f';g.fillText(HOOK_SUB[word]||'',0,56);g.restore();
}
export function drawHeader(g,t,shot){
 text(g,shot.zone==='compare'?'DELIVERY MODELS / ONE · NEAREST · MANY':'IP MULTICAST / PIM-SM · IGMPv2',64,61,18,'#accada');g.textAlign='right';
 if(shot.zone==='compare')text(g,'38–58 s · SIDE BY SIDE',1856,61,18,C.dim);
 else{const c=counters(t);text(g,t<SOURCE_START?'SOURCE IDLE':`GROUP ${GROUP} · ${c.listening} LISTENING · ${c.segments}/${SEGMENTS.length} SEGMENTS`,1856,61,18,t<SOURCE_START?C.dim:C.emerald);}
 g.textAlign='left';
}
export function drawSyslog(g,t,h){const rows=LOGS.filter(e=>e.time_s<=t&&t<e.time_s+6).slice(-3);if(!rows.length)return;const shade=g.createLinearGradient(0,h-180,0,h);shade.addColorStop(0,'rgba(3,9,17,0)');shade.addColorStop(1,'rgba(3,9,17,.86)');g.fillStyle=shade;g.fillRect(0,h-180,1920,180);rows.forEach((r,i)=>{g.save();g.globalAlpha=(i===rows.length-1?1:.45)*(1-smooth(r.time_s+5.5,r.time_s+6,t));const y=h-52-(rows.length-1-i)*32,stamp=`${String(Math.floor(r.time_s/60)).padStart(2,'0')}:${(r.time_s%60).toFixed(2).padStart(5,'0')}`;text(g,stamp,64,y,18,C.dim);const tag=`%${r.tag}: `;text(g,tag,178,y,18,r.tag.startsWith('PIM')?C.cyan:r.tag.includes('LEAVE')||r.tag.includes('PRUNE')?C.red:r.tag.includes('QUERY')?C.violet:C.emerald);const width=g.measureText(tag).width;text(g,r.message.slice(0,Math.ceil(clamp((t-r.time_s)/.5)*r.message.length)),178+width,y,18);g.restore();});}
