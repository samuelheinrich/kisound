// Page templates. Plain functions returning HTML strings; every page links assets relative to the
// site root through `base` so the site also works below a sub path.
// Every page carries both languages: L(de,en) writes two spans, the head script and site.js show one
// of them (html[data-lang]). Attributes switch through data-i18n. Lyrics are never translated.
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const fmtTime=s=>s?`${Math.floor(s/60)}:${String(Math.round(s%60)).padStart(2,'0')}`:'';
const num=(x,d,loc)=>Number(x).toLocaleString(loc,{minimumFractionDigits:d,maximumFractionDigits:d});
// Text in both languages (arguments are HTML). Identical text is written once.
export const L=(de,en=de)=>de===en?de:`<span data-l="de">${de}</span><span data-l="en">${en}</span>`;
const T=(de,en)=>L(esc(de),esc(en));
// Attributes in both languages: German in the markup, both in data-i18n for the switch.
const A=attrs=>{const de=Object.entries(attrs).map(([k,[d]])=>`${k}="${esc(d)}"`).join(' ');return`${de} data-i18n="${esc(JSON.stringify(attrs))}"`;};
const kb=n=>`${Math.round(n/1024)} KB`;
const img=(base,i,alt,cls='',lazy=true)=>`<img${cls?` class="${cls}"`:''} src="${base}${i.src}" ${typeof alt==='string'?`alt="${esc(alt)}"`:A({alt})} width="${i.width}" height="${i.height}"${lazy?' loading="lazy"':''}>`;
// Data attributes that let the site player start a track from anywhere.
const audioData=(base,album,t,v=null)=>{const a=v||t;return`data-audio="${base}${a.audioUrl}" data-title="${esc(t.title)}${v?.lang?` · ${v.lang.toUpperCase()}`:''}" data-sub="${esc(`${album.artist} · ${album.title}`)}" data-cover="${base}${t.coverThumb.src}" data-wave="${base}${a.waveUrl}"${t.interactive?` data-video="${base}${t.videoUrl}${v?.lang?`?v=${v.lang}`:''}"`:''}${!v&&t.vers?.length>1?` data-versions="${esc(JSON.stringify(Object.fromEntries(t.vers.map(x=>[x.lang,{audio:base+x.audioUrl,wave:base+x.waveUrl,video:t.interactive?`${base}${t.videoUrl}?v=${x.lang}`:'',title:`${t.title} · ${x.lang.toUpperCase()}`}]))))}"`:''}`;};
const multi=t=>t.vers?.length>1;
// the languages of a track with sung versions, e.g. DE · EN
const versionBadge=t=>multi(t)?` <span class="vers-badge" ${A({title:['Zwei gesungene Fassungen','Two sung versions']})}>${t.vers.map(v=>v.lang.toUpperCase()).join(' · ')}</span>`:'';
// switch between the sung versions of a track (track page); the choice is kept for all tracks
const versionSwitch=t=>multi(t)?`<div class="version-switch" role="group" ${A({'aria-label':['Gesungene Fassung','Sung version']})}><span class="vs-label">${T('Fassung','Version')}</span>${t.vers.map(v=>`<button type="button" data-version-set="${v.lang}">${T(v.label.de,v.label.en)}</button>`).join('')}</div>`:'';
// The pieces are programs, not videos: one name for them everywhere.
const LIVE=T('Live-Code','Live code'),WATCH=T('▶ Code ansehen','▶ Watch the code');
// Tracks of an album still in production: a placeholder with the song cover instead of a live-code still.
const SOON=T('In Arbeit …','Coming soon …'),soonPill=`<span class="soon-pill">${SOON}</span>`;
// live-code cards of an album: released pieces, and placeholders for the tracks without live code (in track order)
const withSoon=(album,tracks=album.tracks)=>tracks.filter(t=>t.interactive||album.tracks.some(x=>x.interactive)).map(t=>({album,t,soon:!t.interactive}));
const codeBadge=t=>`<span class="code-badge">&lt;/&gt; ${L(`${kb(t.codeBytes)} Code · 0 B Video`,`${kb(t.codeBytes)} of code · 0 B of video`)}</span>`;
// Read before the first paint: stored choice, else the browser language (German for de-*, otherwise English).
const LANG_BOOT=`<script>(function(){var s=null;try{s=localStorage.getItem('kisound.lang')}catch(e){}var b=(navigator.languages&&navigator.languages[0])||navigator.language||'en',l=s||(/^de/i.test(b)?'de':'en');var h=document.documentElement;h.setAttribute('data-lang',l);h.lang=l==='de'?'de-CH':'en';var v=null;try{v=localStorage.getItem('kisound.version')}catch(e){}h.setAttribute('data-version',v||l);})();</script>`;
export {LANG_BOOT};

