import * as THREE from 'three';
import { PALETTE as P } from '../config.js';
import { smooth } from '../timeline.js';
import { baseScene,material,glow,box,point,ring,setInstance,mix3,V,display,labelTexture,sphere,line } from '../world.js';
export class InfrastructureZone {
 constructor(sets){
  this.scene=baseScene(.038);const s=this.scene;
  box(s,[12,.1,18],[0,-.11,-2],material(0x0a1b2b,{roughness:.9,metalness:.03}));
  for(let i=0;i<3;i++)setInstance(sets,'rack-aisle',s,[0,0,-i*3.7]);
  for(const x of [-.5,.5])box(s,[.022,.01,13],[x,0,-3.5],glow(P.cyan,.7));
  for(let z=1;z>-10;z-=2){box(s,[2.5,.04,.1],[0,2.5,z],glow(P.white,.5));}
  this.lights=[point(s,P.cyan,16,[0,1.8,1],8),point(s,P.cyan,13,[0,1.8,-4],8)];
  display(s,.9,.225,[0,2.1,-1.5],labelTexture('UPLINKS','REDUNDANT PATHS'));
  this.leds=[];
  for(let side=-1;side<=1;side+=2)for(let i=0;i<20;i++){
   this.leds.push(box(s,[.025,.02,.03],[side*.64,.15+i*.088,-.04],glow(P.green)));
  }
  // Macro stage: real shared switch ports, positioned with the GLB anchor sidecar.
  this.macro=new THREE.Group();this.macro.position.set(8,1,0);s.add(this.macro);
  setInstance(sets,'switch-48p',this.macro,[0,0,0],4);
  setInstance(sets,'router-core',this.macro,[0,-.48,-.02],4);
  this.portLights=[];
  for(const anchor of sets.group('switch-48p','sw.led.')){
   const p=anchor.pos.clone().multiplyScalar(4);this.portLights.push(sphere(this.macro,.012,p.toArray(),glow(P.green,1.5)));
  }
  display(this.macro,1.25,.3125,[0,.4,.05],labelTexture('PORT STATUS','LINK UP / FORWARDING'));
  point(s,P.cyan,11,[8,2,2],6);
  // Access-point vignette, seen from below; radio arcs are a coverage metaphor.
  this.ap=new THREE.Group();this.ap.position.set(-8,1.9,0);s.add(this.ap);
  setInstance(sets,'ap-ceiling',this.ap,[0,0,0],3);
  box(this.ap,[3,.05,3],[0,.35,0],material(0x243748));
  this.waves=[];for(let i=0;i<4;i++){const r=ring(this.ap,.4+i*.25,[0,-.17-i*.22,0],P.cyan,.007);r.rotation.x=-Math.PI/2;this.waves.push(r);}
  point(s,P.white,12,[-8,0,2],6);
 }
 update(t,a,tl){
  const impulse=tl.pulse(t,['E010','E019','E024','E033'],.24),n=tl.network(t);
  this.leds.forEach((m,i)=>m.material.color.setHex(n.alarm>.2&&i<3?P.amber:P.green).multiplyScalar(.45+.35*Math.sin(t*2+i)+impulse));
  this.portLights.forEach((m,i)=>m.material.color.setHex(P.green).multiplyScalar(.5+.3*Math.sin(t*3+i)+impulse*1.2));
  this.waves.forEach((r,i)=>{r.scale.setScalar(.95+.12*Math.sin(t*2-i));r.material.color.setHex(P.cyan).multiplyScalar(.35+a.air_12000_20000_drive*.4);});
  this.lights.forEach(l=>l.intensity=14+8*a.mid_500_2000_drive);
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t);
  if(shot.camera==='switch')return{pos:mix3([8.8,1.42,2.05],[8.2,1.24,1.8],u),target:V([8,1.06,.35]),fov:41};
  if(shot.camera==='ap')return{pos:mix3([-6.7,.55,1.3],[-7.4,.7,1.5],u),target:V([-8,1.7,0]),fov:48};
  return{pos:mix3([.18,1.28,3.7],[-.12,1.4,1.3],u),target:V([0,1.15,-4]),fov:52};
 }
}
