// Editorial scenario (simulated values): three IOS-XE switches in VLAN 120 form an open chain SW1–SW2–SW3. A stray
// patch cable SW3 Gi1/0/24 ↔ SW1 Gi1/0/24 closes a ring at RING_CLOSED; spanning tree is disabled for VLAN 120 on all
// three switches, so nothing blocks. H1 sends the ARP broadcast B-001; each switch floods it out of every forwarding
// port in the VLAN except the ingress port. With exactly two ring ports per switch, one broadcast becomes two copies
// that circle forever (one per direction) and is delivered to every access port on every pass. Every further
// broadcast (ARP retries, other hosts) circles too, so the load grows until links and queues saturate. Ethernet has
// no hop limit. Fix: serial console to SW3, shutdown of Gi1/0/24 – the ring opens, remaining copies drain.
import {DURATION} from './config.js';
export const RING_CLOSED=15.58,B001_T=22.8,MGMT_LOST=62.3,SEARCH=130.06,SHUT_CMD=161.38,PORT_DOWN=163.0,MGMT_BACK=189.5,TEST_OK=197.33;
export const ADDR={h1Mac:'02:00:00:00:01:20',h1Ip:'192.0.2.10',gw:'192.0.2.1',mgmtSW3:'10.20.0.3',noc:'10.20.0.50'};
// ---- Geometry: triangle of switches, facades towards the centre ---------------------------------------------------
const C=[0,0,1],CORNER={SW1:[-16,0,10],SW2:[0,0,-17],SW3:[16,0,10]};
const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]],add=(a,b)=>[a[0]+b[0],a[1]+b[1],a[2]+b[2]],mul=(a,k)=>[a[0]*k,a[1]*k,a[2]*k],len=a=>Math.hypot(a[0],a[1],a[2]),norm=a=>mul(a,1/len(a));
export const SWITCHES={};
for(const[id,c]of Object.entries(CORNER)){const n=norm([C[0]-c[0],0,C[2]-c[2]]),t=[-n[2],0,n[0]],face=add(c,mul(n,3.2));SWITCHES[id]={id,corner:c,normal:n,tangent:t,face};}
// Ring ports: which neighbour each faces. SW1: p1→SW2, p24→SW3 · SW2: p1→SW1, p2→SW3 · SW3: p1→SW2, p24→SW1.
const PORTS={'SW1-1':['SW1','SW2'],'SW1-24':['SW1','SW3'],'SW2-1':['SW2','SW1'],'SW2-2':['SW2','SW3'],'SW3-1':['SW3','SW2'],'SW3-24':['SW3','SW1']};
export const PORT_POS={};
for(const[k,[sw,nb]]of Object.entries(PORTS)){const s=SWITCHES[sw],d=norm(sub(SWITCHES[nb].corner,s.corner)),side=Math.sign(d[0]*s.tangent[0]+d[2]*s.tangent[2])||1;PORT_POS[k]=add(add(s.face,mul(s.tangent,side*3.4)),[0,1.9,0]);}
export const PORT_LABEL={'SW1-1':'SW1 Gi1/0/1','SW1-24':'SW1 Gi1/0/24','SW2-1':'SW2 Gi1/0/1','SW2-2':'SW2 Gi1/0/2','SW3-1':'SW3 Gi1/0/1','SW3-24':'SW3 Gi1/0/24'};
// Ring as a closed polyline in direction "a": SW1 fabric → SW2 → SW3 → patch back to SW1.
export const RING=['SW1-24','SW1-1','SW2-1','SW2-2','SW3-1','SW3-24'];
const EDGE_KIND=['fabric','link','fabric','link','fabric','patch'];
export const RING_PTS=RING.map(k=>PORT_POS[k]);
const SEG=RING_PTS.map((p,i)=>len(sub(RING_PTS[(i+1)%6],p)));
export const PERIM=SEG.reduce((a,b)=>a+b,0);
export const SEG_START=SEG.map((_,i)=>SEG.slice(0,i).reduce((a,b)=>a+b,0));
const PATCH_START=SEG_START[5],PATCH_END=PERIM; // patch edge SW3-24 → SW1-24 in direction a
export function ringPoint(s){s=((s%PERIM)+PERIM)%PERIM;let i=0;while(i<5&&s>=SEG_START[i+1])i++;const u=(s-SEG_START[i])/SEG[i],a=RING_PTS[i],b=RING_PTS[(i+1)%6];return[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u+(EDGE_KIND[i]==='fabric'?-.9*Math.sin(u*Math.PI):EDGE_KIND[i]==='patch'?-1.2*Math.sin(u*Math.PI):.6*Math.sin(u*Math.PI)),a[2]+(b[2]-a[2])*u];}
export const FABRIC_MID={SW1:SEG_START[0]+SEG[0]/2,SW2:SEG_START[2]+SEG[2]/2,SW3:SEG_START[4]+SEG[4]/2};
// ---- Hosts in VLAN 120 ---------------------------------------------------------------------------------------------
export const HOSTS={H1:{sw:'SW1',ip:'192.0.2.10',port:'Gi1/0/10',off:-2.2},H2:{sw:'SW1',ip:'192.0.2.11',port:'Gi1/0/11',off:2.2},R1:{sw:'SW2',ip:'192.0.2.1',port:'Gi1/0/10',off:-2.2,gw:true},
 H3:{sw:'SW2',ip:'192.0.2.12',port:'Gi1/0/11',off:2.2},H5:{sw:'SW3',ip:'192.0.2.14',port:'Gi1/0/10',off:-2.2},H6:{sw:'SW3',ip:'192.0.2.15',port:'Gi1/0/11',off:2.2}};