export function layout({site,base,title,description,image,share,url,body,assets}){
 const pick=v=>typeof v==='object'&&v?v:{de:v,en:v},tt=pick(title),dd=pick(description||site.tagline);
 const full=l=>tt[l]?`${tt[l]} · ${site.name}`:`${site.name} · ${site.artist}`;
 return`<!doctype html>
<html lang="de-CH" data-lang="de" data-title-de="${esc(full('de'))}" data-title-en="${esc(full('en'))}">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
${LANG_BOOT}
<title>${esc(full('de'))}</title>
<meta name="description" content="${esc(dd.de)}">
<meta name="theme-color" content="#050b13">
<link rel="canonical" href="${esc(url)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:locale" content="de_CH"><meta property="og:locale:alternate" content="en_US">
<meta property="og:title" content="${esc(share?.title||full('de'))}"><meta property="og:description" content="${esc(share?.description||dd.de)}">
<meta property="og:url" content="${esc(url)}">${image?`<meta property="og:image" content="${esc(image.url)}">${image.width?`<meta property="og:image:width" content="${image.width}"><meta property="og:image:height" content="${image.height}"><meta property="og:image:type" content="${image.type}"><meta property="og:image:alt" content="${esc(image.alt)}">`:''}
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(share?.title||full('de'))}"><meta name="twitter:description" content="${esc(share?.description||dd.de)}"><meta name="twitter:image" content="${esc(image.url)}">`:''}
<link rel="icon" href="${base}${assets.icon}">
<link rel="stylesheet" href="${base}${assets.css}">
<script type="module" src="${base}${assets.js}"></script>
</head>
<body>
<header class="top"><a class="brand" href="${base}">${esc(site.name.toUpperCase())}</a><nav><a href="${base}#live">${LIVE}</a><a href="${base}#alben">${T('Alben','Albums')}</a><a href="${base}impressum/">${T('Impressum','Imprint')}</a>
 <button id="lang-toggle" class="lang-toggle" type="button" ${A({'aria-label':['Sprache: Deutsch. Zu Englisch wechseln','Language: English. Switch to German']})}><span class="lang-de">DE</span><span class="lang-en">EN</span></button></nav></header>
<main>${body}</main>
<footer class="foot"><span>© ${new Date().getFullYear()} ${esc(site.artist)}</span><span>${T('Musik und Texte mit KI-gestützter Produktion · Live-Code mit three.js','Music and lyrics with AI-assisted production · live code with three.js')}</span><a href="${base}impressum/">${T('Impressum · Datenschutz','Imprint · Privacy')}</a></footer>
<div id="dock" hidden>
 <img id="dock-cover" alt="" width="72" height="72">
 <div id="dock-main"><div id="dock-head"><div class="dock-names"><strong id="dock-title"></strong><span id="dock-sub"></span></div><a id="dock-video" class="video-pill" hidden>${WATCH}</a><span id="dock-time"></span></div><div id="dock-wave" ${A({title:['Klicken oder ziehen zum Spulen','Click or drag to seek']})}><canvas></canvas></div></div>
 <div id="dock-ctrl"><button id="dock-back" ${A({'aria-label':['10 Sekunden zurück','Back 10 seconds']})}>↺ 10</button><button id="dock-play" aria-label="Play/Pause">▶</button><button id="dock-fwd" ${A({'aria-label':['10 Sekunden vor','Forward 10 seconds']})}>10 ↻</button></div>
 <button id="dock-close" ${A({'aria-label':['Player schliessen','Close player']})}>×</button>
