import * as THREE from 'three';
import { PALETTE as P } from '../config.js';
import { smooth } from '../timeline.js';
import { baseScene,material,glow,box,tube,ring,sphere,display,labelTexture,mix3,V } from '../world.js';
export class TopologyZone {
 constructor(){
  this.scene=baseScene(.014);const s=this.scene;
  box(s,[24,.3,15],[0,-.25,0],material(0x102334,{roughness:.9,metalness:.05}),.1);
  // The graph has real alternate connectivity. A broken primary edge never carries new traffic.
  const positions=[[-8,.6,0],[-4,.6,-3],[-4,.6,3],[2,.6,-3],[2,.6,3],[7,.6,0]];
  const names=['ACCESS','EDGE A','EDGE B','CORE A','CORE B','SERVICE'];
  this.nodes=[];this.halos=[];
  positions.forEach((p,i)=>{
   box(s,[1.5,.5,1.5],[p[0],.2,p[2]],material(0x334b62),.09);
   const halo=ring(s,.94,[p[0],.025,p[2]],i===2||i===4?P.amber:P.cyan,.015);halo.rotation.x=-Math.PI/2;this.halos.push(halo);
   this.nodes.push(sphere(s,.18,[p[0],.68,p[2]],glow(P.cyan,1.5)));
   const panel=new THREE.Group();panel.position.set(p[0],1.5,p[2]);panel.rotation.x=-.65;s.add(panel);
   display(panel,2,.5,[0,0,0],labelTexture(names[i],i===2||i===4?'ALTERNATE PATH':'FORWARDING NODE','#9dbecf'));
  });
  this.edges=[];
  const links=[[0,1],[1,3],[3,5],[0,2],[2,4],[4,5]];
  links.forEach(([from,to],i)=>{
   const a=positions[from],b=positions[to];const path=tube(s,[a,[(a[0]+b[0])/2,1.15,(a[2]+b[2])/2],b],i>=3?P.amber:P.cyan,.025);
   const dots=[];for(let j=0;j<4;j++)dots.push(sphere(s,.065,a,glow(P.white,1.8)));
   this.edges.push({...path,dots,alternate:i>=3,broken:i===1});
  });
  this.faultMark=ring(s,.38,[-1,.95,-3],P.amber,.035);this.faultMark.rotation.x=-Math.PI/2;
  display(s,5,1.25,[0,3.1,-5.8],labelTexture('PATH SUPERVISION','PRIMARY / ALTERNATE / SERVICE','#79e6bc'));
  for(let x=-11;x<12;x+=1)box(s,[.018,.012,13],[x,-.08,0],glow(P.blue,.15));
 }
 update(t,a,tl){
  const n=tl.network(t),impulse=tl.pulse(t,['E021','E023'],.35);
  this.edges.forEach((e,i)=>{
   const active=e.alternate?n.failover:1-n.fault;
   e.mesh.material.color.setHex(e.broken&&n.fault>.5?P.amber:e.alternate?(n.recovered>.5?P.green:P.amber):P.cyan).multiplyScalar(e.broken&&n.fault>.5?.3:.24+active*.75);
   e.dots.forEach((m,j)=>{m.visible=active>.05;m.position.copy(e.curve.getPoint((t*.28+j/4+i*.07)%1));m.scale.setScalar(.7+a.presence_2000_6000_drive*.7);});
  });
  this.faultMark.visible=n.fault>.5;this.faultMark.scale.setScalar(1+.08*Math.sin(t*2));
  this.halos.forEach((r,i)=>{r.scale.setScalar(1+(i===4?impulse*.3:0));r.material.color.setHex(n.recovered>.5?P.green:i===2||i===4?P.amber:P.cyan);});
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t);
  const cfg={
   reserve:[[9,10,14],[6,9,13],[0,0,0],[0,0,0],46],
   flow:[[-11,10,14],[-6,11,16],[0,0,0],[0,0,0],49],
   route:[[3,9,13],[1,10,12],[1,0,2],[1,0,2],46],
   inspect:[[11,11,14],[-1,12,16],[0,0,0],[-1,0,0],48],
  };
  const [p,q,r,s,fov]=cfg[shot.camera]||cfg.flow;return{pos:mix3(p,q,u),target:mix3(r,s,u),fov};
 }
}
