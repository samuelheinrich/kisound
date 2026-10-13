// The on-call workplace: wooden desk at the window, monitor with the real display, laptop with the router log,
// phone, cold coffee. One nameless person – a silhouette lit by the screens; attention, no hero gesture.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,random,canvasTexture,dynamicTexture} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {ALARM,FIX,clock,TICKET,OK_A} from '../model.js';
const MON=[.12,1.13,-.86],KEYS=[.1,.772,-.42],ENTER=[.3,.79,-.43],MOUSE=[.46,.77,-.4],PHONE0=[.56,.759,-.52],PHONE1=[.42,.759,-.66],MUG=[.66,.75,-.74];
// Phone position: carried next to the keyboard while the diagnosis surface opens (30.5–32.2 s).
export const phonePos=t=>V(PHONE0).lerp(V(PHONE1),smooth(30.9,32.0,t));
// Pose of the person over time: lean (0 dozing back … 1 upright at the keys), head pitch, hand targets.
export function pose(t){
 const up=t<28.14?.12*smooth(16.6,19,t):t<184.28?smooth(28.14,29.6,t):1-.55*smooth(184.3,186.2,t);
 const headDown=t<16.58?.55:t<19?lerp(.55,.05,smooth(16.58,18.9,t)):(t>=21.5&&t<26.5)||(t>=44.56&&t<48)||(t>=192.56&&t<195.84)?.32:t>=184.28?.12:.02;
 let R='lap',L='lap';
 if(t>=21.6&&t<24.8)R='phone';else if(t>=30.02&&t<30.9)R='keys';else if(t>=30.9&&t<32.2)R='phone';else if(t>=32.2&&t<44.56)R='keys';
 else if(t>=44.56&&t<46.7)R='keys';else if(t>=46.7&&t<48.4)R='phone';else if(t>=48.4&&t<73.8)R='keys';else if(t>=73.8&&t<75.9)R='phone';else if(t>=75.9&&t<81.42)R='chin';
 else if(t>=81.42&&t<84.78)R='hover';else if(t>=84.78&&t<131.78)R='keys';else if(t>=131.78&&t<133.22)R='mouse';else if(t>=133.22&&t<143.02)R='keys';else if(t>=143.02&&t<147.4)R='enter';
 else if(t>=147.4&&t<169.88)R='keys';else if(t>=169.88&&t<184.28)R='chin';else if(t>=192.4&&t<193.4)R='phone';
 if(t>=30.02&&t<184.28&&!(t>=169.88&&t<171.5))L='keys';if(t>=75.9&&t<81.42)L='lap';
 return{up,headDown,R,L,press:t>=146.62&&t<147.05?1:0};
}
const woodTex=()=>canvasTexture(1024,512,(g,w,h)=>{g.fillStyle='#4a2c19';g.fillRect(0,0,w,h);for(let i=0;i<220;i++){const y=random(i)*h,a=.04+random(i+300)*.08;g.strokeStyle=`rgba(${random(i+1)<.5?'20,10,4':'120,72,40'},${a})`;g.lineWidth=1+random(i+2)*3;g.beginPath();g.moveTo(0,y);for(let x=0;x<=w;x+=32)g.lineTo(x,y+Math.sin(x*.01+i)*4+Math.sin(x*.003+i*.7)*9);g.stroke();}});
const backdropTex=()=>canvasTexture(2048,1024,(g,w,h)=>{const sky=g.createLinearGradient(0,0,0,h*.6);sky.addColorStop(0,'#030814');sky.addColorStop(1,'#0e2340');g.fillStyle=sky;g.fillRect(0,0,w,h);
 for(let i=0;i<160;i++){g.fillStyle=`rgba(190,210,255,${.2+random(i)*.5})`;g.fillRect(random(i+1)*w,random(i+2)*h*.35,2,2);}
 g.beginPath();g.moveTo(0,h*.52);for(let x=0;x<=w;x+=10){const u=x/w;g.lineTo(x,h*(.5-.16*Math.abs(Math.sin(u*6.2+1))-.06*Math.abs(Math.sin(u*19))));}g.lineTo(w,h*.56);g.lineTo(0,h*.56);g.fillStyle='#1b2a40';g.fill();
 g.fillStyle='#050a12';g.fillRect(0,h*.56,w,h*.1);const lake=g.createLinearGradient(0,h*.6,0,h);lake.addColorStop(0,'#081426');lake.addColorStop(1,'#03070e');g.fillStyle=lake;g.fillRect(0,h*.62,w,h*.38);
 for(let i=0;i<70;i++){const x=random(i+50)*w,bh=20+random(i+60)*60;g.fillStyle='#070d16';g.fillRect(x,h*.62-bh,30+random(i+70)*40,bh);if(random(i+80)<.5){g.fillStyle='rgba(255,200,130,.55)';g.fillRect(x+8,h*.62-bh+10,4,5);}}
 for(const x of[.24,.71,.86]){g.fillStyle='#070d16';g.fillRect(x*w,h*.62-150,22,150);g.beginPath();g.moveTo(x*w-6,h*.62-150);g.lineTo(x*w+11,h*.62-220);g.lineTo(x*w+28,h*.62-150);g.fill();}
 for(let i=0;i<120;i++){const x=random(i+200)*w;g.fillStyle=`rgba(255,190,110,${.15+random(i+210)*.3})`;g.fillRect(x,h*.62+random(i+220)*h*.3,2,8+random(i+230)*30);}
 g.fillStyle='rgba(95,224,255,.6)';g.fillRect(w*.08,h*.6,120,4);});
