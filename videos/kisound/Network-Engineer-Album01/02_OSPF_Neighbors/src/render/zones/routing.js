import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,baseScene,floor,label,tube,routerObject,pool,travel,card} from '../world.js';
import {clamp,smooth} from '../timeline.js';
import {graph,shortest,networkState} from '../protocol-model.js';
const points={R1:[-7,0,0],R2:[-2,0,-4],R3:[-2,0,4],R4:[3,0,0],D0:[7,0,0]};
export class RoutingZone{
 constructor(){this.scene=baseScene();floor(this.scene,28,-1.2);this.root=new THREE.Group();this.scene.add(this.root);this.nodes=['R1','R2','R3','R4'].map(id=>routerObject(this.root,id,points[id],'SPF / LOCAL TREE'));label(this.root,'192.0.2.0/24','COST 1',points.D0.map((v,i)=>i===1?v+1:v),3.9);
  this.edges=[['R1','R2'],['R1','R3'],['R2','R4'],['R3','R4'],['R4','D0']].map(([a,b])=>({a,b,...tube(this.root,[points[a],points[b]],P.cyan,.04)}));
  this.queue=card(this.root,'SPF / DIJKSTRA',[0,5,-4],5.5);this.packets=pool(this.root,48);this.cost=label(this.root,'10 → 25 → 10','CONFIGURED INTERFACE COST',[-4.5,1,-2],3.6,'#ffb96a');this.banners=['ECMP','SPF / DIJKSTRA','SINGLE PATH'].map((name,i)=>label(this.root,name,['EQUAL TOTAL COST / DISTINCT FLOWS','LOCAL ROOT / SUM OF INTERFACE COSTS','CONVERGED / NEXT HOP R3'][i],[0,-.3,6],7));
 }
 update(t,a,tl,shot){const n=networkState(t),root=shot.mode==='root-r4'?'R4':'R1',s=shortest(graph(t,{root})),gate=clamp((a.rms_dbfs+50)/22),imp=tl.attack(t);
  const running=['spf','root-r1','root-r4'].includes(shot.mode),progress=running?clamp((t-shot.start)/Math.min(2,shot.end-shot.start)):1,steps=s.steps.filter(v=>points[v.node]),visible=Math.ceil(progress*steps.length),visited=new Set(steps.slice(0,visible).map(v=>v.node));
  this.queue.update([['ROOT '+root,'#59d8ed'],...steps.slice(0,4).map((v,i)=>[`${v.node}  COST ${v.cost}`,i<visible?'#80e3bd':'#688395']),[n.route.nextHops.length===2?'R1: TWO NEXT HOPS':'R1: ONE NEXT HOP','#ffb96a']], 'EACH ROUTER RUNS ITS OWN SPF');
  this.nodes.forEach((o,i)=>{const id=['R1','R2','R3','R4'][i];o.ring.material.color.setHex(id===root?P.amber:visited.has(id)?P.green:P.blue).multiplyScalar(.65+imp*.4);});
  this.edges.forEach(e=>{const failed=e.a==='R2'&&e.b==='R4'&&n.linkDown;const selected=s.pred[e.b]?.includes(e.a)||s.pred[e.a]?.includes(e.b);e.mesh.material.color.setHex(failed?P.red:selected?P.green:P.blue).multiplyScalar(failed?.2:selected?.5+imp*.25:.2);});
  this.cost.visible=shot.mode==='cost';const banner=running?1:n.route.nextHops.length===2?0:2;this.banners.forEach((b,i)=>b.visible=i===banner);let k=0;const paths=n.route.paths;
  for(let i=0;i<36&&paths.length;i++){const p=paths[i%paths.length];if(n.linkDown&&p.includes('R2'))continue;const pos=travel(p.map(id=>points[id]),(t*.5+Math.floor(i/paths.length)/18)%1);pos.y+=.65;this.packets.set(k++,pos,i%2?P.violet:P.cyan,gate*(.8+.15*imp),t*.5);}this.packets.done(k);
 }
 camera(shot,t){const u=smooth(shot.start,shot.end,t);return{pos:V(shot.camera==='side'?[12-u*3,12,22-u*3]:[7-u*4,16,25-u*3]),target:V([0,1.3,0]),fov:47};}
}
