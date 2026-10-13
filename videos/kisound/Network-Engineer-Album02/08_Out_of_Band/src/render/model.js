// Editorial scenario (simulated values): R-EDGE (IOS XE) connects client 192.0.2.10 on Gi0/0/0 with the production uplink
// Gi0/0/1 10.0.12.1/30 (neighbour 10.0.12.2, service 198.51.100.20:443, static route 198.51.100.0/24 via 10.0.12.2).
// CHG-2088 set shutdown on Gi0/0/1 before the film starts. The independent management network 10.99.0.0/24 reaches the
// console server 10.99.0.20; its serial channel 7 (picocom /dev/ttyUSB7, 9600 8N1) ends at R-EDGE's console port.
import {DURATION} from './config.js';
export const T={inband:[8.48,9.48,11.48,46.2,47.2,49.2,53.2],timeout:56.0,mgmtSsh:66.78,picocom:68.6,ready:70.3,prompt:71.06,image:117.8,showRun:136.32,diff:140.4,
 noShut:147.88,shutterOpen:148.9,linkUp:150.48,lineUp:151.48,route:153.84,po1:158.88,po1Srv:161.2,po1Ok:163.48,traffic:166.98,trafficFull:189.84,save:182.8,saved:186.0,
 po2:212.06,po2Srv:213.96,po2Back:216.6,po2Ok:218.64,po2Doc:221.06,phone:236.2,city:240.34};
export const ADDR={client:'192.0.2.10',gi1:'10.0.12.1',nbr:'10.0.12.2',srv:'198.51.100.20',prodAdmin:'198.51.100.10',mgmt:'10.99.0.10',cons:'10.99.0.20'};
export const smooth=(a,b,t)=>{const u=Math.max(0,Math.min(1,(t-a)/(b-a)));return u*u*(3-2*u);};
// ---- Geometry: a real data hall in metres, y up. Rack rows run along x (14 racks of 0.6 m); hot/cold aisles 1.2 m.
// Row A z=-4.2 (front +z), cold aisle 1, row B z=-1.8 (front -z), hot aisle, row C z=0.6 (front +z), cold aisle 2,
// row D z=3.0 (front -z). R-EDGE is rack C06 (x=-0.9): data ports at the front (cold aisle 2), console port, console
// server and OOB switch at the rear (hot aisle), where the engineer sits on the floor with the laptop (10.99.0.10).
export const HALL={x:[-7.2,7.2],z:[-6.6,6.8],h:3.6,rackX:i=>-3.9+.6*i,rows:{A:{z:-4.2,face:1},B:{z:-1.8,face:-1},C:{z:.6,face:1},D:{z:3,face:-1}},aisles:{cold1:-3,hot:-.6,cold2:1.8},endX:5.4};
export const ST={REDGE:[-.9,0,.6],GI0:[-1.05,1.05,1.24],GI1:[-.75,1.05,1.24],CONPORT:[-1.12,1.07,-.03],CONS:[-.9,1.31,0],CONS7:[-.83,1.31,-.03],MSW:[-.9,1.4,0],
 ENG:[-.9,0,-.74],LAPTOP:[-.9,.42,-.46],PHONE:[-.42,.008,-.86],NBR:[3.9,0,-4.2],NBR_PORT:[3.9,1.6,-3.62],SRV:[3.3,0,-4.2],SRV_PORT:[3.3,1.25,-3.62],NOC:[0,2.15,6.74],
 CLIENT_RISER:[-7.05,2.6,1.4],ADMIN_RISER:[7.1,2.55,-3.3],DUCT_Y:2.55};
