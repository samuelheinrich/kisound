// Finds per-track material in the videos tree: ASTRA analysis (any track) and code-video projects.
// Folders are matched by album directory and the leading track number, because some video folders
// are named differently from the music folders (09-last-hop, 02-trustsec).
import fs from 'node:fs';
import path from 'node:path';

export function videoFolders(videosRoot,albumDir){
 const root=path.join(videosRoot,albumDir),out={};if(!fs.existsSync(root))return out;
 for(const d of fs.readdirSync(root)){const m=/^(\d\d)[_-]/.exec(d);if(m&&fs.statSync(path.join(root,d)).isDirectory())out[m[1]]=path.join(root,d);}
 return out;
}
// Analysis of one language version: <project>/variants/<lang>/ASTRA-AUDIO-ANALYSE.json, else the project's own.
export function readVersionAnalysis(folder,lang){const v=folder&&path.join(folder,'variants',lang);return v&&fs.existsSync(path.join(v,'ASTRA-AUDIO-ANALYSE.json'))?readAnalysis(v):readAnalysis(folder);}
// Shot starts per version (variants/<lang>/TIMELINE.json): the player keeps the scene when the version changes.
export function versionCues(folder,lang){const f=folder&&path.join(folder,'variants',lang,'TIMELINE.json');if(!f||!fs.existsSync(f))return null;return JSON.parse(fs.readFileSync(f,'utf8')).shots.map(s=>s.start_s);}
export function readAnalysis(folder){
 const json=folder&&path.join(folder,'ASTRA-AUDIO-ANALYSE.json');if(!json||!fs.existsSync(json))return null;
 const a=JSON.parse(fs.readFileSync(json,'utf8')),png=path.join(folder,'ASTRA-AUDIO-ANALYSE.png');
 return{json,png:fs.existsSync(png)?png:null,sha256:a.source?.sha256,duration:a.summary?.duration_s,lufs:a.summary?.integrated_lufs,truePeak:a.summary?.true_peak_dbtp_rounded,
  bpm:a.tempo?.recommended_bpm,bpmConfidence:a.tempo?.confidence,centroid:a.spectrum?.mean_centroid_hz,data:a};
}
// The analysis without editorial extras: only what the film code reads at runtime.
// Early v1 files (08 MTU) keep lyrics as a plain list and name the event type `kind`; both shapes pass through.
export function slimAnalysis(a){
 const r=x=>typeof x==='number'?Math.round(x*1e4)/1e4:x;
 return{schema:a.schema??a.schema_version,source:{sha256:a.source.sha256},summary:{duration_s:a.summary.duration_s},
  tempo:{recommended_bpm:a.tempo.recommended_bpm,beat_grid:{origin_s:a.tempo.beat_grid?.origin_s}},
  events:a.events.map(({id,time_s,type,kind,lyric_id})=>({id,time_s,type:type??kind,lyric_id})),
  onsets:a.onsets.map(o=>({time_s:o.time_s,strength:r(o.strength)})),
  lyrics:{segments:(Array.isArray(a.lyrics)?a.lyrics:a.lyrics.segments).map(({id,start_s,end_s,text,section})=>({id,start_s,end_s,text,section}))},
  features_100ms:{columns:a.features_100ms.columns,rows:a.features_100ms.rows.map(row=>row.map(r))}};
}
