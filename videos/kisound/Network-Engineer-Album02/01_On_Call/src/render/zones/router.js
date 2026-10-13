// Inside R-EDGE, magnified and in slow motion: port locks, the input check, a routing hall with sliding prefix plates,
// the ACL chamber with ordered rule sheets (bound to Gi0/0/1 by an amber clamp until FIX), three service halls and the
// comparison hall behind Gi0/0/2. A packet is a flat carrier: visible header, closed payload core (empty for SYN).
// A separate rack aisle (x ≈ -300) leads up to the real chassis.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,random,label,cachedTexture,instanced,canvasTexture,dynamicTexture,tube,line} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {ST,STATION_LABEL,ROUTE,RAIL_Y,PREFIXES,prefixFor,ACL_RULES,FIX,OK_A,VERIFY,SERVICES,BY_ID,FLIGHTS,activeFlights,pointAt,headingAt,phase,counter,aclBound,hallActivity,serviceOk,lastDrop} from '../model.js';
const AX=-300,AY=1.75,RY=RAIL_Y;
const at=(n,y=RY)=>new THREE.Vector3(ST[n][0],y,ST[n][2]);
const KIND_COL={syn:P.cyan,synack:P.cyan,icmp:0xbfe8ff,tls:0xdff2ff,data:0xdff2ff,ambient:0x7fa8c0,replay:0xffffff};
const HALLS={A:{size:1},B:{size:1},C:{size:1},D:{size:.8}};
export class RouterZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x02050a);s.fog=new THREE.FogExp2(0x02050a,.016);
  s.add(new THREE.HemisphereLight(0x5b7fae,0x05080e,.9));const key=new THREE.DirectionalLight(0x9ec4ff,.9);key.position.set(-10,18,12);s.add(key);
  this.buildFloor(s);this.buildRails(s);this.buildStations(s);this.buildPlates(s);this.buildAcl(s);this.buildHalls(s);this.buildPackets(s);this.buildAisle(s);
  this.aclLight=new THREE.PointLight(P.red,0,18,1.6);this.aclLight.position.set(5,3.5,1.5);s.add(this.aclLight);
  this.lookLight=new THREE.PointLight(P.cyan,6,16,1.6);this.lookLight.position.set(-12,4,2);s.add(this.lookLight);
  this.hallLight=new THREE.PointLight(P.ok,0,22,1.6);this.hallLight.position.set(34,5,0);s.add(this.hallLight);
 }
 buildFloor(s){
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(160,90),mat(0x060b12,{roughness:.6,metalness:.6}));floor.rotation.x=-Math.PI/2;floor.position.set(-5,0,0);s.add(floor);
  const v=[];for(let x=-80;x<=75;x+=2.5)v.push(x,.01,-45,x,.01,45);for(let z=-45;z<=45;z+=2.5)v.push(-80,.01,z,75,.01,z);
  s.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(v,3)),new THREE.LineBasicMaterial({color:0x123049,transparent:true,opacity:.5,depthWrite:false})));
  // the chassis walls far around: a dark ring of heat-sink fins
  const fins=instanced(s,new THREE.BoxGeometry(.3,9,2.2),mat(0x0b1520,{metalness:.7,roughness:.4}),140);fins.begin();for(let i=0;i<140;i++){const a=i/140*Math.PI*2;fins.push(new THREE.Vector3(-5+Math.cos(a)*62,4.5,Math.sin(a)*40),0xffffff,1,new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),-a));}fins.end();
 }
 buildRails(s){
  this.edges=new Map();for(const chain of Object.values(ROUTE))for(let i=1;i<chain.length;i++){const k=[chain[i-1],chain[i]].sort().join('-');if(this.edges.has(k))continue;const m=additive(P.cyan,.25);tube(s,[at(chain[i-1]),at(chain[i])],m,.05,8);this.edges.set(k,{m,a:chain[i-1],b:chain[i]});}
  // under-rail floor glow strips
  this.strip=additive(P.cyan,.1);for(const e of this.edges.values()){const a=at(e.a,.02),b=at(e.b,.02),len=a.distanceTo(b),m=new THREE.Mesh(new THREE.PlaneGeometry(len,.5),e.stripM=additive(P.cyan,.06));m.position.copy(a).lerp(b,.5);m.rotation.set(-Math.PI/2,0,-Math.atan2(b.z-a.z,b.x-a.x));s.add(m);}
  // recorded trace of F-A1 (dashed), shown after the drop until the fix
  const f=BY_ID.get('FA1'),pts=f.nodes.map(n=>at(n,RY+.55));const g=new THREE.BufferGeometry().setFromPoints(pts);this.trace=new THREE.Line(g,new THREE.LineDashedMaterial({color:0xffffff,dashSize:.6,gapSize:.4,transparent:true,opacity:0,depthWrite:false}));this.trace.computeLineDistances();s.add(this.trace);
 }
 gate(s,n,dir,accent=P.cyan){
  const g=new THREE.Group();g.position.copy(at(n,0));g.rotation.y=-Math.atan2(dir[2],dir[0])+Math.PI/2;s.add(g);const m=mat(0x1a2a3a,{metalness:.7,roughness:.35});
  box(g,[.9,4.6,.9],[-2.6,2.3,0],m);box(g,[.9,4.6,.9],[2.6,2.3,0],m);box(g,[6.1,.8,1],[0,4.9,0],m);const led=glow(accent,1);box(g,[5,.08,.04],[0,4.6,.52],led);box(g,[5,.08,.04],[0,4.6,-.52],led);
  box(g,[1.4,3.8,.25],[-1.7,1.9,0],mat(0x111c27,{metalness:.8,roughness:.3}));box(g,[1.4,3.8,.25],[1.7,1.9,0],mat(0x111c27,{metalness:.8,roughness:.3}));
  const [t1,t2]=STATION_LABEL[n];label(s,t1,t2,at(n,6.1),4.2);return{g,led};
 }
 buildStations(s){
  this.gates={GI000:this.gate(s,'GI000',[1,0,0]),GI001:this.gate(s,'GI001',[1,0,0]),GI002:this.gate(s,'GI002',[ST.GI002[0]-ST.G2[0],0,ST.GI002[2]-ST.G2[2]])};
  // client pedestal with its own small screen
  const c=at('CLIENT',0);box(s,[1.6,2.2,1.6],[c.x-1.6,1.1,c.z],mat(0x142233));this.clientTex=dynamicTexture(512,256);const cs=new THREE.Mesh(new THREE.PlaneGeometry(1.5,.75),new THREE.MeshBasicMaterial({map:this.clientTex.tex,toneMapped:false}));cs.position.set(c.x-1.6,2.6,c.z);cs.rotation.y=Math.PI/2;
  const cs2=cs.clone();cs2.rotation.y=-Math.PI/2+.0;cs2.position.x-=.02;cs.position.x+=.82;s.add(cs);this.clientScreen=cs;label(s,...STATION_LABEL.CLIENT,[c.x-1.6,3.7,c.z],3.6);
  // input check: a scanning ring around the rail
  const p=at('PARSER');this.parserRing=new THREE.Mesh(new THREE.TorusGeometry(1.9,.09,8,48),glow(P.cyan,.8));this.parserRing.position.copy(p);this.parserRing.rotation.y=Math.PI/2;s.add(this.parserRing);
  this.parserInner=new THREE.Mesh(new THREE.TorusGeometry(1.5,.03,6,48,Math.PI*1.3),glow(0xffffff,.6));this.parserInner.position.copy(p);this.parserInner.rotation.y=Math.PI/2;s.add(this.parserInner);
  for(const z of[-2.4,2.4])box(s,[.5,3,.5],[p.x,1.5,z],mat(0x1a2a3a,{metalness:.7}));label(s,...STATION_LABEL.PARSER,[p.x,4.4,0],4);
  // router CPU for local answers
  const cpu=at('CPU',1.6);this.cpu=new THREE.Mesh(new THREE.IcosahedronGeometry(1,1),mat(0x10273a,{emissive:0x0b3550,emissiveIntensity:.6,metalness:.6,roughness:.3,flatShading:true}));this.cpu.position.copy(cpu);s.add(this.cpu);
  this.cpuRing=new THREE.Mesh(new THREE.TorusGeometry(1.6,.04,6,48),additive(P.cyan,.4));this.cpuRing.position.copy(cpu);this.cpuRing.rotation.x=Math.PI/2;s.add(this.cpuRing);label(s,...STATION_LABEL.CPU,[cpu.x,3.8,cpu.z],3.8);
  this.gwNote=label(s,'Vergleichstest: Router antwortet selbst','ping 198.51.100.1 · kein Anwendungstest',[cpu.x+4,4.9,cpu.z-1],5.4,'#bfe8ff');this.gwNote.userData.alpha=0;
 }
 buildPlates(s){
  this.plates=PREFIXES.map(([pfx,via,src],i)=>{const tex=canvasTexture(512,700,(g,w,h)=>{g.fillStyle='#0b1826';g.fillRect(0,0,w,h);g.strokeStyle='#2b5b80';g.lineWidth=6;g.strokeRect(3,3,w-6,h-6);g.font='600 64px "Space Grotesk"';g.fillStyle='#d8eef8';g.fillText(pfx.split('/')[0],30,120);g.font='500 90px "Space Grotesk"';g.fillStyle='#5fe0ff';g.fillText('/'+pfx.split('/')[1],30,220);
    g.font='40px "JetBrains Mono"';g.fillStyle='#93b4c6';g.fillText('via',30,330);g.font='600 56px "JetBrains Mono"';g.fillStyle='#e6f3fa';g.fillText(via,30,400);g.font='36px "JetBrains Mono"';g.fillStyle='#93b4c6';g.fillText(src,30,470);
    g.strokeStyle='#5fe0ff';g.lineWidth=8;g.beginPath();g.moveTo(40,580);g.lineTo(440,580);g.lineTo(400,545);g.moveTo(440,580);g.lineTo(400,615);g.stroke();});
   const m=new THREE.Mesh(new THREE.BoxGeometry(2.4,3.3,.14),[mat(0x13263a),mat(0x13263a),mat(0x13263a),mat(0x13263a),new THREE.MeshStandardMaterial({map:tex,emissiveMap:tex,emissive:0xffffff,emissiveIntensity:.5,roughness:.5}),mat(0x13263a)]);
   const x=-21+i*3.1;m.position.set(x,2.0,5.2);m.rotation.y=Math.PI;m.rotation.y=0;s.add(m);const edge=new THREE.Mesh(new THREE.BoxGeometry(2.5,.06,.18),glow(P.cyan,.3));edge.position.set(x,.32,5.2);s.add(edge);
   // the plate faces -z, towards the rail
   m.rotation.y=Math.PI;return{m,edge,x,i};});
  label(this.scene,'ROUTING-TABELLE','show ip route · gültig',[-16.4,4.6,5.2],4);
  this.lookBeam=new THREE.Mesh(new THREE.BoxGeometry(.06,.06,1),additive(P.cyan,0));this.scene.add(this.lookBeam);
 }
 buildAcl(s){
  const g=this.acl=new THREE.Group();s.add(g);
  this.aclFrameMat=new THREE.LineBasicMaterial({color:P.amber,transparent:true,opacity:.8});const fr=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(8.4,4.4,6)),this.aclFrameMat);fr.position.set(7,2.2,0);g.add(fr);
  this.aclLabel=label(s,'ACL QUARANTINE · out','gebunden an Gi0/0/1 · CHG-2042',[7,5.7,0],4.6,'#ffcf86');this.aclLabelFree=label(s,'Gi0/0/1 · kein ACL-Binding','QUARANTINE bleibt im Regelarchiv',[7,5.7,0],4.6,'#cfe6f2');
  // rule sheets: 10 (deny, with its live counter) and 20 (permit)
  this.sheet10=dynamicTexture(1024,800);const mk=(tex,x,col)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(5.2,4.06),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:.92,side:THREE.DoubleSide,depthWrite:false,toneMapped:false,color:col}));m.position.set(x,2.2,0);m.rotation.y=-Math.PI/2;s.add(m);return m;};
  this.r10=mk(this.sheet10.tex,ST.ACL10[0],0xffffff);
  const t20=canvasTexture(1024,800,(gg,w,h)=>{gg.fillStyle='rgba(14,28,40,.78)';gg.fillRect(0,0,w,h);gg.strokeStyle='#7fa8c0';gg.lineWidth=8;gg.strokeRect(4,4,w-8,h-8);gg.font='600 120px "Space Grotesk"';gg.fillStyle='#cfe6f2';gg.fillText('20',50,160);gg.font='56px "JetBrains Mono"';gg.fillText('permit ip any any',50,300);gg.font='44px "JetBrains Mono"';gg.fillStyle='#7f9db0';gg.fillText('(0 matches)',50,380);});
  this.r20=mk(t20,ST.ACL20[0],0xffffff);
  this.clamp=new THREE.Group();s.add(this.clamp);const cm=glow(P.amber,1.1);box(this.clamp,[5.2,.22,.22],[13.5,5.1,0],cm);box(this.clamp,[.22,.9,.22],[11.1,4.7,0],cm);box(this.clamp,[.22,.9,.22],[15.9,4.7,0],cm);this.clampMat=cm;
  this.clampLabel=label(s,'ip access-group QUARANTINE out','Interface-Bindung',[13.6,6.6,-1.2],4.2,'#ffcf86');
  // the rule archive shelf the sheets move to after the fix
  const sh=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(7,4.6,1.2)),new THREE.LineBasicMaterial({color:0x5a7890,transparent:true,opacity:.6}));sh.position.set(7,8.6,9);s.add(sh);label(s,'REGELARCHIV','gespeicherte ACLs',[7,11.4,9],3.2);
  // the saved change as an object in the room (B04) and the measuring line to the drop point
  this.diffTex=canvasTexture(1024,320,(gg,w,h)=>{gg.fillStyle='rgba(30,20,6,.85)';gg.fillRect(0,0,w,h);gg.strokeStyle='#ffb13d';gg.lineWidth=6;gg.strokeRect(3,3,w-6,h-6);gg.font='600 44px "Space Grotesk"';gg.fillStyle='#ffcf86';gg.fillText('CHG-2042 · Diff',30,70);gg.font='42px "JetBrains Mono"';gg.fillStyle='#cfe6f2';gg.fillText('VORHER: kein Binding',30,150);gg.fillStyle='#ffb13d';gg.fillText('+ ip access-group QUARANTINE out',30,230);});
  this.diffCard=new THREE.Mesh(new THREE.PlaneGeometry(5.6,1.75),new THREE.MeshBasicMaterial({map:this.diffTex,transparent:true,opacity:0,depthWrite:false,toneMapped:false,side:THREE.DoubleSide}));this.diffCard.position.set(13.5,8,3);this.diffCard.rotation.y=-.5;s.add(this.diffCard);
  this.measure=line(s,[[12.2,7.3,3.4],[ST.ACL10[0],RY+.3,.2]],P.amber,0);
 }
 drawSheet10(t){
  const n=counter(t),bound=aclBound(t),hit=lastDrop(t),flash=hit&&t-hit.t1<1.2?1:0;
  this.sheet10.set(`${n}|${bound}|${flash}`,(g,w,h)=>{g.fillStyle=bound?'rgba(60,8,16,.82)':'rgba(30,34,40,.7)';g.fillRect(0,0,w,h);g.strokeStyle=flash?'#ffd0d6':'#ff3b4e';g.lineWidth=flash?14:8;g.strokeRect(5,5,w-10,h-10);
   g.font='600 120px "Space Grotesk"';g.fillStyle='#ffd6dc';g.fillText('10',50,160);g.font='54px "JetBrains Mono"';g.fillText('deny ip any',50,280);g.fillText('198.51.100.0 0.0.0.255',50,350);g.fillText('log',50,420);
   g.font='600 92px "JetBrains Mono"';g.fillStyle=flash?'#ffffff':'#ff8b97';g.fillText(`${n} matches`,50,600);g.font='38px "JetBrains Mono"';g.fillStyle='#ff9aa6';g.fillText(bound?'QUARANTINE · Regel 10 · out Gi0/0/1':'nicht gebunden · im Archiv',50,700);});
 }
 hall(s,svc,pos,size){
  const g=new THREE.Group();g.position.copy(V(pos));g.scale.setScalar(size);s.add(g);const m=mat(0x162636,{metalness:.6,roughness:.4});
  box(g,[7,.3,7],[0,.15,0],mat(0x0d1824));for(const[x,z]of[[-3.3,-3.3],[3.3,-3.3],[-3.3,3.3],[3.3,3.3]])box(g,[.4,5,.4],[x,2.5,z],m);
  const roof=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(7,.3,7)),new THREE.LineBasicMaterial({color:0x3b6a8c}));roof.position.y=5;g.add(roof);box(g,[.3,5,7],[3.5,2.5,0],mat(0x0e1b28,{metalness:.5}));
  // receiving gate facing the incoming rail (-x)
  box(g,[.3,3.6,.3],[-3.5,1.8,-1.4],m);box(g,[.3,3.6,.3],[-3.5,1.8,1.4],m);const gateLed=glow(P.cyan,.6);box(g,[.12,.12,2.8],[-3.5,3.6,0],gateLed);
  const core=new THREE.Mesh(new THREE.CylinderGeometry(.55,.55,3.2,20),mat(0x10273a,{emissive:0x0b2a40,emissiveIntensity:.6,metalness:.6}));core.position.set(.6,1.9,0);g.add(core);
  const rings=[0,1,2].map(i=>{const r=new THREE.Mesh(new THREE.TorusGeometry(1.3+i*.35,.08,8,40,Math.PI*1.5),glow(0x5f8fb0,.5));r.position.set(.6,1+i*.9,0);r.rotation.x=Math.PI/2;g.add(r);return r;});
  const lampMat=glow(P.red,1.2),lamp=new THREE.Mesh(new THREE.SphereGeometry(.38,16,12),lampMat);lamp.position.set(0,5.7,0);g.add(lamp);const halo=new THREE.Mesh(new THREE.SphereGeometry(.9,16,12),additive(P.red,.25));halo.position.copy(lamp.position);g.add(halo);
  label(s,SERVICES[svc].name,`${SERVICES[svc].ip}:443${svc==='D'?' · Vergleich':''}`,[pos[0],7.6*size,pos[2]],3.8);
  return{g,rings,lampMat,halo,gateLed,spin:0};
 }
 buildHalls(s){this.halls={};for(const k of Object.keys(HALLS))this.halls[k]=this.hall(s,k,[ST[k][0]+3,0,ST[k][2]],HALLS[k].size);}
 buildPackets(s){
  this.pool=[];for(let i=0;i<18;i++){const g=new THREE.Group();s.add(g);const solid=mat(0x1a3448,{metalness:.6,roughness:.35,emissive:0x0a2a40,emissiveIntensity:.4,transparent:true});
   const plate=new THREE.Mesh(new THREE.BoxGeometry(1.0,.1,1.7),solid);g.add(plate);const tex=dynamicTexture(512,256);const head=new THREE.Mesh(new THREE.PlaneGeometry(.94,.47),new THREE.MeshBasicMaterial({map:tex.tex,transparent:true,toneMapped:false,depthWrite:false}));head.rotation.x=-Math.PI/2;head.position.set(0,.056,-.55);g.add(head);
   const coreMat=mat(0x0b1622,{metalness:.9,roughness:.15,transparent:true}),core=new THREE.Mesh(new THREE.BoxGeometry(.62,.22,.62),coreMat);core.position.set(0,.16,.32);g.add(core);
   const wire=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.62,.22,.62)),new THREE.LineBasicMaterial({color:P.cyan,transparent:true}));wire.position.copy(core.position);g.add(wire);
   const rim=new THREE.Mesh(new THREE.BoxGeometry(1.06,.04,1.76),additive(P.cyan,.8));rim.position.y=-.04;g.add(rim);
   const tag=new THREE.Sprite(new THREE.SpriteMaterial({map:cachedTexture('F-A1','',''),transparent:true,depthTest:false,depthWrite:false}));tag.position.y=1.15;tag.scale.set(2.2,2.2*192/1024,1);tag.renderOrder=11;g.add(tag);
   this.pool.push({g,plate,solid,head,tex,core,coreMat,wire,rim,tag});}
  this.bits=instanced(s,new THREE.BoxGeometry(.09,.09,.09),additive(0xffffff),240);
 }
 buildAisle(s){
  const g=this.aisle=new THREE.Group();g.position.set(AX,0,0);s.add(g);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(60,10),mat(0x0d141c,{roughness:.5,metalness:.5}));floor.rotation.x=-Math.PI/2;floor.position.set(-28,0,0);g.add(floor);
  const tiles=[];for(let x=-58;x<=0;x+=.6)tiles.push(x,.005,-5,x,.005,5);g.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(tiles,3)),new THREE.LineBasicMaterial({color:0x1b2c3d,transparent:true,opacity:.6})));
  const front=canvasTexture(256,512,(c,w,h)=>{c.fillStyle='#0a1118';c.fillRect(0,0,w,h);for(let i=0;i<20;i++){const y=12+i*24.5;c.fillStyle='#131e2a';c.fillRect(10,y,236,20);for(let k=0;k<5;k++){c.fillStyle=random(i*9+k)<.5?'#3fd0ff':random(i*9+k+1)<.6?'#2fbf71':'#1b2733';c.fillRect(180+k*12,y+7,6,6);}}});
  const rack=new THREE.MeshStandardMaterial({map:front,emissiveMap:front,emissive:0xffffff,emissiveIntensity:.7,roughness:.5,metalness:.4}),side=mat(0x0c131b);
  for(let i=0;i<14;i++)for(const z of[-2.6,2.6]){const m=new THREE.Mesh(new THREE.BoxGeometry(1.2,4.2,1.4),[side,side,side,side,z<0?rack:side,z<0?side:rack]);m.position.set(-56+i*3.6+(z>0?1.2:0)*0,2.1,z+(z<0?-.7:.7));g.add(m);}
  this.aisleLight=new THREE.PointLight(0x6fb0ff,6,20,1.5);this.aisleLight.position.set(-20,4,0);g.add(this.aisleLight);for(let x=-54;x<0;x+=6)box(g,[.5,.04,.5],[x,4.4,0],glow(0x5fa8ff,.5));const endLight=new THREE.PointLight(0x9fd0ff,5,9,1.5);endLight.position.set(-3,3,0);g.add(endLight);
  // the chassis of R-EDGE at the end of the aisle, ports facing the camera
  box(g,[.6,3.2,5],[.3,1.9,0],mat(0x111a24,{metalness:.7,roughness:.35}));label(g,'R-EDGE','IOS XE · SITE-2 edge',[-.4,3.8,0],2.4);
  this.portLeds=[];for(const[z,name,col]of[[-1.2,'Gi0/0/0',P.cyan],[0,'Gi0/0/1',P.amber],[1.2,'Gi0/0/2',P.cyan]]){const m=glow(col,1.2);box(g,[.05,.32,.42],[-.02,AY,z],mat(0x02050a));box(g,[.06,.05,.12],[-.03,AY+.24,z-.1],m);this.portLeds.push(m);label(g,name,'',[-.08,AY-.42,z],.9);}
  this.edgeRing=new THREE.Mesh(new THREE.TorusGeometry(.32,.02,6,32),glow(P.amber,1.3));this.edgeRing.position.set(-.05,AY,0);this.edgeRing.rotation.y=Math.PI/2;g.add(this.edgeRing);
 }
 update(t,a,tl,shot){
  const beat=tl.attack(t),drop=tl.drop(t),bass=a.sub_20_60_drive??0,act=activeFlights(t),bound=aclBound(t),rel=smooth(FIX,FIX+1.4,t);
  // rails: brighter where a packet travels; in the path survey the four service routes light up
  for(const e of this.edges.values()){let v=.16+.06*bass;if(shot.mode==='paths'){if(e.a!=='CPU'&&e.b!=='CPU')v=.5+.2*Math.sin(t*3+e.a.length);}
   for(const f of act){if(f.kind==='ambient'||f.kind==='replay')continue;const i=f.nodes.indexOf(e.a),j=f.nodes.indexOf(e.b);if(i>=0&&j>=0&&Math.abs(i-j)===1){const ti=Math.min(f.leave[Math.min(i,j)],f.arrive[Math.max(i,j)]);if(t>=f.leave[Math.min(i,j)]-.5&&t<=f.arrive[Math.max(i,j)]+.5)v=Math.max(v,.9);}}
   const ok=t>=OK_A&&(e.a!=='CPU'&&e.b!=='CPU')&&!['G2','GI002','D'].includes(e.a)&&!['G2','GI002','D'].includes(e.b);setGlow(e.m,ok&&v<.8?P.ok:P.cyan,v);setGlow(e.stripM,P.cyan,v*.25);}
  this.trace.material.opacity=t>=108.2&&t<FIX?(['trace','replay','nexthop','measure','counter'].includes(shot.mode)?.85:.3):0;
  this.parserRing.rotation.x=t*.4;this.parserInner.rotation.x=-t*1.3;setGlow(this.parserRing.material,P.cyan,.7+.6*beat);
  for(const k of['GI000','GI001','GI002'])setGlow(this.gates[k].led,k==='GI001'&&bound?P.amber:P.cyan,.7+.5*beat+.6*drop);
  // lookup: the matching plate slides towards the rail while a packet is being looked up
  let look=null;for(const f of act){if(f.kind==='replay')continue;const i=f.nodes.indexOf('LOOKUP');if(i>=0&&t>=f.arrive[i]-1.6&&t<=f.leave[i]+1.2){const dst=f.dir==='back'?'192.0.2.10':f.dst==='CPU'?'198.51.100.1':SERVICES[f.dst]?.ip;if(dst&&(!look||f.kind!=='ambient'))look={f,p:prefixFor(dst),i};}}
  this.plates.forEach(pl=>{const on=look&&look.p===pl.i?1:0,k=on?smooth(look.f.arrive[look.i]-1.6,look.f.arrive[look.i]-.6,t)*(1-smooth(look.f.leave[look.i]+.6,look.f.leave[look.i]+1.2,t)):0;const persist=['evroute','paths','route','axis'].includes(shot.mode)&&pl.i===1?.7:0;const kk=Math.max(k,persist);pl.m.position.z=5.2-1.6*kk;setGlow(pl.edge.material,P.cyan,.3+1.4*kk);});
  if(look&&look.p<3){const pl=this.plates[look.p];this.lookBeam.position.set(pl.x,RY+.2,(pl.m.position.z+0)/2);this.lookBeam.scale.set(1,1,pl.m.position.z-.2);setGlow(this.lookBeam.material,P.cyan,.8);}else setGlow(this.lookBeam.material,P.cyan,0);
  // ACL: sheets, counter, clamp; at FIX only the binding goes, the ACL moves to the archive
  this.drawSheet10(t);const hit=lastDrop(t),flash=hit&&t-hit.t1<1.4?Math.exp(-(t-hit.t1)/.35):0;
  for(const[m,x,dz]of[[this.r10,ST.ACL10[0],0],[this.r20,ST.ACL20[0],0]]){m.position.set(lerp(x,lerp(x,7,.5),rel),lerp(2.2,8.6,rel),lerp(0,9-.15+dz,rel));m.rotation.y=lerp(-Math.PI/2,0,rel);m.scale.setScalar(lerp(1,.55,rel));}
  const isolate=shot.mode==='isolate'||shot.mode==='measure'?1:0;this.r20.material.opacity=.92*(1-.75*isolate);this.r10.material.color.setScalar(1+1.5*flash);
  this.aclFrameMat.color.setHex(bound?P.amber:0x3d5468);this.aclFrameMat.opacity=bound?.8:.35;this.aclLabel.userData.alpha=1-rel;this.aclLabelFree.userData.alpha=rel;
  this.clamp.position.y=8*rel;this.clamp.scale.setScalar(1-rel*.999);setGlow(this.clampMat,P.amber,(1.1+.5*beat)*(1-rel));this.clampLabel.userData.alpha=1-rel;
  this.aclLight.color.setHex(bound?P.red:P.cyan);this.aclLight.intensity=bound?3+16*flash:1.2;
  const showDiff=t>=128&&t<FIX+1?smooth(128,129,t)*(1-smooth(FIX,FIX+1,t)):0;this.diffCard.material.opacity=showDiff;this.measure.material.opacity=shot.mode==='measure'?.9*smooth(shot.start,shot.start+.6,t):0;
  this.gwNote.userData.alpha=t>=122.4&&t<127?smooth(122.4,123,t)*(1-smooth(126,127,t)):0;
  const cpuHit=t>=123.3&&t<124?1:0;this.cpu.material.emissiveIntensity=.6+2*cpuHit;this.cpu.rotation.y=t*.3;setGlow(this.cpuRing.material,P.cyan,.4+cpuHit);
  // halls: lamp red until the service's own test passed; machinery turns while requests are answered
  for(const[k,h]of Object.entries(this.halls)){const ok=k==='D'?t>=67.75:serviceOk(k,t),actv=hallActivity(k,t);h.spin=actv;h.rings.forEach((r,i)=>{r.rotation.z=t*(actv?1.6+i*.7:0)+i;setGlow(r.material,actv?(ok?P.ok:P.cyan):0x4f7290,actv?1.2:.45);});
   const vt=k==='D'?67.75:VERIFY[k],pulse=t>=vt&&t<vt+2?Math.exp(-(t-vt)/.5):0;setGlow(h.lampMat,ok?P.ok:P.red,1+.8*pulse+(ok?0:.4*Math.sin(t*2.4)**2));setGlow(h.halo.material,ok?P.ok:P.red,.18+.6*pulse);setGlow(h.gateLed,P.cyan,.4+.8*actv);}
  this.hallLight.intensity=t>=OK_A?6+4*beat:0;
  // client screen
  const cstate=t>=OK_A?'ok':t>=148.78?'run2':t>=85.6&&t<120?'run1':'idle';this.clientTex.set(cstate,(g,w,h)=>{g.fillStyle='#03080d';g.fillRect(0,0,w,h);g.font='28px "JetBrains Mono"';g.fillStyle='#7c9aae';g.fillText('client 192.0.2.10',16,40);g.font='600 40px "JetBrains Mono"';
   g.fillStyle=cstate==='ok'?'#74d6a4':cstate==='run1'?'#ff8b97':'#cfe6f2';g.fillText(cstate==='ok'?'HTTP 200 ✓':cstate==='run2'?'TEST-A …':cstate==='run1'?'F-A1: keine Antwort':'bereit',16,130);g.font='24px "JetBrains Mono"';g.fillStyle='#7c9aae';g.fillText(cstate==='run1'?'hping3 -S -p 443 -c 1':cstate==='idle'?'':'curl https://app-a.example/health',16,200);});
  this.updatePackets(t,act);
  // aisle
  this.portLeds.forEach((m,i)=>setGlow(m,i===1?P.amber:P.cyan,1+(i===0?2*tl.pulse(t,['E010'],.25):0)+.8*Math.sin(t*(7+i*3))**2));setGlow(this.edgeRing.material,P.amber,1.2+.6*beat);
 }
 updatePackets(t,act){
  const shown=act.filter(f=>f.kind!=='replay'||t<=f.tGone).sort((a,b)=>(a.kind==='ambient')-(b.kind==='ambient')).slice(0,this.pool.length);this.bits.begin();
  this.pool.forEach((p,i)=>{const f=shown[i];p.g.visible=!!f;if(!f)return;const ph=phase(f,t),pos=pointAt(f,t),hd=headingAt(f,t),ghost=f.kind==='replay',col=KIND_COL[f.kind]??P.cyan;
   let y=RY+.2,scale=f.kind==='ambient'?.55:1,alpha=1;
   if(ph==='dropped'){const k=clamp((t-f.t1)/1.4);pos[0]-=.7;alpha=1-k;scale*=1-.6*k;
    for(let b=0;b<24;b++){const seed=i*31+b,vx=(random(seed)-.5)*2.4,vy=random(seed+1)*1.6,vz=(random(seed+2)-.5)*2.4,d=t-f.t1;if(d<0||d>1.6)continue;this.bits.push(new THREE.Vector3(pos[0]+vx*d,y+vy*d-2.4*d*d,pos[2]+vz*d),P.red,1-d/1.8,null,ghost?.6:1.6);}}
   if(ph==='arrived'||ph==='local'){const k=clamp((t-f.t1)/.6);alpha=1-k;scale*=1-.5*k;if(ph==='local')y+=.6*k;}
   if(ph==='waiting'){alpha=0;}
   p.g.position.set(pos[0],y,pos[2]);p.g.rotation.set(0,Math.atan2(hd[0],hd[2]),0);p.g.scale.setScalar(Math.max(.01,scale));
   const red=ph==='dropped';p.solid.opacity=(ghost?.18:1)*alpha;p.solid.wireframe=ghost;p.solid.color.setHex(red?0x4a121a:0x1a3448);p.solid.emissive.setHex(red?0x5a0a14:ghost?0x202830:0x0a2a40);
   const empty=!f.payload;p.core.visible=!empty&&!ghost;p.coreMat.opacity=alpha;p.wire.material.color.setHex(red?P.red:empty?col:0x9fd8ff);p.wire.material.opacity=alpha*(empty?1:.5);
   setGlow(p.rim.material,red?P.red:col,(ghost?.4:f.kind==='ambient'?.35:1)*alpha);
   const lines=[f.flags||f.kind,`${f.src||''} → ${f.dstAddr||''}`];p.tex.set(f.id+red,(g,w,h)=>{g.fillStyle=red?'rgba(60,8,16,.92)':'rgba(6,16,26,.9)';g.fillRect(0,0,w,h);g.strokeStyle=red?'#ff3b4e':'#5fe0ff';g.lineWidth=6;g.strokeRect(3,3,w-6,h-6);g.font='600 64px "Space Grotesk"';g.fillStyle=red?'#ff9aa6':'#e6f6ff';g.fillText(`${f.proto} ${lines[0]}`.slice(0,18),22,82);g.font='34px "JetBrains Mono"';g.fillStyle='#9fbfd2';g.fillText(lines[1].slice(0,28),22,150);g.fillText(empty?'Nutzlast: 0 Byte':'Nutzlast: verschlüsselt',22,206);});
   p.head.material.opacity=alpha*(ghost?.5:1);
   const name=f.name||(f.kind==='ambient'?'':f.test==='GW'?'ping · Gateway':f.test?.startsWith('CHECK')?`${SERVICES[f.test.slice(-1)].name} · Test`:'');p.tag.visible=!!name&&alpha>.05;if(name){p.tag.material.map=cachedTexture(name,ghost?'aufgezeichnet · kein neuer Transport':red?'verworfen · Regel 10':'',ghost?'#e6e6e6':'#e6f6ff');p.tag.material.opacity=alpha;}
  });this.bits.end();
 }
 // camera helpers: chase a flight, a station view, a hall view
 chase(f,t,dist=5.5,height=1.7,side=1.4,ahead=3){const tt=clamp(t,f.t0,f.t1+(f.fate==='drop'?.8:0)),p=V(pointAt(f,tt)),h=V(headingAt(f,Math.min(tt,f.t1-.01)));p.y=RY;const sideV=new THREE.Vector3(-h.z,0,h.x);return{pos:p.clone().addScaledVector(h,-dist).add(new THREE.Vector3(0,height,0)).addScaledVector(sideV,side),target:p.clone().addScaledVector(h,ahead).add(new THREE.Vector3(0,.2,0))};}
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),look=(pos,target,fov=38)=>({pos:V(pos),target:V(target),fov}),f=shot.target?.startsWith('f:')?BY_ID.get(shot.target.slice(2)):null,k=+shot.id.slice(1);
  switch(shot.camera){
   case'aisle':{const x=lerp(-40,-1.25,smooth(0,1,lin)**1.2);return look([AX+x,lerp(2.3,AY+.04,smooth(.3,1,lin)),lerp(.4,-1.2,smooth(.55,1,lin))],[AX+.2,AY-.05+lerp(.1,0,lin),lerp(0,-1.2,smooth(.4,.9,lin))],lerp(46,30,smooth(.5,1,lin)));}
   case'flow':{if(shot.mode==='launch'){const c=this.chase(f,Math.max(t,f.t0+.01),lerp(4,6.5,u),1.5,lerp(2.4,1,u));return{...c,fov:53};}if(shot.mode==='gwtest'){return look([lerp(-26,-16,u),3.4,-5.2],[lerp(-20,-12,u),1.4,3],50);}
    const c=this.chase(f,t,shot.mode==='replay'?4:5.2,shot.mode==='replay'?2.2:1.5,shot.mode==='fa2'?-1.3:1.3);return{...c,fov:53};}
   case'gate':if(shot.mode==='pass'){const x=clamp(pointAt(f,t)[0],-14,30);return look([x-2.2,2.4,5.6],[x+1.8,1.3,0],44);}return look([lerp(-48.5,-47.2,u),2.6,lerp(6.4,5.2,u)],[-43.5,1.6,-.2],44);
   case'dolly':{if(shot.mode==='paths')return look([lerp(-30,-20,u),lerp(13,11.5,u),lerp(-20,-22,u)],[6,0,-3],44);const x=f?pointAt(f,t)[0]:lerp(-24,-8,u);return look([x-1.5,2.4,-5.5],[x+1.2,1.8,4.5],38);}
   case'macro':{
    if(shot.mode==='drop'){if(t<108.2){const c=this.chase(f,t,4.2,1.1,1.6,2.2);return{...c,fov:44};}return look([lerp(-.6,-1.6,smooth(108.2,111.9,t)),2.3,lerp(5.2,5.8,smooth(108.2,111.9,t))],[5,1.6,0],40);}
    if(shot.mode==='counter')return look([lerp(2.2,2.8,u),2.2,lerp(2.4,2.1,u)],[5,1.9,.2],34);
    if(shot.mode==='release')return look([lerp(-2,-3.5,u),lerp(3.6,5.2,u),lerp(9,11.5,u)],[8,lerp(3,5,u),2],44);
    if(shot.mode==='measure')return look([lerp(1.5,2.5,u),4.6,lerp(10,9,u)],[9,3.8,1],42);
    if(shot.mode==='nexthop'){const c=this.chase(f,t,4.4,1.3,-1.6,2.4);return{...c,fov:46};}
    return look([lerp(2,2.6,u),2,lerp(3.4,3,u)],[5,1.6,0],40);}
   case'side':return look([lerp(8,11,u),shot.mode==='isolate'?3:4,lerp(15,14,u)],[shot.mode==='isolate'?6:13,1.6,0],shot.mode==='isolate'?34:42);
   case'trace':{const x=lerp(4,-44,smooth(0,1,lin));return look([x+2.5,2.6,3.6],[x-5,1.3,0],46);}
   case'hall':{
    if(shot.mode==='arrive'){return look([lerp(25,31.2,u),lerp(2.4,2.0,u),lerp(2.2,1.4,u)],[39.6,lerp(1.4,1.9,u),0],41);}
    if(shot.mode==='verify'){const z=t<179.6?lerp(13,-1,smooth(177.46,179.6,t)):t<181.2?lerp(-1,-13,smooth(179.6,181.2,t)):-13-8*smooth(181.2,182.6,t);return look([24,6.5,z+(t>181.2?-2:0)],[37,1.8,z*.95],44);}
    return look([lerp(26,22,u),lerp(10,8,u),lerp(18,-14,u)],[36,1.5,lerp(4,-4,u)],44);}
   case'back':{const c=this.chase(f,t,5,1.8,1.2,3);return{...c,fov:50};}
   default:return look([0,20,20],[0,0,0],50);
  }
 }
}
