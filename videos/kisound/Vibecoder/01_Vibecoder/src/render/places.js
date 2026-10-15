import * as THREE from 'three';
import {PALETTE,SHOT} from './config.js';
import {clamp,ease,lerp,smooth} from './timeline.js';
import {placeAt} from './model.js';

const V=(x,y,z)=>new THREE.Vector3(x,y,z);
const mat=(color,roughness=.82,metalness=.04)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const glow=color=>new THREE.MeshBasicMaterial({color,toneMapped:false});
function mesh(parent,geometry,material,x=0,y=0,z=0){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);parent.add(o);return o;}
function box(parent,size,pos,material){return mesh(parent,new THREE.BoxGeometry(...size),material,...pos);}
function cyl(parent,r1,r2,h,pos,material,sides=16){return mesh(parent,new THREE.CylinderGeometry(r1,r2,h,sides),material,...pos);}
function sphere(parent,r,pos,material){return mesh(parent,new THREE.SphereGeometry(r,16,12),material,...pos);}
function path(parent,points,color=PALETTE.orange,r=.018){return mesh(parent,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map(p=>V(...p))),Math.max(24,points.length*10),r,7,false),glow(color));}
function limb(parent,a,b,r0,r1,material){
 const o=mesh(parent,new THREE.CylinderGeometry(r0,r1,1,12),material);placeLimb(o,a,b);return o;
}
function placeLimb(o,a,b){const from=V(...a),to=V(...b),delta=to.sub(from);o.position.copy(from.addScaledVector(delta,.5));o.scale.y=delta.length();o.quaternion.setFromUnitVectors(V(0,1,0),delta.normalize());}
function fabricHood(parent,cloth,shadow,trim){
 // The back tapers to a closed crown; the only opening faces the laptop.
 const rings=[{z:.43,c:1.69,x:.012,y:.016},{z:.37,c:1.69,x:.16,y:.19},{z:.29,c:1.69,x:.22,y:.23},{z:.17,c:1.75,x:.29,y:.34},{z:-.05,c:1.77,x:.32,y:.36},{z:-.23,c:1.75,x:.29,y:.32},{z:-.31,c:1.73,x:.25,y:.28}];
 const vertices=[],indices=[],N=24;
 for(const r of rings)for(let i=0;i<N;i++){const a=i*2*Math.PI/N;vertices.push(Math.cos(a)*r.x,r.c+Math.sin(a)*r.y,r.z);}
 for(let j=0;j<rings.length-1;j++)for(let i=0;i<N;i++){const a=j*N+i,b=j*N+(i+1)%N,c=(j+1)*N+i,d=(j+1)*N+(i+1)%N;indices.push(a,c,b,b,c,d);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();mesh(parent,geo,cloth);
 const back=mesh(parent,new THREE.CircleGeometry(1,16),cloth,0,1.69,.432);back.scale.set(.013,.017,1);
 const opening=new THREE.Shape();opening.moveTo(0,-.22);
 opening.bezierCurveTo(-.14,-.19,-.23,-.02,-.22,.09);
 opening.bezierCurveTo(-.20,.23,-.09,.275,0,.28);
 opening.bezierCurveTo(.10,.275,.21,.22,.22,.09);
 opening.bezierCurveTo(.23,-.02,.14,-.19,0,-.22);
 // Seal the entire front seam: the outer shell ends on an ellipse, while the
 // recessed opening follows the sewn hood shape. A cloth annulus joins them.
 const outline=opening.getPoints(48),seam=[],seamIndex=[];
 for(let i=0;i<outline.length;i++){
  const angle=-Math.PI/2-i*2*Math.PI/(outline.length-1),point=outline[i];
  seam.push(Math.cos(angle)*.25,1.73+Math.sin(angle)*.28,-.31,
   point.x,1.73+point.y,-.327);
 }
 for(let i=0;i<outline.length-1;i++){
  const a=i*2,b=a+2;seamIndex.push(a,a+1,b,b,a+1,b+1);
 }
 const seamGeo=new THREE.BufferGeometry();seamGeo.setAttribute('position',new THREE.Float32BufferAttribute(seam,3));
 seamGeo.setIndex(seamIndex);seamGeo.computeVertexNormals();
 const seamCloth=cloth.clone();seamCloth.side=THREE.DoubleSide;
 const sealedRim=mesh(parent,seamGeo,seamCloth);sealedRim.name='Geschlossener Kapuzenrand';
 // Several matte folds recede into a smaller, unlit surface. The near edge
 // stays open, so an oblique camera sees the wall and its parallax, not a disc.
 const wall=[],wallColors=[],wallIndex=[];
 const depth=[{z:-.327,x:1,y:1,color:0x0d252b},{z:-.20,x:.89,y:.94,color:0x07151a},
  {z:-.045,x:.75,y:.84,color:0x030b0e},{z:.085,x:.62,y:.72,color:0x010406}];
 for(const fold of depth){const color=new THREE.Color(fold.color);
  for(const point of outline){wall.push(point.x*fold.x,1.73+point.y*fold.y,fold.z);wallColors.push(color.r,color.g,color.b);}
 }
 for(let j=0;j<depth.length-1;j++)for(let i=0;i<outline.length-1;i++){
  const a=j*outline.length+i,b=a+1,c=(j+1)*outline.length+i,d=c+1;wallIndex.push(a,c,b,b,c,d);
 }
 const wallGeo=new THREE.BufferGeometry();wallGeo.setAttribute('position',new THREE.Float32BufferAttribute(wall,3));
 wallGeo.setAttribute('color',new THREE.Float32BufferAttribute(wallColors,3));wallGeo.setIndex(wallIndex);wallGeo.computeVertexNormals();
 mesh(parent,wallGeo,new THREE.MeshBasicMaterial({vertexColors:true,side:THREE.DoubleSide,toneMapped:false,fog:false}));
 // A matte baffle prevents the lit collar or scenery from showing through
 // the recess, while the visible inner folds retain their depth and parallax.
 const baffle=mesh(parent,new THREE.ShapeGeometry(opening,24),shadow,0,1.73,-.11);
 baffle.scale.set(.83,.89,1);baffle.name='Schwarze Kapuzenblende';
 const throat=new THREE.Shape();throat.moveTo(-.17,-.13);
 throat.quadraticCurveTo(0,-.19,.17,-.13);
 throat.quadraticCurveTo(.13,-.22,0,-.23);
 throat.quadraticCurveTo(-.13,-.22,-.17,-.13);
 mesh(parent,new THREE.ShapeGeometry(throat,16),shadow,0,1.73,-.30).name='Abgedunkelter Kapuzenansatz';
 const darkness=mesh(parent,new THREE.ShapeGeometry(opening,24),shadow,0,1.73,.086);darkness.scale.set(.62,.72,1);
 darkness.name='Unbeleuchtete Vertiefung der Kapuze';
 const rim=outline.map(p=>[p.x,1.73+p.y,-.333]);
 path(parent,rim,0x102831,.012).material=trim;
 path(parent,[[-.19,1.99,-.30],[-.07,2.085,-.12],[.03,2.09,.05]],0x314650,.006);
 // The lower cowl and folds connect the hood to the shoulders.
 const cowl=mesh(parent,new THREE.CylinderGeometry(.27,.39,.30,16,1,true),trim,0,1.48,.25);cowl.scale.z=.76;
 for(const s of[-1,1]){path(parent,[[s*.21,1.53,-.27],[s*.17,1.29,-.30],[s*.16,1.12,-.28]],0x102831,.010);}
}
function label(parent,title,{w=1.45,h=.28,color='#F4F3EA',bg='#13202A',size=43}={}){
 const canvas=document.createElement('canvas');canvas.width=768;canvas.height=160;const g=canvas.getContext('2d');g.fillStyle=bg;g.fillRect(0,0,768,160);g.fillStyle=color;g.font=`700 ${size}px monospace`;g.textAlign='center';g.fillText(title,384,102);
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
 return mesh(parent,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide,toneMapped:false}));
}
const M={
 asphalt:mat(0x303c43),stone:mat(0x7b827c),cream:mat(0xe1c6a2),wood:mat(0x725238),darkWood:mat(0x3c302d),
 steel:mat(0x26323d,.45,.56),glass:new THREE.MeshStandardMaterial({color:0x82b9c1,transparent:true,opacity:.23,roughness:.08,metalness:.22,depthWrite:false}),
 grass:mat(0x425b46),leaf:mat(0x426951),pine:mat(0x264d43),bark:mat(0x554435),snow:mat(0xc5d4d0),
 orange:glow(PALETTE.orange),cyan:glow(PALETTE.cyan),pale:glow(0xdbece1),night:mat(0x191e2a),red:glow(PALETTE.red)
};
function ground(group,color=M.asphalt){box(group,[32,.14,32],[0,-.08,-5],color);}
function tree(group,x,z,{pine=false,scale=1}={}){
 const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(scale);group.add(g);
 cyl(g,.12,.17,2,[0,1,0],M.bark,9);
 if(pine){for(let i=0;i<3;i++)cyl(g,0,.7-i*.11,1.35,[0,2.05+i*.47,0],M.pine,8);}
 else{for(const [dx,dy,dz,r] of [[0,2.7,0,.9],[-.48,2.38,.1,.66],[.43,2.48,-.15,.75]])sphere(g,r,[dx,dy,dz],M.leaf);}
 return g;
}
function ridge(group,z,color,base,height,offset=0){
 const pts=[[-16,base],[ -11,base+height*.55],[-8,base+height*.24],[-4,base+height],[-.3,base+height*.43],[4,base+height*.82],[8,base+height*.23],[12,base+height*.75],[16,base]];
 const vertices=[];for(let i=0;i<pts.length-1;i++){const [x1,y1]=pts[i],[x2,y2]=pts[i+1];vertices.push(x1+offset,base,z,x1+offset,y1,z,x2+offset,y2,z,x1+offset,base,z,x2+offset,y2,z,x2+offset,base,z);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();mesh(group,geometry,new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide,fog:true}));
}
function laptop(parent){
 const g=new THREE.Group();parent.add(g);
 box(g,[.96,.055,.61],[0,.02,.08],M.steel);
 box(g,[.84,.009,.37],[0,.054,.13],mat(0x56616c,.46,.38));
 for(let row=0;row<3;row++)for(let col=0;col<9;col++)box(g,[.075,.003,.055],[-.35+col*.087,.061,-.03+row*.085],M.night);
 box(g,[.2,.003,.10],[0,.062,.34],mat(0x7d8b90,.65,.28));
 const lid=new THREE.Group();lid.position.set(0,.07,-.27);lid.rotation.x=-.13;g.add(lid);
 box(lid,[.98,.59,.035],[0,.28,-.016],M.steel);
 box(lid,[.90,.51,.007],[0,.28,.006],M.night);
 const face=mesh(lid,new THREE.PlaneGeometry(.86,.485),glow(0x203946),0,.28,.012);
 sphere(lid,.012,[0,.55,.018],M.cyan);
 return{group:g,face};
}
function traveler(group){
 const p=new THREE.Group();group.add(p);
 const hoodie=mat(0x304c53,.97),hood=mat(0x233941,.98),skin=mat(0xb7896d,.92),pants=mat(0x273643),trim=mat(0x0b1a20,.96);
 const torso=mesh(p,new THREE.CylinderGeometry(.35,.31,.81,16,1),hoodie,0,1.16,.08);torso.scale.z=.78;
 const hem=cyl(p,.315,.315,.075,[0,.77,.08],hood,16);hem.scale.z=.80;
 fabricHood(p,hood,new THREE.MeshBasicMaterial({color:0x010306,side:THREE.DoubleSide,toneMapped:false,fog:false}),trim);
 // Folds, drawstrings and a kangaroo pocket read as sweatshirt fabric from behind or front.
 for(const x of[-.12,.12]){path(p,[[x,1.47,-.25],[x*.92,1.27,-.28],[x*.86,1.17,-.28]],0xa8a398,.008);cyl(p,.015,.015,.025,[x*.86,1.15,-.28],trim,8);}
 box(p,[.43,.22,.024],[0,.95,-.191],hood);
 for(const x of[-.23,.23])path(p,[[x,.96,-.21],[x*.70,.85,-.21]],0x10262e,.007);
 for(const x of[-.29,.29])path(p,[[x,1.42,.16],[x*.9,1.20,.29],[x*.76,.99,.31]],0x38515a,.007);
 const standing=new THREE.Group(),seated=new THREE.Group();p.add(standing,seated);
 for(const side of[-1,1]){
  box(standing,[.20,.72,.22],[side*.15,.43,.04],pants);
  box(standing,[.25,.13,.43],[side*.15,.07,-.10],M.cream);
  const thigh=box(seated,[.20,.21,.55],[side*.16,.67,-.31],pants);thigh.rotation.x=-.05;
  box(seated,[.19,.59,.20],[side*.16,.36,-.58],pants);
  box(seated,[.26,.12,.42],[side*.16,.065,-.72],M.cream);
 }
 const arms=[];
 for(const side of[-1,1]){
  const upper=limb(p,[side*.33,1.39,-.06],[side*.43,1.15,-.40],.105,.095,hoodie);
  const forearm=limb(p,[side*.43,1.15,-.40],[side*.23,1.02,-.78],.085,.074,hoodie);
  const cuff=limb(p,[side*.23,1.02,-.78],[side*.22,1.01,-.83],.087,.083,hood);
  const hand=new THREE.Group();p.add(hand);
  const palm=box(hand,[.145,.048,.145],[0,0,-.028],skin);palm.rotation.x=-.08;
  const fingers=[];
  for(let i=0;i<4;i++){const finger=mesh(hand,new THREE.CapsuleGeometry(.014,.095,3,6),skin,(i-1.5)*.032,-.006,-.134);finger.rotation.x=Math.PI/2;fingers.push(finger);}
  const thumb=mesh(hand,new THREE.CapsuleGeometry(.016,.050,3,6),skin,side*.086,-.004,-.016);thumb.rotation.z=side*.48;thumb.rotation.x=Math.PI/2;
  arms.push({side,upper,forearm,cuff,hand,fingers});
 }
 const bag=box(p,[.50,.58,.17],[0,1.13,.38],mat(0x29363e));bag.rotation.x=-.13;
 for(const x of[-.21,.21])box(p,[.035,.62,.04],[x,1.21,.22],mat(0x5b6b6b));
 const device=laptop(p);device.group.position.set(0,.96,-1.05);
 const poseHands=(t=0,drive=.8,cheer=0)=>{for(const arm of arms){
  const {side,upper,forearm,cuff,hand,fingers}=arm,shoulder=[side*.335,1.38,-.04],keyboard=device.group.position;
  const armCheer=clamp(Array.isArray(cheer)?cheer[side<0?0:1]:cheer);
  const beat=Math.pow(Math.max(0,Math.sin(t*20.5+side*1.45)),4),lift=.043*drive*(1-beat);
  const spread=side*.018*Math.sin(t*4.7+side);
  const mix=(a,b)=>a.map((v,i)=>lerp(v,b[i],armCheer));
  const wrist=mix([side*.235+spread,keyboard.y+.095+lift,keyboard.z+.285],[side*.65,1.99,-.20]);
  const elbow=mix([side*.43,Math.max(1.04,keyboard.y+.18)+lift*.28,keyboard.z+.56],[side*.54,1.70,-.17]);
  const cuffEnd=mix([side*.235+spread,keyboard.y+.077+lift,keyboard.z+.22],[side*.68,2.055,-.21]);
  const palm=mix([side*.235+spread,keyboard.y+.082+lift,keyboard.z+.20],[side*.69,2.085+.045*Math.sin(t*8+side),-.22]);
  placeLimb(upper,shoulder,elbow);placeLimb(forearm,elbow,wrist);
  placeLimb(cuff,wrist,cuffEnd);hand.position.set(...palm);
  hand.rotation.x=lerp(-.055*beat,1.40,armCheer);
  hand.rotation.z=lerp(side*.025*Math.sin(t*6.2),side*.13*Math.sin(t*8),armCheer);
  fingers.forEach((finger,i)=>{const tap=Math.pow(Math.max(0,Math.sin(t*25.1+i*1.55+side*.81)),6);
   finger.position.y=-.006+.028*drive*(1-tap)*(1-armCheer);finger.rotation.x=Math.PI/2+.12*(1-tap)*(1-armCheer);});
 }};
 poseHands();
 return{group:p,standing,seated,laptop:device.group,face:device.face,backpack:bag,poseHands,arms};
}
function povTyping(laptopGroup){
 const cloth=mat(0x304c53,.97),skin=mat(0xb7896d,.92),cuffMat=mat(0x233941,.98),arms=[];
 for(const side of[-1,1]){
  const sleeve=limb(laptopGroup,[side*.48,-.22,.94],[side*.25,.10,.30],.085,.076,cloth);
  const cuff=limb(laptopGroup,[side*.25,.10,.30],[side*.23,.08,.23],.082,.078,cuffMat);
  const hand=new THREE.Group();laptopGroup.add(hand);
  box(hand,[.145,.047,.145],[0,0,-.025],skin);
  const fingers=[];
  for(let i=0;i<4;i++){const finger=mesh(hand,new THREE.CapsuleGeometry(.014,.095,3,6),skin,(i-1.5)*.032,-.006,-.131);finger.rotation.x=Math.PI/2;fingers.push(finger);}
  arms.push({side,sleeve,cuff,hand,fingers});
 }
 const pose=(t=0,drive=.8,cheer=[0,0])=>{for(const {side,sleeve,cuff,hand,fingers} of arms){
  const armCheer=clamp(cheer[side<0?0:1]);
  const beat=Math.pow(Math.max(0,Math.sin(t*20.5+side*1.45)),4),lift=.043*drive*(1-beat);
  const x=side*.235+side*.018*Math.sin(t*4.7+side);
  const elbow=[lerp(x,side*.60,armCheer),lerp(.10+lift,.33,armCheer),lerp(.30,.50,armCheer)];
  const wrist=[lerp(x,side*.66,armCheer),lerp(.08+lift,.72,armCheer),lerp(.23,.18,armCheer)];
  placeLimb(sleeve,[side*.48,-.22,.94],elbow);
  placeLimb(cuff,elbow,wrist);
  hand.position.set(wrist[0],wrist[1],wrist[2]-.03);hand.rotation.x=lerp(-.055*beat,1.40,armCheer);
  fingers.forEach((finger,i)=>{const tap=Math.pow(Math.max(0,Math.sin(t*25.1+i*1.55+side*.81)),6);
   finger.position.y=-.006+.028*drive*(1-tap)*(1-armCheer);finger.rotation.x=Math.PI/2+.12*(1-tap)*(1-armCheer);});
 }};
 pose();return{arms,pose};
}
function patron(group,x,z,color){
 const p=new THREE.Group();p.position.set(x,0,z);group.add(p);
 cyl(p,.22,.27,.68,[0,.83,0],mat(color),10);
 sphere(p,.20,[0,1.37,-.02],mat(0xa47a62));
 const hair=sphere(p,.205,[0,1.47,.015],mat(0x2d292b));hair.scale.y=.45;
 for(const dx of[-.14,.14])box(p,[.15,.48,.17],[dx,.27,.04],M.night);
 return p;
}
function passerby(parent,x,z,color,{pace=1,phase=0,cap=false}={}){
 const root=new THREE.Group();root.position.set(x,0,z);parent.add(root);
 const jacket=mat(color),face=mat(0xb88768),shoe=mat(0x1b252c);
 const body=cyl(root,.20,.23,.57,[0,1.02,0],jacket,11);body.rotation.x=.06;
 sphere(root,.15,[0,1.43,-.025],face);
 if(cap){const hat=sphere(root,.16,[0,1.55,-.018],M.night);hat.scale.y=.43;box(root,[.21,.024,.13],[0,1.51,-.17],M.night);}
 const legs=[],arms=[];
 for(const side of[-1,1]){
  const leg=new THREE.Group();root.add(leg);leg.position.set(side*.11,.75,0);
  box(leg,[.125,.64,.13],[0,-.32,0],M.night);box(leg,[.16,.085,.29],[0,-.63,-.075],shoe);legs.push(leg);
  const arm=new THREE.Group();root.add(arm);arm.position.set(side*.24,1.28,0);
  box(arm,[.12,.49,.12],[side*.015,-.24,0],jacket);box(arm,[.105,.09,.11],[side*.015,-.49,0],face);arms.push(arm);
 }
 return{root,legs,arms,baseX:x,baseZ:z,pace,phase};
}
function dog(parent){const g=new THREE.Group();parent.add(g);
 const fur=mat(0x9d7853),dark=mat(0x5b4436);
 const body=mesh(g,new THREE.CapsuleGeometry(.17,.29,5,10),fur,0,.38,0);body.rotation.z=Math.PI/2;
 sphere(g,.15,[.29,.44,-.02],fur);
 for(const x of[-.20,.21])for(const z of[-.10,.10])box(g,[.06,.34,.06],[x,.17,z],dark);
 const ear=mesh(g,new THREE.ConeGeometry(.09,.19,8),dark,.32,.59,-.13);ear.rotation.z=-.35;
 const tail=limb(g,[-.31,.46,0],[-.46,.62,0],.035,.025,fur);
 return g;
}
function cafeChair(group,x,z,angle=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;group.add(g);
 box(g,[.58,.075,.56],[0,.53,0],M.wood);box(g,[.59,.66,.09],[0,.86,.29],M.wood);
 for(const sx of[-.23,.23])for(const sz of[-.21,.21])box(g,[.055,.52,.055],[sx,.26,sz],M.darkWood);
 return g;}