</div>
</body>
</html>
`;}

// The explanation every visitor should see once: this is not a video file.
function notVideo(items){
 const avg=items.reduce((s,{t})=>s+t.codeBytes,0)/Math.max(1,items.length);
 return`<aside class="not-video"><div class="nv-mark">&lt;/&gt;</div><div><p class="nv-title">${T('Kein Video. Das ist Code.','Not a video. It is code.')}</p>
 <p>${L(`Hier wird keine Videodatei gestreamt. Ein Programm rechnet jedes Bild in diesem Moment in deinem Browser aus, aus der Zeit und einer Analyse der Musik: three.js, WebGL, rund ${kb(avg)} pro Stück. Pausieren, spulen, Bild für Bild – das Bild ist eine reine Funktion der Zeit, synchron zum Originalton. Mit Expertenmodus für Kapitel, Tempo und Cues.`,
 `No video file is streamed. A program computes every frame right now in your browser, from the clock and an analysis of the music: three.js, WebGL, about ${kb(avg)} per piece. Pause, scrub, step frame by frame – the picture is a pure function of time, locked to the original audio. With an expert mode for chapters, speed and cues.`)}</p></div></aside>`;
}
// Cards: a still computed by the code, a big play mark, "listen only" as a secondary action.
function soonCard({album,t},base){const page=`${base}${album.slug}/${t.slug}/`;
 return`<article class="video-card soon">
  <a class="video-still" href="${page}" ${A({'aria-label':[`${t.title}: in Arbeit`,`${t.title}: coming soon`]})}><img class="still-bg" src="${base}${t.coverLarge.src}" alt="" loading="lazy">${img(base,t.coverLarge,`Cover ${t.title}`,'still-cover')}<span class="still-tag soon-tag">${SOON}</span></a>
  <div class="video-meta"><div><h3><a href="${page}">${esc(t.title)}</a>${versionBadge(t)}</h3><p>${t.final?L(`Live-Code in Arbeit · ${fmtTime(t.duration)}`,`Live code coming soon · ${fmtTime(t.duration)}`):T('Track und Live-Code in Arbeit','Track and live code coming soon')}</p></div>
  ${t.final?`<div class="video-actions"><button class="ghost" ${audioData(base,album,t)}><span class="ico">▶</span> ${T('Hören','Listen')}</button></div>`:''}</div>
 </article>`;}
function liveCards(items,base){
 return`<div class="video-grid">${items.map(({album,t,soon})=>soon?soonCard({album,t},base):`<article class="video-card">
  <a class="video-still" href="${base}${t.videoUrl}" ${A({'aria-label':[`Live-Code ${t.title} ansehen`,`Watch the live code of ${t.title}`]})}>${img(base,t.poster,[`Standbild, berechnet vom Live-Code ${t.title}`,`Frame computed by the live code of ${t.title}`])}<span class="still-play">▶</span><span class="still-tag">${LIVE}</span>${codeBadge(t)}</a>
  <div class="video-meta"><div><h3><a href="${base}${album.slug}/${t.slug}/">${esc(t.title)}</a>${versionBadge(t)}</h3><p>${T(t.interactive.label,t.interactive.label_en||t.interactive.label)} · ${fmtTime(t.duration)}</p></div>
  <div class="video-actions"><a class="cta" href="${base}${t.videoUrl}">${WATCH}</a><button class="ghost" ${audioData(base,album,t)}><span class="ico">▶</span> ${T('Hören','Listen')}</button></div></div>
 </article>`).join('')}</div>`;
}

export function homePage({site,albums,base,tagline}){
 const items=albums.flatMap(album=>album.tracks.filter(t=>t.interactive).map(t=>({album,t}))),cardsLive=albums.flatMap(album=>{const w=withSoon(album);return[...w.filter(i=>!i.soon),...w.filter(i=>i.soon)];});
 const cards=albums.map(a=>`<a class="album-card" href="${base}${a.slug}/">${img(base,a.coverThumb,`Cover ${a.title}`)}<div><h3>${esc(a.title)}</h3><p>${esc(a.year)} · ${a.tracks.length} Tracks${a.interactiveCount?` · ${L(`${a.interactiveCount} Live-Code-Stücke`,`${a.interactiveCount} live code pieces`)}`:''}</p></div></a>`).join('');
 return`<section class="hero"><p class="kicker">${esc(site.artist)}</p><h1>${esc(site.name.toUpperCase())}</h1><p class="lead">${T(tagline.de,tagline.en)}</p></section>
