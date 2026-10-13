// The fog map: a dark table with the backbone drawn from above. Fog lifts only where a hop has answered.
// ICMP slips, routing tables and the firewall log lie on the table; a terminal stands at its edge.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,additive,setGlow,ring,dynamicTexture,monoLines} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {NODES,LINKS,GROW,SHIFT,revealed,evidenceUntil,traceLines,latestTrace,ROUTES,FW_LOG,RTBH,FLIGHTS,BY_ID,voidRadius} from '../model.js';
const CW=2400,CH=1350,TW=36,TH=TW*CH/CW;
const X0=-74,X1=58,Z0=-30,Z1=44,map=(x,z)=>[(x-X0)/(X1-X0)*CW,(z-Z0)/(Z1-Z0)*CH];
// Where slips lie on the table, in canvas pixels.
const SLIP={R2:[60,940],R4:[1120,980],FW:[1700,140],CASE:[640,330]};
export class MapZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x020407);s.fog=new THREE.FogExp2(0x020407,.02);
  s.add(new THREE.HemisphereLight(0x6f8fb0,0x020305,.5));this.lamp=new THREE.SpotLight(0xcfe6ff,160,60,.7,.6,1.4);this.lamp.position.set(0,24,4);this.lamp.target.position.set(0,0,0);s.add(this.lamp,this.lamp.target);
  const slab=new THREE.Mesh(new THREE.BoxGeometry(TW+2,1,TH+2),mat(0x0b1118,{roughness:.8}));slab.position.y=-.5;s.add(slab);
  this.tex=dynamicTexture(CW,CH);const m=new THREE.Mesh(new THREE.PlaneGeometry(TW,TH),new THREE.MeshStandardMaterial({map:this.tex.tex,emissive:0xffffff,emissiveMap:this.tex.tex,emissiveIntensity:.8,roughness:.7}));m.rotation.x=-Math.PI/2;m.position.y=.01;s.add(m);
  this.term=dynamicTexture(1100,700);const tm=new THREE.Mesh(new THREE.PlaneGeometry(9,5.7),new THREE.MeshBasicMaterial({map:this.term.tex,toneMapped:false}));tm.position.set(0,3.4,-TH/2-1.6);s.add(tm);
  // Pulsing pins above the hops that answered.
  this.pins={};for(const id of Object.keys(NODES)){const[cx,cy]=map(NODES[id].pos[0],NODES[id].pos[2]),r=ring(s,.55,[(cx/CW-.5)*TW,.06,(cy/CH-.5)*TH],additive(P.te,0),.05);r.rotation.x=Math.PI/2;this.pins[id]=r;}
 }
 drawMap(t,mode){
  const rev=revealed(t),ev=evidenceUntil(t),key=[...rev].join()+ev.length+mode+(t>=GROW)+(t>=SHIFT)+Math.round(voidRadius(t)*4);
  this.tex.set(key,(g,w,h)=>{g.fillStyle='#071019';g.fillRect(0,0,w,h);g.strokeStyle='rgba(60,100,140,.25)';g.lineWidth=1;for(let x=0;x<w;x+=60){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}for(let y=0;y<h;y+=60){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
   // Links and nodes (the ground truth), then fog over everything that has not answered.
   for(const[a,b]of LINKS){const[x1,y1]=map(NODES[a].pos[0],NODES[a].pos[2]),[x2,y2]=map(NODES[b].pos[0],NODES[b].pos[2]);g.strokeStyle=a==='R2'&&b==='RC'?'#7a2a35':b==='R3b'||a==='R3b'?(t>=SHIFT?'#59e3ff':'#2a4a66'):'#59e3ff';g.lineWidth=6;g.setLineDash(a==='R2'&&b==='RC'?[18,14]:[]);g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke();}g.setLineDash([]);
   for(const[id,n]of Object.entries(NODES)){const[x,y]=map(n.pos[0],n.pos[2]);g.fillStyle=n.host?'#1d3550':'#24425f';g.beginPath();g.arc(x,y,n.host?22:28,0,7);g.fill();g.strokeStyle='#59e3ff';g.lineWidth=3;g.stroke();g.font='600 30px "Space Grotesk"';g.fillStyle='#cfe6f2';g.fillText(n.label,x+36,y-6);g.font='22px "JetBrains Mono"';g.fillStyle='#8fb2c8';g.fillText(n.ip,x+36,y+24);}
   const[vx,vy]=map(4,-2);g.fillStyle='#000';g.beginPath();g.arc(vx+120,vy+40,30*voidRadius(t),0,7);g.fill();g.strokeStyle='#ff4057';g.lineWidth=4;g.stroke();
   const fog=document.createElement('canvas');fog.width=w;fog.height=h;const f=fog.getContext('2d');f.fillStyle='rgba(8,12,18,.82)';f.fillRect(0,0,w,h);f.globalCompositeOperation='destination-out';
   for(const id of rev){const[x,y]=map(NODES[id].pos[0],NODES[id].pos[2]),gr=f.createRadialGradient(x,y,20,x,y,240);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');f.fillStyle=gr;f.beginPath();f.arc(x,y,240,0,7);f.fill();}
   const path=['S','R1','R2',t>=SHIFT?'R3b':'R3','R4'].filter(id=>rev.has(id));for(let i=1;i<path.length;i++){const[a,b]=[path[i-1],path[i]].map(id=>map(NODES[id].pos[0],NODES[id].pos[2]));f.lineWidth=160;f.lineCap='round';f.strokeStyle='rgba(0,0,0,.85)';f.beginPath();f.moveTo(...a);f.lineTo(...b);f.stroke();}
   g.drawImage(fog,0,0);
   // Answered hops get numbers; beyond R4 the trace prints * * *.
   const hops=['R1','R2',t>=SHIFT?'R3b':'R3','R4'];hops.forEach((id,i)=>{if(!rev.has(id))return;const[x,y]=map(NODES[id].pos[0],NODES[id].pos[2]);g.fillStyle='#e8f4ff';g.beginPath();g.arc(x-40,y-40,24,0,7);g.fill();g.fillStyle='#071019';g.font='700 28px "Space Grotesk"';g.textAlign='center';g.fillText(String(i+1),x-40,y-30);g.textAlign='left';});
   if(rev.has('R4')){const[x,y]=map(NODES.R5.pos[0],NODES.R5.pos[2]);g.font='700 56px "JetBrains Mono"';g.fillStyle='#ff4057';g.fillText('* * *',x-60,y+90);g.font='24px "JetBrains Mono"';g.fillStyle='#ff8b95';g.fillText('hop 5, 6: no reply',x-60,y+130);}
   if(t>=GROW&&rev.has('D2')){const[x,y]=map(NODES.D2.pos[0],NODES.D2.pos[2]);g.strokeStyle='#ff4057';g.lineWidth=6;g.beginPath();g.moveTo(x-30,y-30);g.lineTo(x+30,y+30);g.moveTo(x+30,y-30);g.lineTo(x-30,y+30);g.stroke();g.font='22px "JetBrains Mono"';g.fillStyle='#ff8b95';g.fillText('answered once · gone since /24',x-140,y+70);}
   if(ev.some(e=>e.type==='du')){const[x,y]=map(NODES.RC.pos[0],NODES.RC.pos[2]);g.font='600 28px "Space Grotesk"';g.fillStyle='#ff4057';g.fillText('ICMP 3/0 from R2: no route',x-40,y-60);}
   // ICMP slips: the last few messages, fanned at the probe host.
   const slips=ev.filter(e=>e.type!=='reply').slice(-5);slips.forEach((e,i)=>{const x=60+i*24,y=120+i*86;g.save();g.translate(x,y);g.rotate(-.04+.02*i);g.fillStyle=e.type==='du'?'#2a0c12':'#e6ecf2';g.fillRect(0,0,560,74);g.strokeStyle=e.type==='du'?'#ff4057':'#59e3ff';g.lineWidth=3;g.strokeRect(0,0,560,74);
    g.font='22px "JetBrains Mono"';g.fillStyle=e.type==='du'?'#ff8b95':'#10233a';g.fillText(e.label.slice(0,42),16,32);g.font='18px "JetBrains Mono"';g.fillStyle=e.type==='du'?'#ff8b95':'#4f6b80';g.fillText(e.type==='du'?`for ${e.dst}`:`ttl ${e.ttl} expired`,16,58);g.restore();});
   // Routing tables and the firewall log, once the investigation has looked at them.
   const slip=(at,title,rows,accent)=>{const[x,y]=at;g.fillStyle='rgba(230,236,242,.95)';g.fillRect(x,y,660,58+rows.length*44);g.fillStyle=accent;g.fillRect(x,y,660,8);g.font='600 28px "Space Grotesk"';g.fillStyle='#10233a';g.fillText(title,x+18,y+44);
    rows.forEach((r,i)=>{const bad=/missing|Null0/.test(r[1]);g.font='22px "JetBrains Mono"';g.fillStyle=bad?'#c0182c':'#10233a';g.fillText(`${r[0].padEnd(17)} ${r[1].padEnd(14)} ${r[2]}`.slice(0,52),x+18,y+88+i*44);});};
   if(t>=63.6)slip(SLIP.R2,'R2 · show ip route',ROUTES.R2(t),'#ff4057');
   if(t>=104.98)slip(SLIP.R4,'R4 · show ip route 203.0.113.45',ROUTES.R4(t),'#ff4057');
   if(t>=87.06){const[x,y]=SLIP.FW;g.fillStyle='rgba(230,236,242,.95)';g.fillRect(x,y,640,110);g.fillStyle='#3fe6a0';g.fillRect(x,y,640,8);g.font='600 26px "Space Grotesk"';g.fillStyle='#10233a';g.fillText('Firewall B · quiet',x+18,y+44);g.font='20px "JetBrains Mono"';g.fillText(FW_LOG.slice(0,50),x+18,y+84);}
   if(mode==='case'||t>=172.46){const[x,y]=SLIP.CASE;g.fillStyle='rgba(10,16,24,.92)';g.fillRect(x,y,900,250);g.strokeStyle='#ffb648';g.lineWidth=4;g.strokeRect(x,y,900,250);g.font='600 34px "Space Grotesk"';g.fillStyle='#ffb648';g.fillText('FINDINGS · not fixed tonight',x+22,y+50);
    g.font='24px "JetBrains Mono"';g.fillStyle='#e8f4ff';g.fillText(`1  R4 discards ${RTBH(t)} → Null0`,x+22,y+104);g.fillText('   old RTBH route (tag 666), no ICMP: silence',x+22,y+138);g.fillText('2  R2 has no route to 198.51.100.0/24',x+22,y+186);g.fillText('   withdrawn prefix → ICMP 3/0 net unreachable',x+22,y+220);}
  });
 }
 drawTerm(t,mode){
  const kind=/noroute|prefix|du|fin/.test(mode)?'c':/noanswer|noreply|b_noreply/.test(mode)?'ping':'trace',lines=kind==='trace'?traceLines(latestTrace(t),t):kind==='ping'?['$ ping -c 3 203.0.113.45','PING 203.0.113.45 56(84) bytes of data.','','--- 203.0.113.45 ping statistics ---','3 packets transmitted, 0 received, 100% packet loss']:['$ ping -c 1 198.51.100.20','PING 198.51.100.20 56(84) bytes of data.','From 198.18.0.2 icmp_seq=1 Destination Net Unreachable','--- 198.51.100.20 ping statistics ---','1 packets transmitted, 0 received, +1 errors, 100% packet loss'];
  this.term.set(kind+lines.join('|'),(g,w,h)=>{g.fillStyle='#03070c';g.fillRect(0,0,w,h);g.fillStyle='#0e2236';g.fillRect(0,0,w,44);g.font='22px "JetBrains Mono"';g.fillStyle='#8fb2c8';g.fillText('probe host · 192.0.2.10',16,30);
   monoLines(g,lines.slice(-9),{x:24,y:96,size:28,lh:1.45,colors:[[/\* \* \*|Unreachable|100% packet loss/,'#ff8b95'],[/^\$/,'#ffd24a'],[/ms$/,'#e8f4ff']]});});
 }
 update(t,a,tl,shot){
  const bass=a.sub_20_60_drive??0;this.lamp.intensity=130+60*bass;this.drawMap(t,shot.mode);this.drawTerm(t,shot.mode);
  const ev=evidenceUntil(t);for(const[id,r]of Object.entries(this.pins)){const last=ev.filter(e=>e.from===id).at(-1),age=last?t-last.t:99;setGlow(r.material,last?.type==='du'?P.du:P.te,age<4?1.6*Math.exp(-age/1.4):0);r.scale.setScalar(1+Math.min(age,4)*.4);}
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),idx=+shot.id.slice(1),sign=idx%2?1:-1,px=(x,z)=>{const[cx,cy]=map(x,z);return[(cx/CW-.5)*TW,0,(cy/CH-.5)*TH];};let c;const look=(pos,target,fov=48)=>({pos:V(pos),target:V(target),fov});
  switch(shot.camera){
   case'top':c=look([lerp(-2,2,lin)*sign,lerp(22,19,u),lerp(8,6.5,u)],[0,0,-.5],50);break;
   case'low':c=look([lerp(-20,-14,u),5,lerp(16,12,u)],[0,0,0],50);break;
   case'card':c=look([-14,7,lerp(-1,-3,u)],[-12.5,0,-6],40);break;
   case'term':c=look([lerp(1,0,u),4.2,lerp(-3,-4.5,u)],[0,3.4,-TH/2-1.6],46);break;
   case'table':{const at=/null|night3/.test(shot.mode)?SLIP.R4:SLIP.R2,x=(at[0]+330)/CW,z=(at[1]+110)/CH,p=[(x-.5)*TW,0,(z-.5)*TH];c=look([p[0]-1,lerp(9,7.5,u),p[2]+5],p,42);break;}
   default:c=look([0,26,10],[0,0,0]);
  }
  return c;
 }
}
