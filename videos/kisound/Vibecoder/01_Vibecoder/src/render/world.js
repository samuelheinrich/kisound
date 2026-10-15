import * as THREE from 'three';
import {PALETTE,SHOT} from './config.js';
import {clamp,lerp,ease,smooth} from './timeline.js';
import {TXT,artifactStatus,beatSteps,catalog,pattern,app,placeAt,clock} from './model.js';
import {drawArtifactCard,font,text,panel} from './draw.js';
import {Places} from './places.js';

const v=(x,y,z)=>new THREE.Vector3(x,y,z);
const std=(color,roughness=.8,metalness=.1)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const basic=color=>new THREE.MeshBasicMaterial({color,toneMapped:false});
function mesh(parent,geo,mat,pos){const m=new THREE.Mesh(geo,mat);m.position.copy(pos);parent.add(m);return m;}
function box(parent,size,pos,mat){return mesh(parent,new THREE.BoxGeometry(...size),mat,v(...pos));}
function tex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'));const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return{canvas:c,texture:t};}
function tube(parent,pts,color=PALETTE.orange,r=.015){const curve=new THREE.CatmullRomCurve3(pts.map(p=>v(...p)));const m=mesh(parent,new THREE.TubeGeometry(curve,64,r,8,false),basic(color),v(0,0,0));return m;}
const THREE_KEYS=['catalog','pattern','tool'];
const CARD_POS=[[-1.42,2.58,-.88],[0,2.62,-.72],[1.42,2.58,-.88]];