${items.length?`<section id="live" class="videos"><h2>${T('Live-Code statt Video','Live code, not video')}</h2>${notVideo(items)}${liveCards(cardsLive,base)}</section>`:''}
<section id="alben" class="albums"><h2>${T('Alben','Albums')}</h2><div class="album-grid">${cards}</div></section>`;
}

export function albumPage({album,base}){
 const items=album.tracks.filter(t=>t.interactive).map(t=>({album,t}));
 const rows=album.tracks.map(t=>`<li class="track${t.final?'':' pending'}${t.interactive?' has-video':''}">
 ${t.final?`<button class="row-play" ${audioData(base,album,t)} ${A({'aria-label':[`${t.title} anhören`,`Listen to ${t.title}`]})}>▶</button>`:'<span class="row-play muted">·</span>'}
 ${img(base,t.coverThumb,'','t-cover')}
 <span class="t-main"><a class="t-title" href="${base}${t.interactive?t.videoUrl:`${album.slug}/${t.slug}/`}"><span class="t-num">${t.number}</span>${esc(t.title)}</a>${versionBadge(t)}${t.interactive?`<a class="t-details" href="${base}${album.slug}/${t.slug}/">${T('Details','Details')}</a>`:''}</span>
 <span class="t-genre">${esc(t.genre)}</span>${t.interactive?`<a class="video-pill" href="${base}${t.videoUrl}">▶ ${LIVE}</a>`:t.final?'<span></span>':soonPill}
 <span class="t-time">${fmtTime(t.duration)}</span></li>`).join('\n');
 return`<section class="album-head">
 ${img(base,album.coverLarge,`Cover ${album.title}`,'album-cover',false)}
 <div><p class="kicker">Album · ${esc(album.year)}</p><h1>${esc(album.title)}</h1><p class="artist">${esc(album.artist)}</p>
 <p class="lead">${T(album.descriptionI18n.de,album.descriptionI18n.en)}</p><p class="meta">${album.tracks.length} Tracks · ${fmtTime(album.tracks.reduce((s,t)=>s+(t.duration||0),0))} min${items.length?` · ${L(`${items.length} Live-Code-Stücke`,`${items.length} live code pieces`)}`:''}</p>
 <div class="actions">${items.length?`<a class="cta" href="${base}${items[0].t.videoUrl}?autoplay=1">${T('▶ Alle Live-Code-Stücke abspielen','▶ Play all live code pieces')}</a>`:''}${album.tracks.some(t=>t.final)?`<button class="${items.length?'ghost':'cta'}" data-playall>${T('Nur Audio hören','Listen to audio only')}</button>`:''}</div></div></section>
