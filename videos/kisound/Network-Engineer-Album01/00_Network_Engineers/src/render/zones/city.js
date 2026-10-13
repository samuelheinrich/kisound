import * as THREE from 'three';
import { PALETTE as P } from '../config.js';
import { smooth,clamp } from '../timeline.js';
import { baseScene,material,glow,box,point,tube,ring,sphere,setInstance,random,mix3,V,display,labelTexture } from '../world.js';
export class CityZone {
 constructor(sets){
  this.scene=baseScene(.007);const s=this.scene;
  box(s,[140,.4,130],[0,-.3,0],material(0x0a1727,{roughness:.92,metalness:.02}));
  this.blocks=[];this.windowMaterials=[];
  for(let x=-1;x<=1;x++)for(let z=-1;z<=1;z++){
   if(x===0&&z===0)continue;
   const block=setInstance(sets,'city-block',s,[x*15,0,z*15],.17);
   block.rotation.y=((x+z+4)%4)*Math.PI/2;this.blocks.push(block);
   block.traverse(o=>{if(o.isMesh&&o.material.name==='led')this.windowMaterials.push(o.material);});
  }
  // Roads and architectural lines establish scale, never a synthetic infinite grid.
  for(const x of [-24,-7.5,7.5,24]){
   box(s,[.055,.025,60],[x,.02,0],glow(P.blue,.5));
   box(s,[60,.025,.055],[0,.02,x],glow(P.blue,.5));
   for(let k=-27;k<28;k+=2.5){box(s,[.08,.025,.9],[x+.5,.021,k],glow(P.white,.3));box(s,[.9,.025,.08],[k,.021,x+.5],glow(P.white,.3));}
  }
  // Distinct NOC building; the crane starts at its occupied upper-floor window.
  const noc=material(0x1e3447,{metalness:.65,roughness:.25});
  box(s,[8,7,6],[0,3.5,0],noc,.12);
  for(let y=.7;y<6.8;y+=.9){box(s,[8.05,.07,6.05],[0,y,0],material(0x496077));}
  box(s,[7.4,1.3,.05],[0,5.7,3.045],glow(0x295e70,.8));
  for(let x=-3.4;x<3.5;x+=.85)box(s,[.045,1.35,.09],[x,5.7,3.07],material(0x354f61));
  display(s,3,.75,[0,6.1,3.13],labelTexture('OPERATIONS','NIGHT WATCH','#8bd6dc'));
  point(s,P.cyan,180,[0,6,5],22);
  // Small desk silhouettes inside the illuminated window read as an inhabited space.
  for(const x of [-2,0,2]){box(s,[1,.05,.45],[x,5.3,3.13],material(0x10283b));box(s,[.55,.35,.05],[x,5.55,3.17],glow(P.cyan,.6));}
  this.paths=[];this.dots=[];this.rings=[];
  const destinations=[[-15,6,-15],[15,7,-15],[-15,5,15],[15,8,15],[0,8,-15],[-15,7,0],[15,6,0],[0,5,15]];
  destinations.forEach((end,i)=>{
   const start=[0,7.2,0],mid=[end[0]*.5,12+i%3,end[2]*.5];
   const route=tube(s,[start,mid,end],i%3===0?P.amber:P.cyan,.024);this.paths.push(route);
   const halo=ring(s,.48,end,P.cyan,.02);halo.rotation.x=-Math.PI/2;this.rings.push(halo);
   for(let j=0;j<4;j++)this.dots.push({mesh:sphere(s,.08,start,glow(P.white,2)),curve:route.curve,phase:j/4+i*.09,i});
  });
  // Supplementary warm windows in the outer skyline (instanced, low draw-call cost).
  const count=360;const windows=new THREE.InstancedMesh(new THREE.BoxGeometry(.22,.38,.018),glow(P.amber,.65),count);
  const transform=new THREE.Object3D();
  for(let i=0;i<count;i++){
   const col=i%30,row=Math.floor(i/30);transform.position.set(-35+col*2.4,1+row*.68,-29);transform.updateMatrix();windows.setMatrixAt(i,transform.matrix);
  }s.add(windows);this.windows=windows;
  for(let i=0;i<26;i++){
   const x=-42+i*3.4,h=4+random(i)*16;
   box(s,[2.5,h,3],[x,h/2,-34-random(i+30)*10],material(0x12263b));
  }
  this.beacon=sphere(s,.13,[0,7.35,0],glow(P.green,2));
 }
 update(t,a,tl){
  const n=tl.network(t),wake=smooth(22.82,37.35,t);
  const impulse=tl.pulse(t,['E008','E009','E017','E034','E036','E037','E039'],.32);
  this.windowMaterials.forEach((m,i)=>{m.emissive.setHex(n.recovered>.5?P.green:P.blue);m.emissiveIntensity=.45+.16*a.mid_500_2000_drive+.15*impulse;m.color.setHex(0x31465b);});
  this.paths.forEach(({mesh},i)=>{
   const activation=.15+.85*smooth(22.82+i*1.2,30.4+i,t);
   mesh.material.color.setHex(n.alarm>.1&&i===1?P.amber:n.recovered>.5?P.green:P.cyan).multiplyScalar(activation*(.5+a.bass_60_250_drive*.5+impulse*.8));
  });
  this.dots.forEach(({mesh,curve,phase,i})=>{mesh.position.copy(curve.getPoint((t*.085+phase)%1));mesh.scale.setScalar(.8+.8*a.presence_2000_6000_drive);mesh.visible=wake>i*.075;});
  this.rings.forEach((r,i)=>{r.scale.setScalar(1+.18*Math.sin(t*1.1+i)+impulse*.55);});
  this.beacon.material.color.setHex(P.green).multiplyScalar(1+impulse*2);
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t);
  if(shot.camera==='crane'){
   const k=smooth(178.6,198.6,t);
   return{pos:mix3([1.2,6.8,10],[38,31,42],k),target:mix3([0,5.5,1],[0,3,0],k),fov:46};
  }
  if(shot.camera==='final')return{pos:mix3([38,31,42],[40,32,39],u),target:V([0,3,0]),fov:46};
  if(shot.camera==='street')return{pos:mix3([-27,9,26],[-12,12,31],u),target:mix3([-5,4,0],[0,5,0],u),fov:48};
  return{pos:mix3([27,23,33],[34,24,23],u),target:V([0,4,0]),fov:49};
 }
}
