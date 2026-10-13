import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
import {DURATION} from './config.js';
import {clamp} from './timeline.js';
import {counter,aclBound} from './model.js';
import {fitLabels} from './world.js';
import {createDisplay,createLaptop} from './display.js';
import {CityZone} from './zones/city.js';
import {DeskZone} from './zones/desk.js';
import {ScreenZone} from './zones/screen.js';
import {RouterZone} from './zones/router.js';
import {drawHeader,drawDock,drawWords,drawTitles,drawLog,titleOpacity,text} from './overlay.js';
const BLOOM={city:.75,desk:.45,screen:.22,router:.6};
export class Film{
 constructor({renderer,width,height,overlay,timeline,debug=false}){
  Object.assign(this,{renderer,width,height,overlay,tl:timeline,debug});this.display=createDisplay();this.laptop=createLaptop();
  this.zones={city:new CityZone(),desk:new DeskZone(this.display,this.laptop),screen:new ScreenZone(this.display),router:new RouterZone()};this.camera=new THREE.PerspectiveCamera(40,width/height,.02,900);
  this.composer=new EffectComposer(renderer);this.pass=new RenderPass(this.zones.city.scene,this.camera);this.composer.addPass(this.pass);this.bloom=new UnrealBloomPass(new THREE.Vector2(width,height),.5,.5,.8);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());const fxaa=new ShaderPass(FXAAShader);fxaa.material.uniforms.resolution.value.set(1/width,1/height);this.composer.addPass(fxaa);
 }
 render(time){
  const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),a=this.tl.sample(t),zone=this.zones[shot.zone],title=titleOpacity(t);
  this.display.update(t);if(shot.zone==='desk')this.laptop.update(t);
  zone.update(t,a,this.tl,shot);const c=zone.camera(shot,t);this.camera.position.copy(c.pos);this.camera.lookAt(c.target);this.camera.fov=c.fov;this.camera.near=shot.zone==='desk'?.01:.05;this.camera.updateProjectionMatrix();fitLabels(zone.scene,this.camera,1-.9*title);
  this.pass.scene=zone.scene;this.bloom.strength=BLOOM[shot.zone]+.1*(a.high_6000_12000_drive??0)+.35*this.tl.drop(t);this.composer.render(0);const ov=this.drawOverlay(t,shot,title);
  this.lastState={t,shot:shot.id,chapter:this.tl.chapter(t).id,zone:shot.zone,mode:shot.mode,camera:this.camera.position.toArray(),target:c.target.toArray(),counter:counter(t),aclBound:aclBound(t),titleOpacity:title,visibility:this.tl.visibility(t),technicalDock:ov.dock,word:ov.word};return this.lastState;
 }
 drawOverlay(t,shot,title){
  const g=this.overlay.getContext('2d'),scale=this.width/1920,h=this.height/scale;g.clearRect(0,0,this.width,this.height);g.save();g.scale(scale,scale);let dock=null,word=null;
  g.globalAlpha=1-title;drawHeader(g,t,shot.zone,shot.camera);word=drawWords(g,t,this.tl,h,shot.zone==='screen');if(shot.zone!=='screen'&&shot.camera!=='aisle')dock=drawDock(g,t,h);g.globalAlpha=1-title;if(shot.zone==='router')drawLog(g,t,h);g.globalAlpha=1;drawTitles(g,h,title);
  if(this.debug){g.globalAlpha=1;g.fillStyle='rgba(3,12,22,.94)';g.fillRect(64,h-290,1500,74);text(g,`${this.tl.chapter(t).id} · ${shot.id} · ${shot.zone}/${shot.camera}/${shot.mode}${shot.target?' → '+shot.target:''} · ${t.toFixed(3)} s`,82,h-262,18);text(g,`${shot.eventIds.join(' ')} / ${shot.lyricIds.join(' ')} · 127,4 BPM geschätzt · Szenario redaktionell`,82,h-234,16,'#83b6c5');}
  g.restore();const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(0,0,0,${black})`;g.fillRect(0,0,this.width,this.height);}
  return{dock,word};
 }
}
