// The path: host A, firewall, R1, R2 with the tunnel gate, the IPsec tunnel, R3 and server B. Two lanes:
// forward (data, pings) and return (replies, ICMP). Packet height is size × K; the gate never changes.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,ring,curveTube,baseScene,label,cachedTexture,stars,routerObject,sourceServer,instanced,orient,random,dynamicTexture} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {titleOpacity} from '../overlay.js';
import {X,K,RAIL_Y,GATE_H,GATE_W,LANE_GAP,LINK_MTU,zf,zr,dims,BY_ID,activeFlights,flightPos,heading,phase,inTunnel,FIX,LEARN,upload,FILE_SEGMENTS,S_FLIGHTS,resolveTarget,HOST_IP,FW_IP,R1_IP,R2_IP,R3_IP,SRV_IP,V_DATA} from '../model.js';
const KIND_COLOR={data:P.data,seg:P.data,ping:P.cyan,reply:P.ok,probe:P.cyan,icmp:P.icmp};
const REVEAL=42.54;
const yaw=x=>-Math.atan2(zf(x+.5)-zf(x-.5),1);
const lanePts=(f,x0,x1,y,step=1)=>{const pts=[];for(let x=x0;x<=x1+1e-9;x+=step)pts.push([x,y,f(x)]);return pts;};
function letterTexture(ch){const c=document.createElement('canvas');c.width=256;c.height=256;const g=c.getContext('2d');g.font='400 210px "Michroma"';g.textAlign='center';g.fillStyle='#fff';g.fillText(ch,128,206);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
export class PathZone{
 constructor(){
  const s=this.scene=baseScene(.0045);s.add(new THREE.HemisphereLight(0xbcd8ff,0x10233a,1.6));stars(s,900,260);
  const key=new THREE.DirectionalLight(0xdcecff,1.6);key.position.set(-20,40,30);s.add(key);
  this.gateLight=new THREE.PointLight(P.cyan,40,30,1.6);this.gateLight.position.set(X.gate,5,zf(X.gate)+2);s.add(this.gateLight);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(900,900),mat(0x081a30,{roughness:.95,metalness:.05}));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;s.add(floor);
  const grid=new THREE.GridHelper(600,300,0x1d4a78,0x12304f);grid.material.transparent=true;grid.material.opacity=.45;s.add(grid);
  // Cover motif: two luminous rivers of dots under the path, blue and orange, flowing towards the server.
  this.river=instanced(s,new THREE.SphereGeometry(.07,6,4),additive(0xffffff),1400);
  // Rails: forward lane blue, return lane amber.
  this.railF=curveTube(s,lanePts(zf,X.host,X.srv,RAIL_Y-.06),glow(P.blue,.9),.06,200);
  this.railR=curveTube(s,lanePts(zr,X.host,X.srv,RAIL_Y-.06),glow(P.orange,.55),.05,200);
  for(const[a,b,m]of[['host','fw',1500],['fw','r1',1500],['r1','r2',1500],['r3','srv',1500]]){const x=(X[a]+X[b])/2;label(s,`MTU ${m}`,'link',[x,1.4,zf(x)-1.6],2.2,'#8fd2ff');}
  // Host A: desk, monitor (the upload UI) and the send queue.
  const hz=zf(X.host);box(s,[3.4,.12,2.2],[X.host-1.6,1.0,hz-2.6],mat(0x2b4766));box(s,[.2,1,.2],[X.host-1.6,.5,hz-2.6],mat(0x1a2c40));
  this.hostScreen=dynamicTexture(640,400);const hs=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.62),new THREE.MeshBasicMaterial({map:this.hostScreen.tex,toneMapped:false}));hs.position.set(X.host-1.6,2.0,hz-3.5);hs.rotation.y=Math.PI;s.add(hs);box(s,[2.8,1.8,.08],[X.host-1.6,2.0,hz-3.42],mat(0x15283d));
  box(s,[2.8,.25,2.4],[X.host,.12,hz],mat(0x16314f));this.queueRing=ring(s,1.5,[X.host,.3,hz],additive(P.orange,0),.05);this.queueRing.rotation.x=Math.PI/2;
  label(s,'HOST A',`${HOST_IP} · uploads report.pdf`,[X.host-1.6,4.0,hz-2.6],3.2,'#cfe6f2');
  // Firewall: a wall across both lanes; the return lane passes a filter grid.
  const fz=(zf(X.fw)+zr(X.fw))/2;this.fw=new THREE.Group();this.fw.position.set(X.fw,0,fz);this.fw.rotation.y=yaw(X.fw);s.add(this.fw);
  const fm=mat(0x203c5c,{metalness:.5,roughness:.35});box(this.fw,[.35,4.2,.35],[0,2.1,-LANE_GAP/2-1.6],fm);box(this.fw,[.35,4.2,.35],[0,2.1,LANE_GAP/2-1.4],fm);box(this.fw,[.35,4.2,.35],[0,2.1,LANE_GAP/2+1.6],fm);box(this.fw,[.35,.35,LANE_GAP+3.6],[0,4.3,0],fm);
  this.filterMat=new THREE.MeshBasicMaterial({map:this.gridTexture(),color:P.drop,transparent:true,opacity:.75,toneMapped:false,side:THREE.DoubleSide,depthWrite:false,blending:THREE.AdditiveBlending});
  const filter=new THREE.Mesh(new THREE.PlaneGeometry(2.9,3.9),this.filterMat);filter.rotation.y=Math.PI/2;filter.position.set(0,2.1,LANE_GAP/2+.1);this.fw.add(filter);
  this.fwOpen=box(this.fw,[.04,3.9,LANE_GAP+.2],[0,2.1,-.6],additive(P.ok,.05));
  label(s,'FIREWALL',FW_IP,[X.fw,5.6,fz],3,'#cfe6f2');this.ruleLabel=label(s,'ICMP ✕','only echo-reply, time-exceeded',[X.fw,.9,zr(X.fw)+1.6],2.6,'#ff8b95');this.ruleOk=label(s,'ICMP 3/4 ✓','frag-needed accepted',[X.fw,.9,zr(X.fw)+1.6],2.6,'#7ff5c0');
  // Routers between the lanes.
  this.routers={};for(const[id,ip]of[['r1',R1_IP],['r2',R2_IP],['r3',R3_IP]]){const x=X[id],z=(zf(x)+zr(x))/2;this.routers[id]=routerObject(s,[x,.4,z],id==='r2'?P.tunnel:P.blue,1.8);label(s,id.toUpperCase(),id==='r2'?`${ip} · tunnel head`:id==='r3'?`${ip} · tunnel tail`:ip,[x,3.0,z],2.4,'#cfe6f2');}
  // The gate at the tunnel mouth on the forward lane: inner opening exactly 1400 bytes high.
  const gx=X.gate,gz=zf(gx);this.gate=new THREE.Group();this.gate.position.set(gx,RAIL_Y,gz);this.gate.rotation.y=yaw(gx);s.add(this.gate);
  this.gateMat=new THREE.MeshStandardMaterial({color:0x9fd8ff,emissive:P.cyan,emissiveIntensity:.2,metalness:.6,roughness:.3,transparent:true,opacity:.25});
  const bw=.22;box(this.gate,[.3,bw,GATE_W+2*bw],[0,GATE_H+bw/2,0],this.gateMat);box(this.gate,[.3,GATE_H+bw,bw],[0,(GATE_H+bw)/2,GATE_W/2+bw/2],this.gateMat);box(this.gate,[.3,GATE_H+bw,bw],[0,(GATE_H+bw)/2,-GATE_W/2-bw/2],this.gateMat);
  this.gateEdge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(GATE_W,GATE_H)),new THREE.LineBasicMaterial({color:P.cyan,transparent:true,opacity:.2,toneMapped:false}));this.gateEdge.rotation.y=Math.PI/2;this.gateEdge.position.y=GATE_H/2;this.gate.add(this.gateEdge);
  this.gateSign=label(this.gate,'MTU 1400','IPsec tunnel · DF packets above this die here',[0,GATE_H+.9,0],3.2,'#9feaf6');
  // Ruler ticks on the gate post: 0 … 1500 bytes.
  for(let b=0;b<=1500;b+=100){const m=box(this.gate,[.32,.02,b%500?.18:.38],[0,b*K,-GATE_W/2-bw-.15],glow(b===1400?P.orange:P.white,b===1400?1.4:.5));m.userData.tick=true;}
  // M-T-U on an arch above the gate.
  this.letters=['M','T','U'].map((ch,i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(1.5,1.5),new THREE.MeshBasicMaterial({map:letterTexture(ch),transparent:true,toneMapped:false,depthWrite:false,blending:THREE.AdditiveBlending,color:0}));m.position.set(0,GATE_H+2.6,(i-1)*1.55);m.rotation.y=-Math.PI/2;this.gate.add(m);return m;});
  // The tunnel: violet ribs over both lanes, exactly one 1500-byte link high inside.
  this.ribs=instanced(s,new THREE.BoxGeometry(1,1,1),glow(0xffffff),400);this.ribList=[];
  for(let x=X.tin;x<=X.tout;x+=2.2){const z=(zf(x)+zr(x))/2,ry=yaw(x),H=RAIL_Y+LINK_MTU*K+.35,W=LANE_GAP+3.4;this.ribList.push({x,z,ry,H,W});}
  const tq=new THREE.Quaternion();this.ribs.begin();for(const r of this.ribList){tq.setFromEuler(new THREE.Euler(0,r.ry,0));this.ribs.push(V([r.x,r.H,r.z]),P.tunnel,new THREE.Vector3(.05,.05,r.W),tq,.32);for(const sd of[-1,1]){const off=new THREE.Vector3(0,0,sd*r.W/2).applyQuaternion(tq);this.ribs.push(V([r.x,r.H/2,r.z]).add(off),P.tunnel,new THREE.Vector3(.05,r.H,.05),tq,.32);}}this.ribs.end();
  label(s,'IPsec TUNNEL','R2 → R3 · tunnel MTU 1400',[(X.tin+X.tout)/2,5.2,zf((X.tin+X.tout)/2)+2],3.6,'#cbb8ff');
  // Server B and the mosaic that fills as file segments arrive.
  const sz=zf(X.srv);this.server=sourceServer(s,[X.srv+1.2,1.2,sz],2.2);label(s,'SERVER B',SRV_IP,[X.srv+1.2,3.4,sz],2.8,'#cfe6f2');
  this.mosaic=dynamicTexture(800,400);const mm=new THREE.Mesh(new THREE.PlaneGeometry(8,4),new THREE.MeshBasicMaterial({map:this.mosaic.tex,toneMapped:false}));mm.position.set(X.srv+5.5,3.2,sz+3.0);mm.rotation.y=-Math.PI/2+.35;s.add(mm);
  label(s,'report.pdf','arrives in 1400-byte packets',[X.srv+5.5,5.8,sz+3.0],3,'#9feaf6');
  // Packets.
  const unit=new THREE.BoxGeometry(1,1,1);
  this.bodies=instanced(s,unit,new THREE.MeshStandardMaterial({color:0xffffff,transparent:true,opacity:.42,roughness:.15,metalness:.1,depthWrite:false}),160);
  this.cores=instanced(s,unit,additive(0xffffff),160);this.heads=instanced(s,unit,glow(0xffffff),160);this.clamps=instanced(s,unit,additive(0xffffff),160);this.shells=instanced(s,unit,additive(0xffffff),120);
  this.overs=instanced(s,unit,additive(0xffffff),40);this.trails=instanced(s,new THREE.SphereGeometry(.12,6,4),additive(0xffffff),900);this.shards=instanced(s,new THREE.TetrahedronGeometry(.16),additive(0xffffff),400);
  this.flightLabels=Array.from({length:3},()=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false,depthWrite:false}));sp.userData.labelWidth=3.0;sp.scale.set(3,.56,1);sp.renderOrder=11;sp.visible=false;s.add(sp);return sp;});
  // Trace hop markers (x-ray), the black crack, and a sweep along the path.
  this.hops=[[X.fw,`1  ${FW_IP}`,'#9feaf6'],[X.r1,`2  ${R1_IP}`,'#9feaf6'],[X.r2,`3  ${R2_IP}`,'#9feaf6'],[X.r3,'4  no reply','#ff8b95'],[X.srv,'5  no reply','#ff8b95']].map(([x,t,c])=>{const l=label(s,t,'tracepath · pmtu 1500',[x,6.8,zf(x)],9,c);l.userData.alpha=0;return l;});
  this.crack=box(s,[6,GATE_H+3,LANE_GAP+5],[X.gate+3.4,RAIL_Y+(GATE_H+3)/2-.3,(zf(X.gate)+zr(X.gate))/2],new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:0}));this.crack.rotation.y=yaw(X.gate);
  this.crackEdge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(6,GATE_H+3,LANE_GAP+5)),new THREE.LineBasicMaterial({color:P.drop,transparent:true,opacity:0,toneMapped:false}));this.crack.add(this.crackEdge);
  this.sweep=new THREE.Mesh(new THREE.SphereGeometry(.5,16,8),additive(P.cyan,0));s.add(this.sweep);
  this.q=new THREE.Quaternion();this.tq=new THREE.Quaternion();
 }
 gridTexture(){const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d');g.strokeStyle='#fff';g.lineWidth=3;for(let i=0;i<=128;i+=16){g.beginPath();g.moveTo(i,0);g.lineTo(i,128);g.stroke();g.beginPath();g.moveTo(0,i);g.lineTo(128,i);g.stroke();}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(3,3);return t;}
 update(t,a,tl,shot){
  const imp=tl.attack(t),drop=tl.drop(t),bass=a.sub_20_60_drive??0,reveal=smooth(REVEAL,REVEAL+.6,t),fixed=t>=LEARN;this.pulse=imp;
  // Rivers under the path: dots drift towards the server; brightness follows the sub band.
  const rv=this.river;rv.begin();for(let i=0;i<1400;i++){const lane=i%2,u=((random(i*7)+t*(.025+.01*random(i*3)))%1),x=lerp(X.host-30,X.srv+30,u),z=(lane?zr(x)+6+random(i*5)*7:zf(x)-6-random(i*5)*7)+1.5*Math.sin(u*Math.PI*3+i);rv.push(V([x,.03,z]),lane?P.orange:P.blue,.35+random(i)*.5,null,.3+.45*bass);}rv.end();
  setGlow(this.railF.material,P.blue,.6+.5*bass+.6*drop);setGlow(this.railR.material,P.orange,.35+.3*bass);
  this.gateMat.opacity=.18+.72*reveal;this.gateMat.emissiveIntensity=.2+1.1*reveal+.6*imp;this.gateEdge.material.opacity=.12+.8*reveal;this.gateSign.userData.alpha=reveal;this.gateLight.intensity=8+40*reveal+30*drop;
  this.gateLight.color.setHex(fixed?P.ok:P.cyan);
  // Letters light in sequence on every sung "M-T-U": red while the path is broken, green once it works.
  let lv=[0,0,0];for(const l of tl.analysis.lyrics.segments){if(!/^M-T-U/.test(l.text))continue;for(let i=0;i<3;i++){const d=t-(l.start_s+i*.17);if(d>=0&&d<2.4)lv[i]=Math.max(lv[i],Math.exp(-d/1.1));}}
  const after=t>=104,tt=1-titleOpacity(t);this.letters.forEach((m,i)=>setGlow(m.material,after?P.ok:P.drop,(lv[i]*1.6+(after?.25:t>49?.12:0))*tt));
  // Firewall filter: red until the fix, then green; it flashes on whatever touches it.
  const ok=t>=FIX;this.filterMat.color.setHex(ok?P.ok:P.drop);this.filterMat.opacity=.28+.18*bass;this.ruleLabel.userData.alpha=ok?0:1;this.ruleOk.userData.alpha=ok?1:0;
  // Host screen and queue.
  const up=upload(t),queued=activeFlights(t).find(f=>phase(f,t)==='queued');setGlow(this.queueRing.material,P.orange,queued?.6+.4*Math.sin(t*6):0);this.queueRing.rotation.z=t*2;
  this.hostScreen.set(`${up.done}:${Math.round(up.pct*50)}:${t>=LEARN}:${Math.floor(t*2)%4}`,(g,w,h)=>{g.fillStyle='#0a1830';g.fillRect(0,0,w,h);g.fillStyle='#16345a';g.fillRect(0,0,w,46);g.fillStyle='#cfe6f2';g.font='22px "JetBrains Mono"';g.fillText('upload · report.pdf',18,31);
   g.font='600 40px "Space Grotesk"';g.fillStyle=up.done?'#3fe6a0':up.pct>0?'#9feaf6':'#ff8b95';g.fillText(up.done?'Upload complete':up.pct>0?'Uploading …':'Waiting for network'+'.'.repeat(Math.floor(t*2)%4),24,130);
   g.fillStyle='#1b3555';g.fillRect(24,190,w-48,34);g.fillStyle=up.done?'#3fe6a0':'#59e3ff';g.fillRect(24,190,(w-48)*up.pct,34);g.font='24px "JetBrains Mono"';g.fillStyle='#8fb2c8';g.fillText(`${Math.round(up.pct*100)} % · ${(up.bytes/1000).toFixed(1)} of 42.9 kB`,24,270);});
  // Mosaic: one tile per delivered file segment.
  this.mosaic.set(String(up.n),(g,w,h)=>{const cols=8,rows=4,tw=w/cols,th=h/rows;g.fillStyle='#071322';g.fillRect(0,0,w,h);for(let k=0;k<cols*rows;k++){const cx=(k%cols)*tw,cy=Math.floor(k/cols)*th;
   if(k<up.n){for(let yy=0;yy<th;yy+=4)for(let xx=0;xx<tw;xx+=4){const X0=(cx+xx)/w-.5,Y0=(cy+yy)/h-.5,r=Math.hypot(X0*2,Y0*1.4),v=.5+.5*Math.sin(r*26);g.fillStyle=r<.32?`rgb(${40+60*v},${150+80*v},255)`:`rgb(255,${120+60*v},${40+40*v})`;g.fillRect(cx+xx,cy+yy,4,4);}}
   else{g.strokeStyle='#1d3a55';g.strokeRect(cx+2,cy+2,tw-4,th-4);}}});
  // Packets.
  const focus=resolveTarget(shot),B=this.bodies,C=this.cores,H=this.heads,CL=this.clamps,SH=this.shells,O=this.overs,T=this.trails,SD=this.shards;[B,C,H,CL,SH,O,T,SD].forEach(i=>i.begin());const labelled=[];
  for(const f of activeFlights(t)){
   const ph=phase(f,t),col=KIND_COLOR[f.kind],{w,d,h}=dims(f.size),pos=V(flightPos(f,Math.min(t,f.t1))),hd=V(heading(f,t)),q=orient(this.q,pos,pos.clone().add(hd));
   let vis=1,flash=0;if(ph==='dropped'||ph==='blocked'){const dt=t-f.t1;vis=1-dt/.42;flash=1-dt/.2;if(vis<=0)continue;
    for(let k=0;k<8;k++){const dir=V([random(k*13+f.t0*7)-.5,random(k*17+f.t0)*.8,random(k*19+f.t0*3)-.5]).normalize();SD.push(pos.clone().add(dir.multiplyScalar(dt*5)),ph==='blocked'?P.icmp:P.drop,1+(1-dt/.42),null,1.4*vis);}}
   if(ph==='arrived'){vis=1-(t-f.t1)/.15;if(vis<=0)continue;}
   const fwd=new THREE.Vector3(0,0,1).applyQuaternion(q),tun=inTunnel(pos.x),red=flash>0?P.drop:col;
   B.push(pos,flash>0?P.drop:0x7fb6e8,new THREE.Vector3(w,h,d),q,vis*(.55+.45*flash));
   C.push(pos,red,new THREE.Vector3(w*.5,h*.8,d*.6),q,vis*(.42+.25*imp));
   if(f.size>=300)H.push(pos.clone().add(fwd.clone().multiplyScalar(d/2+.04)),f.kind==='icmp'?P.icmp:0x8fd2ff,new THREE.Vector3(w*1.02,h*1.02,.07),q,vis*.6);
   if(f.df&&f.size>=600)CL.push(pos,P.orange,new THREE.Vector3(w+.16,h+.16,.12),q,vis*(.35+.3*imp));
   if(tun&&f.lane==='fwd')SH.push(pos.clone().add(V([0,100*K/2,0])),P.tunnel,new THREE.Vector3(w+.3,h+100*K,d+.3),q,.35*vis);
   // A packet larger than the gate shows its overhang near the gate.
   if(f.lane==='fwd'&&f.size>1400&&Math.abs(pos.x-X.gate)<7){const oh=(f.size-1400)*K;O.push(V([pos.x,RAIL_Y+GATE_H+oh/2,pos.z]),P.drop,new THREE.Vector3(w+.04,oh,d+.04),q,vis*(.9+.6*Math.sin(t*14)));}
   if(ph==='moving')for(let k=1;k<=7;k++){const tt=t-k*.03;if(tt<f.keys[0][0])break;T.push(V(flightPos(f,tt)),col,Math.min(1,h)*.9*(1-k/8),null,.5*(1-k/8));}
   if(f.label&&ph!=='arrived'&&(f.id===focus||(!focus&&f.size>=600)))labelled.push({f,pos,h});
  }
  [B,C,H,CL,SH,O,T,SD].forEach(i=>i.end());labelled.sort((a,b)=>(b.f.id===focus)-(a.f.id===focus));
  this.flightLabels.forEach((sp,i)=>{const l=labelled[i];sp.visible=!!l;if(!l)return;sp.material.map=cachedTexture(l.f.label,l.f.kind==='icmp'?`from ${R2_IP} → ${HOST_IP}`:`${HOST_IP} → ${SRV_IP}`,'#'+new THREE.Color(KIND_COLOR[l.f.kind]).getHexString());sp.position.copy(l.pos).add(V([0,l.h/2+.9,0]));});
  // Mode-specific overlays in the world.
  const xr=shot.mode==='trace'?smooth(shot.start,shot.start+.4,t):0;this.hops.forEach((l,i)=>l.userData.alpha=xr*clamp((t-shot.start)*3-i*.4));
  const crack=shot.mode==='crack'?smooth(shot.start,shot.start+.5,t):0;this.crack.material.opacity=.92*crack;this.crackEdge.material.opacity=crack*(.6+.4*Math.sin(t*9));
  const sw=shot.mode==='find'?clamp((t-shot.start)/(shot.end-shot.start)):-1;this.sweep.visible=sw>=0;if(sw>=0){const x=lerp(X.host,X.srv,sw);this.sweep.position.set(x,RAIL_Y+.2,zf(x));setGlow(this.sweep.material,inTunnel(x)?P.tunnel:P.cyan,1.5);}
  this.routers.r2.halo.material.color.setHex(P.drop).multiplyScalar(activeFlights(t).some(f=>f.fate==='drop'&&phase(f,t)==='dropped')?1.2:0);
  for(const r of Object.values(this.routers))r.root.rotation.y=t*.2;
 }
 povCamera(kind,id,t,shot){
  const f=BY_ID.get(id),tt=Math.min(t,f.t1),p=V(flightPos(f,tt)),dir=V(heading(f,tt)).normalize(),side=V([dir.z,0,-dir.x]).normalize(),sign=+shot.id.slice(1)%2?1:-1,h=dims(f.size).h;
  if(kind==='ride')return{pos:p.clone().sub(dir.clone().multiplyScalar(4.2+h)).add(V([0,1.2+h*.6,0])),target:p.clone().add(dir.clone().multiplyScalar(10)).add(V([0,.8,0])),fov:64};
  if(kind==='tunnel')return{pos:p.clone().sub(dir.clone().multiplyScalar(3.4)).add(V([0,h*.5+.6,.6*sign])),target:p.clone().add(dir.clone().multiplyScalar(12)).add(V([0,.6,0])),fov:74};
  if(kind==='flyby')return{pos:p.clone().add(side.multiplyScalar(6*sign)).add(V([0,1.6,0])),target:p,fov:50};
  return{pos:p.clone().sub(dir.clone().multiplyScalar(7)).add(V([0,3.4,0])).add(side.multiplyScalar(2.6*sign)),target:p.clone().add(dir.multiplyScalar(4)),fov:56};
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),bump=this.pulse||0,g=X.gate,gz=zf(g),id=resolveTarget(shot);let c;
  const look=(pos,target,fov=50)=>({pos:V(pos),target:V(target),fov});
  switch(shot.camera){
   case'opening':{const x=lerp(-46,-24,u);c=look([x,1.0,zf(x)-2.8],[x+10,1.3,zf(x+10)],56);break;}
   case'ride':case'chase':case'flyby':case'tunnel':c=this.povCamera(shot.camera,id,t,shot);break;
   case'gateside':c=look([g-2.4+.6*lin,2.4,gz-7.4],[g-.4,2.0,gz],44);break;
   case'gate':c=look([g-lerp(9,7.6,u),3.4,gz-lerp(3.6,2.8,lin)],[g,3.2,gz],52);break;
   case'fw':c=look([X.fw-8,4.4,zr(X.fw)+10],[X.fw+5,1.2,zr(X.fw)-1],50);break;
   case'host':c=look([X.host+lerp(6,5,u),3.4,zf(X.host)-7],[X.host-.8,1.6,zf(X.host)-1.4],46);break;
   case'receiver':c=look([X.srv-7,4.2,zf(X.srv)+10],[X.srv+3,2.6,zf(X.srv)+2],48);break;
   case'wide':c=look([lerp(-20,-4,lin),36,58],[-8,0,2],50);break;
   case'wide2':c=look([lerp(-10,-24,u),lerp(46,120,u),lerp(64,160,u)],[-8,0,0],50);break;
   case'xray':c=look([lerp(-14,-4,lin),24,34],[-8,1,2],54);break;
   case'pathline':{const x=lerp(X.host+4,X.srv-6,lin);c=look([x-4,6.5,zf(x)-11],[x+10,1.5,zf(x+10)],54);break;}
   case'topdown':c=look([g-.6,20,gz+2.2],[g,0,gz+2.1],50);break;
   case'final':c=look([g-lerp(19,14,u),4.4,gz-lerp(5.5,4.2,u)],[g+2,4.4,gz],50);break;
   default:c=look([0,30,60],[0,0,0]);
  }
  return{pos:c.pos.add(V([0,.08*bump,0])),target:c.target,fov:c.fov-1.0*bump};
 }
}
