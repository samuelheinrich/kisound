import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { DURATION, FPS, PALETTE as P } from './config.js';
import { clamp,smooth } from './timeline.js';
import { HallZone } from './zones/hall.js';
import { DeviceZone } from './zones/device.js';
import { SpectrumZone } from './zones/spectrum.js';
import { ProtocolZone } from './zones/protocol.js';
import { radioState } from './roaming.js';
import {drawTechnical,drawSyslog} from './telemetry-overlay.js';

export class Film {
 constructor({renderer,width,height,overlay,timeline,sets,debug=false}){
  this.renderer=renderer;this.width=width;this.height=height;this.overlay=overlay;this.tl=timeline;this.debug=debug;
  this.camera=new THREE.PerspectiveCamera(45,width/height,.025,300);
  this.zones={hall:new HallZone(sets),device:new DeviceZone(),spectrum:new SpectrumZone(),protocol:new ProtocolZone()};
  this.composer=new EffectComposer(renderer);
  this.pass=new RenderPass(this.zones.hall.scene,this.camera);this.composer.addPass(this.pass);
  this.bloom=new UnrealBloomPass(new THREE.Vector2(width,height),.38,.45,1.1);this.composer.addPass(this.bloom);
  this.composer.addPass(new OutputPass());
  const fxaa=new ShaderPass(FXAAShader);fxaa.material.uniforms.resolution.value.set(1/width,1/height);this.composer.addPass(fxaa);
  this.lastState=null;
 }
 render(time){
  const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),a=this.tl.sample(t),zone=this.zones[shot.zone];
  zone.update(t,a,this.tl,shot);
  const cam=zone.camera(shot,t);this.camera.position.copy(cam.pos);this.camera.lookAt(cam.target);this.camera.fov=cam.fov;
  this.camera.rotateZ(cam.roll||0);
  if(shot.zone==='hall')this.camera.clearViewOffset();
  else this.camera.setViewOffset(this.width,this.height,-this.width*.21,0,this.width,this.height);
  this.camera.updateProjectionMatrix();
  this.pass.scene=zone.scene;
  // Fast cuts, local onset impulses and controlled bank angles; no white full-frame strobe.
  this.bloom.strength=.28+.10*a.high_6000_12000_drive;
  this.composer.render(0);
  this.drawOverlay(t,shot);
  this.lastState={t,shot:shot.id,chapter:this.tl.chapter(t).id,zone:shot.zone,visibility:this.tl.visibility(t),camera:this.camera.position.toArray(),target:cam.target.toArray()};
  return this.lastState;
 }
 drawOverlay(t,shot){
  const g=this.overlay.getContext('2d'),W=this.width,H=this.height,scale=W/1920;
  g.clearRect(0,0,W,H);g.save();g.scale(scale,scale);const h=H/scale,r=radioState(t);
  const titleOpacity=Math.max(smooth(.5,1.8,t)*(1-smooth(7.5,9.1,t)),smooth(168.8,170.2,t));
  g.globalAlpha=1-titleOpacity;
  g.fillStyle='#accada';g.font='18px "JetBrains Mono"';g.fillText('802.11 / NIGHTWALK',64,60);
  g.textAlign='right';g.fillStyle=r.dfs?'#ffbc6c':'#62def1';g.fillText(`AP-0${r.ap+1} / CH ${r.channel} / ${r.phase}`,1856,60);g.textAlign='left';
  drawTechnical(g,t,shot,this.tl);
  g.globalAlpha=1;
  if(titleOpacity>0)this.drawTitles(g,h,titleOpacity);
  drawSyslog(g,t,h);
  if(this.debug){g.fillStyle='rgba(3,12,22,.92)';g.fillRect(64,92,1200,78);g.fillStyle='#d2e5ec';g.font='18px "JetBrains Mono"';g.fillText(`${this.tl.chapter(t).id} · ${shot.id} · ${shot.zone}/${shot.camera} · ${t.toFixed(3)} s`,82,122);g.fillStyle='#83b6c5';g.fillText(`${shot.eventIds.join(' ')} · 87 BPM geschätzt · Raster synthetisch`,82,153);}
  g.restore();const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(0,0,0,${black})`;g.fillRect(0,0,W,H);}
 }
 drawTitles(g,h,opacity){
  g.save();g.globalAlpha=opacity;
  const shade=g.createLinearGradient(0,0,0,h*.76);shade.addColorStop(0,'rgba(2,8,16,.75)');shade.addColorStop(.62,'rgba(2,8,16,.48)');shade.addColorStop(1,'rgba(2,8,16,0)');
  g.fillStyle=shade;g.fillRect(0,0,1920,h*.76);
  // Michroma's wide, squared capitals echo the cover, without baking a bitmap
  // into the film. All lettering stays sharp at arbitrary render resolutions.
  const y=h*.27;g.textAlign='center';g.textBaseline='alphabetic';g.font='400 100px "Michroma"';
  let metallic=g.createLinearGradient(0,y-80,0,y+4);metallic.addColorStop(0,'#f6fafb');metallic.addColorStop(.45,'#d3e0e6');metallic.addColorStop(.55,'#a7bac7');metallic.addColorStop(1,'#ecf5fa');
  g.shadowColor='rgba(119,203,234,.32)';g.shadowBlur=20;g.fillStyle=metallic;g.fillText('WIFI',960,y);
  const blue=g.createLinearGradient(0,y+35,0,y+132);blue.addColorStop(0,'#51d5ed');blue.addColorStop(.5,'#0bafd7');blue.addColorStop(1,'#007ba8');
  g.fillStyle=blue;g.shadowColor='rgba(0,175,232,.3)';g.fillText('ROAMING',960,y+128);
  g.shadowBlur=0;g.font='400 28px "Michroma"';g.fillStyle='#e2edf3';
  const name='SAMUEL HEINRICH',tracking=10;
  const widths=[...name].map(c=>g.measureText(c).width),total=widths.reduce((a,b)=>a+b,0)+tracking*(name.length-1);
  let x=960-total/2;g.textAlign='left';
  [...name].forEach((c,i)=>{g.fillText(c,x,y+200);x+=widths[i]+tracking;});
  const nameLeft=960-total/2,nameRight=960+total/2;
  g.strokeStyle='#edaa58';g.lineWidth=2;g.shadowColor='#edaa58';g.shadowBlur=10;
  for(const[a,b]of [[nameLeft-95,nameLeft-32],[nameRight+32,nameRight+95]]){g.beginPath();g.moveTo(a,y+190);g.lineTo(b,y+190);g.stroke();}
  g.restore();
 }
}
