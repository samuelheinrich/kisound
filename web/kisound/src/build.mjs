// kisound.ch build: reads music/kisound (songs, covers, prompts, album.yml) and videos/kisound
// (analyses, code videos), writes a static site to dist/. The sources are only read, never written.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import * as esbuild from 'esbuild';
import {readAlbum} from './lib/music.mjs';
import {videoFolders,readAnalysis,readVersionAnalysis,versionCues} from './lib/videos.mjs';
import {Media,publish,sha} from './lib/media.mjs';
import {sectionsFromTranscript} from './lib/sections.mjs';
import {buildInteractive} from './lib/interactive.mjs';
import {renderPosters} from './lib/posters.mjs';
import {collageCard,trackCard,renderCards,W as SHARE_W,H as SHARE_H} from './lib/share.mjs';
import {layout,homePage,albumPage,trackPage,trackDetails,imprintPage} from './lib/html.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'site.config.json'),'utf8'));
const music=path.resolve(root,config.sources.music),videos=path.resolve(root,config.sources.videos);
const dist=path.join(root,'dist'),cache=path.join(root,'.cache'),media=new Media(cache);
const offsets=fs.existsSync(path.join(root,'audio-offsets.json'))?JSON.parse(fs.readFileSync(path.join(root,'audio-offsets.json'),'utf8')):{};
const site=config.site,warnings=[],started=Date.now();
// Second language for texts from the sources (album.yml is English, the site config German). Lyrics stay as written.
const i18n=JSON.parse(fs.readFileSync(path.join(root,'i18n/content.json'),'utf8'));
const tagline={de:site.tagline,en:i18n.site?.tagline?.en||site.tagline};
const lyricLang=t=>/deutsch|german|^de/i.test(t.language||'')?'de':'en';
const LANG_NAMES={de:{de:'Deutsch',en:'German'},en:{de:'Englisch',en:'English'}};
const log=s=>console.log(s);
const hash=c=>crypto.createHash('sha256').update(c).digest('hex').slice(0,10);

fs.rmSync(dist,{recursive:true,force:true});fs.mkdirSync(path.join(dist,'assets/fonts'),{recursive:true});
const writeAsset=(rel,name,ext,content)=>{const file=`${name}.${hash(content)}.${ext}`;fs.mkdirSync(path.join(dist,rel),{recursive:true});fs.writeFileSync(path.join(dist,rel,file),content);return rel?`${rel}/${file}`:file;};
// site script: bundled with the shared waveform drawer
const siteJs=(await esbuild.build({entryPoints:[path.join(root,'site/site.js')],bundle:true,format:'esm',minify:true,target:['es2020','safari15'],write:false})).outputFiles[0].contents;
const assets={css:writeAsset('assets','site','css',fs.readFileSync(path.join(root,'site/site.css'))),js:writeAsset('assets','site','js',siteJs),icon:writeAsset('assets','icon','svg',fs.readFileSync(path.join(root,'site/icon.svg')))};
for(const f of fs.readdirSync(path.join(root,'site/fonts')))fs.copyFileSync(path.join(root,'site/fonts',f),path.join(dist,'assets/fonts',f));
const write=(rel,html)=>{const file=path.join(dist,rel,'index.html');fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,html);};
const baseFor=rel=>rel?'../'.repeat(rel.split('/').filter(Boolean).length):'';
const urlFor=rel=>`${site.url}/${rel}`.replace(/\/+$/,'/');
// image in its real aspect ratio: webp at the given width, plus its pixel size for width/height attributes
const pic=(src,width,rel,name,q)=>{const out=media.image(src,width,q);return{src:`${rel}/${publish(out,dist,rel,name)}`,...media.dims(out)};};

