export const FPS=60;
export const DURATION=8691887/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV='02_OSPF_Neighbors_0.3-1.wav';
export const SOURCE_SHA256='56fa0fd69fb22b27208f72069b7fd59b34aa74f597c2a78ff0d05bca6639790d';
export const SEED=136202;
export const PALETTE={ink:0x050e1b,navy:0x142b43,blue:0x547994,cyan:0x59d8ed,violet:0xb39bff,amber:0xffb96a,green:0x80e3bd,red:0xff747a,white:0xdaeaf0};
const chapters=[
 ['OSPF Neighbors',0,'Atlas aus der Dunkelheit öffnen; Anfangstitel über ersten Hello-Impulsen.'],
 ['Area 0 / Hello',7.6,'Hello zwischen direkten Nachbarn; Routerinseln und Backbone verbinden sich.'],
 ['Init → Two-Way',23.16,'Router-ID im Hello-Nachbarfeld identifiziert bidirektionale Kommunikation.'],
 ['DR / BDR / DROTHER',36.98,'R4 ist DR, R5 BDR; R6 und R7 bleiben DROTHER. Matrix zeigt Beziehungen.'],
 ['Database aligned / SPF',47.88,'ExStart, DBD-Header, LSR, LSU und LSAck bis Full; SPF öffnet Wege.'],
 ['Area 1 / ABR',62.38,'R7 verbindet Area 0 und Area 1. Getrennte LSDBs; Type-3-LSA neu erzeugen.'],
 ['Equal Cost / Flows',76.58,'Zwei gleich teure Wege; vier unterscheidbare Flows bleiben auf ihren gewählten Wegen.'],
 ['Link State / Cost',90.76,'LSA aktualisieren; Metrik R1–R2 steigt 10 → 25, SPF wählt R3.'],
 ['Reliable flood / SPF',104.84,'LSU und Bestätigungen; SPF aus zwei Routerperspektiven, keine globale Wurzel.'],
 ['Hello / ECMP reprise',118.5,'Metrik zurück auf 10; Datenbankabgleich und beide Wege erneut öffnen.'],
 ['Link down / Convergence',132.68,'R2–R4 fällt bei E032 aus; LSAs aktualisieren, Nutzdaten wechseln zu R3.'],
 ['Full / Roles / Recovery',144.28,'Passende Nachbarpaare zu Outro-Begriffen; Link ab E038 wieder aufbauen, ECMP zurück.'],
 ['OSPF / Samuel Heinrich',168.88,'Aktiven Multi-Area-Atlas öffnen; Schlusstext; letzter kräftiger Lichtakzent bei E045.'],
 ['Actual audio tail',178.35,'Atlas und Titel erst mit dem tatsächlichen Endabfall auflösen.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Absolute editorial camera cuts. Automatic lyric times are never snapped to a synthetic beat grid.
const cuts=[
 [0,'atlas','opening','intro'],[7.6,'atlas','chase','hello'],[11,'atlas','wide','area0'],[14.82,'atlas','orbit','hello'],[18.36,'atlas','rise','area0'],
 [23.16,'neighbour','close','hello'],[26.64,'atlas','orbit','area0'],[30.22,'neighbour','side','states'],[33.86,'neighbour','close','twoway'],
 [36.98,'atlas','lan','roles'],[39.16,'neighbour','matrix','drother'],[40.92,'atlas','bdr','roles'],[42.78,'neighbour','matrix','bdr'],[45,'atlas','lan','roles'],
 [47.88,'database','wide','exstart'],[49.72,'database','side','dbd'],[51.62,'database','track','loading'],[53.36,'database','wide','aligned'],[55.18,'routing','wide','spf'],[58.64,'atlas','chase','flows'],
 [62.38,'atlas','areas','multi'],[65,'neighbour','side','area1'],[68,'database','wide','areas'],[71.5,'database','track','summary'],[74.7,'atlas','border','multi'],
 [76.58,'routing','wide','ecmp'],[79.7,'atlas','chase','ecmp'],[83.22,'neighbour','matrix','adjacency'],[86.62,'atlas','orbit','ecmp'],
 [90.76,'database','track','lsa'],[94.3,'routing','side','cost'],[95.98,'routing','wide','spf'],[97.76,'atlas','lan','roles'],[99.72,'atlas','local','drother-data'],[103,'database','wide','lsa'],
 [104.84,'database','track','flood'],[106.6,'routing','side','cost'],[109,'database','wide','aligned'],[111.8,'routing','wide','root-r1'],[114.74,'routing','side','root-r4'],
 [118.5,'neighbour','close','hello'],[120.2,'atlas','rise','reprise'],[123.84,'database','wide','aligned'],[125.58,'routing','wide','ecmp'],[129.16,'atlas','orbit','flows'],[132.68,'atlas','fault','fault'],[135,'database','track','fault'],[138,'routing','wide','failover'],[141,'atlas','chase','failover'],
 [144.28,'neighbour','matrix','full'],[145.4,'neighbour','matrix','twoway'],[147.06,'atlas','local','drother-data'],[150.271,'database','wide','areas'],[152.68,'neighbour','matrix','drother'],[156.64,'atlas','lan','dr'],
 [160.8,'neighbour','side','recovery'],[164,'routing','wide','ecmp'],[166.36,'atlas','chase','ecmp'],[167.76,'atlas','bdr','bdr'],
 [168.88,'atlas','areas','final'],[171.671,'atlas','final','final'],[178.35,'atlas','final','tail'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode],i,a)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:a[i+1]?.[0]??DURATION,zone,camera,mode}));
export const EDITORIAL=SHOTS.map((s,i)=>({id:`V${String(i+1).padStart(3,'0')}`,time_s:s.start,origin:'redaktionell vorgeschlagen',shot_id:s.id,action:`${s.zone}/${s.camera}: ${s.mode}`}));
export const TITLES={intro:[.65,1.8,6.8,7.6],outro:[169.5,171]};