function cafePlant(group,x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);group.add(g);
 cyl(g,.25,.18,.38,[0,.20,0],mat(0x8b6955),12);cyl(g,.05,.06,.76,[0,.75,0],M.bark,8);
 for(let i=0;i<7;i++){const a=i*2.4,leaf=sphere(g,.28,[Math.cos(a)*.29,.77+i%3*.18,Math.sin(a)*.26],M.leaf);leaf.scale.set(1.45,.53,.72);leaf.rotation.y=a;}
 return g;}
function cafe(){const g=new THREE.Group();g.name='Café mit umlaufendem Innenraum';
 const blue=mat(0x5d7480),warm=mat(0xd6c9ac),tile=mat(0x9d988a),dark=mat(0x20252a),brass=mat(0xb59b6b,.56,.35),leather=mat(0x333e43);
 ground(g,tile);
 // Four complete walls, a ceiling and interior panels keep every orbit inside the shop.
 box(g,[14,.20,11.2],[0,4.05,.65],warm).name='Cafédecke';
 box(g,[14,4,.20],[0,2,-4.7],M.darkWood).name='Caféfront';
 box(g,[14,4,.20],[0,2,6.25],blue).name='Caférückwand';
 box(g,[.20,4,11.2],[-6.9,2,.75],M.darkWood).name='Cafélinkswand';
 box(g,[.20,4,11.2],[6.9,2,.75],warm).name='Caférechtswand';
 box(g,[13.8,1.10,.055],[0,.55,6.10],warm);box(g,[13.8,.09,.09],[0,1.15,6.03],M.wood);
 box(g,[13.8,.17,.10],[0,3.65,6.10],M.darkWood);
 // Street-facing glazing and side windows, framed rather than floating panels.
 for(let i=-2;i<=2;i++){const x=i*2.25;
  box(g,[2.02,2.45,.035],[x,2.10,-4.58],glow(i%2?0xa9cad0:0xb9d6d7));
  box(g,[2.16,.075,.11],[x,3.38,-4.48],dark);box(g,[.065,2.50,.11],[x-1.09,2.10,-4.48],dark);
  box(g,[2.12,.08,.12],[x,2.0,-4.47],dark);
 }
 for(const z of[-2.1,.35,2.8]){box(g,[.035,2.10,2.1],[6.77,2.18,z],glow(0xc3dcdf));
  box(g,[.08,2.25,.075],[6.72,2.16,z-1.08],dark);box(g,[.08,.075,2.22],[6.72,1.98,z],dark);}
 // Counter, espresso station, display case and three readable menu boards.
 box(g,[5.0,1.16,.92],[3.60,.57,-1.20],M.darkWood);box(g,[5.20,.14,1.20],[3.60,1.20,-1.20],M.wood);
 for(let i=0;i<5;i++)box(g,[.07,.85,.04],[1.45+i*.98,.53,-.69],brass);
 box(g,[1.7,.88,.73],[4.65,1.70,-2.65],dark);box(g,[1.55,.52,.05],[4.65,1.83,-2.26],M.steel);
 for(const x of[4.14,5.13]){cyl(g,.13,.13,.12,[x,2.25,-2.24],M.steel);cyl(g,.04,.04,.27,[x,2.03,-1.98],brass);}
 box(g,[2.0,.90,.81],[1.72,1.62,-2.78],M.darkWood);box(g,[1.78,.61,.04],[1.72,1.68,-2.34],M.glass);
 for(const x of[1.23,1.70,2.15]){sphere(g,.16,[x,1.45,-2.65],mat(0xb88758));cyl(g,.11,.11,.25,[x,1.38,-2.45],M.cream);}
 for(const [x,name] of [[1.72,'ESPRESSO'],[3.66,'FILTER'],[5.55,'PASTRY']]){
  const menu=label(g,name,{w:1.7,h:.39,bg:'#17252b',color:'#f5dfb9',size:35});menu.position.set(x,2.64,-4.43);
  box(g,[1.83,.055,.07],[x,2.89,-4.44],brass);
 }
 const sign=label(g,'CAFÉ  /  MORGEN',{w:3.1,h:.48,bg:'#344b4c',color:'#f7e6c8'});sign.position.set(-3.05,3.12,-4.43);
 box(g,[3.85,.22,.12],[-3.05,3.50,-4.44],M.wood);
 // The reference's rear seating wall: framed art, timber wainscot and a long banquette.
 for(const [x,color,name] of [[-4.35,0x87745f,'BEANS  /  ORIGIN'],[-1.70,0x5f766c,'FRESH  /  DAILY'],[1.40,0x9d665a,'COFFEE  /  IDEAS'],[4.48,0x627985,'MAKE  /  REST']]){
  box(g,[2.30,1.50,.065],[x,2.44,6.02],M.darkWood);
  box(g,[2.12,1.32,.012],[x,2.44,5.975],mat(color));
  const art=label(g,name,{w:1.91,h:.28,bg:'#25343b',color:'#f4e7d0',size:30});art.position.set(x,2.33,5.96);art.rotation.y=Math.PI;
 }
 // The side that faces the front camera is furnished too: art, coffee tins,
 // ceramics and timber shelving replace the former empty dark backdrop.
 for(const [z,color,name] of[[-2.35,0x667e7d,'ROAST  /  DAILY'],[.45,0x986d59,'TAKE  A  BREAK'],[3.25,0x6f8367,'COFFEE  /  CREATE']]){
  box(g,[.09,1.48,2.22],[-6.75,2.49,z],M.darkWood);box(g,[.014,1.28,2.03],[-6.69,2.49,z],mat(color));
  const art=label(g,name,{w:1.84,h:.30,bg:'#24333b',color:'#f4e7d0',size:31});art.position.set(-6.675,2.42,z);art.rotation.y=Math.PI/2;
 }
 for(const z of[-2.1,.65,3.35]){
  box(g,[.47,.075,2.05],[-6.47,1.36,z],M.wood);
  for(let i=0;i<4;i++){const zz=z-.70+i*.46;
   cyl(g,.105,.10,.22,[-6.41,1.51,zz],i%2?M.cream:mat(0x496168),10);
   box(g,[.08,.25,.08],[-6.34,1.80,zz],brass);
  }
 }
 box(g,[8.0,.49,.70],[-1.18,.53,5.42],leather);box(g,[8.0,.78,.22],[-1.18,1.12,5.83],leather);
 for(const x of[-4.15,-2.15,-.15,1.85])box(g,[.055,.83,.28],[x,1.12,5.72],M.steel);
 // More tables stay outside the central camera orbit but fill its backgrounds.
 for(const [x,z] of[[-4.75,-1.7],[-4.65,3.55],[4.55,3.8]]){
  box(g,[1.30,.075,.82],[x,.93,z],M.darkWood);box(g,[.09,.88,.09],[x,.46,z],M.steel);
  cafeChair(g,x-.72,z+.02,-Math.PI/2);cafeChair(g,x+.72,z+.02,Math.PI/2);
 }
 box(g,[2.6,.075,1.10],[3.15,.92,4.73],M.wood);
 for(const x of[2.1,4.2]){box(g,[.08,.87,.08],[x,.45,4.73],M.steel);cafeChair(g,x,3.75,Math.PI);}
 // The traveler's table and chair retain their precise keyboard alignment.
 cyl(g,.86,.86,.085,[-.7,.93,.4],M.wood,24);cyl(g,.055,.055,.92,[-.7,.46,.4],M.steel);cyl(g,.40,.40,.06,[-.7,.03,.4],M.steel);
 box(g,[.82,.10,.75],[-.7,.58,1.56],M.darkWood);box(g,[.82,.64,.10],[-.7,.94,1.92],M.wood);
 for(const x of[-1.02,-.38])for(const z of[1.25,1.86])box(g,[.055,.58,.055],[x,.29,z],M.steel);
 cyl(g,.14,.12,.24,[-1.34,1.08,.57],M.cream);cyl(g,.125,.125,.005,[-1.34,1.205,.57],M.darkWood);
 const cupHandle=mesh(g,new THREE.TorusGeometry(.09,.02,6,16,Math.PI*1.6),M.cream,-1.17,1.07,.57);cupHandle.rotation.y=Math.PI/2;
 // Ceiling track lights, soffit and pendants complete the room above the orbit.
 for(const z of[-2.85,1.1,4.75]){box(g,[12.7,.10,.10],[0,3.82,z],dark);
  for(const x of[-5.15,-2.5,.1,2.75,5.3]){cyl(g,.075,.09,.24,[x,3.65,z],dark,10);sphere(g,.075,[x,3.51,z],glow(0xffe4b9));}}
 for(const x of[-3.3,.1,3.7]){cyl(g,.018,.018,.60,[x,3.47,-.58],dark,8);
  mesh(g,new THREE.ConeGeometry(.33,.24,18),dark,x,3.12,-.58).rotation.x=Math.PI;
  sphere(g,.13,[x,2.99,-.58],glow(0xffd39d));}
 for(const [x,z,s] of[[-5.95,4.75,1.1],[5.95,4.8,1.0],[-5.9,-3.5,.80]])cafePlant(g,x,z,s);
 patron(g,-4.75,3.75,0x914b4f);patron(g,4.70,3.82,0x456c65);
 const queue=[passerby(g,2.0,-2.10,0x6a7580,{pace:.28,phase:.5}),passerby(g,3.0,-2.6,0x8c6262,{pace:.25,phase:1.8}),passerby(g,-5.15,-2.9,0x628379,{pace:.34,phase:2.2})];
 const exit=label(g,'AUSGANG  ↗',{w:1.55,h:.3,color:'#f4f3ea',bg:'#1e3439',size:41});exit.position.set(-5.55,2.44,-4.43);
 g.userData.queue=queue;return g;}
