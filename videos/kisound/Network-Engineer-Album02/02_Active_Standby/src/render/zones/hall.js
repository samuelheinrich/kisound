// The double installation: two identical, monumental FortiGates face each other across a data-hall aisle –
// A left (orange contour), B right (cyan). Between them, high up, the single HA link ha1 as a white tunnel with two
// separate lanes (heartbeat rings, sync plates). The shared LAN address hangs as a fixed ring over the production
// network (SW-LAN, clients at -z); SW-WAN and the WAN at +z. Camera axes never swap left and right.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,random,label,instanced,canvasTexture,dynamicTexture,tube} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {ST,HA_DOWN,HA_UP,B_PRIMARY,LAN_SHUT,WAN_SHUT,ELECTED,IN_SYNC,RELEASE,role,priority,links,forwards,ringOwner,haUp,inSync,HEARTBEATS,SYNCS,activeFlights,pointAt,BY_ID,PEER_TIMER,voiceOf,s17,diverged} from '../model.js';
const COL={A:P.a,B:P.b},HX=8.6,HY=8.2;
const haCurve=new THREE.QuadraticBezierCurve3(V([-HX,HY,0]),V([0,HY-1.1,0]),V([HX,HY,0]));
const onHa=(u,dy=0)=>haCurve.getPoint(clamp(u)).add(new THREE.Vector3(0,dy,0));
export class HallZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x02050b);s.fog=new THREE.FogExp2(0x02050b,.011);
  s.add(new THREE.HemisphereLight(0x6f92c8,0x05080e,1.0));const key=new THREE.DirectionalLight(0xa9c8ff,1.0);key.position.set(0,30,30);s.add(key);
  // glossy floor, ceiling light strips, rack walls (the hall of the cover)
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(120,140),mat(0x070d16,{roughness:.28,metalness:.75}));floor.rotation.x=-Math.PI/2;s.add(floor);
  const grid=[];for(let x=-60;x<=60;x+=3)grid.push(x,.01,-70,x,.01,70);for(let z=-70;z<=70;z+=3)grid.push(-60,.01,z,60,.01,z);s.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(grid,3)),new THREE.LineBasicMaterial({color:0x10263c,transparent:true,opacity:.45,depthWrite:false})));
  for(const x of[-18,-6,6,18])for(let z=-60;z<=60;z+=10)box(s,[1.2,.1,6],[x,22,z],glow(0x9fd0ff,.9));
  const front=canvasTexture(256,512,(c,w,h)=>{c.fillStyle='#0a1118';c.fillRect(0,0,w,h);for(let i=0;i<20;i++){const y=12+i*24.5;c.fillStyle='#131e2a';c.fillRect(10,y,236,20);for(let k=0;k<6;k++){const r=random(i*9+k);c.fillStyle=r<.35?'#3fd0ff':r<.55?'#ffa040':r<.7?'#2fbf71':'#1b2733';c.fillRect(160+k*13,y+7,6,6);}}});
  const rackM=new THREE.MeshStandardMaterial({map:front,emissiveMap:front,emissive:0xffffff,emissiveIntensity:.8,roughness:.5,metalness:.4});
  this.racks=instanced(s,new THREE.BoxGeometry(2,8,2.4),rackM,120);this.racks.begin();for(const x of[-27,27])for(let z=-58;z<=58;z+=2.5)this.racks.push(new THREE.Vector3(x,4,z),0xffffff,1,new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),x<0?Math.PI/2:-Math.PI/2));this.racks.end();
  this.units={A:this.unit(s,'A',-1),B:this.unit(s,'B',1)};this.buildNetwork(s);this.buildHa(s);this.buildRing(s);
  this.carriers=instanced(s,new THREE.BoxGeometry(.9,.14,1.5),additive(0xffffff),90);this.bits=instanced(s,new THREE.BoxGeometry(.12,.12,.12),additive(0xffffff),200);
  this.pulses=instanced(s,new THREE.TorusGeometry(.42,.07,8,24),additive(0xffffff),24);this.plates=instanced(s,new THREE.BoxGeometry(.05,.62,.95),additive(0xffffff),6);
  this.tag=label(s,'S-17 · Zustandskopie','',[0,10,0],2.6,'#bff5e0');this.tag.userData.alpha=0;this.flowTag=label(s,'Flow','',[0,3,0],2.4,'#e6f6ff');this.flowTag.userData.alpha=0;
 }
 unit(s,dev,side){
  const g=new THREE.Group();g.position.set(side*(HX+2.5),0,0);s.add(g);const col=COL[dev];
  const body=new THREE.Mesh(new THREE.BoxGeometry(5,9.4,17),mat(0x1a2330,{metalness:.75,roughness:.32}));body.position.y=4.7;g.add(body);
  const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(5.04,9.44,17.04)),new THREE.LineBasicMaterial({color:col,toneMapped:false}));edge.position.y=4.7;g.add(edge);
  // front panel facing the aisle: vents, port row, status display, LEDs
  const panel=canvasTexture(1024,560,(c,w,h)=>{c.fillStyle='#121a24';c.fillRect(0,0,w,h);for(let y=30;y<h-30;y+=14)for(let x=30;x<w-30;x+=14){c.fillStyle='#0a0f15';c.fillRect(x,y,8,6);}
   c.fillStyle='#0d141c';c.fillRect(40,h-150,w-80,110);c.strokeStyle='#3a4a5a';c.lineWidth=3;c.strokeRect(40,h-150,w-80,110);});
  const pm=new THREE.Mesh(new THREE.PlaneGeometry(17,9.4),new THREE.MeshStandardMaterial({map:panel,roughness:.5,metalness:.5}));pm.position.set(-side*2.52,4.7,0);pm.rotation.y=-side*Math.PI/2;g.add(pm);
  const disp=dynamicTexture(1024,512),dm=new THREE.Mesh(new THREE.PlaneGeometry(9,4.5),new THREE.MeshBasicMaterial({map:disp.tex,toneMapped:false}));dm.position.set(-side*2.55,5.4,0);dm.rotation.y=-side*Math.PI/2;g.add(dm);
  // ports: port1 (LAN, -z), port2 (WAN, +z), ha1 (top centre); each with a shutter light
  const ports={};for(const[k,z,y]of[['p1',-5,1.4],['p2',5,1.4],['ha',0,8.2]]){const m=glow(col,1.2);const p=box(g,[.2,.8,1.4],[-side*2.6,y,z],m);ports[k]=m;label(s,k==='p1'?'port1 · LAN':k==='p2'?'port2 · WAN':'ha1',dev+(k==='ha'?' · HA':''),[side*(HX-.2),y+1.0,z],2.2);}
  // engraved letter on top and on the end facing the camera (+z)
  const letter=canvasTexture(512,512,(c,w,h)=>{c.font='700 440px "Michroma"';c.textAlign='center';c.fillStyle='#ffffff';c.fillText(dev,w/2,h*.84);});
  const lm=new THREE.MeshBasicMaterial({map:letter,transparent:true,color:new THREE.Color(col).multiplyScalar(1.2),toneMapped:false,depthWrite:false});const top=new THREE.Mesh(new THREE.PlaneGeometry(4.4,4.4),lm);top.rotation.x=-Math.PI/2;top.position.set(0,9.42,4);g.add(top);
  const end=new THREE.Mesh(new THREE.PlaneGeometry(4,4),lm);end.position.set(0,5,8.52);g.add(end);
  const voice=new THREE.Mesh(new THREE.BoxGeometry(5.2,.12,17.2),additive(col,0));voice.position.y=.06;g.add(voice);
  return{g,disp,ports,edge,voice,col,dev,side};
 }
 buildNetwork(s){
  const sw=(name,z,sub)=>{const g=new THREE.Group();g.position.set(0,0,z);s.add(g);box(g,[13,1.6,3],[0,.8,0],mat(0x142233,{metalness:.6}));const leds=[];for(let i=0;i<24;i++)leds.push(box(g,[.3,.18,.05],[-5.6+i*.48,1.1,z<0?1.52:-1.52],glow(P.ok,.6)));
   label(s,name,sub,[0,3.2,z],3.4);return{g,leds};};
  this.swl=sw('SW-LAN','IOS XE · Gi1/0/11 → A · Gi1/0/12 → B',ST.SWL[2]);this.sww=sw('SW-WAN','IOS XE · Gi1/0/11 → A · Gi1/0/12 → B',ST.SWW[2]);
  for(let i=0;i<9;i++){const x=-12+i*3;box(s,[1.2,2.2,1.2],[x,1.1,-40],mat(0x13202e,{metalness:.5}));box(s,[.8,.5,.05],[x,1.7,-39.38],glow(0x9fd0ff,.5));}label(s,'LAN-CLIENTS','192.0.2.0/24 · Gateway 192.0.2.1',[0,4,-40],3.8);
  box(s,[10,3,3],[0,1.5,40],mat(0x13202e,{metalness:.5}));label(s,'WAN','198.51.100.0/24',[0,5,40],2.6);
  this.cables={};for(const[k,a,b,dev]of[['A1','A1','SWL','A'],['B1','B1','SWL','B'],['A2','A2','SWW','A'],['B2','B2','SWW','B']]){const pa=V(ST[a]),pb=V(ST[b]);pa.y=.15;pb.y=.15;pb.x=dev==='A'?-1.5:1.5;const m=additive(COL[dev],.5);tube(s,[pa,V([pa.x*.6,.15,(pa.z+pb.z)/2]),pb],m,.09,24,true);this.cables[k]={m,dev};}
  for(const z of[-26,26]){const m=additive(0x9fd0ff,.35);tube(s,[V([0,.15,z]),V([0,.15,z<0?-40:40])],m,.09,8);}
 }
 buildHa(s){
  this.haOuter=additive(0xdfefff,.12);this.haL=new THREE.Mesh(new THREE.TubeGeometry(haCurve,60,.55,12,false),this.haOuter);s.add(this.haL);
  const lane=(dy,col)=>{const pts=Array.from({length:41},(_,i)=>onHa(i/40,dy));const m=additive(col,.6);const t=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),60,.035,5,false),m);s.add(t);return m;};
  this.hbLane=lane(.2,P.hb);this.syncLane=lane(-.22,P.sync);
  this.clampMat=glow(P.amber,0);this.clamp=new THREE.Mesh(new THREE.TorusGeometry(.75,.09,8,32),this.clampMat);this.clamp.position.copy(onHa(.5));this.clamp.rotation.y=Math.PI/2;s.add(this.clamp);
  this.breakMask=new THREE.Mesh(new THREE.CylinderGeometry(.62,.62,1.5,16),mat(0x02050b,{roughness:1}));this.breakMask.rotation.z=Math.PI/2;this.breakMask.position.copy(onHa(.5));s.add(this.breakMask);
  this.haLabel=label(s,'ha1 · einzige HA-Leitung','Heartbeat (oben) · Session-Sync (unten)',onHa(.5,1.6),4.4);
 }
 buildRing(s){this.ringMat=glow(P.a,1.2);this.ring=new THREE.Mesh(new THREE.TorusGeometry(2.6,.18,12,64),this.ringMat);this.ring.position.set(...ST.RING);s.add(this.ring);
  this.ringHalo=new THREE.Mesh(new THREE.TorusGeometry(2.6,.6,8,64),additive(P.a,.15));this.ringHalo.position.copy(this.ring.position);s.add(this.ringHalo);label(s,'192.0.2.1','gemeinsame LAN-Adresse · virtuelle MAC',[0,9.6,-17],3.6);
  this.claims={A:additive(P.a,0),B:additive(P.b,0)};for(const d of['A','B']){const sx=d==='A'?-1:1;tube(s,[V([sx*(HX-.1),5.6,-6]),V([sx*4,7.4,-12]),V([sx*2.2,6.6,-16.4])],this.claims[d],.07,30,true);}
 }
 drawDisplay(u,t){
  const dev=u.dev,r=role(dev,t),act=forwards(dev,t),l=links(dev,t),iso=dev==='A'&&(!l.lan||!l.wan),timer=dev==='B'&&t>=HA_DOWN&&t<B_PRIMARY,cnt=timer?(B_PRIMARY-t).toFixed(1):'',ha=haUp(t),sy=inSync(t),pr=priority(dev,t);
  u.disp.set([r,act,iso,cnt,ha,sy,pr,l.lan,l.wan].join('|'),(g,w,h)=>{g.fillStyle='#050a10';g.fillRect(0,0,w,h);g.strokeStyle='#'+u.col.toString(16).padStart(6,'0');g.lineWidth=8;g.strokeRect(4,4,w-8,h-8);
   g.font='700 150px "Michroma"';g.fillStyle=g.strokeStyle;g.fillText(dev,40,170);g.font='600 64px "Space Grotesk"';g.fillStyle=act?'#e8f6ff':'#9fb4c4';g.fillText(r==='primary'?'PRIMARY':'SECONDARY',230,95);
   g.font='600 54px "Space Grotesk"';g.fillStyle=act?(dev==='A'?'#ffb070':'#7fe2ff'):'#7f95a6';g.fillText(iso?'ISOLIERT':act?'ACTIVE · Datenpfad':'STANDBY',230,170);
   g.font='36px "JetBrains Mono"';g.fillStyle='#9fb4c4';g.fillText(`priority ${pr} · override enable · group 22`,40,260);
   g.fillStyle=ha?'#74d6a4':'#ff6b78';g.fillText(ha?'ha1 up · Heartbeat':'ha1 DOWN · kein Peer',40,320);g.fillStyle=sy?'#74d6a4':'#ffb13d';g.fillText(sy?'Sync: in-sync':'Sync: unterbrochen',40,375);
   g.fillStyle=l.lan&&l.wan?'#9fb4c4':'#ff6b78';g.fillText(`port1 ${l.lan?'up':'DOWN'} · port2 ${l.wan?'up':'DOWN'}`,40,430);
   if(timer){g.fillStyle='#ffb13d';g.font='600 46px "JetBrains Mono"';g.fillText(`Peer-Timer ${cnt} s`,560,430);}});
 }
 update(t,a,tl,shot){
  const beat=tl.attack(t),drop=tl.drop(t),bass=a.sub_20_60_drive??0,lyr=tl.lyricAt(t),voice=lyr?voiceOf(lyr.id):null;
  for(const u of Object.values(this.units)){this.drawDisplay(u,t);const l=links(u.dev,t),act=forwards(u.dev,t);setGlow(u.ports.p1,l.lan?u.col:P.red,l.lan?(act?1.4+beat:.5):.8);setGlow(u.ports.p2,l.wan?u.col:P.red,l.wan?(act?1.4+beat:.5):.8);setGlow(u.ports.ha,haUp(t)?P.hb:P.red,haUp(t)?1:.8);
   u.edge.material.color.setHex(u.col).multiplyScalar(act?1.3+.4*drop:.55);setGlow(u.voice.material,u.col,voice&&(voice===u.dev||voice==='AB')?.35+.25*beat:0);}
  for(const c of Object.values(this.cables)){const dev=c.dev,act=forwards(dev,t),l=links(dev,t),k=c===this.cables.A1||c===this.cables.B1?l.lan:l.wan;setGlow(c.m,k?COL[dev]:P.red,k?(act?.8+.3*bass:.18):.3);}
  this.swl.leds.forEach((m,i)=>setGlow(m.material,i===11&&!links('A',t).lan?P.red:P.ok,.4+.6*(random(i+Math.floor(t*6))>.5)));this.sww.leds.forEach((m,i)=>setGlow(m.material,i===11&&!links('A',t).wan?P.red:P.ok,.4+.6*(random(i*3+Math.floor(t*6))>.5)));
  // ha1: clamp point marked from 82.34, break at HA_DOWN, repair at HA_UP
  const up=haUp(t),brk=t>=HA_DOWN&&t<HA_DOWN+1.2?Math.exp(-(t-HA_DOWN)/.35):0,fix=t>=HA_UP&&t<HA_UP+1.4?Math.exp(-(t-HA_UP)/.4):0;
  setGlow(this.haOuter,up?0xdfefff:0x552030,up?.12+.15*fix:.06);setGlow(this.hbLane,up?P.hb:0x301018,up?.6:.2);setGlow(this.syncLane,up?P.sync:0x301018,up?.5:.2);
  this.breakMask.visible=!up;setGlow(this.clampMat,up?P.amber:P.red,t>=82.34&&t<HA_DOWN?.9+.6*Math.sin(t*4)**2:!up?1.2+2*brk:fix*1.5);
  this.bits.begin();if(brk)for(let i=0;i<60;i++){const d=t-HA_DOWN,v=new THREE.Vector3((random(i)-.5)*5,random(i+1)*3,(random(i+2)-.5)*5);this.bits.push(onHa(.5).addScaledVector(v,d).add(new THREE.Vector3(0,-4.9*d*d,0)),P.amber,1-d,null,2);}
  // ring: owner colour, flicker in split brain
  const own=ringOwner(t),flick=own==='both'?(Math.floor(t*9)%2?P.a:P.b):COL[own];setGlow(this.ringMat,flick,1.1+.5*drop);setGlow(this.ringHalo.material,own==='both'?P.red:flick,own==='both'?.25+.2*Math.sin(t*20)**2:.14);
  for(const d of['A','B'])setGlow(this.claims[d],COL[d],forwards(d,t)?.8+.4*beat:0);
  // heartbeats and sync plates on ha1
  this.pulses.begin();for(const h of HEARTBEATS){if(h.t0>t)break;if(t>h.t1)continue;const u=(t-h.t0)/(h.t1-h.t0),p=onHa(h.from==='A'?u:1-u,.2),q=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2);this.pulses.push(p,h.from==='A'?P.a:P.b,1,q,1.6);}this.pulses.end();
  this.plates.begin();let shownPlate=null;for(const y of SYNCS){if(y.t0>t||t>y.t1)continue;const u=(t-y.t0)/(y.t1-y.t0),p=onHa(y.from==='A'?u:1-u,-.22);this.plates.push(p,P.sync,1,null,1.4);shownPlate={y,p};}this.plates.end();
  if(shownPlate){this.tag.position.copy(shownPlate.p).add(new THREE.Vector3(0,1.4,0));this.tag.userData.alpha=1;this.tag.material.map=this.tagTex(shownPlate.y);}else this.tag.userData.alpha=0;
  // production flows
  this.carriers.begin();let named=null;for(const f of activeFlights(t)){const ph=t<f.t1?'move':f.fate==='drop'?'drop':'done',p=V(pointAt(f,Math.min(t,f.t1)));p.y=Math.max(p.y,.35);
   if(ph==='done')continue;let col=f.kind==='test'?P.ok:COL[f.unit],str=f.kind==='test'?2:1.1,sc=f.kind==='test'?1.3:1;
   if(ph==='drop'){const d=t-f.t1;col=P.red;str=1.6*(1-d);for(let i=0;i<10;i++){const v=new THREE.Vector3((random(i+f.t0)-.5)*3,random(i+3)*2,(random(i+9)-.5)*3);this.bits.push(p.clone().addScaledVector(v,d).add(new THREE.Vector3(0,-4*d*d,0)),P.red,1-d,null,1.6);}}
   this.carriers.push(p,col,sc,null,str);if(f.name&&ph==='move'&&(!named||f.kind==='test'))named={f,p};}
  this.carriers.end();this.bits.end();
  if(named){this.flowTag.position.copy(named.p).add(new THREE.Vector3(0,1.3,0));this.flowTag.material.map=this.tagFor(named.f.name);this.flowTag.userData.alpha=1;}else this.flowTag.userData.alpha=0;
 }
 tagTex(y){return this._tag?.[y.id]??((this._tag??={})[y.id]=canvasTexture(1024,192,(g,w,h)=>{g.fillStyle='rgba(4,16,14,.75)';g.fillRect(0,0,w,h);g.strokeStyle='#9fe8d0';g.lineWidth=3;g.strokeRect(1,1,w-2,h-2);g.font='500 64px "Space Grotesk"';g.fillStyle='#d8fff0';g.fillText(`S-17 · Kopie ${y.from}→${y.to}`,28,90);g.font='34px "JetBrains Mono"';g.fillStyle='#93c4b4';g.fillText(`seq ${y.seq}${y.resync?' · Resync, B ist Autorität':''}`,28,152);}));}
 tagFor(name){return this._ft?.[name]??((this._ft??={})[name]=canvasTexture(1024,192,(g,w,h)=>{g.fillStyle='rgba(4,10,18,.7)';g.fillRect(0,0,w,h);g.strokeStyle='#74d6a4';g.lineWidth=3;g.strokeRect(1,1,w-2,h-2);g.font='500 76px "Space Grotesk"';g.fillStyle='#e6fff2';g.fillText(name,28,120);}));}
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),k=+shot.id.slice(1)%3;
  switch(shot.camera){
   case'facadeA':case'facadeB':{const sx=shot.camera==='facadeA'?-1:1,m=shot.mode;
    if(m==='enterA')return look([lerp(-1,-4.5,u),lerp(6,2.2,u),lerp(22,3,u)],[-HX,lerp(4,1.6,u),lerp(-2,-5,u)],40);
    if(/fence|fenced|release/.test(m))return look([lerp(-1.5,-.5,u),lerp(2.4,2.0,u),lerp(13,9,u)],[-HX,1.4,lerp(-1,-5,u)],40);
    if(/active|standby|outro|takeover|timer/.test(m))return look([sx*lerp(1.2,2.0,u),lerp(5.4,5.0,u),lerp(15,11,u)],[sx*HX,5.2,lerp(1.5,-1,u)],36);
    if(m==='test'||m==='tcptest'||m==='flowA'||m==='path'){const f=shot.target&&BY_ID.get(shot.target.slice(2)),fz=clamp(f?pointAt(f,clamp(t,f.t0,f.t1))[2]:lerp(10,-10,u),-9,9);return look([-sx*.4,3.8,fz+12],[sx*HX,1.8,fz-2],42);}
    return look([-sx*lerp(1.0,1.8,u),lerp(4.4,3.8,u),lerp(19-k*2,11-k*2,u)],[sx*HX,3.8,lerp(1,-6,u)],40);}
   case'ha':{const m=shot.mode;if(/clamp|break|repair/.test(m))return look([lerp(-1.6,1.6,u),lerp(11.2,10.6,u),lerp(6.8,5.8,u)],[0,7.2,0],32);if(m==='end')return look([lerp(-4,4,lin),lerp(12,14,lin),lerp(12,17,lin)],[0,7,-2],36);
    const x=lerp(-6.5,6.5,u)*(k===1?-1:1);return look([x,11.6,9.4],[x*.6,7.4,0],30);}
   case'wide':default:{const m=shot.mode;if(m==='split'||m==='address')return look([lerp(-1.5,1.5,u),lerp(7.8,7.2,u),lerp(-3,-6,u)],[0,6.2,-17],50);
    if(m==='twopaths')return look([0,lerp(15,12.5,u),lerp(20,15,u)],[0,4,-14],50);if(m==='out')return look([0,lerp(11,16,lin),lerp(28,40,lin)],[0,5,-8],50);
    return look([lerp(-1,1,u),lerp(15,12.5,u),lerp(36,30,u)],[0,5,-8],53);}
  }
 }
}
