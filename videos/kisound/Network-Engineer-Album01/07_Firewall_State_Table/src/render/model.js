// Editorial scenario for a stateful firewall. Every value is a pure function of time.
// Inside 10.0.0.0/24 and a DMZ web server, outside the internet; one public address 203.0.113.10 (PAT).
// New sessions are checked against the policy (first match, implicit deny last); packets of a known session
// take the state fast path. All addresses are documentation ranges; times are compressed to the music.
import {DURATION} from './config.js';
export const PUBLIC_IP='203.0.113.10';
export const HOSTS={
 L1:{ip:'10.0.0.23',name:'laptop',side:'in',pos:[-26,2,-14]},L2:{ip:'10.0.0.31',name:'phone',side:'in',pos:[-30,2,-3]},L3:{ip:'10.0.0.45',name:'workstation',side:'in',pos:[-27,2,9]},
 LOG:{ip:'10.0.0.12',name:'syslog source',side:'in',pos:[-22,2,19]},DMZ:{ip:'172.16.0.80',name:'DMZ web',side:'dmz',pos:[-17,2,-27]},
 W1:{ip:'198.51.100.20',name:'web (https)',side:'out',pos:[26,2,-15]},DNS:{ip:'192.0.2.53',name:'DNS',side:'out',pos:[31,2,-3]},W2:{ip:'198.51.100.40',name:'web (http)',side:'out',pos:[28,2,9]},
 COL:{ip:'192.0.2.14',name:'syslog collector',side:'out',pos:[23,2,20]},C1:{ip:'192.0.2.77',name:'external client',side:'out',pos:[33,2,-26]},X:{ip:'198.51.100.66',name:'scanner',side:'out',pos:[37,2,19]},
};
// Gate geometry along x: inside face −2.6, policy rings, outside face +2.6, NAT prism +3.4.
export const GY=4.2,GIN=[-3.8,GY,0],GOUT=[3.8,GY,0],RING_X=[-1.6,-.8,0,.8,1.6],DENY_IN=-2.2,DENY_OUT=2.2,BLOCK_X=2.9,PRISM_X=3.4,DPI_X=-.4;
export const BLOCK_T=96.0,BLOCK_T2=192.4;
export const RULES=[
 {id:0,text:`deny ip from ${HOSTS.X.ip}`,note:'blocklist · written at 95.4 s',since:BLOCK_T},
 {id:1,text:'allow tcp 10.0.0.0/24 → any :443',note:'https out · snat'},
 {id:2,text:`allow udp 10.0.0.0/24 → ${HOSTS.DNS.ip} :53`,note:'dns · snat'},
 {id:3,text:`allow tcp any → ${PUBLIC_IP} :443`,note:`dnat → ${HOSTS.DMZ.ip}:443`},
 {id:4,text:'allow tcp 10.0.0.0/24 → any :80',note:'http · ips inspection'},
 {id:5,text:`allow udp ${HOSTS.LOG.ip} → ${HOSTS.COL.ip} :514`,note:'syslog'},
 {id:6,text:'deny any any log',note:'implicit · default deny'},
];
export const V=22; // default packet speed; a session may run faster (the break handshake)
const P=a=>a.slice(),add3=(a,b,k=1)=>[a[0]+b[0]*k,a[1]+b[1]*k,a[2]+b[2]*k];
function arc(a,b,lift=3,n=22){const m=[(a[0]+b[0])/2,Math.max(a[1],b[1])+lift,(a[2]+b[2])/2],out=[];for(let i=0;i<=n;i++){const u=i/n,v=1-u;out.push([v*v*a[0]+2*v*u*m[0]+u*u*b[0],v*v*a[1]+2*v*u*m[1]+u*u*b[1],v*v*a[2]+2*v*u*m[2]+u*u*b[2]]);}return out;}
const lift=h=>[h.pos[0],h.pos[1]+.8,h.pos[2]];
// Polyline from a to b through the gate; 'hairpin' turns at the prism and comes back inside.
export function route(a,b,{hairpin=false}={}){
 const A=HOSTS[a],B=HOSTS[b],ina=A.side!=='out',inb=B.side!=='out';
 if(hairpin){const t=[PRISM_X,GY,0],up=[PRISM_X,GY+.9,0],back=[-3.8,GY+.9,0];return a==='DMZ'?[...arc(lift(A),back),[PRISM_X,GY+.9,0],t,GIN,...arc(GIN,lift(B)).slice(1)]:[...arc(lift(A),GIN),t,up,back,...arc(back,lift(B)).slice(1)];}
 const f=ina?GIN:GOUT,g=inb?GIN:GOUT;return[...arc(lift(A),f),...arc(g,lift(B)).slice(ina===inb?1:0)].filter((p,i,arr)=>i===0||p.some((v,k)=>v!==arr[i-1][k]));
}
function measure(pts){const L=[0];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];L.push(L[i-1]+Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]));}return L;}
// Distance along a route where it first crosses a given x inside the gate (|y−GY|<1.5).
function sAtX(pts,L,x){for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i];if(Math.abs(a[1]-GY)>1.5&&Math.abs(b[1]-GY)>1.5)continue;if((a[0]-x)*(b[0]-x)<=0&&a[0]!==b[0]){const u=(x-a[0])/(b[0]-a[0]);return L[i-1]+u*(L[i]-L[i-1]);}}return null;}
export const FLIGHTS=[],BY_ID=new Map(),SESSIONS=[],SESSION_BY_ID=new Map(),LOG_RAW=[];
let natPort=40001;
function flight(f){
 f.pts=route(f.from,f.to,{hairpin:f.hairpin});f.L=measure(f.pts);f.len=f.L.at(-1);f.sGate=sAtX(f.pts,f.L,0)??f.len/2;
 const v=f.v??=V;if(f.tGate!=null)f.t0=f.tGate-f.sGate/v;else f.tGate=f.t0+f.sGate/v;
 if(f.dropX!=null){f.sEnd=sAtX(f.pts,f.L,f.dropX);f.fate='drop';}else{f.sEnd=f.len;f.fate='deliver';}
 f.t1=f.t0+f.sEnd/v;f.tEnd=f.t1+(f.fate==='drop'?.45:.15);FLIGHTS.push(f);BY_ID.set(f.id,f);return f;
}
// TCP: SYN, SYN-ACK, ACK, then data, optional FIN pair; the session entry follows the packets through the gate.
function tcp(id,{c,s,tg,data=[],fin=null,dnat=false,hairpin=false,rule=1,sport,ips=null,app='tls',v=V}){
 const dst=dnat||hairpin?'DMZ':s,client=HOSTS[c],sp=sport??(49152+((id.charCodeAt(1)*97+id.length*13)%9000)),dport=rule===4?80:443;
 const snat=client.side==='in'&&!dnat||hairpin,nat=snat?`${PUBLIC_IP}:${natPort++}`:null;
 const ses={id,proto:'tcp',app,c,s:dnat?'FW':s,dst,rule,sport:sp,dport,nat,dnat:dnat||hairpin,hairpin,orig:`${client.ip}:${sp}`,to:dnat||hairpin?`${PUBLIC_IP}:443 → ${HOSTS.DMZ.ip}:443`:`${HOSTS[s].ip}:${dport}`,events:[]};
 SESSIONS.push(ses);SESSION_BY_ID.set(id,ses);
 const base={session:id,proto:'tcp',hairpin,v},lbl=k=>`${k} ${ses.orig} → ${ses.to.split(' → ')[0]}`;
 const syn=flight({...base,id:`${id}syn`,kind:'syn',from:c,to:dst,tGate:tg,check:'policy',rule,label:lbl('SYN')});
 const sa=flight({...base,id:`${id}sa`,kind:'synack',from:dst,to:c,t0:syn.t1+.08,check:'state',label:`SYN-ACK ${ses.to.split(' → ').at(-1)} → ${ses.orig}`});
 const ack=flight({...base,id:`${id}ack`,kind:'ack',from:c,to:dst,t0:sa.t1+.06,check:'state',label:lbl('ACK')});
 ses.events.push([syn.tGate,'SYN_SENT'],[sa.tGate,'SYN_RECV'],[ack.tGate,'ESTABLISHED']);
 data.forEach((t,k)=>{const flagged=ips&&ips.at===k,f=flight({...base,id:`${id}d${k+1}`,kind:'data',from:dst,to:c,t0:t,check:'state',dropX:flagged?DPI_X:null,dropReason:flagged?'ips':null,payload:flagged?ips.sig:ips?'clean':null,label:flagged?`DATA ${ips.file} · ${ips.sig}`:ips?`DATA ${ips.clean} · clean`:`DATA ${app} · ${ses.to.split(' → ').at(-1)} → ${ses.orig}`});
  if(flagged){const tr=f.t1+.12;ses.events.push([tr,'RESET']);flight({...base,id:`${id}rst`,kind:'rst',from:c,to:dst,tGate:tr,check:'none',label:'RST · session closed by IPS'});ses.closed=tr+1.2;LOG_RAW.push([f.t1,'ips',`IPS drop ${ips.sig} in ${ses.to.split(' → ').at(-1)} → ${ses.orig} · reset both sides`]);}});
 if(fin!=null){const f1=flight({...base,id:`${id}fin`,kind:'fin',from:c,to:dst,t0:fin,check:'state',label:lbl('FIN')}),f2=flight({...base,id:`${id}fin2`,kind:'fin',from:dst,to:c,t0:f1.t1+.1,check:'state',label:`FIN ${ses.to.split(' → ').at(-1)} → ${ses.orig}`});
  ses.events.push([f1.tGate,'FIN_WAIT'],[f2.tGate,'TIME_WAIT']);ses.closed=f2.tGate+4;}
 LOG_RAW.push([syn.tGate,'allow',`new tcp ${ses.orig} → ${ses.to} · rule ${rule}${nat?` · snat ${nat}`:''}`]);
 return ses;
}
// UDP: no handshake. The firewall still keeps an entry and lets it expire 30 s after the last packet.
function udp(id,{c,s,times,reply=false,rule}){
 const client=HOSTS[c],sp=40000+((id.length*331+id.charCodeAt(1)*17)%20000),dport=rule===2?53:514,nat=`${PUBLIC_IP}:${natPort++}`;
 const ses={id,proto:'udp',app:rule===2?'dns':'syslog',c,s,dst:s,rule,sport:sp,dport,nat,orig:`${client.ip}:${sp}`,to:`${HOSTS[s].ip}:${dport}`,events:[],timeout:30};
 SESSIONS.push(ses);SESSION_BY_ID.set(id,ses);
 times.forEach((t,k)=>{const q=flight({session:id,proto:'udp',id:`${id}${reply?'q':'.'}${reply?(k||''):k}`,kind:'udp',from:c,to:s,t0:t,check:k?'state':'policy',rule,label:`UDP ${ses.orig} → ${ses.to}${reply?' · query':''}`});
  ses.events.push([q.tGate,k?(ses.replied?'REPLIED':'UNREPLIED'):'UNREPLIED']);
  if(reply){const r=flight({session:id,proto:'udp',id:`${id}r${k||''}`,kind:'udp',from:s,to:c,t0:q.t1+.05,check:'state',label:`UDP ${ses.to} → ${ses.orig} · response`});ses.events.push([r.tGate,'REPLIED']);ses.replied=true;}});
 const last=Math.max(...FLIGHTS.filter(f=>f.session===id).map(f=>f.tGate));ses.closed=last+ses.timeout;
 LOG_RAW.push([FLIGHTS.find(f=>f.session===id).tGate,'allow',`new udp ${ses.orig} → ${ses.to} · rule ${rule} · snat ${nat}`]);
 return ses;
}
// Unsolicited inbound packets. Before the blocklist they die at the implicit deny; after it, at the outside face.
function probe(id,{src='X',dport,tDrop,kind='syn'}){
 const blocked=src==='X'&&tDrop>=BLOCK_T,x=blocked?BLOCK_X:DENY_IN,why=blocked?'rule 0 blocklist':kind==='ack'?'no state · implicit deny':'implicit deny';
 const f=flight({session:null,proto:'tcp',id,kind:kind==='ack'?'ack':'probe',from:src,to:'L1',t0:0,check:kind==='ack'?'nostate':'policy',dropX:x,dropReason:blocked?'blocklist':kind==='ack'?'nostate':'deny',label:`${kind==='ack'?'ACK':'SYN'} ${HOSTS[src].ip}:${51000+dport%997} → ${PUBLIC_IP}:${dport}`,dport});
 // Re-time so the drop happens exactly at tDrop.
 const shift=tDrop-f.t1;f.t0+=shift;f.t1+=shift;f.tEnd+=shift;f.tGate+=shift;LOG_RAW.push([tDrop,'drop',`DROP in ${HOSTS[src].ip} → ${PUBLIC_IP}:${dport} tcp ${kind==='ack'?'ACK':'SYN'} · ${why}`]);return f;
}
// ---- The schedule ------------------------------------------------------------------------------
tcp('T0',{c:'L1',s:'W1',tg:10.2,data:[16.0,19.0],fin:236.5});
udp('D0',{c:'L2',s:'DNS',times:[12.6],reply:true,rule:2});
probe('Z0',{src:'C1',dport:8080,tDrop:23.15});
tcp('T1',{c:'L1',s:'W1',tg:29.4,data:[33.8,36.6,39.7,44.2,73.9,77.0,108.0,170.0],fin:203.6});
udp('D1',{c:'L3',s:'DNS',times:[31.0],reply:true,rule:2});
probe('X1',{dport:22,tDrop:42.6});probe('X2',{dport:3389,tDrop:44.1});
tcp('T2',{c:'L3',s:'W2',tg:46.6,data:[49.0,52.5,56.0],fin:222.0});
probe('Z1',{src:'C1',dport:445,tDrop:60.0});
tcp('T3',{c:'L2',s:'W1',tg:62.4,data:[66.3,69.4],fin:210.6});
udp('U1',{c:'LOG',s:'COL',times:Array.from({length:56},(_,k)=>61.2+k*2.2),rule:5});
tcp('T4',{c:'L2',s:'W2',tg:71.0,data:[74.2],fin:212.4});
tcp('T5',{c:'C1',s:'FW',dnat:true,rule:3,tg:73.3,data:[76.4,80.0],fin:206.8});
for(const[i,[port,t,k]]of[[23,82.6],[3389,84.2],[22,86.6],[5900,89.6],[443,92.7,'ack'],[8443,94.4]].entries())probe(`X${i+3}`,{dport:port,tDrop:t,kind:k??'syn'});
for(const[i,[port,t]]of[[22,99.2],[3389,104.3],[23,120.4],[445,131.2],[21,153.4],[8080,176.0]].entries())probe(`X${i+9}`,{dport:port,tDrop:t});
udp('D2',{c:'L1',s:'DNS',times:[98.6],reply:true,rule:2});
tcp('T6',{c:'L1',s:'W2',tg:102.7,data:[106.2,109.6],fin:225.0,rule:1});
tcp('T7',{c:'L3',s:'W1',tg:118.4,data:[121.0],fin:228.0});
tcp('T8',{c:'L2',s:'W2',tg:127.4,data:[130.0],fin:231.0});
tcp('H1',{c:'L1',s:'FW',hairpin:true,rule:3,tg:134.4,data:[138.0],fin:233.0});
tcp('T9',{c:'L3',s:'W2',tg:138.2,data:[],fin:220.0});
tcp('E1',{c:'L2',s:'W2',rule:4,app:'http',tg:136.4,data:[138.4,141.9],ips:{at:1,sig:'EICAR-Test-Signature',file:'GET /eicar.com',clean:'GET /update.zip'}});
tcp('T10',{c:'L3',s:'W1',tg:146.95,data:[150.0,159.3],fin:238.0,v:70});
probe('X15',{dport:3306,tDrop:153.35});
tcp('T16',{c:'L1',s:'W2',tg:154.9,data:[],fin:215.0});
udp('D3',{c:'L3',s:'DNS',times:[163.4],reply:true,rule:2});
tcp('T11',{c:'L1',s:'W1',tg:168.9,data:[171.0,174.4,177.7],fin:241.0});
tcp('T12',{c:'L2',s:'W2',tg:181.3,data:[],fin:218.0});
for(const[i,[port,t]]of[[22,184.6],[3389,187.3],[23,190.3],[445,193.6],[5900,198.0],[8080,232.0],[22,246.0]].entries())probe(`X${i+16}`,{dport:port,tDrop:t});
tcp('T13',{c:'L3',s:'W1',tg:196.4,data:[199.0],fin:244.0});
tcp('T14',{c:'L1',s:'W2',tg:216.7,data:[219.2,221.0],fin:247.0});
tcp('T15',{c:'L2',s:'W1',tg:230.2,data:[232.5],fin:249.0});
FLIGHTS.sort((a,b)=>a.t0-b.t0);
// ---- Queries ------------------------------------------------------------------------------------
export function pointAt(f,t){const s=Math.max(0,Math.min(f.sEnd,(t-f.t0)*f.v)),L=f.L;let i=1;while(i<L.length-1&&L[i]<s)i++;const a=f.pts[i-1],b=f.pts[i],u=L[i]===L[i-1]?0:(s-L[i-1])/(L[i]-L[i-1]);return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];}
export function activeFlights(t){const out=[];for(const f of FLIGHTS){if(f.t0>t)break;if(t<=f.tEnd)out.push(f);}return out;}
export const phase=(f,t)=>t<f.t0?'waiting':t<=f.t1?'moving':f.fate==='drop'?'dropped':'arrived';
// Labels switch to the translated addresses on the far side of the prism.
export function labelAt(f,t){const s=SESSION_BY_ID.get(f.session);if(!s)return f.label;const x=pointAt(f,t)[0],outside=x>PRISM_X+.1;
 if(s.dnat&&!s.hairpin)return outside?f.label:f.label.replace(`${PUBLIC_IP}:443`,`${HOSTS.DMZ.ip}:443`);if(!s.nat)return f.label;
 if(f.from===s.c&&outside&&!s.hairpin)return f.label.replace(s.orig,s.nat);if(f.to===s.c&&outside&&!s.hairpin)return f.label.replace(s.orig,s.nat);return f.label;}
