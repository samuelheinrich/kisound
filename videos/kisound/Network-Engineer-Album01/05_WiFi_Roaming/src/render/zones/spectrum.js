import * as THREE from 'three';
import {baseScene,box,material,glow,ring,display,labelTexture,line,V} from '../world.js';
import {PALETTE as P} from '../config.js';
import {coverage} from '../props.js';
import {smooth} from '../timeline.js';
import {dfsState} from '../roaming.js';
export class SpectrumZone{
 constructor(){
  const s=this.scene=baseScene(.012);this.root=new THREE.Group();s.add(this.root);
  box(s,[32,.2,20],[0,-.2,0],material(0x122634));
  for(let x=-14;x<=14;x+=2)line(s,[[x,0,-9],[x,0,9]],0x214353,.5);
  for(let z=-8;z<=8;z+=2)line(s,[[-14,0,z],[14,0,z]],0x214353,.5);
  // Recognisable rotating radar antenna: pedestal, yoke, concave dish, feed horn.
  this.radar=new THREE.Group();this.radar.position.set(-4,0,0);s.add(this.radar);
  box(this.radar,[2.8,.3,2.8],[0,.1,0],material(0x3c5264));
  box(this.radar,[.4,2.8,.4],[0,1.5,0],material(0x8196a4));
  this.dish=new THREE.Group();this.dish.position.y=3.2;this.radar.add(this.dish);
  const geo=new THREE.SphereGeometry(2,32,18,0,Math.PI*2,0,Math.PI*.36);
  const dish=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:0x8098ac,metalness:.7,roughness:.4,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:1,polygonOffsetUnits:1}));dish.rotation.x=Math.PI/2;this.dish.add(dish);
  this.dish.add(new THREE.LineSegments(new THREE.WireframeGeometry(geo),new THREE.LineBasicMaterial({color:P.cyan,transparent:true,opacity:.2})));this.dish.children[1].rotation.x=Math.PI/2;
  line(this.dish,[[-1.4,0,-.4],[0,0,-3],[1.4,0,-.4]],P.amber);box(this.dish,[.22,.22,.35],[0,0,-2.8],glow(P.amber));
  this.waves=[];for(let i=0;i<4;i++){const r=ring(s,1,[-3,3,-2],P.red,.022);this.waves.push(r);}
  this.ap=new THREE.Group();this.ap.position.set(5,0,0);s.add(this.ap);
  box(this.ap,[2,.3,2],[0,3.1,0],material(0xd1e6eb),.12);this.lamp=box(this.ap,[.7,.04,.03],[0,3.13,1.02],glow(P.cyan));
  this.cell=coverage(this.ap,[0,0,0],4.3);this.cell.root.scale.y=.8;
  this.sign=display(this.ap,3.5,.875,[-.1,1.4,2],labelTexture('AP-02 / CH 52','SAME BSSID'));
  this.monitor=labelTexture('AP-02 / CH 52','DFS / RADAR MONITORING','#69d8e8');
  this.signs=[labelTexture('AP-02 / CH 52','DFS / RADAR DETECTED','#ff8580'),labelTexture('AP-02 / CH 36','CHANNEL SWITCH COMPLETE','#75e0bf')];
  this.bins=[];
  for(let i=0;i<48;i++){const m=box(this.root,[.24,1,.8],[-8+i*.34,.5,0],glow(i%5===0?P.amber:P.cyan,.55));this.bins.push(m);}
  this.curves=[];for(let k=0;k<3;k++){const pts=[];for(let i=0;i<=100;i++){const x=-8+i*.16;pts.push([x,1+Math.exp(-Math.pow((x-(k-1)*4)/2.1,2))*3,k*1.7-2]);}this.curves.push(line(this.root,pts,[P.cyan,P.amber,P.green][k]));}
 }
 update(t,a,tl,shot){
  const dfs=['dfs','radar'].includes(shot.camera),{moved:switched,detected}=dfsState(t,shot.camera==='radar');
  this.radar.visible=dfs;this.ap.visible=dfs;this.root.visible=!dfs;
  this.dish.rotation.y=t*2.8;this.dish.rotation.z=-.25;
  this.waves.forEach((r,i)=>{r.visible=dfs;const q=(t*1.4+i*.25)%1;r.position.set(-3+q*7,3,0);r.rotation.y=Math.PI/2;r.scale.setScalar(.4+q*2);r.material.transparent=true;r.material.opacity=(1-q)*.6;});
  this.sign.material.map=detected?this.signs[switched?1:0]:this.monitor;this.lamp.material.color.setHex(switched?P.green:detected?P.red:P.cyan);
  const col=switched||!detected?P.cyan:P.amber;this.cell.dome.material.color.setHex(col);this.cell.dome.material.opacity=.07;this.cell.hoops.forEach(h=>{h.material.color.setHex(col);h.scale.setScalar(1+.06*tl.attack(t));});
  this.bins.forEach((m,i)=>{const h=.4+2.3*Math.exp(-Math.pow((i-24-12*Math.sin(t*2))/8,2))+.8*a.presence_2000_6000_drive*Math.abs(Math.sin(i*1.8+t*8));m.scale.y=h;m.position.y=h/2;});
  this.root.rotation.y=.12*Math.sin(t*2);this.root.position.y=0;
 }
 camera(shot,t){const dfs=['dfs','radar'].includes(shot.camera);return{pos:V(dfs?[10,8,20]:[8,9,17]),target:V(dfs?[0,2,0]:[0,1.5,0]),fov:55-4*Math.exp(-(t-shot.start)*8),roll:0};}
}
