import * as THREE from 'three';
import {box,sphere,material,glow,ring,V} from './world.js';
import {PALETTE as P} from './config.js';
export function phone(parent,scale=1){
 const root=new THREE.Group();root.scale.setScalar(scale);parent.add(root);
 box(root,[.28,.53,.035],[0,0,0],material(0x25323e,{metalness:.45}),.025);
 const screen=box(root,[.245,.475,.003],[0,0,.02],glow(0x12374b),.012);
 box(root,[.055,.007,.003],[0,.22,.023],material(0x617586),.002);
 const bars=[];for(let i=0;i<4;i++)bars.push(box(root,[.025,.035+i*.024,.002],[-.075+i*.047,.06+i*.012,.024],glow(P.cyan),.002));
 const dot=sphere(root,.012,[0,-.15,.024],glow(P.green));
 return{root,bars,screen,dot};
}
export function coverage(parent,pos,r=5.1,color=P.cyan){
 const root=new THREE.Group();root.position.copy(V(pos));parent.add(root);
 const mat=new THREE.MeshBasicMaterial({color,transparent:true,opacity:.025,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending});
 const dome=new THREE.Mesh(new THREE.SphereGeometry(r,48,24,0,Math.PI*2,0,Math.PI/2),mat);dome.scale.y=.65;root.add(dome);
 const hoops=[];for(let i=0;i<3;i++){const m=ring(root,r*(1-i*.2),[0,.03+i*.74,0],color,.009);m.rotation.x=-Math.PI/2;hoops.push(m);}
 for(let i=0;i<4;i++){
  const points=[];for(let k=0;k<=36;k++){const theta=k/36*Math.PI,rot=i*Math.PI/4;points.push(new THREE.Vector3(Math.cos(theta)*r*Math.cos(rot),Math.sin(theta)*r*.65,Math.cos(theta)*r*Math.sin(rot)));}
  const l=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color,transparent:true,opacity:.23}));root.add(l);
 }
 return{root,dome,hoops};
}
