// The capture analyser window as a pure function of time: filter bar, packet list, packet details, packet bytes and
// status bar in their usual places. Used for the single view (BEFORE) and for the BEFORE/AFTER comparison.
import {dynamicTexture} from './world.js';
import {guiState,detailTree,BLOCKS,blockLines,THESES,FINDING,NEW_TEST,HTTP_OK,CAP_STOP,outputDrops} from './model.js';
export const DW=2560,DH=1440;
const C={bg:'#0b1119',bar:'#121b26',text:'#d8e4ec',dim:'#7f97a8',sel:'#1f5fa8',tcp:'#1d2433',tls:'#1b2a24',retr:'#000000',rst:'#7a0d0d',ok:'#8fe3b8',amber:'#ffb13d',red:'#ff6b78',green:'#2a6b3a'};
const font=(g,s,w='400',f='JetBrains Mono')=>{g.font=`${w} ${s}px "${f}"`;};
// Deterministic bytes for the hex pane (the TLS payload is opaque by design).
const hex=(n,k)=>{let s='';for(let i=0;i<16;i++){const v=Math.floor(((Math.sin((n*16+i)*12.9898+k*78.233)*43758.5453)%1+1)%1*256);s+=v.toString(16).padStart(2,'0')+' ';}return s;};
export function drawGui(g,side,t,{compact=false,highlight=null}={}){
 const s=guiState(side,t),W=DW,H=DH,blink=Math.floor(t*1.6)%2;g.fillStyle=C.bg;g.fillRect(0,0,W,H);
 // title bar and capture indicator
 g.fillStyle='#070b10';g.fillRect(0,0,W,56);font(g,28,'500','Space Grotesk');g.fillStyle=C.text;g.fillText(`${side==='BEFORE'?'before':'after'}.pcapng — Wireshark · ${side==='BEFORE'?'SW-A':'SW-B'} Gi1/0/24`,24,38);
 g.textAlign='right';g.fillStyle=s.stopped?C.amber:'#ff5d6c';g.fillText(s.stopped?'■ STOPPED':(blink?'● ':'○ ')+'Aufnahme läuft',W-24,38);g.textAlign='left';
 g.fillStyle=C.bar;g.fillRect(0,56,W,46);['Datei','Bearbeiten','Ansicht','Navigation','Aufzeichnen','Analyse','Statistiken'].forEach((m,i)=>{font(g,22);g.fillStyle=C.dim;g.fillText(m,24+i*170,88);});
 // filter bar: green background once a valid display filter is applied
 const fy=108;g.fillStyle=s.filt?'#173d22':'#141c26';g.fillRect(16,fy,W-32,56);g.strokeStyle=s.filt?'#3fa85a':'#2b3a4a';g.lineWidth=3;g.strokeRect(16,fy,W-32,56);font(g,30);g.fillStyle=s.filt?'#d8ffe0':C.dim;
 const ft=s.filt||'Displayfilter anwenden … <Strg-/>',show=s.filterTyping?ft.slice(0,Math.max(1,Math.floor(((t%1.6)/1.2)*ft.length)+1)):ft;g.fillText(show,32,fy+40);
 // packet list
 const ly=176,rowH=compact?58:52;g.fillStyle='#101823';g.fillRect(0,ly,W,48);font(g,24,'600');g.fillStyle=C.dim;[['No.',24],['Time',150],['Source',340],['Destination',620],['Protocol',920],['Length',1100],['Info',1240]].forEach(([h,x])=>g.fillText(h,x,ly+33));
 const rows=[...s.rows,...s.extra];rows.forEach((r,i)=>{const y=ly+48+i*rowH;if(y>ly+48+9*rowH)return;const sel=r.no===s.sel,hl=highlight&&highlight(r);
  g.fillStyle=sel?C.sel:r.retrans?C.retr:r.rst?C.rst:r.proto.startsWith('TLS')?C.tls:C.tcp;g.fillRect(0,y,W,rowH-2);if(hl){g.strokeStyle=C.amber;g.lineWidth=4;g.strokeRect(2,y+1,W-4,rowH-4);}
  font(g,compact?28:25);g.fillStyle=r.retrans&&!sel?'#ff5d6c':r.rst&&!sel?'#fffc9c':C.text;[[String(r.no),24],[r.time,150],[r.src,340],[r.dst,620],[r.proto,920],[r.proto.startsWith('TLS')?'571':r.info.includes('Len=0')?'54':'1254',1100],[r.info,1240]].forEach(([v,x])=>g.fillText(v,x,y+rowH*.68));});
 // packet details (left) and bytes (right)
 const dy=ly+48+10*rowH+10,dh=H-dy-70;g.fillStyle='#0d141d';g.fillRect(0,dy,1420,dh);g.fillStyle='#0a1017';g.fillRect(1430,dy,W-1430,dh);
 if(s.sel){detailTree(t).forEach(([k,v],i)=>{const y=dy+50+i*(compact?50:44),tls=/Transport Layer|TLS secrets/.test(k);if(y>dy+dh-10)return;font(g,compact?28:25,i===3?'600':'400');g.fillStyle=tls?C.amber:k.startsWith(' ')?'#bcd0dc':C.text;g.fillText(`${k.startsWith(' ')?'   ':'▸ '}${k.trim()}: ${v}`,24,y);});
  for(let i=0;i<Math.floor(dh/40);i++){font(g,24);g.fillStyle=i>3?'#6c7f8e':C.dim;g.fillText(`${(i*16).toString(16).padStart(4,'0')}  ${hex(s.sel,i)}`,1450,dy+46+i*40);}
  g.fillStyle='rgba(255,177,61,.08)';g.fillRect(1440,dy+46+3*40,W-1450,dh-200);for(let x=1440;x<W;x+=26){g.strokeStyle='rgba(255,177,61,.12)';g.beginPath();g.moveTo(x,dy+170);g.lineTo(x+120,dy+dh-20);g.stroke();}font(g,22,'600');g.fillStyle=C.amber;g.fillText('TLS · verschlüsselt (keine Secrets)',1460,dy+dh-30);}
 else{font(g,26);g.fillStyle=C.dim;g.fillText('Kein Paket ausgewählt',24,dy+60);}
 // status bar
 g.fillStyle='#070b10';g.fillRect(0,H-60,W,60);font(g,26);g.fillStyle=C.text;g.fillText(`Pakete: ${s.total.toLocaleString('de-CH')} · Angezeigt: ${s.displayed.toLocaleString('de-CH')}${s.filt?` (${(s.displayed/Math.max(1,s.total)*100).toFixed(1)}%)`:''} · Verworfen: 0`,24,H-20);
 g.textAlign='right';g.fillStyle=C.dim;g.fillText('Szenario / simulierte Werte · Capturezeit ≠ Filmzeit',W-24,H-20);g.textAlign='left';
 return s;
}
export function createGui(side){const d=dynamicTexture(DW,DH);return{tex:d.tex,update(t,opts={}){const s=guiState(side,t);d.set(JSON.stringify([s.filt,s.sel,s.rows.length,s.extra.length,Math.floor(Math.min(t,CAP_STOP)*4),s.stopped,s.filterTyping?Math.floor(t*20):0,!!opts.hl]),g=>drawGui(g,side,t,opts));return s;}};}
// The comparison strip under the two panels: which byte ranges each capture contains.
export function createStrip(){const d=dynamicTexture(2560,520);return{tex:d.tex,update(t){const loc=t>=122.14,find=t>=FINDING,neu=t>=NEW_TEST+1.5,ok=t>=HTTP_OK;
 d.set(`${loc}|${find}|${neu}|${ok}|${t>=CAP_STOP}`,(g,w,h)=>{g.fillStyle='#070c12';g.fillRect(0,0,w,h);font(g,34,'600','Space Grotesk');g.fillStyle='#d8e4ec';g.fillText('Bytebereich (Client → Server, gleicher Uplink)',30,52);
  const cols=neu?[['Neuer Test 51001',true,true],['Antwort',true,ok]]:[['Seq=10801',true,true],['Seq=12001 (Original O-101)',true,false],['Seq=12001 (Retrans. O-102)',true,true],['Seq=13201',true,true]];
  font(g,30);g.fillStyle='#7f97a8';g.fillText('BEFORE',30,160);g.fillText('AFTER',30,250);
  cols.forEach(([n,b,a],i)=>{const x=300+i*560;font(g,26);g.fillStyle='#bcd0dc';g.fillText(n,x,110);for(const[row,v]of[[0,b],[1,a]]){const y=120+row*90;g.fillStyle=v?'#123a24':row===1&&!v?'#3a1018':'#1a2430';g.fillRect(x,y,520,70);g.strokeStyle=v?'#3fa85a':'#ff5d6c';g.lineWidth=3;g.strokeRect(x,y,520,70);
   const pend=neu&&!v;if(pend){g.fillStyle='#1a2430';g.fillRect(x,y,520,70);g.strokeStyle='#5f7484';g.strokeRect(x,y,520,70);}font(g,28,'600');g.fillStyle=v?'#8fe3b8':pend?'#9fb4c4':'#ff8b97';g.fillText(v?'✓ vorhanden':pend?'… ausstehend':loc?'✗ fehlt':'— leer',x+20,y+46);}});
  font(g,30,'500');g.fillStyle=find&&!neu?'#ffb13d':neu?'#8fe3b8':'#7f97a8';g.fillText(neu?(ok?'Testsegmente auf beiden Seiten · Output-Drop-Delta 0 · HTTP 200 am Client':'Neuer Test läuft – beide Seiten sehen die Segmente'):find?`Befund: Verlust am SW-A-Uplink-Ausgang · Output-Drops ${outputDrops(t)} (+18) · Capture-Drops 0`:loc?'Lücke eingegrenzt: zwischen SW-A-Ingress und SW-B-Ingress':'Sichtgrenze: eine leere Zelle ist noch kein Beweis',30,h-60);
  font(g,22);g.fillStyle='#5f7484';g.fillText('Capture-Uhren im Szenario auf ±0,1 ms abgeglichen',30,h-20);});}};}
