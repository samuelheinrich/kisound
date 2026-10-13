// Authored DNS scenario: case #4040 and its sequels. A record was lost from the internal view of the
// split-horizon zone during a migration. The user's resolver answers NXDOMAIN and caches that answer,
// the engineer's laptop still holds the old positive answer (TTL 86400). Every message, cache entry and
// zone line below is a pure function of absolute time. No three.js here: the tests run it in Node.
import {DURATION,SILENCE,BLACKOUT} from './config.js';

export const ZONE='itsalwaysdns.com',APP_IP='203.0.113.42',RESOLVER_IP='10.0.0.53';
const ROOT_C=[0,50,-36];
export const ROOT_LETTERS='abcdefghijklm'.split('');
export const NODES={
 laptopA:{pos:[-30,1.6,14],label:'USER',sub:'10.0.0.23'},
 laptopB:{pos:[-24,1.6,20],label:'ENGINEER',sub:'10.0.0.5'},
 switch:{pos:[-19,1.2,10],label:'SWITCH',sub:'access'},
 router:{pos:[-12,1.6,6],label:'ROUTER',sub:'core'},
 firewall:{pos:[-6,1.6,3],label:'FIREWALL',sub:'policy'},
 resolver:{pos:[0,8,0],label:'RESOLVER',sub:`${RESOLVER_IP} · recursive`},
 app:{pos:[38,2.4,18],label:'APP',sub:APP_IP},
 com:{pos:[14,30,-28],label:'.com',sub:'TLD'},net:{pos:[-2,32,-33],label:'.net',sub:'TLD'},org:{pos:[-17,31,-27],label:'.org',sub:'TLD'},
 ch:{pos:[27,29,-16],label:'.ch',sub:'TLD'},arpa:{pos:[-29,28,-13],label:'.arpa',sub:'TLD'},
 ns1ext:{pos:[34,12,-13],label:'ns1 · EXTERNAL',sub:'view for the internet'},ns1int:{pos:[34,12,-3],label:'ns1 · INTERNAL',sub:'view for 10.0.0.0/8'},
 nsch:{pos:[37,17,-31],label:'ns.kisound.ch',sub:'authoritative'},nsex:{pos:[-24,19,-41],label:'ns.example',sub:'authoritative'},
 inaddr:{pos:[-37,16,3],label:'in-addr.arpa',sub:'reverse zone'},
};
ROOT_LETTERS.forEach((l,i)=>{const a=i/13*Math.PI*2;NODES[`root-${l}`]={pos:[ROOT_C[0]+15*Math.sin(a),ROOT_C[1]+(i%2)*2,ROOT_C[2]+15*Math.cos(a)],label:`${l.toUpperCase()}`,sub:'root'};});
export const ROOT_CENTER=ROOT_C;

// Arcs between nodes, created on demand. Long climbs arc higher; arcs are sampled by arc length.
const ARCS=new Map();
export function arc(a,b){
 const key=a<b?`${a}|${b}`:`${b}|${a}`;
 if(!ARCS.has(key)){
  const p=NODES[a<b?a:b].pos,q=NODES[a<b?b:a].pos,len=Math.hypot(q[0]-p[0],q[1]-p[1],q[2]-p[2]),c=[(p[0]+q[0])/2,(p[1]+q[1])/2+Math.min(14,.14*len+2),(p[2]+q[2])/2],pts=[],cum=[0];
  for(let i=0;i<=40;i++){const s=i/40,u=1-s;pts.push([0,1,2].map(j=>u*u*p[j]+2*u*s*c[j]+s*s*q[j]));if(i)cum.push(cum[i-1]+Math.hypot(...[0,1,2].map(j=>pts[i][j]-pts[i-1][j])));}
  ARCS.set(key,{from:a<b?a:b,to:a<b?b:a,pts,cum,length:cum[40]});
 }
 return ARCS.get(key);
}
export function pointOn(arcObj,f,reverse=false){
 const d=Math.max(0,Math.min(1,reverse?1-f:f))*arcObj.length;let lo=0,hi=40;
 while(hi-lo>1){const m=(lo+hi)>>1;if(arcObj.cum[m]<=d)lo=m;else hi=m;}
 const k=(d-arcObj.cum[lo])/((arcObj.cum[hi]-arcObj.cum[lo])||1);return[0,1,2].map(j=>arcObj.pts[lo][j]+(arcObj.pts[hi][j]-arcObj.pts[lo][j])*k);
}

