// SHIP IT · two versions of the same release night. The German and the English recording have their own WAV,
// analysis, cut list and hook anchors; geometry, story and code are shared. The version is chosen once, before any
// module reads it: window.KISOUND_PAGE.lang (website), ?lang=de|en (local preview), globalThis.SHIP_IT_LANG or the
// environment variable SHIP_IT_LANG (tests, tools). Default: de.
const g=globalThis;
function pickLang(){
 const page=g.KISOUND_PAGE?.lang;if(page)return page;
 try{const q=new URLSearchParams(g.location?.search||'').get('lang');if(q)return q;}catch{}
 return g.SHIP_IT_LANG||g.process?.env?.SHIP_IT_LANG||'de';
}
export const LANG=pickLang()==='en'?'en':'de';
export const LANGS=['de','en'];
export const FPS=60;
// Measured per recording (variants/<lang>/ASTRA-AUDIO-ANALYSE.json, identical to the music repo).
// gaps: 100-ms windows below −30 dBFS (DE) or −45 dBFS (EN: the tape stops of the phonk edit); drops: sub-bass
// re-entries (mean sub_20_60_drive −1.6…−0.3 s below 0.2, −0.1…+0.6 s above dropMin); fadeStart = the end of the
// last transcribed vocal, so no late line is cut (screenplay §5); accents: measured energy rises.
export const VARIANTS={
 de:{samples:7486080,sha256:'689d662c3d10ba9bd08c787315635ff4bba6d97f8a5db54343486dd4c7958259',wav:'03_SHIP_IT_suno-v3_50_50_exakt_off_DE.wav',audio:'ship-it-de.wav',
  gaps:[[62.8,62.9],[65.2,65.3]],gapDepth:[.25,.45],gapLimit:-30,fadeStart:154.0,lastVocal:154.0,
  accents:[6.4,51.0,112.7,140.1],drops:[113.35,140.55],dropMin:.55},
 en:{samples:5792640,sha256:'fd70e12809ce18389d194a1f3829c98deced25b1c24ade5a24ae81ecf2b05408',wav:'03_SHIP_IT_suno-v3_50_50_exakt_off_EN.wav',audio:'ship-it-en.wav',
  gaps:[[1.1,1.3],[1.5,1.7],[2.0,2.1],[2.4,2.6],[2.8,3.0],[3.3,3.4],[11.9,12.0],[13.9,14.1],[49.9,50.1],[65.4,65.6],[68.8,69.0],[83.9,84.0],[95.5,95.8],[96.6,96.9],[97.0,97.3],[104.9,105.0],[113.7,114.0],[119.2,119.6]],
  gapDepth:[],gapLimit:-45,fadeStart:120.08,lastVocal:120.08,
  accents:[3.4,14.5,31.3,69.9,84.5,97.7],drops:[71.35,84.95,98.65,105.45,113.95],dropMin:.45},
};
const V=VARIANTS[LANG];
export const SAMPLES=V.samples;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV=V.wav;
export const SOURCE_SHA256=V.sha256;
export const AUDIO_FILE=V.audio;
export const ANALYSIS_PATH=`variants/${LANG}/ASTRA-AUDIO-ANALYSE.json`;
export const SEED=20261012;
export const GAPS=V.gaps,GAP_DEPTH=V.gaps.map((_,i)=>V.gapDepth[i]??.35),GAP_LIMIT=V.gapLimit,FADE_START=V.fadeStart,LAST_VOCAL=V.lastVocal,ACCENTS=V.accents,DROPS=V.drops,DROP_MIN=V.dropMin;
// Colours of the screenplay and the cover: night charcoal, warm white type, release orange, check red and pass green;
// cyan only for interface edges.
export const PALETTE={night:0x10141c,ink:0xf4f3ea,orange:0xff6534,red:0xf04d4d,pass:0xd1f85d,cyan:0x44dde5,dark:0x0b0e14};
export const HEX={night:'#10141C',ink:'#F4F3EA',orange:'#FF6534',red:'#F04D4D',pass:'#D1F85D',cyan:'#44DDE5',dark:'#0B0E14'};
// Cut list of SCHNITTLISTE.md / REGIE-CUES.json: [id, start DE, start EN, zone, mode]. Each version is cut to its own
// recording; no shot is a proportional copy of the other language.
export const CUTS=[
 ['S001',0,0,'room','3D'],['S002',8.36,0.9,'type','2D'],['S003',22.14,10.68,'desk','3D'],['S004',27.16,14.08,'screen','2D'],
 ['S005',30.26,17.5,'screen','2D'],['S006',33.76,20.92,'screen','2D'],['S007',36.94,25.2,'screen','2D'],['S008',40.38,27.56,'screen','2D'],
 ['S009',46.5,30.54,'project','hybrid'],['S010',51.32,33.96,'type','2D'],['S011',55.12,35,'project','3D'],['S012',58.34,37.4,'type','hybrid'],
 ['S013',61.44,39.92,'screen','2D'],['S014',67,44.04,'room','3D'],['S015',72,45.38,'screen','2D'],['S016',78.66,48.38,'project','3D'],
 ['S017',81.94,51.56,'screen','2D'],['S018',85.2,55.02,'screen','2D'],['S019',88.7,57.6,'screen','2D'],['S020',92.26,61.68,'screen','2D'],
 ['S021',95.38,65.18,'screen','2D'],['S022',98.78,70.02,'type','2D'],['S023',102.92,73.46,'project','3D'],['S024',105.62,77.78,'type','hybrid'],
 ['S025',109.14,80.88,'screen','2D'],['S026',110.72,81.5,'screen','2D'],['S027',113,83,'project','hybrid'],['S028',116.1,86.4,'project','3D'],
 ['S029',120.28,87.96,'project','3D'],['S030',126,90.7,'room','3D'],['S031',137.5,94.02,'type','hybrid'],['S032',140.28,96.48,'screen','2D'],
 ['S033',150.6,107.74,'desk','3D'],['S034',154,113.6,'end','3D'],
];
const col=LANG==='en'?2:1;
export const SHOTS=CUTS.map((c,i)=>({id:c[0],start:c[col],end:CUTS[i+1]?.[col]??DURATION,zone:c[3],mode:c[4]}));
export const SHOT=Object.fromEntries(SHOTS.map(s=>[s.id,s]));
// The title mark COMMIT IT. / SHIP IT. Sung hooks start at their ASR anchor (KEYWORDS.json); `until` is the end of
// the readable hold, which may continue into the next shot when that shot carries the same mark (EN S010 → S011).
// `sub` is the third line of the hook at that moment. Hooks without anchor (anchor:false) are editorial title
// moments – DE has no confirmed hook words in the long closing surface (S031) and in the intro title (S002).
const HOOKS={
 de:[['T01','S002',8.36,22.0,'raus',false],['H01','S010',51.32,55.0,'bcl',true],['H02','S011',55.12,56.9,'drei',true],['T02','S012',58.34,61.2,'drei',false],
  ['H03','S022',98.78,102.8,'bcl',true],['H04','S023',102.92,104.3,'drei',true],['T03','S024',105.62,108.9,'drei',false],['T04','S031',137.5,140.28,'bcl',false]],
 en:[['H01','S002',.9,6.8,'bcl',true],['H02','S002',6.96,10.5,'drei',true],['H03','S010',33.96,36.2,'bcl',true],['H04','S012',37.4,39.8,'drei',true],
  ['H05','S022',70.02,73.3,'bcl',true],['H06','S023',73.46,74.9,'drei',true],['T03','S024',77.78,80.7,'drei',false],['H07','S030',90.7,92.0,'bcl',true],
  ['H08','S031',94.02,96.48,'drei',true],['H09','S033',107.74,109.0,'',true]],
};
export const TITLE_HOOKS=HOOKS[LANG].map(([id,shot,start,until,sub,anchor])=>({id,shot,start,until,sub,anchor}));
// Chapters at shot boundaries, the same story beats in both versions (titles are translated by the website).
const chapters=[
 ['Der Release wartet','S001','Nacht am Rechner, fünf dunkle Stationen auf der Release-Schiene.'],
 ['COMMIT IT. SHIP IT.','S002','Die Titelmarke und Album drei als ungeöffnete Karte.'],
 ['npm run build','S003','Tracks, Cover, Audio und Lyrics liegen bereit; der Build besteht.'],
 ['Ein Unterstrich zu viel','S006','Der Check findet genau ein fehlendes Cover; ein Zeichen ist zu viel.'],
 ['Null Fehler','S009','Derselbe Check besteht; erst jetzt entsteht der Release-Commit.'],
 ['Build. Check. Live.','S010','Erster Refrain: LIVE ist noch ein Ausblick.'],
 ['Deploy','S016','Cover, Audio und Texte werden hochgeladen und gezählt.'],
 ['Harter Reload','S018','Der Browser zeigt den alten Stand, bis der Cache umgangen wird.'],
 ['DE und EN','S020','Beide Sprachen geprüft; die Lyrics bleiben im Original.'],
 ['Link und Play','S022','Zweiter Refrain: LIVE ist echt, der Link geht raus.'],
 ['Bridge','S027','Tracks, Covers, Build, Check, Deploy, Reload, Play.'],
 ['Die ganze Kette','S030','Schlussrefrain: der Release als eine Bewegung.'],
 ['Nächster Commit','S033','Der Release bleibt fertig, die nächste Aufgabe ist offen.'],
];
export const CHAPTERS=chapters.map(([title,shot,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,shot,start:SHOT[shot].start,end:a[i+1]?SHOT[a[i+1][1]].start:DURATION,action}));
// small credit (Michroma): opening room shot (DE only, EN starts with the hook) and the closing shot
export const TITLES={credit:LANG==='de'?[1.4,2.4,6.6,7.8]:null};
