// The DNS world: office and network gear on the ground, the resolver as a glowing globe, its cache
// warehouse, the TLD platforms, the root ring in the sky and ns1 with its two mirrored views.
import * as THREE from 'three';
import {PALETTE as P,SILENCE} from '../config.js';
import {V,mat,glow,additive,setGlow,box,ring,curveTube,baseScene,label,cachedTexture,polarFloor,stars,routerObject,switchObject,sourceServer,instanced,orient,random,dynamicTexture,monoLines} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {NODES,ROOT_LETTERS,ROOT_CENTER,MESSAGES,TRANSACTIONS,activeMessages,messagePos,txPos,txHop,RESOLVER_CACHE,LAPTOP_B_CACHE,resolverCache,laptopBCache,zoneView,status,resolverDown,clueState,CLUES,KINETIC_SECTIONS,word,ZONE,APP_IP} from '../model.js';
export const KIND_COLOR={query:P.query,referral:P.referral,answer:P.answer,cname:P.cyan,nxdomain:P.nx,icmp:P.cyan,timeout:P.timeout};
const nodePos=id=>V(NODES[id].pos);
const CACHE_SLOTS=RESOLVER_CACHE.length;
// Each hook / bridge word lights one part of the world.
const WORD_TARGET={'DIG IT UP':['ns1int','ns1ext'],'TTL':['cache'],'NXDOMAIN':['ns1int'],'WHO CAN TELL':['resolver','laptopB'],'RESOLVER SAYS NO':['resolver'],'CACHE SAYS YES':['laptopB'],'WELCOME BACK':['neon'],'TO THE DNS MESS':['neon'],
 'FLUSH IT':['cache'],'QUERY IT':['resolver'],'DIG IT':['ns1int','ns1ext'],'FIX IT':['ns1int'],'NOT THE NETWORK':['switch','router','firewall'],'ITS DNS':['neon','resolver']};