export class World{
 constructor(){
  this.scene=new THREE.Scene();this.scene.background=new THREE.Color(0x10141c);
  this.scene.fog=new THREE.FogExp2(0x10141c,.028);
  this.camera=new THREE.PerspectiveCamera(38,16/9,.03,250);
  this.ambient=new THREE.AmbientLight(0xb6c4d4,1.2);this.scene.add(this.ambient);
  this.keyLight=new THREE.PointLight(0xffa36f,28,9,2);this.keyLight.position.set(1.3,2.9,1.2);this.scene.add(this.keyLight);
  this.windowLight=new THREE.PointLight(0x8dd8fa,17,9,2);this.windowLight.position.set(-2.6,2.2,-1.6);this.scene.add(this.windowLight);
  this.places=new Places(this.scene);
  this.monitorTexture=tex(960,540,g=>{g.fillStyle='#10141C';g.fillRect(0,0,960,540);});
  this.monitorFaces=this.places.deviceFaces;
  for(const face of this.monitorFaces)face.material=new THREE.MeshBasicMaterial({map:this.monitorTexture.texture,toneMapped:false,side:THREE.DoubleSide});
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
  this.lastCardKey='';this.lastMonitorKey='';
 }
 annotate(){const tag=(o,name,inspect)=>{o.name=name;if(inspect)o.traverse(m=>{m.userData.inspect=inspect;if(m!==o&&!m.name)m.name=name;});};
  for(const [name,group] of Object.entries(this.places.groups))group.name=`Schauplatz ${name}`;
  tag(this.places.traveler.group,'Vibecoder unterwegs');
  this.monitorFaces.forEach(face=>tag(face,'Laptop Display',t=>({scene:'catalog → pattern → tool',catalog:catalog(t),pattern:pattern(t),tool:app(t),place:placeAt(t)})));
  this.cards.forEach(c=>tag(c.group,c.kind==='catalog'?'catalog_export':c.kind==='pattern'?'track_pattern':'tool_selection',t=>({artifact:c.kind,status:c.kind==='catalog'?catalog(t):c.kind==='pattern'?pattern(t):app(t),source:'shared canvas'})));
  tag(this.rail,'orange_rail',t=>({verified:artifactStatus(t).filter(i=>i.state==='pass').length,meaning:'input → output → test'}));
  tag(this.title.group,'VIBECODER · räumliche Titelmarke',t=>({visible:[2,3,21,24,43,57,64].some(id=>SHOT[`S${String(id).padStart(3,'0')}`]?.start<=t&&t<SHOT[`S${String(id).padStart(3,'0')}`]?.end)}));
 }
 update(t,shot,a,screenZoom=0){const id=Number(shot.id.slice(1)),ch=shot.chapter;
  this.places.update(t,shot,a,this.ambient,this.keyLight,this.windowLight);
  this.places.camera(t,shot,this.camera,screenZoom);
  // Redraw from the exact same model as the full-screen composition. Quantized to 100 ms for performance.
  const key=`${Math.floor(t*10)}:${catalog(t)}:${pattern(t)}:${app(t)}`;
  if(key!==this.lastCardKey){this.lastCardKey=key;this.cards.forEach(c=>{drawArtifactCard(c.canvas.canvas.getContext('2d'),c.kind,t);c.canvas.texture.needsUpdate=true;});}
  const monKey=`${Math.floor(t*10)}:${shot.chapter}:${catalog(t)}:${pattern(t)}:${app(t)}`;
  if(monKey!==this.lastMonitorKey){this.lastMonitorKey=monKey;this.drawMonitor(t,shot,a);this.monitorTexture.texture.needsUpdate=true;}
  const focus=ch==='intro'||ch==='prelude'||ch==='verse_1'||ch==='build'||ch==='drop_1'?0:ch==='break'||ch==='verse_2'&&id<38?1:2;
  const titleOnly=[2,3,21,24,43].includes(id);
  const isProject=(shot.zone==='project'||shot.mode==='2D+3D'||['final_drop','bridge'].includes(ch))&&!titleOnly;
  const reveal=smooth(SHOT.S005.start,SHOT.S005.start+1.2,t)*(1-smooth(SHOT.S065.start+1,SHOT.S065.end-.25,t));
  const place=placeAt(t),riding=place==='coaster',scenic=place==='cafe'||place==='forest';
  const forward=new THREE.Vector3(),right=new THREE.Vector3(),up=new THREE.Vector3();
  if(riding){this.camera.getWorldDirection(forward);right.set(1,0,0).applyQuaternion(this.camera.quaternion);up.set(0,1,0).applyQuaternion(this.camera.quaternion);}
  this.cards.forEach((c,i)=>{const active=i===focus,from=v(-.35,1.32,.7),to=v(...CARD_POS[i]),k=ease(reveal);
   if(i===1&&[32,36].includes(id))to.y=3.08;
   if(riding){to.copy(this.camera.position).addScaledVector(forward,4.1).addScaledVector(right,(i-1)*1.35).addScaledVector(up,1.22);from.copy(to);}
   c.group.position.copy(from.lerp(to,k));c.group.rotation.set(lerp(-.06,0,k),(i-1)*.16*k,0);
   if(riding)c.group.quaternion.copy(this.camera.quaternion);
   const targetScale=riding?.70:active?.82:.68;c.group.scale.set(riding?targetScale:lerp(1.81,targetScale,k),riding?targetScale:lerp(1.6,targetScale,k),1);
   // Laptop and flat proof shots carry the data in the café and on the stormy
   // mountain; floating cards would cross the traveler or hide the weather.
   c.group.visible=riding?id===59&&this.places.pov<.5:!scenic&&screenZoom<.12&&(isProject||id>=57)&&reveal>.02;
   c.face.material.opacity=active?1:.7;c.face.material.transparent=true;
   c.light.material.color.setHex(i===0&&catalog(t)==='verified'||i===1&&pattern(t)==='ready'||i===2&&app(t)==='verified'?0xd1f85d:0xff6534);
  });
  const steps=beatSteps(t);this.cards[1].tiles.forEach(({tile,row,step})=>{tile.visible=steps[row][step];tile.position.z=.032+(row===3?.002*a.sub:0);});
  this.rail.visible=!riding&&!scenic&&(isProject||id>=57)&&reveal>.02;
  this.rail.position.set(0,0,0);
  const done=artifactStatus(t).filter(x=>x.state==='pass').length,p=.10+done*.30;
  this.railActive.scale.x=clamp(p,.1,1);this.railActive.position.x=-1.42+1.42*clamp(p,.1,1);
  this.railDot.position.x=-1.42+2.84*clamp(p,.1,1);this.railDot.scale.setScalar(1+Math.min(.03,a.sub*.03));
  this.title.update(t,shot,a,this.camera);
  // The title faces the final camera. No state carries from one frame to the next.
  this.title.place(this.camera,t,shot);
 }
 drawMonitor(t,shot){const g=this.monitorTexture.canvas.getContext('2d');g.fillStyle='#10141C';g.fillRect(0,0,960,540);
  panel(g,12,10,936,520,{fill:'#171F2A',stroke:'#3A4A5C',shadow:false,r:14});
  text(g,'KISOUND / 01',32,55,27,'#44DDE5',700,'mono');
  text(g,`${placeAt(t).toUpperCase()}  /  ${clock(t)}`,928,55,23,'#ADB8C6',600,'mono','right');
  const id=Number(shot.id.slice(1)),kind=id<30?'catalog':id<38?'pattern':'tool';
  const source=this.cards[THREE_KEYS.indexOf(kind)].canvas.canvas;g.drawImage(source,30,85,565,390);
  panel(g,622,88,300,72,{fill:'#10141C',stroke:'#FF6534',shadow:false,r:7});
  text(g,TXT.agent+' → DIFF → TEST',637,132,21,'#FF6534',700,'mono');
  const fileReady=['file_pass','first_pass','edge_fail','edge_fix','verified'].includes(catalog(t));
  text(g,fileReady?'FILE PASS':'FILE WAIT',640,237,27,fileReady?'#D1F85D':'#FF6534',700,'mono');
  text(g,pattern(t)==='ready'?'SOUND READY':'SOUND OPEN',640,313,27,pattern(t)==='ready'?'#D1F85D':'#ADB8C6',700,'mono');
  const appFail=['lost','wrong_key','wrong_selection'].includes(app(t));
  text(g,app(t)==='verified'?'RELOAD PASS':appFail?'RELOAD FAIL':'APP OPEN',640,389,27,app(t)==='verified'?'#D1F85D':appFail?'#F04D4D':'#ADB8C6',700,'mono');
  text(g,'SPEC   BUILD   TEST   FIX',640,463,21,'#ADB8C6',700,'mono');
 }
 setLaptopTexture(texture){for(const face of this.monitorFaces)face.material.map=texture;}

}

