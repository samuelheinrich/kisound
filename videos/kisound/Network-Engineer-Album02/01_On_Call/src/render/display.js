// The engineer's main display as a pure function of time: ticket (left), terminal (right top), cards (right bottom),
// evidence and closing (left bottom). Shared by the screen zone and the monitor on the desk.
import {dynamicTexture,wrap} from './world.js';
import {clamp,smooth} from './timeline.js';
import {ALARM,FIX,OK_A,VERIFY,SERVICES,TICKET,BLOCKS,blockLines,changeExecuted,clock,counter,BY_ID,LOGS} from './model.js';
export const DW=2560,DH=1440;
export const C={bg:'#050b13',panel:'#0a1521',edge:'#1d3a52',text:'#d8e7ef',dim:'#7c9aae',cyan:'#5fe0ff',amber:'#ffb13d',red:'#ff5d6c',ok:'#74d6a4',head:'#f2f7fa'};
// Regions (canvas px) the screen camera frames.
export const REGION={
 ticket:[40,96,1250,600],report:[40,190,1250,780],fields:[40,300,1250,800],fill:[40,300,1250,800],compare:[40,560,1250,940],coords:[40,560,1250,1000],
 live:[1290,96,2520,880],diff:[1290,880,2520,1400],difference:[1290,880,2520,1400],evidence:[40,900,1250,1400],preview:[1290,96,2520,880],tls:[1290,96,2520,880],
 named:[40,880,1250,1400],attach:[40,880,1250,1400],closed:[40,96,1250,1400]};
