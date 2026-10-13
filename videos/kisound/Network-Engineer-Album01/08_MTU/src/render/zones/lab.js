// The measurement hall: a bright studio where sizes are compared head-on. Same byte scale as the path, ×1.6.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,box,label,cachedTexture,instanced,random} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {K,TUNNEL_MTU,LINK_MTU,REBUILD_OLD,REBUILD_NEW,MSS_NEW,PATH_FRAMES} from '../model.js';
export const LS=1.6,KL=K*LS,GW=2.4*LS,MODULE=20;
const hgt=size=>Math.max(.3,size*KL),wid=size=>size>=600?1.5*LS:.62*LS,dep=size=>size>=600?1.7*LS:.62*LS;
// One packet: glass body with payload stripes, magenta core, header plate(s), DF clamp, tunnel shell, overhang, wireframe.
class Rig{
 constructor(s,stripes){
  this.g=new THREE.Group();s.add(this.g);const u=new THREE.BoxGeometry(1,1,1);
  this.body=new THREE.Mesh(u,new THREE.MeshStandardMaterial({color:0xf4f8ff,map:stripes,transparent:true,opacity:.55,roughness:.2,metalness:.05,depthWrite:false}));
  this.core=new THREE.Mesh(u,new THREE.MeshBasicMaterial({color:P.data,transparent:true,opacity:.85}));
  this.ip=new THREE.Mesh(u,new THREE.MeshStandardMaterial({color:0x8fd2ff,emissive:0x2a6fa8,emissiveIntensity:.4}));this.tcp=new THREE.Mesh(u,new THREE.MeshStandardMaterial({color:0x59e3ff,emissive:0x167a8f,emissiveIntensity:.4}));
  // DF clamp: a rectangular ring of four bars around the body.
  this.clamp=new THREE.Group();this.clampMat=new THREE.MeshBasicMaterial({color:P.orange,transparent:true,opacity:.95});this.bars=[0,1,2,3].map(()=>{const m=new THREE.Mesh(u,this.clampMat);this.clamp.add(m);return m;});
  this.shell=new THREE.Mesh(u,new THREE.MeshBasicMaterial({color:P.tunnel,transparent:true,opacity:.28,depthWrite:false}));
  this.over=new THREE.Mesh(u,new THREE.MeshBasicMaterial({color:P.drop,transparent:true,opacity:.8}));
  this.wire=new THREE.LineSegments(new THREE.EdgesGeometry(u),new THREE.LineBasicMaterial({color:P.blue,transparent:true,opacity:.9}));
  this.tag=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false,depthWrite:false}));this.tag.userData.labelWidth=3.4;this.tag.renderOrder=11;
  this.g.add(this.body,this.core,this.ip,this.tcp,this.clamp,this.shell,this.over,this.wire,this.tag);this.g.visible=false;
 }
 // spec: {x,z,size,limit,df,clampK,shell,explode,wire,label,sub,color,alpha}
 set(sp){
  const g=this.g;g.visible=!!sp;if(!sp)return;const h=hgt(sp.size),w=wid(sp.size),d=dep(sp.size),a=sp.alpha??1,e=sp.explode??0,y0=sp.y??0;g.position.set(sp.x,y0,sp.z??0);
  const solid=!sp.wire;this.body.visible=this.core.visible=solid;this.wire.visible=!!sp.wire;
  this.body.scale.set(d,h,w);this.body.position.set(-e*.2,h/2,0);this.body.material.opacity=.55*a;this.body.material.map.repeat.set(1,Math.max(1,sp.size/100));
  this.core.scale.set(d*.6,h*.8,w*.55);this.core.position.set(-e*.2,h/2,0);this.core.material.opacity=.85*a;this.core.material.color.setHex(sp.color??P.data);
  this.wire.scale.set(d,h,w);this.wire.position.set(0,h/2,0);this.wire.material.opacity=.9*a;
  const hp=Math.max(.1,20*KL*4);this.ip.visible=this.tcp.visible=solid&&sp.size>=300;this.ip.scale.set(hp*.55,h*1.01,w*1.01);this.tcp.scale.set(hp*.55,h*1.01,w*1.01);
  this.ip.position.set(d/2+hp*.3+e*2.4,h/2,0);this.tcp.position.set(d/2+hp*.3-hp*.55+e*1.2,h/2,0);
  const ck=sp.df?(sp.clampK??1):0;this.clamp.visible=ck>0&&solid;const cs=1+(1-ck)*.6,ch=h*cs+.24,cw=w*cs+.24,b=.12;this.clamp.position.set(0,h/2,0);this.clampMat.opacity=.95*a*ck;
  this.bars[0].scale.set(.22,b,cw);this.bars[0].position.set(0,ch/2,0);this.bars[1].scale.set(.22,b,cw);this.bars[1].position.set(0,-ch/2,0);this.bars[2].scale.set(.22,ch,b);this.bars[2].position.set(0,0,cw/2);this.bars[3].scale.set(.22,ch,b);this.bars[3].position.set(0,0,-cw/2);
  const sh=sp.shell??0;this.shell.visible=sh>0;this.shell.scale.set(d+.5,h+sh*KL,w+.5);this.shell.position.set(0,(h+sh*KL)/2,0);
  const ov=sp.limit&&sp.size>sp.limit?(sp.size-sp.limit)*KL:0,ovs=sp.shell&&sp.limit?Math.max(0,(sp.size+sp.shell-sp.limit)*KL):0,o=Math.max(ov,ovs);
  this.over.visible=o>0;if(o>0){const top=h+(sp.shell?sp.shell*KL:0);this.over.scale.set(d+.08,Math.max(o,.05),w+.08);this.over.position.set(0,top-Math.max(o,.05)/2,0);this.over.material.opacity=.85*a;}
  this.tag.visible=!!sp.label;if(sp.label){this.tag.material.map=cachedTexture(sp.label,sp.sub??'',sp.labelColor??'#e8f4ff');this.tag.position.set(0,h+(sh?sh*KL:0)+.9,0);this.tag.material.opacity=a;}
 }
}
function frame(s,inner,width,color=0x16304e){
 const g=new THREE.Group();s.add(g);const m=new THREE.MeshStandardMaterial({color,metalness:.6,roughness:.35,emissive:P.cyan,emissiveIntensity:0}),b=.28,H=inner*KL;
 box(g,[.5,b,width+2*b],[0,H+b/2,0],m);box(g,[.5,H+b,b],[0,(H+b)/2,width/2+b/2],m);box(g,[.5,H+b,b],[0,(H+b)/2,-width/2-b/2],m);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.PlaneGeometry(width,H)),new THREE.LineBasicMaterial({color:P.cyan,toneMapped:false}));edge.rotation.y=Math.PI/2;edge.position.y=H/2;g.add(edge);
 return{g,m,edge,H};
}
function stripeTexture(){const c=document.createElement('canvas');c.width=64;c.height=64;const g=c.getContext('2d');g.fillStyle='#ffffff';g.fillRect(0,0,64,64);g.fillStyle='#b9cfe6';g.fillRect(0,0,64,4);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.colorSpace=THREE.SRGBColorSpace;return t;}
function rulerTexture(max){const c=document.createElement('canvas');c.width=256;c.height=2048;const g=c.getContext('2d');g.fillStyle='rgba(10,24,44,.92)';g.fillRect(0,0,256,2048);
 for(let b=0;b<=max;b+=20){const y=2048-b/max*2048;g.fillStyle=b%100?'#5d7d9c':b===1400?'#ff9a3c':'#e8f4ff';g.fillRect(0,y-(b%100?1:2),b%100?40:90,b%100?2:4);if(b%100===0&&b>0){g.font='600 44px "Space Grotesk"';g.fillText(String(b),104,y+16);}}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
export class LabZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0xdde6ef);s.fog=new THREE.Fog(0xdde6ef,40,140);
  s.add(new THREE.HemisphereLight(0xffffff,0x9fb4c8,2.2));const key=new THREE.DirectionalLight(0xffffff,2.0);key.position.set(-8,16,-10);s.add(key);const rim=new THREE.DirectionalLight(0x9fd8ff,1.2);rim.position.set(10,6,12);s.add(rim);
  const floor=new THREE.Mesh(new THREE.PlaneGeometry(400,400),new THREE.MeshStandardMaterial({color:0xeef3f8,roughness:.9}));floor.rotation.x=-Math.PI/2;s.add(floor);
  const grid=new THREE.GridHelper(200,100,0xa8c4dd,0xc9d8e6);grid.position.y=.01;s.add(grid);
  const cyc=new THREE.Mesh(new THREE.CylinderGeometry(60,60,60,64,1,true,Math.PI*.15,Math.PI*1.1),new THREE.MeshStandardMaterial({color:0xe6edf4,side:THREE.BackSide,roughness:1}));cyc.position.set(10,30,0);s.add(cyc);
  box(s,[60,.06,LS*2.2],[0,.03,0],mat(0x2b4766,{roughness:.6}));
  // Gauge (tunnel MTU 1400), link frame (1500), ruler, path-frame row, jumbo lane.
  this.gauge=frame(s,TUNNEL_MTU,GW);this.gaugeLabel=label(this.gauge.g,'TUNNEL MTU 1400','opening = 1400 bytes',[0,this.gauge.H+.7,-GW/2-2.6],3.2,'#9feaf6');
  this.link=frame(s,LINK_MTU,GW+.9,0x2a2350);this.link.g.position.x=.1;this.linkLabel=label(this.link.g,'LINK MTU 1500','physical link under the tunnel',[0,this.link.H+.7,-GW/2-3.0],3.2,'#cbb8ff');
  const rmax=1600;this.ruler=new THREE.Mesh(new THREE.PlaneGeometry(.9,rmax*KL),new THREE.MeshBasicMaterial({map:rulerTexture(rmax),toneMapped:false}));this.ruler.position.set(.1,rmax*KL/2,-GW/2-1.1);this.ruler.rotation.y=-Math.PI/2;s.add(this.ruler);
  this.row=PATH_FRAMES.map(([name,m],i)=>{const f=frame(s,m,GW,m<1500?0x3a2414:0x16304e);f.g.position.set(-16+i*8,0,0);label(f.g,`${m}`,name,[0,f.H+1.2,0],2.6,m<1500?'#ffb27a':'#9feaf6');return f;});
  this.jumbo=frame(s,9000,GW+1.2,0x16304e);this.jumbo.g.position.set(4,0,16);label(this.jumbo.g,'MTU 9000','separate L2 network · jumbo frames',[0,this.jumbo.H+2,0],6,'#9feaf6');
  const stripes=stripeTexture();this.rigs=Array.from({length:10},()=>new Rig(s,stripes));
  this.modules=instanced(s,new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({color:0xffffff,roughness:.4}),320);
  this.notes=Array.from({length:3},()=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false,depthWrite:false}));sp.userData.labelWidth=4;sp.renderOrder=12;sp.visible=false;s.add(sp);return sp;});
 }
 // Each act returns packet specs, which frames are shown and up to three floating notes.
 act(mode,t,shot){
  const L=shot.start,E=shot.end,u=(a,b)=>smooth(L+a,L+b,t),r=[],notes=[],show={gauge:true,link:false,row:false,jumbo:false,ruler:true};
  const slide=(x0,x1,a,b)=>lerp(x0,x1,u(a,b));
  switch(mode){
   case'byte':{r.push({x:slide(-12,6,0,1.1),size:1400,df:true,limit:1400,label:'1400 B',sub:'fits',labelColor:'#7ff5c0'});
    const x=t<24.4?-14:slide(-12,-dep(1500)/2-.3,1.12,2.4);r.push({x,size:1401,df:true,limit:1400,label:'1401 B',sub:'one byte too heavy',labelColor:'#ff8b95'});
    if(t>24.9)notes.push(['+1 B','schematic: one module over the limit',[x,1401*KL+.25,0],'#ff8b95']);break;}
   case'header':{const e=1-smooth(28.56,29.7,t);r.push({x:-3,size:1500,df:false,explode:e*Math.min(1,(t-L)*2),label:'1500 B total',sub:'IP 20 + TCP 20 + payload 1460'});
    if(e>.2){notes.push(['IP header 20 B','',[-3+dep(1500)/2+2.6,1500*KL+.5,0],'#9feaf6'],['TCP header 20 B','',[-3+dep(1500)/2+1.3,1500*KL-.4,0],'#9feaf6'],['payload 1460 B','',[-3.6,2.2,0],'#ffb1ec']);}break;}
   case'df':case'dfhook':case'bdf':{const ck=mode==='df'?smooth(L,L+.45,t):1;r.push({x:-dep(1500)/2-.35,size:1500,df:true,clampK:ck,limit:1400,label:'DF = 1',sub:'do not fragment',labelColor:'#ffb27a'});break;}
   case'lower':r.push({x:slide(-10,7,0,.75),size:1400,df:true,limit:1400,label:'1400 B · DF',sub:'ping -s 1372 · passes',labelColor:'#7ff5c0'});break;
   case'measure':case'b1500':{const x=slide(-9,-dep(1500)/2-.3,0,mode==='b1500'?.8:1.2);r.push({x,size:1500,df:true,limit:1400,label:'1500 B',sub:'100 B over the opening',labelColor:'#ff8b95'});
    if(mode==='measure')r.push({x:-dep(1500)/2-.3,size:1500,wire:true,alpha:.6});notes.push(['100 B',"doesn't fit · DF forbids splitting",[x,1450*KL+.2,-GW/2-.4],'#ff8b95']);break;}
   case'b1400':r.push({x:slide(-9,0,0,.7),size:1400,df:true,limit:1400,label:'1400 B',sub:'exactly the tunnel MTU',labelColor:'#7ff5c0'});break;
   case'readout':r.push({x:-dep(1500)/2-.3,size:1500,df:true,limit:1400});notes.push(['Total Length 1500','IP header field',[-1.2,1500*KL+.7,-1.5],'#ff8b95'],['MTU 1400','tunnel interface',[0,1400*KL-.5,1.8],'#9feaf6']);break;
   case'preview':{r.push({x:-6,size:1500,df:true,limit:1400,label:'1460 B payload',sub:'stuck at 1500 B'});const k=u(.4,1.6);for(let i=0;i<2;i++)r.push({x:-6+(i+1)*4.6*k,z:0,size:i?440:1400,wire:true,alpha:k,label:i?'440 B':'1400 B',sub:'same data · smaller packets',labelColor:'#7ff5c0'});show.gauge=false;break;}
   case'encap':case'vpn':{show.gauge=false;show.link=true;const sh=mode==='encap'?100*smooth(L+.4,L+3.0,t):100;r.push({x:-dep(1500)/2-.4,size:1400,df:true,shell:sh,limit:1500,label:mode==='vpn'?'IPsec ESP':'tunnel overhead',sub:mode==='vpn'?'encrypted inner packet + new outer IP header':'outer header + trailer wrap the packet'});
    if(sh>99)notes.push(['1400 + overhead = 1500','fills the link exactly',[1.4,1500*KL+.4,-2.4],'#cbb8ff']);break;}
   case'mpls':{show.gauge=false;show.link=false;r.push({x:-2,z:0,size:1400,df:true,shell:24,label:'MPLS',sub:'label stack · another example',labelColor:'#cbb8ff'});notes.push(['each label adds 4 B','schematic thickness',[-2,1424*KL+1.4,-2.6],'#cbb8ff']);break;}
   case'oldsize':show.gauge=false;show.link=true;r.push({x:-dep(1500)/2-.4,size:1500,df:true,shell:100,limit:1500,label:'1500 + overhead',sub:'the old size no longer fits',labelColor:'#ff8b95'});break;
   case'jumbo':show.jumbo=true;r.push({x:slide(-12,10,0,1.2)+4,z:16,size:9000,df:false,label:'JUMBO 9000 B',sub:'only where every hop allows it',labelColor:'#9feaf6'});r.push({x:-dep(1500)/2-.3,size:1500,df:true,limit:1400});break;
   case'pmtu':{show.gauge=false;show.row=true;show.ruler=false;const stop=-16+3*8-dep(1500)/2-.3,x=slide(-24,stop,.1,1.9);r.push({x,size:1500,df:true,limit:x>-16+3*8-6?1400:1500,label:'1500 B',sub:'passes 1500 · 1500 · 1500 …'});
    if(t>97.76)notes.push(['PATH MTU = 1400','the smallest link decides',[8,1400*KL+2.6,0],'#ffb27a']);break;}
   case'retry':{show.gauge=false;show.ruler=false;break;}
  }
  return{rigs:r,notes,show};
 }
 update(t,a,tl,shot){
  const imp=tl.attack(t),bass=a.sub_20_60_drive??0,{rigs,notes,show}=this.act(shot.mode,t,shot);
  this.gauge.g.visible=show.gauge;this.link.g.visible=show.link;this.ruler.visible=show.ruler&&(show.gauge||show.link);this.row.forEach(f=>f.g.visible=show.row);this.jumbo.g.visible=show.jumbo;
  const lock=shot.mode==='measure'?Math.exp(-Math.max(0,t-43.98)/.25)*(t>=43.98?1:0):0;this.gauge.m.emissiveIntensity=.15+.5*imp+1.5*lock;
  this.row.forEach((f,i)=>{f.m.emissiveIntensity=i===3&&t>=97.76?1.2+.6*Math.sin(t*10):.1;});
  this.rigs.forEach((rg,i)=>rg.set(rigs[i]));
  this.notes.forEach((sp,i)=>{const n=notes[i];sp.visible=!!n;if(!n)return;sp.material.map=cachedTexture(n[0],n[1],n[3]);sp.position.set(...n[2]);});
  // Rebuild: 20-byte modules leave four 1500-byte packets and settle into five new ones (1400 ×4, 440).
  const M=this.modules;M.begin();
  if(shot.mode==='retry'){const k0=smooth(102.9,104.4,t),oldX=i=>-9+i*5,newX=i=>-11+i*5.2,mh=MODULE*KL,w=wid(1500),d=dep(1500);
   const total=REBUILD_OLD.reduce((s,b)=>s+b,0)/MODULE;
   for(let m=0;m<total;m++){const oi=Math.floor(m/(1460/MODULE)),ol=m%(1460/MODULE),ni=Math.floor(m/(MSS_NEW/MODULE)),nl=m%(MSS_NEW/MODULE),st=clamp((k0*1.4-(m/total)*.4)),e=smooth(0,1,st);
    const a0=V([oldX(oi),40*KL+(ol+.5)*mh,-3.2]),a1=V([newX(ni),40*KL+(nl+.5)*mh,3.2]),p=a0.lerp(a1,e);p.y+=Math.sin(e*Math.PI)*2.2;M.push(p,e>.98?P.ok:P.data,new THREE.Vector3(d*.9,mh*.8,w*.9),null,1);}
   this.rigs.forEach((rg,i)=>rg.set(null));const specs=[];
   REBUILD_OLD.forEach((p,i)=>specs.push({x:oldX(i),z:-3.2,size:p+40,wire:true,alpha:1-k0*.85,label:i===0?'old: 1460 B payload':'',sub:'4 × 1500 B'}));
   REBUILD_NEW.forEach((p,i)=>specs.push({x:newX(i),z:3.2,size:p+40,wire:true,alpha:smooth(.2,1,k0),label:i===0?'new: ≤ 1360 B payload':'',sub:`${REBUILD_NEW.length} packets · ${REBUILD_NEW.map(b=>b+40).join(' · ')} B`,labelColor:'#7ff5c0'}));
   specs.forEach((sp,i)=>this.rigs[i]?.set(sp.label?sp:{...sp,label:null}));}
  M.end();
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),H=TUNNEL_MTU*KL;let c;const look=(pos,target,fov=45)=>({pos:V(pos),target:V(target),fov});
  switch(shot.camera){
   case'front':c=look([lerp(-8.5,-7,u),H*.72,lerp(-12.5,-11,u)],[-1.2,H*.5,0],42);break;
   case'explode':c=look([lerp(-1,1,lin),H*.75,-11],[-1.5,H*.5,0],44);break;
   case'macro':c=look([-7.4,H+1.8,lerp(-7.4,-6.6,u)],[-1.2,H-.6,0],40);break;
   case'seams':c=look([-7.2,H*.55,lerp(8.2,7.4,u)],[-1.4,H*.5,0],40);break;
   case'orbit':{const ang=lerp(-1.1,-.5,lin)+(shot.mode==='mpls'?.4:0);c=look([-2+12*Math.cos(ang),H*.8,12*Math.sin(ang)],[-1,H*.55,0],44);break;}
   case'rebuild':c=look([lerp(-2,2,lin),9,-19],[0,2.6,0],46);break;
   case'jumbo':c=look([-34,16,lerp(-10,-6,u)],[2,15,10],56);break;
   case'frames':c=look([lerp(-26,-14,u),7,-15],[lerp(-6,4,u),2.6,0],46);break;
   default:c=look([-12,4,-6],[0,2.5,0]);
  }
  return c;
 }
}
