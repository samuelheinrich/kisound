// Close-up of the focus access segment under its querier. It reads the stadium model, so the
// ports, reports and queries shown here are exactly the ones of that segment in the wide shots.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,ring,curveTube,baseScene,label,polarFloor,routerObject,switchObject,seatGeometry,instanced,orient,portX} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {SEGMENTS,EDGES,within,activeMessages,membershipPhase,LMQ,FOCUS} from '../model.js';
import {KIND_COLOR} from './arena.js';
export const SEG=FOCUS;
const seg=SEGMENTS[SEG],SPEED=6,SPACING=.55;
const SWITCH=[0,1.5,0],ROUTER=[0,4.4,-6.2];
const deg=Math.PI/180;
function arc(a,b,lift){const c=[(a[0]+b[0])/2,(a[1]+b[1])/2+lift,(a[2]+b[2])/2],pts=[],cum=[0];for(let i=0;i<=32;i++){const s=i/32,u=1-s;pts.push([0,1,2].map(j=>u*u*a[j]+2*u*s*c[j]+s*s*b[j]));if(i)cum.push(cum[i-1]+Math.hypot(...[0,1,2].map(j=>pts[i][j]-pts[i-1][j])));}return{pts,cum,length:cum[32]};}
function at(c,d){d=clamp(d,0,c.length);let lo=0,hi=32;while(hi-lo>1){const m=(lo+hi)>>1;if(c.cum[m]<=d)lo=m;else hi=m;}const f=(d-c.cum[lo])/((c.cum[hi]-c.cum[lo])||1);return V(c.pts[lo].map((v,j)=>v+(c.pts[hi][j]-v)*f));}
const N=seg.seats.length;
export const HOST_POS=seg.seats.map((_,k)=>{const a=(-60+120*k/(N-1))*deg;return[9*Math.sin(a),1.35,9*Math.cos(a)-1];});
export class SegmentZone{
 constructor(){
  const s=this.scene=baseScene(.022);polarFloor(s,{radius:20,step:1.6,spokes:12,arc:[-180,180]});
  this.sw=switchObject(s,SWITCH,0,N);this.sw.root.scale.setScalar(2);box(s,[.5,SWITCH[1]-.3,.5],[0,(SWITCH[1]-.3)/2,0],mat(0x0f2135));
  label(s,`${seg.switch} · IGMP SNOOPING`,`VLAN ${seg.vlan} · ${seg.subnet}`,[-2.2,3.4,-1.6],3.4,'#cfe6f2');
  this.router=routerObject(s,ROUTER,P.blue,1.3);label(s,`${seg.router} · QUERIER`,`Vlan${seg.vlan} 10.1.${seg.index+1}.1`,[ROUTER[0],ROUTER[1]+1.9,ROUTER[2]],3.4,'#d4c6ff');
  const ped=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,ROUTER[1]-.45,16),mat(0x0f2135));ped.position.set(ROUTER[0],(ROUTER[1]-.45)/2,ROUTER[2]);s.add(ped);
  const base=mat(0x18324c,{roughness:.7});
  this.uplink=arc([ROUTER[0],ROUTER[1]-.1,ROUTER[2]+1],[this.sw.width-.6,SWITCH[1],-1.05],.6);curveTube(s,this.uplink.pts.filter((_,k)=>k%2===0),base,.05,32);
  this.upGlow=additive(P.orange,0);curveTube(s,this.uplink.pts.filter((_,k)=>k%2===0),this.upGlow,.1,32);
  const seatG=seatGeometry(),seatMat=mat(0x1a3048,{roughness:.6});
  this.hosts=seg.seats.map((h,k)=>{
   const p=HOST_POS[k],m=new THREE.Mesh(seatG,seatMat.clone());m.position.set(p[0],p[1]-1.25,p[2]);m.rotation.y=Math.atan2(p[0],p[2]+1);s.add(m);
   const node=new THREE.Mesh(new THREE.IcosahedronGeometry(.26,1),glow(P.blue,.4));node.position.set(...p);s.add(node);
   const r=ring(s,.85,[p[0],p[1]-1.2,p[2]],additive(P.emerald,0),.04);r.rotation.x=Math.PI/2;
   const port=[2*portX(k,N),SWITCH[1],1.06],cable=arc(port,p,.9);curveTube(s,cable.pts.filter((_,i)=>i%2===0),base,.025,32);const cg=additive(P.orange,0);curveTube(s,cable.pts.filter((_,i)=>i%2===0),cg,.06,32);
   label(s,h.ip,h.port,[p[0],p[1]+.85,p[2]],2.1);return{h,node,ring:r,cable,cableGlow:cg,seat:m};
  });
  this.packets=instanced(s,new THREE.BoxGeometry(.08,.08,.3),additive(0xffffff),600);this.messages=instanced(s,new THREE.OctahedronGeometry(.3),glow(0xffffff),40);
  this.q=new THREE.Quaternion();
 }
 // Without IGMP snooping the switch floods the group to every port of the VLAN (comparison in the bridge).
 flooding(shot){return shot.mode==='flood';}
 portOn(k,t,shot){return this.flooding(shot)||within(EDGES[`${seg.switch}>${seg.seats[k].id}`].on,t);}
 stream(c,t,on,col,strength){const phase=((t*SPEED)%SPACING+SPACING)%SPACING;for(let d=phase;d<c.length;d+=SPACING){if(!on(t-d/SPEED))continue;const p=at(c,d);this.packets.push(p,col,1,orient(this.q,p,at(c,d+.15)),strength);}}
 update(t,a,tl,shot){
  const imp=tl.attack(t),bass=a.sub_20_60_drive??0,flood=this.flooding(shot),upOn=x=>within(EDGES[`${seg.router}>${seg.switch}`].on,x)||flood;
  setGlow(this.router.ringMat,upOn(t)?P.orange:P.blue,.8+.5*imp);setGlow(this.upGlow,P.orange,upOn(t)?.35+.2*bass:0);
  this.packets.begin();this.messages.begin();
  this.stream(this.uplink,t,upOn,P.orange,1.4);
  const upTime=this.uplink.length/SPEED;
  this.hosts.forEach((x,k)=>{
   const ph=membershipPhase(x.h,t),port=this.portOn(k,t,shot),unwanted=flood&&!ph.member;
   setGlow(this.sw.leds[k].material,unwanted?P.red:port?P.emerald:P.steel,port?1.2:.9);
   this.stream(x.cable,t,s=>upOn(s-upTime)&&(flood||within(EDGES[`${seg.switch}>${x.h.id}`].on,s)),unwanted?P.red:P.orange,unwanted?1:1.4);
   setGlow(x.cableGlow,unwanted?P.red:P.orange,port&&upOn(t)?.22+.12*bass:0);
   const leaving=!ph.member&&ph.leaveAge<LMQ+.6;
   setGlow(x.node.material,leaving?P.red:ph.listening?P.emerald:ph.member?P.emerald:unwanted?P.red:P.blue,ph.listening?1.2+.3*imp:ph.member?.6:unwanted?.7:.3);
   setGlow(x.ring.material,P.emerald,ph.listening?.5+.3*bass:ph.joinAge<1.5?1-ph.joinAge/1.5:0);
   x.seat.material.color.setHex(ph.listening?0x1d5a4a:ph.member?0x1b4a44:0x1a3048);
  });
  setGlow(this.sw.uplink.material,upOn(t)?P.orange:P.blue,1);
  // Control messages of this segment, mapped from the arena edges onto the local cables.
  for(const m of activeMessages(t,.2)){
   let c;if(m.edge===`${seg.router}>${seg.switch}`)c=this.uplink;else{const k=seg.seats.findIndex(h=>m.edge===`${seg.switch}>${h.id}`);if(k<0)continue;c=this.hosts[k].cable;}
   const f=clamp((t-m.t0)/(m.t1-m.t0)),p=at(c,c.length*(m.reverse?1-f:f));this.messages.push(p,KIND_COLOR[m.kind],t>m.t1?1-(t-m.t1)/.2:1,null,1.6);
  }
  this.packets.end();this.messages.end();
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start));let pos,target,fov=46;
  switch(shot.camera){
   case'host':{const p=V(HOST_POS[+shot.target]),d=V([p.x,0,p.z+1]).normalize(),side=V([d.z,0,-d.x]);pos=p.clone().add(d.multiplyScalar(lerp(4.2,3.4,u))).add(side.multiplyScalar(1.6)).add(V([0,1.5,0]));target=V([p.x*.45,1.3,p.z*.4]);fov=50;break;}
   case'switch':pos=V([lerp(-1.4,1.4,lin),lerp(3.6,3.1,u),lerp(7,6,u)]);target=V([0,1.6,-.5]);fov=48;break;
   case'ports':pos=V([lerp(-2.8,2.8,lin),3.4,5.6]);target=V([lerp(-1,1,lin),1.3,.6]);fov=46;break;
   case'uplink':pos=V([lerp(5.6,5,u),2.6,lerp(6.5,5.8,u)]);target=V([0,lerp(2.4,3,u),-3.2]);fov=54;break;
   default:pos=V([lerp(-3,3,lin),lerp(8,7.2,u),lerp(13.5,12.5,u)]);target=V([0,1.5,1.5]);fov=50;
  }
  return{pos,target,fov};
 }
}