// Transactions: sequential hops [from, to, kind, duration, label]. kinds: query, referral, answer,
// cname, nxdomain, icmp, timeout. A timeout hop never arrives: it fades halfway.
export const TRANSACTIONS={},MESSAGES=[];
function tx(id,t0,name,hops){
 let t=t0;const msgs=hops.map(([from,to,kind,dur,label])=>{const m={tx:id,from,to,kind,t0:t,t1:t+dur,label,arc:arc(from,to)};m.reverse=m.arc.from!==from;t+=dur;return m;});
 TRANSACTIONS[id]={id,t0,t1:t,name,msgs};MESSAGES.push(...msgs);return TRANSACTIONS[id];
}
const Q=(f,t,d,l='?')=>[f,t,'query',d,l],R=(f,t,d,l)=>[f,t,'referral',d,l],A=(f,t,d,l)=>[f,t,'answer',d,l],N=(f,t,d,l='NXDOMAIN')=>[f,t,'nxdomain',d,l],C=(f,t,d,l)=>[f,t,'cname',d,l];
const APP=`app.${ZONE}`;
// Case #4040
tx('T0',9.0,APP,[Q('laptopA','resolver',.7,`${APP} A?`),Q('resolver','root-j',1.0,`${APP} A?`),R('root-j','resolver',.8,'.com NS'),Q('resolver','com',.8,`${APP} A?`),R('com','resolver',.7,`${ZONE} NS ns1`),Q('resolver','ns1int',.8,`${APP} A?`),N('ns1int','resolver',.7,'NXDOMAIN · SOA min 3600'),N('resolver','laptopA',.6)]);
tx('P1',23.92,APP_IP,[['laptopA','switch','icmp',.3,'echo'],['switch','router','icmp',.3,'echo'],['router','firewall','icmp',.25,'echo'],['firewall','app','icmp',.4,'echo'],['app','firewall','icmp',.4,'reply'],['firewall','router','icmp',.25,'reply'],['router','switch','icmp',.3,'reply'],['switch','laptopA','icmp',.3,'reply']]);
tx('T2',26.7,APP,[Q('laptopA','resolver',.7,`${APP} A?`),N('resolver','laptopA',.8,'NXDOMAIN (cached)')]);
tx('TR',34.76,`traceroute ${APP_IP}`,[['laptopA','router','icmp',.35,'TTL 1'],['router','laptopA','icmp',.3,'time exceeded'],['laptopA','firewall','icmp',.45,'TTL 2'],['firewall','laptopA','icmp',.35,'time exceeded'],['laptopA','app','icmp',.6,'TTL 3'],['app','laptopA','icmp',.55,'reply']]);
tx('RESNO',42.02,APP,[Q('laptopA','resolver',.45,`${APP} A?`),N('resolver','laptopA',.5,'NXDOMAIN (cached)')]);
tx('CACHEYES',43.06,`http://${APP}`,[A('laptopB','app',.7,`GET / → ${APP_IP}`)]);
tx('C1',54.28,ZONE,[Q('laptopA','resolver',.5,`${ZONE} A?`),Q('resolver','ns1int',.7,`${ZONE} A?`),A('ns1int','resolver',.6,`${ZONE} A ${APP_IP}`),A('resolver','laptopA',.5,'NOERROR')]);
tx('I1',59.58,'lab.example.net',[Q('laptopB','resolver',.5,'lab.example.net A?'),Q('resolver','root-k',.8,'lab.example.net A?'),R('root-k','resolver',.6,'.net NS'),Q('resolver','net',.55,'lab.example.net A?'),R('net','resolver',.5,'example.net NS'),Q('resolver','nsex',.55,'lab.example.net A?'),A('nsex','resolver',.5,'A 192.0.2.90'),A('resolver','laptopB',.45,'NOERROR')]);
tx('REV',75.68,'42.113.0.203.in-addr.arpa',[Q('laptopA','resolver',.45,'PTR?'),Q('resolver','root-c',.6,'42.113.0.203.in-addr.arpa PTR?'),R('root-c','resolver',.45,'.arpa NS'),Q('resolver','arpa',.5,'PTR?'),R('arpa','resolver',.45,'113.0.203.in-addr.arpa NS'),Q('resolver','inaddr',.5,'PTR?'),N('inaddr','resolver',.45,'NXDOMAIN · no PTR'),N('resolver','laptopA',.4)]);
tx('FWD',75.9,APP,[A('laptopB','app',.6,`cached A ${APP_IP}`)]);
tx('CN1',79.58,`www.${ZONE}`,[Q('laptopA','resolver',.5,`www.${ZONE} A?`),Q('resolver','ns1int',.55,`www.${ZONE} A?`),C('ns1int','resolver',.5,'CNAME cdn.example.net'),Q('resolver','nsex',.55,'cdn.example.net A?'),C('nsex','resolver',.5,`CNAME ${APP}`),N('resolver','laptopA',.5,'app: NXDOMAIN (negative cache)')]);
tx('Q2',84.32,APP,[Q('laptopA','resolver',.22,`${APP} A?`),Q('resolver','ns1int',.24,`${APP} A?`),N('ns1int','resolver',.24),N('resolver','laptopA',.22)]);
tx('DIGEXT',85.28,`dig @ns1 ${APP}`,[Q('laptopB','ns1ext',.4,'view external'),A('ns1ext','laptopB',.4,`A ${APP_IP}`)]);
tx('DIGINT',85.28,`dig @ns1 ${APP}`,[Q('laptopB','ns1int',.4,'view internal'),N('ns1int','laptopB',.4)]);
tx('OK1',89.32,APP,[Q('laptopA','resolver',.4,`${APP} A?`),Q('resolver','ns1int',.45,`${APP} A?`),A('ns1int','resolver',.45,`A ${APP_IP} · TTL 300`),A('resolver','laptopA',.4,'NOERROR')]);
tx('OKB',90.2,APP,[Q('laptopB','resolver',.4,`${APP} A?`),A('resolver','laptopB',.4,'NOERROR (cached)')]);
tx('C2',114.62,`status.${ZONE}`,[Q('laptopA','resolver',.5,`status.${ZONE} A?`),Q('resolver','ns1int',.7,`status.${ZONE} A?`),A('ns1int','resolver',.6,'A 203.0.113.50'),A('resolver','laptopA',.5,'NOERROR')]);
// Night tour: every new TLD costs one root visit, later names under a known TLD skip the root.
tx('K1',121.95,'kisound.ch AAAA',[Q('laptopA','resolver',.7,'kisound.ch AAAA?'),Q('resolver','root-a',1.4,'kisound.ch AAAA?'),R('root-a','resolver',1.0,'.ch NS'),Q('resolver','ch',1.0,'kisound.ch AAAA?'),R('ch','resolver',.9,'kisound.ch NS'),Q('resolver','nsch',1.0,'kisound.ch AAAA?'),A('nsch','resolver',.8,'AAAA 2001:db8::86'),A('resolver','laptopA',.7,'NOERROR')]);
tx('TO',SILENCE[0],APP,[['laptopA','resolver','timeout',1.0,'no response'],['laptopA','resolver','timeout',1.0,'retry 1'],['laptopA','resolver','timeout',.3,'retry 2']]);
tx('BACK',133.3,APP,[Q('laptopA','resolver',.5,`${APP} A?`),A('resolver','laptopA',.5,'NOERROR (cached)')]);
tx('K2',135.5,'packets.example.org',[Q('laptopB','resolver',.45,'packets.example.org A?'),Q('resolver','root-f',.7,'packets.example.org A?'),R('root-f','resolver',.5,'.org NS'),Q('resolver','org',.45,'packets.example.org A?'),R('org','resolver',.45,'example.org NS'),Q('resolver','nsex',.45,'packets.example.org A?'),A('nsex','resolver',.4,'A 192.0.2.80'),A('resolver','laptopB',.4,'NOERROR')]);
tx('K3',142.5,'samuel-heinrich.ch',[Q('laptopA','resolver',.6,'samuel-heinrich.ch A?'),Q('resolver','ch',.8,'samuel-heinrich.ch A?'),R('ch','resolver',.7,'samuel-heinrich.ch NS'),Q('resolver','nsch',.7,'samuel-heinrich.ch A?'),A('nsch','resolver',.6,'A 192.0.2.87'),A('resolver','laptopA',.5,'NOERROR')]);
tx('TYPO',150.0,'itsalwaysdsn.com',[Q('laptopB','resolver',.5,'itsalwaysdsn.com A?'),Q('resolver','com',.55,'itsalwaysdsn.com A?'),N('com','resolver',.55,'NXDOMAIN from .com'),N('resolver','laptopB',.5,'NXDOMAIN · cached negative')]);
tx('K4',155.5,'example.net MX',[Q('laptopB','resolver',.8,'example.net MX?'),Q('resolver','nsex',1.2,'example.net MX? (NS cached)'),A('nsex','resolver',1.1,'MX 10 mail.example.net'),A('resolver','laptopB',.9,'NOERROR')]);
tx('K5',163.5,'7.100.51.198.in-addr.arpa',[Q('laptopA','resolver',.8,'7.100.51.198.in-addr.arpa PTR?'),Q('resolver','inaddr',1.0,'PTR? (in-addr.arpa NS cached)'),A('inaddr','resolver',.9,`PTR old-app.${ZONE}`),A('resolver','laptopA',.8,'NOERROR')]);
tx('K6',175.05,'example.org MX',[Q('laptopA','resolver',.8,'example.org MX?'),Q('resolver','nsex',1.2,'example.org MX? (NS cached)'),A('nsex','resolver',1.1,'MX 10 mail.example.org'),A('resolver','laptopA',.8,'NOERROR')]);
// Case #4041: intranet → portal.example.net → lb, the end of the chain is missing in the internal view.
const chain=(id,t,d,client='laptopA')=>tx(id,t,`intranet.${ZONE}`,[Q(client,'resolver',d,`intranet.${ZONE} A?`),Q('resolver','ns1int',d,`intranet.${ZONE} A?`),C('ns1int','resolver',d,'CNAME portal.example.net'),Q('resolver','nsex',d,'portal.example.net A?'),C('nsex','resolver',d,`CNAME lb.${ZONE}`),Q('resolver','ns1int',d,`lb.${ZONE} A?`),N('ns1int','resolver',d),N('resolver',client,d)]);
chain('CN2',207.82,.42);
tx('C3',222.44,`status.${ZONE}`,[Q('laptopA','resolver',.6,`status.${ZONE} A?`),Q('resolver','ns1int',.85,`status.${ZONE} A?`),A('ns1int','resolver',.85,'A 203.0.113.50'),A('resolver','laptopA',.7,'NOERROR')]);
tx('K7',228.35,'kisound.ch A',[Q('laptopB','resolver',.8,'kisound.ch A?'),Q('resolver','nsch',1.1,'kisound.ch A? (NS cached)'),A('nsch','resolver',1.0,'A 192.0.2.86'),A('resolver','laptopB',.7,'NOERROR')]);
// the engineer follows the chain himself, past every cache (dig +trace style)
tx('CN3',247.14,`intranet.${ZONE} +trace`,[Q('laptopB','ns1int',.55,`intranet.${ZONE} A?`),C('ns1int','laptopB',.55,'CNAME portal.example.net'),Q('laptopB','nsex',.55,'portal.example.net A?'),C('nsex','laptopB',.55,`CNAME lb.${ZONE}`),Q('laptopB','ns1int',.55,`lb.${ZONE} A?`),N('ns1int','laptopB',.5)]);
chain('Q3',251.38,.2);
tx('OK2',253.3,`intranet.${ZONE}`,[Q('laptopA','resolver',.3,`intranet.${ZONE} A?`),Q('resolver','ns1int',.3,`intranet.${ZONE} A?`),C('ns1int','resolver',.3,'CNAME portal.example.net (portal cached)'),Q('resolver','ns1int',.3,`lb.${ZONE} A?`),A('ns1int','resolver',.3,'A 10.20.0.80'),A('resolver','laptopA',.3,'NOERROR')]);
// Case #4042 starts as the song stops.
tx('PR',258.15,`printer.${ZONE}`,[Q('laptopA','resolver',.6,`printer.${ZONE} A?`),Q('resolver','ns1int',.65,`printer.${ZONE} A?`),N('ns1int','resolver',.85),N('resolver','laptopA',.6)]);
MESSAGES.sort((a,b)=>a.t0-b.t0);
export function messagePos(m,t){return pointOn(m.arc,(t-m.t0)/(m.t1-m.t0),m.reverse);}
const MAX_DUR=Math.max(...MESSAGES.map(m=>m.t1-m.t0));
export function activeMessages(t,tail=.3){let lo=0,hi=MESSAGES.length;const from=t-MAX_DUR-tail;while(lo<hi){const m=(lo+hi)>>1;if(MESSAGES[m].t0<from)lo=m+1;else hi=m;}const out=[];for(let i=lo;i<MESSAGES.length&&MESSAGES[i].t0<=t;i++)if(t<MESSAGES[i].t1+tail)out.push(MESSAGES[i]);return out;}
// The position of a transaction's packet: on its active hop, or resting at the node it last reached.
export function txPos(id,t){
 const x=TRANSACTIONS[id],m=x.msgs.find(m=>t<m.t1)||x.msgs.at(-1);
 if(t<m.t0){const prev=x.msgs[x.msgs.indexOf(m)-1];return prev?NODES[prev.to].pos:NODES[m.from].pos;}
 return messagePos(m,Math.min(t,m.t1));
}
export const txHop=(id,t)=>{const x=TRANSACTIONS[id];return x.msgs.find(m=>t>=m.t0&&t<m.t1)||(t<x.t0?x.msgs[0]:x.msgs.at(-1));};

