import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {SHOT,SHOTS} from '../src/render/config.js';
import {Places} from '../src/render/places.js';
import {Film} from '../src/render/film.js';

// Geometry and camera contract without WebGL; the browser suite covers pixels.
globalThis.document={createElement:()=>({width:0,height:0,getContext:()=>({
 fillRect(){},drawImage(){},fillText(){},beginPath(){},arc(){},fill(){},stroke(){},moveTo(){},lineTo(){},
 createImageData(w,h){return{data:new Uint8ClampedArray(w*h*4)};},putImageData(){},
 createLinearGradient(){return{addColorStop(){}};},createRadialGradient(){return{addColorStop(){}};}
})})};
const scene=new THREE.Scene();scene.background=new THREE.Color(0x10141c);
const places=new Places(scene),camera=new THREE.PerspectiveCamera(40,16/9,.03,100);
const ambient=new THREE.AmbientLight(),key=new THREE.PointLight(),fill=new THREE.PointLight();
const sample=(id,t=SHOT[id].start+.1,zoom=0)=>{
 places.update(t,SHOT[id],{energy:.4,atmosphere:1},ambient,key,fill);
 places.camera(t,SHOT[id],camera,zoom);
 return camera.position.clone();
};

test('young traveler has a landscape laptop and sits outside the café table',()=>{
 sample('S009');
 const p=places.traveler;
 assert.equal(p.seated.visible,true);assert.equal(p.standing.visible,false);
 assert.ok(Math.abs(p.face.geometry.parameters.width/p.face.geometry.parameters.height-16/9)<.02);
 assert.ok(Math.hypot(p.group.position.x+.7,p.group.position.z-.4)>.86+.27);
 for(const id of['S016','S029']){sample(id);assert.equal(p.seated.visible,true);assert.equal(p.laptop.visible,true);}
});

test('hood is faceless, sleeves connect to hands on the keyboard, and titles retain the traveler',()=>{
 const p=places.traveler;
 assert.equal(p.arms.length,2);
 assert.ok(p.group.children.some(o=>o.geometry?.type==='BufferGeometry'),'shaped hood shell');
 const darkness=p.group.getObjectByName('Unbeleuchtete Vertiefung der Kapuze');
 assert.ok(darkness&&darkness.position.z>.08&&darkness.scale.x<.7,'the shadow sits deep inside the hood');
 assert.equal(darkness.material.type,'MeshBasicMaterial');
 assert.ok(darkness.material.color.getHex()<0x101010,'the recess stays unlit');
 assert.ok(p.group.children.some(o=>o.material?.vertexColors&&o.material.type==='MeshBasicMaterial'),
  'the hood has a matte inner wall between its lip and the deep shadow');
 p.group.updateMatrixWorld(true);
 const seam=p.group.getObjectByName('Geschlossener Kapuzenrand');
 assert.ok(seam&&seam.material.side===THREE.DoubleSide,'cloth closes the hood front from every camera angle');
 assert.ok(p.group.getObjectByName('Schwarze Kapuzenblende'));
 assert.ok(p.group.getObjectByName('Abgedunkelter Kapuzenansatz'));
 for(const [x,y] of [[-.24,1.73],[.24,1.73],[0,1.47]]){
  const origin=p.group.localToWorld(new THREE.Vector3(x,y,-1));
  const direction=new THREE.Vector3(0,0,1).applyQuaternion(p.group.getWorldQuaternion(new THREE.Quaternion()));
  assert.ok(new THREE.Raycaster(origin,direction).intersectObject(seam).length,`front seam covers ${x}, ${y}`);
 }
 const backOrigin=p.group.localToWorld(new THREE.Vector3(0,1.69,1.5));
 const backDir=new THREE.Vector3(0,0,-1).applyQuaternion(p.group.quaternion);
 const backHit=new THREE.Raycaster(backOrigin,backDir);
 assert.ok(backHit.intersectObjects(p.group.children,true).some(hit=>p.group.worldToLocal(hit.point.clone()).z>.42),'hood is closed behind');
 for(const id of['S002','S003','S021','S024','S043']){
  sample(id,(SHOT[id].start+SHOT[id].end)/2);
  assert.equal(p.group.visible,true,id);
  for(const arm of p.arms){
   assert.ok(arm.hand.position.y>=p.laptop.position.y+.08&&arm.hand.position.y<p.laptop.position.y+.14,id);
   assert.ok(Math.abs(arm.hand.position.z-(p.laptop.position.z+.20))<.001,id);
   const end=arm.forearm.position.clone().add(new THREE.Vector3(0,.5*arm.forearm.scale.y,0).applyQuaternion(arm.forearm.quaternion));
   const cuffStart=arm.cuff.position.clone().sub(new THREE.Vector3(0,.5*arm.cuff.scale.y,0).applyQuaternion(arm.cuff.quaternion));
   assert.ok(end.distanceTo(cuffStart)<.001,`${id}: forearm reaches cuff`);
  }
 }
 p.poseHands(10,.9);const raised=p.arms[0].hand.position.y,raisedFinger=p.arms[0].fingers[0].position.y;
 p.poseHands(10.12,.9);assert.ok(Math.abs(p.arms[0].hand.position.y-raised)>.005,'hand strikes the keys');
 assert.ok(Math.abs(p.arms[0].fingers[0].position.y-raisedFinger)>.005,'finger types independently');
 p.poseHands(10,.9,1);
 for(const arm of p.arms)assert.ok(arm.hand.position.y>2.0,'both hands rise above the hood on a bass accent');
 p.poseHands(11,.9,0);
 for(const arm of p.arms)assert.ok(arm.hand.position.y<p.laptop.position.y+.14,'hands return to typing');
 assert.equal(places.povTyping.arms.length,2,'POV has connected typing arms');
 places.povTyping.pose(10,.9);const povRaised=places.povTyping.arms[0].hand.position.y;
 places.povTyping.pose(10.12,.9);
 assert.ok(Math.abs(places.povTyping.arms[0].hand.position.y-povRaised)>.005,'POV hands keep typing');
});

