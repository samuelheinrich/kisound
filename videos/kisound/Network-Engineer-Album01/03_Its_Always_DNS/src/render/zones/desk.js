// The detective's desk: case file with clue cards, phone, terminal, magnifier, stamp, lamp and the
// case board. Everything shown here reads the same model as the DNS world.
import * as THREE from 'three';
import {PALETTE as P,BLACKOUT} from '../config.js';
import {V,mat,glow,additive,setGlow,box,ring,line,label,dynamicTexture,monoLines} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {CLUES,clueState,ticketAt,TICKETS,digOutput,DIG_FOR_MODE,status,ZONE} from '../model.js';
const STAMPS={hook:['NXDOMAIN','#ff4fa3'],hook2:['RESOLVED','#3fe6a0'],hook3:['NXDOMAIN','#ff4fa3'],closed:['CASE CLOSED','#3fe6a0'],end:['NXDOMAIN','#ff4fa3']};
const RINGING=[[5.5,9.0],[200.5,203.2]];
const DIG_COLORS=[[/status: NXDOMAIN|NXDOMAIN|no such name|cannot resolve|missing/,'#ff7cbf'],[/status: NOERROR|ANSWER SECTION|works|✓|\+ /,'#7ff5c0'],[/timed out|no servers/,'#ff8a95'],[/^\$|^engineer\$/,'#ffd24a'],[/^;;/,'#8fb2c8']];
export class DeskZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x03060c);s.fog=new THREE.FogExp2(0x03060c,.05);
  this.ambient=new THREE.HemisphereLight(0x6f8fb0,0x05080e,.35);s.add(this.ambient);
  this.lamp=new THREE.SpotLight(0xffe2b0,90,22,.55,.45,1.6);this.lamp.position.set(-1.5,6.5,2.5);this.lamp.target.position.set(0,0,0);s.add(this.lamp,this.lamp.target);
  this.screenLight=new THREE.PointLight(0x59d8ed,6,8,2);this.screenLight.position.set(2.6,2.2,-.6);s.add(this.screenLight);
  box(s,[30,.1,20],[0,-1.6,0],mat(0x0a1018,{roughness:.95}));box(s,[30,14,.2],[0,5,-6],mat(0x0d1622,{roughness:.9}));
  box(s,[9,.25,5],[0,-.12,0],mat(0x3a2a1c,{roughness:.6,metalness:.1}));for(const x of[-4.2,4.2])for(const z of[-2.2,2.2])box(s,[.25,1.5,.25],[x,-.9,z],mat(0x2a1e14));
  // lamp body
  box(s,[.5,.08,.5],[-3.4,.05,-1.4],mat(0x1c2633));box(s,[.07,2.4,.07],[-3.4,1.2,-1.4],mat(0x1c2633));const shade=new THREE.Mesh(new THREE.ConeGeometry(.55,.6,24,1,true),mat(0x24384c,{side:THREE.DoubleSide}));shade.position.set(-2.9,2.4,-1);shade.rotation.z=.6;s.add(shade);
  this.bulb=new THREE.Mesh(new THREE.SphereGeometry(.16,12,8),glow(0xffe2b0,1.4));this.bulb.position.set(-2.75,2.2,-.9);s.add(this.bulb);
  // case file: open folder with ticket page and clue cards
  box(s,[4.2,.03,2.9],[-.6,.02,.5],mat(0xb9853f,{roughness:.8}));
  this.page=dynamicTexture(1024,720);const pm=new THREE.Mesh(new THREE.PlaneGeometry(3.9,2.75),new THREE.MeshStandardMaterial({map:this.page.tex,roughness:.85}));pm.rotation.x=-Math.PI/2;pm.position.set(-.6,.045,.5);s.add(pm);
  // phone
  this.phone=new THREE.Group();this.phone.position.set(2.9,0,1.3);s.add(this.phone);box(this.phone,[1.3,.35,.9],[0,.18,0],mat(0x15191f,{roughness:.4}));box(this.phone,[1.4,.22,.3],[0,.48,-.1],mat(0x0f1217,{roughness:.4}));
  this.led=new THREE.Mesh(new THREE.SphereGeometry(.07,10,8),glow(P.timeout,1));this.led.position.set(.5,.37,.35);this.phone.add(this.led);
  // monitor with terminal
  box(s,[2.6,1.7,.2],[2.4,1.3,-1.2],mat(0x11161d,{roughness:.5}));box(s,[.3,.6,.3],[2.4,.3,-1.2],mat(0x11161d));
  this.term=dynamicTexture(1024,660);const tm=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.55),new THREE.MeshBasicMaterial({map:this.term.tex,toneMapped:false}));tm.position.set(2.4,1.3,-1.09);s.add(tm);
  // magnifier
  this.lens=new THREE.Group();s.add(this.lens);const rim=new THREE.Mesh(new THREE.TorusGeometry(.42,.05,10,40),mat(0x8a6a3a,{metalness:.8,roughness:.3}));rim.rotation.x=Math.PI/2;this.lens.add(rim);
  const glass=new THREE.Mesh(new THREE.CircleGeometry(.4,32),new THREE.MeshStandardMaterial({color:0x9fd8ff,transparent:true,opacity:.18,roughness:.05,metalness:.2}));glass.rotation.x=-Math.PI/2;this.lens.add(glass);
  const handle=box(this.lens,[.12,.12,.9],[0,0,.85],mat(0x2a1e14));handle.rotation.x=0;
  // mug from the cover
  const mug=new THREE.Mesh(new THREE.CylinderGeometry(.28,.25,.55,24),mat(0x1c3048));mug.position.set(-3.2,.28,1.4);s.add(mug);this.mugLabel=label(s,'TRUST THE PACKETS','',[-3.2,.95,1.4],1.2,'#9feaf6');
  // stamp: a slab that slams onto the file
  this.stampTex=dynamicTexture(1024,300);this.stamp=new THREE.Mesh(new THREE.PlaneGeometry(2.6,.76),new THREE.MeshBasicMaterial({map:this.stampTex.tex,transparent:true,toneMapped:false}));this.stamp.rotation.x=-Math.PI/2;s.add(this.stamp);
  // case board on the wall: cards and red strings to the DNS card
  this.board=new THREE.Group();this.board.position.set(-5.5,4.2,-5.8);s.add(this.board);box(this.board,[9,5,.12],[0,0,0],mat(0x5a4330,{roughness:.95}));
  const cards=[['#4040','network down',-3.4,1.6],['PING','clean',-1.2,1.8],['ROUTES','fine',1.0,1.7],['CABLE / PORT','ok',3.2,1.5],['TTL 86400','cache says yes',-3.3,-.4],['NXDOMAIN','resolver says no',3.3,-.3],['SPLIT BRAIN','internal ≠ external',-2.2,-1.8],['CNAME','dancing',2.4,-1.9],['PTR','reverse pain',.2,-2.0]];
  this.boardCards=cards.map(([a,b,x,y])=>{label(this.board,a,b,[x,y,.12],2.4,'#f2e6c8');return V([x,y,.13]);});
  const center=V([0,0,.13]);label(this.board,'DNS','it is always',[0,0,.14],2.2,'#ff4f6f');
  this.strings=this.boardCards.map(p=>line(this.board,[p,center],0xd02030,.9));
  // a second, cooler key light for the board
  this.boardLight=new THREE.SpotLight(0xffd9a8,40,14,.5,.6,1.5);this.boardLight.position.set(-5.5,7.5,-1);this.boardLight.target=this.board;s.add(this.boardLight);
 }
 update(t,a,tl,shot){
  const imp=tl.attack(t),bass=a.sub_20_60_drive??0,k=ticketAt(t),dark=(t>=BLACKOUT[0]&&t<BLACKOUT[1])||(t>=226.95&&t<228.3);
  this.lamp.intensity=dark?0:85+25*bass;setGlow(this.bulb.material,0xffe2b0,dark?.05:1.3);this.ambient.intensity=dark?.05:.35;this.boardLight.intensity=shot.camera==='board'?45:6;
  const ringing=RINGING.some(([a,b])=>t>=a&&t<b),blink=ringing?(Math.sin(t*22)>0?1:.1):.15;setGlow(this.led.material,P.timeout,blink*1.4);this.phone.rotation.z=ringing?.03*Math.sin(t*60):0;
  // case file page: ticket and the clue list
  const states=CLUES.map(c=>clueState(c,t)),closed=t>=k.closed;
  this.page.set(`${k.id}:${states.join()}:${closed}`,(g,w,h)=>{
   g.fillStyle='#ebe4d4';g.fillRect(0,0,w,h);g.fillStyle='#b9b1a0';for(let y=120;y<h;y+=44)g.fillRect(40,y,w-80,1);
   g.fillStyle='#2a2a2a';g.font='600 46px "Space Grotesk"';g.fillText(`CASE #${k.id}`,40,70);g.font='28px "JetBrains Mono"';g.fillText(`${k.text} · ${k.name}`,40,112);
   CLUES.forEach((c,i)=>{const st=c.id==='dns'&&k.id!==4040?(closed?'ok':'bad'):states[i],y=180+i*66;g.font='30px "JetBrains Mono"';g.fillStyle='#2a2a2a';g.fillText(c.label,110,y);
    g.font='600 40px "Space Grotesk"';g.fillStyle=st==='ok'?'#1d8a55':st==='bad'?'#c0185c':st==='suspect'?'#b07a00':'#9a9282';g.fillText(st==='ok'?'✓':st==='bad'?'✗':st==='suspect'?'?':'·',56,y+4);});
   if(closed){g.save();g.translate(w-260,h-140);g.rotate(-.12);g.strokeStyle='#1d8a55';g.lineWidth=6;g.strokeRect(-200,-60,400,110);g.fillStyle='#1d8a55';g.font='700 52px "Space Grotesk"';g.textAlign='center';g.fillText('CLOSED',0,12);g.restore();}
  });
  // terminal: the dig output of this moment, typed from the start of the shot
  const kind=DIG_FOR_MODE[shot.mode]||'nx',lines=digOutput(kind,t),chars=Math.floor(Math.max(0,t-shot.start)*110),typed=[];let n=chars;
  for(const l of lines){if(n<=0)break;typed.push(l.slice(0,n));n-=l.length+8;}
  this.term.set(`${kind}:${typed.length}:${typed.at(-1)?.length}`,(g,w,h)=>{g.fillStyle='#04090f';g.fillRect(0,0,w,h);g.fillStyle='#0d2236';g.fillRect(0,0,w,34);g.fillStyle='#8fb2c8';g.font='18px "JetBrains Mono"';g.fillText(`engineer@helpdesk: ~ · case #${k.id}`,14,23);
   monoLines(g,typed,{x:18,y:72,size:21,lh:1.28,colors:DIG_COLORS});});
  this.screenLight.intensity=dark?0:5+3*imp;
  // magnifier glides over the file towards the DNS line
  const lu=smooth(shot.start,shot.end,t);this.lens.position.set(lerp(-2.0,-1.5,lu)+.15*Math.sin(t*1.3),.55+.05*Math.sin(t*2.1),lerp(-.4,1.5,lu));
  // stamp slams down at the start of a stamp shot
  const st=STAMPS[shot.mode];this.stamp.visible=shot.camera==='stamp'&&!!st;
  if(st){const age=t-shot.start,slam=1-smooth(0,.14,age);this.stamp.position.set(-.4,.06+slam*1.2,.6);this.stamp.scale.setScalar(1+slam*.5);this.stamp.rotation.z=-.12;
   this.stampTex.set(st[0],(g,w,h)=>{g.clearRect(0,0,w,h);g.strokeStyle=st[1];g.lineWidth=14;g.strokeRect(12,12,w-24,h-24);g.fillStyle=st[1];g.font='700 128px "Space Grotesk"';g.textAlign='center';g.fillText(st[0],w/2,h/2+46);});}
  this.board.visible=(shot.camera==='board'||shot.camera==='lamp')&&!dark;this.mugLabel.visible=!dark;this.strings.forEach((s,i)=>{s.material.opacity=shot.camera==='board'?clamp((t-shot.start)*1.2-i*.25):.85;});
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),idx=+shot.id.slice(1),sign=idx%2?1:-1;
  const c=(pos,target,fov)=>({pos:V(pos),target:V(target),fov});
  switch(shot.camera){
   case'phone':return c([lerp(4.6,4.0,u),1.7,lerp(3.6,3.0,u)],[2.9,.35,1.3],42);
   case'file':return c([lerp(-1.4,.2,lin),lerp(3.2,2.8,u),2.6],[-.6,0,.4],46);
   case'monitor':return c([lerp(2.6,2.4,u)+.25*sign,1.5,lerp(2.3,1.9,u)],[2.4,1.3,-1.2],42);
   case'lens':return c([-1.2+.6*sign,1.9,lerp(2.6,2.2,u)],[-.9,0,.8],40);
   case'stamp':return c([-.3,3.0,1.9],[-.4,0,.55],44);
   case'lamp':return c([lerp(5.5,5,u),3.2,6],[0,.6,0],46);
   case'board':return c([lerp(-8.5,-2.5,lin),4.2,1.8],[lerp(-7,-4,lin),4.1,-5.8],48);
   default:return c([4,3,5],[0,.4,0],46);
  }
 }
}