for(const h of Object.values(HOSTS)){const s=SWITCHES[h.sw];h.pos=add(add(s.corner,mul(s.normal,-6.5)),mul(s.tangent,h.off));h.pos[1]=1.6;}
// ---- Ring clock: slow motion at first, then line-rate looking speed (units per second) ------------------------------
export function speed(t){const u=Math.min(1,Math.max(0,(t-30)/14)),k=u*u*(3-2*u);return 3.2+36.8*k;}
const DT=.01,TAU=[0];for(let i=1;i*DT<=DURATION+1;i++){const t=(i-.5)*DT;TAU.push(TAU[i-1]+speed(t)*DT);}
export const tau=t=>{const x=Math.max(0,t)/DT,i=Math.floor(x),f=x-i;return TAU[Math.min(i,TAU.length-2)]*(1-f)+TAU[Math.min(i+1,TAU.length-1)]*f;};
export function random(i){const n=Math.sin((i+20404)*127.1)*43758.5453;return n-Math.floor(n);}
// ---- Broadcasts and their ring copies -------------------------------------------------------------------------------
// Injection: from a host to its switch's fabric (HOST_HOP units), then one copy per ring direction.
export const HOST_HOP=7;
export const BROADCASTS=[{id:'B-001',t:B001_T,host:'H1',src:ADDR.h1Mac,what:`ARP Who has ${ADDR.gw}? Tell ${ADDR.h1Ip}`}];
{const hosts=Object.keys(HOSTS);let k=2;for(let t=36;t<PORT_DOWN-1;k++){const host=k%4===0?'H1':hosts[Math.floor(random(k)*hosts.length)];BROADCASTS.push({id:`B-${String(k).padStart(3,'0')}`,t,host,src:host==='H1'?ADDR.h1Mac:'02:00:00:00:01:'+(20+k%60),what:host==='H1'?`ARP Who has ${ADDR.gw}? (Wiederholung)`:'ARP / Broadcast'});
 const rate=t<64?.6*Math.exp((t-36)/11):Math.min(5.5,.6*Math.exp(28/11));t+=(.6+.8*random(k+9))/rate;}}
// When a broadcast reaches its switch fabric (fork); copies a/b start there. Queue drops after saturation.
export const SATURATE=60.1;
export const COPIES=[];
BROADCASTS.forEach((b,i)=>{const fork=solveTau(tau(b.t)+HOST_HOP),s0=FABRIC_MID[HOSTS[b.host].sw];for(const dir of['a','b']){const c={id:`${b.id}/${dir}`,b,dir,fork,s0,tau0:tau(fork)};
  c.drop=b.id==='B-001'?null:Math.max(fork,SATURATE)+5+random(i*2+(dir==='a'?1:2))*22;c.end=endOf(c);COPIES.push(c);}});
function solveTau(target){let lo=0,hi=DURATION+1;for(let k=0;k<50;k++){const m=(lo+hi)/2;if(tau(m)<target)lo=m;else hi=m;}return hi;}
// After PORT_DOWN a copy dies when it next reaches the patch edge (SW3-24 egress for a, SW1-24 egress for b).
function endOf(c){const d0=tau(Math.max(PORT_DOWN,c.fork))-c.tau0;let s=c.dir==='a'?c.s0+d0:c.s0-d0;s=((s%PERIM)+PERIM)%PERIM;
 const toPatch=c.dir==='a'?((PATCH_START-s)%PERIM+PERIM)%PERIM:((s-PATCH_END)%PERIM+PERIM)%PERIM||PERIM;const tDown=solveTau(c.tau0+d0+toPatch);return{t:c.drop!=null?Math.min(c.drop,tDown):tDown,why:c.drop!=null&&c.drop<tDown?'queue':'portdown'};}
