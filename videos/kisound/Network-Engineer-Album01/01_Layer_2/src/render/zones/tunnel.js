import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,baseScene,floor,box,mat,glow,line,label} from '../world.js';
import {clamp,smooth} from '../timeline.js';
import {tunnelState} from '../protocol-model.js';
export class TunnelZone{
 constructor(){
  this.scene=baseScene();floor(this.scene,34,-2.4);this.endpoints=[];this.endpointLabels=[];
  for(const [x,name,ip]of[[-7,'LCCE-A','192.0.2.1'],[7,'LCCE-B','198.51.100.2']]){const r=new THREE.Group();this.scene.add(r);box(r,[4,.15,5],[x,-.8,0],mat(0x173348));box(r,[1.8,.65,1.35],[x,0,0],mat(0x2c4b60));this.endpointLabels.push(label(r,name,ip,[x,1.45,0],3));this.endpoints.push(r);}
  this.rings=[];for(let i=0;i<18;i++){const mesh=new THREE.Mesh(new THREE.TorusGeometry(1.65,.024,6,6),glow(P.blue));mesh.rotation.y=Math.PI/2;mesh.position.x=-5.5+i*.65;this.scene.add(mesh);this.rings.push(mesh);}
  this.payload=new THREE.Group();this.scene.add(this.payload);box(this.payload,[1.9,.38,.95],[0,0,0],mat(P.cyan,{transparent:true,opacity:.6}));box(this.payload,[.20,.43,1.02],[.2,0,0],glow(P.violet,.7));label(this.payload,'ETHERNET','VLAN 10 / INNER FRAME',[0,.85,0],2.7);
  this.shell=new THREE.Group();this.payload.add(this.shell);box(this.shell,[2.8,.85,1.55],[0,0,0],new THREE.MeshBasicMaterial({color:P.amber,transparent:true,opacity:.08,depthWrite:false}));for(const y of[-.46,.46])line(this.shell,[[-1.45,y,-.8],[1.45,y,-.8],[1.45,y,.8],[-1.45,y,.8],[-1.45,y,-.8]],P.amber,.9);for(const x of[-1.45,1.45])for(const z of[-.8,.8])line(this.shell,[[x,-.46,z],[x,.46,z]],P.amber,.8);label(this.shell,'IP / L2TPv3','PROTOCOL 115 / SESSION',[0,1.65,0],3,'#ffb96a');
  this.overviewLabel=label(this.scene,'ETHERNET PSEUDOWIRE','IP UNDERLAY / TWO ENDPOINTS',[0,-1.5,3],6);
  this.control=new THREE.Mesh(new THREE.OctahedronGeometry(.17),glow(P.amber));this.scene.add(this.control);
 }
 update(t,a,tl,shot){
  const late=t>=194,s=tunnelState(t),u=late?((t-194)/4)%1:clamp((t-76.5)/5),x=-6+12*smooth(0,1,u),imp=tl.attack(t);
  const wide=['wide','launch'].includes(shot.camera);this.overviewLabel.visible=wide;this.endpointLabels.forEach(l=>l.visible=wide);
  this.payload.position.set(s.setup?-6:x,.45,0);this.payload.rotation.set(0,0,0);
  const wrap=late?1:smooth(74.3,76.5,t)*(1-smooth(81,83.6,t));this.shell.visible=wrap>.001;this.shell.scale.setScalar(.75+.25*wrap);
  this.rings.forEach((m,i)=>{m.material.color.setHex(P.blue).multiplyScalar(.35+.5*a.bass_60_250_drive+imp*.2);m.rotation.x=.04*Math.sin(t*2+i);});
  this.control.visible=s.setup;const p=((t-70.5)/.63)%1;this.control.position.set(-6+12*(Math.floor((t-70.5)/.63)%2?1-p:p),1,0);this.control.rotation.set(t*2,t,t);
 }
 camera(shot,t){const u=clamp((t-shot.start)/(shot.end-shot.start)),x=this.payload.position.x;
  if(shot.camera==='inside')return{pos:V([x-3,2,2.4]),target:V([x+2,.5,0]),fov:66};
  if(shot.camera==='track')return{pos:V([x-4,4,7]),target:V([x,.5,0]),fov:50};
  if(shot.camera==='arrival')return{pos:V([11,4,8]),target:V([5,.4,0]),fov:50};
  return{pos:V([13-u*2,9,17]),target:V([0,.3,0]),fov:48};
 }
}
