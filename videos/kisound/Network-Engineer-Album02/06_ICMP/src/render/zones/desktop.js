// The laptop's desktop (H, Zürich): terminal with ping/traceroute/PMTUD, a live tcpdump window that prints every packet
// leaving and every ICMP message arriving at H in tcpdump's own format, and a network window with caches and counters.
// drawDesktop() also paints the small screen of the laptop in the office.
import * as THREE from 'three';
import {V,mat,dynamicTexture,wrap} from '../world.js';
import {smooth,lerp} from '../timeline.js';
import {FLIGHTS,BLOCKS,blockLines,received,pmtu,routeX,T,ADDR} from '../model.js';
const KC={cmd:'#f3d48a',bad:'#ff6b78',ok:'#8fe3b8',amber:'#ffb13d',ov:'#9fc0d4',head:'#ffffff'};
const font=(g,s,w='400',f='JetBrains Mono')=>{g.font=`${w} ${s}px "${f}"`;};
const clock=t=>{const s=14*3600+32*60+t;const h=Math.floor(s/3600),m=Math.floor(s/60)%60,sec=(s%60);return`${h}:${String(m).padStart(2,'0')}:${sec.toFixed(3).padStart(6,'0')}`;};
// tcpdump -ni en0 'icmp or udp or tcp[tcpflags] & tcp-syn != 0' – one line per packet seen on H's interface
const SPORT={'P-M1':41234,'P-M2':41234,'P-M3':41234,'T-1':41300,'T-2':41300,'T-3':41300,'R-1':52100,'R-2':52101,'R-3':52102};
function dumpLine(f,rx){
 if(rx){if(f.type===0)return`IP ${f.src} > ${f.dst}: ICMP echo reply, id 4242, seq 1, length 64`;if(f.type===3&&f.code===4)return`IP ${f.src} > ${f.dst}: ICMP ${ADDR.D} unreachable - need to frag (mtu 1400), length 556`;
  if(f.type===11)return`IP ${f.src} > ${f.dst}: ICMP time exceeded in-transit, length 68`;if(f.type===3&&f.code===3)return`IP ${f.src} > ${f.dst}: ICMP ${ADDR.D} udp port 33436 unreachable, length 68`;
  if(f.type===5)return`IP ${f.src} > ${f.dst}: ICMP redirect ${ADDR.X} to host ${ADDR.G2}, length 68`;return'';}
 if(f.type===8)return`IP ${f.src} > ${f.dst}: ICMP echo request, id 4242, seq 1, length 64`;
 if(f.proto==='UDP')return`IP ${f.src}.${SPORT[f.id]} > ${f.dst}.${f.dport??9000}: UDP, length ${f.size?f.size-28:32}`;
 if(f.proto==='TCP')return`IP ${f.src}.${SPORT[f.id]} > ${ADDR.X}.443: Flags [S], seq 1, win 64240, length 0`;return'';
}
export function dumpLines(t){const ev=[];for(const f of FLIGHTS){if(f.src===ADDR.H&&f.t0<=t)ev.push([f.t0,dumpLine(f,false),f.kind==='icmp'?'#bff1ff':'#cfe2ee']);if(f.kind==='icmp'&&f.dst===ADDR.H&&f.t1<=t)ev.push([f.t1,dumpLine(f,true),f.type===0?'#8fe3b8':'#ffd27a']);}return ev.sort((a,b)=>a[0]-b[0]).map(([tt,s,c])=>[`${clock(tt)} ${s}`,c]);}
function win(g,x,y,w,h,title,accent){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x+10,y+14,w,h);g.fillStyle='#0b1118';g.fillRect(x,y,w,h);g.fillStyle='#1b2530';g.fillRect(x,y,w,46);
 ['#ff5f57','#febc2e','#28c840'].forEach((c,i)=>{g.fillStyle=c;g.beginPath();g.arc(x+24+i*26,y+23,8,0,7);g.fill();});font(g,22,'500','Space Grotesk');g.fillStyle='#b9c9d6';g.textAlign='center';g.fillText(title,x+w/2,y+30);g.textAlign='left';if(accent){g.fillStyle=accent;g.fillRect(x,y+46,w,3);}}
