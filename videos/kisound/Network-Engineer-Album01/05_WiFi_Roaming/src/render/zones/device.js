import * as THREE from 'three';
import {baseScene,box,material,glow,ring,point,V} from '../world.js';
import {phone} from '../props.js';
import {radioState} from '../roaming.js';
import {PALETTE as P,BSSIDS} from '../config.js';
export class DeviceZone{
 constructor(){
  this.scene=baseScene(.025);const s=this.scene;
  box(s,[14,.15,10],[0,-.1,0],material(0x4a382d,{roughness:.95,metalness:0}));
  this.device=phone(s,5.2);this.device.root.position.set(0,1.9,0);
  this.canvas=document.createElement('canvas');this.canvas.width=600;this.canvas.height=1100;
  this.texture=new THREE.CanvasTexture(this.canvas);this.texture.colorSpace=THREE.SRGBColorSpace;
  const screen=new THREE.Mesh(new THREE.PlaneGeometry(.245,.475),new THREE.MeshBasicMaterial({map:this.texture,toneMapped:false}));screen.position.z=.023;this.device.root.add(screen);
  this.device.bars.forEach(b=>b.visible=false);this.device.dot.visible=false;
  this.rings=[];for(let i=0;i<3;i++){const r=ring(s,1.6+i*.8,[0,.025,0],P.cyan,.012);r.rotation.x=-Math.PI/2;this.rings.push(r);}
  point(s,P.amber,15,[-3,3,3],12);
 }
 update(t,a,tl,shot){
  const r=radioState(t),g=this.canvas.getContext('2d');
  g.fillStyle='#071523';g.fillRect(0,0,600,1100);g.fillStyle='#859db1';g.font='20px "JetBrains Mono"';g.fillText('CLIENT VIEW',45,68);
  g.fillStyle='#e6f1f4';g.font='500 47px "Space Grotesk"';g.fillText('NIGHTWALK',45,148);
  g.fillStyle=r.scanning?'#ffb96a':'#76e1cf';g.font='24px "JetBrains Mono"';g.fillText(r.phase,45,202);
  g.strokeStyle='#5ad3e9';g.lineWidth=9;
  for(let i=1;i<=3;i++){g.beginPath();g.arc(300,394,i*49,Math.PI*1.22,Math.PI*1.78);g.stroke();}
  g.fillStyle='#5ad3e9';g.beginPath();g.arc(300,407,13,0,Math.PI*2);g.fill();
  g.fillStyle='#e6f1f4';g.font='500 38px "Space Grotesk"';g.fillText(`AP-0${r.ap+1}`,45,510);
  g.fillStyle='#89a7bb';g.font='20px "JetBrains Mono"';g.fillText(r.bssid,45,553);
  const bar=(label,y,value,color)=>{g.fillStyle='#9bb7c6';g.font='20px "JetBrains Mono"';g.fillText(label,45,y);g.fillStyle='#213746';g.fillRect(45,y+22,510,11);g.fillStyle=color;g.fillRect(45,y+22,510*value,11);};
  bar('SIGNAL',626,r.signal,r.signal<.4?'#ffb96a':'#5ad3e9');bar('INTERFERENCE',712,r.noise,'#cfb783');
  g.fillStyle='#748fa2';g.font='18px "JetBrains Mono"';g.fillText('SAME SSID / NEW BSSID',45,834);
  g.fillStyle='#a0c8d6';g.font='20px "JetBrains Mono"';g.fillText(r.scanning?'Candidate beacons found':r.signal<.4?'Holding current access point':'Service remains reachable',45,885);
  if(shot.camera==='portal'){
   g.fillStyle='#182d3b';g.fillRect(27,580,546,425);g.strokeStyle='#d9ad76';g.lineWidth=2;g.strokeRect(27,580,546,425);
   g.fillStyle='#ffbd73';g.font='22px "JetBrains Mono"';g.fillText('APPLICATION LAYER',50,630);
   g.fillStyle='#e6f1f4';g.font='500 38px "Space Grotesk"';g.fillText('Guest access',50,709);
   g.font='23px "Space Grotesk"';g.fillStyle='#adc3cd';g.fillText('Portal sign-in',50,755);g.fillText('Separate from radio roaming',50,802);
   g.fillStyle='#2a726e';g.fillRect(50,857,495,67);g.fillStyle='#d4f4e8';g.font='24px "JetBrains Mono"';g.fillText('CONTINUE',196,902);
  }
  this.texture.needsUpdate=true;
  this.device.root.rotation.y=-.15+Math.sin(t*2.8)*.12;this.device.root.rotation.z=.06*tl.attack(t);this.device.root.position.y=1.9+.08*tl.attack(t);
  this.rings.forEach((m,i)=>{m.material.color.setHex(r.signal<.4?P.amber:P.cyan).multiplyScalar(.32+.28*a.mid_500_2000_drive);m.scale.setScalar(1+.04*Math.sin(t+i));});
 }
 camera(shot,t){return{pos:V([.2,2.7,9]),target:V([0,1.7,0]),fov:44-3*Math.exp(-(t-shot.start)*10)};}
}
