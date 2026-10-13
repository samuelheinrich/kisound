export const FPS=60;
export const SAMPLES=9752328;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
// Final release audio (RELEASE AUDIO in 02_Active_Standby_1.0.txt).
export const SOURCE_WAV='02_Active_Standby_1.0.wav';
export const SOURCE_SHA256='42750eb28bf676ef697bc26cddb9c28ec62390336e462783111b69db2446c86c';
export const SEED=202002;
// Device colours stay fixed: A orange (left, deep voice), B cyan (right, clear voice). Green only for confirmed state.
export const PALETTE={ink:0x03060b,steel:0x1b2a3a,a:0xff8a2a,b:0x3fd4ff,white:0xeaf3f8,hb:0xf2f8ff,sync:0x9fe8d0,red:0xff3b4e,ok:0x6fd6a0,amber:0xffb13d};
// Sub-bass re-entries after a bass-free passage (100-ms rows: < 0.2 before, > 0.55 after).
export const DROPS=[25.4,82.7,111.3,161.5,194.0];
// Measured level gaps (rms < -30 dBFS): the break before Verse 2 and the quiet outro words.
export const GAPS=[[81.45,82.55],[190.25,192.45]],GAP_DEPTH=[.55,.2];
export const FADE_START=197.2;
export const BPM=134.0,BEAT0=0.261;
export const TITLES={intro:[1.2,2.0,5.2,6.1],outro:[194.3,195.0,197.6,198.4]};
const chapters=[
 ['Gemeinsame Adresse',0,'Zwei gleiche FortiGates, eine LAN-Adresse 192.0.2.1. Nur A trägt den Datenstrom.'],
 ['Ich trag den Traffic',12.4,'A verarbeitet die Flows; S-17 entsteht und wird als Zustandskopie nach B synchronisiert.'],
 ['Heartbeat und Sync',23.72,'ha1 trägt zwei getrennte Vorgänge: Heartbeat und Session-Sync. B hört zu und hält den Stand.'],
 ['Active · Standby',67.42,'A Primary/Active, B Secondary/Standby. Die einzige HA-Leitung ha1 wird freigestellt.'],
 ['Der Link ist weg',89.1,'ha1 bricht. A arbeitet weiter; Bs Peer-Timer läuft 3,52 s aus.'],
 ['Beide Active',92.62,'B wird lokal Primary. Zwei Datenpfade treffen auf denselben Adressring; Sessions brechen.'],
 ['Isoliert',111.38,'Externes Fencing: nur As zwei Produktionsanschlüsse werden an den Switches abgeschaltet. Präferenzen neu gesetzt.'],
 ['Rollen neu',117.9,'ha1 repariert, Wahl: B Primary. Bs Zustand ist Autorität für die Synchronisation.'],
 ['Ein Pfad',125.58,'in-sync. As Links erst nach der Prüfung wieder frei; A bleibt Secondary.'],
 ['Active · Standby, neu',139.86,'B Active, A Standby. Neuer Testflow durch B, Sync jetzt B→A.'],
 ['Neuer Test',171.92,'Kontrollierter TCP-Test durch B; beide Consoles: B Primary, A Secondary, in-sync.'],
 ['Klarer Pfad',189.66,'Outro: Active auf B, Standby auf A. Blende.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Cut list of the shooting script (S001–S056) [start, zone, camera, mode, target].
const cuts=[
 [0,'hall','wide','opening'],[6.2,'hall','facadeA','enterA'],[12.4,'hall','facadeA','flowA','f:F0'],[13.96,'archive','macro','create'],[23.72,'hall','ha','pulse'],
 [25.58,'hall','ha','lanes'],[32.36,'archive','macro','readB'],[39.14,'archive','macro','copy'],[42.84,'hall','ha','pulse2'],[46.4,'hall','facadeA','path'],
 [49.54,'archive','macro','update'],[53.48,'hall','facadeB','readB'],[57.24,'hall','ha','rx'],[60.48,'hall','facadeB','awake'],[64.1,'hall','facadeB','ready'],
 [67.42,'hall','facadeA','active'],[70.44,'hall','facadeB','standby'],[74.24,'hall','wide','onepath'],[77.52,'archive','macro','parallel'],[79.1,'hall','ha','intact'],
 [81.22,'hall','facadeA','still'],[82.34,'hall','ha','clamp'],[89.1,'hall','ha','break'],[91.26,'hall','facadeB','timer'],[92.62,'hall','facadeB','takeover'],
 [94.58,'hall','facadeA','sends'],[96.14,'hall','wide','twopaths'],[99.66,'hall','facadeA','localA'],[102.74,'hall','wide','split'],[105.94,'console','front','both'],
 [107.34,'hall','wide','address'],[108.82,'archive','macro','diverge'],[111.38,'hall','facadeA','fence'],[113.26,'hall','facadeA','fenced'],[117.9,'hall','ha','repair'],
 [120.44,'console','front','prefs'],[125.58,'archive','macro','resync'],[128.82,'hall','facadeB','onepath'],[132.26,'hall','facadeA','release'],[135.14,'hall','facadeB','leads'],
 [139.86,'hall','facadeB','active2'],[142.42,'hall','facadeB','test','f:T1'],[146.66,'hall','facadeA','standby2'],[147.34,'archive','macro','syncBA'],[150.72,'archive','macro','syncBA2'],
 [156.06,'hall','wide','clear'],[161.4,'hall','facadeB','active3'],[163.64,'hall','facadeA','standby3'],[167.06,'hall','wide','clearpath'],[170.3,'hall','ha','pulse3'],
 [171.92,'hall','facadeB','tcptest','f:T2'],[180.79,'console','front','final'],[189.66,'hall','facadeB','outroB'],[192.4,'hall','facadeA','outroA'],[193.68,'hall','wide','out'],
 [198.4268,'hall','ha','end'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:cuts[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
