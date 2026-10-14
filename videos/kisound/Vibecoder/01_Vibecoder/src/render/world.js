import * as THREE from 'three';
import {PALETTE,SHOT} from './config.js';
import {clamp,lerp,ease,smooth} from './timeline.js';
import {TXT,artifactStatus,beatSteps,catalog,pattern,app,clock,shotProgress} from './model.js';
import {drawArtifactCard,font,text,panel} from './draw.js';

const v=(x,y,z)=>new THREE.Vector3(x,y,z);
const std=(color,roughness=.8,metalness=.1)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const basic=color=>new THREE.MeshBasicMaterial({color,toneMapped:false});
function mesh(parent,geo,mat,pos){const m=new THREE.Mesh(geo,mat);m.position.copy(pos);parent.add(m);return m;}
function box(parent,size,pos,mat){return mesh(parent,new THREE.BoxGeometry(...size),mat,v(...pos));}
function cyl(parent,r1,r2,h,pos,mat,n=24){return mesh(parent,new THREE.CylinderGeometry(r1,r2,h,n),mat,v(...pos));}
function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return{canvas:c,texture:t};}
function addLabel(parent,word,{w=.65,h=.13,color='#F4F3EA',size=42}={}){const t=tex(512,128,g=>{g.clearRect(0,0,512,128);font(g,size,700,'mono');g.fillStyle=color;g.textAlign='center';g.fillText(word,256,84);});const m=mesh(parent,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:t.texture,transparent:true,depthWrite:false,toneMapped:false}),v(0,0,0));return m;}
function tube(parent,pts,color=PALETTE.orange,r=.015){const curve=new THREE.CatmullRomCurve3(pts.map(p=>v(...p)));const m=mesh(parent,new THREE.TubeGeometry(curve,64,r,8,false),basic(color),v(0,0,0));return m;}
const THREE_KEYS=['catalog','pattern','tool'];
const CARD_POS=[[-1.42,2.58,-.88],[0,2.62,-.72],[1.42,2.58,-.88]];

