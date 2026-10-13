export const FPS=60;
export const SAMPLES=12447407;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV='07_Firewall_State_Table_0.4-2.wav';
export const SOURCE_SHA256='6fcc83f53b3146a4754354b9dfd7c8644de53bf57c992aadb76a9fc9a62f754d';
export const SEED=142007;
// Cover: obsidian night, blue inside lines, orange fire wall. Amber = state, green = permit, red = deny, violet = NAT.
export const PALETTE={ink:0x05070d,navy:0x0c1a2e,steel:0x1d3550,blue:0x2fa8ff,cyan:0x59e3ff,orange:0xff8a2a,amber:0xffb648,ok:0x3fe6a0,deny:0xff3b4e,nat:0xb07dff,white:0xe8edf2,udp:0x59e3ff};
// Bass re-entries (rolling psy bass back after a breakdown), read from the 100-ms sub-band rows.
export const DROPS=[24.95,45.65,84.95,105.25,126.35,167.75,195.25,215.55,229.05];
// Stretches without the rolling bass: the picture calms down there.
export const BREAKDOWNS=[[0,24.4],[37.0,44.9],[63.5,65.2],[77.5,85.5],[97.8,101.5],[103.5,105.7],[122.8,125.8],[147.7,159.4],[165.2,167.9],[193.2,195.1],[209.2,215.1],[226.7,228.6]];
export const GAP=[228.35,228.45];
export const FADE_START=256.8;
export const TITLES={intro:[1.2,2.4,8.2,9.4],outro:[243.6,244.8,252.6,253.6]};
const chapters=[
 ['Default deny',0,'Geschlossene Mauer, ruhendes Tor. Die erste Session öffnet sich, ein einzelnes unaufgefordertes Paket stirbt am Tor.'],
 ['Verkehr',24.4,'Der Bass setzt ein: Clients öffnen Sessions, die State Table füllt sich, Rückpakete nehmen den Fast Path. Ein Scanner klopft.'],
 ['Policy und State',50.6,'Default deny, Regeln von oben nach unten, 5-Tupel, TCP-Handshake, UDP ohne Antwort, die Tabelle entscheidet.'],
 ['NAT und Inspection',70.74,'Source NAT versteckt die Inside-Adresse, Destination NAT leitet auf die DMZ, DPI liest mit.'],
 ['Drop it · Log it · Block it',78.64,'Scanner-Welle ohne Bass: verwerfen, loggen, sperren. Ein ACK ohne Session findet keinen Eintrag. Eine neue Regel wird geschrieben.'],
 ['Least privilege',96.46,'Das Tor dreht sich, nur wenige präzise Wege sind offen. Jede Session hinterlässt eine Spur im Log.'],
 ['Übersetzung',123.5,'ACL, NAT-Reflection (Hairpin), Inside local / outside global, DPI: ein sauberer Download passiert, die EICAR-Testsignatur schliesst die Session.'],
 ['Break',146.92,'SYN, ACK, Session match, Deny, Permit, Log, Source NAT, Destination NAT, TCP, UDP – je ein Bild im Kontrollraum.'],
 ['Rausch',164.78,'Volle Fahrt durch das Tor, alle Sessions aktiv.'],
 ['Lock it',183.1,'Final Hook: Der Scanner stirbt sofort an der Blocklist, die Regel steht.'],
 ['Sessions schliessen',195.0,'FIN, Timeouts, die Tabelle leert sich. Kurzer Lichtabfall in der Pegellücke, letzte Fahrt, Titel, zurück zu default deny.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Absolute editorial cuts [start, zone, camera, mode, target]. Targets 'f:<flight id>' ride with a packet.
const cuts=[
 [0,'gate','opening','intro'],[4.8,'gate','portal','intro'],[9.94,'ledger','table','open'],[13.1,'gate','ride','state','f:D0q'],[16.5,'gate','wall','deny'],[20.04,'gate','chase','alone','f:Z0'],[23.15,'gate','portal','alone'],
 [24.4,'gate','wide','flow'],[28.35,'gate','ride','flow','f:T1syn'],[32.15,'gate','chase','flow','f:T1sa'],[34.25,'ledger','table','flow'],[37.0,'gate','orbit','calm'],[41.0,'gate','scanner','knock','f:X1'],[44.9,'gate','ride','flow2','f:T2syn'],[48.0,'gate','wide2','flow2'],
 [50.6,'gate','wall','deny2'],[54.0,'ledger','policy','chain'],[57.16,'ledger','packet','tuple'],[59.26,'gate','portal','wrong','f:Z1'],[61.25,'gate','flyby','verse','f:T3syn'],
 [64.46,'ledger','ladder','tcp'],[65.6,'gate','ride','udp','f:U1.2'],[67.26,'gate','rings','policy'],[68.92,'ledger','table','state'],
 [70.74,'gate','nat','snat','f:T4syn'],[72.84,'gate','nat','dnat','f:T5syn'],[74.58,'gate','dpi','dpi','f:T1d5'],[76.18,'ledger','policy','verdict'],
 [78.64,'gate','portal','hook'],[81.5,'gate','scanner','hook','f:X3'],[84.95,'gate','wide','hook'],[86.34,'gate','rings','hook'],[88.35,'ledger','log','hook'],[89.08,'gate','portal','hook'],
 [92.1,'gate','scanner','nomatch','f:X7'],[93.86,'gate','rings','hook'],[95.42,'ledger','policy','write'],
 [96.46,'gate','orbit','chorus'],[97.8,'gate','wide','calm'],[101.5,'gate','ride','chorus','f:T6syn'],[103.5,'gate','portal','chorus'],[105.25,'gate','flyby','chorus','f:T6d1'],[108.3,'gate','wide2','chorus'],
 [111.24,'gate','wall','trust'],[113.96,'gate','topdown','least'],[117.34,'gate','ride','app','f:T7syn'],[120.16,'ledger','packet','app'],[121.6,'ledger','log','sign'],
 [123.5,'gate','orbit','inst'],[126.35,'gate','ride','inst','f:T8syn'],
 [130.44,'gate','acl','acl'],[133.72,'gate','hairpin','hairpin','f:H1syn'],[135.38,'ledger','nat','terms'],[137.1,'gate','ride','mobile','f:T9syn'],[138.52,'gate','dpi','dpi2','f:E1d1'],[140.38,'ledger','packet','layers'],
 [142.1,'gate','dpi','verdict2','f:E1d2'],[143.76,'gate','portal','close'],
 [146.92,'ledger','ladder','syn'],[148.8,'ledger','ladder','ack'],[150.5,'ledger','table','match'],[153.04,'gate','portal','deny3'],[154.6,'gate','portal','permit'],[155.24,'ledger','log','log'],
 [156.02,'ledger','nat','snat2'],[158.38,'ledger','nat','dnat2'],[159.4,'gate','ride','break','f:T10d2'],[162.14,'ledger','table','tcp'],[164.14,'ledger','table','udp'],
 [164.78,'gate','orbit','inst2'],[167.75,'gate','ride','rush','f:T11syn'],[171.2,'gate','wide','rush'],[174.55,'gate','flyby','rush','f:T11d3'],[178.35,'gate','rings','rush'],[180.05,'gate','chase','rush','f:T12syn'],
 [183.1,'gate','portal','lock'],[186.5,'gate','scanner','lock','f:X17'],[189.82,'ledger','table','lock'],[191.68,'ledger','policy','lock'],
 [195.25,'gate','ride','outro','f:T13syn'],[200.75,'gate','wide','outro'],[204.0,'gate','chase','fin','f:T1fin'],[206.65,'ledger','table','close'],
 [209.2,'gate','orbit','calm2'],[212.0,'ledger','table','expire'],[215.55,'gate','ride','final','f:T14syn'],[219.35,'gate','flyby','final','f:T14d2'],[223.15,'gate','wide2','final'],
 [226.7,'gate','portal','dip'],[229.05,'gate','ride','last','f:T15syn'],[234.0,'gate','rings','last'],[238.35,'gate','wide','last'],[242.15,'gate','final','outro'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:cuts[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
