import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,baseScene,floor,box,mat,line,tube,label,routerObject,pool,travel} from '../world.js';
import {clamp,smooth} from '../timeline.js';
import {ROUTERS,P2P,LAN,POS,networkState,selectFlow} from '../protocol-model.js';
export class AtlasZone{
 constructor(){
  this.scene=baseScene();floor(this.scene,58,-1.35);this.root=new THREE.Group();this.scene.add(this.root);
  this.area0=box(this.root,[30,.04,20],[-1.5,-.65,0],new THREE.MeshBasicMaterial({color:P.cyan,transparent:true,opacity:.05,depthWrite:false}));
  line(this.root,[[-16.5,-.60,-10],[13.5,-.60,-10],[13.5,-.60,10],[-16.5,-.60,10],[-16.5,-.60,-10]],P.cyan,.4);label(this.root,'AREA 0','BACKBONE / 0.0.0.0',[-5,.15,9.3],5);
  this.area1=new THREE.Group();this.root.add(this.area1);box(this.area1,[12,.04,14],[19,1.35,0],new THREE.MeshBasicMaterial({color:P.violet,transparent:true,opacity:.07,depthWrite:false}));line(this.area1,[[13,1.4,-7],[25,1.4,-7],[25,1.4,7],[13,1.4,7],[13,1.4,-7]],P.violet,.5);label(this.area1,'AREA 1','0.0.0.1 / INTRA-AREA LSDB',[19,2,6.7],5,'#b39bff');
  this.nodes=ROUTERS.map(r=>routerObject(r.area===1?this.area1:this.root,r.id,r.pos,r.abr?'ABR / TWO LSDBs':r.role||'OSPFv2',r.area===1?P.violet:r.role==='DR'?P.amber:r.role==='BDR'?P.violet:P.cyan));
  this.edges=P2P.map(p=>({p,...tube(p.area?this.area1:this.root,[POS[p.a],POS[p.b]],p.area?P.violet:P.cyan,.035)}));
  const medium=[[-1,0,0],[0,0,-5],[4,0,-5],[8,0,0],[4,0,5],[0,0,5],[-1,0,0]].map(v=>[v[0]+3,.03,v[2]]);line(this.root,medium,P.blue,.6);label(this.root,'BROADCAST','SHARED ETHERNET SEGMENT',[5,.1,7.2],4);
  this.lan=LAN.map(r=>tube(this.root,[POS[r],POS.N0],P.blue,.025));
  this.stub0=tube(this.root,[POS.R4,POS.D0],P.cyan,.028);label(this.root,'192.0.2.0/24','PASSIVE NETWORK / COST 1',POS.D0.map((x,i)=>i===1?x+.7:x),4);
  this.stub1=tube(this.area1,[POS.R8,POS.D1],P.violet,.028);label(this.area1,'198.51.100.0/24','PASSIVE NETWORK / COST 1',[22,3,-3],4,'#b39bff');
  this.costs=P2P.filter(p=>!p.area).map(p=>label(this.root,'COST 10',p.a+' / '+p.b,[(POS[p.a][0]+POS[p.b][0])/2,.4,(POS[p.a][2]+POS[p.b][2])/2],2));
  this.cost25=label(this.root,'COST 25','R1 / R2',[-9,.4,-2.5],2,'#ffb96a');label(this.root,'ABR','AREA 0 ↔ AREA 1',[11,2.2,0],2.9,'#b39bff');this.packets=pool(this.root,120);this.hellos=pool(this.root,36,'diamond');
  this.contours=[];for(let i=0;i<8;i++){const points=[];for(let k=0;k<=100;k++){const th=k/100*Math.PI*2,r=2+i*1.1+.18*Math.sin(th*4+i);points.push([Math.cos(th)*r-3,-.57,Math.sin(th)*r*.62]);}this.contours.push(line(this.root,points,P.blue,.14));}
 }
 update(t,a,tl,shot){
  const n=networkState(t),imp=tl.attack(t),gate=clamp((a.rms_dbfs+50)/22);this.area1.visible=n.multi;this.root.position.set(0,0,0);this.area0.material.opacity=.04+.025*a.bass_60_250_drive;
  this.nodes.forEach((r,i)=>{r.root.visible=i!==7||n.multi;r.root.position.copy(V(ROUTERS[i].pos));r.ring.material.color.setHex(ROUTERS[i].role==='DR'?P.amber:ROUTERS[i].role==='BDR'||i===7?P.violet:P.cyan).multiplyScalar(.6+imp*.7+.22*a.bass_60_250_drive);});
  this.edges.forEach(e=>{const failed=e.p.id==='P3'&&n.linkDown;e.mesh.material.color.setHex(failed?P.red:e.p.area?P.violet:P.cyan).multiplyScalar(failed?.22:.32+.35*a.bass_60_250_drive);});
  this.costs.forEach((l,i)=>{l.visible=t>=55.18&&(i!==0||n.cost12===10);});this.cost25.visible=t>=55.18&&n.cost12===25;
  const paths=n.route.paths;let count=0;
  if(paths.length){for(let i=0;i<72;i++){const flow=i%4,hop=selectFlow(flow,n.route.nextHops);let path=paths.find(p=>p[1]===hop)||paths[0];
   if(i>=48&&n.area1Full){path=n.interArea.paths.find(p=>p[1]===hop)||n.interArea.paths[0];}if(!path)continue;if(n.linkDown&&path.includes('R2')&&path.includes('R4'))path=['R1','R2'];
   const points=path.map(id=>POS[id]);const u=(t*.36+Math.floor(i/4)/18)%1,pos=travel(points,u);pos.y+=.66;this.packets.set(count++,pos,[P.cyan,P.amber,P.violet,P.green][flow],gate*(.75+.15*imp),t*.6+flow);
  }}
  if(shot.mode==='drother-data')for(let i=0;i<12;i++){const p=travel([POS.R6,POS.N0,POS.R7],(t*.65+i/12)%1);p.y+=.72;this.packets.set(count++,p,P.green,gate,t);}
  this.packets.done(count);
  let h=0;for(const p of P2P){if(p.area&&!n.multi||p.id==='P3'&&n.linkDown)continue;for(let i=0;i<4;i++){const pts=i%2?[POS[p.b],POS[p.a]]:[POS[p.a],POS[p.b]],v=travel(pts,(t*.22+i*.25)%1);v.y+=1.0;this.hellos.set(h++,v,P.amber,gate*(.55+.25*imp),t);}}
  for(const r of LAN){const v=travel([POS[r],POS.N0],(t*.28+LAN.indexOf(r)*.25)%1);v.y+=.8;this.hellos.set(h++,v,P.amber,gate*.7,t);}this.hellos.done(h);
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),m=shot.camera;let pos,target=[-1,0,0],fov=46;
  if(m==='opening'){pos=[19-u*5,19-u*3,35-u*4];target=[-2,-.4,0];}
  else if(m==='areas'||m==='final'){const v=m==='final'?smooth(171.671,181.080979167,t):u,expand=m==='final'?2*smooth(174.7,175.2,t):0;pos=[16+v*4,22+v*2,43+v*3+expand];target=[5,0,0];fov=46;}
  else if(m==='border'){pos=[14+u*2,10,25-u*2];target=[14,1,0];fov=48;}
  else if(m==='lan'||m==='bdr'){pos=[12+u*2,11,20-u*2];target=m==='bdr'?[5,0,-3]:[5,0,0];}
  else if(m==='local'){pos=[10+u,8,16-u*2];target=[7,0,2];fov=45;}
  else if(m==='fault'){pos=[-2+u*3,9,17-u*3];target=[-3,0,-2.5];}
  else if(m==='chase'){const n=networkState(t),path=n.route.paths[0]||['R1','R2','R4'],v=travel(path.map(id=>POS[id]),.12+.62*u);pos=[v.x+5,v.y+5.5,v.z+11];target=[v.x+1,v.y+.25,v.z];fov=53;}
  else if(m==='orbit'){const theta=.15+u*.62;pos=[Math.sin(theta)*32,18,Math.cos(theta)*32];target=[-1,0,0];}
  else if(m==='rise'){pos=[13-u*2,12+u*7,26+u*7];target=[-1,0,0];}
  else{pos=[17-u*3,17,34-u*3];}
  return{pos:V(pos),target:V(target),fov};
 }
}
