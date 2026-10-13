// TOKEN BURN · two versions of the same film. The German and the English recording have their own WAV,
// analysis, cut list and keyword anchors; geometry, story and code are shared. The version is chosen once,
// before any module reads it: window.KISOUND_PAGE.lang (website), ?lang=de|en (local preview),
// globalThis.TOKEN_BURN_LANG or the environment variable TOKEN_BURN_LANG (tests, tools). Default: de.
const g=globalThis;
function pickLang(){
 const page=g.KISOUND_PAGE?.lang;if(page)return page;
 try{const q=new URLSearchParams(g.location?.search||'').get('lang');if(q)return q;}catch{}
 return g.TOKEN_BURN_LANG||g.process?.env?.TOKEN_BURN_LANG||'de';
}
export const LANG=pickLang()==='en'?'en':'de';
export const LANGS=['de','en'];
export const FPS=60;
// Measured per recording (ASTRA-AUDIO-ANALYSE.json of variants/<lang>/, identical to the music repo).
export const VARIANTS={
 de:{samples:11804808,sha256:'966d9277add83aae86221f708dc00efd286b8b83c8e2afa1739847613781c9de',wav:'Token Burn - DE.wav',audio:'token-burn-de.wav',
  // level gaps (E005, E025) and the measured fall (E044 fade candidate)
  gaps:[[14.15,14.3],[141.85,142.0]],gapDepth:[.35,.45],fadeStart:240.0,lastVocal:227.84,accents:[78.8,142.3],
  keywords:[['H01','S020',78.66,79.9,80.15],['H02','S022',85.74,87.02,87.27],['H03','S036',142.26,143.22,143.56],['H04','S038',149.42,150.34,150.72],['H05','S047',188.46,189.1,189.76],['H06','S049',195.18,196.52,196.77]]},
 en:{samples:12038400,sha256:'c1cec711e9be337b18ea64cbf9e16a027207e095e1843ef6a516b404680ba73d',wav:'Token Burn - EN.wav',audio:'token-burn-en.wav',
  // the file opens with 0.25 s of near silence; E039 is the short gap in the outro, E045 the measured fall
  gaps:[[226.15,226.35]],gapDepth:[.4],fadeStart:244.8,lastVocal:234.34,accents:[96.5,153.5,226.8],
  keywords:[['H01','S020',96.48,97.58,97.83],['H02','S022',103.52,105.34,105.59],['H03','S036',153.0,153.72,154.3],['H04','S038',159.8,161.0,161.25],['H05','S047',198.56,199.24,199.86],['H06','S049',205.58,206.4,206.88]]},
};
const V=VARIANTS[LANG];
export const SAMPLES=V.samples;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV=V.wav;
export const SOURCE_SHA256=V.sha256;
export const AUDIO_FILE=V.audio;
export const ANALYSIS_PATH=`variants/${LANG}/ASTRA-AUDIO-ANALYSE.json`;
export const SEED=20251002;
export const GAPS=V.gaps,GAP_DEPTH=V.gapDepth,FADE_START=V.fadeStart,LAST_VOCAL=V.lastVocal,ACCENTS=V.accents;
// Colours of the screenplay: night blue-grey, warm white type, cyan input, orange output and TOKEN BURN,
// yellow-green for a passed result; the last chorus turns to a warm light grey with dark type.
export const PALETTE={night:0x10141c,ink:0xf4f3ea,input:0x44dde5,output:0xff6534,pass:0xd1f85d,day:0xdddfd1,dark:0x161a20};
export const HEX={night:'#10141C',ink:'#F4F3EA',input:'#44DDE5',output:'#FF6534',pass:'#D1F85D',day:'#DDDFD1',dark:'#161A20'};
// Cut list of SCHNITTLISTE.md / REGIE-CUES.json: [id, start DE, start EN, zone, mode]. The two versions are cut
// to their own recordings; no shot is a proportional copy of the other language.
export const CUTS=[
 ['S001',0,0,'room','3D'],['S002',9.18,12.68,'screen','2D'],['S003',13.14,16.64,'desk','3D'],['S004',14.3,17.9,'desk','3D'],
 ['S005',21,28,'screen','2D'],['S006',25,38.5,'project','hybrid'],['S007',28.56,45.24,'desk','3D'],['S008',32.2,49.54,'screen','2D'],
 ['S009',35.7,52.86,'screen','2D'],['S010',39.2,56.58,'project','hybrid'],['S011',42.8,60.2,'screen','2D'],['S012',46.26,63.64,'screen','2D'],
 ['S013',49.82,67.18,'project','3D'],['S014',52.92,70.66,'desk','3D'],['S015',56.56,74.5,'room','3D'],['S016',63.04,81.32,'screen','2D'],
 ['S017',66.62,84.82,'desk','3D'],['S018',70.1,88.3,'project','hybrid'],['S019',73.7,91.88,'screen','2D'],['S020',78.66,96.48,'type','2D'],
 ['S021',82.56,99.86,'screen','2D'],['S022',85.74,103.52,'type','hybrid'],['S023',89.14,106.9,'screen','2D'],['S024',92.7,110.82,'screen','2D'],
 ['S025',96.16,114.34,'desk','3D'],['S026',100.84,117,'project','3D'],['S027',107.9,120.1,'screen','2D'],['S028',115.08,123.32,'room','3D'],
 ['S029',118.68,128.88,'project','hybrid'],['S030',122.16,132.4,'screen','2D'],['S031',125.48,135.88,'screen','2D'],['S032',128.58,139.42,'ledger','2D'],
 ['S033',132.1,142.94,'desk','3D'],['S034',135.96,146.48,'screen','2D'],['S035',139.88,149.62,'project','hybrid'],['S036',142.26,153,'type','3D'],
 ['S037',145.82,156.14,'ledger','2D'],['S038',149.42,159.8,'type','hybrid'],['S039',152.6,163.18,'screen','2D'],['S040',156.16,166.9,'project','3D'],
 ['S041',159.68,170.58,'desk','3D'],['S042',164.28,173.08,'room','3D'],['S043',171.58,182.3,'desk','3D'],['S044',175.12,185.66,'screen','2D'],
 ['S045',178.66,188.98,'desk','hybrid'],['S046',182.22,192.48,'room','3D'],['S047',188.46,198.56,'type','2D'],['S048',191.68,201.7,'screen','2D'],
 ['S049',195.18,205.58,'type','hybrid'],['S050',198.58,208.68,'project','3D'],['S051',202.06,212.42,'screen','2D'],['S052',205.54,216.04,'desk','3D'],
 ['S053',209.98,218.42,'room','3D'],['S054',215.6,225.64,'screen','2D'],['S055',223.26,232.58,'desk','hybrid'],['S056',227.84,234.34,'room','3D'],
 ['S057',234,239.3,'exterior','3D'],['S058',240,244.8,'end','2D'],
];
const col=LANG==='en'?2:1;
export const SHOTS=CUTS.map((c,i)=>({id:c[0],start:c[col],end:CUTS[i+1]?.[col]??DURATION,zone:c[3],mode:c[4]}));
export const SHOT=Object.fromEntries(SHOTS.map(s=>[s.id,s]));
// Six title hits per version: ASR anchors of KEYWORDS.json; the picture may stand longer than the word.
export const KEYWORDS=V.keywords.map(([id,shot,start,vocalEnd,visualEnd])=>({id,shot,start,vocalEnd,visualEnd}));
// Chapters at shot boundaries, the same story beats in both versions (titles are translated by the website).
const chapters=[
 ['Nur ein Regler','S001','Ein heller Bildschirm in der Nacht, eine kleine Änderungsnotiz.'],
 ['01:00','S007','Der erste Build läuft; ein Bassregler und ein zweiter Klang kommen dazu.'],
 ['Bassspur leer','S011','Nach Reload fehlt die Bassreihe; eine Zeile im Ladepfad fehlt.'],
 ['02:00','S014','Derselbe Test besteht. Die Hand bleibt an der Tastatur.'],
 ['Token Burn','S020','Erster Refrain: Noch ein Prompt, ein Tab zu, zwei neue.'],
 ['Der Stand von eben','S026','Drei gespeicherte Projektstände und ein freier Platz.'],
 ['03:00 · Export','S028','Der Export lässt die Bassspur weg; die Reparatur prüft 64 Schritte.'],
 ['Nutzungsjournal','S032','Input, Output, Summe und fiktive Demo-Credits je Auftrag.'],
 ['Noch ein Prompt','S035','Zweiter Refrain: Die Schrift wird räumlich.'],
 ['Kalter Kaffee','S042','Das Fenster wird hell, die Antwort wird gelesen.'],
 ['Tageslicht','S047','Dritter Refrain im Morgenlicht, alles hat dieselbe Version.'],
 ['Preset speichern','S054','Der nächste Auftrag wird abgesendet und läuft weiter.'],
 ['Morgen','S056','Zurück durch das Fenster; der Cursor bleibt.'],
];
export const CHAPTERS=chapters.map(([title,shot,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,shot,start:SHOT[shot].start,end:a[i+1]?SHOT[a[i+1][1]].start:DURATION,action}));
export const TITLES={credit:[1.2,2.2,7.2,8.4]};
