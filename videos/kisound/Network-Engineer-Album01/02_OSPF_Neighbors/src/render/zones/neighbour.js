import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,baseScene,floor,line,tube,label,routerObject,pool,travel,card} from '../world.js';
import {clamp,smooth} from '../timeline.js';
import {ROUTERS,neighbour} from '../protocol-model.js';
import {pairFor} from '../overlay.js';
export class NeighbourZone{
 constructor(){
  this.scene=baseScene();floor(this.scene,26,-1.2);this.pairRoot=new THREE.Group();this.matrixRoot=new THREE.Group();this.scene.add(this.pairRoot,this.matrixRoot);
  this.left=ROUTERS.map(r=>routerObject(this.pairRoot,r.id,[-4,0,0],r.rid));this.right=ROUTERS.map(r=>routerObject(this.pairRoot,r.id,[4,0,0],r.rid));
  this.wire=tube(this.pairRoot,[[-4,.6,0],[4,.6,0]],P.cyan,.03);this.hello=card(this.pairRoot,'HELLO / PACKET', [0,3,-1],4.9);this.pack=pool(this.pairRoot,16,'diamond');
  this.states=['DOWN','INIT','2-WAY','EXSTART','EXCHANGE','LOADING','FULL'].map((s,i)=>label(this.pairRoot,s,'',[-6+i*2,0,3],1.8));
  const places=[[-4,0,-3],[4,0,-3],[-4,0,3],[4,0,3]];this.matrix=['R4','R5','R6','R7'].map((id,i)=>routerObject(this.matrixRoot,id,places[i],ROUTERS.find(r=>r.id===id).role,i===0?P.amber:i===1?P.violet:P.cyan));this.links=[];for(let i=0;i<4;i++)for(let j=i+1;j<4;j++)this.links.push({i,j,...tube(this.matrixRoot,[places[i],places[j]],P.cyan,.03)});label(this.matrixRoot,'NEIGHBOURS ≠ ADJACENCIES','DROTHER ↔ DROTHER / 2-WAY',[0,4,0],7);
  this.matrixPackets=pool(this.matrixRoot,24,'diamond');this.places=places;
 }
 update(t,a,tl,shot){
  const isMatrix=['matrix'].includes(shot.camera);this.pairRoot.visible=!isMatrix;this.matrixRoot.visible=isMatrix;const gate=clamp((a.rms_dbfs+50)/22),imp=tl.attack(t);
  const pair=pairFor(shot),p=neighbour(...pair,t);this.left.forEach((r,i)=>r.root.visible=ROUTERS[i].id===pair[0]);this.right.forEach((r,i)=>r.root.visible=ROUTERS[i].id===pair[1]);
  this.hello.update([['ROUTER-ID '+ROUTERS.find(r=>r.id===pair[1]).rid,'#59d8ed'],['AREA '+(p.area===0?'0.0.0.0':'0.0.0.1'),'#c8e4ef'],['NEIGHBOUR LIST','#89a9b9'],[!['Down','Init'].includes(p.state)?ROUTERS.find(r=>r.id===pair[0]).rid:'OWN RID NOT PRESENT',p.state==='Init'?'#ffb96a':'#80e3bd'],[p.state.toUpperCase(),'#ffb96a']], 'TYPE 1 / IP PROTOCOL 89');
  const active=['Down','Init','2-Way','ExStart','Exchange','Loading','Full'].indexOf(p.state);this.states.forEach((s,i)=>{s.material.color.setHex(i===active?P.amber:i<active?P.green:P.blue);s.scale.set(1.8*(i===active?1.13:1),.3375*(i===active?1.13:1),1);});
  for(let i=0;i<12;i++){const reverse=i%2,pts=reverse?[[4,.9,0],[-4,.9,0]]:[[-4,.9,0],[4,.9,0]],pos=travel(pts,(t*.32+i/12)%1);this.pack.set(i,pos,reverse?P.green:P.amber,gate*(.8+imp*.2),t);}this.pack.done(12);
  let k=0;for(const e of this.links){const ids=['R4','R5','R6','R7'],q=neighbour(ids[e.i],ids[e.j],t),col=q.state==='Full'?P.green:q.state==='2-Way'?P.cyan:P.amber;e.mesh.material.color.setHex(col).multiplyScalar(.25+.35*a.bass_60_250_drive);for(let j=0;j<3;j++){const pos=travel([this.places[e.i],this.places[e.j]],(t*.35+j/3)%1);pos.y+=.6;this.matrixPackets.set(k++,pos,col,gate*.8,t);}}this.matrixPackets.done(k);
 }
 camera(shot,t){const u=smooth(shot.start,shot.end,t);if(shot.camera==='matrix')return{pos:V([11-u*2,15,18-u*2]),target:V([0,1,0]),fov:44};return{pos:V(shot.camera==='side'?[9-u*2,7,17-u*2]:[6-u*2,6,18-u*3]),target:V([0,1.5,0]),fov:45};}
}
