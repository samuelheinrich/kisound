// Three delivery models side by side, each a small self-contained network. Times are anchored to
// the verse lines; the arena model is not involved here.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,ring,curveTube,baseScene,label,polarFloor,routerObject,seatGeometry,sourceServer,instanced,orient} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
export const COMPARE={unicast:{start:38.28},anycast:{start:45.52},multicast:{start:51.36,join:54.1}};
const SPEED=7,SPACING=.7;
function arc(a,b,lift=.8,bow=0){
 const len=Math.hypot(b[0]-a[0],b[2]-a[2]),dx=(b[0]-a[0])/len,dz=(b[2]-a[2])/len,c=[(a[0]+b[0])/2-dz*bow,(a[1]+b[1])/2+lift,(a[2]+b[2])/2+dx*bow],pts=[],cum=[0];
 for(let i=0;i<=32;i++){const s=i/32,u=1-s;pts.push([0,1,2].map(j=>u*u*a[j]+2*u*s*c[j]+s*s*b[j]));if(i)cum.push(cum[i-1]+Math.hypot(...[0,1,2].map(j=>pts[i][j]-pts[i-1][j])));}
 return{pts,cum,length:cum[32]};
}
function chain(...parts){const pts=[],cum=[];let off=0;parts.forEach((p,i)=>{p.pts.forEach((x,k)=>{if(i&&!k)return;pts.push(x);cum.push(off+p.cum[k]);});off+=p.length;});return{pts,cum,length:off};}
function at(c,d){d=clamp(d,0,c.length);let lo=0,hi=c.cum.length-1;while(hi-lo>1){const m=(lo+hi)>>1;if(c.cum[m]<=d)lo=m;else hi=m;}const f=(d-c.cum[lo])/((c.cum[hi]-c.cum[lo])||1);return V(c.pts[lo].map((v,j)=>v+(c.pts[hi][j]-v)*f));}
const HOSTS=[[7.5,1.25,-4.6],[7.5,1.25,-1.55],[7.5,1.25,1.55],[7.5,1.25,4.6]];
const SRC=[-9,1.05,0],RTR=[-.5,.65,0];
export class CompareZone{
 constructor(){
  const s=this.scene=baseScene(.02);polarFloor(s,{radius:22,step:2,spokes:15,arc:[-180,180]});
  this.groups={unicast:new THREE.Group(),anycast:new THREE.Group(),multicast:new THREE.Group(),shared:new THREE.Group()};Object.values(this.groups).forEach(g=>s.add(g));
  const sh=this.groups.shared;this.src=sourceServer(sh,SRC,1.4);label(sh,'SOURCE','10.0.0.1',[SRC[0],2.5,SRC[2]],2.6,'#ffc58f');
  this.router=routerObject(sh,RTR,P.blue,.9);label(sh,'ROUTER','',[RTR[0],1.75,RTR[2]],1.8);
  const seat=seatGeometry(),seatMat=mat(0x1a3048,{roughness:.6});
  this.hosts=HOSTS.map((h,i)=>{const m=new THREE.Mesh(seat,seatMat);m.position.set(h[0],h[1]-1.25,h[2]);m.rotation.y=-Math.PI/2;sh.add(m);const node=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,1),glow(P.blue,.4));node.position.set(...h);sh.add(node);label(sh,`10.1.1.${11+i}`,'',[h[0]+.2,h[1]+.75,h[2]],1.7);return{node,ring:(()=>{const r=ring(sh,.8,[h[0],h[1]-1.2,h[2]],additive(P.emerald,0),.035);r.rotation.x=Math.PI/2;return r;})()};});
  const base=mat(0x18324c,{roughness:.7});
  // Unicast: three separate copies share the source link, one per receiver.
  this.uni=[0,1,2].map(i=>{const off=(i-1)*.32,c=chain(arc([SRC[0]+.8,SRC[1],SRC[2]+off],[RTR[0],RTR[1]+.2,RTR[2]+off],.5),arc([RTR[0],RTR[1]+.2,RTR[2]+off],HOSTS[i],.7));curveTube(this.groups.unicast,c.pts.filter((_,k)=>k%3===0),base,.03,40);return c;});
  label(this.groups.unicast,'UNICAST','ONE COPY PER RECEIVER',[0,5.2,-6.5],4.4,'#ffc58f');
  // Anycast: one address on three servers; each client reaches the closest instance.
  const any=this.groups.anycast;this.anyServers=[[-6,1.05,-7.5],[-10,1.05,1.5],[-4,1.05,8]].map((p,i)=>{const o=sourceServer(any,p,1.15);label(any,'192.0.2.53',`INSTANCE ${'ABC'[i]}`,[p[0],2.3,p[2]],2.5,'#9feaf6');return o;});
  this.anyRouters=[[0,.6,-4],[0,.6,4]].map(p=>routerObject(any,p,P.blue,.75));
  this.anyClients=[[7.5,1.25,-3.4],[7.5,1.25,4.2]].map((h,i)=>{const m=new THREE.Mesh(seat,seatMat);m.position.set(h[0],h[1]-1.25,h[2]);m.rotation.y=-Math.PI/2;any.add(m);const node=new THREE.Mesh(new THREE.IcosahedronGeometry(.22,1),glow(P.cyan,1));node.position.set(...h);any.add(node);label(any,`CLIENT ${i+1}`,'',[h[0],h[1]+.75,h[2]],1.7);return h;});
  this.anyPaths=[chain(arc(this.anyServers[0].root.position.toArray(),[0,.85,-4],.4),arc([0,.85,-4],this.anyClients[0],.5)),chain(arc(this.anyServers[2].root.position.toArray(),[0,.85,4],.4),arc([0,.85,4],this.anyClients[1],.5))];
  this.anyIdle=[arc([-10,1.05,1.5],[0,.85,-4],.6),arc([-10,1.05,1.5],[0,.85,4],.6)];
  this.anyPaths.forEach(c=>curveTube(any,c.pts.filter((_,k)=>k%3===0),base,.03,40));this.anyIdle.forEach(c=>curveTube(any,c.pts.filter((_,k)=>k%4===0),mat(0x12233a),.02,24));
  label(any,'metric 2','nearest',[-3,1.9,-6],1.6,'#9feaf6');label(any,'metric 2','nearest',[-2,1.9,6.3],1.6,'#9feaf6');label(any,'metric 5','not chosen',[-5.5,1.9,.6],1.6,'#6f8aa0');
  label(any,'ANYCAST','SAME ADDRESS / CLOSEST INSTANCE',[0,5.2,-6.5],4.4,'#9feaf6');
  // Multicast: one copy on the source link, replicated at the router for joined receivers only.
  this.trunk=arc([SRC[0]+.8,SRC[1],SRC[2]],[RTR[0],RTR[1]+.2,RTR[2]],.5);curveTube(this.groups.multicast,this.trunk.pts.filter((_,k)=>k%3===0),base,.05,40);
  this.leaves=HOSTS.map(h=>{const c=arc([RTR[0],RTR[1]+.2,RTR[2]],h,.7);curveTube(this.groups.multicast,c.pts.filter((_,k)=>k%3===0),base,.03,40);return c;});
  label(this.groups.multicast,'MULTICAST','ONE COPY / REPLICATED WHERE NEEDED',[0,5.2,-6.5],4.4,'#8ff0c4');
  this.packets=instanced(s,new THREE.BoxGeometry(.09,.09,.36),additive(0xffffff),500);this.reports=instanced(s,new THREE.OctahedronGeometry(.24),glow(0xffffff),8);
  this.q=new THREE.Quaternion();
 }
 // Packets every SPACING along a path, appearing from its start once it begins to carry traffic.
 stream(c,t,t0,offset=0,col=P.orange,strength=1.3){
  if(t<t0)return;const reach=(t-t0)*SPEED,phase=((t*SPEED+offset)%SPACING+SPACING)%SPACING;
  for(let d=phase;d<Math.min(c.length,reach);d+=SPACING){const p=at(c,d);this.packets.push(p,col,1,orient(this.q,p,at(c,d+.2)),strength);}
 }
 update(t,a,tl,shot){
  const m=shot.mode,imp=tl.attack(t),bass=a.sub_20_60_drive??0;
  for(const k of['unicast','anycast','multicast'])this.groups[k].visible=k===m;this.groups.shared.visible=m!=='anycast';
  this.src.edgeMat.color.setHex(P.orange).multiplyScalar(.8+.4*bass);setGlow(this.router.ringMat,P.orange,.7+.5*imp);
  this.packets.begin();this.reports.begin();
  const joined=i=>m==='unicast'?i<3:m==='multicast'?i<2||i===2&&t>=COMPARE.multicast.join+.6:false;
  this.hosts.forEach((h,i)=>{const on=joined(i);setGlow(h.node.material,on?P.emerald:P.blue,on?1.2:.3);setGlow(h.ring.material,P.emerald,on?.5+.3*bass:0);});
  if(m==='unicast'){const t0=COMPARE.unicast.start;this.uni.forEach((c,i)=>this.stream(c,t,t0+i*.18,i*.23,[P.orange,0xffc070,P.warm][i]));}
  if(m==='anycast'){const t0=COMPARE.anycast.start;this.anyPaths.forEach((c,i)=>this.stream(c,t,t0+i*.9,i*.31,P.orange));this.anyServers.forEach((o,i)=>o.edgeMat.color.setHex(i===1?P.steel:P.cyan).multiplyScalar(i===1?.6:1+.3*bass));}
  if(m==='multicast'){
   const t0=COMPARE.multicast.start,j=COMPARE.multicast.join,trunkTime=this.trunk.length/SPEED;this.stream(this.trunk,t,t0,0,P.orange,1.5);
   this.leaves.forEach((c,i)=>{if(i<2)this.stream(c,t,t0+trunkTime,this.trunk.length,P.orange);else if(i===2)this.stream(c,t,Math.max(t0+trunkTime,j+.6),this.trunk.length,P.orange);});
   if(t>=j&&t<j+.6){const p=at(this.leaves[2],this.leaves[2].length*(1-(t-j)/.6));this.reports.push(p,P.emerald,1,null,1.6);}
  }
  this.packets.end();this.reports.end();
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start));let pos,target,fov=46;
  switch(shot.camera){
   case'source':pos=V([lerp(-7.5,-6,u),3.6,lerp(7.5,6.6,u)]);target=V([-5.5,1,0]);fov=50;break;
   case'path':pos=V([lerp(9,6,u),5,lerp(-10,-8,u)]);target=V([0,1,-2]);fov=50;break;
   case'branch':pos=V([lerp(1.5,3,u),3.6,lerp(7,6,u)]);target=V([2.5,1,0]);fov=52;break;
   default:pos=V([lerp(-3,1,lin),lerp(9.5,9,u),lerp(15,14.2,u)]);target=V([-1,.6,0]);fov=50;
  }
  return{pos,target,fov};
 }
}
