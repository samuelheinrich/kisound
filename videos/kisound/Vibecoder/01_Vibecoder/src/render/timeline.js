import {DURATION,SHOTS,CHAPTERS,LAST_VOCAL,FADE_CANDIDATE,GAPS,ENERGY_RISES,DROPS} from './config.js';
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const lerp=(a,b,u)=>a+(b-a)*u;
export const smooth=(a,b,t)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u);};
export const ease=u=>{u=clamp(u);return u<.5?4*u*u*u:1-(-2*u+2)**3/2;};
export function upperBound(rows,t,get=x=>x[0]){let lo=0,hi=rows.length;while(lo<hi){const m=(lo+hi)>>>1;if(get(rows[m])<=t)lo=m+1;else hi=m;}return lo;}
export class Timeline{
 constructor(analysis){
  if(analysis.schema!=='astra.audio.analysis.v1')throw Error('Analyse-Schema passt nicht');
  this.analysis=analysis;this.rows=analysis.features_100ms.rows;this.columns=analysis.features_100ms.columns;
  this.onsets=analysis.onsets;this.events=new Map(analysis.events.map(e=>[e.id,e]));
  this.shots=SHOTS.map(s=>({...s,eventIds:analysis.events.filter(e=>e.time_s>=s.start&&(e.time_s<s.end||(s.end===DURATION&&e.time_s===DURATION))).map(e=>e.id),
   lyricIds:analysis.lyrics.segments.filter(l=>l.start_s>=s.start&&l.start_s<s.end).map(l=>l.id)}));
  this.filtered=this.rows.map(r=>r.slice());
  for(const key of this.columns.filter(c=>c.endsWith('_drive')||c==='rms_dbfs')){
   const n=this.columns.indexOf(key),tau=key==='rms_dbfs'?.25:.12;
   for(let i=1;i<this.rows.length;i++){const alpha=1-Math.exp(-(this.rows[i][0]-this.rows[i-1][0])/tau);this.filtered[i][n]=lerp(this.filtered[i-1][n],this.rows[i][n],alpha);}
   for(let i=this.rows.length-2;i>=0;i--){const alpha=1-Math.exp(-(this.rows[i+1][0]-this.rows[i][0])/tau);this.filtered[i][n]=lerp(this.filtered[i+1][n],this.filtered[i][n],alpha);}
  }
  // Select a few real low-frequency onsets in visible 3D scenes. The gap
  // leaves enough uninterrupted typing between each concert-like gesture.
  const subCol=this.columns.indexOf('sub_20_60_drive');this.cheerBeats=[];let last=-99;
  for(const onset of this.onsets){const t=onset.time_s,i=clamp(upperBound(this.rows,t)-1,0,this.rows.length-1);
   const sub=Math.max(this.rows[i][subCol],this.rows[Math.min(i+1,this.rows.length-1)][subCol]);
   const shot=this.shot(t),id=Number(shot.id.slice(1));
   if(sub>.60&&onset.strength>1.25&&t-last>11&&shot.mode!=='2D'&&id>4&&id<53){this.cheerBeats.push(t);last=t;}
  }
  // The first VIBECODER call keeps the park in view despite its 2D shot label.
  // Hit the measured onset close to two seconds into that call in each mix.
  const call=this.shots.find(s=>s.id==='S021'),target=call.start+2.1;
  const firstCall=this.onsets.filter(o=>o.time_s>=call.start+1.7&&o.time_s<call.start+2.6&&o.strength>1.4)
   .sort((a,b)=>Math.abs(a.time_s-target)-Math.abs(b.time_s-target))[0];
  if(firstCall)this.cheerBeats.push(firstCall.time_s);
  this.cheerBeats.sort((a,b)=>a-b);
  // On the ride, strong bass transients trigger alternating single-arm and
  // two-arm celebrations. Keep a short gap so every gesture can finish.
  this.rideBeats=[];last=-99;
  for(const onset of this.onsets){const t=onset.time_s,shot=this.shot(t),id=Number(shot.id.slice(1));
   if(id<57||id>65||id===62||onset.strength<1.45||t-last<2.15)continue;
   if(this.sample(t).sub<.35)continue;
   this.rideBeats.push(t);last=t;
  }
 }
 shot(t){return this.shots[clamp(upperBound(this.shots,t,s=>s.start)-1,0,this.shots.length-1)];}
 chapter(t){return CHAPTERS[clamp(upperBound(CHAPTERS,t,c=>c.start)-1,0,CHAPTERS.length-1)];}
 sample(t){const i=clamp(upperBound(this.filtered,t)-1,0,this.rows.length-1),j=Math.min(i+1,this.rows.length-1),a=this.filtered[i],b=this.filtered[j],u=i===j?0:clamp((t-a[0])/(b[0]-a[0]));const out={};
  this.columns.forEach((k,c)=>out[k]=a[c]==null||b[c]==null?null:lerp(a[c],b[c],u));
  out.energy=clamp((out.rms_dbfs+34)/24);out.sub=clamp(out.sub_20_60_drive??0);out.high=clamp(out.high_6000_12000_drive??0);return out;}
 lyricAt(t){return this.analysis.lyrics.segments.find(l=>l.start_s<=t&&t<l.end_s)||null;}
 onset(t){const i=upperBound(this.onsets,t,o=>o.time_s)-1;let v=0;for(let k=Math.max(0,i-4);k<=i;k++){const o=this.onsets[k],d=t-o.time_s;if(d>=0)v=Math.max(v,clamp(o.strength/2.6)*Math.exp(-d/.12));}return v;}
 cheer(t){const i=upperBound(this.cheerBeats,t,x=>x)-1;if(i<0)return 0;const beat=this.cheerBeats[i];
  return smooth(beat,beat+.20,t)*(1-smooth(beat+.63,beat+1.12,t));}
 rideArms(t){const i=upperBound(this.rideBeats,t,x=>x)-1;if(i<0)return[0,0];
  const beat=this.rideBeats[i],lift=smooth(beat,beat+.12,t)*(1-smooth(beat+.58,beat+1.28,t));
  return i%2===0?[lift,lift]:i%4===1?[lift,0]:[0,lift];}
 accent(t){let v=0;for(const a of ENERGY_RISES){const d=t-a;if(d>=0&&d<3)v=Math.max(v,Math.exp(-d/.7));}return v;}
 drop(t){let v=0;for(const a of DROPS){const d=t-a;if(d>=0&&d<1.2)v=Math.max(v,Math.exp(-d/.32));}return v;}
 visibility(t){let k=smooth(0,.7,t)*(1-smooth(LAST_VOCAL,DURATION,t));
  for(const [a,b] of GAPS)k*=1-.18*smooth(a-.08,a+.02,t)*(1-smooth(b,b+.18,t));
  return k;}
 atmosphere(t){return 1-smooth(FADE_CANDIDATE,DURATION,t);}
}