// Caches. Entries live from `at` until `until` (flush) or until the TTL runs out, whichever comes first.
export const FLUSH1=83.6,FLUSH_B=83.8,FIX1=86.4,FLUSH2=250.8,FIX2=253.1;
const rc=(name,type,value,ttl,at,until=Infinity,negative=false)=>({name,type,value,ttl,at,until,negative});
const fin=id=>TRANSACTIONS[id].msgs.at(-2).t1;   // the resolver has the answer when the last upstream hop arrives
export const RESOLVER_CACHE=[
 rc(APP,'A','NXDOMAIN',3600,fin('T0'),FLUSH1,true),
 rc(APP,'A','NXDOMAIN',3600,fin('Q2'),FIX1,true),   // asked again after the flush: cached again until the fix's flushname
 rc('com','NS','(com TLD servers)',172800,TRANSACTIONS.T0.msgs[2].t1),
 rc(ZONE,'NS',`ns1.${ZONE}`,86400,TRANSACTIONS.T0.msgs[4].t1,FLUSH2),
 rc(ZONE,'A',APP_IP,300,fin('C1'),FLUSH2),
 rc('net','NS','(net TLD servers)',172800,TRANSACTIONS.I1.msgs[2].t1),
 rc('lab.example.net','A','192.0.2.90',600,fin('I1')),
 rc('arpa','NS','(arpa servers)',172800,TRANSACTIONS.REV.msgs[2].t1),
 rc('42.113.0.203.in-addr.arpa','PTR','NXDOMAIN',3600,fin('REV'),Infinity,true),
 rc(`www.${ZONE}`,'CNAME','cdn.example.net',300,TRANSACTIONS.CN1.msgs[2].t1,FLUSH2),
 rc('cdn.example.net','CNAME',APP,300,TRANSACTIONS.CN1.msgs[4].t1),
 rc(APP,'A',APP_IP,300,fin('OK1'),FLUSH2),
 rc(`status.${ZONE}`,'A','203.0.113.50',60,fin('C2')),
 rc('ch','NS','(ch TLD servers)',172800,TRANSACTIONS.K1.msgs[2].t1),
 rc('kisound.ch','AAAA','2001:db8::86',30,fin('K1')),
 rc('org','NS','(org TLD servers)',172800,TRANSACTIONS.K2.msgs[2].t1),
 rc('packets.example.org','A','192.0.2.80',30,fin('K2')),
 rc('samuel-heinrich.ch','A','192.0.2.87',25,fin('K3')),
 rc('itsalwaysdsn.com','A','NXDOMAIN',900,fin('TYPO'),Infinity,true),
 rc('example.net','MX','10 mail.example.net',15,fin('K4')),
 rc('7.100.51.198.in-addr.arpa','PTR',`old-app.${ZONE}`,7,fin('K5')),
 rc('example.org','MX','10 mail.example.org',300,fin('K6')),
 rc(`intranet.${ZONE}`,'CNAME','portal.example.net',3600,TRANSACTIONS.CN2.msgs[2].t1,FLUSH2),
 rc('portal.example.net','CNAME',`lb.${ZONE}`,3600,TRANSACTIONS.CN2.msgs[4].t1),
 rc(`lb.${ZONE}`,'A','NXDOMAIN',3600,fin('CN2'),FLUSH2,true),
 rc(`status.${ZONE}`,'A','203.0.113.50',60,fin('C3')),
 rc('kisound.ch','A','192.0.2.86',600,fin('K7')),
 rc(`intranet.${ZONE}`,'CNAME','portal.example.net',3600,TRANSACTIONS.Q3.msgs[2].t1,FIX2),
 rc(`lb.${ZONE}`,'A','NXDOMAIN',3600,fin('Q3'),FIX2,true),
 rc(`lb.${ZONE}`,'A','10.20.0.80',300,fin('OK2')),
 rc(`printer.${ZONE}`,'A','NXDOMAIN',3600,fin('PR'),Infinity,true),
];
// The engineer's laptop cached the answer long before the migration removed it: old, TTL far too high.
export const LAPTOP_B_CACHE=[rc(APP,'A',APP_IP,86400,-25153,FLUSH_B),rc(APP,'A',APP_IP,300,TRANSACTIONS.OKB.msgs.at(-1).t1)];
export function cacheAt(list,t){return list.filter(e=>t>=e.at&&t<e.until&&t<e.at+e.ttl).map(e=>({...e,remaining:e.ttl-(t-e.at)}));}
export const resolverCache=t=>cacheAt(RESOLVER_CACHE,t),laptopBCache=t=>cacheAt(LAPTOP_B_CACHE,t);
export const resolverDown=t=>t>=SILENCE[0]&&t<SILENCE[1];

