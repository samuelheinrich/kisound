// Rigid, untilted front view of the two separate console surfaces.
import * as THREE from 'three';
import {V,mat} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {DW,DH} from '../display.js';
const SW=16,SH=SW*DH/DW,TAN=Math.tan(19.5/2*Math.PI/180);
export class ConsoleZone{
 constructor(display){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x010204);
  const bez=new THREE.Mesh(new THREE.BoxGeometry(SW+.5,SH+.5,.3),mat(0x07090c,{roughness:.4}));bez.position.z=-.17;s.add(bez);
  s.add(new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),new THREE.MeshBasicMaterial({map:display.tex,toneMapped:false})));
 }
 update(){}
 camera(shot,t){const u=smooth(shot.start,shot.end,t),dist=SH*1.04/(2*TAN);return{pos:V([0,0,dist*lerp(1.02,.97,u)]),target:V([0,0,0]),fov:19.5};}
}
