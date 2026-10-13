// Reads an album from the music repository. Read-only: the music repo is the source of truth and the
// same rules apply as in music/kisound/script/lib/album.rb (final prompt NN_*_1.0.txt, TRACK, RELEASE AUDIO).
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';

export const slugify=s=>s.normalize('NFKD').replace(/[̀-ͯ]/g,'').replace(/['’]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

// KEY: value headers up to the first block, then free-text blocks such as "LYRIC PROMPT:".
export function parsePrompt(text){
 const headers={},blocks={};let block=null;
 for(const line of text.split(/\r?\n/)){
  const blockStart=/^([A-Z][A-Z ]+ PROMPT):\s*$/.exec(line);
  if(blockStart){block=blockStart[1];blocks[block]=[];continue;}
  if(block){blocks[block].push(line);continue;}
  const h=/^([A-ZÄÖÜ][A-ZÄÖÜ ]+):\s*(.*)$/.exec(line);if(h)headers[h[1]]=h[2].trim();
 }
 for(const k of Object.keys(blocks))blocks[k]=blocks[k].join('\n').trim();
 return{headers,blocks};
}
// Lyrics as sections; a line ending in ":" or a line in [brackets] is a section label (labels are never sung).
export function parseLyrics(text){
 const sections=[];let cur=null;
 for(const raw of(text||'').split('\n')){
  const line=raw.trim();if(!line)continue;
  const bracket=/^\[([^\]]+)\]$/.exec(line);
  if(bracket||/^[A-Za-z0-9 \-]+:$/.test(line)){cur={label:bracket?bracket[1].trim():line.slice(0,-1),lines:[]};sections.push(cur);continue;}
  if(!cur){cur={label:'',lines:[]};sections.push(cur);}cur.lines.push(line);
 }
 return sections;
}
function urlTable(file){
 // markdown tables "| 06 | Title | URL |" as written by the release scripts; titles may contain escaped \|
 const out={};if(!fs.existsSync(file))return out;
 for(const line of fs.readFileSync(file,'utf8').split('\n')){const m=/^\|\s*(\d\d|album)\s*\|.*\|\s*(https?:\S+)\s*\|\s*$/.exec(line);if(m)out[m[1]]=m[2];}
 return out;
}
// candidates: track numbers that may be published before a final *_1.0.txt exists. They use their newest draft
// prompt and the audio candidate named by source_audio in the timed transcript (the same file the analysis and the
// code video were made from) and are marked as candidate.
const LANG_ORDER=['de','en'];
// Final language versions of a track: album.yml release_variants first, otherwise every final/<lang>/ folder with a
// final prompt. RELEASE AUDIO is resolved relative to the prompt's folder; only versions with existing audio count.
export function readVersions(albumRoot,tdir,meta={}){
 const found=new Map(),add=(lang,promptFile,audioHint)=>{lang=lang.toLowerCase();if(found.has(lang)||!promptFile||!fs.existsSync(promptFile))return;
  const prompt=parsePrompt(fs.readFileSync(promptFile,'utf8'));if(!/final/i.test(prompt.headers.STATUS||''))return;
  const folder=path.dirname(promptFile),rel=prompt.headers['RELEASE AUDIO'],candidates=[audioHint,rel&&path.resolve(folder,rel),rel&&path.join(folder,path.basename(rel))].filter(Boolean);
  const audio=candidates.find(f=>fs.existsSync(f))||null;if(!audio)return;
  const transcript=fs.readdirSync(folder).find(f=>/_Transkript\.json$/.test(f));
  found.set(lang,{lang,prompt,promptFile,audio,transcript:transcript?path.join(folder,transcript):null,lyrics:parseLyrics(prompt.blocks['LYRIC PROMPT']),language:prompt.headers.SPRACHE||''});};
 for(const[lang,v]of Object.entries(meta.release_variants||{}))if(v?.prompt)add(lang,path.join(albumRoot,v.prompt),v.audio?path.join(albumRoot,v.audio):null);
 const finalDir=path.join(tdir,'final');
 if(fs.existsSync(finalDir))for(const lang of fs.readdirSync(finalDir).filter(d=>/^[a-z]{2}$/i.test(d)&&fs.statSync(path.join(finalDir,d)).isDirectory())){
  const folder=path.join(finalDir,lang),prompt=fs.readdirSync(folder).find(f=>/_1\.0\.txt$/.test(f))||fs.readdirSync(folder).find(f=>/\.txt$/.test(f)&&/^RELEASE AUDIO:/m.test(fs.readFileSync(path.join(folder,f),'utf8')));
  if(prompt)add(lang,path.join(folder,prompt),null);}
 return[...found.values()].sort((a,b)=>(LANG_ORDER.indexOf(a.lang)+99)%99-(LANG_ORDER.indexOf(b.lang)+99)%99||a.lang.localeCompare(b.lang));
}
export function readAlbum(musicRoot,dir,{candidates=[]}={}){
 const root=path.join(musicRoot,dir),cfgPath=path.join(root,'album.yml');
 const cfg=fs.existsSync(cfgPath)?YAML.parse(fs.readFileSync(cfgPath,'utf8'))||{}:{};
 const trackDirs=fs.readdirSync(root).filter(d=>/^\d\d_/.test(d)&&fs.statSync(path.join(root,d)).isDirectory()).sort();
 const youtube=urlTable(path.join(root,'xx_youtube/youtube_urls.md')),soundcloud=urlTable(path.join(root,'xx_soundcloud/soundcloud_urls.md'));
 const tracks=trackDirs.map((d,index)=>{
  const tdir=path.join(root,d),number=d.slice(0,2),files=fs.readdirSync(tdir);
  const finalPrompt=files.find(f=>/_1\.0\.txt$/.test(f)),transcript=files.find(f=>/_Transkript\.json$/.test(f)),meta=cfg.tracks?.[number]||{};
  const isCandidate=!finalPrompt&&candidates.includes(number),draft=isCandidate?files.filter(f=>/_\d+\.\d+(-\d+)?\.txt$/.test(f)).sort((a,b)=>a.localeCompare(b,'en',{numeric:true})).at(-1):null;
  const promptFile=finalPrompt||draft;
  const prompt=promptFile?parsePrompt(fs.readFileSync(path.join(tdir,promptFile),'utf8')):null;
  const titleFromDir=d.slice(3).replace(/_/g,' ');
  const title=prompt?.headers.TRACK?.split(/\s+-\s+/).slice(1).join(' - ').trim()||titleFromDir;
  const audioName=isCandidate?(transcript&&JSON.parse(fs.readFileSync(path.join(tdir,transcript),'utf8')).source_audio):prompt?.headers['RELEASE AUDIO'],audio=audioName&&fs.existsSync(path.join(tdir,audioName))?path.join(tdir,audioName):null;
  const cover=files.find(f=>/[-_]cover\.(png|jpe?g)$/i.test(f));
  // Language versions (Vibecoder and later): final/<lang>/ holds one final prompt per sung language; album.yml
  // tracks.NN.release_variants names prompt and audio. A track with versions takes its title from them, its main
  // audio from the first version (German first) and lists all of them in `versions`.
  const versions=readVersions(root,tdir,meta);
  if(versions.length){const v=versions[0],vTitle=v.prompt.headers.TRACK?.split(/\s+-\s+/).slice(1).join(' - ').trim()||titleFromDir;
   return{number,index,dir:d,title:vTitle,slug:`${number}-${slugify(vTitle)}`,final:true,candidate:false,status:v.prompt.headers.STATUS||'',theme:meta.theme||v.prompt.headers.THEMA||'',style:meta.style||'',genre:meta.genre||'Electronic',tags:meta.tags||[],
    lyrics:v.lyrics,language:v.language,audio:v.audio,cover:cover?path.join(tdir,cover):null,transcript:v.transcript,versions,links:{youtube:youtube[number]||null,soundcloud:soundcloud[number]||null}};}
  return{
   number,index,dir:d,title,slug:`${number}-${slugify(title)}`,final:!!(prompt&&audio),candidate:!!(isCandidate&&prompt&&audio),versions:[],
   status:prompt?.headers.STATUS||'',theme:meta.theme||prompt?.headers.THEMA||'',style:meta.style||'',genre:meta.genre||'Electronic',tags:meta.tags||[],
   lyrics:parseLyrics(prompt?.blocks['LYRIC PROMPT']),language:prompt?.headers.SPRACHE||'',
   audio,cover:cover?path.join(tdir,cover):null,transcript:transcript?path.join(tdir,transcript):null,
   links:{youtube:youtube[number]||null,soundcloud:soundcloud[number]||null},
  };
 });
 return{
  dir,root,title:cfg.album||dir.replace(/-/g,' '),artist:cfg.artist||'',year:String(cfg.year||''),
  cover:cfg.cover&&fs.existsSync(path.join(root,cfg.cover))?path.join(root,cfg.cover):null,
  description:(cfg.youtube?.album_description||'').trim(),tracks,
  links:{youtube:youtube.album||null},
 };
}