// Split-horizon zone: both views of ns1. The internal view lost app (fixed at FIX1) and never had lb (FIX2).
export function zoneView(view,t){
 const rows=[[`${ZONE}.`,'SOA',`ns1.${ZONE}. 2026100301`],[`${ZONE}.`,'NS',`ns1.${ZONE}.`],[`${ZONE}.`,'A',APP_IP],['www','CNAME','cdn.example.net.'],['status','A','203.0.113.50']];
 if(view==='external')return[...rows,['app','A',APP_IP]].map(r=>({name:r[0],type:r[1],value:r[2],state:'ok'}));
 const out=[...rows,['intranet','CNAME','portal.example.net.']].map(r=>({name:r[0],type:r[1],value:r[2],state:'ok'}));
 out.push(t>=FIX1?{name:'app',type:'A',value:APP_IP,state:t<FIX1+2?'new':'ok'}:{name:'app',type:'A',value:'— missing —',state:'missing'});
 out.push(t>=FIX2?{name:'lb',type:'A',value:'10.20.0.80',state:t<FIX2+2?'new':'ok'}:{name:'lb',type:'A',value:'— missing —',state:t>=200?'missing':'quiet'});
 return out;
}

// Tickets and the case file.
export const TICKETS=[{id:4040,name:APP,opened:9.0,closed:117.86,text:'network down'},{id:4041,name:`intranet.${ZONE}`,opened:200.5,closed:254.5,text:'intranet down'},{id:4042,name:`printer.${ZONE}`,opened:258.15,closed:Infinity,text:'printer offline'}];
export const ticketAt=t=>[...TICKETS].reverse().find(k=>t>=k.opened)||TICKETS[0];
export const CLUES=[
 {id:'ping',label:'PING 203.0.113.42',ok:25.25,lyric:'L003'},{id:'routes',label:'ROUTES',ok:26.0},{id:'cable',label:'CABLE',ok:31.2},{id:'port',label:'PORT Gi1/0/12',ok:32.2},
 {id:'firewall',label:'FIREWALL REPORT',ok:33.8},{id:'trace',label:'TRACEROUTE',ok:37.0},{id:'dns',label:'DNS',suspect:37.2,bad:40.6,ok:89.9},
];
export function clueState(c,t){if(c.id==='dns'){if(t>=c.ok&&t<200.5)return'ok';if(t>=c.bad)return'bad';if(t>=c.suspect)return'suspect';return'open';}return t>=c.ok?'ok':'open';}
// What the user's laptop currently gets for the open ticket's name.
export function status(t){
 if(t>=SILENCE[0]&&t<SILENCE[1]+.6)return{code:'TIMEOUT',text:';; connection timed out; no servers could be reached'};
 if(t>=BLACKOUT[0]&&t<BLACKOUT[1])return{code:'CLOSED',text:'case closed'};
 const k=ticketAt(t);if(t<9.0)return{code:'IDLE',text:''};
 if(k.id===4040)return t>=TRANSACTIONS.OK1.t1?{code:'NOERROR',text:`${APP} A ${APP_IP}`}:{code:'NXDOMAIN',text:`${APP}: NXDOMAIN`};
 if(k.id===4041)return t>=TRANSACTIONS.OK2.t1?{code:'NOERROR',text:`intranet.${ZONE} → lb A 10.20.0.80`}:{code:'NXDOMAIN',text:`intranet.${ZONE}: NXDOMAIN (lb)`};
 return t>=TRANSACTIONS.PR.t1-.5?{code:'NXDOMAIN',text:`printer.${ZONE}: NXDOMAIN`}:{code:'QUERY',text:`printer.${ZONE} …`};
}

