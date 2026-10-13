// Technical views of the expert mode: they show that the picture is a running program. Generic for every piece:
// the player wraps film.render and renderer.render, so it sees each frame's 3D scene, camera and draw statistics
// without knowing the project. Nothing changes while every view is off (multipliers 1, no override).
// A piece may describe its objects for the inspector – object.name and object.userData.inspect = t => ({…}) with
// the parameters that drive the object at time t. "Bounding Boxes", not "Collision Boxes": no piece uses collisions.
import * as THREE from 'three';
const S={
 de:{title:'Technik',hint:'Das Bild ist ein Programm: jede Ansicht zeigt, was der Code gerade berechnet.',view:'Ansicht',image:'Bild',wire:'Drahtgitter',normal:'Normalen',depth:'Tiefe',boxes:'Bounding Boxes',
  inspect:'Objektinspektor',inspectOn:'Objekt im Bild anklicken',inspectNone:'Klicke auf ein Objekt im Bild.',inspect2D:'In dieser Einstellung ist das Bild 2D (Canvas) – keine 3D-Objekte.',noHit:'Kein 3D-Objekt an dieser Stelle.',
  name:'Name',type:'Typ',instance:'Instanz {i} von {n}',geometry:'Geometrie',triangles:'Dreiecke',material:'Material',color:'Farbe',emissive:'Emission',opacity:'Deckkraft',texture:'Textur',canvasTex:'Canvas, vom Code gezeichnet ({w}×{h})',
  position:'Position (Welt, m)',scale:'Skalierung',visible:'sichtbar',time:'Über die Zeit',timeHint:'t − 0,5 s · t · t + 0,5 s, neu berechnet',changes:'verändert sich',steady:'unverändert',driven:'Steuerung im Code',noDrive:'Dieses Stück beschreibt das Objekt nicht näher.',
  scene:'Live-Szenenkonfiguration',sceneHint:'Echte Parameter des laufenden Codes; das Bild rechnet sofort neu.',audio:'Audio-Reaktion',bloom:'Bloom',fog:'Nebel',exposure:'Belichtung',reset:'Zurücksetzen',na:'in diesem Stück nicht vorhanden',
  perf:'Leistung',fps:'Bilder/s',frameMs:'Rechenzeit/Bild',calls:'Draw Calls',tris:'Dreiecke',lines:'Linien',geos:'Geometrien',texs:'Texturen',progs:'Shader-Programme',res:'Auflösung',paused:'Pause',close:'Schliessen',yes:'ja',no:'nein',flat:'2D'},
 en:{title:'Tech',hint:'The picture is a program: each view shows what the code is computing right now.',view:'View',image:'Image',wire:'Wireframe',normal:'Normals',depth:'Depth',boxes:'Bounding boxes',
  inspect:'Object inspector',inspectOn:'Click an object in the picture',inspectNone:'Click an object in the picture.',inspect2D:'This shot is 2D (canvas) – no 3D objects.',noHit:'No 3D object at this point.',
  name:'Name',type:'Type',instance:'Instance {i} of {n}',geometry:'Geometry',triangles:'Triangles',material:'Material',color:'Colour',emissive:'Emissive',opacity:'Opacity',texture:'Texture',canvasTex:'Canvas, drawn by the code ({w}×{h})',
  position:'Position (world, m)',scale:'Scale',visible:'visible',time:'Over time',timeHint:'t − 0.5 s · t · t + 0.5 s, recomputed',changes:'changes',steady:'unchanged',driven:'Driven by the code',noDrive:'This piece does not describe the object further.',
  scene:'Live scene configuration',sceneHint:'Real parameters of the running code; the picture recomputes at once.',audio:'Audio response',bloom:'Bloom',fog:'Fog',exposure:'Exposure',reset:'Reset',na:'not present in this piece',
  perf:'Performance',fps:'Frames/s',frameMs:'Compute time/frame',calls:'Draw calls',tris:'Triangles',lines:'Lines',geos:'Geometries',texs:'Textures',progs:'Shader programs',res:'Resolution',paused:'Paused',close:'Close',yes:'yes',no:'no',flat:'2D'}};
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const f2=v=>(Math.abs(v)<1e-4?0:v).toFixed(2),hex=c=>'#'+c.getHexString().toUpperCase(),vec=v=>`${f2(v.x)}, ${f2(v.y)}, ${f2(v.z)}`;
const DEPTH_VS=`#include <common>
varying float vZ;
void main(){
#ifdef USE_INSTANCING
 vec4 mv=modelViewMatrix*instanceMatrix*vec4(position,1.);
#else
 vec4 mv=modelViewMatrix*vec4(position,1.);
#endif
 vZ=-mv.z;gl_Position=projectionMatrix*mv;}`;
