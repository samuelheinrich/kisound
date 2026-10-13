import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,baseScene,floor,box,mat,glow,line,label,colorFor} from '../world.js';
import {clamp} from '../timeline.js';
import {frameState} from '../protocol-model.js';
export class FrameZone{
 constructor(){
  this.scene=baseScene();floor(this.scene,28,-2.2);this.root=new THREE.Group();this.scene.add(this.root);
  this.parts=[];for(const [id,title,width,col]of[['da','DEST MAC',2,P.cyan],['sa','SRC MAC',2,P.cyan],['tag','802.1Q',1.7,P.violet],['type','TYPE',1.5,P.amber],['payload','PAYLOAD',3.5,P.blue],['fcs','FCS',1.1,P.green]]){
   const group=new THREE.Group();this.root.add(group);const panel=box(group,[width,.32,2],[0,0,0],mat(col,{transparent:true,opacity:.58}));line(group,[[-width/2,.2,-1],[width/2,.2,-1],[width/2,.2,1],[-width/2,.2,1],[-width/2,.2,-1]],col);const text=label(group,title,id==='tag'?'TPID / PCP / DEI / VID':id==='fcs'?'LINK LOCAL':'ETHERNET',[0,.7,0],Math.min(2.8,width+1));this.parts.push({id,width,group,panel,text});
  }
  this.tagLabel=label(this.root,'VLAN 10','0x8100 / 4 BYTES',[0,2.2,0],3,'#b39bff');
  this.wires=[];for(let z of[-2.4,2.4])this.wires.push(line(this.scene,[[-14,-.5,z],[14,-.5,z]],P.cyan,.4));
  this.beads=new THREE.InstancedMesh(new THREE.BoxGeometry(.08,.08,.08),glow(P.cyan),60);this.scene.add(this.beads);this.dummy=new THREE.Object3D();
 }
 update(t,a,tl,shot){
  const f=frameState(t,shot),imp=tl.attack(t),explode=shot.mode==='tag'||shot.mode==='access';
  let x=-5.9;for(const p of this.parts){const tag=p.id==='tag';p.group.visible=!tag||(!f.access&&(explode?f.tagAmount>.001:f.tagged));p.group.position.set(x+p.width/2,tag?(explode?(1-f.tagAmount)*1.5:.25):0,0);p.group.scale.setScalar(tag&&explode?Math.max(.08,f.tagAmount):1);p.panel.material.opacity=.52+.15*imp;p.group.rotation.set(0,0,0);if(!tag||p.group.visible)x+=p.width+.12;}
  this.root.position.set(0,0,0);this.root.rotation.set(0,0,0);if(shot.camera==='track')this.root.position.x=Math.sin((t-shot.start)*1.4)*.7;
  this.tagLabel.visible=f.tagged&&!f.access;this.tagLabel.position.x=this.parts[2].group.position.x;this.tagLabel.material.color.setHex(colorFor(f.vlan));
  for(let i=0;i<60;i++){this.dummy.position.set(((t*4+i*.45)%28)-14,-.45+(i%2)*.1,i%2?2.4:-2.4);this.dummy.scale.setScalar(.5+.5*a.bass_60_250_drive);this.dummy.updateMatrix();this.beads.setMatrixAt(i,this.dummy.matrix);}this.beads.instanceMatrix.needsUpdate=true;
 }
 camera(shot,t){const u=clamp((t-shot.start)/(shot.end-shot.start));return shot.camera==='side'?{pos:V([1,9-u,14]),target:V([0,.2,0]),fov:48}:{pos:V([-9+u*4,6,12]),target:V([-.5,.2,0]),fov:50};}
}
