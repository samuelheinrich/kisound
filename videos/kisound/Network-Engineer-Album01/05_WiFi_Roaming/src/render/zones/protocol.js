import * as THREE from 'three';
import {baseScene,box,material,glow,ring,display,labelTexture,V,line} from '../world.js';
import {phone} from '../props.js';
import {PALETTE as P} from '../config.js';
import {sequence} from '../protocol-model.js';
export class ProtocolZone{
 constructor(){
  const s=this.scene=baseScene(.015);box(s,[26,.15,14],[0,-.25,0],material(0x142c3c));
  this.device=phone(s,4);this.device.root.position.set(-5,1.4,0);
  box(s,[2,.3,2],[5,1.5,0],material(0xc1d8e5),.1);
  for(const x of[-5,5]){const r=ring(s,2,[x,0,0],P.cyan,.018);r.rotation.x=-Math.PI/2;}
  this.paths=[];this.frames=[];
  for(let i=0;i<6;i++){
   this.paths.push(line(s,[[-5,.6+i*.36,0],[5,.6+i*.36,0]],i%2?P.cyan:P.amber,.35));
   this.frames.push(box(s,[.5,.18,.25],[0,1,0],glow(i%2?P.cyan:P.amber,1.3),.02));
  }
 }
 update(t,a,tl,shot){
  const seq=sequence(shot,t);this.frames.forEach((m,i)=>{const e=seq[i];m.visible=!!e&&e.progress>0&&e.progress<1&&e.label!=='NO ACK';if(e){const dir=e.direction==='client-ap'?1:-1;m.position.set((-5+10*e.progress)*dir,.6+i*.36,0);m.rotation.x=t*7;}});
  this.paths.forEach((m,i)=>m.visible=i<seq.length);this.device.root.rotation.z=.03*tl.attack(t);
 }
 camera(shot,t){return{pos:V([1.5*Math.sin((t-shot.start)*2),6,15]),target:V([0,1,0]),fov:56};}
}
