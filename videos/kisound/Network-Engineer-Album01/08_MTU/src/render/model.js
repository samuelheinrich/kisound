// Editorial network scenario for MTU. Every value is a pure function of time.
// Host A uploads to server B through an IPsec tunnel whose MTU is 1400. Full-size TCP segments (1500 B, DF=1)
// die at the tunnel head R2; its ICMP "fragmentation needed" (type 3 / code 4, mtu 1400) is dropped by the
// firewall in front of host A, which only lets echo-reply and time-exceeded through. Pings (84 B) work.
// Fix: the firewall accepts frag-needed, the host learns path MTU 1400 and resends in 1400-byte packets.
import {DURATION} from './config.js';
export const HOST_IP='192.0.2.10',FW_IP='192.0.2.1',R1_IP='203.0.113.1',R2_IP='203.0.113.2',R3_IP='198.51.100.1',SRV_IP='198.51.100.20';
export const X={host:-58,fw:-44,r1:-30,r2:-16,gate:-12.5,tin:-11,tout:24,r3:28,srv:42};
export const LINKS=[['host','fw',1500],['fw','r1',1500],['r1','r2',1500],['tin','tout',1400],['r3','srv',1500]];
export const LINK_MTU=1500,TUNNEL_MTU=1400,PATH_MTU=Math.min(...LINKS.map(l=>l[2]));
// One byte is K world units of height; the gate opening is exactly TUNNEL_MTU high and never changes.
export const K=.0021,RAIL_Y=.4,GATE_H=TUNNEL_MTU*K,GATE_W=2.4,LANE_GAP=4.2;
export const zf=x=>2.6*Math.sin(x/15),zr=x=>zf(x)+LANE_GAP;
export const height=size=>Math.max(.18,size*K);
export const dims=size=>size>=600?{w:1.5,d:1.7,h:height(size)}:{w:.62,d:.62,h:height(size)};
export const V_DATA=17.6,V_PING=24,V_ICMP=10;
export const FIX=99.3; // firewall starts accepting ICMP frag-needed
const stopX=size=>X.gate-dims(size).d/2-.06;
export const FLIGHTS=[],BY_ID=new Map();
function add(f){f.t0=f.keys[0][0];f.t1=f.keys.at(-1)[0];f.tEnd=f.t1+(f.fate==='deliver'?.15:.42);FLIGHTS.push(f);BY_ID.set(f.id,f);return f;}
function keysFor(x0,x1,t0,v){return[[t0,x0],[t0+Math.abs(x1-x0)/v,x1]];}
// A full-size segment that dies at the gate, plus the ICMP it triggers. tIcmpFw sets when that ICMP reaches the firewall.
function dropped(id,tDrop,{size=1500,v=V_DATA,keys=null,label='seq 1 · retransmit',icmpV=V_ICMP,tIcmpFw=null}={}){
 const xs=stopX(size),k=keys??[[tDrop-(xs-X.host)/v,X.host],[tDrop,xs]];
 add({id,kind:'data',size,df:true,lane:'fwd',keys:k,fate:'drop',label:`${size} B · DF · ${label}`});
 const n=id.slice(1),t0=tDrop+.12,fwX=X.fw+1.0,v1=tIcmpFw?(X.r2-fwX)/(tIcmpFw-t0):icmpV,tFw=t0+(X.r2-fwX)/v1,pass=tFw>=FIX;
 const ik=[[t0,X.r2],[tFw,fwX]];if(pass)ik.push([tFw+(fwX-X.host-.8)/v1,X.host+.8]);
 add({id:`I${n}`,kind:'icmp',size:56,df:false,lane:'ret',keys:ik,fate:pass?'deliver':'block',label:'ICMP 3/4 · frag needed · mtu 1400',cause:id});
}
function ping(id,tStart,size=84,label=null){
 const kind=size>=600?'probe':'ping';
 add({id,kind,size,df:true,lane:'fwd',keys:keysFor(X.host,X.srv,tStart,size>=600?V_DATA:V_PING),fate:'deliver',label:label??`${size} B · echo request`});
 const t=BY_ID.get(id).t1+.08;add({id:`R${id}`,kind:'reply',size,df:false,lane:'ret',keys:keysFor(X.srv,X.host,t,size>=600?V_DATA:V_PING),fate:'deliver',label:`${size} B · echo reply`});
}
// Before the fix: the same first segment is retransmitted and dies every time (intervals compressed).
dropped('D0',5.2,{keys:[[-1,-38],[3.9,-19],[5.2,stopX(1500)]],label:'seq 1',tIcmpFw:8.85});
dropped('D1',16.55,{keys:[[9.6,X.host],[14.0,X.host],[16.55,stopX(1500)]]});
dropped('D2',34.3);dropped('D3',38.45);
dropped('D4',50.55,{keys:[[48.0,X.host],[50.55,stopX(1500)]]});
dropped('D5',55.9);dropped('D6',68.45);dropped('D7',72.2);
dropped('D8',84.75,{tIcmpFw:88.0});
// The first ICMP to arrive after the fix gets through; the host learns the path MTU.
dropped('D9',97.76,{tIcmpFw:100.0});
export const LEARN=BY_ID.get('I9').t1;
ping('P1',13.2);ping('P2',15.9);ping('P5',26.0);ping('P3',35.6);ping('P4',37.5);ping('P6',63.0);ping('P7',77.5);ping('P8',92.0);
ping('L1',40.41,1400,'1400 B · DF · ping -s 1372');
// After the fix: the file in 1400-byte packets (MSS 1360), every eighth note, then ongoing traffic on the beat.
export const MSS_OLD=1460,MSS_NEW=PATH_MTU-40,FILE_SEGMENTS=32,FILE_BYTES=(FILE_SEGMENTS-1)*MSS_NEW+760,S_START=104.88;
const sLaunch=[];for(let k=0;k<FILE_SEGMENTS;k++)sLaunch.push(S_START+k*.2222);
const LAST_GATE=137.69,lastLaunch=LAST_GATE-(X.gate-X.host)/V_DATA,tail=[];for(let t=lastLaunch;t>sLaunch.at(-1)+.3;t-=.4444)tail.unshift(t);
[...sLaunch,...tail].forEach((t,k)=>{const payload=k<FILE_SEGMENTS?(k===FILE_SEGMENTS-1?FILE_BYTES-(FILE_SEGMENTS-1)*MSS_NEW:MSS_NEW):MSS_NEW,size=payload+40;
 add({id:`S${k}`,kind:'seg',size,df:true,lane:'fwd',keys:keysFor(X.host,X.srv,t,V_DATA),fate:'deliver',label:k<FILE_SEGMENTS?`${size} B · DF · seq ${1+k*MSS_NEW}`:`${size} B · DF`,file:k<FILE_SEGMENTS,payload});});
