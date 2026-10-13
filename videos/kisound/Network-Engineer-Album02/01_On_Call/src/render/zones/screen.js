// The display surface itself: the camera travels orthogonally along it (70 mm), type stays undistorted.
import * as THREE from 'three';
import {V,mat,additive,setGlow} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {DW,DH,REGION} from '../display.js';
const SW=16,SH=SW*DH/DW,TAN=Math.tan(19.5/2*Math.PI/180),ASPECT=16/9;
// Canvas pixels → world position on the plane (centred at the origin, facing +z).
const px=(x,y)=>[(x/DW-.5)*SW,(.5-y/DH)*SH,0];
export class ScreenZone{
 constructor(display){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x010204);
  box3(s);this.plane=new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),new THREE.MeshBasicMaterial({map:display.tex,toneMapped:false}));s.add(this.plane);
  // faint scanlines and a cursor line that sweeps along the active row (the match cut to the light rail)
  this.scan=new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{t:{value:0}},vertexShader:'varying vec2 u;void main(){u=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
   fragmentShader:'uniform float t;varying vec2 u;void main(){float l=.5+.5*sin(u.y*1440.*3.1416);float v=smoothstep(.0,.6,distance(u,vec2(.5)));gl_FragColor=vec4(0.,0.,0.,.10*l+.35*v);}'}));this.scan.position.z=.002;s.add(this.scan);
  this.cursor=new THREE.Mesh(new THREE.PlaneGeometry(SW,.012),additive(0x5fe0ff,0));this.cursor.position.z=.004;s.add(this.cursor);
  function box3(scene){const bez=new THREE.Mesh(new THREE.BoxGeometry(SW+.5,SH+.5,.3),mat(0x07090c,{roughness:.4}));bez.position.z=-.17;scene.add(bez);}
 }
 update(t,a,tl,shot){this.scan.material.uniforms.t.value=t;const r=REGION[shot.mode]||REGION.ticket,age=t-shot.start;this.cursor.position.y=px(0,lerp(r[1],r[3],clamp(age/1.2)))[1];setGlow(this.cursor.material,0x5fe0ff,.5*Math.exp(-age/.8));}
 camera(shot,t){
  const r=REGION[shot.mode]||REGION.ticket,lin=clamp((t-shot.start)/(shot.end-shot.start)),u=smooth(0,1,lin);
  const w=(r[2]-r[0])/DW*SW,h=(r[3]-r[1])/DH*SH,c=px((r[0]+r[2])/2,(r[1]+r[3])/2),fit=Math.max(h,w/ASPECT)*1.06,dist=fit/(2*TAN);
  const drift=Math.min(.12*w,.5)*(+shot.id.slice(1)%2?1:-1),x=c[0]+lerp(-drift,drift,u),y=c[1]+lerp(.04,-.04,u)*h;
  return{pos:V([x,y,dist*lerp(1.03,.98,u)]),target:V([x,y,0]),fov:19.5};
 }
}
