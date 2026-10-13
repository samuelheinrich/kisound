// TOKEN BURN: six hits per version with one stable identity – two lines, TOKEN above BURN, BURN orange.
// Entry about 120 ms (short shift and scale onto the end position), then a steady readable hold, a sub-bass
// impulse of at most 3 % scale, exit in about 180 ms before the cut. 2D for H01/H05, layered depth for the others.
import * as THREE from 'three';
import {KEYWORDS,SHOT} from './config.js';
import {clamp,ease,smooth,lerp} from './timeline.js';
import {THEMES,font,drawGrid,drawPanel} from './screen.js';
import {KICK,BASS} from './model.js';
export const HOOK=Object.fromEntries(KEYWORDS.map(k=>[k.id,k]));
export const ENTRY=.12,EXIT=.18;
// opacity/scale envelope of a hook inside its shot
export function envelope(id,t){const k=HOOK[id],s=SHOT[k.shot],u=clamp((t-k.start)/ENTRY),o=1-clamp((t-(s.end-EXIT))/EXIT);return{alpha:Math.min(ease(u),o),grow:lerp(1.06,1,ease(u))*lerp(.97,1,o),shift:(1-ease(u))*40,hold:t-k.start};}
const W=1920,H=1080,SIZE=330;
// The title block measured once per size: TOKEN and BURN centred, BURN line slightly wider.
function titleLines(g,size){font(g,size,700);return{w:Math.max(g.measureText('TOKEN').width,g.measureText('BURN').width)};}
let layer=null;
function offscreen(){if(!layer){layer=document.createElement('canvas');layer.width=W;layer.height=H;}return layer;}
// 2D hits: H01 dark (pattern visible inside the letters for a moment), H05 bright (window shadow under the type).
export function drawHook2D(g,id,t,a){
 const day=id==='H05',C=THEMES[day?'day':'night'],env=envelope(id,t),pulse=1+.03*clamp(a.sub??0)*clamp(env.hold/.3);
 g.fillStyle=C.bg;g.fillRect(0,0,W,H);
 if(day){// soft window shadow: two mullion bands drifting slowly across the light
  g.save();g.globalAlpha=.16;g.fillStyle='#8e927f';const x0=-200+env.hold*28;g.transform(1,0,-.35,1,0,0);for(const[x,w]of[[x0+300,90],[x0+980,70],[x0+1600,90]])g.fillRect(x,-50,w,H+100);g.restore();}
 const L=offscreen(),c=L.getContext('2d');c.clearRect(0,0,W,H);c.save();const s=env.grow*pulse;c.translate(W/2,H/2+env.shift*.5);c.scale(s,s);c.translate(-W/2,-H/2);
 const top=day?'#14171C':C.ink,bot=day?'#F0541F':C.output;font(c,SIZE,700);c.textAlign='center';c.fillStyle=top;c.fillText('TOKEN',W/2,H/2-28);c.fillStyle=bot;c.fillText('BURN',W/2,H/2+SIZE*.82-28);c.restore();
 if(!day){const k=1-smooth(.15,.75,env.hold);if(k>0){c.save();c.globalCompositeOperation='source-atop';c.globalAlpha=k*.85;drawGrid(c,W*.18,H*.2,W*.64,H*.62,t,THEMES.night,{labels:false,cellPad:10,pat:{kick:KICK,snare:[],hats:[],bass:BASS}});c.restore();}}
 // thin high-frequency edge accent
 g.globalAlpha=env.alpha;g.drawImage(L,0,0);g.globalAlpha=env.alpha*clamp(a.high??0)*.5;g.fillStyle=day?'#F0541F':C.input;g.fillRect(W/2-480,H-150,960,3);g.globalAlpha=1;
}
// ---- 3D type: the same title as a stack of layers; front layer readable, the layers behind give the depth
export class TypeStack{
 constructor(scene,{layers=22,depth=.12,width=1.6}={}){
  this.group=new THREE.Group();this.group.visible=false;scene.add(this.group);this.width=width;this.height=width*.5;
  this.canvas=document.createElement('canvas');this.canvas.width=2048;this.canvas.height=1024;this.tex=new THREE.CanvasTexture(this.canvas);this.tex.colorSpace=THREE.SRGBColorSpace;this.tex.anisotropy=8;
  this.side=document.createElement('canvas');this.side.width=2048;this.side.height=1024;this.sideTex=new THREE.CanvasTexture(this.side);this.sideTex.colorSpace=THREE.SRGBColorSpace;
  const geo=new THREE.PlaneGeometry(width,this.height);this.layers=[];
  for(let i=0;i<layers;i++){const front=i===0,m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:front?this.tex:this.sideTex,transparent:true,alphaTest:.35,toneMapped:false,depthWrite:true,side:THREE.DoubleSide}));
   m.position.z=-i*depth/(layers-1);m.renderOrder=30-i;if(!front)m.material.color.setScalar(lerp(.55,.22,i/(layers-1)));this.group.add(m);this.layers.push(m);}
  this.key='';this.depth=depth;
 }
 // style: night | day | project (overview inside the letters)
 draw(style,t){const key=style+(style==='project'?Math.round(t*4):'');if(key===this.key)return;this.key=key;
  const day=style==='day',C=THREE.Color;
  for(const [cv,front] of[[this.canvas,true],[this.side,false]]){const g=cv.getContext('2d');g.clearRect(0,0,2048,1024);font(g,500,700);g.textAlign='center';
   g.fillStyle=front?(day?'#14171C':'#F4F3EA'):(day?'#3a3f47':'#c9c6bb');g.fillText('TOKEN',1024,470);g.fillStyle=front?'#FF6534':'#d9542b';g.fillText('BURN',1024,900);
   if(front&&style==='project'){const o=document.createElement('canvas');o.width=1024;o.height=640;drawPanel('overview',o.getContext('2d'),1024,640,t,'night');
    g.save();g.globalCompositeOperation='source-atop';g.globalAlpha=.42;g.drawImage(o,0,40,2048,1280*.75);g.restore();}}
  this.tex.needsUpdate=true;this.sideTex.needsUpdate=true;}
 place(pos,quat,scale=1){this.group.position.copy(pos);this.group.quaternion.copy(quat);this.group.scale.setScalar(scale);}
 set(visible,alpha=1,depthK=1){this.group.visible=visible&&alpha>.001;this.layers.forEach((m,i)=>{m.material.opacity=alpha;m.visible=i===0||depthK>.02;m.position.z=-i*this.depth*depthK/(this.layers.length-1);});}
}