function park(){const g=new THREE.Group();weatherSky(g,'park');ground(g,M.grass);
 box(g,[4,.018,18],[.15,.02,-4.4],mat(0x9a9c86));
 for(const [x,z,s] of [[-5,0,1.3],[-4.7,-4,1.1],[-5.3,-8,1.5],[4.5,-.8,1.25],[5.2,-5,1.4],[3.7,-8,1]])tree(g,x,z,{scale:s});
 const bench=new THREE.Group();g.add(bench);bench.position.set(-2.0,0,-.55);
 for(let i=0;i<3;i++)box(bench,[2.2,.08,.17],[0,.61,-.21+i*.22],M.wood);
 for(const y of[.77,.96,1.15])box(bench,[2.2,.12,.08],[0,y,.50],M.wood);
 for(const x of[-.88,.88])box(bench,[.09,.61,.08],[x,.30,.12],M.steel);
 for(const [x,z] of[[-3.6,1.3],[2.7,-1.4],[3.1,-5.1]]){
  sphere(g,.29,[x,.30,z],mat(0x4a744c));sphere(g,.23,[x+.27,.25,z-.10],M.leaf);
 }
 for(const [x,z] of [[-2.8,-3.6],[3,-2],[2.8,-5.8]]){cyl(g,.08,.08,.9,[x,.45,z],M.steel);sphere(g,.16,[x,.95,z],M.cream);}
 // The park has several simultaneous stories behind the laptop, all at ordinary walking/running speed.
 const people=[
  passerby(g,.65,-2.6,0xd45c43,{pace:2.3,phase:0,cap:true}),
  passerby(g,1.28,-5.2,0x4b83a3,{pace:2.6,phase:1.3,cap:true}),
  passerby(g,.65,-8.0,0xd2aa55,{pace:2.0,phase:2.1}),
  passerby(g,3.15,-3.4,0x776fa0,{pace:1.2,phase:.8}),
  passerby(g,-3.75,-4.7,0x8c775e,{pace:.9,phase:1.7}),
  passerby(g,3.55,-7.2,0x8fa274,{pace:1.1,phase:2.8}),
  passerby(g,-3.5,-7.4,0x7c91a7,{pace:1.0,phase:3.6})
 ];
 const dogs=[dog(people[3].root),dog(people[4].root)];dogs[0].position.set(.60,0,-.18);dogs[1].position.set(-.6,0,-.12);
 for(const [i,x] of [[3,.6],[4,-.6]])path(people[i].root,[[0,1.02,-.08],[x*.5,.72,-.14],[x,.47,-.17]],0xb7b2a3,.006);
 // Two players exchange a bright disc on the grass; the third person runs across the far path.
 people[5].root.rotation.y=-.7;people[6].root.rotation.y=.6;
 const frisbee=mesh(g,new THREE.CylinderGeometry(.14,.14,.018,20),M.orange,0,1.55,-7.25);
 for(const [x,z] of[[-4.4,-2.1],[4.8,-3.8],[-4.2,-7.1],[4.7,-7.6]]){
  for(let i=0;i<5;i++){const dx=Math.sin(i*3.7)*.4,dz=Math.cos(i*2.8)*.35;sphere(g,.12,[x+dx,.12,z+dz],i%2?M.leaf:M.pine);}
 }
 ridge(g,-12,0x607b6b,-.1,1.6);g.userData.people=people;g.userData.frisbee=frisbee;return g;}
