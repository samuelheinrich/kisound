// The editorial scenario of SHIP IT as pure functions of time: the release of album three on the own website.
// Build passes, the check finds exactly one missing cover (one underscore too many in the file name), the file is
// renamed back, the same check passes, the release commit follows; then deploy (covers, audio, lyrics counted),
// a normal reload that still shows the cached page, a hard reload, DE and EN checked, link shared, play pressed.
// Story events are tied to shots, so both versions tell the same story on their own timeline. Nothing here reads
// the audio. States follow screenplay §3 and never claim a later state early.
import {LANG,SHOT,DURATION} from './config.js';
import {clamp} from './timeline.js';
const S=id=>SHOT[id];
// absolute time: seconds after a shot start (kept inside the shot) or a fraction of the shot
export const at=(id,sec)=>{const s=S(id);return Math.min(s.start+sec,s.end-.05);};
export const af=(id,f)=>{const s=S(id);return s.start+f*(s.end-s.start);};

// ---- texts on the screen, per version (the website never translates the picture)
const STR={
 de:{prompt:'kisound-web $',release:'Release',album:'Album drei',albumN:'ALBUM 3',albumName:'Vibecoder',tracksN:'6 Tracks · DE / EN',ready:'READY',
  folders:['tracks/','covers/','audio/','lyrics/'],folderSub:['6 Tracks','6 Cover','12 WAV','12 Texte'],listHead:['Track','Fassungen','Cover'],
  build:['› 3 Alben · 6 neue Tracks · 12 Fassungen','› 41 Seiten · 12 MP3 · 18 Standbilder'],buildPass:'BUILD PASS',buildTime:'38 s',
  check:'› Seiten · Audio · Bilder · Links',missing:'✗ Cover fehlt',checkFail:'CHECK FAIL',oneError:'1 Fehler',checkPass:'CHECK PASS',zeroErrors:'0 Fehler',
  commitMsg:'Album drei: Vibecoder',files:'38 Dateien',ref:'Referenz im Build',disk:'Datei im Ordner',notFound:'nicht gefunden',found:'gefunden',
  extra:'ein Unterstrich zu viel',renamed:'zurückbenannt',same:'identisch',
  deploy:'Upload',groups:['Cover','Audio','Texte'],uploadDone:'Upload fertig',filesN:n=>`${n} Dateien`,noBrowser:'Browser noch nicht geprüft',
  reload:'Reload',hard:'Harter Reload',cache:'Cache · alter Stand',fresh:'neu geladen',
  nav:['Alben','Live-Code','Impressum'],navEn:['Albums','Live code','Imprint'],newest:'Neu',oldAlbum:'Network Engineer 02',oldSub:'Album 2 · 8 Tracks',
  albumSub:'Album 3 · 2026 · 6 Tracks',albumSubEn:'Album 3 · 2026 · 6 tracks',checked:'geprüft',
  lyricsDe:'Songtext · Originaltext auf Deutsch, nicht übersetzt',lyricsEn:'Lyrics · original German text, not translated',
  lyricLine:'Ein Unterstrich zu viel, ich benenn die Datei zurück,',lyricSame:'gleicher Text',uiChanges:'UI wechselt',
  link:'Link',copy:'Link kopieren',copied:'Link kopiert',preview:'Vorschau · erst nach Deploy',notLive:'noch nicht live',play:'Play',
  bridge:['Tracks.','Covers.','Build.','Check.','Deploy.','Reload.','Play.','Album drei.'],
  hookSub:{bcl:'BUILD. CHECK. LIVE.',drei:'ALBUM DREI',raus:'ALBUM DREI GEHT RAUS',next:'NÄCHSTES ALBUM. NÄCHSTER COMMIT.'},
  next:'Nächstes Album',nextSub:'Nächster Commit',open:'offen',released:'veröffentlicht',status:{off:'–',run:'läuft',pass:'PASS',fail:'FAIL',preview:'Ausblick',wait:'wartet'}},
 en:{prompt:'kisound-web $',release:'Release',album:'Album three',albumN:'ALBUM 3',albumName:'Vibecoder',tracksN:'6 tracks · DE / EN',ready:'READY',
  folders:['tracks/','covers/','audio/','lyrics/'],folderSub:['6 tracks','6 covers','12 WAV','12 lyrics'],listHead:['Track','Versions','Cover'],
  build:['› 3 albums · 6 new tracks · 12 versions','› 41 pages · 12 MP3 · 18 stills'],buildPass:'BUILD PASS',buildTime:'38 s',
  check:'› pages · audio · images · links',missing:'✗ cover missing',checkFail:'CHECK FAIL',oneError:'1 error',checkPass:'CHECK PASS',zeroErrors:'0 errors',
  commitMsg:'Album three: Vibecoder',files:'38 files',ref:'Reference in the build',disk:'File in the folder',notFound:'not found',found:'found',
  extra:'one underscore too many',renamed:'renamed back',same:'identical',
  deploy:'Upload',groups:['Covers','Audio','Lyrics'],uploadDone:'Upload done',filesN:n=>`${n} files`,noBrowser:'browser not checked yet',
  reload:'Reload',hard:'Hard reload',cache:'Cache · old state',fresh:'fresh load',
  nav:['Alben','Live-Code','Impressum'],navEn:['Albums','Live code','Imprint'],newest:'New',oldAlbum:'Network Engineer 02',oldSub:'Album 2 · 8 tracks',
  albumSub:'Album 3 · 2026 · 6 Tracks',albumSubEn:'Album 3 · 2026 · 6 tracks',checked:'checked',
  lyricsDe:'Songtext · Originaltext auf Englisch, nicht übersetzt',lyricsEn:'Lyrics · original English text, not translated',
  lyricLine:'One underscore too many, I rename it back,',lyricSame:'same text',uiChanges:'UI switches',
  link:'Link',copy:'Copy link',copied:'Link copied',preview:'Preview · only after deploy',notLive:'not live yet',play:'Play',
  bridge:['Tracks.','Covers.','Build.','Check.','Deploy.','Reload.','Play.','Album three.'],
  hookSub:{bcl:'BUILD. CHECK. LIVE.',drei:'ALBUM THREE',raus:'ALBUM THREE GOES OUT',next:'NEXT ALBUM. NEXT COMMIT.'},
  next:'Next album',nextSub:'Next commit',open:'open',released:'released',status:{off:'–',run:'running',pass:'PASS',fail:'FAIL',preview:'preview',wait:'waiting'}},
};
export const TXT=STR[LANG];
export const STRINGS=STR;
// the album: six tracks, cover file names as the build expects them; the one file on disk with the extra underscore
export const TRACKS=[['01','Vibecoder','VIBE','CODER'],['02','Token_Burn','TOKEN','BURN'],['03','SHIP_IT','SHIP','IT'],['04','AI_Slop','AI','SLOP'],['05','Hallucination','HALLUCI','NATION'],['06','Context_Window','CONTEXT','WINDOW']];
export const coverName=([n,name])=>`${n}_${name}_cover.png`;
export const BAD_TRACK=4,EXPECTED=coverName(TRACKS[4]),ON_DISK='05_Hallucination__cover.png',UNDERSCORE_AT=17;   // index of the extra '_' in ON_DISK (columns 0–16 match the reference)
export const MISSING_PATH=`Vibecoder/05_Hallucination/${EXPECTED}`;
export const MV_CMD=`mv ${ON_DISK} ${EXPECTED}`;
export const COMMIT_HASH='7c3e1a9';
export const URL_HOME='kisound.ch',URL_TRACK='kisound.ch/vibecoder/03-ship-it/';
export const STATIONS=['TRACKS','BUILD','CHECK','DEPLOY','LIVE'];
export const UPLOAD=[6,12,12];

