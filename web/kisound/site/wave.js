// Shared by the site player and the film player: a three-band waveform (low inside, mid, high outside,
// mirrored around the centre line) over coloured song sections with their names on top.
const COLORS=[[/chorus|hook/i,'#ff9a3c'],[/pre-?chorus/i,'#59d8ed'],[/verse|strophe/i,'#3d8bd9'],[/bridge/i,'#b39bff'],[/intro|outro|reprise/i,'#6f8fb0'],[/.*/,'#2f4a62']];
export const sectionColor=label=>COLORS.find(([re])=>re.test(label))[1];
export function drawWave(canvas,{bins=[],sections=[],duration=1,time=0,hover=null,labels=true}){
 const r=canvas.getBoundingClientRect(),dpr=window.devicePixelRatio||1;if(!r.width)return;
 const W=Math.round(r.width*dpr),H=Math.round(r.height*dpr);if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
 const g=canvas.getContext('2d');g.setTransform(dpr,0,0,dpr,0,0);g.clearRect(0,0,r.width,r.height);
 const top=labels?14:0,h=r.height-top,mid=top+h/2,X=t=>t/duration*r.width,px=X(time);
 g.font='10px "JetBrains Mono",monospace';g.textBaseline='top';
 for(const s of sections){const x0=X(s.start),x1=X(s.end),col=sectionColor(s.label);
  g.globalAlpha=.13;g.fillStyle=col;g.fillRect(x0,top,x1-x0,h);g.globalAlpha=.55;g.fillRect(x0,top,1,h);
  if(labels&&x1-x0>34){g.globalAlpha=time>=s.start&&time<s.end?1:.7;g.fillStyle=col;g.save();g.beginPath();g.rect(x0,0,x1-x0-3,top);g.clip();g.fillText(s.label.toUpperCase(),x0+4,2);g.restore();}}
 g.globalAlpha=1;const n=bins.length,step=2;
 for(let x=0;x<r.width;x+=step){
  const b=bins[Math.min(n-1,Math.floor(x/r.width*n))];if(!b)continue;const[lo,mi,hi]=b,tot=Math.hypot(lo,mi,hi)||1e-6,amp=Math.pow(tot,.75)*(h/2-2);
  const sl=lo*lo/(tot*tot),sm=mi*mi/(tot*tot),played=x<px;
  const seg=(a0,a1,col)=>{g.fillStyle=col;g.fillRect(x,mid-amp*a1,step-.6,amp*(a1-a0));g.fillRect(x,mid+amp*a0,step-.6,amp*(a1-a0));};
  g.globalAlpha=played?1:.38;seg(0,sl,'#3d8bd9');seg(sl,sl+sm,'#59d8ed');seg(sl+sm,1,'#ffe3b8');
 }
 g.globalAlpha=1;g.fillStyle='#fff';g.fillRect(px-1,top,2,h);
 if(hover!=null){g.fillStyle='rgba(255,255,255,.5)';g.fillRect(X(hover),top,1,h);}
}
export const fmtTime=t=>Number.isFinite(t)?`${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`:'0:00';
