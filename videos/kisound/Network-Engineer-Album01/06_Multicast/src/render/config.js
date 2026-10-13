export const FPS=60;
export const SAMPLES=12508808;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV='06_Multicast_0.1-1.wav';
export const SOURCE_SHA256='7d0f87a9f23017511848df85b035a20b14761e8da550f196064183032780794e';
export const SEED=132606;
export const PALETTE={ink:0x040a14,navy:0x0e2236,steel:0x1d3a55,blue:0x3d8bd9,cyan:0x59d8ed,orange:0xff9a3c,warm:0xffe3b8,emerald:0x3fe6a0,violet:0xb39bff,red:0xff6f7d,white:0xdaeaf0};
// Film timing: the source starts with the first vocal line; SPT switchover lands on the measured drop.
export const SOURCE_START=11.38;
export const T_SPT=135.7;
// Bass re-entries read from the 100-ms rows of the analysis (sub drive jumps from ~0 to >0.5).
export const DROPS=[31.35,81.85,96.25,110.65,135.75,164.35,182.25,210.75,230.45];
export const FADE_START=258.4;
export const TITLES={intro:[.7,1.9,8.6,9.9],outro:[250.2,251.8]};
const chapters=[
 ['Eine Quelle',0,'Bühne und leere Reihen öffnen; Titel über dem ruhigen Quellpuls.'],
 ['Register / leere Reihen',11.38,'Quelle sendet; R1 registriert beim RP; ohne Empfänger Register-Stop, Pakete enden an R1.'],
 ['Erster Empfänger',24.04,'Ein Host meldet sich; (*,G)-Join zum RP, (S,G)-Join zur Quelle; erster Strom auf dem Drop.'],
 ['Unicast · Anycast · Multicast',38.28,'Drei Zustellarten getrennt: drei Kopien, nächste Instanz, eine replizierte Kopie.'],
 ['Tune into the stream',58.74,'Weitere Sitze treten bei; der Baum wächst nur zu ihnen.'],
 ['IGMP / Snooping / Querier',67.58,'Report, Snooping-Eintrag, General Query und Antworten im Access-Segment.'],
 ['Join the group',81.48,'Chorus-Welle neuer Mitglieder; eine Kopie pro Link, viele Empfänger.'],
 ['Replikation',96.38,'Ein Paket verzweigt an jedem Replikationspunkt.'],
 ['PIM-SM / RP',109.76,'PIM-Nachbarn, RP kennt die Quelle, Join steigt zum Core, neuer Ast wächst.'],
 ['Hook',128.58,'Report, Join, Leave, Query, Group, Source, RP, PIM, IGMP als schnelle Schläge.'],
 ['SPT-Switchover',135.7,'R3 wechselt auf den kürzesten Pfad zur Quelle; RP-Ast für S wird gepruned.'],
 ['No flood for the silent',149,'Flooding ohne Snooping gegen selektive Ports; von Access bis Core; viele Türen.'],
 ['Final Chorus',166.72,'Vogelperspektive über die lebendige Gemeinschaft.'],
 ['Replikation II',182.25,'Paketverfolgung und periodische Queries.'],
 ['Querier / RP',197.18,'Querier fragt, Mitglieder antworten, RP erinnert sich an die Quelle.'],
 ['Totale',210.75,'Weite Totale, an- und abmeldende Plätze; der stille Ast bleibt dunkel.'],
 ['Finale',249.2,'Schlusstitel; Queries laufen bis zum tatsächlichen Endabfall weiter.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Absolute editorial cuts [start, zone, camera, mode, target]. Lyric times are never snapped to the beat grid.
// Targets: 'key:<name>' for a story seat, 'pick:<tier|any>:<core|any>' for a live receiver chosen
// deterministically per shot, 'R7' for a router, 'S17' for a segment, digits for a host in the segment zone.
// POV cameras: chase (behind the packet), ride (first person on the stream), flyby (alongside).
const cuts=[
 [0,'arena','opening','intro'],[7.731,'arena','stands','intro'],
 [11.38,'arena','source','register'],[13.84,'arena','stands','register'],[17.24,'arena','gate','register'],[20.7,'arena','rise','register'],
 [24.04,'segment','host','firstjoin','2'],[27.2,'arena','climb','firstjoin','key:first'],[29.6,'arena','core','firstjoin'],[31.3,'arena','ride','firstjoin','key:first'],[34.0,'arena','seat','stream','key:first'],[35.9,'arena','orbit','stream'],
 [38.28,'compare','wide','unicast'],[41.86,'compare','source','unicast'],[45.52,'compare','wide','anycast'],[48.44,'compare','path','anycast'],[51.36,'compare','wide','multicast'],[54.1,'compare','branch','multicast'],
 [58.74,'arena','bird','stream'],[61.34,'arena','chase','stream','pick:upper:R5'],[64,'arena','stands','stream'],[66.7,'arena','rise','stream'],
 [67.58,'segment','host','igmp-report','6'],[69.2,'segment','switch','igmp-report'],[70.34,'segment','ports','snooping'],[72.3,'segment','wide','snooping'],[75.1,'segment','uplink','igmp-query'],[77.78,'segment','wide','igmp-query'],
 [79.84,'arena','source','stream'],
 [81.48,'arena','rise','chorus'],[84.84,'arena','flyby','chorus','pick:lower:R2'],[87.44,'arena','bird','count'],[89.6,'arena','chase','chorus','pick:field:R2'],[91.1,'arena','orbit','chorus'],[93.94,'arena','reverse','chorus'],
 [96.25,'arena','chase','replicate','pick:upper:R2'],[99.8,'arena','branch','replicate','R2'],[103.36,'arena','stands','calm'],[106.5,'arena','bird','calm'],
 [109.76,'arena','core','pim-hello'],[113.86,'arena','rp','rp-source'],[117.18,'arena','climb','pim-join','key:verse2'],[119.4,'arena','grow','tree'],[121,'arena','branch','tree','R3'],[123.1,'arena','ride','tree','key:verse2'],[126.4,'arena','segment','tree','S17'],
 [128.58,'arena','seat','hook','key:hookReport'],[129.82,'arena','seat','hook','key:hookJoin'],[130.1,'arena','seat','hook','key:hookLeave'],[130.74,'arena','segment','hook','key:hookLeave'],[131.22,'arena','bird','hook'],[131.58,'arena','source','hook'],[132.12,'arena','rp','hook'],[132.54,'arena','core','hook'],[133.58,'arena','rise','hook'],
 [135.7,'arena','core','spt'],[137.6,'arena','ride','spt','pick:upper:R4'],[140.3,'arena','orbit','stream'],[142.5,'arena','flyby','stream','pick:lower:R3'],[145.3,'arena','bird','stream'],[147.06,'arena','chase','stream','pick:field:R4'],
 [149,'segment','wide','flood'],[151.36,'segment','ports','snoop-on'],[153.06,'segment','host','snoop-on','9'],[154.8,'segment','switch','snoop-on'],
 [156.38,'arena','ascend','layers','key:bridge'],[160.18,'arena','reveal','doors'],
 [166.72,'arena','bird','chorus'],[168.9,'arena','ride','chorus','pick:upper:R3'],[170.94,'arena','flyby','chorus','pick:lower:R5'],[173.4,'arena','total','count'],[175.5,'arena','chase','chorus','pick:upper:R5'],[177.06,'arena','orbit','chorus'],[180.04,'arena','reverse','chorus'],
 [182.25,'arena','ride','replicate','pick:upper:R2'],[185.5,'arena','rise','stream'],[187.2,'arena','flyby','stream','pick:upper:R4'],[188.8,'arena','stands','stream'],[190.64,'arena','bird','query'],[193.3,'arena','chase','stream','pick:lower:R4'],[195.4,'arena','orbit','stream'],
 [197.18,'arena','querier','outro-query','R7'],[199.5,'arena','stands','outro-query'],[202.7,'arena','rp','rp-memory'],[206.52,'arena','rpsource','rp-memory'],
 [210.75,'arena','total','wide'],[213.5,'arena','ride','wide','pick:upper:any'],[216,'arena','orbit','wide'],[219,'arena','flyby','wide','pick:field:R3'],[222.4,'arena','chase','wide','pick:upper:R4'],[226,'arena','branch','wide','R12'],
 [228.5,'arena','ride','wide','pick:lower:R5'],[230.45,'arena','rise','wide'],[233.5,'arena','chase','wide','pick:upper:R2'],[236,'arena','stands','wide'],[240,'arena','reverse','wide'],[242.5,'arena','ride','wide','pick:upper:R3'],[244.8,'arena','seat','wide','pick:lower:any'],[247,'arena','flyby','wide','pick:upper:R5'],
 [249.2,'arena','final','final'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i,a)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:a[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