// ---- events (editorial scenario times inside their shots, not measured system events)
export const TRACKS_READY=at('S003',1.0);
export const TYPE_BUILD=at('S005',.05),ENTER_BUILD=at('S005',.7),BUILD_PASS=af('S005',.78);
export const TYPE_CHECK1=at('S006',.05),ENTER_CHECK1=at('S006',.65),CHECK_FAIL=at('S006',1.45);
export const UNDERSCORE_FLASH=at('S008',.3),TYPE_MV=af('S008',.22),ENTER_MV=af('S008',.56),PATH_FIXED=ENTER_MV+.15;
export const TYPE_CHECK2=at('S009',.02),ENTER_CHECK2=at('S009',.35),CHECK_PASS=at('S009',1.15),TYPE_COMMIT=CHECK_PASS+.12,ENTER_COMMIT=af('S009',.66),COMMIT=ENTER_COMMIT+.22;
export const LIVE_PREVIEW=S('S010').start;
export const TYPE_DEPLOY=at('S016',.02),ENTER_DEPLOY=at('S016',.42),UPLOAD_START=ENTER_DEPLOY+.35,UPLOAD_DONE=af('S017',.8);
export const RELOAD1=at('S018',.55),HARD_RELOAD=at('S019',.75),NEW_PAGE=HARD_RELOAD+.35;
export const DE_OK=af('S020',.3),SWITCH_EN=af('S020',.48),EN_OK=af('S020',.84),LYRIC_SAME=af('S021',.45),LIVE_VERIFIED=af('S021',.8);
export const LINK_COPIED=at('S025',.22),PLAY=at('S026',.35),NEXT_NOTE=at('S033',.45);
export const ENTERS=[ENTER_BUILD,ENTER_CHECK1,ENTER_MV,ENTER_CHECK2,ENTER_COMMIT,ENTER_DEPLOY];
export const fmt=n=>String(n);

