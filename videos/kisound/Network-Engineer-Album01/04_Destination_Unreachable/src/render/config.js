export const FPS=60;
export const SAMPLES=12470447;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV='04_Destination_Unreachable_0.3-1.wav';
export const SOURCE_SHA256='883d8e9f06995b5c82548cfb54a74ecf08ae89f825a1f92ab8613dd1807ef9c3';
export const SEED=132004;
// Cover: graphite night, cold cyan routes, red only for failures.
export const PALETTE={ink:0x04070c,graphite:0x111821,steel:0x24384c,cyan:0x59e3ff,blue:0x2f8fe0,te:0xe8f4ff,du:0xff4057,ok:0x3fe6a0,amber:0xffb648,void:0x000000,white:0xdaeaf0};
// Cold sub-bass re-entries (100-ms rows: < 0.2 before, > 0.55 after). The first one follows the gap at 58.45 s.
export const DROPS=[58.75,73.35,95.15,124.25,131.95,160.55,175.15,187.85,198.75,209.45,220.55,233.35,236.95,246.55];
export const GAP=[58.4,58.5];
export const FADE_START=256.6;
export const TITLES={intro:[.3,.9,3.0,3.6],outro:[242.0,243.2,249.6,250.8]};
const chapters=[
 ['Pulse',0,'Ein Glossar der Stille: Destination unreachable, Time exceeded, No reply, Blackhole, TTL, Traceroute – jedes als echtes Ereignis im Backbone.'],
 ['Ein Signal in den Kern',30.74,'Ein Echo Request überquert die Kante und verschwindet nach Hop 3. Kein Alarm, keine Antwort.'],
 ['Wo ist das Paket?',45.36,'Nebelkarte. Die Blackhole-Route wächst von /32 auf /24, ein zweiter Host verschwindet. Nochmals senden – Fall. Von R2 kommt ein lautes Unreachable: kein Route für Site C.'],
 ['Nacht',69.36,'Fahrt durch den Backbone, Traceroute läuft.'],
 ['Traceroute',81.72,'Hop für Hop. Firewall still: 0 Treffer im Log. Ein fehlendes Präfix bei R2. Echo Request ohne Reply. Metriken wechseln, der Weg führt trotzdem in R4.'],
 ['Break',110.18,'TTL expired · Next hop gone · Silent gateway · Moving on · ICMP · No reply · Packets fall · Signals die.'],
 ['Final Hook',132.34,'Dieselben Fragen, grösseres Loch.'],
 ['Finale',163.8,'Dreimal Destination unreachable.'],
 ['Leerer Backbone',172.46,'Die Akte: R4 verwirft 203.0.113.0/24 nach Null0 (alte RTBH-Route), R2 fehlt 198.51.100.0/24. Die Nacht geht weiter, die Pakete fallen.'],
 ['Kein Weg',241.0,'Titel, zwei letzte Unreachables, dann Stille.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Absolute editorial cuts [start, zone, camera, mode, target]. Targets: 'f:<flight>' ride a packet, 'n:<node>' look at a node.
const cuts=[
 [0,'backbone','opening','intro'],[3.66,'backbone','hop','du','n:R2'],[6.46,'backbone','hop','te','n:R1'],[9.68,'backbone','void','noreply'],[12.4,'map','top','pulse'],
 [14.86,'backbone','chase','lost','f:E0b'],[15.96,'backbone','void','blackhole'],[17.92,'backbone','ttl','ttl','f:T0p4'],[20.64,'map','top','trace'],[23.44,'backbone','cable','hop'],[27.06,'backbone','void','noreturn'],[28.4,'map','low','pulse2'],
 [30.74,'backbone','ride','spoken','f:E1'],[33.1,'backbone','chase','spoken','f:E1'],[36.78,'map','card','noalarm'],[38.08,'map','term','noanswer'],[39.42,'backbone','tower','silence','n:R4'],[41.44,'backbone','void','silence'],
 [45.36,'backbone','wide','hook'],[49.28,'map','top','nobody'],[52.54,'backbone','ride','hook','f:E2'],[55.2,'backbone','void','grow'],[58.44,'backbone','host','resend'],[58.75,'backbone','fall','fall','f:K1'],
 [61.98,'backbone','hop','du2','n:R2'],[63.6,'map','table','noroute'],[65.26,'backbone','site','noroute2','n:RC'],
 [69.36,'backbone','wide2','inst'],[73.35,'backbone','ride','inst','f:E4'],[77.0,'backbone','flyby','inst','f:T1p3'],[80.3,'map','low','inst'],
 [81.72,'backbone','cable','trace2'],[83.36,'map','top','marks'],[87.06,'backbone','site','fw','n:FWB'],[90.6,'map','table','prefix'],[94.26,'backbone','ride','echo','f:E5'],[97.8,'backbone','site','noreply2','n:D'],
 [101.4,'backbone','wide','shift'],[104.98,'map','table','null'],[107.5,'backbone','orbit','inst2'],
 [110.18,'backbone','hop','b_ttl','n:R3b'],[111.1,'backbone','void','b_gone'],[112.32,'backbone','tower','b_silent','n:R4'],[114.88,'backbone','cable','b_moving'],[116.1,'map','card','b_icmp'],[118.54,'map','term','b_noreply'],
 [119.68,'backbone','fall','b_fall','f:E6'],[122.08,'backbone','void','b_die'],
 [122.82,'backbone','wide2','inst3'],[124.25,'backbone','ride','inst3','f:E7'],[128.0,'backbone','flyby','inst3','f:T5p2'],
 [132.34,'backbone','wide','hook2'],[136.26,'map','top','nobody2'],[139.54,'backbone','ride','hook2','f:E8'],[143.2,'backbone','void','grow2'],[145.56,'backbone','host','resend2'],[146.78,'backbone','fall','fall2','f:E9'],
 [148.72,'backbone','hop','du3','n:R2'],[150.7,'map','card','du3'],[153.68,'backbone','site','noroute3','n:RC'],
 [156.62,'backbone','wide2','inst4'],[160.55,'backbone','ride','inst4','f:E10'],
 [163.8,'backbone','hop','fin1','n:R2'],[165.2,'map','card','fin2'],[166.5,'backbone','void','fin2'],[171.06,'backbone','hop','fin3','n:R2'],
 [172.46,'map','top','case'],[175.15,'backbone','ride','night','f:E11'],[180.0,'backbone','flyby','night','f:T4p3'],[184.0,'map','low','night'],
 [187.85,'backbone','cable','night2'],[192.8,'backbone','orbit','night2'],[198.75,'backbone','fall','night3','f:E12'],[204.0,'backbone','wide','night3'],[206.4,'map','table','night3'],
 [209.45,'backbone','ride','night4','f:E13'],[215.8,'backbone','void','night4'],[220.55,'backbone','chase','night5','f:E14'],[226.0,'backbone','tower','night5','n:R4'],[227.9,'map','top','night5'],
 [233.35,'backbone','fall','night6','f:E15'],[236.95,'backbone','wide2','night6'],[241.0,'backbone','final','outro'],[251.08,'backbone','hop','end','n:R2'],[254.54,'backbone','void','end'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:cuts[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
