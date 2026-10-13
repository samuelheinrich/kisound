// Editorial scenario (simulated values): client 192.0.2.10 talks HTTPS to APP 198.51.100.20. SW-A (IOS XE): client
// Gi1/0/7, bulk source Gi1/0/8, uplink Gi1/0/48 with a physical 100 Mbit/s link to SW-B Gi1/0/48 (access VLAN 120);
// SW-B routes at 192.0.2.1 to 198.51.100.0/24, the server hangs at SW-B Gi1/0/7 (VLAN 220). Bulk traffic competes at
// exactly this output queue. SPAN on SW-A (Gi1/0/7-8 rx, Gi1/0/48 rx → Gi1/0/24, capture BEFORE) and on SW-B
// (Gi1/0/48 rx, Gi1/0/7 rx → Gi1/0/24, capture AFTER). Segment Seq=12001/Len=1200 (O-101) is in BEFORE but not in
// AFTER; its retransmission O-102 (same byte range, new frame) is in both. Zero capture drops and +18 output drops at
// SW-A Gi1/0/48 localise the loss. Controlled test: bulk source 95 → 20 Mbit/s, same HTTPS test with a new connection.
import {DURATION} from './config.js';
export const CAP_START=0,ROW_SELECT=62.72,IP_FILTER=70.34,STREAM_FILTER=73.46,FINDING=137.3,BULK_LIMIT=139.8,NEW_TEST=142.72,HTTP_OK=157.26,CAP_STOP=168.22;
export const ADDR={client:'192.0.2.10',server:'198.51.100.20',gw:'192.0.2.1',cmp:'192.0.2.30',bulk:'192.0.2.40',bulkDst:'198.51.100.50'};
// ---- Stations of the physical path (net zone; client left, server right; mirrors behind at -z) ---------------------
export const ST={CL:[-34,0,0],A7:[-22,1.2,0],AQ:[-14,1.2,0],UP:[0,1.4,0],B48:[14,1.2,0],B7:[22,1.2,0],SRV:[34,0,0],
 BULK:[-34,0,10],A8:[-22,1.2,5],A24:[-18,1.2,-6],ANA_A:[-18,0,-17],B24:[18,1.2,-6],ANA_B:[18,0,-17],C2:[22,0,13],B5:[22,1.2,6]};
export const LABEL={CL:['CLIENT','192.0.2.10 · «Bei mir nicht»'],SRV:['APP','198.51.100.20:443'],BULK:['BULK-QUELLE','192.0.2.40 → 198.51.100.50'],C2:['VERGLEICH','192.0.2.30 · «Bei mir geht’s»'],
 ANA_A:['ANALYZER BEFORE','SW-A Gi1/0/24 · 1 Gbit/s'],ANA_B:['ANALYZER AFTER','SW-B Gi1/0/24 · 1 Gbit/s']};
const PATH={up:['CL','A7','AQ','UP','B48','B7','SRV'],down:['SRV','B7','B48','UP','AQ','A7','CL'],bulk:['BULK','A8','AQ','UP','B48','B7','SRV'],cmp:['C2','B5','B7','SRV'],cmpBack:['SRV','B7','B5','C2'],
 mirA:['A7','A24','ANA_A'],mirA8:['A8','A24','ANA_A'],mirB:['B48','B24','ANA_B'],mirBback:['B7','B24','ANA_B'],mirAback:['A7','A24','ANA_A']};
export const FLIGHTS=[],BY_ID=new Map();
const d3=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
// A flight along a station path with constant speed from t0; optional `cut` = index of the station where it dies.
function fly(f){f.pts=f.nodes.map(n=>ST[n]);const L=[0];for(let i=1;i<f.pts.length;i++)L.push(L[i-1]+d3(f.pts[i-1],f.pts[i]));f.L=L;f.full=L.at(-1);f.len=f.cut!=null?L[f.cut]:f.full;
 f.t1=f.t0+f.dur*f.len/f.full;f.at=n=>f.t0+f.dur*L[f.nodes.indexOf(n)]/f.full;f.tGone=f.t1+(f.fate==='drop'?1.0:.25);FLIGHTS.push(f);BY_ID.set(f.id,f);return f;}