const manifest={built_at:new Date().toISOString(),albums:[]},albums=[],posterJobs=[];
// The live pages learn the hashed catalog name only after all albums are read: a mark, replaced at the end.
const CATALOG_MARK='__KISOUND_CATALOG__';
for(const entry of config.albums.filter(a=>a.publish)){
 const album=readAlbum(music,entry.dir,{candidates:entry.candidates||[]}),folders=videoFolders(videos,entry.dir),dir=entry.slug;
 album.slug=dir;log(`\n${album.title} (${album.tracks.length} Tracks)`);
 album.descriptionI18n={en:i18n.albums?.[dir]?.description?.en||album.description,de:i18n.albums?.[dir]?.description?.de||album.description};
 // External links only where site.config.json allows them (the YouTube uploads are still private).
 for(const t of[album,...album.tracks])for(const k of Object.keys(t.links))if(!entry.links?.[k])t.links[k]=null;
 if(!album.cover)warnings.push(`${entry.dir}: kein Albumcover in album.yml`);
 const coverSrc=album.cover||album.tracks.find(t=>t.cover)?.cover;
 album.coverLarge=pic(coverSrc,1000,dir,'cover');album.coverThumb=pic(coverSrc,520,dir,'cover-520');
 album.ogImage=`${dir}/${publish(media.jpeg(coverSrc,1200),dist,dir,'og')}`;
 const albumManifest={dir:entry.dir,slug:dir,tracks:[]};
 for(const t of album.tracks){
  const rel=`${dir}/${t.slug}`,folder=folders[t.number],analysis=readAnalysis(folder);t.analysis=analysis;
  const tr=i18n.tracks?.[`${dir}/${t.number}`]||{};t.themeI18n={en:tr.theme?.en||t.theme,de:tr.theme?.de||t.theme};t.styleI18n={en:tr.style?.en||t.style,de:tr.style?.de||t.style};t.lyricLang=lyricLang(t);
  const cover=t.cover||coverSrc;t.coverLarge=pic(cover,900,rel,'cover');t.coverThumb=pic(cover,240,rel,'cover-240');
  t.ogImage=`${rel}/${publish(media.jpeg(cover,1200),dist,rel,'og')}`;
  const tm={number:t.number,slug:t.slug,final:t.final,...(t.candidate?{candidate:true}:{})};
  if(t.final){
   // one audio, waveform, lyric timing and analysis per language version (a single version keeps the old file names)
   const multi=t.versions?.length>1,list=t.versions?.length?t.versions:[{lang:null,audio:t.audio,transcript:t.transcript,lyrics:t.lyrics,language:t.language}];t.vers=[];
   for(const v of list){
    const sfx=multi?`-${v.lang}`:'',va=multi?readVersionAnalysis(folder,v.lang):analysis,wavSha=sha(v.audio);if(va&&va.sha256!==wavSha)warnings.push(`${t.dir}${sfx}: Analyse gehört nicht zur Release-WAV`);
    const audioFile=publish(media.audio(v.audio,config.audio),dist,rel,'audio'+sfx),duration=va?.duration||media.duration(v.audio);
    const w=JSON.parse(fs.readFileSync(media.wave(v.audio),'utf8'));w.sections=sectionsFromTranscript(v.transcript,duration);
    const segs=v.transcript?(JSON.parse(fs.readFileSync(v.transcript,'utf8')).segments||[]).filter(x=>x.text&&Number.isFinite(x.start)).map(x=>[+x.start.toFixed(2),+x.end.toFixed(2),x.text.trim()]):[];
    const vl=lyricLang(v),lyricsUrl=segs.length?writeAsset(rel,'lyrics'+sfx,'json',JSON.stringify({lang:vl,segments:segs})):null;
    t.vers.push({lang:v.lang,label:v.lang?LANG_NAMES[v.lang]??{de:v.lang.toUpperCase(),en:v.lang.toUpperCase()}:null,audio:v.audio,wavSha,audioFile,audioUrl:`${rel}/${audioFile}`,duration,analysis:va,waveUrl:writeAsset(rel,'wave'+sfx,'json',JSON.stringify(w)),sections:w.sections.length,
     lyrics:v.lyrics,lyricLang:vl,lyricsUrl,analysisImage:va?.png?pic(va.png,1600,rel,'analyse'+sfx,80):null});
   }
   const p=t.vers[0];Object.assign(t,{audioFile:p.audioFile,audioUrl:p.audioUrl,duration:p.duration,waveUrl:p.waveUrl,analysis:p.analysis,lyricLang:p.lyricLang});
   Object.assign(tm,{wav:path.relative(music,p.audio),wav_sha256:p.wavSha,audio:p.audioUrl,duration_s:p.duration,sections:p.sections});
   if(multi)tm.versions=t.vers.map(v=>({lang:v.lang,wav:path.relative(music,v.audio),wav_sha256:v.wavSha,audio:v.audioUrl,duration_s:v.duration,sections:v.sections}));
  }
  if(t.vers?.[0]?.analysisImage)t.analysisImage=t.vers[0].analysisImage;else if(t.analysis?.png)t.analysisImage=pic(t.analysis.png,1600,rel,'analyse',80);
  const spec=entry.interactive?.[t.number];
  if(spec&&t.final){
   const project=path.join(videos,entry.dir,spec.project);if(!fs.existsSync(project))throw Error(`Videoprojekt fehlt: ${project}`);
   const offset=offsets[t.audioUrl]??0;for(const v of t.vers)if(!(v.audioUrl in offsets))warnings.push(`${t.dir}${v.lang?' '+v.lang:''}: Audio-Versatz noch nicht gemessen (npm run check)`);
   const p=t.vers[0],multi=t.vers.length>1,posterOf=lang=>lang&&spec[`poster_${lang}`]!=null?spec[`poster_${lang}`]:spec.poster;
   // language versions: the live page chooses one before the film loads (?v=, stored choice, else the site language)
   const versions=multi?Object.fromEntries(t.vers.map(v=>[v.lang,{audio:`../${v.audioFile}`,audioOffset:offsets[v.audioUrl]??0,wave:`../${path.basename(v.waveUrl)}`,lyrics:v.lyricsUrl?`../${path.basename(v.lyricsUrl)}`:null,
     analysis:spec.analysis===false?null:v.analysis?.data,posterTime:posterOf(v.lang),label:v.label,cues:versionCues(folder,v.lang),duration:v.duration}])):null;
   // track details for the player's drawer: the track page without leaving the film
   const details=writeAsset(rel,'details','json',JSON.stringify({html:trackDetails({album,track:t,base:baseFor(rel+'/live')})}));
   const r=await buildInteractive({project,outDir:path.join(dist,rel,'live'),spec,audioFile:`../${p.audioFile}`,audioOffset:offset,wave:`../${path.basename(p.waveUrl)}`,versions,
    extra:{lyrics:p.lyricsUrl?`../${path.basename(p.lyricsUrl)}`:null,catalog:CATALOG_MARK,base:baseFor(rel+'/live'),trackKey:rel,details:`../${path.basename(details)}`},
    analysis:spec.analysis===false||multi?null:p.analysis?.data,
    meta:{title:t.title,subtitle:`${album.artist} · ${album.title}`,artist:album.artist,album:album.title,artwork:`../${path.basename(t.coverThumb.src)}`,site:site.name,icon:`${baseFor(rel+'/live')}${assets.icon}`,
     kicker:{de:`Live-Code · ${spec.label}`,en:`Live code · ${spec.label_en||spec.label}`},chapterNames:i18n.chapters?.[spec.project]||{},
     description:`Live-Code (kein Video) zu „${t.title}“ von ${album.artist}: ${spec.label}.${multi?` Fassungen: ${t.vers.map(v=>v.label.de).join(' und ')}.`:''} Jedes Bild wird im Browser berechnet.`}});
   t.interactive=spec;t.codeBytes=r.bytes;t.videoUrl=`${rel}/live/`;posterJobs.push({t,rel,url:`${rel}/live/${multi?`?v=${p.lang}`:''}`,js:r.js,time:posterOf(p.lang)??60});
   Object.assign(tm,{interactive:spec.project,bundle_bytes:r.bytes,audio_offset_s:offset,copied:r.copies});if(multi)tm.versions.forEach(v=>v.audio_offset_s=offsets[v.audio]??0);log(`  ${t.number} ${t.title}: Live-Code (${(r.bytes/1024).toFixed(0)} KB JS${r.copies.length?`, ${r.copies.join(', ')}`:''})`);
  }else log(`  ${t.number} ${t.title}${t.final?(t.candidate?' (Vorabfassung)':''):' (in Arbeit)'}`);
  albumManifest.tracks.push(tm);
 }
 album.interactiveCount=album.tracks.filter(t=>t.interactive).length;albums.push(album);manifest.albums.push(albumManifest);
}
// Catalog for the overview and autoplay inside the live player: albums in site order, tracks with live and detail URLs.
{const catalog={albums:albums.map(a=>({title:a.title,slug:a.slug,url:`${a.slug}/`,cover:a.coverThumb.src,tracks:a.tracks.filter(t=>t.final).map(t=>({n:t.number,title:t.title,key:`${a.slug}/${t.slug}`,page:`${a.slug}/${t.slug}/`,live:t.interactive?t.videoUrl:null,
  label:t.interactive?{de:t.interactive.label,en:t.interactive.label_en||t.interactive.label}:null,cover:t.coverThumb.src,dur:Math.round(t.duration||0),...(t.vers?.length>1?{versions:t.vers.map(v=>v.lang)}:{})}))}))};
 const file=writeAsset('assets','catalog','json',JSON.stringify(catalog));
 for(const a of albums)for(const t of a.tracks)if(t.interactive){const f=path.join(dist,t.videoUrl,'index.html');fs.writeFileSync(f,fs.readFileSync(f,'utf8').replace(CATALOG_MARK,`${baseFor(t.videoUrl)}${file}`));}
 log(`Katalog für den Player: ${file}`);}