function forest(){const g=new THREE.Group();weatherSky(g,'storm');ground(g,mat(0x263c36));
 box(g,[3.1,.019,22],[0,.01,-5.2],mat(0x6a6654));
 for(let i=0;i<23;i++){const x=(i%2?1:-1)*(6.1+(i*7%5)*.65),z=3.5-i*.61;tree(g,x,z,{pine:true,scale:.68+(i%5)*.16});}
 // Trees beyond the starting stool fill the reverse angle without entering
 // the moving camera's path between the stool and the mountain.
 for(let i=0;i<12;i++){const x=(i%2?1:-1)*(2.1+(i%5)*.62),z=5.4+Math.floor(i/2)*.90;
  tree(g,x,z,{pine:true,scale:.58+(i%4)*.10});}
 for(const [x,z] of [[-2.3,1.4],[1.9,-1.6],[-2.2,-4.5]]){const rock=sphere(g,.33,[x,.20,z],M.stone);rock.scale.set(1.5,.65,.8);}
 // A low camping stool places the laptop naturally on the traveler's knees.
 for(const x of[-1.05,-.25])for(const z of[.55,1.15])box(g,[.06,.58,.06],[x,.29,z],M.steel);
 box(g,[.94,.075,.70],[-.65,.60,.85],mat(0x44565a));
 for(let i=0;i<15;i++){const x=(i%2?-1:1)*(1.65+i%3*.55),z=3.2-i*.75;
  sphere(g,.19,[x,.18,z],i%3?M.leaf:M.pine);
 }
 // One continuous alpine forest opens onto a high mountain lookout in the same set.
 box(g,[9,.11,4.3],[0,.07,-8.5],M.stone);
 for(let x=-4.5;x<=4.5;x+=.9)box(g,[.055,1.18,.065],[x,.62,-10.45],M.steel);
 box(g,[9.4,.06,.075],[0,1.18,-10.45],M.steel);
 ridge(g,-28,0x8799a2,-1.2,7.2);ridge(g,-25,0x617885,-1.2,5.5,1.2);ridge(g,-22,0x3c5a69,-1.2,3.7,-.4);
 for(const [x,z,w] of[[-2.2,-8.1,1.0],[2.7,-8.7,1.4],[-.1,-9.2,.85]]){
  const puddle=mesh(g,new THREE.CircleGeometry(w,24),mat(0x48616b,.24,.12),x,.134,z);puddle.rotation.x=-Math.PI/2;puddle.scale.y=.40;
 }
 const bolt=new THREE.Group();g.add(bolt);bolt.name='Blitz über dem Berg';
 path(bolt,[[3.5,5.5,-20],[2.8,4.8,-20],[3.2,4.55,-20],[2.4,3.75,-20],[2.8,3.55,-20],[1.6,2.4,-20]],0xe5f5ff,.064);
 path(bolt,[[2.4,3.75,-20],[3.6,3.35,-20],[3.0,2.65,-20]],0x8fd7ff,.030);
 bolt.traverse(o=>{if(o.material)o.material.fog=false;});bolt.visible=false;
 g.userData.outlook=V(.4,1.6,-8.4);g.userData.bolt=bolt;g.userData.rain=rainField(g);return g;}