class TitleStack{
 constructor(scene){this.group=new THREE.Group();this.group.visible=false;scene.add(this.group);
  const front=tex(2048,1024,g=>{g.clearRect(0,0,2048,1024);g.textAlign='center';font(g,450,700);g.fillStyle='#F4F3EA';g.fillText('VIBE',1024,450);g.fillStyle='#FF6534';g.fillText('CODER',1024,885);});
  this.texture=front.texture;this.layers=[];
  for(let i=0;i<14;i++){const m=mesh(this.group,new THREE.PlaneGeometry(2.9,1.45),new THREE.MeshBasicMaterial({map:this.texture,transparent:true,alphaTest:.25,depthWrite:true,toneMapped:false,side:THREE.DoubleSide}),v(0,0,-i*.010));
   m.renderOrder=30-i;if(i)m.material.color.setScalar(lerp(.70,.20,i/13));this.layers.push(m);}
 }
 update(t,shot,a){const id=Number(shot.id.slice(1));this.group.visible=[2,3,21,24,43,57,64].includes(id);
  if(!this.group.visible)return;
  const depth=id===3?.20:id===24?.55:id===43?.72:1,alpha=Math.min(1,smooth(shot.start,shot.start+.18,t))*(1-smooth(shot.end-.15,shot.end,t));
  this.layers.forEach((m,i)=>{m.position.z=-i*.014*depth;m.material.opacity=alpha;});
  this.group.scale.setScalar((id===57||id===64?.73:.71)*(1+Math.min(.03,a.sub*.03)));
 }
 place(camera){if(!this.group.visible)return;const dir=new THREE.Vector3();camera.getWorldDirection(dir);
  const right=new THREE.Vector3(1,0,0).applyQuaternion(camera.quaternion),up=new THREE.Vector3(0,1,0).applyQuaternion(camera.quaternion);
  this.group.position.copy(camera.position).addScaledVector(dir,2.6).addScaledVector(right,-.86).addScaledVector(up,.13);
  this.group.quaternion.copy(camera.quaternion);}
}
