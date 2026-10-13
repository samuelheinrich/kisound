// Authored IP-multicast scenario V2: a full stadium. Layout, membership schedule and the distribution
// tree that follows from it (IGMP at the edge, PIM-SM between routers). Everything is precomputed once
// at import into time intervals, so every query is a pure function of absolute time. No three.js here:
// the tests run this module directly in Node.
import {DURATION,SOURCE_START,T_SPT,SHOTS} from './config.js';

export const GROUP='239.1.1.1',SOURCE_IP='10.0.0.1',RP_IP='10.255.0.2';
export const SPEED=12,SPACING=1,DELTA=SPACING/SPEED;
export const LMQ=1.6;            // compressed last-member query time before a port is removed
export const H2=.3,H3=.45;       // compressed IGMP hop and PIM hop durations
export const REGISTER=[11.55,12.85],REGISTER_STOP=[15.2,16.2];
export const SPT_JOIN=T_SPT+.3+H3,SPT_PRUNE=SPT_JOIN+H3;   // cores join R1 (S,G), then prune (S,G,rpt) on the ring
const END=DURATION+5;

// Stadium: an ellipse with half axes RX/RZ at s=1. Angles run from +z towards +x.
export const RX=62,RZ=46;
const deg=Math.PI/180;
export const ell=(s,a,y)=>[+(s*RX*Math.sin(a*deg)).toFixed(4),y,+(s*RZ*Math.cos(a*deg)).toFixed(4)];
export const TIERS={
 field:{rows:[[.32,0],[.36,0],[.40,0]],offsets:[-9,-3,3,9],host:1.6},
 lower:{rows:[[.655,1.6],[.71,3]],offsets:[-9.6,-4.8,0,4.8,9.6],host:1.25},
 upper:{rows:[[.835,8.5],[.89,10.5]],offsets:[-9.1,-4.55,0,4.55,9.1],host:1.25},
};
export const NODES={SRC:{pos:[0,3.4,0],label:'SOURCE',sub:SOURCE_IP},R1:{pos:[0,.6,4.8],label:'R1',sub:'FHR / DR'}};
export const CORES=['R2','R3','R4','R5'];
CORES.forEach((id,j)=>{NODES[id]={pos:ell(.17,45+90*j,1),label:id==='R2'?'R2 · RP':id,sub:id==='R2'?RP_IP:'CORE',angle:45+90*j};});
export const DISTS=Array.from({length:12},(_,k)=>{const id=`R${6+k}`,angle=15+30*k;NODES[id]={pos:ell(.5,angle,1.3),label:id,sub:'LHR / QUERIER',angle};return{id,angle,core:CORES[k/3|0]};});
const segs=[];
DISTS.forEach(d=>{segs.push({tier:'lower',router:d.id,core:d.core,angle:d.angle,swPos:ell(.6,d.angle,.9)},{tier:'upper',router:d.id,core:d.core,angle:d.angle,swPos:ell(.805,d.angle,8.75)});});
CORES.forEach((c,j)=>segs.push({tier:'field',router:c,core:c,angle:45+90*j,swPos:ell(.27,45+90*j,.8)}));
export const SEGMENTS=segs.map((s,i)=>{
 const sw=`SW${i+1}`,vlan=101+i,tier=TIERS[s.tier];NODES[sw]={pos:s.swPos,label:sw,sub:`VLAN ${vlan}`};
 const seats=[];tier.rows.forEach(([r,y],row)=>tier.offsets.forEach((o,col)=>{const k=seats.length,id=`H${i}.${k}`,base=ell(r,s.angle+o,y);
  NODES[id]={pos:[base[0],y+tier.host,base[2]],label:`10.1.${i+1}.${11+k}`};seats.push({id,seg:i,seat:k,row,col,tier:s.tier,core:s.core,base,ip:`10.1.${i+1}.${11+k}`,port:`Gi1/0/${k+1}`});}));
 return{index:i,...s,switch:sw,vlan,subnet:`10.1.${i+1}.0/24`,seats};
});
export const SEATS=SEGMENTS.flatMap(s=>s.seats);
export const seatId=key=>{const[s,k]=String(key).split('.').map(Number);return SEGMENTS[s].seats[k];};
export const segOf=sw=>SEGMENTS[+sw.slice(2)-1];