// what stays in the terminal between the screen texts: the laptop's own view of its network, then the open questions
const IDLE=[[0,[['h@laptop ~ % ip -4 addr show en0','cmd'],['    inet 192.0.2.10/24 brd 192.0.2.255 scope global en0',''],['h@laptop ~ % ip route','cmd'],['default via 192.0.2.1 dev en0',''],['192.0.2.0/24 dev en0 proto kernel scope link src 192.0.2.10',''],['h@laptop ~ % tracepath -n 198.51.100.20   # gleich mehr','ov']]],
 [43.88,[['h@laptop ~ % echo test | nc -u -w1 198.51.100.20 7777','cmd'],['(keine Anwendungsantwort)','bad'],['h@laptop ~ % # Ping ok heisst nicht: Dienst ok','ov'],['h@laptop ~ % sudo tcpdump -ni en0 icmp or udp   # läuft rechts','cmd']]],
 [98.08,[['h@laptop ~ % ip route get 198.51.100.20','cmd'],['198.51.100.20 via 192.0.2.1 dev en0 src 192.0.2.10','ok'],['    cache expires 590sec mtu 1400','amber']]],
 [136.54,[['h@laptop ~ % echo test | nc -u -w1 198.51.100.20 9000','cmd'],['(UDP-Testempfänger 9000 erreichbar)','ok'],['h@laptop ~ % ip route get 203.0.113.20','cmd'],['203.0.113.20 via 192.0.2.1 dev en0 src 192.0.2.10','']]],
 [169.62,[['h@laptop ~ % ip route get 203.0.113.20','cmd'],['203.0.113.20 via 192.0.2.2 dev en0 src 192.0.2.10','ok'],['    cache <redirected> expires 295sec','amber']]]];
