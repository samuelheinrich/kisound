// Editorial scenario (simulated values): two identical FortiGates (FortiOS 7.6.1) form FGCP active-passive,
// group-id 22, session-pickup enabled. A: priority 200 (Primary/Active), B: priority 100 (Secondary/Standby),
// override enabled on both. Shared LAN address 192.0.2.1 (virtual MAC). Only one HA link (ha1) carries both
// heartbeat and session sync – that is the weak spot. ha1 fails at HA_DOWN; A keeps forwarding, B waits for its
// peer timer (3.52 s, a scenario value) and becomes Primary in its local view: split brain on the shared L2.
// Fencing: only A's two production ports are shut on the IOS-XE switches. Preferences are set locally (A 100,
// B 200), ha1 is repaired, the election makes B Primary, B's state is authoritative for the resync, and A's
// links come back only after in-sync. Final: B Active, A Standby.
import {DURATION,BPM,BEAT0} from './config.js';
export const HA_DOWN=89.10,B_PRIMARY=92.62,FENCE_START=111.38,LAN_SHUT=112.1,WAN_SHUT=113.26,PREFS_DONE=117.2,HA_UP=117.90,ELECTED=123.48,IN_SYNC=125.58,RELEASE=132.04;
export const PEER_TIMER=B_PRIMARY-HA_DOWN;
export const ADDR={lanIp:'192.0.2.1',vmac:'00:09:0f:09:16:00',s17:'192.0.2.50:51544 → 198.51.100.80:443',server:'198.51.100.80',mgmtA:'10.99.0.21',mgmtB:'10.99.0.22'};
// ---- Roles and links ---------------------------------------------------------------------------------------------
export const haUp=t=>t<HA_DOWN||t>=HA_UP;
export const role=(dev,t)=>dev==='A'?(t<ELECTED?'primary':'secondary'):(t<B_PRIMARY?'secondary':'primary');
export const priority=(dev,t)=>dev==='A'?(t<114.0?200:100):(t<115.9?100:200);
export const links=(dev,t)=>dev==='B'?{lan:true,wan:true}:{lan:t<LAN_SHUT||t>=RELEASE,wan:t<WAN_SHUT||t>=RELEASE};
// A unit forwards production traffic when it is Primary in its own view and its links are up.
export const forwards=(dev,t)=>{const l=links(dev,t);return role(dev,t)==='primary'&&l.lan&&l.wan;};
export const splitBrain=t=>forwards('A',t)&&forwards('B',t);
// Who owns the shared address (virtual MAC) as seen by the switches.
export const ringOwner=t=>splitBrain(t)?'both':forwards('A',t)?'A':forwards('B',t)?'B':t<B_PRIMARY?'A':'B';
export const syncDir=t=>t<HA_DOWN?'A→B':t>=HA_UP?'B→A':null;
export const inSync=t=>t<HA_DOWN||t>=IN_SYNC;
// ---- Stations (hall coordinates; A left at -x, B right at +x, LAN at -z, WAN at +z) -----------------------------
export const ST={CL:[0,0,-40],SWL:[0,0,-26],RING:[0,6.2,-17],A1:[-8.6,1.4,-5],A2:[-8.6,1.4,5],B1:[8.6,1.4,-5],B2:[8.6,1.4,5],SWW:[0,0,26],WAN:[0,0,40],AH:[-8.6,8.2,0],BH:[8.6,8.2,0]};
const LANSIDE={A:['CL','SWL','A1','A2','SWW','WAN'],B:['CL','SWL','B1','B2','SWW','WAN']};
// ---- Flights: production flows, test flows, heartbeats, sync copies --------------------------------------------
export const FLIGHTS=[],BY_ID=new Map();
const d3=(a,b)=>Math.hypot(b[0]-a[0],b[1]-a[1],b[2]-a[2]);
function fly(f){f.pts=f.nodes.map(n=>ST[n]);const L=[0];for(let i=1;i<f.pts.length;i++)L.push(L[i-1]+d3(f.pts[i-1],f.pts[i]));f.L=L;f.len=L.at(-1);
 if(f.cut!=null){f.len=L[f.cut];}f.t1=f.t0+f.dur*(f.len/L.at(-1));f.tGone=f.t1+(f.fate==='drop'?1.1:.3);FLIGHTS.push(f);BY_ID.set(f.id,f);return f;}