function wheel(g,x,y,z,r){const wheel=new THREE.Group();wheel.position.set(x,y,z);g.add(wheel);
 const ring=mesh(wheel,new THREE.TorusGeometry(r,.05,7,64),M.cyan);ring.rotation.z=.04;
 for(let i=0;i<12;i++){const a=i*Math.PI/6;path(wheel,[[0,0,0],[Math.sin(a)*r,Math.cos(a)*r,0]],i%2?0xff6534:0x44dde5,.014);sphere(wheel,.13,[Math.sin(a)*r,Math.cos(a)*r,.03],M.orange);}
 for(const dx of[-1,1])path(g,[[x,y,z],[x+dx*r*.66,0,z]],0x657486,.055);
 return wheel;}
let cachedNightSky;
function nightSky(group){
 if(!cachedNightSky){
  const c=document.createElement('canvas');c.width=1024;c.height=512;const ctx=c.getContext('2d');
  const sky=ctx.createLinearGradient(0,0,0,512);sky.addColorStop(0,'#050916');sky.addColorStop(.55,'#0c1930');sky.addColorStop(1,'#27324a');ctx.fillStyle=sky;ctx.fillRect(0,0,1024,512);
  let seed=1819;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  for(let i=0;i<680;i++){
   const x=random()*1024,y=12+random()*340,r=.3+random()*1.4;
   ctx.fillStyle=`rgba(${i%7?219:255},${i%7?231:211},255,${.35+random()*.6})`;
   ctx.beginPath();ctx.arc(x,y,r,0,2*Math.PI);ctx.fill();
   if(i%33===0){ctx.strokeStyle='rgba(184,221,255,.26)';ctx.beginPath();ctx.moveTo(x-3,y);ctx.lineTo(x+3,y);ctx.moveTo(x,y-3);ctx.lineTo(x,y+3);ctx.stroke();}
  }
  const moonX=765,moonY=133;
  const halo=ctx.createRadialGradient(moonX,moonY,12,moonX,moonY,83);halo.addColorStop(0,'rgba(244,237,211,.55)');halo.addColorStop(.27,'rgba(198,215,232,.18)');halo.addColorStop(1,'rgba(198,215,232,0)');ctx.fillStyle=halo;ctx.fillRect(moonX-86,moonY-86,172,172);
  ctx.fillStyle='#f5ecd4';ctx.beginPath();ctx.arc(moonX,moonY,24,0,2*Math.PI);ctx.fill();
  ctx.fillStyle='rgba(168,177,174,.20)';for(const [x,y,r] of [[-8,-3,4],[9,5,6],[3,-10,3]]){ctx.beginPath();ctx.arc(moonX+x,moonY+y,r,0,2*Math.PI);ctx.fill();}
  cachedNightSky=new THREE.CanvasTexture(c);cachedNightSky.colorSpace=THREE.SRGBColorSpace;cachedNightSky.anisotropy=8;
 }
 const dome=mesh(group,new THREE.SphereGeometry(174,64,32),new THREE.MeshBasicMaterial({map:cachedNightSky,side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false}));dome.renderOrder=-100;dome.name='Sternenhimmel mit projiziertem Mond';return dome;
}
const weatherTextures=new Map();
function weatherSky(group,kind){
 let texture=weatherTextures.get(kind);
 if(!texture){
  const c=document.createElement('canvas');c.width=2048;c.height=1024;const ctx=c.getContext('2d');
  const grad=ctx.createLinearGradient(0,0,0,1024);
  if(kind==='park'){
   grad.addColorStop(0,'#1573b5');grad.addColorStop(.48,'#59ade0');grad.addColorStop(.82,'#b5deeb');grad.addColorStop(1,'#d9eef0');
  }else{
   grad.addColorStop(0,'#101b2a');grad.addColorStop(.45,'#2d4153');grad.addColorStop(.82,'#64737c');grad.addColorStop(1,'#919b9c');
  }
  ctx.fillStyle=grad;ctx.fillRect(0,0,2048,1024);
  const cloudCanvas=document.createElement('canvas');cloudCanvas.width=1024;cloudCanvas.height=512;
  const cloudCtx=cloudCanvas.getContext('2d'),pixels=cloudCtx.createImageData(1024,512),data=pixels.data;
  const seed=kind==='park'?37281:9137;
  const hash=(x,y,s)=>{let h=Math.imul(x,374761393)^Math.imul(y,668265263)^Math.imul(s,1442695041);
   h=Math.imul(h^(h>>>13),1274126177);return((h^(h>>>16))>>>0)/4294967295;};
  const noise=(x,y,s)=>{const ix=Math.floor(x),iy=Math.floor(y),u=(x-ix)**2*(3-2*(x-ix)),v=(y-iy)**2*(3-2*(y-iy));
   const a=lerp(hash(ix,iy,s),hash(ix+1,iy,s),u),b=lerp(hash(ix,iy+1,s),hash(ix+1,iy+1,s),u);
   return lerp(a,b,v);};
  for(let y=0;y<512;y++)for(let x=0;x<1024;x++){
   const n=.42*noise(x/100,y/72,seed)+.30*noise(x/50,y/35,seed+1)+.18*noise(x/24,y/17,seed+2)+.10*noise(x/12,y/8,seed+3);
   const band=kind==='park'?smooth(30,100,y)*(1-smooth(390,510,y)):1;
   const density=smooth(kind==='park'?.51:.43,kind==='park'?.68:.61,n)*band;
   const j=(y*1024+x)*4;
   if(kind==='park'){
    data[j]=247;data[j+1]=250;data[j+2]=248;data[j+3]=Math.round(227*density);
   }else{
    data[j]=17;data[j+1]=29;data[j+2]=42;
    data[j+3]=Math.round(235*density);
   }
  }
  cloudCtx.putImageData(pixels,0,0);ctx.drawImage(cloudCanvas,0,0,2048,1024);
  texture=new THREE.CanvasTexture(c);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;weatherTextures.set(kind,texture);
 }
 const dome=mesh(group,new THREE.SphereGeometry(174,64,32),new THREE.MeshBasicMaterial({map:texture,side:THREE.BackSide,depthWrite:false,fog:false,toneMapped:false}));
 dome.renderOrder=-100;dome.name=kind==='park'?'Blauer Himmel mit Wolken':'Sturmhimmel mit Wolken';group.userData.sky=dome;return dome;
}
function rainField(group){
 const n=520,positions=new Float32Array(n*6),geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
 const lines=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:0xd6e9ed,transparent:true,opacity:.5,depthWrite:false,fog:false}));
 lines.frustumCulled=false;lines.name='Regen am Berg';group.add(lines);
 const hash=x=>{const v=Math.sin(x*127.1+43.7)*43758.5453;return v-Math.floor(v);};
 const update=(t,strength)=>{
  lines.visible=strength>.02;lines.material.opacity=.12+.48*strength;if(!lines.visible)return;
  for(let i=0;i<n;i++){
   const speed=5.5+hash(i+19)*5.0,base=hash(i+79)*8.0;
   const y=.4+((base-t*speed)%8+8)%8,x=-7.5+hash(i+7)*15,z=-14+hash(i+37)*19;
   const j=i*6;positions[j]=x;positions[j+1]=y;positions[j+2]=z;
   positions[j+3]=x-.13;positions[j+4]=y-.25-.18*strength;positions[j+5]=z+.04;
  }
  geometry.attributes.position.needsUpdate=true;
 };
 update(0,0);return{lines,update};
}
function stormFlash(t){let flash=0;
 for(const at of[SHOT.S034.start+.44,SHOT.S036.start+.70,SHOT.S037.start+.38]){
  flash=Math.max(flash,clamp(1-Math.abs(t-at)/.13),.58*clamp(1-Math.abs(t-at-.21)/.11));
 }
 return flash;
}
function carousel(group,x,z,s=1){
 const root=new THREE.Group();root.position.set(x,0,z);root.scale.setScalar(s);group.add(root);
 cyl(root,2.2,2.2,.18,[0,.17,0],M.wood,32);
 const spin=new THREE.Group();spin.position.y=.27;root.add(spin);
 cyl(spin,1.95,1.95,.1,[0,2.35,0],M.orange,32);
 const roof=mesh(spin,new THREE.ConeGeometry(2.35,1.25,24),mat(0x7c4254,.55,.1),0,2.95,0);
 cyl(spin,.09,.09,3.2,[0,1.52,0],M.steel);
 for(let i=0;i<10;i++){const a=i*Math.PI/5,x=Math.cos(a)*1.5,z=Math.sin(a)*1.5;
  cyl(spin,.025,.025,2.15,[x,1.28,z],M.steel,8);
  const seat=box(spin,[.42,.19,.48],[x,.66,z],i%2?M.cyan:M.orange);seat.rotation.y=a;
  sphere(spin,.13,[x,.83,z],M.cream);
  sphere(root,.08,[Math.cos(a)*2.1,2.38,Math.sin(a)*2.1],i%2?M.cyan:M.orange);
 }
 return spin;
}
function dropTower(group,x,z,s=1){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);group.add(g);
 for(const dx of[-.25,.25])box(g,[.14,12,.14],[dx,6,0],M.steel);
 box(g,[1.9,.24,.8],[0,11.8,0],M.orange);box(g,[1.8,.35,.75],[0,4.9,0],M.cyan);
 for(let i=-3;i<=3;i++)sphere(g,.11,[i*.24,4.98,-.4],M.cream);
 for(let y=1;y<11;y+=1.1)box(g,[.5,.035,.07],[0,y,0],M.cyan);
 return g;
}
function midway(group,{coaster=false}={}){
 const scale=coaster?1.7:1,back=coaster?-45:-13;
 const wheelRide=coaster?wheel(group,-24,8,-46,6.8):null;
 const merry=carousel(group,coaster?19:-7.5,back,scale);
 dropTower(group,coaster?34:10,coaster?-69:-22,coaster?1.35:.72);
 const tents=coaster?[[-12,-23],[12,-23],[-16,-55],[14,-57]]:[[-5,-10],[4,-15],[8,-10]];
 for(const [x,z] of tents){
  box(group,[3.4,1.7,1.8],[x,.87,z],M.darkWood);
  const roof=mesh(group,new THREE.ConeGeometry(2.35,.9,4),mat(0x4c6770),x,2.13,z);roof.rotation.y=Math.PI/4;
  for(let i=-2;i<=2;i++)box(group,[.55,.09,.08],[x+i*.6,1.59,z+.94],i%2?M.cyan:M.orange);
  box(group,[1.45,.58,.06],[x,.92,z+.96],M.glass);
 }
 const people=[];
 const n=coaster?30:18;
 for(let i=0;i<n;i++){
  const x=coaster?((i*7)%26)-13:((i*7)%12)-6;
  const z=coaster?6-(i*11)%57:-2-(i*7)%16;
  const crowd=passerby(group,x,z,[0x617d8d,0x995f55,0x819760,0xa1865c,0x7d729c][i%5],{pace:.7+(i%4)*.15,phase:i*.71,cap:i%5===0});
  crowd.root.scale.setScalar(.72+(i%3)*.09);people.push(crowd);
 }
 for(const z of(coaster?[12,-10,-35,-58]:[1,-4,-10,-16])){
  for(const x of(coaster?[-12,0,12]:[-6,6])){cyl(group,.05,.06,2.8,[x,1.4,z],M.steel,8);sphere(group,.16,[x,2.85,z],M.cream);}
 }
 group.userData.midway={people,merry,wheelRide};
}
function fairground(){const g=new THREE.Group();ground(g,M.asphalt);for(let i=0;i<10;i++)box(g,[.09,.025,9],[i*1.1-5,.01,-2],i%2?mat(0x394650):mat(0x313d47));
 path(g,[[-9,4.2,-7],[-6,3.7,-6],[-3,3.2,-5]],0x354b57,.019);
 box(g,[.52,.33,.34],[-5.2,3.12,-5.7],M.steel);box(g,[.03,.30,.03],[-5.2,3.42,-5.7],M.steel);
 const ride=wheel(g,4.2,3.05,-7.3,2.42);g.userData.wheel=ride;
 box(g,[2.35,1.55,.65],[-4.1,.75,-2.9],M.night);const booth=label(g,'TICKETS  /  ENTRY',{w:2.2,h:.4,bg:'#283842',color:'#ffb78f',size:39});booth.position.set(-4.1,1.35,-2.54);
 for(let j=0;j<4;j++){const x=-2.3+j*1.55;for(const z of[-.7,1.5]){cyl(g,.045,.045,1.15,[x,.57,z],M.steel);sphere(g,.072,[x,1.15,z],M.orange);}path(g,[[x,1.02,-.7],[x+1.55,1.02,-.7]],0xff6534,.015);}
 for(let i=0;i<17;i++){const x=-5.5+i*.7;sphere(g,.055,[x,3.35,-2.6],i%3===0?M.orange:i%3===1?M.cyan:M.pale);}
 for(const x of[-6.1,6.1]){cyl(g,.055,.055,2.8,[x,1.4,-6.5],M.steel);sphere(g,.13,[x,2.85,-6.5],M.cream);}
 const coaster=path(g,[[-8,1.2,-10],[-5,2.6,-11],[-2,5.2,-12],[1,6.2,-12],[3,3.0,-12],[6,2.2,-13],[8,1.2,-13]],0xff6534,.06);coaster.name='Achterbahn in der Ferne';
 for(const x of[1.55,4.05])box(g,[.13,2.65,.13],[x,1.32,-3.15],M.steel);
 box(g,[2.65,.12,.16],[2.8,2.64,-3.15],M.steel);
 const entry=label(g,'EINSTIEG  /  BOARD',{w:2.4,h:.35,bg:'#243744',color:'#ffad7c',size:39});entry.position.set(2.8,2.63,-3.03);
 for(const [x,z,s] of [[-3.4,-1.6,.75],[-.2,-3.6,.7],[4.8,-2.1,.8]]){
  const crowd=new THREE.Group();crowd.position.set(x,0,z);crowd.scale.setScalar(s);g.add(crowd);
  cyl(crowd,.20,.24,1.05,[0,.87,0],mat(x<0?0x40576b:0x6c5550),9);
  sphere(crowd,.23,[0,1.64,0],mat(0x8c7770));
  for(const dx of[-.11,.11])box(crowd,[.13,.48,.14],[dx,.25,0],M.night);
 }
 nightSky(g);midway(g);return g;}
