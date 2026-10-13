import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {PALETTE as P,AP_POSITIONS} from '../config.js';
import {baseScene,box,material,glow,setInstance,display,labelTexture,ring,V,line} from '../world.js';
import {phone,coverage} from '../props.js';
import {radioState,position,clientPose,frameFlight,ROAMS} from '../roaming.js';
import {FLOOR_PATH,OFFICES,AP_DISTANCES,routePoint} from '../layout.js';
import {smooth,clamp} from '../timeline.js';
export class HallZone{
 constructor(sets){
  const s=this.scene=baseScene(.004);s.background.setHex(0x081721);
  const architecture=new THREE.Group();s.add(architecture);
  const concrete=material(0x445966,{roughness:.9,metalness:.05}),floor=material(0x294654,{roughness:.5}),metal=material(0x101f2e),warm=glow(P.amber,.7),blue=glow(P.cyan,.7),desk=material(0x8a7964,{roughness:.8}),screen=glow(0x317b93,.55),chair=material(0x35566e);
  // Six corridor runs form five genuine right-angle corners. Walls stop before
  // each joint so the route never passes through a wall.
  for(let j=0;j<FLOOR_PATH.length-1;j++){
   const a=FLOOR_PATH[j],b=FLOOR_PATH[j+1],len=Math.hypot(b[0]-a[0],b[1]-a[1]);
   const group=new THREE.Group();group.position.set(a[0],0,a[1]);group.rotation.y=-Math.atan2(b[1]-a[1],b[0]-a[0]);architecture.add(group);
   box(group,[len+9,.25,9],[len/2,-.18,0],floor);
   for(const z of[-4.3,4.3])box(group,[len-8,.035,.06],[len/2,.025,z],blue);
   box(group,[len-10,.7,.18],[len/2,.3,-4.45],concrete);
   for(let x=5;x<len-3;x+=5){
    for(const z of[-4.3,4.3]){box(group,[.15,5.3,.15],[x,2.55,z],metal);box(group,[.04,5,.035],[x-.10,2.55,z*.99],blue);}
    box(group,[.15,.15,8.8],[x,5.15,0],metal);box(group,[.035,.04,8.65],[x-.1,5.07,0],j%2?warm:blue);
    box(group,[.025,.008,8.6],[x,-.04,0],metal);
   }
   // A luminous path turns visibly with the floor plan, not just with the camera.
   box(group,[len,.018,.08],[len/2,.015,0],warm);
  }
  for(let i=1;i<FLOOR_PATH.length-1;i++){
   const [x,z]=FLOOR_PATH[i];const r=ring(s,1.3,[x,.04,z],P.amber,.023);r.rotation.x=-Math.PI/2;

  }
  // Open-plan offices, with clear central aisles matching the actual client route.
  OFFICES.forEach((o,oi)=>{
   box(architecture,[o.w,.24,o.d],[o.x,-.19,o.z],material(oi===1?0x374958:0x36484a,{roughness:.9}));
   for(const dz of[-o.d/2,o.d/2]){
    const wallZ=o.z+dz;let spans=[[o.x-o.w/2,o.x+o.w/2]];
    for(let j=0;j<FLOOR_PATH.length-1;j++){
     const a=FLOOR_PATH[j],b=FLOOR_PATH[j+1];if(a[0]!==b[0]||wallZ<Math.min(a[1],b[1])||wallZ>Math.max(a[1],b[1]))continue;
     const lo=a[0]-4.5,hi=a[0]+4.5;spans=spans.flatMap(([l,r])=>r<=lo||l>=hi?[[l,r]]:[[l,Math.min(r,lo)],[Math.max(l,hi),r]].filter(([aa,bb])=>bb>aa));
    }
    for(const[l,r]of spans)box(architecture,[r-l,.6,.2],[(l+r)/2,.25,wallZ],concrete);
    for(let x=o.x-o.w/2+2;x<o.x+o.w/2;x+=5)box(architecture,[.12,4.8,.12],[x,2.35,o.z+dz],metal);
    box(architecture,[o.w,.04,.06],[o.x,4.7,o.z+dz],warm);
   }
   for(const xx of[-10,-4,2])for(const zz of[-7,7]){
    const x=o.x+xx,z=o.z+zz;
    box(architecture,[4,.12,1.7],[x,.88,z],desk);
    for(const dx of[-1.5,1.5])box(architecture,[.12,.85,1.5],[x+dx,.4,z],metal);
    for(const dx of[-.95,.95]){
     box(architecture,[1,.66,.07],[x+dx,1.35,z-.22],metal);box(architecture,[.91,.55,.015],[x+dx,1.35,z-.173],screen);
     box(architecture,[.65,.025,.25],[x+dx,.96,z+.3],metal);
     box(architecture,[.75,.12,.75],[x+dx,.52,z+1.25],chair);box(architecture,[.75,.75,.12],[x+dx,.85,z+1.62],chair);box(architecture,[.15,.5,.15],[x+dx,.24,z+1.25],metal);
    }
   }
   // Glass accents and planters keep the rooms distinct from the corridor.
   const glass=material(0x4b9baf,{transparent:true,opacity:.16,depthWrite:false,roughness:.2,metalness:.05});
   box(s,[o.w,3.7,.06],[o.x,2.45,o.z-o.d/2],glass);
   display(s,5,1.25,[o.x,3.4,o.z-o.d/2+.12],labelTexture(o.name,'WORKSPACE / NIGHTWALK','#ffbe79'));
   for(const dx of[-o.w/2+1,o.w/2-1]){box(architecture,[.8,.7,.8],[o.x+dx,.3,o.z-2],concrete);box(architecture,[.6,1.2,.6],[o.x+dx,1.15,o.z-2],material(0x386f5d),.2);}
  });
  architecture.updateMatrixWorld(true);const batches=new Map();architecture.traverse(o=>{if(o.isMesh){const list=batches.get(o.material)||[];list.push(o.geometry.clone().applyMatrix4(o.matrixWorld));batches.set(o.material,list);}});
  for(const[mat,geos]of batches){s.add(new THREE.Mesh(mergeGeometries(geos),mat));geos.forEach(g=>g.dispose());}s.remove(architecture);
  this.cells=[];this.beacons=[];
  AP_POSITIONS.forEach((p,i)=>{
   setInstance(sets,'ap-ceiling',s,p,2.7);
   const c=coverage(s,[p[0],0,p[2]],20.5,i%2?P.blue:P.cyan);c.root.scale.y=.28;this.cells.push(c);
   const r=ring(s,.7,[p[0],4.68,p[2]],P.cyan,.025);r.rotation.x=-Math.PI/2;this.beacons.push(r);

  });
  this.device=phone(s,2.3);this.halo=ring(s,.65,[0,.035,0],P.amber,.025);this.halo.rotation.x=-Math.PI/2;
  this.roamRing=ring(s,1,[0,.04,0],P.green,.045);this.roamRing.rotation.x=-Math.PI/2;
  this.clients=[];for(let i=0;i<12;i++){
   const ap=Math.floor(i/3),p=routePoint(AP_DISTANCES[ap]),side=i%2?3.3:-3.3,along=(i%3-1)*3;
   const x=p.x+p.dx*along-p.dz*side,z=p.z+p.dz*along+p.dx*side;
   const d=phone(s,1.45);d.root.position.set(x,1.25,z);this.clients.push({d,ap,pos:V([x,1.25,z])});box(s,[1.2,.09,.85],[x,.8,z],concrete);
  }
  this.streams=[];this.packets=[];this.clients.forEach((c,i)=>{const col=[P.cyan,P.amber,P.green][i%3];this.streams.push(line(s,[AP_POSITIONS[c.ap],c.pos],col,.5));for(let k=0;k<3;k++)this.packets.push({mesh:box(s,[.32,.09,.13],[0,0,0],glow(col,1.3),.02),i,k});});
  this.flight=box(s,[.5,.18,.26],[0,0,0],glow(P.amber,1.6),.03);
  this.flightMaps=[labelTexture('DATA','CLIENT > AP','#ffbe79'),labelTexture('ACK','AP > CLIENT','#62def1'),labelTexture('RETRY=1','SEQ 0042 / NO ACK','#ff7687')];
  this.flightLabel=new THREE.Mesh(new THREE.PlaneGeometry(1.7,.425),new THREE.MeshBasicMaterial({map:this.flightMaps[0],toneMapped:false}));s.add(this.flightLabel);
  this.link=line(s,[[0,0,0],[1,1,1]],P.cyan,.65);this.oldLink=line(s,[[0,0,0],[1,1,1]],P.red,.5);
  this.retries=Array.from({length:4},()=>box(s,[.4,.15,.22],[0,0,0],glow(P.red,1.5),.02));
  this.pulse=0;
 }
 update(t,a,tl,shot){
  const r=radioState(t),pulse=tl.attack(t);this.pulse=pulse;const bad=r.retry>.15;
  this.device.root.position.set(r.x,1.8+.17*pulse,r.z);
  this.device.root.rotation.set(.08*Math.sin(t*4),-Math.atan2(r.pose.dz,r.pose.dx)-.25,.12*Math.sin(t*4.5)*pulse+(bad?.06*Math.sin(t*48)*r.retry:0));
  this.device.screen.material.color.setHex(bad?0x491d29:0x12374b);this.device.dot.material.color.setHex(bad?P.red:P.green);
  this.device.bars.forEach((b,i)=>b.material.color.setHex(i/4<r.signal?(bad?P.red:P.cyan):0x254457));
  this.halo.position.set(r.x,.035,r.z);this.halo.scale.setScalar(1+pulse*.3);this.halo.material.color.setHex(bad?P.red:r.recentRoam?P.green:P.amber);
  const flight=frameFlight(t);this.flight.visible=r.connected&&!bad;this.flight.position.copy(V(flight.pos));this.flight.rotation.y=t*8;this.flight.material.color.setHex(flight.returning?P.cyan:P.amber);
  this.flightLabel.material.map=this.flightMaps[bad?2:flight.returning?1:0];this.flightLabel.position.copy(bad?this.device.root.position:this.flight.position).add(V([0,.7,0]));this.flightLabel.visible=(shot.camera==='packet'||bad)&&r.connected;this.flightLabel.lookAt(this.camera(shot,t).pos);
  const updateLink=(l,to)=>{const attr=l.geometry.attributes.position;attr.setXYZ(0,r.x,1.8,r.z);attr.setXYZ(1,...to);attr.needsUpdate=true;l.geometry.computeBoundingSphere();};
  updateLink(this.link,AP_POSITIONS[r.ap]);this.link.visible=r.connected;this.link.material.color.setHex(bad?P.red:r.recentRoam?P.green:P.cyan);
  const event=ROAMS.find(e=>t>=e.time&&t<e.time+1.4);this.oldLink.visible=!!event;this.roamRing.visible=!!event;
  if(event){updateLink(this.oldLink,AP_POSITIONS[event.from]);this.oldLink.material.opacity=.5*(1-(t-event.time)/1.4);this.roamRing.position.set(r.x,.04,r.z);this.roamRing.scale.setScalar(.5+(t-event.time)*2.5);}
  this.cells.forEach((c,i)=>{c.dome.material.opacity=i===r.ap?.025:.006;c.hoops.forEach(h=>h.material.color.setHex(i===r.ap?(bad?P.red:P.cyan):P.blue).multiplyScalar(i===r.ap?.65+pulse*.3:.2));this.beacons[i].scale.setScalar(1+pulse*(i===r.ap?.6:.1));});
  this.retries.forEach((m,i)=>{m.visible=bad&&r.connected;const u=(t*2.4+i/4)%1;m.position.copy(V([r.x,1.8,r.z])).lerp(V(AP_POSITIONS[r.ap]),u);m.rotation.y=t*10+i;});
  const mimo=['mimo','meeting'].includes(shot.camera);this.streams.forEach((l,i)=>l.visible=mimo&&this.clients[i].ap===r.ap);
  this.packets.forEach(({mesh,i,k})=>{const c=this.clients[i],u=(t*2.5+k/3)%1;mesh.position.copy(V(AP_POSITIONS[c.ap])).lerp(c.pos,u);mesh.visible=mimo&&c.ap===r.ap;});
 }
 camera(shot,t){
  const p=clientPose(t),u=smooth(shot.start,shot.end,t),kick=Math.exp(-(t-shot.start)*12),bounce=this.pulse;
  const B=(a,y,b)=>V([p.x+p.dx*a-p.dz*b,y,p.z+p.dz*a+p.dx*b]);
  let pos,target=B(0,1.9,0),fov=65,roll=0;
  switch(shot.camera){
   case'arrival':case'tunnel':case'launch':{const back=routePoint(Math.max(0,p.d-8)),ahead=routePoint(Math.min(156,p.d+17));pos=V([back.x-p.dz,2.6+bounce*.15,back.z+p.dx]);target=V([ahead.x,2,ahead.z]);fov=76+kick*5;break;}
   case'closing':pos=B(-10,7,11);target=B(4,1,0);fov=68;break;
   case'packet':{const f=V(frameFlight(t).pos);pos=f.clone().add(V([-p.dx*2.5-p.dz*3,1.2,-p.dz*2.5+p.dx*3]));target=f.clone();fov=71;roll=.08*Math.sin(t*7);break;}
   case'overhead':pos=B(-2,23-kick*3,5);target=B(4,0,0);fov=72;break;
   case'mimo':{const a=AP_POSITIONS[radioState(t).ap];pos=V([a[0]-9,11,a[2]+15]);target=V([a[0],2,a[2]]);fov=65;break;}
   case'meeting':pos=V([p.x-13,13,p.z+18]);target=V([40,1.5,22]);fov=65;break;
   case'roam':pos=B(-6,8,10);target=B(-1,1.5,0);fov=67;break;
   case'bank':pos=B(-4+u*8,3.4,5.3);roll=.13*Math.sin(u*Math.PI*2);fov=68;break;
   case'wall':pos=B(-6,5,7);target=B(7,1.7,-2);fov=74;break;
   case'door':pos=B(6-3*u,3,5);fov=65;break;
   case'sticky':pos=B(-3.7,4.2,6.4);target=B(-1,2,0);fov=61;break;
   default:pos=B(-6+u*2,3+bounce*.15,5.5);fov=68;
  }
  return{pos,target,fov:fov-3*bounce,roll};
 }
}
