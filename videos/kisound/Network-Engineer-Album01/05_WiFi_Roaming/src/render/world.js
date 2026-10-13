import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { PALETTE as P, SEED } from './config.js';
export const V = a => new THREE.Vector3(...a);
export const mix3 = (a,b,t) => V(a).lerp(V(b),t);
export function random(i){const n=Math.sin((i+SEED)*127.1)*43758.5453;return n-Math.floor(n);}
export function material(color=P.navy, opts={}){return new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.35,...opts});}
export function glow(color=P.cyan, strength=1){return new THREE.MeshBasicMaterial({color:new THREE.Color(color).multiplyScalar(strength),toneMapped:false});}
export function box(parent,size,pos,mat,radius=0){
 const g=radius?new RoundedBoxGeometry(...size,2,radius):new THREE.BoxGeometry(...size);
 const m=new THREE.Mesh(g,mat);m.position.copy(V(pos));parent.add(m);return m;
}
export function sphere(parent,r,pos,mat){const m=new THREE.Mesh(new THREE.IcosahedronGeometry(r,1),mat);m.position.copy(V(pos));parent.add(m);return m;}
export function line(parent,points,color=P.cyan,opacity=1){
 const m=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points.map(p=>p.isVector3?p:V(p))),new THREE.LineBasicMaterial({color,transparent:opacity<1,opacity}));parent.add(m);return m;
}
export function tube(parent,points,color=P.cyan,r=.015){
 const curve=new THREE.CatmullRomCurve3(points.map(V));
 const mesh=new THREE.Mesh(new THREE.TubeGeometry(curve,64,r,5,false),glow(color));parent.add(mesh);return{curve,mesh};
}
export function ring(parent,r,pos,color=P.cyan,width=.01){
 const m=new THREE.Mesh(new THREE.TorusGeometry(r,width,6,64),glow(color));m.position.copy(V(pos));parent.add(m);return m;
}
export function baseScene(fog=0.025){
 const scene=new THREE.Scene();scene.background=new THREE.Color(P.ink);scene.fog=new THREE.FogExp2(P.ink,fog);
 scene.add(new THREE.HemisphereLight(0xb4c7df,0x21354a,2.1));
 const key=new THREE.DirectionalLight(0x9cbbdd,1.8);key.position.set(3,8,7);scene.add(key);
 const rim=new THREE.DirectionalLight(0x5aafc4,1.2);rim.position.set(-8,3,-7);scene.add(rim);
 return scene;
}
export function point(parent,color,intensity,pos,distance=15){const l=new THREE.PointLight(color,intensity,distance,2);l.position.copy(V(pos));parent.add(l);return l;}
export function setInstance(sets,id,parent,pos=[0,0,0],scale=1){
 const group=sets.instance(id);group.position.copy(V(pos));group.scale.setScalar(scale);
 const clone=m=>{const out=m.clone();out.roughness=Math.max(.62,out.roughness??.62);out.metalness=Math.min(.25,out.metalness??0);if(out.emissiveIntensity>1)out.emissiveIntensity=.7;return out;};
 group.traverse(o=>{if(o.isMesh){o.frustumCulled=true;o.material=Array.isArray(o.material)?o.material.map(clone):clone(o.material);}});
 parent.add(group);return group;
}
export function labelTexture(title,subtitle='',color='#79e6bc'){
 const c=document.createElement('canvas');c.width=1024;c.height=256;const g=c.getContext('2d');
 g.fillStyle='#071422';g.fillRect(0,0,1024,256);g.strokeStyle='#29475a';g.strokeRect(1,1,1022,254);
 g.fillStyle=color;g.fillRect(35,38,8,44);g.font='500 42px "Space Grotesk"';g.fillText(title,65,77);
 g.fillStyle='#8da8b9';g.font='24px "JetBrains Mono"';g.fillText(subtitle,38,133);
 g.strokeStyle=color;g.beginPath();for(let x=38;x<980;x+=8){const y=206+Math.sin(x*.031)*9+Math.sin(x*.077)*5;x===38?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();
 const tex=new THREE.CanvasTexture(c);tex.colorSpace=THREE.SRGBColorSpace;return tex;
}
export function display(parent,w,h,pos,texture){
 box(parent,[w+.07,h+.07,.05],[pos[0],pos[1],pos[2]-.031],material(0x111c2a),.015);
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,toneMapped:false}));mesh.position.copy(V(pos));parent.add(mesh);return mesh;
}
export function dashboardTexture(state='online',kind='topology'){
 const c=document.createElement('canvas');c.width=1536;c.height=768;const g=c.getContext('2d');
 const alarm=state==='alarm',col=alarm?'#ffb55d':state==='standby'?'#6da6c9':'#79e6bc';
 g.fillStyle='#081423';g.fillRect(0,0,c.width,c.height);
 g.fillStyle='#7193ac';g.font='22px "JetBrains Mono"';g.fillText('OPERATIONS / '+kind.toUpperCase(),55,65);
 g.fillStyle='#dfebee';g.font='500 44px "Space Grotesk"';g.fillText(alarm?'Path degraded':state==='standby'?'Standby available':'Service reachable',55,127);
 g.fillStyle=col;g.fillRect(1300,65,145,7);g.font='20px "JetBrains Mono"';g.fillText(alarm?'INVESTIGATE':'MONITORING',1280,112);
 g.strokeStyle='#18354b';g.lineWidth=1;
 for(let x=55;x<1490;x+=55){g.beginPath();g.moveTo(x,165);g.lineTo(x,665);g.stroke();}
 for(let y=165;y<690;y+=55){g.beginPath();g.moveTo(55,y);g.lineTo(1480,y);g.stroke();}
 const nodes=[[180,400],[460,270],[460,540],[830,270],[830,540],[1180,400],[1390,400]];
 const edges=[[0,1],[0,2],[1,3],[2,4],[3,5],[4,5],[5,6]];
 for(let i=0;i<edges.length;i++){
  const[a,b]=edges[i];g.strokeStyle=alarm&&i===2?'#ffb55d':i===1||i===3||i===5?col:'#43647b';g.lineWidth=4;
  g.setLineDash(alarm&&i===2?[8,10]:[]);g.beginPath();g.moveTo(...nodes[a]);g.lineTo(...nodes[b]);g.stroke();
 }g.setLineDash([]);
 const names=['ACCESS','EDGE A','EDGE B','CORE A','CORE B','SERVICE','CLIENT'];
 nodes.forEach(([x,y],i)=>{g.fillStyle='#0c2231';g.strokeStyle=col;g.lineWidth=3;g.beginPath();g.arc(x,y,22,0,Math.PI*2);g.fill();g.stroke();g.fillStyle=col;g.beginPath();g.arc(x,y,6,0,Math.PI*2);g.fill();g.fillStyle='#a5bfce';g.font='18px "JetBrains Mono"';g.textAlign='center';g.fillText(names[i],x,y+48);});
 g.textAlign='left';g.fillStyle='#7896aa';g.font='21px "JetBrains Mono"';g.fillText(alarm?'Correlation active   /   Backup path selected':'Link up   /   Route valid   /   Traffic forwarded',55,726);
 const texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
export function figure(parent,pos,scale=1){
 const group=new THREE.Group();group.position.copy(V(pos));group.scale.setScalar(scale);parent.add(group);
 const uniform=material(0x26394b,{roughness:.85}),skin=material(0x9c887b,{roughness:.95});
 const torso=box(group,[.46,.56,.25],[0,.88,0],uniform,.07);
 sphere(group,.15,[0,1.29,-.035],skin);
 const hair=sphere(group,.153,[0,1.35,-.015],material(0x19212b));hair.scale.y=.65;
 box(group,[.45,.13,.39],[0,.57,-.09],uniform,.04);
 for(const x of [-.16,.16]){box(group,[.13,.5,.13],[x,.28,-.25],uniform,.035);box(group,[.15,.1,.28],[x,.07,-.31],uniform,.025);}
 const hands=[];
 for(const x of [-.31,.31]){
  const shoulder=new THREE.Group();shoulder.position.set(x,1.03,-.015);group.add(shoulder);
  box(shoulder,[.125,.3,.13],[0,-.14,-.04],uniform,.03);
  const fore=new THREE.Group();fore.position.set(0,-.23,-.04);shoulder.add(fore);
  box(fore,[.11,.1,.29],[0,0,-.12],uniform,.025);box(fore,[.115,.06,.14],[0,.008,-.30],skin,.022);
  hands.push(fore);
 }
 const badge=box(group,[.08,.025,.008],[.11,1.04,-.132],glow(P.cyan,.8));
 return {group,hands,torso,badge,update(t,active=1){hands.forEach((h,i)=>{h.rotation.x=.08*Math.sin(t*2.4+i*1.3)*active;h.rotation.y=.08*Math.sin(t*.6+i)*active;});torso.rotation.z=.015*Math.sin(t*.7)*active;}};
}
export function dust(parent,count=100,extent=20){
 const data=new Float32Array(count*3);for(let i=0;i<count;i++){data[i*3]=(random(i*3)-.5)*extent;data[i*3+1]=random(i*3+1)*extent*.4;data[i*3+2]=(random(i*3+2)-.5)*extent;}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(data,3));
 const mesh=new THREE.Points(geo,new THREE.PointsMaterial({color:0x8dbccf,size:.022,transparent:true,opacity:.25,depthWrite:false}));parent.add(mesh);return mesh;
}
