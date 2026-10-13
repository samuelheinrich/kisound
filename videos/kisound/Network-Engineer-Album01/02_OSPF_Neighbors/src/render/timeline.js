import {DURATION,SHOTS,CHAPTERS} from './config.js';
export const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
export const smooth=(a,b,t)=>{const u=clamp((t-a)/(b-a));return u*u*(3-2*u);};
export const lerp=(a,b,u)=>a+(b-a)*u;
export function upperBound(rows,t,get=x=>x[0]){let lo=0,hi=rows.length;while(lo<hi){const m=(lo+hi)>>>1;if(get(rows[m])<=t)lo=m+1;else hi=m;}return lo;}
export class Timeline{
 constructor(analysis){
  if((analysis.schema??analysis.schema_version)!=='astra.audio.analysis.v1')throw Error('Analyse-Schema passt nicht');
  this.analysis=analysis;this.rows=analysis.features_100ms.rows;this.columns=analysis.features_100ms.columns;
  this.events=new Map(analysis.events.map(e=>[e.id,e]));this.lyrics=new Map(analysis.lyrics.segments.map(l=>[l.id,l]));this.onsets=analysis.onsets;
  this.shots=SHOTS.map(s=>({...s,eventIds:analysis.events.filter(e=>e.time_s>=s.start&&(e.time_s<s.end||(s.end===DURATION&&e.type==='end'))).map(e=>e.id),lyricIds:analysis.lyrics.segments.filter(l=>l.start_s<s.end&&l.end_s>s.start).map(l=>l.id)}));
  this.filtered=this.rows.map(r=>r.slice());
  for(const key of this.columns.filter(c=>c.endsWith('_drive'))){const c=this.columns.indexOf(key);
   for(let i=1;i<this.rows.length;i++){const a=1-Math.exp(-(this.rows[i][0]-this.rows[i-1][0])/.10);this.filtered[i][c]=lerp(this.filtered[i-1][c],this.rows[i][c],a);}
   for(let i=this.rows.length-2;i>=0;i--){const a=1-Math.exp(-(this.rows[i+1][0]-this.rows[i][0])/.10);this.filtered[i][c]=lerp(this.filtered[i+1][c],this.filtered[i][c],a);}
  }
 }
 sample(t){const i=clamp(upperBound(this.filtered,t)-1,0,this.rows.length-1),j=Math.min(i+1,this.rows.length-1),a=this.filtered[i],b=this.filtered[j],u=i===j?0:clamp((t-a[0])/(b[0]-a[0]));const out={};this.columns.forEach((k,c)=>out[k]=a[c]==null||b[c]==null?null:lerp(a[c],b[c],u));out.time_s=t;out.energy=clamp((out.rms_dbfs+42)/30);return out;}
 shot(t){return this.shots[clamp(upperBound(this.shots,t,s=>s.start)-1,0,this.shots.length-1)];}
 chapter(t){return CHAPTERS[clamp(upperBound(CHAPTERS,t,c=>c.start)-1,0,CHAPTERS.length-1)];}
 event(id){return this.events.get(id);}
 lyric(id){return this.lyrics.get(id);}
 pulse(t,ids,decay=.16){let v=0;for(const id of ids){const e=this.event(id),d=e?t-e.time_s:-1;if(d>=0)v=Math.max(v,Math.exp(-d/decay));}return v;}
 attack(t){let v=0;const i=upperBound(this.onsets,t,o=>o.time_s)-1;for(let k=Math.max(0,i-3);k<=i;k++){const o=this.onsets[k];v=Math.max(v,Math.min(1,o.strength/2.3)*Math.exp(-(t-o.time_s)/.07));}return v;}
 visibility(t){return smooth(0,.7,t)*(1-smooth(178.35,DURATION,t));}
}
