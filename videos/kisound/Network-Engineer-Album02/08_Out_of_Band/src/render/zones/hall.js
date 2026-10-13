// A real data hall in metres (y up): raised floor with 60 cm tiles, four rows of 42U racks in hot/cold aisles, wire
// baskets and ladder trays overhead, the yellow fibre duct from R-EDGE (rack C06) to the neighbour (A14) and the
// service (A13). Behind C06 in the hot aisle: OOB switch, console server, the light-blue console cable – and the
// engineer on the floor with the laptop. Bright cool LED light; the blue tone stays in sky light, haze and LEDs.
import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {PALETTE as P} from '../config.js';
import {V,glow,additive,setGlow,label,instanced,canvasTexture,cachedTexture,dynamicTexture,random} from '../world.js';
import {smooth,lerp,clamp} from '../timeline.js';
import {HALL,ST,PATH,T,link,route,warm,proofs,activeFlights,pointAt,BY_ID,serialActivity,along,blockLines,BLOCKS} from '../model.js';
const std=(color,o={})=>new THREE.MeshStandardMaterial({color,roughness:.6,metalness:.2,...o});
const add=(parent,geo,material,pos,rot)=>{const m=new THREE.Mesh(geo,material);m.position.set(...pos);if(rot)m.rotation.set(...rot);parent.add(m);return m;};
const rbox=(w,h,d,r=.01)=>new RoundedBoxGeometry(w,h,d,2,r);
const ENG_HEAD=[ST.ENG[0],.78,ST.ENG[2]-.08];
// ---- textures --------------------------------------------------------------------------------------------------------------
const tileTex=(perf)=>canvasTexture(256,256,(g,w,h)=>{g.fillStyle=perf?'#aeb7c0':'#c3cbd3';g.fillRect(0,0,w,h);
 if(perf){g.fillStyle='#7d8893';for(let y=22;y<h-16;y+=12)for(let x=22;x<w-16;x+=12){g.beginPath();g.arc(x,y,3,0,7);g.fill();}}
 else{for(let i=0;i<300;i++){g.fillStyle=`rgba(120,130,140,${.05+.05*random(i)})`;g.fillRect(random(i*3)*w,random(i*7)*h,2,2);}}
 g.strokeStyle='#8f99a3';g.lineWidth=4;g.strokeRect(2,2,w-4,h-4);g.strokeStyle='rgba(255,255,255,.5)';g.lineWidth=2;g.strokeRect(6,6,w-12,h-12);});
const ceilTex=()=>canvasTexture(256,256,(g,w,h)=>{g.fillStyle='#d9dee3';g.fillRect(0,0,w,h);g.strokeStyle='#aab3bb';g.lineWidth=5;g.strokeRect(0,0,w,h);});
const wallTex=()=>canvasTexture(512,512,(g,w,h)=>{g.fillStyle='#cdd4db';g.fillRect(0,0,w,h);const band=y=>h-y/3.6*h;g.fillStyle='#2f6db3';g.fillRect(0,band(1.25),w,band(1.05)-band(1.25));g.fillStyle='#24548c';g.fillRect(0,band(1.07),w,6);g.fillStyle='#8c96a0';g.fillRect(0,band(.1),w,band(0)-band(.1));
 g.strokeStyle='rgba(120,130,140,.35)';g.lineWidth=2;g.beginPath();g.moveTo(w-1,0);g.lineTo(w-1,h);g.stroke();});
// rack faces: 42U drawn into a canvas; LEDs also into an emissive canvas
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
// ---- routes of the travelling camera (to / away from the engineer) ------------------------------------------------------------
const R=(pts,h=1.6)=>pts.map(p=>p.length===3?p:[p[0],h,p[1]]);
// ---- the large scale: building (data-centre level at the ground, six schematic floors above), four halls ---------------
const BUILDING={cx:9.2,cz:9,w:38.4,d:37,floors:[7,12,17,22,27,32],roof:37};
const HALLS=[{x:0,z:0,ours:true},{x:18.4,z:0},{x:0,z:17.4},{x:18.4,z:17.4}].map((h,i)=>({...h,z:h.z+(i===0?0:0)}));
// zoom in (0–8.48 s) and out (240.34–250.51 s): one continuous camera through keyframes [time, position, target, fov]
const ZOOM_IN=[[0,[170,120,210],[9,20,9],50],[2,[80,75,95],[9,22,9],50],[3.2,[20,50,26],[9,28,9],52],[4,[11,38.6,13],[8,20,7],58],[5.4,[6,14,8],[4,0,3],60],
 [6.4,[9,10.5,24],[9,0,9],62],[7.5,[-4.4,4.6,1.9],[-1.6,1,1.4],56],[8.48,[-3.6,1.65,1.8],[-.9,1.15,1.2],50]];
const ZOOM_OUT=[[240.34,[.3,1.1,-.62],[-.9,.78,-.82],46],[241.64,[-.5,3.4,-.4],[-.9,.5,-.7],54],[242.74,[2,6.2,4],[0,0,0],58],[243.74,[9,10.5,24],[9,0,9],62],
 [245.14,[11,30,15],[9,10,9],60],[246.34,[25,48,40],[9,20,9],54],[250.51,[170,115,210],[9,18,9],50]];