export const PATH={
 prod:[[-7.05,2.46,1.4],[-1.05,2.46,1.4],[-1.05,1.05,1.24],[-.75,1.05,1.24],[-.75,2.46,1.4],[3.9,2.46,1.4],[3.9,2.46,-3.3],[3.9,1.6,-3.62],[3.3,1.25,-3.62]],
 inband:[[7.1,2.46,-3.3],[3.9,2.46,-3.3],[3.9,1.6,-3.62]],
 mgmt:[[-.735,.39,-.44],[-.74,.02,-.22],[-.786,.02,-.04],[-.786,1.4,-.04],[-.76,1.37,-.075],[-.72,1.33,-.07],[-.7,1.31,-.04]],
 serial:[[-.83,1.31,-.04],[-.88,1.2,-.14],[-1.02,1.12,-.12],[-1.12,1.07,-.04]],
};
function plen(pts){let s=0;for(let i=1;i<pts.length;i++)s+=Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1],pts[i][2]-pts[i-1][2]);return s;}
export function along(pts,u){const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1],pts[i][2]-pts[i-1][2]));const s=Math.max(0,Math.min(1,u))*L.at(-1);let i=1;while(i<L.length-1&&L[i]<s)i++;const k=(s-L[i-1])/(L[i]-L[i-1]||1),a=pts[i-1],b=pts[i];return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];}
const rev=p=>[...p].reverse();
// ---- States ------------------------------------------------------------------------------------------------------------
export const shutter=t=>smooth(T.noShut,T.shutterOpen,t);// 0 closed (administratively down) … 1 open
export const link=t=>t<T.linkUp?'down':t<T.lineUp?'up/down':'up/up';
export const route=t=>t<T.route?'konfiguriert · Next Hop nicht nutzbar':'installiert';
export const warm=t=>smooth(T.linkUp,175,t);
export const proofs=t=>({link:t>=T.lineUp,route:t>=T.route,service:t>=T.po1Ok,confirm:t>=T.po2Ok,saved:t>=T.saved});
export const consoleSession=t=>t>=T.prompt;
// ---- Flights (deterministic) ---------------------------------------------------------------------------------------------
export const FLIGHTS=[];
const fly=(id,kind,pts,t0,t1,fate='deliver',extra={})=>{const f={id,kind,pts,t0,t1,fate,...extra};FLIGHTS.push(f);return f;};
// in-band SSH SYNs from the production admin client die before the down uplink (no route over Gi0/0/1)
T.inband.forEach((t,i)=>fly(`SYN-${i+1}`,'syn',PATH.inband,t,t+1.3,'drop',{label:`SYN → ${ADDR.gi1}:22`,src:ADDR.prodAdmin,dst:ADDR.gi1}));
// management SSH session (station ↔ console server), request/response pairs while the session lives
{let k=0;for(let t=T.mgmtSsh;t<DURATION-1;t+=.9,k++){const back=k%2===1;fly(`M-${k}`,'mgmt',back?rev(PATH.mgmt):PATH.mgmt,t,t+1.1,'deliver',{src:back?ADDR.cons:ADDR.mgmt,dst:back?ADDR.mgmt:ADDR.cons});}}
// service tests: new requests after the recovery, responses on the production path (never via the console)
fly('P-O1','req',PATH.prod,T.po1,T.po1Srv,'deliver',{label:'P-O1 · HTTPS GET /health',src:ADDR.client,dst:`${ADDR.srv}:443`});
fly('P-O1R','resp',rev(PATH.prod),T.po1Srv,T.po1Ok,'deliver',{label:'P-O1 · HTTP 200 · TLS geprüft',src:`${ADDR.srv}:443`,dst:ADDR.client});
fly('P-O2','req',PATH.prod,T.po2,T.po2Srv,'deliver',{label:'P-O2 · Bestätigungstest',src:ADDR.client,dst:`${ADDR.srv}:443`});
fly('P-O2R','resp',rev(PATH.prod),T.po2Srv,T.po2Back,'deliver',{label:'P-O2 · HTTP 200',src:`${ADDR.srv}:443`,dst:ADDR.client});
// normal production traffic resumes only after the first verified service test, thickening towards S048
{let k=0;for(let t=T.traffic;t<DURATION;k++){const back=k%2===1;fly(`TX-${k}`,'traffic',back?rev(PATH.prod):PATH.prod,t,t+2.6,'deliver');const dense=smooth(T.traffic,T.trafficFull,t);t+=1.1-.75*dense+.1*((k*7)%3);}}
export const BY_ID=new Map(FLIGHTS.map(f=>[f.id,f]));
export const activeFlights=t=>FLIGHTS.filter(f=>t>=f.t0&&t<=f.t1+(f.fate==='drop'?1:0));
export const pointAt=(f,t)=>along(f.pts,(Math.min(t,f.t1)-f.t0)/(f.t1-f.t0));
// serial bytes: the console line is busy around each console output (reveal of a console block line)
const CONSOLE_IDS=['B02','B03','B04','B05','B07'];
export function serialActivity(t){if(t<T.picocom)return 0;let v=.15;for(const id of CONSOLE_IDS)for(const l of BLOCKS[id].lines){if(id==='B03'&&l[3]===1)continue;const d=t-l[0];if(d>=0&&d<1.2)v=Math.max(v,1-d/1.2);}return v;}
// ---- Screen texts ----------------------------------------------------------------------------------------------------------
export const BLOCKS={
 B01:{title:'Produktionspfad (prod-client 198.51.100.10)',win:[46.2,60.08],lines:[[46.3,'In-band-Versuch (Produktionspfad)','ov'],[46.4,'prod-client$ ssh ops@10.0.12.1','cmd'],[48.18,'Dashboard: letzter erfolgreicher Abruf vor CHG-2088','amber'],[52.68,'Gi0/0/1 administratively down','bad'],[T.timeout,'ssh: connect to host 10.0.12.1 port 22: Connection timed out','bad']]},
 B02:{title:'Managementstation 10.99.0.10 → Console-Server',win:[66.78,90.08],lines:[[66.9,'management$ ssh consoleops@10.99.0.20','cmd'],[T.picocom,'console$ picocom --baud 9600 --databits 8 --parity n --stopbits 1 /dev/ttyUSB7','cmd'],[T.ready,'Terminal ready',''],[T.prompt,'R-EDGE#','ok'],[75.3,'Overlay: SSH im separaten Managementnetz; danach seriell 9600/8N1','ov'],[78.02,'Kanal 7 -> R-EDGE Console','ov']]},
 B03:{title:'Console (Kanal 7) und Managementspeicher',win:[136.32,147.88],pages:[136.32,T.diff],lines:[[136.4,'R-EDGE# show running-config interface GigabitEthernet0/0/1','cmd',0],[137.4,'interface GigabitEthernet0/0/1','',0],[137.4,' ip address 10.0.12.1 255.255.255.252','',0],[137.4,' shutdown','bad',0],
  [T.diff,'Change-Diff CHG-2088 (Managementstation, gespeicherte Dateien)','ov',1],[T.diff,'interface GigabitEthernet0/0/1','',1],[T.diff,'+ shutdown','bad',1],[T.diff+.6,'Vorabbild: Interface aktiv; Route via 10.0.12.2 unverändert','ok',1]]},
 B04:{title:'Console (Kanal 7) · gezielte Rücknahme',win:[T.noShut,155.08],lines:[[T.noShut,'R-EDGE# configure terminal','done'],[T.noShut,'R-EDGE(config)# interface GigabitEthernet0/0/1','done'],[T.noShut,'R-EDGE(config-if)# no shutdown','done'],[148.6,'R-EDGE(config-if)# end','done'],
  [T.linkUp,'%LINK-3-UPDOWN: Interface GigabitEthernet0/0/1, changed state to up','ok'],[T.lineUp,'%LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0/1, changed state to up','ok']]},
 B05:{title:'Console (Kanal 7) · Link, dann Route',win:[T.linkUp,158.88],pages:[T.linkUp,154.6],lines:[[151.7,'R-EDGE# show ip interface brief','cmd',0],[152.3,'GigabitEthernet0/0/1  10.0.12.1  YES manual  up  up','ok',0],[152.8,'R-EDGE# show ip route 198.51.100.20','cmd',0],[T.route,'Routing entry for 198.51.100.0/24','',0],[T.route,'  Known via "static", distance 1, metric 0','',0],[T.route,'  * 10.0.12.2','ok',0],
  [154.6,'Routing entry for 198.51.100.0/24','',1],[154.6,'  Known via "static", distance 1, metric 0','',1],[154.6,'  * 10.0.12.2','ok',1],[154.6,'Overlay: LINK bestätigt -> ROUTE installiert -> SERVICE noch prüfen','ov',1]]},
 B06:{title:'Client 192.0.2.10 · Service-Test P-O1',win:[T.po1,170.86],lines:[[T.po1+.1,"client$ curl --connect-timeout 3 --max-time 5 --resolve app.example:443:198.51.100.20 --write-out '\\nHTTP %{http_code}\\n' https://app.example/health",'cmd'],[T.po1Ok,'{"status":"ok"}','ok'],[T.po1Ok,'HTTP 200','ok'],[T.po1Ok+.4,'P-O1: HTTP 200 | TLS-Zertifikat geprüft','ok'],[T.po1Ok+.8,'Client 192.0.2.10 -> 198.51.100.20:443','ov'],[T.po1Ok+.8,'Kein Datenverkehr über Console-Kanal 7','ov']]},
 B07:{title:'Console (Kanal 7) · speichern und dokumentieren',win:[T.save,243.56],pages:[T.save,189.84],lines:[[T.save+.1,'R-EDGE# copy running-config startup-config','cmd',0],[184.0,'Destination filename [startup-config]?','',0],[184.8,'Building configuration...','',0],[T.saved,'[OK]','ok',0],
  [189.9,'CHG-2088 | Rücknahme dokumentiert','ov',1],[190.3,'Gi0/0/1: no shutdown | Route via 10.0.12.2 installiert','ok',1],[T.po2Doc,'P-O1 erfolgreich | P-O2 im Finale erneut HTTP 200','ok',1],[190.7,'Management 10.99.0.20 / Console Kanal 7 weiterhin erreichbar','',1]]},
};
const CPS=70;
export function blockLines(id,t){const b=BLOCKS[id];if(!b)return[];const page=b.pages?b.pages.filter(p=>t>=p).length-1:-1;
 return b.lines.filter(l=>t>=l[0]&&(page<0||l[3]===page)).sort((a,c)=>a[0]-c[0]).map(([t0,text,kind=''])=>{if(kind==='cmd'){const m=/^\S+[#$] /.exec(text),pre=m?m[0].length:0,n=Math.min(text.length,pre+Math.floor((t-t0)*CPS));return{text:text.slice(0,n),kind,typing:n<text.length};}return{text,kind:kind==='done'?'cmd':kind,typing:false};});}
export function dockBlocks(t){return Object.entries(BLOCKS).filter(([id,b])=>t>=b.win[0]&&t<b.win[1]&&blockLines(id,t).length).map(([id])=>id).sort((a,b)=>BLOCKS[b].win[0]-BLOCKS[a].win[0]).slice(0,2);}
// ---- Words, logs, status --------------------------------------------------------------------------------------------------
export const KINETIC={L017:'OUT OF BAND',L018:'EINE TÜR BLEIBT OFFEN',L021:'OUT OF BAND',L041:'OUT OF BAND',L042:'EINE TÜR BLEIBT OFFEN',L045:'OUT OF BAND'};
export const WORD_NOTE={L017:'Managementnetz 10.99.0.0/24 → Console-Server → Kanal 7',L018:'Kanal 7 trägt nur CLI, keinen Anwendungsverkehr',L021:'getrennte Ports, Kabel und Adressflächen',L041:'Uplink offen, Managementweg bleibt getrennt',L042:'Console antwortet weiterhin über Kanal 7',L045:'P-O2: neuer Bestätigungstest'};
export const LOGS=[
 [8.48,'prod','SSH 198.51.100.10 → 10.0.12.1: keine Antwort (Gi0/0/1 down)'],[18.48,'mgmt','Managementnetz 10.99.0.0/24 unabhängig vorhanden'],[46.2,'prod','ssh ops@10.0.12.1 · SYN ohne Antwort'],[T.timeout,'prod','Connection timed out'],
 [T.mgmtSsh,'mgmt','SSH 10.99.0.10 → 10.99.0.20 (Console-Server)'],[T.picocom,'con','picocom /dev/ttyUSB7 · 9600 8N1 · Kanal 7'],[T.prompt,'con','R-EDGE# über Kanal 7 erreichbar'],[T.image,'mgmt','Vorabbild R-EDGE vor CHG-2088 gefunden'],
 [T.showRun,'con','show running-config Gi0/0/1 → shutdown'],[T.diff,'mgmt','Diff CHG-2088: + shutdown (einzige Abweichung)'],[T.noShut,'con','no shutdown an Gi0/0/1'],[T.linkUp,'link','Gi0/0/1 changed state to up'],[T.lineUp,'link','Line protocol up'],
 [T.route,'route','198.51.100.0/24 via 10.0.12.2 installiert'],[T.po1,'svc','P-O1 192.0.2.10 → 198.51.100.20:443'],[T.po1Ok,'ok','P-O1 HTTP 200 · TLS geprüft'],[T.save,'con','copy running-config startup-config'],[T.saved,'ok','[OK] · CHG-2088 dokumentiert'],
 [T.po2,'svc','P-O2 Bestätigungstest'],[T.po2Ok,'ok','P-O2 HTTP 200'],[229.64,'con','Console Kanal 7 weiterhin erreichbar'],
].map(([time_s,tag,message])=>({time_s,tag,message}));
export const STATUS=t=>t<T.mgmtSsh?'Gi0/0/1 administratively down · keine In-band-Antwort':t<T.showRun?'Uplink down · Console Kanal 7 erreichbar':t<T.noShut?'Diff geprüft: + shutdown':t<T.route?'no shutdown · Link up':t<T.po1Ok?'Route installiert · Service ausstehend':t<T.saved?'P-O1 HTTP 200':t<T.po2Ok?'gespeichert · CHG-2088 dokumentiert':'P-O2 HTTP 200 · Console erreichbar';