export function random(i){const n=Math.sin((i+20505)*127.1)*43758.5453;return n-Math.floor(n);}
const queueDrops=[];
// A test-stream segment: original along the path (maybe dropped at the queue), its SPAN copy at SW-A, and – if it got
// through – its SPAN copy at SW-B. Mirror copies never travel on as production packets.
function segment(id,t0,o={}){const dur=o.dur??3.2,drop=!!o.drop,orig=fly({id,kind:'orig',nodes:PATH.up,t0,dur,fate:drop?'drop':'deliver',cut:drop?2:null,...o});
 const ta=orig.at('A7');fly({id:`M-B-${id}`,kind:'mirror',side:'BEFORE',of:id,nodes:PATH.mirA,t0:ta,dur:1.4,fate:'deliver',replay:o.replay,name:o.mname});
 if(!drop){const tb=orig.at('B48');fly({id:`M-A-${id}`,kind:'mirror',side:'AFTER',of:id,nodes:PATH.mirB,t0:tb,dur:1.4,fate:'deliver',replay:o.replay,name:o.mname2});}
 else if(!o.replay)queueDrops.push(orig.t1);return orig;}
// Background: the stalling HTTPS stream before the fix (originals and ACKs), the bulk transfer, the comparison client.
segment('BG1',6.0,{name:'Original · weiss',mname:'Mirror-Kopie · gestrichelt'});
segment('O-101',16.9,{drop:true,name:'O-101 · Seq=12001',mname:'M-B101'});BY_ID.set('MB101',BY_ID.get('M-B-O-101'));
segment('O-102',20.6,{name:'O-102 · Retransmission',mname:'M-B102',mname2:'M-A102'});
segment('MBG2x',27.0,{mname:'Mirror-Kopie → BEFORE'});BY_ID.set('MBG2',BY_ID.get('M-B-MBG2x'));
segment('O200',50.9,{name:'Original → Uplink',mname:'Kopie → Gi1/0/24'});
// Replays from the recorded captures (no new transport, never counted).
segment('RO101',105.6,{drop:true,replay:true,name:'O-101 · Wiedergabe',mname:'M-B101 · Wiedergabe'});
segment('RO102',115.5,{replay:true,name:'O-102 · Wiedergabe',mname:'M-B102',mname2:'M-A102 · AFTER'});
// The controlled test: new TCP connection (port 51001), passes the same queue after the bulk limit.
segment('N1',143.0,{name:'Neuer Test · SYN 51001',flags:'SYN',dur:3.0,mname:'M-B (neu)',mname2:'M-A (neu)'});
fly({id:'N1R',kind:'orig',nodes:PATH.down,t0:146.3,dur:3.0,fate:'deliver',name:'SYN/ACK'});
segment('N2',149.6,{name:'GET /health (TLS)',dur:3.0});fly({id:'N2R',kind:'orig',nodes:PATH.down,t0:HTTP_OK-3.2,dur:3.2,fate:'deliver',name:'HTTP-Antwort (TLS)'});
{let k=0;for(let t=0.4;t<DURATION-3;k++){const limited=t>=BULK_LIMIT;const drop=!limited&&t>12&&t<62&&random(k)<.13&&queueDrops.length<18;
  const f=fly({id:`BK${k}`,kind:'bulk',nodes:PATH.bulk,t0:t,dur:3.4,fate:drop?'drop':'deliver',cut:drop?2:null});if(drop)queueDrops.push(f.t1);
  if(k%3===0)fly({id:`MK${k}`,kind:'mirror',side:'BEFORE',of:f.id,nodes:PATH.mirA8,t0:f.at('A8'),dur:1.4,fate:'deliver'});t+=limited?1.25:.27+.06*random(k+5);}}
{let k=0;for(let t=1.0;t<DURATION-5;k++,t+=2.6+random(k)){fly({id:`CM${k}`,kind:'cmp',nodes:PATH.cmp,t0:t,dur:1.6,fate:'deliver'});fly({id:`CM${k}R`,kind:'cmp',nodes:PATH.cmpBack,t0:t+1.8,dur:1.6,fate:'deliver'});}}
FLIGHTS.sort((a,b)=>a.t0-b.t0);queueDrops.sort((a,b)=>a-b);
export const QUEUE_DROPS=queueDrops;
export function pointAt(f,t){const s=Math.max(0,Math.min(f.len,(t-f.t0)/(f.dur)*f.full)),L=f.L;let i=1;while(i<L.length-1&&L[i]<s)i++;const a=f.pts[i-1],b=f.pts[i],u=L[i]===L[i-1]?0:(s-L[i-1])/(L[i]-L[i-1]);return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u+(f.kind==='mirror'?.5:0),a[2]+(b[2]-a[2])*u];}
export const activeFlights=t=>FLIGHTS.filter(f=>f.t0<=t&&t<=f.tGone);
// SW-A Gi1/0/48 output drops (measurement window 3800 → 3818), unchanged during the controlled test.
export const outputDrops=t=>3800+QUEUE_DROPS.filter(x=>x<=t).length;
export const queueFill=t=>t<BULK_LIMIT?.86+.1*Math.sin(t*2.1):Math.max(.18,.9-(t-BULK_LIMIT)*.35);
export const bulkRate=t=>t<BULK_LIMIT?95:20;
// ---- The captures (simulated PCAP rows; relative capture time ≠ film time) ------------------------------------------
const R=(no,time,src,dst,proto,info,o={})=>({no,time,src,dst,proto,info,...o});
export const BEFORE_ROWS=[
 R(96,'11.8012','192.0.2.40','198.51.100.50','TCP','40112 → 8443 [ACK] Seq=5524801 Len=1460',{other:true}),
 R(97,'11.8210','192.0.2.10','198.51.100.20','TCP','51000 → 443 [ACK] Seq=9601 Ack=4381 Len=1200',{stream:7}),
 R(98,'11.8452','198.51.100.20','192.0.2.10','TCP','443 → 51000 [ACK] Seq=4381 Ack=10801 Len=0',{stream:7,rev:true}),
 R(99,'11.9020','192.0.2.10','198.51.100.20','TCP','51000 → 443 [ACK] Seq=10801 Ack=4381 Len=1200',{stream:7,seq:10801}),
 R(100,'11.9533','192.0.2.30','198.51.100.20','TLSv1.3','Application Data',{other:true,stream:9}),
 R(101,'12.0010','192.0.2.10','198.51.100.20','TCP','51000 → 443 [ACK] Seq=12001 Ack=4381 Len=1200',{stream:7,seq:12001,lost:true}),
 R(102,'12.2510','192.0.2.10','198.51.100.20','TCP','[TCP Retransmission] 51000 → 443 [ACK] Seq=12001 Len=1200',{stream:7,seq:12001,retrans:true}),
 R(103,'12.2610','192.0.2.10','198.51.100.20','TCP','51000 → 443 [ACK] Seq=13201 Ack=4381 Len=1200',{stream:7,seq:13201}),
 R(104,'12.2894','198.51.100.20','192.0.2.10','TCP','443 → 51000 [ACK] Seq=4381 Ack=14401 Len=0',{stream:7,rev:true}),
 R(105,'12.3011','192.0.2.30','198.51.100.20','TCP','51522 → 443 [RST] Seq=2201 Len=0',{other:true,stream:9,rst:true}),
];
export const AFTER_ROWS=[
 R(84,'11.8221','192.0.2.10','198.51.100.20','TCP','51000 → 443 [ACK] Seq=9601 Ack=4381 Len=1200',{stream:3}),
 R(85,'11.9031','192.0.2.10','198.51.100.20','TCP','51000 → 443 [ACK] Seq=10801 Ack=4381 Len=1200',{stream:3,seq:10801}),
 R(86,'11.9544','192.0.2.30','198.51.100.20','TLSv1.3','Application Data',{other:true}),
 R(87,'12.2521','192.0.2.10','198.51.100.20','TCP','51000 → 443 [ACK] Seq=12001 Ack=4381 Len=1200',{stream:3,seq:12001}),
 R(88,'12.2621','192.0.2.10','198.51.100.20','TCP','51000 → 443 [ACK] Seq=13201 Ack=4381 Len=1200',{stream:3,seq:13201}),
 R(89,'12.2883','198.51.100.20','192.0.2.10','TCP','443 → 51000 [ACK] Seq=4381 Ack=14401 Len=0',{stream:3,rev:true}),
];
export const NEW_ROWS={BEFORE:[R(412,'61.0040','192.0.2.10','198.51.100.20','TCP','51001 → 443 [SYN] Seq=0',{stream:14}),R(415,'61.0121','192.0.2.10','198.51.100.20','TLSv1.3','Client Hello',{stream:14}),R(420,'61.0410','192.0.2.10','198.51.100.20','TLSv1.3','Application Data',{stream:14}),R(423,'61.0503','198.51.100.20','192.0.2.10','TLSv1.3','Application Data',{stream:14,rev:true})],
 AFTER:[R(301,'61.0051','192.0.2.10','198.51.100.20','TCP','51001 → 443 [SYN] Seq=0',{stream:8}),R(304,'61.0132','192.0.2.10','198.51.100.20','TLSv1.3','Client Hello',{stream:8}),R(309,'61.0421','192.0.2.10','198.51.100.20','TLSv1.3','Application Data',{stream:8}),R(312,'61.0492','198.51.100.20','192.0.2.10','TLSv1.3','Application Data',{stream:8,rev:true})]};