// Downstream edges. Geometry is a lifted quadratic curve so streams arc like on the cover.
const L3=[['SRC','R1'],...CORES.map(c=>['R1',c]),['R2','R3'],['R3','R4'],['R2','R5'],...DISTS.map(d=>[d.core,d.id])];
export const IDLE_LINKS=[['R4','R5']];   // physical link, never on a tree in this scenario
export const EDGES={};
function addEdge(from,to,kind,row=0){
 const a=NODES[from].pos,b=NODES[to].pos,len=Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
 const lift=kind==='seat'?.55+row*.75:kind==='access'?.14*len:from==='SRC'?1.4:.16*len,bow=kind==='l3'&&from!=='SRC'?.06*len:0;
 const dx=(b[0]-a[0])/len,dz=(b[2]-a[2])/len,c=[(a[0]+b[0])/2-dz*bow,(a[1]+b[1])/2+lift,(a[2]+b[2])/2+dx*bow];
 const pts=[],cum=[0];
 for(let i=0;i<=40;i++){const s=i/40,u=1-s;pts.push([0,1,2].map(j=>u*u*a[j]+2*u*s*c[j]+s*s*b[j]));if(i)cum.push(cum[i-1]+Math.hypot(...[0,1,2].map(j=>pts[i][j]-pts[i-1][j])));}
 EDGES[`${from}>${to}`]={id:`${from}>${to}`,from,to,kind,pts,cum,length:cum[40],on:[]};
}
L3.forEach(([a,b])=>addEdge(a,b,'l3'));
SEGMENTS.forEach(s=>{addEdge(s.router,s.switch,'access');s.seats.forEach(h=>addEdge(s.switch,h.id,'seat',s.tier==='field'?0:h.row));});
export function pointAt(edge,u,reverse=false){
 const e=typeof edge==='string'?EDGES[edge]:edge,d=Math.max(0,Math.min(e.length,reverse?e.length-u:u));
 let lo=0,hi=40;while(hi-lo>1){const m=(lo+hi)>>1;if(e.cum[m]<=d)lo=m;else hi=m;}
 const f=(d-e.cum[lo])/((e.cum[hi]-e.cum[lo])||1);return[0,1,2].map(j=>e.pts[lo][j]+(e.pts[hi][j]-e.pts[lo][j])*f);
}
// Unicast routing towards the RP (shared tree) and towards the source (SPT). Only R3, R4, R5 differ.
export const SPT_CORES=new Set(['R3','R4','R5']);
export function upstream(node,spt){
 if(node==='R1')return'SRC';if(node==='R2')return'R1';
 if(SPT_CORES.has(node))return spt?'R1':node==='R4'?'R3':'R2';
 const d=DISTS.find(x=>x.id===node);if(d)return d.core;
 if(node.startsWith('SW'))return segOf(node).router;
 return SEGMENTS[+node.slice(1).split('.')[0]].switch;
}
export function pathTo(node,spt){const out=[];let n=node;while(n!=='SRC'){const up=upstream(n,spt);out.unshift(EDGES[`${up}>${n}`]);n=up;}return out;}
for(const e of Object.values(EDGES)){
 const routes=[pathTo(e.to,false),pathTo(e.to,true)].filter(r=>r.at(-1)===e);
 const uniq=routes.filter((r,i)=>i===0||r.map(x=>x.id).join()!==routes[0].map(x=>x.id).join());
 e.routes=uniq.map(edges=>{let d=0;const offsets=edges.map(x=>{const o=d;d+=x.length;return o;});return{edges,offsets,start:offsets.at(-1),total:d};});
}

