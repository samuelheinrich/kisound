// The wall between inside and outside, the mandala gate of policy rings, NAT prism, DPI beam, the state table
// above the gate and the log column. Packets fly on arcs from the hosts into the gate and out again.
import * as THREE from 'three';
import {PALETTE as P,BREAKDOWNS,GAP} from '../config.js';
import {V,mat,glow,additive,setGlow,box,ring,curveTube,label,cachedTexture,stars,instanced,orient,random,dynamicTexture,monoLines} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {HOSTS,GY,GIN,GOUT,RING_X,DENY_IN,DENY_OUT,BLOCK_X,PRISM_X,DPI_X,BLOCK_T,RULES,BY_ID,SESSION_BY_ID,FLIGHTS,activeFlights,pointAt,phase,labelAt,ringHit,stateTable,STATE_COLOR,LOGS,route,PUBLIC_IP} from '../model.js';
const KIND={syn:[0xffffff,.42],synack:[0xfff2c8,.42],ack:[P.amber,.34],data:[P.amber,.6],fin:[0x9fb4c8,.38],udp:[P.udp,.38],probe:[P.deny,.46],rst:[P.deny,.38]};
const R=3.6,WALL=[-2.6,2.6],LEN=44,HEIGHT=10;
const inBreak=t=>BREAKDOWNS.some(([a,b])=>t>=a&&t<b);
function brickTexture(){const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.fillStyle='#120d0b';g.fillRect(0,0,256,256);
 g.strokeStyle='#ff8a2a';g.lineWidth=3;for(let r=0;r<4;r++){const y=r*64;g.beginPath();g.moveTo(0,y+1);g.lineTo(256,y+1);g.stroke();for(let k=0;k<2;k++){const x=(k*128+(r%2)*64)%256;g.beginPath();g.moveTo(x,y);g.lineTo(x,y+64);g.stroke();}}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;t.repeat.set(1/4,1/2);return t;}
