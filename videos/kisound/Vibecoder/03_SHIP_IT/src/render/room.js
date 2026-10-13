// The one real place of the film: the room of TOKEN BURN on a later night (3.8 × 4.8 × 2.6 m, window in the left
// wall, desk across the room). On the desk: the laptop, a single big Enter key (a one-key macro pad), the release
// rail as five machined miniature presses TRACKS · BUILD · CHECK · DEPLOY · LIVE with status lamps (the cover's
// stations), the release package that travels along the rail, the commit graph as a cable from the Enter key to the
// rail, a mug, a plant on the window sill and a schematic person. Outside: the facade, the house across, the street.
import * as THREE from 'three';
import {SHOT,LANG} from './config.js';
import {clamp,smooth,lerp,ease} from './timeline.js';
import {random,dynamicTexture,canvasTexture} from './world.js';
import {STATIONS,station,packet,packetColor,enterPress,enterCount,releaseState,bridgeCards,COMMIT_HASH,ENTERS,COMMIT,NEXT_NOTE,CHECK_FAIL,CHECK_PASS,BUILD_PASS,UPLOAD_DONE,NEW_PAGE,LIVE_VERIFIED,TXT,
 TYPE_BUILD,ENTER_BUILD,TYPE_CHECK1,ENTER_CHECK1,TYPE_MV,ENTER_MV,TYPE_CHECK2,ENTER_CHECK2,TYPE_COMMIT,ENTER_COMMIT,TYPE_DEPLOY,ENTER_DEPLOY,HARD_RELOAD,PLAY,LINK_COPIED,RELOAD1,SWITCH_EN,af,at} from './model.js';
import {drawLaptop,drawPanel,C,text,fitText,font,laptopView} from './screen.js';
const v3=(x,y,z)=>new THREE.Vector3(x,y,z);
const RAIL_Z=-1.5,ST_Z=-1.64,ST_X=i=>-1.62+i*.16;
export const P={
 desk:v3(-.95,.74,-1.45),laptop:v3(-.55,.75,-1.42),screen:v3(-.55,.872,-1.575),hinge:v3(-.55,.76,-1.545),
 keysR:v3(-.47,.779,-1.45),keysL:v3(-.64,.779,-1.45),pad:v3(-.55,.774,-1.345),lid:v3(-.37,.875,-1.57),
 enter:v3(-.95,.74,-1.27),mug:v3(-.2,.74,-1.36),note:v3(-.8,.742,-1.17),lamp:v3(-.3,1.2,-1.66),
 window:v3(-1.9,1.55,-1.1),head:v3(-.55,1.2,-.98),plant:v3(-1.84,.9,-.62),
 rail:v3(-1.3,.752,RAIL_Z),station:i=>v3(ST_X(i),.74,ST_Z),gate:i=>v3(ST_X(i),.74,RAIL_Z),live:v3(ST_X(4),.74,ST_Z),
};
export const railX=p=>ST_X(0)+p*.16;
function std(color,rough=.7,metal=0,extra={}){return new THREE.MeshStandardMaterial({color,roughness:rough,metalness:metal,...extra});}
function add(parent,geo,mat,pos,{cast=true,receive=true,rot=null}={}){const m=new THREE.Mesh(geo,mat);m.position.copy(pos);if(rot)m.rotation.set(...rot);m.castShadow=cast;m.receiveShadow=receive;parent.add(m);return m;}
const box=(parent,w,h,d,mat,x,y,z,o)=>add(parent,new THREE.BoxGeometry(w,h,d),mat,v3(x,y,z),o);
function setLimb(mesh,a,b){const d=b.clone().sub(a),l=d.length();mesh.position.copy(a).addScaledVector(d,.5);mesh.scale.set(1,Math.max(.001,l),1);mesh.quaternion.setFromUnitVectors(v3(0,1,0),d.normalize());}
function ik(s,target,a,b,pole){const d0=target.clone().sub(s),dist=clamp(d0.length(),Math.abs(a-b)+.01,a+b-.002),dir=d0.normalize(),cosA=(a*a+dist*dist-b*b)/(2*a*dist),sinA=Math.sqrt(Math.max(0,1-cosA*cosA));
 const n=pole.clone().sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();return{elbow:s.clone().addScaledVector(dir,a*cosA).addScaledVector(n,a*sinA),hand:s.clone().addScaledVector(dir,dist)};}
const LAMP_COL={off:0x2a2f38,run:0xff6534,pass:0xd1f85d,fail:0xf04d4d,preview:0xff6534,wait:0x5a6372};
// station icons on the label plates
function icon(g,i,x,y,s,col){g.strokeStyle=col;g.fillStyle=col;g.lineWidth=s*.09;g.lineCap='round';g.lineJoin='round';
 if(i===0){for(let k=0;k<5;k++){const h=[.4,.8,.55,1,.5][k]*s;g.fillRect(x-s*.5+k*s*.24,y-h/2,s*.12,h);}}
 else if(i===1){g.beginPath();g.arc(x,y,s*.3,0,7);g.stroke();for(let k=0;k<8;k++){const a=k/8*Math.PI*2;g.beginPath();g.moveTo(x+Math.cos(a)*s*.36,y+Math.sin(a)*s*.36);g.lineTo(x+Math.cos(a)*s*.5,y+Math.sin(a)*s*.5);g.stroke();}}
 else if(i===2){g.beginPath();g.moveTo(x-s*.38,y);g.lineTo(x-s*.1,y+s*.3);g.lineTo(x+s*.42,y-s*.32);g.stroke();}
 else if(i===3){g.beginPath();g.arc(x-s*.18,y+s*.05,s*.22,Math.PI*.5,Math.PI*1.5);g.arc(x+s*.05,y-s*.12,s*.28,Math.PI,0);g.arc(x+s*.3,y+s*.08,s*.2,-Math.PI*.5,Math.PI*.5);g.closePath();g.stroke();g.beginPath();g.moveTo(x+.03*s,y+s*.2);g.lineTo(x+.03*s,y-s*.12);g.moveTo(x-.1*s,y);g.lineTo(x+.03*s,y-s*.14);g.lineTo(x+.16*s,y);g.stroke();}
 else{g.beginPath();g.arc(x,y,s*.42,0,7);g.stroke();g.beginPath();g.moveTo(x-s*.12,y-s*.2);g.lineTo(x+s*.22,y);g.lineTo(x-s*.12,y+s*.2);g.closePath();g.fill();}}