export class World{
 constructor(){
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x10141c);
  this.scene.fog=new THREE.FogExp2(0x10141c,.028);
  this.camera=new THREE.PerspectiveCamera(38,16/9,.03,80);
  this.ambient=new THREE.AmbientLight(0xb6c4d4,1.2);this.scene.add(this.ambient);
  this.keyLight=new THREE.PointLight(0xffa36f,28,9,2);this.keyLight.position.set(1.3,2.9,1.2);this.scene.add(this.keyLight);
  this.windowLight=new THREE.PointLight(0x8dd8fa,17,9,2);this.windowLight.position.set(-2.6,2.2,-1.6);this.scene.add(this.windowLight);
  const room=this.room=new THREE.Group();this.scene.add(room);
  const wall=std(0x222b36,.95),floor=std(0x202630,.95),desk=std(0x343b42,.73,.15),edge=std(0x8b6f55,.6,.22),steel=std(0x151d28,.45,.45);
  box(room,[8,.12,7],[0,-.06,0],floor);
  box(room,[8,4,.12],[0,2,-2.6],wall);
  box(room,[.12,4,7],[-3.9,2,0],std(0x1b2531,.95));
  box(room,[8,.15,.1],[0,3.68,-2.45],std(0x303944,.8));
  // One architectural frame is visible all day. Its sky and window light change with the song's day.
  const sky=this.sky=box(room,[2.0,1.65,.02],[-2.35,2.26,-2.52],basic(0x263a4f));
  for(const xx of[-3.4,-1.3])box(room,[.07,1.75,.08],[xx,2.26,-2.48],steel);
  for(const yy of[1.39,3.12])box(room,[2.16,.07,.08],[-2.35,yy,-2.48],steel);
  box(room,[.06,1.68,.08],[-2.35,2.26,-2.45],steel);
  box(room,[.85,.12,6],[-3.55,.78,.15],std(0x2d333d,.83));
  for(let k=0;k<8;k++){const y=.32+k*.42;box(room,[.04,.012,1.3],[-3.48,y,-1.95],std(0x192431,.9));}
  // Desk and laptop. The monitor canvas is the same catalog/pattern/tool view used by the cards.
  box(room,[4.2,.13,1.65],[.15,.78,.46],desk);
  box(room,[4.26,.045,1.72],[.15,.865,.46],edge);
  for(const x of[-1.75,2.0])for(const z of[-.12,1.0])box(room,[.09,.74,.09],[x,.38,z],steel);
  box(room,[1.9,.04,1.2],[-.17,.92,.5],std(0x1d2025,.4,.5));
  this.monitor=box(room,[2.25,1.42,.07],[-.17,1.72,-.43],steel);this.monitor.rotation.x=-.06;
  const mt=this.monitorTexture=tex(1024,640,g=>{g.fillStyle='#10141C';g.fillRect(0,0,1024,640);});
  this.monitorFace=mesh(room,new THREE.PlaneGeometry(2.10,1.28),new THREE.MeshBasicMaterial({map:mt.texture,toneMapped:false}),v(-.17,1.72,-.38));this.monitorFace.rotation.x=-.06;
  box(room,[.14,.55,.1],[-.17,1.06,-.46],steel);box(room,[.58,.03,.36],[-.17,.83,-.46],steel);
  const kb=box(room,[1.45,.04,.43],[-.17,.91,1.0],steel);kb.rotation.x=-.02;
  for(let r=0;r<4;r++)for(let c=0;c<18;c++){const key=box(room,[.063,.009,.067],[-.83+c*.078,.94,.84+r*.095],std(c===13&&r===3?0x69402c:0x46515e,.6));key.rotation.y=(c%4-1.5)*.004;}
  // Ceramic cup. Its still surface establishes that the coffee is cold.
  cyl(room,.14,.12,.26,[1.42,1.02,.87],std(0xd8d1c4,.45));cyl(room,.12,.12,.008,[1.42,1.155,.87],std(0x241a17,.9));
  const handle=mesh(room,new THREE.TorusGeometry(.08,.022,8,32,Math.PI*1.5),std(0xd8d1c4,.45),v(1.57,1.02,.87));handle.rotation.y=Math.PI/2;
  // A small desk clock, physical in both the first and final frame.
  box(room,[.65,.29,.19],[-1.78,.99,.84],steel);
  const ct=this.clockTexture=tex(384,160,g=>{g.fillStyle='#0B1018';g.fillRect(0,0,384,160);});
  mesh(room,new THREE.PlaneGeometry(.58,.2),new THREE.MeshBasicMaterial({map:ct.texture,toneMapped:false}),v(-1.78,.99,.943));
  // Engineer silhouette: shoulder and right hand act, the face never lip-syncs.
  const person=this.person=new THREE.Group();person.position.set(.15,0,1.68);room.add(person);
  const body=std(0x1c2530,.88),skin=std(0x6e7c87,.9);
  const torso=mesh(person,new THREE.CapsuleGeometry(.32,.63,6,16),body,v(0,1.10,0));torso.scale.set(1.15,1,.72);
  mesh(person,new THREE.SphereGeometry(.24,24,16),skin,v(0,1.82,-.09));
  const hair=mesh(person,new THREE.SphereGeometry(.25,24,12,0,Math.PI*2,0,Math.PI*.45),body,v(0,1.86,-.09));hair.scale.set(1.01,.9,1);
  const armL=mesh(person,new THREE.CylinderGeometry(.08,.075,.88,12),body,v(-.3,1.13,-.24));armL.rotation.z=-.5;armL.rotation.x=-.6;
  this.armR=mesh(person,new THREE.CylinderGeometry(.08,.065,.90,12),body,v(.33,1.13,-.28));this.armR.rotation.z=.5;this.armR.rotation.x=-.6;
  this.hand=mesh(person,new THREE.SphereGeometry(.095,16,12),skin,v(.56,.76,-.58));
  box(room,[.8,.1,.8],[.2,.52,1.65],std(0x202932,.7));box(room,[.8,.92,.12],[.2,1.04,2.05],std(0x25303b,.7));
  // The three named objects share their canvas data with the flat scene.
  this.cards=THREE_KEYS.map((kind,i)=>{
   const canvas=tex(512,352,g=>drawArtifactCard(g,kind,0));
   const group=new THREE.Group();this.scene.add(group);
   const face=mesh(group,new THREE.PlaneGeometry(1.16,.8),new THREE.MeshBasicMaterial({map:canvas.texture,toneMapped:false,side:THREE.DoubleSide}),v(0,0,0));
   const rim=box(group,[1.2,.84,.028],[0,0,-.025],std(i===0?0x514139:0x263544,.6,.3));
   const light=mesh(group,new THREE.PlaneGeometry(1.18,.012),basic(0xff6534),v(0,-.42,.02));
   const tiles=[];if(kind==='pattern')for(let row=0;row<4;row++)for(let step=0;step<16;step++){
    const px=45+step*27,py=136+row*47;
    const tile=box(group,[.045,.071,.025],[(px/512-.5)*1.16,(.5-py/352)*.8,.032],basic(row===3?0xff6534:0x44dde5));
    tile.name=`Step ${row+1}.${String(step+1).padStart(2,'0')}`;tile.visible=false;tiles.push({tile,row,step});
   }
   group.position.set(...CARD_POS[i]);return{group,canvas,face,rim,light,kind,tiles};
  });
  this.rail=new THREE.Group();this.scene.add(this.rail);
  tube(this.rail,[[-1.42,2.06,-.79],[-.70,2.00,-.70],[0,2.06,-.64],[.70,2.00,-.70],[1.42,2.06,-.79]],0x593224,.012);
  this.railActive=box(this.rail,[2.84,.018,.018],[0,2.02,-.55],basic(0xff6534));
  this.railDot=mesh(this.rail,new THREE.SphereGeometry(.055,20,14),basic(0xff6534),v(-1.42,2.02,-.52));
  this.title=new TitleStack(this.scene);
  this.annotate();
  this.lastCardKey='';this.lastMonitorKey='';this.lastClock='';
 }
 annotate(){const tag=(o,name,inspect)=>{o.name=name;if(inspect)o.traverse(m=>{m.userData.inspect=inspect;if(m!==o&&!m.name)m.name=name;});};
  tag(this.room,'Arbeitszimmer');tag(this.person,'Person am Arbeitsplatz');
  tag(this.monitorFace,'Arbeitsmonitor',t=>({scene:'catalog → pattern → tool',catalog:catalog(t),pattern:pattern(t),tool:app(t)}));
  this.cards.forEach(c=>tag(c.group,c.kind==='catalog'?'catalog_export':c.kind==='pattern'?'track_pattern':'tool_selection',t=>({artifact:c.kind,status:c.kind==='catalog'?catalog(t):c.kind==='pattern'?pattern(t):app(t),source:'shared canvas'})));
  tag(this.rail,'orange_rail',t=>({verified:artifactStatus(t).filter(i=>i.state==='pass').length,meaning:'input → output → test'}));
  tag(this.title.group,'VIBECODER · räumliche Titelmarke',t=>({visible:[3,24,43,57,64].some(id=>SHOT[`S${String(id).padStart(3,'0')}`]?.start<=t&&t<SHOT[`S${String(id).padStart(3,'0')}`]?.end)}));
 }
 update(t,shot,a){const id=Number(shot.id.slice(1)),ch=shot.chapter;
  const day=ch==='intro'||ch==='prelude'||ch==='verse_1'||ch==='build'||ch==='drop_1'?'morning':ch==='break'||ch==='verse_2'&&id<38?'noon':'night';
  this.scene.background.setHex(day==='morning'?0x263543:day==='noon'?0x3c4950:0x10141c);
  this.scene.fog.color.copy(this.scene.background);
  this.sky.material.color.setHex(day==='morning'?0x7692a3:day==='noon'?0xbec1ac:0x202d44);
  const tail=.55+.45*a.atmosphere;
  this.ambient.intensity=(day==='noon'?1.75:day==='morning'?1.4:.84)*tail;
  this.keyLight.intensity=(day==='night'?27:day==='noon'?16:12)*(1+.08*a.energy)*tail;
  this.windowLight.intensity=(day==='noon'?29:day==='morning'?22:6)*tail;
  this.person.visible=!['project','type'].includes(shot.zone)||['S065','S066'].includes(shot.id);
  this.armR.rotation.z=.5+.15*Math.sin(t*3.2);this.hand.position.x=.56+.08*Math.sin(t*3.2);
  const label=clock(t);if(label!==this.lastClock){this.lastClock=label;const g=this.clockTexture.canvas.getContext('2d');g.fillStyle='#0B1018';g.fillRect(0,0,384,160);text(g,label,192,111,92,'#FF6534',700,'mono','center');this.clockTexture.texture.needsUpdate=true;}
  // Redraw from the exact same model as the full-screen composition. Quantized to 100 ms for performance.
  const key=`${Math.floor(t*10)}:${catalog(t)}:${pattern(t)}:${app(t)}`;
  if(key!==this.lastCardKey){this.lastCardKey=key;this.cards.forEach(c=>{drawArtifactCard(c.canvas.canvas.getContext('2d'),c.kind,t);c.canvas.texture.needsUpdate=true;});}
  const monKey=`${Math.floor(t*10)}:${shot.chapter}:${catalog(t)}:${pattern(t)}:${app(t)}`;
  if(monKey!==this.lastMonitorKey){this.lastMonitorKey=monKey;this.drawMonitor(t,shot,a);this.monitorTexture.texture.needsUpdate=true;}
  const focus=ch==='intro'||ch==='prelude'||ch==='verse_1'||ch==='build'||ch==='drop_1'?0:ch==='break'||ch==='verse_2'&&id<38?1:2;
  const titleOnly=[3,24,43].includes(id);
  const isProject=(shot.zone==='project'||shot.mode==='2D+3D'||['final_drop','bridge'].includes(ch))&&!titleOnly;
  const reveal=smooth(SHOT.S005.start,SHOT.S005.start+1.2,t)*(1-smooth(SHOT.S065.start+1,SHOT.S065.end-.25,t));
  this.cards.forEach((c,i)=>{const active=i===focus,from=v(-.17,1.72,-.37),to=v(...CARD_POS[i]),k=ease(reveal);
   if(i===1&&[32,36].includes(id))to.y=3.08;
   c.group.position.copy(from.lerp(to,k));c.group.rotation.x=lerp(-.06,0,k);c.group.rotation.y=(i-1)*.16*k;
   const targetScale=active?.82:.68;c.group.scale.set(lerp(1.81,targetScale,k),lerp(1.6,targetScale,k),1);
   c.group.visible=(isProject||id>=57)&&reveal>.02;
   c.face.material.opacity=active?1:.7;c.face.material.transparent=true;
   c.light.material.color.setHex(i===0&&catalog(t)==='verified'||i===1&&pattern(t)==='ready'||i===2&&app(t)==='verified'?0xd1f85d:0xff6534);
  });
  const steps=beatSteps(t);this.cards[1].tiles.forEach(({tile,row,step})=>{tile.visible=steps[row][step];tile.position.z=.032+(row===3?.002*a.sub:0);});
  this.rail.visible=(isProject||id>=57)&&reveal>.02;
  const done=artifactStatus(t).filter(x=>x.state==='pass').length,p=.10+done*.30;
  this.railActive.scale.x=clamp(p,.1,1);this.railActive.position.x=-1.42+1.42*clamp(p,.1,1);
  this.railDot.position.x=-1.42+2.84*clamp(p,.1,1);this.railDot.scale.setScalar(1+Math.min(.03,a.sub*.03));
  this.title.update(t,shot,a,this.camera);
  this.setCamera(t,shot);
  // The title faces the final camera. No state carries from one frame to the next.
  this.title.place(this.camera,t,shot);
 }
 drawMonitor(t,shot,a){const g=this.monitorTexture.canvas.getContext('2d');g.fillStyle='#10141C';g.fillRect(0,0,1024,640);
  panel(g,20,20,984,600,{fill:'#171F2A',stroke:'#3A4A5C',shadow:false});text(g,'kisound  /  VIBECODER',50,75,33,'#F4F3EA',700);
  const id=Number(shot.id.slice(1));const kind=id<30?'catalog':id<38?'pattern':'tool';
  // The thumbnail has its own source canvas; scale the same object into the physical monitor.
  const source=this.cards[THREE_KEYS.indexOf(kind)].canvas.canvas;g.drawImage(source,58,120,590,405);
  panel(g,690,130,265,92,{fill:'#10141C',stroke:'#FF6534',shadow:false});text(g,TXT.agent,720,185,33,'#FF6534',700,'mono');
  text(g,id<30?'CATALOG.CSV':id<38?'OWN BEAT':'TRACK TOOL',700,285,24,'#ADB8C6',500,'mono');
  const fileReady=['file_pass','first_pass','edge_fail','edge_fix','verified'].includes(catalog(t));
  text(g,fileReady?'FILE PASS':'FILE WAIT',700,362,24,fileReady?'#D1F85D':'#FF6534',700,'mono');
  text(g,pattern(t)==='ready'?'SOUND READY':'SOUND OPEN',700,427,24,pattern(t)==='ready'?'#D1F85D':'#ADB8C6',700,'mono');
  const appFail=['lost','wrong_key','wrong_selection'].includes(app(t));
  text(g,app(t)==='verified'?'RELOAD PASS':appFail?'RELOAD FAIL':'APP OPEN',700,492,24,app(t)==='verified'?'#D1F85D':appFail?'#F04D4D':'#ADB8C6',700,'mono');
 }
 setCamera(t,shot){const id=Number(shot.id.slice(1)),u=ease(shotProgress(t,shot));let from,to,target=v(0,1.5,-.3),fov=38;
  if(id===1){from=v(-5.5,2.5,4.8);to=v(-2.5,1.9,3.1);target=v(-.3,1.4,-.4);fov=34;}
  else if(id===66){from=v(-4.1,2.05,4.4);to=v(-3.25,1.88,3.65);target=v(-.25,1.65,-.35);fov=38;}
  else if([7,9,10,27,33,38,42,50,51,52,55,70,71,72].includes(id)){
   from=v(-3.0,1.8,2.8);to=v(-2.3,1.6,2.55);target=id===10?v(1.4,1.05,.8):id===9||id===33||id===66?v(-1.7,1.1,.82):v(-.2,1.45,-.1);fov=id===66?36:42;
  }else if([32,36].includes(id)){
   from=v(1.4,2.72,2.3);to=v(1.1,2.58,2.0);target=v(.55,2.56,-.72);fov=36;
  }else if(['project','type'].includes(shot.zone)||['final_drop'].includes(shot.chapter)){
   const yaw=(id%5-2)*.28;from=v(2.0*Math.sin(yaw)-.9,2.4,4.6);to=v(2.0*Math.sin(yaw+.25)-.5,2.20,4.0);target=v(0,2.25,-.62);fov=38;
  }else if(shot.zone==='desk'){
   from=v(1.8,1.45,2.15);to=v(1.2,1.2,1.75);target=v(.3,.99,.62);fov=38;
  }else{
   from=v(-2.9,1.8,2.9);to=v(-2.4,1.7,2.4);target=v(-.1,1.4,-.2);fov=38;
  }
  this.camera.position.copy(from.lerp(to,u));this.camera.lookAt(target);this.camera.fov=fov;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
 }
}