function hourglass(parent){const g=new THREE.Group();const m=glow(P.query,1),cone=new THREE.ConeGeometry(.22,.32,12);const top=new THREE.Mesh(cone,m);top.rotation.x=Math.PI;top.position.y=.2;const bot=new THREE.Mesh(cone,m.clone());bot.position.y=-.2;g.add(top,bot);box(g,[.5,.03,.5],[0,.38,0],mat(0x2a4a66));box(g,[.5,.03,.5],[0,-.38,0],mat(0x2a4a66));parent.add(g);return{g,top,bot};}
function drawCard(g,w,h,e){
 g.fillStyle=e.negative?'#2a0b1e':'#0b1d2e';g.fillRect(0,0,w,h);g.strokeStyle=e.negative?'#ff4fa3':'#3d8bd9';g.lineWidth=6;g.strokeRect(3,3,w-6,h-6);
 g.fillStyle=e.negative?'#ff7cbf':'#9feaf6';g.font='600 30px "JetBrains Mono"';g.fillText(e.name.length>26?e.name.slice(0,25)+'…':e.name,18,46);
 g.fillStyle='#e8edf2';g.font='26px "JetBrains Mono"';g.fillText(`${e.type}  ${e.value}`.slice(0,30),18,92);
 g.fillStyle=e.negative?'#ff4fa3':'#ffd24a';g.font='24px "JetBrains Mono"';g.fillText(`TTL ${e.ttl}`,18,134);
}
export class CityZone{
 constructor(){
  const s=this.scene=baseScene(.0032);s.add(new THREE.HemisphereLight(0x9cc4f0,0x0b1726,2.4));const key=new THREE.DirectionalLight(0xb8d4f0,2.2);key.position.set(30,60,40);s.add(key);stars(s,1100,300);
  // coloured accent lights: resolver (status colour), root ring, ns1
  this.resolverLight=new THREE.PointLight(P.blue,60,40,1.6);this.resolverLight.position.set(0,10,4);s.add(this.resolverLight);
  const rootLight=new THREE.PointLight(P.violet,80,50,1.5);rootLight.position.set(0,46,-36);s.add(rootLight);
  const nsLight=new THREE.PointLight(0x59d8ed,50,30,1.6);nsLight.position.set(30,14,-8);s.add(nsLight);
  this.floor=polarFloor(s,{radius:46,step:3,spokes:15,arc:[-180,180]});
  const grid=new THREE.GridHelper(260,130,0x16324d,0x0f2236);grid.material.transparent=true;grid.material.opacity=.35;grid.position.y=-.03;s.add(grid);
  // Night city around the scene: dark blocks with scattered lit windows.
  const blocks=instanced(s,new THREE.BoxGeometry(1,1,1),mat(0x0b1828,{roughness:.9,metalness:.2}),240),win=[];blocks.begin();
  for(let i=0;i<240;i++){const a=random(i*3)*Math.PI*2,r=100+random(i*3+1)*80,h=4+Math.pow(random(i*3+2),2)*30,w=4+random(i*7)*6,p=V([r*Math.sin(a),h/2,r*Math.cos(a)-10]);blocks.push(p,0xffffff,V([w,h,w]),null,1);
   for(let k=0;k<6;k++)win.push(p.x+(random(i*11+k)-.5)*w*1.02,1+random(i*13+k)*(h-2),p.z+(random(i*17+k)>.5?w/2+.05:-w/2-.05));}
  blocks.end();s.add(new THREE.Points(new THREE.BufferGeometry().setAttribute('position',new THREE.Float32BufferAttribute(win,3)),new THREE.PointsMaterial({color:0xffd9a8,size:.35,transparent:true,opacity:.7})));
  // Office with two laptops whose screens show what each one resolves.
  box(s,[20,.3,16],[-27,.15,17],mat(0x10233a,{roughness:.8}));label(s,'HELPDESK','office · 10.0.0.0/24',[-27,6.5,10],3.6,'#cfe6f2');
  this.screens={};
  for(const id of['laptopA','laptopB']){const p=NODES[id].pos;box(s,[3.6,.12,2.4],[p[0],p[1]-.75,p[2]],mat(0x2b3f55));box(s,[.2,1,.2],[p[0],p[1]-1.3,p[2]],mat(0x1a2c40));
   box(s,[1.9,.06,1.3],[p[0],p[1]-.66,p[2]],mat(0x5d6f84,{metalness:.6}));const scr=dynamicTexture(512,320);const m=new THREE.Mesh(new THREE.PlaneGeometry(1.9,1.2),new THREE.MeshBasicMaterial({map:scr.tex,toneMapped:false}));m.position.set(p[0],p[1]+.02,p[2]-.62);m.rotation.x=-.2;s.add(m);this.screens[id]=scr;
   label(s,NODES[id].label,NODES[id].sub,[p[0],p[1]+1.6,p[2]],2.4);}
  // Network gear: the suspects that get cleared.
  this.gear={switch:switchObject(s,NODES.switch.pos,.4,8),router:routerObject(s,NODES.router.pos,P.blue),firewall:{root:box(s,[2.2,1.4,1],NODES.firewall.pos,mat(0x1a2f46))}};
  this.okStamps=['switch','router','firewall'].map(id=>{const p=NODES[id].pos;label(s,NODES[id].label,NODES[id].sub,[p[0],p[1]+1.5,p[2]],2.2);const sp=label(s,'✓ OK','not guilty',[p[0],p[1]+3.1,p[2]],2.2,'#3fe6a0');sp.userData.alpha=0;return sp;});
  this.app=sourceServer(s,NODES.app.pos,2);label(s,'APP SERVER',APP_IP,[NODES.app.pos[0],5,NODES.app.pos[2]],2.6,'#9feaf6');
  // The resolver: a wire globe like the cover, on a pillar, with the neon sign above.
  const rp=NODES.resolver.pos;const ped=new THREE.Mesh(new THREE.CylinderGeometry(.7,1.1,rp[1]-3,16),mat(0x0f2135));ped.position.set(rp[0],(rp[1]-3)/2,rp[2]);s.add(ped);
  this.globeMat=new THREE.LineBasicMaterial({color:P.blue,transparent:true,opacity:.9,toneMapped:false});this.globe=new THREE.LineSegments(new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(3.2,2)),this.globeMat);this.globe.position.set(...rp);s.add(this.globe);
  this.core=new THREE.Mesh(new THREE.SphereGeometry(2.2,32,16),additive(P.blue,.5));this.core.position.set(...rp);s.add(this.core);
  this.rings=[0,1,2].map(i=>{const r=ring(s,3.8+i*.5,rp,additive(P.cyan,.3),.03);r.rotation.x=Math.PI/2+i*.4;return r;});
  label(s,'RESOLVER','10.0.0.53 · recursive · cache',[rp[0],rp[1]+4.6,rp[2]],3.6,'#9feaf6');
  const neon=document.createElement('canvas');neon.width=1600;neon.height=300;const ng=neon.getContext('2d');ng.font='400 150px "Michroma"';ng.textAlign='center';const fit=Math.min(1,1480/ng.measureText("IT'S ALWAYS DNS").width);ng.translate(800,0);ng.scale(fit,1);ng.translate(-800,0);ng.shadowColor='#ff4fa3';ng.shadowBlur=40;ng.fillStyle='#ffd0ea';ng.fillText("IT'S ALWAYS DNS",800,200);
  const ntex=new THREE.CanvasTexture(neon);ntex.colorSpace=THREE.SRGBColorSpace;this.neonMat=new THREE.MeshBasicMaterial({map:ntex,transparent:true,toneMapped:false,blending:THREE.AdditiveBlending,depthWrite:false});
  this.neon=new THREE.Mesh(new THREE.PlaneGeometry(16,3),this.neonMat);this.neon.position.set(rp[0],rp[1]+9,rp[2]+.5);s.add(this.neon);
  // Cache warehouse: one card and hourglass per cache entry, in a stable slot.
  const cp=[10,0,10];box(s,[13,.3,8],[cp[0],.15,cp[2]],mat(0x10233a));label(s,'RESOLVER CACHE','records live until their TTL ends',[cp[0],6.6,cp[2]-3],3.6,'#ffd24a');
  for(let row=0;row<3;row++){box(s,[12.4,.12,1.4],[cp[0],1.2+row*1.6,cp[2]-2.6],mat(0x2a4a66));}
  box(s,[.15,5,1.4],[cp[0]-6.2,2.5,cp[2]-2.6],mat(0x2a4a66));box(s,[.15,5,1.4],[cp[0]+6.2,2.5,cp[2]-2.6],mat(0x2a4a66));
  this.cards=RESOLVER_CACHE.map((e,i)=>{const col=i%6,row=Math.floor(i/6)%3,layer=Math.floor(i/18),x=cp[0]-5.1+col*2.04,y=1.85+row*1.6,z=cp[2]-2.4+layer*.5;
   const tex=dynamicTexture(512,160);tex.set('x',(g,w,h)=>drawCard(g,w,h,e));const m=new THREE.Mesh(new THREE.PlaneGeometry(1.85,.58),new THREE.MeshBasicMaterial({map:tex.tex,toneMapped:false,transparent:true}));m.position.set(x,y,z);s.add(m);
   const hg=hourglass(s);hg.g.position.set(x+.75,y+.55,z+.2);hg.g.scale.setScalar(.6);return{e,m,hg,base:V([x,y,z])};});
  this.bCards=LAPTOP_B_CACHE.map(e=>{const tex=dynamicTexture(512,160);tex.set('x',(g,w,h)=>drawCard(g,w,h,e));const m=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.69),new THREE.MeshBasicMaterial({map:tex.tex,toneMapped:false,transparent:true}));const p=NODES.laptopB.pos;m.position.set(p[0],p[1]+2.8,p[2]);s.add(m);const hg=hourglass(s);hg.g.position.set(p[0]+1.45,p[1]+2.9,p[2]);hg.g.scale.setScalar(.7);return{e,m,hg};});
  // TLD platforms and the root ring.
  for(const id of['com','net','org','ch','arpa']){const p=NODES[id].pos,pl=new THREE.Mesh(new THREE.CylinderGeometry(3.2,3.6,.6,6),mat(0x12293f));pl.position.set(p[0],p[1]-.9,p[2]);s.add(pl);const r=ring(s,3.3,[p[0],p[1]-.55,p[2]],additive(P.blue,.6),.06);r.rotation.x=Math.PI/2;
   const t=new THREE.Mesh(new THREE.OctahedronGeometry(.9),mat(0x2a4a66,{emissive:0x0c2a44}));t.position.set(...p);s.add(t);label(s,NODES[id].label,'top-level domain',[p[0],p[1]+2.2,p[2]],3.4,'#cfe6f2');}
  const rc=ROOT_CENTER;const rr=ring(s,15,[rc[0],rc[1]-4,rc[2]],additive(P.violet,.5),.25);rr.rotation.x=Math.PI/2;this.rootRing=rr;
  this.roots=ROOT_LETTERS.map(l=>{const p=NODES[`root-${l}`].pos;box(s,[1.1,6,1.1],[p[0],p[1]-3,p[2]],mat(0x1c2f48));const top=new THREE.Mesh(new THREE.SphereGeometry(.6,16,8),glow(P.violet,.8));top.position.set(...p);s.add(top);label(s,l.toUpperCase(),'root',[p[0],p[1]+1.4,p[2]],1.4,'#d4c6ff');return top;});
  label(s,'ROOT ZONE','13 letters · anycast',[rc[0],rc[1]+5,rc[2]],4.2,'#d4c6ff');
  // ns1 with its two views facing each other like mirrors.
  this.views={};
  for(const[id,view,col]of[['ns1ext','external','#59d8ed'],['ns1int','internal','#ff7cbf']]){const p=NODES[id].pos,face=id==='ns1ext'?1:-1;
   const ped=new THREE.Mesh(new THREE.CylinderGeometry(.6,.9,p[1]-5,12),mat(0x0f2135));ped.position.set(p[0],(p[1]-5)/2,p[2]);s.add(ped);
   box(s,[7,9,.5],[p[0],p[1],p[2]-face*.3],mat(0x0d2034,{metalness:.7,roughness:.25}));
   const tex=dynamicTexture(700,900),m=new THREE.Mesh(new THREE.PlaneGeometry(6.6,8.5),new THREE.MeshBasicMaterial({map:tex.tex,toneMapped:false}));m.position.set(p[0],p[1],p[2]+face*.01);if(face<0)m.rotation.y=Math.PI;s.add(m);
   this.views[id]={tex,view,col};label(s,NODES[id].label,NODES[id].sub,[p[0],p[1]+5.6,p[2]],3.4,col);}
  label(s,`ns1.${ZONE}`,'split-horizon · two views',[34,20.5,-8],4,'#e8edf2');
  for(const id of['nsch','nsex','inaddr']){const p=NODES[id].pos;box(s,[3,p[1],3],[p[0],p[1]/2,p[2]],mat(0x10233a,{metalness:.5}));const r=ring(s,2,[p[0],p[1]+.2,p[2]],additive(P.blue,.6),.05);r.rotation.x=Math.PI/2;label(s,NODES[id].label,NODES[id].sub,[p[0],p[1]+2,p[2]],3,'#cfe6f2');}
  // Every link a transaction uses: a dim tube, lit while a message travels on it.
  this.links=new Map();const base=mat(0x24527a,{roughness:.6,emissive:0x0a2440});
  for(const m of MESSAGES){const key=`${m.arc.from}|${m.arc.to}`;if(this.links.has(key))continue;const pts=m.arc.pts.filter((_,i)=>i%4===0||i===40).map(V);curveTube(s,pts,base,.05,24);const gm=additive(P.query,0);curveTube(s,pts,gm,.12,24);this.links.set(key,gm);}
  // Halos for flashes on hook words and events.
  this.halos={};for(const id of['laptopA','laptopB','resolver','ns1int','ns1ext','switch','router','firewall','cache']){const p=id==='cache'?[10,.3,10]:NODES[id].pos,h=ring(s,id==='resolver'?5:2.4,[p[0],id==='cache'?.35:p[1]-1.1,p[2]],additive(P.white,0),.08);h.rotation.x=Math.PI/2;this.halos[id]=h;}
  this.cards3=instanced(s,new THREE.BoxGeometry(1.1,.68,.08),glow(0xffffff),120);this.trails=instanced(s,new THREE.SphereGeometry(.16,8,6),additive(0xffffff),900);
  this.msgLabels=Array.from({length:4},()=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({transparent:true,depthTest:false,depthWrite:false}));sp.userData.labelWidth=3.2;sp.scale.set(3.2,.6,1);sp.renderOrder=11;sp.visible=false;s.add(sp);return sp;});
  this.q=new THREE.Quaternion();this.tmp=new THREE.Vector3();
 }
 wordFlash(t,tl){const out={};for(const l of tl.analysis.lyrics.segments){if(!KINETIC_SECTIONS.has(l.section)||t<l.start_s||t>l.start_s+1.2)continue;for(const id of WORD_TARGET[word(l.text).replace("IT'S","ITS")]||[])out[id]=Math.max(out[id]||0,Math.exp(-(t-l.start_s)/.35));}return out;}
 update(t,a,tl,shot){
  const imp=tl.attack(t),drop=tl.drop(t),bass=a.sub_20_60_drive??0,flash=this.wordFlash(t,tl),st=status(t),down=resolverDown(t);this.pulse=imp;
  this.floor.pts.material.opacity=.4+.3*bass+.3*drop;this.floor.lines.material.opacity=.25+.15*bass;
  // Resolver: blue when answering, magenta while it hands out NXDOMAIN, dark red while unreachable.
  const rcol=down?P.timeout:st.code==='NXDOMAIN'?P.nx:P.blue;this.resolverLight.color.setHex(rcol);this.resolverLight.intensity=down?5:50+40*bass+60*drop;this.globeMat.color.setHex(rcol).multiplyScalar(down?.35:.8+.5*bass+(flash.resolver||0));
  setGlow(this.core.material,rcol,down?.05:.25+.35*bass+.6*drop+(flash.resolver||0)*.8);this.globe.rotation.y=t*.15;this.globe.rotation.x=.2*Math.sin(t*.1);
  this.rings.forEach((r,i)=>{r.rotation.z=t*(.3+.2*i);setGlow(r.material,P.cyan,down?0:.25+.3*imp);});
  const chorus=/verdict/.test(shot.mode)?1:0,neonFlicker=.85+.15*Math.sin(t*37)*Math.sin(t*13);setGlow(this.neonMat,0xffffff,(down?0:(.25+.55*chorus+.4*drop)*neonFlicker)+(flash.neon||0)*1.2);
  this.app.edgeMat.color.setHex(P.cyan).multiplyScalar(.6+.4*bass);
  for(const[id,scr]of Object.entries(this.screens)){
   const bCache=laptopBCache(t).length>0,ok=id==='laptopB'?bCache||st.code==='NOERROR':st.code==='NOERROR',to=st.code==='TIMEOUT';
   scr.set(`${id}:${to}:${ok}:${st.text}`,(g,w,h)=>{g.fillStyle='#0a1422';g.fillRect(0,0,w,h);g.fillStyle='#1d3a55';g.fillRect(0,0,w,40);g.fillStyle='#cfe6f2';g.font='20px "JetBrains Mono"';g.fillText(id==='laptopA'?`https://app.${ZONE}`:'engineer@laptop',14,27);
    g.font='600 34px "Space Grotesk"';g.fillStyle=to?'#ff6f7d':ok?'#3fe6a0':'#ff4fa3';g.fillText(to?'Request timed out':ok?(id==='laptopB'?'works on my machine':'Dashboard loaded'):'Server not found',22,120);
    g.font='20px "JetBrains Mono"';g.fillStyle='#8fb2c8';g.fillText(to?';; no servers could be reached':ok?`app → ${APP_IP}`:'DNS_PROBE_FINISHED_NXDOMAIN',22,170);});}
  // Network gear clears as the checks pass.
  const cleared=['cable','port','firewall'].map(c=>clueState(CLUES.find(x=>x.id===c),t)==='ok');
  this.okStamps.forEach((sp,i)=>{sp.userData.alpha=(cleared[Math.min(i,2)]&&/checks|verdict|fix|gear/.test(shot.mode+shot.camera)?1:0)*(1-(down?1:0));});
  setGlow(this.gear.router.ringMat,P.answer,.6+.4*imp);
  // Cache cards: visible while cached, hourglass sand = remaining TTL; flush sweeps them out.
  const live=new Set(resolverCache(t).map(e=>e));
  this.cards.forEach(c=>{const on=t>=c.e.at&&t<c.e.until&&t<c.e.at+c.e.ttl,rem=on?clamp((c.e.ttl-(t-c.e.at))/c.e.ttl):0,born=clamp((t-c.e.at)/.4),gone=Math.min(t<c.e.until?1:clamp(1-(t-c.e.until)/.5),t<c.e.at+c.e.ttl?1:clamp(1-(t-c.e.at-c.e.ttl)/.6));
   c.m.visible=c.hg.g.visible=born>0&&gone>0;c.m.material.opacity=Math.min(born,gone);c.m.position.copy(c.base).add(V([0,(1-born)*.6+(t>=c.e.until?(t-c.e.until)*3:0),0]));
   c.hg.top.scale.setScalar(Math.max(.05,rem));c.hg.bot.scale.setScalar(Math.max(.05,1-rem*.9));setGlow(c.hg.top.material,c.e.negative?P.nx:P.query,1+(flash.cache||0));c.hg.g.rotation.y=t*.4;});
  this.bCards.forEach(c=>{const on=t>=c.e.at&&t<c.e.until&&t<c.e.at+c.e.ttl;c.m.visible=c.hg.g.visible=on;const rem=on?clamp((c.e.ttl-(t-c.e.at))/c.e.ttl):0;c.hg.top.scale.setScalar(Math.max(.05,rem));c.hg.bot.scale.setScalar(Math.max(.05,1-rem*.9));c.m.position.y=NODES.laptopB.pos[1]+2.8+.08*Math.sin(t*2);});
  // Zone views.
  for(const[id,v]of Object.entries(this.views)){const rows=zoneView(v.view,t);
   v.tex.set(JSON.stringify(rows),(g,w,h)=>{g.fillStyle='#071322';g.fillRect(0,0,w,h);g.fillStyle=v.col;g.fillRect(0,0,w,8);g.font='600 40px "Space Grotesk"';g.fillText(`view "${v.view}"`,30,70);g.font='24px "JetBrains Mono"';g.fillStyle='#8fb2c8';g.fillText(`$ORIGIN ${ZONE}.`,30,115);
    rows.forEach((r,i)=>{const y=175+i*62;if(r.state==='missing'){g.fillStyle='rgba(255,79,163,.18)';g.fillRect(20,y-36,w-40,52);}if(r.state==='new'){g.fillStyle='rgba(63,230,160,.22)';g.fillRect(20,y-36,w-40,52);}
     g.fillStyle=r.state==='missing'?'#ff4fa3':r.state==='new'?'#3fe6a0':r.state==='quiet'?'#4f6b80':'#e8edf2';g.font='26px "JetBrains Mono"';g.fillText(`${r.name.padEnd(18).slice(0,18)} ${r.type.padEnd(6)} ${r.value}`.slice(0,44),34,y);});});}
  // Links glow while a message travels on them; packets as cards with a short trail.
  for(const gm of this.links.values())gm.color.setRGB(0,0,0);
  const cm=this.cards3,tr=this.trails;cm.begin();tr.begin();const labelled=[];const focus=shot.target?.startsWith('tx:')?shot.target.slice(3):null;
  for(const m of activeMessages(t)){
   const f=(t-m.t0)/(m.t1-m.t0),fade=t>m.t1?1-(t-m.t1)/.3:1,col=KIND_COLOR[m.kind],timeout=m.kind==='timeout';
   const vis=timeout?clamp(1-(f-.4)/.2):fade;if(vis<=0)continue;
   const pos=V(messagePos(m,Math.min(t,m.t1))),ahead=V(messagePos(m,Math.min(m.t1,t+.05)));if(ahead.distanceToSquared(pos)<1e-6)ahead.add(V([0,0,.01]));
   cm.push(pos,col,m.kind==='icmp'?.45:.7,orient(this.q,pos,ahead),.85*vis);
   for(let k=1;k<=6;k++){const tt=t-k*.035;if(tt<m.t0)break;tr.push(V(messagePos(m,tt)),col,.9-k*.1,null,.5*vis*(1-k/7));}
   const gm=this.links.get(`${m.arc.from}|${m.arc.to}`);if(gm&&t<m.t1)gm.color.setHex(col).multiplyScalar(.5);
   if(m.label&&t<m.t1&&m.kind!=='icmp'&&(!focus||m.tx===focus))labelled.push({m,pos});
  }
  cm.end();tr.end();labelled.sort((x,y)=>(y.m.tx===focus)-(x.m.tx===focus)||y.m.t0-x.m.t0);
  this.msgLabels.forEach((sp,i)=>{const l=labelled[i];sp.visible=!!l;if(!l)return;sp.material.map=cachedTexture(l.m.label,`${NODES[l.m.from].label} → ${NODES[l.m.to].label}`,'#'+new THREE.Color(KIND_COLOR[l.m.kind]).getHexString());sp.position.copy(l.pos).add(V([0,1.1,0]));});
  // Halos: hook words, plus a red pulse at the client while queries time out.
  const toPulse=t>=SILENCE[0]&&t<SILENCE[1]?.5+.5*Math.sin(t*12):0;
  for(const[id,h]of Object.entries(this.halos)){const v=(flash[id]||0)+(id==='laptopA'?toPulse:0);const col=id==='laptopB'||id==='switch'||id==='router'||id==='firewall'?P.answer:id==='cache'?P.query:id==='laptopA'&&toPulse?P.timeout:P.nx;setGlow(h.material,col,v);h.scale.setScalar(1+v*.4);}
  this.roots.forEach((r,i)=>setGlow(r.material,P.violet,.6+.5*(activeMessages(t).some(m=>m.to===`root-${ROOT_LETTERS[i]}`||m.from===`root-${ROOT_LETTERS[i]}`)?1:0)+.3*drop));
  setGlow(this.rootRing.material,P.violet,.35+.3*bass);
 }
 // POV cameras ride with a transaction's packet: behind it (ride), behind and above (chase) or alongside (flyby).
 povCamera(kind,id,t,shot){
  const p=V(txPos(id,t)),hop=txHop(id,t),next=V(messagePos(hop,Math.min(hop.t1,Math.max(hop.t0,t)+.12)));let dir=next.clone().sub(p);if(dir.lengthSq()<1e-4)dir=nodePos(hop.to).sub(p);dir.normalize();
  const side=V([dir.z,0,-dir.x]).normalize(),sign=+shot.id.slice(1)%2?1:-1;
  if(kind==='ride')return{pos:p.clone().sub(dir.clone().multiplyScalar(3.6)).add(V([0,1.7,0])),target:p.clone().add(dir.clone().multiplyScalar(9)),fov:70};
  if(kind==='flyby')return{pos:p.clone().add(side.multiplyScalar(7*sign)).add(V([0,2.5,0])),target:p,fov:52};
  return{pos:p.clone().sub(dir.clone().multiplyScalar(7)).add(V([0,3.5,0])).add(side.multiplyScalar(2.5*sign)),target:p.clone().add(dir.multiplyScalar(3)),fov:56};
 }
 camera(shot,t){
  const u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),idx=+shot.id.slice(1),sign=idx%2?1:-1,bump=this.pulse||0;let c;
  const look=(pos,target,fov=50)=>({pos:V(pos),target:V(target),fov});
  switch(shot.camera){
   case'opening':c=look([lerp(-58,-40,u),lerp(32,9,u),lerp(66,32,u)],[lerp(0,-26,u),lerp(9,2.5,u),lerp(0,14,u)],lerp(50,54,u));break;
   case'ride':case'chase':case'flyby':c=this.povCamera(shot.camera,shot.target.slice(3),t,shot);break;
   case'office':{const p=nodePos(shot.target||'laptopA');c=look(p.clone().add(V([lerp(6,4.5,u)*sign,3.2,6])),p.clone().add(V([0,.6,0])),48);break;}
   case'ping':c=look([lerp(-22,22,lin),10,40],[lerp(-20,24,lin),1.5,12],58);break;
   case'trace':c=look([lerp(16,0,lin),16,42],[4,1.5,10],58);break;
   case'gear':c=look([lerp(-20,-4,lin),6.5,19],[-12,1.6,6],50);break;
   case'cache':c=look([10+lerp(-2.5,2.5,lin)*sign,4.4,lerp(16,14.5,u)],[10,3,7.4],46);break;
   case'wide':c=look([-36+8*lin,26,44],[0,14,-10],56);break;
   case'wide2':c=look([40-8*lin,30,38],[0,15,-14],56);break;
   case'resolver':{const a=lerp(-.5,.5,lin)+idx;c=look([12*Math.sin(a),11,12*Math.cos(a)],NODES.resolver.pos,50);break;}
   case'rise':c=look([lerp(-6,6,lin),lerp(4,30,u),lerp(24,18,u)],[0,lerp(9,46,u),lerp(0,-30,u)],lerp(52,60,u));break;
   case'orbit':{const a=idx*.9+lerp(-.25,.25,lin);c=look([48*Math.sin(a),30,-10+48*Math.cos(a)],[0,16,-12],56);break;}
   case'tower':{const a=idx*.7+lerp(-.4,.4,lin),rc=ROOT_CENTER;c=look([rc[0]+22*Math.sin(a),rc[1]+6,rc[2]+22*Math.cos(a)],[rc[0],rc[1]-2,rc[2]],58);break;}
   case'zone':c=look([lerp(21,19,u),14,-8+lerp(-3,3,lin)*sign],[36,12,-8],58);break;
   case'arpa':c=look([lerp(-22,-25,u),25,lerp(9,6,u)],[-33,20,-5],56);break;
   case'tld':c=look([lerp(-10,10,lin),40,6],[0,30,-24],54);break;
   case'timeout':{const p=nodePos('laptopA');c=look(p.clone().add(V([2.4,1.6,3.2])),p,46);break;}
   case'final':c=look([lerp(-8,8,lin),lerp(20,30,u),lerp(58,74,u)],[0,lerp(14,18,u),-10],54);break;
   default:c=look([0,30,60],[0,10,0]);
  }
  return{pos:c.pos.add(V([0,.1*bump,0])),target:c.target,fov:c.fov-1.2*bump};
 }
}