<ol class="tracklist">${rows}</ol>
${items.length?`<section id="live" class="videos"><h2>${T('Live-Code statt Video','Live code, not video')}</h2>${notVideo(items)}${liveCards(withSoon(album),base)}</section>`:''}`;
}

const LANG_NAME={de:['Deutsch','German'],en:['Englisch','English']};
// Published before the final release selection: say so on the page.
const candidateNote=t=>t.candidate?`<p class="meta candidate">${T('Vorabfassung – aktuelle Aufnahme, finale Veröffentlichung folgt.','Preview – current recording, final release to follow.')}</p>`:'';
// Facts, lyrics and links of a track: shared by the track page and the details drawer of the live player.
const factsOf=(t,a,dur)=>[[T('Genre','Genre'),esc(t.genre)],dur&&[T('Dauer','Duration'),fmtTime(dur)],a?.bpm&&[T('Tempo','Tempo'),L(`${num(a.bpm,1,'de-CH')} BPM (geschätzt)`,`${num(a.bpm,1,'en')} BPM (estimated)`)],
 a?.lufs!=null&&[T('Lautheit','Loudness'),L(`${num(a.lufs,1,'de-CH')} LUFS`,`${num(a.lufs,1,'en')} LUFS`)],a?.truePeak!=null&&['True Peak',L(`${num(a.truePeak,1,'de-CH')} dBTP`,`${num(a.truePeak,1,'en')} dBTP`)]].filter(Boolean);
const verses=ls=>ls.map(s=>`<div class="verse">${s.label?`<h4>${esc(s.label)}</h4>`:''}<p>${s.lines.map(esc).join('<br>')}</p></div>`).join('');
const lyricsBlock=(lg,ly,v)=>`<div class="lyrics" lang="${lg}"><h2>${T('Text','Lyrics')}</h2>${ly?`<p class="meta lyric-note">${L(`Originaltext auf ${LANG_NAME[lg][0]}${v?' (diese Fassung)':''}, nicht übersetzt.`,`Original lyrics in ${LANG_NAME[lg][1]}${v?' (this version)':''}, not translated.`)}</p>${ly}`:`<p class="meta">${T('Kein Text veröffentlicht.','No lyrics published.')}</p>`}</div>`;
const linksOf=t=>[t.links.youtube&&`<a href="${esc(t.links.youtube)}" rel="noopener">YouTube</a>`,t.links.soundcloud&&`<a href="${esc(t.links.soundcloud)}" rel="noopener">SoundCloud</a>`].filter(Boolean).join(' · ');
// Details drawer of the live player (fetched when it opens, so the film keeps running): base is the live page's
// base. Blocks per sung version carry data-dv; the player keeps the one it is playing.
export function trackDetails({album,track:t,base}){
 const per=fn=>multi(t)?t.vers.map(v=>`<div data-dv="${v.lang}">${fn(v)}</div>`).join(''):fn(null),links=linksOf(t);
 return`<header class="di-head">${img(base,t.coverThumb,'','di-cover')}<div><p class="di-kicker">${esc(album.title)} · Track ${t.number}</p><h2>${esc(t.title)}</h2><p class="di-artist">${esc(album.artist)}</p></div></header>${candidateNote(t)}
