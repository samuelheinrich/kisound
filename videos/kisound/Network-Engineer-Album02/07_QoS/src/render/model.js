// Editorial scenario (simulated values): IOS XE MQC, LAN Gi0/0/0, uplink Gi0/0/1 (1 Gbit/s physical, 100 Mbit/s
// contract). INGRESS classifies trusted lab RTP 192.0.2.10 → 198.51.100.10 UDP/5004, marks EF/46, polices it to 1 Mbit/s
// (exceed: drop). TCP backup 192.0.2.11 → 198.51.100.50:443 lands in class-default, DSCP 0. Egress: PARENT shapes the
// aggregate to 100 Mbit/s and calls CHILD (EF: priority 1000 kbit/s; class-default: bandwidth remaining 100 % fair-queue).
// The picture is a deterministic queue simulation in slow motion: one carrier stands for a group of packets.
import {DURATION} from './config.js';
export const T={burst:88.88,burstEnd:96.08,polResult:90.62,shapeDemo:104.14,rxResult:173.02};
export const ADDR={rtpSrc:'192.0.2.10',rtpDst:'198.51.100.10',tcpSrc:'192.0.2.11',tcpDst:'198.51.100.50'};
// ---- Machine geometry (camera looks downstream +x: RTP left at -z, TCP right at +z) ------------------------------
export const ST={IN_R:[-40,1,-5],IN_T:[-40,1,5],CLS_R:[-32,1,-5],CLS_T:[-32,1,5],MARK_R:[-26,1,-5],MARK_T:[-26,1,5],POL:[-17,1,-5],QR_TAIL:[-9,1,-5],QR_HEAD:[-3,1,-5],
 QT_TAIL:[-19,1,5],QT_HEAD:[-3,1,5],SCHED:[5,1,0],SHAPER:[12,1,0],PORT:[19,1,0],RX_R:[34,1,-7],RX_T:[34,1,7]};
export const QT_CAP=64,QT_ROWS=4,SLOT=.95;
export function random(i){const n=Math.sin((i+20707)*127.1)*43758.5453;return n-Math.floor(n);}
const lerp3=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];
const plen=pts=>pts.slice(1).reduce((s,p,i)=>s+Math.hypot(p[0]-pts[i][0],p[2]-pts[i][2]),0);
function along(pts,u){const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][2]-pts[i-1][2]));const s=Math.max(0,Math.min(1,u))*L.at(-1);let i=1;while(i<L.length-1&&L[i]<s)i++;return lerp3(pts[i-1],pts[i],(s-L[i-1])/(L[i]-L[i-1]||1));}
const RAMP_R=[ST.IN_R,ST.CLS_R,ST.MARK_R,ST.POL,ST.QR_TAIL],RAMP_T=[ST.IN_T,ST.CLS_T,ST.MARK_T,ST.QT_TAIL];
// ---- Simulation (one carrier = one packet group; slow motion) ------------------------------------------------------
// RTP enters every 0.6 s (0.2 Mbit/s); the controlled burst offers 1.2 Mbit/s (every 0.1 s). The ingress token bucket refills
// one carrier per 0.12 s (1.0 Mbit/s conform) and holds 3.75: the first excess carrier, Q-RX, meets the hard edge at 90.62 s.
// TCP is ACK-clocked (closed loop, window W): bulk offers more than the free capacity, so its finite queue stays well filled.
// The parent shaper is the single server with the 100-Mbit/s budget; CHILD serves EF first (non-preemptive), then bulk FIFO.
const RAMP_RT=2.4,RAMP_TT=1.6,S_RTP=.05,S_TCP=.2,SERVE=.9,POST=1.4,ACKD=.5,WINDOW=69,POL_CAP=3.75,POL_REFILL=1/.12;
const POL_T=RAMP_RT*plen(RAMP_R.slice(0,4))/plen(RAMP_R);
export const PACKETS=[];
// Q-RN: the new RTP frame of the break, followed through Classify (126.1) → Mark (127.84) → Queue (129.78); the regular RTP
// stream pauses around it so that nothing overtakes it on the ramp.
const RN_KEYS=[[125.2,ST.IN_R],[126.1,ST.CLS_R],[127.5,ST.CLS_R],[127.84,ST.MARK_R],[128.9,ST.MARK_R],[129.35,ST.POL],[129.78,ST.QR_TAIL]];
{const tps=[];for(let tp=.4+POL_T;tp<T.burst-.2;tp+=.6)tps.push([tp,false]);for(let tp=T.burst+.04;tp<T.burstEnd-1e-9;tp+=.1)tps.push([tp,true]);for(let tp=T.burstEnd+.5;tp<DURATION+POL_T;tp+=.6)if(!(tp>124.4+POL_T&&tp<131.4+POL_T))tps.push([tp,false]);
 tps.forEach(([tp,burst],k)=>PACKETS.push({id:`R${k}`,cls:'rtp',tIn:tp-POL_T,tPol:tp,burst,rampT:RAMP_RT}));
 PACKETS.push({id:'RN',cls:'rtp',tIn:RN_KEYS[0][0],tPol:129.35,keys:RN_KEYS,rampT:RN_KEYS.at(-1)[0]-RN_KEYS[0][0]});}
