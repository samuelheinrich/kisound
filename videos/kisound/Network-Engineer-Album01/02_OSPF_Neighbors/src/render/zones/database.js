import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,baseScene,floor,line,tube,label,pool,travel,card,box,mat} from '../world.js';
import {clamp,smooth} from '../timeline.js';
import {lsdb,networkState} from '../protocol-model.js';
export class DatabaseZone{
 constructor(){
  this.scene=baseScene();floor(this.scene,28,-1.2);this.root=new THREE.Group();this.scene.add(this.root);this.a=card(this.root,'AREA 0 / LSDB',[-5.7,2,0],6.6);this.b=card(this.root,'PEER / LSDB',[5.7,2,0],6.6,'#b39bff');this.c=card(this.root,'EXCHANGE',[0,6,-2],4.4,'#ffb96a');
  this.lanes=[tube(this.root,[[-5.7,.25,1],[0,1.2,1],[5.7,.25,1]],P.cyan,.03),tube(this.root,[[5.7,.25,2],[0,.7,2],[-5.7,.25,2]],P.green,.03)];
  this.caption=label(this.root,'HEADER → REQUEST → UPDATE → ACK','RELIABLE NEIGHBOUR EXCHANGE',[0,-.4,3],10);this.packets=pool(this.root,40);this.border=box(this.root,[.06,5,.06],[0,1.3,-.7],mat(P.violet));
  this.areaCaption=label(this.root,'R7 / TWO LSDBs / TYPE-3 ORIGINATED','TYPE 1 / 2 INFORMATION STAYS INSIDE ITS AREA',[0,-.4,3],10,'#b39bff');this.tokens=['DBD','LSR','LSU','LSAck'].map((s,i)=>label(this.root,s,'OSPF PACKET TYPE '+(i+2),[-5+i*3.3,.3,4.5],2.6,i===2?'#ffb96a':'#59d8ed'));
 }
 update(t,a,tl,shot){
  const m=shot.mode,multi=['areas','summary'].includes(m),n=networkState(t),gate=clamp((a.rms_dbfs+50)/22);this.border.visible=multi;
  const db=lsdb(t,0),seq=id=>db.find(l=>l.type===1&&l.advertiser===id).sequence;const rows=[[`T1 R1 / SEQ ${seq('R1')}`,'#c8e4ef'],[`T1 R2,R4 / SEQ ${seq('R2')}`,'#c8e4ef'],['T1 R3,R5,R6,R7','#c8e4ef'],...(t>=36.98?[['T2 LAN / DR R4','#59d8ed']]:[]),...(n.area1Full?[['T3 R7 / 198.51.100/24','#ffb96a'],['SUMMARY METRIC 11','#80e3bd']]:[])];
  const area1rows=lsdb(t,1).map(r=>[`T${r.type} ${r.advertiser} ${r.type===3?'192.0.2/24':'SEQ '+r.sequence}`,r.type===3?'#ffb96a':'#b39bff']);
  const aligned=t>=53.36;this.a.update(rows,'TYPE 1 / 2 STAY IN AREA 0');this.b.update(multi?area1rows:aligned?rows:rows.slice(0,3).concat([['MISSING LSAs','#ffb96a']]),multi?'AREA 1 / DISTINCT DATABASE':aligned?'IDENTICAL AREA 0 LSA SET':'COMPARE LSA HEADERS');
  const step=m==='loading'?(t<52.2?3:t<52.9?4:5):m==='dbd'||m==='exstart'?2:['flood','lsa','fault'].includes(m)?((t-104.84)%1.6<.95?4:5):5;const stage=m==='exstart'?'EXSTART / R2 PRIMARY':multi?'R7 / ABR':{2:'DBD / HEADERS',3:'LSR / REQUEST',4:'LSU / FULL LSAs',5:'LSAck / CONFIRM'}[step];
  this.c.update(multi?(n.area1Full?[['AREA 0 ↔ AREA 1','#b39bff'],['TYPE-3 ORIGINATED','#ffb96a'],['198.51.100/24','#c8e4ef'],['METRIC 11','#80e3bd']]:[['AREA 0 ↔ AREA 1','#b39bff'],['TWO LOCAL DATABASES','#59d8ed'],['R7 / R8 SYNCING','#ffb96a'],['TYPE-3 PENDING','#89a9b9']]):[[stage,'#ffb96a'],['IP PROTOCOL 89','#c8e4ef'],[aligned?'LSDB CONSISTENT':'REQUEST MISSING','#80e3bd']],'OSPF PACKET TYPE ≠ LSA TYPE');
  this.caption.visible=!multi;this.areaCaption.visible=multi&&n.area1Full;this.tokens.forEach(r=>r.visible=false);
  let k=0;for(let i=0;i<24;i++){let points,color;const d=i%4;
   if(multi){if(d>=2&&!n.area1Full)continue;points=d===0?[[-5.7,1,1],[0,2,1]]:d===1?[[5.7,1,1],[0,2,1]]:d===2?[[0,2,2],[5.7,1,2]]:[[0,2,2],[-5.7,1,2]];color=d===0?P.cyan:d===1?P.violet:P.amber;}
   else{const direction=d===3;points=direction?[[5.7,1,2],[0,1.8,2],[-5.7,1,2]]:[[-5.7,1,1],[0,2,1],[5.7,1,1]];color=step===5?P.green:step===4?P.amber:P.cyan;if(step===3||step===5)points=[[5.7,1,2],[0,1.8,2],[-5.7,1,2]];}
   const pos=travel(points,(t*.38+i/24)%1);this.packets.set(k++,pos,color,gate*(1+.1*tl.attack(t)),t*.8+i);}this.packets.done(k);
  this.tokens.forEach((r,i)=>r.material.color.setHex(i+2===step?P.amber:P.white));
 }
 camera(shot,t){const u=smooth(shot.start,shot.end,t),cam=shot.camera;return{pos:V(cam==='track'?[4-u*6,7,22-u*2]:cam==='side'?[9-u*2,7,23]:[5-u*3,8,25-u*2]),target:V([0,2,0]),fov:46};}
}