export function sessionState(s,t){if(t>=s.closed)return null;let st=null;for(const[at,v]of s.events)if(t>=at)st=v;return st;}
export function stateTable(t){
 const rows=[];for(const s of SESSIONS){const st=sessionState(s,t);if(!st)continue;const last=Math.max(...s.events.filter(e=>e[0]<=t).map(e=>e[0]));
  const timeout=s.proto==='udp'?Math.max(0,Math.ceil(s.closed-t)):st==='TIME_WAIT'?Math.max(0,Math.ceil(s.closed-t)):st==='ESTABLISHED'?3600-Math.floor(t-last):120-Math.floor(t-last);
  rows.push({id:s.id,proto:s.proto,app:s.app,orig:s.orig,nat:s.nat,to:s.to,state:st,timeout,rule:s.rule,since:s.events[0][0],hit:last});}
 return rows.sort((a,b)=>a.since-b.since);
}
export const ruleActive=(r,t)=>r.since==null||t>=r.since;
// Which ring a flight lights when it crosses the gate centre: matched rule for policy checks, none for state hits.
export function ringHit(f){if(f.check==='policy'&&f.fate==='deliver')return f.rule;if(f.dropReason==='deny'||f.dropReason==='nostate')return 6;if(f.dropReason==='blocklist')return 0;return null;}
export const STATE_COLOR={SYN_SENT:'#ffe08a',SYN_RECV:'#ffd06a',ESTABLISHED:'#7ff5c0',FIN_WAIT:'#ffb27a',TIME_WAIT:'#9fb4c8',UNREPLIED:'#9feaf6',REPLIED:'#7ff5c0',RESET:'#ff8b95'};
export const LOGS=[];
{const raw=[...LOG_RAW];for(const s of SESSIONS)if(s.closed<DURATION&&s.proto==='tcp')raw.push([s.closed,'close',`end tcp ${s.orig} → ${s.to}`]);for(const s of SESSIONS)if(s.proto==='udp'&&s.closed<DURATION)raw.push([s.closed,'expire',`udp ${s.orig} → ${s.to} timed out`]);
 raw.push([BLOCK_T-.4,'rule',`rule 0 added: deny ip from ${HOSTS.X.ip}`]);raw.sort((a,b)=>a[0]-b[0]);for(const[time_s,tag,message]of raw)if(time_s<DURATION&&(!LOGS.length||time_s-LOGS.at(-1).time_s>=.4))LOGS.push({time_s,tag,message});}