// Ingress policer (token bucket in carrier units): conform → priority queue, exceed → drop at the hard edge, never buffered.
{let tok=POL_CAP,last=-1e9;for(const p of PACKETS.filter(p=>p.cls==='rtp').sort((a,b)=>a.tPol-b.tPol)){tok=Math.min(POL_CAP,tok+(p.tPol-last)*POL_REFILL);last=p.tPol;p.tokens=tok;if(tok>=1){tok-=1;p.conform=true;}else{p.conform=false;p.fate='police';}}}
// Egress: discrete-event simulation of the shaped single server.
{const ev=[],qr=[],qt=[];let seq=0,tk=0;const add=(t,p)=>{const e={t,p,s:seq++};let i=ev.length;while(i>0&&(ev[i-1].t>t||(ev[i-1].t===t&&ev[i-1].s>e.s)))i--;ev.splice(i,0,e);};
 const tcp=tIn=>{const p={id:`T${tk++}`,cls:'tcp',tIn,rampT:RAMP_TT};PACKETS.push(p);add(tIn+RAMP_TT,p);};
 for(const p of PACKETS)if(p.cls==='rtp'&&p.conform)add(p.tIn+p.rampT,p);for(let k=0;k<WINDOW;k++)tcp(-60+k*.21);
 let now=-1e9,free=-1e9;
 while(ev.length||qr.length||qt.length){const na=ev.length?ev[0].t:Infinity,ts=qr.length||qt.length?Math.max(free,now):Infinity;
  if(ts<=na){now=ts;const p=qr.length?qr.shift():qt.shift();p.tDep=now;p.tEnd=now+(p.cls==='rtp'?S_RTP:S_TCP);free=p.tEnd;p.tRx=p.tEnd+SERVE+POST;p.fate='deliver';if(p.cls==='tcp'&&p.tRx+ACKD<DURATION+2)tcp(p.tRx+ACKD);continue;}
  now=na;const{p}=ev.shift();p.tQ=now;if(p.cls==='rtp')qr.push(p);else if(qt.length>=QT_CAP){p.fate='taildrop';tcp(now+1);}else qt.push(p);}}