${t.themeI18n.en?`<h3>${T('Thema','Theme')}</h3><p>${T(t.themeI18n.de,t.themeI18n.en)}</p>`:''}
${per(v=>`<dl>${factsOf(t,v?v.analysis:t.analysis,v?v.duration:t.duration).map(([k,x])=>`<dt>${k}</dt><dd>${x}</dd>`).join('')}</dl>`)}
${t.styleI18n.en?`<h3>${T('Stil','Style')}</h3><p>${T(t.styleI18n.de,t.styleI18n.en)}</p>`:''}
${t.tags.length?`<p class="tags">${t.tags.map(x=>`<span>${esc(x)}</span>`).join('')}</p>`:''}${links?`<p class="links">${links}</p>`:''}
${t.analysisImage?per(v=>{const ai=v?.analysisImage||t.analysisImage;return`<h3>${T('Audioanalyse','Audio analysis')}</h3><a class="di-analysis" href="${base}${ai.src}" target="_blank" rel="noopener" ${A({title:['In neuem Tab vergrössern','Enlarge in a new tab']})}>${img(base,ai,[`Audioanalyse ${t.title}`,`Audio analysis ${t.title}`])}</a><p class="meta">${T('Pegel, Spektrogramm, Onsets und Schwerpunkt. Dieselbe Analyse steuert den Live-Code.','Level, spectrogram, onsets and centroid. The same analysis drives the live code.')}</p>`;}):''}
${per(v=>lyricsBlock(v?v.lyricLang:t.lyricLang,verses(v?v.lyrics:t.lyrics),v))}`;
}
export function trackPage({album,track:t,prev,next,base}){
 const per=(fn)=>multi(t)?t.vers.map(v=>`<div data-v="${v.lang}">${fn(v)}</div>`).join(''):fn(null);
 const waveBlock=t.final?per(v=>`<div class="wave-inline" ${audioData(base,album,t,v)} ${A({title:['Klicken, um ab dieser Stelle zu hören','Click to listen from here']})}><canvas></canvas></div>`):'';
 const hero=t.interactive?`<section class="film">
  <div class="film-frame"><iframe src="live/?embed=1" ${A({title:[`Live-Code ${t.title}`,`Live code ${t.title}`]})} allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe></div>
  <p class="film-note"><span class="video-pill static">&lt;/&gt; ${LIVE}</span> ${T(t.interactive.label,t.interactive.label_en||t.interactive.label)} · ${L(`kein Video: ${kb(t.codeBytes)} JavaScript rechnen jedes Bild live in deinem Browser`,`not a video: ${kb(t.codeBytes)} of JavaScript compute every frame live in your browser`)} · <a href="live/">${T('Als ganze Seite öffnen','Open full page')}</a></p></section>
  <section class="title-row">${img(base,t.coverThumb,`Cover ${t.title}`,'title-cover')}<div class="title-text"><p class="kicker">${esc(album.title)} · Track ${t.number}</p><h1>${esc(t.title)}</h1><p class="artist">${esc(album.artist)}</p>${candidateNote(t)}${versionSwitch(t)}</div>
  <div class="actions"><a class="cta" href="live/" data-live-link>${WATCH}</a><button class="ghost" ${audioData(base,album,t)}><span class="ico">▶</span> ${T('Nur hören','Listen only')}</button></div></section>${waveBlock}`
 :`<section class="listen">${img(base,t.coverLarge,`Cover ${t.title}`,'track-cover',false)}
  <div class="listen-side"><p class="kicker">${esc(album.title)} · Track ${t.number}</p><h1>${esc(t.title)}</h1><p class="artist">${esc(album.artist)}</p>${candidateNote(t)}
  ${t.final?`<div class="actions"><button class="cta" ${audioData(base,album,t)}><span class="ico">▶</span> ${T('Hören','Listen')}</button></div>`:`<p class="meta soon-note">${soonPill} ${T('Noch nicht veröffentlicht.','Not released yet.')}</p>`}</div></section>${waveBlock}`;
 const lang=t.lyricLang,lyrics=verses(t.lyrics),links=linksOf(t);
 return`<nav class="crumbs"><a href="${base}">${T('Start','Home')}</a> / <a href="${base}${album.slug}/">${esc(album.title)}</a> / ${esc(t.title)}</nav>