const DEPTH_FS=`uniform float uNear,uFar;varying float vZ;
void main(){float d=clamp(log(max(vZ,uNear)/uNear)/log(uFar/uNear),0.,1.);gl_FragColor=vec4(vec3(pow(1.-d,1.4)),1.);}`;
// normals from the screen-space derivatives of the view position: independent of the vertex data of a piece
// (not every geometry carries a normal attribute), works with instancing, shows each face flat
const NORMAL_VS=`#include <common>
varying vec3 vView;
void main(){
#ifdef USE_INSTANCING
 vec4 mv=modelViewMatrix*instanceMatrix*vec4(position,1.);
#else
 vec4 mv=modelViewMatrix*vec4(position,1.);
#endif
 vView=mv.xyz;gl_Position=projectionMatrix*mv;}`;
const NORMAL_FS=`varying vec3 vView;
void main(){vec3 c=cross(dFdx(vView),dFdy(vView));float l=length(c);vec3 n=l>1e-12?c/l:vec3(0.,0.,1.);gl_FragColor=vec4(n*.5+.5,1.);}`;

export function createTech({film,lang,current,playing=()=>false}){
 const r=film?.renderer;if(!r||typeof r.render!=='function')return null;
 const T=(k,v={})=>S[lang()][k].replace(/\{(\w+)\}/g,(_,x)=>v[x]??'');
 const st={open:false,view:'image',boxes:false,inspect:false,picked:null,instance:null,history:null,rev:0,mult:{audio:1,bloom:1,fog:1,exposure:1},
  frame:{main:null,calls:0,tris:0,lines:0,points:0,ms:0},fps:0,stamps:[]};
 const bump=()=>{st.rev++;};
 r.info.autoReset=false;
 // ---- view materials
 const VIEW={wire:new THREE.MeshBasicMaterial({color:0x59d8ed,wireframe:true}),normal:new THREE.ShaderMaterial({vertexShader:NORMAL_VS,fragmentShader:NORMAL_FS,side:THREE.DoubleSide}),
  depth:new THREE.ShaderMaterial({uniforms:{uNear:{value:.05},uFar:{value:200}},vertexShader:DEPTH_VS,fragmentShader:DEPTH_FS})};
 // ---- exposure: a multiplier on whatever the piece sets (property on this renderer instance only)
 let exposureBase=r.toneMappingExposure;const toneMapped=r.toneMapping!==THREE.NoToneMapping;
 if(toneMapped)Object.defineProperty(r,'toneMappingExposure',{configurable:true,get:()=>exposureBase*st.mult.exposure,set:v=>{exposureBase=v;}});
 // ---- bloom: scale the strength the piece sets for this frame; off in the analysis views
 const bloomPasses=(film.composer?.passes||[]).filter(p=>typeof p.strength==='number'&&p.resolution);
 for(const p of bloomPasses){const orig=p.render.bind(p);p.render=(...a)=>{const s=p.strength;p.strength=s*(st.view==='image'?st.mult.bloom:0);orig(...a);p.strength=s;};}
 // ---- audio response: the measured features the piece reads through its timeline
 const tl=film.tl;let audioHook=false;
 if(tl&&typeof tl.sample==='function'){audioHook=true;const orig=tl.sample.bind(tl);
  tl.sample=(...a)=>{const o=orig(...a);if(st.mult.audio===1||!o||typeof o!=='object')return o;const k=st.mult.audio,out={...o};
   for(const key of Object.keys(out))if(typeof out[key]==='number'&&(key.endsWith('_drive')||['sub','high','energy','bass','mid'].includes(key)))out[key]*=k;return out;};
  for(const name of['attack','drop','accent'])if(typeof tl[name]==='function'){const o=tl[name].bind(tl);tl[name]=(...a)=>o(...a)*st.mult.audio;}}
 // ---- renderer hook: the first perspective render of a frame is the 3D scene; views and fog apply to every one
 const origRender=r.render.bind(r);let inTech=false;
 r.render=(scene,camera)=>{
  if(inTech||!scene?.isScene||!camera?.isPerspectiveCamera)return origRender(scene,camera);
  if(!st.frame.main)st.frame.main={scene,camera};
  // the view material replaces the material of every mesh; lines keep theirs (a line has no triangles to show),
  // sprites (glows, labels) are hidden in the normal and depth views
  const ov=VIEW[st.view]||null,swapped=[];let fogKeep=null;
  if(ov){scene.traverse(o=>{if(o.isMesh){swapped.push([o,o.material]);o.material=ov;}else if(o.isSprite&&st.view!=='wire'&&o.visible){swapped.push([o,null]);o.visible=false;}});if(ov===VIEW.depth){VIEW.depth.uniforms.uNear.value=Math.max(camera.near,.01);VIEW.depth.uniforms.uFar.value=Math.max(camera.near*10,Math.min(camera.far,400));}}
  if(scene.fog&&st.mult.fog!==1){if(scene.fog.isFogExp2){fogKeep=scene.fog.density;scene.fog.density*=st.mult.fog;}else{fogKeep=[scene.fog.near,scene.fog.far];scene.fog.far=scene.fog.near+(scene.fog.far-scene.fog.near)/Math.max(.05,st.mult.fog);}}
  origRender(scene,camera);
  for(const[o,m]of swapped){if(m===null)o.visible=true;else o.material=m;}if(fogKeep!==null){if(scene.fog.isFogExp2)scene.fog.density=fogKeep;else[scene.fog.near,scene.fog.far]=fogKeep;}
 };
 // ---- film hook: statistics per frame, then the box overlay drawn on top of the finished picture
 const filmRender=film.render.bind(film);
 film.render=(t,...a)=>{
  st.frame.main=null;r.info.reset();const t0=performance.now(),out=filmRender(t,...a);st.frame.ms=performance.now()-t0;
  const i=r.info.render;Object.assign(st.frame,{calls:i.calls,tris:i.triangles,lines:i.lines,points:i.points,t});
  const now=performance.now();st.stamps.push(now);while(st.stamps.length&&now-st.stamps[0]>1000)st.stamps.shift();
  if(st.frame.main&&(st.boxes||st.picked))drawBoxes();
  if(st.open)refresh(false);
  return out;
 };
 // ---- bounding boxes: world-space boxes of every visible object, the picked one in orange
 const MAX=1600,pos=new Float32Array(MAX*24*3),col=new Float32Array(MAX*24*3),lg=new THREE.BufferGeometry();
 lg.setAttribute('position',new THREE.BufferAttribute(pos,3));lg.setAttribute('color',new THREE.BufferAttribute(col,3));
 const lines=new THREE.LineSegments(lg,new THREE.LineBasicMaterial({vertexColors:true,transparent:true,opacity:.85,depthTest:false,toneMapped:false}));lines.frustumCulled=false;
 const overlay=new THREE.Scene();overlay.add(lines);
 const box=new THREE.Box3(),tmp=new THREE.Box3(),c=new THREE.Color(),E=[[0,1],[1,3],[3,2],[2,0],[4,5],[5,7],[7,6],[6,4],[0,4],[1,5],[2,6],[3,7]];
 const objBox=(o,out)=>{const g=o.geometry;if(!g)return false;
  if(o.isInstancedMesh){if(st.picked===o&&st.instance!=null){const m=new THREE.Matrix4();o.getMatrixAt(st.instance,m);if(!g.boundingBox)g.computeBoundingBox();out.copy(g.boundingBox).applyMatrix4(m).applyMatrix4(o.matrixWorld);return true;}
   if(o.count>4000)return false;o.computeBoundingBox();if(!o.boundingBox||o.boundingBox.isEmpty())return false;out.copy(o.boundingBox).applyMatrix4(o.matrixWorld);return true;}
  if(o.isSprite){const p=o.getWorldPosition(new THREE.Vector3()),s=o.getWorldScale(new THREE.Vector3());out.setFromCenterAndSize(p,new THREE.Vector3(s.x,s.y,Math.min(s.x,s.y)*.05));return true;}
  if(!g.boundingBox)g.computeBoundingBox();if(!g.boundingBox||g.boundingBox.isEmpty())return false;out.copy(g.boundingBox).applyMatrix4(o.matrixWorld);return true;};
 function drawBoxes(){
  const{scene,camera}=st.frame.main;scene.updateMatrixWorld();let n=0;
  const push=(b,color)=>{if(n>=MAX)return;const p=[0,1,2,3,4,5,6,7].map(k=>[k&1?b.max.x:b.min.x,k&2?b.max.y:b.min.y,k&4?b.max.z:b.min.z]);c.set(color);
   E.forEach(([a,b2],e)=>{const o=(n*24+e*2)*3;pos.set(p[a],o);pos.set(p[b2],o+3);col.set([c.r,c.g,c.b,c.r,c.g,c.b],o);});n++;};
  if(st.boxes)scene.traverseVisible(o=>{if(o===lines||!o.geometry||o===st.picked)return;if(o.material?.side===THREE.BackSide)return;if(!objBox(o,tmp))return;
   if(tmp.getSize(new THREE.Vector3()).length()>80)return;push(tmp,o.isInstancedMesh?0xffb347:o.isLine||o.isPoints?0x3fe6a0:o.isSprite?0xb98cff:0x59d8ed);});
  if(st.picked&&objBox(st.picked,tmp)){push(tmp,0xff6534);const s=tmp.getSize(new THREE.Vector3()).multiplyScalar(.04);tmp.expandByVector(s);push(tmp,0xff6534);}
  lg.setDrawRange(0,n*24);lg.attributes.position.needsUpdate=true;lg.attributes.color.needsUpdate=true;
  const auto=r.autoClear,target=r.getRenderTarget();inTech=true;r.autoClear=false;r.setRenderTarget(null);origRender(overlay,camera);r.autoClear=auto;r.setRenderTarget(target);inTech=false;
 }
 // ---- panel
 const el=document.createElement('aside');el.id='tech-panel';el.hidden=true;
 el.addEventListener('pointerdown',e=>e.stopPropagation());el.addEventListener('click',e=>e.stopPropagation());el.addEventListener('keydown',e=>e.stopPropagation());
 const slider=(k,min,max,step,ok)=>`<label class="tp-row${ok?'':' na'}"><span data-k="${k}"></span><input type="range" data-m="${k}" min="${min}" max="${max}" step="${step}" value="1"${ok?'':' disabled'}><output data-o="${k}">×1.00</output></label>`;
 const fogAvailable=()=>!!st.frame.main?.scene.fog;
 el.innerHTML=`<div class="tp-head"><strong data-k="title"></strong><button class="tp-close" data-close>×</button></div><p class="tp-hint" data-k="hint"></p>
 <section><h4 data-k="view"></h4><div class="tp-seg">${['image','wire','normal','depth'].map(v=>`<button data-view="${v}" data-k="${v}"></button>`).join('')}</div>
  <label class="tp-check"><input type="checkbox" data-boxes> <span data-k="boxes"></span></label></section>
 <section><h4 data-k="inspect"></h4><label class="tp-check"><input type="checkbox" data-inspect> <span data-k="inspectOn"></span></label><div class="tp-inspect"></div></section>
 <section><h4 data-k="scene"></h4><p class="tp-hint" data-k="sceneHint"></p>${slider('audio',0,3,.05,audioHook)}${slider('bloom',0,3,.05,bloomPasses.length>0)}${slider('fog',0,4,.05,true)}${slider('exposure',.3,2.5,.05,toneMapped)}
  <button class="tp-reset" data-reset data-k="reset"></button></section>
 <section><h4 data-k="perf"></h4><dl class="tp-perf"></dl></section>`;
 const q=s=>el.querySelector(s);
 function applyLang(){for(const n of el.querySelectorAll('[data-k]'))n.textContent=T(n.dataset.k);for(const n of el.querySelectorAll('.tp-row.na'))n.title=T('na');refresh(true);}
 el.querySelector('[data-close]').onclick=()=>setOpen(false);
 for(const b of el.querySelectorAll('[data-view]'))b.onclick=()=>{st.view=b.dataset.view;bump();refresh(true);};
 q('[data-boxes]').onchange=e=>{st.boxes=e.target.checked;bump();};
 q('[data-inspect]').onchange=e=>{st.inspect=e.target.checked;if(!st.inspect){st.picked=null;st.history=null;}document.body.classList.toggle('tech-inspect',st.inspect);bump();refresh(true);};
 for(const s of el.querySelectorAll('[data-m]'))s.oninput=()=>{st.mult[s.dataset.m]=+s.value;bump();refresh(true);};
 q('[data-reset]').onclick=()=>{for(const k of Object.keys(st.mult))st.mult[k]=1;for(const s of el.querySelectorAll('[data-m]'))s.value='1';st.view='image';st.boxes=false;q('[data-boxes]').checked=false;bump();refresh(true);};
 // ---- inspector: pick with the camera of the last frame; the history re-renders t ± 0.5 s (pure function of time)
 const ray=new THREE.Raycaster();ray.params.Line.threshold=.01;ray.params.Points.threshold=.02;
 function shown(o){for(let p=o;p;p=p.parent)if(!p.visible)return false;return true;}
 function pick(e){
  if(!st.inspect)return;const main=st.frame.main,canvas=r.domElement;e.preventDefault();e.stopPropagation();
  if(!main){st.picked=null;st.history={flat:true};bump();refresh(true);return;}
  const b=canvas.getBoundingClientRect(),ndc=new THREE.Vector2((e.clientX-b.left)/b.width*2-1,-((e.clientY-b.top)/b.height*2-1));
  ray.setFromCamera(ndc,main.camera);ray.camera=main.camera;
  const hit=ray.intersectObject(main.scene,true).find(h=>h.object!==lines&&shown(h.object)&&!(h.object.material?.side===THREE.BackSide&&h.distance>50));
  st.picked=hit?.object||null;st.instance=hit?.instanceId??null;st.history=hit?history(hit.object,hit.instanceId):{none:true};bump();refresh(true);
 }
 const snapshot=(o,i)=>{const m=Array.isArray(o.material)?o.material[0]:o.material,p=new THREE.Vector3(),s=new THREE.Vector3();
  if(o.isInstancedMesh&&i!=null){const mm=new THREE.Matrix4();o.getMatrixAt(i,mm);mm.premultiply(o.matrixWorld);mm.decompose(p,new THREE.Quaternion(),s);}else{o.updateWorldMatrix(true,false);o.matrixWorld.decompose(p,new THREE.Quaternion(),s);}
  const ic=o.isInstancedMesh&&i!=null&&o.instanceColor?(()=>{const cc=new THREE.Color();o.getColorAt(i,cc);return hex(cc);})():null;
  return{pos:vec(p),scale:vec(s),visible:shown(o),color:ic||(m?.color?hex(m.color):'–'),opacity:m&&m.opacity!=null?f2(m.opacity):'–',drive:o.userData?.inspect?safe(()=>o.userData.inspect(t0)):null};};
 let t0=0;const safe=f=>{try{return f();}catch{return null;}};
 function history(o,i){const t=st.frame.t??current(),out=[];inTech=true;
  for(const dt of[-.5,0,.5]){t0=Math.max(0,t+dt);filmRender(t0);out.push(snapshot(o,i));}t0=t;filmRender(t);inTech=false;return{list:out};}
 // ---- panel content
 let lastPerf=0;
 function refresh(force){
  if(!st.open)return;const now=performance.now();
  for(const b of el.querySelectorAll('[data-view]'))b.setAttribute('aria-pressed',String(b.dataset.view===st.view));
  for(const s of el.querySelectorAll('[data-m]'))el.querySelector(`[data-o="${s.dataset.m}"]`).textContent=`×${(+s.value).toFixed(2)}`;
  const fogRow=q('[data-m="fog"]').closest('.tp-row'),fogOk=fogAvailable();fogRow.classList.toggle('na',!fogOk);q('[data-m="fog"]').disabled=!fogOk;fogRow.title=fogOk?'':T('na');
  if(force||!playing()||now-lastPerf>250){lastPerf=now;const f=st.frame,m=r.info.memory,run=playing();
   q('.tp-perf').innerHTML=[[T('fps'),run?String(st.stamps.length):T('paused')],[T('frameMs'),`${f.ms.toFixed(1)} ms`],[T('calls'),f.calls],[T('tris'),f.tris.toLocaleString('de-CH')],[T('lines'),f.lines.toLocaleString('de-CH')],
    [T('geos'),m.geometries],[T('texs'),m.textures],[T('progs'),r.info.programs?.length??'–'],[T('res'),`${r.domElement.width} × ${r.domElement.height}${f.main?'':' · '+T('flat')}`]].map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('');}
  if(force)q('.tp-inspect').innerHTML=inspectHTML();
 }
 function inspectHTML(){
  if(!st.inspect)return'';const h=st.history,o=st.picked;
  if(!h)return`<p class="tp-hint">${T(st.frame.main?'inspectNone':'inspect2D')}</p>`;if(h.flat)return`<p class="tp-hint">${T('inspect2D')}</p>`;if(h.none||!o)return`<p class="tp-hint">${T('noHit')}</p>`;
  const m=Array.isArray(o.material)?o.material[0]:o.material,g=o.geometry,tris=g?(g.index?g.index.count:g.attributes.position?.count||0)/3:0;
  const path=[];for(let p=o.parent;p&&!p.isScene;p=p.parent)if(p.name)path.unshift(p.name);
  const nm=o.name||`${o.type}${g?` · ${g.type.replace('Geometry','')}`:''}`;
  const tex=m?.map?.image,texTxt=tex?(tex instanceof HTMLCanvasElement?T('canvasTex',{w:tex.width,h:tex.height}):`${tex.width||'?'}×${tex.height||'?'}`):null;
  const rows=[[T('name'),`<b>${esc(nm)}</b>${path.length?`<br><small>${esc(path.join(' › '))}</small>`:''}`],[T('type'),`${o.type}${o.isInstancedMesh&&st.instance!=null?` · ${T('instance',{i:st.instance,n:o.count})}`:''}`],
   g&&[T('geometry'),`${g.type} · ${Math.round(tris*(o.isInstancedMesh&&st.instance==null?o.count:1)).toLocaleString('de-CH')} ${T('triangles')}`],m&&[T('material'),`${m.type}${m.transparent?' · transparent':''}${m.wireframe?' · wireframe':''}`],
   m?.emissive&&[T('emissive'),`<i class="sw" style="background:${hex(m.emissive)}"></i>${hex(m.emissive)}`],texTxt&&[T('texture'),esc(texTxt)]].filter(Boolean);
  const L=h.list,keys=[['pos',T('position')],['scale',T('scale')],['color',T('color')],['opacity',T('opacity')],['visible',T('visible')]];
  const tline=keys.map(([k,label])=>{const v=L.map(x=>k==='visible'?(x[k]?T('yes'):T('no')):x[k]),ch=new Set(v).size>1;return`<tr class="${ch?'ch':''}"><th>${label}</th>${v.map((x,i)=>`<td${i===1?' class="now"':''}>${k==='color'&&x!=='–'?`<i class="sw" style="background:${x}"></i>`:''}${esc(x)}</td>`).join('')}</tr>`;}).join('');
  const drive=L[1].drive;
  return`<dl class="tp-obj">${rows.map(([k,v])=>`<dt>${k}</dt><dd>${v}</dd>`).join('')}</dl>
   <h5>${T('time')} <small>${T('timeHint')}</small></h5><table class="tp-time">${tline}</table>
   <h5>${T('driven')}</h5>${drive?`<dl class="tp-drive">${Object.entries(drive).map(([k,v])=>`<dt><code>${esc(k)}</code></dt><dd>${esc(typeof v==='number'?(+v.toFixed(3)).toString():v)}</dd>`).join('')}</dl>`:`<p class="tp-hint">${T('noDrive')}</p>`}`;
 }
 function setOpen(on){st.open=on;el.hidden=!on;if(!on&&st.inspect){st.inspect=false;q('[data-inspect]').checked=false;st.picked=null;st.history=null;document.body.classList.remove('tech-inspect');bump();}if(on)applyLang();}
 window.addEventListener('pointerdown',e=>{if(st.inspect&&e.target.closest?.('#film'))pick(e);},true);
 window.addEventListener('click',e=>{if(st.inspect&&e.target.closest?.('#film')){e.preventDefault();e.stopPropagation();}},true);
 return{el,setOpen,toggle:()=>setOpen(!st.open),get open(){return st.open;},get rev(){return st.rev;},applyLang,state:st};
}