test('café surrounds the whole camera orbit with furnished walls',()=>{
 const g=places.groups.cafe;
 for(const name of['Cafédecke','Caféfront','Caférückwand','Cafélinkswand','Caférechtswand'])assert.ok(g.getObjectByName(name),name);
 assert.equal(g.userData.queue.length,3);
 for(const id of['S001','S003','S005','S007','S010','S012','S015']){
  const cameraPos=sample(id,(SHOT[id].start+SHOT[id].end)/2);
  assert.ok(Math.abs(cameraPos.x)<6.8&&cameraPos.z>-4.6&&cameraPos.z<6.15,`${id} stays inside the shop`);
 }
});

test('park action and forest to mountain journey share continuous sets',()=>{
 assert.equal(places.groups.park.userData.people.length,7);
 const t1=SHOT.S019.start+.2,t2=t1+1.2;
 sample('S019',t1);const before=places.groups.park.userData.people[0].root.position.clone();
 sample('S019',t2);assert.ok(before.distanceTo(places.groups.park.userData.people[0].root.position)>.1);
 sample('S030',(SHOT.S030.start+SHOT.S030.end)/2);const forestStart=places.traveler.group.position.clone();
 sample('S036',(SHOT.S036.start+SHOT.S036.end)/2);const forestEnd=places.traveler.group.position.clone();
 assert.equal(places.active,'forest');assert.ok(forestStart.distanceTo(forestEnd)>6);
 assert.ok(places.groups.park.getObjectByName('Blauer Himmel mit Wolken'));
 assert.ok(places.groups.forest.getObjectByName('Sturmhimmel mit Wolken'));
 sample('S036',SHOT.S036.start+.70);
 assert.equal(places.groups.forest.userData.bolt.visible,true,'lightning flashes over the mountain');
 assert.equal(places.groups.forest.userData.rain.lines.visible,true,'rain reaches the mountain');
 const drops=Array.from(places.groups.forest.userData.rain.lines.geometry.attributes.position.array.slice(0,24));
 sample('S033',SHOT.S033.start+.3);sample('S036',SHOT.S036.start+.70);
 assert.deepEqual(Array.from(places.groups.forest.userData.rain.lines.geometry.attributes.position.array.slice(0,24)),drops,'rain is seek-deterministic');
 const boltPoint=new THREE.Vector3(3,4,-20).project(camera);
 assert.ok(Math.abs(boltPoint.x)<1&&Math.abs(boltPoint.y)<1,'lightning enters the mountain camera frame');
});

