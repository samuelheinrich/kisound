// The office in Zürich on a bright afternoon: desk with the laptop H, a shelf with the desk switch, the home router G1
// (fibre to the wall outlet = the way out), the lab router G2 and the lab host X. All in one LAN 192.0.2.0/24 – this is
// where TTL 1 runs out (G1 answers 11/0) and where the redirect happens. Packets run as light along the real cables.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {PALETTE as P} from '../config.js';
import {V,glow,additive,setGlow,label,instanced,canvasTexture,cachedTexture,dynamicTexture,random} from '../world.js';
import {smooth,lerp,clamp} from '../timeline.js';
import {BY_ID,activeFlights,segAt,T,ADDR,routeX} from '../model.js';
import {drawDesktop} from './desktop.js';
const std=(color,o={})=>new THREE.MeshStandardMaterial({color,roughness:.6,metalness:.1,...o});
const add=(p,geo,m,pos,rot)=>{const x=new THREE.Mesh(geo,m);x.position.set(...pos);if(rot)x.rotation.set(...rot);p.add(x);return x;};
const rbox=(w,h,d,r=.008)=>new RoundedBoxGeometry(w,h,d,2,r);
// cables (polylines) and how logical hops run along them
const C={H_SW:[[-.02,.762,-1.55],[.45,.748,-1.82],[.62,.62,-2.08],[.62,.03,-2.12],[2.45,.03,-2.08],[2.54,.03,-1.3],[2.54,1.07,-1.3],[2.33,1.083,-1.3]],
 SW_G1:[[2.33,1.083,-1.36],[2.29,1.24,-1.42],[2.33,1.478,-1.42]],SW_G2:[[2.33,1.083,-1.24],[2.28,1.26,-1.0],[2.33,1.478,-.8]],G2_X:[[2.33,1.478,-.7],[2.29,1.34,-.56],[2.39,1.2,-.42]],
 G1_OUT:[[2.46,1.478,-1.46],[2.56,1.4,-1.72],[2.57,.42,-1.9]]};
const REV=p=>[...p].reverse(),ROUTE={'H>G1':[C.H_SW,C.SW_G1],'G1>H':[REV(C.SW_G1),REV(C.H_SW)],'H>G2':[C.H_SW,C.SW_G2],'G1>G2':[REV(C.SW_G1),C.SW_G2],'G2>X':[C.G2_X],'G1>R2':[C.G1_OUT],'R2>G1':[REV(C.G1_OUT)]};
function along(pts,u){const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(...pts[i].map((v,k)=>v-pts[i-1][k])));const s=clamp(u)*L.at(-1);let i=1;while(i<L.length-1&&L[i]<s)i++;const k=(s-L[i-1])/(L[i]-L[i-1]||1);return new THREE.Vector3(...pts[i-1].map((v,j)=>v+(pts[i][j]-v)*k));}
export function roomPos(f,t){const g=segAt(f,Math.min(t,f.t1)),r=ROUTE[`${g.a}>${g.b}`];if(!r)return null;const pts=r.flat();return along(pts,g.u);}
const view=()=>canvasTexture(2048,1024,(g,w,h)=>{const sky=g.createLinearGradient(0,0,0,h*.5);sky.addColorStop(0,'#6fa9de');sky.addColorStop(1,'#d9eaf5');g.fillStyle=sky;g.fillRect(0,0,w,h);
 for(let i=0;i<7;i++){g.fillStyle='rgba(255,255,255,.55)';const x=random(i*9)*w,y=h*(.08+.18*random(i*5));g.beginPath();g.ellipse(x,y,120+80*random(i),22,0,0,7);g.fill();}
 g.fillStyle='#aebfd1';g.beginPath();g.moveTo(0,h*.47);[[120,.4],[260,.44],[420,.33],[560,.41],[700,.36],[880,.43],[1040,.31],[1200,.4],[1360,.35],[1520,.42],[1700,.34],[1880,.41],[2048,.38]].forEach(([x,y])=>g.lineTo(x,h*y));g.lineTo(w,h*.5);g.lineTo(0,h*.5);g.fill();
 g.fillStyle='#f6f9fb';[[420,.33],[700,.36],[1040,.31],[1360,.35],[1700,.34]].forEach(([x,y])=>{g.beginPath();g.moveTo(x-55,h*(y+.035));g.lineTo(x,h*y);g.lineTo(x+55,h*(y+.035));g.fill();});
 g.fillStyle='#8aa69a';g.fillRect(0,h*.47,w,h*.04);const lake=g.createLinearGradient(0,h*.5,0,h*.66);lake.addColorStop(0,'#6f9fc4');lake.addColorStop(1,'#4f84ad');g.fillStyle=lake;g.fillRect(0,h*.5,w,h*.16);
 for(let i=0;i<80;i++){g.fillStyle='rgba(255,255,255,.4)';g.fillRect(random(i)*w,h*(.51+.14*random(i*3)),20+40*random(i*5),2);}
 for(let i=0;i<120;i++){const x=random(i*7)*w,bw=24+random(i*11)*46,bh=20+random(i*13)**2*90;const base=h*.92;g.fillStyle=['#d8cdbd','#e6dfd4','#b9c2c9','#c9b9a3','#f0ebe2'][i%5];g.fillRect(x,base-bh-random(i*17)*90,bw,bh+200);g.fillStyle='#9a5a44';g.fillRect(x-3,base-bh-random(i*17)*90-8,bw+6,10);}
 g.fillStyle='#7d8f7a';g.fillRect(0,h*.66,w,h*.04);for(const x of[640,1480]){g.fillStyle='#e9e2d6';g.fillRect(x,h*.56,16,h*.2);g.fillStyle='#4f6a5a';g.beginPath();g.moveTo(x-6,h*.56);g.lineTo(x+8,h*.47);g.lineTo(x+22,h*.56);g.fill();}});
