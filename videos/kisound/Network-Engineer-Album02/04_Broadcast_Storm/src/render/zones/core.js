// Inside SW3: queue shafts per port, drop counters, the MAC/port table and the overloaded management chamber.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,label,instanced,dynamicTexture} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {queueFill,drops,cpu,mgmtOk,macPort,macFlaps,lastFlap,bcastRate,PORT_DOWN,UNICAST,random} from '../model.js';
const SHAFTS=['Gi1/0/1','Gi1/0/2','Gi1/0/10','Gi1/0/11','Gi1/0/24','Gi1/0/48'],SX=k=>-7.5+k*3;
export class CoreZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x02040a);s.fog=new THREE.FogExp2(0x02040a,.03);
  s.add(new THREE.HemisphereLight(0x6f8fc0,0x05070c,1.1));const l=new THREE.PointLight(0xffd23a,3,26,1.5);l.position.set(0,7,4);s.add(l);this.redLight=new THREE.PointLight(P.red,0,30,1.5);this.redLight.position.set(10,5,2);s.add(this.redLight);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(80,60),mat(0x060a12,{roughness:.35,metalness:.7}));floor.rotation.x=-Math.PI/2;s.add(floor);
  // queue shafts with a fill of carriers and a drop counter each
  this.shafts=SHAFTS.map((n,k)=>{const x=SX(k);const g=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,8,24,1,true),new THREE.MeshStandardMaterial({color:0x9fc8ff,transparent:true,opacity:.12,side:THREE.DoubleSide,depthWrite:false}));g.position.set(x,4,0);s.add(g);
   const rim=new THREE.Mesh(new THREE.TorusGeometry(1.1,.05,6,32),glow(0x9fc8ff,.6));rim.rotation.x=Math.PI/2;rim.position.set(x,8,0);s.add(rim);label(s,`Queue ${n}`,'egress',[x,9.4,0],2.6);
   const tex=dynamicTexture(512,160),c=new THREE.Mesh(new THREE.PlaneGeometry(2.4,.75),new THREE.MeshBasicMaterial({map:tex.tex,toneMapped:false}));c.position.set(x,.8,1.3);s.add(c);return{x,tex,rim};});
  this.cards=instanced(s,new THREE.BoxGeometry(1.2,.12,.8),glow(0xffffff),600);this.spill=instanced(s,new THREE.BoxGeometry(.25,.25,.25),additive(0xffffff),120);
  // MAC table on the left wall, management chamber with CPU monitor on the right
  this.mac=dynamicTexture(1400,900);const mm=new THREE.Mesh(new THREE.PlaneGeometry(11.2,7.2),new THREE.MeshBasicMaterial({map:this.mac.tex,toneMapped:false}));mm.position.set(-17,4.6,-2);mm.rotation.y=Math.PI/2.6;s.add(mm);this.macMesh=mm;
  this.mon=dynamicTexture(1200,800);const cm=new THREE.Mesh(new THREE.PlaneGeometry(9,6),new THREE.MeshBasicMaterial({map:this.mon.tex,toneMapped:false}));cm.position.set(16,4.4,-2);cm.rotation.y=-Math.PI/2.6;s.add(cm);label(s,'MANAGEMENT · CONTROL PLANE','SW3 · überlastet, nicht zerstört',[16,8.4,-2],4.4);
  this.uni=label(s,'Unicast-Test H1 → 192.0.2.1','',[0,0,0],3.4,'#d8ffe9');this.uniMat=glow(P.ok,1.4);this.uniCard=box(s,[1.2,.14,.8],[0,0,0],this.uniMat);
 }
 drawMac(t){const port=macPort(t),n=macFlaps(t),lf=lastFlap(t),hot=lf!=null&&t-lf<.35,stable=t>=PORT_DOWN+4;
  this.mac.set(`${port}|${n}|${hot}|${stable}`,(g,w,h)=>{g.fillStyle='#050b12';g.fillRect(0,0,w,h);g.strokeStyle='#3f6a8c';g.lineWidth=6;g.strokeRect(3,3,w-6,h-6);g.font='600 50px "Space Grotesk"';g.fillStyle='#d8e6ef';g.fillText('SW3 · show mac address-table vlan 120',36,72);
   g.font='34px "JetBrains Mono"';g.fillStyle='#7c9aae';g.fillText('Vlan  Mac Address       Type     Ports',36,150);
   const rows=[['120','0200.0000.0120','DYNAMIC',port??'—','h1'],['120','0200.0000.0111','DYNAMIC','Gi1/0/1'],['120','0200.0000.0001','DYNAMIC','Gi1/0/1'],['120','0200.0000.0114','DYNAMIC','Gi1/0/10'],['120','0200.0000.0115','DYNAMIC','Gi1/0/11']];
   rows.forEach((r,i)=>{const y=220+i*70,h1=r[4]==='h1';if(h1){g.fillStyle=hot?'#4a1018':stable?'#0f2a20':'#2a1a08';g.fillRect(24,y-50,w-48,66);}g.font='36px "JetBrains Mono"';g.fillStyle=h1?(stable?'#8fe3b8':hot?'#ff8b97':'#ffd27a'):'#cfe3ee';g.fillText(`${r[0]}   ${r[1]}    ${r[2]}  ${r[3]}`,36,y);});
   g.font='600 40px "JetBrains Mono"';g.fillStyle=stable?'#8fe3b8':'#ff8b97';g.fillText(stable?`H1 stabil an Gi1/0/1 · neue Flaps: 0`:`H1-MAC springt Gi1/0/1 ↔ Gi1/0/24 · Flaps: ${n}`,36,640);
   g.font='30px "JetBrains Mono"';g.fillStyle='#7c9aae';g.fillText('H1 hängt an SW1 Gi1/0/10 – SW3 sieht sie über beide Ringseiten',36,710);g.fillText('Szenario / simulierte Werte',36,860);});}
 drawMon(t){const c=cpu(t),ok=mgmtOk(t),r=bcastRate(t);this.mon.set(`${c}|${ok}|${Math.round(Math.log10(r+1)*10)}|${Math.floor(t)}`,(g,w,h)=>{g.fillStyle='#07080c';g.fillRect(0,0,w,h);g.strokeStyle=c>80?'#ff3b4e':'#3f6a8c';g.lineWidth=8;g.strokeRect(4,4,w-8,h-8);
  g.font='700 92px "Space Grotesk"';g.fillStyle=c>80?'#ff5d6c':'#cfe3ee';g.fillText(`CPU ${c}%`,40,120);g.font='600 46px "Space Grotesk"';g.fillStyle=ok?'#8fe3b8':'#ffb13d';g.fillText(ok?'Management antwortet':'⚠ Management Timeout',40,200);
  g.strokeStyle='#ff5d6c';g.lineWidth=5;g.beginPath();for(let i=0;i<=120;i++){const tt=t-60+i*.5,v=cpu(tt);const x=40+i*9,y=640-v*3.6;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();g.fillStyle='rgba(255,93,108,.15)';g.lineTo(1120,640);g.lineTo(40,640);g.fill();
  g.font='38px "JetBrains Mono"';g.fillStyle='#cfe3ee';g.fillText(`Broadcast: ${r.toLocaleString('de-CH')} fps`,40,720);g.fillStyle='#7c9aae';g.font='28px "JetBrains Mono"';g.fillText('ASIC-Last, Queue-Verlust und CPU-Last sind getrennte Folgen',40,770);});}
 update(t,a,tl,shot){
  const beat=tl.attack(t);this.drawMac(t);this.drawMon(t);this.redLight.intensity=cpu(t)>80?4+4*beat:0;
  this.cards.begin();this.spill.begin();this.shafts.forEach((sh,k)=>{const f=queueFill(t,k),n=Math.round(f*40);for(let i=0;i<n;i++){const y=.4+i*.19,j=random(k*100+i);this.cards.push(new THREE.Vector3(sh.x+(j-.5)*.3,y,(random(k*77+i)-.5)*.3),i%3?P.yellow:0xffffff,1,new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),j*3),i%3?.55:.4);}
   setGlow(sh.rim.material,f>.9?P.red:0x9fc8ff,f>.9?1+beat:.6);if(f>.9&&t<PORT_DOWN+1)for(let i=0;i<8;i++){const d=((t*1.7+i*.13+k*.31)%1),p=new THREE.Vector3(sh.x+(random(i+k*9)-.5)*2.4,8.2+d*1.2-d*d*6,(random(i*3+k)-.5)*2.4);this.spill.push(p,P.red,1,null,.9*(1-d));}
   const dn=Math.round(drops(t)*(.12+k*.05));sh.tex.set(`${dn}|${f>.9}`,(g,w,h)=>{g.fillStyle='#07080c';g.fillRect(0,0,w,h);g.font='600 40px "JetBrains Mono"';g.fillStyle=f>.9?'#ff8b97':'#9fb4c4';g.fillText(`drops ${dn.toLocaleString('de-CH')}`,16,64);g.font='30px "JetBrains Mono"';g.fillStyle='#7c9aae';g.fillText(`Füllstand ${Math.round(f*100)}%`,16,120);});});
  this.cards.end();this.spill.end();
  // the unicast test that cannot get past the copies (S020)
  const u=UNICAST[0],on=t>=u.t0&&t<=u.t1+.6,k=clamp((t-u.t0)/(u.t1-u.t0));this.uniCard.visible=on;this.uni.userData.alpha=on?1:0;
  if(on){const p=V([SX(0)-6+6*k,8.4+.5*Math.sin(k*3),0]);if(t>u.t1)p.y-=(t-u.t1)*4;this.uniCard.position.copy(p);setGlow(this.uniMat,t>u.t1-.5?P.red:P.ok,1.4);this.uni.position.copy(p).add(new THREE.Vector3(0,1.4,0));}
 }
 camera(shot,t){const u=smooth(shot.start,shot.end,t),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),m=shot.mode;
  if(shot.camera==='mac')return look([lerp(-5.4,-6.2,u),4.6,lerp(2.6,2.2,u)],[-17,4.6,-2],42);
  if(m==='unicastdrop')return look([lerp(-12,-8,u),8.6,10],[lerp(-9,-5,u),7.6,0],42);
  const k=+shot.id.slice(1)%2,x=lerp(-9,9,u)*(k?1:-1);return look([x,lerp(5,4,u),11],[x*.7,4,0],44);}
}
