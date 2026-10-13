import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
import {DURATION} from './config.js';
import {clamp,smooth} from './timeline.js';
const wp=new THREE.Vector3();
import {queued,policerDrops,tcpAck,rtpReceived} from './model.js';
import {fitLabels} from './world.js';
import {HallZone} from './zones/hall.js';
import {drawHeader,drawDock,drawMeter,drawWords,drawTitles,drawLog,titleOpacity,text} from './overlay.js';
const BLOOM={hall:.5};
export class Film{
 constructor({renderer,width,height,overlay,timeline,debug=false}){
  Object.assign(this,{renderer,width,height,overlay,tl:timeline,debug});
  this.zones={hall:new HallZone()};this.camera=new THREE.PerspectiveCamera(40,width/height,.05,600);
  this.composer=new EffectComposer(renderer);this.pass=new RenderPass(this.zones.hall.scene,this.camera);this.composer.addPass(this.pass);this.bloom=new UnrealBloomPass(new THREE.Vector2(width,height),.5,.5,.8);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());const fxaa=new ShaderPass(FXAAShader);fxaa.material.uniforms.resolution.value.set(1/width,1/height);this.composer.addPass(fxaa);
 }
 render(time){
  const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),a=this.tl.sample(t),zone=this.zones[shot.zone],title=titleOpacity(t);
  zone.update(t,a,this.tl,shot);const c=zone.camera(shot,t);this.camera.position.copy(c.pos);this.camera.lookAt(c.target);this.camera.fov=c.fov;this.camera.updateProjectionMatrix();fitLabels(zone.scene,this.camera,1-.9*title);this.camera.updateMatrixWorld();this.declutter(zone.scene);
  this.pass.scene=zone.scene;this.bloom.strength=BLOOM[shot.zone]+.1*(a.high_6000_12000_drive??0)+.3*this.tl.drop(t);this.composer.render(0);const ov=this.drawOverlay(t,shot,title);
  this.lastState={t,shot:shot.id,chapter:this.tl.chapter(t).id,zone:shot.zone,mode:shot.mode,camera:this.camera.position.toArray(),target:c.target.toArray(),queueRtp:queued('rtp',t),queueBulk:queued('tcp',t),policerDrops:policerDrops(t),rtpReceived:rtpReceived(t),tcpAck:tcpAck(t),titleOpacity:title,visibility:this.tl.visibility(t),technicalDock:ov.dock,word:ov.word};return this.lastState;
 }
 // Far labels that would be unreadable, and labels drifting into the header band, fade out.
 declutter(scene){const px=this.height/(2*Math.tan(this.camera.fov*Math.PI/360));scene.traverse(o=>{const w=o.userData?.labelWidth;if(!w||!o.visible)return;o.getWorldPosition(wp);const d=wp.distanceTo(this.camera.position);wp.project(this.camera);const size=o.scale.x/d*px/this.height*1080;
  o.material.opacity*=smooth(90,150,size)*(1-smooth(.74,.84,wp.y));});}
 drawOverlay(t,shot,title){
  const g=this.overlay.getContext('2d'),scale=this.width/1920,h=this.height/scale;g.clearRect(0,0,this.width,this.height);g.save();g.scale(scale,scale);let dock=null,word=null;const screen=false;
  g.globalAlpha=1-title;drawHeader(g,t);word=drawWords(g,t,this.tl,h);g.globalAlpha=1-title;if(!screen){dock=drawDock(g,t);g.globalAlpha=1-title;drawMeter(g,t,h);g.globalAlpha=1-title;drawLog(g,t,h);}g.globalAlpha=1;drawTitles(g,h,title);
  if(this.debug){g.globalAlpha=1;g.fillStyle='rgba(3,12,22,.94)';g.fillRect(64,h-330,1250,74);text(g,`${this.tl.chapter(t).id} · ${shot.id} · ${shot.zone}/${shot.camera}/${shot.mode}${shot.target?' → '+shot.target:''} · ${t.toFixed(3)} s`,82,h-302,18);text(g,`${shot.eventIds.join(' ')} / ${shot.lyricIds.join(' ')} · 129 BPM geschätzt · Szenario redaktionell`,82,h-274,16,'#83b6c5');}
  g.restore();const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(0,0,0,${black})`;g.fillRect(0,0,this.width,this.height);}
  return{dock,word};
 }
}
