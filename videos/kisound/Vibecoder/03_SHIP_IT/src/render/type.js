// COMMIT IT. / SHIP IT. – one title mark with a stable identity: two lines, COMMIT IT. warm white, SHIP IT. orange,
// a small third line (BUILD. CHECK. LIVE. / ALBUM DREI). Entry about 120 ms, a steady readable hold, a sub-bass
// impulse of at most 3 % scale, exit in about 180 ms. 2D in the type shots, a layered stack with depth in 3D.
import * as THREE from 'three';
import {TITLE_HOOKS,SHOT,LANG} from './config.js';
import {clamp,ease,smooth,lerp} from './timeline.js';
import {C,font,text,drawCover} from './screen.js';
import {TXT,TRACKS,STATIONS,station,packet} from './model.js';
export const ENTRY=.12,EXIT=.18;
export const HOOK=Object.fromEntries(TITLE_HOOKS.map(h=>[h.id,h]));
export function hookAt(t){for(let i=TITLE_HOOKS.length-1;i>=0;i--){const h=TITLE_HOOKS[i];if(t>=h.start&&t<h.until)return h;}return null;}
// opacity / scale envelope of a hook
export function envelope(h,t){const u=clamp((t-h.start)/ENTRY),o=1-clamp((t-(h.until-EXIT))/EXIT);return{alpha:Math.min(ease(u),o),grow:lerp(1.07,1,ease(u))*lerp(.97,1,o),shift:(1-ease(u))*36,hold:t-h.start};}
export const subText=h=>h&&h.sub?TXT.hookSub[h.sub]:'';
const W=1920,H=1080;
// the closed album card under the intro title (S002): six covers face down, label only
const CARD_T=LANG==='de'?15.63:8.6;
function drawMark(g,cx,cy,size,sub,{ink=C.ink,orange=C.orange,subCol=C.dim}={}){
 font(g,size,700);g.textAlign='center';g.fillStyle=ink;g.fillText('COMMIT IT.',cx,cy-size*.08);g.fillStyle=orange;g.fillText('SHIP IT.',cx,cy+size*.86);g.textAlign='left';
 if(sub){g.save();font(g,size*.2,600);g.letterSpacing=`${Math.round(size*.035)}px`;g.textAlign='center';g.fillStyle=subCol;g.fillText(sub,cx,cy+size*1.42);g.restore();}
}
// 2D hit: dark ground, the rail as a line at the bottom, measured onsets push thin slices of the title sideways
export function drawHook2D(g,h,t,a,shotId=h?.shot){
 g.fillStyle=C.bg;g.fillRect(0,0,W,H);
 const card=shotId==='S002'?ease(clamp((t-CARD_T)/.5)):0;
 // rail line with five station nodes (state from the model)
 const ry=960,rx=560,rw=800;g.strokeStyle='#2A3343';g.lineWidth=3;g.beginPath();g.moveTo(rx,ry);g.lineTo(rx+rw,ry);g.stroke();
 STATIONS.forEach((n,i)=>{const st=station(i,t),x=rx+i*rw/4;g.fillStyle=st==='off'?'#202835':st==='pass'?C.pass:st==='fail'?C.red:C.orange;g.globalAlpha=st==='preview'?.45:1;g.beginPath();g.arc(x,ry,9,0,7);g.fill();g.globalAlpha=1;text(g,n,x,ry+40,18,'#566173',600,'sans','center');});
 if(!h){drawCard(g,card);return;}
 const env=envelope(h,t),pulse=1+.03*clamp(a.sub??0)*clamp(env.hold/.3),drop=a.drop??0,size=200;
 const L=layer(),c=L.getContext('2d');c.clearRect(0,0,W,H);c.save();const sc=env.grow*pulse*lerp(1,.78,card);c.translate(W/2,H*.43+env.shift*.5-card*120);c.scale(sc,sc);c.translate(-W/2,-H*.43);
 drawMark(c,W/2,H*.43,size,subText(h));c.restore();
 // the title itself stays clean; strong measured onsets add a faint sideways echo of three thin slices (title rows
 // only, never the third line), not during the first readable second
 g.globalAlpha=env.alpha;g.drawImage(L,0,0);
 const hit=clamp((a.attack??0)-.35)*(env.hold>1?1:0)+drop*.8;
 if(hit>.02){for(let i=0;i<3;i++){const y0=Math.floor(H*.25+i*H*.11+(Math.sin(i*12.9+Math.floor(t*12))*.5+.5)*40),hh=8+i*5,dx=(i%2?1:-1)*hit*14;g.globalAlpha=env.alpha*.35*clamp(hit*1.5);g.drawImage(L,0,y0,W,hh,dx,y0,W,hh);}}
 g.globalAlpha=1;
 drawCard(g,card);
}
function drawCard(g,card){
 if(card>0){g.save();g.globalAlpha=card;const cw=900,ch=150,x=(W-cw)/2,y=700+(1-card)*40;g.fillStyle=C.panel;g.strokeStyle='#2E3949';g.lineWidth=2;g.beginPath();g.roundRect(x,y,cw,ch,18);g.fill();g.stroke();
  TRACKS.forEach((tr,i)=>{g.fillStyle='#202835';g.fillRect(x+24+i*72,y+31,60,88);});text(g,TXT.albumN,x+500,y+66,26,C.orange,400,'credit');text(g,TXT.albumName,x+500,y+118,44,C.ink,700);g.restore();}
}
let canvas2d=null;
function layer(){if(!canvas2d){canvas2d=document.createElement('canvas');canvas2d.width=W;canvas2d.height=H;}return canvas2d;}
// ---- 3D: the same mark as a stack of layers; front layer readable, the layers behind give the depth
export class TypeStack{
 constructor(scene,{layers=20,depth=.1,width=1.6}={}){
  this.group=new THREE.Group();this.group.visible=false;this.group.name='Titelmarke COMMIT IT. / SHIP IT.';scene.add(this.group);this.width=width;this.height=width*.5;
  const mk=()=>{const c=document.createElement('canvas');c.width=2048;c.height=1024;const tx=new THREE.CanvasTexture(c);tx.colorSpace=THREE.SRGBColorSpace;tx.anisotropy=8;return[c,tx];};
  [this.canvas,this.tex]=mk();[this.side,this.sideTex]=mk();
  const geo=new THREE.PlaneGeometry(width,this.height);this.layers=[];
  for(let i=0;i<layers;i++){const front=i===0,m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:front?this.tex:this.sideTex,transparent:true,alphaTest:.35,toneMapped:false,depthWrite:true,side:THREE.DoubleSide}));
   m.name=front?'Titel · Vorderseite (Canvas)':`Titel · Tiefenebene ${i}`;m.userData.inspect=t=>{const h=hookAt(t);return h?{'hookAt(t)':h.id,'Anker':h.anchor?'ASR':'redaktionell','envelope(h,t).alpha':envelope(h,t).alpha}:{};};
   m.position.z=-i*depth/(layers-1);m.renderOrder=30-i;m.material.color.setScalar(front?.8:lerp(.42,.15,i/(layers-1)));this.group.add(m);this.layers.push(m);}
  this.key=null;this.depth=depth;
 }
 draw(sub){const key=sub||'';if(key===this.key)return;this.key=key;
  for(const[cv,front]of[[this.canvas,true],[this.side,false]]){const g=cv.getContext('2d');g.clearRect(0,0,2048,1024);
   drawMark(g,1024,430,300,front?sub:'',{ink:front?'#F4F3EA':'#bdb9ad',orange:front?'#FF6534':'#d0522a',subCol:'#C9CED8'});}
  this.tex.needsUpdate=true;this.sideTex.needsUpdate=true;}
 place(pos,quat,scale=1){this.group.position.copy(pos);this.group.quaternion.copy(quat);this.group.scale.setScalar(scale);}
 set(visible,alpha=1,depthK=1){this.group.visible=visible&&alpha>.001;this.layers.forEach((m,i)=>{m.material.opacity=alpha;m.visible=i===0||depthK>.02;m.position.z=-i*this.depth*depthK/(this.layers.length-1);});}
}