function coaster(){const g=new THREE.Group();box(g,[120,.14,140],[0,-.08,-25],mat(0x344852));ridge(g,-78,0x263447,-1,13);nightSky(g);midway(g,{coaster:true});
 // Separate ground-level loading and unloading stations. The high hill, offset vertical
 // loop and return hill form one continuous, supported route back to the ground.
 const center=[[-11,1.25,8],[-9,1.25,5],[-8,1.55,0],[-7,3.0,-6],[-5,6.6,-12],[-3,10.0,-17],[-1,6.9,-21],
  [0,2.2,-23],[1.2,1.8,-25],[3.9,3.8,-26],[4.9,6.5,-26.5],[3.3,9.2,-27],[.8,8.4,-27.5],[-.3,5.6,-28],
  [1.2,2.0,-28.5],[4.8,1.65,-29],[8,3.6,-24],[10,5.0,-18],[10,2.9,-11],[9,1.4,-3],[9,1.25,5],[11,1.25,8]];
 const curve=new THREE.CatmullRomCurve3(center.map(([x,y,z])=>V(x*2.2,1.25+(y-1.25)*1.8,z*2.2)),false,'centripetal');
 curve.arcLengthDivisions=600;g.userData.track=curve;
 const rails=[[],[]],spine=[];
 for(let i=0;i<=320;i++){
  const u=i/320,p=curve.getPointAt(u),tan=curve.getTangentAt(u),side=V(tan.z,0,-tan.x).normalize();
  if(side.lengthSq()<.01)side.set(1,0,0);
  rails[0].push(p.clone().addScaledVector(side,-.42));rails[1].push(p.clone().addScaledVector(side,.42));
  spine.push(p.clone().add(V(0,-.22,0)));
 }
 for(const [i,points] of rails.entries())mesh(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points),320,.085,9,false),i?M.cyan:M.orange);
 mesh(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(spine),320,.105,8,false),M.steel);
 for(let i=0;i<=80;i++){
  const u=i/80,p=curve.getPointAt(u),tan=curve.getTangentAt(u),side=V(tan.z,0,-tan.x).normalize();
  if(side.lengthSq()<.01)side.set(1,0,0);
  const beam=box(g,[1.03,.065,.16],[p.x,p.y-.18,p.z],M.steel);beam.rotation.y=Math.atan2(side.z,side.x);
  if(i%4===0&&p.y>1.8){
   const h=p.y-.08;cyl(g,.07,.085,h,[p.x,h/2,p.z],M.steel,8);
   if(h>4)path(g,[[p.x,h*.25,p.z],[p.x+side.x*1.6,h*.55,p.z+side.z*1.6],[p.x,h*.8,p.z]],0x475567,.035);
  }
  if(i%5===0){
   for(const sideSign of[-1,1]){
    const x=p.x+side.x*1.55*sideSign,z=p.z+side.z*1.55*sideSign;
    cyl(g,.035,.045,.88,[x,.44,z],M.steel,7);
    sphere(g,.085,[x,.92,z],sideSign<0?M.orange:M.cyan);
   }
  }
 }
 for(const x of[-24.2,24.2]){
  box(g,[3.3,.20,5.2],[x,.83,17.0],M.wood);
  for(const dx of[-1.45,1.45])box(g,[.09,1.04,4.8],[x+dx,1.42,17.0],M.steel);
  const sign=label(g,x<0?'EINSTIEG  /  BOARD':'AUSSTIEG  /  EXIT',{w:2.7,h:.39,bg:'#243744',color:'#ffad7c',size:37});
  sign.position.set(x,2.6,18.6);
 }
 const car=new THREE.Group();g.add(car);
 box(car,[1.32,.34,1.76],[0,.08,0],M.orange);
 box(car,[1.20,.29,.92],[0,.32,.38],M.steel);
 for(const x of[-.56,.56])for(const z of[-.56,.57])cyl(car,.15,.15,.09,[x,-.16,z],M.steel);
 const bar=mesh(car,new THREE.TorusGeometry(.53,.044,8,24,Math.PI),M.steel,0,.64,-.06);bar.rotation.x=Math.PI/2;
 const rider=traveler(car);rider.group.scale.setScalar(.70);rider.group.position.set(0,.17,.43);rider.standing.visible=false;rider.seated.visible=true;
 rider.laptop.position.set(0,.90,-.91);
 g.userData.car=car;g.userData.rider=rider;
 return g;}
