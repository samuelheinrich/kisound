export const FPS=60;
export const SAMPLES=11474568;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
// Final release audio (RELEASE AUDIO in 07_QoS_1.0.txt).
export const SOURCE_WAV='07_QoS_1.0.wav';
export const SOURCE_SHA256='2eb5c953db38d50aaeba2bb4d1c6fd761c8764dc961b52581308b7684e30c73f';
export const SEED=207007;
// Colours of the cover: real-time RTP blue (left, clear female voice), bulk TCP orange (right, deep male voice),
// red only for a policer drop, amber for budgets, green for confirmed reception.
export const PALETTE={ink:0x03060c,steel:0x1a2737,rtp:0x3fa8ff,tcp:0xff9a2e,red:0xff4a3c,amber:0xffd23a,ok:0x6fd6a0,white:0xeef4f8};
// Sub-bass re-entries after a bass-free passage.
export const DROPS=[44.85,134.15,152.75,182.55,197.35,212.25,223.85];
// Measured level gaps (rms < -30 dBFS) and the measured fall (E039).
export const GAPS=[[128.9,129.1],[130.8,131.0],[197.0,197.3],[212.1,212.2],[223.7,223.8]],GAP_DEPTH=[.3,.3,.35,.25,.25];
export const FADE_START=233.1;
export const BPM=129.0,BEAT0=0.116;
export const TITLES={intro:[.6,1.4,5.4,6.4],outro:[225.0,225.8,229.6,230.6]};
const chapters=[
 ['Zwei Flows, ein Draht',0,'RTP links, Backup rechts; beide schon klassifiziert. Gemeinsamer Engpass 100 Mbit/s.'],
 ['Quality of Service',13.3,'EF/46 und Best Effort/0 – nicht alles gleich. Die Markierung wirkt nur mit der passenden Policy.'],
 ['Die Policy',31.2,'INGRESS, CHILD, PARENT: Klassifizierung, Markierung, Policer, Priority, Fair-Queue, Shaper.'],
 ['Bulk',58.1,'TCP zählt Bytes; ein gespeichertes Verlustfenster zeigt Q-B17, Q-B18 ist eine neue Retransmission.'],
 ['Policing',88.88,'RTP-Burst 1,2 Mbit/s: 1,0 konform, 0,2 Überschuss wird endgültig verworfen.'],
 ['Shaping',104.14,'Der Parent-Shaper hält Q-BS im Puffer und gibt es später genau einmal aus.'],
 ['Classify · Mark · Queue',126.1,'Ein neuer RTP-Frame durch Klassifizierung, Markierung und Priority-Queue.'],
 ['Schedule · Shape · Send',141.1,'Scheduler-Wahl, Shaper-Budget, Serialisierung am gemeinsamen Port.'],
 ['Final Chorus',151.15,'Beide Klassen aktiv, Policy unverändert; RTP-Empfang und steigende TCP-ACKs.'],
 ['Hörst du mich?',195.2,'Klar und deutlich – der Transfer läuft noch. Passt.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Cut list of the shooting script (S001–S057) [start, zone, camera (= the script's station), mode].
const cuts=[
 [0.0,'hall','hall','s001'],
 [6.65,'hall','class','s002'],
 [13.3,'hall','hall','s003'],
 [15.48,'hall','class','s004'],
 [20.92,'hall','sched','s005'],
 [22.52,'hall','queue','s006'],
 [28.38,'hall','hall','s007'],
 [31.2,'hall','sched','s008'],
 [35.24,'hall','class','s009'],
 [38.48,'hall','sched','s010'],
 [40.9,'hall','queue','s011'],
 [46.6333,'hall','sched','s012'],
 [52.3667,'hall','tcp','s013'],
 [58.1,'hall','tcp','s014'],
 [61.5,'hall','tcp','s015'],
 [65.38,'hall','queue','s016'],
 [68.6,'hall','tcp','s017'],
 [72.7,'hall','queue','s018'],
 [76.04,'hall','sched','s019'],
 [80.1,'hall','ziel','s020'],
 [83.4,'hall','tcp','s021'],
 [88.88,'hall','police','s022'],
 [90.62,'hall','police','s023'],
 [95.48,'hall','police','s024'],
 [97.94,'hall','class','s025'],
 [104.14,'hall','queue','s026'],
 [107.04,'hall','queue','s027'],
 [111.08,'hall','sched','s028'],
 [113.68,'hall','queue','s029'],
 [117.12,'hall','police','s030'],
 [126.1,'hall','class','s031'],
 [127.84,'hall','class','s032'],
 [129.78,'hall','queue','s033'],
 [130.48,'hall','sched','s034'],
 [133.14,'hall','tcp','s035'],
 [141.1,'hall','sched','s036'],
 [142.72,'hall','sched','s037'],
 [143.64,'hall','hall','s038'],
 [145.2,'hall','tcp','s039'],
 [151.15,'hall','hall','s040'],
 [152.7,'hall','class','s041'],
 [158.93,'hall','sched','s042'],
 [160.06,'hall','queue','s043'],
 [165.94,'hall','hall','s044'],
 [169.0,'hall','sched','s045'],
 [173.02,'hall','ziel','s046'],
 [176.42,'hall','tcp','s047'],
 [178.44,'hall','sched','s048'],
 [186.82,'hall','ziel','s049'],
 [195.2,'hall','ziel','s050'],
 [196.82,'hall','ziel','s051'],
 [203.77,'hall','tcp','s052'],
 [210.72,'hall','ziel','s053'],
 [215.98,'hall','tcp','s054'],
 [222.34,'hall','hall','s055'],
 [223.74,'hall','hall','s056'],
 [231.3968,'hall','sched','s057']
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:cuts[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