test('extended coaster has ground stations, full height, supports and a laptop in the car',()=>{
 const g=places.groups.coaster,c=g.userData.track;
 assert.ok(c.getPointAt(0).y<1.5&&c.getPointAt(1).y<1.5);
 assert.ok(Math.max(...Array.from({length:151},(_,i)=>c.getPointAt(i/150).y))>15);
 assert.ok(c.getLength()>200);
 assert.ok(g.userData.rider.laptop.visible);
 assert.ok(g.children.length>100);
 for(const id of['S057','S060','S063','S065']){
  const p=sample(id,(SHOT[id].start+SHOT[id].end)/2);
  assert.ok(p.toArray().every(Number.isFinite));
  const car=g.userData.car;
  assert.ok(car.position.distanceTo(c.getPointAt(places.rideProgress((SHOT[id].start+SHOT[id].end)/2)))<1e-6);
 }
 sample('S064',(SHOT.S064.start+SHOT.S064.end)/2);
 assert.equal(g.userData.rider.group.visible,true,'rider remains behind final title');
 assert.ok(new THREE.Vector3(0,1,0).applyQuaternion(g.userData.car.quaternion).y>.7,'car stays upright on return leg');
 assert.ok(places.rideProgress(SHOT.S055.start)>places.rideProgress(SHOT.S054.start),'train moves during the bridge');
 for(const id of['S053','S055','S057','S059','S061','S064']){
  sample(id,(SHOT[id].start+SHOT[id].end)/2);
  assert.ok(places.pov<.5,`${id} uses the orbiting third-person camera`);
 }
 for(const id of['S058','S060','S063']){
  sample(id,(SHOT[id].start+SHOT[id].end)/2);
  assert.ok(places.pov>.5,`${id} uses the rider's view`);
 }
});

test('same-place cameras continue at cuts and zoom along the laptop normal',()=>{
 for(const id of['S011','S017','S030','S062']){
  const t=SHOT[id].start,before=sample(id,t-.001),after=sample(id,t+.001);
  assert.ok(before.distanceTo(after)<.06,`${id}: ${before.distanceTo(after)}`);
  const close=sample(id,(SHOT[id].start+SHOT[id].end)/2,1);
  const coaster=id==='S062';
  const face=coaster?places.povLaptop.face:places.traveler.face;
  scene.updateMatrixWorld(true);
  const center=face.getWorldPosition(new THREE.Vector3());
  const normal=new THREE.Vector3(0,0,1).applyQuaternion(face.getWorldQuaternion(new THREE.Quaternion()));
  assert.ok(Math.abs(close.clone().sub(center).dot(normal)-(coaster?.87:.64))<.001,id);
 }
});

test('2D passages enter and leave through the screen, including the coaster POV',()=>{
 const host={tl:{shots:SHOTS},isFlat:Film.prototype.isFlat};
 for(const id of['S011','S017','S030','S062']){
  const shot=SHOT[id],zoom=t=>Film.prototype.flatZoom.call(host,t,shot);
  assert.equal(zoom(shot.start),0,id);
  assert.ok(zoom((shot.start+shot.end)/2)>.95,id);
  if(!host.isFlat(SHOTS[SHOTS.indexOf(shot)+1]))assert.equal(zoom(shot.end),0,id);
 }
 assert.deepEqual(SHOTS.filter(s=>Number(s.id.slice(1))>=53&&Number(s.id.slice(1))<=65&&host.isFlat(s)).map(s=>s.id),['S062']);
 sample('S060',(SHOT.S060.start+SHOT.S060.end)/2);
 assert.equal(places.povLaptop.group.visible,true);
 assert.equal(places.groups.coaster.userData.rider.laptop.visible,false);
});
