import * as THREE from 'three';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {ShaderPass} from 'three/addons/postprocessing/ShaderPass.js';
import {FXAAShader} from 'three/addons/shaders/FXAAShader.js';
import {DURATION} from './config.js';
import {clamp} from './timeline.js';
import {networkState} from './protocol-model.js';
import {TopologyZone} from './zones/topology.js';
import {FrameZone} from './zones/frame.js';
import {ControlZone} from './zones/control.js';
import {TunnelZone} from './zones/tunnel.js';
import {drawTechnical,drawSyslog,drawTitles,titleOpacity,text,DOCK} from './overlay.js';
export class Film{
 constructor({renderer,width,height,overlay,timeline,debug=false}){
  this.renderer=renderer;this.width=width;this.height=height;this.overlay=overlay;this.tl=timeline;this.debug=debug;
  this.zones={topology:new TopologyZone(),frame:new FrameZone(),control:new ControlZone(),tunnel:new TunnelZone()};this.camera=new THREE.PerspectiveCamera(45,width/height,.04,160);
  this.composer=new EffectComposer(renderer);this.pass=new RenderPass(this.zones.topology.scene,this.camera);this.composer.addPass(this.pass);
  this.bloom=new UnrealBloomPass(new THREE.Vector2(width,height),.29,.42,1.1);this.composer.addPass(this.bloom);this.composer.addPass(new OutputPass());
  const fxaa=new ShaderPass(FXAAShader);fxaa.material.uniforms.resolution.value.set(1/width,1/height);this.composer.addPass(fxaa);
 }
 render(time){
  const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),a=this.tl.sample(t),zone=this.zones[shot.zone],title=titleOpacity(t),technical=!['osi','domain','final','wire','known'].includes(shot.mode)&&title<.01;
  zone.update(t,a,this.tl,shot);const c=zone.camera(shot,t);this.camera.position.copy(c.pos);this.camera.lookAt(c.target);this.camera.fov=c.fov;
  if(technical)this.camera.setViewOffset(this.width,this.height,-this.width*.17,0,this.width,this.height);else this.camera.clearViewOffset();this.camera.updateProjectionMatrix();this.pass.scene=zone.scene;
  this.bloom.strength=.25+.07*a.high_6000_12000_drive;this.composer.render(0);this.drawOverlay(t,shot,technical,title);
  const n=networkState(t);this.lastState={t,shot:shot.id,chapter:this.tl.chapter(t).id,zone:shot.zone,mode:shot.mode,camera:this.camera.position.toArray(),target:c.target.toArray(),root:n.root,stp:n.stp,port:n.port,macEntries:n.macEntries,titleOpacity:title,technicalDock:technical?DOCK:null,visibility:this.tl.visibility(t)};return this.lastState;
 }
 drawOverlay(t,shot,technical,title){
  const g=this.overlay.getContext('2d'),scale=this.width/1920,h=this.height/scale;g.clearRect(0,0,this.width,this.height);g.save();g.scale(scale,scale);
  g.globalAlpha=1-title;text(g,'802.3 / LAYER TWO',64,61,18,'#accada');g.textAlign='right';text(g,networkState(t).status,1856,61,18,'#59d8ed');g.textAlign='left';if(technical)drawTechnical(g,t,shot);drawSyslog(g,t,h);g.globalAlpha=1;drawTitles(g,h,title);
  if(this.debug){g.fillStyle='rgba(3,12,22,.94)';g.fillRect(64,h-288,1470,74);text(g,`${this.tl.chapter(t).id} · ${shot.id} · ${shot.zone}/${shot.camera} · ${t.toFixed(3)} s`,82,h-260,18);text(g,`${shot.eventIds.join(' ')} / ${shot.lyricIds.join(' ')} · 128 BPM geschätzt · Netzwerkszenario redaktionell`,82,h-232,16,'#83b6c5');}
  g.restore();const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(0,0,0,${black})`;g.fillRect(0,0,this.width,this.height);}
 }
}
