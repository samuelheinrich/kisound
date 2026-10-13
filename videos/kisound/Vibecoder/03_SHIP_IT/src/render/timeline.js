import {DURATION,SHOTS,CHAPTERS,FADE_START,GAPS,GAP_DEPTH,ACCENTS,DROPS} from './config.js';
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=(a,b,t)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u);};
export const lerp=(a,b,u)=>a+(b-a)*u;
export const ease=u=>{u=clamp(u);return u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;};
export function upperBound(rows,t,get=x=>x[0]){let lo=0,hi=rows.length;while(lo<hi){const m=(lo+hi)>>>1;if(get(rows[m])<=t)lo=m+1;else hi=m;}return lo;}
export class Timeline{
 constructor(analysis){
  if((analysis.schema??analysis.schema_version)!=='astra.audio.analysis.v1')throw Error('Analyse-Schema passt nicht');
  this.analysis=analysis;this.rows=analysis.features_100ms.rows;this.columns=analysis.features_100ms.columns;
  this.events=new Map(analysis.events.map(e=>[e.id,e]));this.onsets=analysis.onsets;
  // Every curated event and every lyric start belongs to exactly one shot; the end event to the last one.
  this.shots=SHOTS.map(s=>({...s,eventIds:analysis.events.filter(e=>e.time_s>=s.start&&(e.time_s<s.end||(s.end===DURATION&&e.type==='end'))).map(e=>e.id),lyricIds:analysis.lyrics.segments.filter(l=>l.start_s>=s.start&&l.start_s<s.end).map(l=>l.id)}));
  // Fixed two-pass low-pass (about 250 ms for the level, 100 ms for the bands); the measurements stay untouched.
  this.filtered=this.rows.map(r=>r.slice());
  for(const key of this.columns.filter(c=>c.endsWith('_drive')||c==='rms_dbfs')){const c=this.columns.indexOf(key),tau=key==='rms_dbfs'?.25:.10;
   for(let i=1;i<this.rows.length;i++){const a=1-Math.exp(-(this.rows[i][0]-this.rows[i-1][0])/tau);this.filtered[i][c]=lerp(this.filtered[i-1][c],this.rows[i][c],a);}
   for(let i=this.rows.length-2;i>=0;i--){const a=1-Math.exp(-(this.rows[i+1][0]-this.rows[i][0])/tau);this.filtered[i][c]=lerp(this.filtered[i+1][c],this.filtered[i][c],a);}
  }
 }
 sample(t){const i=clamp(upperBound(this.filtered,t)-1,0,this.rows.length-1),j=Math.min(i+1,this.rows.length-1),a=this.filtered[i],b=this.filtered[j],u=i===j?0:clamp((t-a[0])/(b[0]-a[0]));const out={};this.columns.forEach((k,c)=>out[k]=a[c]==null||b[c]==null?null:lerp(a[c],b[c],u));out.time_s=t;out.energy=clamp((out.rms_dbfs+34)/24);out.sub=out.sub_20_60_drive??0;out.high=out.high_6000_12000_drive??0;return out;}
 shot(t){return this.shots[clamp(upperBound(this.shots,t,s=>s.start)-1,0,this.shots.length-1)];}
 chapter(t){return CHAPTERS[clamp(upperBound(CHAPTERS,t,c=>c.start)-1,0,CHAPTERS.length-1)];}
 event(id){return this.events.get(id);}
 lyricAt(t){return this.analysis.lyrics.segments.find(l=>t>=l.start_s&&t<l.end_s)||null;}
 attack(t){let v=0;const i=upperBound(this.onsets,t,o=>o.time_s)-1;for(let k=Math.max(0,i-3);k<=i;k++){const o=this.onsets[k];v=Math.max(v,Math.min(1,o.strength/2.6)*Math.exp(-(t-o.time_s)/.08));}return v;}
 // Measured energy rises (screenplay §5) give the light a short lift.
 accent(t){let v=0;for(const a of ACCENTS){const x=t-a;if(x>=0&&x<3)v=Math.max(v,Math.exp(-x/.6));}return v;}
 // Measured sub-bass re-entries (config DROPS): one deep impulse that decays in about 0.9 s.
 drop(t){let v=0;for(const d of DROPS){const x=t-d;if(x>=0&&x<2.5)v=Math.max(v,Math.exp(-x/.35));}return v;}
 // Measured level gaps dim the work surface briefly; the close follows the measured end fall to black.
 gap(t){let v=0;GAPS.forEach(([a,b],i)=>{v=Math.max(v,(GAP_DEPTH[i]??.4)*smooth(a-.08,a+.06,t)*(1-smooth(b,b+.18,t)));});return v;}
 visibility(t){return smooth(0,.9,t)*(1-this.gap(t))*(1-smooth(FADE_START,DURATION,t));}
}
