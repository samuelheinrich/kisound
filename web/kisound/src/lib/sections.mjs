// Song sections for the players, from the timed transcript in the music repo (the ASTRA analyses use
// the same source). Each sung section runs until the next one; long gaps become "Instrumental".
import fs from 'node:fs';
export function sectionsFromTranscript(file,duration){
 if(!file||!fs.existsSync(file))return[];
 const raw=JSON.parse(fs.readFileSync(file,'utf8')).sections||[],dur=duration||0;
 const sorted=raw.filter(s=>Number.isFinite(s.first_vocal_start)).sort((a,b)=>a.first_vocal_start-b.first_vocal_start),kept=[];
 // duplicates and overlaps from the transcription: a section that starts inside the previous one is dropped
 for(const s of sorted){const prev=kept.at(-1);if(prev&&s.first_vocal_start<prev.last_vocal_end-.5)continue;kept.push(s);}
 const out=[],push=(label,start,end)=>{if(end-start<.5)return;const last=out.at(-1);if(last&&last.label===label&&Math.abs(last.end-start)<.01)last.end=end;else out.push({label,start:+start.toFixed(2),end:+end.toFixed(2)});};
 kept.forEach((s,i)=>{
  const start=i===0&&s.first_vocal_start<5?0:s.first_vocal_start,next=kept[i+1]?.first_vocal_start??dur;
  if(i===0&&start>0)push('Intro',0,start);
  const sung=Math.min(next,s.last_vocal_end+1.5),label=s.title.includes('–')?s.title.split('–').pop().trim():s.title;
  if(next-sung>8){push(label,start,sung);push('Instrumental',sung,next);}else push(label,start,next);
 });
 if(!kept.length&&dur)push('Instrumental',0,dur);
 return out;
}
