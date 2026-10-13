import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,baseScene,floor,box,mat,glow,line,tube,label,switchObject,hostObject,colorFor,travel} from '../world.js';
import {clamp,smooth} from '../timeline.js';
import {DEVICES,HOSTS,LINKS,networkState,arpState,flowMember} from '../protocol-model.js';
const point=id=>DEVICES.find(d=>d.id===id).pos;
const hostPos=h=>[h.pos[0],h.vlan===3?-2:0,h.pos[2]];
const pathFor=v=>v===3?[hostPos(HOSTS[3]),[-4,-2,0],[3,-2,-4],hostPos(HOSTS[4])]:[hostPos(HOSTS[0]),point('SW-01'),point('SW-02'),hostPos(HOSTS[1])];
export class TopologyZone{
 constructor(){
  this.scene=baseScene();floor(this.scene,38,-3.3);this.root=new THREE.Group();this.scene.add(this.root);
  this.switches=DEVICES.map(d=>switchObject(this.root,d.id,d.pos));this.hosts=HOSTS.map(h=>hostObject(this.root,h.id,hostPos(h),h.vlan));
  this.edges=LINKS.map(l=>({id:l.id,...tube(this.root,[point(l.a),point(l.b)],P.cyan,.025)}));
  this.access=HOSTS.map(h=>tube(this.root,[hostPos(h),[h.pos[0],h.vlan===3?-2:0,0],[point(h.sw)[0],h.vlan===3?-2:0,point(h.sw)[2]]],colorFor(h.vlan),.019));
  this.planes=[];for(const [v,y] of [[10,-.42],[3,-2.42]]){const m=box(this.root,[23,.035,16],[0,y,0],new THREE.MeshBasicMaterial({color:colorFor(v),transparent:true,opacity:.055,depthWrite:false}));this.planes.push(m);const border=line(this.root,[[-11.5,y,-8],[11.5,y,-8],[11.5,y,8],[-11.5,y,8],[-11.5,y,-8]],colorFor(v),.30);label(this.root,`VLAN ${v}`,'BROADCAST DOMAIN',[-6,y+.05,v===10?7:-7],4,v===10?'#59d8ed':'#b39bff');}
  this.osi=new THREE.Group();this.root.add(this.osi);for(const [y,col,title,sub]of[[-2.8,P.blue,'L1 / PHYSICAL','SIGNAL'],[.6,P.cyan,'L2 / DATA LINK','MAC · VLAN · SWITCHING'],[4.1,P.blue,'L3 / NETWORK','ROUTED PATH']]){box(this.osi,[20,.04,13],[0,y,0],new THREE.MeshBasicMaterial({color:col,transparent:true,opacity:.08,depthWrite:false}));line(this.osi,[[-10,y,-6.5],[10,y,-6.5],[10,y,6.5],[-10,y,6.5],[-10,y,-6.5]],col,.5);label(this.osi,title,sub,[0,y+1.25,5.9],5);}
  this.gate=box(this.root,[.15,1.4,1.6],[3,0,2.1],mat(P.amber,{transparent:true,opacity:.5}));label(this.gate,'P26','STP',[0,1.1,0],1.7);
  this.stopped=box(this.root,[.35,.10,.24],[3,.32,2.1],new THREE.MeshBasicMaterial({color:P.cyan,transparent:true}));
  this.bundle=[];for(const offset of[-.19,.19])this.bundle.push(tube(this.root,[[-4,.6+offset,0],[-1,.6+offset,-2],[3,.6+offset,-4]],P.cyan,.038));
  this.packets=new THREE.InstancedMesh(new THREE.BoxGeometry(.25,.07,.15),glow(0xffffff),192);this.packets.instanceMatrix.setUsage(THREE.DynamicDrawUsage);this.packets.frustumCulled=false;this.root.add(this.packets);this.dummy=new THREE.Object3D();
  this.bpdu=[];for(let i=0;i<9;i++){const m=new THREE.Mesh(new THREE.OctahedronGeometry(.12),glow(P.amber));this.root.add(m);this.bpdu.push(m);}
 }
 update(t,a,tl,shot){
  const n=networkState(t),imp=tl.attack(t),arp=arpState(t),m=shot.mode;
  this.root.position.set(0,0,0);this.root.rotation.set(0,0,0);this.osi.visible=m==='osi';
  const osi=m==='osi';this.planes.forEach(p=>p.visible=!osi);this.switches.forEach((s,i)=>{s.root.position.y=0;s.root.scale.setScalar(osi?.72:1);s.ports.forEach((p,k)=>p.material.color.setHex(n.loop?P.red:k%4===0?P.green:P.cyan).multiplyScalar(.35+.25*a.bass_60_250_drive+(k%7===0?imp*.6:0)));});
  this.gate.visible=n.blocked&&!osi;this.gate.material.opacity=.24+.16*imp;
  const stoppedTime=t-56.461;this.stopped.visible=stoppedTime>=0&&stoppedTime<.65;this.stopped.position.copy(travel([[3,.32,-4],[3,.32,2.1]],clamp(stoppedTime/.18)));this.stopped.material.opacity=1-smooth(.4,.65,stoppedTime);
  this.edges.forEach(e=>{e.mesh.visible=!n.bundle||e.id!=='L12';e.mesh.material.color.setHex(n.loop?P.red:e.id==='L23'&&n.blocked?P.amber:P.cyan).multiplyScalar(e.id==='L23'&&n.blocked?.14:.32+.35*a.bass_60_250_drive);});
  this.bundle.forEach((b,i)=>{b.mesh.visible=['lacp','flows','final'].includes(m)&&t>=181.2;b.mesh.material.color.setHex(n.bundle?(i?P.amber:P.cyan):P.amber).multiplyScalar(.45+imp*.4);});
  const control=['stp','bpdu','recover','lldp','lacp'].includes(m);this.bpdu.forEach((b,i)=>{b.visible=control||n.converging;const edge=LINKS[i%3];const u=((t*(m==='lldp'?.28:.42)+i/3)%1);b.position.copy(travel([point(edge.a),point(edge.b)],u));b.position.y+=.8;b.rotation.set(t*2,i,t);b.material.color.setHex(m==='lldp'?P.green:P.amber);});
  let count=n.converging?0:n.loop?144:osi?18:['arp','unknown','broadcast'].includes(m)?42:60;
  if(m==='arp'&&t<21.7)count=6;
  const rmsGate=clamp((a.rms_dbfs+50)/22);this.packets.count=count;
  for(let i=0;i<count;i++){
   let v=i%4===0?3:10,points=pathFor(v),speed=.35,phase=(t*speed+i/count)%1,col=colorFor(v);
   if(['arp','unknown','broadcast'].includes(m)){v=10;col=P.cyan;const branch=i%3;
    points=branch===0?pathFor(10):branch===1?[hostPos(HOSTS[0]),point('SW-01'),point('SW-03'),hostPos(HOSTS[2])]:[hostPos(HOSTS[0]),point('SW-01'),point('SW-02')];
    if(m==='arp'&&arp.reply)points=[...pathFor(10)].reverse();
   }
   if(n.loop){points=[point('SW-01'),point('SW-02'),point('SW-03'),point('SW-01')];phase=(t*.72+i/count)%1;col=P.red;}
   if(m==='flows'&&n.bundle){v=10;col=i%2?P.amber:P.cyan;const off=flowMember(i%6)===0?-.19:.19;points=[hostPos(HOSTS[0]),[-4,.6+off,0],[-1,.6+off,-2],[3,.6+off,-4],hostPos(HOSTS[1])];}
   const pos=travel(points,phase);pos.y+=.32+(n.loop?(i%4)*.12:0);this.dummy.position.copy(pos);this.dummy.rotation.set(0,t*.5+i,0);this.dummy.scale.setScalar((.75+.20*imp)*rmsGate);this.dummy.updateMatrix();this.packets.setMatrixAt(i,this.dummy.matrix);this.packets.setColorAt(i,new THREE.Color(col));
  }this.packets.instanceMatrix.needsUpdate=true;if(this.packets.instanceColor)this.packets.instanceColor.needsUpdate=true;
 }
 camera(shot,t){
  const u=clamp((t-shot.start)/(shot.end-shot.start)),m=shot.camera;let pos,target=[0,0,0],fov=45;
  if(m==='stack'){pos=[15-u*4,12-u*2,22-u*4];target=[0,1,0];}
  else if(m==='host'){pos=[-16+u*2,7,11];target=[-5,0,0];}
  else if(m==='overhead'){pos=[2+u*2,23,9];target=[0,-.8,0];fov=48;}
  else if(m==='port'){pos=[7+u,4,10-u*1.5];target=[3,0,2.3];fov=46;}
  else if(m==='chase'){const p=travel(pathFor(10),.14+.65*u);pos=[p.x-3,p.y+3.5,p.z+7];target=[p.x+1,p.y,p.z];fov=52;}
  else if(m==='bundle'){pos=[-1+u*3,7,8];target=[-.7,.3,-2];fov=48;}
  else if(m==='final'){pos=[16+u*3,15+u*2,23+u*3];target=[0,-.5,0];fov=43;}
  else if(m==='orbit'){const theta=.25+u*.55;pos=[Math.sin(theta)*23,13,Math.cos(theta)*23];}
  else{pos=[17-u*3,11+u,22-u*4];target=[0,-.3,0];}
  return{pos:V(pos),target:V(target),fov};
 }
}
