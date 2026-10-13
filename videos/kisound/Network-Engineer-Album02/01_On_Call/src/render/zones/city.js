// The sleeping lake city under a cold glass bell: dark old town with church towers, a lake, snowy mountains, the
// data centre as a low, permanently lit body at the edge of town, and one single window that answers the alarm.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,random,instanced,canvasTexture,tube} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {ALARM,OK_A,FLIGHTS,FIX} from '../model.js';
export const WINDOW=[6,3.3,22.42],DC=[-46,0,6];
// Street path of the data light: from the apartment block under the streets to the data centre.
const PATH=[[6,.06,24.2],[6,.06,17],[-12,.06,17],[-12,.06,9],[-30,.06,9],[-30,.06,12.5],[-39,.06,12.5]];
const PL=[0];for(let i=1;i<PATH.length;i++)PL.push(PL[i-1]+Math.hypot(PATH[i][0]-PATH[i-1][0],PATH[i][2]-PATH[i-1][2]));
function along(u){const s=clamp(u)*PL.at(-1);let i=1;while(i<PL.length-1&&PL[i]<s)i++;const k=(s-PL[i-1])/(PL[i]-PL[i-1]||1),a=PATH[i-1],b=PATH[i];return new THREE.Vector3(a[0]+(b[0]-a[0])*k,.12,a[2]+(b[2]-a[2])*k);}
function prism(){const g=new THREE.BufferGeometry(),v=[-.5,0,-.5,.5,0,-.5,0,1,-.5,-.5,0,.5,.5,0,.5,0,1,.5];const idx=[0,2,1,3,4,5,0,1,4,0,4,3,1,2,5,1,5,4,2,0,3,2,3,5];g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(idx);g.computeVertexNormals();return g;}
export class CityZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x020610);s.fog=new THREE.FogExp2(0x040a16,.0075);
  s.add(new THREE.HemisphereLight(0x6a8cc4,0x070a10,1.0));const moon=new THREE.DirectionalLight(0xa8c0ea,1.7);moon.position.set(-40,60,-120);s.add(moon);const front=new THREE.DirectionalLight(0x5f7fb8,.6);front.position.set(30,40,90);s.add(front);
  // sky gradient, stars, mountains
  const sky=new THREE.Mesh(new THREE.SphereGeometry(400,32,16),new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,fog:false,uniforms:{},vertexShader:'varying vec3 p;void main(){p=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec3 p;void main(){float h=clamp(p.y*1.6,0.,1.);vec3 c=mix(vec3(.035,.075,.14),vec3(.006,.014,.035),h);gl_FragColor=vec4(c,1.);}'}));s.add(sky);
  const sd=new Float32Array(900*3);for(let i=0;i<900;i++){const a=random(i)*Math.PI*2,e=.08+random(i+900)*.9;sd.set([Math.cos(a)*Math.cos(e)*380,Math.sin(e)*380,Math.sin(a)*Math.cos(e)*380],i*3);}
  s.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(sd,3)),new THREE.PointsMaterial({color:0x9fb8e0,size:.9,sizeAttenuation:true,transparent:true,opacity:.55,fog:false,depthWrite:false})));
  const mtex=canvasTexture(2048,400,(g,w,h)=>{const ridge=(seed,base,amp,col,snow)=>{g.beginPath();g.moveTo(0,h);for(let x=0;x<=w;x+=8){const u=x/w,y=base-amp*(.55*Math.abs(Math.sin(u*7.3+seed))+.3*Math.abs(Math.sin(u*17.1+seed*2))+.15*Math.sin(u*41+seed*3));g.lineTo(x,y);}g.lineTo(w,h);g.closePath();g.fillStyle=col;g.fill();
    if(snow){g.save();g.clip();const gr=g.createLinearGradient(0,base-amp,0,base-amp*.35);gr.addColorStop(0,'rgba(170,190,215,.75)');gr.addColorStop(1,'rgba(170,190,215,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);g.restore();}};
   ridge(1.3,330,250,'#1a2537',true);ridge(4.1,370,150,'#0d1522',false);});
  const mountains=new THREE.Mesh(new THREE.PlaneGeometry(900,176),new THREE.MeshBasicMaterial({map:mtex,transparent:true,fog:false,color:0x8e9cb4,depthWrite:false}));mountains.position.set(0,58,-260);s.add(mountains);
  // lake and ground
  const lake=new THREE.Mesh(new THREE.PlaneGeometry(700,240),new THREE.MeshStandardMaterial({color:0x0b1c33,roughness:.32,metalness:.35}));
  const moonDisc=new THREE.Mesh(new THREE.CircleGeometry(3.6,32),new THREE.MeshBasicMaterial({color:0x8f9cb4,fog:false}));moonDisc.position.set(-70,120,-330);s.add(moonDisc);const mh=new THREE.Mesh(new THREE.CircleGeometry(16,32),new THREE.MeshBasicMaterial({color:0x1a2840,transparent:true,opacity:.3,blending:THREE.AdditiveBlending,fog:false,depthWrite:false}));mh.position.set(-70,120,-331);s.add(mh);
  const glint=new THREE.Mesh(new THREE.PlaneGeometry(14,190),new THREE.MeshBasicMaterial({map:canvasTexture(64,512,(g,w,h)=>{for(let y=0;y<h;y+=3){g.fillStyle=`rgba(200,215,240,${(.15+.35*((y*7919)%13)/13)*(1-y/h)})`;g.fillRect(w*.2+((y*31)%17),y,w*.6-((y*13)%11),1.2);}}),transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));glint.rotation.x=-Math.PI/2;glint.position.set(-48,.02,-120);s.add(glint);lake.rotation.x=-Math.PI/2;lake.position.set(0,-.05,-142);s.add(lake);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(700,300),mat(0x05080d,{roughness:.95,metalness:.05}));ground.rotation.x=-Math.PI/2;ground.position.set(0,0,128);s.add(ground);
  // buildings (instanced bodies and pitched roofs), lit windows, street lights
  const blds=[];for(let gx=-9;gx<=8;gx++)for(let gz=-2;gz<=6;gz++){for(let k=0;k<3;k++){const i=(gx+20)*97+(gz+5)*13+k;const x=gx*8+1.5+k*2.4+random(i)*.6,z=gz*8+1.5+random(i+1)*3.6;
   if(Math.hypot(x-DC[0],z-DC[2])<11||(x>-7&&x<15&&z>16)||z<-19)continue;const w=1.8+random(i+2)*1.2,d=2+random(i+3)*1.6,h=1.6+random(i+4)*2.6*(1-Math.abs(gx)/14);blds.push({x,z,w,d,h,i});}}
  this.bodies=instanced(s,new THREE.BoxGeometry(1,1,1),mat(0x1c2533,{roughness:.85,metalness:.1}),blds.length);this.roofs=instanced(s,prism(),mat(0x2b3442,{roughness:.7,metalness:.2}),blds.length);
  const q=new THREE.Quaternion();this.bodies.begin();this.roofs.begin();for(const b of blds){this.bodies.push(new THREE.Vector3(b.x,b.h/2,b.z),0xffffff,new THREE.Vector3(b.w,b.h,b.d));this.roofs.push(new THREE.Vector3(b.x,b.h,b.z),0xffffff,new THREE.Vector3(b.w,.7+random(b.i+5)*.5,b.d),random(b.i+6)<.5?null:q.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.PI/2));}this.bodies.end();this.roofs.end();
  // the few windows that are lit at this hour: warm, dim, very sparse
  const wins=[];blds.forEach(b=>{for(let k=0;k<6;k++)if(random(b.i*7+k)<.13)wins.push([b.x+(random(b.i+k)-.5)*b.w*.7,.6+random(b.i*3+k)*(b.h-.9),b.z+b.d/2+.02]);});
  this.wins=instanced(s,new THREE.PlaneGeometry(.22,.28),glow(0xffffff,1),wins.length);this.wins.begin();wins.forEach((p,i)=>this.wins.push(V(p),P.warm,1,null,.45+random(i+3000)*.6));this.wins.end();
  const lamps=[];for(let x=-70;x<=70;x+=6)for(const z of[-19,-3,17,33]){lamps.push([x+random(x*3+z)*1.5,.9,z+.6]);}for(let z=-18;z<=40;z+=6)for(const x of[-28,-12,20])lamps.push([x+.6,.9,z]);
  this.lamps=instanced(s,new THREE.SphereGeometry(.08,8,6),glow(0xffffff),lamps.length);this.lamps.begin();lamps.forEach(p=>this.lamps.push(V(p),0xffc27a,1,null,1.4));this.lamps.end();
  this.pools=instanced(s,new THREE.CircleGeometry(1.4,20),additive(0xffffff),lamps.length);const flat=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),-Math.PI/2);this.pools.begin();lamps.forEach(p=>this.pools.push(new THREE.Vector3(p[0],.03,p[2]),0x6a4520,1,flat,.6));this.pools.end();
  // shore lights mirrored on the lake, far shore lights
  const refl=[];lamps.filter(p=>p[2]<-18).forEach(p=>refl.push([p[0],.0,p[2]-5]));for(let x=-180;x<=180;x+=7)refl.push([x+random(x)*4,0,-108-random(x+1)*8]);
  this.refl=instanced(s,new THREE.PlaneGeometry(.35,9),additive(0xffffff),refl.length);this.refl.begin();refl.forEach((p,i)=>this.refl.push(V(p),0x8a5a26,1,flat,.5+random(i)*.4));this.refl.end();
  const far=refl.filter(p=>p[2]<-60).map(p=>[p[0],.6,p[2]+4.5]);this.far=instanced(s,new THREE.SphereGeometry(.22,6,4),glow(0xffffff),far.length);this.far.begin();far.forEach(p=>this.far.push(V(p),0xffc27a,1,null,1.1));this.far.end();
  // church towers with spires and a clock tower
  for(const[x,z,h]of[[-22,-12,9.5],[14,-8,11],[34,-15,8]]){box(s,[1.6,h,1.6],[x,h/2,z],mat(0x121822,{roughness:.85}));const spire=new THREE.Mesh(new THREE.ConeGeometry(1.15,3.8,4),mat(0x1f2a36,{metalness:.5,roughness:.5}));spire.position.set(x,h+1.9,z);spire.rotation.y=Math.PI/4;s.add(spire);box(s,[.9,.9,.05],[x,h-1.4,z+.82],glow(0xffd9a0,.35));}
  // the apartment block and the window
  box(s,[4.4,5.4,4],[WINDOW[0],2.7,WINDOW[2]-2.02],mat(0x101722,{roughness:.9}));const roof=new THREE.Mesh(prism(),mat(0x1b222d));roof.scale.set(4.4,1.2,4);roof.position.set(WINDOW[0],5.4,WINDOW[2]-2.02);s.add(roof);
  this.windowMat=glow(0x9fd8ff,.1);this.window=box(s,[.9,.7,.04],WINDOW,this.windowMat);box(s,[.98,.06,.06],[WINDOW[0],WINDOW[1]-.38,WINDOW[2]+.02],mat(0x2a3440));box(s,[.03,.7,.05],[WINDOW[0],WINDOW[1],WINDOW[2]+.03],mat(0x2a3440));
  this.windowHalo=new THREE.Mesh(new THREE.PlaneGeometry(3.2,2.6),additive(0x7fc8ff,0));this.windowHalo.position.set(WINDOW[0],WINDOW[1],WINDOW[2]+.08);s.add(this.windowHalo);
  // data centre: low, long, always glowing
  const dc=new THREE.Group();dc.position.set(...DC);s.add(dc);box(dc,[15,1.8,8],[0,.9,0],mat(0x0f1a26,{roughness:.6,metalness:.5}));this.dcEdge=glow(P.cyan,1.2);
  for(const[w,d,x,z]of[[15.1,.08,0,4.02],[15.1,.08,0,-4.02],[.08,8.1,7.52,0],[.08,8.1,-7.52,0]])box(dc,[w,.08,d],[x,1.84,z],this.dcEdge);
  this.dcStrip=glow(P.cyan,.6);for(let k=0;k<6;k++)box(dc,[2,.12,.04],[-6+k*2.4,.75,4.03],this.dcStrip);
  // power line: pylons from the outskirts to the data centre
  const pyl=[[-120,0,34],[-98,0,28],[-76,0,22],[-60,0,15]];const cableMat=new THREE.LineBasicMaterial({color:0x3d5670,transparent:true,opacity:.7});
  for(const p of pyl){const g=new THREE.Group();g.position.set(...p);s.add(g);const pm=new THREE.LineBasicMaterial({color:0x2e4257});const pts=[[-1.2,0,0],[-.25,9,0],[1.2,0,0],[.25,9,0],[-.25,9,0],[-1.8,7.2,0],[1.8,7.2,0],[.25,9,0],[-.7,4,0],[.7,4,0]];
   g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints([[0,1],[2,3],[3,4],[4,5],[5,6],[6,7],[0,3],[2,4],[8,9]].flatMap(([a,b])=>[V(pts[a]),V(pts[b])])),pm));}
  for(let i=1;i<pyl.length;i++)for(const dx of[-1.8,1.8]){const a=V(pyl[i-1]).add(new THREE.Vector3(dx,7.2,0)),b=V(pyl[i]).add(new THREE.Vector3(dx,7.2,0)),pts=[];for(let k=0;k<=20;k++){const u=k/20;pts.push(a.clone().lerp(b,u).add(new THREE.Vector3(0,-1.6*4*u*(1-u),0)));}s.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),cableMat));}
  // data light under the streets; pulses of the test, later the verified service path
  this.pathMat=additive(P.cyan,0);tube(s,PATH,this.pathMat,.16,96);this.pathGlow=additive(P.cyan,0);const pg=tube(s,PATH,this.pathGlow,.6,96);pg.scale.y=.15;this.pulse=instanced(s,new THREE.SphereGeometry(.42,12,8),additive(0xffffff),12);
  // drifting night fog over the data centre
  const ftex=canvasTexture(256,256,(g,w,h)=>{const gr=g.createRadialGradient(128,128,10,128,128,128);gr.addColorStop(0,'rgba(140,170,210,.5)');gr.addColorStop(1,'rgba(140,170,210,0)');g.fillStyle=gr;g.fillRect(0,0,w,h);});
  this.fog=[];for(let i=0;i<7;i++){const m=new THREE.Mesh(new THREE.PlaneGeometry(26,9),new THREE.MeshBasicMaterial({map:ftex,transparent:true,opacity:.0,depthWrite:false,fog:false}));m.position.set(DC[0]-20+i*7,3+random(i)*2,DC[2]-4+random(i+9)*8);s.add(m);this.fog.push(m);}
  // the cold glass bell
  this.dome=new THREE.Mesh(new THREE.SphereGeometry(170,48,24,0,Math.PI*2,0,Math.PI/2),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false,uniforms:{k:{value:.06}},
   vertexShader:'varying vec3 n;varying vec3 v;void main(){vec4 w=modelViewMatrix*vec4(position,1.);n=normalize(normalMatrix*normal);v=normalize(-w.xyz);gl_Position=projectionMatrix*w;}',
   fragmentShader:'uniform float k;varying vec3 n;varying vec3 v;void main(){float f=pow(1.-abs(dot(n,v)),4.);gl_FragColor=vec4(vec3(.35,.7,1.)*f*k,1.);}'}));this.dome.position.y=-2;s.add(this.dome);
 }
 windowLevel(t){return t<ALARM?.18:t<195.84?1:Math.max(0,1-(t-195.84)/1.4)*.9;}
 update(t,a,tl,shot){
  const w=this.windowLevel(t),beat=tl.attack(t),drop=tl.drop(t);
  setGlow(this.windowMat,t<ALARM?0x6f9ad0:0xa8d8ff,.2+w*1.25);setGlow(this.windowHalo.material,0x5aa8ff,w*.22);
  setGlow(this.dcEdge,P.cyan,1+.5*(a.sub_20_60_drive??0)+.8*drop);setGlow(this.dcStrip,P.cyan,.5+.4*beat);
  this.dome.material.uniforms.k.value=.05+.05*drop;
  this.fog.forEach((m,i)=>{m.position.x=DC[0]-24+((i*7+t*(.5+.1*i))%46);m.material.opacity=.07+.05*Math.sin(t*.2+i);m.lookAt(m.position.x,m.position.y,m.position.z+10);});
  // test packets after the fix, ordinary traffic faint; the verified path stays as a muted green line
  const ok=t>=OK_A;setGlow(this.pathMat,ok?P.ok:P.cyan,ok?.9+.3*beat:t>=ALARM?.18:0);setGlow(this.pathGlow,ok?P.ok:P.cyan,ok?.18:t>=ALARM?.04:0);
  this.pulse.begin();for(const f of FLIGHTS){if(f.t0>t)break;if(t>f.t1||f.t0<FIX||!['syn','synack','tls','data','ambient'].includes(f.kind))continue;const u=(t-f.t0)/(f.t1-f.t0),p=along(f.dir==='back'?1-u:u);this.pulse.push(p,f.kind==='ambient'?P.ok:0xdff6ff,f.kind==='ambient'?.6:1,null,f.kind==='ambient'?.35:2);if(this.pulse.size>=12)break;}this.pulse.end();
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start));const look=(pos,target,fov)=>({pos:V(pos),target:V(target),fov});const W=WINDOW;
  switch(shot.camera){
   case'crane':{const p0=V([-112,17,58]),p1=V([-24,8.5,46]),p2=V([2,4.6,33]),k=smooth(0,1,lin),p=p0.clone().lerp(p1,k).lerp(p1.clone().lerp(p2,k),k),tg=V([DC[0],1,DC[2]]).lerp(V(W),smooth(.25,.95,lin));return look(p,tg,46);}
   case'window':return shot.mode==='dark'?look([lerp(1.2,.2,u),3.9,lerp(34,31,u)],[W[0],W[1]+.4,W[2]],36):look([lerp(-4,-2.5,u),lerp(3.2,3.4,u),lerp(38,35,u)],[W[0]-1.2,W[1]+1.4,W[2]-3],42);
   case'pullback':{const p=V([W[0]+1,W[1]+.4,W[2]+4]).lerp(V([38,30,88]),smooth(0,1,lin)*.92+.08*lin);return look(p,V(W).lerp(V([-12,0,4]),smooth(0,.8,lin)),44);}
   case'wide':default:{if(shot.mode==='datalight')return look([lerp(24,16,u),lerp(28,24,u),lerp(52,46,u)],[-16,0,10],46);if(shot.mode==='end')return look([lerp(30,36,lin),lerp(18,26,lin),lerp(64,78,lin)],[-10,2,-4],44);return look([lerp(10,-2,u),lerp(15,13,u),lerp(52,48,u)],[DC[0]+6,1.5,DC[2]-6],42);}
  }
 }
}
