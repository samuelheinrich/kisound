// The globe: the packets leave the laptop in Zürich, cross to the transit router in Frankfurt and through its tunnel
// (MTU 1400) over the North Atlantic to the data centre in New York. Every ICMP answer flies back to Zürich. Land from
// Natural Earth 1:110m (public domain), drawn into an equirectangular texture; lit by a low sun, thin blue atmosphere.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,glow,additive,setGlow,label,instanced,cachedTexture,random} from '../world.js';
import {smooth,lerp,clamp} from '../timeline.js';
import {GEO,NODE_LABEL,BY_ID,activeFlights,segAt,T,ADDR} from '../model.js';
import {LAND} from '../geo.js';
const R=10;
export const ll2v=(lat,lon,r=R)=>{const a=lat*Math.PI/180,o=lon*Math.PI/180;return new THREE.Vector3(r*Math.cos(a)*Math.cos(o),r*Math.sin(a),-r*Math.cos(a)*Math.sin(o));};
const SITE={ZRH:GEO.H,FRA:GEO.R2,NYC:GEO.D};
const nodeSite=n=>n==='R2'||n==='GATE'?'FRA':n==='D'?'NYC':'ZRH';
// great-circle arc between two sites, lifted with the distance; the tunnel leaves Frankfurt a little higher
function arc(A,B,u){const a=ll2v(...SITE[A],1),b=ll2v(...SITE[B],1),ang=a.angleTo(b);if(ang<1e-6)return a.multiplyScalar(R*1.012);const s=Math.sin(ang),p=a.clone().multiplyScalar(Math.sin((1-u)*ang)/s).add(b.clone().multiplyScalar(Math.sin(u*ang)/s));return p.multiplyScalar(R*(1.012+(.03+.35*ang/Math.PI)*Math.sin(Math.PI*u)));}
export function flightPos(f,t){const g=segAt(f,Math.min(t,f.t1)),A=nodeSite(g.a),B=nodeSite(g.b);return arc(A,B,A===B?0:g.u);}
function earthTexture(){
 const W=4096,H=2048,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');
 const sea=g.createLinearGradient(0,0,0,H);sea.addColorStop(0,'#16365a');sea.addColorStop(.5,'#0f3a66');sea.addColorStop(1,'#16365a');g.fillStyle=sea;g.fillRect(0,0,W,H);
 g.strokeStyle='rgba(120,170,220,.16)';g.lineWidth=2;for(let lon=-180;lon<=180;lon+=15){const x=(lon+180)/360*W;g.beginPath();g.moveTo(x,0);g.lineTo(x,H);g.stroke();}for(let lat=-75;lat<=75;lat+=15){const y=(90-lat)/180*H;g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke();}
 const xy=(lon,lat)=>[(lon+180)/360*W,(90-lat)/180*H];
 const path=r=>{g.beginPath();for(let i=0;i<r.length;i+=2){const[x,y]=xy(r[i],r[i+1]);i?g.lineTo(x,y):g.moveTo(x,y);}g.closePath();};
 const land=g.createLinearGradient(0,0,0,H);land.addColorStop(0,'#e3e9ee');land.addColorStop(.12,'#a9b7a6');land.addColorStop(.25,'#5f7d5c');land.addColorStop(.4,'#7d7a52');land.addColorStop(.5,'#5d7d4f');land.addColorStop(.62,'#86805a');land.addColorStop(.78,'#5f7d5c');land.addColorStop(.9,'#d9e1e6');land.addColorStop(1,'#eef2f5');
 g.fillStyle=land;for(const r of LAND){path(r);g.fill();}
 for(let i=0;i<9000;i++){g.fillStyle=`rgba(${random(i)<.5?'30,50,30':'160,150,110'},${.05+.06*random(i*3)})`;g.fillRect(random(i*7)*W,random(i*11)*H,6,6);}
 g.strokeStyle='rgba(220,240,230,.55)';g.lineWidth=2.2;for(const r of LAND){path(r);g.stroke();}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;
}
const FOLLOW={S008:'E-02',S029:'I-M1',S056:'P-M2',S045:'T-2',S025:'P-M1'};
export class GlobeZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x02050b);
  s.add(new THREE.HemisphereLight(0x9fc4ff,0x0a1018,.55));const sun=new THREE.DirectionalLight(0xfff4e6,2.4);sun.position.copy(ll2v(25,-20,60)).add(new THREE.Vector3(10,20,30));s.add(sun);
  this.earth=new THREE.Mesh(new THREE.SphereGeometry(R,128,96),new THREE.MeshStandardMaterial({map:earthTexture(),roughness:.85,metalness:.05}));s.add(this.earth);
  const atmo=new THREE.ShaderMaterial({transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.BackSide,uniforms:{c:{value:new THREE.Color(0x4fa8ff)}},
   vertexShader:'varying vec3 n;varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);v=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
   fragmentShader:'uniform vec3 c;varying vec3 n;varying vec3 v;void main(){float f=pow(1.-abs(dot(n,v)),2.6);gl_FragColor=vec4(c*f*1.4,f);}'});
  s.add(new THREE.Mesh(new THREE.SphereGeometry(R*1.06,96,64),atmo));
  const stars=[];for(let i=0;i<2200;i++){const u=random(i*3)*2-1,o=random(i*7)*Math.PI*2,r=320+random(i*5)*80,q=Math.sqrt(1-u*u);stars.push(r*q*Math.cos(o),r*u,r*q*Math.sin(o));}
  s.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(stars,3)),new THREE.PointsMaterial({color:0xcfe2ff,size:1.1,sizeAttenuation:false})));
  // sites with pins and labels
  const pin=(key,lines)=>{const p=ll2v(...SITE[key]),n=p.clone().normalize(),g=new THREE.Group();g.position.copy(p);g.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),n);s.add(g);
   const ring=new THREE.Mesh(new THREE.RingGeometry(.12,.17,32),glow(0xffffff,1.4));ring.rotation.x=-Math.PI/2;ring.position.y=.01;g.add(ring);const st=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,.5,6),glow(0xbfefff,1.2));st.position.y=.25;g.add(st);
   label(s,lines[0],lines[1],p.clone().add(n.clone().multiplyScalar(.9)),2.6,'#e6f6ff');return ring;};
  this.rings={ZRH:pin('ZRH',['Zürich · Laptop H',`${ADDR.H} · G1 ${ADDR.G1} · G2 ${ADDR.G2}`]),FRA:pin('FRA',['Frankfurt · R2',`${ADDR.R2} · Tunnel MTU 1400`]),NYC:pin('NYC',['New York · Rechenzentrum',`Server D ${ADDR.D}`])};
  // the paths: Zürich→Frankfurt (1500), the tunnel Frankfurt→New York (1400), and the faint return lane
  const tube=(A,B,col,str,r)=>{const pts=[];for(let i=0;i<=64;i++)pts.push(arc(A,B,i/64));const m=additive(col,str);s.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),96,r,8,false),m));return m;};
  this.lan1=tube('ZRH','FRA',P.data,.35,.02);this.tunnel=tube('FRA','NYC',P.amber,.22,.055);this.tunnelCore=tube('FRA','NYC',P.data,.25,.015);
  const t0=arc('FRA','NYC',.012),t1=arc('FRA','NYC',.03);this.gate=new THREE.Mesh(new THREE.TorusGeometry(.13,.022,10,40),glow(P.amber,1.4));this.gate.position.copy(t0);this.gate.lookAt(t1);s.add(this.gate);
  label(s,'Tunnel · MTU 1400','1500-Byte-Datagramme mit DF passen nicht',t0.clone().add(t0.clone().normalize().multiplyScalar(.75)).add(new THREE.Vector3(0,.25,0)),2.3,'#ffcf86');
  label(s,'Nordatlantik','Seekabel · rund 6200 km',arc('FRA','NYC',.55).multiplyScalar(1.015),2.2,'#9fc8e8');
  this.heads=instanced(s,new THREE.CapsuleGeometry(.05,.16,4,10),glow(0xffffff),24);this.hulls=instanced(s,new THREE.SphereGeometry(.11,16,12),additive(0xffffff),24);this.quotes=instanced(s,new THREE.BoxGeometry(.09,.06,.06),glow(0xffffff),24);
  this.trail=instanced(s,new THREE.SphereGeometry(.04,8,6),additive(0xffffff),400);this.bits=instanced(s,new THREE.SphereGeometry(.025,6,4),additive(0xffffff),120);this.tags=Array.from({length:2},()=>label(s,'','',[0,0,0],2.4,'#e6f6ff'));
 }
 update(t,a,tl,shot){
  const beat=tl.attack(t);setGlow(this.gate.material,P.amber,1.2+.6*beat+(Math.abs(t-T.pm1Drop)<.8?2:0));setGlow(this.tunnel,P.amber,.18+.08*beat);
  for(const[k,r]of Object.entries(this.rings))setGlow(r.material,k==='NYC'&&t>=T.udpOk&&t<T.udpOk+2?P.ok:0xffffff,1.2+.4*beat);
  this.heads.begin();this.hulls.begin();this.quotes.begin();this.trail.begin();this.bits.begin();const tags=[],q=new THREE.Quaternion(),Y=new THREE.Vector3(0,1,0),want=FOLLOW[shot.id];
  for(const f of activeFlights(t)){const done=t>f.t1,p=flightPos(f,t);
   if(done){if(f.fate==='drop'||f.fate==='expire'){const d=t-f.t1,n=p.clone().normalize();for(let i=0;i<14;i++)this.bits.push(p.clone().add(new THREE.Vector3(random(i+f.t0)-.5,random(i*3+f.t0)-.5,random(i*5+f.t0)-.5).multiplyScalar(.9*d)).addScaledVector(n,.4*d),f.fate==='drop'?P.red:0x9fb4c4,1,null,1.6*(1-d/1.2));}continue;}
   const ahead=flightPos(f,Math.min(f.t1,t+.03)),dir=ahead.clone().sub(p);if(dir.lengthSq()>1e-10)q.setFromUnitVectors(Y,dir.normalize());else q.identity();const icmp=f.kind==='icmp';
   if(icmp){this.hulls.push(p,P.icmp,1,null,.6);if(f.quote)this.quotes.push(p.clone().addScaledVector(dir,-.1),P.amber,1,q,1.4);else this.heads.push(p,P.icmp,1,q,1);}else this.heads.push(p,P.data,f.size===1500?1.5:1,q,1.4);
   for(let k=1;k<=16;k++){const tk=t-k*.045;if(tk<f.t0)break;this.trail.push(flightPos(f,tk),icmp?P.icmp:P.data,1-k/20,null,.5*(1-k/17));}
   if((want?f.id===want:true)&&tags.length<this.tags.length&&(want||f.kind==='icmp'||f.size))tags.push({f,p});}
  this.heads.end();this.hulls.end();this.quotes.end();this.trail.end();this.bits.end();
  this.tags.forEach((tag,i)=>{const x=tags[i];tag.userData.alpha=x?1:0;if(x){tag.position.copy(x.p).add(x.p.clone().normalize().multiplyScalar(.7));tag.material.map=cachedTexture(`${x.f.id} · ${x.f.hdr}`,`${x.f.src} → ${x.f.dst}${x.f.ttl?' · TTL '+x.f.ttl:''}${x.f.df?' · DF=1':''}`,x.f.kind==='icmp'?'#ffffff':'#bff1ff');}});
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),m=shot.mode,k=+shot.id.slice(1);
  const at=(lat,lon,dist,tgt=[0,0,0],fov=40)=>look(ll2v(lat,lon,dist),tgt,fov);
  const id=FOLLOW[shot.id],f=id&&BY_ID.get(id);
  if(m==='follow'&&f&&t>=f.t0-.4&&t<=f.t1+.6){const tt=clamp(t,f.t0,f.t1),p=flightPos(f,tt),n=p.clone().normalize(),d=flightPos(f,Math.min(f.t1,tt+.15)).sub(p);if(d.lengthSq()<1e-8)d.copy(new THREE.Vector3(0,1,0).cross(n));d.normalize();
   return look(p.clone().addScaledVector(n,3.6).addScaledVector(d,-3.4),p.clone().addScaledVector(d,1.4),46);}
  switch(m){
   case'rise':return at(lerp(47.4,42,u),lerp(8.5,-28,u),lerp(R+1.4,R*2.7,u),ll2v(lerp(47.4,45,u),lerp(8.5,-30,u),lerp(R,0,u)),lerp(44,40,u));
   case'descend':return at(lerp(44,47.4,u),lerp(-30,8.5,u),lerp(R*2.6,R+2.2,u),ll2v(47.4,lerp(-30,8.5,u),lerp(0,R,u)),lerp(40,46,u));
   case'fra':return look(ll2v(lerp(53.5,52.6,u),lerp(1.0,-.6,u),R*1.42),ll2v(49.6,lerp(1.4,-1.2,u),R*1.0),40);
   case'hops':return at(lerp(52,49,u),lerp(-22,-30,u),R*2.25,ll2v(47,-28,R*.6),40);
   case'return':return at(lerp(56,52,u),lerp(-8,-20,u),R*2.0,ll2v(48,-14,R*.7),42);
   case'echo':return at(lerp(45,48,u),lerp(-40,-24,u),R*2.4,ll2v(45,-30,R*.5),40);
   case'spin':return at(lerp(30,38,u),lerp(-60,-10,u)+k*7,R*3.0,[0,0,0],38);
   default:return at(lerp(38,42,u),lerp(-40,-24,u),R*2.8,ll2v(44,-30,R*.4),40);
  }
 }
}