export function random(i){const n=Math.sin((i+20202)*127.1)*43758.5453;return n-Math.floor(n);}
// Which unit the LAN switch / WAN switch sends a frame to: in split brain the virtual MAC flaps between both ports.
export function lanUnit(t,k){if(!links('A',t).lan||!forwards('A',t))return forwards('B',t)?'B':null;if(!forwards('B',t))return'A';return random(k*3+1)<.5?'A':'B';}
export function wanUnit(t,k){if(!links('A',t).wan||!forwards('A',t))return forwards('B',t)?'B':null;if(!forwards('B',t))return'A';return random(k*5+2)<.5?'A':'B';}
// A flow: request LAN→WAN through one unit, reply WAN→LAN. A reply that reaches the other unit finds no session and dies.
function flow(id,t0,k,o={}){
 const dur=o.dur??2.2;let u=o.unit??lanUnit(t0,k);if(!u)return;
 // a request that would still be inside A when its WAN port is shut goes to B instead
 if(u==='A'&&!o.unit&&!links('A',t0+dur*.8).wan)u=forwards('B',t0)?'B':null;if(!u)return;const req=fly({id,kind:o.kind??'flow',unit:u,nodes:LANSIDE[u],t0,dur,fate:'deliver',dir:'out',...o});
 const back=req.t1+.25,v=o.unit??wanUnit(back,k);if(!v)return;const nodes=[...LANSIDE[v]].reverse(),ok=v===u;
 fly({id:id+'R',kind:o.kind??'flow',unit:v,nodes,t0:back,dur,fate:ok?'deliver':'drop',cut:ok?null:2,dir:'in',reason:ok?null:`kein Session-Eintrag auf ${v}`,...o,name:o.nameR??null});
}
flow('F0',12.45,0,{unit:'A',name:'Flow · A',nameR:null,dur:1.2});
{let k=1;for(let t=1.0;t<DURATION-6;k++){if(!(t>12&&t<14.6)&&!(t>141.6&&t<147.5)&&!(t>171.2&&t<181))flow(`F${k}`,t,k);t+=.62+.5*random(k+77);}}
// Test flows after the recovery, always through B.
flow('T1',142.5,9001,{unit:'B',kind:'test',name:'Testflow · B',nameR:'Zielantwort',dur:1.6,flags:'GET /health'});
fly({id:'T2',kind:'test',unit:'B',nodes:LANSIDE.B,t0:172.4,dur:2.4,fate:'deliver',dir:'out',name:'SYN · neuer Test',flags:'SYN'});
fly({id:'T2R',kind:'test',unit:'B',nodes:[...LANSIDE.B].reverse(),t0:175.1,dur:2.4,fate:'deliver',dir:'in',name:'SYN/ACK',flags:'SYN/ACK'});
fly({id:'T2A',kind:'test',unit:'B',nodes:LANSIDE.B,t0:177.7,dur:2.4,fate:'deliver',dir:'out',name:'ACK',flags:'ACK'});
// Heartbeats on the beat grid (scenario hb-interval = one beat), both directions, only while ha1 is up.
export const BEAT=60/BPM,HB_TRAVEL=.42;
export const HEARTBEATS=[];
for(let k=0;BEAT0+k*BEAT<DURATION;k++){const t=BEAT0+k*BEAT;for(const[from,to,dt]of[['A','B',0],['B','A',BEAT/2]]){const s=t+dt;if((s+HB_TRAVEL<HA_DOWN||s>=HA_UP)&&s+HB_TRAVEL<DURATION)HEARTBEATS.push({from,to,t0:s,t1:s+HB_TRAVEL});}}
export const lastHeartbeat=(to,t)=>HEARTBEATS.filter(h=>h.to===to&&h.t1<=t).at(-1)??null;
// ---- Session S-17 and the archives ------------------------------------------------------------------------------
// Local updates of S-17 per unit; sync copies follow the healthy sync direction. During split brain both diverge.
export const S17_EVENTS=[
 {t:15.6,dev:'A',seq:1840023,state:'ESTABLISHED',note:'Session entsteht an A'},
 {t:40.1,dev:'A',seq:1840211,state:'ESTABLISHED'},{t:50.3,dev:'A',seq:1840512,state:'ESTABLISHED'},{t:77.9,dev:'A',seq:1840733,state:'ESTABLISHED'},
 {t:95.2,dev:'A',seq:1840790,state:'ESTABLISHED',note:'lokal an A (Split Brain)'},{t:97.6,dev:'B',seq:1840641,state:'ESTABLISHED',note:'lokal an B (Split Brain)'},
 {t:109.4,dev:'A',seq:1840866,state:'ESTABLISHED'},{t:109.9,dev:'B',seq:1840702,state:'ESTABLISHED'},
 {t:129.6,dev:'B',seq:1840815,state:'ESTABLISHED'},{t:151.4,dev:'B',seq:1841002,state:'ESTABLISHED'},{t:173.0,dev:'B',seq:1841120,state:'ESTABLISHED'},
];
export const SYNC_TRAVEL=2.2;
export const SYNCS=[];
for(const e of S17_EVENTS){const dir=syncDir(e.t);if(!dir||!haUp(e.t+SYNC_TRAVEL))continue;if((dir==='A→B'&&e.dev!=='A')||(dir==='B→A'&&e.dev!=='B'))continue;if(dir==='B→A'&&e.t<IN_SYNC)continue;SYNCS.push({from:e.dev,to:e.dev==='A'?'B':'A',t0:e.t+.3,t1:e.t+.3+SYNC_TRAVEL,seq:e.seq,id:`Y${SYNCS.length+1}`});}
// The resync after the election: B is authority and replaces A's stale S-17 (A's split-brain updates are dropped).
SYNCS.push({from:'B',to:'A',t0:IN_SYNC-2.4,t1:IN_SYNC,seq:1840702,id:'YR',resync:true});SYNCS.sort((a,b)=>a.t0-b.t0);
export function s17(dev,t){
 let v=null;for(const e of S17_EVENTS)if(e.t<=t&&e.dev===dev)v={seq:e.seq,t:e.t,src:'lokal'};
 for(const y of SYNCS)if(y.to===dev&&y.t1<=t&&(!v||y.t1>=v.t))v={seq:y.seq,t:y.t1,src:y.resync?'Resync von B':'Kopie von '+y.from};
 return v;
}
export const diverged=t=>{if(t<HA_DOWN||t>=IN_SYNC)return false;const a=s17('A',t),b=s17('B',t);return!!(a&&b&&a.seq!==b.seq);};
// Other sessions in the archive (numbered glass plates); they appear when created, both archives while in sync.
export const SESSIONS=Array.from({length:24},(_,i)=>{const n=i+1,port=50000+Math.floor(random(n)*9000);return{id:`S-${String(n).padStart(2,'0')}`,tuple:`192.0.2.${40+Math.floor(random(n+40)*40)}:${port} → 198.51.100.${60+Math.floor(random(n+80)*40)}:${[443,443,22,53,443][n%5]}`,proto:n%5===3?'UDP':'TCP',born:n===17?15.6:Math.max(0,(n-1)*1.4-3)};});
// ---- Screen texts (B-IDs of the script). Lines: [reveal, text, kind, pane] with panes A, B, SWL, SWW, ov ---------
const typed=k=>k==='cmd';
export const BLOCKS={
 B01:{title:'HA-Status · gesund',win:[39.14,67.42],pages:[39.14,53.48],lines:[
  [39.3,'A # get system ha status','cmd','A',0],[40.0,'Mode: HA A-P','','A',0],[40.0,'Group: 22','','A',0],[40.0,'Primary   : A','a','A',0],[40.0,'Secondary : B','b','A',0],
  [53.6,'Configuration Status:','','A',1],[53.6,' A: in-sync','ok','A',1],[53.6,' B: in-sync','ok','A',1],[54.2,'Szenario-Overlay: session-pickup ENABLED | S-17 repliziert','ov','ov',1]]},
 B02:{title:'lokale Einzelansichten',win:[HA_DOWN,FENCE_START],lines:[
  [89.3,'A # get system ha status','cmd','A'],[90.0,'Mode: HA A-P','','A'],[90.0,'Primary: A','a','A'],
  [89.6,'B # get system ha status','cmd','B'],[90.3,'Mode: HA A-P','','B'],[90.3,'PEER_TIMER','warn','B'],[B_PRIMARY,'Primary: B','b','B'],
  [89.5,'LOKALE EINZELANSICHTEN — HA-Verbindung unterbrochen','bad','ov'],[B_PRIMARY,'A: Datenpfad offen    B: Datenpfad offen','warn','ov'],[B_PRIMARY,'Gemeinsame LAN-IP: 192.0.2.1','','ov']]},
 B03:{title:'Fencing an den Switches',win:[FENCE_START,HA_UP],lines:[
  [111.45,'SW-LAN# configure terminal','cmd','SWL'],[111.7,'SW-LAN(config)# interface GigabitEthernet1/0/11','cmd','SWL'],[111.95,'SW-LAN(config-if)# shutdown','cmd','SWL'],
  [112.35,'SW-WAN# configure terminal','cmd','SWW'],[112.6,'SW-WAN(config)# interface GigabitEthernet1/0/11','cmd','SWW'],[112.95,'SW-WAN(config-if)# shutdown','cmd','SWW'],
  [WAN_SHUT,'Overlay: Nur die zwei Anschlüsse zu A isoliert','amber','ov']]},
 B04:{title:'lokale Consoles · Präferenz',win:[WAN_SHUT,IN_SYNC],lines:[
  [113.5,'A # config system ha','cmd','A'],[113.8,'A (ha) # set priority 100','cmd','A'],[114.4,'A (ha) # set override enable','cmd','A'],[115.0,'A (ha) # end','cmd','A'],
  [115.4,'B # config system ha','cmd','B'],[115.7,'B (ha) # set priority 200','cmd','B'],[116.3,'B (ha) # set override enable','cmd','B'],[116.9,'B (ha) # end','cmd','B'],
  [113.5,'Overlay: lokale Consoles','ov','ov'],[HA_UP,'HA-Leitung repariert','ok','ov'],[ELECTED,'Wahl: B Primary · A Secondary','b','ov']]},
 B05:{title:'HA-Status · neu',win:[IN_SYNC,139.86],pages:[IN_SYNC,130.0],lines:[
  [125.7,'B # get system ha status','cmd','B',0],[126.4,'Mode: HA A-P','','B',0],[126.4,'Primary   : B','b','B',0],[126.4,'Secondary : A','a','B',0],
  [130.1,'Configuration Status:','','B',1],[130.1,' A: in-sync','ok','B',1],[130.1,' B: in-sync','ok','B',1],[130.6,'Overlay: Session-Sync S-17 bestätigt; A-Links erst ab 132.04 s freigegeben','ov','ov',1]]},
 B06:{title:'Links von A freigeben',win:[128.82,139.86],lines:[
  [129.0,'SW-LAN(config)# interface GigabitEthernet1/0/11','cmd','SWL'],[129.5,'SW-LAN(config-if)# no shutdown','amber','SWL'],
  [130.2,'SW-WAN(config)# interface GigabitEthernet1/0/11','cmd','SWW'],[130.7,'SW-WAN(config-if)# no shutdown','amber','SWW'],
  [RELEASE,'Overlay ab 132.04 s: Links A up | A Secondary | B Primary','b','ov']]},
 B05R:{title:'HA-Status · stabil (B05 erneut)',win:[171.92,193.68],lines:[
  [172.1,'A # get system ha status','cmd','A'],[172.8,'Primary   : B','b','A'],[172.8,'Secondary : A','a','A'],[172.8,'Configuration Status: in-sync','ok','A'],
  [172.4,'B # get system ha status','cmd','B'],[173.1,'Primary   : B','b','B'],[173.1,'Secondary : A','a','B'],[173.1,'Configuration Status: in-sync','ok','B']]},
};
const CPS=70;
// Visible lines of a block at t: [{text, kind, pane, typing}]. B02's peer timer counts down until B_PRIMARY.
export function blockLines(id,t){
 const b=BLOCKS[id];if(!b)return[];const page=b.pages?b.pages.filter(p=>t>=p).length-1:-1;
 return b.lines.filter(l=>t>=l[0]&&(page<0||l[4]===page)).filter(l=>!(l[1]==='PEER_TIMER'&&t>=B_PRIMARY)).map(([t0,text,kind='',pane])=>{
  if(text==='PEER_TIMER')text=`Peer-Timeout in ${Math.max(0,B_PRIMARY-t).toFixed(2)} s (Szenario 3,52 s)`;
  if(typed(kind)||kind==='amber'&&/^\S+[#$] /.test(text)){const m=/^\S+(?: \(\w+\))? # |^\S+[#$] /.exec(text),pre=m?m[0].length:0,n=Math.min(text.length,pre+Math.floor((t-t0)*CPS));return{text:text.slice(0,n),kind,pane,typing:n<text.length};}
  return{text,kind,pane,typing:false};});
}
export const previewB06=t=>t<RELEASE;
export function dockBlocks(t){return Object.entries(BLOCKS).filter(([,b])=>t>=b.win[0]&&t<b.win[1]).map(([id])=>id).sort((a,b)=>BLOCKS[b].win[0]-BLOCKS[a].win[0]).slice(0,2);}
// ---- Voices (from the prompt; editorial, not measured) and kinetic words --------------------------------------
export const VOICE={L001:'A',L002:'B',L003:'A',L004:'A',L005:'A',L006:'A',L007:'B',L008:'B',L009:'B',L010:'B',L017:'B',L018:'B',L019:'B',L020:'B',L021:'A',L022:'A',
 L027:'A',L028:'A',L029:'A',L030:'A',L031:'B',L032:'B',L033:'B',L034:'B',L035:'B',L036:'B',L037:'A',L038:'A'};
export const voiceOf=id=>VOICE[id]??'AB';
export const KINETIC={L011:'A',L012:'B',L023:'AB',L035:'B',L037:'A',L039:'B',L040:'A',L043:'B',L044:'A'};
export const word=text=>text.replace(/[.,?!]/g,'').trim().toUpperCase();
export const WORD_NOTE={L011:'A · Primary · trägt den Datenpfad',L012:'B · Secondary · hält den Session-Stand',L023:'ha1 weg: beide lokal Primary, eine Adresse',
 L035:'B · Primary nach der Wahl (priority 200)',L037:'A · Secondary · Ports wieder up, kein Datenpfad',L039:'B bleibt Primary – keine neue Wahl',L040:'A bleibt Secondary',L043:'B · Active',L044:'A · Standby'};
// ---- Logs --------------------------------------------------------------------------------------------------------
export const LOGS=[
 [HA_DOWN,'ha','ha1: link down (A und B)'],[89.7,'ha','B: kein Heartbeat von A – Peer-Timer 3,52 s (Szenario)'],[B_PRIMARY,'ha','B: kein Peer – B wird Primary (lokale Sicht)'],
 [93.6,'sw','%SW_MATM-4-MACFLAP_NOTIF: Host 0009.0f09.1600 in vlan 10 is flapping between port Gi1/0/11 and port Gi1/0/12'],
 [96.9,'warn','Antworten ohne Session-Eintrag verworfen – Tabellen von A und B laufen auseinander'],
 [LAN_SHUT,'cfg','SW-LAN: Gi1/0/11 (A port1) administratively down'],[WAN_SHUT,'cfg','SW-WAN: Gi1/0/11 (A port2) administratively down – A isoliert'],
 [115.1,'cfg','A: priority 100, override enable (lokale Console)'],[117.0,'cfg','B: priority 200, override enable (lokale Console)'],
 [HA_UP,'ha','ha1: link up – Heartbeat beidseitig'],[ELECTED,'ha','Wahl: B Primary (priority 200), A Secondary'],[IN_SYNC,'ok','Configuration in-sync · Session-Sync S-17 bestätigt (B → A)'],
 [RELEASE,'cfg','SW-LAN/SW-WAN: Gi1/0/11 up – A Secondary, kein Datenpfad'],[146.0,'ok','Testflow über B: Zielantwort erhalten'],[180.1,'ok','TCP-Test über B: SYN, SYN/ACK, ACK – verbunden'],
].map(([time_s,tag,message])=>({time_s,tag,message}));
export const STATUS=t=>t<HA_DOWN?'A Primary · B Secondary · in-sync':t<B_PRIMARY?'ha1 down · B Peer-Timer läuft':t<WAN_SHUT?'SPLIT BRAIN · beide Primary':t<HA_UP?'A isoliert · Präferenz neu':t<ELECTED?'ha1 up · Wahl läuft':t<IN_SYNC?'B Primary · Sync läuft':t<RELEASE?'B Primary · in-sync · A-Links aus':'B Primary · A Secondary · in-sync';
// ---- Queries -----------------------------------------------------------------------------------------------------
export function pointAt(f,t){const s=Math.max(0,Math.min(f.len,(t-f.t0)/(f.t1-f.t0||1)*f.len)),L=f.L;let i=1;while(i<L.length-1&&L[i]<s)i++;const a=f.pts[i-1],b=f.pts[i],u=L[i]===L[i-1]?0:(s-L[i-1])/(L[i]-L[i-1]);return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];}
export function activeFlights(t){return FLIGHTS.filter(f=>f.t0<=t&&t<=f.tGone);}
FLIGHTS.sort((a,b)=>a.t0-b.t0);
