import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
import {DURATION} from './config.js';
import {clamp} from './timeline.js';
import {status,hostPmtu} from './model.js';
import {fitLabels} from './world.js';
import {PathZone} from './zones/path.js';
import {LabZone} from './zones/lab.js';
import {drawDock,drawHeader,drawWords,drawUser,drawTitles,drawLog,titleOpacity,text,DOCK,technical} from './overlay.js';
export class Film{
 constructor({renderer,width,height,overlay,timeline,debug=false}){
  Object.assign(this,{renderer,width,height,overlay,tl:timeline,debug});this.zones={path:new PathZone(),lab:new LabZone()};this.camera=new THREE.PerspectiveCamera(50,width/height,.05,600);
  this.composer=new EffectComposer(renderer);this.pass=new RenderPass(this.zones.path.scene,this.camera);this.composer.addPass(this.pass);this.bloom=new UnrealBloomPass(new THREE.Vector2(width,height),.5,.5,.8);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());const fxaa=new ShaderPass(FXAAShader);fxaa.material.uniforms.resolution.value.set(1/width,1/height);this.composer.addPass(fxaa);
 }
 render(time){
  const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),a=this.tl.sample(t),zone=this.zones[shot.zone],title=titleOpacity(t),tech=technical(shot)&&title<.01;
  zone.update(t,a,this.tl,shot);const c=zone.camera(shot,t);this.camera.position.copy(c.pos);this.camera.lookAt(c.target);this.camera.fov=c.fov;
  if(tech)this.camera.setViewOffset(this.width,this.height,-this.width*.15,0,this.width,this.height);else this.camera.clearViewOffset();this.camera.updateProjectionMatrix();fitLabels(zone.scene,this.camera,1-.9*title);
  // The bright hall needs a high bloom threshold, or the white floor blooms.
  this.pass.scene=zone.scene;const lab=shot.zone==='lab';this.bloom.threshold=lab?.95:.8;this.bloom.strength=(lab?.18:.55)+.12*(a.high_6000_12000_drive??0)+.3*this.tl.drop(t);this.composer.render(0);this.drawOverlay(t,shot,tech,title);
  this.lastState={t,shot:shot.id,chapter:this.tl.chapter(t).id,zone:shot.zone,mode:shot.mode,camera:this.camera.position.toArray(),target:c.target.toArray(),status:status(t).code,pmtu:hostPmtu(t),titleOpacity:title,technicalDock:tech?DOCK:null,visibility:this.tl.visibility(t)};return this.lastState;
 }
 drawOverlay(t,shot,tech,title){
  const g=this.overlay.getContext('2d'),scale=this.width/1920,h=this.height/scale;g.clearRect(0,0,this.width,this.height);g.save();g.scale(scale,scale);
  g.globalAlpha=1-title;drawHeader(g,t,shot);if(tech&&shot.mode!=='pain')drawDock(g,t,shot);drawWords(g,t,this.tl,h,shot.zone==='lab');drawUser(g,t,shot,h);drawLog(g,t,h);g.globalAlpha=1;drawTitles(g,h,title,t);
  if(this.debug){g.globalAlpha=1;g.fillStyle='rgba(3,12,22,.94)';g.fillRect(64,h-290,1500,74);text(g,`${this.tl.chapter(t).id} · ${shot.id} · ${shot.zone}/${shot.camera}/${shot.mode}${shot.target?' → '+shot.target:''} · ${t.toFixed(3)} s`,82,h-262,18);text(g,`${shot.eventIds.join(' ')} / ${shot.lyricIds.join(' ')} · 135 BPM geschätzt · Netzszenario redaktionell`,82,h-234,16,'#83b6c5');}
  g.restore();const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(0,0,0,${black})`;g.fillRect(0,0,this.width,this.height);}
 }
}
