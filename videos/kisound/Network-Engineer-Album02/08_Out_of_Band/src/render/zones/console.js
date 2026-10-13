// The local configuration room: left the session of the management station (SSH to the console server, then picocom on
// serial channel 7 with the IOS prompt of R-EDGE); right the reachable management storage (change record, dated
// pre-change image, Linux diff, documentation) and the interface plate with the three proofs Link → Route → Service.
// A blinking cursor is the only acting figure.
import * as THREE from 'three';
import {V,mat,dynamicTexture,wrap} from '../world.js';
import {smooth,lerp} from '../timeline.js';
import {BLOCKS,blockLines,T,link,route,proofs} from '../model.js';
const DW=2560,DH=1440,SW=16,SH=SW*DH/DW,TAN=Math.tan(19.5/2*Math.PI/180);
const KC={cmd:'#f3d48a',bad:'#ff6b78',ok:'#8fe3b8',amber:'#ffb13d',ov:'#cfe6f2'};
const font=(g,s,w='400',f='JetBrains Mono')=>{g.font=`${w} ${s}px "${f}"`;};
const CONSOLE=['B02','B03','B04','B05','B07'];
function consoleLines(t){const ids=CONSOLE.filter(id=>{const b=BLOCKS[id];return t>=b.win[0]&&t<b.win[1];}).sort((a,b)=>BLOCKS[a].win[0]-BLOCKS[b].win[0]);
 const out=[];for(const id of ids){const ls=blockLines(id,t).filter(l=>!(id==='B03'&&l.kind!=='cmd'&&/Diff|^\+|Vorabbild/.test(l.text))&&l.kind!=='ov'&&!(id==='B07'&&!/R-EDGE|Destination|Building|\[OK\]/.test(l.text)));if(ls.length)out.push({id,lines:ls});}return out.slice(-2);}