PACKETS.sort((a,b)=>a.tIn-b.tIn);
export const BY_ID=new Map(PACKETS.map(p=>[p.id,p]));
const LANE={rtp:PACKETS.filter(p=>p.cls==='rtp'&&p.fate==='deliver').sort((a,b)=>a.tQ-b.tQ),tcp:PACKETS.filter(p=>p.cls==='tcp'&&p.fate==='deliver').sort((a,b)=>a.tQ-b.tQ)};
LANE.rtp.forEach((p,i)=>p.qi=i);LANE.tcp.forEach((p,i)=>p.qi=i);
const nearest=(list,key,t)=>list.reduce((b,p)=>Math.abs(p[key]-t)<Math.abs(b[key]-t)?p:b);
// Named carriers of the script
export const NAMED={'Q-R1':nearest(LANE.rtp.filter(p=>!p.burst),'tIn',41.0),'Q-B18':nearest(LANE.tcp,'tIn',68.6),'Q-RX':PACKETS.filter(p=>p.fate==='police').sort((a,b)=>a.tPol-b.tPol)[0],
 'Q-BS':nearest(LANE.tcp.filter(p=>p.tQ<=T.shapeDemo&&p.tQ>T.shapeDemo-1.5),'tQ',T.shapeDemo),'Q-RN':BY_ID.get('RN')};
for(const[k,p]of Object.entries(NAMED))p.name=k;
const B18=NAMED['Q-B18'];B18.seq=24001;B18.len=1200;B18.retrans=true;
// Q-B17: replay of a stored, dated loss window – the original of the same byte range, tail-dropped at a full queue. It never
// joins the live counters.
export const REPLAY={id:'Q-B17',name:'Q-B17',cls:'tcp',seq:24001,len:1200,replay:true,keys:[[58.1,ST.IN_T],[61.5,ST.CLS_T],[63.4,ST.MARK_T],[65.6,ST.QT_TAIL]],tDrop:65.6,win:[52.37,68.6]};
// ---- Queries ----------------------------------------------------------------------------------------------------------
export const tcpSlot=k=>{const col=Math.floor(k/QT_ROWS),row=k%QT_ROWS;return[ST.QT_HEAD[0]-col*SLOT,1,ST.QT_HEAD[2]+(row-(QT_ROWS-1)/2)*SLOT];};
const rtpSlot=k=>[ST.QR_HEAD[0]-k*1.1,1,ST.QR_HEAD[2]];
const slot=(p,k)=>p.cls==='rtp'?rtpSlot(k):tcpSlot(k);
const keyed=(keys,t)=>{let i=1;while(i<keys.length-1&&keys[i][0]<t)i++;const[a,pa]=keys[i-1],[b,pb]=keys[i];return lerp3(pa,pb,Math.max(0,Math.min(1,(t-a)/(b-a||1))));};
// fractional number of carriers ahead in the same (FIFO) queue; departures slide the queue forward over 0.2 s
function ahead(p,t){const L=LANE[p.cls];let n=0;for(let j=p.qi-1;j>=0;j--){const q=L[j];if(q.tDep<=t-.2)break;n+=q.tDep>t?1:1-(t-q.tDep)/.2;}return n;}
export const queued=(cls,t)=>{const L=LANE[cls];let n=0;for(const p of L){if(p.tQ>t)break;if(p.tDep>t)n++;}return n;};
export function position(p,t){
 if(t<p.tIn)return null;const rtp=p.cls==='rtp',ramp=rtp?RAMP_R:RAMP_T;
 if(p.fate==='police'){if(t<p.tPol)return{pos:along(ramp.slice(0,4),(t-p.tIn)/(p.tPol-p.tIn)),phase:'ramp'};const d=t-p.tPol;if(d>1.2)return null;return{pos:[ST.POL[0]+1.1+.8*d,1-3.5*d*d,ST.POL[2]-1.6*d],phase:'drop',d};}
 const tQ=p.tQ;if(t<tQ)return{pos:p.keys?keyed(p.keys,t):along(ramp,(t-p.tIn)/(tQ-p.tIn)),phase:'ramp',marked:t>=p.tIn+(p.keys?p.keys[3][0]-p.tIn:(p.tQ-p.tIn)*plen(ramp.slice(0,3))/plen(ramp))};
 if(p.fate==='taildrop'){const d=t-tQ;if(d>1.2)return null;return{pos:[ST.QT_TAIL[0]-.6,1-3*d*d,ST.QT_TAIL[2]+2.6+.6*d],phase:'drop',d,marked:true};}
 if(t<p.tDep){const k=ahead(p,t),tail=rtp?ST.QR_TAIL:ST.QT_TAIL,s=slot(p,k),u=Math.min(1,(t-tQ)/.5);return{pos:lerp3(tail,s,1-(1-u)*(1-u)),phase:'queue',idx:k,marked:true};}
 const tOut=p.tEnd+SERVE;if(t<tOut)return{pos:along([slot(p,0),ST.SCHED,ST.SHAPER,ST.PORT],(t-p.tDep)/(tOut-p.tDep)),phase:'serve',marked:true};
 if(t<p.tRx)return{pos:along([ST.PORT,[ST.PORT[0]+3,1,0],rtp?ST.RX_R:ST.RX_T],(t-tOut)/(p.tRx-tOut)),phase:'out',marked:true};
 return null;}