const TERMINAL=['B06','B05','B03','P1','P0','B02'];
const font=(g,size,w='400',fam='JetBrains Mono')=>{g.font=`${w} ${size}px "${fam}"`;};
function panel(g,x,y,w,h,title,accent=C.edge){g.fillStyle=C.panel;g.fillRect(x,y,w,h);g.strokeStyle=accent;g.lineWidth=3;g.strokeRect(x+1.5,y+1.5,w-3,h-3);if(title){g.fillStyle=accent===C.edge?'#10263a':accent;g.fillRect(x,y,w,44);font(g,24,'500');g.fillStyle=accent===C.edge?C.dim:'#06101a';g.fillText(title,x+18,y+31);}}
const kindColor=k=>({cmd:C.amber==='x'?C.amber:'#f3d48a',bad:C.red,ok:C.ok,amber:C.amber,warn:'#ff9aa4',head:C.head}[k]||C.text);
// Visible terminal block at t: the newest whose first line has been revealed.
export function terminalBlock(t){for(const id of TERMINAL){const b=BLOCKS[id];if(t>=b.lines[0][0]&&t<b.win[1]+(id==='B06'?40:6))return id;}return null;}
function stateAt(t){
 const s={t:Math.floor(t*4)/4,blink:Math.floor(t*1.6)%2};
 s.alarm=t>=22.62;s.fields=TICKET.fieldsShown.filter(x=>t>=x).length;s.filled=Object.entries(TICKET.fieldsFilled).filter(([,x])=>t>=x).map(([k])=>k);
 s.services=['A','B','C','D'].map(k=>k==='D'?(t>=67.75?'ok':t>=22.62?'mon':'-'):t>=VERIFY[k]?'ok':t>=TICKET.compare?'timeout':t>=22.62?'reported':'-');
 s.coords=t>=TICKET.coords;s.term=terminalBlock(t);s.lines=s.term?blockLines(s.term,t).map(l=>[l.text,l.kind,l.typing]):[];
 s.exec=changeExecuted(t);s.live=t>=TICKET.live&&t<146?'FA1':t>=148.78&&t<184.28?'FA2':null;s.cnt=counter(t);
 s.card=t>=128?'diff':'mon';s.diff=BLOCKS.B04.lines.filter(l=>t>=l[0]).length;s.evidence=t>=140.9&&t<TICKET.cause?1:0;
 s.cause=t>=TICKET.cause;s.att=TICKET.attach.filter(x=>t>=x).length;s.closed=t>=TICKET.closed;s.time=clock(t);
 s.steps=PROGRESS.map(([,x])=>t>=x?1:0).join('');s.fa1=t<108.2?Math.min(4,[85.6,90,100,104.2].filter(x=>t>=x).length):5;
 return s;
}
const PROGRESS=[['SYN',149.6],['SYN/ACK',157.8],['ACK',157.9],['TLS 1.3 · Zertifikat geprüft',161.4],['GET /health',161.9],['HTTP 200',OK_A]];
export function createDisplay(){
 const d=dynamicTexture(DW,DH);
 return{tex:d.tex,update(t){const s=stateAt(t);d.set(JSON.stringify(s),g=>draw(g,s,t));return s;}};
}
function draw(g,s,t){
 g.fillStyle=C.bg;g.fillRect(0,0,DW,DH);
 // top bar
 g.fillStyle='#0b1826';g.fillRect(0,0,DW,70);font(g,26,'500');g.fillStyle=C.dim;g.fillText('Bereitschaft Netzwerk · Diagnose',36,45);g.textAlign='right';g.fillStyle=C.text;g.fillText(s.time,DW-36,45);
 font(g,20);g.fillStyle=C.dim;g.fillText('Szenario / simulierte Werte',DW-140,45);g.textAlign='left';
 drawTicket(g,s,t);drawTerminal(g,s,t);drawCard(g,s,t);drawLower(g,s,t);
}
function drawTicket(g,s){
 panel(g,40,96,1210,1300,'TICKET',s.closed?C.ok:s.alarm?C.edge:C.edge);
 if(!s.alarm){font(g,30);g.fillStyle=C.dim;g.fillText('Keine offenen Incidents · Bereitschaft aktiv',80,200);return;}
 font(g,54,'500','Space Grotesk');g.fillStyle=C.head;g.fillText('INCIDENT-2042',80,200);font(g,34);g.fillStyle=C.dim;g.fillText('| 02:17 | On Call',520,198);
 font(g,26);g.fillStyle=C.dim;g.fillText('Bereitschaft: NETZ-ONCALL · Priorität P2 · Quelle: Telefon NOC',80,246);
 font(g,40,'500','Space Grotesk');g.fillStyle='#ff9aa4';g.fillText('Meldung: «Alles ist weg»',80,312);
 const rows=[['Standort','site','SITE-2'],['Client','client','192.0.2.10'],['Beginn','begin','nach CHG-2042']];
 rows.forEach(([k,key,v],i)=>{if(i>=s.fields)return;const y=380+i*62;g.fillStyle='#0e1d2c';g.fillRect(80,y-40,1130,54);font(g,30);g.fillStyle=C.dim;g.fillText(k,100,y);
  const has=s.filled.includes(key);g.fillStyle=has?C.text:'#4d6577';g.fillText(has?v:'—  (fehlt)',330,y);if(!has&&s.blink&&i===s.fields-1){g.fillStyle=C.cyan;g.fillRect(330,y-30,4,36);}});
 // service cards: red until the service's own test passed; green only for confirmed tests
 ['APP-A','APP-B','APP-C','CTRL-D'].forEach((n,i)=>{const st=s.services[i];if(st==='-')return;const x=80+i*285,y=590,col=st==='ok'?C.ok:st==='mon'?C.dim:C.red;
  g.fillStyle=st==='ok'?'#0f2a20':st==='mon'?'#101c28':'#2a0f15';g.fillRect(x,y,262,150);g.strokeStyle=col;g.lineWidth=3;g.strokeRect(x+1.5,y+1.5,259,147);
  font(g,34,'600','Space Grotesk');g.fillStyle=C.head;g.fillText(n,x+18,y+50);font(g,22);g.fillStyle=C.dim;g.fillText(i<3?`198.51.100.2${i}:443`:'203.0.113.40:443',x+18,y+86);
  font(g,24,'500');g.fillStyle=col;g.fillText(st==='ok'?'HTTP 200 ✓':st==='timeout'?'HTTPS timeout':st==='mon'?'gemeldet: ok':'gemeldet: rot',x+18,y+128);});
 if(s.coords){const y=790;font(g,22);g.fillStyle=C.cyan;g.fillText('FESTE KOORDINATEN',80,y-12);[['CLIENT','192.0.2.10'],['ZEIT','ab 01:52 · CHG-2042'],['ZIEL','198.51.100.20:443']].forEach(([k,v],i)=>{const x=80+i*380;g.strokeStyle=C.cyan;g.lineWidth=3;g.strokeRect(x,y,360,92);font(g,20);g.fillStyle=C.dim;g.fillText(k,x+16,y+30);font(g,28,'500');g.fillStyle=C.text;g.fillText(v,x+16,y+72);});}
}
function drawTerminal(g,s){
 const id=s.term,b=id&&BLOCKS[id],x=1290,y=96,w=1230,h=760;panel(g,x,y,w,h,b?`TERMINAL · ${b.title}`:'TERMINAL');
 const preview=id==='B05'&&!s.exec;let yy=y+96;
 if(!b){font(g,28);g.fillStyle=C.dim;g.fillText('oncall@client:~$',x+28,yy);if(s.blink){g.fillStyle=C.cyan;g.fillRect(x+300,yy-26,16,32);}return;}
 if(preview){g.fillStyle=C.amber;g.fillRect(x+w-380,y+56,352,40);font(g,22,'600');g.fillStyle='#1b1205';g.fillText('VORSCHAU · Enter ausstehend',x+w-366,y+84);}
 if(id==='B05'&&s.exec){g.fillStyle=C.amber;g.fillRect(x+w-300,y+56,272,40);font(g,22,'600');g.fillStyle='#1b1205';g.fillText('AUSGEFÜHRT · 1 Zeile',x+w-286,y+84);}
 font(g,25);const cols=80;
 for(const[text,kind,typing]of s.lines){for(const part of wrap(text,cols)){if(yy>y+h-24)break;g.fillStyle=kindColor(kind);g.fillText(part,x+28,yy);yy+=38;}
  if(typing&&s.blink){g.fillStyle=C.cyan;g.fillRect(x+28+g.measureText(wrap(text,cols).at(-1)).width+4,yy-38-26,14,30);}yy+=6;}
 // progress strip of the live trace
 if(s.live==='FA1'){const st=['CLIENT','Gi0/0/0','Eingang','Routing','Gi0/0/1 out'];drawSteps(g,x+28,y+h-110,st,s.fa1,s.fa1===5?'verworfen vor Gi0/0/1 · keine Antwort':'LIVE-SPUR F-A1 · Port 51000');}
 if(s.live==='FA2'){drawSteps(g,x+28,y+h-110,PROGRESS.map(p=>p[0]),s.steps.split('').filter(c=>c==='1').length,'TEST-A · neue Verbindung F-A2 · Port 51001',true);}
}
function drawSteps(g,x,y,names,n,caption,good=false){
 font(g,20);g.fillStyle=C.dim;g.fillText(caption,x,y);const w=1170/names.length;
 names.forEach((nm,i)=>{const on=i<n,fail=!good&&n===5&&i===4;g.fillStyle=fail?'#3a1016':on?(good?'#12301f':'#0f2c3a'):'#0e1a26';g.fillRect(x+i*w,y+14,w-10,52);g.strokeStyle=fail?C.red:on?(good&&i===names.length-1?C.ok:C.cyan):'#28445a';g.lineWidth=2;g.strokeRect(x+i*w,y+14,w-10,52);
  font(g,names.length>5?17:20,'500');g.fillStyle=fail?C.red:on?C.text:'#4f687a';g.fillText(nm.length>22?nm.slice(0,21)+'…':nm,x+i*w+12,y+48);});
}
function drawCard(g,s,t){
 const x=1290,y=880,w=1230,h=516;
 if(s.card==='mon'){panel(g,x,y,w,h,'MONITORING · HTTPS-Checks');['APP-A','APP-B','APP-C','CTRL-D'].forEach((n,i)=>{const yy=y+110+i*96,bad=i<3&&t>=ALARM-14;font(g,28,'500');g.fillStyle=C.text;g.fillText(n,x+30,yy);
   for(let k=0;k<40;k++){const tt=k*1.5,fail=bad&&k>22;g.fillStyle=fail?C.red:i===3?'#3f8a6a':'#3f6b84';g.fillRect(x+260+k*23,yy-26,15,fail?30:12+((k*7+i*3)%5)*4);}
   font(g,22);g.fillStyle=bad?C.red:C.dim;g.fillText(bad?'seit 01:53 rot':'erreichbar',x+w-230,yy);});return;}
 panel(g,x,y,w,h,'CHG-2042 · gespeicherter Diff',C.amber);font(g,28);let yy=y+110;
 BLOCKS.B04.lines.slice(0,s.diff).forEach(([,text,kind])=>{for(const part of wrap(text,72)){g.fillStyle=kindColor(kind);g.fillText(part,x+30,yy);yy+=44;}});
 if(s.exec){g.strokeStyle=C.amber;g.lineWidth=3;g.beginPath();g.moveTo(x+30,y+110+88-10);g.lineTo(x+560,y+110+88-10);g.stroke();font(g,26,'500');g.fillStyle=C.amber;g.fillText('− ip access-group QUARANTINE out · zurückgenommen',x+30,y+h-40);}
}
function drawLower(g,s,t){
 const x=80,y=920,w=1130;
 if(s.evidence){g.strokeStyle=C.cyan;g.lineWidth=3;g.strokeRect(x,y,w,440);font(g,24,'500');g.fillStyle=C.cyan;g.fillText('BEWEISKARTE · derselbe Test F-A1',x+20,y+40);
  [['✓','Route','198.51.100.0/24 connected via Gi0/0/1',C.ok],['✗','Binding','ip access-group QUARANTINE out (CHG-2042)',C.amber],['✗','Counter','Regel 10: 40 → 41 (+1, nur F-A1 gesendet)',C.red],['✗','Log','denied 192.0.2.10(51000) → 198.51.100.20(443)',C.red]].forEach(([m,k,v,c],i)=>{const yy=y+110+i*80;font(g,34,'700');g.fillStyle=c;g.fillText(m,x+24,yy);font(g,28,'500');g.fillStyle=C.text;g.fillText(k,x+80,yy);font(g,24);g.fillStyle=C.dim;g.fillText(v,x+280,yy);});
  font(g,22);g.fillStyle=C.dim;g.fillText('Gateway-Ping beantwortet: nur ein Vergleichstest, kein Anwendungstest',x+24,y+420);return;}
 if(s.cause){font(g,24,'500');g.fillStyle=C.cyan;g.fillText('URSACHE',x,y+20);font(g,36,'500','Space Grotesk');g.fillStyle=C.head;g.fillText('Falsches ACL-Binding nach CHG-2042',x,y+76);font(g,24);g.fillStyle=C.dim;g.fillText('QUARANTINE (fremde Zone) ausgehend an Gi0/0/1 · Route und Links korrekt',x,y+118);
  font(g,24,'500');g.fillStyle=C.cyan;g.fillText(`ANHÄNGE (${s.att}/4)`,x,y+180);TICKET.attachments.slice(0,s.att).forEach((a,i)=>{font(g,26);g.fillStyle=C.text;g.fillText(`📎 ${a}`,x+10,y+226+i*44);});
  if(s.closed){g.save();g.translate(x+820,y+300);g.rotate(-.12);g.strokeStyle=C.ok;g.lineWidth=6;g.strokeRect(-200,-60,400,110);font(g,52,'700','Space Grotesk');g.fillStyle=C.ok;g.textAlign='center';g.fillText('GESCHLOSSEN',0,14);g.restore();
   font(g,22);g.fillStyle=C.ok;g.fillText('Verifikation: TEST-A, APP-B, APP-C, CTRL-D · HTTP 200',x,y+420);}
  return;}
 if(s.alarm&&s.services[0]==='timeout'){font(g,22);g.fillStyle=C.dim;g.fillText('Screenshot vom Melder: «nichts geht» – ersetzt keinen Test',x,y+40);}
}
// Small laptop texture: the router log lines up to t.
export function createLaptop(){const d=dynamicTexture(1024,640);return{tex:d.tex,update(t){const rows=LOGS.filter(l=>l.time_s<=t).slice(-9);d.set(rows.length+'|'+Math.floor(t*1.6)%2,g=>{g.fillStyle='#03080d';g.fillRect(0,0,1024,640);g.fillStyle='#0d1c2a';g.fillRect(0,0,1024,40);font(g,20);g.fillStyle=C.dim;g.fillText('R-EDGE · syslog (OOB-Management)',14,27);
 rows.forEach((r,i)=>{font(g,17);g.fillStyle=r.tag==='acl'?C.red:r.tag==='ok'?C.ok:r.tag==='cfg'?C.amber:'#a9c4d4';const txt=r.message.length>92?r.message.slice(0,91)+'…':r.message;g.fillText(txt,14,78+i*58);});});}};}
