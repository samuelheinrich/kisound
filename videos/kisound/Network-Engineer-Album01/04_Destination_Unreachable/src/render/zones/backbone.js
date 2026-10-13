// The empty backbone at night: router towers in fog, sagging cables, a blackhole beside R4 that swallows
// whatever reaches its Null0 route, and ICMP slips flying back to the probe host.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,ring,curveTube,label,cachedTexture,stars,instanced,orient,random,dynamicTexture,monoLines} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {NODES,CABLES,TOWER,HOSTY,top,VOID,GROW,SHIFT,BY_ID,activeFlights,pointAt,phase,voidRadius,evidenceUntil,traceLines,latestTrace,RTBH,FLIGHTS} from '../model.js';
const KIND={echo:[P.cyan,.42],reply:[P.ok,.42],probe:[0xffffff,.36],te:[P.te,.5],du:[P.du,.55]};
export class BackboneZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(P.ink);s.fog=new THREE.FogExp2(0x070b12,.0075);
  s.add(new THREE.HemisphereLight(0x8fb6d8,0x0a0e14,1.7));const moon=new THREE.DirectionalLight(0xa8c8e8,.9);moon.position.set(-30,40,-20);s.add(moon);
  stars(s,1200,320);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),mat(0x080c12,{roughness:1,metalness:0}));ground.rotation.x=-Math.PI/2;s.add(ground);
  const grid=new THREE.GridHelper(400,200,0x15283a,0x0c1724);grid.material.transparent=true;grid.material.opacity=.75;grid.position.y=.01;s.add(grid);
  // Distant industrial silhouettes for scale.
  const sil=instanced(s,new THREE.BoxGeometry(1,1,1),mat(0x0a1018,{roughness:1}),120);sil.begin();for(let i=0;i<120;i++){const a=random(i)*Math.PI*2,r=90+random(i*3)*60,h=6+random(i*5)*28;sil.push(V([r*Math.cos(a)-5,h/2,r*Math.sin(a)+5]),0xffffff,V([4+random(i*7)*6,h,4+random(i*9)*6]),null,1);}sil.end();
  // Towers and hosts.
  this.caps={};this.marks={};
  for(const[id,n]of Object.entries(NODES)){const h=n.host?HOSTY:TOWER,[x,,z]=n.pos,dark=['R5','FWB','D','D2','RC','C'].includes(id);
   if(n.host){box(s,[2.6,h-.4,2],[x,(h-.4)/2,z],mat(0x141d28));}
   else{box(s,[1.6,h,1.6],[x,h/2,z],mat(0x121a24,{metalness:.6,roughness:.4}));const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(1.62,h,1.62)),new THREE.LineBasicMaterial({color:P.cyan,transparent:true,opacity:dark?.2:.6}));e.position.set(x,h/2,z);s.add(e);}
   const cap=ring(s,1.25,[x,h+.15,z],additive(dark?0x40566c:P.cyan,.5),.06);cap.rotation.x=Math.PI/2;this.caps[id]=cap;
   const mk=ring(s,1.9,[x,h+.15,z],additive(P.te,0),.08);mk.rotation.x=Math.PI/2;this.marks[id]=mk;
   label(s,n.label,n.sub,[x,h+2.1,z],2.8,dark?'#5f7890':'#cfe6f2');}
  // Cables; R2→site C is the lost prefix (red, faint).
  this.cableMats=new Map();for(const[k,pts]of CABLES){const lost=k==='R2-RC',m=additive(lost?P.du:P.cyan,lost?.12:.16);curveTube(s,pts.map(V),m,.05,40);this.cableMats.set(k,m);}
  // The blackhole: a black sphere with an accretion ring and a red rim.
  this.voidBall=new THREE.Mesh(new THREE.SphereGeometry(1,40,24),new THREE.MeshBasicMaterial({color:0x000000}));this.voidBall.position.set(...VOID);s.add(this.voidBall);
  this.rim=ring(s,1,VOID,additive(P.du,.6),.03);
  // Backlight halo so the black sphere reads as a silhouette, like an eclipse.
  const hc=document.createElement('canvas');hc.width=hc.height=256;const hg=hc.getContext('2d'),gr=hg.createRadialGradient(128,128,40,128,128,128);gr.addColorStop(0,'rgba(255,90,110,1)');gr.addColorStop(.45,'rgba(150,40,90,.55)');gr.addColorStop(1,'rgba(0,0,0,0)');hg.fillStyle=gr;hg.fillRect(0,0,256,256);
  this.halo=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(hc),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true,color:0xffffff}));this.halo.position.set(...VOID);this.halo.renderOrder=-1;s.add(this.halo);
  this.voidLight=new THREE.PointLight(P.du,30,30,1.6);this.voidLight.position.set(VOID[0],VOID[1]+1,VOID[2]);s.add(this.voidLight);this.disk=instanced(s,new THREE.SphereGeometry(.06,6,4),additive(0xffffff),700);
  this.voidLabel=label(s,'Null0','',[VOID[0],VOID[1]+3,VOID[2]],2.6,'#ff8b95');
  // Probe host screen (the traceroute as it arrives).
  this.screen=dynamicTexture(720,420);const sc=new THREE.Mesh(new THREE.PlaneGeometry(3.4,2),new THREE.MeshBasicMaterial({map:this.screen.tex,toneMapped:false}));const sp=NODES.S.pos;sc.position.set(sp[0]+1.6,3.6,sp[2]-2.2);sc.rotation.y=-.6;s.add(sc);
  this.fwLabel=label(s,'0 hits','firewall log: nothing arrived',[NODES.FWB.pos[0],TOWER+4.6,NODES.FWB.pos[2]],3,'#7ff5c0');this.fwLabel.userData.alpha=0;
  // Packets.
  const u=new THREE.BoxGeometry(1,1,1);this.packets=instanced(s,u,glow(0xffffff),200);this.trails=instanced(s,new THREE.SphereGeometry(.1,6,4),additive(0xffffff),1400);
  this.flightLabels=Array.from({length:3},()=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false,depthWrite:false}));sp.userData.labelWidth=3.6;sp.scale.set(3.6,.68,1);sp.renderOrder=11;sp.visible=false;s.add(sp);return sp;});
  this.q=new THREE.Quaternion();
 }
 update(t,a,tl,shot){
  const imp=tl.attack(t),drop=tl.drop(t),bass=a.sub_20_60_drive??0,r=voidRadius(t);this.pulse=imp;
  this.scene.fog.density=.0075-.0015*bass;
  // Void.
  this.voidBall.scale.setScalar(r);this.halo.scale.setScalar(r*4.2);this.halo.material.color.setScalar(.45+.4*bass+.6*drop);this.voidLight.intensity=20+30*bass+60*drop;this.rim.scale.setScalar(r*1.04);this.rim.lookAt(this.voidBall.position.clone().add(V([-1,0,1])));setGlow(this.rim.material,P.du,.5+.6*bass+.8*drop);
  const d=this.disk;d.begin();for(let i=0;i<700;i++){const k=random(i*3),rr=r*(1.15+k*1.6),ang=random(i)*Math.PI*2+t*(1.4-k*.8),y=(random(i*5)-.5)*.5*r;d.push(V([VOID[0]+rr*Math.cos(ang),VOID[1]+y,VOID[2]+rr*Math.sin(ang)*.55]),k<.4?P.du:0x9fbfdf,1,null,(.45+.6*bass)*(1-k*.5));}d.end();
  this.voidLabel.position.y=VOID[1]+r+1.4;this.voidLabel.material.map=cachedTexture('Null0',`RTBH ${RTBH(t)} · discard, no ICMP`,'#ff8b95');
  // Cables glow under passing packets; the alternate core path wakes after the metric shift.
  for(const[k,m]of this.cableMats){const base=k==='R2-RC'?.14:k.includes('R3b')&&t<SHIFT?.08:.26;m.color.setHex(k==='R2-RC'?P.du:P.cyan).multiplyScalar(base+.12*bass);}
  // Hop marks: every Time Exceeded leaves a ring on its tower that fades over six seconds.
  const ev=evidenceUntil(t);for(const[id,mk]of Object.entries(this.marks)){const last=ev.filter(e=>e.from===id).at(-1),age=last?t-last.t:99;setGlow(mk.material,last?.type==='du'?P.du:P.te,age<6?1.4*Math.exp(-age/2):0);mk.scale.setScalar(1+.25*Math.min(age,6)/6);}
  for(const[id,cap]of Object.entries(this.caps))cap.rotation.z=t*.3;
  this.fwLabel.userData.alpha=shot.mode==='fw'?smooth(shot.start,shot.start+.5,t):0;
  const tr=latestTrace(t),lines=traceLines(tr,t);this.screen.set(lines.join('|'),(g,w,h)=>{g.fillStyle='#03070c';g.fillRect(0,0,w,h);g.fillStyle='#0e2236';g.fillRect(0,0,w,34);g.font='18px "JetBrains Mono"';g.fillStyle='#8fb2c8';g.fillText('probe host · 192.0.2.10',12,23);
   monoLines(g,lines.slice(-8),{x:16,y:70,size:22,lh:1.4,colors:[[/\* \* \*/,'#ff8b95'],[/^\$/,'#ffd24a'],[/ms$/,'#e8f4ff']]});});
  // Packets.
  const PK=this.packets,TR=this.trails;PK.begin();TR.begin();const labelled=[],focus=shot.target?.startsWith('f:')?shot.target.slice(2):null;
  for(const f of activeFlights(t)){const ph=phase(f,t);if(ph==='waiting')continue;const p=V(pointAt(f,t)),ahead=V(pointAt(f,Math.min(f.tGone,t+.04)));if(ahead.distanceToSquared(p)<1e-6)ahead.y-=.01;
   const[col,sz]=KIND[f.kind];let vis=1,sc=1;if(ph==='falling'){const k=(t-f.t1)/1.3;vis=1-k*.6;sc=1-k*.85;}if(ph==='expired'){vis=1-(t-f.t1)/.35;}if(ph==='arrived')vis=1-(t-f.t1)/.2;if(vis<=0)continue;
   const card=f.kind==='te'||f.kind==='du',shape=card?new THREE.Vector3(sz*1.3,sz*.85,.06):new THREE.Vector3(sz,sz,sz*1.3);PK.push(p,col,shape.multiplyScalar(sc),orient(this.q,p,ahead),vis*(card?.9:.8));
   if(ph==='moving')for(let k=1;k<=8;k++){const tt=t-k*.03;if(tt<f.t0)break;TR.push(V(pointAt(f,tt)),col,sz*.6*(1-k/9),null,.4*(1-k/9));}
   if(ph!=='arrived'&&(f.id===focus||(!focus&&(card||f.kind==='probe'))))labelled.push({f,p,ph});}
  PK.end();TR.end();labelled.sort((x,y)=>(y.f.id===focus)-(x.f.id===focus)||y.f.t0-x.f.t0);
  this.flightLabels.forEach((spr,i)=>{const l=labelled[i];spr.visible=!!l;if(!l)return;const f=l.f,hops=f.kind==='probe'?Math.max(0,Math.round((f.nodes.length-1)*clamp((t-f.t0)/(f.t1-f.t0)))):0;
   const txt=f.kind==='probe'?`probe · ttl ${Math.max(0,f.ttl-hops)}`:f.label,sub=l.ph==='falling'?'discarded · no message':f.kind==='du'?'returns to 192.0.2.10':f.kind==='te'?'returns to 192.0.2.10':f.kind==='echo'?'from 192.0.2.10':'';
   spr.material.map=cachedTexture(txt,sub,f.kind==='du'||l.ph==='falling'?'#ff8b95':f.kind==='reply'?'#7ff5c0':'#e8f4ff');spr.position.copy(l.p).add(V([0,1.2,0]));});
 }
 povCamera(kind,id,t,shot){
  const f=BY_ID.get(id),tt=clamp(t,f.t0,f.tGone),p=V(pointAt(f,tt)),q=V(pointAt(f,Math.min(f.t1,Math.max(f.t0,tt)+.15)));let dir=q.sub(p);if(dir.lengthSq()<1e-5||tt>f.t1)dir=V([1,0,0]);dir.y*=.3;dir.normalize();
  const side=V([dir.z,0,-dir.x]).normalize(),sign=+shot.id.slice(1)%2?1:-1;
  if(kind==='fall'){const base=V(pointAt(f,Math.min(tt,f.t1))),fallK=clamp((t-f.t1)/1.3),after=clamp((t-f.t1-1.3)/2.5);return{pos:base.clone().add(V([-5.5-7*after,2.6+4*after,1.5+6*after])),target:V(pointAt(f,tt)).lerp(V(VOID),fallK*.8),fov:56-10*fallK+12*after};}
  if(kind==='ride')return{pos:p.clone().sub(dir.clone().multiplyScalar(5.2)).add(V([0,1.7,0])),target:p.clone().add(dir.clone().multiplyScalar(9)),fov:60};
  if(kind==='ttl')return{pos:p.clone().add(side.clone().multiplyScalar(2.6*sign)).add(V([0,.9,0])).sub(dir.clone().multiplyScalar(1.6)),target:p,fov:40};
  if(kind==='flyby')return{pos:p.clone().add(side.multiplyScalar(6.5*sign)).add(V([0,2,0])),target:p,fov:50};
  return{pos:p.clone().sub(dir.clone().multiplyScalar(8)).add(V([0,3.6,0])).add(side.multiplyScalar(3*sign)),target:p.clone().add(dir.multiplyScalar(5)),fov:56};
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),idx=+shot.id.slice(1),sign=idx%2?1:-1,bump=this.pulse||0,n=shot.target?.startsWith('n:')?shot.target.slice(2):null;let c;const look=(pos,target,fov=50)=>({pos:V(pos),target:V(target),fov});
  const vr=voidRadius(t);
  switch(shot.camera){
   case'opening':c=look([lerp(-96,-82,u),lerp(30,13,u),lerp(46,26,u)],[lerp(-40,-20,u),4,0],52);break;
   case'hop':{const p=V(top(n));c=look(p.clone().add(V([-7+2*lin,2.4,8*sign])),p.clone().add(V([1.5,-.4,0])),46);break;}
   case'void':c=look([VOID[0]-(8+vr*1.6)+1.5*lin,VOID[1]+2.6+vr*.4,VOID[2]+(8+vr*1.4)*sign],VOID,48);break;
   case'ride':case'chase':case'flyby':case'ttl':case'fall':c=this.povCamera(shot.camera,shot.target.slice(2),t,shot);break;
   case'cable':{const x=lerp(-60,-8,lin),zz=lerp(4,1,lin);c=look([x,TOWER+1.2,zz-4.5],[x+14,TOWER-.5,zz],56);break;}
   case'tower':{const p=V(top(n));c=look(p.clone().add(V([-9,-4.8,10*sign])),p.clone().add(V([0,1.5,0])),56);break;}
   case'host':{const p=NODES.S.pos;c=look([p[0]+6,4.6,p[2]-6.5],[p[0]+1,3.2,p[2]-1.5],46);break;}
   case'site':{const p=V(top(n));c=look(p.clone().add(V([-12,6,-10*sign])),p,48);break;}
   case'wide':c=look([lerp(-74,-60,lin),38,58],[-4,2,4],50);break;
   case'wide2':c=look([lerp(60,48,lin),32,-44],[-8,2,4],52);break;
   case'orbit':{const ang=idx*.9+lerp(-.4,.4,lin);c=look([VOID[0]+20*Math.cos(ang),9,VOID[2]+20*Math.sin(ang)],VOID,50);break;}
   case'final':c=look([lerp(-26,-18,u),lerp(9,7,u),lerp(30,24,u)],[0,1.5,-2],52);break;
   default:c=look([-60,30,50],[0,3,0]);
  }
  return{pos:c.pos.add(V([0,.08*bump,0])),target:c.target,fov:c.fov-1*bump};
 }
}
