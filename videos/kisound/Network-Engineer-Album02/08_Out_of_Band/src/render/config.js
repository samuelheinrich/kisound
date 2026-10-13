export const FPS=60;
export const SAMPLES=12691848;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
// Final release audio (RELEASE AUDIO in 08_Out_of_Band_1.0.txt).
export const SOURCE_WAV='08_Out_of_Band_1.0.wav';
export const SOURCE_SHA256='9139796abf25839d0b7a85ee57042ebe0e1f524d5f8c0f61073e9b2b42a2427c';
export const SEED=208008;
// Production starts cold blue and turns warm amber after the verified recovery; the management path stays thin cyan;
// red only for the administrative shutdown, green for confirmed link/route/service.
export const PALETTE={ink:0x03060c,steel:0x1a2737,cold:0x4f86c6,warm:0xffb15a,mgmt:0x3fe0ff,red:0xff4a3c,amber:0xffd23a,ok:0x6fd6a0,white:0xeef4f8};
// First sub-bass entries of each groove section (the bass pattern then repeats every bar).
export const DROPS=[30.75,46.05,106.95,137.45,198.45,244.15];
// Measured level gaps (rms < -30 dBFS) and the measured fall (E042).
export const GAPS=[[22.2,22.3],[243.85,243.95]],GAP_DEPTH=[.3,.3];
export const FADE_START=258.5;
export const BPM=126.0,BEAT0=0.238;
export const TITLES={intro:[.6,1.4,5.4,6.4],outro:[244.4,245.2,249.4,250.4]};
const chapters=[
 ['Kein Login',0,'Gi0/0/1 ist seit Filmbeginn administrativ down; In-band-SSH bleibt ohne Antwort.'],
 ['Der getrennte Weg',22.58,'Hinter dem Rack: Managementtrasse, Console-Server und serieller Kanal 7 – schon vorher gebaut.'],
 ['SSH wartet',46.2,'Timeout auf dem Produktionspfad, Dashboard steht still, CHG-2088 als Ursache.'],
 ['Console',66.78,'SSH zum Console-Server im Managementnetz, picocom 9600/8N1, R-EDGE# über Kanal 7.'],
 ['Out of Band',90.08,'Eine Tür bleibt offen: der schmale Weg, während der grosse Weg schweigt.'],
 ['Vorabbild',117.8,'Gesichertes Pre-Change-Abbild im Managementspeicher, aktuelle Konfiguration über die Console.'],
 ['Rücknahme',136.32,'Diff + shutdown, gezielt no shutdown bei 147,88 s; erst Link, dann Route.'],
 ['Service-Test',158.88,'P-O1 vom Client bis zum Ziel: TLS geprüft, HTTP 200.'],
 ['Vorher gebaut',166.98,'Backup, Rollback, getrennter Zugang; speichern erst nach den Tests.'],
 ['Final Chorus',196.88,'Offener Uplink, P-O2 bestätigt erneut; die Console bleibt erreichbar.'],
 ['Die Stadt schläft',229.64,'Dokumentiert, das Telefon liegt still, die Stadt schläft weiter.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Cut list of the shooting script (S001–S064) [start, zone, camera (= the script's location), mode].
const cuts=[
 [0.0,'world','fly','zoom_in'],
 [8.48,'world','front','port'],
 [10.42,'world','service','nbr'],
 [14.46,'world','front','wide'],
 [18.48,'world','back','reveal'],
 [22.58,'world','fly','fly_hall'],
 [30.4533,'world','aisle','east_to'],
 [38.3267,'world','console','ports'],
 [46.2,'world','service','nbr'],
 [48.18,'world','noc','dash'],
 [52.68,'config','laptop','screen'],
 [56.48,'world','front','sfp'],
 [60.08,'world','aisle','west_to'],
 [63.36,'world','back','gap'],
 [66.78,'world','console','ch7'],
 [71.06,'config','laptop','screen'],
 [75.3,'world','engineer','typing'],
 [78.02,'world','console','bytes'],
 [82.6,'world','aisle','away_east'],
 [85.84,'config','laptop','screen'],
 [90.08,'world','engineer','hook'],
 [91.98,'world','console','ch7'],
 [95.86,'world','fly','fly_duct'],
 [100.04,'config','laptop','screen'],
 [105.16,'world','back','both'],
 [107.38,'world','console','con'],
 [111.16,'config','laptop','screen'],
 [114.68,'world','front','port'],
 [117.8,'world','aisle','front_to'],
 [127.06,'config','laptop','screen'],
 [136.32,'config','laptop','screen'],
 [140.26,'config','laptop','screen'],
 [144.1,'config','laptop','screen'],
 [147.88,'config','laptop','screen'],
 [150.48,'world','front','link'],
 [155.08,'world','noc','tiles'],
 [158.88,'world','service','follow'],
 [163.48,'world','service','server'],
 [166.98,'world','aisle','away_west'],
 [169.32,'config','laptop','screen'],
 [170.86,'world','back','both'],
 [173.0,'world','fly','fly_duct_warm'],
 [174.8,'world','console','bytes'],
 [177.08,'world','back','label'],
 [178.64,'world','console','ch7'],
 [180.54,'world','fly','fly_dc'],
 [182.8,'config','laptop','screen'],
 [189.84,'world','aisle','hall_to'],
 [196.88,'world','engineer','low'],
 [199.82,'config','laptop','screen'],
 [203.6,'world','front','port'],
 [206.6,'world','aisle','away_low'],
 [212.06,'world','service','follow'],
 [213.96,'world','service','follow'],
 [218.64,'world','service','server'],
 [221.06,'world','noc','tiles'],
 [225.3,'world','fly','fly_hot'],
 [229.64,'config','laptop','screen'],
 [232.2,'config','laptop','screen'],
 [236.2,'world','engineer','phone'],
 [240.34,'world','fly','zoom_out'],
 [243.56,'world','fly','zoom_out'],
 [250.5112,'world','fly','top'],
 [257.4623,'world','engineer','final']
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:cuts[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