// Video stills need the built film pages, so they come before the HTML that shows them.
if(posterJobs.length){const files=await renderPosters(posterJobs,cache);posterJobs.forEach((j,i)=>{j.t.posterFile=files[i];j.t.poster={src:`${j.rel}/${publish(files[i],dist,j.rel,'still')}`,...media.dims(files[i])};});log(`\n${posterJobs.length} Standbilder aus dem Live-Code`);}
// Link previews: a collage of live code frames for home and albums, one card per piece.
const fontsDir=path.join(root,'site/fonts'),liveTracks=albums.flatMap(a=>a.tracks.filter(t=>t.posterFile).map(t=>({a,t})));
const shareJobs=[{kind:'home',html:collageCard({stills:liveTracks.map(x=>x.t.posterFile),fontsDir,count:liveTracks.length})},
 ...liveTracks.map(({a,t})=>({kind:'track',t,rel:`${a.slug}/${t.slug}`,html:trackCard({still:t.posterFile,fontsDir,title:t.title,label:`Live code · ${t.interactive.label_en||t.interactive.label}`,kb:Math.round(t.codeBytes/1024),album:a.title})}))];
const shareFiles=liveTracks.length?await renderCards(shareJobs,cache):[];
const shareImg=(file,rel,alt)=>({url:urlFor(`${rel?rel+'/':''}${publish(file,dist,rel,'share')}`),width:SHARE_W,height:SHARE_H,type:'image/jpeg',alt});
const homeShare=shareFiles[0]?shareImg(shareFiles[0],'','KISOUND – live code, not video: frames computed in the browser by the live code pieces of Samuel Heinrich'):null;
shareJobs.forEach((j,i)=>{if(j.kind==='track')j.t.share=shareImg(shareFiles[i],j.rel,`${j.t.title} – live code, not a video`);});
if(shareFiles.length)log(`${shareFiles.length} Link-Vorschaubilder`);
const kb=n=>Math.round(n/1024);
for(const album of albums){
 const dir=album.slug;
 write(dir,layout({site,base:baseFor(dir),title:album.title,description:album.descriptionI18n,image:homeShare??{url:urlFor(album.ogImage)},
  share:{title:`${album.title} · ${album.artist}`,description:`${album.interactiveCount} live code pieces, not videos: every frame computed in your browser. · ${album.interactiveCount} Live-Code-Stücke statt Videos, berechnet im Browser.`},url:urlFor(`${dir}/`),assets,body:albumPage({album,base:baseFor(dir)})}));
 album.tracks.forEach((t,i)=>{const rel=`${dir}/${t.slug}`,base=baseFor(rel);
  write(rel,layout({site,base,title:`${t.title} · ${album.title}`,description:t.themeI18n,image:t.share??{url:urlFor(t.ogImage)},
   share:t.interactive?{title:`${t.title} · kisound`,description:`Live code: ${t.interactive.label_en||t.interactive.label} – ${kb(t.codeBytes)} KB of code, 0 B of video. · Live-Code: ${t.interactive.label} – berechnet im Browser.`}:null,url:urlFor(`${rel}/`),assets,body:trackPage({album,track:t,prev:album.tracks[i-1],next:album.tracks[i+1],base})}));});
}
write('',layout({site,base:'',title:'',description:tagline,image:homeShare??(albums[0]&&{url:urlFor(albums[0].ogImage)}),
  share:{title:'KISOUND · Samuel Heinrich – Live code, not video',description:`${tagline.en}: ${liveTracks.length} live code pieces, every frame computed in your browser. · ${tagline.de}: ${liveTracks.length} Live-Code-Stücke statt Videos.`},url:urlFor(''),assets,body:homePage({site,albums,base:'',tagline})}));