export function copyPos(c,t){const d=tau(t)-c.tau0;return ringPoint(c.dir==='a'?c.s0+d:c.s0-d);}
export const copyAlive=(c,t)=>t>=c.fork&&t<c.end.t;
export const aliveCopies=t=>COPIES.filter(c=>copyAlive(c,t));
// The path of a broadcast from host to fork (before the copies exist).
export function hostLeg(b,t){const h=HOSTS[b.host],u=(tau(t)-tau(b.t))/HOST_HOP;if(u<0||u>1)return null;const f=ringPoint(FABRIC_MID[h.sw]);return[h.pos[0]+(f[0]-h.pos[0])*u,h.pos[1]+(f[1]-h.pos[1])*u+.8*Math.sin(u*Math.PI),h.pos[2]+(f[2]-h.pos[2])*u];}
// Passes of B-001's copies through switch fabrics: each pass delivers a copy to every access port of that switch
// except the ingress (the ring port it came in on – never back out of the ingress port).
export function passes(c,t0,t1){const out=[];for(const sw of['SW1','SW2','SW3']){const m=FABRIC_MID[sw];let d=c.dir==='a'?((m-c.s0)%PERIM+PERIM)%PERIM:((c.s0-m)%PERIM+PERIM)%PERIM;if(d<1e-6)d=PERIM;for(;;d+=PERIM){const t=solveTau(c.tau0+d);if(t>t1||t>=c.end.t)break;if(t>=t0)out.push({t,sw});}}return out.sort((a,b)=>a.t-b.t);}
export const BRANCH_DUR=.9;
// ---- MAC learning on SW3: H1's source MAC arrives from SW2 (Gi1/0/1) and from SW1 (Gi1/0/24) in turn ------------------
const H1_ARRIVALS=[];for(const c of COPIES.filter(c=>c.b.host==='H1')){const port=c.dir==='a'?'Gi1/0/1':'Gi1/0/24',m=c.dir==='a'?SEG_START[4]:SEG_START[5];let d=c.dir==='a'?((m-c.s0)%PERIM+PERIM)%PERIM:((c.s0-(m%PERIM))%PERIM+PERIM)%PERIM;
 for(let n=0;n<400;n++,d+=PERIM){const t=solveTau(c.tau0+d);if(t>=c.end.t||t>DURATION)break;H1_ARRIVALS.push({t,port});}}
