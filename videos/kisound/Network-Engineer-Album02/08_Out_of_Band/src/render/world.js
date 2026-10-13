import * as THREE from 'three';
import {PALETTE as P,SEED} from './config.js';
export const V=a=>a.isVector3?a.clone():new THREE.Vector3(...a);
export function random(i){const n=Math.sin((i+SEED)*127.1)*43758.5453;return n-Math.floor(n);}
export function mat(color=P.steel,opts={}){return new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.35,...opts});}
export function glow(color=P.cyan,strength=1){return new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(strength),toneMapped:false});}
// Additive glow: brightness in the colour doubles as opacity, so per-frame fades need no sorting.
export function additive(color=P.cyan,strength=1){return new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(strength),toneMapped:false,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});}
export function setGlow(material,color,strength){material.color.setHex(color).multiplyScalar(Math.max(0,strength));}
export function box(parent,size,pos,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);mesh.position.copy(V(pos));parent.add(mesh);return mesh;}
export function line(parent,points,color=P.cyan,opacity=.8){const mesh=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(V)),new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));parent.add(mesh);return mesh;}
export function tube(parent,pts,material,r=.03,segments=64,curve=false){const c=curve?new THREE.CatmullRomCurve3(pts.map(V)):new THREE.CurvePath();if(!curve)for(let i=1;i<pts.length;i++)c.add(new THREE.LineCurve3(V(pts[i-1]),V(pts[i])));const mesh=new THREE.Mesh(new THREE.TubeGeometry(c,segments,r,6,false),material);parent.add(mesh);return mesh;}
export function canvasTexture(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;return tex;}
export function textTexture(text,sub='',color='#d6eaf4',w=1024,h=192){
 return canvasTexture(w,h,(g)=>{g.fillStyle='rgba(4,10,18,.66)';g.fillRect(0,0,w,h);g.strokeStyle='rgba(95,224,255,.45)';g.lineWidth=2;g.strokeRect(1,1,w-2,h-2);
  let size=92;do{g.font=`500 ${size}px "Space Grotesk"`;if(g.measureText(text).width<=w-56)break;size-=2;}while(size>24);
  g.fillStyle=color;g.fillText(text,28,sub?100:126);if(sub){g.font='34px "JetBrains Mono"';g.fillStyle='#93b4c6';g.fillText(sub,28,158);}});
}
const labelCache=new Map();
export function cachedTexture(text,sub,color){const key=`${text}|${sub}|${color}`;if(!labelCache.has(key))labelCache.set(key,textTexture(text,sub,color));return labelCache.get(key);}
export function label(parent,text,sub,pos,width=3,color){const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:cachedTexture(text,sub,color),transparent:true,depthTest:false,depthWrite:false}));sprite.position.copy(V(pos));sprite.scale.set(width,width*192/1024,1);sprite.userData.labelWidth=width;sprite.renderOrder=10;parent.add(sprite);return sprite;}
// Labels keep their world size at a distance but stop growing in close-ups; titles fade them out.
const wp=new THREE.Vector3();
export function fitLabels(scene,camera,alpha=1,ref=10){scene.traverse(o=>{const w=o.userData?.labelWidth;if(!w||!o.visible)return;const k=Math.min(1,camera.position.distanceTo(o.getWorldPosition(wp))/ref);o.scale.set(w*k,w*k*192/1024,1);o.material.opacity=alpha*(o.userData.alpha??1);});}
export function instanced(parent,geometry,material,count){
 const mesh=new THREE.InstancedMesh(geometry,material,count);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;parent.add(mesh);
 const dummy=new THREE.Object3D(),color=new THREE.Color();let n=0;
 return{mesh,dummy,begin(){n=0;},
  push(pos,col,scale=1,quat=null,strength=1){if(n>=count)return;dummy.position.copy(pos);if(quat)dummy.quaternion.copy(quat);else dummy.quaternion.identity();if(typeof scale==='number')dummy.scale.setScalar(scale);else dummy.scale.copy(scale);dummy.updateMatrix();mesh.setMatrixAt(n,dummy.matrix);mesh.setColorAt(n,color.setHex(col).multiplyScalar(strength));n++;},
  end(){mesh.count=n;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;},
  get size(){return n;}};
}
// Canvas texture that redraws only when its key changes (screens, phone, displays).
export function dynamicTexture(w,h){
 const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d'),tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;let last=null;
 return{tex,g,w,h,canvas:c,set(key,draw){if(key===last)return false;last=key;g.clearRect(0,0,w,h);draw(g,w,h);tex.needsUpdate=true;return true;}};
}
export function monoLines(g,lines,{x=24,y=40,size=26,lh=1.32,color='#cfe6f2',colors=[]}={}){
 g.font=`${size}px "JetBrains Mono",monospace`;g.textBaseline='alphabetic';
 lines.forEach((l,i)=>{const c=colors.find(([re])=>re.test(l));g.fillStyle=c?c[1]:color;g.fillText(l,x,y+i*size*lh);});
}
// Long terminal lines wrap at a column limit; continuation lines are indented.
export function wrap(text,cols){if(text.length<=cols)return[text];const out=[];let s=text;while(s.length>cols){let k=s.lastIndexOf(' ',cols);if(k<cols*.5)k=cols;out.push(s.slice(0,k));s='  '+s.slice(k).trimStart();}out.push(s);return out;}
export const ease=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
