import * as THREE from 'three';
import {PALETTE as P,SEED} from './config.js';
export const V=a=>new THREE.Vector3(...a);
export const colorFor=v=>v===3?P.violet:P.cyan;
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
export function switchObject(parent,id,pos){
 const root=new THREE.Group();root.position.copy(V(pos));parent.add(root);box(root,[2.25,.62,1.35],[0,0,0],mat(0x1e3a4e));box(root,[2.32,.05,1.42],[0,.34,0],mat(0x2d5062));
 const ports=[];for(let i=0;i<24;i++){const x=-.98+(i%12)*.177,y=i<12?-.12:.12;box(root,[.115,.11,.02],[x,y,.685],mat(0x07121c));ports.push(box(root,[.06,.025,.024],[x,y-.04,.71],glow(P.cyan)));}
 label(root,id,'802.1Q / SWITCH',[0,1.05,0],3);return{root,ports};
}
export function hostObject(parent,id,pos,vlan){const root=new THREE.Group();root.position.copy(V(pos));parent.add(root);box(root,[.85,.10,.62],[0,0,0],mat(0x264354));const lid=box(root,[.85,.52,.045],[0,.30,-.22],mat(0x233e51));lid.rotation.x=-.15;const screen=box(root,[.74,.40,.018],[0,.30,-.19],glow(colorFor(vlan),.34));screen.rotation.x=-.15;label(root,id,`VLAN ${vlan}`,[0,1,0],2);return root;}
