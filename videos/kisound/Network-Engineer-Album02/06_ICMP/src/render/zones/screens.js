// The header room: glass header cards (outer IPv4, ICMP type/code, quote capsule), overview cards, the counterexample.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,dynamicTexture,wrap} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {BY_ID,headerFocus,CARDS,BLOCKS,blockLines,received,pmtu,routeX,traceLines,T,ADDR} from '../model.js';
const DW=2560,DH=1440,SW=16,SH=SW*DH/DW,TAN=Math.tan(19.5/2*Math.PI/180);
const font=(g,s,w='400',f='JetBrains Mono')=>{g.font=`${w} ${s}px "${f}"`;};
function glassCard(g,x,y,w,h,title,col){g.fillStyle='rgba(16,40,64,.55)';g.fillRect(x,y,w,h);g.strokeStyle=col;g.lineWidth=5;g.strokeRect(x,y,w,h);g.fillStyle=col;g.fillRect(x,y,w,6);font(g,40,'600','Space Grotesk');g.fillStyle='#e8f6ff';g.fillText(title,x+28,y+60);}
function fields(g,x,y,rows,size=34){rows.forEach(([k,v,hi],i)=>{font(g,size);g.fillStyle='#8fb2c8';g.fillText(k,x,y+i*size*1.45);font(g,size,hi?'700':'400');g.fillStyle=hi?'#ffd27a':'#e6f2fa';g.fillText(v,x+340,y+i*size*1.45);});}
function drawPacket(g,f,big){
 const isIcmp=f.kind==='icmp'||f.proto==='ICMP',orig=f.quote?BY_ID.get(f.quote):null;
 glassCard(g,140,90,2280,330,'IPv4-Header (äusseres Paket)','#4fd8ff');fields(g,180,200,[['Quelle',f.src],['Ziel',f.dst],['Protocol',isIcmp?'1 (ICMP)':f.proto==='UDP'?'17 (UDP)':'6 (TCP)',isIcmp],['TTL / DF',`${f.ttl??64}${f.df?' · DF=1':''}`,!!f.df]]);
 font(g,30);g.fillStyle='#8fb2c8';g.fillText(`Länge ${f.size??(isIcmp?84:60)} Byte · ID ${f.ipid??'0x31'+(f.id.charCodeAt(0)%10)+'0'}`,1300,200);
 if(isIcmp){glassCard(g,140,460,2280,big?520:320,`ICMP · Type ${f.type} Code ${f.code}`,'#ffffff');font(g,big?150:96,'700','Space Grotesk');g.fillStyle=f.type===3||f.type===11||f.type===5?'#ffd27a':'#bff1ff';g.fillText(`${f.type}/${f.code}`,190,big?760:660);
  font(g,44,'500','Space Grotesk');g.fillStyle='#e6f2fa';g.fillText(f.hdr.split('·').slice(1).join('·').trim()||f.hdr,big?620:520,big?690:590);
  font(g,34);g.fillStyle='#9fc8e8';g.fillText(f.type===3&&f.code===4?'Next-Hop MTU 1400':f.type===5?`Gateway ${f.gw}`:f.type===0||f.type===8?'Echo ID 4242 · Seq 1 · Daten 56 Byte':'',big?620:520,big?760:650);}
 else{glassCard(g,140,460,2280,320,`${f.proto} · ${f.hdr}`,'#4fd8ff');font(g,36);g.fillStyle='#e6f2fa';g.fillText(f.size===1500?'20 IP + 8 UDP + 1472 Daten = 1500 Byte':f.size===1400?'20 IP + 8 UDP + 1372 Daten = 1400 Byte':f.dport?`Zielport ${f.dport} · neue Probe`:'',190,620);}
 if(orig){glassCard(g,140,820,2280,420,'Zitat · Kopie des ursprünglichen Headers (nicht erneut gesendet)','#ffb13d');fields(g,180,930,[['Original',orig.id],['IP Quelle → Ziel',`${orig.src} → ${orig.dst}`],['IP ID / DF',`${orig.ipid??'—'}${orig.df?' · DF=1':''}`],['erste 8 Byte',orig.dport?`UDP ${orig.dport}`:orig.proto==='UDP'?'UDP 9000':'TCP 443',true]],32);}
}
function drawCards(g,n,t){font(g,46,'600','Space Grotesk');g.fillStyle='#e6f2fa';g.fillText(n<6?'Geöffnete Antworten':'IPv4 ICMP — geprüfte Vorgänge',140,120);
 CARDS.slice(0,n).forEach(([tc,name,src],i)=>{const c=i%3,r=Math.floor(i/3),x=140+c*780,y=190+r*560;glassCard(g,x,y,720,500,name,i<2?'#bff1ff':'#ffd27a');font(g,150,'700','Space Grotesk');g.fillStyle=i<2?'#bff1ff':'#ffd27a';g.fillText(tc,x+40,y+300);font(g,34);g.fillStyle='#9fc8e8';g.fillText(src,x+40,y+400);});}
