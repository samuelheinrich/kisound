// Editorial scenario: a probe host at site A cannot reach site B, and site C is gone too.
// Two different faults, found by traceroute and ping:
//  · R4 still carries an old remote-triggered blackhole route (RTBH) to Null0. It discards silently.
//    It covers 203.0.113.45/32 first and grows to 203.0.113.0/24 at GROW.
//  · R2 has lost the prefix 198.51.100.0/24 (site C). It answers with ICMP 3/0 net unreachable.
// Core addresses come from 198.18.0.0/15 (benchmarking range), hosts from the documentation ranges.
import {DURATION} from './config.js';
export const NODES={
 S:{ip:'192.0.2.10',label:'PROBE HOST',sub:'site A · 192.0.2.10',pos:[-64,0,0],host:true},
 R1:{ip:'192.0.2.1',label:'R1',sub:'site A edge · 192.0.2.1',pos:[-48,0,5]},
 R2:{ip:'198.18.0.2',label:'R2',sub:'core · 198.18.0.2',pos:[-32,0,-3]},
 R3:{ip:'198.18.0.3',label:'R3',sub:'core · 198.18.0.3',pos:[-14,0,5]},
 R3b:{ip:'198.18.0.13',label:'R3b',sub:'core · 198.18.0.13',pos:[-16,0,-20]},
 R4:{ip:'198.18.0.4',label:'R4',sub:'core · 198.18.0.4',pos:[4,0,-2]},
 R5:{ip:'198.18.0.5',label:'R5',sub:'site B edge · 198.18.0.5',pos:[22,0,6]},
 FWB:{ip:'203.0.113.1',label:'FIREWALL B',sub:'site B · 203.0.113.1',pos:[36,0,0]},
 D:{ip:'203.0.113.45',label:'SERVER',sub:'203.0.113.45',pos:[48,0,-6],host:true},
 D2:{ip:'203.0.113.80',label:'SERVER 2',sub:'203.0.113.80',pos:[48,0,8],host:true},
 RC:{ip:'198.51.100.1',label:'SITE C EDGE',sub:'198.51.100.1',pos:[-26,0,26]},
 C:{ip:'198.51.100.20',label:'SITE C',sub:'198.51.100.20',pos:[-18,0,38],host:true},
};
export const LINKS=[['S','R1'],['R1','R2'],['R2','R3'],['R2','R3b'],['R3','R4'],['R3b','R4'],['R4','R5'],['R5','FWB'],['FWB','D'],['FWB','D2'],['R2','RC'],['RC','C']];
export const TOWER=6.5,HOSTY=2.6;
export const top=id=>{const n=NODES[id];return[n.pos[0],n.host?HOSTY:TOWER,n.pos[2]];};
export const GROW=55.2,SHIFT=101.4,VOID=[4,2.4,-2];
export const RTBH=t=>t>=GROW?'203.0.113.0/24':'203.0.113.45/32';
const inBlackhole=(dst,t)=>dst==='D'||(dst==='D2'&&t>=GROW);
// Forward path from S at time t, and where it ends: 'deliver', 'null' (silent discard at R4) or 'noroute' (R2).
export function forward(dst,t){
 const core=t>=SHIFT?'R3b':'R3';
 if(dst==='C')return{path:['S','R1','R2'],fail:'noroute',at:'R2'};
 const path=['S','R1','R2',core,'R4'];if(inBlackhole(dst,t))return{path,fail:'null',at:'R4'};
 return{path:[...path,'R5','FWB',dst],fail:null};
}
// Cables sag between tower tops; flights follow the same curves.
function cable(a,b,n=14){const A=top(a),B=top(b),L=Math.hypot(B[0]-A[0],B[2]-A[2]),sag=Math.min(2.2,L*.06),out=[];for(let i=0;i<=n;i++){const u=i/n;out.push([A[0]+(B[0]-A[0])*u,A[1]+(B[1]-A[1])*u-sag*4*u*(1-u),A[2]+(B[2]-A[2])*u]);}return out;}
export const CABLES=new Map(LINKS.map(([a,b])=>[`${a}-${b}`,cable(a,b)]));
function polyline(nodes){const pts=[];for(let i=1;i<nodes.length;i++){const k=`${nodes[i-1]}-${nodes[i]}`,c=CABLES.get(k)??[...CABLES.get(`${nodes[i]}-${nodes[i-1]}`)].reverse();pts.push(...(i===1?c:c.slice(1)));}return pts;}
function measure(pts){const L=[0];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];L.push(L[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]));}return L;}
export const V=18,FALL=1.3;
export const FLIGHTS=[],BY_ID=new Map(),EVIDENCE=[];
function fly(f){f.pts=polyline(f.nodes);f.L=measure(f.pts);f.len=f.L.at(-1);if(f.tEnd!=null)f.t0=f.tEnd-f.len/V;f.t1=f.t0+f.len/V;f.tGone=f.t1+(f.fate==='null'?FALL:f.fate==='expire'?.35:.2);FLIGHTS.push(f);BY_ID.set(f.id,f);return f;}
const icmp=(id,from,t0,type,label,cause,extra={})=>{const back=[...forward('D',0).path.slice(0,forward('D',0).path.indexOf(from)+1)].reverse(),nodes=from==='R3b'?['R3b','R2','R1','S']:back;const f=fly({id,kind:type==='te'?'te':'du',nodes,t0,fate:'deliver',label,cause,...extra});EVIDENCE.push({t:f.t1,from,type,label,cause,...extra});return f;};
// Echo request to dst, timed so it reaches its end (destination, R4 or R2) at tEnd.
function ping(id,dst,tEnd){
 const fw=forward(dst,tEnd),f=fly({id,kind:'echo',dst,nodes:fw.path,tEnd,fate:fw.fail??'deliver',label:`echo request → ${NODES[dst].ip}`});
 if(fw.fail==='noroute')icmp(`${id}u`,'R2',f.t1+.1,'du',`ICMP 3/0 net unreachable · from ${NODES.R2.ip}`,id,{dst:NODES[dst].ip});
 if(!fw.fail){const r=fly({id:`${id}r`,kind:'reply',dst,nodes:[...fw.path].reverse(),t0:f.t1+.1,fate:'deliver',label:`echo reply ← ${NODES[dst].ip}`});EVIDENCE.push({t:r.t1,from:dst,type:'reply',label:`echo reply from ${NODES[dst].ip}`,cause:id});}
 return f;
}
// One traceroute probe with a given TTL, timed by the moment it reaches the hop where it ends.
function probe(id,dst,ttl,tEnd){
 const fw=forward(dst,tEnd),hop=fw.path[ttl];let f;
 if(hop&&ttl<fw.path.length-(fw.fail?0:1)){f=fly({id,kind:'probe',ttl,dst,nodes:fw.path.slice(0,ttl+1),tEnd,fate:'expire',label:`udp probe · ttl ${ttl}`});icmp(`${id}t`,hop,f.t1+.08,'te',`ICMP 11 time exceeded · hop ${ttl} · ${NODES[hop].ip}`,id,{ttl,hop});}
 else f=fly({id,kind:'probe',ttl,dst,nodes:fw.path,tEnd,fate:fw.fail??'deliver',label:`udp probe · ttl ${ttl}`});
 return f;
}
function trace(id,dst,ends){ends.forEach((t,k)=>probe(`${id}p${k+1}`,dst,k+1,t));}
// ---- Schedule -------------------------------------------------------------------------------------
ping('C0','C',3.45);
trace('T0','D',[6.2,9.8,13.6,18.6,21.2,24.4]);
ping('E0','D',10.3);ping('E0b','D',16.0);ping('E0c','D',27.6);
ping('E1','D',34.7);ping('B1','D',38.2);ping('B2','D',42.4);
ping('K0','D2',50.6);ping('E2','D',56.45);ping('K1','D2',59.9);ping('E3','D',62.6);
ping('C1','C',61.9);ping('C1b','C',66.2);
trace('T1','D',[71.2,74.6,78.4,81.0,84.3,86.4]);ping('E4','D',76.6);
trace('T2','D',[82.6,85.2,88.4,92.3,94.5,96.8]);ping('E5','D',98.3);ping('E5b','D',105.0);ping('C2a','C',91.0);
trace('T3','D',[106.5,108.4,110.35,113.0,115.2,121.9]);ping('E6','D',120.2);ping('B3','D',122.6);
ping('E7','D',127.6);trace('T5','D',[128.9,130.6,132.6,135.0,137.4,139.8]);ping('E8','D',143.0);ping('E9','D',147.6);ping('C2','C',148.8);ping('B4','D',151.2);ping('C2b','C',154.0);
ping('E10','D',163.6);ping('C3','C',163.9);ping('C3b','C',165.3);ping('C4','C',171.1);
trace('T4','D',[176.2,179.0,181.6,184.3,186.4,189.0]);ping('E11','D',178.4);
ping('E12','D',200.0);ping('E13','D',212.8);ping('E14','D',223.6);ping('E15','D',234.6);ping('C5','C',251.1);ping('E16','D',255.0);ping('C6','C',254.6);
for(let t=60.4;t<250;t+=3.55)if(!FLIGHTS.some(f=>f.kind==='echo'&&Math.abs(f.t1-t)<1.2))ping(`B${Math.round(t*10)}`,'D',t);
FLIGHTS.sort((a,b)=>a.t0-b.t0);EVIDENCE.sort((a,b)=>a.t-b.t);
// ---- Queries --------------------------------------------------------------------------------------
export function pointAt(f,t){const s=Math.max(0,Math.min(f.len,(t-f.t0)*V)),L=f.L;let i=1;while(i<L.length-1&&L[i]<s)i++;const a=f.pts[i-1],b=f.pts[i],u=L[i]===L[i-1]?0:(s-L[i-1])/(L[i]-L[i-1]);const p=[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];
 if(f.fate==='null'&&t>f.t1){const k=Math.min(1,(t-f.t1)/FALL),e=k*k;return[p[0]+(VOID[0]-p[0])*e,p[1]+(VOID[1]-p[1])*e-.6*Math.sin(k*Math.PI),p[2]+(VOID[2]-p[2])*e];}return p;}
