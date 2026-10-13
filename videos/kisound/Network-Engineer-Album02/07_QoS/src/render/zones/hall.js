// The QoS machine hall, looking downstream (+x): RTP ramp left (blue), backup ramp right (orange). Stations along x:
// CLASSIFY gantry, MARK stamps, the ingress policer (token bucket + hard drop edge) on the RTP lane, the short priority queue
// and the finite bulk queue, the CHILD scheduler, the PARENT shaper ring (100 Mbit/s contract), the larger 1-Gbit/s port and
// two separate receiver panels. A dated replay layer floats above the bulk queue during the stored loss window.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,label,instanced,tube,cachedTexture,dynamicTexture,random} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {ST,T,QT_CAP,NAMED,REPLAY,tcpSlot,position,replayPosition,visible,queued,policerTokens,POL_CAPACITY,policerDrops,lastPick,inService,tcpAck,rtpReceived,ADDR} from '../model.js';
const RL=2.6;// height of the replay layer above the live bulk queue
const FOLLOW={S011:'Q-R1',S014:'Q-B17',S015:'Q-B17',S017:'Q-B18',S026:'Q-BS',S027:'Q-BS',S029:'Q-BS',S031:'Q-RN',S032:'Q-RN',S033:'Q-RN'};
function panel(w,h,draw){const tex=dynamicTexture(w,h);return{tex,draw};}
export class HallZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x02040a);s.fog=new THREE.FogExp2(0x02040a,.012);
  this.hemi=new THREE.HemisphereLight(0x8aa4cc,0x05070c,1.25);s.add(this.hemi);const key=new THREE.DirectionalLight(0xd6e4ff,1.1);key.position.set(-20,30,-14);s.add(key);
  // floor and grid
  box(s,[110,.2,50],[0,-.1,0],mat(0x0a1018,{roughness:.8,metalness:.2}));const grid=[];for(let x=-54;x<=54;x+=3)grid.push(x,.01,-25,x,.01,25);for(let z=-24;z<=24;z+=3)grid.push(-55,.01,z,55,.01,z);
  s.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(grid,3)),new THREE.LineBasicMaterial({color:0x13243a,transparent:true,opacity:.6})));
  // ramps and lanes (raised conveyors)
  const deck=(x0,x1,z,w,col)=>{box(s,[x1-x0,.5,w],[(x0+x1)/2,.25,z],mat(0x172434,{metalness:.6,roughness:.4}));const m=additive(col,.5);for(const dz of[-w/2,w/2])box(s,[x1-x0,.06,.08],[(x0+x1)/2,.53,z+dz],m);return m;};
  this.laneR=deck(-46,-8,-5,2.2,P.rtp);this.laneT=deck(-46,-19,5,2.2,P.tcp);deck(-19,-2,5,4.6,P.tcp);deck(-8,-2,-5,2.2,P.rtp);
  const join=additive(P.white,.35);tube(s,[[-2,.55,-5],ST.SCHED.map((v,i)=>i===1?.55:v)],join,.06,12);tube(s,[[-2,.55,5],ST.SCHED.map((v,i)=>i===1?.55:v)],join,.06,12);tube(s,[[5,.55,0],[19,.55,0],[22,.55,0]],additive(P.white,.5),.08,12);
  tube(s,[[22,.55,0],[34,.55,-7]],additive(P.rtp,.4),.06,12);tube(s,[[22,.55,0],[34,.55,7]],additive(P.tcp,.4),.06,12);
  label(s,'RTP · 192.0.2.10 → 198.51.100.10','UDP 5004 · vertrauenswürdiger Sender',[-42,3.2,-7.4],4.4,'#9fd2ff');label(s,'Backup · 192.0.2.11 → 198.51.100.50','TCP 443 · Bulk',[-42,3.2,7.4],4.4,'#ffc58a');
  // CLASSIFY gantry: one reader frame per lane
  const gm=mat(0x2a3a4c,{metalness:.8,roughness:.3});const gantry=(x,name,sub)=>{for(const z of[-7.6,7.6])box(s,[.5,5,.5],[x,2.5,z],gm);box(s,[.5,.5,15.7],[x,5,0],gm);label(s,name,sub,[x,6.4,0],4.4,'#e6f2fa');};
  gantry(ST.CLS_R[0],'CLASSIFY','INGRESS class-map REALTIME-IN / class-default');this.readers=[-5,5].map(z=>{const m=additive(z<0?P.rtp:P.tcp,.08);const r=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.1,2.2,2.6)),new THREE.LineBasicMaterial({color:z<0?P.rtp:P.tcp,toneMapped:false,transparent:true}));r.position.set(ST.CLS_R[0],1.6,z);s.add(r);box(s,[.06,2.2,2.6],[ST.CLS_R[0],1.6,z],m);return m;});
  label(s,'match UDP 5004 · 192.0.2.10','→ REALTIME-IN',[ST.CLS_R[0],3.3,-5],3,'#9fd2ff');label(s,'kein Match','→ class-default',[ST.CLS_R[0],3.3,5],3,'#ffc58a');
  // MARK stamps
  gantry(ST.MARK_R[0],'MARK','set dscp ef / set dscp default');this.stamps=[-5,5].map(z=>{const g=new THREE.Group();g.position.set(ST.MARK_R[0],3.2,z);s.add(g);box(g,[.3,1.6,.3],[0,.8,0],gm);const head=box(g,[1.3,.4,1.3],[0,0,0],mat(0x8a96a4,{metalness:.85,roughness:.3}));const face=box(g,[1.1,.05,1.1],[0,-.22,0],glow(z<0?P.white:0x6a7480,1));return{g,head,face};});
  label(s,'DSCP 46 (EF)','DS-Feld 0xb8 bei ECN 0',[ST.MARK_R[0],4.6,-5],2.8,'#ffffff');label(s,'DSCP 0','Best Effort',[ST.MARK_R[0],4.6,5],2.4,'#ffc58a');
  // POLICER: glass token bucket (bit budget, not a packet store) and the hard edge with the loss counter
  const PX=ST.POL[0];this.bucket=new THREE.Mesh(new THREE.CylinderGeometry(1.1,1.1,3,40,1,true),new THREE.MeshStandardMaterial({color:0x9fc8e8,transparent:true,opacity:.18,metalness:.2,roughness:.1,side:THREE.DoubleSide}));this.bucket.position.set(PX-1.4,2.1,-8.2);s.add(this.bucket);
  this.fill=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,40),glow(P.amber,.9));this.fill.position.set(PX-1.4,.6,-8.2);s.add(this.fill);
  box(s,[2.6,.2,2.6],[PX-1.4,.6,-8.2],gm);label(s,'Token-Bucket','Bit-Budget · cir 1 Mbit/s · bc 31250 Byte',[PX-1.4,4.6,-8.2],3.6,'#ffe08a');
  this.edge=box(s,[.12,.9,2.6],[PX+1.1,.95,-5],glow(P.red,.9));box(s,[3,.12,.12],[PX+2.4,.55,-6.3],glow(P.red,.6));
  box(s,[3.4,.1,3],[PX+2,-.05,-8.6],mat(0x2a0a0e,{emissive:0x200406}));label(s,'exceed-action drop','harte Kante · kein Warteplatz',[PX+1.6,4.3,-3.2],3.2,'#ff9a90');
  this.lossSign=dynamicTexture(512,192);const ls=new THREE.Sprite(new THREE.SpriteMaterial({map:this.lossSign.tex,transparent:true,depthTest:false}));ls.position.set(PX+2.4,2.2,-9.6);ls.scale.set(3.2,1.2,1);ls.renderOrder=10;s.add(ls);
  // queues
  const frame=(x0,x1,z,w,col,name,sub)=>{const e=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(x1-x0,1.4,w)),new THREE.LineBasicMaterial({color:col,toneMapped:false,transparent:true,opacity:.85}));e.position.set((x0+x1)/2,1.25,z);s.add(e);label(s,name,sub,[(x0+x1)/2,3.2,z+(z<0?-2:2.4)],3.8,z<0?'#9fd2ff':'#ffc58a');};
  frame(-9.6,-2.4,-5,1.6,P.rtp,'Priority-Queue','CHILD · class EF-OUT · priority 1000');frame(-18.3,-2.4,5,4.2,P.tcp,`Bulk-Queue · endlich (${QT_CAP})`,'class-default · bandwidth remaining 100 % · fair-queue');
  // replay layer (dated stored loss window)
  this.replay=new THREE.Group();this.replay.position.y=RL;s.add(this.replay);box(this.replay,[17,.04,4.6],[-10.6,.45,5],additive(0x8a7a6a,.25));
  this.ghosts=instanced(this.replay,new THREE.BoxGeometry(.8,.6,.8),additive(0xa08060,.4),QT_CAP);this.ghostTag=label(s,'gespeichertes Verlustfenster · datiert','Vergleichsebene · Queue 64/64 voll',[-10,RL+2.6,7.6],4.6,'#d8c8b0');
  // CHILD scheduler, PARENT shaper ring, physical port
  const sc=new THREE.Group();sc.position.set(...ST.SCHED);s.add(sc);box(sc,[3.2,.5,3.2],[0,0,0],mat(0x172434,{metalness:.6}));this.arm=new THREE.Group();this.arm.position.y=.4;sc.add(this.arm);this.armMat=glow(P.white,1);box(this.arm,[2.4,.12,.3],[-1.2,0,0],this.armMat);
  label(s,'CHILD-Scheduler','EF zuerst · laufender Frame wird beendet',[ST.SCHED[0],3.4,-2.6],3.6,'#e6f2fa');
  this.ring=new THREE.Mesh(new THREE.TorusGeometry(1.6,.12,10,56),glow(P.amber,1));this.ring.position.set(ST.SHAPER[0],1.6,0);this.ring.rotation.y=Math.PI/2;s.add(this.ring);
  this.lamps=Array.from({length:10},(_,i)=>{const a=i/10*Math.PI*2,m=glow(P.amber,.3);const b=box(s,[.2,.2,.2],[ST.SHAPER[0],1.6+2.1*Math.sin(a),2.1*Math.cos(a)],m);return m;});
  label(s,'PARENT-Shaper','shape average 100 Mbit/s · Vertrag',[ST.SHAPER[0],4.6,0],3.8,'#ffe08a');
  for(const z of[-3.4,3.4])box(s,[.6,6,.6],[ST.PORT[0],3,z],gm);box(s,[.6,.6,7.4],[ST.PORT[0],6,0],gm);this.portMat=additive(P.white,.25);box(s,[.08,1.2,1.4],[ST.PORT[0],1.1,0],this.portMat);
  label(s,'Gi0/0/1 · 1 Gbit/s physisch','gemeinsamer Ausgang · Serialisierung',[ST.PORT[0],7.4,0],4.2,'#e6f2fa');
  // receivers
  const rx=(z,col)=>{const p=dynamicTexture(1024,640);const m=new THREE.Mesh(new THREE.PlaneGeometry(6.4,4),new THREE.MeshBasicMaterial({map:p.tex,toneMapped:false}));m.position.set(ST.RX_R[0]+1.5,2.8,z);m.rotation.y=-Math.PI/2+(z<0?.35:-.35);s.add(m);const b=new THREE.Mesh(new THREE.BoxGeometry(6.8,4.4,.2),mat(0x0b121c));b.position.copy(m.position);b.rotation.copy(m.rotation);b.translateZ(-.12);s.add(b);return p;};
  this.rxR=rx(-7.5,P.rtp);this.rxT=rx(7.5,P.tcp);
  // carriers
  const cg=new THREE.BoxGeometry(.8,.5,.6),tg=new THREE.BoxGeometry(.78,.62,.78);
  this.rtp=instanced(s,cg,glow(0xffffff),60);this.tcp=instanced(s,tg,mat(0xffffff,{emissive:0x000000,metalness:.3,roughness:.4}),160);this.caps=instanced(s,new THREE.BoxGeometry(.5,.08,.4),glow(0xffffff),220);
  this.ghostCar=instanced(s,tg,glow(0xffffff),2);this.halo=instanced(s,new THREE.TorusGeometry(.75,.05,6,32),glow(0xffffff),6);this.bits=instanced(s,new THREE.BoxGeometry(.13,.13,.13),additive(0xffffff),160);
  this.tags=Array.from({length:4},()=>label(s,'','',[0,0,0],3.4,'#e6f6ff'));
 }
 update(t,a,tl,shot){
  const beat=tl.attack(t),fall=smooth(214,224,t)*.25;this.hemi.intensity=1.25*(1-fall)*(1-.35*smooth(114.4,116,t)*(1-smooth(117.12,118.5,t)));
  setGlow(this.laneR,P.rtp,.45+.35*beat);setGlow(this.laneT,P.tcp,.45+.35*beat);
  const vis=visible(t),named=Object.values(NAMED);
  // stations react to carriers passing them
  const near=(x,z)=>vis.some(p=>{const q=position(p,t);return q&&q.phase==='ramp'&&Math.abs(q.pos[0]-x)<.6&&Math.sign(q.pos[2])===Math.sign(z);});
  this.readers.forEach((m,i)=>setGlow(m,i?P.tcp:P.rtp,near(ST.CLS_R[0],i?5:-5)?.35:.06));
  this.stamps.forEach((st,i)=>{const hit=near(ST.MARK_R[0],i?5:-5);st.g.position.y=hit?2.0:3.2;});
  const tok=policerTokens(t)/POL_CAPACITY;this.fill.scale.y=Math.max(.02,2.8*tok);this.fill.position.y=.7+1.4*tok;setGlow(this.fill.material,tok<.3?P.red:P.amber,.9);
  const drops=policerDrops(t),lastDrop=vis.find(p=>p.fate==='police'&&position(p,t)?.phase==='drop');setGlow(this.edge.material,P.red,lastDrop?2.6:.9);
  this.lossSign.set(String(drops),g=>{g.fillStyle='rgba(30,6,8,.86)';g.fillRect(0,0,512,192);g.strokeStyle='#ff4a3c';g.lineWidth=4;g.strokeRect(2,2,508,188);g.font='500 34px "Space Grotesk"';g.fillStyle='#ffb0a8';g.fillText('Verlustarchiv Policer',24,56);g.font='600 72px "JetBrains Mono"';g.fillStyle='#ff6b5c';g.fillText(String(drops),24,150);g.font='26px "JetBrains Mono"';g.fillStyle='#d79a94';g.fillText('endgültig · nicht gepuffert',150,140);});
  // scheduler arm, shaper releases, port serialisation
  const pick=lastPick(t),serv=inService(t);const target=pick?.cls==='rtp'?-.35:.35;this.arm.rotation.y=target;setGlow(this.armMat,pick?.cls==='rtp'?P.rtp:P.tcp,1.2);
  const since=pick?t-pick.tDep:9,pulse=Math.exp(-since/.12);setGlow(this.ring.material,P.amber,.9+1.6*pulse);this.lamps.forEach((m,i)=>setGlow(m,P.amber,((t*9.8+i)%10)<7?.9:.15));
  setGlow(this.portMat,serv?(serv.cls==='rtp'?P.rtp:P.tcp):P.white,serv?.6:.2);
  // carriers
  this.ghostCar.begin();this.rtp.begin();this.tcp.begin();this.caps.begin();this.halo.begin();this.bits.begin();const tags=[];
  for(const p of vis){const q=position(p,t);if(!q)continue;const pos=V(q.pos);pos.y+=.0;
   if(q.phase==='drop'){for(let i=0;i<12;i++)this.bits.push(pos.clone().add(new THREE.Vector3((random(i+p.tIn*7)-.5)*2.4*q.d,.8*q.d,(random(i*3+p.tIn)-.5)*2.4*q.d)),p.fate==='police'?P.red:0xd09060,1,null,1.8*(1-q.d/1.2));
    if(p.name)tags.push({p,pos,txt:[`${p.name} · verworfen`,'exceed-action drop · endgültig','#ff9a90']});continue;}
   if(p.cls==='rtp')this.rtp.push(pos,P.rtp,1,null,1.15);else this.tcp.push(pos,P.tcp,1);
   if(q.marked)this.caps.push(pos.clone().add(new THREE.Vector3(0,p.cls==='rtp'?.3:.36,0)),p.cls==='rtp'?P.white:0x55606c,1,null,p.cls==='rtp'?1.4:1);
   if(p.name){this.halo.push(pos,p.cls==='rtp'?P.white:P.amber,1,new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2),1.6);tags.push({p,pos,txt:this.tagText(p,q,t)});}}
  // replay layer
  const rw=REPLAY.win,ra=smooth(rw[0],rw[0]+.8,t)*(1-smooth(rw[1]-.6,rw[1],t));this.replay.visible=ra>0;this.ghostTag.userData.alpha=ra;
  this.ghosts.begin();if(ra>0)for(let k=0;k<QT_CAP;k++){const g=V(tcpSlot(k));this.ghosts.push(g,0xa08060,1,null,.6*ra);}this.ghosts.end();
  const rq=replayPosition(t);if(rq&&ra>0){const pos=V(rq.pos);pos.y+=RL;if(rq.phase==='drop'){for(let i=0;i<14;i++)this.bits.push(pos.clone().add(new THREE.Vector3((random(i+5)-.5)*2.4*rq.d,.6*rq.d,(random(i*3+5)-.5)*2.4*rq.d)),0xd09060,1,null,1.6*(1-rq.d/1.4));tags.push({p:REPLAY,pos,txt:['Q-B17 · Tail-Drop (gespeichert)','Seq 24001 Len 1200 · Queue voll','#e8c8a0']});}
   else{this.ghostCar.push(pos,0xe8c090,1,null,.9);this.halo.push(pos,0xe8c8a0,1,new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2),1.2);tags.push({p:REPLAY,pos,txt:['Q-B17 · gespeichert, datiert','TCP Seq 24001 Len 1200','#e8c8a0']});}}
  this.ghostCar.end();this.rtp.end();this.tcp.end();this.caps.end();this.halo.end();this.bits.end();
  this.tags.forEach((tag,i)=>{const x=tags[i];tag.userData.alpha=x?1:0;if(x){tag.position.copy(x.pos).add(new THREE.Vector3(0,1.6,0));tag.material.map=cachedTexture(...x.txt);}});
  // receivers
  const nR=rtpReceived(t),ack=tcpAck(t);
  this.rxR.set(String(nR),g=>{this.rxPanel(g,'RTP-Empfänger · 198.51.100.10',P.rtp,[['UDP 5004 · EF/46',''],[`Frames empfangen: ${nR}`,'#cfe8ff'],['Queue-Verzögerung gering','#8fe3b8'],['Policer-Drops sind keine Spätfälle','#7f97a8']]);});
  this.rxT.set(String(ack),g=>{this.rxPanel(g,'TCP-Empfänger · 198.51.100.50:443',P.tcp,ack==null?[['Backup läuft',''],['nutzt verbleibende Freigaben','#ffd3a4']]:[[ack===24001?'ACK 24001 · wartet (SACK)':`ACK ${ack}`,ack===24001?'#ffd27a':'#ffe2c4'],['kumulativ bestätigte Bytes','#c8a88a'],['Bulk nutzt verbleibende Freigaben','#8fe3b8']]);});
 }
 rxPanel(g,title,col,rows){const c='#'+col.toString(16).padStart(6,'0');g.fillStyle='#050a10';g.fillRect(0,0,1024,640);g.fillStyle=c;g.fillRect(0,0,1024,12);g.font='600 46px "Space Grotesk"';g.fillStyle='#e6f2fa';g.fillText(title,40,90);
  rows.forEach(([s,k],i)=>{g.font=`${i===0?'600 ':''}${i===0?56:38}px "JetBrains Mono"`;g.fillStyle=k||'#e6f2fa';g.fillText(s,40,200+i*96);});g.font='24px "JetBrains Mono"';g.fillStyle='#5f7484';g.fillText('Szenario / simulierte Werte',40,610);}
 tagText(p,q,t){const n=p.name;
  if(n==='Q-RN')return[`Q-RN · neuer RTP-Frame`,t<127.84?'UDP 5004 · 192.0.2.10 · noch unmarkiert':q.phase==='ramp'&&t<129.78?'DSCP 46 gesetzt (EF)':q.phase==='queue'?'Priority-Queue · konform':'EF · gewählt → Port','#cfe8ff'];
  if(n==='Q-R1')return['Q-R1 · RTP',q.phase==='queue'?'Priority-Queue':q.phase==='ramp'?'UDP 5004 · EF/46':'zum Empfänger','#cfe8ff'];
  if(n==='Q-B18')return['Q-B18 · Retransmission','Seq 24001 Len 1200 · neuer Frame','#ffd3a4'];
  if(n==='Q-BS')return['Q-BS · Bulk',q.phase==='queue'?`wartet auf Shaper-Budget · Platz ${Math.round(q.idx)+1}`:q.phase==='serve'?'ausgegeben (einmal)':'angenommen','#ffd3a4'];
  return[n,'','#e6f6ff'];}
 focus(shot,t){const n=FOLLOW[shot.id];if(!n)return null;if(n==='Q-B17'){const q=replayPosition(t);if(!q)return null;const p=V(q.pos);p.y+=RL;return p;}const p=NAMED[n],q=position(p,t);return q?V(q.pos):null;}
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),k=+shot.id.slice(1),f=this.focus(shot,t);
  if(f){if(shot.camera==='tcp')return look([f.x-3,f.y+2.2,f.z+6.5],[f.x+1.5,f.y,f.z-.5],44);if(shot.camera==='class')return look([f.x-3.4,2.8,f.z-4.2],[f.x+.6,1.4,f.z],40);
   if(shot.camera==='queue')return look([f.x-5,f.y+3.4,f.z<0?f.z+4.5:f.z-4.5],[f.x+1,1,f.z],46);return look([f.x-6,f.y+3,f.z+3],[f.x+3,1,f.z],48);}
  switch(shot.camera){
   case'class':return look([lerp(-37,-35.5,u),lerp(14.5,13.5,u),k%2?-.8:.8],[-28,0,0],50);
   case'queue':return look([lerp(-17,-7,u),4.6,0],[lerp(-9,1,u),1,0],50);
   case'sched':{const a=lerp(-.55,.55,u)*(k%2?1:-1),R=lerp(15,13,u);return look([8-Math.cos(a)*R,lerp(8,6.5,u),Math.sin(a)*R],[9,1.4,0],48);}
   case'police':return look([ST.POL[0]-.4,3.3,3.4],[ST.POL[0]-.4,2.3,-5.6],50);
   case'tcp':return look([lerp(-22,-8,u),2.6,11.5],[lerp(-19,-5,u),1,5],46);
   case'ziel':return look([lerp(20.5,23.5,u),4.8,lerp(-.6,.6,u)],[35,2.4,0],56);
   default:return look([lerp(-37,-23,u),lerp(15,11,u),lerp(-1.5,1.5,u)],[lerp(-4,8,u),0,0],58);
  }
 }
}