// Deterministic random numbers for the generated waves.
function mulberry(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
export const BEAT=60/132.6,BEAT_ORIGIN=.038;
const beatsIn=(a,b)=>{const out=[];for(let k=Math.ceil((a-BEAT_ORIGIN)/BEAT);BEAT_ORIGIN+k*BEAT<b;k++)out.push(+(BEAT_ORIGIN+k*BEAT).toFixed(3));return out;};

// Key seats carry the story; every other membership comes from seeded waves on the beat grid.
export const FOCUS=2;   // lower tier of R7: first receiver, IGMP close-up, bridge
export const KEY={first:'2.2',igmp:'2.6',early:'1.3',verse2:'15.2',verse2b:'8.3',hookReport:'4.1',hookJoin:'0.7',hookLeave:'1.3',bridge:'2.9'};
export const SILENT=new Set([17,22,27]);   // upper R14, lower R17, field under R5: never asked, never fed
const AUTHORED=[
 [26,'join',KEY.first,.8,1.85],[43,'join',KEY.early],[67.58,'join',KEY.igmp,.55],
 [117.18,'join',KEY.verse2,.4,.6],[120.6,'join',KEY.verse2b],
 [128.58,'join',KEY.hookReport],[129.82,'join',KEY.hookJoin],[130.1,'leave',KEY.hookLeave],
 [153.06,'join',KEY.bridge,.5],
];
const FRONT=['R2','R5'],BACK=['R3','R4'];
const WAVES=[
 {from:33,to:38.2,joins:4,cores:FRONT},{from:44,to:66.4,joins:12,cores:FRONT},{from:81.85,to:95.8,joins:44,cores:FRONT},
 {from:97,to:108.5,joins:10,cores:FRONT},{from:121.4,to:127.8,joins:8,cores:BACK},{from:136.2,to:148.6,joins:30,cores:CORES},
 {from:164.35,to:165.9,joins:46,cores:CORES,dense:true},{from:166.7,to:181.6,joins:22,cores:CORES},
 {from:182.3,to:196.6,joins:14,leaves:5,cores:CORES},{from:210.75,to:249,joins:24,leaves:16,cores:CORES},
];
const keySeats=new Set(Object.values(KEY));
function buildSchedule(){
 const rnd=mulberry(132606),authored=AUTHORED.map(([t,op,key,h2=H2,h3=H3])=>({t,op,key,h2,h3})),events=[...authored];
 const state=new Map();let next=0;   // seat key -> {member, left}; authored events replay in time order
 const replay=t=>{while(next<authored.length&&authored[next].t<=t){const e=authored[next++];state.set(e.key,{member:e.op==='join',left:e.op==='leave'?e.t:-1});}};
 for(const w of WAVES){
  const slots=w.dense?Array.from({length:w.joins},(_,i)=>+(w.from+i*(w.to-w.from)/w.joins).toFixed(3)):beatsIn(w.from,w.to);
  const pick=n=>Array.from({length:n},(_,i)=>slots[Math.floor(i*slots.length/n)]);
  const ops=[...pick(w.joins).map((t,i)=>({t:+(t+(slots.length<w.joins?(i%3)*.06:0)).toFixed(3),op:'join'})),...pick(w.leaves||0).map(t=>({t:+(t+BEAT/2).toFixed(3),op:'leave'}))].sort((a,b)=>a.t-b.t);
  for(const o of ops){
   replay(o.t);
   if(o.op==='join'){
    const pool=SEATS.filter(s=>{const k=`${s.seg}.${s.seat}`,st=state.get(k);return w.cores.includes(s.core)&&!SILENT.has(s.seg)&&!keySeats.has(k)&&!(st?.member)&&!(st&&o.t-st.left<LMQ+1);});
    if(!pool.length)continue;const s=pool[Math.floor(rnd()*pool.length)],k=`${s.seg}.${s.seat}`;state.set(k,{member:true,left:-1});events.push({t:o.t,op:'join',key:k,h2:H2,h3:H3});
   }else{
    const pool=[...state].filter(([k,v])=>v.member&&!keySeats.has(k)).map(([k])=>k).sort();if(!pool.length)continue;
    const k=pool[Math.floor(rnd()*pool.length)];state.set(k,{member:false,left:o.t});events.push({t:o.t,op:'leave',key:k,h2:H2,h3:H3});
   }
  }
 }
 return events.map(e=>({...e,seat:seatId(e.key)})).sort((a,b)=>a.t-b.t);
}
export const SCHEDULE=buildSchedule();
// Queries: general queries go to every VLAN, members reply inside the window. The group-specific
// query follows the hook's leave and reaches the ports that still belong to the group.
export const QUERIES=[
 {t:75.1,kind:'general',reply:[77.6,79.8]},{t:130.74,kind:'group',seg:seatId(KEY.hookLeave).seg},{t:190.64,kind:'general',reply:[191.6,194]},
 {t:197.18,kind:'general',reply:[199.5,202]},{t:252,kind:'general',reply:[253,255.6]},
];

// Interval helpers.
function merge(list){const s=list.filter(([a,b])=>b>a).sort((x,y)=>x[0]-y[0]),out=[];for(const iv of s){const last=out.at(-1);if(last&&iv[0]<=last[1])last[1]=Math.max(last[1],iv[1]);else out.push([...iv]);}return out;}
export function within(list,t){let lo=0,hi=list.length;while(lo<hi){const m=(lo+hi)>>1;if(list[m][0]<=t)lo=m+1;else hi=m;}return lo>0&&t<list[lo-1][1];}

export const MEMBERSHIP=new Map();   // seat id -> [{join, leave, h2, h3}]
for(const e of SCHEDULE){
 const list=MEMBERSHIP.get(e.seat.id)||[];MEMBERSHIP.set(e.seat.id,list);
 if(e.op==='join'){if(list.length&&list.at(-1).leave===END)throw Error(`${e.key} ist bereits Mitglied`);list.push({join:e.t,leave:END,h2:e.h2,h3:e.h3});}
 else{if(!list.length||list.at(-1).leave!==END)throw Error(`${e.key} ist kein Mitglied`);list.at(-1).leave=e.t;}
}
const contrib=new Map(Object.keys(EDGES).map(k=>[k,[]]));
const add=(id,a,b,h3=H3)=>contrib.get(id).push([a,b,h3]);
add('SRC>R1',SOURCE_START,END,0);
const chains={};for(const r of[...CORES,...DISTS.map(d=>d.id)]){const up=s=>{const out=[];let n=r;while(n!=='R1'){const u=upstream(n,s);out.push(`${u}>${n}`);n=u;}return out;};chains[r]={pre:up(false),post:up(true)};}
for(const seat of SEATS)for(const m of MEMBERSHIP.get(seat.id)||[]){
 const seg=SEGMENTS[seat.seg],off=m.leave+LMQ,r0=m.join+2*m.h2,r1=off,{pre,post}=chains[seg.router];
 add(`${seg.switch}>${seat.id}`,m.join+m.h2,off,0);add(`${seg.router}>${seg.switch}`,r0,r1,0);
 let c=0;while(c<pre.length&&pre[c]===post[c])c++;            // shared lower part of both routes
 pre.forEach((id,i)=>{const a=r0+(i+1)*m.h3,b=r1+(i+1)*m.h3;if(i<c){add(id,a,b,m.h3);return;}const end=Math.min(b,SPT_PRUNE+(i-c)*H3);if(a<end)add(id,a,end,m.h3);});
 post.forEach((id,i)=>{if(i<c)return;const a=r0+(i+1)*m.h3,b=r1+(i+1)*m.h3;if(b>SPT_JOIN)add(id,Math.max(a,SPT_JOIN),b,a>=SPT_JOIN?m.h3:H3);});
}
for(const[id,list]of contrib){
 const e=EDGES[id],sorted=list.slice().sort((a,b)=>a[0]-b[0]);e.on=merge(list.map(([a,b])=>[a,b]));
 // the PIM hop that produced each interval start, so join messages arrive exactly when forwarding begins
 e.joinHop=e.on.map(([a])=>sorted.find(c=>Math.abs(c[0]-a)<1e-9)?.[2]??H3);
}
export const edgeOn=(id,t)=>within(EDGES[id].on,t);

// Data packets: packet n leaves the source at n*DELTA and exists on an edge if every edge of its route
// forwarded at the moment the packet passed that edge's start. Prunes drain, joins grow from the root.
const ALL_EDGES=Object.values(EDGES);
export function packets(t,edges=ALL_EDGES){
 const out=[];
 for(const e of edges){if(!e.on.length)continue;
  for(const r of e.routes){
   const nMin=Math.ceil((t-(r.start+e.length)/SPEED)/DELTA),nMax=Math.floor((t-r.start/SPEED)/DELTA);
   for(let n=Math.max(nMin,Math.ceil(SOURCE_START/DELTA));n<=nMax;n++){
    const sent=n*DELTA;let ok=true;
    for(let i=0;i<r.edges.length&&ok;i++)ok=within(r.edges[i].on,sent+r.offsets[i]/SPEED);
    if(ok)out.push({edge:e,u:(t-sent)*SPEED-r.start,n});
   }
  }
 }
 return out;
}
// Data reaches a node at time t when a packet arriving there now passed every route edge while it forwarded.
const INCOMING={};for(const e of ALL_EDGES)(INCOMING[e.to]??=[]).push(e);
export function receiving(nodeId,t){
 if(nodeId==='SRC')return t>=SOURCE_START;
 return(INCOMING[nodeId]||[]).some(e=>e.routes.some(r=>r.edges.every((x,i)=>within(x.on,t-(r.total-r.offsets[i])/SPEED))));
}
export function member(seat,t){return(MEMBERSHIP.get(seat.id)||[]).some(m=>t>=m.join&&t<m.leave);}
export function membershipPhase(seat,t){
 const list=MEMBERSHIP.get(seat.id)||[];let joinAge=Infinity,leaveAge=Infinity;
 for(const m of list){if(t>=m.join)joinAge=Math.min(joinAge,t-m.join);if(t>=m.leave)leaveAge=Math.min(leaveAge,t-m.leave);}
 return{member:member(seat,t),joinAge,leaveAge,listening:list.length?receiving(seat.id,t):false};
}
const OUTGOING={};for(const e of ALL_EDGES)(OUTGOING[e.from]??=[]).push(e);
export const routerForwarding=(id,t)=>(OUTGOING[id]||[]).some(e=>within(e.on,t));
export const rpKnowsSource=t=>t>=REGISTER[1];
export const sptActive=t=>t>=SPT_JOIN;
// Deterministic seat choice for camera targets: 'key:first' or 'pick:<tier|any>:<core|any>'.
export function pickSeat(spec,t,salt=0,used=new Set()){
 if(spec.startsWith('key:'))return seatId(KEY[spec.slice(4)]);
 const[,tier,core]=spec.split(':'),ok=s=>(tier==='any'||s.tier===tier)&&(core==='any'||s.core===core)&&!used.has(s.id);
 const live=SEATS.filter(s=>ok(s)&&MEMBERSHIP.has(s.id)&&receiving(s.id,t)),pool=live.length?live:SEATS.filter(s=>ok(s)&&member(s,t));
 return pool.length?pool[Math.floor(mulberry(salt*7919+13)()*pool.length)]:seatId(KEY.first);
}
// Seat targets of all shots, resolved once in film order; no two shots aim at the same seat by chance.
export const SHOT_SEATS=new Map();
{const used=new Set(Object.values(KEY).map(k=>seatId(k).id));for(const s of SHOTS){if(!s.target||!/^(key|pick):/.test(s.target))continue;const h=pickSeat(s.target,s.start+.01,+s.id.slice(1),used);if(s.target.startsWith('pick:'))used.add(h.id);SHOT_SEATS.set(s.id,h);}}

// Control messages travel along edges (forward or reversed) between t0 and t1.
const msg=(kind,from,to,t0,t1,label)=>{const fwd=EDGES[`${from}>${to}`],e=fwd||EDGES[`${to}>${from}`];return{kind,from,to,t0,t1,label,edge:e.id,reverse:!fwd};};
function seededRandom(i){const n=Math.sin((i+132606)*127.1)*43758.5453;return n-Math.floor(n);}
export const MESSAGES=[];
MESSAGES.push(msg('register','R1','R2',...REGISTER,'REGISTER'),msg('register','R2','R1',...REGISTER_STOP,'REGISTER-STOP'));
for(const e of SCHEDULE){
 const seg=SEGMENTS[e.seat.seg],k=e.op==='join'?'report':'leave',label=e.op==='join'?'REPORT':'LEAVE';
 MESSAGES.push(msg(k,e.seat.id,seg.switch,e.t,e.t+e.h2,label),msg(k,seg.switch,seg.router,e.t+e.h2,e.t+2*e.h2,label));
}
const RING=new Set(['R2>R3','R3>R4','R2>R5']);
for(const e of ALL_EDGES){
 if(e.kind!=='l3'||e.id==='SRC>R1')continue;
 e.on.forEach(([a,b],i)=>{
  const h=e.joinHop[i],sg=e.from==='R1'||a>=T_SPT;
  MESSAGES.push(msg('join',e.to,e.from,a-h,a,sg?'(S,G) JOIN':'(*,G) JOIN'));
  if(b<DURATION)MESSAGES.push(msg('prune',e.to,e.from,b-H3,b,RING.has(e.id)&&b>=SPT_PRUNE-1e-9&&b<=SPT_PRUNE+2*H3+1e-9?'(S,G,rpt) PRUNE':'PRUNE'));
 });
}
for(const d of DISTS)if(SPT_CORES.has(d.core)&&routerForwarding(d.id,T_SPT))MESSAGES.push(msg('join',d.id,d.core,T_SPT,T_SPT+.3,'(S,G) JOIN'));
const routerLinks=L3.filter(([a])=>a!=='SRC');
for(const t of[109.85,110.65])routerLinks.forEach(([a,b],i)=>{const o=(i%8)*.04;MESSAGES.push(msg('hello',a,b,t+o,t+o+.55,'HELLO'),msg('hello',b,a,t+.12+o,t+.67+o,'HELLO'));});
for(const q of QUERIES){
 const segs=q.kind==='group'?[SEGMENTS[q.seg]]:SEGMENTS;
 for(const seg of segs){
  MESSAGES.push(msg('query',seg.router,seg.switch,q.t,q.t+.35,q.kind==='group'?'GROUP QUERY':'GENERAL QUERY'));
  const reach=q.kind==='group'?seg.seats.filter(s=>member(s,q.t)||(MEMBERSHIP.get(s.id)||[]).some(m=>m.leave<=q.t&&q.t<m.leave+LMQ)):seg.seats;
  for(const s of reach)MESSAGES.push(msg('query',seg.switch,s.id,q.t+.35,q.t+.7,'QUERY'));
  if(q.reply)for(const s of seg.seats.filter(s=>member(s,q.t))){
   const t=q.reply[0]+seededRandom(SEATS.indexOf(s))*(q.reply[1]-q.reply[0]-.6);
   MESSAGES.push(msg('report',s.id,seg.switch,t,t+H2,'REPORT'),msg('report',seg.switch,seg.router,t+H2,t+2*H2,'REPORT'));
  }
 }
}
MESSAGES.sort((a,b)=>a.t0-b.t0);
const MAX_DUR=Math.max(...MESSAGES.map(m=>m.t1-m.t0));
export function messagePos(m,t){const e=EDGES[m.edge],u=Math.max(0,Math.min(1,(t-m.t0)/(m.t1-m.t0)))*e.length;return pointAt(e,u,m.reverse);}
export function activeMessages(t,tail=.25){
 // messages are sorted by t0; only those that started within the longest message duration can be active
 let lo=0,hi=MESSAGES.length;const from=t-MAX_DUR-tail;while(lo<hi){const m=(lo+hi)>>1;if(MESSAGES[m].t0<from)lo=m+1;else hi=m;}
 const out=[];for(let i=lo;i<MESSAGES.length&&MESSAGES[i].t0<=t;i++)if(t<MESSAGES[i].t1+tail)out.push(MESSAGES[i]);return out;
}

// The hook words map to one place in the world each; the flash decays after the sung word.
export const HOOK_TARGETS={'MEMBERSHIP REPORT':'report','JOIN':'join','LEAVE':'leave','QUERY':'query','GROUP':'group','SOURCE':'source','R-P':'rp','P-I-M':'pim','I-G-M-P':'igmp'};
export const hookWord=text=>text.replace(/[.,]/g,'').trim().toUpperCase();

// Header counters and table views for the overlay.
export function counters(t){
 const listening=SEATS.filter(s=>MEMBERSHIP.has(s.id)&&receiving(s.id,t)).length,segments=SEGMENTS.filter(s=>edgeOn(`${s.router}>${s.switch}`,t)).length;
 const links=ALL_EDGES.filter(e=>e.kind==='l3'&&within(e.on,t)).length;
 return{listening,members:SEATS.filter(s=>member(s,t)).length,segments,links,copies:t>=SOURCE_START?1:0};
}
export function snoopingTable(seg,t){return SEGMENTS[seg].seats.filter(s=>edgeOn(`${SEGMENTS[seg].switch}>${s.id}`,t));}
export function mroute(router,t){
 const oil=(OUTGOING[router]||[]).filter(e=>within(e.on,t)).map(e=>e.kind==='access'?`Vlan${segOf(e.to).vlan}`:e.to);
 const spt=SPT_CORES.has(router)?sptActive(t):false,iif=upstream(router,spt);
 const star=router==='R1'?null:{entry:`(*, ${GROUP})`,iif:router==='R2'?'Null (RP)':upstream(router,false),oil};
 const lhr=DISTS.some(d=>d.id===router),has=router==='R1'?t>=SOURCE_START:router==='R2'?rpKnowsSource(t):SPT_CORES.has(router)?t>=SPT_JOIN:lhr&&t>=T_SPT;
 const flags=router==='R2'?(edgeOn('R1>R2',t)?'T  native':'learned by REGISTER'):router==='R1'?'source attached':'T  SPT';
 return{star,sg:has?{entry:`(${SOURCE_IP}, ${GROUP})`,iif,oil,flags}:null};
}
// Syslog lines from the scenario, thinned so fast waves stay readable.
const rawLogs=[[REGISTER[0],'PIM-5-REGISTER',`R1 → RP ${RP_IP} · (${SOURCE_IP}, ${GROUP})`],[REGISTER_STOP[0],'PIM-5-REGSTOP',`RP: no receivers for ${GROUP} → Register-Stop`]];
for(const e of SCHEDULE){const seg=SEGMENTS[e.seat.seg];rawLogs.push([e.t,e.op==='join'?'IGMP-6-REPORT':'IGMP-6-LEAVE',`Vlan${seg.vlan} ${e.seat.port} · ${e.op==='join'?'report':'leave'} ${GROUP} · ${e.seat.ip}`]);}
for(const m of MESSAGES)if(m.kind==='join'||m.kind==='prune')rawLogs.push([m.t1,m.kind==='join'?'PIM-5-JOIN':'PIM-5-PRUNE',`${m.from} → ${m.to} · ${m.label.replace(/ (JOIN|PRUNE)$/,'')} ${GROUP}`]);
for(const q of QUERIES)rawLogs.push([q.t,'IGMP-6-QUERY',q.kind==='group'?`Vlan${SEGMENTS[q.seg].vlan} · group-specific query ${GROUP}`:`general query → 224.0.0.1 on ${SEGMENTS.length} VLANs`]);
rawLogs.push([109.85,'PIM-5-NBRCHG',`PIM hello 224.0.0.13 · ${routerLinks.length} router links`],[T_SPT,'PIM-5-SPT',`R3/R4/R5 switch to SPT · (${SOURCE_IP}, ${GROUP})`]);
rawLogs.sort((a,b)=>a[0]-b[0]);
export const LOGS=[];for(const[time_s,tag,message]of rawLogs)if(!LOGS.length||time_s-LOGS.at(-1).time_s>=.45)LOGS.push({time_s,tag,message});