export function activeFlights(t){const out=[];for(const f of FLIGHTS){if(f.t0>t)break;if(t<=f.tGone)out.push(f);}return out;}
export const phase=(f,t)=>t<f.t0?'waiting':t<=f.t1?'moving':f.fate==='null'?'falling':f.fate==='expire'?'expired':'arrived';
export const swallowed=t=>FLIGHTS.filter(f=>f.fate==='null'&&f.t1+FALL<=t).length;
export const voidRadius=t=>Math.min(5,1.1+.035*swallowed(t)+(t>=GROW?1.1:0));
// What the probe host has learnt by time t: hops that answered, and the evidence slips.
export const evidenceUntil=t=>EVIDENCE.filter(e=>e.t<=t);
export function revealed(t){const s=new Set(['S']);for(const e of evidenceUntil(t)){if(e.type==='te'||e.type==='du')s.add(e.from);if(e.type==='reply')s.add(e.from);}return s;}
// Traceroute output as the host prints it: per hop the answering address or * * *.
export function traceLines(id,t){
 const probes=FLIGHTS.filter(f=>f.kind==='probe'&&f.id.startsWith(`${id}p`)).sort((a,b)=>a.ttl-b.ttl),dst=probes[0]?.dst??'D',out=[`$ traceroute -n ${NODES[dst].ip}`];const RTT=[1.1,4.8,9.6,12.3];
 for(const p of probes){const te=BY_ID.get(`${p.id}t`);if(te&&te.t1<=t)out.push(` ${p.ttl}  ${NODES[te.nodes[0]].ip.padEnd(14)} ${RTT[p.ttl-1]??14} ms`);else if(p.t1+1.2<=t)out.push(` ${p.ttl}  * * *`);else break;}
 return out;
}
export const TRACES=[...new Set(FLIGHTS.filter(f=>f.kind==='probe').map(f=>f.id.split('p')[0]))];
export function latestTrace(t){return TRACES.filter(id=>BY_ID.get(`${id}p1`).t0<=t).at(-1)??'T0';}
export const ROUTES={
 R2:t=>[['192.0.2.0/24','R1','ospf'],['203.0.113.0/24',t>=SHIFT?'R3b':'R3','bgp'],['198.18.0.0/15','connected',''],['198.51.100.0/24','— missing —','withdrawn']],
 R4:t=>[[RTBH(t),'Null0','static · tag 666 (RTBH)'],['203.0.113.0/24','R5','bgp'],['192.0.2.0/24',t>=SHIFT?'R3b':'R3','bgp']],
};
export const FW_LOG='fw-b# show log | count  →  0 matches for 192.0.2.10';
export const STATUS=t=>t<GROW?'blackhole 203.0.113.45/32 at R4':'blackhole 203.0.113.0/24 at R4';
export const KINETIC_SECTIONS=new Set(['Pulse','Hook','Break','Final Hook','Finale']);
export const word=text=>text.replace(/[.,?!]/g,'').trim().toUpperCase();
export const WORD_NOTE={'DESTINATION UNREACHABLE':'ICMP type 3 · a router says: I cannot deliver this','TIME EXCEEDED':'ICMP type 11 · TTL reached 0 on the way','NO REPLY':'silence: lost, filtered or discarded',
 'PACKET LOST':'gone without a message','BLACKHOLE ROUTE':'route to Null0: discard, say nothing','TTL EXPIRED':'every hop subtracts one','TRACE THE PATH':'traceroute: TTL 1, 2, 3 …','HOP BY HOP':'each hop answers once its TTL runs out','NO RETURN':'nothing comes back after hop 4',
 'WHERE DID THE PACKET GO':'last answer: hop 4 · 198.18.0.4','NOBODY KNOWS':'* * * from hop 5 on','THE BLACKHOLE GROWS':'RTBH /32 → /24','SEND IT AGAIN':'ping once more','WATCH IT FALL':'Null0','NO ROUTE AT ALL':'R2: no route to 198.51.100.0/24',
 'NEXT HOP GONE':'no answer beyond R4','SILENT GATEWAY':'Null0 sends no ICMP','MOVING ON':'traceroute gives up on the hop','ICMP':'the only voice a router has','PACKETS FALL':'discarded at R4','SIGNALS DIE':'no reply, no message'};
export const LOGS=[];
{const raw=EVIDENCE.filter(e=>e.type!=='reply').map(e=>[e.t,e.type==='te'?'icmp11':'icmp3',e.label]);for(const f of FLIGHTS)if(f.fate==='null'&&/^E\d/.test(f.id))raw.push([f.t1+1.2,'timeout',`no reply from ${NODES[f.dst].ip}`]);
 raw.push([GROW,'route',`R4: ${RTBH(GROW)} → Null0`],[SHIFT,'ospf','cost change: R2 → R3b → R4']);raw.sort((a,b)=>a[0]-b[0]);for(const[time_s,tag,message]of raw)if(time_s<DURATION&&(!LOGS.length||time_s-LOGS.at(-1).time_s>=.45))LOGS.push({time_s,tag,message});}
