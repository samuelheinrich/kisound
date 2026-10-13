// The stadium: stage and source in the centre, routers on the field, two tiers of stands around it.
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {PALETTE as P,SOURCE_START} from '../config.js';
import {V,mat,glow,additive,setGlow,box,ring,curveTube,baseScene,label,cachedTexture,stars,routerObject,switchObject,seatGeometry,instanced,sourceServer,orient,ellipseBand,ellipseWall,ellipseTube,ellipseFloor} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {HOOK_TARGETS,hookWord,NODES,CORES,DISTS,SEGMENTS,SEATS,EDGES,IDLE_LINKS,RX,RZ,ell,pickSeat,pointAt,packets,receiving,membershipPhase,within,activeMessages,messagePos,SPEED,SPACING,LMQ,SHOT_SEATS,rpKnowsSource,routerForwarding,SPT_JOIN,REGISTER,MEMBERSHIP,upstream} from '../model.js';
export const KIND_COLOR={report:P.emerald,leave:P.red,query:P.violet,join:P.cyan,prune:P.red,hello:P.cyan,register:P.cyan};
const UP=new THREE.Vector3(0,1,0);
const nodePos=id=>V(NODES[id].pos);
const out=p=>V([p.x,0,p.z]).normalize();
function edgeGlow(e,t){
 const on=e.on;let lo=0,hi=on.length;while(lo<hi){const m=(lo+hi)>>1;if(on[m][0]<=t)lo=m+1;else hi=m;}
 const iv=on[lo-1];if(!iv)return 0;const travel=e.length/SPEED;
 return t<iv[1]?smooth(iv[0],iv[0]+travel,t):1-smooth(iv[1],iv[1]+travel,t);
}
export class ArenaZone{
 constructor(){
  const s=this.scene=baseScene(.0042);this.stars=stars(s,900,260);
  this.floor=ellipseFloor(s,RX,RZ,{to:.6,step:.05,spokes:15});
  // Pitch markings make the bowl read as a stadium; the stage stands on the centre spot.
  const pitch=[];const L=(a,b)=>pitch.push(...a,...b),W=27,H=17;
  L([-W,.02,-H],[W,.02,-H]);L([W,.02,-H],[W,.02,H]);L([W,.02,H],[-W,.02,H]);L([-W,.02,H],[-W,.02,-H]);L([0,.02,-H],[0,.02,H]);
  for(const sx of[-1,1]){L([sx*W,.02,-9],[sx*(W-7),.02,-9]);L([sx*(W-7),.02,-9],[sx*(W-7),.02,9]);L([sx*(W-7),.02,9],[sx*W,.02,9]);}
  for(let a=0;a<64;a++){const p=k=>[6.5*Math.sin(k/64*Math.PI*2),.02,6.5*Math.cos(k/64*Math.PI*2)];L(p(a),p(a+1));}
  this.pitch=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(pitch,3)),new THREE.LineBasicMaterial({color:0x2c74b8,transparent:true,opacity:.5,depthWrite:false}));s.add(this.pitch);
  // Stands: lower tier, concourse, upper tier, back wall and roof.
  const tread=mat(0x173452,{roughness:.8,metalness:.2,emissive:0x07162a,side:THREE.DoubleSide}),riser=mat(0x12304c,{roughness:.75,metalness:.25,emissive:0x061326,side:THREE.DoubleSide});
  s.add(new THREE.HemisphereLight(0x9cc4f0,0x0b1726,1.5));
  const band=(a,b,y)=>s.add(new THREE.Mesh(ellipseBand(RX,RZ,a,b,y),tread)),wall=(a,y0,y1)=>s.add(new THREE.Mesh(ellipseWall(RX,RZ,a,y0,y1),riser));
  wall(.62,0,1.6);band(.62,.685,1.6);wall(.685,1.6,3);band(.685,.74,3);wall(.74,3,4.2);band(.74,.8,4.2);wall(.8,4.2,8.5);band(.8,.86,8.5);wall(.86,8.5,10.5);band(.86,.92,10.5);wall(.92,10.5,14);band(.92,.97,14);s.add(new THREE.Mesh(ellipseWall(RX,RZ,.97,0,14),mat(0x08131f,{roughness:.9,metalness:.2,side:THREE.DoubleSide})));
  this.edgeLines=[[.62,1.62],[.685,3.02],[.74,4.22],[.8,8.52],[.86,10.52],[.92,14.02]].map(([a,y])=>ellipseTube(s,RX,RZ,a,y,additive(P.blue,.8),.06));
  const roof=new THREE.Mesh(ellipseBand(RX,RZ,.9,1.03,19.5),mat(0x0a1828,{transparent:true,opacity:.55,side:THREE.DoubleSide,depthWrite:false}));s.add(roof);
  this.groupMat=additive(P.emerald,.2);ellipseTube(s,RX,RZ,.9,19.4,this.groupMat,.09);ellipseTube(s,RX,RZ,1.03,19.4,additive(P.blue,.4),.07);
  this.groupLabel=label(s,'GROUP 239.1.1.1','IGMP MEMBERS / PIM TREE',[0,21.5,RZ*.9],7,'#8ff0c4');
  // Floodlight masts on the diagonals.
  this.flood=[45,135,225,315].map(a=>{const p=V(ell(1.07,a,0));box(s,[.7,32,.7],[p.x,16,p.z],mat(0x13263a));const head=new THREE.Group();head.position.set(p.x,32,p.z);head.lookAt(0,4,0);s.add(head);
   box(head,[7,3.2,.5],[0,0,0],mat(0x16293d));const lamp=glow(0xcfe6ff,.6);for(let i=0;i<4;i++)for(let j=0;j<2;j++)box(head,[1.3,1.1,.1],[-2.4+i*1.6,-.65+j*1.3,.3],lamp);return lamp;});
  // Stage and source in the middle.
  const stageMat=mat(0x10243a,{roughness:.6});const plat=new THREE.Mesh(new THREE.CylinderGeometry(3.6,3.6,.4,64),stageMat);plat.position.set(0,2.45,0);s.add(plat);
  for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;box(s,[.3,2.3,.3],[2.6*Math.cos(a),1.15,2.6*Math.sin(a)],mat(0x0f2135));}
  const base=new THREE.Mesh(new THREE.CylinderGeometry(5.2,5.4,.2,64),stageMat);base.position.y=.1;s.add(base);
  this.stageRings=[];for(let i=0;i<8;i++){const r=ring(s,5.6+i*1.15,[0,.05,0],additive(P.orange,.4),.035);r.rotation.x=Math.PI/2;this.stageRings.push(r);}
  this.platRing=ring(s,3.62,[0,2.66,0],additive(P.orange,.6),.05);this.platRing.rotation.x=Math.PI/2;
  this.source=sourceServer(s,NODES.SRC.pos,1.5);this.sourceLight=new THREE.PointLight(P.orange,8,22,2);this.sourceLight.position.set(0,5,0);s.add(this.sourceLight);
  label(s,'SOURCE','10.0.0.1 → 239.1.1.1',[0,5.2,0],3.4,'#ffc58f');
  // Routers.
  this.routers={};
  for(const id of['R1',...CORES,...DISTS.map(d=>d.id)]){
   const p=NODES[id].pos,col=id==='R2'?P.violet:id==='R1'?P.orange:P.blue,core=CORES.includes(id);
   if(p[1]>.7){const ped=new THREE.Mesh(new THREE.CylinderGeometry(.45,.6,p[1]-.35,16),mat(0x0f2135));ped.position.set(p[0],(p[1]-.35)/2,p[2]);s.add(ped);}
   const r=routerObject(s,p,col,core?1.25:1);this.routers[id]=r;label(s,NODES[id].label,NODES[id].sub,[p[0],p[1]+(core?1.8:1.45),p[2]],id==='R2'?3.4:2.6,id==='R2'?'#d4c6ff':id==='R1'?'#ffc58f':'#cfe6f2');
  }
  this.rpRings=[0,1].map(i=>{const r=ring(s,2.2+i*.4,NODES.R2.pos,additive(P.violet,.3),.035);r.position.y+=.1;return r;});
  // Switches: lower ones at the foot of the stand, upper ones on the upper tier's front, field ones near the stage.
  this.switches=SEGMENTS.map(seg=>{const p=NODES[seg.switch].pos,o=switchObject(s,p,Math.atan2(p[0],p[2]),seg.seats.length);if(seg.tier!=='upper')box(s,[.3,p[1]-.16,.3],[p[0],(p[1]-.16)/2,p[2]],mat(0x0f2135));label(s,seg.switch,`VLAN ${seg.vlan}`,[p[0],p[1]+.95,p[2]],2.1);return o;});
  // Edges: dim bases (seat bases merged into one mesh), additive glow on router and access links.
  const baseMat=mat(0x18324c,{roughness:.7,metalness:.2}),seatBases=[];
  this.edges=[];
  for(const e of Object.values(EDGES)){
   const pts=e.pts.filter((_,i)=>i%4===0||i===40).map(V);
   if(e.kind==='seat'){seatBases.push(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),12,.02,4,false));continue;}
   curveTube(s,pts,baseMat,.04,24);const glowMat=additive(P.orange,0);curveTube(s,pts,glowMat,e.kind==='l3'?.09:.07,24);this.edges.push({e,glowMat});
  }
  s.add(new THREE.Mesh(mergeGeometries(seatBases),baseMat));seatBases.forEach(g=>g.dispose());
  for(const[a,b]of IDLE_LINKS){const pa=NODES[a].pos,pb=NODES[b].pos;curveTube(s,[pa,[(pa[0]+pb[0])/2,(pa[1]+pb[1])/2+1.2,(pa[2]+pb[2])/2],pb],mat(0x142a40),.03,16);}
  // Receivers: seats in the stands, standing pods on the field.
  this.seatXf=SEATS.map(h=>{const p=V(NODES[h.id].pos),q=new THREE.Quaternion().setFromAxisAngle(UP,Math.atan2(p.x,p.z));return{h,host:p,base:V(h.base),q};});
  const standCount=SEATS.filter(h=>h.tier!=='field').length;
  this.seatMesh=instanced(s,seatGeometry(),mat(0xffffff,{roughness:.6,metalness:.3}),standCount);
  const pod=new THREE.CylinderGeometry(.28,.38,1.2,12);pod.translate(0,.6,0);this.podMesh=instanced(s,pod,mat(0xffffff,{roughness:.6,metalness:.3}),SEATS.length-standCount);
  this.hosts=instanced(s,new THREE.IcosahedronGeometry(.22,1),glow(0xffffff),SEATS.length);
  const flat=new THREE.TorusGeometry(.78,.035,5,40);flat.rotateX(Math.PI/2);
  this.rings=instanced(s,flat,additive(0xffffff),SEATS.length);this.ripples=instanced(s,flat,additive(0xffffff),600);
  this.gates=CORES.map(c=>{const id=`R1>${c}`,p=V(pointAt(id,.9)),g=ring(s,.32,p,additive(P.red,0),.045);g.lookAt(V(pointAt(id,1.4)));return{id,g};});
  this.packets=instanced(s,new THREE.BoxGeometry(.1,.1,.42),additive(0xffffff),4200);
  this.messages=instanced(s,new THREE.OctahedronGeometry(.26),glow(0xffffff),3200);
  this.msgLabels=Array.from({length:6},()=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false,depthWrite:false}));sp.scale.set(2.6,2.6*192/1024,1);sp.userData.labelWidth=2.6;sp.renderOrder=11;sp.visible=false;s.add(sp);return sp;});
  this.q=new THREE.Quaternion();this.tmp=new THREE.Vector3();
 }
 hookFlash(t,tl){
  const res={};for(const l of tl.analysis.lyrics.segments){if(l.section!=='Hook'||t<l.start_s||t>l.start_s+1.1)continue;const k=HOOK_TARGETS[hookWord(l.text)];if(k)res[k]=Math.max(res[k]||0,Math.exp(-(t-l.start_s)/.32));}return res;
 }
 update(t,a,tl,shot){
  const imp=tl.attack(t),drop=tl.drop(t),bass=a.sub_20_60_drive??0,hook=shot.mode==='hook'?this.hookFlash(t,tl):{};this.pulse=imp;
  const live=t>=SOURCE_START;
  this.floor.pts.material.opacity=.45+.3*bass+.25*drop;this.floor.lines.material.opacity=.3+.15*bass;this.pitch.material.opacity=.38+.2*bass+.3*drop;
  this.stageRings.forEach((r,i)=>{const w=.5+.5*Math.sin(t*2.6-i*.7);setGlow(r.material,P.orange,(live?.12+.22*w*bass:.06)+.9*drop*Math.exp(-i*.25)+(hook.source||0)*.8);});
  setGlow(this.platRing.material,P.orange,live?.5+.4*bass:.15);
  this.edgeLines.forEach((m,i)=>setGlow(m.material,P.blue,.5+.25*a.bass_60_250_drive+.4*drop*Math.exp(-i*.2)));
  this.flood.forEach((m,i)=>setGlow(m,0xcfe6ff,.45+.35*drop+.15*Math.sin(t*.5+i)));
  const srcGlow=live?.85+.4*bass+(hook.source||0):.25+.15*Math.sin(t*1.7);this.source.edgeMat.color.setHex(P.orange).multiplyScalar(srcGlow);this.sourceLight.intensity=live?7+6*bass+10*drop:3;
  this.source.cube.rotation.y=.18*Math.sin(t*.21);
  for(const[id,r]of Object.entries(this.routers)){
   const fwd=routerForwarding(id,t),col=id==='R2'?(fwd?P.orange:P.violet):fwd?P.orange:P.blue;setGlow(r.ringMat,col,.7+.5*imp*(fwd?1:.3));
   const flash=(id==='R2'?hook.rp||0:0)+(hook.pim||0)*.7+(DISTS.some(d=>d.id===id)?(hook.query||0)*.6:0);
   setGlow(r.halo.material,id==='R2'?P.violet:fwd?P.orange:P.blue,(fwd?.25+.25*bass:.05)+flash);
  }
  this.rpRings.forEach((r,i)=>{r.rotation.set(Math.PI/2+.5*Math.sin(t*.4+i),t*(.6+.3*i),0);setGlow(r.material,P.violet,(rpKnowsSource(t)?.35:.08)+(hook.rp||0)*1.4+.5*(t>=REGISTER[1]?Math.exp(-(t-REGISTER[1])/.5):0));});
  for(const{id,g}of this.gates){const closed=live&&!within(EDGES[id].on,t)&&t<40;setGlow(g.material,P.red,closed?.9+.6*imp:0);}
  SEGMENTS.forEach((seg,i)=>{const sw=this.switches[i];seg.seats.forEach((h,k)=>{const on=within(EDGES[`${seg.switch}>${h.id}`].on,t);setGlow(sw.leds[k].material,on?P.emerald:P.steel,on?1.1:.9);});setGlow(sw.uplink.material,within(EDGES[`${seg.router}>${seg.switch}`].on,t)?P.orange:P.blue,1);});
  for(const{e,glowMat}of this.edges){const g=edgeGlow(e,t),pim=e.kind==='l3'?(hook.pim||0):0;if(pim>g*.5)setGlow(glowMat,P.cyan,pim*.8);else setGlow(glowMat,P.orange,g*(e.kind==='access'?.36:.42)*(.8+.35*bass));}
  // Receivers.
  const hm=this.hosts,rm=this.rings,rp=this.ripples;this.seatMesh.begin();this.podMesh.begin();hm.begin();rm.begin();rp.begin();
  for(const x of this.seatXf){
   const ph=membershipPhase(x.h,t),listen=ph.listening,leaving=!ph.member&&ph.leaveAge<LMQ+.6,body=listen?0x22705a:ph.member?0x1e5a50:0x2a4d70;
   (x.h.tier==='field'?this.podMesh:this.seatMesh).push(x.base,body,1,x.q,1);
   const hostCol=leaving?P.red:listen||ph.member?P.emerald:P.blue,hostStr=leaving?.9*(1-ph.leaveAge/(LMQ+.6)):listen?1.1+.4*imp+(hook.igmp||0):ph.member?.55:.32+(hook.igmp||0)*.3;
   hm.push(x.host,hostCol,listen?1.12:1,null,hostStr);
   const ringPos=this.tmp.copy(x.base).add(V([0,.05,0]));rm.push(ringPos,listen?P.emerald:P.blue,1,null,listen?.55+.35*bass+(hook.group||0)*1.2:.18);
   if(ph.joinAge<1.8)rp.push(ringPos,P.emerald,.6+ph.joinAge*2.2,null,1.3*(1-ph.joinAge/1.8)+(hook.join||0)*.5);
   if(ph.leaveAge<1.8)rp.push(ringPos,P.red,.6+ph.leaveAge*1.6,null,1.1*(1-ph.leaveAge/1.8));
  }
  this.seatMesh.end();this.podMesh.end();hm.end();rm.end();rp.end();
  const counts=SEATS.filter(h=>MEMBERSHIP.has(h.id)&&receiving(h.id,t)).length;setGlow(this.groupMat,P.emerald,.08+.65*counts/200+(hook.group||0)*1.5+.4*drop*(counts>0?1:0));
  this.groupLabel.userData.alpha=clamp(counts/10)*.9;
  const pk=this.packets;pk.begin();
  for(const p of packets(t)){const pos=V(pointAt(p.edge,p.u)),ahead=pointAt(p.edge,p.u+.25),leaf=p.edge.kind==='seat';pk.push(pos,leaf?P.warm:P.orange,leaf?.7:1,orient(this.q,pos,ahead),(leaf?.75:1.15)+.45*bass);}
  pk.end();
  const mm=this.messages;mm.begin();const labelled=[];
  for(const m of activeMessages(t)){
   const pos=V(messagePos(m,t)),fade=t>m.t1?1-(t-m.t1)/.25:1,small=EDGES[m.edge].kind==='seat';
   const boost=(m.kind==='report'?(hook.report||0):m.kind==='leave'?(hook.leave||0):m.kind==='query'?(hook.query||0):0);
   mm.push(pos,KIND_COLOR[m.kind],(small?.7:1.15)*(1+boost*.8)*fade,null,1.5+boost);
   if(['register','join','prune'].includes(m.kind)&&t<m.t1)labelled.push({m,pos});
  }
  mm.end();labelled.sort((x,y)=>y.m.t0-x.m.t0);
  this.msgLabels.forEach((sp,i)=>{const l=labelled[i];sp.visible=!!l;if(!l)return;sp.material.map=cachedTexture(l.m.label,`${l.m.from} → ${l.m.to}`,l.m.kind==='prune'?'#ff9aa4':'#9feaf6');sp.position.copy(l.pos).add(V([0,.85,0]));});
 }
 // Camera targets resolve once per shot: keys, deterministic picks among live receivers, routers or segments.
 seat(shot){return SHOT_SEATS.get(shot.id)??pickSeat(shot.target,shot.start+.01,+shot.id.slice(1));}
 route(h,t){const e=Object.values(EDGES).find(x=>x.to===h.id),r=e.routes.length>1&&t>=SPT_JOIN?e.routes.at(-1):e.routes[0];return{edges:[...r.edges,e],total:r.total+e.length};}
 along(route,d){let rest=Math.max(0,Math.min(route.total-1e-3,d));for(const e of route.edges){if(rest<=e.length)return V(pointAt(e,rest));rest-=e.length;}const last=route.edges.at(-1);return V(pointAt(last,last.length));}
 // Travel distance of a POV camera: it moves with the stream, sits between two packets and arrives near the seat at the end of the shot.
 povDistance(shot,t,route,stop=2.2){const dur=shot.end-shot.start,startD=Math.max(EDGES['SRC>R1'].length*.9,route.total-dur*SPEED-stop);const d0=Math.floor(startD)+(((shot.start*SPEED+.5)%SPACING)+SPACING)%SPACING;return Math.min(route.total-stop,d0+(t-shot.start)*SPEED);}
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),bump=this.pulse||0,idx=+shot.id.slice(1),sign=idx%2?1:-1;
  let pos,target,fov=50,roll=0;
  const segTarget=()=>SEGMENTS[+shot.target.slice(1)];
  switch(shot.camera){
   case'opening':pos=V([lerp(3.4,-10,u),lerp(3.8,15,u),lerp(4.8,38,u)]);target=V([0,lerp(3.2,4,u),0]);fov=lerp(42,52,u);break;
   case'stands':{const c=shot.target?segTarget().angle:(idx*67)%360,a=c+lerp(-14,14,lin)*sign;pos=V(ell(.44,a,3.2));target=V(ell(.82,a+16*sign,7));fov=56;break;}
   case'source':{const a=lerp(-.5,.4,lin)+idx*.9;pos=V([6.6*Math.sin(a),lerp(4.6,5.6,u),6.6*Math.cos(a)]);target=V([0,3.2,0]);fov=46;break;}
   case'gate':pos=V([lerp(6.4,5.2,u),3.6,lerp(11,12,u)]);target=V([-2,1.2,2.6]);fov=50;break;
   case'rise':{const a=(idx*53)%360;pos=V(ell(lerp(.42,.78,u),a,lerp(3,40,u)));target=V([0,2,0]);fov=lerp(54,60,u);break;}
   case'climb':{const h=this.seat(shot),chain=[];let n=SEGMENTS[h.seg].router;while(n!=='R1'){chain.push(nodePos(n));if(n==='R2')break;n=upstream(n,false);}if(chain.length<2)chain.push(nodePos('R2'));
    const f=lerp(0,chain.length-1,u),i=Math.min(chain.length-2,Math.floor(f)),m=chain[i].clone().lerp(chain[i+1],f-i);pos=m.clone().add(out(m).multiplyScalar(10)).add(V([0,9,0]));target=m;fov=52;break;}
   case'core':{const a=lerp(-.35,.35,lin)*sign+idx*.6;pos=V([28*Math.sin(a),20,28*Math.cos(a)]);target=V([0,1.5,0]);fov=50;break;}
   case'chase':case'ride':case'flyby':{
    const h=this.seat(shot),r=this.route(h,shot.start),d=this.povDistance(shot,t,r,shot.camera==='ride'?5.5:2.2),p=this.along(r,d),ahead=this.along(r,d+4),dir=ahead.clone().sub(p);dir.y*=.5;dir.normalize();const side=V([dir.z,0,-dir.x]).normalize();
    if(shot.camera==='ride'){pos=p.clone().add(V([0,1.5,0])).add(side.clone().multiplyScalar(.5*sign));target=this.along(r,d+10).add(V([0,.6,0]));fov=72;roll=.05*Math.sin(t*1.3)*sign;}
    else if(shot.camera==='flyby'){pos=p.clone().add(side.multiplyScalar(5.5*sign)).add(V([0,2.2,0]));target=p.clone().add(dir.clone().multiplyScalar(1.5));fov=54;}
    else{pos=p.clone().sub(dir.clone().multiplyScalar(5)).add(V([0,2.8,0])).add(side.multiplyScalar(1.5*sign));target=ahead.clone().add(V([0,-.2,0]));fov=58;}
    break;}
   case'seat':{const h=V(NODES[this.seat(shot).id].pos),d=out(h).negate(),side=V([d.z,0,-d.x]);pos=h.clone().add(d.multiplyScalar(lerp(7,5.6,u))).add(side.multiplyScalar(2.6*sign)).add(V([0,2.6,0]));target=h.clone().add(V([0,-.7,0]));fov=50;break;}
   case'orbit':{const a=idx*1.13+lerp(-.2,.2,lin);pos=V([72*Math.sin(a),26+4*Math.sin(idx),56*Math.cos(a)]);target=V([0,3,0]);fov=50;break;}
   case'bird':{const a=lerp(-.12,.12,lin)*sign;pos=V([30*Math.sin(a),lerp(90,96,u),-30*Math.cos(a)]);target=V([0,0,0]);fov=54;break;}
   case'branch':{const id=/^R\d+$/.test(shot.target)?shot.target:SEGMENTS[this.seat(shot).seg].router,r=nodePos(id),o=out(r),side=V([o.z,0,-o.x]).multiplyScalar(sign);pos=r.clone().sub(o.clone().multiplyScalar(lerp(5.5,4.4,u))).add(side.multiplyScalar(4)).add(V([0,4.4,0]));target=r.clone().add(o.multiplyScalar(5));fov=56;break;}
   case'reverse':{const a=(idx*41)%360+lerp(-6,6,lin);pos=V(ell(.94,a,lerp(16,18,u)));target=V([0,3,0]);fov=54;break;}
   case'grow':{const a=nodePos('R3'),b=nodePos('R4');pos=a.clone().lerp(b,.5).add(V([0,lerp(26,22,u),0])).add(out(a).multiplyScalar(-6));target=a.clone().lerp(b,lerp(.2,.8,u));fov=56;break;}
   case'rp':{const c=nodePos('R2'),a=lerp(-.6,.5,lin)+idx;pos=c.clone().add(V([6*Math.sin(a),3.2,6*Math.cos(a)]));target=c.clone().add(V([0,.5,0]));fov=48;break;}
   case'segment':{const seg=shot.target.startsWith('S')?segTarget():SEGMENTS[this.seat(shot).seg],sw=nodePos(seg.switch),o=out(sw);pos=sw.clone().sub(o.clone().multiplyScalar(9)).add(V([0,6,0]));target=sw.clone().add(o.multiplyScalar(5)).add(V([0,2.5,0]));fov=54;break;}
   case'ascend':{const h=this.seat(shot),seg=SEGMENTS[h.seg],chain=[h.id,seg.switch,seg.router];let n=seg.router;while(n!=='R1'){n=upstream(n,t>=SPT_JOIN);chain.push(n);}const pts=chain.map(nodePos),f=lerp(0,pts.length-2,u),i=Math.min(pts.length-2,Math.floor(f)),p=pts[i].clone().lerp(pts[i+1],f-i),q=pts[Math.min(pts.length-1,i+1)];
    pos=p.clone().add(out(p).multiplyScalar(6)).add(V([1.4,3.5+2.5*u,0]));target=q;fov=lerp(54,60,u);break;}
   case'reveal':{const a=(lerp(-40,80,lin)+200)%360;pos=V([0,lerp(5.5,13,u),0]).add(V(ell(.04,a+180,0)));target=V(ell(.75,a,lerp(5,8,u)));fov=lerp(60,70,smooth(164.2,165.4,t));break;}
   case'total':{const a=lerp(-.25,.25,lin)*sign;pos=V([74*Math.sin(a),lerp(38,44,u),-74*Math.cos(a)]);target=V([0,0,6]);fov=52;break;}
   case'querier':{const r=nodePos(shot.target),o=out(r);pos=r.clone().sub(o.clone().multiplyScalar(8)).add(V([0,lerp(8,10,u),0]));target=r.clone().add(o.multiplyScalar(lerp(14,17,u))).add(V([0,4,0]));fov=56;break;}
   case'rpsource':{const rp=nodePos('R2'),src=nodePos('SRC'),d=rp.clone().sub(src);pos=rp.clone().add(d.clone().multiplyScalar(lerp(.5,.1,u))).add(V([1.6,3.2,0]));target=src.clone().add(V([0,.4,0]));fov=50;break;}
   case'final':{const a=lerp(.2,-.2,lin);pos=V([lerp(70,82,u)*Math.sin(a),lerp(34,48,u),-lerp(70,82,u)*Math.cos(a)]);target=V([0,lerp(1,4,u),6]);fov=54;break;}
   default:pos=V([0,40,-80]);target=V([0,0,0]);
  }
  return{pos:pos.add(V([0,.12*bump,0])),target,fov:fov-1.5*bump,roll};
 }
}