const planks=()=>canvasTexture(1024,1024,(g,w,h)=>{for(let i=0;i<8;i++){g.fillStyle=['#b68c5e','#a8804f','#c09466','#b08657'][i%4];g.fillRect(0,i*128,w,128);for(let k=0;k<40;k++){g.fillStyle=`rgba(90,60,30,${.08*random(i*40+k)})`;g.fillRect(random(k*3+i)*w,i*128+random(k*7)*128,200,2);}g.fillStyle='rgba(60,40,20,.5)';g.fillRect(0,i*128,w,3);g.fillRect((i*317)%w,i*128,3,128);}});
const FOCUS={S041:'T-1',S043:'TE-1',S061:'RD-1',S063:'R-2',S080:'R-3',S058:'R-1',S024:'P-M1'};
export class RoomZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0xdfe9f2);
  s.add(new THREE.HemisphereLight(0xf2f7ff,0xa08a70,1.5));const sun=new THREE.DirectionalLight(0xfff1dc,2.2);sun.position.set(-1.5,3.5,-6);s.add(sun);const fill=new THREE.DirectionalLight(0xdbe8ff,.6);fill.position.set(2,3,4);s.add(fill);
  const fl=planks();fl.wrapS=fl.wrapT=THREE.RepeatWrapping;fl.repeat.set(3,3);add(s,new THREE.PlaneGeometry(5.2,4.4),std(0xffffff,{map:fl,roughness:.55}),[0,0,0],[-Math.PI/2,0,0]);
  const wall=std(0xeef0ee,{roughness:.9});add(s,new THREE.PlaneGeometry(5.2,2.8),wall,[0,1.4,2.2],[0,Math.PI,0]);add(s,new THREE.PlaneGeometry(4.4,2.8),wall,[-2.6,1.4,0],[0,Math.PI/2,0]);add(s,new THREE.PlaneGeometry(4.4,2.8),wall,[2.6,1.4,0],[0,-Math.PI/2,0]);add(s,new THREE.PlaneGeometry(5.2,4.4),std(0xffffff,{roughness:.95}),[0,2.8,0],[Math.PI/2,0,0]);
  // window wall: parapet, frame, glass, the view over the lake to the Alps
  add(s,new THREE.PlaneGeometry(5.2,.8),wall,[0,.4,-2.2]);add(s,new THREE.PlaneGeometry(5.2,.4),wall,[0,2.6,-2.2]);for(const x of[-2.35,2.35])add(s,new THREE.PlaneGeometry(.5,1.6),wall,[x,1.6,-2.2]);
  const fr=std(0x3a4048,{metalness:.5,roughness:.4});for(const x of[-2.1,-.7,.7,2.1])add(s,new THREE.BoxGeometry(.06,1.6,.08),fr,[x,1.6,-2.2]);add(s,new THREE.BoxGeometry(4.3,.07,.1),fr,[0,.8,-2.2]);add(s,new THREE.BoxGeometry(4.3,.07,.1),fr,[0,2.4,-2.2]);add(s,new THREE.BoxGeometry(4.4,.04,.3),std(0xd9dcde),[0,.8,-2.06]);
  add(s,new THREE.PlaneGeometry(26,13),new THREE.MeshBasicMaterial({map:view()}),[0,1.4,-11]);
  // desk, chair, lamp, plant, mug, poster
  const oak=std(0xc9a273,{roughness:.5});add(s,rbox(1.6,.04,.8,.01),oak,[-.2,.72,-1.55]);for(const x of[-.95,.55])for(const z of[-1.9,-1.2])add(s,new THREE.CylinderGeometry(.02,.02,.7,10),std(0x4a4f56,{metalness:.7}),[x,.35,z]);
  const chair=new THREE.Group();chair.position.set(-.2,0,-.62);chair.rotation.y=.15;s.add(chair);add(chair,rbox(.48,.07,.46,.03),std(0x2d3a4c,{roughness:.8}),[0,.47,0]);add(chair,rbox(.46,.55,.06,.03),std(0x2d3a4c,{roughness:.8}),[0,.8,.24],[-.12,0,0]);add(chair,new THREE.CylinderGeometry(.03,.03,.42,8),std(0x5a6068,{metalness:.7}),[0,.23,0]);
  add(s,new THREE.CylinderGeometry(.07,.09,.02,16),std(0x2b2f35),[-.82,.75,-1.82]);add(s,new THREE.CylinderGeometry(.008,.008,.45,8),std(0x2b2f35),[-.82,.97,-1.82]);add(s,new THREE.ConeGeometry(.09,.12,16,1,true),std(0xf4f4f0,{side:THREE.DoubleSide}),[-.78,1.18,-1.76],[.5,0,0]);
  add(s,new THREE.CylinderGeometry(.14,.11,.3,16),std(0xd9d2c4),[-2.25,.15,-1.75]);for(let i=0;i<9;i++)add(s,new THREE.ConeGeometry(.08,.55,8),std(0x4f8a4f),[-2.25+.12*Math.cos(i*.7),.55,-1.75+.12*Math.sin(i*.7)],[.25*Math.sin(i*1.3),0,.25*Math.cos(i*1.1)]);
  add(s,new THREE.CylinderGeometry(.04,.035,.1,16),std(0xf2f2f2),[.32,.79,-1.45]);
  const poster=canvasTexture(512,700,(g,w,h)=>{g.fillStyle='#f6f4ef';g.fillRect(0,0,w,h);g.font='600 40px "Space Grotesk"';g.fillStyle='#1d2a38';g.fillText('ICMP Type/Code',60,80);g.strokeStyle='#2f6db3';g.lineWidth=6;const nodes=[[90,330],[200,240],[330,280],[430,150]];g.beginPath();nodes.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();nodes.forEach(([x,y])=>{g.fillStyle='#ff9a3c';g.beginPath();g.arc(x,y,16,0,7);g.fill();});
   g.font='26px "JetBrains Mono"';['0  Echo Reply','3  Dest. Unreachable','5  Redirect','8  Echo Request','11 Time Exceeded'].forEach((l,i)=>g.fillText(l,60,430+i*48));});
  add(s,new THREE.PlaneGeometry(.6,.82),std(0xffffff,{map:poster}),[-2.59,1.6,-.6],[0,Math.PI/2,0]);
  // the laptop H, its screen shows the real desktop
  const lap=new THREE.Group();lap.position.set(-.2,.745,-1.55);s.add(lap);const alu=std(0xb3bcc6,{metalness:.7,roughness:.32});add(lap,rbox(.34,.016,.24,.004),alu,[0,0,0]);add(lap,new THREE.PlaneGeometry(.29,.11),std(0x23272d),[0,.0085,.03],[-Math.PI/2,0,0]);
  const lid=new THREE.Group();lid.position.set(0,.008,-.12);lid.rotation.x=-.3;lap.add(lid);add(lid,rbox(.34,.22,.01,.004),alu,[0,.11,-.005]);this.screen=dynamicTexture(1024,576);add(lid,new THREE.PlaneGeometry(.31,.175),new THREE.MeshBasicMaterial({map:this.screen.tex,toneMapped:false}),[0,.112,.0006]);
  label(s,'Laptop H · Zürich',`${ADDR.H}/24`,[-.2,1.12,-1.5],.38,'#1d3a56');
  // shelf with the switch, G1, G2 and X
  const board=std(0xe8e3da,{roughness:.7});for(const y of[1.05,1.45])add(s,new THREE.BoxGeometry(.38,.025,1.9),board,[2.41,y,-.7]);
  add(s,rbox(.28,.04,.15,.006),std(0x2b2f35,{metalness:.4}),[2.42,1.083,-1.3]);for(let i=0;i<8;i++)add(s,new THREE.BoxGeometry(.004,.012,.014),std(0x0b0d10),[2.28,1.083,-1.36+i*.017]);this.swLed=add(s,new THREE.BoxGeometry(.004,.004,.01),glow(P.ok,1.2),[2.279,1.096,-1.2]);
  add(s,rbox(.24,.05,.17,.012),std(0xf4f5f6,{roughness:.35}),[2.42,1.488,-1.35]);for(const z of[-1.42,-1.28])add(s,new THREE.CylinderGeometry(.007,.007,.18,8),std(0xf4f5f6),[2.5,1.6,z],[0,0,-.15]);this.g1Led=add(s,new THREE.BoxGeometry(.004,.006,.08),glow(0x7fc4ff,1.2),[2.299,1.49,-1.35]);
  add(s,rbox(.22,.045,.16,.006),std(0x1d2126,{metalness:.5}),[2.42,1.485,-.78]);this.g2Led=add(s,new THREE.BoxGeometry(.004,.006,.04),glow(P.ok,.8),[2.309,1.49,-.78]);
  add(s,rbox(.11,.15,.18,.01),std(0x3a3f46,{metalness:.4}),[2.45,1.14,-.42]);add(s,new THREE.BoxGeometry(.04,.04,.02),std(0xf0f0f0),[2.57,.42,-1.9]);
  label(s,'Switch','LAN 192.0.2.0/24',[2.3,1.17,-1.3],.3,'#1d3a56');label(s,'G1 · Heimrouter',`${ADDR.G1} · Glasfaser → Internet`,[2.3,1.72,-1.38],.42,'#1d3a56');label(s,'G2 · Labor-Router',ADDR.G2,[2.3,1.6,-.78],.34,'#1d3a56');label(s,'Labor-Host X',ADDR.X,[2.32,1.3,-.42],.3,'#1d3a56');
  // cables
  const cable=(pts,col,r)=>add(s,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)),false,'centripetal'),80,r,6,false),std(col,{roughness:.5}),[0,0,0]);
  cable(C.H_SW,0x2f7fd8,.004);cable(C.SW_G1,0x8d97a1,.004);cable(C.SW_G2,0x8d97a1,.004);cable(C.G2_X,0x8d97a1,.004);cable(C.G1_OUT,0xf2c12e,.003);
  this.pulse=instanced(s,new THREE.SphereGeometry(.02,10,8),glow(0xffffff),24);this.trail=instanced(s,new THREE.SphereGeometry(.013,6,4),additive(0xffffff),200);this.bits=instanced(s,new THREE.SphereGeometry(.006,6,4),additive(0xffffff),60);this.tags=Array.from({length:2},()=>label(s,'','',[0,0,0],.7,'#1d3a56'));
 }
 update(t,a,tl,shot){
  this.screen.set(String(Math.floor(t*4)),g=>drawDesktop(g,1024,576,t));setGlow(this.g2Led.material,P.ok,t>=T.validated?1.6:.8);setGlow(this.swLed.material,P.ok,Math.floor(t*7)%3?1.4:.4);
  this.pulse.begin();this.trail.begin();this.bits.begin();const tags=[],want=FOCUS[shot.id];
  for(const f of activeFlights(t)){const p=roomPos(f,t);if(!p)continue;const done=t>f.t1;
   if(done){if(f.fate==='expire'||f.fate==='drop'){const d=t-f.t1;for(let i=0;i<10;i++)this.bits.push(p.clone().add(new THREE.Vector3(random(i+f.t0)-.5,random(i*3)-.2,random(i*5+f.t0)-.5).multiplyScalar(.12*d)),0x7f8c99,1,null,1.4*(1-d));}continue;}
   const icmp=f.kind==='icmp';this.pulse.push(p,icmp?P.icmp:P.data,icmp?1.3:1,null,1.8);for(let k=1;k<=10;k++){const q=roomPos(f,t-k*.03);if(!q||t-k*.03<f.t0)break;this.trail.push(q,icmp?P.icmp:P.data,1-k/12,null,.7*(1-k/11));}
   if((want?f.id===want:true)&&tags.length<2)tags.push({f,p});}
  this.pulse.end();this.trail.end();this.bits.end();
  this.tags.forEach((tag,i)=>{const x=tags[i];tag.userData.alpha=x?1:0;if(x){tag.position.copy(x.p).add(new THREE.Vector3(-.12,.13,0));tag.material.map=cachedTexture(`${x.f.id} · ${x.f.hdr}`,`${x.f.src} → ${x.f.dst}${x.f.ttl?' · TTL '+x.f.ttl:''}`,x.f.kind==='icmp'?'#ffffff':'#bff1ff');}});
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),e=u*u*(3-2*u),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),m=shot.mode,k=+shot.id.slice(1);
  switch(m){
   case'push':return look([lerp(-.1,-.2,e),lerp(1.45,1.0,e),lerp(1.6,-1.2,e)],[-.2,lerp(.95,.9,e),-1.62],lerp(50,32,e));
   case'shelf':switch(k%3){case 0:return look([lerp(1.0,1.15,u),lerp(1.6,1.52,u),lerp(.15,-.05,u)],[2.4,1.28,-.92],38);case 1:return look([lerp(1.75,1.85,u),lerp(1.62,1.58,u),lerp(-1.0,-1.1,u)],[2.42,1.47,lerp(-1.25,-.85,u)],36);default:return look([lerp(1.5,1.6,u),lerp(.95,1.0,u),lerp(-.1,-.25,u)],[2.4,1.3,-1.0],46);}
   case'desk':return look([lerp(.7,.55,u),1.15,lerp(-.9,-.95,u)],[.6,.6,-1.85],48);
   case'wide':return look([lerp(-1.9,-1.6,u),1.65,lerp(1.7,1.5,u)],[.6,.95,-1.2],54);
   case'pull':return look([lerp(-.2,-.1,e),lerp(1.0,1.5,e),lerp(-1.1,1.8,e)],[lerp(-.2,0,e),lerp(.9,1.7,e),lerp(-1.6,-6,e)],lerp(34,50,e));
   default:return look([0,1.5,1.5],[0,1,-1.5],50);
  }
 }
}
