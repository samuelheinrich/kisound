// The physical path in a dark rack room: client → SW-A (SPAN branch, output queue) → 100 Mbit/s uplink → SW-B (SPAN)
// → APP. Originals: solid white carriers. Mirror copies: dashed cyan outline on the capture line – never onward traffic.
import * as THREE from 'three';
import {PALETTE as P,AMBIENT_DIM} from '../config.js';
import {V,mat,glow,additive,setGlow,box,label,instanced,canvasTexture,dynamicTexture,tube,cachedTexture,random} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {ST,LABEL,activeFlights,pointAt,BY_ID,outputDrops,queueFill,bulkRate,BULK_LIMIT,HTTP_OK,FINDING,NEW_TEST,CAP_STOP} from '../model.js';
const KC={orig:0xeef4f8,bulk:0xa08a5a,cmp:0x9fd8c0};
export class NetZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x02050a);s.fog=new THREE.FogExp2(0x02050a,.016);
  this.hemi=new THREE.HemisphereLight(0x7f9fd0,0x05070c,1.3);s.add(this.hemi);this.key=new THREE.DirectionalLight(0xbfd6ff,.9);this.key.position.set(5,25,20);s.add(this.key);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(140,90),mat(0x060a12,{roughness:.35,metalness:.7}));floor.rotation.x=-Math.PI/2;s.add(floor);
  const rackTex=canvasTexture(256,512,(c,w,h)=>{c.fillStyle='#0a1118';c.fillRect(0,0,w,h);for(let i=0;i<20;i++){const y=12+i*24.5;c.fillStyle='#131e2a';c.fillRect(10,y,236,20);for(let k=0;k<6;k++){const r=random(i*9+k);c.fillStyle=r<.35?'#3f9fff':r<.5?'#ffa040':r<.65?'#2fbf71':'#1b2733';c.fillRect(160+k*13,y+7,6,6);}}});
  const rm=new THREE.MeshStandardMaterial({map:rackTex,emissiveMap:rackTex,emissive:0xffffff,emissiveIntensity:.6,roughness:.5,metalness:.4}),racks=instanced(s,new THREE.BoxGeometry(2,8,2.4),rm,60);racks.begin();for(let i=0;i<30;i++)for(const z of[-28,26])racks.push(new THREE.Vector3(-58+i*4,4,z),0xffffff,1);racks.end();
  // switches as glass bodies with a visible fabric and a SPAN branch
  const sw=(name,x,sub)=>{const g=new THREE.Group();g.position.set(x,0,0);s.add(g);const body=new THREE.Mesh(new THREE.BoxGeometry(7,2.6,9),new THREE.MeshStandardMaterial({color:0x6f9fc8,emissive:0x0d2236,transparent:true,opacity:.3,roughness:.2,metalness:.2,depthWrite:false}));body.position.y=1.3;g.add(body);
   const ed=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(7,2.6,9)),new THREE.LineBasicMaterial({color:0x7fb8e0,toneMapped:false}));ed.position.y=1.3;g.add(ed);label(s,name,sub,[x,4.4,0],3.4);const pl=new THREE.PointLight(0x9fc8ff,10,22,1.4);pl.position.set(0,5,6);g.add(pl);return g;};
  sw('SW-A',-18,'IOS XE · Gi1/0/7 Client · Gi1/0/8 Bulk · Gi1/0/48 Uplink');sw('SW-B',18,'IOS XE · Gi1/0/48 Uplink · Gi1/0/7 Server (VLAN 220)');
  for(const[k,txt]of[['A7','Gi1/0/7'],['A8','Gi1/0/8'],['AQ','Gi1/0/48 out'],['B48','Gi1/0/48'],['B7','Gi1/0/7'],['A24','Gi1/0/24 SPAN'],['B24','Gi1/0/24 SPAN']]){box(s,[.5,.5,.5],ST[k],glow(k.endsWith('24')?P.mirror:0xeef4f8,1));label(s,txt,'',[ST[k][0],ST[k][1]+1,ST[k][2]],1.9);}
  // paths: production (white), bulk (amber), comparison (soft green), mirror lines (cyan, dashed)
  const pathTube=(nodes,col,str,r=.07)=>{const m=additive(col,str);tube(s,nodes.map(n=>V(ST[n])),m,r,40);return m;};
  this.prodMat=pathTube(['CL','A7','AQ'],0xeef4f8,.25);this.upMat=pathTube(['AQ','UP','B48'],0xeef4f8,.3,.16);pathTube(['B48','B7','SRV'],0xeef4f8,.25);pathTube(['BULK','A8','AQ'],P.bulk,.3);pathTube(['C2','B5','B7'],0x9fd8c0,.3);
  for(const[a,b,c]of[['A7','A24','ANA_A'],['A8','A24','ANA_A'],['B48','B24','ANA_B'],['B7','B24','ANA_B']]){const pts=[V(ST[a]),V(ST[b]),V(ST[c])];const g=new THREE.BufferGeometry().setFromPoints(pts);const l=new THREE.Line(g,new THREE.LineDashedMaterial({color:P.mirror,dashSize:.5,gapSize:.35,transparent:true,opacity:.8}));l.computeLineDistances();s.add(l);}
  label(s,'100 Mbit/s Uplink','SW-A Gi1/0/48 ↔ SW-B Gi1/0/48',[0,3.2,0],3.4,'#e6f2fa');
  // the output queue at SW-A Gi1/0/48 with its drop counter
  this.qShaft=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,5,24,1,true),new THREE.MeshStandardMaterial({color:0x9fc8ff,transparent:true,opacity:.14,side:THREE.DoubleSide,depthWrite:false}));this.qShaft.position.set(ST.AQ[0],3.8,ST.AQ[2]);s.add(this.qShaft);
  this.qFill=instanced(s,new THREE.BoxGeometry(1.4,.16,.9),glow(0xffffff),40);this.qTex=dynamicTexture(768,256);const qd=new THREE.Mesh(new THREE.PlaneGeometry(3.6,1.2),new THREE.MeshBasicMaterial({map:this.qTex.tex,toneMapped:false}));qd.position.set(ST.AQ[0],7.4,ST.AQ[2]);s.add(qd);
  this.hypo=new THREE.Mesh(new THREE.TorusGeometry(2.4,.08,8,48),glow(P.amber,0));this.hypo.position.set(ST.AQ[0],1.3,ST.AQ[2]);this.hypo.rotation.x=Math.PI/2;s.add(this.hypo);this.hypoLabel=label(s,'Hypothese: Verlust hier?','noch unbewiesen',[ST.AQ[0],9.0,0],3.6,'#ffcf86');
  // BEFORE's reach ends behind SW-A's ingress (it cannot see past the queue)
  this.reach=new THREE.Mesh(new THREE.PlaneGeometry(9,5),additive(P.mirror,0));this.reach.position.set(ST.AQ[0]+2.6,2.5,0);this.reach.rotation.y=Math.PI/2;s.add(this.reach);this.reachLabel=label(s,'Sichtgrenze BEFORE','SPAN sieht den Ausgang hinter der Queue nicht',[ST.AQ[0]+2.6,5.6,2],4,'#9fe8ff');
  // endpoints: client, server, comparison client, bulk source, analyzers with screens
  this.screens={};for(const k of['CL','SRV','C2','BULK','ANA_A','ANA_B']){const p=ST[k];box(s,[2.4,2,1.6],[p[0],1,p[2]],mat(0x13202e,{metalness:.5}));const tx=dynamicTexture(512,320),m=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.62),new THREE.MeshBasicMaterial({map:tx.tex,toneMapped:false}));
   m.position.set(p[0],2.9,p[2]+(k.startsWith('ANA')?.9:0));if(!k.startsWith('ANA'))m.rotation.y=k==='CL'||k==='BULK'?.5:-.5;s.add(m);this.screens[k]=tx;label(s,...LABEL[k],[p[0],4.6,p[2]],3.2);}
  this.cards=instanced(s,new THREE.BoxGeometry(1.1,.1,.75),glow(0xffffff),160);this.mirrors=instanced(s,new THREE.BoxGeometry(1.1,.1,.75),additive(0xffffff),80);
  this.bits=instanced(s,new THREE.BoxGeometry(.14,.14,.14),additive(0xffffff),80);this.tag=label(s,'','',[0,0,0],2.8,'#e6f2fa');this.tag2=label(s,'','',[0,0,0],2.8,'#9fe8ff');
 }
 drawScreens(t){const spin=Math.floor(t*6)%8,ok=t>=HTTP_OK,stopped=t>=CAP_STOP;
  this.screens.CL.set(`${ok}|${ok?0:spin}`,(g,w,h)=>{g.fillStyle='#050a10';g.fillRect(0,0,w,h);g.font='26px "JetBrains Mono"';g.fillStyle='#7f97a8';g.fillText('https://app.example',20,40);if(ok){g.font='700 64px "Space Grotesk"';g.fillStyle='#8fe3b8';g.fillText('HTTP 200',20,170);g.font='26px "JetBrains Mono"';g.fillText('{"status":"ok"}',20,230);return;}
   g.strokeStyle='#5f8fb0';g.lineWidth=10;g.beginPath();g.arc(w/2,h/2+20,60,spin*Math.PI/4,spin*Math.PI/4+Math.PI*1.4);g.stroke();g.font='26px "JetBrains Mono"';g.fillStyle='#9fb4c4';g.fillText('Laden …',w/2-56,h-30);});
  this.screens.SRV.set('srv',(g,w,h)=>{g.fillStyle='#050a10';g.fillRect(0,0,w,h);g.font='600 46px "Space Grotesk"';g.fillStyle='#8fe3b8';g.fillText('Dienst bereit',20,90);g.font='26px "JetBrains Mono"';g.fillStyle='#9fb4c4';g.fillText('198.51.100.20:443',20,150);g.fillText('Health: ok (lokal)',20,200);});
  this.screens.C2.set('c2',(g,w,h)=>{g.fillStyle='#050a10';g.fillRect(0,0,w,h);g.font='600 50px "Space Grotesk"';g.fillStyle='#8fe3b8';g.fillText('«geht» ✓',20,100);g.font='24px "JetBrains Mono"';g.fillStyle='#9fb4c4';g.fillText('Pfad nur über SW-B,',20,170);g.fillText('ohne Uplink',20,210);});
  this.screens.BULK.set(`${bulkRate(t)}`,(g,w,h)=>{g.fillStyle='#050a10';g.fillRect(0,0,w,h);g.font='600 64px "JetBrains Mono"';g.fillStyle=bulkRate(t)>50?'#ffb13d':'#8fe3b8';g.fillText(`${bulkRate(t)} Mbit/s`,20,140);g.font='24px "JetBrains Mono"';g.fillStyle='#9fb4c4';g.fillText(bulkRate(t)>50?'Bulk-Test · voll':'begrenzt (Versuch)',20,210);});
  for(const k of['ANA_A','ANA_B'])this.screens[k].set(`${stopped}|${Math.floor(Math.min(t,CAP_STOP)*3)}`,(g,w,h)=>{g.fillStyle='#050a10';g.fillRect(0,0,w,h);g.font='24px "JetBrains Mono"';g.fillStyle=stopped?'#ffb13d':'#ff6b78';g.fillText(stopped?'■ STOPPED':'● Aufnahme',16,34);
   for(let i=0;i<7;i++){g.fillStyle=i%3?'#1d2433':'#1b2a24';g.fillRect(10,50+i*36,w-20,32);g.fillStyle='#9fb4c4';g.fillText(`${(Math.floor(Math.min(t,CAP_STOP)*20)+i)%9000}  TCP …`,18,74+i*36);}});}
 update(t,a,tl,shot){
  const beat=tl.attack(t),dim=1-.6*smooth(AMBIENT_DIM,AMBIENT_DIM+2,t);this.hemi.intensity=1.3*dim;this.key.intensity=.9*dim;this.drawScreens(t);
  const f=queueFill(t);this.qFill.begin();for(let i=0;i<Math.round(f*26);i++)this.qFill.push(new THREE.Vector3(ST.AQ[0]+(random(i)-.5)*.4,1.5+i*.17,(random(i+9)-.5)*.3),i%4?P.bulk:0xeef4f8,1,null,i%4?.55:.7);this.qFill.end();
  const od=outputDrops(t);this.qTex.set(`${od}|${t>=FINDING}`,(g,w,h)=>{g.fillStyle='#07080c';g.fillRect(0,0,w,h);g.font='600 44px "JetBrains Mono"';g.fillStyle=od>3800?'#ff8b97':'#cfe3ee';g.fillText(`Gi1/0/48 output drops: ${od}`,20,80);g.font='30px "JetBrains Mono"';g.fillStyle=t>=FINDING?'#ffb13d':'#7f97a8';g.fillText(t>=FINDING?'Befund: Verlust am Uplink-Ausgang':'Messfenster läuft',20,160);});
  const hy=shot.mode==='hypo'||shot.mode==='toward'?1:0,fd=t>=FINDING&&shot.camera==='queue'?1:0;setGlow(this.hypo.material,P.amber,(hy*.8+fd*1.2)*(1+.3*beat));this.hypoLabel.userData.alpha=hy||fd;this.hypoLabel.material.map=cachedTexture(fd?'Befund: Verlust am SW-A-Uplink-Ausgang':'Hypothese: Verlust hier?',fd?'+18 Output-Drops · Capture-Drops 0':'noch unbewiesen','#ffcf86');
  const rc=shot.mode==='reach'||shot.mode==='lost'?1:0;setGlow(this.reach.material,P.mirror,.08*rc);this.reachLabel.userData.alpha=rc;
  setGlow(this.upMat,t>=BULK_LIMIT?0xeef4f8:P.bulk,.3+.25*f);
  // carriers
  this.cards.begin();this.mirrors.begin();this.bits.begin();let main=null,mir=null;const want=shot.target?.slice(2);
  for(const fl of activeFlights(t)){const p=V(pointAt(fl,Math.min(t,fl.t1)));if(t>fl.t1&&fl.fate!=='drop')continue;
   if(fl.fate==='drop'&&t>fl.t1){const d=t-fl.t1;for(let i=0;i<8;i++)this.bits.push(p.clone().add(new THREE.Vector3((random(i+fl.t0*7)-.5)*3*d,2*d-5*d*d,(random(i*3+fl.t0)-.5)*3*d)),P.red,1,null,1.4*(1-d));continue;}
   if(fl.kind==='mirror'){this.mirrors.push(p,P.mirror,fl.replay?.8:1,null,fl.replay?.5:1);}else this.cards.push(p,fl.replay?0x9fb4c4:KC[fl.kind]??0xffffff,fl.kind==='bulk'||fl.kind==='cmp'?.8:1.1,null,fl.kind==='bulk'?.45:fl.kind==='cmp'?.4:fl.replay?.5:.9);
   const named=fl.name&&(fl.id===want||BY_ID.get(want)===fl||fl.of===want||(BY_ID.get(want)&&fl.of===BY_ID.get(want).id));if(named&&fl.kind!=='mirror')main={fl,p};else if(fl.name&&fl.kind==='mirror'&&(fl.of===want||BY_ID.get(want)===fl||fl.of===BY_ID.get(want)?.id))mir={fl,p};}
  this.cards.end();this.mirrors.end();this.bits.end();
  for(const[tag,x]of[[this.tag,main],[this.tag2,mir]]){tag.userData.alpha=x?1:0;if(x){tag.position.copy(x.p).add(new THREE.Vector3(0,1.3,0));tag.material.map=cachedTexture(x.fl.name,x.fl.replay?'Wiedergabe aus dem Mitschnitt':x.fl.kind==='mirror'?'Kopie · gestrichelt · nur zur Captureleitung':x.fl.fate==='drop'?'am Uplink-Ausgang verworfen':'',x.fl.kind==='mirror'?'#9fe8ff':'#e6f2fa');}}
 }
 chase(id,t){let f=BY_ID.get(id);if(!f)return null;const tt=clamp(t,f.t0,f.t1),p=V(pointAt(f,tt)),q=V(pointAt(f,Math.min(f.t1,tt+.05))),h=q.clone().sub(p);if(h.lengthSq()<1e-6)h.set(1,0,0);return{p,h:h.normalize()};}
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),m=shot.mode;
  switch(shot.camera){
   case'span':{const c=this.chase(shot.target.slice(2),t);if(c){const side=new THREE.Vector3(-c.h.z,0,c.h.x);return look(c.p.clone().addScaledVector(c.h,-4.6).add(new THREE.Vector3(0,2.4,0)).addScaledVector(side,2.6),c.p.clone().addScaledVector(c.h,3),53);}return look([-18,6,10],[-18,1,-4],53);}
   case'target':{if(m==='works'||m==='ready')return look([lerp(28,26,u),3.6,lerp(22,19,u)],m==='works'?[22,2.2,12]:[34,2.4,0],38);return look([lerp(-24,-27,u),3.6,lerp(10,8,u)],[-34,2.4,0],38);}
   case'queue':{if(m==='end'||m==='warum')return look([lerp(-8,-6,u),lerp(6,5.5,u),lerp(12,11,u)],[-14,4,0],40);const x=lerp(-20,-8,u);return look([x,5,10],[x+3,3.4,0],40);}
   case'rack':default:{if(m==='second')return look([lerp(10,20,u),3.6,9],[lerp(14,22,u),1.5,-3],40);const x=lerp(-34,6,u);return look([x,3.8,10],[x+5,1.4,0],40);}
  }
 }
}