// ---- release state (screenplay §3)
export function releaseState(t){
 if(t>=NEXT_NOTE)return'NEXT_OPEN';if(t>=LIVE_VERIFIED)return'LIVE_VERIFIED';if(t>=NEW_PAGE)return'LIVE_CHECK';if(t>=RELOAD1)return'CACHE_OLD';if(t>=UPLOAD_DONE)return'DEPLOY_DONE';
 if(t>=CHECK_PASS)return'CHECK_PASS';if(t>=PATH_FIXED)return'PATH_FIXED';if(t>=CHECK_FAIL)return'CHECK_FAIL';if(t>=BUILD_PASS)return'BUILD_PASS';return'SOURCE_READY';
}
export const STATE_ORDER=['SOURCE_READY','BUILD_PASS','CHECK_FAIL','PATH_FIXED','CHECK_PASS','DEPLOY_DONE','CACHE_OLD','LIVE_CHECK','LIVE_VERIFIED','NEXT_OPEN'];   // LIVE_CHECK: new page loaded, DE/EN not yet checked
// station lamps: off | run | pass | fail | preview | wait
export function station(i,t){
 switch(i){
  case 0:return t<TRACKS_READY?'off':'pass';
  case 1:return t<ENTER_BUILD?'off':t<BUILD_PASS?'run':'pass';
  case 2:return t<ENTER_CHECK1?'off':t<CHECK_FAIL?'run':t<ENTER_CHECK2?'fail':t<CHECK_PASS?'run':'pass';
  case 3:return t<ENTER_DEPLOY?'off':t<UPLOAD_DONE?'run':'pass';
  default:return t<LIVE_PREVIEW?'off':t<ENTER_DEPLOY?'preview':t<NEW_PAGE?'wait':t<LIVE_VERIFIED?'run':'pass';
 }
}
export const stations=t=>STATIONS.map((_,i)=>station(i,t));
// The release package on the rail: position 0…4 (station index); it only moves on its narrative events.
const move=(t,t0,a,b,d=.6)=>t<t0?a:a+(b-a)*ease3(clamp((t-t0)/d));
const ease3=u=>u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
export function packet(t){
 let p=move(t,ENTER_BUILD+.1,0,1);p=move(t,BUILD_PASS+.05,p,2);p=move(t,CHECK_FAIL,p,1.7,.3);p=move(t,ENTER_CHECK2+.1,p,2,.4);
 p=move(t,ENTER_DEPLOY+.1,p,3,.8);p=move(t,UPLOAD_DONE+.05,p,4,.8);return p;
}
export const packetColor=t=>t>=CHECK_FAIL&&t<ENTER_CHECK2?'fail':t>=LIVE_VERIFIED?'pass':'orange';
// big Enter pad: depression 0…1 and the shock ring after each press
export function enterPress(t){let down=0,ring=0;for(const e of ENTERS){const x=t-e;if(x>=-.08&&x<.18)down=Math.max(down,x<0?1+x/.08:1-x/.18);if(x>=0&&x<.6)ring=Math.max(ring,1-x/.6);}return{down:clamp(down),ring};}
export const enterCount=t=>ENTERS.filter(e=>t>=e).length;
// upload counters: covers, audio, lyrics climb one after another and finish at UPLOAD_DONE
export function upload(t){const span=UPLOAD_DONE-UPLOAD_START,ends=[.42,.84,1];return UPLOAD.map((n,i)=>{const a=i?ends[i-1]*.55:0,b=ends[i],u=clamp((t-UPLOAD_START-a*span)/((b-a)*span));return Math.floor(n*u+1e-9);});}
export const uploaded=t=>upload(t).reduce((a,b)=>a+b,0);
// what the browser shows: the cached page until the hard reload has finished; spinner while loading
export function browser(t){const loading=(t>=RELOAD1&&t<RELOAD1+.35)||(t>=HARD_RELOAD&&t<NEW_PAGE);return{page:t>=NEW_PAGE?'new':'old',loading,lang:t>=SWITCH_EN&&t<S('S021').start?'en':'de',cacheChip:t>=RELOAD1+.35&&t<HARD_RELOAD,deOk:t>=DE_OK,enOk:t>=EN_OK};}
// the terminal: commands typed letter by letter until Enter, output lines at their events
const typed=(s,t,t0,t1)=>t<t0?null:t>=t1?s:s.slice(0,Math.max(0,Math.ceil((t-t0)/(t1-t0)*s.length)));
export function terminal(t){
 const L=[],cmd=(s,t0,t1)=>{const v=typed(s,t,t0,t1);if(v!==null)L.push({kind:'cmd',text:v,done:t>=t1,cursor:t<t1});};const out=(text,t0,kind='out')=>{if(t>=t0)L.push({kind,text});};
 cmd('npm run build',TYPE_BUILD,ENTER_BUILD);out(TXT.build[0],ENTER_BUILD+.3);out(TXT.build[1],ENTER_BUILD+.8);out(`${TXT.buildPass} · ${TXT.buildTime}`,BUILD_PASS,'pass');
 cmd('npm run check',TYPE_CHECK1,ENTER_CHECK1);out(TXT.check,ENTER_CHECK1+.25);out(TXT.missing,CHECK_FAIL-.3,'err');out(`  ${MISSING_PATH}`,CHECK_FAIL-.25,'err');out(`${TXT.checkFail} · ${TXT.oneError}`,CHECK_FAIL,'fail');
 cmd(MV_CMD,TYPE_MV,ENTER_MV);
 cmd('npm run check',TYPE_CHECK2,ENTER_CHECK2);out(TXT.check,ENTER_CHECK2+.25);out(`${TXT.checkPass} · ${TXT.zeroErrors}`,CHECK_PASS,'pass');
 cmd(`git commit -m "${TXT.commitMsg}"`,TYPE_COMMIT,ENTER_COMMIT);out(`[main ${COMMIT_HASH}] ${TXT.commitMsg} · ${TXT.files}`,COMMIT,'ok');
 cmd('npm run deploy -- --live',TYPE_DEPLOY,ENTER_DEPLOY);out(`${TXT.uploadDone} · ${TXT.filesN(uploaded(UPLOAD_DONE))} · ${TXT.noBrowser}`,UPLOAD_DONE,'pass');
 return L;
}
export const lastFail=t=>t>=CHECK_FAIL&&t<CHECK_PASS;
export const fileOnDisk=t=>t>=PATH_FIXED?EXPECTED:ON_DISK;
// the next commit: prepared, never sent
export const nextCommit=t=>t<NEXT_NOTE?null:typed('git commit -m "',t,NEXT_NOTE+.3,NEXT_NOTE+1.1);
// bridge cards: DE has no reliable word anchors (cards follow the cuts); EN uses its ASR word starts
// (EN sings no "Album three" in the bridge, so it has seven cards). DE: Tracks and Covers are clear ASR words.
const BRIDGE={en:[84.48,86.08,86.4,87.2,87.96,88.96,89.74],de:[113.0,113.68,['S028',0],['S028',.5],['S029',0],['S029',.35],['S029',.62],['S029',.85]]};
export const BRIDGE_TIMES=BRIDGE[LANG].map(x=>Array.isArray(x)?af(...x):x);
export const bridgeCards=t=>BRIDGE_TIMES.map((s,i)=>({i,text:TXT.bridge[i],start:s,on:t>=s}));
export const done=t=>t>=DURATION;