// A capsule between two points (limbs).
const Y=new THREE.Vector3(0,1,0);
function limb(m,a,b){const d=new THREE.Vector3().subVectors(b,a),len=d.length();m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(Y,d.normalize());m.scale.set(1,len/m.userData.len,1);}
export class DeskZone{
 constructor(display,laptop){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x020409);s.fog=new THREE.FogExp2(0x020409,.04);
  s.add(new THREE.AmbientLight(0x1a2740,.55));const moon=new THREE.DirectionalLight(0x7f9fd8,1.3);moon.position.set(-2,3,-6);s.add(moon);
  const rim=new THREE.PointLight(0x5a80c8,.9,3.5,1.6);rim.position.set(-.9,1.9,1.5);s.add(rim);
  // window wall with the lake city behind it
  const wall=mat(0x252e3b,{roughness:.95,metalness:0});for(const[sz,p]of[[[6,.9,.12],[0,.45,-1.25]],[[6,1.1,.12],[0,2.95,-1.25]],[[1.8,1.5,.12],[-2.1,1.65,-1.25]],[[1.8,1.5,.12],[2.1,1.65,-1.25]]])box(s,sz,p,wall);
  box(s,[2.44,.05,.16],[0,.92,-1.22],mat(0x1d252f));box(s,[.05,1.5,.14],[0,1.65,-1.22],mat(0x1d252f));
  const glass=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1.5),additive(0x16243a,.25));glass.position.set(0,1.65,-1.25);s.add(glass);
  const bd=new THREE.Mesh(new THREE.PlaneGeometry(26,13),new THREE.MeshBasicMaterial({map:backdropTex(),fog:false}));bd.position.set(0,1.2,-9);s.add(bd);
  box(s,[.12,3.5,4],[-1.6,1.75,.6],wall);// left wall with a shelf and a warm strip
  box(s,[.32,.03,1.2],[-1.42,1.62,-.3],mat(0x2a1a10));this.shelfMat=glow(0xffb070,.5);box(s,[.02,.012,1.1],[-1.3,1.6,-.3],this.shelfMat);
  for(let i=0;i<9;i++)box(s,[.2,.22+random(i)*.08,.035],[-1.44,1.75,-.8+i*.06+random(i+5)*.02],mat([0x2b3440,0x40261a,0x1f3a33][i%3],{roughness:.8}));
  this.shelfLight=new THREE.PointLight(0xffa860,1.1,3.2,1.6);this.shelfLight.position.set(-1.25,1.5,-.3);s.add(this.shelfLight);
  // desk, monitor, laptop, keyboard, mouse, mug, plant
  box(s,[1.9,.045,.86],[.1,.7275,-.62],new THREE.MeshStandardMaterial({map:woodTex(),roughness:.55,metalness:.05}));for(const x of[-.78,.98])box(s,[.05,.73,.75],[x,.365,-.62],mat(0x1a1410));
  box(s,[.66,.4,.03],[MON[0],MON[1],MON[2]-.02],mat(0x0b0e12,{roughness:.4}));box(s,[.05,.32,.05],[MON[0],.93,MON[2]-.06],mat(0x151a20));box(s,[.24,.012,.16],[MON[0],.778,MON[2]-.04],mat(0x151a20));
  this.screen=new THREE.Mesh(new THREE.PlaneGeometry(.64,.36),new THREE.MeshBasicMaterial({map:display.tex,toneMapped:false,color:0xffffff}));this.screen.position.set(...MON);s.add(this.screen);
  const lap=new THREE.Group();lap.position.set(-.42,.774,-.5);lap.rotation.y=.42;s.add(lap);box(lap,[.34,.016,.23],[0,0,0],mat(0x1c2128,{metalness:.6}));const lid=new THREE.Group();lid.position.set(0,.008,-.115);lid.rotation.x=-.32;lap.add(lid);box(lid,[.34,.23,.01],[0,.115,-.006],mat(0x1c2128,{metalness:.6}));
  this.lapScreen=new THREE.Mesh(new THREE.PlaneGeometry(.32,.2),new THREE.MeshBasicMaterial({map:laptop.tex,toneMapped:false}));this.lapScreen.position.set(0,.117,.0);lid.add(this.lapScreen);
  box(s,[.44,.018,.14],KEYS,mat(0x15191f,{roughness:.7}));this.keyGlow=glow(0x2a4058,.5);box(s,[.42,.002,.12],[KEYS[0],KEYS[1]+.01,KEYS[2]],this.keyGlow);this.enterKey=box(s,[.03,.008,.025],ENTER,glow(P.amber,.2));
  box(s,[.06,.02,.1],MOUSE,mat(0x15191f));
  const mug=new THREE.Group();mug.position.set(...MUG);s.add(mug);const cup=new THREE.Mesh(new THREE.CylinderGeometry(.045,.04,.1,24,1,true),mat(0x1b1d22,{roughness:.6,side:THREE.DoubleSide}));cup.position.y=.05;mug.add(cup);
  const handle=new THREE.Mesh(new THREE.TorusGeometry(.028,.007,8,16,Math.PI),mat(0x1b1d22));handle.position.set(.05,.05,0);handle.rotation.z=-Math.PI/2;mug.add(handle);
  const coffee=new THREE.Mesh(new THREE.CircleGeometry(.042,24),mat(0x1a0d06,{roughness:.15,metalness:.2}));coffee.rotation.x=-Math.PI/2;coffee.position.y=.085;mug.add(coffee);box(mug,[.11,.004,.11],[0,.002,0],mat(0x2a2018));
  const pot=new THREE.Mesh(new THREE.CylinderGeometry(.06,.05,.11,16),mat(0x2c2f33));pot.position.set(.88,.81,-.98);s.add(pot);for(let i=0;i<9;i++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(.025,.2,5),mat(0x1d3a24,{roughness:.8}));leaf.position.set(.88+(random(i)-.5)*.1,.93,-.98+(random(i+3)-.5)*.1);leaf.rotation.set((random(i+6)-.5)*.9,0,(random(i+9)-.5)*.9);s.add(leaf);}
  const pens=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,.1,14),mat(0x16191d));pens.position.set(.68,.8,-.98);s.add(pens);
  // phone
  this.phone=new THREE.Group();s.add(this.phone);box(this.phone,[.078,.009,.158],[0,0,0],mat(0x0a0c10,{metalness:.7,roughness:.3}));
  this.phoneTex=dynamicTexture(360,720);this.phoneScreen=new THREE.Mesh(new THREE.PlaneGeometry(.07,.148),new THREE.MeshBasicMaterial({map:this.phoneTex.tex,toneMapped:false}));this.phoneScreen.rotation.x=-Math.PI/2;this.phoneScreen.position.y=.005;this.phone.add(this.phoneScreen);
  this.phoneLight=new THREE.PointLight(0xff6070,0,.7,2);s.add(this.phoneLight);this.phoneHalo=new THREE.Mesh(new THREE.CircleGeometry(.16,24),additive(0xff4050,0));this.phoneHalo.rotation.x=-Math.PI/2;s.add(this.phoneHalo);
  // light of the monitor on the person and the desk
  this.monLight=new THREE.SpotLight(0x9cc8ff,0,3.2,1.05,.85,1.4);this.monLight.position.set(MON[0],MON[1],MON[2]+.05);this.monLight.target.position.set(MON[0]-.04,1.05,.4);s.add(this.monLight,this.monLight.target);
  this.fill=new THREE.PointLight(0x7fb0ff,0,2.4,2);this.fill.position.set(.1,1.2,-.5);s.add(this.fill);
  // chair and person
  const dark=mat(0x10141b,{roughness:.9,metalness:.05}),hood=mat(0x1b2331,{roughness:.95,metalness:0}),skin=mat(0x5a3e33,{roughness:.85,metalness:0}),hair=mat(0x120d0a,{roughness:1,metalness:0});
  this.chair=new THREE.Group();this.chair.position.set(.08,0,.28);s.add(this.chair);box(this.chair,[.52,.07,.5],[0,.5,0],dark);this.back=box(this.chair,[.5,.62,.06],[0,.86,.25],dark);box(this.chair,[.05,.46,.05],[0,.25,0],mat(0x22262c));
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2;box(this.chair,[.3,.03,.04],[Math.cos(a)*.15,.04,Math.sin(a)*.15],mat(0x22262c)).rotation.y=-a;}
  const cap=(r,len,m)=>{const mesh=new THREE.Mesh(new THREE.CapsuleGeometry(r,len,6,12),m);mesh.userData.len=len+2*r;s.add(mesh);return mesh;};
  this.torso=cap(.17,.32,hood);this.neck=cap(.05,.06,skin);this.head=new THREE.Group();s.add(this.head);
  const skull=new THREE.Mesh(new THREE.SphereGeometry(.1,24,16),skin);skull.scale.set(.9,1.1,1);this.head.add(skull);const hr=new THREE.Mesh(new THREE.SphereGeometry(.106,24,16,0,Math.PI*2,0,Math.PI*.62),hair);hr.position.set(0,.02,.012);hr.rotation.x=.35;this.head.add(hr);
  const glasses=new THREE.Mesh(new THREE.TorusGeometry(.024,.003,6,16),mat(0x0a0a0a,{metalness:.8}));glasses.position.set(.04,-.005,-.088);this.head.add(glasses);const g2=glasses.clone();g2.position.x=-.04;this.head.add(g2);
  this.hoodBack=cap(.13,.08,hood);
  this.shoulders=cap(.085,.3,hood);this.hoodMass=new THREE.Mesh(new THREE.SphereGeometry(.15,20,14),hood);s.add(this.hoodMass);
  this.arms=['R','L'].map(()=>({upper:cap(.048,.22,hood),fore:cap(.04,.2,hood),hand:(()=>{const m=new THREE.Mesh(new THREE.BoxGeometry(.055,.025,.08),skin);s.add(m);return m;})()}));
  this.thighs=[cap(.075,.3,dark),cap(.075,.3,dark)];
 }
 drawPhone(t){
  const alert=t>=ALARM&&t<34,call=t>=44.56&&t<47.4,closed=t>=TICKET.closed&&t<192.56,lockFade=t>=192.56?clamp(1-(t-192.56)/.6):1;
  const mode=alert?'alert':call?'call':closed?'closed':'off',k=mode+clock(t)+(mode==='call'?Math.floor(t*3)%2:'')+(t>=192.56?Math.round(lockFade*10):'');
  this.phoneTex.set(k,(g,w,h)=>{g.fillStyle='#000';g.fillRect(0,0,w,h);if(mode==='off')return;g.globalAlpha=lockFade;
   const bg=g.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0b1626');bg.addColorStop(1,'#04070c');g.fillStyle=bg;g.fillRect(0,0,w,h);g.textAlign='center';g.fillStyle='#e8f0f6';g.font='300 92px "Space Grotesk"';g.fillText(clock(t),w/2,170);
   if(mode==='alert'){g.fillStyle='#ff3b4e';g.beginPath();g.moveTo(w/2,250);g.lineTo(w/2+60,350);g.lineTo(w/2-60,350);g.closePath();g.fill();g.fillStyle='#000';g.font='700 56px "Space Grotesk"';g.fillText('!',w/2,340);
    g.fillStyle='rgba(30,40,56,.92)';g.fillRect(24,400,w-48,210);g.textAlign='left';g.font='600 30px "Space Grotesk"';g.fillStyle='#ff8090';g.fillText('NOC · INCIDENT-2042',44,450);g.font='26px "Space Grotesk"';g.fillStyle='#e8f0f6';g.fillText('P2 · SITE-2',44,494);g.fillText('«Alles ist weg»',44,534);g.fillStyle='#8fa7b8';g.fillText('Bereitschaft Netzwerk',44,580);}
   if(mode==='call'){g.font='34px "Space Grotesk"';g.fillStyle='#e8f0f6';g.fillText('Anruf · NOC',w/2,330);g.font='24px "Space Grotesk"';g.fillStyle='#8fa7b8';g.fillText('INCIDENT-2042',w/2,372);g.fillStyle='#2fbf71';g.beginPath();g.arc(w/2+90,600,44,0,7);g.fill();g.fillStyle='#e0414f';g.beginPath();g.arc(w/2-90,600,44,0,7);g.fill();}
   if(mode==='closed'){g.fillStyle='rgba(30,40,56,.92)';g.fillRect(24,400,w-48,170);g.textAlign='left';g.font='600 28px "Space Grotesk"';g.fillStyle='#74d6a4';g.fillText('INCIDENT-2042',44,448);g.font='26px "Space Grotesk"';g.fillStyle='#e8f0f6';g.fillText('geschlossen · verifiziert',44,494);g.fillStyle='#8fa7b8';g.fillText(clock(t),44,536);}
  });
  return mode;
 }
 update(t,a,tl,shot){
  const mode=this.drawPhone(t),vib=mode==='call'||(mode==='alert'&&t<19.5)?1:0,p=phonePos(t);
  // vibration: the phone wanders a few millimetres over the wood on the onsets
  const buzz=vib*(.0018+.003*tl.attack(t));this.phone.position.set(p.x+Math.sin(t*93)*buzz+(mode==='call'?.004*smooth(44.6,47,t):0),p.y+Math.abs(Math.sin(t*61))*buzz*.5,p.z+Math.cos(t*71)*buzz);this.phone.rotation.y=.18+(mode==='call'?.06*smooth(44.6,47,t):0);
  const lit=mode==='off'?0:mode==='closed'?.6:1;this.phoneLight.position.set(p.x,p.y+.12,p.z);this.phoneLight.color.setHex(mode==='alert'?0xff5060:mode==='call'?0x9fd8b0:0x9fd8ff);this.phoneLight.intensity=lit*(t>=192.56?clamp(1-(t-192.56)/.6):1)*(.035+.025*Math.sin(t*6)**2);
  this.phoneHalo.position.set(p.x,.754,p.z);setGlow(this.phoneHalo.material,mode==='alert'?0xff3040:0x70c0ff,lit*.05);
  // monitor brightness: standby before the ticket opens
  const mon=t<ALARM?.38:t<22.62?lerp(.38,1,smooth(ALARM,22.62,t)):1;this.screen.material.color.setScalar(.35+.65*mon);this.monLight.intensity=.5+1.6*mon;this.fill.intensity=.08+.25*mon;
  setGlow(this.shelfMat,0xffb070,.5);setGlow(this.keyGlow,0x2a4058,.3+.4*mon);setGlow(this.enterKey.material,P.amber,t>=143.02&&t<147.2?1.2+.8*Math.sin(t*5)**2:.15);
  this.pose(t);
 }
 pose(t){
  const ps=pose(t),lean=lerp(-.38,.1,ps.up),hip=new THREE.Vector3(.08,.62,.26),fwd=new THREE.Vector3(0,Math.cos(lean),-Math.sin(lean));
  const chest=hip.clone().addScaledVector(fwd,.36),neck=hip.clone().addScaledVector(fwd,.55);limb(this.torso,hip,chest.clone().addScaledVector(fwd,.08));
  this.back.rotation.x=-lean*.5;
  const headPos=neck.clone().addScaledVector(fwd,.13);this.head.position.copy(headPos);this.head.rotation.set(-lean+ps.headDown*1.1-.05,0,0);limb(this.neck,neck.clone().addScaledVector(fwd,-.02),headPos);
  this.hoodBack.position.copy(neck.clone().add(new THREE.Vector3(0,-.02,.1)));this.hoodBack.rotation.x=Math.PI/2+lean;
  limb(this.shoulders,chest.clone().add(new THREE.Vector3(-.2,.03,.02)),chest.clone().add(new THREE.Vector3(.2,.03,.02)));this.hoodMass.position.copy(neck.clone().add(new THREE.Vector3(0,.0,.09)));this.hoodMass.scale.set(1,.7,.8);
  const breathe=Math.sin(t*1.3)*.004*(t>=184.28&&t<188?3:1);this.torso.position.y+=breathe;
  const php=phonePos(t);
  const targets={lap:s=>new THREE.Vector3(.08+s*.16,.66,.02),keys:s=>new THREE.Vector3(KEYS[0]+s*.1,KEYS[1]+.03,KEYS[2]+.02),phone:()=>php.clone().add(new THREE.Vector3(0,.03,.02)),chin:()=>headPos.clone().add(new THREE.Vector3(.02,-.12,-.07)),
   hover:()=>new THREE.Vector3(ENTER[0],ENTER[1]+.07,ENTER[2]+.02),enter:()=>new THREE.Vector3(ENTER[0],ENTER[1]+.035-.025*ps.press,ENTER[2]+.02),mouse:()=>new THREE.Vector3(MOUSE[0]+.04*Math.sin(t*2),MOUSE[1]+.03,MOUSE[2])};
  [['R',1],['L',-1]].forEach(([k,side],i)=>{const arm=this.arms[i],sh=chest.clone().add(new THREE.Vector3(side*.2,.04,0)),tg=(targets[ps[k]]||targets.lap)(side);
   if(ps[k]==='keys')tg.x+=Math.sin(t*(11+i*3))*.006*(t>=30&&t<184?1:0);const mid=sh.clone().lerp(tg,.5).add(new THREE.Vector3(side*.09,-.12,.06));
   limb(arm.upper,sh,mid);limb(arm.fore,mid,tg);arm.hand.position.copy(tg);arm.hand.lookAt(tg.clone().add(new THREE.Vector3(0,0,-1)));});
  this.thighs.forEach((th,i)=>{const side=i?-1:1;limb(th,hip.clone().add(new THREE.Vector3(side*.1,-.02,0)),new THREE.Vector3(.08+side*.12,.58,-.16));});
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),look=(pos,target,fov=27)=>({pos:V(pos),target:V(target),fov}),ph=phonePos(t);
  switch(shot.camera){
   case'enter':{const p0=V([.35,1.5,-2.7]),p1=V([.62,1.38,-1.3]),p2=V([1.05,1.08,-.62]),k=smooth(0,1,lin),p=p0.clone().lerp(p1,k).lerp(p1.clone().lerp(p2,k),k);return look(p,V([.0,1.62,-1.25]).lerp(V([.3,1.0,-.6]),smooth(.25,.7,lin)).lerp(ph,smooth(.6,1,lin)),lerp(40,32,lin));}
   case'phone':{const lock=shot.mode==='lock',alarm=shot.mode==='alarm';return look([ph.x+lerp(.42,.36,u),ph.y+(alarm?lerp(.36,.3,u):.34),ph.z+lerp(.4,.34,u)+(lock?.06:0)],[ph.x-.03,ph.y+.01,ph.z-.02],alarm?30:32);}
   case'side':return look([lerp(-1.05,-.95,u),lerp(1.3,1.36,u),lerp(1.75,1.6,u)],[.18,1.02,-.5],34);
   case'coffee':return shot.mode==='exhale'?look([lerp(1.05,.98,u),.98,lerp(.26,.18,u)],V([.52,.86,-.6]).lerp(V([.12,1.0,.1]),u*.4),34):look([lerp(1.08,1.0,u),.96,lerp(-.22,-.3,u)],V(MUG).add(new THREE.Vector3(0,.07,0)).lerp(V(MON),smooth(.35,.9,lin)),30);
   case'hands':{const enter=shot.mode==='enter'||shot.mode==='hover';return enter?look([lerp(.78,.7,u),lerp(1.02,.98,u),lerp(.12,.04,u)],[ENTER[0]-.04,ENTER[1]+.02,ENTER[2]-.02],26):look([lerp(.98,.9,u),lerp(1.12,1.08,u),lerp(.3,.22,u)],[.34,.8,-.5],32);}
   case'over':default:{const k=+shot.id.slice(1)%3;return look([lerp(-.62,-.54,u)+k*.06,lerp(1.56,1.52,u),lerp(1.42,1.28,u)],[MON[0]+.04*(k-1),MON[1]-.04,MON[2]],shot.mode==='watch'?26:30);}
  }
 }
}