function drawSchema(g,quote){glassCard(g,140,120,2280,360,'IPv4-Header','#4fd8ff');fields(g,180,240,[['Protocol','1 (ICMP)',true],['Quelle','…'],['Ziel','…']]);glassCard(g,140,540,2280,320,'ICMP · Type ? Code ?','#ffffff');font(g,40);g.fillStyle='#8fb2c8';g.fillText('Antwortfelder noch ungeöffnet',190,720);
 if(quote){glassCard(g,140,920,2280,360,'Zitatkapsel · bei Fehlermeldungen','#ffb13d');font(g,36);g.fillStyle='#e6f2fa';g.fillText('IP-Header des Originals + erste 8 Byte Transport',190,1080);}}
function drawCounter(g){glassCard(g,140,120,2280,1180,'GEGENBEISPIEL · nicht die laufende Strecke','#ff4a5c');font(g,40);g.fillStyle='#e6f2fa';['Filter verwirft ICMP 3/4 auf dem Rückweg','Sender erfährt die MTU 1400 nie','grosse DF-Datagramme verschwinden wiederholt – PMTUD Black Hole','','Im Film: I-M1 erreicht H, PMTU-Cache 1400'].forEach((l,i)=>{g.fillStyle=i===4?'#8fe3b8':'#ffb0b8';g.fillText(l,200,280+i*90);});}
export class HeaderZone{
 constructor(){const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x01030a);this.tex=dynamicTexture(DW,DH);
  const m=new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),new THREE.MeshBasicMaterial({map:this.tex.tex,toneMapped:false,transparent:true}));s.add(m);
  const grid=[];for(let x=-40;x<=40;x+=2)grid.push(x,-6,-20,x,-6,20);s.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(grid,3)),new THREE.LineBasicMaterial({color:0x10263c,transparent:true,opacity:.5})));}
 update(t){const fo=headerFocus(t);this.tex.set(JSON.stringify(fo),g=>{g.clearRect(0,0,DW,DH);g.fillStyle='rgba(2,6,14,.9)';g.fillRect(0,0,DW,DH);if(fo.kind==='pkt')drawPacket(g,BY_ID.get(fo.id),fo.big);else if(fo.kind==='cards')drawCards(g,fo.n,t);else if(fo.kind==='counter')drawCounter(g);else drawSchema(g,fo.quote);
  font(g,24);g.fillStyle='#5f7484';g.textAlign='right';g.fillText('Szenario / simulierte Werte · IPv4',DW-40,DH-24);g.textAlign='left';});}
 camera(shot,t){const u=smooth(shot.start,shot.end,t),d=SH*1.04/(2*TAN),k=+shot.id.slice(1)%2?1:-1;return{pos:V([lerp(-.6,.6,u)*k,lerp(.2,-.2,u),d*lerp(1.03,.96,u)]),target:V([lerp(-.3,.3,u)*k,0,0]),fov:19.5};}
}