export class ConsoleZone{
 constructor(){const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x010204);this.tex=dynamicTexture(DW,DH);
  const bez=new THREE.Mesh(new THREE.BoxGeometry(SW+.5,SH+.5,.3),mat(0x07090c,{roughness:.4}));bez.position.z=-.17;s.add(bez);s.add(new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),new THREE.MeshBasicMaterial({map:this.tex.tex,toneMapped:false})));}
 update(t){const cl=consoleLines(t),pr=proofs(t),blink=Math.floor(t*1.6)%2,key=JSON.stringify([cl.map(b=>b.lines.map(l=>l.text)),blink,link(t),route(t),pr,t>=52.68,t>=T.image,blockLines('B03',t).length,blockLines('B07',t).map(l=>l.text)]);
  this.tex.set(key,g=>{g.fillStyle='#04070b';g.fillRect(0,0,DW,DH);
   // left: session
   g.fillStyle='#071016';g.fillRect(40,110,1500,1250);g.strokeStyle='#3fe0ff';g.lineWidth=4;g.strokeRect(40,110,1500,1250);font(g,26,'600');g.fillStyle='#7fd8ea';g.fillText(t<T.picocom?'Terminal · management$':'Console · R-EDGE über /dev/ttyUSB7 (9600 8N1)',70,160);let y=230;
   if(!cl.length){font(g,36);g.fillStyle=t>=T.prompt?'#8fe3b8':'#9feaff';g.fillText((t>=T.prompt?'R-EDGE#':'management$')+(blink?' _':''),70,y);}
   for(const b of cl){font(g,24,'600');g.fillStyle='#5f8a98';g.fillText(`${b.id} · ${BLOCKS[b.id].title}`,70,y);y+=50;for(const l of b.lines)for(const part of wrap(l.text,62)){font(g,32);g.fillStyle=KC[l.kind]||'#d8e7ef';g.fillText(part+(l.typing&&blink?'_':''),70,y);y+=46;}y+=36;}
   // right top: management storage
   g.fillStyle='#0a1622';g.fillRect(1580,110,940,820);g.strokeStyle='#e6f2fa';g.strokeRect(1580,110,940,820);font(g,32,'600','Space Grotesk');g.fillStyle='#e6f2fa';g.fillText('Managementspeicher (10.99.0.0/24)',1610,170);
   const files=[['CHG-2088.txt','Change-Eintrag',t>=52.68],['R-EDGE_pre-CHG-2088.cfg','Vorabbild · datiert',t>=T.image]];files.forEach(([n,d,hi],i)=>{g.fillStyle=hi?'rgba(63,224,255,.16)':'rgba(255,255,255,.03)';g.fillRect(1600,200+i*84,900,70);font(g,28);g.fillStyle=hi?'#9feaff':'#7f97a8';g.fillText(n,1620,244+i*84);font(g,22);g.fillStyle='#7f97a8';g.fillText(d,2240,244+i*84);});
   let ry=410;const right=[];if(t>=52.68&&t<T.diff)right.push(['CHG-2088: interface Gi0/0/1','#cfe6f2'],['  shutdown (versehentlich, per In-band-SSH)','#ff8b80'],['  seit Filmbeginn wirksam','#7f97a8']);
   const b3=t>=T.diff&&t<T.save?blockLines('B03',Math.min(t,147.8)):[];const p1=t>=T.diff?BLOCKS.B03.lines.filter(l=>l[3]===1&&t>=l[0]).map(l=>[l[1],KC[l[2]]||'#d8e7ef']):[];if(t>=T.diff&&t<T.save)right.push(...p1);
   if(t>=189.9)right.push(...BLOCKS.B07.lines.filter(l=>l[3]===1&&t>=l[0]).map(l=>[l[1],KC[l[2]]||'#d8e7ef']));
   for(const[s,c]of right)for(const part of wrap(s,44)){font(g,26);g.fillStyle=c;g.fillText(part,1610,ry);ry+=40;}
   // right bottom: interface plate and proofs
   g.fillStyle='#0a1622';g.fillRect(1580,960,940,400);g.strokeStyle='#3f6a8c';g.strokeRect(1580,960,940,400);font(g,30,'600','Space Grotesk');g.fillStyle='#e6f2fa';g.fillText('Gi0/0/1 · 10.0.12.1/30',1610,1012);
   font(g,30);g.fillStyle=t<T.noShut?'#ff8b80':t<T.lineUp?'#ffd27a':'#8fe3b8';g.fillText(t<T.noShut?'administratively down':`no shutdown · ${link(t)}`,1610,1068);g.fillStyle=t>=T.route?'#8fe3b8':'#7f97a8';g.fillText(`Route: ${route(t)}`,1610,1120);
   [['LINK',pr.link],['ROUTE',pr.route],['SERVICE',pr.service],['P-O2',pr.confirm],['GESPEICHERT',pr.saved]].forEach(([k,on],i)=>{const x=1610+(i%3)*300,yy=1160+Math.floor(i/3)*100;g.fillStyle=on?'#1f5a40':'#141e28';g.fillRect(x,yy,280,80);font(g,30,'600','Space Grotesk');g.fillStyle=on?'#8fe3b8':'#4f6474';g.fillText(k,x+20,yy+52);});
   font(g,24,'500');g.fillStyle='#7f97a8';g.fillText('Managementstation 10.99.0.10 · SSH → Console-Server 10.99.0.20 · seriell Kanal 7 → R-EDGE',40,DH-20);font(g,22);g.fillStyle='#5f7484';g.textAlign='right';g.fillText('Szenario / simulierte Werte',DW-40,DH-20);g.textAlign='left';});}
 camera(shot,t){const u=smooth(shot.start,shot.end,t),d=SH*1.04/(2*TAN),k=+shot.id.slice(1)%2?1:-1;return{pos:V([lerp(-.4,.4,u)*k,lerp(.1,-.1,u),d*lerp(1.02,.97,u)]),target:V([lerp(-.2,.2,u)*k,0,0]),fov:19.5};}
}
