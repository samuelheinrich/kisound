export const FPS=60;
export const SAMPLES=6672008;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV='08_MTU_0.2-2.wav';
export const SOURCE_SHA256='23491387e4f9c2740fafcc48bde924377e5de66f63fc423ae743d02fde03e75d';
export const TRANSCRIPT_SHA256='e4e28e0e9c421c226e84999da448e9714cdcd7ad11caccd4cf5cabe9813ac1da';
export const SEED=135008;
// Cover colours: night blue, electric blue rings, orange path; data core magenta, ICMP amber.
export const PALETTE={ink:0x061226,navy:0x0e2440,steel:0x1f4466,blue:0x2fa8ff,cyan:0x59e3ff,orange:0xff9a3c,data:0xff4fd8,icmp:0xffb534,drop:0xff4f5e,ok:0x3fe6a0,tunnel:0x9b7dff,paper:0xeef3f8,white:0xdaeaf0,lab:0xe9eef4};
// Structural re-entries from the curated events (the sub band pumps on almost every bar, so only these count).
export const DROPS=[16.01,48.0,104.88,122.64];
// 100-ms gap at 5.15–5.25 s: the first silent drop.
export const GAP=[5.15,5.25];
export const FADE_START=137.8;
export const TITLES={intro:[13.0,14.2,20.8,22.0],outro:[133.24,134.4,137.4,137.8]};
// Lyric sections from the transcript (the analysis carries the lines without sections).
export const LYRIC_SECTIONS=[['Intro',0],['Verse',23.28],['Pre-Chorus',37.02],['Chorus',49.34],['Hook',61.58],['Verse 2',76.0],['Break',90.52],['Final Chorus',105.7]];
const chapters=[
 ['Die Grenze',0,'Ein grosses Paket fährt an eine kaum sichtbare Grenze und verschwindet in der Pegellücke. Die Rückmeldung stirbt leise an der Firewall.'],
 ['Alles erreichbar',12.8,'Übersicht: Ping geht hin und zurück, kleine Pakete passieren den Tunnel. Der Retransmit wartet und scheitert wieder.'],
 ['Ein Byte zu viel',23.28,'Messhalle: 1401 gegen 1400 Bytes, Header und Nutzlast, DF=1. Dann der stille Drop im Pfad, der Upload steht.'],
 ['Kleine Tests täuschen',37.02,'Ping geht, das grosse Paket stirbt; tracepath endet im Nichts; ein 1400-Byte-Test passt; das Tor wird sichtbar.'],
 ['Das Tor bekommt einen Namen',43.7,'Kontur gegen Kontur: 100 Bytes Überstand. Der Rahmen rastet ein.'],
 ['M-T-U',48.0,'Anflug auf das Tor, M-T-U leuchtet rot, das Paket scheitert. Rückzug: die Engstelle ist winzig im ganzen Netz.'],
 ['Don’t fragment',61.58,'DF-Klammer, enger Korridor von oben, gestrandetes Paket, Vorschau kleinerer Pakete am Sender.'],
 ['Die Hüllen',76.0,'Tunnel-Overhead: IPsec-Hülle und MPLS-Labels. Das ICMP-„Fragmentation needed“ entsteht und wird an der Firewall verschluckt.'],
 ['Vermessen',90.52,'1400 passt, 1500 nicht, Jumbo nur im eigenen Netz, Path MTU = kleinster Rahmen. Freigabe für ICMP Typ 3/4; der Sender lernt 1400.'],
 ['Jetzt passt es',104.88,'Gleicher Anflug wie im ersten Chorus, gleiche Torgrösse: neue 1400-Byte-Pakete fliegen durch. Der Upload wird fertig.'],
 ['Finale',117.8,'Schwebe am Tor, letzte lange Fahrt durch den Tunnel, Titel; das letzte Paket passiert auf dem letzten Impuls.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Absolute editorial cuts [start, zone, camera, mode, target]. Lyric times are never snapped to the beat grid.
// Targets: 'f:<id>' a flight to ride with.
const cuts=[
 [0,'path','opening','intro','f:D0'],[3.88,'path','gateside','intro','f:D0'],[7.44,'path','fw','quiet','f:I0'],[11.38,'path','host','waits'],
 [12.8,'path','wide','build'],[16.01,'path','chase','build','f:P2'],[19.65,'path','receiver','build'],[22.0,'path','gate','build'],
 [23.28,'lab','front','byte'],[26.92,'lab','explode','header'],[30.88,'lab','macro','df'],[33.76,'path','gateside','drop','f:D2'],[35.64,'path','host','pain'],
 [37.02,'path','chase','pre','f:P3'],[38.12,'path','gateside','pre','f:D3'],[38.94,'path','flyby','pre','f:P4'],[40.0,'path','fw','hides'],[40.66,'path','xray','trace'],
 [41.76,'lab','front','lower'],[42.54,'path','gate','fault'],
 [43.7,'lab','front','measure'],
 [48.0,'path','ride','chorus','f:D4'],[50.88,'path','gateside','chorus','f:D4'],[52.52,'path','gate','chorus'],[53.12,'lab','macro','readout'],
 [54.98,'path','gateside','big','f:D5'],[56.98,'path','wide2','small'],[58.08,'path','pathline','find'],
 [61.58,'lab','macro','dfhook'],[62.76,'lab','seams','dfhook'],[65.4,'path','topdown','narrow'],[68.28,'path','gateside','stranded','f:D6'],[68.7,'lab','seams','dfhook'],
 [70.35,'path','ride','hook','f:D7'],[72.46,'lab','rebuild','preview'],
 [76.0,'lab','explode','encap'],[79.78,'lab','orbit','vpn'],[80.84,'lab','orbit','mpls'],[81.8,'lab','front','oldsize'],
 [83.6,'path','ride','discovery','f:D8'],[85.46,'path','chase','icmp','f:I8'],[87.24,'path','fw','blocked','f:I8'],[88.72,'path','wide','crack'],
 [90.52,'lab','front','b1400'],[91.7,'lab','front','b1500'],[93.74,'lab','jumbo','jumbo'],[94.96,'lab','macro','bdf'],[96.74,'lab','frames','pmtu'],
 [98.92,'path','fw','fix','f:I9'],[100.32,'path','host','learned'],[102.56,'lab','rebuild','retry'],
 [104.88,'path','ride','final','f:S0'],[106.86,'path','tunnel','final','f:S0'],[109.24,'path','gate','final2'],[111.86,'path','gateside','ghost','f:S@gate'],
 [114.96,'path','wide','final3'],[116.76,'path','receiver','done'],
 [119.12,'path','gate','hover'],[122.64,'path','ride','tail','f:S@host'],[127.2,'path','tunnel','tail','f:S@gate'],[132.5,'path','wide','tail'],[133.24,'path','final','outro'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:cuts[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