// Kinetic words: hook, final hook and break, straight from the analysed lyric segments.
export const KINETIC_SECTIONS=new Set(['Hook','Final Hook','Break']);
export const word=text=>text.replace(/[.,?!]/g,'').trim().toUpperCase();
export const WORD_NOTE={'DROP IT':'discard the packet','LOG IT':'write one line per decision','BLOCK IT':'deny the source from now on','STATE TABLE LOCK IT':'only known sessions pass',
 'PACKET HIT STOP IT':'unsolicited → implicit deny','NO MATCH KNOCK IT':'ACK without a session → no match → drop','WRITE THE RULE AND LOCK IT':`rule 0: deny ip from ${HOSTS.X.ip}`,
 'PACKET HITS STOP IT':'blocklist hit at the outside face','WRITE RULE LOCK IT':'the rule stays',
 'SYN':'client asks: seq = x','ACK':'client confirms: ack = y + 1','SESSION MATCH':'return packet finds its row','DENY':'no rule allows it','PERMIT':'rule 1 · new row','LOG':'every decision leaves a line',
 'SOURCE NAT':`10.0.0.x → ${PUBLIC_IP}:port`,'DESTINATION NAT':`${PUBLIC_IP}:443 → ${HOSTS.DMZ.ip}`,'T-C-P':'handshake · state machine','U-D-P':'no handshake · timeout only'};
