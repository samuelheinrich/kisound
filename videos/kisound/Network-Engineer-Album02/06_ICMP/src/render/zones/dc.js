// The data centre in New York where server D (198.51.100.20) runs: white cabinets around a contained cold aisle (glass
// roof, sliding doors), open dark ceiling with an orange fibre runner and silver baskets, polished concrete. D's NIC is
// fed by the fibre from the carrier; a crash cart shows its sockets: echo answered, UDP 9000 open, 33434+ closed.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {PALETTE as P} from '../config.js';
import {V,glow,additive,setGlow,label,instanced,canvasTexture,dynamicTexture,random} from '../world.js';
import {smooth,lerp,clamp} from '../timeline.js';
import {FLIGHTS,activeFlights,segAt,T,ADDR} from '../model.js';
const std=(color,o={})=>new THREE.MeshStandardMaterial({color,roughness:.6,metalness:.2,...o});
const add=(p,geo,m,pos,rot)=>{const x=new THREE.Mesh(geo,m);x.position.set(...pos);if(rot)x.rotation.set(...rot);p.add(x);return x;};
const rbox=(w,h,d,r=.01)=>new RoundedBoxGeometry(w,h,d,2,r);
// rack faces (same generator as in Out of Band, copied into this project)
const UH=16,FW=256,FH=42*UH+24;
function rackFace(seed,rear,gap){
 const c=document.createElement('canvas');c.width=FW;c.height=FH;const e=document.createElement('canvas');e.width=FW;e.height=FH;const g=c.getContext('2d'),ge=e.getContext('2d');
 g.fillStyle='#14171b';g.fillRect(0,0,FW,FH);ge.fillStyle='#000';ge.fillRect(0,0,FW,FH);
 g.fillStyle='#0c0e10';g.fillRect(0,0,18,FH);g.fillRect(FW-18,0,18,FH);g.fillStyle='#3a3f45';for(let y=14;y<FH;y+=UH/3){g.fillRect(6,y,6,3);g.fillRect(FW-12,y,6,3);}
 const r=i=>random(seed*131+i*17),led=(x,y,col,s=3)=>{ge.fillStyle=col;ge.fillRect(x,y,s,s);g.fillStyle=col;g.fillRect(x,y,s,s);};
 let u=0,k=0;while(u<42){
  if(gap&&u>=gap[0]&&u<gap[1]){u=gap[1];continue;}
  const p=r(k++),size=p<.28?1:p<.55?2:p<.66?1:p<.72?4:1,type=p<.28?'s1':p<.55?'s2':p<.66?'sw':p<.72?'st':p<.8?'pp':'bl';const n=Math.min(size,42-u);
  const y=FH-12-(u+n)*UH,x0=20,w=FW-40,h=n*UH-1;
  if(!rear){
   if(type==='bl'){g.fillStyle='#1b1e22';g.fillRect(x0,y,w,h);g.fillStyle='#262a2f';for(let i=0;i<n;i++)g.fillRect(x0+6,y+i*UH+6,w-12,3);}
   else if(type==='sw'){g.fillStyle='#202429';g.fillRect(x0,y,w,h);g.fillStyle='#c9ced3';for(let i=0;i<24;i++){g.fillRect(x0+40+i*7,y+5,5,6);}for(let i=0;i<24;i+=2)led(x0+40+i*7,y+2,'#55e08a',2);led(x0+8,y+6,'#4aa3ff');}
   else if(type==='pp'){g.fillStyle='#16191c';g.fillRect(x0,y,w,h);g.fillStyle='#e6e9ec';for(let i=0;i<24;i++)g.fillRect(x0+12+i*8,y+5,5,5);const cols=['#2f7fd8','#e8c23a','#e4e8ec','#3fb36a'];for(let i=0;i<24;i+=1+Math.floor(r(k+i)*3)){g.fillStyle=cols[(i+k)%4];g.fillRect(x0+12+i*8,y+10,5,6);}}
   else{const light=r(k+5)<.55;g.fillStyle=light?'#c7cdd3':'#2c3238';g.fillRect(x0,y,w,h);const bayCol=light?'#9aa2aa':'#454c54';const bays=type==='st'?24:type==='s2'?12:8,rows=type==='st'?3:type==='s2'?2:1;
    for(let rr=0;rr<rows;rr++)for(let i=0;i<bays/rows;i++){const bx=x0+30+i*(w-60)/(bays/rows),by=y+3+rr*(h-4)/rows;g.fillStyle=bayCol;g.fillRect(bx,by,(w-70)/(bays/rows),(h-6)/rows-2);if(r(k+i*3+rr)<.7)led(bx+2,by+2,'#4aa3ff',2);}
    led(x0+8,y+h/2-2,'#4aa3ff');led(x0+16,y+h/2-2,r(k+9)<.15?'#ffb13d':'#55e08a');}
  }else{
   g.fillStyle=type==='bl'?'#16191c':'#2a2f35';g.fillRect(x0,y,w,h);if(type!=='bl'){g.fillStyle='#3b4148';g.fillRect(x0+4,y+2,34,h-4);g.fillRect(x0+42,y+2,34,h-4);led(x0+30,y+4,'#55e08a',2);led(x0+68,y+4,'#55e08a',2);
    g.fillStyle='#101214';for(let i=0;i<Math.min(4,n*2);i++){g.beginPath();g.arc(x0+100+i*22,y+h/2,Math.min(9,h/2-1),0,7);g.fill();}
    const cols=['#2f7fd8','#2f7fd8','#e8c23a','#d8dde2','#3fb36a'];for(let i=0;i<3;i++){g.fillStyle=cols[Math.floor(r(k+i*5)*5)];g.fillRect(x0+w-60+i*14,y+3,8,h-6);}}
  }
  u+=n;
 }
 if(rear){g.fillStyle='#0b0c0e';g.fillRect(20,0,10,FH);g.fillRect(FW-30,0,10,FH);g.strokeStyle='rgba(10,10,12,.85)';g.lineWidth=3;for(let i=0;i<14;i++){const yy=30+i*48;g.beginPath();g.moveTo(40,yy);g.quadraticCurveTo(26,yy+20,25,yy+44);g.stroke();g.beginPath();g.moveTo(FW-40,yy+10);g.quadraticCurveTo(FW-26,yy+26,FW-25,yy+50);g.stroke();}}
 const t=new THREE.CanvasTexture(c),te=new THREE.CanvasTexture(e);t.colorSpace=te.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return{map:t,emissiveMap:te};
}
const ROWS=[{z:-1.2,face:1},{z:1.2,face:-1},{z:-3.6,face:-1},{z:3.6,face:1}],RX=i=>-3.3+.6*i;
export const D_POS=[.3,1.25,-.58];
const FIBRE=[[-6,2.55,-.9],[.3,2.55,-.9],[.3,2.1,-.75],[.36,1.6,-.6],[.42,1.27,-.585]];
function along(pts,u){const L=[0];for(let i=1;i<pts.length;i++)L.push(L[i-1]+Math.hypot(...pts[i].map((v,k)=>v-pts[i-1][k])));const s=clamp(u)*L.at(-1);let i=1;while(i<L.length-1&&L[i]<s)i++;const k=(s-L[i-1])/(L[i]-L[i-1]||1);return new THREE.Vector3(...pts[i-1].map((v,j)=>v+(pts[i][j]-v)*k));}
// the last quarter of the way in (GATE→D) and the first quarter out (D→GATE) run along the fibre to the NIC
export function dcPos(f,t){const g=segAt(f,Math.min(t,f.t1));if(g.b==='D'&&g.u>=.75)return along(FIBRE,(g.u-.75)/.25);if(g.a==='D'&&g.u<=.25)return along(FIBRE,1-g.u/.25);return null;}
export class DcZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x0b0e12);s.fog=new THREE.FogExp2(0x2a3036,.014);
  s.add(new THREE.HemisphereLight(0xf2f5f8,0x6a6f75,2.0));const key=new THREE.DirectionalLight(0xffffff,.9);key.position.set(2,8,3);s.add(key);
  const conc=canvasTexture(512,512,(g,w,h)=>{g.fillStyle='#8a8f94';g.fillRect(0,0,w,h);for(let i=0;i<1600;i++){g.fillStyle=`rgba(${random(i)<.5?'60,64,68':'170,174,178'},${.08*random(i*3)})`;g.beginPath();g.arc(random(i*7)*w,random(i*11)*h,1+random(i*13)*5,0,7);g.fill();}g.strokeStyle='rgba(50,54,58,.5)';g.lineWidth=2;g.strokeRect(0,0,w,h);});
  conc.wrapS=conc.wrapT=THREE.RepeatWrapping;conc.repeat.set(4,4);add(s,new THREE.PlaneGeometry(12,11),std(0xffffff,{map:conc,roughness:.28,metalness:.15}),[0,0,0],[-Math.PI/2,0,0]);
  add(s,new THREE.PlaneGeometry(7.6,1.2),std(0x6f757b,{roughness:.35}),[0,.002,0],[-Math.PI/2,0,0]);
  const wall=std(0x4a525a,{roughness:.85});for(const[w,pos,ry]of[[12,[0,2.1,-5.5],0],[12,[0,2.1,5.5],Math.PI],[11,[-6,2.1,0],Math.PI/2],[11,[6,2.1,0],-Math.PI/2]])add(s,new THREE.PlaneGeometry(w,4.2),wall,pos,[0,ry,0]);
  this.ceiling=add(s,new THREE.PlaneGeometry(12,11),std(0x15181c,{roughness:.9}),[0,4.2,0],[Math.PI/2,0,0]);
  // white cabinets, faces from the generator
  const faces=[0,1,2].map(i=>rackFace(91+i,false)),frame=std(0xe6e9ec,{roughness:.45,metalness:.3}),d=new THREE.Object3D(),list=[];for(const r of ROWS)for(let i=0;i<12;i++)list.push({...r,x:RX(i),d:r.z===-1.2&&i===6});
  const fr=new THREE.InstancedMesh(rbox(.6,2.0,1.1,.012),frame,list.length);list.forEach((r,k)=>{d.position.set(r.x,1,r.z);d.rotation.set(0,0,0);d.updateMatrix();fr.setMatrixAt(k,d.matrix);});s.add(fr);
  const fg=new THREE.PlaneGeometry(.52,1.86);faces.forEach((f,v)=>{const items=list.filter((r,k)=>k%3===v&&!r.d);const m=new THREE.InstancedMesh(fg,std(0xffffff,{map:f.map,emissiveMap:f.emissiveMap,emissive:0xffffff,emissiveIntensity:1.2,roughness:.5}),items.length);
   items.forEach((r,j)=>{d.position.set(r.x,1.02,r.z+r.face*.552);d.rotation.set(0,r.face>0?0:Math.PI,0);d.updateMatrix();m.setMatrixAt(j,d.matrix);});s.add(m);});
  const dFace=rackFace(97,false,[26,30]);add(s,fg,std(0xffffff,{map:dFace.map,emissiveMap:dFace.emissiveMap,emissive:0xffffff,emissiveIntensity:1.2}),[RX(6),1.02,-1.2+.552]);
  // server D: 2U with its NIC, socket LEDs and a label plate
  add(s,rbox(.48,.088,.6,.006),std(0xd9dde1,{metalness:.5,roughness:.35}),[.3,1.25,-.95]);const plate=canvasTexture(512,96,(g,w,h)=>{g.fillStyle='#d9dde1';g.fillRect(0,0,w,h);g.fillStyle='#1d2a38';g.font='600 26px "Space Grotesk"';g.fillText('D · 198.51.100.20',16,38);g.font='18px "JetBrains Mono"';g.fillStyle='#3a4a5a';g.fillText('UDP 9000',260,78);g.fillText('UDP 33434+',380,78);g.fillText('NIC',16,78);});
  add(s,new THREE.PlaneGeometry(.48,.088),std(0xffffff,{map:plate,roughness:.5}),[.3,1.25,-.649]);this.ledUdp=add(s,new THREE.BoxGeometry(.01,.008,.004),glow(P.ok,.8),[.3+.03,1.262,-.646]);this.ledClosed=add(s,new THREE.BoxGeometry(.01,.008,.004),glow(P.red,.6),[.3+.15,1.262,-.646]);this.ledNic=add(s,new THREE.BoxGeometry(.01,.008,.004),glow(P.data,1),[.3-.2,1.262,-.646]);
  // containment: glass roof and sliding doors; fibre runner, baskets, pendant lights
  const glass=new THREE.MeshStandardMaterial({color:0xbfd8e8,transparent:true,opacity:.18,depthWrite:false,roughness:.1,metalness:.5,side:THREE.DoubleSide}),alu=std(0xb9c1c9,{metalness:.8,roughness:.3});
  this.roof=add(s,new THREE.PlaneGeometry(7.2,1.2),glass,[0,2.05,0],[-Math.PI/2,0,0]);for(let x=-3.6;x<=3.61;x+=.6)add(s,new THREE.BoxGeometry(.03,.03,1.2),alu,[x,2.06,0]);
  for(const x of[-3.62,3.62]){add(s,new THREE.PlaneGeometry(1.2,2.0),glass,[x,1.0,0],[0,Math.PI/2,0]);add(s,new THREE.BoxGeometry(.04,2.05,.04),alu,[x,1.02,-.6]);add(s,new THREE.BoxGeometry(.04,2.05,.04),alu,[x,1.02,.6]);add(s,new THREE.BoxGeometry(.04,.04,1.2),alu,[x,2.04,0]);}
  this.podLight=glow(0xf4f8ff,1.3);for(const z of[-.35,.35])add(s,new THREE.BoxGeometry(7,.02,.06),this.podLight,[0,2.02,z]);
  const orange=std(0xf07a22,{roughness:.45});add(s,new THREE.BoxGeometry(12,.1,.2),orange,[0,2.6,-.9]);add(s,new THREE.BoxGeometry(.12,.45,.12),orange,[.3,2.33,-.88]);
  const fib=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(FIBRE.slice(1).map(p=>new THREE.Vector3(...p))),40,.003,6,false),std(0xf07a22,{roughness:.4}));s.add(fib);
  const wire=canvasTexture(128,64,(g,w,h)=>{g.clearRect(0,0,w,h);g.strokeStyle='#cfd6dc';g.lineWidth=3;for(let x=0;x<=w;x+=16){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}for(let y=0;y<=h;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}});wire.wrapS=wire.wrapT=THREE.RepeatWrapping;wire.repeat.set(60,1);
  const bm=new THREE.MeshStandardMaterial({map:wire,transparent:true,alphaTest:.3,side:THREE.DoubleSide,metalness:.7});for(const r of ROWS)add(s,new THREE.PlaneGeometry(7.4,.3),bm,[0,2.42,r.z],[-Math.PI/2,0,0]);
  this.pend=glow(0xfdf6ea,1.5);for(const z of[-2.4,2.4,-4.6,4.6])add(s,new THREE.BoxGeometry(6,.04,.12),this.pend,[0,3.3,z]);for(const z of[-2.4,2.4])for(const x of[-2.8,0,2.8])add(s,new THREE.CylinderGeometry(.004,.004,.9,4),alu,[x,3.75,z]);
  // crash cart with D's socket table
  const cart=new THREE.Group();cart.position.set(1.25,0,.18);cart.rotation.y=-2.2;s.add(cart);add(cart,new THREE.BoxGeometry(.5,.03,.4),alu,[0,.8,0]);for(const x of[-.22,.22])for(const z of[-.17,.17])add(cart,new THREE.CylinderGeometry(.012,.012,.8,8),alu,[x,.4,z]);
  add(cart,rbox(.36,.02,.14,.004),std(0x2b3138),[0,.82,.08]);this.mon=dynamicTexture(1024,640);add(cart,rbox(.56,.36,.03,.006),std(0x1b1f24),[0,1.16,-.1]);add(cart,new THREE.PlaneGeometry(.52,.325),new THREE.MeshBasicMaterial({map:this.mon.tex,toneMapped:false}),[0,1.16,-.084]);
  label(s,'Rechenzentrum New York','Server D 198.51.100.20 · Rack A07',[.3,2.35,-.4],.9,'#e6f2fa');label(s,'Glasfaser vom Carrier','Tunnel-Ende aus Frankfurt',[-2.5,2.85,-.9],.9,'#ffc79a');
  this.pulse=instanced(s,new THREE.SphereGeometry(.018,10,8),glow(0xffffff),12);this.trail=instanced(s,new THREE.SphereGeometry(.011,6,4),additive(0xffffff),120);
 }
 update(t,a,tl,shot){
  const fly=shot.mode==='flyin';this.ceiling.visible=!fly;const recent=(tt,w=1.6)=>t>=tt&&t<tt+w;
  setGlow(this.ledUdp.material,P.ok,recent(T.udpOk)||recent(204.6)?2.4:.8);setGlow(this.ledClosed.material,P.red,recent(T.t3AtD,2)?2.6:.6);
  const arrive=FLIGHTS.filter(f=>f.nodes.at(-1)==='D'&&f.fate!=='drop'&&f.t1<=t&&t<f.t1+.4).length;setGlow(this.ledNic.material,P.data,arrive?2.6:1);
  this.pulse.begin();this.trail.begin();for(const f of activeFlights(t)){const p=dcPos(f,t);if(!p||t>f.t1)continue;const icmp=f.kind==='icmp';this.pulse.push(p,icmp?P.icmp:P.data,1,null,1.8);for(let k=1;k<=10;k++){const q=dcPos(f,t-k*.025);if(!q)break;this.trail.push(q,icmp?P.icmp:P.data,1-k/12,null,.7*(1-k/11));}}this.pulse.end();this.trail.end();
  const seen=FLIGHTS.filter(f=>(f.nodes.at(-1)==='D'&&f.t1<=t&&f.fate!=='drop')||(f.src===ADDR.D&&f.t0<=t));
  this.mon.set(String(seen.length)+Math.floor(t),g=>{g.fillStyle='#060a0f';g.fillRect(0,0,1024,640);g.fillStyle='#14202c';g.fillRect(0,0,1024,40);g.font='20px "JetBrains Mono"';g.fillStyle='#8fb2c8';g.fillText('root@d:~# ss -ulpn ; nstat -az Icmp*',14,28);
   const L=[['State   Recv-Q Send-Q Local Address:Port',''],['UNCONN  0      0      0.0.0.0:9000   udp-test-rx','#8fe3b8'],['(kein Socket auf 33434–33436)','#ff8b80'],['',''],[`IcmpInEchos       ${seen.filter(f=>f.type===8).length}`,''],[`IcmpOutEchoReps   ${seen.filter(f=>f.type===0).length}`,'#bff1ff'],[`IcmpOutDestUnreachs ${seen.filter(f=>f.type===3&&f.code===3).length}`,'#ffd27a'],[`UDP 9000 empfangen ${seen.filter(f=>f.proto==='UDP'&&f.dport==null&&f.nodes.at(-1)==='D').length}`,'#8fe3b8']];
   L.forEach(([s2,c],i)=>{g.font='26px "JetBrains Mono"';g.fillStyle=c||'#d8e7ef';g.fillText(s2,20,90+i*58);});g.font='18px "JetBrains Mono"';g.fillStyle='#5f7484';g.fillText('Szenario / simulierte Werte',20,620);});
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),e=u*u*(3-2*u),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),m=shot.mode,k=+shot.id.slice(1);
  switch(m){
   case'aisle':return look([lerp(-4.6,-1.0,e),1.6,lerp(.1,0,e)],[lerp(-1.5,.4,e),1.25,-.45],50);
   case'flyin':return look([lerp(-2.5,-.6,e),lerp(7.5,1.55,e),lerp(3.5,.35,e)],[lerp(0,.3,e),lerp(0,1.2,e),lerp(-.5,-.6,e)],lerp(56,44,e));
   default:return k%2?look([lerp(-.4,-.15,u),1.5,.48],[.55,1.15,-.45],52):look([lerp(.95,.75,u),1.42,.45],[.25,1.22,-.6],46);
  }
 }
}