class TitleStack{
 constructor(scene){this.group=new THREE.Group();this.group.visible=false;scene.add(this.group);
  const front=tex(2048,1024,g=>{g.clearRect(0,0,2048,1024);g.textAlign='center';font(g,450,700);g.fillStyle='#F4F3EA';g.fillText('VIBE',1024,450);g.fillStyle='#FF6534';g.fillText('CODER',1024,885);});
  this.texture=front.texture;this.layers=[];
  for(let i=0;i<14;i++){const m=mesh(this.group,new THREE.PlaneGeometry(2.9,1.45),new THREE.MeshBasicMaterial({map:this.texture,transparent:true,alphaTest:.25,depthWrite:true,toneMapped:false,side:THREE.DoubleSide}),v(0,0,-i*.010));
   m.renderOrder=30-i;if(i)m.material.color.setScalar(lerp(.70,.20,i/13));this.layers.push(m);}
 }
 update(t,shot,a){const id=Number(shot.id.slice(1));this.group.visible=[3,24,43,57,64].includes(id);
  if(!this.group.visible)return;
  const depth=id===3?.20:id===24?.55:id===43?.72:1,alpha=Math.min(1,smooth(shot.start,shot.start+.18,t))*(1-smooth(shot.end-.15,shot.end,t));
  this.layers.forEach((m,i)=>{m.position.z=-i*.014*depth;m.material.opacity=alpha;});
  this.group.scale.setScalar((id===57||id===64?1.22:1)*(1+Math.min(.03,a.sub*.03)));
 }
 place(camera){if(!this.group.visible)return;const dir=new THREE.Vector3();camera.getWorldDirection(dir);this.group.position.copy(camera.position).addScaledVector(dir,2.6);this.group.quaternion.copy(camera.quaternion);}
}
