// Editorial scenario (simulated values), IPv4 only. Real places: laptop H in an office in Zürich (LAN 192.0.2.0/24 with home
// router G1=192.0.2.1 and lab router G2=192.0.2.2 on the same desk switch), transit router R2 in Frankfurt with a tunnel
// (MTU 1400) to the data centre in New York, where server D=198.51.100.20 runs. H=192.0.2.10/24.
// Main path H→G1→R2→D=198.51.100.20; transit G1–R2 in 10.0.12.0/30 (R2=10.0.12.2). R2's egress to D has MTU 1400,
// the sender link 1500. D answers echo, runs a UDP test receiver on 9000, no listener on traceroute ports 33434+.
// Five processes: echo (8/0 → 0/0), PMTUD (P-M1 dropped, 3/4 with MTU 1400, P-M2 new with 1400 B), traceroute (11/0 from
// G1 and R2), port unreachable (3/3 from D for T-3) and host redirect (5/1 from G1, gateway 192.0.2.2, validated by H).
// Every ICMP error is a new IP packet from the reporting node to H carrying a quote of the original – never the original.
export const T={ping:25.76,echoBack:31.6,pm1Drop:84.24,im1:86.62,pmtu:90.38,pm2Built:92.06,trace:112.66,line1:121.9,line2:127.3,t3AtD:127.62,line3:131.6,pm2Pass:147.9,udpOk:150.14,redirect:156.36,validated:161.62};
export const ADDR={H:'192.0.2.10',G1:'192.0.2.1',G2:'192.0.2.2',R2:'10.0.12.2',D:'198.51.100.20',X:'203.0.113.20'};
// ---- Terraced landscape: LAN terrace (H, G1, G2), transit terrace (R2 + MTU gate), target terrace (D), side target X ----
export const ST={H:[-30,0,8],G1:[-17,0,0],G2:[-17,0,16],R2:[0,1.6,0],GATE:[8,1.6,0],D:[20,3.2,0],X:[-2,0,28]};
export const NODE_LABEL={H:['Laptop H · Zürich',`${ADDR.H}/24`],G1:['G1 · Heimrouter',ADDR.G1],G2:['G2 · Labor-Router',ADDR.G2],R2:['R2 · Frankfurt',`${ADDR.R2} · Tunnel MTU 1400 →`],D:['Server D · New York',`${ADDR.D} · UDP 9000 offen · 33434+ zu`],X:['Labor-Host X',ADDR.X]};
// where each node really is (lat, lon); the logical layout ST below only sets the pacing of the flights
export const GEO={H:[47.37,8.54],G1:[47.37,8.54],G2:[47.37,8.54],X:[47.37,8.54],R2:[50.11,8.68],GATE:[50.11,8.68],D:[40.71,-74.01]};
const PATH={HD:['H','G1','R2','GATE','D'],DH:['D','GATE','R2','G1','H'],HG1:['H','G1'],G1H:['G1','H'],HR2:['H','G1','R2'],R2H:['R2','G1','H'],HX1:['H','G1','G2','X'],HX2:['H','G2','X']};
export const FLIGHTS=[],BY_ID=new Map();
const d3=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
function fly(f){f.pts=f.nodes.map(n=>ST[n]);const L=[0];for(let i=1;i<f.pts.length;i++)L.push(L[i-1]+d3(f.pts[i-1],f.pts[i]));f.L=L;f.full=L.at(-1);if(f.at){const i=f.nodes.indexOf(f.at[0]);f.t1x=f.t0+(f.at[1]-f.t0)*f.full/L[i];}f.len=f.cut!=null?L[f.cut]:f.full;f.t1=f.t0+(f.t1x-f.t0)*f.len/f.full;f.dur=f.t1x-f.t0;f.tGone=f.t1+(f.fate==='drop'?1.2:.4);FLIGHTS.push(f);BY_ID.set(f.id,f);return f;}
// data: cyan; icmp: white hull with a quote capsule (quote = id of the original)
const data=(id,nodes,t0,t1x,o={})=>fly({id,kind:'data',nodes,t0,t1x,fate:'deliver',...o});
const icmp=(id,nodes,t0,t1x,o)=>fly({id,kind:'icmp',nodes,t0,t1x,fate:'deliver',...o});
// 1 Echo
data('E-01',PATH.HD,26.2,28.4,{proto:'ICMP',type:8,code:0,hdr:'Echo Request 8/0 · ID 4242 Seq 1',src:ADDR.H,dst:ADDR.D,ttl:64});
icmp('E-02',PATH.DH,28.5,T.echoBack,{type:0,code:0,hdr:'Echo Reply 0/0 · ID 4242 Seq 1',src:ADDR.D,dst:ADDR.H,ttl:64,echoOf:'E-01'});
// 2 PMTUD: the 1500-byte DF datagram is dropped at R2's 1400 egress, the error goes back, a new datagram is built
data('P-M1',PATH.HD,77.0,0,{at:['GATE',T.pm1Drop],proto:'UDP',size:1500,df:1,ipid:'0x1201',hdr:'UDP → 9000 · 1500 B · DF=1',src:ADDR.H,dst:ADDR.D,fate:'drop',cut:3});
icmp('I-M1',PATH.R2H,T.im1,T.pmtu-.2,{type:3,code:4,mtu:1400,quote:'P-M1',hdr:'ICMP 3/4 · Fragmentation Needed · MTU 1400',src:ADDR.R2,dst:ADDR.H});
data('P-M2',PATH.HD,145.0,149.6,{proto:'UDP',size:1400,df:1,ipid:'0x1202',hdr:'UDP → 9000 · 1400 B · neu',src:ADDR.H,dst:ADDR.D});
data('P-M3',PATH.HD,199.8,204.6,{proto:'UDP',size:1400,df:1,ipid:'0x1203',hdr:'UDP → 9000 · 1400 B',src:ADDR.H,dst:ADDR.D});
// 3/4 Traceroute: three new probes, TTL 1/2/3; answers 11/0 (G1), 11/0 (R2), 3/3 (D)
data('T-1',PATH.HG1,114.0,117.6,{proto:'UDP',ttl:1,dport:33434,ipid:'0x2101',hdr:'UDP → 33434 · TTL 1',src:ADDR.H,dst:ADDR.D,fate:'expire'});
icmp('TE-1',PATH.G1H,120.1,T.line1,{type:11,code:0,quote:'T-1',hdr:'ICMP 11/0 · TTL exceeded · von G1',src:ADDR.G1,dst:ADDR.H});
data('T-2',PATH.HR2,124.3,125.95,{proto:'UDP',ttl:2,dport:33435,ipid:'0x2102',hdr:'UDP → 33435 · TTL 2',src:ADDR.H,dst:ADDR.D,fate:'expire'});
icmp('TE-2',PATH.R2H,126.05,T.line2,{type:11,code:0,quote:'T-2',hdr:'ICMP 11/0 · TTL exceeded · von R2',src:ADDR.R2,dst:ADDR.H});
data('T-3',PATH.HD,124.6,T.t3AtD,{proto:'UDP',ttl:3,dport:33436,ipid:'0x2103',hdr:'UDP → 33436 · TTL 3',src:ADDR.H,dst:ADDR.D});
icmp('PU-3',PATH.DH,129.95,T.line3,{type:3,code:3,quote:'T-3',hdr:'ICMP 3/3 · Port Unreachable · von D',src:ADDR.D,dst:ADDR.H});
// 5 Redirect: G1 forwards over the same LAN interface to G2 and tells H; H validates, then a new packet goes via G2
data('R-1',PATH.HX1,152.6,159.9,{proto:'TCP',hdr:'TCP → 203.0.113.20:443',src:ADDR.H,dst:ADDR.X});
icmp('RD-1',PATH.G1H,T.redirect,157.6,{type:5,code:1,gw:ADDR.G2,quote:'R-1',hdr:'ICMP 5/1 · Redirect Host · Gateway 192.0.2.2',src:ADDR.G1,dst:ADDR.H});
data('R-2',PATH.HX2,T.validated,165.6,{proto:'TCP',hdr:'TCP → 203.0.113.20:443 · via G2',src:ADDR.H,dst:ADDR.X});
data('R-3',PATH.HX2,205.6,209.4,{proto:'TCP',hdr:'TCP → 203.0.113.20:443 · via G2',src:ADDR.H,dst:ADDR.X});
FLIGHTS.sort((a,b)=>a.t0-b.t0);
// logical segment of a flight at t: index i between nodes[i] and nodes[i+1], fraction u – every zone maps it onto its own geometry
export function segAt(f,t){const s=Math.max(0,Math.min(f.len,(t-f.t0)/f.dur*f.full)),L=f.L;let i=1;while(i<L.length-1&&L[i]<s)i++;const u=L[i]===L[i-1]?1:(s-L[i-1])/(L[i]-L[i-1]);return{i:i-1,u:Math.max(0,Math.min(1,u)),a:f.nodes[i-1],b:f.nodes[i],end:s>=f.len-1e-9};}
export function pointAt(f,t){const s=Math.max(0,Math.min(f.len,(t-f.t0)/f.dur*f.full)),L=f.L;let i=1;while(i<L.length-1&&L[i]<s)i++;const a=f.pts[i-1],b=f.pts[i],u=L[i]===L[i-1]?0:(s-L[i-1])/(L[i]-L[i-1]);return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u+1.1,a[2]+(b[2]-a[2])*u];}
export const activeFlights=t=>FLIGHTS.filter(f=>f.t0<=t&&t<=f.tGone);
// ---- What H knows (received messages, caches) --------------------------------------------------------------------
export const received=t=>FLIGHTS.filter(f=>f.kind==='icmp'&&f.t1<=t);
export const pmtu=t=>t>=T.pmtu?1400:null;
export const routeX=t=>t>=T.validated?ADDR.G2:ADDR.G1;
export const traceLines=t=>{const out=[];if(t>=T.line1)out.push(' 1  192.0.2.1      1.2 ms');if(t>=T.line2)out.push(' 2  10.0.12.2     9.6 ms');if(t>=T.line3)out.push(' 3  198.51.100.20 92.1 ms');return out;};
// ---- Screen texts (B-IDs) ------------------------------------------------------------------------------------------
export const BLOCKS={
 B01:{title:'ping',win:[T.ping,43.88],lines:[[25.9,'h$ ping -c 1 198.51.100.20','cmd'],[26.2,'PING 198.51.100.20 (198.51.100.20) 56(84) bytes of data.',''],[T.echoBack,'64 bytes from 198.51.100.20: icmp_seq=1 ttl=62 time=92.4 ms','ok'],[T.echoBack,'1 packets transmitted, 1 received, 0% packet loss','ok'],[T.echoBack+.3,'Headerkarte: E-01 8/0 -> E-02 0/0 | Echo ID 4242 Seq 1','ov']]},
 B02:{title:'PMTUD',win:[83.48,98.08],pages:[83.48,92.06],lines:[[83.6,'P-M1 | IPv4 len 1500 | DF 1 | UDP dst 9000 | IP ID 0x1201','',0],[T.pm1Drop,'R2: MTU 1400 -> DROP','bad',0],[T.im1,'I-M1 | src 10.0.12.2 -> dst 192.0.2.10','',0],[T.im1,'ICMP Type 3 Code 4 | Next-Hop MTU 1400','amber',0],[T.im1+.4,'Quoted: P-M1 IP header + UDP header','',0],
  [T.pm2Built,'P-M2 | NEU | IPv4 len 1400 | DF 1 | IP ID 0x1202','ok',1],[T.pm2Built,'20 IP + 8 UDP + 1372 Daten = 1400 Byte','',1],[94.4,'Gegenbeispiel gefiltertes ICMP: separat gekennzeichnet','ov',1]]},
 B03:{title:'traceroute',win:[T.trace,136.54],pages:[T.trace,129.9],lines:[[112.8,'h$ traceroute -n -q 1 -m 3 198.51.100.20','cmd',0],[113.6,'traceroute to 198.51.100.20, 3 hops max, 60 byte packets','',0],[T.line1,' 1  192.0.2.1      1.2 ms','',0],[T.line2,' 2  10.0.12.2     9.6 ms','',0],
  [T.line3,' 3  198.51.100.20 92.1 ms','ok',1],[T.line3,'Overlay: UDP-Probes TTL 1/2/3 = drei neue Datagramme','ov',1],[T.line3+.3,'Antworten: G1 11/0 | R2 11/0 | D 3/3','amber',1]]},
 B04:{title:'Port Unreachable',win:[T.t3AtD,136.54],lines:[[T.t3AtD,'T-3: UDP-Traceroute-Zielport | TTL bei Sender 3',''],[T.t3AtD,'D erreicht, UDP-Socket nicht belegt',''],[129.95,'ICMP src 198.51.100.20 -> dst 192.0.2.10',''],[129.95,'Type 3 Code 3: Destination Unreachable / Port Unreachable','amber'],[130.3,'Zitat: IP-Header T-3 + erste 8 Byte UDP','']]},
 B05:{title:'Redirect (Labor)',win:[152.2,169.62],pages:[152.2,T.redirect],lines:[[152.3,'Isoliertes Laborszenario, Redirect-Annahme explizit freigeschaltet','ov',0],[152.3,'Auslöser: H -> 203.0.113.20 zunächst via G1','',0],
  [T.redirect,'ICMP src 192.0.2.1 -> dst 192.0.2.10','',1],[T.redirect,'Type 5 Code 1: Redirect for Host','amber',1],[T.redirect,'Gateway: 192.0.2.2','amber',1],[T.redirect+.3,'Zitat: ursprünglicher IP-Header + Transportbeginn','',1],[159.7,'Prüfung: aktueller Gateway / passendes Zitat / Next Hop im LAN','ok',1],[T.validated,'Erst danach: neues Paket direkt H -> G2','ok',1]]},
 B06:{title:'Zusammenfassung',win:[169.62,199.62],pages:[169.62,184.78],lines:[[169.7,'IPv4 ICMP — geprüfte Vorgänge','head',0],[169.7,'8/0  Echo Request      0/0  Echo Reply','',0],[169.7,'3/4  Fragmentation Needed (DF, MTU 1400)','',0],[169.7,'11/0 TTL Exceeded in Transit','',0],
  [184.8,'3/3  Destination Unreachable: UDP Port','',1],[184.8,'5/1  Redirect: Host, Gateway 192.0.2.2','',1],[184.8,'Jede Fehlerantwort referenziert ihr eigenes Original','ov',1]]},
};
const CPS=70;
export function blockLines(id,t){const b=BLOCKS[id];if(!b)return[];const page=b.pages?b.pages.filter(p=>t>=p).length-1:-1;
 return b.lines.filter(l=>t>=l[0]&&(page<0||l[3]===page)).map(([t0,text,kind=''])=>{if(kind==='cmd'){const m=/^\S+[#$] /.exec(text),pre=m?m[0].length:0,n=Math.min(text.length,pre+Math.floor((t-t0)*CPS));return{text:text.slice(0,n),kind,typing:n<text.length};}return{text,kind,typing:false};});}
export function dockBlocks(t){return Object.entries(BLOCKS).filter(([,b])=>t>=b.win[0]&&t<b.win[1]).map(([id])=>id).sort((a,b)=>BLOCKS[b].win[0]-BLOCKS[a].win[0]).slice(0,2);}
// ---- Header cards: which packet the header room shows at t ------------------------------------------------------------
export function headerFocus(t){
 if(t<26)return{kind:'schema'};if(t<36.9)return{kind:'pkt',id:'E-01'};if(t<55)return{kind:'pkt',id:'E-02'};if(t<83.48)return{kind:'schema',quote:true};if(t<86.62)return{kind:'pkt',id:'P-M1'};
 if(t<94.38)return{kind:'pkt',id:'I-M1'};if(t<98.08)return{kind:'counter'};if(t<120)return{kind:'cards',n:3};if(t<129.9)return{kind:'pkt',id:'TE-1'};if(t<137.98)return{kind:'pkt',id:'PU-3'};if(t<156.36)return{kind:'cards',n:4};
 if(t<169.62)return{kind:'pkt',id:'RD-1'};if(t<190.64)return{kind:'cards',n:6};if(t<191.32)return{kind:'pkt',id:'E-01',big:true};if(t<198)return{kind:'pkt',id:'E-02',big:true};return{kind:'cards',n:6};}
export const CARDS=[['8/0','Echo Request','H → D'],['0/0','Echo Reply','D → H'],['3/4','Fragmentation Needed','R2 → H · MTU 1400'],['11/0','Time Exceeded','G1, R2 → H'],['3/3','Port Unreachable','D → H · UDP 33436'],['5/1','Redirect Host','G1 → H · GW 192.0.2.2']];
// ---- Kinetic words, logs, status -------------------------------------------------------------------------------------
export const KINETIC={L003:'ICMP',L007:'ECHO REQUEST',L008:'ECHO REPLY',L014:'ICMP',L018:'ICMP',L024:'DF = 1',L026:'FRAGMENTATION NEEDED',L032:'ECHO REPLY',L033:'TIME EXCEEDED',L034:'REDIRECT',L036:'ICMP',L040:'TIME EXCEEDED',L048:'ICMP',L052:'ICMP',L064:'ICMP',L068:'ICMP',L072:'REQUEST',L073:'REPLY',L075:'ICMP'};
export const WORD_NOTE={L003:'Internet Control Message Protocol · IP-Protokoll 1',L007:'Type 8 Code 0',L008:'Type 0 Code 0 · gleiche ID und Sequenz',L014:'mehr als ein Ping',L018:'jede Fehlerantwort geht an den Sender zurück',L024:'Don’t Fragment im IP-Header',L026:'Type 3 Code 4 · Next-Hop MTU 1400',
 L032:'Referenz: das Echo-Paar',L033:'Type 11 · Vorschau',L034:'Type 5 · Vorschau – H nutzt weiter G1',L036:'eine Rückwegachse für alle Antworten',L040:'Type 11 Code 0 · TTL abgelaufen',L048:'Echo, MTU, TTL verstanden',L052:'Fehlerzitate sind lesbare Rückmeldung',L064:'fünf Vorgänge, eine Landschaft',L068:'jede Station behält ihre Mechanik',L072:'Type 8 Code 0',L073:'Type 0 Code 0',L075:'Quelle, Router, Ziel'};
export const LOGS=[
 [26.2,'tx','H: Echo Request 8/0 → 198.51.100.20 (E-01)'],[T.echoBack,'rx','H: Echo Reply 0/0 von 198.51.100.20 · ID 4242 Seq 1'],[77.0,'tx','H: UDP 1500 B DF=1 → 198.51.100.20:9000 (P-M1)'],[T.pm1Drop,'drop','R2: 1500 > MTU 1400, DF=1 → verworfen'],
 [T.pmtu-.2,'rx','H: ICMP 3/4 von 10.0.12.2 · MTU 1400 → PMTU-Cache'],[114.0,'tx','traceroute: T-1 TTL 1'],[T.line1,'rx','H: ICMP 11/0 von 192.0.2.1'],[T.line2,'rx','H: ICMP 11/0 von 10.0.12.2'],[T.line3,'rx','H: ICMP 3/3 von 198.51.100.20 · Port 33436'],
 [145.0,'tx','H: UDP 1400 B → 198.51.100.20:9000 (P-M2)'],[T.udpOk,'ok','UDP-Testempfänger 9000: P-M2 erhalten'],[T.redirect,'rx','H: ICMP 5/1 von 192.0.2.1 · Gateway 192.0.2.2'],[T.validated,'ok','H: Redirect geprüft · 203.0.113.20 via 192.0.2.2'],
].map(([time_s,tag,message])=>({time_s,tag,message}));
export const STATUS=t=>t<T.ping?'IPv4 · Zürich → Frankfurt → New York':t<70?'Echo 8/0 → 0/0':t<T.trace?'PMTUD · MTU 1400':t<152.2?'Traceroute · 11/0 · 3/3':t<169.62?'Redirect 5/1 (Labor)':'fünf Vorgänge geprüft';