export function drawDesktop(g,W,H,t){
 const S=W/2560;g.save();g.scale(S,S);
 const wp=g.createLinearGradient(0,0,2560,1440);wp.addColorStop(0,'#0e2c4f');wp.addColorStop(.55,'#1d5d92');wp.addColorStop(1,'#7fb6d8');g.fillStyle=wp;g.fillRect(0,0,2560,1440);
 g.fillStyle='rgba(255,255,255,.06)';g.beginPath();g.moveTo(0,1200);[[300,1000],[520,1120],[800,880],[1080,1090],[1340,940],[1600,1110],[1900,900],[2200,1080],[2560,960],[2560,1440],[0,1440]].forEach(([x,y])=>g.lineTo(x,y));g.fill();
 g.fillStyle='rgba(10,16,24,.72)';g.fillRect(0,0,2560,44);font(g,22,'600','Space Grotesk');g.fillStyle='#e6eef4';g.fillText(' Terminal   Shell   Bearbeiten   Darstellung   Fenster',20,30);g.textAlign='right';g.fillText(`Wi-Fi · en0 ${ADDR.H}   Zürich   ${clock(t).slice(0,5)}`,2540,30);g.textAlign='left';
 // terminal: the screen texts of the current processes
 win(g,50,80,1480,1260,'h@laptop — zsh — 120×40','#4fd8ff');const ids=Object.entries(BLOCKS).filter(([,b])=>t>=b.lines[0][0]&&t<b.win[1]).map(([id])=>id).sort((a,b)=>BLOCKS[a].win[0]-BLOCKS[b].win[0]).slice(-2);let y=170;
 if(!ids.length){const idle=IDLE.filter(([t0])=>t>=t0).at(-1)[1];for(const[l,k]of idle)for(const part of wrap(l,78)){font(g,30);g.fillStyle=KC[k]||'#d8e7ef';g.fillText(part,80,y);y+=44;}font(g,30);g.fillStyle='#8fe3b8';g.fillText('h@laptop ~ %'+(Math.floor(t*1.6)%2?' _':''),80,y);}
 for(const id of ids){font(g,22,'600');g.fillStyle='#6f8aa0';g.fillText(`# ${id} · ${BLOCKS[id].title}`,80,y);y+=48;for(const l of blockLines(id,t))for(const part of wrap(l.text,78)){font(g,30);g.fillStyle=KC[l.kind]||'#d8e7ef';g.fillText(part,80,y);y+=44;}y+=30;}
 // tcpdump: every packet at H
 win(g,1570,80,940,860,"sudo tcpdump -ni en0 icmp or udp",'#ffb13d');const dl=dumpLines(t).flatMap(([s,c])=>wrap(s,62).map(p=>[p,c])).slice(-17);dl.forEach(([s,c],i)=>{font(g,21);g.fillStyle=c;g.fillText(s,1592,160+i*45);});
 if(!dl.length){font(g,21);g.fillStyle='#6f8aa0';g.fillText('listening on en0, link-type EN10MB (Ethernet)',1592,160);}
 // network: caches and what arrived
 win(g,1570,970,940,370,'Netzwerk · H 192.0.2.10','#8fe3b8');const rx=received(t),cnt=k=>rx.filter(f=>f.type===k).length;font(g,24);
 g.fillStyle=pmtu(t)?'#8fe3b8':'#7f97a8';g.fillText(`PMTU ${ADDR.D}: ${pmtu(t)??'1500 (Link)'}`,1600,1056);g.fillStyle=routeX(t)===ADDR.G2?'#8fe3b8':'#7f97a8';g.fillText(`Route ${ADDR.X} via ${routeX(t)}`,1600,1104);
 g.fillStyle='#cfe2ee';g.fillText(`ICMP empfangen: 0/0 ×${cnt(0)}  3/x ×${cnt(3)}  11/0 ×${cnt(11)}  5/1 ×${cnt(5)}`,1600,1152);
 if(t>=94.38&&t<98.08){g.fillStyle='rgba(70,12,18,.92)';g.fillRect(1590,1180,900,140);g.strokeStyle='#ff4a5c';g.lineWidth=3;g.strokeRect(1590,1180,900,140);font(g,22,'600');g.fillStyle='#ffb0b8';g.fillText('GEGENBEISPIEL (nicht diese Strecke): ICMP 3/4 gefiltert',1610,1226);g.fillText('→ keine PMTU-Info, grosse Transfers hängen (Black Hole)',1610,1266);g.fillText('Hier kommt I-M1 an: PMTU 1400',1610,1306);}
 // dock
 g.fillStyle='rgba(230,240,248,.18)';g.fillRect(980,1366,600,64);['#4fd8ff','#ffb13d','#8fe3b8','#c9d7e1','#2f7fe0','#ff6b78'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(1000+i*96,1374,60,48);});
 font(g,18);g.fillStyle='rgba(220,232,240,.55)';g.textAlign='right';g.fillText('Szenario / simulierte Werte',2540,1360);g.textAlign='left';g.restore();
}
const DW=2560,DH=1440,SW=16,SH=SW*DH/DW,TAN=Math.tan(19.5/2*Math.PI/180);
export class DesktopZone{
 constructor(){const s=this.scene=new THREE.Scene();s.background=new THREE.Color(0x0c0f13);this.tex=dynamicTexture(DW,DH);
  const bez=new THREE.Mesh(new THREE.BoxGeometry(SW+.36,SH+.36,.25),mat(0x1b1f24,{roughness:.35,metalness:.6}));bez.position.z=-.14;s.add(bez);s.add(new THREE.Mesh(new THREE.PlaneGeometry(SW,SH),new THREE.MeshBasicMaterial({map:this.tex.tex,toneMapped:false})));}
 update(t){const key=JSON.stringify([Object.keys(BLOCKS).map(id=>blockLines(id,t).map(l=>l.text).join('|')),dumpLines(t).length,received(t).length,pmtu(t),routeX(t),Math.floor(t*1.6)%2,t>=94.38&&t<98.08,Math.floor(t/60)]);this.tex.set(key,g=>drawDesktop(g,DW,DH,t));}
 camera(shot,t){const u=smooth(shot.start,shot.end,t),d=SH*1.04/(2*TAN),k=+shot.id.slice(1)%3;const tx=[0,-2.1,3.1][k],ty=[0,.4,1.3][k];return{pos:V([tx*.5,ty*.5+lerp(.1,-.08,u),d*lerp(k?.86:1.02,k?.8:.97,u)]),target:V([tx,ty,0]),fov:19.5};}
}