function exitScene(){const g=fairground();const arch=new THREE.Group();g.add(arch);arch.position.set(-.1,0,1.7);
 for(const x of[-2.5,2.5])box(arch,[.18,3.5,.18],[x,1.75,0],M.steel);box(arch,[5.25,.18,.18],[0,3.42,0],M.steel);
 const sign=label(arch,'WEITER  /  NEXT IDEA',{w:3.6,h:.47,bg:'#263842',color:'#f4f3ea',size:40});sign.position.set(0,3.42,.12);
 return g;}

const SETTINGS={
 cafe:{sky:0x9db5ae,fog:.012,ambient:1.65,key:0xffc392,fill:0x8cdbea},
 park:{sky:0x97bcb5,fog:.011,ambient:1.9,key:0xffdcaa,fill:0xaadad2},
 forest:{sky:0x556c64,fog:.022,ambient:1.28,key:0xe2dda7,fill:0x88bcb1},
 fairground:{sky:0x152336,fog:.014,ambient:.82,key:0xff704b,fill:0x44dde5},
 coaster:{sky:0x122033,fog:.005,ambient:.80,key:0xff7449,fill:0x44dde5},
 exit:{sky:0x152333,fog:.015,ambient:.92,key:0xffa06c,fill:0x44dde5}
};