// dig output, exactly as the panels and the desk monitor show it.
export function digOutput(kind,t){
 const hdr=(status,id,flags='qr rd ra',a=0,au=1)=>[`;; ->>HEADER<<- opcode: QUERY, status: ${status}, id: ${id}`,`;; flags: ${flags}; QUERY: 1, ANSWER: ${a}, AUTHORITY: ${au}, ADDITIONAL: 1`];
 const soa=`${ZONE}.  3600 IN SOA ns1.${ZONE}. hostmaster.${ZONE}. 2026100301 3600 600 1209600 3600`;
 switch(kind){
  case'nx':return[`$ dig ${APP} A`,...hdr('NXDOMAIN',4040),'',';; QUESTION SECTION:',`;${APP}.        IN  A`,'',';; AUTHORITY SECTION:',soa,'',`;; SERVER: ${RESOLVER_IP}#53(${RESOLVER_IP}) (UDP)`];
  case'cached':return[`$ dig ${APP} A`,...hdr('NXDOMAIN',4040),'',';; AUTHORITY SECTION:',soa.replace(' 3600 IN',` ${Math.max(0,Math.round(3600-(t-RESOLVER_CACHE[0].at)))} IN`),'',';; negative answer from cache',`;; SERVER: ${RESOLVER_IP}#53`];
  case'yes':return[`engineer$ ping ${APP}`,`PING ${APP} (${APP_IP}): 56 data bytes`,`64 bytes from ${APP_IP}: icmp_seq=0 ttl=61 time=8.9 ms`,'',`; local cache: ${APP}  A ${APP_IP}`,`; TTL 86400 · cached ${Math.round((t+25153)/3600)} h ago`];
  case'split':return[`$ dig @ns1.${ZONE} ${APP} +short   # from outside`,APP_IP,`$ dig @ns1.${ZONE} ${APP}          # from 10.0.0.0/8`,...hdr('NXDOMAIN',4041,'qr aa rd'),';; view "internal": no such name'];
  case'reverse':return[`$ dig -x ${APP_IP}`,...hdr('NXDOMAIN',4043),'',';; QUESTION SECTION:',';42.113.0.203.in-addr.arpa.  IN  PTR','',`;; forward ${APP} A ${APP_IP} works`,';; reverse: no PTR record'];
  case'cname':return[`$ dig www.${ZONE} A`,...hdr('NXDOMAIN',4044,'qr rd ra',2),'',';; ANSWER SECTION:',`www.${ZONE}.    300 IN CNAME cdn.example.net.`,`cdn.example.net.  300 IN CNAME ${APP}.`,'',';; app: NXDOMAIN, still in the negative cache'];
  case'flush':return['$ rndc flushname app.itsalwaysdns.com','$ sudo dscacheutil -flushcache   # engineer laptop','',`$ dig ${APP} A`,...hdr('NXDOMAIN',4045),';; flushed, asked again: still no such name'];
  case'dig':return[`$ dig @ns1.${ZONE} ${APP} +short   # external view`,APP_IP,`$ dig @ns1.${ZONE} ${APP}          # internal view`,...hdr('NXDOMAIN',4046,'qr aa rd'),'',';; the internal view lost "app" in the migration'];
  case'fix':return['zone itsalwaysdns.com, view "internal":',`+ app   300  IN  A  ${APP_IP}`,'serial 2026100301 → 2026100302','$ rndc reload itsalwaysdns.com IN internal','$ rndc flushname app.itsalwaysdns.com'];
  case'ok':return[`$ dig ${APP} A`,...hdr('NOERROR',4047,'qr rd ra',1,0),'',';; ANSWER SECTION:',`${APP}.  300 IN A ${APP_IP}`,'',`;; SERVER: ${RESOLVER_IP}#53 · Query time: 18 msec`];
  case'timeout':return[`$ dig ${APP} A`,'',`;; communications error to ${RESOLVER_IP}#53: timed out`,`;; communications error to ${RESOLVER_IP}#53: timed out`,';; connection timed out; no servers could be reached'];
  case'typo':return['$ dig itsalwaysdsn.com A',...hdr('NXDOMAIN',4048),'',';; AUTHORITY SECTION:','com.  900 IN SOA (com TLD servers) … 900','',';; the name does not exist: an answer, not a timeout'];
  case'chain':return[`$ dig intranet.${ZONE} A`,...hdr('NXDOMAIN',4041,'qr rd ra',2),'',';; ANSWER SECTION:',`intranet.${ZONE}.     3600 IN CNAME portal.example.net.`,`portal.example.net.  3600 IN CNAME lb.${ZONE}.`,'',';; lb: no such name'];
  case'fix2':return['zone itsalwaysdns.com, view "internal":','+ lb   300  IN  A  10.20.0.80','$ rndc reload itsalwaysdns.com IN internal','$ rndc flushtree itsalwaysdns.com',`$ dig intranet.${ZONE} +short`,'portal.example.net.',`lb.${ZONE}.`,'10.20.0.80'];
  case'printer':return[`$ dig printer.${ZONE} A`,...hdr('NXDOMAIN',4042),'',';; AUTHORITY SECTION:',soa];
  case'ping':return[`$ ping -c 3 ${APP_IP}`,`64 bytes from ${APP_IP}: icmp_seq=0 ttl=61 time=8.7 ms`,`64 bytes from ${APP_IP}: icmp_seq=1 ttl=61 time=8.9 ms`,`64 bytes from ${APP_IP}: icmp_seq=2 ttl=61 time=8.6 ms`,'3 packets transmitted, 3 received, 0% packet loss','',`$ ping ${APP}`,`ping: cannot resolve ${APP}: Unknown host`];
  case'trace':return[`$ traceroute -n ${APP_IP}`,' 1  10.0.0.1      0.6 ms   router',' 2  10.0.255.2    1.1 ms   firewall',` 3  ${APP_IP}  8.8 ms   app`,'','cable ✓  port ✓  firewall ✓  routes ✓',';; then I ask: what about DNS?'];
  default:return[`$ dig ${APP} A`];
 }
}
// The desk monitor and the dock pick their dig output from the mode.
export const DIG_FOR_MODE={incident:'nx',ticket:'nx',vanish:'cached',checks:'cached',hook:'cached',verdict:'cached',stale:'yes',split:'split',reverse:'reverse',cname:'cname',flush:'flush',requery:'flush',dig:'dig',fix:'fix',resolved:'ok',hook2:'ok',calm:'ok',verdict2:'ok',closed:'ok',timeout:'timeout',recover:'ok',negative:'typo',ticket2:'chain',hook3:'chain',cname2:'chain',verdict3:'chain',stale2:'chain',split2:'chain',reverse2:'reverse',cname3:'chain',flush2:'chain',requery2:'chain',dig2:'chain',fix2:'fix2',end:'printer',board:'ok'};

