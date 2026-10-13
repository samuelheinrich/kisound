// The serial console (NOC laptop → SW3) as a pure function of time; B03 shows two tabs side by side.
import {dynamicTexture,wrap} from './world.js';
import {BLOCKS,blockLines,NOTES,mgmtOk,cpu,bcastRate} from './model.js';
export const DW=2560,DH=1440;
const C={bg:'#04070b',text:'#d8e7ef',dim:'#7c9aae',red:'#ff6b78',ok:'#8fe3b8',amber:'#ffb13d',yellow:'#ffd23a'};
const KC={cmd:'#f3d48a',bad:C.red,ok:C.ok,amber:C.amber,ov:'#cfe6f2',head:'#ffffff'};
const font=(g,s,w='400',f='JetBrains Mono')=>{g.font=`${w} ${s}px "${f}"`;};
const NOTE_FOR={stpcfg:'stpcfg',mgmtdead:'task',noroot:'noroot',noroot2:'noroot',task:'task',serial:'task',flashlight:'flashlight'};
export function createDisplay(){const d=dynamicTexture(DW,DH);return{tex:d.tex,update(t,mode){
 const ids=Object.entries(BLOCKS).filter(([,b])=>t>=b.lines[0][0]&&t<b.win[1]).map(([id])=>id).sort((a,b)=>BLOCKS[b].win[0]-BLOCKS[a].win[0]).slice(0,2);
 const note=ids.length?null:NOTE_FOR[mode]??null,lines=ids.map(id=>[id,blockLines(id,t)]);
 d.set(JSON.stringify([ids,note,lines.map(([i,l])=>l.map(x=>x.text)),Math.floor(t*1.6)%2,mgmtOk(t),cpu(t)]),g=>draw(g,t,ids,lines,note));return ids;}};}
function term(g,x,y,w,h,title,lines,blink,cols){g.fillStyle='#08121c';g.fillRect(x,y,w,h);g.strokeStyle='#3f6a8c';g.lineWidth=4;g.strokeRect(x+2,y+2,w-4,h-4);g.fillStyle='#10263a';g.fillRect(x,y,w,56);font(g,30,'600','Space Grotesk');g.fillStyle=C.dim;g.fillText(title,x+22,y+38);
 let yy=y+120;font(g,36);for(const l of lines){for(const part of wrap(l.text,cols)){g.fillStyle=KC[l.kind]||C.text;g.fillText(part,x+28,yy);yy+=52;}if(l.typing&&blink){g.fillStyle=C.yellow;g.fillRect(x+28+g.measureText(wrap(l.text,cols).at(-1)).width+4,yy-52-32,18,38);}}}
function draw(g,t,ids,lines,note){
 g.fillStyle=C.bg;g.fillRect(0,0,DW,DH);const blink=Math.floor(t*1.6)%2;
 font(g,30,'500');g.fillStyle=C.dim;g.fillText('NOC-Laptop · serielle Console → SW3 (9600 8N1) · unabhängig vom In-band-Netz',60,128);
 g.textAlign='right';g.fillStyle=mgmtOk(t)?C.ok:C.amber;g.fillText(mgmtOk(t)?'In-band-Management: erreichbar':'In-band-Management: Timeout',DW-60,128);g.textAlign='left';
 const b03=lines.find(([id])=>id==='B03');
 if(b03){const [_,l]=b03;term(g,60,160,1200,860,'SW3 · Tab 1',l.filter(x=>x.pane===0),blink,50);term(g,1300,160,1200,860,'SW3 · Tab 2',l.filter(x=>x.pane===1),blink,50);const other=lines.find(([id])=>id!=='B03');if(other){term(g,60,1040,2440,340,`SW3 · ${BLOCKS[other[0]].title}`,other[1].slice(-4),blink,100);}}
 else if(lines.length){const [id,l]=lines[0];term(g,60,160,2440,1190,`${id} · ${BLOCKS[id].title}`,l,blink,100);}
 else if(note){term(g,60,160,2440,1190,'Console',NOTES[note].map(text=>({text,kind:/AUFTRAG|deaktiviert/.test(text)?'amber':''})),blink,100);}
 font(g,24);g.fillStyle=C.dim;g.textAlign='right';g.fillText(`Szenario / simulierte Werte · IOS XE · CPU SW3 ${cpu(t)}% · Broadcast ${bcastRate(t).toLocaleString('de-CH')} fps`,DW-60,DH-30);g.textAlign='left';
}
