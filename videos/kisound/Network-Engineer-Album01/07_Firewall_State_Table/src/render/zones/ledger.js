// The control room: six readable boards in an arc – state table, policy, packet, TCP ladder, log, NAT.
// Every board is drawn from the same model as the gate, so both rooms always agree.
import * as THREE from 'three';
import {PALETTE as P} from '../config.js';
import {V,mat,additive,setGlow,ring,dynamicTexture,stars,instanced} from '../world.js';
import {clamp,smooth,lerp} from '../timeline.js';
import {HOSTS,PUBLIC_IP,RULES,BLOCK_T,BLOCK_T2,FLIGHTS,BY_ID,SESSIONS,SESSION_BY_ID,stateTable,ringHit,ruleActive,labelAt,LOGS,STATE_COLOR} from '../model.js';
const BOARDS=['policy','packet','table','ladder','log','nat'],ANG=[-65,-39,-13,13,39,65].map(a=>a*Math.PI/180),RAD=20,W=7.6,H=4.9;
const boardPos=i=>[RAD*Math.sin(ANG[i]),3.4,-RAD*Math.cos(ANG[i])];
const font=(g,s,w='400',f='JetBrains Mono')=>{g.font=`${w} ${s}px "${f}"`;};
function frame(g,w,h,title,sub,accent='#ffb648'){g.fillStyle='rgba(7,10,17,.95)';g.fillRect(0,0,w,h);g.strokeStyle=accent;g.lineWidth=4;g.strokeRect(2,2,w-4,h-4);font(g,50,'600','Space Grotesk');g.fillStyle=accent;g.fillText(title,34,70);font(g,24);g.fillStyle='#7f97ae';g.fillText(sub,36,108);}
// Packet focus per mode: the packet whose fields the packet board explains.
const PACKET_FOCUS={tuple:'T3syn',app:'T7d1',layers:'E1d1'};
const LADDER_FOCUS=m=>/syn|ack/.test(m)&&m!=='tcp'?'T10':'T3';
export class LedgerZone{
 constructor(){
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x04060b);s.fog=new THREE.FogExp2(0x04060b,.02);
  s.add(new THREE.HemisphereLight(0x8fb2d0,0x0a0604,1.0));stars(s,600,120);
  const floor=new THREE.Mesh(new THREE.CircleGeometry(40,64),mat(0x080c14,{roughness:.9}));floor.rotation.x=-Math.PI/2;s.add(floor);
  // Psy rings around the room, turning on the beat.
  this.halos=[0,1,2,3].map(i=>{const r=ring(s,24+i*2.4,[0,3.4+i*.2,0],additive(i%2?P.orange:P.blue,.25),.05);r.rotation.x=Math.PI/2+.08*i;return r;});
  this.dots=instanced(s,new THREE.SphereGeometry(.06,6,4),additive(0xffffff),900);
  this.tex={};BOARDS.forEach((b,i)=>{const tx=dynamicTexture(1400,900),m=new THREE.Mesh(new THREE.PlaneGeometry(W,H),new THREE.MeshBasicMaterial({map:tx.tex,toneMapped:false}));const p=boardPos(i);m.position.set(...p);m.lookAt(0,3.4,0);s.add(m);this.tex[b]=tx;});
 }
 board(name){return BOARDS.indexOf(name);}
 drawTable(t,mode){
  const rows=stateTable(t),focus=mode==='match'?'T10':null,hl=mode==='tcp'?'tcp':mode==='udp'?'udp':null,key=rows.map(r=>r.id+r.state+r.timeout+(t-r.hit<.5?'h':'')).join('|')+mode;
  this.tex.table.set(key,(g,w,h)=>{frame(g,w,h,'STATE TABLE',`${rows.length} active sessions · return traffic is matched here, not against the policy`);
   font(g,22);g.fillStyle='#5d7590';g.fillText('proto inside              nat                   destination            state        ttl',36,160);
   rows.slice(-11).forEach((r,i)=>{const y=205+i*60,hit=t-r.hit<.5,dim=hl&&r.proto!==hl;if(r.id===focus||hit){g.fillStyle=r.id===focus?'rgba(255,182,72,.25)':'rgba(255,182,72,.12)';g.fillRect(20,y-38,w-40,52);}
    g.globalAlpha=dim?.3:1;font(g,23);g.fillStyle='#d6e4f0';g.fillText(`${r.proto.padEnd(5)} ${r.orig.padEnd(20)} ${(r.nat??'—').padEnd(21)} ${r.to.split(' → ').at(-1).padEnd(22)}`,36,y);g.fillStyle=STATE_COLOR[r.state]??'#fff';g.fillText(r.state,1055,y);g.fillStyle='#8fa6bd';g.fillText(String(r.timeout).padStart(5),1270,y);g.globalAlpha=1;});
   if(hl==='tcp'){font(g,22);g.fillStyle='#ffd28a';g.fillText('tcp: SYN_SENT → SYN_RECV → ESTABLISHED → FIN_WAIT → TIME_WAIT',36,h-30);}
   if(hl==='udp'){font(g,22);g.fillStyle='#9feaf6';g.fillText('udp: no handshake · entry lives until 30 s after the last packet',36,h-30);}});
 }
 drawPolicy(t,mode){
  const hits=RULES.map(r=>FLIGHTS.filter(f=>ringHit(f)===r.id&&(f.fate==='drop'?f.t1:f.tGate)<=t).length),last=FLIGHTS.filter(f=>ringHit(f)!=null&&(f.fate==='drop'?f.t1:f.tGate)<=t).at(-1),lastRule=last?ringHit(last):null,recent=last&&t-(last.fate==='drop'?last.t1:last.tGate)<1.2;
  const typing=mode==='write'?clamp((t-95.42)/.55):1,key=hits.join()+lastRule+recent+mode+Math.round(typing*30);
  this.tex.policy.set(key,(g,w,h)=>{frame(g,w,h,'POLICY',mode==='chain'?'top to bottom · first match wins · implicit deny last':'rules · hits');
   RULES.forEach((r,i)=>{const on=ruleActive(r,t)||mode==='write'&&t>=95.42,y=180+i*96;if(!on){g.fillStyle='#1b2433';g.fillRect(36,y-46,w-72,70);font(g,22);g.fillStyle='#3e5168';g.fillText('(empty)',60,y);return;}
    const hot=recent&&lastRule===r.id,deny=r.id===0||r.id===6;g.fillStyle=hot?(deny?'rgba(255,59,78,.3)':'rgba(63,230,160,.22)'):'rgba(255,255,255,.04)';g.fillRect(36,y-46,w-72,70);
    font(g,26,'600');g.fillStyle=deny?'#ff8b95':'#7ff5c0';g.fillText(String(r.id),58,y);font(g,26);g.fillStyle='#e8edf2';const txt=r.id===0&&mode==='write'?r.text.slice(0,Math.ceil(r.text.length*typing)):r.text;g.fillText(txt,110,y);
    font(g,20);g.fillStyle='#7f97ae';g.fillText(r.note,110,y+28);font(g,24);g.fillStyle='#ffb648';g.fillText(`${hits[i]} hits`,w-200,y);});
   if(mode==='chain'){const k=Math.floor(((t-54)*2.5)%7);g.strokeStyle='#ffd24a';g.lineWidth=4;g.strokeRect(30,180+k*96-52,w-60,82);}});
 }
 drawPacket(t,mode){
  const f=BY_ID.get(PACKET_FOCUS[mode]??'T3syn'),s=SESSION_BY_ID.get(f.session),key=mode+Math.floor(t*4);
  this.tex.packet.set(key,(g,w,h)=>{frame(g,w,h,'PACKET',mode==='layers'?'headers high · payload low · DPI reads below the headers':mode==='app'?'port is not the application: inspection names it':'the 5-tuple the policy and the state table use');
   const out=f.from===s.c,src=out?s.orig:s.to.split(' → ').at(-1),dst=out?s.to.split(' → ').at(-1):s.orig,rows=[['source ip',src.split(':')[0]],['source port',src.split(':')[1]],['destination ip',dst.split(':')[0]],['destination port',dst.split(':')[1]],['protocol',f.proto.toUpperCase()],['flags / state',f.kind.toUpperCase()+(s?` · ${s.app}`:'')]];
   if(mode!=='layers')rows.forEach(([k,v],i)=>{const y=190+i*92,on=clamp((t-(mode==='tuple'?57.16:120.16))*3-i*.5);g.globalAlpha=.35+.65*on;font(g,26);g.fillStyle='#7f97ae';g.fillText(k,60,y);font(g,40,'600');g.fillStyle=i<4?'#ffd28a':'#9feaf6';g.fillText(v,420,y);g.globalAlpha=1;});
   if(mode==='app'){font(g,30,'600');g.fillStyle='#7ff5c0';g.fillText('app-id: tls · web-browsing · sni=www.example.net',60,800);}
   if(mode==='layers'){const L=[['Ethernet',14,'#5d7590'],['IPv4 header',20,'#8fd2ff'],['TCP header',20,'#59e3ff'],['payload · http response',1386,'#ffb648']];let y=170;const scan=(t*1.6)%1;
    L.forEach(([n,b,c],i)=>{const hh=i<3?72:300;g.fillStyle=c;g.globalAlpha=.85;g.fillRect(60,y,w-120,hh-10);g.globalAlpha=1;font(g,28,'600');g.fillStyle='#071019';g.fillText(`${n} · ${b} B`,80,y+44);y+=hh;});
    g.fillStyle='rgba(89,227,255,.55)';g.fillRect(60,170+216+scan*290,w-120,8);font(g,26);g.fillStyle='#9feaf6';g.fillText('DPI: signature scan of the payload → clean',60,h-40);}});
 }
 drawLadder(t,mode){
  const sid=LADDER_FOCUS(mode),s=SESSION_BY_ID.get(sid),fl=['syn','sa','ack','d1'].map(k=>BY_ID.get(sid+k)).filter(Boolean),key=sid+fl.map(f=>Math.round(clamp((t-f.t0)/(f.t1-f.t0))*20)).join();
  this.tex.ladder.set(key,(g,w,h)=>{frame(g,w,h,'TCP HANDSHAKE',`${s.orig} ↔ ${s.to.split(' → ').at(-1)} · the firewall follows every step`);
   const X=[220,700,1180],names=['client',`firewall`,'server'];X.forEach((x,i)=>{g.strokeStyle='#2f4a66';g.lineWidth=4;g.beginPath();g.moveTo(x,170);g.lineTo(x,h-60);g.stroke();font(g,26,'600','Space Grotesk');g.fillStyle='#cfe0ee';g.textAlign='center';g.fillText(names[i],x,158);g.textAlign='left';});
   const lab=['SYN  seq=1000','SYN-ACK  seq=5000 ack=1001','ACK  ack=5001','DATA  → session match'],states=['SYN_SENT','SYN_RECV','ESTABLISHED','match'];
   fl.forEach((f,i)=>{const u=clamp((t-f.t0)/(f.t1-f.t0));if(u<=0)return;const fwd=i%2===0&&i<3,y0=230+i*130,x0=fwd?X[0]:X[2],x1=fwd?X[2]:X[0],x=lerp(x0,x1,u),y=y0+u*60;
    g.strokeStyle=i===3?'#7ff5c0':i===1?'#ffd28a':'#ffffff';g.lineWidth=5;g.beginPath();g.moveTo(x0,y0);g.lineTo(x,y);g.stroke();g.fillStyle=g.strokeStyle;g.beginPath();g.arc(x,y,9,0,7);g.fill();
    font(g,26);g.fillText(lab[i],Math.min(x0,x1)+30,y0-14);if(t>=f.tGate){font(g,22,'600');g.fillStyle=STATE_COLOR[states[i]]??'#7ff5c0';g.textAlign='center';g.fillText(states[i],X[1],y0+40);g.textAlign='left';}});});
 }
 drawLog(t){const rows=LOGS.filter(l=>l.time_s<=t).slice(-12);this.tex.log.set(String(rows.length)+(rows.at(-1)?.time_s??''),(g,w,h)=>{frame(g,w,h,'LOG','every decision leaves a line');
  rows.forEach((l,i)=>{const y=170+i*58,c=l.tag==='drop'||l.tag==='ips'?'#ff8b95':l.tag==='allow'?'#7ff5c0':l.tag==='rule'?'#ffd24a':'#9fb4c8',last=i===rows.length-1;if(last){g.fillStyle='rgba(255,255,255,.06)';g.fillRect(24,y-36,w-48,52);}
   font(g,20);g.fillStyle='#5d7590';g.fillText(`${String(Math.floor(l.time_s/60)).padStart(2,'0')}:${(l.time_s%60).toFixed(2).padStart(5,'0')}`,36,y);g.fillStyle=c;font(g,21);g.fillText(`${l.tag.padEnd(6)} ${l.message}`.slice(0,96),150,y);});});}
 drawNat(t,mode){
  const snat=SESSIONS.filter(s=>s.nat&&!s.hairpin&&s.events[0][0]<=t&&t<s.closed).slice(-5),key=mode+snat.map(s=>s.id).join();
  this.tex.nat.set(key,(g,w,h)=>{frame(g,w,h,'NAT',mode==='terms'?'inside local · inside global · outside global':'translation is separate from the policy decision','#d8c2ff');
   font(g,22);g.fillStyle='#5d7590';g.fillText('inside local          inside global         outside global',40,170);
   snat.forEach((s,i)=>{const y=220+i*62,hi=mode==='snat'||mode==='snat2';font(g,25);g.fillStyle=hi?'#e8edf2':'#9fb4c8';g.fillText(`${s.orig.padEnd(21)} ${s.nat.padEnd(21)} ${s.to.split(' → ').at(-1)}`,40,y);});
   const y=h-170,hd=mode==='dnat'||mode==='dnat2';g.fillStyle=hd?'rgba(176,125,255,.2)':'rgba(255,255,255,.04)';g.fillRect(24,y-50,w-48,130);
   font(g,26,'600');g.fillStyle='#d8c2ff';g.fillText('destination NAT (port forward)',40,y);font(g,25);g.fillStyle='#e8edf2';g.fillText(`any → ${PUBLIC_IP}:443   ⇒   ${HOSTS.DMZ.ip}:443 (DMZ web)`,40,y+44);
   if(mode==='terms'){font(g,22);g.fillStyle='#ffd28a';g.fillText('inside local = real inside address · inside global = how the internet sees it',40,h-40);}});
 }
 update(t,a,tl,shot){
  const bass=a.sub_20_60_drive??0,drop=tl.drop(t),beat=60/142,rot=t/(beat*8)*Math.PI*2;
  this.halos.forEach((r,i)=>{r.rotation.z=rot*(i%2?-1:1)*(.3+.1*i);setGlow(r.material,i%2?P.orange:P.blue,.15+.35*bass+.5*drop);});
  const d=this.dots;d.begin();for(let i=0;i<900;i++){const k=i/900,ang=k*Math.PI*14+rot*(i%2?1:-1),r=3+k*30;d.push(V([r*Math.cos(ang),.04,r*Math.sin(ang)]),i%2?P.orange:P.blue,.8,null,.25+.4*bass);}d.end();
  const m=shot.mode;this.drawTable(t,m);this.drawPolicy(t,m);this.drawPacket(t,m);this.drawLadder(t,m);this.drawLog(t);this.drawNat(t,m);
 }
 camera(shot,t){
  const i=this.board(shot.camera),u=smooth(shot.start,shot.end,t),lin=clamp((t-shot.start)/(shot.end-shot.start)),p=V(boardPos(i)),toC=V([0,3.4,0]).sub(p).normalize(),side=V([toC.z,0,-toC.x]);
  const dist=lerp(5.5,4.8,u),pos=p.clone().add(toC.clone().multiplyScalar(dist)).add(side.multiplyScalar(lerp(-.5,.5,lin))).add(V([0,.3,0]));return{pos,target:p.clone().add(V([0,-.05,0])),fov:50};
 }
}