H1_ARRIVALS.sort((a,b)=>a.t-b.t);
export const macPort=t=>{let p=null;for(const a of H1_ARRIVALS){if(a.t>t)break;p=a.port;}return p;};
export const macFlaps=t=>{let n=0,p=null;for(const a of H1_ARRIVALS){if(a.t>t)break;if(p&&a.port!==p)n++;p=a.port;}return n;};
export const lastFlap=t=>{let last=null,p=null;for(const a of H1_ARRIVALS){if(a.t>t)break;if(p&&a.port!==p)last=a.t;p=a.port;}return last;};
// ---- Load metrics (simulated values for the screens) ----------------------------------------------------------------
const smooth=(a,b,t)=>{const u=Math.min(1,Math.max(0,(t-a)/(b-a)));return u*u*(3-2*u);};
export function bcastRate(t){if(t<B001_T)return 0;if(t<PORT_DOWN){const r=Math.min(620000,2*Math.exp((t-B001_T)*.34));return Math.round(r);}return Math.round(24+(620000-24)*Math.exp(-(t-PORT_DOWN)/1.6));}
export function cpu(t){if(t<40)return 12;if(t<PORT_DOWN)return Math.round(12+82*smooth(40,61,t));return Math.round(18+76*(1-smooth(PORT_DOWN+2,PORT_DOWN+22,t)));}
export const mgmtOk=t=>t<MGMT_LOST||t>=MGMT_BACK;
export function queueFill(t,k=0){if(t<40)return 0;const up=smooth(40+k*.8,SATURATE+k,t);if(t<PORT_DOWN)return Math.min(1,up*(.92+.08*Math.sin(t*3+k)));return Math.max(0,1-(t-PORT_DOWN)/(14+k*1.6));}
export function drops(t){if(t<SATURATE-6)return 0;const x=Math.min(t,PORT_DOWN+3)-(SATURATE-6);return Math.round(x*x*410+x*2300);}
// ---- Unicast tests ----------------------------------------------------------------------------------------------------
export const UNICAST=[{id:'U1',t0:76.4,t1:79.6,ok:false,what:`ping ${ADDR.gw} von H1 – im vollen Queue verworfen`},{id:'U2',t0:194.6,t1:TEST_OK,ok:true,what:`ping ${ADDR.gw} von H1 – Antwort`}];
// ---- Screen texts (B-IDs of the script, C01 = management access added) -----------------------------------------------
export const BLOCKS={
 B01:{title:'B-001 · Header',win:[43.96,60.14],pages:[43.96,52.0],lines:[[44.1,'B-001 (Header)','head',0],[44.1,'VLAN: 120','',0],[44.1,`Ethernet src: ${ADDR.h1Mac}`,'',0],[44.1,'Ethernet dst: ff:ff:ff:ff:ff:ff','',0],
  [52.1,'EtherType: 0x0806 (ARP)','',1],[52.1,`ARP: Who has ${ADDR.gw}? Tell ${ADDR.h1Ip}`,'',1],[52.1,'Filmisches Kopiezeichen: B-001/a/b (kein Headerfeld)','ov',1]]},
 B02:{title:'SW3 · STP und MAC',win:[60.14,86.52],lines:[[60.3,'SW3# show spanning-tree vlan 120','cmd'],[61.0,'Spanning tree instance(s) for vlan 120 does not exist.','bad'],[61.6,'SW3# show running-config | include spanning-tree','cmd'],[62.3,'no spanning-tree vlan 120','amber'],
  [63.0,'%SW_MATM-4-MACFLAP_NOTIF: Host 0200.0000.0120 in vlan 120 is flapping between port Gi1/0/1 and port Gi1/0/24','bad'],[63.6,'Overlay: CPU 94% | Broadcast 620000 fps | Management timeout','ov']]},
 C01:{title:'Zugang zu SW3',win:[137.38,153.84],lines:[[142.6,`noc$ ssh admin@${ADDR.mgmtSW3}`,'cmd'],[144.6,`ssh: connect to host ${ADDR.mgmtSW3} port 22: Connection timed out`,'bad'],[145.1,'noc$ screen /dev/ttyUSB0 9600','cmd'],[146.2,'SW3>enable','cmd'],[147.2,'SW3#','ok']]},
 B03:{title:'SW3 · Gi1/0/24',win:[153.84,165.0],panes:[153.84,157.9],lines:[[153.95,'SW3# show interfaces GigabitEthernet1/0/24 description','cmd',0],[154.6,'Interface  Status  Protocol  Description','',0],[154.6,'Gi1/0/24   up      up        PATCH-UNPLANNED-TO-SW1','amber',0],
  [158.0,'SW3# show interfaces GigabitEthernet1/0/24 switchport','cmd',1],[158.7,'Administrative Mode: trunk','',1],[158.7,'Trunking VLANs Enabled: 120','',1],[159.3,'Overlay: Ringabschluss SW3/24 <-> SW1/24 bestätigt','ov',1]]},
 B04:{title:'SW3 · shutdown',win:[SHUT_CMD,168.96],lines:[[161.45,'SW3# configure terminal','cmd'],[161.9,'SW3(config)# interface GigabitEthernet1/0/24','cmd'],[162.4,'SW3(config-if)# shutdown','cmd'],[162.8,'SW3(config-if)# end','cmd'],
  [PORT_DOWN,'%LINK-5-CHANGED: Interface GigabitEthernet1/0/24, changed state to administratively down','ok']]},
 B05:{title:'SW3 · Prüfung',win:[186.72,202.9],lines:[[186.9,'SW3# show interfaces GigabitEthernet1/0/24','cmd'],[187.6,'GigabitEthernet1/0/24 is administratively down, line protocol is down',''],[188.5,'Overlay: Broadcastrate 620000 -> 24 fps','ov'],
  [MGMT_BACK,'Neue MAC-Flaps: 0 | Management antwortet','ok'],[TEST_OK,'Client-Service-Test: erfolgreich','ok'],[199.0,'Folgearbeit: STP für VLAN 120 korrekt aktivieren; Fehlpatch entfernen','amber']]},
};
const CPS=70;
export function blockLines(id,t){
 const b=BLOCKS[id];if(!b)return[];const page=b.pages?b.pages.filter(p=>t>=p).length-1:-1;
 return b.lines.filter(l=>t>=l[0]&&(page<0||l[3]===page)).map(([t0,text,kind='',pane])=>{
  if(kind==='cmd'){const m=/^\S+[#$>] ?/.exec(text),pre=m?m[0].length:0,n=Math.min(text.length,pre+Math.floor((t-t0)*CPS));return{text:text.slice(0,n),kind,pane:pane??0,typing:n<text.length};}
  return{text,kind,pane:pane??0,typing:false};});
}
export function dockBlocks(t){return Object.entries(BLOCKS).filter(([,b])=>t>=b.win[0]&&t<b.win[1]).map(([id])=>id).sort((a,b)=>BLOCKS[b].win[0]-BLOCKS[a].win[0]).slice(0,2);}
// Console texts outside the B-IDs: the stp configuration at the start, the work order, the flashlight note.
export const NOTES={stpcfg:['SW3# show running-config | include spanning-tree','no spanning-tree vlan 120','(Konfiguration besteht schon vor dem Fehlpatch)'],task:['AUFTRAG: Ringabschluss finden','Port: noch unbestimmt','In-band-Management: Timeout'],
 noroot:['VLAN 120: Spanning Tree deaktiviert','kein Root · kein Blocking-Port'],flashlight:['Konsolenkabel: SW3 Console ↔ NOC-Laptop','Prüflicht: Rackgang, Portlabels lesen']};
// ---- Kinetic words, logs, status -------------------------------------------------------------------------------------
export const KINETIC={L016:'BROADCAST STORM',L018:'BROADCAST STORM',L025:'LOOP',L026:'FLOOD',L027:'FLOOD',L028:'ZIEH DAS KABEL',L038:'BROADCAST STORM',L040:'BROADCAST STORM',L042:'PORT DOWN'};
export const WORD_NOTE={L016:'jede Kopie wird erneut geflutet – Ethernet kennt kein TTL',L018:'620000 Broadcasts pro Sekunde (Szenario)',L025:'eine Ringrunde SW1 → SW2 → SW3 → SW1',L026:'an alle Ports ausser dem Eingang',L027:'dieselbe Abstammung, neue Abzweigung',
 L028:'Auftrag: den Link finden, der den Ring schliesst',L038:'der Ring ist offen – Restkopien laufen aus',L040:'die Fabric wird ruhig',L042:'SW3 Gi1/0/24 · administratively down'};
export const LOGS=[
 [RING_CLOSED,'link','%LINK-3-UPDOWN: Interface GigabitEthernet1/0/24, changed state to up (SW3)'],[16.3,'link','%LINK-3-UPDOWN: Interface GigabitEthernet1/0/24, changed state to up (SW1)'],
 [B001_T,'arp',`H1: ARP Who has ${ADDR.gw}? Tell ${ADDR.h1Ip} (B-001)`],[40.4,'sw','%SW_MATM-4-MACFLAP_NOTIF: Host 0200.0000.0120 in vlan 120 is flapping between port Gi1/0/1 and port Gi1/0/24'],
 [61.2,'cpu','SW3: CPU 94% · Queue-Drops steigen'],[MGMT_LOST,'mgmt',`NOC: ${ADDR.mgmtSW3} antwortet nicht (SSH/SNMP Timeout)`],[79.6,'drop','Unicast-Test H1 → 192.0.2.1: verworfen'],
 [SEARCH,'task','Auftrag: Ringabschluss finden'],[144.6,'mgmt',`ssh ${ADDR.mgmtSW3}: Connection timed out → serielle Console`],[PORT_DOWN,'ok','%LINK-5-CHANGED: Interface GigabitEthernet1/0/24, changed state to administratively down'],
 [175.0,'ok','Broadcastrate fällt · keine neuen MAC-Flaps'],[MGMT_BACK,'ok',`NOC: ${ADDR.mgmtSW3} antwortet wieder`],[TEST_OK,'ok','Unicast-Test H1 → 192.0.2.1: Antwort'],
].map(([time_s,tag,message])=>({time_s,tag,message}));
export const ringClosed=t=>t>=RING_CLOSED&&t<PORT_DOWN;
export const STATUS=t=>t<RING_CLOSED?'offene Kette · VLAN 120':t<B001_T?'Ring geschlossen · STP aus':t<MGMT_LOST?'Kopien wachsen':t<SEARCH?'BROADCAST STORM · Management weg':t<PORT_DOWN?'Suche: Ringabschluss':t<MGMT_BACK?'Gi1/0/24 down · Flut zieht ab':'offene Kette · ruhig';