export function replayPosition(t){const r=REPLAY;if(t<r.keys[0][0]||t>r.tDrop+1.4)return null;if(t<r.tDrop)return{pos:keyed(r.keys,t),phase:'ramp',marked:t>=r.keys[2][0]};const d=t-r.tDrop;return{pos:[ST.QT_TAIL[0]-.6,1-3*d*d,ST.QT_TAIL[2]+2.6+.6*d],phase:'drop',d,marked:true};}
export const delivered=(cls,t)=>{let n=0;for(const p of LANE[cls])if(p.tRx<=t)n++;return n;};
// cumulative ACK at the TCP receiver (shown from Verse 2): it waits at 24001 for the byte range lost in the stored window
// (later segments are SACKed), jumps to 25201 when Q-B18 (Seq 24001, Len 1200) arrives, then +1200 per further carrier.
const N18=delivered('tcp',B18.tRx);
export const tcpAck=t=>t<58.1?null:t<B18.tRx?24001:25201+1200*(delivered('tcp',t)-N18);
export const rtpReceived=t=>delivered('rtp',t);
export const policerDrops=t=>PACKETS.filter(p=>p.fate==='police'&&p.tPol<=t).length;
export const policerTokens=t=>{let last=null;for(const p of PACKETS)if(p.cls==='rtp'&&p.tPol<=t&&(!last||p.tPol>last.tPol))last=p;if(!last)return POL_CAP;return Math.min(POL_CAP,last.tokens-(last.conform?1:0)+(t-last.tPol)*POL_REFILL);};
export const POL_CAPACITY=POL_CAP;
export const rtpOffered=t=>t>=T.burst&&t<T.burstEnd?1.2:.2;
export const tailDrops=t=>PACKETS.filter(p=>p.fate==='taildrop'&&p.tQ<=t).length;
// carriers currently serialised at the port / the one the scheduler picked last
export const inService=t=>{for(const L of[LANE.rtp,LANE.tcp])for(const p of L)if(p.tDep<=t&&t<p.tEnd)return p;return null;};
export const lastPick=t=>{let b=null;for(const L of[LANE.rtp,LANE.tcp])for(const p of L)if(p.tDep<=t&&(!b||p.tDep>b.tDep))b=p;return b;};
export function visible(t){return PACKETS.filter(p=>p.tIn<=t&&(p.tRx??(p.tPol??p.tQ)+1.3)>=t);}
// ---- Screen texts (B-IDs; B02 is a config excerpt that already exists, split into tabs) ---------------------------------
const ACL=['ip access-list extended RTP-TRUSTED',' permit udp host 192.0.2.10 host 198.51.100.10 eq 5004','class-map match-all REALTIME-IN',' match access-group name RTP-TRUSTED','class-map match-all EF-OUT',' match dscp ef'];
const ING=['policy-map INGRESS',' class REALTIME-IN','  set dscp ef','  police cir 1000000 bc 31250','   conform-action transmit','   exceed-action drop'];
const ING2=[' class class-default','  set dscp default','interface GigabitEthernet0/0/0',' service-policy input INGRESS'];
const CHILD=['policy-map CHILD',' class EF-OUT','  priority 1000',' class class-default','  bandwidth remaining percent 100','  fair-queue'];
const PARENT=['policy-map PARENT',' class class-default','  shape average 100000000','  service-policy CHILD','interface GigabitEthernet0/0/1',' service-policy output PARENT'];
export const BLOCKS={
 B01:{title:'Markierung und Kapazität',win:[13.3,40.9],lines:[[13.4,'RTP: 192.0.2.10 -> 198.51.100.10 UDP dst 5004',''],[13.4,'DSCP EF = 46 | ECN 0 | DS-Feld 0xb8','rtp'],[13.4,'Backup: 192.0.2.11 -> 198.51.100.50 TCP dst 443',''],[13.4,'DSCP Best Effort = 0','tcp'],[13.4,'Physischer Port 1 Gbit/s | Vertrags-/Shaperrate 100 Mbit/s','amber']]},
 B02:{title:'aktive Policy (vorhanden, nicht neu eingegeben)',win:[31.2,88.88],pages:[31.2,40.9,52.37,64.0,76.04],lines:[...ACL.map(l=>[31.2,l,'',0]),...ING.map(l=>[40.9,l,'',1]),...ING2.map(l=>[52.37,l,'',2]),...CHILD.map(l=>[64.0,l,'',3]),...PARENT.map(l=>[76.04,l,'',4])]},
 B03:{title:'Policer und Shaper',win:[T.burst,126.1],pages:[T.burst,97.94,T.shapeDemo],lines:[[89.0,'R-QOS# show policy-map interface GigabitEthernet0/0/0 input','cmd',0],[89.6,' Service-policy input: INGRESS','',0],[89.6,'  Class-map: REALTIME-IN','',0],[89.6,'   police: cir 1000000 bps, bc 31250 bytes','',0],[T.polResult,'    conformed 1000 packets; actions: transmit','ok',0],[T.polResult,'    exceeded 200 packets; actions: drop','bad',0],
  [97.94,'Overlay Burst: angeboten 1.2 Mbit/s, konform 1.0, drop 0.2','amber',1],[97.94,'Danach RTP-Angebot wieder 0.2 Mbit/s','',1],
  [104.2,'R-QOS# show policy-map interface GigabitEthernet0/0/1 output','cmd',2],[104.8,' Service-policy output: PARENT','',2],[104.8,'  shape (average) cir 100000000','amber',2],[104.8,'   Service-policy : CHILD','',2],[104.8,'    Class-map: EF-OUT | Priority: 1000 kbps','rtp',2],[104.8,'    Class-map: class-default | bandwidth remaining 100%','tcp',2]]},
 B04:{title:'Messfenster (Szenario)',win:[151.15,223.74],pages:[151.15,T.rxResult],lines:[[151.3,'Szenario-Messfenster (keine garantierten Produktwerte)','ov',0],[151.3,'erwartet: RTP angeboten/empfangen 0.2 Mbit/s','',0],[151.3,'erwartet: Bulk nutzt verbleibende Freigaben; ACK steigt','',0],[151.3,'erwartet: Gemeinsame langfristige Ausgabe <= 100 Mbit/s','',0],[151.3,'Policy INGRESS / CHILD / PARENT unverändert','amber',0],
  [T.rxResult,'RTP angeboten/empfangen: 0.2 Mbit/s','ok',1],[T.rxResult,'Bulk nutzt verbleibende Freigaben; ACK-Bytes steigen','ok',1],[T.rxResult,'Gemeinsame langfristige Ausgabe: <= 100 Mbit/s','amber',1],[T.rxResult+.4,'RTP-Queue-Beispiel: 2 Pakete | Bulk-Queue-Beispiel: 48 Pakete','',1],[T.rxResult+.8,'Policer-Drop Q-RX: endgültig','bad',1],[T.rxResult+.8,'Shaper-Paket Q-BS: später ausgegeben','',1]]},
};
const CPS=70;
export function blockLines(id,t){const b=BLOCKS[id];if(!b)return[];const page=b.pages?b.pages.filter(p=>t>=p).length-1:-1;
 return b.lines.filter(l=>t>=l[0]&&(page<0||l[3]===page)).map(([t0,text,kind=''])=>{if(kind==='cmd'){const m=/^\S+[#$] /.exec(text),pre=m?m[0].length:0,n=Math.min(text.length,pre+Math.floor((t-t0)*CPS));return{text:text.slice(0,n),kind,typing:n<text.length};}return{text,kind,typing:false};});}
export function dockBlocks(t){return Object.entries(BLOCKS).filter(([,b])=>t>=b.win[0]&&t<b.win[1]).map(([id])=>id).sort((a,b)=>BLOCKS[b].win[0]-BLOCKS[a].win[0]).slice(0,2);}
// ---- Voices (prompt; editorial), kinetic words, logs, status ------------------------------------------------------------
export const VOICE={L009:'B',L010:'B',L011:'B',L012:'B',L013:'B',L014:'B',L015:'B',L016:'B',L017:'A',L018:'A',L019:'A',L020:'A',L021:'B',L022:'B',L023:'B',L024:'B',L025:'A',L026:'A',L027:'A',L028:'A',L029:'B',L030:'B',L031:'B',L032:'B',L041:'A',L042:'B',L043:'B',L044:'B'};
export const voiceOf=id=>VOICE[id]??'AB';
export const KINETIC={L001:'QUALITY OF SERVICE',L005:'QUALITY OF SERVICE',L025:'CLASSIFY',L026:'MARK',L027:'QUEUE',L029:'SCHEDULE',L030:'SHAPE',L031:'SEND',L033:'QUALITY OF SERVICE',L037:'QUALITY OF SERVICE',L044:'PASST'};
export const WORD_NOTE={L001:'EF/46 für Echtzeit, Best Effort/0 für den Transfer',L005:'ein Draht: 100 Mbit/s Vertrag',L025:'UDP/5004 von vertrauenswürdigem Sender',L026:'DSCP 46 (DS-Feld 0xb8)',L027:'Priority-Queue links',L029:'Kind-Scheduler wählt',L030:'Parent-Shaper: 100-Mbit/s-Budget',L031:'Serialisierung am gemeinsamen Port',L033:'dieselbe Policy, beide Klassen aktiv',L037:'Gesamtrate unverändert ≤ 100 Mbit/s',L044:'RTP klar, Transfer läuft'};
export const LOGS=[
 [13.3,'cls','INGRESS: RTP → EF/46 · Backup → BE/0'],[52.37,'rec','Gespeichertes Verlustfenster (datiert) geöffnet'],[REPLAY.tDrop,'rec','Q-B17 Seq 24001 Len 1200: Tail-Drop bei voller Queue'],[68.6,'tcp','Q-B18: Retransmission Seq 24001 Len 1200 (neuer Frame)'],
 [B18.tRx,'ok','Q-B18 angekommen · ACK 25201'],[T.burst,'pol','RTP-Burst 1,2 Mbit/s an INGRESS-Policer'],[T.polResult,'pol','exceed-action drop: Q-RX endgültig verworfen'],[T.burstEnd,'pol','RTP-Angebot wieder 0,2 Mbit/s'],
 [T.shapeDemo,'shp','PARENT shape average 100 Mbit/s: Q-BS wartet auf Budget'],[NAMED['Q-BS'].tDep,'shp','Q-BS verlässt die Queue (einmal)'],[T.rxResult,'ok','RTP-Empfang vollständig · TCP-ACKs steigen'],
].map(([time_s,tag,message])=>({time_s,tag,message}));
export const STATUS=t=>t<13.3?'zwei Flows · ein Engpass':t<T.burst?'EF/46 · BE/0 · Policy aktiv':t<T.shapeDemo?'Policer: Burst-Überschuss drop':t<126.1?'Shaper: Puffer glättet':t<T.rxResult?'Classify · Mark · Queue · Schedule · Shape · Send':'RTP klar · Transfer läuft';
