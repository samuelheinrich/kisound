import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
import {DURATION,SHOT,LANG,TITLES} from './config.js';
import {clamp,smooth,lerp,ease} from './timeline.js';
import {Room,P} from './room.js';
import {TypeStack,drawHook2D,envelope,HOOK} from './type.js';
import {drawView,THEMES,themeAt,text,VIEWS} from './screen.js';
import {version,usage,clockText,tabs,jobState,exportState,bassCount,JOB,af,at,RELOAD2,COMPARE2,PASS2,TXT} from './model.js';
const v3=(x,y,z)=>new THREE.Vector3(x,y,z),FOV={24:53.1,28:46.4,35:37.8,40:33.4,50:27,70:19.5,85:16.1};
const SC=P.screen;
// 2D shots draw the whole frame on the overlay; 3D shots render the room; S055 starts flat (SEND) and cuts into 3D.
const FLAT=new Set([...VIEWS.filter(v=>v!=='S055'),'S020','S047']);
export const isFlat=(id,t)=>FLAT.has(id)||(id==='S055'&&t-SHOT.S055.start<1.1);
const path=(pts,u)=>{const c=new THREE.CatmullRomCurve3(pts,false,'centripetal');return c.getPoint(clamp(u));};
const L=(a,b,u)=>a.clone().lerp(b,u);
// progress of a camera move that completes within `cap` seconds and then holds (longer EN shots get a hold)
const prog=(s,t,cap=99,delay=0)=>ease(clamp((t-s.start-delay)/Math.min(cap,s.end-s.start-delay)));
const CAM={
 S001:(s,t)=>{const u=prog(s,t,LANG==='en'?11.5:8.6,LANG==='en'?.6:0);return{pos:path([v3(-14,3.4,7),v3(-6.5,2.0,1.2),v3(-3.0,1.62,-1.1),v3(-1.62,1.55,-.95),v3(-1.05,1.62,-.36),v3(-.28,1.42,-.5)],u),target:L(v3(-2.1,1.6,-1.1),v3(-.86,.9,-1.55),smooth(.35,.95,u)),fov:FOV[35]};},
 S003:(s,t)=>{const u=prog(s,t);return{pos:v3(-.36,.97,-1.86+.01*u),target:v3(-.68,.84,-1.5),fov:FOV[50]};},
 S004:(s,t)=>{const u=prog(s,t,6);return{pos:L(v3(-1.04,.83,-1.27),v3(-.9,.825,-1.29),u),target:L(v3(-.9,.77,-1.53),v3(-.73,.776,-1.48),u),fov:FOV[24]};},
 S006:(s,t)=>{const u=prog(s,t,LANG==='en'?6:3.4);return{pos:path([v3(-.62,1.18,-.6),v3(-.8,1.06,-.92),v3(-.85,.95,-1.18)],u),target:L(v3(-.85,1.0,-1.5),SC,u),fov:FOV[35]};},
 S007:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.72,.9,-.92),v3(-1.68,.88,-.98),u),target:L(v3(-1.3,.8,-1.33),v3(-1.0,.84,-1.5),smooth(.3,.8,u)),fov:FOV[50]};},
 S010:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.35,1.12,-1.12),v3(-.42,1.12,-1.12),u),target:L(v3(-1.1,1.18,-1.85),v3(-.6,1.18,-1.85),u),fov:FOV[50]};},
 S013:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.3,1.2,-1.36),v3(-.5,1.2,-1.4),u),target:L(v3(-1.05,1.17,-1.9),v3(-.62,1.17,-1.9),u),fov:FOV[35]};},
 S014:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.5,.9,-1.02),v3(-1.12,1.08,-.62),u),target:L(v3(-1.38,.79,-1.32),v3(-.78,.8,-1.42),u),fov:FOV[50]};},
 S015:(s,t)=>{const u=prog(s,t,5.2),a=lerp(.15,2.05,u);return{pos:v3(-.85+1.45*Math.cos(a),1.48,-1.3+1.45*Math.sin(a)),target:v3(-.85,.95,-1.42),fov:FOV[35]};},
 S017:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-.40,.9,-1.12),v3(-.43,.9,-1.14),u),target:v3(-.8,.82,-1.42),fov:FOV[70]};},
 S018:(s,t)=>({pos:v3(.75,1.42,.45),target:v3(-.75,1.25,-1.55),fov:FOV[35]}),
 S022:(s,t)=>{const u=ease(clamp((t-s.start-1.1)/Math.max(.5,s.end-s.start-1.4)));return{pos:L(TYPEPOSE.S022.cam,v3(-.58,1.03,-.62),u),target:L(TYPEPOSE.S022.look,v3(-.8,.92,-1.55),u),fov:FOV[35]};},
 S025:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-.16,1.02,-1.64),v3(-.19,1.0,-1.62),u),target:v3(-.47,.745,-1.22),fov:FOV[50]};},
 S026:(s,t)=>{const u=prog(s,t),a=lerp(-.55,.55,u),c=v3(-.85,1.18,-1.86);return{pos:v3(c.x+Math.sin(a)*1.0,1.22-.1*u,c.z+Math.cos(a)*1.0),target:c,fov:FOV[35]};},
 S028:(s,t)=>{const u=prog(s,t);return{pos:L(v3(.85,1.55,.75),v3(.62,1.5,.45),u),target:v3(-1.0,1.0,-1.35),fov:FOV[28]};},
 S029:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-.85,1.06,-.62),v3(-.85,.95,-1.06),u),target:L(v3(-.85,.95,-1.6),v3(-.85,.98,-1.6),u),fov:FOV[35]};},
 S033:(s,t)=>{const u=prog(s,t);return{pos:path([v3(-1.62,.98,-.98),v3(-1.28,1.02,-1.08),v3(-.98,1.06,-1.12)],u),target:path([P.clock.clone().add(v3(0,.05,0)),P.mug.clone().add(v3(0,.06,0)),SC],u),fov:FOV[50]};},
 S035:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-.85,.98,-1.12),v3(-.85,.82,-1.08),u),target:L(v3(-.85,.98,-1.8),v3(-.85,1.0,-1.8),u),fov:FOV[35]};},
 S036:(s,t)=>{const u=ease(clamp((t-s.start-1.0)/Math.max(.5,s.end-s.start-1.2)));return{pos:L(TYPEPOSE.S036.cam,TYPEPOSE.S036.cam.clone().add(v3(0,.02,.32)),u),target:TYPEPOSE.S036.look,fov:FOV[35]};},
 S038:(s,t)=>{const u=ease(clamp((t-s.start-1.0)/Math.max(.5,s.end-s.start-1.2)));return{pos:L(TYPEPOSE.S038.cam,TYPEPOSE.S038.cam.clone().add(v3(.28,0,-.02)),u),target:L(TYPEPOSE.S038.look,TYPEPOSE.S038.look.clone().add(v3(-.08,0,0)),u),fov:FOV[40]};},
 S040:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.5,1.12,-1.0),v3(-.42,1.12,-1.0),u),target:L(v3(-1.25,1.15,-1.9),v3(-.55,1.15,-1.6),u),fov:FOV[50]};},
 S041:(s,t)=>{const u=prog(s,t,3.2);return{pos:L(v3(-.36,.94,-1.06),v3(-.46,.9,-1.2),u),target:L(v3(-.7,.84,-1.48),v3(-.72,.82,-1.5),u),fov:FOV[70]};},
 S042:(s,t)=>{const u=prog(s,t,LANG==='en'?7.5:6.5);const a=lerp(0,1,u);return{pos:v3(-.55,1.34,-.5),target:L(v3(-.85,.95,-1.55),v3(-6,1.75,-1.05),a),fov:FOV[35]};},
 S043:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-.16,.9,-1.36),v3(-.18,.895,-1.37),u),target:L(v3(-.4,.81,-1.56),v3(-.52,.9,-1.62),smooth(.35,.9,u)),fov:FOV[70]};},
 S045:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.12,1.02,-1.12),v3(-.92,1.42,-.52),u),target:L(v3(-1.13,.742,-1.2),v3(-.85,.78,-1.38),u),fov:FOV[50]};},
 S046:(s,t)=>({pos:v3(.95,1.42,.62),target:v3(-.95,1.05,-1.25),fov:FOV[35]}),
 S049:(s,t)=>{const u=ease(clamp((t-s.start-1.4)/Math.max(.5,s.end-s.start-1.5)));return{pos:L(TYPEPOSE.S049.cam,TYPEPOSE.S049.cam.clone().add(v3(0,.03,.38)),u),target:TYPEPOSE.S049.look,fov:FOV[35]};},
 S050:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.6,1.08,-1.12),v3(-.3,1.08,-1.18),u),target:path([v3(-1.45,1.12,-1.8),v3(-.95,1.15,-1.88),v3(-.42,1.12,-1.8)],u),fov:FOV[40]};},
 S052:(s,t)=>{const u=prog(s,t,LANG==='en'?7:4.2);return{pos:path([v3(-1.76,.95,-.96),v3(-1.6,1.5,-1.18),v3(-1.12,2.2,-1.42)],u),target:L(P.noteFinal,v3(-.9,.74,-1.38),smooth(.2,1,u)),fov:lerp(FOV[70],FOV[35],u)};},
 S053:(s,t)=>{const u=prog(s,t,LANG==='en'?5.5:4.5);return{pos:L(v3(.3,1.38,-.05),v3(1.55,1.62,2.05),u),target:v3(-.9,1.0,-1.35),fov:FOV[35]};},
 S055:(s,t)=>{const u=ease(clamp((t-s.start-1.1)/(s.end-s.start-1.1)));return{pos:L(v3(-.24,1.2,-1.12),v3(-.1,1.36,-.86),u),target:L(v3(-.84,.78,-1.36),v3(-.86,.84,-1.45),u),fov:FOV[50]};},
 S056:(s,t)=>{const u=prog(s,t);return{pos:path([v3(-.28,1.42,-.5),v3(-1.15,1.6,-.42),v3(-1.62,1.55,-.95),v3(-2.6,1.56,-1.1)],u),target:L(v3(-.85,.9,-1.55),v3(-.8,1.0,-1.25),u),fov:FOV[35]};},
 S057:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-3.3,1.6,-1.1),v3(-10.5,2.1,1.6),u),target:v3(-2.1,1.55,-1.1),fov:FOV[35]};},
 S058:(s,t)=>{const u=(t-s.start)/(s.end-s.start);return{pos:L(v3(-10.5,2.1,1.6),v3(-11.3,2.15,1.9),u),target:v3(-2.1,1.55,-1.1),fov:FOV[35]};},
 S055b:null,
};
// Type shots start frontal: the stack stands at a fixed distance in front of the start camera.
const TYPEPOSE={
 S022:{cam:v3(-.85,1.04,-.5),look:v3(-.85,.96,-1.56),dist:.62,width:.56,style:'night'},
 S036:{cam:v3(-.85,.82,-.62),look:v3(-.85,1.0,-1.6),dist:.62,width:.56,style:'night',strip:true},
 S038:{cam:v3(-.85,1.12,-.6),look:v3(-.85,1.12,-1.9),dist:.62,width:.5,style:'night'},
 S049:{cam:v3(-.85,1.15,-.55),look:v3(-.85,1.15,-1.9),dist:.62,width:.56,style:'project'},
};
// panels of the project views (same UI surfaces, staggered in space)
function panels(id,t){const s=SHOT[id],u=clamp((t-s.start)/(s.end-s.start));
 const pz=(x,y,z,kind,o={})=>({pos:v3(x,y,z),kind,...o});
 switch(id){
  case'S006':{const k=ease(clamp((t-s.start)/.8));return[pz(-.72,1.02,lerp(-1.56,-1.34,k),`job:P01`,{scale:.5,ry:-.1}),pz(-.98,1.08,lerp(-1.56,-1.14,k),`reply:P01`,{scale:.5,ry:.1,edge:0xff6534}),pz(-.8,1.06,lerp(-1.56,-.96,k),'grid',{scale:.52,live:true})];}
  case'S010':{const k=ease(clamp((t-s.start-.3)/1.2));return[pz(-1.25,1.2,-1.95,'job:P01',{scale:.8,alpha:.65}),pz(-.88,1.18,lerp(-1.75,-1.9,k),'grid',{scale:.82,live:true}),pz(-.5,1.17,lerp(-1.95,-1.72,k),'job:P02',{scale:.9})];}
  case'S013':return[pz(-.28,1.3,-1.86,'grid:pass',{scale:.62,live:true,ry:-.3,edge:t>=PASS2?0xd1f85d:0x44dde5})];
  case'S018':{const k=ease(u);return[pz(-.35,1.38,-1.95,'job:P01',{scale:.95,alpha:.7,ry:.5}),pz(-.05,1.46+.04*k,-1.7,'job:P02',{scale:.95,alpha:.85,ry:.5}),pz(.25,1.54+.08*k,-1.45,'job:P03',{scale:.95+.1*k,ry:.5})];}
  case'S026':return[pz(-1.36,1.18,-1.94,'version:v0.4',{ry:.4,scale:.9}),pz(-.85,1.18,-2.02,'version:v0.5',{scale:.9}),pz(-.34,1.18,-1.94,'version:v0.6',{ry:-.4,scale:.9})];
  case'S029':{const k=ease(clamp((t-s.start)/(s.end-s.start)));return[pz(lerp(-.85,-1.3,k),lerp(.88,1.12,k),-1.62,'version:v0.6',{scale:lerp(.5,.75,k)}),pz(lerp(-.85,-.4,k),lerp(.88,1.12,k),-1.62,'export',{scale:lerp(.5,.75,k),edge:0xff6534}),pz(-.85,lerp(.88,1.3,k),-1.66,'grid',{scale:lerp(.5,.75,k),live:true})];}
  case'S035':{const k=ease(clamp((t-s.start-.2)/1));return[pz(-.85,1.0,-1.5,'job:P05',{scale:.55}),pz(-.85,1.06,lerp(-1.55,-1.9,k),'empty',{scale:lerp(.5,.95,k),alpha:k,edge:0xff6534})];}
  case'S036':return[pz(-1.3,1.12,-2.0,'export',{scale:.9,alpha:.95}),pz(-.4,1.12,-2.0,'settings',{scale:.9,alpha:.95})];
  case'S038':return[pz(-1.3,1.12,-1.92,'job:P05',{scale:1.05}),pz(-.4,1.12,-1.92,'grid',{scale:1.05,live:true,edge:0xff6534})];
  case'S040':{const list=tabs(t);return list.slice(-5).map((tb,i,a)=>pz(-1.3+i*.24,1.15,-1.92+i*.14,`tab:${tb.key}`,{scale:.62,ry:.35}));}
  case'S049':{const k=ease(clamp((t-s.start-1.4)/1.2));return[pz(-.85,1.15,-1.9,'overview',{scale:lerp(1.3,1.7,k),alpha:k})];}
  case'S050':return[pz(-1.45,1.12,-1.82,'export',{scale:.72,ry:.35}),pz(-.95,1.15,-1.92,'settings',{scale:.72}),pz(-.42,1.12,-1.82,'grid',{scale:.72,ry:-.35,live:true})];
  default:return[];
 }
}
export class Film{
 constructor({renderer,width,height,overlay,timeline,debug=false}){
  Object.assign(this,{renderer,width,height,overlay,tl:timeline,debug});
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.room=new Room();this.scene=this.room.scene;this.type=new TypeStack(this.scene);
  this.strip=new THREE.Mesh(new THREE.PlaneGeometry(1,.012),new THREE.MeshBasicMaterial({color:0xff6534,toneMapped:false}));this.type.group.add(this.strip);this.strip.position.set(0,-.17,0);
  this.camera=new THREE.PerspectiveCamera(37.8,width/height,.02,800);
  this.composer=new EffectComposer(renderer);this.pass=new RenderPass(this.scene,this.camera);this.composer.addPass(this.pass);
  this.bloom=new UnrealBloomPass(new THREE.Vector2(width,height),.25,.4,.86);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());
  const fxaa=new ShaderPass(FXAAShader);fxaa.material.uniforms.resolution.value.set(1/width,1/height);this.composer.addPass(fxaa);
 }
 render(time){
  const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),a={...this.tl.sample(t),accent:this.tl.accent(t)},flat=isFlat(shot.id,t);let cam=null;
  if(!flat){
   this.room.update(t,a,shot);
   const c=(CAM[shot.id]||CAM.S046)(SHOT[shot.id],t);cam=c;this.camera.position.copy(c.pos);this.camera.lookAt(c.target);this.camera.fov=c.fov;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
   this.room.setPanels(panels(shot.id,t),t);
   this.room.setGridModel(shot.id==='S013',t,v3(-.85,1.22,-1.9));
   this.typeShot(shot,t,a);
   // the schematic person stays out of the way of close cameras and the title moments
   const head=this.room.headM.position,torso=this.room.torso.position,typeShot=!!TYPEPOSE[shot.id];
   this.room.person.visible=!typeShot&&!['project'].includes(shot.zone)&&c.pos.distanceTo(head)>.32&&c.pos.distanceTo(torso)>.42;
   this.room.cursorDot.material.opacity=shot.id==='S056'?smooth(SHOT.S056.start+1,SHOT.S056.end,t):1;
   this.bloom.strength=lerp(.28,.12,this.room.dayness(t))+.08*a.high;
   this.composer.render(0);
  }
  this.drawOverlay(t,shot,flat,a,cam);
  const u=usage(t);
  this.lastState={t,shot:shot.id,chapter:this.tl.chapter(t).id,lang:LANG,flat,zone:shot.zone,camera:cam?cam.pos.toArray():[0,0,0],target:cam?cam.target.toArray():[0,0,0],
   clock:clockText(t),version:version(t),tabs:tabs(t).length,bass:bassCount(t),export:exportState(t),tokens:u.total,credits:u.credits,visibility:this.tl.visibility(t),person:this.room.person.visible};
  return this.lastState;
 }
 typeShot(shot,t,a){const pose=TYPEPOSE[shot.id];if(!pose){this.type.set(false);return;}
  const dir=pose.look.clone().sub(pose.cam).normalize(),pos=pose.cam.clone().addScaledVector(dir,pose.dist),m=new THREE.Matrix4().lookAt(pose.cam,pose.look,v3(0,1,0)),q=new THREE.Quaternion().setFromRotationMatrix(m);
  const hookId=Object.keys(HOOK).find(k=>HOOK[k].shot===shot.id),env=envelope(hookId,t),pulse=1+.03*clamp(a.sub)*clamp(env.hold/.3);
  let lift=0;if(shot.id==='S049')lift=ease(clamp((t-SHOT.S049.start-1.4)/1.0))*.55;
  this.type.draw(pose.style,t);this.type.place(pos.clone().add(v3(0,lift,0)),q,pose.width/this.type.width*env.grow*pulse);
  const depthK=shot.id==='S022'?smooth(1.0,1.6,env.hold):1;this.type.set(true,env.alpha*(shot.id==='S049'?1-smooth(SHOT.S049.start+2.2,SHOT.S049.start+2.6,t):1),depthK);this.strip.visible=!!pose.strip;
  if(pose.strip){const u=usage(t);this.strip.scale.x=lerp(.2,1,clamp(u.total/34000));}
 }
 drawOverlay(t,shot,flat,a,cam){
  const g=this.overlay.getContext('2d'),scale=this.width/1920;g.clearRect(0,0,this.width,this.height);g.save();g.scale(scale,scale);
  if(flat){if(shot.id==='S020'||shot.id==='S047')drawHook2D(g,shot.id==='S020'?'H01':'H05',t,a);else drawView(shot.id,g,t);}
  const C=THEMES[themeAt(t)];
  // small credit at the opening and the closing outside shot (Michroma, artist and track only)
  const[c0,c1,c2,c3]=TITLES.credit,k=smooth(c0,c1,t)*(1-smooth(c2,c3,t))+(shot.id==='S057'?smooth(SHOT.S057.start+.5,SHOT.S057.start+1.5,t)*(1-smooth(SHOT.S058.start+1,SHOT.S058.start+2.5,t)):0);
  if(k>0){g.globalAlpha=k;text(g,'SAMUEL HEINRICH',96,960,30,'#F4F3EA',400,'credit');text(g,'TOKEN BURN · VIBECODER',96,1006,22,'#C9D3DF',400,'credit');g.globalAlpha=1;}
  if(shot.id==='S013'){const steps=[[TXT.saved,RELOAD2-1.2],[TXT.reload,RELOAD2],[TXT.compare,COMPARE2],['PASS',PASS2]];let x=660;steps.forEach(([s,ts],i)=>{const on=t>=ts;text(g,(i?'→  ':'')+s,x,1000,34,on?(i===3?'#D1F85D':'#F4F3EA'):'rgba(244,243,234,.3)',600);x+=i===2?360:250;});}
  g.restore();
  const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(0,0,0,${black})`;g.fillRect(0,0,this.width,this.height);}
  // the cursor stays as a light point to the very end of the audio
  if(shot.id==='S058'&&cam){const p=P.screen.clone().project(this.camera),x=(p.x*.5+.5)*this.width,y=(-p.y*.5+.5)*this.height,k=1-smooth(DURATION-.6,DURATION,t);g.fillStyle=`rgba(140,240,255,${k})`;g.beginPath();g.arc(x,y,3.2*scale*1.6,0,7);g.fill();}
  if(this.debug){g.save();g.scale(scale,scale);g.fillStyle='rgba(3,12,22,.9)';g.fillRect(40,40,1300,76);text(g,`${LANG.toUpperCase()} · ${this.tl.chapter(t).id} · ${shot.id} ${shot.zone}/${shot.mode}${flat?' · 2D':''} · ${t.toFixed(3)} s`,60,72,22,'#e6eef3',500,'mono');text(g,`${shot.eventIds.join(' ')} / ${shot.lyricIds.join(' ')} · ${clockText(t)} · ${version(t)} · ${usage(t).total} tok`,60,102,18,'#8fcbd8',400,'mono');g.restore();}
 }
}
