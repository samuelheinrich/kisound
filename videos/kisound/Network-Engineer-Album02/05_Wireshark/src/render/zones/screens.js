// Three screen rooms: the single analyser (BEFORE), the symmetric comparison BEFORE | AFTER, and the protocol layers.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,glow,additive,setGlow,box,label,canvasTexture,dynamicTexture} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {DW,DH,createGui,createStrip} from '../display.js';
import {THESES,detailTree,NEW_TEST,ADDR} from '../model.js';
const SW=16,SH=SW*DH/DW,TAN=d=>Math.tan(d/2*Math.PI/180);
const px=(x,y)=>[(x/DW-.5)*SW,(.5-y/DH)*SH];
const REG={running:[0,0,2560,1440],theses:[0,100,2560,800],row:[0,160,2560,760],foreign:[0,160,2560,760],ipfilter:[0,90,2560,560],stream:[0,90,2560,560],hide:[0,90,2560,760],kept:[0,1000,2560,1440],
 hook1:[0,160,2560,760],hook2:[0,160,2560,760],hook4:[0,160,2560,760],seqs:[0,160,2560,760],retrans:[0,160,2560,760],secrets:[0,700,2560,1440],rst:[0,160,2560,900],answer:[0,160,2560,900],stop:[0,0,2560,500],save:[0,0,2560,800],files:[0,0,2560,1440]};
