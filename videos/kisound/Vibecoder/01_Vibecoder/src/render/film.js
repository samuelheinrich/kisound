import * as THREE from 'three';
import {DURATION,LANG} from './config.js';
import {clamp,smooth} from './timeline.js';
import {filmState} from './model.js';
import {drawFlat,drawHud,text,W,H} from './draw.js';
import {World} from './world.js';

export class Film{
 constructor({renderer,width,height,overlay,timeline,debug=false}){
  Object.assign(this,{renderer,width,height,overlay,tl:timeline,debug});
  this.world=new World();this.scene=this.world.scene;this.camera=this.world.camera;
  this.camera.aspect=width/height;this.camera.updateProjectionMatrix();
  this.flatCanvas=document.createElement('canvas');this.flatCanvas.width=W;this.flatCanvas.height=H;
  this.flatTexture=new THREE.CanvasTexture(this.flatCanvas);this.flatTexture.colorSpace=THREE.SRGBColorSpace;
  this.flatTexture.anisotropy=8;
  this.lastState=null;
 }
 isFlat(shot){return shot.mode==='2D'&&!['S002','S021','S054'].includes(shot.id)||shot.id==='S062';}
 flatZoom(t,shot){
  const shots=this.tl.shots;let i=shots.indexOf(shot),first=i,last=i;
  while(first>0&&this.isFlat(shots[first-1]))first--;
  while(last<shots.length-1&&this.isFlat(shots[last+1]))last++;
  const start=shots[first].start,end=shots[last].end;
  const entry=start+(shots[first].id==='S059'?.68:0),duration=Math.min(.62,(end-entry)*.32);
  return Math.min(smooth(entry,entry+duration,t),1-smooth(end-duration,end,t));
 }
 render(time){const t=clamp(Number.isFinite(time)?time:0,0,DURATION),shot=this.tl.shot(t),lyric=this.tl.lyricAt(t),a={...this.tl.sample(t),accent:this.tl.accent(t),drop:this.tl.drop(t),cheer:this.tl.cheer(t),rideArms:this.tl.rideArms(t),atmosphere:this.tl.atmosphere(t)};
  const flat=this.isFlat(shot),hybrid=shot.mode==='2D+3D',g=this.overlay.getContext('2d'),zoom=flat?this.flatZoom(t,shot):0;
  if(flat){drawFlat(this.flatCanvas.getContext('2d'),t,shot,a,lyric);this.flatTexture.needsUpdate=true;}
  this.world.update(t,shot,a,zoom);
  this.world.setLaptopTexture(flat?this.flatTexture:this.world.monitorTexture.texture);
  this.renderer.render(this.scene,this.camera);
  g.setTransform(1,0,0,1,0,0);g.clearRect(0,0,this.width,this.height);g.save();g.scale(this.width/W,this.height/H);
  if(flat){
   g.save();g.globalAlpha=1-smooth(0,.75,zoom);drawHud(g,t,shot,a,{hybrid:false,lyric});g.restore();
   g.globalAlpha=smooth(.78,1,zoom);g.drawImage(this.flatCanvas,0,0,W,H);g.globalAlpha=1;
  }
  else{const id=Number(shot.id.slice(1)),clearPlace=id<=15||id>=29&&id<=37;
   drawHud(g,t,shot,a,{hybrid:hybrid&&!clearPlace&&!['S021','S024','S043','S057','S064'].includes(shot.id),lyric});}
  g.restore();const black=1-this.tl.visibility(t);if(black>0){g.fillStyle=`rgba(7,10,15,${black})`;g.fillRect(0,0,this.width,this.height);}
  if(this.debug){g.save();g.scale(this.width/W,this.height/H);g.fillStyle='rgba(6,12,18,.92)';g.fillRect(38,38,1500,102);
   text(g,`${LANG.toUpperCase()}  ${shot.id}  ${shot.chapter}  ${shot.zone}/${shot.mode}  ${t.toFixed(3)} s`,60,82,25,'#F4F3EA',600,'mono');
   text(g,`${shot.eventIds.join(' ')}  /  ${shot.lyricIds.join(' ')}  ·  ${filmState(t).catalog} / ${filmState(t).pattern} / ${filmState(t).app}`,60,119,19,'#44DDE5',500,'mono');g.restore();}
  const m=filmState(t);this.lastState={...m,chapter:this.tl.chapter(t).id,lang:LANG,flat,screenZoom:zoom,zone:shot.zone,
   camera:this.camera.position.toArray(),target:this.world.places.target.toArray(),visibility:this.tl.visibility(t),
   eventIds:shot.eventIds,lyricIds:shot.lyricIds};return this.lastState;
 }
}