${hero}
${t.analysisImage?`<section class="analysis compact">${per(v=>{const ai=v?.analysisImage||t.analysisImage;return`<a class="analysis-thumb" href="${base}${ai.src}" data-zoom ${A({title:['Klicken zum Vergrössern','Click to enlarge']})}>${img(base,ai,[`Audioanalyse ${t.title}${v?' '+v.lang.toUpperCase():''}`,`Audio analysis ${t.title}${v?' '+v.lang.toUpperCase():''}`])}<span class="zoom-hint">⤢</span></a>`;})}<div><h2>${T('Audioanalyse','Audio analysis')}</h2><p class="meta">${T('Pegel, Spektrogramm, Onsets und Schwerpunkt über die ganze Länge. Automatisch gemessen; Tempo und Abschnitte sind Schätzungen. Dieselbe Analyse steuert den Live-Code.','Level, spectrogram, onsets and centroid over the whole length. Measured automatically; tempo and sections are estimates. The same analysis drives the live code.')}</p><p class="meta">${T('Klicken zum Vergrössern.','Click to enlarge.')}</p></div></section>`:''}
<section class="track-body">
 ${per(v=>lyricsBlock(v?v.lyricLang:lang,v?verses(v.lyrics):lyrics,v))}
 <aside class="facts">
  ${t.themeI18n.en?`<h2>${T('Thema','Theme')}</h2><p>${T(t.themeI18n.de,t.themeI18n.en)}</p>`:''}
  ${per(v=>`<dl>${factsOf(t,v?v.analysis:t.analysis,v?v.duration:t.duration).map(([k,x])=>`<dt>${k}</dt><dd>${x}</dd>`).join('')}</dl>`)}
  ${t.styleI18n.en?`<h3>${T('Stil','Style')}</h3><p>${T(t.styleI18n.de,t.styleI18n.en)}</p>`:''}
  ${t.tags.length?`<p class="tags">${t.tags.map(x=>`<span>${esc(x)}</span>`).join('')}</p>`:''}
  ${links?`<p class="links">${links}</p>`:''}
 </aside>
</section>
<nav class="pager">${prev?`<a href="${base}${album.slug}/${prev.slug}/">← ${esc(prev.title)}</a>`:'<span></span>'}${next?`<a href="${base}${album.slug}/${next.slug}/">${esc(next.title)} →</a>`:'<span></span>'}</nav>`;
}

export function imprintPage({site}){
 const c=site.contact||{};
 return`<section class="prose"><h1>${T('Impressum','Imprint')}</h1>
<p><strong>${esc(c.name||site.artist)}</strong>${c.address?`<br>${esc(c.address).replace(/\n/g,'<br>')}`:''}${c.email?`<br><a href="mailto:${esc(c.email)}">${esc(c.email)}</a>`:''}</p>
<h2>${T('Datenschutz','Privacy')}</h2>
<p>${T('Diese Website setzt keine Cookies, lädt keine Tracking- oder Werbedienste und bindet keine Inhalte Dritter ein. Der Webserver protokolliert technisch notwendige Zugriffsdaten. Lokal in deinem Browser gespeichert werden nur zwei Einstellungen: die Sprache und der Expertenmodus des Players.',
 'This website sets no cookies, loads no tracking or advertising services and embeds no third-party content. The web server logs technically necessary access data. Only two settings are stored locally in your browser: the language and the player’s expert mode.')}</p>
<h2>${T('Musik und Live-Code','Music and live code')}</h2>
<p>${T(`Musik und Texte: ${site.artist}, produziert mit KI-gestützter Musikgenerierung. Die Live-Code-Stücke sind keine Videos: Sie werden im Browser in Echtzeit berechnet. Schriften: Michroma, Space Grotesk, JetBrains Mono (SIL Open Font License). 3D: three.js (MIT).`,
 `Music and lyrics: ${site.artist}, produced with AI-assisted music generation. The live code pieces are not videos: they are computed in the browser in real time. Fonts: Michroma, Space Grotesk, JetBrains Mono (SIL Open Font License). 3D: three.js (MIT).`)}</p>
${site.repo?`<p class="repo"><a href="${esc(site.repo)}" rel="noopener">See how it’s built …</a> <span class="meta">${T('Quellen auf GitHub','Sources on GitHub')}: ${esc(site.repo.replace(/^https?:\/\//,''))}</span></p>`:''}</section>`;
}
