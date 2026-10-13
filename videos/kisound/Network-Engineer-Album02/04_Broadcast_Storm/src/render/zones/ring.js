// The fixed switch triangle: SW1, SW2, SW3 as hangars at the corners, glass link tubes with port numbers, the stray red
// patch SW3/24 ↔ SW1/24, VLAN 120 as a narrow yellow light floor, hosts behind each switch. Copies of the broadcasts are
// flat carriers with a white header and a yellow payload core; B-001's copies carry a cinematic lineage tag.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,label,instanced,canvasTexture,tube,cachedTexture} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {SWITCHES,PORT_POS,PORT_LABEL,RING_PTS,PERIM,ringPoint,FABRIC_MID,HOSTS,BROADCASTS,COPIES,copyPos,copyAlive,hostLeg,passes,BRANCH_DUR,RING_CLOSED,PORT_DOWN,UNICAST,ringClosed,tau,random} from '../model.js';
const B001=COPIES.filter(c=>c.b.id==='B-001');
const BRANCHES=B001.flatMap(c=>passes(c,0,64).map(p=>({...p,c})));
const unicastPts=u=>{const h=HOSTS.H1.pos,r=HOSTS.R1.pos,pts=[h];for(let s=FABRIC_MID.SW1;s<=FABRIC_MID.SW2;s+=1.5)pts.push(ringPoint(s));pts.push(ringPoint(FABRIC_MID.SW2),r);return pts;};
function along(pts,u){const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1],pts[i][2]-pts[i-1][2]));const s=clamp(u)*L.at(-1);let i=1;while(i<L.length-1&&L[i]<s)i++;const k=(s-L[i-1])/(L[i]-L[i-1]||1),a=pts[i-1],b=pts[i];return[a[0]+(b[0]-a[0])*k,a[1]+(b[1]-a[1])*k,a[2]+(b[2]-a[2])*k];}
export class RingZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x02040a);s.fog=new THREE.FogExp2(0x02040a,.012);
  s.add(new THREE.HemisphereLight(0x6f8fc0,0x05070c,1.0));const key=new THREE.DirectionalLight(0xbfd6ff,1.1);key.position.set(10,30,25);s.add(key);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(160,160),mat(0x060a12,{roughness:.35,metalness:.7}));floor.rotation.x=-Math.PI/2;s.add(floor);
  const grid=[];for(let x=-80;x<=80;x+=2.5)grid.push(x,.01,-80,x,.01,80);for(let z=-80;z<=80;z+=2.5)grid.push(-80,.01,z,80,.01,z);s.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(grid,3)),new THREE.LineBasicMaterial({color:0x11263b,transparent:true,opacity:.45,depthWrite:false})));
  // racks in the background (the room of the cover)
  const rackTex=canvasTexture(256,512,(c,w,h)=>{c.fillStyle='#0a1118';c.fillRect(0,0,w,h);for(let i=0;i<20;i++){const y=12+i*24.5;c.fillStyle='#131e2a';c.fillRect(10,y,236,20);for(let k=0;k<6;k++){const r=random(i*9+k);c.fillStyle=r<.4?'#3f9fff':r<.6?'#2fbf71':'#1b2733';c.fillRect(160+k*13,y+7,6,6);}}});
  const rackM=new THREE.MeshStandardMaterial({map:rackTex,emissiveMap:rackTex,emissive:0xffffff,emissiveIntensity:.7,roughness:.5,metalness:.4});
  const racks=instanced(s,new THREE.BoxGeometry(2,8,2.4),rackM,70);racks.begin();for(let i=0;i<70;i++){const a=i/70*Math.PI*2;racks.push(new THREE.Vector3(Math.cos(a)*48,4,1+Math.sin(a)*44),0xffffff,1,new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),-a-Math.PI/2));}racks.end();
  // VLAN 120 light floor along the ring, other VLANs faint and blue beside it
  this.vlan=additive(P.yellow,.35);const ringLoop=[];for(let i=0;i<=120;i++){const p=ringPoint(i/120*PERIM);ringLoop.push(V([p[0],.03,p[2]]));}
  const strip=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ringLoop,true),240,.35,4,true),this.vlan);strip.scale.y=.08;s.add(strip);
  const other=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ringLoop.map(p=>p.clone().multiplyScalar(1.08)),true),240,.12,4,true),additive(0x2d6fd0,.25));other.scale.y=.08;s.add(other);
  label(s,'VLAN 120','gelb · nur dieses VLAN betroffen',[0,.6,4],3.2,'#ffe58a');
  // switches
  this.sw={};const panel=id=>canvasTexture(1400,520,(c,w,h)=>{c.fillStyle='#1a222c';c.fillRect(0,0,w,h);c.font='600 64px "Space Grotesk"';c.fillStyle='#d8e6ef';c.fillText(id,40,80);c.font='30px "JetBrains Mono"';c.fillStyle='#8fa7b8';c.fillText('IOS XE · 48 × 1G · VLAN 120: STP aus',220,78);
   for(let r=0;r<2;r++)for(let k=0;k<24;k++){const x=60+k*54,y=170+r*130;c.fillStyle='#0b0f14';c.fillRect(x,y,42,40);c.strokeStyle='#4a5a6a';c.lineWidth=2;c.strokeRect(x,y,42,40);c.font='18px "JetBrains Mono"';c.fillStyle='#6f8394';c.fillText(String(r*24+k+1),x+6,y+64);}});
  for(const[id,w]of Object.entries(SWITCHES)){const g=new THREE.Group();g.position.set(...w.corner);g.rotation.y=Math.atan2(w.normal[0],w.normal[2]);s.add(g);
   box(g,[12,5,6],[0,2.5,0],mat(0x2c3a4a,{metalness:.6,roughness:.4}));const fl=new THREE.PointLight(0xbfd6ff,14,16,1.4);fl.position.set(0,4,8);g.add(fl);const pt=panel(id),f=new THREE.Mesh(new THREE.PlaneGeometry(12,4.4),new THREE.MeshStandardMaterial({map:pt,emissiveMap:pt,emissive:0xffffff,emissiveIntensity:.35,roughness:.45,metalness:.5}));f.position.set(0,2.5,3.02);g.add(f);
   const leds=instanced(g,new THREE.BoxGeometry(.12,.08,.03),glow(0xffffff),48);leds.mesh.position.set(0,0,3.06);const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(12.04,5.04,6.04)),new THREE.LineBasicMaterial({color:0x5f8fb0,toneMapped:false}));edge.position.y=2.5;g.add(edge);
   label(s,id,'',[w.corner[0],6.4,w.corner[2]],2.2);this.sw[id]={g,leds,edge};}
  // ports, link tubes and the stray patch
  this.portMats={};for(const[k,p]of Object.entries(PORT_POS)){const m=glow(P.ok,1.1);box(s,[.6,.6,.6],p,m);this.portMats[k]=m;label(s,PORT_LABEL[k],'',[p[0],p[1]+1.3,p[2]],2.3,k.endsWith('24')?'#ffb0b8':'#d8e6ef');}
  for(const[a,b]of[['SW1-1','SW2-1'],['SW2-2','SW3-1']]){const pa=V(PORT_POS[a]),pb=V(PORT_POS[b]),mid=pa.clone().lerp(pb,.5).add(new THREE.Vector3(0,1.2,0));const curve=new THREE.QuadraticBezierCurve3(pa,mid,pb);s.add(new THREE.Mesh(new THREE.TubeGeometry(curve,40,.42,10,false),additive(0x9fc8ff,.12)));}
  this.patchMat=new THREE.MeshStandardMaterial({color:0xd8222e,emissive:0x7a0d14,emissiveIntensity:.8,roughness:.4});this.patch=null;this.patchGeoCache=new Map();
  this.patchLabel=label(s,'PATCH-UNPLANNED-TO-SW1','Fehlpatch SW3/24 ↔ SW1/24',[0,0,0],3.6,'#ffb0b8');
  // hosts
  for(const[id,h]of Object.entries(HOSTS)){box(s,[1.4,2.6,1.4],[h.pos[0],1.3,h.pos[2]],mat(0x13202e,{metalness:.5}));box(s,[1,.5,.05],[h.pos[0],2.2,h.pos[2]+.72],glow(0x9fd0ff,.6));label(s,id,`${h.ip}${h.gw?' · Gateway':''}`,[h.pos[0],3.8,h.pos[2]],2.4);}
  // copies, branches, tests
  this.heads=instanced(s,new THREE.BoxGeometry(1.3,.08,.9),glow(0xffffff),420);this.cores=instanced(s,new THREE.BoxGeometry(.6,.22,.5),additive(0xffffff),420);
  this.tagA=label(s,'B-001/a','',[0,0,0],2.4,'#fff3c4');this.tagB=label(s,'B-001/b','',[0,0,0],2.4,'#fff3c4');this.tagU=label(s,'Unicast','',[0,0,0],2.6,'#d8ffe9');
  // search light (a mounted test light, no person)
  this.spot=new THREE.SpotLight(0xfff2d0,0,40,.18,.5,1.2);this.spot.position.set(0,14,22);s.add(this.spot,this.spot.target);this.cone=new THREE.Mesh(new THREE.ConeGeometry(2.6,16,32,1,true),additive(0xfff2d0,0));s.add(this.cone);
 }
 patchCurve(t){
  // SW1 end always plugged; the SW3 end hangs loose until it clicks in at RING_CLOSED.
  const a=V(PORT_POS['SW1-24']),b=V(PORT_POS['SW3-24']),k=smooth(10.6,RING_CLOSED,t),loose=b.clone().add(new THREE.Vector3(-3.5,-1.6,3.5)),end=loose.lerp(b,k);
  const mid=a.clone().lerp(end,.5).add(new THREE.Vector3(0,-1.4,2.4));return new THREE.QuadraticBezierCurve3(a,mid,end);
 }
 update(t,a,tl,shot){
  const beat=tl.attack(t),drop=tl.drop(t),closed=ringClosed(t),key=Math.round(smooth(10.6,RING_CLOSED,t)*40);
  if(!this.patchGeoCache.has(key)){this.patchGeoCache.set(key,new THREE.TubeGeometry(this.patchCurve(t),40,.14,8,false));}
  if(!this.patch){this.patch=new THREE.Mesh(this.patchGeoCache.get(key),this.patchMat);this.scene.add(this.patch);}else this.patch.geometry=this.patchGeoCache.get(key);
  this.patchMat.emissiveIntensity=t>=PORT_DOWN?.15:closed?.9+.5*beat:.5;const pc=this.patchCurve(t).getPoint(.5);this.patchLabel.position.set(pc.x,pc.y+1.6,pc.z);
  this.patchLabel.material.map=cachedTexture(t>=PORT_DOWN?'Gi1/0/24 · administratively down':'PATCH-UNPLANNED-TO-SW1',t>=PORT_DOWN?'Ring offen · Kabel steckt noch':t<RING_CLOSED?'loses Kabel · Kette noch offen':'schliesst den Ring in VLAN 120',t>=PORT_DOWN?'#9fe8c0':'#ffb0b8');
  setGlow(this.vlan,P.yellow,.25+(closed&&t>25?.25+.35*Math.min(1,COPIES.length&&tl.drop(t)+.5):0));
  for(const[k,m]of Object.entries(this.portMats)){const down=k==='SW3-24'&&t>=PORT_DOWN,up=k.endsWith('24')?(t>=RING_CLOSED&&!down)||(k==='SW1-24'):true;setGlow(m,down?P.red:up?P.ok:0x334455,down?1:up?1+.6*beat:.4);}
  // physical link lamps stay green during the storm (links are up – that is the point)
  for(const[id,w]of Object.entries(this.sw)){w.leds.begin();for(let i=0;i<48;i++){const x=-5.8+(i%24)*.47+.2,y=2.5+.95-(Math.floor(i/24))*1.1;const busy=t>40&&t<PORT_DOWN+8?.6+.4*(random(i+Math.floor(t*14))>.5):.3+.7*(random(i+Math.floor(t*3))>.7);w.leds.push(new THREE.Vector3(x,y,0),i%24<12||i===23||i===0?P.ok:0x2a3a48,1,null,busy*1.6);}w.leds.end();w.edge.material.color.setHex(t>60&&t<PORT_DOWN?0xff6070:0x5f8fb0);}
  // copies
  this.heads.begin();this.cores.begin();const tags={a:null,b:null};
  for(const c of COPIES){if(!copyAlive(c,t))continue;const p=V(copyPos(c,t)),isB=c.b.id==='B-001';this.heads.push(p,0xffffff,isB?1.3:.85,null,isB?1.5:.42);this.cores.push(p.clone().add(new THREE.Vector3(0,.15,0)),P.yellow,isB?1.3:.85,null,isB?1.6:.32);if(isB)tags[c.dir]=p;if(this.heads.size>=300)break;}
  for(const b of BROADCASTS){const p=hostLeg(b,t);if(!p)continue;const v=V(p);this.heads.push(v,0xffffff,b.id==='B-001'?1.3:.8,null,1.4);this.cores.push(v.clone().add(new THREE.Vector3(0,.15,0)),P.yellow,b.id==='B-001'?1.3:.8,null,1.8);if(b.id==='B-001')tags.a=tags.b=null,this.tagA.position.copy(v).add(new THREE.Vector3(0,1.3,0)),this.tagA.material.map=cachedTexture('B-001','ARP-Broadcast von H1','#fff3c4'),this.tagA.userData.alpha=1;}
  for(const br of BRANCHES){if(t<br.t||t>br.t+BRANCH_DUR)continue;const f=ringPoint(FABRIC_MID[br.sw]),u=(t-br.t)/BRANCH_DUR;for(const h of Object.values(HOSTS).filter(h=>h.sw===br.sw)){const p=V([lerp(f[0],h.pos[0],u),lerp(f[1],h.pos[1],u)+.6*Math.sin(u*Math.PI),lerp(f[2],h.pos[2],u)]);this.heads.push(p,0xffffff,.7,null,1.2);this.cores.push(p.clone().add(new THREE.Vector3(0,.12,0)),P.yellow,.7,null,1.4);}}
  this.heads.end();this.cores.end();
  const hostLegActive=BROADCASTS[0]&&hostLeg(BROADCASTS[0],t);
  if(!hostLegActive){for(const d of['a','b']){const tag=d==='a'?this.tagA:this.tagB,p=tags[d];tag.userData.alpha=p?1:0;if(p){tag.position.copy(p).add(new THREE.Vector3(0,1.4,0));tag.material.map=cachedTexture(`B-001/${d}`,'Kopie · gleicher Header','#fff3c4');}}}else this.tagB.userData.alpha=0;
  // unicast tests
  this.tagU.userData.alpha=0;for(const u of UNICAST){if(t<u.t0||t>u.t1+.8)continue;const pts=unicastPts(u),k=u.ok?(t<(u.t0+u.t1)/2?(t-u.t0)/((u.t1-u.t0)/2):1-(t-(u.t0+u.t1)/2)/((u.t1-u.t0)/2)):Math.min(.42,(t-u.t0)/(u.t1-u.t0)*.42),p=V(along(pts,k));
   this.tagU.position.copy(p).add(new THREE.Vector3(0,1.4,0));this.tagU.userData.alpha=1;this.tagU.material.map=cachedTexture(u.ok?(t<(u.t0+u.t1)/2?'Unicast-Test → 192.0.2.1':'Antwort ← 192.0.2.1'):'Unicast-Test',u.ok?'offene Kette, kein Storm-Frame':t>u.t1-.6?'verworfen · Queue voll':'hinter den Kopien','#d8ffe9');}
  // search light: sweeps the ring ports and settles on the stray patch
  const searching=shot.camera==='search';this.spot.intensity=searching?60:0;setGlow(this.cone.material,0xfff2d0,searching?.05:0);
  if(searching){const p24=V(PORT_POS['SW3-24']),k=shot.mode==='search3'?smooth(shot.start,shot.end-.8,t):(Math.sin((t-shot.start)*1.3)*.5+.5);const tg=V(ringPoint(lerp(10,PERIM*.94,k)));if(shot.mode==='search3')tg.lerp(p24,k);
   this.spot.target.position.copy(tg);const dir=tg.clone().sub(this.spot.position),len=dir.length();this.cone.scale.set(1,len/16,1);this.cone.position.copy(this.spot.position).addScaledVector(dir,.5);this.cone.quaternion.setFromUnitVectors(new THREE.Vector3(0,-1,0),dir.normalize());}
 }
 chaseTarget(id,t){
  if(id==='B001'){const p=hostLeg(BROADCASTS[0],t);if(p)return{p:V(p),h:V(ringPoint(FABRIC_MID.SW1)).sub(V(HOSTS.H1.pos)).normalize()};id='B001a';}
  if(id==='U2'){const u=UNICAST[1],pts=unicastPts(u),k=t<(u.t0+u.t1)/2?(t-u.t0)/((u.t1-u.t0)/2):1-(t-(u.t0+u.t1)/2)/((u.t1-u.t0)/2),p=V(along(pts,clamp(k))),q=V(along(pts,clamp(k+.02)));return{p,h:q.sub(p).normalize()};}
  let c=id==='B001b'?B001[1]:B001[0];if(id==='LAST'){c=COPIES.filter(x=>x.end.t>t-.2).sort((a,b)=>b.end.t-a.end.t)[0]||c;}
  const tt=Math.min(t,c.end.t-.01),p=V(copyPos(c,tt)),q=V(copyPos(c,tt+.06));const h=q.sub(p);if(h.lengthSq()<1e-6)h.set(1,0,0);return{p,h:h.normalize()};
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),m=shot.mode;
  switch(shot.camera){
   case'port':{const k=shot.target.slice(2),p=V(PORT_POS[k]),sw=SWITCHES[k.split('-')[0]],n=V(sw.normal),tg=V(sw.tangent).multiplyScalar(k.endsWith('24')||k==='SW2-2'?1:-1);
    const pos=p.clone().addScaledVector(n,lerp(7,3.2,u)).addScaledVector(tg,lerp(2.4,1,u)).add(new THREE.Vector3(0,lerp(2.2,.9,u),0));return look(pos,p.clone().add(new THREE.Vector3(0,-.2,0)),46);}
   case'fabric':{const id=shot.target.slice(2),{p,h}=this.chaseTarget(id,t),side=new THREE.Vector3(-h.z,0,h.x);return look(p.clone().addScaledVector(h,-5).add(new THREE.Vector3(0,2.2,0)).addScaledVector(side,1.8),p.clone().addScaledVector(h,4),65);}
   case'search':return look([lerp(-6,6,u),lerp(16,13,u),lerp(32,28,u)],[0,1.5,6],46);
   case'crane':default:{
    if(m==='cable')return look([lerp(-2,2,u),6,lerp(26,22,u)],[0,1.2,12],46);
    if(m==='lapcam'||m==='loop'){const a=lerp(0,Math.PI*.8,lin)+(m==='loop'?2:0);return look([Math.sin(a)*25,13,1+Math.cos(a)*24],[0,1.5,1],53);}
    if(m==='end')return look([0,lerp(30,40,lin),lerp(36,46,lin)],[0,0,0],53);
    const k=+shot.id.slice(1)%4,a=k*.6-.9+lerp(-.15,.15,u);return look([Math.sin(a)*27,lerp(17,14,u),1+Math.cos(a)*26],[0,1.5,1],53);}
  }
 }
}
