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
 }
 shot(t){return this.shots[clamp(upperBound(this.shots,t,s=>s.start)-1,0,this.shots.length-1)];}
 chapter(t){return CHAPTERS[clamp(upperBound(CHAPTERS,t,c=>c.start)-1,0,CHAPTERS.length-1)];}
 sample(t){const i=clamp(upperBound(this.filtered,t)-1,0,this.rows.length-1),j=Math.min(i+1,this.rows.length-1),a=this.filtered[i],b=this.filtered[j],u=i===j?0:clamp((t-a[0])/(b[0]-a[0]));const out={};
  this.columns.forEach((k,c)=>out[k]=a[c]==null||b[c]==null?null:lerp(a[c],b[c],u));
  out.energy=clamp((out.rms_dbfs+34)/24);out.sub=clamp(out.sub_20_60_drive??0);out.high=clamp(out.high_6000_12000_drive??0);return out;}
 lyricAt(t){return this.analysis.lyrics.segments.find(l=>l.start_s<=t&&t<l.end_s)||null;}
 onset(t){const i=upperBound(this.onsets,t,o=>o.time_s)-1;let v=0;for(let k=Math.max(0,i-4);k<=i;k++){const o=this.onsets[k],d=t-o.time_s;if(d>=0)v=Math.max(v,clamp(o.strength/2.6)*Math.exp(-d/.12));}return v;}
 accent(t){let v=0;for(const a of ENERGY_RISES){const d=t-a;if(d>=0&&d<3)v=Math.max(v,Math.exp(-d/.7));}return v;}
 drop(t){let v=0;for(const a of DROPS){const d=t-a;if(d>=0&&d<1.2)v=Math.max(v,Math.exp(-d/.32));}return v;}
 visibility(t){let k=smooth(0,.7,t)*(1-smooth(LAST_VOCAL,DURATION,t));
  for(const [a,b] of GAPS)k*=1-.18*smooth(a-.08,a+.02,t)*(1-smooth(b,b+.18,t));
  return k;}
 atmosphere(t){return 1-smooth(FADE_CANDIDATE,DURATION,t);}
}
