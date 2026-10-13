// Session archives below the two units: numbered glass plates with tuple, TCP state and sequence. They are copies of
// state, not packets. S-17 stands in front; a sync bridge carries copies in the healthy direction only.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,label,canvasTexture,dynamicTexture} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {SESSIONS,SYNCS,s17,diverged,haUp,inSync,syncDir,HA_DOWN,IN_SYNC,ADDR,role} from '../model.js';
const COL={A:P.a,B:P.b},AX=7.5,ROWS=6,COLS=4;
// Plate slot in an archive: S-17 front centre, the others in rows behind.
const slot=(i)=>{const r=Math.floor(i/COLS),c=i%COLS;return[(c-(COLS-1)/2)*2.1,1.4+(r%2)*1.5,-2-Math.floor(r/2)*2.6-r*.4];};
export class ArchiveZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x010409);s.fog=new THREE.FogExp2(0x010409,.035);
  s.add(new THREE.HemisphereLight(0x6f92c8,0x03050a,1.3));for(const x of[-AX,AX]){const l=new THREE.PointLight(x<0?P.a:P.b,8,16,1.5);l.position.set(x,5,4);s.add(l);}
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(60,60),mat(0x050a12,{roughness:.3,metalness:.8}));fl.rotation.x=-Math.PI/2;s.add(fl);
  this.arch={};for(const d of['A','B']){const sx=d==='A'?-1:1,g=new THREE.Group();g.position.set(sx*AX,0,0);s.add(g);
   const frame=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(9.5,5,14)),new THREE.LineBasicMaterial({color:COL[d],transparent:true,opacity:.7}));frame.position.set(0,2.5,-6);g.add(frame);
   label(s,`ARCHIV ${d}`,`Session-Tabelle unter ${d}`,[sx*AX,5.9,-1],3.2);
   const plates=SESSIONS.map((ss,i)=>{const tex=canvasTexture(512,320,(c,w,h)=>{c.fillStyle='rgba(10,24,36,.55)';c.fillRect(0,0,w,h);c.strokeStyle=d==='A'?'#ff9a4a':'#5fdcff';c.lineWidth=5;c.strokeRect(3,3,w-6,h-6);c.font='600 60px "Space Grotesk"';c.fillStyle='#e8f4fa';c.fillText(ss.id,24,74);c.font='26px "JetBrains Mono"';c.fillStyle='#a9c4d4';c.fillText(ss.tuple.slice(0,32),24,140);c.fillText(ss.proto==='TCP'?'TCP ESTABLISHED':'UDP',24,190);});
    const m=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.19),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:0,depthWrite:false,toneMapped:false}));const p=slot(i+1);m.position.set(...p);g.add(m);return{m,ss};});
   const s17t=dynamicTexture(1024,640),s17m=new THREE.Mesh(new THREE.PlaneGeometry(3.6,2.25),new THREE.MeshBasicMaterial({map:s17t.tex,transparent:true,depthWrite:false,toneMapped:false}));s17m.position.set(0,2.4,1.6);g.add(s17m);
   this.arch[d]={g,plates,s17t,s17m,frame};}
  // sync bridge between the archives
  this.bridge=additive(P.sync,.4);const br=new THREE.Mesh(new THREE.BoxGeometry(2*AX-4,.08,.5),this.bridge);br.position.set(0,4.6,.6);s.add(br);
  this.copy=new THREE.Mesh(new THREE.BoxGeometry(1.5,.95,.06),additive(P.sync,0));s.add(this.copy);this.copyTag=label(s,'S-17 Kopie','',[0,6,0],2.6,'#bff5e0');this.copyTag.userData.alpha=0;
  this.dirLabel=label(s,'Sync A → B','über ha1',[0,5.6,.6],2.4,'#bff5e0');
 }
 drawS17(d,t){
  const a=this.arch[d],v=s17(d,t),div=diverged(t),sel=d;
  a.s17t.set(`${v?.seq}|${v?.src}|${div}|${role(d,t)}`,(g,w,h)=>{g.fillStyle=div?'rgba(50,10,16,.85)':'rgba(8,22,30,.82)';g.fillRect(0,0,w,h);g.strokeStyle=div?'#ff4a5c':d==='A'?'#ff9a4a':'#5fdcff';g.lineWidth=10;g.strokeRect(5,5,w-10,h-10);
   g.font='700 110px "Space Grotesk"';g.fillStyle='#f2f8fb';g.fillText('S-17',40,130);g.font='600 46px "Space Grotesk"';g.fillStyle=d==='A'?'#ffb070':'#7fe2ff';g.fillText(`Archiv ${d}`,360,120);
   if(!v){g.font='40px "JetBrains Mono"';g.fillStyle='#7f95a6';g.fillText('noch kein Eintrag',40,260);return;}
   g.font='38px "JetBrains Mono"';g.fillStyle='#cfe3ee';g.fillText(`TCP ${ADDR.s17}`,40,240);g.fillText('ESTABLISHED',40,300);
   g.font='600 72px "JetBrains Mono"';g.fillStyle=div?'#ff8b97':'#e8fff4';g.fillText(`seq ${v.seq}`,40,420);g.font='36px "JetBrains Mono"';g.fillStyle=div?'#ff9aa6':'#93c4b4';g.fillText(div?`${v.src} · weicht ab`:v.src,40,500);
   g.fillStyle='#7f95a6';g.fillText(`Rolle: ${role(d,t)==='primary'?'Primary':'Secondary'}`,40,580);});
 }
 update(t,a,tl,shot){
  for(const d of['A','B']){this.drawS17(d,t);const A=this.arch[d];A.plates.forEach(({m,ss},i)=>{m.material.opacity=t>=ss.born?(diverged(t)&&i%5===2?.2:.45):0;});A.frame.material.opacity=.4+.3*(tl.attack(t));}
  const up=haUp(t),dir=syncDir(t);setGlow(this.bridge,up?P.sync:P.red,up?.4:.15);
  this.dirLabel.material.map=this.dirTex(dir);
  const y=SYNCS.find(y=>t>=y.t0&&t<=y.t1);if(y){const u=smooth(y.t0,y.t1,t),x0=y.from==='A'?-AX:AX,x1=-x0;this.copy.position.set(lerp(x0,x1,u),4.6+Math.sin(u*Math.PI)*1.2,.6);setGlow(this.copy.material,P.sync,1.2);this.copyTag.position.copy(this.copy.position).add(new THREE.Vector3(0,1.2,0));this.copyTag.userData.alpha=1;}
  else{setGlow(this.copy.material,P.sync,0);this.copyTag.userData.alpha=0;}
 }
 dirTex(dir){const k=dir??'none';return this._d?.[k]??((this._d??={})[k]=canvasTexture(1024,192,(g,w,h)=>{g.fillStyle='rgba(4,14,14,.7)';g.fillRect(0,0,w,h);g.strokeStyle=dir?'#9fe8d0':'#ff4a5c';g.lineWidth=3;g.strokeRect(1,1,w-2,h-2);g.font='500 80px "Space Grotesk"';g.fillStyle=dir?'#d8fff0':'#ff9aa6';g.fillText(dir?`Sync ${dir}`:'Sync unterbrochen',28,110);g.font='34px "JetBrains Mono"';g.fillStyle='#93b4a8';g.fillText(dir?'über ha1':'ha1 down – keine Kopien',28,165);}));}
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),m=shot.mode;
  if(m==='diverge'||m==='parallel')return look([lerp(-.6,.6,u),lerp(3.6,3.2,u),lerp(15,13,u)],[0,2.8,0],42);
  // the camera rides with the copy: on the source plate before, on the destination after; reads stay on B
  const y=SYNCS.find(y=>y.t1>=shot.start&&y.t0<shot.end);let x=AX,k=0;
  if(y){const src=y.from==='A'?-AX:AX,dst=-src,p=smooth(y.t0,y.t1,t);x=t<y.t0?src:t>y.t1?dst:lerp(src,dst,p);k=t>=y.t0&&t<=y.t1?Math.sin(p*Math.PI):0;}
  return look([x*.92,lerp(3.3,3.0,u)+1.6*k,lerp(8.4,7.4,u)+4*k],[x,2.5+2.2*k,.8],44+8*k);
 }
}
