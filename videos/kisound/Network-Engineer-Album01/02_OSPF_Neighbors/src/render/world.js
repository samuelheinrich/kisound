import * as THREE from 'three';
import {PALETTE as P,SEED} from './config.js';
export const V=a=>new THREE.Vector3(...a);
export function random(i){const n=Math.sin((i+SEED)*127.1)*43758.5453;return n-Math.floor(n);}
export function mat(color=P.navy,opts={}){return new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.35,...opts});}
export function glow(color=P.cyan,strength=1){return new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(strength),toneMapped:false});}
export function box(parent,size,pos,material){const mesh=new THREE.Mesh(new THREE.BoxGeometry(...size),material);mesh.position.copy(V(pos));parent.add(mesh);return mesh;}
export function line(parent,points,color=P.cyan,opacity=.8){const mesh=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(V)),new THREE.LineBasicMaterial({color,transparent:true,opacity}));parent.add(mesh);return mesh;}
export function tube(parent,points,color=P.cyan,r=.025){const curve=new THREE.CatmullRomCurve3(points.map(V));const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,48,r,5,false),glow(color));parent.add(mesh);return{mesh,curve};}
export function textTexture(text,sub='',color='#b9dae6',w=1024,h=192){
 const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;const ctx=canvas.getContext('2d');ctx.fillStyle='rgba(6,16,26,.42)';ctx.fillRect(0,0,w,h);ctx.strokeStyle='rgba(52,85,104,.5)';ctx.strokeRect(1,1,w-2,h-2);let size=112;do{ctx.font=`500 ${size}px "Space Grotesk"`;if(ctx.measureText(text).width<=w-56)break;size-=2;}while(size>24);ctx.fillStyle=color;ctx.fillText(text,28,116);ctx.font='32px "JetBrains Mono"';ctx.fillStyle='#89a9b9';ctx.fillText(sub,28,167);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function label(parent,text,sub,pos,width=3,color){const tex=textTexture(text,sub,color);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,transparent:true,depthTest:false}));sprite.position.copy(V(pos));sprite.scale.set(width,width*192/1024,1);parent.add(sprite);return sprite;}
export function baseScene(){const s=new THREE.Scene();s.background=new THREE.Color(P.ink);s.fog=new THREE.FogExp2(P.ink,.014);s.add(new THREE.HemisphereLight(0xbbd8ed,0x10212e,2.3));const key=new THREE.DirectionalLight(0xaacde5,2);key.position.set(4,10,8);s.add(key);const rim=new THREE.DirectionalLight(0x6d8aff,1.4);rim.position.set(-8,5,-6);s.add(rim);return s;}
export function floor(parent,size=36,y=-3){const grid=new THREE.GridHelper(size,36,0x315365,0x1c3547);grid.position.y=y;grid.material.transparent=true;grid.material.opacity=.35;parent.add(grid);box(parent,[size,.04,size],[0,y-.04,0],mat(0x091725));return grid;}
export function travel(points,u){let d=0;const lengths=[];for(let i=1;i<points.length;i++){const l=V(points[i]).distanceTo(V(points[i-1]));lengths.push(l);d+=l;}let target=Math.max(0,Math.min(1,u))*d;for(let i=0;i<lengths.length;i++){if(target<=lengths[i]||i===lengths.length-1)return V(points[i]).lerp(V(points[i+1]),Math.min(1,target/lengths[i]));target-=lengths[i];}return V(points[0]);}
export function routerObject(parent,id,pos,sub='OSPFv2',col=P.cyan){
 const root=new THREE.Group();root.position.copy(V(pos));parent.add(root);
 const body=new THREE.Mesh(new THREE.CylinderGeometry(.88,.94,.72,28),mat(0x17324b));root.add(body);
 const lid=new THREE.Mesh(new THREE.CylinderGeometry(.90,.90,.08,28),mat(0x34536b));lid.position.y=.40;root.add(lid);
 const ring=new THREE.Mesh(new THREE.TorusGeometry(.89,.025,6,48),glow(col));ring.rotation.x=Math.PI/2;ring.position.y=.455;root.add(ring);
 for(let i=0;i<4;i++){const arrow=box(root,[.38,.012,.07],[0,.448,0],glow(P.white,.8));arrow.rotation.y=i*Math.PI/2;arrow.position.x=Math.cos(i*Math.PI/2)*.22;arrow.position.z=Math.sin(i*Math.PI/2)*.22;}
 label(root,id,sub,[0,1.22,0],2.5);return{root,ring,body};
}
export function pool(parent,count,shape='box'){
 const mesh=new THREE.InstancedMesh(shape==='diamond'?new THREE.OctahedronGeometry(.14):new THREE.BoxGeometry(.27,.13,.18),glow(P.white),count);mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);mesh.frustumCulled=false;parent.add(mesh);const dummy=new THREE.Object3D();return{mesh,dummy,set(i,pos,col,scale=1,angle=0){dummy.position.copy(pos);dummy.rotation.set(0,angle,shape==='diamond'?angle*.5:0);dummy.scale.setScalar(scale);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new THREE.Color(col));},done(n){mesh.count=n;mesh.instanceMatrix.needsUpdate=true;if(mesh.instanceColor)mesh.instanceColor.needsUpdate=true;}};
}
export function card(parent,title,pos,width=6,color='#59d8ed'){
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=768;const ctx=canvas.getContext('2d'),texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(width,width*.75),new THREE.MeshBasicMaterial({map:texture,transparent:true,side:THREE.DoubleSide}));mesh.position.copy(V(pos));parent.add(mesh);let last='';
 return{mesh,update(rows,subtitle=''){const key=JSON.stringify([rows,subtitle]);if(last===key)return;last=key;ctx.clearRect(0,0,1024,768);ctx.fillStyle='rgba(8,22,38,.96)';ctx.fillRect(0,0,1024,768);ctx.strokeStyle=color;ctx.lineWidth=3;ctx.strokeRect(2,2,1020,764);ctx.fillStyle=color;ctx.font='500 54px "Space Grotesk"';ctx.fillText(title,38,80);ctx.fillStyle='#85a5bb';ctx.font='30px "JetBrains Mono"';ctx.fillText(subtitle,38,127);rows.forEach((r,i)=>{const row=Array.isArray(r)?r:[r,'#c8e4ef'];ctx.fillStyle=row[1]||'#c8e4ef';ctx.font='34px "JetBrains Mono"';ctx.fillText(row[0],38,208+i*70);});texture.needsUpdate=true;}};
}
