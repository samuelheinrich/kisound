import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,baseScene,floor,box,mat,glow,line,label,travel} from '../world.js';
import {clamp} from '../timeline.js';
import {networkState,DEVICES,lldpNeighbours} from '../protocol-model.js';
export class ControlZone{
 constructor(){
  this.scene=baseScene();floor(this.scene,28,-1.8);
  this.matrix=new THREE.Group();this.scene.add(this.matrix);box(this.matrix,[12,.26,6],[0,-.1,0],mat(0x163044));
  this.canvas=document.createElement('canvas');this.canvas.width=1536;this.canvas.height=768;this.texture=new THREE.CanvasTexture(this.canvas);this.texture.colorSpace=THREE.SRGBColorSpace;
  this.display=new THREE.Mesh(new THREE.PlaneGeometry(11.8,5.9),new THREE.MeshBasicMaterial({map:this.texture,toneMapped:false}));this.display.rotation.x=-Math.PI/2;this.display.position.y=.045;this.matrix.add(this.display);this.lastKey='';
  this.columns=[];for(let i=0;i<32;i++){const x=-5.45+(i%8)*1.56,z=-2.55+Math.floor(i/8)*1.7;this.columns.push(box(this.matrix,[.12,.45,.12],[x,.4,z],glow(P.cyan)));}
  this.tree=new THREE.Group();this.scene.add(this.tree);this.nodes=[];
  for(const d of DEVICES){const pos=d.id==='SW-01'?[0,0,-3]:d.id==='SW-02'?[-4,0,3]:[4,0,3];const node=box(this.tree,[2.5,.55,1.8],pos,mat(0x29495d));label(this.tree,d.id,`BID ${d.priority} / ${d.mac.slice(-5)}`,[pos[0],1.1,pos[2]],3);this.nodes.push(pos);}
  this.lines=[line(this.tree,[this.nodes[0],this.nodes[1]],P.cyan),line(this.tree,[this.nodes[0],this.nodes[2]],P.cyan),line(this.tree,[this.nodes[1],this.nodes[2]],P.amber,.23)];
  this.crown=new THREE.Mesh(new THREE.TorusGeometry(1.8,.04,6,48),glow(P.amber));this.crown.rotation.x=-Math.PI/2;this.crown.position.set(0,.65,-3);this.tree.add(this.crown);
  this.markers=[];for(let i=0;i<12;i++){const b=new THREE.Mesh(new THREE.OctahedronGeometry(.15),glow(P.amber));this.tree.add(b);this.markers.push(b);}
 }
 paint(t,shot){
  const n=networkState(t),mode=shot.mode,key=JSON.stringify([mode,n.macEntries,n.lacp,n.hostAPort,n.port]);if(key===this.lastKey)return;this.lastKey=key;
  const g=this.canvas.getContext('2d');g.fillStyle='#081725';g.fillRect(0,0,1536,768);g.strokeStyle='#244d61';g.lineWidth=3;
  for(let y=180;y<700;y+=88){g.beginPath();g.moveTo(35,y);g.lineTo(1500,y);g.stroke();}
  g.fillStyle='#64daed';g.font='500 46px "Space Grotesk"';g.fillText(mode==='lldp'?'LLDP / DIRECT NEIGHBOURS':mode==='lacp'?'LACP / LOGICAL LINK':'MAC ADDRESS TABLE',46,68);
  g.font='28px "JetBrains Mono"';g.fillStyle='#83a8bd';g.fillText(mode==='lldp'?'LOCAL PORT          DEVICE          REMOTE PORT':mode==='lacp'?'ACTOR       PARTNER                         MEMBERS':'VLAN       SOURCE ADDRESS              PORT',46,142);
  const rows=mode==='lldp'?lldpNeighbours('SW-01').map(r=>[String(r.localPort),r.device,String(r.remotePort)]):mode==='lacp'?[['SW-01','SW-02','25 / 27']]:n.macEntries.map(e=>[String(e.vlan).padEnd(8),e.mac,`P${e.port}`]);
  rows.forEach((r,i)=>{g.font='32px "JetBrains Mono"';g.fillStyle=n.loop?'#ff747a':'#e1eff6';g.fillText(r[0],48,240+i*88);g.fillText(r[1],mode==='lacp'?380:320,240+i*88);g.fillStyle=mode==='lldp'?'#80e3bd':'#ffb96a';g.fillText(r[2],1250,240+i*88);});
  g.font='24px "JetBrains Mono"';g.fillStyle='#9ab7c9';g.fillText(mode==='lldp'?'CHASSIS ID / PORT ID / TTL':mode==='lacp'?'PO-01 / '+n.lacp:n.loop?'MAC FLAP / LOOP DEMO':'LEARN SOURCE / LOOK UP DESTINATION',46,723);this.texture.needsUpdate=true;
 }
 update(t,a,tl,shot){
  this.paint(t,shot);const root=['stp','bpdu','recover'].includes(shot.mode);this.tree.visible=root;this.matrix.visible=!root;const pulse=tl.attack(t);
  this.columns.forEach((m,i)=>{const h=.2+((i*7)%11)/11*a.bass_60_250_drive*1.2+pulse*.22;m.scale.y=h/.45;m.position.y=.2+h/2;m.material.color.setHex(networkState(t).loop?P.red:i%5===0?P.amber:P.cyan);});
  this.crown.scale.setScalar(1+pulse*.06);this.lines[2].material.opacity=networkState(t).loop?.9:.23;
  this.markers.forEach((m,i)=>{const b=i%2+1,p=travel([this.nodes[0],this.nodes[b]],(t*.46+i/6)%1);p.y=.9;m.position.copy(p);m.rotation.set(t*2,i,t*.8);});
 }
 camera(shot,t){const u=clamp((t-shot.start)/(shot.end-shot.start));return ['root'].includes(shot.camera)?{pos:V([9-u*3,10,14]),target:V([0,.2,0]),fov:45}:{pos:V([3-u*2,11,12]),target:V([0,0,0]),fov:46};}
}