FLIGHTS.sort((a,b)=>a.t0-b.t0);
export const S_FLIGHTS=FLIGHTS.filter(f=>f.kind==='seg');
export const FILE_DONE=Math.max(...S_FLIGHTS.filter(f=>f.file).map(f=>f.t1));
const MAX_SPAN=Math.max(...FLIGHTS.map(f=>f.tEnd-f.t0));
export function xAt(f,t){const k=f.keys;if(t<=k[0][0])return k[0][1];for(let i=1;i<k.length;i++)if(t<=k[i][0]){const[a,xa]=k[i-1],[b,xb]=k[i];return b===a?xb:xa+(xb-xa)*(t-a)/(b-a);}return k.at(-1)[1];}
export function flightPos(f,t){const x=xAt(f,t),h=dims(f.size).h;return[x,RAIL_Y+h/2,f.lane==='fwd'?zf(x):zr(x)];}
export function heading(f,t){const x=xAt(f,t),dir=f.lane==='fwd'?1:-1,dz=(f.lane==='fwd'?zf:zr)(x+.5*dir)-(f.lane==='fwd'?zf:zr)(x);return[dir*.5,0,dz];}
export const inTunnel=x=>x>X.tin&&x<X.tout;
export function activeFlights(t){const out=[];for(const f of FLIGHTS){if(f.t0>t)break;if(t<=f.tEnd&&t>=f.t0-.2)out.push(f);}return out;}
// Queue: a flight sitting at the host before its first key time is shown waiting there.
export function phase(f,t){if(t<f.keys[1][0]&&f.keys[0][1]===f.keys[1][1])return'queued';if(t<=f.t1)return'moving';return f.fate==='deliver'?'arrived':f.fate==='drop'?'dropped':'blocked';}
export const DROPS_AT=FLIGHTS.filter(f=>f.fate==='drop').map(f=>({id:f.id,t:f.t1}));
export const hostPmtu=t=>t>=LEARN?PATH_MTU:LINK_MTU;
export const icmpAllowed=t=>t>=FIX;
export function delivered(t){return S_FLIGHTS.filter(f=>f.file&&f.t1<=t).length;}
export function upload(t){const n=delivered(t),bytes=S_FLIGHTS.filter(f=>f.file&&f.t1<=t).reduce((s,f)=>s+f.payload,0);return{n,bytes,pct:bytes/FILE_BYTES,done:t>=FILE_DONE,stalled:t<S_START+(X.srv-X.host)/V_DATA};}
export function status(t){
 if(t>=LEARN)return{code:'PMTU 1400',text:'path MTU learned',color:'ok'};
 if(t>=FIX)return{code:'ICMP OPEN',text:'frag-needed accepted at firewall',color:'icmp'};
 if(t>=42.54)return{code:'BLACK HOLE',text:'tunnel MTU 1400 · ICMP dropped',color:'drop'};
 return{code:'UPLOAD STALLED',text:'ping works · upload hangs',color:'drop'};
}
// Resolve flexible camera targets: 'f:S@host' rides the next segment leaving the host, 'f:S@gate' the one at the gate.
export function resolveTarget(shot){
 if(!shot.target?.startsWith('f:'))return null;const id=shot.target.slice(2);
 if(id==='S@host')return S_FLIGHTS.reduce((b,f)=>f.t0>=shot.start-.05&&(!b||f.t0<b.t0)?f:b,null)?.id;
 if(id==='S@gate'){const want=shot.start+Math.min(1.2,(shot.end-shot.start)/2),g=f=>f.t0+(X.gate-X.host)/V_DATA;return S_FLIGHTS.reduce((b,f)=>!b||Math.abs(g(f)-want)<Math.abs(g(b)-want)?f:b,null).id;}
 return id;
}
// The sender rebuild: four 1460-byte payloads become five packets of at most 1360 bytes. No byte is lost.
export const REBUILD_OLD=[1460,1460,1460,1460],REBUILD_NEW=(()=>{let left=REBUILD_OLD.reduce((a,b)=>a+b,0);const out=[];while(left>0){out.push(Math.min(MSS_NEW,left));left-=MSS_NEW;}return out;})();
// Path MTU frames for the measurement hall, in path order.
export const PATH_FRAMES=[['host → fw',1500],['fw → R1',1500],['R1 → R2',1500],['IPsec tunnel',1400],['R3 → server',1500]];
export const KINETIC_SECTIONS=new Set(['Hook','Break']);
export const word=text=>text.replace(/[.,?!]/g,'').replace(/’/g,"'").trim().toUpperCase();
export const WORD_NOTE={"DON'T FRAGMENT":'DF = 1 · routers must not split this packet',"CAN'T FRAGMENT":'too big + DF → drop, ICMP back','PATH TOO NARROW':'IPsec tunnel · MTU 1400','PACKET STRANDED':'1500 bytes at a 1400 gate',
 'LOWER THE SIZE':'sender builds 1400-byte packets','UNDERSTAND IT':'path MTU = the smallest link','FOURTEEN HUNDRED':'1400 B · fits the tunnel','FIFTEEN HUNDRED':'1500 B · 100 B too big',
 'JUMBO FRAME':'9000 B · only inside its own L2 network','DO NOT FRAGMENT':'DF = 1','PATH M-T-U':'min(1500, 1500, 1500, 1400, 1500) = 1400','ICMP TOO BIG':'IPv4: type 3 / code 4 · fragmentation needed · mtu 1400',
 'REDUCE AND RETRY':'resend in 1400-byte packets'};