export class Places{
 constructor(scene){this.scene=scene;
  this.groups={cafe:cafe(),park:park(),forest:forest(),fairground:fairground(),coaster:coaster(),exit:exitScene()};
  for(const group of Object.values(this.groups))scene.add(group);
  this.traveler=traveler(scene);this.povLaptop=laptop(scene);this.povTyping=povTyping(this.povLaptop.group);this.povLaptop.group.visible=false;
  this.povLaptop.group.scale.setScalar(.9);
  this.active='';this.target=V(0,1.55,-1.4);
  this.deviceFaces=[this.traveler.face,this.groups.coaster.userData.rider.face,this.povLaptop.face];
 }
 rideProgress(t){
  return .018+.964*smooth(SHOT.S054.start+.15,SHOT.S066.start-.22,t);
 }
 update(t,shot,a,ambient,key,fill){const id=Number(shot.id.slice(1)),place=placeAt(t),spec=SETTINGS[place];
  for(const [name,g] of Object.entries(this.groups))g.visible=name===place;
  if(this.active!==place){this.active=place;this.scene.background.setHex(spec.sky);this.scene.fog=new THREE.FogExp2(spec.sky,spec.fog);ambient.color.set(0xffffff);key.color.setHex(spec.key);fill.color.setHex(spec.fill);}
  const pulse=1+Math.min(.1,a.energy*.08);ambient.intensity=spec.ambient*(.76+.24*a.atmosphere);key.intensity=(place==='fairground'||place==='coaster'||place==='exit'?31:18)*pulse;fill.intensity=(place==='forest'?12:22)*pulse;
  key.position.set(place==='cafe'?2.4:-2.4,4,1.2);fill.position.set(2.8,3,-5);
  const tr=this.traveler;tr.group.visible=place!=='coaster';
  const typingDrive=clamp(.55+a.energy*.32+(a.sub||0)*.18,.55,1.1);
  const alpineWalk=place==='forest'?smooth(SHOT.S033.start,SHOT.S036.start,t):0;
  const seated=place==='cafe'||place==='park'||place==='forest'&&alpineWalk<.25,boarding=place==='fairground'&&id>=51;
  tr.group.position.set(place==='cafe'?-.7:place==='park'?-2:place==='forest'?-.65+1.05*alpineWalk:boarding?2:place==='fairground'?-1.15:-1.1,
   0,place==='cafe'?1.58:place==='park'?-.55:place==='forest'?.85-9.2*alpineWalk:boarding?-.65:place==='fairground'?.4:.2);
  tr.group.rotation.y=place==='cafe'?-.09:place==='park'?.12:place==='forest'?-.12-.28*alpineWalk:place==='fairground'?-.25:0;
  tr.standing.visible=!seated;tr.seated.visible=seated;
  tr.laptop.position.set(0,place==='cafe'?1.00:seated?.78:1.03,place==='cafe'?-1.05:seated?-.76:-.75);
  const rideArms=place==='coaster'?a.rideArms||[0,0]:[0,0];
  tr.poseHands(t,typingDrive,a.cheer||0);this.povTyping.pose(t,typingDrive,rideArms);
  const fair=this.groups[place];if(fair.userData.wheel)fair.userData.wheel.rotation.z=t*.06;
  if(place==='cafe')for(const p of fair.userData.queue){const phase=t*p.pace+p.phase;
   p.root.position.x=p.baseX+Math.sin(phase)*.12;
   p.legs.forEach((leg,i)=>leg.rotation.x=Math.sin(phase*2.2+i*Math.PI)*.12);
   p.arms.forEach((arm,i)=>arm.rotation.x=-Math.sin(phase*2.2+i*Math.PI)*.10);
  }
  if(place==='park')fair.userData.sky.rotation.y=t*.0015;
  if(place==='forest'){
   fair.userData.sky.rotation.y=t*.004;
   const weather=smooth(SHOT.S033.start,SHOT.S035.start,t),flash=stormFlash(t);
   fair.userData.rain.update(t,weather);fair.userData.bolt.visible=flash>.04;
   fair.userData.sky.material.color.setRGB(1+flash*.38,1+flash*.53,1+flash*.67);
   ambient.intensity+=flash*1.25;key.intensity+=flash*35;fill.intensity+=flash*18;
   if(flash>.04)key.color.setHex(0xc5e5ff);else key.color.setHex(spec.key);
  }
  if(fair.userData.midway){const {people,merry,wheelRide}=fair.userData.midway;
   merry.rotation.y=t*.48;if(wheelRide)wheelRide.rotation.z=t*.095;
   for(const p of people){const phase=t*p.pace+p.phase;p.root.position.x=p.baseX+Math.sin(phase*.28)*.55;p.root.position.z=p.baseZ+Math.cos(phase*.23)*.65;
    p.legs.forEach((leg,i)=>leg.rotation.x=Math.sin(phase*5+i*Math.PI)*.30);p.arms.forEach((arm,i)=>arm.rotation.x=-Math.sin(phase*5+i*Math.PI)*.25);}
  }
  if(place==='park'){
   const {people,frisbee}=fair.userData;
   for(let i=0;i<people.length;i++){const p=people[i],phase=t*p.pace+p.phase,walk=i<3?1.5:i<5?.72:.35;
    p.root.position.x=p.baseX+Math.sin(phase*.75)*walk;p.root.position.z=p.baseZ+Math.cos(phase*.55)*(i<3?1.5:.6);
    p.root.rotation.y=i<3?Math.sin(phase*.75)*.45:p.root.rotation.y;
    p.legs.forEach((leg,j)=>leg.rotation.x=Math.sin(phase*5.7+j*Math.PI)*(i<3?.75:.38));
    p.arms.forEach((arm,j)=>arm.rotation.x=-Math.sin(phase*5.7+j*Math.PI)*(i<3?.62:.24));
   }
   frisbee.position.set(Math.sin(t*1.55)*3.25,1.45+Math.abs(Math.cos(t*1.55))*.7,-7.25+Math.sin(t*.72)*.23);frisbee.rotation.set(.1,t*3.2,.18);
  }
  if(place==='coaster'){
   const u=this.rideProgress(t),curve=fair.userData.track,position=curve.getPointAt(u),tangent=curve.getTangentAt(u).normalize();
   fair.userData.car.position.copy(position);
   // Build an explicit local basis. setFromUnitVectors(-Z, tangent) chooses an
   // arbitrary 180-degree axis on the return leg and flips the whole car.
   const right=V(-tangent.z,0,tangent.x).normalize();if(right.lengthSq()<.01)right.set(1,0,0);
   const back=tangent.clone().negate(),up=back.clone().cross(right).normalize();
   fair.userData.car.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(right,up,back));
   fair.userData.car.rotateZ(Math.sin(u*Math.PI*4)*.12);
   const rider=fair.userData.rider;rider.poseHands(t,typingDrive,rideArms);
   rider.group.position.y=.17+.045*Math.max(...rideArms);
   rider.group.rotation.z=.075*(rideArms[1]-rideArms[0]);
   ambient.intensity=1.25;
   key.distance=38;fill.distance=38;
   key.intensity=55*pulse;fill.intensity=36*pulse;
   key.position.copy(position).add(V(3,5,3));fill.position.copy(position).add(V(-4,2,-5));
  }else{
   key.distance=9;fill.distance=9;
  }
  this.povLaptop.group.visible=false;
 }
 camera(t,shot,camera,screenZoom=0){const place=placeAt(t);let position,target,fov=40,pov=0;
  const ranges={cafe:['S001','S016'],park:['S016','S029'],forest:['S029','S038'],fairground:['S038','S053'],coaster:['S053','S066'],exit:['S066','S072']};
  const [first,last]=ranges[place],u=clamp((t-SHOT[first].start)/(SHOT[last].start-SHOT[first].start||1));
  if(['cafe','park','forest','fairground'].includes(place)){
   const tr=this.traveler.group.position,cycles={cafe:1.28,park:1.18,forest:1.04,fairground:1.35}[place];
   const start={cafe:.62,park:-.58,forest:.38,fairground:.30}[place],angle=start+u*2*Math.PI*cycles;
   const radius=place==='cafe'?3.25:place==='forest'?3.65:place==='park'?3.7:4.05;
   const center=V(tr.x,1.25,tr.z-.42);
   position=V(center.x+Math.sin(angle)*radius,1.85+.22*Math.sin(angle*1.4),center.z+Math.cos(angle)*radius);
   target=center.clone().add(V(0,.06,-.17));fov=place==='cafe'?42:44;
   if(place==='forest'&&u>.55){const reveal=smooth(.55,.84,u);target.lerp(V(.4,2.1,-11.3),reveal*.52);position.y+=reveal*.7;}
  }else if(place==='coaster'){
   const car=this.groups.coaster.userData.car,curve=this.groups.coaster.userData.track,ru=this.rideProgress(t);
   car.updateMatrixWorld(true);
   const tan=curve.getTangentAt(ru).normalize(),side=V(tan.z,0,-tan.x).normalize();
   const orbit=shot.id==='S064'?-1.22+(t-SHOT.S064.start)*1.2:(t-SHOT.S053.start)*.75+2.1;
   const third=car.position.clone().add(V(Math.cos(orbit)*4.1,1.58+.18*Math.sin(orbit*1.7),Math.sin(orbit)*4.1));
   const rider=car.localToWorld(V(0,1.28,.1));
   if(shot.id==='S057')third.copy(car.position).add(V(-2.2,1.7,4.4));
   // The ride alternates between a camera orbiting the car and the rider's
   // forward view. Only S062 enters the flat laptop composition.
   const eye=car.position.clone().add(V(0,1.36,0));
   const next=curve.getPointAt(Math.min(.999,ru+.045)),ahead=V(next.x,Math.max(next.y+1.2,eye.y-.55),next.z);
   const opening=smooth(SHOT.S058.start+.05,SHOT.S058.start+.95,t);
   const third59=smooth(SHOT.S059.start-.20,SHOT.S059.start+.24,t)*(1-smooth(SHOT.S059.end-.35,SHOT.S060.start+.22,t));
   const third61=smooth(SHOT.S061.start-.18,SHOT.S061.start+.26,t)*(1-smooth(SHOT.S061.end-.32,SHOT.S062.start+.18,t));
   const third64=smooth(SHOT.S064.start-.16,SHOT.S064.start+.16,t)*(1-smooth(SHOT.S064.end-.15,SHOT.S064.end+.20,t));
   const unload=smooth(SHOT.S065.end-1.8,SHOT.S065.end-.22,t);
   pov=opening*(1-Math.max(third59,third61,third64,unload));this.pov=pov;
   const sway=Math.sin(t*1.35)*2.1+Math.sin(t*.49)*1.2;
   ahead.addScaledVector(side,sway*pov);
   const shake=(.025+.06*Math.sin(Math.PI*ru)**2)*pov*(1-screenZoom);
   eye.addScaledVector(side,Math.sin(t*18.5)*shake);eye.y+=Math.sin(t*22.7)*shake*.72;
   position=third.lerp(eye,pov);target=rider.lerp(ahead,pov);fov=44+18*pov;
   this.groups.coaster.userData.rider.group.visible=pov<.65;
  }else{
   position=V(-3.1,2.3,5.1).lerp(V(1.5,2.1,4.4),u);target=V(0,1.6,-2.2);fov=42;
  }
  camera.position.copy(position);camera.up.set(0,1,0);camera.lookAt(target);camera.updateMatrixWorld();
  if(place==='coaster'&&pov>.25){
   this.povLaptop.group.visible=true;
   this.povLaptop.group.position.copy(camera.localToWorld(V(0,-.87,-1.45)));
   this.povLaptop.group.quaternion.copy(camera.quaternion);
   this.groups.coaster.userData.rider.laptop.visible=pov<.98;
  }else this.groups.coaster.userData.rider.laptop.visible=true;
  if(screenZoom>0){
   const face=place==='coaster'&&pov>.5?this.povLaptop.face:this.traveler.face;
   this.scene.updateMatrixWorld(true);
   const screen=face.getWorldPosition(V(0,0,0)),normal=V(0,0,1).applyQuaternion(face.getWorldQuaternion(new THREE.Quaternion()));
   const close=screen.clone().addScaledVector(normal,place==='coaster'?.87:.64);
   position.lerp(close,screenZoom);target.lerp(screen,screenZoom);fov+=(40-fov)*screenZoom;
  }
  camera.position.copy(position);this.target.copy(target);camera.up.set(0,1,0);camera.lookAt(target);
  camera.fov=fov;camera.updateProjectionMatrix();camera.updateMatrixWorld();
 }
}
