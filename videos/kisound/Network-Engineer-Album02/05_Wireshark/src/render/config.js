export const FPS=60;
export const SAMPLES=9395208;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
// Final release audio (RELEASE AUDIO in 05_Wireshark_1.0.txt).
export const SOURCE_WAV='05_Wireshark_1.0.wav';
export const SOURCE_SHA256='243d6ab2160abfa883bfb86a53a73019e406f6f63986de0ebb3659570e83128c';
export const SEED=205005;
// Smoky blue, cold white, cyan dashed mirror copies, sparing amber for findings, red only for the loss, green for the confirmed test.
export const PALETTE={ink:0x03060c,steel:0x1a2737,white:0xeef4f8,mirror:0x4fd8ff,amber:0xffb13d,red:0xff4a5c,ok:0x6fd6a0,bulk:0x8a7a5a,blue:0x2f6fc0};
// Sub-bass re-entries after a bass-free passage.
export const DROPS=[35.85,89.15,146.95,178.05];
// Measured level gaps: the silence on «Der Request geht raus, dann Stille» and two short breaths in the final chorus.
export const GAPS=[[105.95,106.25],[143.45,143.75],[159.25,159.55]],GAP_DEPTH=[.6,.25,.25];
// The measured fall begins at 189.8 s; the last sung «Warum» (193.34–195.06) stays readable, the picture closes after it.
export const AMBIENT_DIM=189.8,FADE_START=195.06;
export const BPM=108.0,BEAT0=0.185;
export const TITLES={intro:[1.0,1.9,4.6,5.6],outro:[178.4,179.2,182.0,182.9]};
const chapters=[
 ['Bei mir geht’s',0,'Zwei Aussagen, zwei Standorte: der Vergleichspfad antwortet, der betroffene Client wartet hinter dem 100-Mbit/s-Uplink.'],
 ['Capture läuft',24.96,'Vorbereitete SPAN-Sessions auf SW-A und SW-B füllen BEFORE und AFTER.'],
 ['Fremde Flows',33.22,'Thesen im Chat, Mirror-Kopien in der Liste; der betroffene Tuple wird freigestellt.'],
 ['Der richtige Stream',70.34,'Displayfilter auf Client und Ziel, dann tcp.stream == 7 – Frames werden ausgeblendet, nicht gelöscht.'],
 ['Zeig mir, was passiert',89.32,'Paket für Paket durch die Schichten; Seq 10801, 12001, 13201.'],
 ['Retransmission',105.94,'O-101 geht raus und kommt nie an; O-102 trägt denselben Bytebereich. Der zweite Capture grenzt ein.'],
 ['TLS bleibt dicht',124.68,'Ohne Secrets kein Klartext; ein RST ist ein Hinweis, kein Urteil.'],
 ['Der Befund',137.3,'Bytebereich fehlt AFTER, +18 Output-Drops am SW-A-Uplink, null Capture-Drops.'],
 ['Kontrollierter Versuch',139.8,'Bulk-Quelle 95 → 20 Mbit/s, Uplink bleibt 100 Mbit/s. Derselbe Test mit neuer Verbindung.'],
 ['Die Antwort kommt zurück',157.26,'HTTP 200 am Testclient, beidseitige Segmente, Drop-Delta 0.'],
 ['Capture stoppen',168.22,'Mitschnitte gestoppt und gesichert, Bericht mit Ursache und Versuch.'],
 ['Warum',187.9,'Der dokumentierte Verlust an der überlasteten Ausgangsqueue.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Cut list of the shooting script (S001–S061) [start, zone, camera, mode, target].
const cuts=[
 [0,'net','rack','open'],[5.89,'net','span','mirrors','f:BG1'],[11.78,'net','target','works'],[13.22,'net','target','waits'],[17.44,'net','span','follow','f:MB101'],
 [24.96,'gui','list','running'],[26.54,'net','span','copy','f:MBG2'],[33.22,'net','target','spinner'],[36.14,'net','target','ready'],[41.74,'gui','list','theses'],
 [44.5,'compare','front','empty'],[50.64,'net','span','session','f:O200'],[53.76,'gui','list','row'],[60.0,'gui','list','foreign'],[62.72,'layers','macro','select'],
 [70.34,'gui','list','ipfilter'],[73.46,'gui','list','stream'],[78.04,'gui','list','hide'],[81.02,'gui','list','kept'],[84.74,'layers','macro','unfold'],
 [89.32,'gui','list','hook1'],[90.18,'layers','macro','three'],[92.5,'gui','list','seqs'],[94.86,'net','queue','toward'],[97.16,'gui','list','hook2'],
 [98.86,'compare','front','theses2'],[101.44,'layers','macro','follow'],[103.66,'compare','front','next'],[105.94,'net','span','lost','f:RO101'],[108.78,'gui','list','retrans'],
 [110.96,'layers','macro','hint'],[113.4,'net','queue','hypo'],[115.32,'net','span','reach','f:RO102'],[117.84,'compare','front','limit'],[119.62,'net','rack','second'],
 [122.14,'compare','front','merge'],[124.68,'layers','macro','tls'],[126.74,'gui','list','secrets'],[129.1,'layers','macro','headers'],[131.6,'layers','macro','closed'],
 [133.52,'gui','list','rst'],[135.7,'layers','macro','rsthint'],[137.3,'compare','front','finding'],[139.8,'net','queue','limit'],[142.72,'net','span','newtest','f:N1'],
 [143.38,'net','queue','passes','f:N1'],[145.74,'compare','front','both'],[148.28,'net','queue','nodrop'],[151.66,'gui','list','hook4'],[152.38,'compare','front','fits'],
 [154.94,'gui','list','answer'],[157.26,'net','target','http200'],[159.16,'compare','front','window'],[168.22,'gui','list','stop'],[172.38,'gui','list','save'],
 [173.5,'compare','front','report'],[177.04,'gui','list','files'],[182.4733,'compare','front','beforeafter'],[187.9067,'net','queue','why'],[193.34,'net','queue','warum'],
 [195.06,'net','queue','end'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:cuts[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