export class Room{
 constructor(){
  const scene=this.scene=new THREE.Scene();scene.background=new THREE.Color(0x0b0f17);
  this.buildSky();this.buildRoom();this.buildDesk();this.buildRail();this.buildPerson();this.buildExterior();this.buildLights();this.buildProject();this.annotate();
 }
 // names and driving parameters for the object inspector of kisound.ch (expert mode); no effect on the picture
 annotate(){
  const tag=(o,name,inspect)=>{o.name=o.name||name;if(inspect)o.traverse(m=>{if(!m.userData.inspect)m.userData.inspect=inspect;if(!m.name&&m!==o)m.name=name;});};
  tag(this.room,'Zimmer');tag(this.desk,'Tisch');tag(this.exterior,'Fassade und Strasse');tag(this.person,'Person (schematisch)');tag(this.rail,'Release-Schiene');
  tag(this.screen,'Laptop-Bildschirm',t=>({'laptopView(t)':laptopView(t),'releaseState(t)':releaseState(t)}));
  tag(this.enterPad,'Enter-Taste (Makropad)',t=>{const e=enterPress(t);return{'enterPress(t).down':e.down,'enterPress(t).ring':e.ring,'enterCount(t)':enterCount(t)};});
  this.st.forEach((s,i)=>{s.group.name=`Station ${s.name}`;s.lamp.name=`${s.name} · Statuslampe`;s.head.name=`${s.name} · Pressstempel`;s.plate.name=`${s.name} · Schild (Canvas)`;
   tag(s.group,`Station ${s.name}`,t=>({[`station(${i},t)`]:station(i,t),'releaseState(t)':releaseState(t),'Stempelhub (m)':+(.13-s.head.position.y).toFixed(4)}));});
  tag(this.packet,'Release-Paket',t=>({'packet(t)':packet(t),'packetColor(t)':packetColor(t),'railX(packet)':railX(packet(t)),'releaseState(t)':releaseState(t)}));
  tag(this.groove,'Schiene · Fortschritt bis zum Paket',t=>({'packet(t)':packet(t),'scale.x (m)':this.groove.scale.x}));
  ['Commit (älter)','Commit (älter)','Commit (älter)',`Release-Commit ${COMMIT_HASH}`,'Nächster Commit (offen)'].forEach((n,i)=>tag(this.commitNodes[i],n,i<3?null:t=>({'releaseState(t)':releaseState(t)})));
  this.gateWords.forEach(w=>tag(w.m,`Tor-Wort ${w.word}`,t=>({[`station(${w.i},t)`]:station(w.i,t)})));
  tag(this.projection,'LIVE-Projektion (Ausblick)',t=>({'station(4,t)':station(4,t)}));
  this.cards.forEach((m,i)=>tag(m,`Bridge-Karte ${TXT.bridge[i]}`,t=>{const c=bridgeCards(t)[i];return c?{'start (s)':c.start,'on':c.on}:{};}));
  tag(this.note,'Notiz · Nächstes Album / Nächster Commit');this.panels.forEach(p=>tag(p.mesh,'Panel (Canvas)'));
 }
 buildSky(){
  this.skyMat=new THREE.ShaderMaterial({side:THREE.BackSide,depthWrite:false,uniforms:{top:{value:new THREE.Color(0x0a1220)},mid:{value:new THREE.Color(0x1b2638)},low:{value:new THREE.Color(0x0c1018)}},
   vertexShader:'varying vec3 vp;void main(){vp=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform vec3 top,mid,low;varying vec3 vp;void main(){float h=vp.y;vec3 c=h>0.?mix(mid,top,smoothstep(0.,.55,h)):mix(mid,low,smoothstep(0.,.2,-h));gl_FragColor=vec4(c,1.);}'});
  const sky=new THREE.Mesh(new THREE.SphereGeometry(300,32,16),this.skyMat);sky.frustumCulled=false;this.scene.add(sky);
  // a few stars and the moon (cover: night city behind the window)
  const stars=new THREE.InstancedMesh(new THREE.SphereGeometry(.25,6,4),new THREE.MeshBasicMaterial({color:0xc9d6ea}),60),m=new THREE.Matrix4();
  for(let i=0;i<60;i++){const a=-Math.PI*.15-random(i)*Math.PI*.7,e=.15+random(i+70)*.5;m.makeTranslation(Math.cos(a)*-250,Math.sin(e)*250,Math.sin(a)*250);stars.setMatrixAt(i,m);}this.scene.add(stars);
  add(this.scene,new THREE.SphereGeometry(3.2,24,16),new THREE.MeshBasicMaterial({color:0xe9eef6}),v3(-160,70,-60),{cast:false});
 }
 buildRoom(){
  const s=this.scene,wall=this.wallMat=std(0x3b4351,.92),floor=std(0x4a3a2c,.62),ceil=std(0x2c323c,.95),trim=std(0x59606b,.6);
  const room=this.room=new THREE.Group();s.add(room);
  const ft=canvasTexture(1024,1024,(g,w,h)=>{g.fillStyle='#43342a';g.fillRect(0,0,w,h);for(let i=0;i<16;i++){g.fillStyle=`hsl(25,${22+random(i)*10}%,${18+random(i+40)*7}%)`;g.fillRect(i*64,0,62,h);g.fillStyle='rgba(0,0,0,.35)';g.fillRect(i*64+62,0,2,h);for(let j=0;j<5;j++){g.fillRect(i*64,((random(i*7+j)*h)|0),62,2);}}});
  ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(2,2.5);floor.map=ft;
  box(room,3.8,.1,4.8,floor,0,-.05,0,{cast:false});box(room,3.8,.1,4.8,ceil,0,2.65,0,{cast:false});
  box(room,3.8,2.6,.15,wall,0,1.3,-2.475);box(room,3.8,2.6,.15,wall,0,1.3,2.475);box(room,.15,2.6,4.8,wall,1.975,1.3,0);
  const W0=-1.85,W1=-.35,Y0=.9,Y1=2.2,x=-1.975;
  box(room,.15,2.6,2.4-W1,wall,x,1.3,(W1+2.4)/2,{});box(room,.15,2.6,W0+2.4,wall,x,1.3,(W0-2.4)/2);box(room,.15,Y0,W1-W0,wall,x,Y0/2,(W0+W1)/2);box(room,.15,2.6-Y1,W1-W0,wall,x,(Y1+2.6)/2,(W0+W1)/2);
  const frame=std(0x2a2f37,.5,.3);[W0,W1].forEach(a=>box(room,.16,Y1-Y0,.06,frame,x,(Y0+Y1)/2,a===W0?W0+.03:W1-.03));
  box(room,.16,.06,W1-W0,frame,x,Y1-.03,(W0+W1)/2);box(room,.16,.06,W1-W0,frame,x,Y0+.03,(W0+W1)/2);box(room,.12,Y1-Y0,.05,frame,x,(Y0+Y1)/2,(W0+W1)/2);box(room,.12,.05,W1-W0,frame,x,1.72,(W0+W1)/2);
  box(room,.3,.04,W1-W0+.1,trim,-1.86,Y0-.02,(W0+W1)/2);
  this.glass=add(room,new THREE.PlaneGeometry(W1-W0,Y1-Y0),new THREE.MeshStandardMaterial({color:0x9fb6c8,transparent:true,opacity:.08,roughness:.05,metalness:.2,depthWrite:false}),v3(-1.96,(Y0+Y1)/2,(W0+W1)/2),{cast:false,receive:false,rot:[0,Math.PI/2,0]});
  const shelf=std(0x2f343c,.7);box(room,.3,1.9,1.0,shelf,1.75,.95,-1.3);for(let k=0;k<4;k++)box(room,.28,.025,.96,shelf,1.74,.35+k*.45,-1.3,{});
  for(let k=0;k<4;k++)for(let i=0;i<9;i++){const h=.22+random(k*9+i)*.12;box(room,.18,h,.06+random(i+k*3)*.03,std(new THREE.Color().setHSL(.55+random(i*3+k)*.5,.2,.18+random(i+k)*.14),.8),1.72,.37+k*.45+h/2,-1.72+i*.095+random(k+i*7)*.02);}
  box(room,.05,2.05,.9,std(0x3a3f47,.6),1.93,1.025,1.3);
  // the TOKEN BURN picture still hangs on the back wall
  const art=canvasTexture(512,384,(g,w,h)=>{g.fillStyle='#1d222b';g.fillRect(0,0,w,h);g.strokeStyle='#4a5a70';g.lineWidth=10;for(let i=0;i<6;i++){g.beginPath();g.moveTo(40,320-i*40);g.bezierCurveTo(160,120+i*20,330,360-i*30,470,90+i*30);g.stroke();}g.fillStyle='#FF6534';g.beginPath();g.arc(380,110,36,0,7);g.fill();});
  add(room,new THREE.PlaneGeometry(.8,.6),std(0xffffff,.8,0,{map:art}),v3(.6,1.65,-2.395),{cast:false});
  add(room,new THREE.PlaneGeometry(1.6,2.2),std(0x252b36,.95),v3(-.6,.003,-.6),{cast:false,rot:[-Math.PI/2,0,0]});
 }
 buildDesk(){
  const s=this.scene,g=this.desk=new THREE.Group();s.add(g);
  const wood=std(0x3a2e25,.5,.05),leg=std(0x1e2126,.4,.5);box(g,1.6,.04,.75,wood,P.desk.x,P.desk.y-.02,P.desk.z);
  [[-1.72,-1.78],[-.18,-1.78],[-1.72,-1.12],[-.18,-1.12]].forEach(([x,z])=>box(g,.04,.72,.04,leg,x,.36,z));
  // laptop
  const alu=std(0x3d434c,.35,.7),dark=std(0x16191e,.6,.2);
  box(g,.36,.016,.25,alu,P.laptop.x,P.laptop.y+.008,P.laptop.z);
  const keys=new THREE.InstancedMesh(new THREE.BoxGeometry(.017,.004,.016),dark,14*5);let n=0;const m=new THREE.Matrix4();
  for(let r=0;r<5;r++)for(let c=0;c<14;c++){m.makeTranslation(P.laptop.x-.143+c*.022,P.laptop.y+.018,P.laptop.z-.1+r*.021);keys.setMatrixAt(n++,m);}keys.castShadow=true;g.add(keys);
  box(g,.12,.002,.07,std(0x2a2f36,.25,.6),P.pad.x,P.laptop.y+.017,P.pad.z,{});
  const lid=this.lid=new THREE.Group();lid.position.copy(P.hinge);lid.rotation.x=-.26;g.add(lid);
  box(lid,.36,.235,.008,alu,0,.1175,-.004);
  this.screenTex=dynamicTexture(1280,800);
  this.screen=add(lid,new THREE.PlaneGeometry(.336,.21),new THREE.MeshBasicMaterial({map:this.screenTex.tex,toneMapped:false}),v3(0,.12,.0005),{cast:false,receive:false});this.screen.material.color.setScalar(.95);
  // the big Enter key: one-key macro pad with an orange return arrow; a shock ring of light after each press
  const pad=this.enterPad=new THREE.Group();pad.position.copy(P.enter);g.add(pad);
  box(pad,.1,.018,.1,std(0x22262c,.45,.6),0,.009,0);
  const capTex=canvasTexture(256,256,(c,w,h)=>{c.fillStyle='#2a2e35';c.fillRect(0,0,w,h);c.strokeStyle='#FF6534';c.lineWidth=16;c.lineCap='round';c.lineJoin='round';c.beginPath();c.moveTo(190,70);c.lineTo(190,150);c.lineTo(70,150);c.stroke();c.beginPath();c.moveTo(110,110);c.lineTo(70,150);c.lineTo(110,190);c.stroke();});
  const capSide=std(0x30353c,.4,.3),capTop=new THREE.MeshStandardMaterial({map:capTex,roughness:.45,metalness:.2,emissive:0xff6534,emissiveMap:capTex,emissiveIntensity:.35});
  this.enterCap=add(pad,new THREE.BoxGeometry(.075,.032,.075),[capSide,capSide,capTop,capSide,capSide,capSide],v3(0,.034,0));
  this.enterRing=add(pad,new THREE.TorusGeometry(.066,.0035,8,48),new THREE.MeshBasicMaterial({color:0xff6534,toneMapped:false,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false}),v3(0,.02,0),{cast:false,rot:[Math.PI/2,0,0]});
  this.shock=add(pad,new THREE.RingGeometry(.07,.08,48),new THREE.MeshBasicMaterial({color:0xff6534,toneMapped:false,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.DoubleSide}),v3(0,.003,0),{cast:false,rot:[-Math.PI/2,0,0]});
  // mug (cold coffee), lamp, plant on the window sill
  const cup=std(0xd9d4c8,.4);add(g,new THREE.CylinderGeometry(.042,.038,.1,28,1,true),new THREE.MeshStandardMaterial({color:0xd9d4c8,roughness:.45,side:THREE.DoubleSide}),v3(P.mug.x,P.mug.y+.05,P.mug.z));
  add(g,new THREE.CylinderGeometry(.038,.038,.004,24),cup,v3(P.mug.x,P.mug.y+.002,P.mug.z));add(g,new THREE.TorusGeometry(.025,.007,8,20),cup,v3(P.mug.x+.048,P.mug.y+.055,P.mug.z));
  add(g,new THREE.CircleGeometry(.039,24),std(0x1d120b,.15,0),v3(P.mug.x,P.mug.y+.075,P.mug.z),{rot:[-Math.PI/2,0,0],cast:false});
  const lampMat=std(0x1e2126,.4,.6),lb=v3(-.24,.748,-1.74);box(g,.14,.015,.14,lampMat,lb.x,lb.y,lb.z);
  this.lampArm1=add(g,new THREE.CylinderGeometry(.008,.008,1,8),lampMat,v3());setLimb(this.lampArm1,lb,v3(-.27,1.16,-1.76));
  this.lampArm2=add(g,new THREE.CylinderGeometry(.008,.008,1,8),lampMat,v3());setLimb(this.lampArm2,v3(-.27,1.16,-1.76),P.lamp.clone().add(v3(0,.04,0)));
  const shade=add(g,new THREE.ConeGeometry(.08,.11,24,1,true),new THREE.MeshStandardMaterial({color:0x1e2126,roughness:.4,metalness:.5,side:THREE.DoubleSide}),P.lamp.clone().add(v3(0,.02,0)),{});shade.rotation.set(.45,0,.5);
  this.bulb=add(g,new THREE.SphereGeometry(.025,12,8),new THREE.MeshBasicMaterial({color:0xffd9b0}),P.lamp.clone().add(v3(-.012,-.015,.01)),{cast:false});
  const pot=std(0x8a8378,.85);add(g,new THREE.CylinderGeometry(.07,.055,.13,20),pot,P.plant.clone().add(v3(0,.065,0)));const leaf=std(0x1f3a2a,.7);
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2+random(i)*.4,l=add(g,new THREE.SphereGeometry(.05,10,6),leaf,P.plant.clone().add(v3(Math.cos(a)*.06,.2+random(i+3)*.12,Math.sin(a)*.06)));l.scale.set(.35,1.5,.9);l.rotation.set(Math.sin(a)*.5,a,Math.cos(a)*.5);}
  // the next commit: a note that lands on the desk in the outro
  this.noteTex=dynamicTexture(256,256);const paper=std(0xf2e6a6,.85);
  this.note=add(g,new THREE.BoxGeometry(.085,.0012,.085),[paper,paper,new THREE.MeshStandardMaterial({map:this.noteTex.tex,roughness:.9}),paper,paper,paper],P.note.clone());this.note.rotation.y=.18;
  this.noteTex.set('n',(c,w,h)=>{c.fillStyle='#F2E6A6';c.fillRect(0,0,w,h);fitText(c,TXT.next,18,96,220,40,'#1B1A16',700);fitText(c,TXT.nextSub,18,150,220,30,'#5B5546',500);c.fillStyle='#1B1A16';c.fillRect(18,190,14,30);});
  // chair
  const ch=this.chair=new THREE.Group();ch.position.set(-.55,0,-.62);g.add(ch);const cm=std(0x1c1f25,.6,.2);
  box(ch,.46,.07,.46,cm,0,.46,0);box(ch,.44,.5,.06,cm,0,.78,.24);ch.children.at(-1).rotation.x=-.08;add(ch,new THREE.CylinderGeometry(.025,.025,.38,10),std(0x555b63,.3,.8),v3(0,.24,0));
  for(let i=0;i<5;i++){const a=i/5*Math.PI*2,l=box(ch,.3,.03,.04,cm,Math.cos(a)*.15,.05,Math.sin(a)*.15);l.rotation.y=-a;}
 }
 // ---- the release rail: five presses behind a straight rail with an orange groove; the package rides on it
 buildRail(){
  const g=this.rail=new THREE.Group();this.scene.add(g);
  const metal=std(0x2b3038,.38,.75),dark=std(0x171a1f,.5,.6),edge=std(0x4a5059,.3,.85);
  box(g,.86,.012,.05,dark,ST_X(0)+.32,.746,RAIL_Z);box(g,.86,.004,.008,edge,ST_X(0)+.32,.753,RAIL_Z-.022);box(g,.86,.004,.008,edge,ST_X(0)+.32,.753,RAIL_Z+.022);
  this.groove=add(g,new THREE.BoxGeometry(1,.002,.007),new THREE.MeshBasicMaterial({color:0xff6534,toneMapped:false}),v3(0,.7535,RAIL_Z),{cast:false});
  this.grooveDim=add(g,new THREE.BoxGeometry(.86,.0015,.007),new THREE.MeshBasicMaterial({color:0x3a2418,toneMapped:false}),v3(ST_X(0)+.32,.7532,RAIL_Z),{cast:false});
  this.st=STATIONS.map((name,i)=>{const s=new THREE.Group();s.position.copy(P.station(i));g.add(s);
   box(s,.11,.012,.1,dark,0,.006,.02);box(s,.1,.11,.06,metal,0,.067,0);
   box(s,.012,.15,.012,edge,-.042,.087,-.022);box(s,.012,.15,.012,edge,.042,.087,-.022);
   box(s,.1,.03,.13,metal,0,.165,.04);   // arm over the rail
   const head=add(s,new THREE.BoxGeometry(.05,.03,.04),std(0x5a6068,.3,.85),v3(0,.13,RAIL_Z-ST_Z));
   const rod=add(s,new THREE.CylinderGeometry(.006,.006,.03,8),edge,v3(0,.148,RAIL_Z-ST_Z));
   const lamp=add(s,new THREE.BoxGeometry(.026,.022,.026),new THREE.MeshBasicMaterial({color:0x2a2f38,toneMapped:false}),v3(0,.192,.0),{cast:false});
   const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:this.haloTex||(this.haloTex=canvasTexture(64,64,(c)=>{const gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,64,64);})),transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false}));
   halo.position.set(0,.192,0);halo.scale.setScalar(.04);s.add(halo);
   const tex=dynamicTexture(256,160),plate=add(s,new THREE.PlaneGeometry(.084,.0525),new THREE.MeshBasicMaterial({map:tex.tex,toneMapped:false}),v3(0,.075,.0305),{cast:false});
   return{group:s,head,rod,lamp,halo,tex,plate,name};});
  // the package: a small glowing cube (cover motif)
  this.packet=add(g,new THREE.BoxGeometry(.028,.028,.028),new THREE.MeshBasicMaterial({color:0xff6534,toneMapped:false}),v3(ST_X(0),.768,RAIL_Z),{cast:false});
  this.packetEdges=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(.03,.03,.03)),new THREE.LineBasicMaterial({color:0xffc2a8}));this.packet.add(this.packetEdges);
  this.packetLight=new THREE.PointLight(0xff6534,.0,.6,2);this.packet.add(this.packetLight);
  // the commit graph: a cable from the Enter key to the start of the rail, newest commit next to the key; three
  // earlier commits dim, the release commit bright (after COMMIT), the next commit as an open ring (after NEXT_NOTE)
  const pts=[P.enter.clone().add(v3(-.05,.004,0)),v3(-1.12,.744,-1.3),v3(-1.42,.744,-1.34),v3(-1.66,.744,-1.42),v3(-1.7,.748,RAIL_Z)];
  this.cable=new THREE.CatmullRomCurve3(pts);add(g,new THREE.TubeGeometry(this.cable,64,.0028,6,false),new THREE.MeshBasicMaterial({color:0x8a3a1c,toneMapped:false}),v3(0,0,0),{cast:false});
  this.commitNodes=[.78,.62,.46,.28,.12].map((u,i)=>{const p=this.cable.getPoint(u);const m=add(g,i<4?new THREE.SphereGeometry(.009,12,8):new THREE.TorusGeometry(.009,.0025,8,24),new THREE.MeshBasicMaterial({color:0xff6534,toneMapped:false,transparent:true}),p.add(v3(0,.004,0)),{cast:false,rot:i<4?null:[-Math.PI/2,0,0]});return m;});
  // gate words over BUILD, CHECK and LIVE; the LIVE projection (preview) and the bridge cards
  this.gateWords=[1,2,4].map((i,k)=>{const tex=dynamicTexture(512,160),m=add(g,new THREE.PlaneGeometry(.15,.047),new THREE.MeshBasicMaterial({map:tex.tex,transparent:true,toneMapped:false,depthWrite:false}),P.station(i).clone().add(v3(0,.245,.03)),{cast:false});m.renderOrder=12;return{m,tex,i,word:['BUILD.','CHECK.','LIVE.'][k]};});
  this.projTex=canvasTexture(512,320,(c,w,h)=>{c.strokeStyle='rgba(255,101,52,.95)';c.lineWidth=6;c.strokeRect(8,8,w-16,h-16);c.fillStyle='rgba(255,101,52,.18)';c.fillRect(8,8,w-16,44);c.lineWidth=3;for(let i=0;i<6;i++)c.strokeRect(30+i*78,80,64,64);for(let i=0;i<4;i++){c.fillStyle='rgba(255,101,52,.35)';c.fillRect(30,180+i*30,w-60,16);}font(c,30,600);c.fillStyle='rgba(255,140,100,.95)';c.fillText('LIVE',30,40);});
  this.projection=add(g,new THREE.PlaneGeometry(.22,.1375),new THREE.MeshBasicMaterial({map:this.projTex,transparent:true,toneMapped:false,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}),P.station(4).clone().add(v3(0,.31,-.04)),{cast:false});
  this.cards=TXT.bridge.map((word,i)=>{const tex=canvasTexture(512,320,(c,w,h)=>{c.fillStyle='#161C27';c.fillRect(0,0,w,h);c.strokeStyle='#FF6534';c.lineWidth=10;c.strokeRect(5,5,w-10,h-10);let z=150;font(c,z,700);while(c.measureText(word).width>w-60){z-=4;font(c,z,700);}c.fillStyle='#F4F3EA';c.textAlign='center';c.fillText(word,w/2,h/2+z*.36);});
   const m=add(g,new THREE.PlaneGeometry(.09,.05625),new THREE.MeshBasicMaterial({map:tex,transparent:true,toneMapped:false}),v3(),{cast:false});m.material.color.setScalar(.85);m.visible=false;m.renderOrder=11;return m;});
 }
 buildPerson(){
  const body=std(0x2c3442,.75),skin=std(0x58647a,.7),p=this.person=new THREE.Group();this.scene.add(p);
  const limb=r=>add(p,new THREE.CylinderGeometry(r,r*.85,1,14),body,v3());
  this.torso=add(p,new THREE.CapsuleGeometry(.155,.34,6,14),body,v3());this.torso.scale.set(1.15,1,.72);
  this.neck=add(p,new THREE.CylinderGeometry(.045,.05,.08,10),skin,v3());this.headM=add(p,new THREE.SphereGeometry(.092,20,16),skin,v3());this.headM.scale.set(.88,1.1,1);
  this.hair=add(p,new THREE.SphereGeometry(.096,20,12,0,Math.PI*2,0,Math.PI*.5),std(0x1c2028,.9),v3());this.hair.scale.set(.9,1.12,1.02);
  this.arm={R:{u:limb(.042),f:limb(.036),h:add(p,new THREE.CapsuleGeometry(.03,.05,4,10),skin,v3())},L:{u:limb(.042),f:limb(.036),h:add(p,new THREE.CapsuleGeometry(.03,.05,4,10),skin,v3())}};
  this.legs=[limb(.06),limb(.05),limb(.06),limb(.05)];
 }
 buildExterior(){
  const s=this.scene,ext=this.exterior=new THREE.Group();s.add(ext);
  const plaster=std(0x5a5c62,.9),plaster2=std(0x3e444d,.9),W0=-1.85,W1=-.35,Y0=.9,Y1=2.2,x=-2.08,ZA=-14,ZB=10,YA=-9.3,YB=12;
  box(ext,.06,YB-YA,W0-ZA,plaster,x,(YA+YB)/2,(ZA+W0)/2,{});box(ext,.06,YB-YA,ZB-W1,plaster,x,(YA+YB)/2,(W1+ZB)/2,{});box(ext,.06,Y0-YA,W1-W0,plaster,x,(YA+Y0)/2,(W0+W1)/2,{});box(ext,.06,YB-Y1,W1-W0,plaster,x,(Y1+YB)/2,(W0+W1)/2,{});
  box(ext,.4,.3,ZB-ZA+.4,std(0x3a3d43,.8),x-.15,YB,(ZA+ZB)/2);for(let n=-3;n<=3;n++)box(ext,.08,.12,ZB-ZA,std(0x4c4f56,.8),x-.04,.75+n*3,(ZA+ZB)/2,{});
  const pane=new THREE.PlaneGeometry(1.5,1.3),ours=[],opp=[];for(let k=-4;k<=3;k++)for(let n=-3;n<=3;n++){if(k===0&&n===0)continue;ours.push([-1.1+k*3,1.55+n*3]);}
  for(let k=-5;k<=4;k++)for(let n=-3;n<=3;n++)opp.push([-1.1+k*3+1.2,1.55+n*3]);
  const mk=count=>{const mesh=new THREE.InstancedMesh(pane,new THREE.MeshBasicMaterial({color:0xffffff}),count);ext.add(mesh);return mesh;};const dm=new THREE.Object3D(),col=new THREE.Color();
  const A=mk(ours.length),B=mk(opp.length);
  ours.forEach(([z,y],i)=>{dm.position.set(x-.06,y,z);dm.rotation.set(0,-Math.PI/2,0);dm.updateMatrix();A.setMatrixAt(i,dm.matrix);A.setColorAt(i,col.set(random(i*5+1)>.82?0x6a5232:0x151c28));});
  opp.forEach(([z,y],i)=>{dm.position.set(-15.955,y,z);dm.rotation.set(0,Math.PI/2,0);dm.updateMatrix();B.setMatrixAt(i,dm.matrix);B.setColorAt(i,col.set(random(i*11+3)>.78?(random(i)>.5?0xffc27a:0x8fb7e0):0x141b26));});
  const trims=new THREE.InstancedMesh(new THREE.BoxGeometry(.05,1.42,1.62),std(0x4a4d53,.6),ours.length+opp.length);ours.forEach(([z,y],i)=>{dm.position.set(x-.03,y,z);dm.rotation.set(0,0,0);dm.updateMatrix();trims.setMatrixAt(i,dm.matrix);});
  opp.forEach(([z,y],i)=>{dm.position.set(-15.99,y,z);dm.updateMatrix();trims.setMatrixAt(ours.length+i,dm.matrix);});ext.add(trims);
  box(ext,.3,YB-YA+3,30,plaster2,-16.15,(YA+YB+3)/2,-2,{});box(ext,.4,.3,30,std(0x30343a,.8),-15.9,YB+3,-2);
  box(ext,14,.1,40,std(0x26282c,.9),-9,YA-.05,-2,{cast:false});box(ext,2.2,.16,40,std(0x3d3c39,.85),-3.2,YA+.03,-2,{cast:false});box(ext,2.2,.16,40,std(0x3d3c39,.85),-14.8,YA+.03,-2,{cast:false});
  for(const z of[-10,-2,6]){box(ext,.08,6,.08,std(0x30343a,.5,.6),-4,YA+3,z);add(ext,new THREE.SphereGeometry(.18,12,8),new THREE.MeshBasicMaterial({color:0xffc98a}),v3(-4.3,YA+6,z),{cast:false});}
  // distant towers with a few lit windows (the night city of the cover)
  for(let i=0;i<12;i++){const h=10+random(i)*22,tw=std(0x161b24,.95),bx=-34-random(i+4)*26,bz=-44+i*8;box(ext,6,h,6,tw,bx,YA+h/2,bz,{cast:false});
   for(let k=0;k<5;k++){if(random(i*9+k)>.55)continue;box(ext,.1,.5,1.2,new THREE.MeshBasicMaterial({color:random(k+i)>.5?0xffb866:0x7aa6d6}),bx+3.06,YA+3+random(i*3+k)*(h-4),bz-1.5+random(k*5+i)*3,{cast:false});}}
  this.cursorDot=new THREE.Sprite(new THREE.SpriteMaterial({color:0xffffff,transparent:true,depthWrite:false,toneMapped:false,map:canvasTexture(64,64,(c)=>{const gr=c.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,170,130,.9)');gr.addColorStop(1,'rgba(255,101,52,0)');c.fillStyle=gr;c.fillRect(0,0,64,64);})}));
  this.cursorDot.position.copy(P.note).add(v3(0,.01,0));this.cursorDot.scale.setScalar(.05);this.cursorDot.renderOrder=20;this.cursorDot.visible=false;s.add(this.cursorDot);
 }
 buildLights(){
  const s=this.scene;this.hemi=new THREE.HemisphereLight(0x5a6e94,0x2a241e,.8);s.add(this.hemi);
  this.lampLight=new THREE.SpotLight(0xffd9b4,3.0,6,1.05,.75,2);this.lampLight.position.copy(P.lamp).add(v3(0,-.03,0));this.lampLight.target.position.set(-.7,.74,-1.35);this.lampLight.castShadow=true;this.lampLight.shadow.mapSize.set(1024,1024);this.lampLight.shadow.bias=-.0015;this.lampLight.shadow.radius=3;s.add(this.lampLight,this.lampLight.target);
  this.fill=new THREE.PointLight(0x8aa0d0,1.1,9,2);this.fill.position.set(.3,2.4,.4);s.add(this.fill);
  this.screenLight=new THREE.SpotLight(0xaad0ff,.55,2.2,.9,1,2);this.screenLight.position.copy(P.screen).add(v3(0,.06,.3));this.screenLight.target.position.copy(P.screen).add(v3(0,-.1,.8));s.add(this.screenLight,this.screenLight.target);
  this.railLight=new THREE.PointLight(0xff6534,.5,1.2,2);this.railLight.position.set(-1.3,.95,-1.42);s.add(this.railLight);
  this.rim=new THREE.DirectionalLight(0x44dde5,.35);this.rim.position.set(-3,2.5,-3);this.rim.target.position.set(-1,.8,-1.4);s.add(this.rim,this.rim.target);
  this.moon=new THREE.DirectionalLight(0x7d93c8,.45);this.moon.position.set(-12,8,3);this.moon.target.position.set(-.8,.8,-1.1);s.add(this.moon,this.moon.target);
  this.street=new THREE.PointLight(0xffc98a,14,30,1.6);this.street.position.set(-4.3,-3.3,-2);s.add(this.street);
 }
 // ---- floating panels of the project shots (the same UI surfaces as the 2D views)
 buildProject(){
  const s=this.scene;this.panels=[];
  for(let i=0;i<6;i++){const tex=dynamicTexture(1024,640),m=new THREE.Mesh(new THREE.PlaneGeometry(.48,.3),new THREE.MeshBasicMaterial({map:tex.tex,toneMapped:false,transparent:true,side:THREE.DoubleSide,depthWrite:true}));
   m.visible=false;m.renderOrder=5;s.add(m);const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(.48,.3)),new THREE.LineBasicMaterial({color:0x44dde5,transparent:true,opacity:.7}));m.add(edge);this.panels.push({mesh:m,tex,edge});}
 }
 update(t,a,shot,{gateWords=false,projection=false,cards=false}={}){
  const e=a.energy,acc=a.accent??0,drop=a.drop??0,att=a.attack??0;
  this.lampLight.intensity=2.6+.5*e+.8*acc;this.fill.intensity=1.0;this.screenLight.intensity=.55*(1+.15*e);
  // laptop display = the app at this moment
  this.screenTex.set(`${Math.round(t*30)}`,(g,w,h)=>drawLaptop(g,w,h,t));
  // stations: lamp colour from the model; presses stamp on their own events, passed presses nod with measured onsets
  const st=STATIONS.map((_,i)=>station(i,t));
  this.st.forEach((s,i)=>{const state=st[i],col=LAMP_COL[state],run=state==='run',pulse=run?.55+.45*Math.abs(Math.sin(t*7)):state==='preview'?.35+.25*Math.abs(Math.sin(t*2.5)):state==='off'?0:1;
   s.lamp.material.color.setHex(col).multiplyScalar(state==='off'?1:lerp(.5,1.1,pulse));s.halo.material.color.setHex(col).multiplyScalar(state==='off'?0:.45*pulse+.3*drop);s.halo.scale.setScalar(.03+.012*pulse+.02*drop);
   let stamp=run?clamp(att*1.2):0;if(state==='pass'||state==='fail')stamp=Math.max(stamp,.25*clamp(att-.3)+.6*drop);
   const ev=[[1,BUILD_PASS],[2,CHECK_FAIL],[2,CHECK_PASS],[3,UPLOAD_DONE],[4,LIVE_VERIFIED]].filter(([k])=>k===i).map(([,x])=>t-x).filter(x=>x>=0&&x<.35);if(ev.length)stamp=Math.max(stamp,Math.sin(Math.PI*ev[0]/.35));
   s.head.position.y=.13-.042*stamp;s.rod.position.y=.148-.02*stamp;
   s.tex.set(`${state}|${Math.round(pulse*4)}`,(g,w,h)=>{g.fillStyle='#0D1118';g.fillRect(0,0,w,h);const c=state==='off'?'#4C5566':'#'+new THREE.Color(col).getHexString();icon(g,i,58,74,70,c);fitText(g,s.name,110,72,140,34,state==='off'?'#6B7484':'#F4F3EA',700);font(g,24,600);g.fillStyle=c;g.fillText(TXT.status[state],110,112);});});
  // the rail groove lights up to the package
  const p=packet(t),x0=ST_X(0)-.11,x1=railX(p);this.groove.scale.x=Math.max(.001,x1-x0);this.groove.position.x=(x0+x1)/2;
  const pc=packetColor(t),pcol=pc==='fail'?0xf04d4d:pc==='pass'?0xd1f85d:0xff6534;this.packet.position.set(x1,.768+.004*Math.sin(t*3),RAIL_Z);this.packet.rotation.y=t*.6;this.packet.material.color.setHex(pcol);this.packetLight.color.setHex(pcol);this.packetLight.intensity=.12+.35*drop;
  this.railLight.intensity=.35+.9*drop+.3*acc;
  // Enter key press and shock ring
  const ep=enterPress(t);this.enterCap.position.y=.034-.009*ep.down;this.enterCap.material[2].emissiveIntensity=.35+1.6*ep.ring;this.enterRing.material.color.setHex(0xff6534).multiplyScalar(.5+1.5*ep.ring);
  this.shock.scale.setScalar(1+2.2*(1-ep.ring));this.shock.material.opacity=ep.ring*.9;this.shock.visible=ep.ring>0;
  // commits: four earlier ones dim; the release commit after COMMIT; the next commit (open ring) after NEXT_NOTE
  this.commitNodes.forEach((m,i)=>{if(i<3){m.material.color.setHex(0x8a3a1c);m.material.opacity=1;}else if(i===3){const k=smooth(COMMIT,COMMIT+.3,t);m.visible=k>0;m.scale.setScalar(.4+.6*k+.5*Math.max(0,1-(t-COMMIT)/.5)*(t>=COMMIT?1:0));m.material.color.setHex(0xff6534).multiplyScalar(1.4);}else{const k=smooth(NEXT_NOTE,NEXT_NOTE+.4,t);m.visible=k>0;m.material.opacity=k;m.material.color.setHex(0xF4F3EA);}});
  // gate words and projection
  this.gateWords.forEach(w=>{w.m.visible=gateWords;if(!gateWords)return;const state=st[w.i],col=state==='pass'?'#D1F85D':state==='preview'?'#FF6534':state==='fail'?'#F04D4D':'#F4F3EA';
   w.tex.set(`${w.word}|${state}`,(g,W,H)=>{g.clearRect(0,0,W,H);font(g,120,700);g.fillStyle=col;g.globalAlpha=state==='preview'?.55:1;g.textAlign='center';g.fillText(w.word,W/2,118);g.globalAlpha=1;});});
  const live=st[4];this.projection.visible=projection&&live==='preview';this.projection.material.opacity=.55+.25*Math.sin(t*9)*Math.sin(t*3.7);
  this.cards.forEach(c=>c.visible=false);
  this.note.visible=t>=NEXT_NOTE;if(this.note.visible){const k=ease(clamp((t-NEXT_NOTE)/.45));this.note.position.set(P.note.x,P.note.y+.08*(1-k),P.note.z);this.note.rotation.set(0,.18+.4*(1-k),0);}
  this.cursorDot.visible=false;
  this.pose(t);
 }
 // bridge cards: each card stands over its station from its start time
 setCards(list,t){list.forEach((c,i)=>{const m=this.cards[i];if(!m)return;const k=c.on?ease(clamp((t-c.start)/.18)):0;m.visible=k>0;if(!m.visible)return;
  m.position.set(-1.68+i*.1,.74+.27+(i%2)*.012,ST_Z+.03);m.scale.setScalar(lerp(.6,1,k));});}
 // ---- the person: hands type on the laptop, the left hand presses the big Enter key, the right one clicks
 pose(t){
  const press=[];for(const e of ENTERS)press.push([e-.28,'enterUp',.22],[e,'enterDown',.07],[e+.16,'enterUp',.12],[e+.55,'keysL',.35]);
  const kf={R:[[0,'keysR',0],[RELOAD1-.6,'pad',.4],[HARD_RELOAD-.2,'keysR',.25],[HARD_RELOAD+.4,'pad',.3],[SWITCH_EN-.05,'padDown',.08],[SWITCH_EN+.1,'pad',.1],[LINK_COPIED-.05,'padDown',.06],[LINK_COPIED+.08,'pad',.08],[PLAY-.05,'padDown',.06],[PLAY+.1,'pad',.1],[NEXT_NOTE-.4,'keysR',.5]],
   L:[[0,'keysL',0],...press,[HARD_RELOAD-.2,'keysL2',.25],[HARD_RELOAD+.5,'keysL',.3],[NEXT_NOTE+.6,'noteEdge',.6]]};
  const target=name=>({keysR:P.keysR,keysL:P.keysL,keysL2:P.keysL.clone().add(v3(-.03,0,.02)),pad:P.pad,padDown:P.pad.clone().add(v3(0,-.006,0)),enterUp:P.enter.clone().add(v3(0,.075,.01)),enterDown:P.enter.clone().add(v3(0,.048,.01)),noteEdge:P.note.clone().add(v3(.05,.01,.02))}[name]);
  const pos=list=>{list=list.slice().sort((a,b)=>a[0]-b[0]);let p=target(list[0][1]).clone();for(let i=1;i<list.length;i++){const[ta,name,dur]=list[i];if(t<ta-dur)break;const k=ease(clamp((t-(ta-dur))/Math.max(1e-3,dur)));p=p.lerp(target(name),k);}return p;};
  const typing=[[TYPE_BUILD,ENTER_BUILD],[TYPE_CHECK1,ENTER_CHECK1],[TYPE_MV,ENTER_MV],[TYPE_CHECK2,ENTER_CHECK2],[TYPE_COMMIT,ENTER_COMMIT],[TYPE_DEPLOY,ENTER_DEPLOY]].some(([a,b])=>t>=a&&t<b-.3);
  const R=pos(kf.R),L=pos(kf.L);if(typing){R.y+=.006*Math.max(0,Math.sin(t*23));L.y+=.006*Math.max(0,Math.sin(t*19+1))*(L.distanceTo(P.keysL)<.05?1:0);}
  const lean=.3+.15*clamp(1-L.distanceTo(P.enter)/.3),cz=this.chair.position.z,PX=-.55;
  const pelvis=v3(PX,.56,cz-.12),sh=pelvis.clone().add(v3(-.03*clamp(1-L.distanceTo(P.enter)/.3),.42*Math.cos(lean),-.42*Math.sin(lean)));
  setLimb(this.torso,pelvis,sh);this.torso.scale.set(1.15,1,.72);this.torso.position.copy(pelvis.clone().lerp(sh,.5));
  const neck=sh.clone().add(v3(0,.07,-.02));this.neck.position.copy(neck);this.headM.position.copy(neck.clone().add(v3(0,.12,-.07)));this.hair.position.copy(this.headM.position).add(v3(0,.004,.006));this.hair.rotation.x=.35;
  const shoulder={R:sh.clone().add(v3(.2,-.02,.02)),L:sh.clone().add(v3(-.2,-.02,.02))};
  for(const side of['R','L']){const tg=side==='R'?R:L,res=ik(shoulder[side],tg.clone().add(v3(0,.012,.04)),.3,.29,v3(side==='R'?.3:-.3,-1,.35)),arm=this.arm[side];
   setLimb(arm.u,shoulder[side],res.elbow);setLimb(arm.f,res.elbow,res.hand);arm.h.position.copy(res.hand).add(v3(0,-.006,-.035));arm.h.rotation.set(Math.PI/2-.15,0,0);arm.h.scale.set(1.25,1,.55);}
  const knee=[v3(PX-.12,.55,cz-.55),v3(PX+.12,.55,cz-.55)],foot=[v3(PX-.13,.08,cz-.6),v3(PX+.13,.08,cz-.6)];
  [[v3(PX-.1,.56,cz-.1),knee[0]],[knee[0],foot[0]],[v3(PX+.1,.56,cz-.1),knee[1]],[knee[1],foot[1]]].forEach(([a,b],i)=>setLimb(this.legs[i],a,b));
 }
 setPanels(list,t){this.panels.forEach((p,i)=>{const s=list[i];p.mesh.visible=!!s;if(!s)return;p.mesh.position.copy(s.pos);if(s.look)p.mesh.lookAt(s.look);else p.mesh.rotation.set(0,s.ry??0,0);p.mesh.scale.setScalar(s.scale??1);
  p.mesh.name=`Panel · ${s.kind}`;p.mesh.material.opacity=s.alpha??1;p.edge.material.opacity=(s.alpha??1)*.7;p.edge.material.color.set(s.edge??0x44dde5);const key=`${s.kind}|${Math.round(t*(s.live?20:2))}`;p.tex.set(key,(g,w,h)=>drawPanel(s.kind,g,w,h,t));});}
}
