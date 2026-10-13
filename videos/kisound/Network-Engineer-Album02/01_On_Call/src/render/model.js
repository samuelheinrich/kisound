// Editorial scenario (simulated values): IOS-XE router R-EDGE connects client 192.0.2.10 (SITE-2) via Gi0/0/0
// to the server net 198.51.100.0/24 behind Gi0/0/1 and to the comparison service 203.0.113.40 behind Gi0/0/2.
// Change CHG-2042 bound the ACL QUARANTINE (meant for another zone) outbound to Gi0/0/1 by mistake; its rule 10
// discards everything towards the server net. Routes and links are fine. The on-call engineer narrows the ticket,
// tests, snapshots the counters, sends one controlled SYN (F-A1), reads route, binding, counter and log, removes
// exactly that binding at FIX and repeats the same curl test (F-A2, new TCP connection).
// Inside R-EDGE everything is shown in slow motion; terminal and ticket run in (compressed) real time.
import {DURATION} from './config.js';
export const ALARM=16.58,FIX=146.82,RETEST=148.78,OK_A=169.7;
// Local time of the night: 02:17 at the alarm, one film second ≈ twelve seconds.
export const clock=t=>{const s=Math.max(0,(t-ALARM))*12+(2*3600+17*60),h=Math.floor(s/3600),m=Math.floor(s/60)%60;return`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;};
export const ADDR={client:'192.0.2.10',gw0:'192.0.2.1',gw1:'198.51.100.1',gw2:'203.0.113.1',A:'198.51.100.20',B:'198.51.100.21',C:'198.51.100.22',D:'203.0.113.40',mgmt:'10.99.0.15'};
export const SERVICES={A:{name:'APP-A',host:'app-a.example',ip:ADDR.A,net:'server'},B:{name:'APP-B',host:'app-b.example',ip:ADDR.B,net:'server'},C:{name:'APP-C',host:'app-c.example',ip:ADDR.C,net:'server'},D:{name:'CTRL-D',host:'ctrl.example',ip:ADDR.D,net:'ctrl'}};
// ---- R-EDGE interior (slow-motion world, units ≈ metres of a giant router) ------------------------------------
export const ST={
 CLIENT:[-56,0,0],GI000:[-44,0,0],PARSER:[-32,0,0],LOOKUP:[-12,0,0],ACL10:[5,0,0],ACL20:[9,0,0],GI001:[16,0,0],FAN:[23,0,0],
 A:[36,0,0],FB:[27,0,12],B:[36,0,12],FC:[27,0,-12],C:[36,0,-12],
 G2:[-4,0,-10],GI002:[0,0,-17],D:[14,0,-26],CPU:[-12,0,11],
};
export const STATION_LABEL={CLIENT:['CLIENT',`${ADDR.client} · SITE-2`],GI000:['Gi0/0/0',`${ADDR.gw0} · Eingang`],PARSER:['EINGANGSPRÜFUNG','Header · Checksumme'],LOOKUP:['ROUTING','Präfix-Lookup'],
 GI001:['Gi0/0/1',`${ADDR.gw1} · Ausgang Servernetz`],GI002:['Gi0/0/2',`${ADDR.gw2} · Ausgang`],CPU:['CPU · LOKAL','Antworten des Routers selbst']};
export const RAIL_Y=1.15;
const P={A:['FAN','A'],B:['FAN','FB','B'],C:['FAN','FC','C']};
// Forward node chains from the client; return chains are the reverse.
export const ROUTE={A:['CLIENT','GI000','PARSER','LOOKUP','ACL10','ACL20','GI001',...P.A],B:['CLIENT','GI000','PARSER','LOOKUP','ACL10','ACL20','GI001',...P.B],
 C:['CLIENT','GI000','PARSER','LOOKUP','ACL10','ACL20','GI001',...P.C],D:['CLIENT','GI000','PARSER','LOOKUP','G2','GI002','D'],CPU:['CLIENT','GI000','PARSER','LOOKUP','CPU']};
export const PREFIXES=[['192.0.2.0/24','Gi0/0/0','connected'],['198.51.100.0/24','Gi0/0/1','connected'],['203.0.113.0/24','Gi0/0/2','connected'],['0.0.0.0/0','192.0.2.254','static']];
export const prefixFor=ip=>ip.startsWith('198.51.100.')?1:ip.startsWith('203.0.113.')?2:ip.startsWith('192.0.2.')?0:3;
// ---- ACL state --------------------------------------------------------------------------------------------------
export const aclBound=t=>t<FIX;
export const ACL_RULES=[['10','deny ip any 198.51.100.0 0.0.0.255 log'],['20','permit ip any any']];
// ---- Flights ----------------------------------------------------------------------------------------------------
// keys: [[station,time],…] along `nodes`; stations without a time are placed by arc length. A station may
// appear twice in keys for a hold. fate: 'deliver' | 'drop' (at ACL10, rule 10) | 'local' (router CPU).
export const FLIGHTS=[],BY_ID=new Map();
const dist=(a,b)=>Math.hypot(b[0]-a[0],b[2]-a[2]);
function fly(f){
 f.pts=f.nodes.map(n=>ST[n]);const L=[0];for(let i=1;i<f.pts.length;i++)L.push(L[i-1]+dist(f.pts[i-1],f.pts[i]));f.L=L;
 // node times: keyed ones fixed, the rest interpolated by length between keyed neighbours
 const keyed=new Map();for(const[n,t]of f.keys){const i=f.nodes.indexOf(n);if(!keyed.has(i))keyed.set(i,[t,t]);else keyed.get(i)[1]=t;}
 const idx=[...keyed.keys()].sort((a,b)=>a-b);if(idx[0]!==0||idx.at(-1)!==f.nodes.length-1)throw Error(`${f.id}: first and last node need times`);
 f.arrive=new Array(f.nodes.length);f.leave=new Array(f.nodes.length);
 for(let k=0;k<idx.length;k++){const i=idx[k],[a,b]=keyed.get(i);f.arrive[i]=a;f.leave[i]=b;if(k){const j=idx[k-1],t0=f.leave[j],t1=f.arrive[i];for(let m=j+1;m<i;m++){const u=(L[m]-L[j])/(L[i]-L[j]);f.arrive[m]=f.leave[m]=t0+(t1-t0)*u;}}}
 f.t0=f.leave[0];f.t1=f.arrive.at(-1);f.tGone=f.t1+(f.fate==='drop'?1.6:f.fate==='local'?.5:.6);
 FLIGHTS.push(f);BY_ID.set(f.id,f);return f;
}
const fwd=(id,svc,keys,o={})=>fly({id,dst:svc,nodes:ROUTE[svc],keys,fate:'deliver',...o});
const back=(id,svc,keys,o={})=>fly({id,dst:'CLIENT',from:svc,nodes:[...ROUTE[svc]].reverse(),keys,fate:'deliver',dir:'back',...o});
const until=(svc,stop)=>ROUTE[svc].slice(0,ROUTE[svc].indexOf(stop)+1);
const syn=(sport,svc)=>({proto:'TCP',flags:'SYN',src:`${ADDR.client}:${sport}`,dstAddr:`${SERVICES[svc].ip}:443`,payload:0});
// B02 at 62.68: TEST-A with curl. SYN and one retransmission (RTO 1 s) die at rule 10 until the 2-s connect timeout.
fly({id:'T0',dst:'A',kind:'syn',nodes:until('A','ACL10'),keys:[['CLIENT',63.75],['ACL10',64.1]],fate:'drop',test:'TEST-A',...syn(50412,'A')});
fly({id:'T0R',dst:'A',kind:'syn',nodes:until('A','ACL10'),keys:[['CLIENT',64.75],['ACL10',65.1]],fate:'drop',test:'TEST-A',retrans:true,...syn(50412,'A')});
fwd('C0','D',[['CLIENT',66.85],['D',67.25]],{kind:'syn',test:'CTRL',...syn(50418,'D')});back('C0R','D',[['D',67.3],['CLIENT',67.7]],{kind:'synack',test:'CTRL'});
// The controlled diagnostic SYN F-A1 (hping3, one packet, source port 51000), followed in slow motion.
fly({id:'FA1',dst:'A',kind:'syn',nodes:until('A','ACL10'),keys:[['CLIENT',85.6],['GI000',90.0],['GI000',96.2],['PARSER',100.0],['LOOKUP',104.2],['ACL10',108.2]],fate:'drop',test:'F-A1',name:'F-A1',...syn(51000,'A')});
// Gateway comparison: ping to the router's own Gi0/0/1 address is answered locally; an outbound ACL never sees it.
fly({id:'GW',kind:'icmp',dst:'CPU',nodes:ROUTE.CPU,keys:[['CLIENT',122.45],['CPU',123.4]],fate:'local',test:'GW',proto:'ICMP',flags:'echo request',src:ADDR.client,dstAddr:ADDR.gw1,payload:56});
back('GWR','CPU',[['CPU',123.5],['CLIENT',124.1]],{kind:'icmp',test:'GW',proto:'ICMP',flags:'echo reply',src:ADDR.gw1,dstAddr:ADDR.client,payload:56});
// Replays of the recorded F-A1 trace: a new perspective, no transport, never counted.
fly({id:'RP1',dst:'A',kind:'replay',of:'FA1',nodes:['LOOKUP','ACL10'],keys:[['LOOKUP',124.2],['ACL10',125.58]],fate:'drop',name:'F-A1 · REPLAY',...syn(51000,'A')});
fly({id:'RP2',dst:'A',kind:'replay',of:'FA1',nodes:['LOOKUP','ACL10'],keys:[['LOOKUP',139.45],['ACL10',140.6]],fate:'drop',name:'F-A1 · REPLAY',...syn(51000,'A')});
// After FIX: the same curl test, a new TCP connection (port 51001). Handshake, TLS, request, response.
fwd('FA2','A',[['CLIENT',149.6],['GI000',151.0],['PARSER',152.0],['LOOKUP',153.0],['ACL10',154.19],['GI001',155.0],['A',156.0]],{kind:'syn',test:'TEST-A',name:'F-A2',...syn(51001,'A')});
back('SA2','A',[['A',156.05],['CLIENT',157.8]],{kind:'synack',test:'TEST-A',proto:'TCP',flags:'SYN/ACK',src:`${ADDR.A}:443`,dstAddr:`${ADDR.client}:51001`,payload:0});
fwd('TLS1','A',[['CLIENT',157.9],['A',159.0]],{kind:'tls',test:'TEST-A',proto:'TLS 1.3',flags:'ClientHello',payload:1});
back('TLS2','A',[['A',159.1],['CLIENT',160.2]],{kind:'tls',test:'TEST-A',proto:'TLS 1.3',flags:'ServerHello · Zertifikat',payload:1});
fwd('TLS3','A',[['CLIENT',160.3],['A',161.4]],{kind:'tls',test:'TEST-A',proto:'TLS 1.3',flags:'Finished',payload:1});
fwd('REQ','A',[['CLIENT',161.9],['GI000',162.4],['PARSER',162.8],['LOOKUP',163.2],['ACL10',163.5],['GI001',163.75],['A',164.3]],{kind:'data',test:'TEST-A',proto:'TLS 1.3',flags:'GET /health',src:`${ADDR.client}:51001`,dstAddr:`${ADDR.A}:443`,payload:1,name:'TEST-A · GET'});
back('RSP','A',[['A',165.6],['GI001',166.4],['LOOKUP',167.4],['PARSER',168.0],['GI000',168.6],['CLIENT',OK_A]],{kind:'data',test:'TEST-A',proto:'TLS 1.3',flags:'HTTP 200',src:`${ADDR.A}:443`,dstAddr:`${ADDR.client}:51001`,payload:1,name:'TEST-A · HTTP 200'});
// Separate checks of the other three services.
export const VERIFY={A:OK_A,B:179.0,C:180.6,D:182.2};
for(const[svc,go,arr,ret]of[['B',176.6,177.9,178.2],['C',178.2,179.6,179.8],['D',179.8,181.2,181.4]]){
 fwd(`T${svc}`,svc,[['CLIENT',go],[svc,arr]],{kind:'data',test:`CHECK-${svc}`,proto:'TLS 1.3',flags:'GET /health',payload:1});
 back(`T${svc}R`,svc,[[svc,ret],['CLIENT',VERIFY[svc]]],{kind:'data',test:`CHECK-${svc}`,proto:'TLS 1.3',flags:'HTTP 200',payload:1});
}
// Ordinary traffic: CTRL-D all night; the server halls only after their verification (the night shift reconnects).
function random(i){const n=Math.sin((i+20101)*127.1)*43758.5453;return n-Math.floor(n);}
{let k=0;const amb=(svc,from,to,period)=>{for(let t=from;t<to;k++){const go=t+random(k)*.5,len=1.9+random(k+7)*.5,host=`192.0.2.${31+Math.floor(random(k+3)*40)}`;
  if(go+len*2+.4>=DURATION)break;fwd(`M${k}`,svc,[['CLIENT',go],[svc,go+len]],{kind:'ambient',proto:'TLS 1.3',flags:'Anwendungsdaten',src:host,payload:1});
  back(`M${k}R`,svc,[[svc,go+len+.35],['CLIENT',go+2*len+.35]],{kind:'ambient',proto:'TLS 1.3',flags:'Anwendungsdaten',dstAddr:host,payload:1});t+=period*(.8+.4*random(k+11));}};
 amb('D',0,DURATION,3.1);amb('A',VERIFY.A+2.4,DURATION,1.6);amb('B',VERIFY.B+2,DURATION,1.9);amb('C',VERIFY.C+2,DURATION,1.9);}
FLIGHTS.sort((a,b)=>a.t0-b.t0);
// ---- Queries ----------------------------------------------------------------------------------------------------
export function pointAt(f,t){
 const n=f.nodes.length;if(t<=f.leave[0])return[...f.pts[0]];
 for(let i=1;i<n;i++){if(t<f.arrive[i]){const a=f.pts[i-1],b=f.pts[i],u=(t-f.leave[i-1])/(f.arrive[i]-f.leave[i-1]);return[a[0]+(b[0]-a[0])*u,0,a[2]+(b[2]-a[2])*u];}if(t<=f.leave[i])return[...f.pts[i]];}
 return[...f.pts[n-1]];
}
// Direction of travel (unit xz) at time t.
export function headingAt(f,t){let i=1;while(i<f.nodes.length-1&&t>f.arrive[i])i++;const a=f.pts[i-1],b=f.pts[i],d=dist(a,b)||1;return[(b[0]-a[0])/d,0,(b[2]-a[2])/d];}
export const phase=(f,t)=>t<f.t0?'waiting':t<f.t1?'moving':f.fate==='drop'?'dropped':f.fate==='local'?'local':'arrived';
export function activeFlights(t){const out=[];for(const f of FLIGHTS){if(f.t0>t)break;if(t<=f.tGone)out.push(f);}return out;}
const DROPPED=FLIGHTS.filter(f=>f.fate==='drop'&&f.kind!=='replay');
// QUARANTINE rule 10 match counter; 38 before the first visible test.
export const COUNTER_BASE=38;
export const counter=t=>COUNTER_BASE+DROPPED.filter(f=>f.t1<=t).length;
export const lastDrop=t=>DROPPED.filter(f=>f.t1<=t).at(-1)??null;
// Ticket knowledge per service: 'red' (reported/failing) until its own test has passed.
export const serviceOk=(svc,t)=>svc==='D'?t>=ALARM:t>=VERIFY[svc];
// Hall machinery: turns while a request is being answered and while ordinary traffic flows.
const WORK={};for(const f of FLIGHTS)if(f.fate==='deliver'&&f.dir!=='back'&&SERVICES[f.dst]){const ret=BY_ID.get(f.id+'R');(WORK[f.dst]??=[]).push([f.t1-.2,(ret?ret.t0:f.t1+.4)+.6]);}
export function hallActivity(svc,t){return(WORK[svc]||[]).some(([a,b])=>t>=a&&t<=b)?1:0;}
// ---- Screen texts (B-IDs of the script; P0/P1 added: counter snapshot and the controlled SYN) -----------------
const CURL=s=>`client$ curl --connect-timeout 2 --max-time 5 --resolve ${s.host}:443:${s.ip} --write-out '\\nHTTP %{http_code}\\n' https://${s.host}/health`;
export const TEST_A=CURL(SERVICES.A);
// Each line: [reveal time, text, kind]. Typed lines appear character by character from their reveal time.
export const BLOCKS={
 B01:{title:'INCIDENT-2042',win:[22.62,72.42],lines:[[22.62,'INCIDENT-2042 | 02:17 | On Call','head'],[22.62,'Meldung: Alles ist weg','warn'],[59.6,'Standort: SITE-2    Client: 192.0.2.10'],[59.6,'Beginn: nach CHG-2042'],[66.3,'APP-A/B/C: HTTPS timeout    CTRL-D: HTTPS 200','warn']]},
 B02:{title:'client · TEST-A',win:[62.68,75.4],lines:[[62.9,TEST_A,'cmd'],[65.75,'curl: (28) Failed to connect to app-a.example port 443 after 2002 ms: Timeout was reached','bad'],[66.2,`client$ curl --resolve ctrl.example:443:${ADDR.D} https://ctrl.example/health`,'cmd'],[67.75,'{"status":"ok"}','ok']]},
 P0:{title:'R-EDGE · Vorher-Snapshot',win:[81.42,89.32],lines:[[81.7,'R-EDGE# show ip access-lists | include list|matches','cmd'],[82.5,'Extended IP access list MGMT-IN'],[82.5,'    10 permit tcp 10.99.0.0 0.0.0.255 any eq 22 (318 matches)'],[82.5,'Extended IP access list QUARANTINE'],[82.5,'    10 deny ip any 198.51.100.0 0.0.0.255 log (40 matches)']]},
 P1:{title:'client · Diagnose-SYN F-A1',win:[84.78,120.12],lines:[[84.9,`client$ sudo hping3 -S -p 443 -s 51000 -c 1 ${ADDR.A}`,'cmd'],[85.6,`HPING ${ADDR.A} (eth0 ${ADDR.A}): S set, 40 headers + 0 data bytes`],[86.7,`--- ${ADDR.A} hping statistic ---`],[86.7,'1 packets transmitted, 0 packets received, 100% packet loss','bad']]},
 B03:{title:'R-EDGE · Belege',win:[120.12,143.02],pages:[120.12,124.14,129.94],lines:[
  [120.3,'R-EDGE# show ip route 198.51.100.20','cmd',0],[120.9,'Routing entry for 198.51.100.0/24','',0],[120.9,'  Known via "connected", distance 0, metric 0','',0],[120.9,'  * directly connected, via GigabitEthernet0/0/1','ok',0],
  [124.3,'R-EDGE# show running-config interface GigabitEthernet0/0/1','cmd',1],[125.0,'interface GigabitEthernet0/0/1','',1],[125.0,' ip address 198.51.100.1 255.255.255.0','',1],[125.0,' ip access-group QUARANTINE out','amber',1],
  [130.1,'R-EDGE# show ip access-lists QUARANTINE','cmd',2],[130.8,'Extended IP access list QUARANTINE','',2],[130.8,' 10 deny ip any 198.51.100.0 0.0.0.255 log (41 matches)','bad',2],[130.8,' 20 permit ip any any','',2],
  [131.2,'%SEC-6-IPACCESSLOGP: list QUARANTINE denied tcp 192.0.2.10(51000) -> 198.51.100.20(443), 1 packet','bad',2],[131.8,'Vorher-Snapshot: 40 matches → +1 = F-A1','amber',2]]},
 B04:{title:'CHG-2042 · Diff',win:[128.0,146.82],lines:[[128.0,'CHG-2042 | R-EDGE | interface Gi0/0/1','head'],[128.0,'VORHER: kein ausgehendes IPv4-ACL-Binding'],[128.0,'+ ip access-group QUARANTINE out','amber'],[135.68,'Befund: falsche Zone, korrekte Route, passender deny-Counter','warn']]},
 B05:{title:'R-EDGE · Änderung',win:[143.02,153.52],lines:[[143.1,'R-EDGE# configure terminal','cmd'],[143.6,'R-EDGE(config)# interface GigabitEthernet0/0/1','cmd'],[144.3,'R-EDGE(config-if)# no ip access-group QUARANTINE out','amber'],[147.3,'R-EDGE(config-if)# end','cmd']]},
 B06:{title:'client · TEST-A wiederholt',win:[148.78,184.28],lines:[[148.85,TEST_A,'cmd'],[OK_A,'{"status":"ok"}','ok'],[OK_A,'HTTP 200','ok'],[OK_A+.5,'TEST-A: HTTP 200 | Zertifikat geprüft | Client 192.0.2.10','ok'],[VERIFY.B,'APP-B: HTTP 200','ok'],[182.8,'QUARANTINE Regel 10: 41 matches (unverändert)','']]},
 B07:{title:'INCIDENT-2042',win:[187.46,192.56],lines:[[187.6,'INCIDENT-2042 | geschlossen','head'],[187.6,'Ursache: QUARANTINE an falschem Ausgang gebunden'],[187.6,'Eingriff: Binding an Gi0/0/1 zurückgenommen'],[187.6,'Verifikation: TEST-A und APP-B/C/CTRL-D erfolgreich','ok']]},
};
// APP-B/C/CTRL-D results share one B06 line and fill in as each check returns.
export const verifyLine=t=>['B','C','D'].filter(s=>t>=VERIFY[s]).map(s=>`${SERVICES[s].name}: HTTP 200`).join('    ');
const CPS=70;
// The visible text of a block at t: [{text, kind, typing}] (only revealed lines; typed commands grow).
export function blockLines(id,t){
 const b=BLOCKS[id];if(!b)return[];const page=b.pages?b.pages.filter(p=>t>=p).length-1:-1;
 return b.lines.filter(l=>t>=l[0]&&(page<0||l[3]===page)).map(([t0,text,kind=''])=>{
  if(id==='B06'&&text==='APP-B: HTTP 200')text=verifyLine(t);
  if(kind==='cmd'||kind==='amber'&&/^\S+[#$] /.test(text)){const pre=/^\S+[#$] /.exec(text)[0].length,n=Math.min(text.length,pre+Math.floor((t-t0)*CPS));return{text:text.slice(0,n),kind,typing:n<text.length};}
  return{text,kind,typing:false};});
}
// B05 is a preview until FIX.
export const changeExecuted=t=>t>=FIX;
// Blocks shown in the dock at t: the newest open window first, at most two.
export function dockBlocks(t){return Object.entries(BLOCKS).filter(([,b])=>t>=b.win[0]&&t<b.win[1]).map(([id])=>id).sort((a,b)=>BLOCKS[b].win[0]-BLOCKS[a].win[0]).slice(0,2);}
// ---- Ticket ----------------------------------------------------------------------------------------------------
export const TICKET={
 fieldsShown:[55.58,56.6,57.6],fieldsFilled:{begin:59.6,site:61.2,client:61.9},compare:66.3,coords:78.42,live:91.16,
 cause:171.66,attach:[175.2,175.8,176.4,177.0],closed:187.6,
 attachments:['snapshot-vorher.txt (02:30)','f-a1-spur.log','chg-2042.diff','test-a-nachher.txt'],
};
// ---- Router log in the slow-motion world -----------------------------------------------------------------------
export const LOGS=[
 [37.6,'link','Gi0/0/0, Gi0/0/1, Gi0/0/2 up/up · 198.51.100.0/24 connected'],
 [64.1,'acl','%SEC-6-IPACCESSLOGP: list QUARANTINE denied tcp 192.0.2.10(50412) -> 198.51.100.20(443), 1 packet'],
 [85.6,'test','client: hping3 -S -p 443 -s 51000 -c 1 → F-A1 gesendet'],
 [108.2,'acl','%SEC-6-IPACCESSLOGP: list QUARANTINE denied tcp 192.0.2.10(51000) -> 198.51.100.20(443), 1 packet'],
 [123.4,'test','ping 198.51.100.1: Antwort vom Router selbst – Vergleichstest, kein Anwendungstest'],
 [FIX,'cfg','%SYS-5-CONFIG_I: Configured from console by oncall on vty0 (10.99.0.15)'],
 [147.4,'cfg','Gi0/0/1: kein ausgehendes ACL-Binding · ACL QUARANTINE bleibt gespeichert'],
 [149.6,'test','client: curl TEST-A → app-a.example · neue Verbindung F-A2, Port 51001'],
 [154.19,'flow','F-A2 passiert Gi0/0/1 out · kein ACL-Treffer'],
 [157.8,'test','SYN/ACK von 198.51.100.20:443 · TCP verbunden'],
 [161.4,'test','TLS 1.3 · Zertifikat app-a.example geprüft (Labor-CA)'],
 [164.3,'flow','GET /health erreicht APP-A'],
 [OK_A,'ok','HTTP 200 · {"status":"ok"} · TEST-A bestanden'],
 [VERIFY.B,'ok','APP-B HTTP 200'],[VERIFY.C,'ok','APP-C HTTP 200'],[VERIFY.D,'ok','CTRL-D HTTP 200'],
].map(([time_s,tag,message])=>({time_s,tag,message}));
// ---- Kinetic words: only the hook "On Call." (Chorus, Final Chorus), each with one line of explanation ---------
export const KINETIC_SECTIONS=new Set(['Chorus','Final Chorus']);
export const KINETIC_TEXT=new Set(['On Call.']);
export const word=text=>text.replace(/[.,?!]/g,'').trim().toUpperCase();
export const WORD_NOTE={L017:'Bereitschaft · erreichbar, die Spur beginnt',L021:'noch keine Antwort – dranbleiben',L041:'derselbe Test, neue Verbindung',L045:'HTTP 200 · der Service läuft'};
export const STATUS=t=>t<ALARM?'Bereitschaft':t<FIX&&t<120.12?'Diagnose läuft':t<FIX?'Ursache eingegrenzt':t<OK_A?'Binding entfernt · Test läuft':t<VERIFY.D?'TEST-A bestanden':t<TICKET.closed?'Service verifiziert':'Ticket geschlossen';
