// The one real place of the film: a small room (3.8 × 4.8 × 2.6 m) with a window in the left wall, a desk across the
// room, a laptop, a desk clock, a mug, paper cards and a schematic person; outside, the facade of the house and the
// house across the street. Lit like the real place: desk lamp, screen glow and a cool night fill, then morning sun.
import * as THREE from 'three';
import {SHOT} from './config.js';
import {clamp,smooth,lerp,ease} from './timeline.js';
import {random,dynamicTexture,canvasTexture} from './world.js';
import {JOB,at,af,cardCount,noteAt,clockText,jobState,KICK,BASS,bassCount,RELOAD2,PASS2,version} from './model.js';
import {drawApp,drawPanel,drawTitleText,THEMES,themeAt,text,fitText} from './screen.js';
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
export const P={
 desk:v3(-.95,.74,-1.45),laptop:v3(-.85,.75,-1.42),screen:v3(-.85,.872,-1.575),hinge:v3(-.85,.76,-1.545),
 keysR:v3(-.77,.779,-1.45),keysL:v3(-.94,.779,-1.45),enter:v3(-.725,.779,-1.47),pad:v3(-.85,.774,-1.345),lid:v3(-.668,.875,-1.57),
 clock:v3(-1.38,.74,-1.32),noteFinal:v3(-1.48,.742,-1.1),clockTap:v3(-1.24,.748,-1.24),mug:v3(-.40,.74,-1.56),cards:v3(-.47,.742,-1.2),note:v3(-1.13,.742,-1.2),
 exportCard:v3(-.36,.742,-1.27),cardFront:v3(-.62,.742,-1.2),edgeR:v3(-.6,.76,-1.1),edgeL:v3(-1.1,.76,-1.1),
 window:v3(-1.9,1.55,-1.1),head:v3(-.85,1.2,-.98),lamp:v3(-1.36,1.22,-1.56),
};
function std(color,rough=.7,metal=0,extra={}){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal,...extra});}
function add(parent,geo,mat,pos,{cast=true,receive=true,rot=null}={}){const m=new THREE.Mesh(geo,mat);m.position.copy(pos);if(rot)m.rotation.set(...rot);m.castShadow=cast;m.receiveShadow=receive;parent.add(m);return m;}
const box=(parent,w,h,d,mat,x,y,z,o)=>add(parent,new THREE.BoxGeometry(w,h,d),mat,v3(x,y,z),o);
// cylinder from a to b (limbs)
function setLimb(mesh,a,b){const d=b.clone().sub(a),l=d.length();mesh.position.copy(a).addScaledVector(d,.5);mesh.scale.set(1,Math.max(.001,l),1);mesh.quaternion.setFromUnitVectors(v3(0,1,0),d.normalize());}
function ik(s,target,a,b,pole){const d0=target.clone().sub(s),dist=clamp(d0.length(),Math.abs(a-b)+.01,a+b-.002),dir=d0.normalize(),cosA=(a*a+dist*dist-b*b)/(2*a*dist),sinA=Math.sqrt(Math.max(0,1-cosA*cosA));
 const n=pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();return{elbow:s.clone().addScaledVector(dir,a*cosA).addScaledVector(n,a*sinA),hand:s.clone().addScaledVector(dir,dist)};}