// Terminal output per kind. Lines are fixed text; only the typing reveal depends on time.
export const TERM={
 ping:[`$ ping -c 3 ${SRV_IP}`,`PING ${SRV_IP} (${SRV_IP}) 56(84) bytes of data.`,`64 bytes from ${SRV_IP}: icmp_seq=1 ttl=61 time=18.4 ms`,`64 bytes from ${SRV_IP}: icmp_seq=2 ttl=61 time=18.1 ms`,`64 bytes from ${SRV_IP}: icmp_seq=3 ttl=61 time=18.6 ms`],
 big:[`$ ping -M do -s 1472 -c 3 ${SRV_IP}`,`PING ${SRV_IP} (${SRV_IP}) 1472(1500) bytes of data.`,'',`--- ${SRV_IP} ping statistics ---`,'3 packets transmitted, 0 received, 100% packet loss'],
 trace:[`$ tracepath -n ${SRV_IP}`,' 1?: [LOCALHOST]                      pmtu 1500',` 1:  ${FW_IP}                          0.412ms`,` 2:  ${R1_IP}                       1.104ms`,` 3:  ${R2_IP}                       1.380ms`,' 4:  no reply',' 5:  no reply'],
 lower:[`$ ping -M do -s 1372 -c 2 ${SRV_IP}`,`PING ${SRV_IP} (${SRV_IP}) 1372(1400) bytes of data.`,`1380 bytes from ${SRV_IP}: icmp_seq=1 ttl=61 time=19.0 ms`,`1380 bytes from ${SRV_IP}: icmp_seq=2 ttl=61 time=18.8 ms`],
 fwlog:['fw# nft list chain inet filter forward | grep icmp','  icmp type { echo-reply, time-exceeded } accept','  meta l4proto icmp log prefix "fw: " drop','fw# journalctl -k | tail -1',`fw: IN=wan OUT=lan SRC=${R2_IP} DST=${HOST_IP} PROTO=ICMP TYPE=3 CODE=4 MTU=1400`],
 icmp:['ICMP Destination Unreachable (type 3)','  code 4: fragmentation needed and DF set','  next-hop MTU: 1400',`  from ${R2_IP} (IPsec tunnel head)`,`  original: ${HOST_IP} > ${SRV_IP} len 1500 DF`],
 fix:['fw# nft insert rule inet filter forward \\','      icmp type destination-unreachable icmp code frag-needed accept','fw# nft list chain inet filter forward | grep frag','  icmp type destination-unreachable icmp code frag-needed accept'],
 learned:[`$ ping -M do -s 1472 -c 1 ${SRV_IP}`,`From ${R2_IP} icmp_seq=1 Frag needed and DF set (mtu = 1400)`,`$ ip route get ${SRV_IP}`,`${SRV_IP} via ${FW_IP} dev eth0 src ${HOST_IP} uid 1000`,'    cache expires 597sec mtu 1400'],
 upload:['$ upload report.pdf',`  ${(FILE_BYTES/1000).toFixed(1)} kB · ${FILE_SEGMENTS} segments · MSS ${MSS_NEW}`,'  path MTU 1400 · DF=1 · no fragmentation'],
};
export const TERM_FOR_MODE={build:'ping',waits:'big',drop:'big',pre:'ping',hides:'fwlog',trace:'trace',fault:'lower',chorus:'big',big:'big',narrow:'trace',stranded:'big',hook:'big',discovery:'big',icmp:'icmp',blocked:'fwlog',crack:'trace',fix:'fix',learned:'learned',final:'upload',final2:'upload',ghost:'upload'};
export function termLines(kind,t){const lines=TERM[kind]??TERM.ping;if(kind==='upload'){const u=upload(t);return[...lines,`  ${'█'.repeat(Math.round(u.pct*20)).padEnd(20,'·')} ${String(Math.round(u.pct*100)).padStart(3)} %${u.done?' · done':''}`];}return lines;}
export const LOGS=[];
{const raw=[];for(const f of FLIGHTS){if(f.kind==='data'&&f.fate==='drop')raw.push([f.t1,'drop',`R2 tunnel0: ${f.size} B DF > mtu 1400 · ${f.label.split(' · ').slice(2).join(' · ')}`]);
  if(f.kind==='icmp')raw.push([f.keys[1][0],f.fate==='block'?'fw':'fw',f.fate==='block'?`drop ICMP 3/4 from ${R2_IP} (mtu 1400)`:`accept ICMP 3/4 from ${R2_IP} (mtu 1400)`]);
  if(f.kind==='reply'&&f.size<600)raw.push([f.t1,'ping',`64 bytes from ${SRV_IP}: icmp_seq ok`]);}
 raw.push([LEARN,'host',`pmtu ${SRV_IP} 1500 → 1400`],[FIX,'fw','rule added: accept icmp frag-needed'],[FILE_DONE,'app','report.pdf uploaded']);
 raw.sort((a,b)=>a[0]-b[0]);for(const[time_s,tag,message]of raw)if(time_s<DURATION&&(!LOGS.length||time_s-LOGS.at(-1).time_s>=.45))LOGS.push({time_s,tag,message});}
export {MAX_SPAN};