write('impressum',layout({site,base:'../',title:{de:'Impressum',en:'Imprint'},image:homeShare,description:{de:'Impressum und Datenschutz',en:'Imprint and privacy'},url:urlFor('impressum/'),assets,body:imprintPage({site})}));
if(!site.contact?.email)warnings.push('Impressum: E-Mail in site.config.json ergänzen');if(!site.contact?.address)warnings.push('Impressum: keine Postadresse (site.contact.address) – für ein Schweizer Impressum üblich');
fs.copyFileSync(path.join(root,'server/htaccess'),path.join(dist,'.htaccess'));
fs.writeFileSync(path.join(dist,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`);
const pages=['',...albums.flatMap(a=>[`${a.slug}/`,...a.tracks.flatMap(t=>[`${a.slug}/${t.slug}/`,...(t.interactive?[`${a.slug}/${t.slug}/live/`]:[])])]),'impressum/'];
fs.writeFileSync(path.join(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p=>`<url><loc>${urlFor(p)}</loc></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(dist,'build-manifest.json'),JSON.stringify(manifest,null,1)+'\n');
const size=d=>fs.readdirSync(d,{withFileTypes:true}).reduce((s,e)=>s+(e.isDirectory()?size(path.join(d,e.name)):fs.statSync(path.join(d,e.name)).size),0);
log(`\n${pages.length} Seiten, ${(size(dist)/1e6).toFixed(1)} MB in dist/ · ${((Date.now()-started)/1000).toFixed(1)} s`);
for(const w of warnings)console.warn(`Hinweis: ${w}`);