export class GateZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(P.ink);s.fog=new THREE.FogExp2(P.ink,.0075);
  s.add(new THREE.HemisphereLight(0x9cc4f0,0x150c08,1.3));const key=new THREE.DirectionalLight(0xffe0c0,1.4);key.position.set(-20,30,-14);s.add(key);
  this.fire=new THREE.PointLight(P.orange,80,40,1.5);this.fire.position.set(0,GY+2,0);s.add(this.fire);
  this.inLight=new THREE.PointLight(P.blue,50,50,1.4);this.inLight.position.set(-18,8,0);s.add(this.inLight);
  stars(s,900,260);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(400,400),mat(0x070b14,{roughness:.95,metalness:.1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;s.add(floor);
  const tint=(x,c)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(60,100),new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.18,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.set(x,0,0);s.add(m);};tint(-33,0x0b3a6a);tint(33,0x4a120a);
  // Psychedelic floor: two spiral arms of dots turning around the gate on the beat.
  this.spiral=instanced(s,new THREE.SphereGeometry(.09,6,4),additive(0xffffff),1600);
  // The wall: one extruded brick slab with a round bore for the gate.
  const shape=new THREE.Shape();shape.moveTo(-LEN,0);shape.lineTo(LEN,0);shape.lineTo(LEN,HEIGHT);shape.lineTo(-LEN,HEIGHT);shape.lineTo(-LEN,0);const hole=new THREE.Path();hole.absarc(0,GY,R,0,Math.PI*2,true);shape.holes.push(hole);
  const geo=new THREE.ExtrudeGeometry(shape,{depth:WALL[1]-WALL[0],bevelEnabled:false,curveSegments:48});geo.translate(0,0,WALL[0]);geo.rotateY(Math.PI/2);
  const bt=brickTexture();this.wallMat=new THREE.MeshStandardMaterial({color:0x2a1d16,map:bt,emissive:0xffffff,emissiveMap:bt,emissiveIntensity:.35,roughness:.8,metalness:.2});s.add(new THREE.Mesh(geo,this.wallMat));
  label(s,'INSIDE','10.0.0.0/24 · DMZ 172.16.0.0/24',[-8,HEIGHT+1.2,-20],5,'#8fd2ff');label(s,'OUTSIDE','internet',[8,HEIGHT+1.2,-20],5,'#ff9f8a');
  this.denyWall=label(s,'DEFAULT DENY','everything not allowed is dropped',[-3.2,HEIGHT*.55,-14],7,'#ffb27a');this.denyWall.userData.alpha=0;
  // Gate: policy rings, deny membranes, blocklist ring, state lane, NAT prism, DPI disc.
  this.rings=RING_X.map((x,i)=>{const r=ring(s,R-.25,[x,GY,0],additive(P.white,.3),.07);r.rotation.y=Math.PI/2;label(s,`${i+1}`,'',[x,GY+R+.1,0],.9,'#e8edf2');return r;});
  this.blockRing=ring(s,R-.15,[BLOCK_X,GY,0],additive(P.deny,0),.12);this.blockRing.rotation.y=Math.PI/2;
  this.denyDiscs=[DENY_IN,DENY_OUT].map(x=>{const m=new THREE.Mesh(new THREE.CircleGeometry(R-.3,48),new THREE.MeshBasicMaterial({color:P.deny,transparent:true,opacity:.06,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));m.position.set(x,GY,0);m.rotation.y=Math.PI/2;s.add(m);return m;});
  this.lane=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,7.6,16,1,true),additive(P.amber,.2));this.lane.rotation.z=Math.PI/2;this.lane.position.set(0,GY,0);s.add(this.lane);
  this.mandala=[0,1,2].map(i=>{const r=ring(s,R+.6+i*.55,[WALL[0]-.05,GY,0],additive(i===1?P.orange:P.amber,.4),.05,Math.PI*(1.2+.25*i));r.rotation.y=Math.PI/2;return r;});
  this.prism=new THREE.Mesh(new THREE.OctahedronGeometry(1.25),new THREE.MeshStandardMaterial({color:P.nat,transparent:true,opacity:.35,emissive:P.nat,emissiveIntensity:.3,roughness:.1,metalness:.3}));this.prism.position.set(PRISM_X+.4,GY,0);s.add(this.prism);
  this.natLabel=label(s,'NAT',`inside → ${PUBLIC_IP}`,[PRISM_X+.4,GY+2.4,0],3.2,'#d8c2ff');
  this.dpi=new THREE.Mesh(new THREE.RingGeometry(.4,R-.4,48),new THREE.MeshBasicMaterial({color:P.cyan,transparent:true,opacity:0,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending}));this.dpi.position.set(DPI_X,GY,0);this.dpi.rotation.y=Math.PI/2;s.add(this.dpi);
  this.dpiLabel=label(s,'DPI','',[DPI_X,GY-R-.6,0],2.6,'#9feaf6');
  // State table above the gate, readable from both sides, and the log column on the inside face.
  this.board=dynamicTexture(1600,720);for(const sd of[-1,1]){const m=new THREE.Mesh(new THREE.PlaneGeometry(17,7.65),new THREE.MeshBasicMaterial({map:this.board.tex,toneMapped:false,transparent:true}));m.position.set(sd*(WALL[1]+.06),HEIGHT+5,0);m.rotation.y=sd*Math.PI/2;s.add(m);}
  this.logTex=dynamicTexture(700,1100);const lm=new THREE.Mesh(new THREE.PlaneGeometry(6.4,10),new THREE.MeshBasicMaterial({map:this.logTex.tex,toneMapped:false,transparent:true}));lm.position.set(WALL[0]-.06,5.2,10.5);lm.rotation.y=-Math.PI/2;s.add(lm);
  // Hosts on pedestals, with their arcs to the gate.
  this.hostGlow={};this.arcMats={};
  for(const[id,h]of Object.entries(HOSTS)){const out=h.side==='out',col=id==='X'?P.deny:out?0xff9f8a:h.side==='dmz'?P.nat:P.blue;
   const ped=new THREE.Mesh(new THREE.CylinderGeometry(1.3,1.5,1.2,24),mat(0x111a28));ped.position.set(h.pos[0],.6,h.pos[2]);s.add(ped);
   const dev=new THREE.Mesh(new THREE.BoxGeometry(1.4,.9,1.0),mat(0x1d2c40,{emissive:col,emissiveIntensity:.25}));dev.position.set(h.pos[0],1.75,h.pos[2]);s.add(dev);
   const hr=ring(s,1.6,[h.pos[0],1.25,h.pos[2]],additive(col,.5),.05);hr.rotation.x=Math.PI/2;this.hostGlow[id]=hr;
   label(s,h.name.toUpperCase(),h.ip,[h.pos[0],4.0,h.pos[2]],2.8,'#'+new THREE.Color(col).getHexString());
   const pts=out?route(id,'L1').slice(0,23):route(id,'W1').slice(0,23);this.arcMats[id]=additive(col,.12);curveTube(s,pts.map(V),this.arcMats[id],.04,30);}
  const dmz=ring(s,5,[HOSTS.DMZ.pos[0],.05,HOSTS.DMZ.pos[2]],additive(P.nat,.4),.06);dmz.rotation.x=Math.PI/2;label(s,'DMZ','172.16.0.0/24',[HOSTS.DMZ.pos[0],5.8,HOSTS.DMZ.pos[2]],2.6,'#d8c2ff');
  // Packets and effects.
  const u=new THREE.BoxGeometry(1,1,1);this.packets=instanced(s,u,glow(0xffffff),220);this.halo=instanced(s,new THREE.SphereGeometry(1,12,8),additive(0xffffff),220);
  this.trails=instanced(s,new THREE.SphereGeometry(.12,6,4),additive(0xffffff),1400);this.shards=instanced(s,new THREE.TetrahedronGeometry(.2),additive(0xffffff),400);
  this.flightLabels=Array.from({length:3},()=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false,depthWrite:false}));sp.userData.labelWidth=4.4;sp.scale.set(4.4,.82,1);sp.renderOrder=11;sp.visible=false;s.add(sp);return sp;});
  this.q=new THREE.Quaternion();
 }
 drawBoard(t,focus){
  const rows=stateTable(t).slice(-8),key=rows.map(r=>`${r.id}${r.state}${r.timeout}${t-r.hit<.5?'h':''}`).join('|')+(focus??'');
  this.board.set(key,(g,w,h)=>{g.fillStyle='rgba(8,10,16,.92)';g.fillRect(0,0,w,h);g.strokeStyle='#ff8a2a';g.lineWidth=4;g.strokeRect(2,2,w-4,h-4);
   g.font='600 46px "Space Grotesk"';g.fillStyle='#ffb648';g.fillText('STATE TABLE',28,58);g.font='24px "JetBrains Mono"';g.fillStyle='#8fa6bd';g.fillText(`${stateTable(t).length} sessions`,w-250,56);
   g.fillStyle='#5d7590';g.font='22px "JetBrains Mono"';g.fillText('proto  inside              nat                   destination              state        ttl',28,104);
   rows.forEach((r,i)=>{const y=150+i*70,hit=t-r.hit<.5;if(hit||r.id===focus){g.fillStyle=r.id===focus?'rgba(255,182,72,.22)':'rgba(255,182,72,.12)';g.fillRect(14,y-40,w-28,58);}
    g.font='24px "JetBrains Mono"';g.fillStyle='#cfe0ee';g.fillText(r.proto.padEnd(6)+' '+r.orig.padEnd(20)+' '+(r.nat??'—').padEnd(21)+' '+r.to.split(' → ').at(-1).padEnd(22),28,y);
    g.fillStyle=STATE_COLOR[r.state]??'#fff';g.fillText(r.state.padEnd(12),1196,y);g.fillStyle='#8fa6bd';g.fillText(String(r.timeout).padStart(5),1450,y);});});
 }
 drawLog(t){const rows=LOGS.filter(l=>l.time_s<=t).slice(-14);this.logTex.set(String(rows.length)+(rows.at(-1)?.time_s??''),(g,w,h)=>{g.fillStyle='rgba(6,8,14,.9)';g.fillRect(0,0,w,h);g.font='600 34px "Space Grotesk"';g.fillStyle='#ffb648';g.fillText('LOG',22,48);
  rows.forEach((l,i)=>{const y=100+i*70,c=l.tag==='drop'||l.tag==='ips'?'#ff8b95':l.tag==='allow'?'#7ff5c0':l.tag==='rule'?'#ffd24a':'#9fb4c8';g.font='20px "JetBrains Mono"';g.fillStyle='#5d7590';g.fillText(`${Math.floor(l.time_s/60)}:${(l.time_s%60).toFixed(1).padStart(4,'0')} ${l.tag}`,22,y);g.fillStyle=c;g.font='19px "JetBrains Mono"';g.fillText(l.message.slice(0,56),22,y+28);});});}
 update(t,a,tl,shot){
  const imp=tl.attack(t),drop=tl.drop(t),bass=a.sub_20_60_drive??0,calm=inBreak(t)?1:0,dip=t>=GAP[0]-.05&&t<GAP[1]+.15?1:0,focus=shot.target?.slice(2);this.pulse=imp;
  // Spiral: two arms, rotation locked to 142 BPM (one turn per 8 beats).
  const beat=60/142,rot=t/(beat*8)*Math.PI*2,sp=this.spiral;sp.begin();for(let i=0;i<1600;i++){const arm=i%2,k=Math.floor(i/2),r=4+k*.05,ang=rot*(arm?1:-1)+k*.11+arm*Math.PI;sp.push(V([r*Math.cos(ang),.03,r*Math.sin(ang)]),arm?P.orange:P.blue,.6+.8*bass,null,(.25+.45*bass+.6*drop)*(1-.6*calm)*(1-dip));}sp.end();
  this.wallMat.emissiveIntensity=(.22+.35*bass+.5*drop)*(1-dip*.9);this.fire.intensity=(30+70*bass+120*drop)*(1-dip);this.inLight.intensity=(30+20*bass)*(1-dip);
  this.denyWall.userData.alpha=/deny|trust|intro|alone/.test(shot.mode)?1:0;
  this.mandala.forEach((m,i)=>{m.rotation.x=(i%2?-1:1)*rot*(.5+i*.25);setGlow(m.material,i===1?P.orange:P.amber,(.3+.5*bass+.6*drop)*(1-dip));});
  // Ring flashes: matched rule (amber), implicit deny (red disc), blocklist (red ring); state lane for fast-path packets.
  const fl=new Array(7).fill(0);let lane=0,prism=0,dpi=0,blockOn=t>=BLOCK_T?1:0;
  for(const f of activeFlights(t).concat(FLIGHTS.filter(f=>f.tEnd<t&&f.tEnd>t-1))){const hit=ringHit(f),te=f.fate==='drop'?f.t1:f.tGate,d=t-te;if(hit!=null&&d>=0&&d<1)fl[hit]=Math.max(fl[hit],Math.exp(-d/.25));
   const x=t<=f.t1?pointAt(f,t)[0]:null;if(x!=null&&Math.abs(x)<3.8&&f.check==='state')lane=1;const ses=SESSION_BY_ID.get(f.session);if(x!=null&&(ses?.nat||ses?.dnat)&&Math.abs(x-PRISM_X-.4)<1.4)prism=1;if(x!=null&&f.payload&&Math.abs(x-DPI_X)<1.2)dpi=f.payload==='clean'?.7:1.4;}
  this.rings.forEach((r,i)=>{setGlow(r.material,fl[i+1]>.05?P.ok:P.white,.22+.15*bass+1.6*fl[i+1]);r.scale.setScalar(1+.08*fl[i+1]);});
  setGlow(this.blockRing.material,P.deny,blockOn*(.6+.3*bass)+2*fl[0]);this.blockRing.visible=t>=BLOCK_T-.4;
  this.denyDiscs.forEach(m=>m.material.opacity=.55*fl[6]);setGlow(this.lane.material,P.amber,.15+.9*lane);
  this.prism.material.emissiveIntensity=.3+1.5*prism;this.prism.rotation.y=t*.6;this.prism.rotation.x=t*.4;this.dpi.material.opacity=.45*dpi;this.dpi.material.color.setHex(dpi>1?P.deny:P.cyan);
  this.drawBoard(t,focus?BY_ID.get(focus)?.session??null:null);this.drawLog(t);
  // Packets.
  const PK=this.packets,HL=this.halo,TR=this.trails,SD=this.shards;[PK,HL,TR,SD].forEach(i=>i.begin());const labelled=[],act=new Set();
  for(const f of activeFlights(t)){
   const ph=phase(f,t);if(ph==='waiting')continue;const p=V(pointAt(f,Math.min(t,f.t1))),ahead=V(pointAt(f,Math.min(f.t1,t+.04)));if(ahead.distanceToSquared(p)<1e-6)ahead.x+=.01;
   const[col,sz]=KIND[f.kind],q=orient(this.q,p,ahead);let vis=1;
   if(ph==='dropped'){const dt=t-f.t1;vis=1-dt/.45;if(vis<=0)continue;for(let k=0;k<8;k++){const dir=V([random(k*7+f.t0)-.5,random(k*11+f.t0)-.2,random(k*13+f.t0)-.5]).normalize();SD.push(p.clone().add(dir.multiplyScalar(dt*6)),P.deny,1,null,1.6*vis);}}
   if(ph==='arrived'){vis=1-(t-f.t1)/.15;if(vis<=0)continue;}
   act.add(f.from);act.add(f.to);
   const shape=f.kind==='data'?new THREE.Vector3(sz,sz*.7,sz*1.4):f.kind==='udp'?new THREE.Vector3(sz,sz,sz):new THREE.Vector3(sz,sz,sz*1.2);
   PK.push(p,ph==='dropped'?P.deny:col,shape,q,vis*.75);HL.push(p,f.check==='state'?P.amber:f.check==='policy'?0xffffff:P.deny,sz*.95,null,.07*vis);
   if(ph==='moving')for(let k=1;k<=8;k++){const tt=t-k*.025;if(tt<f.t0)break;TR.push(V(pointAt(f,tt)),f.check==='state'?P.amber:col,sz*.7*(1-k/9),null,.35*(1-k/9));}
   if(ph==='moving'&&(f.id===focus||(!focus&&f.kind!=='udp')))labelled.push({f,p});
  }
  [PK,HL,TR,SD].forEach(i=>i.end());labelled.sort((x,y)=>(y.f.id===focus)-(x.f.id===focus)||y.f.t0-x.f.t0);
  this.flightLabels.forEach((spr,i)=>{const l=labelled[i];spr.visible=!!l;if(!l)return;const c=l.f.kind==='probe'||l.f.kind==='rst'?'#ff8b95':l.f.check==='state'?'#ffd28a':'#e8f4ff';spr.material.map=cachedTexture(labelAt(l.f,t),l.f.check==='state'?'state · fast path':l.f.check==='nostate'?'no session':l.f.fate==='drop'?'policy · no match':`policy · rule ${l.f.rule}`,c);spr.position.copy(l.p).add(V([0,1.3,0]));});
  for(const[id,r]of Object.entries(this.hostGlow)){const on=act.has(id)?1:0;r.material.color.setHex(id==='X'?P.deny:HOSTS[id].side==='out'?0xff9f8a:HOSTS[id].side==='dmz'?P.nat:P.blue).multiplyScalar(.35+.9*on);this.arcMats[id].color.setHex(id==='X'?P.deny:P.blue).multiplyScalar(.1+.35*on);}
 }
 povCamera(kind,id,t,shot){
  const f=BY_ID.get(id),tt=clamp(t,f.t0,f.t1),p=V(pointAt(f,tt)),q=V(pointAt(f,Math.min(f.t1,tt+.15)));let dir=q.sub(p);if(dir.lengthSq()<1e-5)dir=V([f.from&&HOSTS[f.from].side==='out'?-1:1,0,0]);dir.normalize();
  const side=V([dir.z,0,-dir.x]).normalize(),sign=+shot.id.slice(1)%2?1:-1;
  if(kind==='ride')return{pos:p.clone().sub(dir.clone().multiplyScalar(6.2)).add(V([0,1.9,0])),target:p.clone().add(dir.clone().multiplyScalar(8)),fov:62};
  if(kind==='flyby')return{pos:p.clone().add(side.multiplyScalar(6*sign)).add(V([0,1.8,0])),target:p,fov:50};
  return{pos:p.clone().sub(dir.clone().multiplyScalar(7.5)).add(V([0,3.4,0])).add(side.multiplyScalar(2.6*sign)),target:p.clone().add(dir.multiplyScalar(4)),fov:56};
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),bump=this.pulse||0,idx=+shot.id.slice(1),sign=idx%2?1:-1;let c;const look=(pos,target,fov=50)=>({pos:V(pos),target:V(target),fov});
  switch(shot.camera){
   case'opening':c=look([lerp(-16,-11,u),lerp(2.2,4.5,u),lerp(-34,-12,u)],[0,GY,lerp(-6,0,u)],50);break;
   case'portal':c=look([lerp(-13,-11,u),GY+1.2,lerp(-2,2,lin)*sign],[0,GY+.6,0],46);break;
   case'wall':c=look([lerp(-15,-13,u),2.6,-30],[-1,5.5,lerp(4,8,lin)],52);break;
   case'ride':case'chase':case'flyby':c=this.povCamera(shot.camera,shot.target.slice(2),t,shot);break;
   case'wide':c=look([lerp(-38,-30,lin),24,-40],[0,4,0],50);break;
   case'wide2':c=look([lerp(30,38,lin),30,42],[0,5,0],50);break;
   case'orbit':{const ang=((idx*.37)%1.1)-.55+lerp(-.25,.25,lin);c=look([-17*Math.cos(ang)-3,8,17*Math.sin(ang)],[0,GY+1,0],52);break;}
   case'scanner':c=look([lerp(18,14,u),5,13],[2,GY,0],48);break;
   case'rings':c=look([lerp(-7,-5,u),GY+.7,.9*sign],[3,GY,0],62);break;
   case'nat':c=look([lerp(8.5,7.5,u),GY+1.6,-5.5],[PRISM_X+.4,GY,0],46);break;
   case'dpi':c=look([lerp(-7.5,-6.4,u),GY+.6,-1.2],[0,GY,0],54);break;
   case'topdown':c=look([0,42,.01],[0,0,0],56);break;
   case'acl':c=look([lerp(10,8.5,u),GY+.9,3.2],[BLOCK_X,GY,0],50);break;
   case'hairpin':c=look([-10,GY+4,lerp(8,6,u)],[0,GY+.5,0],50);break;
   case'final':c=look([lerp(-30,-24,u),9,lerp(-3,3,lin)],[0,8.5,0],52);break;
   default:c=look([-20,10,-20],[0,4,0]);
  }
  return{pos:c.pos.add(V([0,.08*bump,0])),target:c.target,fov:c.fov-1.2*bump};
 }
}