// What a capture GUI shows at film time t: filter, rows, selection, counts, running/stopped.
export function guiState(side,t){
 const rows=side==='BEFORE'?BEFORE_ROWS:AFTER_ROWS,stopped=t>=CAP_STOP,filt=t<IP_FILTER?'':t<STREAM_FILTER?'ip.addr == 192.0.2.10 && ip.addr == 198.51.100.20 && tcp.port == 443':side==='BEFORE'?'tcp.stream == 7':'tcp.stream == 3';
 const shown=rows.filter(r=>!filt?true:filt.startsWith('ip')?!r.other||r.src===ADDR.client||r.dst===ADDR.client?!r.other:false:r.stream===(side==='BEFORE'?7:3));
 const extra=t>=NEW_TEST+1.5?NEW_ROWS[side]:[];
 const total=Math.min(t,CAP_STOP)<1?0:Math.round(Math.min(t,CAP_STOP)*(side==='BEFORE'?118:61)),displayed=filt?(filt.startsWith('ip')?212:92):total;
 let sel=null;if(t>=ROW_SELECT&&t<92.5)sel=side==='BEFORE'?101:87;else if(t>=92.5&&t<93.3)sel=side==='BEFORE'?99:85;else if(t>=93.3&&t<94.1)sel=side==='BEFORE'?101:87;else if(t>=94.1&&t<108.78)sel=side==='BEFORE'?103:88;else if(t>=108.78&&t<NEW_TEST)sel=side==='BEFORE'?102:87;else if(t>=NEW_TEST+1.5)sel=side==='BEFORE'?420:309;
 return{side,filt,rows:shown,extra,total,displayed,dropped:0,sel,stopped,filterTyping:t>=IP_FILTER&&t<IP_FILTER+1.6||t>=STREAM_FILTER&&t<STREAM_FILTER+.8};
}
// The protocol tree of the selected frame (B04 for the lost segment; the new test afterwards).
export function detailTree(t){const neu=t>=NEW_TEST+1.5;return[
 ['Frame',neu?'Frame 420: 1254 bytes on wire':'Frame 101: 1254 bytes on wire'],['Ethernet II','Src: 02:00:00:00:01:20, Dst: 02:00:00:00:00:01'],['Internet Protocol Version 4',`Src: ${ADDR.client}, Dst: ${ADDR.server}`],
 ['Transmission Control Protocol',neu?'Src Port: 51001, Dst Port: 443':'Src Port: 51000    Dst Port: 443'],[' Sequence Number',neu?'1 (relative)':'12001 (relative)'],[' TCP Segment Len',neu?'517':'1200'],
 ['Transport Layer Security','Application Data'],['TLS secrets','nicht vorhanden | Payload verschlüsselt']];}
