import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {PALETTE as P,SEED} from './config.js';
export const V=a=>a.isVector3?a.clone():new THREE.Vector3(...a);
export function random(i){const n=Math.sin((i+SEED)*127.1)*43758.5453;return n-Math.floor(n);}
export function mat(color=P.navy,opts={}){return new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.35,...opts});}
export function glow(color=P.cyan,strength=1){return new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(strength),toneMapped:false});}
// Additive glow: brightness in the colour doubles as opacity, so per-frame fades need no sorting.
export function additive(color=P.orange,strength=1){return new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(strength),toneMapped:false,transparent:true,blending:THREE.AdditiveBlending,depthWrite:false});}
export function setGlow(material,color,strength){material.color.setHex(color).multiplyScalar(Math.max(0,strength));}
export function box(parent,size,pos,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);mesh.position.copy(V(pos));parent.add(mesh);return mesh;}
export function line(parent,points,color=P.cyan,opacity=.8){const mesh=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(V)),new THREE.LineBasicMaterial({color,transparent:true,opacity,depthWrite:false}));parent.add(mesh);return mesh;}
export function ring(parent,r,pos,material,width=.03,arc=Math.PI*2){const mesh=new THREE.Mesh(new THREE.TorusGeometry(r,width,6,Math.max(24,Math.round(64*arc/Math.PI/2)),arc),material);mesh.position.copy(V(pos));parent.add(mesh);return mesh;}
export function curveTube(parent,pts,material,r=.03,segments=40){const curve=new THREE.CatmullRomCurve3(pts.map(V));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,segments,r,5,false),material);parent.add(mesh);return mesh;}
export function baseScene(fog=.010){
 const s=new THREE.Scene();s.background=new THREE.Color(P.ink);s.fog=new THREE.FogExp2(P.ink,fog);
 s.add(new THREE.HemisphereLight(0xa9c8ea,0x0b1726,2.0));
 const key=new THREE.DirectionalLight(0xb2cfee,1.7);key.position.set(6,14,10);s.add(key);
 const rim=new THREE.DirectionalLight(0x4a7dff,1.2);rim.position.set(-10,6,-8);s.add(rim);
 return s;
}
export function textTexture(text,sub='',color='#cfe6f2',w=1024,h=192){
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const g=canvas.getContext('2d');
 g.fillStyle='rgba(5,14,26,.62)';g.fillRect(0,0,w,h);g.strokeStyle='rgba(61,139,217,.45)';g.lineWidth=2;g.strokeRect(1,1,w-2,h-2);
 let size=96;do{g.font=`500 ${size}px "Space Grotesk"`;if(g.measureText(text).width<=w-56)break;size-=2;}while(size>24);
 g.fillStyle=color;g.fillText(text,28,sub?104:128);if(sub){g.font='34px "JetBrains Mono"';g.fillStyle='#8fb2c8';g.fillText(sub,28,160);}
 const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;return tex;
}
const labelCache=new Map();
export function cachedTexture(text,sub,color){const key=`${text}|${sub}|${color}`;if(!labelCache.has(key))labelCache.set(key,textTexture(text,sub,color));return labelCache.get(key);}
export function label(parent,text,sub,pos,width=3,color){const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:cachedTexture(text,sub,color),transparent:true,depthTest:false,depthWrite:false}));sprite.position.copy(V(pos));sprite.scale.set(width,width*192/1024,1);sprite.userData.labelWidth=width;sprite.renderOrder=10;parent.add(sprite);return sprite;}
// Labels keep their world size at a distance but stop growing in close-ups; titles fade them out.
const wp=new THREE.Vector3();
export function fitLabels(scene,camera,alpha=1,ref=10){scene.traverse(o=>{const w=o.userData?.labelWidth;if(!w||!o.visible)return;const k=Math.min(1,camera.position.distanceTo(o.getWorldPosition(wp))/ref);o.scale.set(w*k,w*k*192/1024,1);o.material.opacity=alpha*(o.userData.alpha??1);});}
// Polar floor echoing the cover: concentric rings, radial spokes and dotted intersections.
export function polarFloor(parent,{radius=40,step=2.5,spokes=10,arc=[-100,100],y=0}={}){
 const group=new THREE.Group();group.position.y=y;parent.add(group);
 const disc=new THREE.Mesh(new THREE.CircleGeometry(radius+6,96),mat(0x050d19,{roughness:.95,metalness:.1}));disc.rotation.x=-Math.PI/2;disc.position.y=-.02;group.add(disc);
 const verts=[],dots=[];
 for(let r=step;r<=radius;r+=step){const full=r<9,a0=full?-180:arc[0],a1=full?180:arc[1];for(let a=a0;a<a1;a+=2){const p=d=>[r*Math.sin(d*Math.PI/180),0,r*Math.cos(d*Math.PI/180)];verts.push(...p(a),...p(Math.min(a+2,a1)));}}
 for(let a=arc[0];a<=arc[1];a+=spokes){const s=Math.sin(a*Math.PI/180),c=Math.cos(a*Math.PI/180);verts.push(4*s,0,4*c,radius*s,0,radius*c);for(let r=step*2;r<=radius;r+=step)dots.push(r*s,.01,r*c);}
 const lines=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(verts,3)),new THREE.LineBasicMaterial({color:0x1d4a78,transparent:true,opacity:.42,depthWrite:false}));group.add(lines);
 const pts=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(dots,3)),new THREE.PointsMaterial({color:0x5aa6ff,size:.09,transparent:true,opacity:.75,depthWrite:false}));group.add(pts);
 return{group,lines,pts};
}
export function stars(parent,count=700,extent=120){
 const data=new Float32Array(count*3);for(let i=0;i<count;i++){data[i*3]=(random(i*3)-.5)*extent;data[i*3+1]=2+random(i*3+1)*extent*.35;data[i*3+2]=(random(i*3+2)-.35)*extent;}
 const pts=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.BufferAttribute(data,3)),new THREE.PointsMaterial({color:0x6fa7d8,size:.07,transparent:true,opacity:.4,depthWrite:false}));parent.add(pts);return pts;
}
export function routerObject(parent,pos,color=P.blue,size=1){
 const root=new THREE.Group();root.position.copy(V(pos));root.scale.setScalar(size);parent.add(root);
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.9,.98,.7,32),mat(0x142c45));root.add(body);
 const lid=new THREE.Mesh(new THREE.CylinderGeometry(.92,.92,.08,32),mat(0x2b4b68));lid.position.y=.39;root.add(lid);
 const ringMat=glow(color);const r=ring(root,.92,[0,.44,0],ringMat,.03);r.rotation.x=Math.PI/2;
 const arrowMat=glow(P.white,.7);for(let i=0;i<4;i++){const a=box(root,[.4,.014,.07],[Math.cos(i*Math.PI/2)*.24,.44,Math.sin(i*Math.PI/2)*.24],arrowMat);a.rotation.y=-i*Math.PI/2;}
 const halo=new THREE.Mesh(new THREE.TorusGeometry(1.25,.05,6,48),additive(color,0));halo.rotation.x=Math.PI/2;halo.position.y=-.3;root.add(halo);
 return{root,ring:r,ringMat,halo};
}
// Access switch with one LED per port; port k sits at portX(k) on the side facing the receivers.
export const portX=(k,ports)=>(k-(ports-1)/2)*.26;
export function switchObject(parent,pos,yaw=0,ports=8){
 const root=new THREE.Group();root.position.copy(V(pos));root.rotation.y=yaw;parent.add(root);const w=ports*.26+.5;
 box(root,[w,.32,1],[0,0,0],mat(0x132a40));box(root,[w,.04,1],[0,.18,0],mat(0x2a4a66));
 const leds=[];for(let k=0;k<ports;k++)leds.push(box(root,[.17,.09,.04],[portX(k,ports),0,.52],glow(P.steel,1)));
 const up=box(root,[.22,.1,.04],[w/2-.3,.02,-.52],glow(P.blue,.8));
 return{root,leds,uplink:up,width:w};
}
// Receiver seat: pan, back and a small host node above. Facing the stage, back away from it.
export function seatGeometry(){
 const pan=new THREE.BoxGeometry(1.05,.14,.9);pan.translate(0,.42,0);
 const back=new THREE.BoxGeometry(1.05,.85,.12);back.translate(0,.82,.42);
 const leg=new THREE.BoxGeometry(.16,.4,.16);leg.translate(0,.2,0);
 return mergeGeometries([pan,back,leg]);
}
export function instanced(parent,geometry,material,count){
 const mesh=new THREE.InstancedMesh(geometry,material,count);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;parent.add(mesh);
 const dummy=new THREE.Object3D(),color=new THREE.Color();let n=0;
 return{mesh,dummy,begin(){n=0;},
  push(pos,col,scale=1,quat=null,strength=1){if(n>=count)return;dummy.position.copy(pos);if(quat)dummy.quaternion.copy(quat);else dummy.quaternion.identity();if(typeof scale==='number')dummy.scale.setScalar(scale);else dummy.scale.copy(scale);dummy.updateMatrix();mesh.setMatrixAt(n,dummy.matrix);mesh.setColorAt(n,color.setHex(col).multiplyScalar(strength));n++;},
  end(){mesh.count=n;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;},
  get size(){return n;}};
}
export function serverTexture(){
 const c=document.createElement('canvas');c.width=256;c.height=256;const g=c.getContext('2d');
 g.fillStyle='#0a1626';g.fillRect(0,0,256,256);
 for(let i=0;i<7;i++){const y=18+i*34;g.fillStyle='#14283d';g.fillRect(14,y,228,26);g.strokeStyle='#2f5677';g.strokeRect(14.5,y+.5,227,25);
  for(let k=0;k<14;k++){g.fillStyle='#1f3b57';g.fillRect(22+k*11,y+8,7,10);}g.fillStyle=i%2?'#ff9a3c':'#59d8ed';g.fillRect(200,y+9,8,8);g.fillStyle='#3fe6a0';g.fillRect(214,y+9,8,8);}
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
export function sourceServer(parent,pos,size=1.5){
 const root=new THREE.Group();root.position.copy(V(pos));parent.add(root);
 const tex=serverTexture(),side=new THREE.MeshStandardMaterial({map:tex,emissiveMap:tex,emissive:0xffffff,emissiveIntensity:.55,roughness:.5,metalness:.4});
 const top=mat(0x1a3149);const cube=new THREE.Mesh(new THREE.BoxGeometry(size,size,size),[side,side,top,top,side,side]);root.add(cube);
 const edgeMat=new THREE.LineBasicMaterial({color:P.orange,toneMapped:false,transparent:true,opacity:.9});
 root.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(size*1.01,size*1.01,size*1.01)),edgeMat));
 return{root,cube,edgeMat};
}
// Moving direction for oriented packets.
const up=new THREE.Vector3(0,0,1);
export function orient(q,from,to){const d=new THREE.Vector3().subVectors(V(to),V(from));if(d.lengthSq()<1e-10)return q.identity();return q.setFromUnitVectors(up,d.normalize());}
// Stadium helpers: flat elliptical bands, vertical elliptical walls and closed elliptical tubes.
// s scales the half axes rx/rz; a0/a1 limit the angle in degrees (from +z towards +x).
export function ellipseBand(rx,rz,s0,s1,y,seg=180){
 const pos=[],idx=[];for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2,sx=Math.sin(a),cz=Math.cos(a);pos.push(s0*rx*sx,y,s0*rz*cz,s1*rx*sx,y,s1*rz*cz);if(i<seg){const k=i*2;idx.push(k,k+2,k+1,k+1,k+2,k+3);}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function ellipseWall(rx,rz,s,y0,y1,seg=180){
 const pos=[],idx=[];for(let i=0;i<=seg;i++){const a=i/seg*Math.PI*2,x=s*rx*Math.sin(a),z=s*rz*Math.cos(a);pos.push(x,y0,z,x,y1,z);if(i<seg){const k=i*2;idx.push(k,k+1,k+2,k+1,k+3,k+2);}}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g;
}
export function ellipseTube(parent,rx,rz,s,y,material,r=.05){
 const pts=Array.from({length:160},(_,i)=>{const a=i/160*Math.PI*2;return new THREE.Vector3(s*rx*Math.sin(a),y,s*rz*Math.cos(a));});
 const mesh=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),320,r,5,true),material);parent.add(mesh);return mesh;
}
export function ellipseFloor(parent,rx,rz,{to=.6,step=.05,spokes=15}={}){
 const group=new THREE.Group();parent.add(group);const verts=[],dots=[];
 const disc=new THREE.Mesh(new THREE.CircleGeometry(1,128),mat(0x050d19,{roughness:.95,metalness:.1}));disc.rotation.x=-Math.PI/2;disc.scale.set(rx*1.12,rz*1.12,1);disc.position.y=-.02;group.add(disc);
 for(let s=step;s<=to+1e-9;s+=step)for(let a=0;a<360;a+=2){const p=d=>[s*rx*Math.sin(d*Math.PI/180),0,s*rz*Math.cos(d*Math.PI/180)];verts.push(...p(a),...p(a+2));}
 for(let a=0;a<360;a+=spokes){const sx=Math.sin(a*Math.PI/180),cz=Math.cos(a*Math.PI/180);verts.push(.08*rx*sx,0,.08*rz*cz,to*rx*sx,0,to*rz*cz);for(let s=step*2;s<=to+1e-9;s+=step)dots.push(s*rx*sx,.01,s*rz*cz);}
 const lines=new THREE.LineSegments(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(verts,3)),new THREE.LineBasicMaterial({color:0x1d4a78,transparent:true,opacity:.42,depthWrite:false}));group.add(lines);
 const pts=new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(dots,3)),new THREE.PointsMaterial({color:0x5aa6ff,size:.1,transparent:true,opacity:.75,depthWrite:false}));group.add(pts);
 return{group,lines,pts};
}
