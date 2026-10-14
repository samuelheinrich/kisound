import * as THREE from 'three';
import {DURATION,LANG} from './config.js';
import {clamp} from './timeline.js';
import {filmState} from './model.js';
import {drawFlat,drawHud,text,W,H} from './draw.js';
import {World} from './world.js';

export class Film{
 constructor({renderer,width,height,overlay,timeline,debug=false}){
  Object.assign(this,{renderer,width,height,overlay,tl:timeline,debug});
  this.world=new World();this.scene=this.world.scene;this.camera=this.world.camera;
  this.camera.aspect=width/height;this.camera.updateProjectionMatrix();
  this.lastState=null;
 }
 render(time){const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),lyric=this.tl.lyricAt(t),a={...this.tl.sample(t),accent:this.tl.accent(t),drop:this.tl.drop(t),atmosphere:this.tl.atmosphere(t)};
  const flat=shot.mode==='2D',hybrid=shot.mode==='2D+3D',g=this.overlay.getContext('2d');
  if(!flat){this.world.update(t,shot,a);this.renderer.render(this.scene,this.camera);}
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,this.width,this.height);g.save();g.scale(this.width/W,this.height/H);
  if(flat)drawFlat(g,t,shot,a,lyric);else drawHud(g,t,shot,a,{hybrid:hybrid&&!['S003','S024','S043','S057','S064'].includes(shot.id),lyric});
  g.restore();const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(7,10,15,${black})`;g.fillRect(0,0,this.width,this.height);}
  if(this.debug){g.save();g.scale(this.width/W,this.height/H);g.fillStyle='rgba(6,12,18,.92)';g.fillRect(38,38,1500,102);
   text(g,`${LANG.toUpperCase()}  ${shot.id}  ${shot.chapter}  ${shot.zone}/${shot.mode}  ${t.toFixed(3)} s`,60,82,25,'#F4F3EA',600,'mono');
   text(g,`${shot.eventIds.join(' ')}  /  ${shot.lyricIds.join(' ')}  ·  ${filmState(t).catalog} / ${filmState(t).pattern} / ${filmState(t).app}`,60,119,19,'#44DDE5',500,'mono');g.restore();}
  const m=filmState(t);this.lastState={...m,chapter:this.tl.chapter(t).id,lang:LANG,flat,zone:shot.zone,
   camera:this.camera.position.toArray(),target:new THREE.Vector3(0,1.5,-.3).toArray(),visibility:this.tl.visibility(t),
   eventIds:shot.eventIds,lyricIds:shot.lyricIds};return this.lastState;
 }
}