// ---- Screen texts (B-IDs) ---------------------------------------------------------------------------------------------
export const BLOCKS={
 B01:{title:'SPAN-Sessions (vorbereitet)',win:[24.96,60.0],pages:[24.96,50.64],lines:[[25.1,'SW-A# show monitor session 1','cmd',0],[25.8,'Type              : Local Session','',0],[25.8,'Source Ports      : RX Only: Gi1/0/7,Gi1/0/8,Gi1/0/48','',0],[25.8,'Destination Ports : Gi1/0/24','',0],
  [50.8,'SW-A: monitor session 1 source interface Gi1/0/7 - 8 rx','',1],[50.8,'SW-A: monitor session 1 source interface Gi1/0/48 rx','',1],[50.8,'SW-A: monitor session 1 destination interface Gi1/0/24','',1],[51.4,'SW-B: … source Gi1/0/48 rx, Gi1/0/7 rx → destination Gi1/0/24','',1]]},
 B02:{title:'Displayfilter (kein Capturefilter)',win:[IP_FILTER,89.32],lines:[[70.4,'Display filter:',''],[70.4,'ip.addr == 192.0.2.10 && ip.addr == 198.51.100.20 && tcp.port == 443','cmd'],[73.5,'Danach im BEFORE-PCAP:',''],[73.5,'tcp.stream == 7','cmd'],[74.4,'Status: Packets 8400 | Displayed 92 | Dropped 0','ok']]},
 B03:{title:'BEFORE / AFTER',win:[105.94,124.68],pages:[105.94,117.84],lines:[[106.1,'Simulierte PCAP-Zeilen; relative TCP-Sequenznummern','ov',0],[106.1,'BEFORE (Stream 7):','',0],[106.3,'101  12.0010  …10 → …20  Seq=12001 Len=1200','',0],[108.9,'102  12.2510  [TCP Retransmission] Seq=12001 Len=1200','amber',0],
  [117.9,'AFTER (Stream 3):','',1],[117.9,' 87  12.2521  …10 → …20  Seq=12001 Len=1200','',1],[122.2,'Overlay: erster Bytebereich BEFORE vorhanden / AFTER fehlt','amber',1],[122.2,'Capturezeit ist Messzeit, nicht Filmzeit','ov',1]]},
 B04:{title:'Protokollbaum · ohne Secrets',win:[124.68,133.52],pages:[124.68,129.1],lines:[[124.8,'Transmission Control Protocol','',0],[124.8,' Src Port: 51000    Dst Port: 443','',0],[124.8,' Sequence Number: 12001 (relative)','',0],[124.8,' TCP Segment Len: 1200','',0],
  [129.2,'Transport Layer Security','',1],[129.2,' Application Data','',1],[129.2,'TLS secrets: nicht vorhanden | Payload verschlüsselt','amber',1]]},
 B05:{title:'Befund',win:[FINDING,151.66],pages:[FINDING,143.38],lines:[[137.4,'SW-A# show interfaces GigabitEthernet1/0/48','cmd',0],[138.0,'GigabitEthernet1/0/48 is up, line protocol is up','',0],[138.0,'  Full-duplex, 100Mb/s','',0],[138.0,'  Total output drops: 3818','bad',0],
  [143.5,'Overlay Messfenster: 3800 -> 3818 (Delta +18)','amber',1],[143.5,'BEFORE Capture-Drops: 0    AFTER Capture-Drops: 0','ok',1],[143.5,'Mirror-Ports: 1 Gbit/s; gespiegelte Last unter Kapazität','',1],[144.2,'Befund: Verlust am SW-A-Uplink-Ausgang unter Konkurrenzlast','amber',1]]},
 B06:{title:'Kontrollierter Versuch',win:[BULK_LIMIT,CAP_STOP],pages:[BULK_LIMIT,HTTP_OK],lines:[[139.9,'Kontrollierter Versuch: Bulk-Quelle 95 -> 20 Mbit/s','amber',0],[139.9,'Uplink unverändert: 100 Mbit/s','',0],[142.8,"client$ curl --connect-timeout 3 --max-time 5 --resolve app.example:443:198.51.100.20 --write-out '\\nHTTP %{http_code}\\n' https://app.example/health",'cmd',0],[142.9,'Neuer Tuple: 192.0.2.10:51001 -> 198.51.100.20:443','',0],
  [HTTP_OK,'{"status":"ok"}','ok',1],[HTTP_OK,'HTTP 200','ok',1],[HTTP_OK+.4,'Messfenster: Testsegmente BEFORE+AFTER | Output-Drop-Delta 0','ok',1],[HTTP_OK+.4,'HTTP 200: lokales Clientergebnis, kein TLS-Klartext im Capture','',1]]},
 B07:{title:'Gesichert',win:[CAP_STOP,189.8],lines:[[CAP_STOP,'Capture: STOPPED','amber'],[172.5,'before.pcapng | after.pcapng | counters-before-after.txt',''],[173.6,'report.txt: Uplink-Output-Verlust unter konkurrierender Last',''],[173.6,'Kontrollversuch mit reduzierter Konkurrenz: erfolgreich','ok'],[173.6,'TLS-Payload weiterhin verschlüsselt','']]},
};
const CPS=70;
export function blockLines(id,t){const b=BLOCKS[id];if(!b)return[];const page=b.pages?b.pages.filter(p=>t>=p).length-1:-1;
 return b.lines.filter(l=>t>=l[0]&&(page<0||l[3]===page)).map(([t0,text,kind=''])=>{if(kind==='cmd'){const m=/^\S+[#$] /.exec(text),pre=m?m[0].length:0,n=Math.min(text.length,pre+Math.floor((t-t0)*CPS));return{text:text.slice(0,n),kind,typing:n<text.length};}return{text,kind,typing:false};});}
export function dockBlocks(t){return Object.entries(BLOCKS).filter(([,b])=>t>=b.win[0]&&t<b.win[1]).map(([id])=>id).sort((a,b)=>BLOCKS[b].win[0]-BLOCKS[a].win[0]).slice(0,2);}
export const THESES=[['These','«Der Server ist down»'],['These','«Das ist DNS»'],['These','«Die Firewall blockt»']];
// ---- Words, logs, status ---------------------------------------------------------------------------------------------
export const KINETIC={L017:'WIRESHARK',L021:'WIRESHARK',L041:'WIRESHARK',L045:'WIRESHARK'};
export const WORD_NOTE={L017:'Mitschnitt öffnen: BEFORE, Stream 7',L021:'noch kein Urteil – erst der zweite Capture',L041:'derselbe Test, neue Verbindung · Port 51001',L045:'beide Seiten sehen die Testsegmente'};
export const LOGS=[
 [16.9,'cap','BEFORE: Seq=12001 Len=1200 gespiegelt (M-B101)'],[17.7,'drop','SW-A Gi1/0/48: Output-Drop (Queue voll)'],[20.6,'cap','O-102: Retransmission desselben Bytebereichs'],
 [IP_FILTER,'flt','Displayfilter gesetzt – Frames bleiben im Mitschnitt'],[105.95,'rec','Wiedergabe aus dem Mitschnitt: O-101 erreicht AFTER nie'],[115.6,'rec','Wiedergabe: O-102 erscheint in BEFORE und AFTER'],
 [FINDING,'find','Befund: Delta +18 Output-Drops · Capture-Drops 0 · AFTER fehlt der Bytebereich'],[BULK_LIMIT,'cfg','Bulk-Quelle 95 → 20 Mbit/s (Uplink bleibt 100 Mbit/s)'],
 [NEW_TEST+.3,'cap','Neuer Test 192.0.2.10:51001 → 198.51.100.20:443'],[HTTP_OK,'ok','HTTP 200 am Testclient · Output-Drop-Delta 0'],[CAP_STOP,'cap','Capture STOPPED · before.pcapng / after.pcapng gesichert'],
].map(([time_s,tag,message])=>({time_s,tag,message}));
export const STATUS=t=>t<24.96?'«geht» / «geht nicht»':t<FINDING?'Capture läuft · Spur offen':t<BULK_LIMIT?'Befund: Uplink-Ausgang':t<HTTP_OK?'kontrollierter Versuch':t<CAP_STOP?'HTTP 200 · Drop-Delta 0':'Capture gestoppt · gesichert';
