// Regenerate the delivered cue sheets from the rendered timeline and the approved screenplay.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const self=fileURLToPath(import.meta.url),root=path.resolve(path.dirname(self),'../..');
if(!process.env.VIBECODER_LANG){
 for(const lang of ['de','en'])execFileSync(process.execPath,[self],{env:{...process.env,VIBECODER_LANG:lang},stdio:'inherit'});
 process.exit(0);
}
const C=await import('../render/config.js'),M=await import('../render/model.js');
const {Timeline}=await import('../render/timeline.js');
const analysis=JSON.parse(fs.readFileSync(path.join(root,C.ANALYSIS_PATH),'utf8'));
const screenplay=JSON.parse(fs.readFileSync(path.join(root,'REGIE-CUES.json'),'utf8'));
const tl=new Timeline(analysis),lang=C.LANG;
const tc=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${(t%60).toFixed(3).padStart(6,'0')}`;
const shots=tl.shots.map((s,i)=>{
 const p=screenplay.shots[i],state=M.filmState((s.start+s.end)/2);
 if(p.id!==s.id||p.starts_s[lang]!==s.start||p.ends_s[lang]!==s.end)throw Error(`Drehbuch und Code weichen bei ${s.id} ab`);
 return{id:s.id,chapter:s.chapter,start_s:s.start,end_s:s.end,zone:s.zone,mode:s.mode,title:s.title,
  action:p.action,camera:p.camera,transition:p.transition,event_ids:s.eventIds,lyric_ids:s.lyricIds,
  state:{clock:state.clock,catalog:state.catalog,pattern:state.pattern,app:state.app,artifacts:state.artifacts,next_open:state.nextOpen}};
});
const out={schema:'kisound.vibecoder01.implementation-cues.v1',language:lang,source_wav:C.SOURCE_WAV,
 source_sha256:C.SOURCE_SHA256,samples:C.SAMPLES,duration_s:C.DURATION,fps:C.FPS,frames:C.FRAMES,
 fade_candidate_s:C.FADE_CANDIDATE,last_vocal_end_s:C.LAST_VOCAL,gaps_s:C.GAPS,drops_s:C.DROPS,
 chapters:C.CHAPTERS,shots};
const dir=path.join(root,'variants',lang);
fs.writeFileSync(path.join(dir,'UMSETZUNG-CUES.json'),JSON.stringify(out,null,2)+'\n');
// The website maps DE/EN playback positions through these exact shot starts.
const timeline={schema:'kisound.video.timeline.v1',language:lang,duration_s:C.DURATION,fps:C.FPS,frames:C.FRAMES,
 source_audio_sha256:C.SOURCE_SHA256,shots:shots.map(s=>({id:s.id,zone:s.zone,mode:s.mode,start_s:s.start_s,end_s:s.end_s}))};
fs.writeFileSync(path.join(dir,'TIMELINE.json'),JSON.stringify(timeline,null,2)+'\n');
const md=[`# VIBECODER ${lang.toUpperCase()} · Umsetzung und Cues`,'',
 'Aus `REGIE-CUES.json` und dem aktuellen Filmcode erzeugt (`npm run cues`). Zeiten ab Sample 0 der jeweiligen finalen WAV.','',
 `**${shots.length} Einstellungen**, ${C.CHAPTERS.length} Kapitel, ${analysis.events.length} Messereignisse und ${analysis.lyrics.segments.length} Transkriptsegmente. ${C.FRAMES} Frames bei ${C.FPS} fps; letztes Gesangsende ${tc(C.LAST_VOCAL)}, Audioende ${tc(C.DURATION)}.`,'',
 '## Kapitel','', '| Kapitel | Start | Ende | Titel |','| --- | ---: | ---: | --- |',
 ...C.CHAPTERS.map(c=>`| ${c.id} | ${tc(c.start)} | ${tc(c.end)} | ${c.title} |`),'',
 '## Einstellungen','', '| ID | Start–Ende | Ebene | Bild und überprüfbarer Zustand | Analyse |',
 '| --- | --- | --- | --- | --- |',
 ...shots.map(s=>`| ${s.id} | ${tc(s.start_s)}–${tc(s.end_s)} | ${s.zone} / ${s.mode} | ${s.title}; ${s.state.clock}, Katalog ${s.state.catalog}, Klang ${s.state.pattern}, Tool ${s.state.app} | ${s.event_ids.join(', ')||'–'} · ${s.lyric_ids.join(', ')||'–'} |`),'',
 'Die Aktionen, Kameravorgaben und Übergänge stehen pro Einstellung in der JSON-Datei. Die EN-Stelle 03:23,740–03:27,700 bleibt ohne wörtliche Einblendung, bis die WAV von Hand geprüft ist.',''];
fs.writeFileSync(path.join(dir,'UMSETZUNG-CUES.md'),md.join('\n'));
console.log(`${lang.toUpperCase()}: ${shots.length} Einstellungen, ${analysis.events.length} Events, ${analysis.lyrics.segments.length} Lyrics`);
