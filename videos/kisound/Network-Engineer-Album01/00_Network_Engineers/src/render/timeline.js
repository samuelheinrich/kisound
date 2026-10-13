import { DURATION, SHOTS, CHAPTERS, FADE_START } from './config.js';
export const clamp = (x,a=0,b=1) => Math.max(a,Math.min(b,x));
export const smooth = (a,b,t) => { const x=clamp((t-a)/(b-a)); return x*x*(3-2*x); };
export const lerp = (a,b,x) => a+(b-a)*x;
export function upperBound(rows, t, get = x=>x[0]) {
  let lo=0,hi=rows.length;
  while(lo<hi){const m=(lo+hi)>>>1;if(get(rows[m])<=t)lo=m+1;else hi=m;}return lo;
}
export class Timeline {
  constructor(analysis) {
    if(analysis.schema !== 'astra.audio.analysis.v1' && analysis.schema_version !== 'astra.audio.analysis.v1')
      throw new Error('Nicht unterstütztes Analyse-Schema');
    this.analysis=analysis; this.rows=analysis.features_100ms.rows; this.columns=analysis.features_100ms.columns;
    this.events=new Map(analysis.events.map(e=>[e.id,e]));
    this.lyrics=new Map(analysis.lyrics.segments.map(s=>[s.id,s]));
    this.onsets=analysis.onsets;
    this.drives=this.columns.filter(c=>c.endsWith('_drive'));
    // A fixed two-pass low-pass is computed once, never accumulated per rendered frame.
    // Only animation drive columns are smoothed. Published measurements stay untouched.
    this.filtered=this.rows.map(r=>r.slice());
    for(const key of this.drives){
      const c=this.columns.indexOf(key);
      for(let i=1;i<this.rows.length;i++){
        const dt=this.rows[i][0]-this.rows[i-1][0],a=1-Math.exp(-dt/0.10);
        this.filtered[i][c]=lerp(this.filtered[i-1][c],this.rows[i][c],a);
      }
      for(let i=this.rows.length-2;i>=0;i--){
        const dt=this.rows[i+1][0]-this.rows[i][0],a=1-Math.exp(-dt/0.10);
        this.filtered[i][c]=lerp(this.filtered[i+1][c],this.filtered[i][c],a);
      }
    }
    for(const s of SHOTS){
      for(const id of s.eventIds)if(!this.events.has(id))throw new Error(`Event fehlt: ${id}`);
      for(const id of s.lyricIds)if(!this.lyrics.has(id))throw new Error(`Lyric fehlt: ${id}`);
    }
  }
  event(id){return this.events.get(id);}
  lyric(id){return this.lyrics.get(id);}
  sample(t){
    const rows=this.filtered;const b=upperBound(rows,t);
    const i=clamp(b-1,0,rows.length-1),j=Math.min(i+1,rows.length-1);
    const f=i===j?0:clamp((t-rows[i][0])/(rows[j][0]-rows[i][0]));
    const out={};this.columns.forEach((key,c)=>{out[key]=rows[i][c]==null||rows[j][c]==null?null:lerp(rows[i][c],rows[j][c],f);});
    out.time_s=t;out.energy=clamp((out.rms_dbfs+42)/30);return out;
  }
  pulse(t, ids, decay=.22){
    let v=0;for(const id of ids){const e=this.event(id);if(e){const d=t-e.time_s;if(d>=0&&d<decay*8)v=Math.max(v,Math.exp(-d/decay));}}return v;
  }
  shot(t){return SHOTS[clamp(upperBound(SHOTS,t,s=>s.start)-1,0,SHOTS.length-1)];}
  chapter(t){return CHAPTERS[clamp(upperBound(CHAPTERS,t,s=>s.start)-1,0,CHAPTERS.length-1)];}
  beat(t){const g=this.analysis.tempo;const b=(t-g.beat_grid.origin_s)*g.recommended_bpm/60;return{index:Math.floor(b),phase:b-Math.floor(b),status:'synthetisch; Phase geschätzt'};}
  visibility(t){return smooth(0,1.4,t)*(1-smooth(FADE_START,DURATION,t));}
  network(t){
    // Narrative network states, not measurements of a real network.
    const fault=smooth(57.52,59.36,t), recovered=smooth(70.98,72.86,t);
    return { fault, recovered, alarm:fault*(1-recovered), reserve:smooth(55.52,57.52,t),
      failover:smooth(59.36,67.18,t), verified:smooth(108.16,124,t), online:1-fault*(1-recovered) };
  }
}
