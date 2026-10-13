export const FPS=60;
export const SAMPLES=10023048;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
// Final release audio (RELEASE AUDIO in 04_Broadcast_Storm_1.0.txt).
export const SOURCE_WAV='04_Broadcast_Storm_1.0.wav';
export const SOURCE_SHA256='00a640de0f76551e27719ad0c4c0f106133fd26c4d33f4f7e3d5b71cbadec352';
export const SEED=204004;
// VLAN 120 yellow (only the affected VLAN), header white, red = loss/fault, cyan = observation, green = verified.
export const PALETTE={ink:0x03050a,steel:0x1b2735,yellow:0xffd23a,white:0xf2f6fa,red:0xff3b4e,cyan:0x5fe0ff,ok:0x6fd6a0,amber:0xffb13d,blue:0x3f8fff};
// Sub-bass re-entries after a bass-free passage (first 100-ms row > 0.55 after < 0.2 before).
export const DROPS=[34.05,88.25,154.05,167.75,195.15];
// The measured beat cut right after «Zieh das Kabel» and the bass-free stretch around the port-down.
export const BEAT_CUT=131.4;
export const GAPS=[],GAP_DEPTH=[];
export const FADE_START=202.9;
export const BPM=175.0,BEAT0=0.029;
export const TITLES={intro:[1.3,2.2,7.2,8.4],outro:[195.4,196.2,200.4,201.4]};
const chapters=[
 ['Offene Kette',0,'SW1–SW2–SW3 als offene Kette; die beiden Port-24-Enden bleiben getrennt. Ein loses Kabel.'],
 ['Falscher Port',15.58,'Der Fehlpatch rastet an SW3 Gi1/0/24 ein und schliesst den Ring in VLAN 120. STP ist dort aus.'],
 ['B-001',22.3,'H1 fragt per ARP-Broadcast nach 192.0.2.1. SW1 flutet: eine Kopie in jede Ringrichtung.'],
 ['Kopien wachsen',43.96,'Die Kopien kehren zurück und werden erneut geflutet; jeder neue Broadcast kreist mit. CPU rot, Management weg.'],
 ['Alle Lampen grün',66.52,'Grüne Linklampen über vollen Queues. Die H1-MAC springt zwischen den Ringports. Nichts kommt durch.'],
 ['Broadcast Storm',86.52,'Kein Root, kein Blocking: der Ring frisst die Leitungen, Puffer verwerfen.'],
 ['Loop · Flood',110.54,'Eine volle Ringrunde, Flooding an jedem Abzweig, Verluste bei unverändertem Link.'],
 ['Zieh das Kabel',130.06,'Der Auftrag zur Suche. Das Suchlicht fährt über den Ring.'],
 ['Console-Weg',137.38,'In-band-Login scheitert; die serielle Console führt zu SW3. Gi1/0/24 ist der falsche Ringabschluss.'],
 ['Ein Port down',161.38,'shutdown an SW3 Gi1/0/24. Der Ring ist offen.'],
 ['Die Flut zieht ab',166.56,'Restliche Kopien laufen aus, Queues leeren sich, MAC-Lernen beruhigt sich.'],
 ['Stille',186.72,'Management antwortet, Unicast-Test erfolgreich. Folgearbeit: STP für VLAN 120.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Cut list of the shooting script (S001–S058) [start, zone, camera, mode, target].
const cuts=[
 [0,'ring','crane','open'],[9.66,'ring','crane','cable'],[10.44,'ring','port','plug','p:SW3-24'],[15.58,'ring','port','click','p:SW3-24'],[16.74,'console','front','stpcfg'],
 [20.8,'ring','crane','closed'],[22.3,'ring','fabric','b001','c:B001'],[29.52,'ring','crane','twocopies'],[36.74,'core','mac','learn'],[43.96,'ring','fabric','lap','c:B001a'],
 [46.34,'ring','port','same','p:SW1-24'],[49.88,'ring','fabric','header','c:B001a'],[51.88,'ring','crane','nostp'],[54.56,'ring','fabric','flood','c:B001b'],[56.76,'ring','fabric','grow','c:B001a'],
 [60.14,'core','buffer','fill'],[62.3,'console','front','mgmtdead'],[66.52,'ring','port','green','p:SW2-1'],[69.66,'core','mac','flap'],[76.02,'core','buffer','unicastdrop'],
 [80.02,'ring','crane','drown'],[86.52,'ring','crane','storm'],[88.08,'console','front','noroot'],[92.0,'ring','fabric','storm2','c:B001b'],[93.64,'core','buffer','damage'],
 [98.28,'ring','fabric','flutet','c:B001a'],[99.56,'ring','fabric','double','c:B001b'],[100.84,'ring','port','wire','p:SW2-2'],[102.92,'ring','crane','lapcam'],[106.5,'core','buffer','olddrop'],
 [110.54,'ring','crane','loop'],[111.82,'ring','fabric','fullap','c:B001a'],[119.4,'ring','fabric','flood1','c:B001b'],[120.84,'ring','fabric','flood2','c:B001a'],[121.56,'core','buffer','losses'],
 [130.06,'console','front','task'],[131.74,'ring','search','search1'],[135.98,'ring','search','search2'],[137.38,'console','front','serial'],[142.48,'console','front','ssh'],
 [144.98,'console','front','prompt'],[147.92,'ring','port','noblock','p:SW2-2'],[150.68,'ring','crane','nobridge'],[153.84,'console','front','flashlight'],[155.12,'ring','search','search3'],
 [158.92,'core','mac','identify'],[161.38,'console','front','shutdown'],[166.56,'ring','crane','drain'],[168.96,'console','front','noroot2'],[171.96,'ring','fabric','fabricrest','c:LAST'],
 [174.34,'core','buffer','history'],[177.16,'ring','port','down','p:SW3-24'],[179.76,'core','buffer','empty'],[181.7,'core','mac','stable'],[184.5,'ring','crane','calm'],
 [186.72,'console','front','verify'],[194.0845,'ring','fabric','unicast','c:U2'],[201.449,'ring','crane','end'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:cuts[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
