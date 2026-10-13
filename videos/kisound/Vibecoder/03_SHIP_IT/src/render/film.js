import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
import {DURATION,SHOT,LANG,TITLES} from './config.js';
import {clamp,smooth,lerp,ease} from './timeline.js';
import {Room,P,railX} from './room.js';
import {TypeStack,drawHook2D,envelope,hookAt,subText} from './type.js';
import {drawView,VIEWS,text,setAnalysis,C} from './screen.js';
import {releaseState,stations,packet,bridgeCards,upload,COMMIT,UPLOAD_START,NEW_PAGE,ENTER_DEPLOY,TXT,enterCount} from './model.js';
const v3=(x,y,z)=>new THREE.Vector3(x,y,z),FOV={24:53.1,28:46.4,35:37.8,40:33.4,50:27,70:19.5,85:16.1};
// 2D shots draw the whole frame on the overlay; 3D shots render the room
const FLAT=new Set([...Object.keys(VIEWS),'S002','S010','S022']);
export const isFlat=id=>FLAT.has(id);
const path=(pts,u)=>new THREE.CatmullRomCurve3(pts,false,'centripetal').getPoint(clamp(u));
const L=(a,b,u)=>a.clone().lerp(b,u);
// progress of a camera move that completes within `cap` seconds and then holds; `delay` keeps a title frontal first
const prog=(s,t,cap=99,delay=0)=>ease(clamp((t-s.start-delay)/Math.max(.3,Math.min(cap,s.end-s.start-delay))));
const ST=i=>P.station(i),SC=P.screen;
// Type shots start frontal: the title stack stands at a fixed distance in front of the start camera.
const TYPEPOSE={
 S011:{cam:v3(-1.3,.99,-.96),look:v3(-1.3,.93,-1.62),dist:.46,width:.48,off:[-.02,.03]},
 S012:{cam:v3(-1.3,1.06,-.92),look:v3(-1.3,.98,-1.62),dist:.5,width:.5,off:[-.02,.03]},
 S023:{cam:v3(-1.22,.99,-.98),look:v3(-1.22,.93,-1.62),dist:.46,width:.48,off:[0,.03]},
 S024:{cam:v3(-1.02,1.03,-1.0),look:v3(-1.02,1.0,-1.7),dist:.46,width:.32,off:[-.12,.01]},
 S030:{cam:v3(-1.3,1.0,-1.02),look:v3(-1.3,.92,-1.62),dist:.44,width:.46},
 S031:{cam:v3(-1.3,1.0,-.94),look:v3(-1.3,.93,-1.62),dist:.48,width:.5,off:[0,.035]},
 S033:{cam:v3(-.62,1.08,-.88),look:v3(-.7,.86,-1.3),dist:.46,width:.46},
};
// camera hold while a title is frontal (title start + about 1 s)
const titleHold=(id,t)=>{const h=hookAt(t);return h&&TYPEPOSE[id]?Math.max(0,h.until-SHOT[id].start-.15):0;};
const CAM={
 S001:(s,t)=>{if(LANG==='en'){const u=prog(s,t);return{pos:L(v3(-1.12,.93,-1.02),v3(-1.14,.92,-1.06),u),target:v3(-1.34,.8,-1.6),fov:FOV[35]};}
  const u=prog(s,t,8.2);return{pos:path([v3(-1.78,1.5,-.42),v3(-1.55,1.3,-.78),v3(-1.12,1.12,-.98),v3(-.72,1.08,-.92)],u),target:path([v3(-1.4,.84,-1.62),v3(-1.25,.82,-1.6),v3(-.9,.84,-1.55),SC],u),fov:FOV[35]};},
 S003:(s,t)=>{const u=prog(s,t);return{pos:path([v3(-1.06,1.26,-.6),v3(-.82,1.16,-.78),v3(-.5,1.06,-.98)],u),target:path([v3(-1.06,.8,-1.52),v3(-.8,.84,-1.55),SC],smooth(.25,1,u)),fov:FOV[35]};},
 S009:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.32,.98,-1.12),v3(-1.08,.95,-1.08),u),target:L(v3(-1.3,.95,-1.66),v3(-1.1,.88,-1.5),u),fov:FOV[35]};},
 S011:(s,t)=>{const d=titleHold('S011',t),u=prog(s,t,99,d);return{pos:path([TYPEPOSE.S011.cam,v3(-1.5,.95,-1.14),v3(-1.18,.95,-1.14)],u),target:path([TYPEPOSE.S011.look,v3(-1.44,.9,-1.62),v3(-1.12,.9,-1.62)],u),fov:FOV[35]};},
 S012:(s,t)=>{const d=titleHold('S012',t),u=prog(s,t,99,Math.min(d,1.1));return{pos:L(TYPEPOSE.S012.cam,TYPEPOSE.S012.cam.clone().add(v3(.1,-.02,.05)),u),target:TYPEPOSE.S012.look,fov:FOV[35]};},
 S014:(s,t)=>{const u=prog(s,t,LANG==='en'?99:4.6);return{pos:path([v3(-.5,1.0,-1.12),v3(-.74,1.0,-1.1),v3(-.9,1.02,-1.04)],u),target:path([SC,v3(-.8,.9,-1.52),ST(4).clone().add(v3(-.02,.25,0))],u),fov:FOV[40]};},
 S016:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.42,.86,-1.18),v3(-1.02,.86,-1.18),u),target:L(v3(-1.36,.8,-1.56),v3(-1.0,.8,-1.56),u),fov:FOV[35]};},
 S023:(s,t)=>{const d=titleHold('S023',t),u=prog(s,t,99,d);return{pos:path([TYPEPOSE.S023.cam,v3(-1.46,.92,-1.18),v3(-1.12,.92,-1.16),v3(-.86,.95,-1.2)],u),target:path([TYPEPOSE.S023.look,ST(1).clone().add(v3(0,.2,0)),ST(2).clone().add(v3(0,.2,0)),ST(4).clone().add(v3(0,.26,0))],u),fov:FOV[35]};},
 S024:(s,t)=>{const d=titleHold('S024',t),u=prog(s,t,99,Math.min(d,1.2));return{pos:L(TYPEPOSE.S024.cam,v3(-.98,1.06,-1.12),u),target:L(TYPEPOSE.S024.look,v3(-.98,1.04,-1.72),u),fov:FOV[35]};},
 S027:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.66,.98,-1.12),v3(-1.5,.98,-1.12),u),target:L(v3(-1.66,.98,-1.64),v3(-1.5,.98,-1.64),u),fov:FOV[35]};},
 S028:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.46,.98,-1.12),v3(-1.3,.98,-1.12),u),target:L(v3(-1.44,.98,-1.64),v3(-1.3,.98,-1.64),u),fov:FOV[35]};},
 S029:(s,t)=>{const u=prog(s,t);return{pos:L(v3(-1.2,.98,-1.1),v3(-.98,1.0,-1.08),u),target:L(v3(-1.14,.98,-1.64),v3(-.98,1.0,-1.66),u),fov:FOV[35]};},
 S030:(s,t)=>{const d=titleHold('S030',t),u=prog(s,t,99,d);return{pos:path([LANG==='en'?TYPEPOSE.S030.cam:v3(-1.3,.95,-1.12),v3(-1.12,1.2,-.7),v3(-.6,1.5,.1),v3(.4,1.62,.95)],u),target:L(v3(-1.3,.86,-1.6),v3(-1.0,.86,-1.5),u),fov:FOV[35]};},
 S031:(s,t)=>{const d=titleHold('S031',t),u=prog(s,t,99,Math.min(d,1.3));return{pos:L(TYPEPOSE.S031.cam,v3(-1.3,1.16,-.7),u),target:L(TYPEPOSE.S031.look,v3(-1.25,.86,-1.6),u),fov:FOV[35]};},
 S033:(s,t)=>{const d=LANG==='en'?titleHold('S033',t):0,u=prog(s,t,99,d);return{pos:L(TYPEPOSE.S033.cam,v3(-.86,1.04,-.84),u),target:L(TYPEPOSE.S033.look,v3(-.88,.742,-1.22),u),fov:FOV[40]};},
 S034:(s,t)=>{const u=(t-s.start)/(s.end-s.start);return{pos:path([v3(-.7,1.12,-.86),v3(-1.3,1.4,-.6),v3(-1.86,1.55,-1.0),v3(-3.6,1.7,-1.1),v3(-7,2.0,.2)],LANG==='en'?ease(u):u),target:L(v3(-.75,.86,-1.3),v3(-1.0,.95,-1.4),u),fov:FOV[35]};},
};
// panels of the project shots (the same UI surfaces, staged over the rail)
function panels(id,t){const s=SHOT[id];const pz=(x,y,z,kind,o={})=>({pos:v3(x,y,z),kind,...o});
 switch(id){
  case'S009':{const k=ease(clamp((t-COMMIT)/.4));const list=[pz(-1.3,.97,-1.7,'terminal',{scale:.66,live:true,edge:0x44dde5})];if(t>=COMMIT)list.push(pz(-1.0,lerp(.84,.93,k),-1.5,'commit',{scale:.4*lerp(.6,1,k),ry:-.35,edge:0xd1f85d,alpha:k}));return list;}
  case'S023':case'S029':case'S030':case'S031':return[pz(-.95,1.08,-1.76,'browser',{scale:.6,ry:-.18,live:true,edge:0xd1f85d})];
  case'S024':return[pz(-.82,1.0,-1.76,'browser',{scale:.6,ry:-.14,live:true,edge:0xd1f85d})];
  case'S028':return[pz(-1.3,.94,-1.56,'proof',{scale:.34,edge:0xd1f85d})];
  default:return[];
 }
}
export class Film{
 constructor({renderer,width,height,overlay,timeline,debug=false}){
  Object.assign(this,{renderer,width,height,overlay,tl:timeline,debug});setAnalysis(timeline);
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  this.room=new Room();this.scene=this.room.scene;this.type=new TypeStack(this.scene);
  this.camera=new THREE.PerspectiveCamera(37.8,width/height,.01,800);
  this.composer=new EffectComposer(renderer);this.pass=new RenderPass(this.scene,this.camera);this.composer.addPass(this.pass);
  this.bloom=new UnrealBloomPass(new THREE.Vector2(width,height),.3,.4,.82);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());
  const fxaa=new ShaderPass(FXAAShader);fxaa.material.uniforms.resolution.value.set(1/width,1/height);this.composer.addPass(fxaa);
 }
 render(time){
  const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),a={...this.tl.sample(t),accent:this.tl.accent(t),drop:this.tl.drop(t),attack:this.tl.attack(t)},flat=isFlat(shot.id);let cam=null;
  const h=hookAt(t);
  if(!flat){
   const id=shot.id,titleUp=!!(h&&TYPEPOSE[id]&&t<h.until),gate=['S011','S023'].includes(id)&&!titleUp,proj=['S011','S012','S014'].includes(id);
   this.room.update(t,a,shot,{gateWords:gate,projection:proj});
   const c=(CAM[id]||CAM.S034)(SHOT[id],t);cam=c;this.camera.position.copy(c.pos);this.camera.lookAt(c.target);this.camera.fov=c.fov;this.camera.updateProjectionMatrix();this.camera.updateMatrixWorld();
   this.room.setPanels(panels(id,t),t);
   if(['S027','S028','S029','S030'].includes(id)||(id==='S031'&&!titleUp))this.room.setCards(bridgeCards(t),t);
   this.typeShot(shot,t,a,h);
   const head=this.room.headM.position,torso=this.room.torso.position;
   const A=this.room.arm,limbs=[A.R.u,A.R.f,A.R.h,A.L.u,A.L.f,A.L.h].map(m=>m.position);
   this.room.person.visible=!['project','type'].includes(shot.zone)&&!TYPEPOSE[id]&&c.pos.distanceTo(head)>.32&&c.pos.distanceTo(torso)>.42&&limbs.every(p=>c.pos.distanceTo(p)>.3);
   this.bloom.strength=.3+.1*a.high+.25*a.drop;
   this.composer.render(0);
  }
  this.drawOverlay(t,shot,flat,a,cam,h);
  this.lastState={t,shot:shot.id,chapter:this.tl.chapter(t).id,lang:LANG,flat,zone:shot.zone,camera:cam?cam.pos.toArray():[0,0,0],target:cam?cam.target.toArray():[0,0,0],
   state:releaseState(t),stations:stations(t),packet:packet(t),upload:upload(t),hook:h?h.id:null,enters:enterCount(t),visibility:this.tl.visibility(t),person:this.room.person.visible};
  return this.lastState;
 }
 typeShot(shot,t,a,h){const pose=TYPEPOSE[shot.id];if(!pose||!h||(shot.id==='S033'&&LANG!=='en')){this.type.set(false);return;}
  const dir=pose.look.clone().sub(pose.cam).normalize(),pos=pose.cam.clone().addScaledVector(dir,pose.dist),m=new THREE.Matrix4().lookAt(pose.cam,pose.look,v3(0,1,0)),q=new THREE.Quaternion().setFromRotationMatrix(m);
  if(pose.off){const right=v3(1,0,0).applyQuaternion(q),up=v3(0,1,0).applyQuaternion(q);pos.addScaledVector(right,pose.off[0]).addScaledVector(up,pose.off[1]);}
  const env=envelope(h,t),pulse=1+.03*clamp(a.sub)*clamp(env.hold/.3);
  this.type.draw(subText(h));this.type.place(pos,q,pose.width/this.type.width*env.grow*pulse);
  this.type.set(true,env.alpha,smooth(.9,1.5,env.hold));
 }
 drawOverlay(t,shot,flat,a,cam,h){
  const g=this.overlay.getContext('2d'),scale=this.width/1920;g.clearRect(0,0,this.width,this.height);g.save();g.scale(scale,scale);
  if(flat){if(['S002','S010','S022'].includes(shot.id))drawHook2D(g,h,t,a,shot.id);else drawView(shot.id,g,t);}
  // credit: opening room shot (DE) and the closing shots (Michroma, artist and track only)
  const cr=TITLES.credit,k=(cr?smooth(cr[0],cr[1],t)*(1-smooth(cr[2],cr[3],t)):0)+(t>=SHOT.S033.start+.8?smooth(SHOT.S033.start+.8,SHOT.S033.start+1.6,t):0);
  if(k>0){g.globalAlpha=Math.min(1,k);text(g,'SAMUEL HEINRICH',96,960,30,'#F4F3EA',400,'credit');text(g,'SHIP IT · VIBECODER',96,1006,22,'#C9D3DF',400,'credit');g.globalAlpha=1;}
  g.restore();
  const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(0,0,0,${black})`;g.fillRect(0,0,this.width,this.height);}
  if(this.debug){g.save();g.scale(scale,scale);g.fillStyle='rgba(3,12,22,.9)';g.fillRect(40,40,1400,76);text(g,`${LANG.toUpperCase()} · ${this.tl.chapter(t).id} · ${shot.id} ${shot.zone}/${shot.mode}${flat?' · 2D':''} · ${t.toFixed(3)} s · ${releaseState(t)}`,60,72,22,'#e6eef3',500,'mono');text(g,`${shot.eventIds.join(' ')} / ${shot.lyricIds.join(' ')} · ${stations(t).join(' ')} · hook ${h?h.id:'–'}`,60,102,18,'#8fcbd8',400,'mono');g.restore();}
 }
}
