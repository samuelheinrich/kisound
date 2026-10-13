import * as THREE from 'three';
import { PALETTE as P } from '../config.js';
import { smooth, clamp } from '../timeline.js';
import { baseScene, material,glow,box,point,display,dashboardTexture,labelTexture,figure,setInstance,dust,mix3,V } from '../world.js';
export class NocZone {
 constructor(sets){
  this.scene=baseScene(.025);const s=this.scene;
  box(s,[22,.2,19],[0,-.15,-1],material(0x102031,{roughness:.9,metalness:.05}));
  box(s,[19,6,.3],[0,2.9,-5.8],material(0x101e2e));
  for(const x of [-9,9])box(s,[.18,6,14],[x,3,-.5],material(0x102238));
  for(let z=-5;z<7;z+=2.5){box(s,[18,.14,.14],[0,5.1,z],material(0x2d4355));box(s,[12,.025,.035],[0,5.0,z],glow(P.white,.6));}
  for(const x of [-7.8,7.8])box(s,[.028,.02,13],[x,0,-.6],glow(P.blue,.45));
  this.textures={online:dashboardTexture(),alarm:dashboardTexture('alarm'),standby:dashboardTexture('standby')};
  this.wall=display(s,8.2,4.1,[0,2.72,-5.59],this.textures.standby);
  display(s,2.7,.675,[-6.3,3.9,-5.58],labelTexture('NIGHT OPERATIONS','LINK / ROUTE / SERVICE','#8fbace'));
  display(s,2.7,.675,[6.3,3.9,-5.58],labelTexture('ON WATCH','MONITORING ACTIVE'));
  this.smallScreens=[];this.crew=[];
  for(let i=0;i<3;i++){
   const x=(i-1)*3.6,z=i===1?2.7:.1;
   box(s,[2.8,.12,1.15],[x,.96,z],material(0x243444),.035);
   for(const dx of [-1.13,1.13])box(s,[.07,.93,.65],[x+dx,.45,z],material(0x141e28));
   box(s,[2.65,.025,.02],[x,.93,z+.58],glow(P.cyan,.55));
   for(const dx of [-.7,.7]){
    box(s,[.055,.45,.055],[x+dx,1.2,z-.23],material(0x304358));
    const m=display(s,1.22,.61,[x+dx,1.57,z-.18],this.textures.online);this.smallScreens.push(m);
   }
   box(s,[.58,.03,.21],[x,1.04,z+.3],material(0x364758),.01);
   for(let k=0;k<12;k++)box(s,[.026,.006,.12],[x-.25+k*.043,1.061,z+.3],material(0x78909f));
   box(s,[.52,.09,.5],[x,.58,z+1.0],material(0x152337),.04);
   box(s,[.5,.5,.06],[x,.9,z+1.24],material(0x152337),.035);
   box(s,[.06,.5,.06],[x,.3,z+1.0],material(0x415163));
   if(i!==1)this.crew.push(figure(s,[x,0,z+.83],1.04));
  }
  this.led=box(s,[.08,.025,.025],[.95,1.065,3.25],glow(P.green));
  this.light=point(s,P.cyan,32,[0,3,-3],14);point(s,P.amber,24,[7,3,3],12);
  this.particles=dust(s,90,18);
  // Separate user vignette in the same zone, using the office and laptop sets.
  this.user=new THREE.Group();this.user.position.set(30,0,0);s.add(this.user);
  setInstance(sets,'office',this.user,[0,0,0]);
  const laptop=setInstance(sets,'laptop',this.user,sets.at('office','laptop').toArray());
  const a=sets.anchor('laptop','screen');
  this.userScreen=new THREE.Mesh(new THREE.PlaneGeometry(a.props.w,a.props.h),new THREE.MeshBasicMaterial({map:labelTexture('CONNECTED','Service reachable'),side:THREE.DoubleSide,toneMapped:false}));
  // The shared laptop's bezel is viewed from local -Z. Place the display on
  // that exposed side rather than inside the glass; preserve its authored tilt.
  this.userScreen.position.copy(a.pos).addScaledVector(new THREE.Vector3(0,0,1).applyQuaternion(a.quat),-.003);
  this.userScreen.quaternion.copy(a.quat);this.userScreen.rotateY(Math.PI);laptop.add(this.userScreen);
  this.userFigure=figure(this.user,[0,0,-.48],.97);this.userFigure.group.rotation.y=Math.PI;
  point(s,P.amber,14,[29,2,-1],7);point(s,P.cyan,8,[30,1.4,0],5);
 }
 update(t,a,tl){
  const n=tl.network(t);this.wall.material.map=t<57.52?this.textures.standby:n.alarm>.15?this.textures.alarm:this.textures.online;
  this.smallScreens.forEach((m,i)=>{m.material.map=n.alarm>.15&&i<2?this.textures.alarm:this.textures.online;m.material.color.setScalar(.32+.65*smooth(8.72,14.54,t));});
  const vis=smooth(8.72,12,t);this.crew.forEach((f,i)=>{f.group.visible=vis>.05;f.group.scale.setScalar(1.04);f.update(t+i*2,.4+.6*n.alarm);});
  this.led.material.color.setHex(P.green).multiplyScalar(.6+tl.pulse(t,['E004','E019','E033'])*2);
  this.light.color.setHex(n.alarm>.1?P.amber:P.cyan);
  const opening=.25+.75*smooth(11.1,13.2,t)-.22*smooth(20.4,22,t)+.22*smooth(22.82,24,t);
  this.light.intensity=(20+20*a.mid_500_2000_drive)*opening;
  this.particles.rotation.y=t*.004;
  const hold=t>=133.72&&t<133.92?133.72:t;this.userFigure.update(hold,.6);
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t);
  const modes={
   desk:[[1.5,1.45,5.1],[.75,1.42,4.75],[0,1.1,2.7],[0,1.2,2.5],42],
   reveal:[[1.4,2.1,7.4],[5.4,2.7,7.4],[0,1.6,-.6],[0,1.7,-1.6],45],
   wall:[[-5.8,2.6,5],[-3.4,2.4,3.9],[0,2.5,-4.6],[0,2.5,-4.7],44],
   team:[[5.5,2.4,3.7],[4.7,1.9,2.5],[2.1,1.1,.2],[2.3,1.3,.05],47],
   wide:[[-6.8,3.4,8.9],[-4.2,3.2,8.6],[0,1.8,-1],[0,1.8,-1.6],49],
   watch:[[5.7,2.7,6.4],[2.4,2.3,7.1],[.5,1.6,-.2],[0,1.5,-1],48],
   user:[[30.85,1.58,-.52],[30.70,1.48,-.43],[30,.9,.02],[30,.9,.02],46],
  };
  const [p,q,r,s,fov]=modes[shot.camera]||modes.wide;return{pos:mix3(p,q,u),target:mix3(r,s,u),fov};
 }
}