const keyCurves=new Map();
function keyed(K,t){
 if(!keyCurves.has(K))keyCurves.set(K,{p:new THREE.CatmullRomCurve3(K.map(k=>new THREE.Vector3(...k[1])),false,'centripetal'),q:new THREE.CatmullRomCurve3(K.map(k=>new THREE.Vector3(...k[2])),false,'centripetal')});
 const c=keyCurves.get(K),tt=clamp(t,K[0][0],K.at(-1)[0]);let i=1;while(i<K.length-1&&K[i][0]<tt)i++;const l=(tt-K[i-1][0])/(K[i][0]-K[i-1][0]),s=i===1?l*l*(2-l):i===K.length-1?l*(2-l)*(1-l)+l*l:l,p=(i-1+s)/(K.length-1);
 return{pos:c.p.getPoint(p),target:c.q.getPoint(p),fov:lerp(K[i-1][3],K[i][3],s)};
}
const ROUTES={
 open:R([[-6.2,1.8],[-4.6,1.8],[-3.2,1.78],[-2.2,1.75]]),
 cold1:R([[5.6,-3],[2,-3],[-2,-3],[-4.6,-3],[-5.6,-2.4],[-5.7,-1.4]]),
 east_to:R([[2.6,1.8],[4.6,1.8],[5.5,1.2],[5.6,-.1],[4.9,-.6],[2.6,-.6],[.7,-.62]]),
 west_to:R([[-1.4,-3],[-4.6,-3],[-5.6,-2.4],[-5.6,-1.1],[-4.8,-.6],[-3,-.6],[-2.2,-.62]]),
 away_east:R([[-.2,1.1,-.6],[1.2,-.6],[3.4,-.6],[4.9,-.6],[5.6,.1],[5.6,1.3]]),
 front_to:R([[3.4,5.4],[0,5.4],[-4.4,5.4],[-5.7,4.8],[-5.7,2.4],[-5.7,.3],[-5,-.6],[-3,-.6],[-2,-.62]]),
 away_west:R([[-1.5,1.2,-.62],[-3,-.6],[-4.8,-.6],[-5.6,-1.2],[-5.6,-2.5],[-4.6,-3],[-2.4,-3]]),
 hall_to:R([[4.4,2.1,2.0],[0,2.1,2.0],[-4.4,2.0,1.95],[-5.6,1.85,1],[-5.6,1.6,-.2],[-4.4,1.4,-.6],[-2.4,1.2,-.62]]),
 away_low:R([[-.35,.75,-.62],[.9,.85,-.6],[2.9,.95,-.6]]),
 back_to:R([[3.2,1.5,-.6],[1.3,1.35,-.6],[.1,1.05,-.62]]),
};
const curves=Object.fromEntries(Object.entries(ROUTES).map(([k,p])=>[k,new THREE.CatmullRomCurve3(p.map(a=>new THREE.Vector3(...a)),false,'centripetal',.5)]));
const ease=u=>u*u*(3-2*u);
// ---- the zone ------------------------------------------------------------------------------------------------------------------
export class HallZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x0a121c);s.fog=new THREE.FogExp2(0xb7c6d6,.022);
  this.hemi=new THREE.HemisphereLight(0xe4eeff,0x8d98a6,2.1);s.add(this.hemi);const key=new THREE.DirectionalLight(0xf4f8ff,1.1);key.position.set(3,12,5);s.add(key);const fill=new THREE.DirectionalLight(0xbcd2ff,.45);fill.position.set(-6,4,-8);s.add(fill);
  this.inside=new THREE.Group();s.add(this.inside);const I=this.inside;
  const W=HALL.x[1]-HALL.x[0],D=HALL.z[1]-HALL.z[0],cx=(HALL.x[0]+HALL.x[1])/2,cz=(HALL.z[0]+HALL.z[1])/2;
  // raised floor, perforated tiles in the cold aisles, ceiling with LED bands, walls with the blue band
  const ft=tileTex(false);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(W/.6,D/.6);add(I,new THREE.PlaneGeometry(W,D),std(0xffffff,{map:ft,roughness:.55}),[cx,0,cz],[-Math.PI/2,0,0]);
  const pt=tileTex(true);pt.wrapS=pt.wrapT=THREE.RepeatWrapping;pt.repeat.set(8.4/.6,2);for(const z of[HALL.aisles.cold1,HALL.aisles.cold2])add(I,new THREE.PlaneGeometry(8.4,1.2),std(0xffffff,{map:pt,roughness:.6}),[0,.002,z],[-Math.PI/2,0,0]);
  const ct=ceilTex();ct.wrapS=ct.wrapT=THREE.RepeatWrapping;ct.repeat.set(W/.6,D/.6);this.ceiling=add(I,new THREE.PlaneGeometry(W,D),std(0xffffff,{map:ct,roughness:.9}),[cx,HALL.h,cz],[Math.PI/2,0,0]);
  this.lamps=new THREE.Group();I.add(this.lamps);this.lampMat=glow(0xeef5ff,1.6);for(const z of[HALL.aisles.cold1,HALL.aisles.hot,HALL.aisles.cold2,5.2,-5.7])add(this.lamps,new THREE.BoxGeometry(12.4,.03,.16),this.lampMat,[0,HALL.h-.02,z]);
  for(const x of[-5.7,5.7])add(this.lamps,new THREE.BoxGeometry(.16,.03,10.6),this.lampMat,[x,HALL.h-.02,0]);
  const wt=wallTex();wt.wrapS=THREE.RepeatWrapping;const wall=(w,pos,ry)=>{const t=wt.clone();t.needsUpdate=true;t.repeat.set(w/3,1);add(I,new THREE.PlaneGeometry(w,HALL.h),std(0xffffff,{map:t,roughness:.85}),pos,[0,ry,0]);};
  wall(W,[cx,HALL.h/2,HALL.z[0]],0);wall(W,[cx,HALL.h/2,HALL.z[1]],Math.PI);wall(D,[HALL.x[0],HALL.h/2,cz],Math.PI/2);wall(D,[HALL.x[1],HALL.h/2,cz],-Math.PI/2);
  add(I,new THREE.BoxGeometry(.06,2.2,1.4),std(0x8d99a6,{metalness:.4}),[HALL.x[0]+.03,1.1,-5.2]);// door
  // cooling units (CRAC) along the side walls, a riser cabinet and extinguishers: what perimeter aisles really show
  const crac=canvasTexture(256,512,(g,w,h)=>{g.fillStyle='#d3d9df';g.fillRect(0,0,w,h);g.fillStyle='#b9c1c9';for(let y=40;y<h-20;y+=10)g.fillRect(16,y,w-32,5);g.fillStyle='#1d2a38';g.fillRect(w-90,14,70,40);g.fillStyle='#7fd0ff';g.font='16px "JetBrains Mono"';g.fillText('21.5°C',w-86,40);g.fillStyle='#2f6db3';g.fillRect(16,14,80,8);});
  const cracMat=std(0xffffff,{map:crac,roughness:.7,metalness:.2});for(const x of[HALL.x[0]+.45,HALL.x[1]-.45])for(const z of[-3.4,-.4,2.6,5.4]){if(x<0&&z<-5)continue;const m=add(I,new THREE.BoxGeometry(.9,2.1,1.7),[std(0xc7ced5),std(0xc7ced5),std(0xc7ced5),std(0xc7ced5),cracMat,cracMat],[x,1.05,z]);m.rotation.y=x<0?Math.PI/2:-Math.PI/2;}
  for(const x of[-5,-2,1,4])add(I,new THREE.BoxGeometry(1.2,2.1,.6),std(0xc7ced5,{roughness:.7}),[x,1.05,HALL.z[0]+.3]);
  for(const[x,z]of[[HALL.x[0]+.1,0.9],[HALL.x[1]-.1,-1.9]]){add(I,new THREE.CylinderGeometry(.08,.08,.5,12),std(0xc0262a,{roughness:.4}),[x,.5,z]);}
  // racks: instanced frames and faces (4 front, 2 rear variants); rack C06 gets its own faces with a gap for the 3D devices
  const fronts=[0,1,2,3].map(i=>rackFace(11+i,false)),rears=[0,1].map(i=>rackFace(41+i,true)),cFront=rackFace(77,false,[19,23]),cRear=rackFace(78,true,[19,25]);
  const faceMat=f=>std(0xffffff,{map:f.map,emissiveMap:f.emissiveMap,emissive:0xffffff,emissiveIntensity:1.3,roughness:.5,metalness:.3});
  const list=[];for(const[name,row]of Object.entries(HALL.rows))for(let i=0;i<14;i++)list.push({name,i,x:HALL.rackX(i),z:row.z,face:row.face,special:name==='C'&&i===5});
  this.racks=list;
  const frames=new THREE.InstancedMesh(rbox(.6,2,1.2,.012),std(0x1c2127,{metalness:.55,roughness:.42}),list.length);const d=new THREE.Object3D();
  list.forEach((r,k)=>{d.position.set(r.x,1,r.z);d.rotation.set(0,0,0);d.updateMatrix();frames.setMatrixAt(k,d.matrix);});I.add(frames);
  const faceGeo=new THREE.PlaneGeometry(.54,1.9);const groups=[...fronts.map(f=>({f,front:true,items:[]})),...rears.map(f=>({f,front:false,items:[]}))];
  list.forEach((r,k)=>{if(r.special)return;groups[k%4].items.push(r);groups[4+(k%2)].items.push(r);});
  for(const gr of groups){const m=new THREE.InstancedMesh(faceGeo,faceMat(gr.f),gr.items.length);gr.items.forEach((r,j)=>{const sgn=gr.front?r.face:-r.face;d.position.set(r.x,1.02,r.z+sgn*.602);d.rotation.set(0,sgn>0?0:Math.PI,0);d.updateMatrix();m.setMatrixAt(j,d.matrix);});I.add(m);}
  const C=ST.REDGE;add(I,faceGeo,faceMat(cFront),[C[0],1.02,C[2]+.602]);add(I,faceGeo,faceMat(cRear),[C[0],1.02,C[2]-.602],[0,Math.PI,0]);
  // overhead: wire baskets (copper), ladder trays (power), threaded rods; the yellow fibre duct
  const steel=std(0xa9b2bb,{metalness:.8,roughness:.35}),ladder=std(0x8a939c,{metalness:.7,roughness:.4});
  const wire=canvasTexture(128,64,(g,w,h)=>{g.clearRect(0,0,w,h);g.strokeStyle='#c9d1d8';g.lineWidth=3;for(let x=0;x<=w;x+=16){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}for(let y=0;y<=h;y+=16){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}});wire.wrapS=wire.wrapT=THREE.RepeatWrapping;wire.repeat.set(8.6/.12,1);
  const basketMat=new THREE.MeshStandardMaterial({map:wire,transparent:true,alphaTest:.3,side:THREE.DoubleSide,metalness:.7,roughness:.35});
  const rods=[];for(const row of Object.values(HALL.rows)){
   const z=row.z;add(I,new THREE.PlaneGeometry(8.6,.3),basketMat,[0,2.3,z],[-Math.PI/2,0,0]);for(const dz of[-.15,.15])add(I,new THREE.PlaneGeometry(8.6,.08),basketMat,[0,2.34,z+dz]);
   add(I,new THREE.BoxGeometry(8.4,.05,.18),std([0x2f6fc4,0x3a4048,0x2f6fc4,0x6a7480][Math.round((z+4.2)/2.4)%4],{roughness:.7}),[0,2.33,z]);
   for(const dz of[-.2,.2])add(I,new THREE.BoxGeometry(8.6,.05,.025),ladder,[0,2.85,z+dz]);for(let x=-4.2;x<=4.21;x+=.3)rods.push({x,y:2.85,z,kind:'rung'});
   for(let x=-4.2;x<=4.21;x+=1.5)for(const dz of[-.24,.24])rods.push({x,z:z+dz,kind:'rod'});
  }
  const rungs=new THREE.InstancedMesh(new THREE.BoxGeometry(.025,.02,.4),ladder,rods.filter(r=>r.kind==='rung').length),rodM=new THREE.InstancedMesh(new THREE.CylinderGeometry(.006,.006,1.4,6),steel,rods.filter(r=>r.kind==='rod').length);let a=0,b=0;
  for(const r of rods){if(r.kind==='rung'){d.position.set(r.x,r.y,r.z);d.rotation.set(0,0,0);d.updateMatrix();rungs.setMatrixAt(a++,d.matrix);}else{d.position.set(r.x,2.9,r.z);d.updateMatrix();rodM.setMatrixAt(b++,d.matrix);}}I.add(rungs,rodM);
  const yellow=std(0xf0c12c,{roughness:.45,metalness:.05});this.ductMat=yellow;
  const duct=(x0,x1,z0,z1)=>{const L=Math.hypot(x1-x0,z1-z0),g=new THREE.Group();g.position.set((x0+x1)/2,ST.DUCT_Y,(z0+z1)/2);g.rotation.y=-Math.atan2(z1-z0,x1-x0);I.add(g);add(g,new THREE.BoxGeometry(L,.012,.2),yellow,[0,-.05,0]);for(const dz of[-.1,.1])add(g,new THREE.BoxGeometry(L,.1,.012),yellow,[0,0,dz]);};
  duct(-7.05,4.0,1.4,1.4);duct(3.9,3.9,1.5,-3.4);add(I,new THREE.BoxGeometry(.2,1.1,.2),yellow,[ST.CLIENT_RISER[0]+.1,3.05,1.4]);add(I,new THREE.BoxGeometry(.2,1.1,.2),yellow,[ST.ADMIN_RISER[0]-.1,3.05,-3.3]);
  const cable=(pts,color,r)=>{const c=new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p)),false,'centripetal');const m=new THREE.Mesh(new THREE.TubeGeometry(c,Math.max(16,pts.length*14),r,6,false),std(color,{roughness:.45}));I.add(m);return m;};
  cable([[-1.05,2.5,1.4],[-1.05,1.8,1.32],[-1.05,1.2,1.27],[-1.05,1.05,1.245]],0x2f7fd8,.004);cable([[-.75,1.05,1.245],[-.75,1.25,1.3],[-.75,2.0,1.36],[-.75,2.5,1.4]],0xf2c12e,.003);
  cable([[3.9,2.5,-3.3],[3.9,2.1,-3.45],[3.9,1.6,-3.625]],0xf2c12e,.003);cable([[3.9,1.6,-3.625],[3.6,1.45,-3.66],[3.3,1.25,-3.625]],0xf2c12e,.003);
  // R-EDGE (C06): router front with ports and link LEDs, rear with CON port; console server and OOB switch at the rear
  const chassis=std(0x2b3138,{metalness:.6,roughness:.4}),dark=std(0x0d0f12,{roughness:.8});
  add(I,rbox(.48,.088,.5,.006),chassis,[C[0],1.06,C[2]+.34]);add(I,new THREE.BoxGeometry(.016,.013,.01),dark,[ST.GI0[0],1.05,1.24]);add(I,new THREE.BoxGeometry(.014,.009,.01),std(0x9aa3ac,{metalness:.8}),[ST.GI1[0],1.05,1.24]);
  const panel=canvasTexture(512,96,(g,w,h)=>{g.fillStyle='#2b3138';g.fillRect(0,0,w,h);g.font='600 22px "Space Grotesk"';g.fillStyle='#d6dde4';g.fillText('R-EDGE',20,34);g.font='16px "JetBrains Mono"';g.fillStyle='#9aa6b2';g.fillText('Gi0/0/0',62,82);g.fillText('Gi0/0/1',382,82);g.fillText('IOS XE',20,70);});
  add(I,new THREE.PlaneGeometry(.48,.088),std(0xffffff,{map:panel,roughness:.5}),[C[0],1.06,1.236]);
  this.led0=add(I,new THREE.BoxGeometry(.006,.004,.004),glow(P.ok,1.6),[ST.GI0[0],1.065,1.243]);this.led1=add(I,new THREE.BoxGeometry(.006,.004,.004),glow(P.red,.6),[ST.GI1[0],1.065,1.243]);
  this.flapTag=label(I,'Gi0/0/1 · administratively down','shutdown durch CHG-2088',[ST.GI1[0]+.25,1.42,1.32],.9,'#ff9a90');
  add(I,rbox(.48,.088,.06,.006),chassis,[C[0],1.06,.03]);const rearPanel=canvasTexture(512,96,(g,w,h)=>{g.fillStyle='#2b3138';g.fillRect(0,0,w,h);g.fillStyle='#3a4250';g.fillRect(16,14,150,68);g.fillStyle='#0d0f12';g.fillRect(452,30,30,26);g.strokeStyle='#5fa8e8';g.lineWidth=3;g.strokeRect(448,26,38,34);g.font='600 16px "JetBrains Mono"';g.fillStyle='#8fc8f0';g.fillText('CON',448,82);g.fillStyle='#9aa6b2';g.fillText('R-EDGE · rear',220,40);g.fillText('PSU',70,52);});
  add(I,new THREE.PlaneGeometry(.48,.088),std(0xffffff,{map:rearPanel,roughness:.5}),[C[0],1.06,-.002],[0,Math.PI,0]);
  const devPanel=(title,ports,hi,lan)=>canvasTexture(512,48,(g,w,h)=>{g.fillStyle='#22272d';g.fillRect(0,0,w,h);g.font='600 13px "JetBrains Mono"';g.fillStyle='#9aa6b2';g.fillText(title,lan?70:10,30);if(lan){g.fillStyle='#0d0f12';g.fillRect(26,12,28,24);g.strokeStyle='#2fd0e8';g.lineWidth=3;g.strokeRect(24,10,32,28);g.font='11px "JetBrains Mono"';g.fillStyle='#7f8a96';g.fillText('LAN',28,46);}for(let i=0;i<ports;i++){const x=470-i*48;g.fillStyle='#0d0f12';g.fillRect(x-14,12,28,24);if(hi.includes(i+1)){g.strokeStyle=hi[0]===i+1?'#2fd0e8':'#8cc8f2';g.lineWidth=3;g.strokeRect(x-16,10,32,28);}g.fillStyle='#7f8a96';g.font='11px "JetBrains Mono"';g.fillText(String(i+1),x-3,46);}});
  add(I,rbox(.48,.044,.3,.004),chassis,[C[0],1.31,.16]);add(I,new THREE.PlaneGeometry(.48,.044),std(0xffffff,{map:devPanel('CONSOLE 10.99.0.20',8,[7],true),roughness:.5}),[C[0],1.31,-.002],[0,Math.PI,0]);
  add(I,rbox(.48,.044,.25,.004),chassis,[C[0],1.4,.13]);add(I,new THREE.PlaneGeometry(.48,.044),std(0xffffff,{map:devPanel('OOB-SW',8,[8,7]),roughness:.5}),[C[0],1.4,-.002],[0,Math.PI,0]);
  this.chLed=add(I,new THREE.BoxGeometry(.006,.004,.004),glow(P.mgmt,1),[ST.CONS7[0],1.325,-.006]);
  this.oob=cable(PATH.mgmt,0x22c8e6,.0045);this.con=cable(PATH.serial,0x8cc8f2,.0042);
  this.tag=label(I,'OOB · CON-07','vorher gebaut, beschriftet',[-.95,1.55,-.18],.55,'#9feaff');
  this.oobLabels=[label(I,'Console-Server 10.99.0.20','Kanal 7 → R-EDGE CON',[-.9,1.72,-.1],.75,'#9feaff'),label(I,'Laptop 10.99.0.10','Managementstation · OOB-Netz',[-.55,.95,-.55],.6,'#9feaff')];
  // the engineer: schematic figure on the floor, laptop on the knees, phone beside him
  this.eng=this.buildEngineer(I);
  this.phone=new THREE.Group();this.phone.position.set(...ST.PHONE);this.phone.rotation.y=.5;I.add(this.phone);add(this.phone,rbox(.075,.009,.155,.004),std(0x2b3138,{metalness:.5,roughness:.35}),[0,.004,0]);add(this.phone,new THREE.PlaneGeometry(.066,.14),std(0x05080c,{roughness:.2,metalness:.6}),[0,.0095,0],[-Math.PI/2,0,0]);
  // neighbour and service racks, NOC display, risers
  this.nbrLed=add(I,new THREE.BoxGeometry(.01,.008,.004),glow(P.red,.4),[ST.NBR_PORT[0]+.04,1.62,-3.598]);this.srvLed=add(I,new THREE.BoxGeometry(.01,.008,.004),glow(P.ok,.6),[ST.SRV_PORT[0]+.05,1.27,-3.598]);
  label(I,'Nachbar 10.0.12.2','Rack A14 · Next Hop',[3.9,2.15,-3.45],.75,'#e6f2fa');label(I,'198.51.100.20:443','Rack A13 · app.example',[3.3,1.9,-3.4],.75,'#e6f2fa');label(I,'R-EDGE · Rack C06','Gi0/0/0 Client · Gi0/0/1 Uplink',[C[0],2.16,1.3],.8,'#e6f2fa');
  label(I,'Client-Netz 192.0.2.0/24','Client 192.0.2.10',[ST.CLIENT_RISER[0]+.5,2.2,1.4],.8,'#e6f2fa');label(I,'prod-client 198.51.100.10','hinter dem Uplink',[ST.ADMIN_RISER[0]-.5,2.2,-3.3],.8,'#e6f2fa');
  this.noc=dynamicTexture(1600,900);add(I,new THREE.BoxGeometry(3.36,1.96,.06),std(0x15191e,{metalness:.5}),[ST.NOC[0],ST.NOC[2]>0?ST.NOC[1]:0,ST.NOC[2]+.04]);add(I,new THREE.PlaneGeometry(3.2,1.8),new THREE.MeshBasicMaterial({map:this.noc.tex,toneMapped:false}),ST.NOC,[0,Math.PI,0]);
  // outside (outro only): the building in the sleeping city
  this.outside=new THREE.Group();s.add(this.outside);this.buildWorld(this.outside,fronts);
  // carriers
  this.syn=instanced(s,new THREE.SphereGeometry(.035,10,8),glow(0xffffff),12);this.mg=instanced(s,new THREE.SphereGeometry(.014,8,6),glow(0xffffff),12);this.pkt=instanced(s,new THREE.SphereGeometry(.02,10,8),glow(0xffffff),48);
  this.big=instanced(s,new THREE.SphereGeometry(.05,12,10),glow(0xffffff),4);this.dots=instanced(s,new THREE.SphereGeometry(.006,6,4),glow(0xffffff),40);this.bits=instanced(s,new THREE.SphereGeometry(.012,6,4),additive(0xffffff),30);
  this.tags=Array.from({length:2},()=>label(s,'','',[0,0,0],.8,'#e6f6ff'));
  this.screen=dynamicTexture(512,320);this.screenMesh.material.map=this.screen.tex;this.screenMesh.material.needsUpdate=true;
 }
 buildEngineer(I){
  const g=new THREE.Group();g.position.set(...ST.ENG);I.add(g);const skin=std(0xdfe4ea,{roughness:.75}),shirt=std(0x2c5a9a,{roughness:.8}),pants=std(0x3a4049,{roughness:.85}),shoe=std(0x1d2126,{roughness:.6});
  const limb=(parent,a,b,r,m)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),len=A.distanceTo(B);const mesh=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.001,len),6,12),m);mesh.position.copy(A).add(B).multiplyScalar(.5);mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),B.clone().sub(A).normalize());parent.add(mesh);return mesh;};
  this.torso=new THREE.Group();g.add(this.torso);limb(this.torso,[0,.16,-.1],[0,.5,-.16],.15,shirt);limb(this.torso,[-.17,.55,-.15],[.17,.55,-.15],.07,shirt);
  this.head=add(this.torso,new THREE.SphereGeometry(.105,20,16),skin,[0,.74,-.13]);limb(this.torso,[0,.6,-.15],[0,.67,-.14],.045,skin);
  for(const sx of[-1,1]){limb(g,[sx*.1,.12,-.06],[sx*.13,.33,.36],.07,pants);limb(g,[sx*.13,.33,.36],[sx*.14,.06,.58],.06,pants);add(g,rbox(.1,.07,.22,.03),shoe,[sx*.14,.04,.63]);}
  // laptop on the thighs, hinge at the far edge, screen facing him; the frame (origin, tilt) also places the hands
  const LO=[0,.375,.28],LT=-.35,toEng=(x,y,z)=>[x,LO[1]+y*Math.cos(LT)-z*Math.sin(LT),LO[2]+y*Math.sin(LT)+z*Math.cos(LT)];
  const lap=new THREE.Group();lap.position.set(...LO);lap.rotation.x=LT;g.add(lap);const alu=std(0x8e98a3,{metalness:.7,roughness:.35});
  add(lap,rbox(.34,.018,.24,.004),alu,[0,0,0]);add(lap,new THREE.PlaneGeometry(.29,.11),std(0x1c2026,{roughness:.8}),[0,.0095,.035],[-Math.PI/2,0,0]);add(lap,new THREE.PlaneGeometry(.1,.06),std(0x7f8994,{roughness:.5,metalness:.5}),[0,.0095,-.075],[-Math.PI/2,0,0]);
  const lid=new THREE.Group();lid.position.set(0,.009,.12);lid.rotation.x=.3;lap.add(lid);add(lid,rbox(.34,.22,.012,.004),alu,[0,.11,.006]);
  this.screenMesh=add(lid,new THREE.PlaneGeometry(.31,.19),new THREE.MeshBasicMaterial({toneMapped:false}),[0,.112,-.0005],[0,Math.PI,0]);
  this.screenLight=new THREE.PointLight(0x9fdcff,.35,1.4,1.5);this.screenLight.position.set(0,.12,-.12);lid.add(this.screenLight);
  // arms: shoulder → elbow → wrist; the hands lie on the keyboard (just above its surface, never inside)
  this.arms=[];for(const sx of[-1,1]){const S=[sx*.2,.55,-.15],E=[sx*.25,.33,.06],H=toEng(sx*.075,.042,.02),Wr=toEng(sx*.08,.04,-.025);
   limb(this.torso,S,E,.05,shirt);const fore=new THREE.Group();fore.position.set(...E);g.add(fore);const rel=v=>v.map((c,i)=>c-E[i]);
   limb(fore,[0,0,0],rel(Wr),.04,skin);const hand=add(fore,new THREE.SphereGeometry(1,14,10),skin,rel(H));hand.scale.set(.034,.018,.05);hand.rotation.x=LT;fore.userData.y=E[1];this.arms.push(fore);}
  return g;
 }
 // The large scale around the hall: the data-centre level with four halls (ours is hall 2 at the origin), six schematic
 // office floors above it, glass facade, roof plant, and the sleeping city. Seen in the zooms and the overflights.
 buildWorld(O,faces){
  const B=BUILDING;this.world=O;
  add(O,new THREE.BoxGeometry(B.w,.3,B.d),std(0x56606c,{roughness:.8}),[B.cx,-.16,B.cz]);
  const cor=canvasTexture(128,128,(g,w,h)=>{g.fillStyle='#6b7682';g.fillRect(0,0,w,h);g.strokeStyle='#59636e';g.lineWidth=2;g.strokeRect(0,0,w,h);});cor.wrapS=cor.wrapT=THREE.RepeatWrapping;cor.repeat.set(B.w/1.2,B.d/1.2);
  add(O,new THREE.PlaneGeometry(B.w,B.d),std(0xffffff,{map:cor,roughness:.8}),[B.cx,-.005,B.cz],[-Math.PI/2,0,0]);
  // the three other halls: floor, low walls, light bands, rack rows (instanced), their own fibre duct
  const tile=tileTex(false);tile.wrapS=tile.wrapT=THREE.RepeatWrapping;tile.repeat.set(24,22);const tileMat=std(0xffffff,{map:tile,roughness:.55}),wallM=std(0xcdd4db,{roughness:.85,side:THREE.DoubleSide});
  const frameGeo=rbox(.6,2,1.2,.012),faceGeo=new THREE.PlaneGeometry(.54,1.9),frameMat=std(0x1c2127,{metalness:.55,roughness:.42}),d=new THREE.Object3D();
  this.halls=[];HALLS.forEach((h,k)=>{if(h.ours)return;const g=new THREE.Group();g.position.set(h.x,0,h.z);O.add(g);
   add(g,new THREE.PlaneGeometry(14.4,13.4),tileMat,[0,0,.1],[-Math.PI/2,0,0]);for(const[w,pos,ry]of[[14.4,[0,1.8,-6.6],0],[14.4,[0,1.8,6.8],Math.PI],[13.4,[-7.2,1.8,.1],Math.PI/2],[13.4,[7.2,1.8,.1],-Math.PI/2]])add(g,new THREE.PlaneGeometry(w,3.6),wallM,pos,[0,ry,0]);
   const fr=new THREE.InstancedMesh(frameGeo,frameMat,56),fc=new THREE.InstancedMesh(faceGeo,std(0xffffff,{map:faces[(k+1)%4].map,emissiveMap:faces[(k+1)%4].emissiveMap,emissive:0xffffff,emissiveIntensity:1.3}),56);let n=0;
   for(const row of Object.values(HALL.rows))for(let i=0;i<14;i++){d.position.set(HALL.rackX(i),1,row.z);d.rotation.set(0,0,0);d.updateMatrix();fr.setMatrixAt(n,d.matrix);d.position.set(HALL.rackX(i),1.02,row.z+row.face*.602);d.rotation.set(0,row.face>0?0:Math.PI,0);d.updateMatrix();fc.setMatrixAt(n++,d.matrix);}
   g.add(fr,fc);for(const z of[HALL.aisles.cold1,HALL.aisles.hot,HALL.aisles.cold2])add(g,new THREE.BoxGeometry(12.4,.03,.16),this.lampMat,[0,3.55,z]);
   add(g,new THREE.BoxGeometry(11,.1,.2),std(0xf0c12c,{roughness:.45}),[-1.5,2.55,1.4]);this.halls.push(g);});
  this.hallLabels=HALLS.map((h,k)=>label(O,`Rechenzentrum ${k+1}`,h.ours?'R-EDGE · Rack C06':'Produktion',[h.x,4.6,h.z-6],3.6,h.ours?'#9feaff':'#e6f2fa'));
  // schematic floors above, the core, the glass facade with its mullions, the roof with plant
  this.upper=new THREE.Group();O.add(this.upper);const slabMat=new THREE.MeshStandardMaterial({color:0x7f96b0,transparent:true,opacity:.11,depthWrite:false,roughness:.6}),edge=new THREE.LineBasicMaterial({color:0x7fc8ff,transparent:true,opacity:.75});
  const slabGeo=new THREE.BoxGeometry(B.w,.25,B.d),slabEdges=new THREE.EdgesGeometry(slabGeo),deskList=[];
  B.floors.forEach((y,k)=>{add(this.upper,slabGeo,slabMat,[B.cx,y,B.cz]);const e=new THREE.LineSegments(slabEdges,edge);e.position.set(B.cx,y,B.cz);this.upper.add(e);
   const kind=k%3;for(let i=0;i<10;i++)for(let j=0;j<6;j++){if(kind===1&&j>2)continue;deskList.push([B.cx-15+i*3.2,y+.5,B.cz-12+j*4.6+(kind===2?1.5:0),kind]);}});
  const desks=new THREE.InstancedMesh(new THREE.BoxGeometry(1.6,.75,.8),new THREE.MeshStandardMaterial({color:0x8fa6bf,roughness:.7,transparent:true,opacity:.26,depthWrite:false}),deskList.length),mons=new THREE.InstancedMesh(new THREE.BoxGeometry(.6,.36,.03),glow(0x9fd8ff,.6),deskList.length);
  deskList.forEach(([x,y,z],i)=>{d.position.set(x,y-.12,z);d.rotation.set(0,0,0);d.scale.set(1,1,1);d.updateMatrix();desks.setMatrixAt(i,d.matrix);d.position.set(x,y+.42,z-.2);d.scale.setScalar(random(i*7)<.35?1:.001);d.updateMatrix();mons.setMatrixAt(i,d.matrix);});this.upper.add(desks,mons);
  const coreGeo=new THREE.BoxGeometry(5,B.roof,5),core=add(this.upper,coreGeo,new THREE.MeshStandardMaterial({color:0x6f8296,transparent:true,opacity:.22,depthWrite:false}),[B.cx,B.roof/2,B.cz]);const ce=new THREE.LineSegments(new THREE.EdgesGeometry(coreGeo),edge);ce.position.copy(core.position);this.upper.add(ce);
  const glass=new THREE.MeshStandardMaterial({color:0x5f8fc0,transparent:true,opacity:.1,depthWrite:false,side:THREE.DoubleSide,roughness:.1,metalness:.6}),mull=[];
  for(const[w,cx,cz,ry]of[[B.w,B.cx,B.cz-B.d/2,0],[B.w,B.cx,B.cz+B.d/2,0],[B.d,B.cx-B.w/2,B.cz,Math.PI/2],[B.d,B.cx+B.w/2,B.cz,Math.PI/2]]){add(this.upper,new THREE.PlaneGeometry(w,B.roof),glass,[cx,B.roof/2,cz],[0,ry,0]);
   const dx=Math.cos(ry),dz=-Math.sin(ry);for(let s=-w/2;s<=w/2+.01;s+=3)mull.push(cx+dx*s,0,cz+dz*s,cx+dx*s,B.roof,cz+dz*s);for(const y of[0,...B.floors,B.roof])mull.push(cx-dx*w/2,y,cz-dz*w/2,cx+dx*w/2,y,cz+dz*w/2);}
  this.upper.add(new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(mull,3)),new THREE.LineBasicMaterial({color:0x6fb8f0,transparent:true,opacity:.45})));
  add(this.upper,new THREE.BoxGeometry(B.w,.4,B.d),new THREE.MeshStandardMaterial({color:0x3a4654,transparent:true,opacity:.55,depthWrite:false}),[B.cx,B.roof,B.cz]);for(let i=0;i<8;i++)add(this.upper,new THREE.BoxGeometry(3,1.8,3),std(0x7a8592,{metalness:.5}),[B.cx-14+i*4,B.roof+1.1,B.cz+10]);
  label(this.upper,'Bürogebäude · 6 Etagen','Rechenzentrumsebene im Erdgeschoss',[B.cx,B.roof+5,B.cz-B.d/2],10,'#cfe6f2');
  // the sleeping city around it
  const win=canvasTexture(64,128,(g,w,h)=>{g.fillStyle='#05080d';g.fillRect(0,0,w,h);for(let y=6;y<h;y+=12)for(let x=6;x<w;x+=12){const r=random(x*31+y*7);g.fillStyle=r<.18?'#ffcf8a':r<.24?'#9fd0ff':'#0b1018';g.fillRect(x,y,6,7);}});win.wrapS=win.wrapT=THREE.RepeatWrapping;win.repeat.set(2,4);
  this.city=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({map:win,color:0xc0c8d8}),520);let n=0;
  for(let i=0;i<1200&&n<520;i++){const a=random(i*3)*Math.PI*2,r=40+random(i*5)*200,h=6+random(i*7)**2*55;d.position.set(B.cx+Math.cos(a)*r,h/2,B.cz+Math.sin(a)*r);d.rotation.set(0,0,0);d.scale.set(6+random(i*11)*10,h,6+random(i*13)*10);d.updateMatrix();this.city.setMatrixAt(n++,d.matrix);}
  this.city.count=n;O.add(this.city);this.ground=add(O,new THREE.PlaneGeometry(800,800),std(0x0a0f16,{roughness:.95}),[B.cx,-.32,B.cz],[-Math.PI/2,0,0]);
 }
 update(t,a,tl,shot){
  const w=warm(t),beat=tl.attack(t),pr=proofs(t),m=shot.mode,zoom=m.startsWith('zoom'),fly=m.startsWith('fly')||m==='top',out=zoom,top=zoom||fly;
  this.outside.visible=zoom||fly;this.upper.visible=zoom||m==='fly_dc';this.city.visible=zoom;this.ground.visible=zoom;this.ceiling.visible=!top;this.lamps.visible=!top;this.hallLabels.forEach(l=>l.userData.alpha=m==='fly_dc'||zoom?1:0);
  this.scene.fog.color.setHex(out?0x0a121c:0xb7c6d6);this.scene.fog.density=out?.0022:top?.008:.022;this.hemi.intensity=out?1.15:2.1+.15*w;this.hemi.color.setHex(new THREE.Color(0xe4eeff).lerp(new THREE.Color(0xfff1dc),.35*w).getHex());
  setGlow(this.led1.material,t<T.linkUp?P.red:P.ok,t<T.linkUp?.25:t<T.lineUp?(Math.floor(t*6)%2?1.6:.3):1.8);this.flapTag.userData.alpha=t<T.noShut?1:1-smooth(T.noShut,T.noShut+.8,t);
  this.ductMat.emissive.setHex(0xffb44a);this.ductMat.emissiveIntensity=t<T.linkUp?0:.06+.14*w;
  const act=serialActivity(t);setGlow(this.chLed.material,P.mgmt,t>=T.picocom?.8+1.4*act:.2);setGlow(this.srvLed.material,P.ok,t>=T.po1Srv?1.6:.5);
  // the engineer breathes; he types while the console is busy
  const typing=t>=T.mgmtSsh&&act>.3;this.torso.scale.setScalar(1+.008*Math.sin(t*1.7));this.arms.forEach((f,i)=>{f.position.y=f.userData.y+(typing?.003*(1+Math.sin(t*22+i*2.1)):0);});this.screenLight.intensity=.25+.15*act;
  // carriers
  this.syn.begin();this.mg.begin();this.pkt.begin();this.big.begin();this.dots.begin();this.bits.begin();const tags=[];let nbrFlash=0;
  for(const f of activeFlights(t)){const p=V(pointAt(f,t));
   if(t>f.t1){if(f.fate==='drop'){const d=t-f.t1;nbrFlash=Math.max(nbrFlash,1-d);for(let i=0;i<10;i++)this.bits.push(p.clone().add(new THREE.Vector3((random(i+f.t0)-.5)*.4*d,.15*d,(random(i*3+f.t0)-.5)*.4*d)),P.red,1,null,1.6*(1-d));}continue;}
   if(f.kind==='syn')this.syn.push(p,0xd8e8ff,1,null,1.5);else if(f.kind==='mgmt')this.mg.push(p,P.mgmt,1,null,1.8);else if(f.kind==='traffic')this.pkt.push(p,P.warm,1,null,1.3);else{this.big.push(p,f.kind==='resp'?P.ok:P.white,1,null,1.8);tags.push({p,f});}}
  if(act>0)for(let i=0;i<40;i++){if(random(i*17)>act+.08)continue;this.dots.push(V(along(PATH.serial,(t*.7+i/40)%1)),P.mgmt,1,null,1.8);}
  this.syn.end();this.mg.end();this.pkt.end();this.big.end();this.dots.end();this.bits.end();setGlow(this.nbrLed.material,P.red,.4+2*nbrFlash);
  this.tags.forEach((tag,i)=>{const x=tags[i];tag.userData.alpha=x?1:0;if(x){tag.position.copy(x.p).add(new THREE.Vector3(0,-.18,0));tag.material.map=cachedTexture(x.f.label,`${x.f.src} → ${x.f.dst}`,x.f.kind==='resp'?'#bff5d8':'#ffffff');}});
  // screens: laptop terminal and NOC display
  const lines=this.consoleLines(t);this.screen.set(JSON.stringify([lines,Math.floor(t*1.6)%2]),g=>{g.fillStyle='#061018';g.fillRect(0,0,512,320);g.fillStyle='#0d2030';g.fillRect(0,0,512,26);g.font='14px "JetBrains Mono"';g.fillStyle='#7fb8d0';g.fillText(t<T.picocom?'management 10.99.0.10':'picocom /dev/ttyUSB7 · R-EDGE',10,18);
   lines.slice(-9).forEach(([s,c],i)=>{g.font='15px "JetBrains Mono"';g.fillStyle=c;g.fillText(s.length>52?s.slice(0,52)+'…':s,10,52+i*29);});});
  const okP=t>=T.po1Ok;this.noc.set(JSON.stringify([okP,link(t),route(t),pr,t>=T.po2Ok]),g=>{g.fillStyle='#0b1622';g.fillRect(0,0,1600,900);g.fillStyle=okP?'#2f7a58':'#7a2f36';g.fillRect(0,0,1600,16);g.font='600 56px "Space Grotesk"';g.fillStyle='#e6f2fa';g.fillText('NOC · app.example',50,100);
   g.font='40px "JetBrains Mono"';g.fillStyle=okP?'#8fe3b8':'#ffd27a';g.fillText(okP?'Health ok · Werte laufen wieder':'letzter erfolgreicher Abruf: vor CHG-2088',50,190);
   for(let i=0;i<34;i++){const h=60+120*random(i*5),on=okP||i<12;g.fillStyle=on?'#3a7ab8':'#22313f';g.fillRect(50+i*44,560-(on?h:8),30,on?h:8);}
   [['LINK',pr.link,`Gi0/0/1 ${t<T.noShut?'admin down':link(t)}`],['ROUTE',pr.route,route(t)==='installiert'?'via 10.0.12.2 installiert':'nicht nutzbar'],['SERVICE',pr.service,pr.service?(t>=T.po2Ok?'P-O1 + P-O2 HTTP 200':'P-O1 HTTP 200'):'ausstehend']].forEach(([k,on,sub],i)=>{const x=50+i*510;g.fillStyle=on?'#1f5a40':'#1a2633';g.fillRect(x,620,480,200);g.font='600 60px "Space Grotesk"';g.fillStyle=on?'#8fe3b8':'#6a8394';g.fillText(k,x+30,705);g.font='30px "JetBrains Mono"';g.fillStyle=on?'#cdeedd':'#7f97a8';g.fillText(sub,x+30,775);});
   g.font='26px "JetBrains Mono"';g.fillStyle='#5f7484';g.fillText('Szenario / simulierte Werte',50,870);});
 }
 consoleLines(t){const C={cmd:'#f3d48a',ok:'#8fe3b8',bad:'#ff8b80',ov:'#9fb8c8',amber:'#ffd27a'};if(t<T.mgmtSsh)return[['management$ _','#9feaff']];const out=[];
  for(const id of['B02','B03','B04','B05','B07']){const b=BLOCKS[id];if(t<b.win[0])continue;if(t>=b.win[1]&&id!=='B02')continue;for(const l of blockLines(id,Math.min(t,b.win[1]-.01)))if(l.kind!=='ov')out.push([l.text,C[l.kind]||'#d8e7ef']);}
  if(!out.length||t>=90.08&&t<T.showRun)out.push(['R-EDGE# _','#8fe3b8']);return out;}
 follow(shot,t){const id={S037:'P-O1',S053:'P-O2',S054:'P-O2R'}[shot.id];if(!id)return null;const f=BY_ID.get(id);return f&&t>=f.t0-.3&&t<=f.t1+.3?f:null;}
 camera(shot,t){const c=this.camera_(shot,t),behind=c.pos.z<0&&c.pos.z>-1.25&&c.pos.x>-5;for(const l of this.oobLabels)l.userData.alpha=behind?1:0;this.tag.userData.alpha=shot.mode==='label'?1:0;return c;}
 camera_(shot,t){
  const u=smooth(shot.start,shot.end,t),look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov}),m=shot.mode,E=ENG_HEAD,L=[ST.LAPTOP[0],ST.LAPTOP[1]+.05,ST.LAPTOP[2]];
  if(curves[m]){const cv=curves[m],e=ease(u),p=cv.getPointAt(e),ahead=cv.getPointAt(Math.min(1,e+.22)).add(new THREE.Vector3(0,-.05,0));if(ahead.distanceTo(p)<.3)ahead.copy(p).add(cv.getTangentAt(Math.min(1,e)).multiplyScalar(1.5));const tgt=new THREE.Vector3(...(m==='open'?[-.9,1.15,1.2]:E));
   const away=m.startsWith('away'),wgt=m==='cold1'?0:m==='away_low'?1:away?1-smooth(.15,.45,u):smooth(.62,.95,u);if(wgt>=1-1e-6&&ahead.distanceTo(p)<1e-4)ahead.copy(tgt);return look(p,ahead.lerp(tgt,wgt),away||m==='away_low'?52:50);}
  const f=this.follow(shot,t);if(f){// the camera stays in an aisle: behind the carrier along x, on the nearest aisle centreline in z
   const tt=clamp(t,f.t0,f.t1),p=V(pointAt(f,tt)),q=V(pointAt(f,Math.min(f.t1,tt+.08))),h=q.sub(p);h.y=0;if(h.lengthSq()<1e-8)h.set(1,0,0);h.normalize();
   const zs=[-3,-.6,1.8,5],z=zs.reduce((b,v)=>Math.abs(v-p.z)<Math.abs(b-p.z)?v:b);let x=p.x-h.x*1.8;if(Math.abs(h.z)>.7)x=Math.abs(p.x)>4?p.x+1.2*Math.sign(p.x):p.x-1.6;
   return look([x,1.75,Math.abs(h.z)>.7?p.z-h.z*1.6:z],[p.x+h.x*.6,p.y,p.z+h.z*.6],52);}
  switch(shot.camera){
   case'front':switch(m){case'port':return look([lerp(-.45,-.6,u),1.24,lerp(2.0,1.85,u)],[-.88,1.07,1.22],34);case'sfp':return look([lerp(-.5,-.58,u),1.16,lerp(1.62,1.55,u)],[ST.GI1[0]-.04,1.06,1.23],32);
    case'link':{const up=smooth(.35,.9,u);return look([-.35,lerp(1.3,1.45,up),lerp(1.95,2.05,u)],[lerp(-.8,1.2,up),lerp(1.06,2.4,up),lerp(1.23,1.4,up)],lerp(34,48,up));}
    default:return look([lerp(-3.8,-2.6,u),1.6,2.25],[lerp(.4,1.2,u),1.5,.9],52);}
   case'back':switch(m){case'reveal':return look([lerp(-1.75,-1.55,u),1.5,-1.0],[-.95,1.28,0],42);case'gap':return look([lerp(.5,.3,u),1.35,-1.05],[-.9,1.75,.4],52);case'both':return look([lerp(-3.1,-2.7,u),.65,-1.0],[-.9,1.55,.4],56);case'label':return look([-.72,1.4,-.32],[-.92,1.52,-.16],30);default:return look([-1.6,1.5,-1],[-.9,1.3,0],44);}
   case'console':switch(m){case'ports':return look([lerp(-.55,-.68,u),1.42,-.46],[-.88,1.3,-.02],32);case'ch7':return look([-.72,1.36,-.32],[ST.CONS7[0],1.3,-.03],28);case'con':return look([lerp(-.9,-.98,u),1.17,-.42],[ST.CONPORT[0]+.03,1.08,-.03],32);
    default:{const p=V(along(PATH.serial,.15+.7*u));return look(p.clone().add(new THREE.Vector3(.12,.08,-.28)),p,30);}}
   case'engineer':switch(m){case'typing':return look([lerp(-.5,-.58,u),1.06,-1.1],[-.9,.5,-.32],40);case'hook':return look([lerp(.9,.7,u),1.25,-.95],[-.9,.75,-.45],44);case'low':return look([lerp(1.7,1.4,u),.35,-.72],[-.9,.95,-.35],52);
    case'phone':return look([ST.PHONE[0]+.22,.32,ST.PHONE[2]-.32],ST.PHONE,34);case'final':return look([lerp(1.9,.25,u),lerp(1.45,.95,u),lerp(-.6,-.66,u)],[-.9,lerp(.85,.7,u),-.4],lerp(48,40,u));default:return look([.6,1.2,-.9],E,44);}
   case'noc':return look([lerp(-.4,.3,u),1.75,4.05],[0,m==='tiles'?1.95:2.2,ST.NOC[2]],m==='tiles'?50:44);
   case'service':switch(m){case'nbr':return look([lerp(2.5,2.7,u),1.62,-2.5],[3.9,1.5,-3.6],44);case'server':return look([lerp(2.35,2.55,u),1.5,-2.55],[3.3,1.3,-3.6],42);case'row':return look([lerp(-3.4,2.6,u),1.6,-2.85],[lerp(-2.2,3.8,u),1.2,-3.6],50);default:return look([2.2,1.7,-2.4],[3.6,1.5,-3.6],46);}
   case'fly':switch(m){
    case'zoom_in':return keyed(ZOOM_IN,t);case'zoom_out':return keyed(ZOOM_OUT,t);
    case'fly_hall':return look([lerp(-7.5,7,u),lerp(6.6,6,u),lerp(9.5,7,u)],[lerp(-3,3,u),0,lerp(.4,-1,u)],56);
    case'fly_duct':return look([lerp(-6.4,3.2,u),4.5,3.4],[lerp(-4.4,5.2,u),2.2,.5],54);
    case'fly_duct_warm':return look([lerp(3.8,-.4,u),4.3,3.1],[lerp(1.8,-2.4,u),2.2,.6],54);
    case'fly_dc':return look([lerp(1.5,10,u),lerp(4.8,13.5,u),lerp(-1,25,u)],[lerp(0,9,u),0,lerp(0,9,u)],lerp(56,62,u));
    case'fly_hot':return look([lerp(4.4,.2,u),lerp(5.4,2.6,u),-.6],[lerp(1.6,-.9,u),.3,-.62],52);
    default:return look([lerp(-1,1,u),lerp(10.5,11.5,u),lerp(3.2,2.2,u)],[0,0,-.8],52);}
   default:return look([0,1.6,4.5],[0,1.2,0],50);
  }
 }
}