// Kinetic words: hook, bridge and the final words come straight from the analysed lyric segments.
export const KINETIC_SECTIONS=new Set(['Hook','Final Hook','Reprise – Hook','Bridge']);
export const word=text=>text.replace(/[.,?!]/g,'').trim().toUpperCase();
export const WORD_NOTE={'DIG IT UP':'dig · the DNS lookup tool','TTL':'time to live · how long a cache may keep the answer','NXDOMAIN':'the name does not exist · a real answer','WHO CAN TELL':'two sources, two answers','RESOLVER SAYS NO':`${RESOLVER_IP} → NXDOMAIN`,'CACHE SAYS YES':`engineer laptop → ${APP_IP}`,'WELCOME BACK':'',
 'TO THE DNS MESS':'','FLUSH IT':'empty the cache · not the fix by itself','QUERY IT':'ask again','DIG IT':'ask the authoritative server directly','FIX IT':'repair the zone','NOT THE NETWORK':'ping, routes, firewall: all fine','I ASK WHAT ABOUT DNS':`case #4041 · intranet.${ZONE}`,'ITS DNS':'',"IT'S DNS":''};
// Query log lines for the bottom of the frame.
const rawLogs=[];
for(const x of Object.values(TRANSACTIONS)){
 const first=x.msgs[0],last=x.msgs.at(-1),client=NODES[first.from].sub;
 if(first.kind==='icmp'||x.id.startsWith('DIG')||x.id==='CACHEYES'||x.id==='FWD')continue;
 if(first.kind==='timeout'){rawLogs.push([first.t0,'resolver','no response from 10.0.0.53#53 · retrying']);continue;}
 rawLogs.push([first.t0,'query',`client ${client}#53514: query: ${x.name} IN ${first.label.split(' ').at(-1).replace('?','')}`]);
 rawLogs.push([last.t1,last.kind==='answer'?'answer':'nxdomain',`${x.name}: ${last.kind==='answer'?'NOERROR':'NXDOMAIN'}${/cached/.test(last.label||'')?' (cache)':''}`]);
}
rawLogs.push([FLUSH1,'rndc','flushname app.itsalwaysdns.com'],[FIX1,'zone','internal: app A 203.0.113.42 added · serial 2026100302'],[FLUSH2,'rndc','flushtree itsalwaysdns.com'],[FIX2,'zone','internal: lb A 10.20.0.80 added'],[SILENCE[0],'resolver','10.0.0.53 unreachable'],[133.1,'resolver','10.0.0.53 back']);
for(const k of TICKETS)rawLogs.push([k.opened,'ticket',`#${k.id} opened: ${k.text} (${k.name})`]);
rawLogs.sort((a,b)=>a[0]-b[0]);
export const LOGS=[];for(const[time_s,tag,message]of rawLogs)if(time_s<DURATION&&(!LOGS.length||time_s-LOGS.at(-1).time_s>=.45))LOGS.push({time_s,tag,message});
