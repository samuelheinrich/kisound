export const FPS=60;
export const SAMPLES=12537608;
export const DURATION=SAMPLES/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
export const SOURCE_WAV='03_Its_Always_DNS_0.3-2.wav';
export const SOURCE_SHA256='b68aaccb7fddb1eea9241f6bc8f2a91ba30ad532e72355a1ac4309338ec294c4';
export const SEED=127003;
export const PALETTE={ink:0x050a13,navy:0x0e1f33,steel:0x1d3a55,blue:0x3d8bd9,cyan:0x59d8ed,query:0xffd24a,referral:0xff9a3c,answer:0x3fe6a0,nx:0xff4fa3,timeout:0xff6f7d,paper:0xe8edf2,violet:0xb39bff,white:0xdaeaf0};
// Bass re-entries read from the 100-ms rows of the analysis (sub drive jumps from ~0 to >0.55).
export const DROPS=[31.35,46.45,61.55,110.65,121.95,133.25,152.25,175.05,228.35];
// Two measured silences: a short gap after the final chorus and 2.3 s of digital silence (the timeout).
export const BLACKOUT=[120.55,121.4];
export const SILENCE=[130.35,132.65];
// The song stops mid-hook; only the last 0.2 s fade, there is no measured fade-out.
export const FADE_START=261.0;
export const TITLES={intro:[.7,1.9,8.4,9.6],outro:[253.6,254.8,257.6,258.15]};
const chapters=[
 ['Der Anruf',0,'Nachtstadt, Helpdesk-Telefon; die fehlerhafte Abfrage läuft schon durch die Hierarchie und endet in NXDOMAIN.'],
 ['Symptome',15.08,'Ticket #4040: Ping per IP sauber, Routen gut, nur der Hostname ist weg.'],
 ['Ausschluss',30.58,'Kabel, Port, Firewall, Traceroute: alles grün. Die Lupe landet auf DNS.'],
 ['Hook: Beweise',38.68,'dig, TTL, NXDOMAIN; der Resolver sagt nein, der alte Cache sagt ja.'],
 ['Urteil',48.12,'It’s always DNS: Switch, Router und Firewall entlastet.'],
 ['Indizien',59.58,'Alter Cache mit TTL 86400, Split-Brain der Zonen, Reverse-Lookup ohne PTR, CNAME-Kette.'],
 ['Flush · Query · Dig · Fix',83.4,'Flush hilft nicht allein; dig zeigt die fehlende interne Ansicht; der Eintrag wird ergänzt.'],
 ['Final Hook',91.26,'Dieselben Beweise, jetzt aufgelöst.'],
 ['Fall geschlossen',98.2,'TTL läuft, Final Chorus, Stempel: Fall geschlossen. Licht aus.'],
 ['Nachttour',121.4,'Rekursive Auflösung durch Root, TLD und autoritative Server; Timeout in der Stille; negative Antworten; Ablauf der TTL.'],
 ['Fallwand',182,'Die Wand mit allen Spuren; das Telefon klingelt wieder.'],
 ['Fall #4041',203.24,'Reprise: intranet → portal → lb, das Ende der CNAME-Kette fehlt.'],
 ['Indizien II',226.8,'Wieder alter Cache, Split-Brain, Reverse, CNAME-Tanz.'],
 ['Fix und Abspann',250.62,'Flush, Query, Dig, Fix; Titel.'],
 ['Fall #4042',258.15,'Dig it up · TTL · NXDOMAIN – Schnitt.'],
];
export const CHAPTERS=chapters.map(([title,start,action],i,a)=>({id:`C${String(i+1).padStart(2,'0')}`,title,start,end:a[i+1]?.[1]??DURATION,action}));
// Absolute editorial cuts [start, zone, camera, mode, target]. Lyric times are never snapped to the beat grid.
// Targets: 'tx:<id>' a DNS transaction to ride with, node ids for close shots.
const cuts=[
 [0,'city','opening','intro'],[5.5,'desk','phone','intro'],[9.0,'city','ride','incident','tx:T0'],
 [15.08,'desk','file','ticket'],[18.4,'city','office','ticket'],[20.0,'desk','phone','ticket'],[23.92,'city','ping','ping'],[26.7,'city','chase','vanish','tx:T2'],[28.6,'desk','monitor','vanish'],
 [30.58,'desk','file','checks'],[32.92,'city','gear','checks'],[34.76,'city','trace','checks'],[36.46,'desk','lens','checks'],
 [38.68,'desk','monitor','hook'],[39.22,'city','cache','hook'],[40.52,'desk','stamp','hook'],[41.12,'city','wide','hook'],[42.02,'city','resolver','hook'],[43.06,'city','office','hook','laptopB'],[43.78,'city','wide2','hook'],
 [45.32,'city','rise','build'],
 [48.12,'city','orbit','verdict'],[51.06,'city','gear','verdict'],[54.28,'city','ride','verdict','tx:C1'],[57.48,'desk','lens','verdict'],
 [59.58,'city','flyby','tour','tx:I1'],[63.6,'city','tower','tour'],[66,'city','cache','tour'],
 [68.02,'city','cache','stale'],[72.1,'city','zone','split'],[75.68,'city','arpa','reverse'],[79.58,'city','chase','cname','tx:CN1'],
 [83.4,'city','cache','flush'],[84.32,'city','chase','requery','tx:Q2'],[85.28,'desk','monitor','dig'],[86.14,'city','zone','fix'],[87.4,'city','gear','fix'],[89.32,'city','chase','resolved','tx:OK1'],
 [91.26,'desk','monitor','hook2'],[92.08,'city','cache','hook2'],[93.42,'desk','stamp','hook2'],[94.04,'city','wide','hook2'],[94.72,'city','resolver','hook2'],[95.94,'city','office','hook2','laptopB'],[96.64,'city','wide2','hook2'],
 [98.2,'city','tower','calm'],[102.5,'city','zone','calm'],[105.5,'city','rise','build'],
 [108.58,'city','orbit','verdict2'],[111.5,'desk','file','verdict2'],[114.62,'city','ride','verdict2','tx:C2'],[117.86,'desk','stamp','closed'],[120.42,'desk','lamp','blackout'],
 [121.4,'city','ride','tour','tx:K1'],[130.3,'city','timeout','timeout'],[133.25,'city','wide','recover'],[135.5,'city','ride','tour','tx:K2'],[139.5,'city','tower','tour'],[142.5,'city','flyby','tour','tx:K3'],[146.5,'city','tld','tour'],
 [150,'city','chase','negative','tx:TYPO'],[152.25,'city','orbit','tour'],[155.5,'city','ride','tour','tx:K4'],[160,'city','cache','expire'],[163.5,'city','flyby','tour','tx:K5'],[167.5,'city','tower','tour'],
 [171,'city','cache','expire'],[175.05,'city','ride','tour','tx:K6'],[179,'city','wide','tour'],
 [182,'desk','board','board'],[187.5,'desk','file','board'],[192,'city','orbit','calm'],[197,'desk','board','board'],[200.5,'desk','phone','ticket2'],
 [203.24,'desk','lens','ticket2'],[205.2,'desk','monitor','hook3'],[206.14,'city','cache','hook3'],[206.88,'desk','stamp','hook3'],[207.82,'city','chase','cname2','tx:CN2'],[211.32,'city','wide2','hook3'],[212.5,'city','rise','build'],
 [214.84,'city','orbit','verdict3'],[217.76,'city','gear','verdict3'],[222.44,'city','ride','verdict3','tx:C3'],[225.66,'desk','lens','verdict3'],[226.9,'desk','lamp','blackout'],
 [228.35,'city','flyby','tour','tx:K7'],[232,'city','tower','tour'],
 [235.3,'city','cache','stale2'],[239.26,'city','zone','split2'],[243.04,'city','arpa','reverse2'],[247.14,'city','chase','cname3','tx:CN3'],
 [250.62,'city','cache','flush2'],[251.38,'city','chase','requery2','tx:Q3'],[252.12,'desk','monitor','dig2'],[253,'city','zone','fix2'],
 [253.6,'city','final','final'],
 [258.15,'desk','monitor','end'],[259.24,'city','cache','end'],[260.36,'desk','stamp','end'],
];
export const SHOTS=cuts.map(([start,zone,camera,mode,target],i,a)=>({id:`S${String(i+1).padStart(3,'0')}`,start,end:a[i+1]?.[0]??DURATION,zone,camera,mode,target:target??null}));
