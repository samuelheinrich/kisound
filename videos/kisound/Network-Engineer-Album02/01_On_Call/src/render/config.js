export const FPS=60;
export const SAMPLES=10405128;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
// Final release audio (RELEASE AUDIO in 01_On_Call_1.0.txt; bit-identical to the former candidate 0.2).
export const SOURCE_WAV='01_On_Call_1.0.wav';
export const SOURCE_SHA256='6d10bbfdf8af4a390e4e12e9775a93b1bea7f2838d68f7bd75046ca0a290bcd1';
export const SEED=201001;
// Script colours: cyan observes, amber is the change, red discards, muted green only for confirmed tests.
export const PALETTE={ink:0x03060b,night:0x070d16,steel:0x1d2b3a,cyan:0x5fe0ff,blue:0x2d7fd0,amber:0xffb13d,red:0xff3b4e,ok:0x6fd6a0,white:0xe4eef4,warm:0xffd9a0,wood:0x3a2416};
// Sub-bass re-entries after a bass-free passage (100-ms rows: < 0.2 before, > 0.55 after).
export const DROPS=[30.5,90.8,120.9,169.7,199.6];
// Measured level gaps (rms < -30 dBFS): before the first bass entry and before the last instrumental.
export const GAPS=[[29.95,30.4],[197.75,199.5]];
export const FADE_START=210.8;
export const TITLES={intro:[1.7,2.7,6.6,7.8],outro:[199.7,200.5,204.0,204.9]};
const chapters=[
 ['Nacht',0,'Die Stadt schläft; ein einziges Fenster leuchtet. Telefon dunkel, Monitor in Bereitschaft.'],
 ['Display wird hell',16.58,'Alarm 02:17. INCIDENT-2042 erscheint neben dem Bereitschaftsnamen. Die Person setzt sich auf.'],
 ['Rackgang',30.02,'Diagnoseoberfläche offen. Durch den Monitor in den Rackgang bis an R-EDGE; die falsche ACL ist schon gebunden.'],
 ['Alles ist weg',44.56,'Ein ungenaues Ticket wird präzise: SITE-2, Client 192.0.2.10, Beginn nach CHG-2042. TEST-A: drei Dienste Timeout, CTRL-D antwortet.'],
 ['Genauer fragen',75.4,'Keine Änderung auf Verdacht. Client, Zeit und Ziel stehen fest; ein einzelner Diagnose-SYN wird vorbereitet.'],
 ['Ich folg dem Signal',89.32,'F-A1 in Zeitlupe durch R-EDGE: Port, Eingangsprüfung, gültige Route – Verwerfung an QUARANTINE Regel 10.'],
 ['Die Spur',120.12,'Drei Belege: Route korrekt, Binding falsch, Counter 40→41 samt Log. Gateway-Test ist kein Anwendungstest.'],
 ['Erst verstehen',135.68,'Diff gegen den Vorzustand, Vorschau, dann genau ein Eingriff: no ip access-group QUARANTINE out um 146,82 s.'],
 ['Derselbe Test',148.78,'Derselbe curl-Befehl, neue Verbindung F-A2: Handshake, TLS, HTTP 200. Danach APP-B, APP-C und CTRL-D.'],
 ['Ticket geschlossen',184.28,'Ursache, Eingriff, Verifikation. Telefon gesperrt, Fenster dunkel.'],
 ['Die Stadt weiss nichts',199.04,'Der geprüfte Serviceweg unter den Strassen, neue Transaktionen in den Diensthallen, Blende.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Cut list of the shooting script (S001–S060) [start, zone, camera, mode, target].
// Targets: 'f:<flight>' follows a packet, 'h:<hall>' a service hall, 's:<station>' a station in R-EDGE.
const cuts=[
 [0,'city','crane','opening'],[8.29,'desk','enter','standby'],[16.58,'desk','phone','alarm'],[18.54,'city','window','sleep'],[22.62,'screen','ortho','ticket'],
 [28.14,'desk','side','upright'],[30.02,'desk','over','open'],[37.29,'router','aisle','enter'],
 [44.56,'desk','phone','vibrate'],[48.56,'desk','coffee','coffee'],[52.28,'screen','ortho','report'],[55.58,'screen','ortho','fields'],[58.7,'screen','ortho','fill'],
 [62.68,'desk','over','test'],[66.16,'screen','ortho','compare'],[69.2,'router','dolly','paths','s:LOOKUP'],
 [75.4,'desk','hands','still'],[78.42,'screen','ortho','coords'],[81.42,'desk','hands','hover'],[84.78,'router','flow','launch','f:FA1'],
 [89.32,'router','gate','port','f:FA1'],[91.16,'screen','ortho','live'],[95.92,'city','wide','fog'],[99.18,'router','flow','parser','f:FA1'],[101.78,'router','dolly','route','f:FA1'],
 [106.32,'router','macro','drop','f:FA1'],[111.92,'desk','over','stay'],[113.74,'router','side','axis','s:ACL10'],
 [120.12,'router','dolly','evroute','s:LOOKUP'],[122.38,'router','flow','gwtest','f:GW'],[124.14,'router','macro','nexthop','f:RP1'],[126.2,'router','trace','trace'],
 [128.0,'screen','ortho','diff'],[129.94,'router','macro','counter','s:ACL10'],[131.78,'desk','over','norestart'],[133.22,'router','side','isolate','s:ACL10'],
 [135.68,'screen','ortho','difference'],[137.64,'router','macro','measure','s:ACL10'],[139.4,'router','flow','replay','f:RP2'],[140.9,'screen','ortho','evidence'],
 [143.02,'desk','hands','enter'],[145.22,'screen','ortho','preview'],[146.82,'router','macro','release','s:ACL10'],[148.78,'router','flow','fa2','f:FA2'],
 [153.52,'router','gate','pass','f:FA2'],[156.8,'screen','ortho','tls'],[160.2,'city','wide','datalight'],[163.98,'router','hall','arrive','f:REQ'],[165.58,'router','back','reply','f:RSP'],
 [169.88,'desk','over','watch'],[171.66,'screen','ortho','named'],[175.02,'screen','ortho','attach'],[177.46,'router','hall','verify','h:B'],
 [184.28,'desk','coffee','exhale'],[187.46,'screen','ortho','closed'],[192.56,'desk','phone','lock'],[195.84,'city','window','dark'],
 [199.04,'city','pullback','service'],[204.9512,'router','hall','transactions','h:A'],[210.8623,'city','wide','end'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:cuts[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
