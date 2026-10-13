import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { DURATION, FPS, PALETTE as P } from './config.js';
import { clamp,smooth } from './timeline.js';
import { NocZone } from './zones/noc.js';
import { CityZone } from './zones/city.js';
import { InfrastructureZone } from './zones/infrastructure.js';
import { TopologyZone } from './zones/topology.js';

const STATUS=[
 [0,'WATCH ACTIVE','Monitoring service availability'],
 [11.1,'SESSION READY','Operator console connected'],
 [30.4,'ACCESS REACHABLE','District connections available'],
 [55.52,'STANDBY AVAILABLE','Alternate path provisioned'],
 [57.52,'PRIMARY DEGRADED','Investigating path health'],
 [59.36,'FAILOVER ACTIVE','Traffic switching to alternate path'],
 [67.18,'ALARMS CORRELATED','Primary path isolated'],
 [70.98,'SERVICE RESTORED','Reachability confirmed'],
 [95,'LINK UP','Carrier established'],
 [96.62,'ROUTE VALID','Forwarding path available'],
 [99.66,'PORTS FORWARDING','Access interfaces operational'],
 [103.02,'TRAFFIC FORWARDED','Alternate path carrying traffic'],
 [108.16,'VALIDATION ACTIVE','Checking alternate path stability'],
 [124,'VALIDATION COMPLETE','Service remains reachable'],
 [132.16,'CLIENT CONNECTED','Application service available'],
 [137.76,'FAULT ISOLATED','Primary path remains out of service'],
 [147.94,'SERVICE REACHABLE','Monitoring across access and core'],
 [163.18,'WATCH CONTINUES','All service checks active'],
 [178.6,'DISTRICTS CONNECTED','Night operations continue'],
];
export class Film {
 constructor({renderer,width,height,overlay,timeline,sets,debug=false}){
  this.renderer=renderer;this.width=width;this.height=height;this.overlay=overlay;this.tl=timeline;this.debug=debug;
  this.camera=new THREE.PerspectiveCamera(45,width/height,.025,300);
  this.zones={noc:new NocZone(sets),city:new CityZone(sets),infrastructure:new InfrastructureZone(sets),topology:new TopologyZone()};
  this.composer=new EffectComposer(renderer);
  this.pass=new RenderPass(this.zones.noc.scene,this.camera);this.composer.addPass(this.pass);
  this.bloom=new UnrealBloomPass(new THREE.Vector2(width,height),.38,.45,1.1);this.composer.addPass(this.bloom);
  this.composer.addPass(new OutputPass());
  const fxaa=new ShaderPass(FXAAShader);fxaa.material.uniforms.resolution.value.set(1/width,1/height);this.composer.addPass(fxaa);
  this.lastState=null;
 }
 render(time){
  const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),a=this.tl.sample(t),zone=this.zones[shot.zone];
  zone.update(t,a,this.tl);
  const cam=zone.camera(shot,t);this.camera.position.copy(cam.pos);this.camera.lookAt(cam.target);this.camera.fov=cam.fov;
  this.camera.updateProjectionMatrix();
  this.pass.scene=zone.scene;
  // Limited bloom for bright physical details. No full-screen beat flashes or shake.
  this.bloom.strength=.28+.10*a.high_6000_12000_drive;
  this.composer.render(0);
  this.drawOverlay(t,shot);
  this.lastState={t,shot:shot.id,chapter:this.tl.chapter(t).id,zone:shot.zone,visibility:this.tl.visibility(t),camera:this.camera.position.toArray(),target:cam.target.toArray()};
  return this.lastState;
 }
 drawOverlay(t,shot){
  const g=this.overlay.getContext('2d'),W=this.width,H=this.height,scale=W/1920;
  g.clearRect(0,0,W,H);g.save();g.scale(scale,scale);
  const h=H/scale,margin=64;
  const titleOpacity=Math.max(smooth(.65,1.8,t)*(1-smooth(6.9,8.4,t)),smooth(198.6,200.1,t));
  g.globalAlpha=1-titleOpacity;
  // Restrained system UI. All text below is authored network status, never sung lyrics.
  let status=STATUS[0];for(const row of STATUS)if(row[0]<=t)status=row;
  const alert=t>=57.52&&t<72.86,col=alert?'#ffb55d':'#79e6bc';
  const top=g.createLinearGradient(0,0,0,145);top.addColorStop(0,'rgba(3,9,18,.75)');top.addColorStop(1,'rgba(3,9,18,0)');g.fillStyle=top;g.fillRect(0,0,1920,145);
  g.fillStyle='#9bb4c7';g.font='500 18px "JetBrains Mono"';g.fillText('NOC / NIGHT OPERATIONS',margin,62);
  g.fillStyle=col;g.beginPath();g.arc(1590,55,4,0,Math.PI*2);g.fill();
  g.font='16px "JetBrains Mono"';g.fillText(alert?'INVESTIGATION ACTIVE':'SUPERVISION ACTIVE',1610,61);
  const gradient=g.createLinearGradient(0,h-205,0,h);gradient.addColorStop(0,'rgba(3,9,18,0)');gradient.addColorStop(1,'rgba(3,9,18,.86)');g.fillStyle=gradient;g.fillRect(0,h-205,1920,205);
  g.fillStyle=col;g.fillRect(margin,h-113,3,61);
  g.font='500 25px "Space Grotesk"';g.fillText(status[1],margin+21,h-91);
  g.fillStyle='#9bb0bf';g.font='17px "JetBrains Mono"';g.fillText(status[2],margin+21,h-59);
  g.strokeStyle='#3a566b';g.lineWidth=1;g.beginPath();g.moveTo(1580,h-65);g.lineTo(1856,h-65);g.stroke();
  const net=this.tl.network(t);g.strokeStyle=col;g.beginPath();g.moveTo(1580,h-65);g.lineTo(1580+(1856-1580)*(.15+.85*net.online),h-65);g.stroke();
  g.fillStyle='#8098ac';g.font='13px "JetBrains Mono"';g.fillText('SERVICE AVAILABILITY',1580,h-84);
  g.globalAlpha=1;
  if(titleOpacity>0)this.drawTitles(g,h,titleOpacity);
  if(this.debug){
   const recent=this.tl.analysis.events.filter(e=>Math.abs(t-e.time_s)<1.5).map(e=>e.id).join(' ');
   g.fillStyle='rgba(4,13,24,.91)';g.fillRect(64,100,970,88);
   g.fillStyle='#d9edf5';g.font='18px "JetBrains Mono"';g.fillText(`${this.tl.chapter(t).id} · ${shot.id} · ${shot.zone}/${shot.camera} · ${t.toFixed(3)} s`,83,133);
   g.fillStyle='#9cc1d0';g.fillText(`Cues: ${recent||'—'} · 126 BPM geschätzt · Raster synthetisch`,83,165);
  }
  g.restore();
  const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(0,0,0,${black})`;g.fillRect(0,0,W,H);}
 }
 drawTitles(g,h,opacity){
  g.save();g.globalAlpha=opacity;
  const shade=g.createLinearGradient(0,0,0,h*.76);shade.addColorStop(0,'rgba(2,8,16,.75)');shade.addColorStop(.62,'rgba(2,8,16,.48)');shade.addColorStop(1,'rgba(2,8,16,0)');
  g.fillStyle=shade;g.fillRect(0,0,1920,h*.76);
  // Michroma's wide, squared capitals echo the cover, without baking a bitmap
  // into the film. All lettering stays sharp at arbitrary render resolutions.
  const y=h*.27;g.textAlign='center';g.textBaseline='alphabetic';g.font='400 100px "Michroma"';
  let metallic=g.createLinearGradient(0,y-80,0,y+4);metallic.addColorStop(0,'#f6fafb');metallic.addColorStop(.45,'#d3e0e6');metallic.addColorStop(.55,'#a7bac7');metallic.addColorStop(1,'#ecf5fa');
  g.shadowColor='rgba(119,203,234,.32)';g.shadowBlur=20;g.fillStyle=metallic;g.fillText('NETWORK',960,y);
  const blue=g.createLinearGradient(0,y+35,0,y+132);blue.addColorStop(0,'#51d5ed');blue.addColorStop(.5,'#0bafd7');blue.addColorStop(1,'#007ba8');
  g.fillStyle=blue;g.shadowColor='rgba(0,175,232,.3)';g.fillText('ENGINEERS',960,y+128);
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