export class Room{
 constructor(){
  const scene=this.scene=new THREE.Scene();scene.background=new THREE.Color(0x0d1320);
  this.buildSky();this.buildRoom();this.buildDesk();this.buildPerson();this.buildExterior();this.buildLights();this.buildProject();
 }
 buildSky(){
  this.skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color()},mid:{value:new THREE.Color()},low:{value:new THREE.Color()}},
   vertexShader:'varying vec3 vp;void main(){vp=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform vec3 top,mid,low;varying vec3 vp;void main(){float h=vp.y;vec3 c=h>0.?mix(mid,top,smoothstep(0.,.55,h)):mix(mid,low,smoothstep(0.,.2,-h));gl_FragColor=vec4(c,1.);}'});
  const sky=new THREE.Mesh(new THREE.SphereGeometry(300,32,16),this.skyMat);sky.frustumCulled=false;this.scene.add(sky);
 }
 buildRoom(){
  const s=this.scene,wall=this.wallMat=std(0xc2cedb,.92),floor=std(0x9a7650,.62),ceil=std(0xe4e8ec,.95),trim=std(0xeef1f3,.6);
  const room=this.room=new THREE.Group();s.add(room);
  // floor with plank lines
  const ft=canvasTexture(1024,1024,(g,w,h)=>{g.fillStyle='#8f6b46';g.fillRect(0,0,w,h);for(let i=0;i<16;i++){g.fillStyle=`hsl(30,${30+random(i)*10}%,${33+random(i+40)*9}%)`;g.fillRect(i*64,0,62,h);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(i*64+62,0,2,h);for(let j=0;j<5;j++){g.fillRect(i*64,((random(i*7+j)*h)|0),62,2);}}});
  ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(2,2.5);floor.map=ft;
  box(room,3.8,.1,4.8,floor,0,-.05,0,{cast:false});box(room,3.8,.1,4.8,ceil,0,2.65,0,{cast:false});
  box(room,3.8,2.6,.15,wall,0,1.3,-2.475);box(room,3.8,2.6,.15,wall,0,1.3,2.475);box(room,.15,2.6,4.8,wall,1.975,1.3,0);
  // left wall = the facade wall, with the window opening z -1.85…-.35, y .9…2.2
  const W0=-1.85,W1=-.35,Y0=.9,Y1=2.2,x=-1.975;
  box(room,.15,2.6,2.4-W1,wall,x,1.3,(W1+2.4)/2,{});box(room,.15,2.6,W0+2.4,wall,x,1.3,(W0-2.4)/2);box(room,.15,Y0,W1-W0,wall,x,Y0/2,(W0+W1)/2);box(room,.15,2.6-Y1,W1-W0,wall,x,(Y1+2.6)/2,(W0+W1)/2);
  // window frame, mullion, sill and glass
  const frame=std(0xf2f2ee,.5);[[W0,Y0,W0,Y1],[W1,Y0,W1,Y1]].forEach(([a,b,c,d])=>box(room,.16,Y1-Y0,.06,frame,x,(Y0+Y1)/2,a===W0?W0+.03:W1-.03));
  box(room,.16,.06,W1-W0,frame,x,Y1-.03,(W0+W1)/2);box(room,.16,.06,W1-W0,frame,x,Y0+.03,(W0+W1)/2);box(room,.12,Y1-Y0,.05,frame,x,(Y0+Y1)/2,(W0+W1)/2);box(room,.12,.05,W1-W0,frame,x,1.72,(W0+W1)/2);
  box(room,.3,.04,W1-W0+.1,trim,-1.86,Y0-.02,(W0+W1)/2);
  this.glass=add(room,new THREE.PlaneGeometry(W1-W0,Y1-Y0),new THREE.MeshStandardMaterial({color:0x9fb6c8,transparent:true,opacity:.1,roughness:.05,metalness:.2,depthWrite:false}),v3(-1.96,(Y0+Y1)/2,(W0+W1)/2),{cast:false,receive:false,rot:[0,Math.PI/2,0]});
  // radiator, shelf with books, door, picture, rug
  const metal=std(0xe7e9ea,.45,.1);for(let i=0;i<10;i++)box(room,.08,.5,.04,metal,-1.84,.45,W0+.1+i*.13);
  const shelf=std(0xd8d2c6,.7);box(room,.3,1.9,1.0,shelf,1.75,.95,-1.3);for(let k=0;k<4;k++)box(room,.28,.025,.96,shelf,1.74,.35+k*.45,-1.3,{});
  for(let k=0;k<4;k++)for(let i=0;i<9;i++){const h=.22+random(k*9+i)*.12;box(room,.18,h,.06+random(i+k*3)*.03,std(new THREE.Color().setHSL(.55+random(i*3+k)*.5,.25,.35+random(i+k)*.25),.8),1.72,.37+k*.45+h/2,-1.72+i*.095+random(k+i*7)*.02);}
  box(room,.05,2.05,.9,std(0xe9e6df,.6),1.93,1.025,1.3);box(room,.06,.04,.1,metal,1.88,1.0,.95);
  const art=canvasTexture(512,384,(g,w,h)=>{g.fillStyle='#f1efe8';g.fillRect(0,0,w,h);g.strokeStyle='#2d3a4d';g.lineWidth=10;for(let i=0;i<6;i++){g.beginPath();g.moveTo(40,320-i*40);g.bezierCurveTo(160,120+i*20,330,360-i*30,470,90+i*30);g.stroke();}g.fillStyle='#FF6534';g.beginPath();g.arc(380,110,36,0,7);g.fill();});
  add(room,new THREE.PlaneGeometry(.8,.6),std(0xffffff,.8,0,{map:art}),v3(.6,1.65,-2.395),{cast:false});
  add(room,new THREE.PlaneGeometry(1.6,2.2),std(0x51607a,.95),v3(-.6,.003,-.6),{cast:false,rot:[-Math.PI/2,0,0]});
 }
 buildDesk(){
  const s=this.scene,g=this.desk=new THREE.Group();s.add(g);
  const wood=std(0xc8a97f,.55),leg=std(0x30343b,.4,.5);box(g,1.6,.04,.75,wood,P.desk.x,P.desk.y-.02,P.desk.z);
  [[-1.72,-1.78],[-.18,-1.78],[-1.72,-1.12],[-.18,-1.12]].forEach(([x,z])=>box(g,.04,.72,.04,leg,x,.36,z));
  // laptop: base, keys, trackpad, lid with the live app display
  const alu=std(0xaab2bb,.32,.65),dark=std(0x22262d,.6,.2);
  box(g,.36,.016,.25,alu,P.laptop.x,P.laptop.y+.008,P.laptop.z);
  const keys=new THREE.InstancedMesh(new THREE.BoxGeometry(.017,.004,.016),dark,14*5);let n=0;const m=new THREE.Matrix4();
  for(let r=0;r<5;r++)for(let c=0;c<14;c++){m.makeTranslation(P.laptop.x-.143+c*.022,P.laptop.y+.018,P.laptop.z-.1+r*.021);keys.setMatrixAt(n++,m);}keys.castShadow=true;g.add(keys);
  this.enterKey=box(g,.03,.004,.016,std(0x2a3038,.5,.2),P.enter.x,P.laptop.y+.0185,P.enter.z,{});
  box(g,.12,.002,.07,std(0x9aa2ab,.25,.6),P.pad.x,P.laptop.y+.017,P.pad.z,{});
  const lid=this.lid=new THREE.Group();lid.position.copy(P.hinge);lid.rotation.x=-.26;g.add(lid);
  box(lid,.36,.235,.008,alu,0,.1175,-.004);
  this.screenTex=dynamicTexture(1280,800);
  this.screen=add(lid,new THREE.PlaneGeometry(.336,.21),new THREE.MeshBasicMaterial({map:this.screenTex.tex,toneMapped:false}),v3(0,.12,.0005),{cast:false,receive:false});
  this.screen.material.color.setScalar(.92);
  // desk clock (digital), mug, lamp
  const clock=this.clock=new THREE.Group();clock.position.copy(P.clock);clock.rotation.y=.35;g.add(clock);
  box(clock,.17,.075,.05,std(0x2b2f36,.4,.3),0,.0375,0);this.clockTex=dynamicTexture(256,96);
  add(clock,new THREE.PlaneGeometry(.15,.056),new THREE.MeshBasicMaterial({map:this.clockTex.tex,toneMapped:false}),v3(0,.0395,.0255),{cast:false});
  const cup=std(0xf3f1ea,.35);add(g,new THREE.CylinderGeometry(.042,.038,.1,28,1,true),new THREE.MeshStandardMaterial({color:0xf3f1ea,roughness:.35,side:THREE.DoubleSide}),v3(P.mug.x,P.mug.y+.05,P.mug.z));
  add(g,new THREE.CylinderGeometry(.038,.038,.004,24),cup,v3(P.mug.x,P.mug.y+.002,P.mug.z));
  add(g,new THREE.TorusGeometry(.025,.007,8,20),cup,v3(P.mug.x+.048,P.mug.y+.055,P.mug.z),{rot:[0,0,0]});
  this.coffee=add(g,new THREE.CircleGeometry(.039,24),std(0x2a1a10,.15,0),v3(P.mug.x,P.mug.y+.088,P.mug.z),{rot:[-Math.PI/2,0,0],cast:false});
  this.steam=[];const steamMat=new THREE.SpriteMaterial({color:0xffffff,transparent:true,opacity:.25,depthWrite:false,map:canvasTexture(64,64,(c,w,h)=>{const gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,.8)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,w,h);})});
  for(let i=0;i<7;i++){const sp=new THREE.Sprite(steamMat.clone());sp.scale.setScalar(.05);g.add(sp);this.steam.push(sp);}
  const lampMat=std(0x2e3238,.4,.6);box(g,.14,.015,.14,lampMat,-1.62,.748,-1.72);
  this.lampArm1=add(g,new THREE.CylinderGeometry(.008,.008,1,8),lampMat,v3());setLimb(this.lampArm1,v3(-1.62,.75,-1.72),v3(-1.55,1.18,-1.75));
  this.lampArm2=add(g,new THREE.CylinderGeometry(.008,.008,1,8),lampMat,v3());setLimb(this.lampArm2,v3(-1.55,1.18,-1.75),P.lamp.clone().add(v3(0,.04,0)));
  const shade=add(g,new THREE.ConeGeometry(.08,.11,24,1,true),new THREE.MeshStandardMaterial({color:0x2e3238,roughness:.4,metalness:.5,side:THREE.DoubleSide}),P.lamp.clone().add(v3(0,.02,0)),{});shade.rotation.set(.45,0,-.5);
  this.bulb=add(g,new THREE.SphereGeometry(.025,12,8),new THREE.MeshBasicMaterial({color:0xfff0d0}),P.lamp.clone().add(v3(.012,-.015,.01)),{cast:false});
  // cards: finished requests stack up, the export card, the note
  const paper=std(0xf7f5ee,.85);this.cards=[];for(let i=0;i<6;i++){const c=add(g,new THREE.BoxGeometry(.1,.0015,.07),paper,v3(P.cards.x+(random(i)-.5)*.01,P.cards.y+i*.0016,P.cards.z+(random(i+9)-.5)*.01));c.rotation.y=(random(i+3)-.5)*.3;this.cards.push(c);}
  this.cardTex=dynamicTexture(256,180);this.exportCard=add(g,new THREE.BoxGeometry(.1,.0015,.07),[paper,paper,new THREE.MeshStandardMaterial({map:this.cardTex.tex,roughness:.85}),paper,paper,paper],P.exportCard.clone());
  this.noteTex=dynamicTexture(256,256);this.note=add(g,new THREE.BoxGeometry(.085,.0012,.085),[paper,paper,new THREE.MeshStandardMaterial({map:this.noteTex.tex,roughness:.9}),paper,paper,paper],P.note.clone());this.note.rotation.y=.12;
  // office chair
  const ch=this.chair=new THREE.Group();ch.position.set(-.85,0,-.62);g.add(ch);const cm=std(0x2b2f37,.6,.2);
  box(ch,.46,.07,.46,cm,0,.46,0);box(ch,.44,.5,.06,cm,0,.78,.24);ch.children.at(-1).rotation.x=-.08;add(ch,new THREE.CylinderGeometry(.025,.025,.38,10),std(0x777d85,.3,.8),v3(0,.24,0));
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2,l=box(ch,.3,.03,.04,cm,Math.cos(a)*.15,.05,Math.sin(a)*.15);l.rotation.y=-a;}
 }
 buildPerson(){
  const body=std(0x46546b,.75),skin=std(0x76849a,.7),p=this.person=new THREE.Group();this.scene.add(p);
  const limb=r=>add(p,new THREE.CylinderGeometry(r,r*.85,1,14),body,v3());
  this.torso=add(p,new THREE.CapsuleGeometry(.155,.34,6,14),body,v3());this.torso.scale.set(1.15,1,.72);
  this.neck=add(p,new THREE.CylinderGeometry(.045,.05,.08,10),skin,v3());this.headM=add(p,new THREE.SphereGeometry(.092,20,16),skin,v3());this.headM.scale.set(.88,1.1,1);
  this.hair=add(p,new THREE.SphereGeometry(.096,20,12,0,Math.PI*2,0,Math.PI*.5),std(0x2e3440,.9),v3());this.hair.scale.set(.9,1.12,1.02);
  this.arm={R:{u:limb(.042),f:limb(.036),h:add(p,new THREE.CapsuleGeometry(.03,.05,4,10),skin,v3())},L:{u:limb(.042),f:limb(.036),h:add(p,new THREE.CapsuleGeometry(.03,.05,4,10),skin,v3())}};
  this.legs=[limb(.06),limb(.05),limb(.06),limb(.05)];
 }
 buildExterior(){
  const s=this.scene,ext=this.exterior=new THREE.Group();s.add(ext);
  const plaster=this.facadeMat=std(0xd9d2c4,.9),plaster2=std(0xb9c1c9,.9),W0=-1.85,W1=-.35,Y0=.9,Y1=2.2,x=-2.08,ZA=-14,ZB=10,YA=-9.3,YB=12;
  // our facade around the open window (the room wall continues it inside)
  box(ext,.06,YB-YA,W0-ZA,plaster,x,(YA+YB)/2,(ZA+W0)/2,{});box(ext,.06,YB-YA,ZB-W1,plaster,x,(YA+YB)/2,(W1+ZB)/2,{});box(ext,.06,Y0-YA,W1-W0,plaster,x,(YA+Y0)/2,(W0+W1)/2,{});box(ext,.06,YB-Y1,W1-W0,plaster,x,(Y1+YB)/2,(W0+W1)/2,{});
  box(ext,.4,.3,ZB-ZA+.4,std(0xa9a296,.8),x-.15,YB,(ZA+ZB)/2);for(let n=-3;n<=3;n++)box(ext,.08,.12,ZB-ZA,std(0xc8c0b1,.8),x-.04,.75+n*3,(ZA+ZB)/2,{});
  // windows of both houses: one instanced pane each, coloured per frame (night: dark, a few faint; morning: sky)
  const pane=new THREE.PlaneGeometry(1.5,1.3);this.panes=[];
  const mk=(xp,dir,count)=>{const mesh=new THREE.InstancedMesh(pane,new THREE.MeshBasicMaterial({color:0xffffff}),count);mesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);ext.add(mesh);return mesh;};
  const ours=[],opp=[];for(let k=-4;k<=3;k++)for(let n=-3;n<=3;n++){if(k===0&&n===0)continue;ours.push([-1.1+k*3,1.55+n*3]);}
  for(let k=-5;k<=4;k++)for(let n=-3;n<=3;n++)opp.push([-1.1+k*3+1.2,1.55+n*3]);
  this.paneMesh=[mk(x-.06,-1,ours.length),mk(-15.955,1,opp.length)];const dm=new THREE.Object3D();
  ours.forEach(([z,y],i)=>{dm.position.set(x-.06,y,z);dm.rotation.set(0,-Math.PI/2,0);dm.updateMatrix();this.paneMesh[0].setMatrixAt(i,dm.matrix);});
  opp.forEach(([z,y],i)=>{dm.position.set(-15.955,y,z);dm.rotation.set(0,Math.PI/2,0);dm.updateMatrix();this.paneMesh[1].setMatrixAt(i,dm.matrix);});
  this.paneData=[ours.map((p,i)=>({lit:random(i*5+1)>.86,warm:random(i*7+2),day:random(i*3+5)})),opp.map((p,i)=>({lit:random(i*11+3)>.88,warm:random(i*13+4),day:random(i*5+9)}))];
  for(const [i,mesh] of this.paneMesh.entries())for(let k=0;k<mesh.count;k++)mesh.setColorAt(k,new THREE.Color(0x223044));
  // window frames of our facade (light trims), the opposite house and the street
  const trims=new THREE.InstancedMesh(new THREE.BoxGeometry(.05,1.42,1.62),std(0xece8df,.6),ours.length+opp.length);ours.forEach(([z,y],i)=>{dm.position.set(x-.03,y,z);dm.rotation.set(0,0,0);dm.updateMatrix();trims.setMatrixAt(i,dm.matrix);});
  opp.forEach(([z,y],i)=>{dm.position.set(-15.99,y,z);dm.updateMatrix();trims.setMatrixAt(ours.length+i,dm.matrix);});ext.add(trims);
  box(ext,.3,YB-YA+3,30,plaster2,-16.15,(YA+YB+3)/2,-2,{});box(ext,.4,.3,30,std(0x8e969e,.8),-15.9,YB+3,-2);
  box(ext,14,.1,40,std(0x4a4d52,.9),-9,YA-.05,-2,{cast:false});box(ext,2.2,.16,40,std(0x8d8a84,.85),-3.2,YA+.03,-2,{cast:false});box(ext,2.2,.16,40,std(0x8d8a84,.85),-14.8,YA+.03,-2,{cast:false});
  this.lamps=[];for(const z of[-10,-2,6]){box(ext,.08,6,.08,std(0x40454c,.5,.6),-4,YA+3,z);const h=add(ext,new THREE.SphereGeometry(.18,12,8),new THREE.MeshBasicMaterial({color:0xffd9a0}),v3(-4.3,YA+6,z),{cast:false});this.lamps.push(h);}
  // distant roofs
  for(let i=0;i<9;i++)box(ext,6,8+random(i)*14,6,std(0x9aa3ad,.95),-30-random(i+4)*20,YA+4+random(i)*7,-40+i*10,{cast:false});
  // the cursor as a small light point in our window (S056–S058)
  this.cursorDot=new THREE.Sprite(new THREE.SpriteMaterial({color:0xffffff,transparent:true,depthWrite:false,toneMapped:false,map:canvasTexture(64,64,(c,w,h)=>{const gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(120,240,255,.9)');gr.addColorStop(1,'rgba(68,221,229,0)');c.fillStyle=gr;c.fillRect(0,0,w,h);})}));
  this.cursorDot.position.copy(P.screen).add(v3(.02,.01,.01));this.cursorDot.scale.setScalar(.05);this.cursorDot.renderOrder=20;s.add(this.cursorDot);
 }
 buildLights(){
  const s=this.scene;this.hemi=new THREE.HemisphereLight(0x8ea6d4,0x3a332c,1);s.add(this.hemi);
  this.lampLight=new THREE.SpotLight(0xffe4c8,4.2,6,1.05,.75,2);this.lampLight.position.copy(P.lamp).add(v3(0,-.03,0));this.lampLight.target.position.set(-1.0,.74,-1.3);this.lampLight.castShadow=true;this.lampLight.shadow.mapSize.set(1024,1024);this.lampLight.shadow.bias=-.0015;this.lampLight.shadow.radius=3;s.add(this.lampLight,this.lampLight.target);
  this.lampFill=new THREE.PointLight(0xffd8ae,.8,4,2);this.lampFill.position.copy(P.lamp).add(v3(0,.05,0));s.add(this.lampFill);
  this.fill=new THREE.PointLight(0xb8caf0,1.6,9,2);this.fill.position.set(.3,2.4,.4);s.add(this.fill);
  // the display lights hands, keys and face: a small cool spot just in front of the screen
  this.screenLight=new THREE.SpotLight(0xaad0ff,.5,2.2,.9,1,2);this.screenLight.position.copy(P.screen).add(v3(0,.06,.3));this.screenLight.target.position.copy(P.screen).add(v3(0,-.1,.8));s.add(this.screenLight,this.screenLight.target);
  this.moon=new THREE.DirectionalLight(0x7d93c8,.5);this.moon.position.set(-12,8,3);this.moon.target.position.set(-.8,.8,-1.1);s.add(this.moon,this.moon.target);
  const sun=this.sun=new THREE.DirectionalLight(0xffe7c8,0);sun.position.set(-9,6.5,2.2);sun.target.position.set(-.6,.5,-.9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-3,right:3,top:3,bottom:-3,near:1,far:25});sun.shadow.bias=-.0006;s.add(sun,sun.target);
  this.street=new THREE.PointLight(0xffd29a,0,30,1.6);this.street.position.set(-4.3,-3.3,-2);s.add(this.street);
 }
 // ---- project panels (spatial views of the same UI) and the grid model of S013
 buildProject(){
  const s=this.scene;this.panels=[];
  for(let i=0;i<8;i++){const tex=dynamicTexture(1024,640),m=new THREE.Mesh(new THREE.PlaneGeometry(.48,.3),new THREE.MeshBasicMaterial({map:tex.tex,toneMapped:false,transparent:true,side:THREE.DoubleSide,depthWrite:true}));
   m.visible=false;m.renderOrder=5;s.add(m);const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(.48,.3)),new THREE.LineBasicMaterial({color:0x44dde5,transparent:true,opacity:.7}));m.add(edge);this.panels.push({mesh:m,tex,edge});}
  const cell=new THREE.BoxGeometry(.034,.034,.012);this.gridModel=new THREE.InstancedMesh(cell,new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),64);this.gridModel.visible=false;s.add(this.gridModel);
  this.gridGroup=new THREE.Group();s.add(this.gridGroup);
 }
 dayness(t){return smooth(SHOT.S042.start,SHOT.S046.start+2,t);}
 update(t,a,shot,view){
  const day=this.dayness(t),theme=themeAt(t);
  // sky and light: a readable night (cool fill, lamp, screen) that turns into a bright bluish morning
  const night=[new THREE.Color(0x0f1a2c),new THREE.Color(0x1f2d46),new THREE.Color(0x10151f)],morning=[new THREE.Color(0x8fb4dc),new THREE.Color(0xe9eef2),new THREE.Color(0x9aa3ad)];
  ['top','mid','low'].forEach((k,i)=>this.skyMat.uniforms[k].value.copy(night[i]).lerp(morning[i],day));
  const e=a.energy,acc=a.accent??0;
  this.hemi.color.set(0x8ea6d4).lerp(new THREE.Color(0xe6eef8),day);this.hemi.groundColor.set(0x3a332c).lerp(new THREE.Color(0x8a7d6a),day);this.hemi.intensity=lerp(1.15,1.5,day);
  this.lampLight.intensity=lerp(4.2+.8*e+1.2*acc,1.0,day);this.lampFill.intensity=lerp(.9,.2,day);this.fill.intensity=lerp(1.9,.3,day);this.moon.intensity=lerp(.55,0,day);this.sun.intensity=3.4*smooth(.15,1,day);
  this.screenLight.intensity=lerp(.55,.25,day)*(1+.15*e);this.street.intensity=lerp(18,0,day);this.bulb.material.color.setScalar(lerp(1,.75,day));
  for(const l of this.lamps)l.material.color.set(0xffd9a0).multiplyScalar(lerp(1.2,.25,day));
  // windows of the street: at night only ours is bright; in the morning they reflect the sky
  const c=new THREE.Color();this.paneMesh.forEach((mesh,mi)=>{this.paneData[mi].forEach((p,i)=>{c.set(0x1a2333).lerp(new THREE.Color(0x182233),.5);if(p.lit)c.set(0x2a2a30).lerp(new THREE.Color(0x6a5a40),day*.4);c.lerp(new THREE.Color().setHSL(.58,.25,.62+p.day*.18),day);if(p.lit&&day>.4)c.lerp(new THREE.Color(0xf2d8a8),.35);mesh.setColorAt(i,c);});mesh.instanceColor.needsUpdate=true;});
  // laptop display = the app at this moment; desk clock; paper
  const tk=Math.round(t*30);this.screenTex.set(`${tk}|${theme}`,(g,w,h)=>drawApp(g,w,h,t,{theme}));
  this.clockTex.set(clockText(t),(g,w,h)=>{g.fillStyle='#0b0f14';g.fillRect(0,0,w,h);g.font='600 76px "JetBrains Mono"';g.fillStyle='#FF8a5c';g.textAlign='center';g.fillText(clockText(t),w/2,76);});
  const nc=cardCount(t);this.cards.forEach((c,i)=>c.visible=i<nc);
  const showExport=t>=SHOT.S025.start-.01&&t<JOB.P04.done;this.exportCard.visible=showExport;
  if(showExport){const k=ease(clamp((t-af('S025',.3))/(SHOT.S025.end-SHOT.S025.start)/.45));this.exportCard.position.lerpVectors(P.exportCard,P.cardFront,k);this.exportCard.rotation.y=lerp(.25,-.05,k);}
  this.cardTex.set('export',(g,w,h)=>{g.fillStyle='#f7f5ee';g.fillRect(0,0,w,h);g.font='600 64px "Space Grotesk"';g.fillStyle='#161A20';g.fillText('Export',24,108);g.fillStyle='#FF6534';g.fillRect(24,130,120,10);});
  const n=noteAt(t);this.note.visible=!!n;if(n){this.noteTex.set(n.text,(g,w,h)=>{g.fillStyle='#F3E7A8';g.fillRect(0,0,w,h);fitText(g,n.text,18,130,220,48,'#1B1A16',600);});
   this.note.position.copy(t>=SHOT.S052.start?P.noteFinal:P.note);}
  // steam while the coffee is warm (until the third hour), none in the bridge
  const warm=1-smooth(SHOT.S028.start,SHOT.S028.end,t);this.steam.forEach((sp,i)=>{const ph=(t*.35+i/7)%1;sp.position.set(P.mug.x+Math.sin(ph*6+i)*.012,P.mug.y+.1+ph*.16,P.mug.z+Math.cos(ph*5+i)*.01);sp.scale.setScalar(.03+ph*.06);sp.material.opacity=warm*.22*Math.sin(ph*Math.PI);sp.visible=warm>0;});
  this.coffee.position.y=P.mug.y+lerp(.088,.07,smooth(SHOT.S028.start,SHOT.S043.start,t));
  this.cursorDot.visible=t>=SHOT.S056.start;this.cursorDot.material.opacity=1;
  this.chair.position.z=-.62-(t>=af('S017',.4)?.04*smooth(af('S017',.4),af('S017',.75),t):0);
  this.pose(t);
 }
 // ---- the person: three recurring movements – reach for the lid, return to the keys, sit up in the morning light
 pose(t){
  const kf={R:[[0,'keysR',0],[af('S003',.55),'lid',.5],[at('S004',1.6),'enter',1.2],[at('S004',2.6),'keysR',.6],[at('S007',.6),'pad',.5],[SHOT.S013.end-.3,'lid',.6],[at('S014',1.5),'keysR',1.2],
    [at('S017',.5),'pad',.5],[at('S017',2.0),'pad2',.8],[at('S017',3.0),'pad',.6],[af('S025',.35),'exportCard',.7],[af('S025',.8),'cardFront',.9],[SHOT.S025.end,'keysR',.5],[SHOT.S033.start,'pad',.5],
    [SHOT.S041.start+.05,'lid',.05],[af('S041',.5),'keysR',1.2],[af('S041',.85),'pad',.6],[af('S046',.35),'edgeR',1.6],[SHOT.S052.start,'pad',1.2],[SHOT.S053.start+.4,'pad',.2],[at('S055',.45),'pad',.3],[at('S055',.6),'padDown',.12],[at('S055',.8),'pad',.15],[SHOT.S056.start+1,'edgeR',1.6]],
   L:[[0,'keysL',0],[SHOT.S003.start+.4,'edgeL',.5],[SHOT.S004.end-.2,'keysL',.6],[at('S007',.7),'clockTap',.6],[at('S007',1.0),'clockTapDown',.15],[at('S007',1.25),'clockTap',.15],[SHOT.S007.end-.2,'keysL',.8],[af('S046',.35),'edgeL',1.6],[SHOT.S052.start,'keysL',1.2],[SHOT.S056.start+1,'edgeL',1.6]]};
  const target=name=>({keysR:P.keysR,keysL:P.keysL,enter:P.enter,pad:P.pad,pad2:P.pad.clone().add(v3(.025,0,-.01)),padDown:P.pad.clone().add(v3(0,-.006,0)),lid:P.lid,clockTap:P.clockTap,clockTapDown:P.clockTap.clone().add(v3(0,-.008,0)),
   exportCard:P.exportCard.clone().add(v3(0,.012,0)),cardFront:P.cardFront.clone().add(v3(0,.012,0)),edgeR:P.edgeR,edgeL:P.edgeL}[name]);
  const pos=list=>{let p=target(list[0][1]).clone();for(let i=1;i<list.length;i++){const[ta,name,dur]=list[i];if(t<ta-dur)break;const k=ease(clamp((t-(ta-dur))/Math.max(1e-3,dur)));p=p.lerp(target(name),k);}return p;};
  const typing=['P01','P02','P03','P04','P05','P06'].some(id=>jobState(id,t)==='typing');
  const R=pos(kf.R),L=pos(kf.L);if(typing){R.y+=.006*Math.max(0,Math.sin(t*23));L.y+=.006*Math.max(0,Math.sin(t*19+1));}
  const up=smooth(af('S046',.25),af('S046',.75),t)*(1-.4*smooth(SHOT.S052.start,SHOT.S052.start+1.5,t));
  const lean=lerp(.32,.08,up)+.3*(1-clamp(R.distanceTo(P.lid)/.25)),cz=this.chair.position.z;
  const pelvis=v3(-.85,.56,cz-.12),sh=pelvis.clone().add(v3(0,.42*Math.cos(lean),-.42*Math.sin(lean)));
  setLimb(this.torso,pelvis,sh);this.torso.scale.set(1.15,1,.72);this.torso.position.copy(pelvis.clone().lerp(sh,.5));
  const neck=sh.clone().add(v3(0,.07,-.02));this.neck.position.copy(neck);this.headM.position.copy(neck.clone().add(v3(0,.12,-.03-.05*(1-up))));this.hair.position.copy(this.headM.position).add(v3(0,.004,.006));this.hair.rotation.x=.35;
  const shoulder={R:sh.clone().add(v3(.2,-.02,.02)),L:sh.clone().add(v3(-.2,-.02,.02))};
  for(const side of['R','L']){const tg=side==='R'?R:L,res=ik(shoulder[side],tg.clone().add(v3(0,.012,.04)),.3,.29,v3(side==='R'?.3:-.3,-1,.35)),arm=this.arm[side];
   setLimb(arm.u,shoulder[side],res.elbow);setLimb(arm.f,res.elbow,res.hand);arm.h.position.copy(res.hand).add(v3(0,-.006,-.035));arm.h.rotation.set(Math.PI/2-.15,0,0);arm.h.scale.set(1.25,1,.55);}
  const knee=[v3(-.97,.55,cz-.55),v3(-.73,.55,cz-.55)],foot=[v3(-.98,.08,cz-.6),v3(-.72,.08,cz-.6)];
  [[v3(-.95,.56,cz-.1),knee[0]],[knee[0],foot[0]],[v3(-.75,.56,cz-.1),knee[1]],[knee[1],foot[1]]].forEach(([a,b],i)=>setLimb(this.legs[i],a,b));
 }
 // project views: panels from the screen, staggered in the space above and behind the desk
 setPanels(list,t){this.panels.forEach((p,i)=>{const s=list[i];p.mesh.visible=!!s;if(!s)return;p.mesh.position.copy(s.pos);if(s.look)p.mesh.lookAt(s.look);else p.mesh.rotation.set(0,s.ry??0,0);p.mesh.scale.setScalar(s.scale??1);
  p.mesh.material.opacity=s.alpha??1;p.edge.material.opacity=(s.alpha??1)*.7;p.edge.material.color.set(s.edge??0x44dde5);const key=`${s.kind}|${Math.round(t*(s.live?20:2))}|${themeAt(t)}`;p.tex.set(key,(g,w,h)=>drawPanel(s.kind,g,w,h,t));});}
 setGridModel(on,t,origin,ry=0){this.gridModel.visible=on;if(!on)return;const m=new THREE.Object3D(),C=new THREE.Color(),th=THEMES[themeAt(t)];let i=0;const nb=bassCount(t);
  for(let r=0;r<4;r++)for(let s=0;s<16;s++){const on2=(r===0&&KICK.includes(s))||(r===3&&BASS.slice(0,nb).includes(s));m.position.set(origin.x+(s-7.5)*.042,origin.y+(1.5-r)*.042,origin.z+(on2?.012:0));m.rotation.set(0,ry,0);m.updateMatrix();this.gridModel.setMatrixAt(i,m.matrix);
   C.set(on2?(r===3?th.bass:th.kick):s%4===0?'#3a4660':'#2a3346');if(r===3&&!on2&&t>=RELOAD2-1&&t<RELOAD2+.25)C.set('#5a3022');this.gridModel.setColorAt(i,C);i++;}
  this.gridModel.instanceMatrix.needsUpdate=true;this.gridModel.instanceColor.needsUpdate=true;}
}