function fit(r,cx=0,cy=0,z0=0,fov=19.5){const w=(r[2]-r[0])/DW*SW,h=(r[3]-r[1])/DH*SH,c=px((r[0]+r[2])/2,(r[1]+r[3])/2),d=Math.max(h,w/(16/9))*1.04/(2*TAN(fov));return{c:[c[0]+cx,c[1]+cy],d:d+z0};}
export class GuiZone{
 constructor(){const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x010204);this.gui=createGui('BEFORE');
  const bez=new THREE.Mesh(new THREE.BoxGeometry(SW+.5,SH+.5,.3),mat(0x07090c,{roughness:.4}));bez.position.z=-.17;s.add(bez);s.add(new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),new THREE.MeshBasicMaterial({map:this.gui.tex,toneMapped:false})));
  // sticky notes with unconfirmed theses beside the trace (no red blame)
  this.notes=THESES.map(([k,v],i)=>{const tex=canvasTexture(512,300,(g,w,h)=>{g.fillStyle='#f4e7a6';g.fillRect(0,0,w,h);g.fillStyle='#5a4a10';g.font='600 40px "Space Grotesk"';g.fillText(`${k} · unbestätigt`,24,64);g.font='44px "Space Grotesk"';g.fillStyle='#2a2208';g.fillText(v,24,170);});
   const m=new THREE.Mesh(new THREE.PlaneGeometry(2.6,1.52),new THREE.MeshBasicMaterial({map:tex,transparent:true,opacity:0}));m.position.set(-5.2+i*3.2,1.6-(i%2)*.4,.4);m.rotation.z=(i-1)*.06;s.add(m);return m;});
  this.rst=label(s,'Stream 9 · RST','separater Vergleichsstream · HINWEIS',[5.4,-1.6,.4],4,'#fffc9c');this.rst.userData.alpha=0;}
 update(t,a,tl,shot){this.gui.update(t,{hl:shot.mode==='retrans'||shot.mode==='seqs'?1:0});const th=shot.mode==='theses'?1:shot.mode==='row'?.4:0;this.notes.forEach(n=>n.material.opacity=th);this.rst.userData.alpha=shot.mode==='rst'?1:0;}
 camera(shot,t){const r=REG[shot.mode]||REG.running,u=smooth(shot.start,shot.end,t),{c,d}=fit(r),k=+shot.id.slice(1)%2?1:-1;return{pos:V([c[0]+lerp(-.3,.3,u)*k,c[1],d*lerp(1.02,.97,u)]),target:V([c[0]+lerp(-.3,.3,u)*k,c[1],0]),fov:19.5};}
}
export class CompareZone{
 constructor(){const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x010204);this.a=createGui('BEFORE');this.b=createGui('AFTER');this.strip=createStrip();
  const w=7.6,h=w*DH/DW;for(const[g,x,name]of[[this.a,-4.05,'BEFORE · SW-A'],[this.b,4.05,'AFTER · SW-B']]){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:g.tex,toneMapped:false}));m.position.set(x,1.4,0);s.add(m);label(s,name,'',[x,1.4+h/2+.5,0],3);}
  const st=new THREE.Mesh(new THREE.PlaneGeometry(15.8,3.2),new THREE.MeshBasicMaterial({map:this.strip.tex,toneMapped:false}));st.position.set(0,-2.35,0);s.add(st);
  this.axis=additive(0x9fd0ff,.6);box(s,[.04,4.4,.02],[0,1.4,.01],this.axis);label(s,'gemeinsame Zeitachse','',[0,3.9,.02],2.6);}
 update(t){this.a.update(t);this.b.update(t);this.strip.update(t);}
 camera(shot,t){const u=smooth(shot.start,shot.end,t);return{pos:V([0,lerp(.05,-.05,u),lerp(16.4,15.6,u)]),target:V([0,.0,0]),fov:30};}
}
// Protocol layers as space: Ethernet, IPv4, TCP as glass slabs; TLS stays an opaque hatched core.
export class LayersZone{
 constructor(){const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x02050a);s.fog=new THREE.FogExp2(0x02050a,.03);s.add(new THREE.HemisphereLight(0x6f8fc0,0x05070c,1));
  this.slabs=['Ethernet II','Internet Protocol Version 4','Transmission Control Protocol','Transport Layer Security'].map((n,i)=>{const tex=dynamicTexture(1600,700),tls=i===3;
   const m=new THREE.Mesh(new THREE.BoxGeometry(9,.14,4),[mat(0x1a2a3a),mat(0x1a2a3a),new THREE.MeshBasicMaterial({map:tex.tex,transparent:!tls,opacity:tls?1:.92,toneMapped:false}),mat(0x1a2a3a),mat(0x1a2a3a),mat(0x1a2a3a)]);m.position.set(0,6-i*1.8,0);s.add(m);
   const edge=new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.BoxGeometry(9.04,.18,4.04)),new THREE.LineBasicMaterial({color:[0x3f8fff,0x4fd8ff,0xeef4f8,0xffb13d][i],toneMapped:false}));edge.position.copy(m.position);s.add(edge);return{m,tex,n,tls,edge};});
  this.hint=label(s,'[TCP Retransmission]','Analysehinweis – keine Ursache',[3.4,3.5,1.6],4.2,'#ffcf86');this.hint.userData.alpha=0;this.rsthint=label(s,'RST · Stream 9','HINWEIS · kein Urteil über Schuld',[-3.2,2.1,1.6],4.2,'#fffc9c');this.rsthint.userData.alpha=0;
  const lock=new THREE.Mesh(new THREE.TorusGeometry(.35,.08,8,24,Math.PI),glow(P.amber,1));lock.position.set(0,.85,0);s.add(lock);box(s,[.9,.6,.2],[0,.45,0],glow(P.amber,.8));}
 update(t,a,tl,shot){const tree=detailTree(t),neu=t>=NEW_TEST+1.5;
  const vals=[[`Src: 02:00:00:00:01:20`,`Dst: 02:00:00:00:00:01`,'Type: IPv4 (0x0800)'],[`Src: ${ADDR.client}`,`Dst: ${ADDR.server}`,'TTL: 64 · Protocol: TCP (6)'],[tree[3][1],`Seq: ${tree[4][1]}`,`Len: ${tree[5][1]} · Flags: ACK`],['Application Data','Inhalt verschlüsselt','TLS secrets: nicht vorhanden']];
  this.slabs.forEach((sl,i)=>{sl.tex.set(`${neu}|${i}`,(g,w,h)=>{g.fillStyle=sl.tls?'#2a1d08':'rgba(10,22,34,.85)';g.fillRect(0,0,w,h);if(sl.tls)for(let x=-h;x<w;x+=40){g.strokeStyle='rgba(255,177,61,.35)';g.lineWidth=6;g.beginPath();g.moveTo(x,h);g.lineTo(x+h,0);g.stroke();}
   g.font='600 76px "Space Grotesk"';g.fillStyle=sl.tls?'#ffcf86':'#e6f2fa';g.fillText(sl.n,40,110);g.font='56px "JetBrains Mono"';vals[i].forEach((v,k)=>{g.fillStyle=sl.tls?'#ffd9a0':'#a9c4d4';g.fillText(v,40,260+k*120);});});});
  this.hint.userData.alpha=shot.mode==='hint'&&t<NEW_TEST?1:0;this.rsthint.userData.alpha=shot.mode==='rsthint'?1:0;}
 camera(shot,t){const u=smooth(shot.start,shot.end,t),m=shot.mode,look=(p,tg,f=44)=>({pos:V(p),target:V(tg),fov:f});
  if(/tls|closed|headers/.test(m))return look([lerp(1.5,.5,u),lerp(2.8,2.2,u),lerp(6,4.6,u)],[0,.6,0],44);
  if(m==='unfold'||m==='follow'||m==='select'){const y=lerp(7.5,1.5,u);return look([lerp(-6,-4,u),y+1.4,6],[0,y-.6,0],44);}
  return look([lerp(5,3.5,u),lerp(5.8,4.6,u),lerp(7,6,u)],[0,3,0],46);}
}
