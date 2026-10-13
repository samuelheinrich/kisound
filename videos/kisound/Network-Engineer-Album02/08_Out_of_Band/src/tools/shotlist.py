# The shooting list of the revised screenplay (data hall version). One source for src/render/config.js (cuts) and the
# shot table in ASTRA-DREHBUCH.md. Start times are the original ASTRA cut list (tests compare them).
#   python3 src/tools/shotlist.py   → rewrites the cut block in config.js and the table in ASTRA-DREHBUCH.md
import re,pathlib
root=pathlib.Path(__file__).resolve().parents[2]
# id, location, camera mode, action
SHOTS=[
 ('S001','FLY','zoom_in','Eine Fahrt: die schlafende Stadt, das grosse Bürogebäude, durchs Dach abwärts durch sechs schematische Etagen zur Rechenzentrumsebene mit vier Hallen, hinein in Rechenzentrum 2 bis vor Rack C06 (R-EDGE). Die Störung besteht seit 0 s.'),
 ('S002','FRONT','port','Front von R-EDGE: Gi0/0/1 dunkel, Etikett «administratively down». Der Login bleibt ohne Prompt.'),
 ('S003','SERVICE','nbr','Am Nachbar-Rack A14 kommt ein In-band-SYN aus der Trasse an und endet vor dem abgeschalteten Uplink.'),
 ('S004','FRONT','wide','Kaltgang 2 mit Rackreihe C: die gelbe Glasfasertrasse über R-EDGE bleibt ohne Verkehr.'),
 ('S005','BACK','reveal','Erster Blick hinter das Rack: Warmgang, Rückseite von C06 mit OOB-Switch, Console-Server und hellblauem Console-Kabel – schon vorhanden.'),
 ('S006','FLY','fly_hall','Überflug über Rechenzentrum 2 ohne Decke: Rackreihen, Gänge, die dunkle gelbe Trasse; hinten die Nachbarhallen.'),
 ('S007','AISLE','east_to','Um die Ostecke in den Warmgang: die Kamera findet den Engineer am Boden mit Laptop und Kabel.'),
 ('S008','CONSOLE','ports','Console-Server: serielle Ports 1–8, Port 7 mit hellblauem Kabel zum CON-Port von R-EDGE; noch keine Änderung.'),
 ('S009','SERVICE','nbr','SSH-Wiederholungen vom prod-client enden am Nachbarn; Timeout auf dem Produktionspfad. B01.'),
 ('S010','NOC','dash','NOC-Wanddisplay: Dashboard mit altem Zeitstempel, keine neuen Werte.'),
 ('S011','LAPTOP','screen','Laptop: CHG-2088 als historischer Eingriff (shutdown an Gi0/0/1) im Managementspeicher.'),
 ('S012','FRONT','sfp','Makro: SFP in Gi0/0/1 mit gelber Faser – genau der Port, über den die Änderung lief.'),
 ('S013','AISLE','west_to','Durch Kaltgang 1 und um die Westecke in den Warmgang: hinten am Rack hängt die Leitung, daneben der Engineer.'),
 ('S014','BACK','gap','Rückseite: das cyanfarbene OOB-Kabel des Laptops getrennt von den Produktionskabeln und der gelben Trasse oben.'),
 ('S015','CONSOLE','ch7','Kanal 7 leuchtet: Console-Server → R-EDGE CON. B02.'),
 ('S016','LAPTOP','screen','Laptop: R-EDGE# erreichbar, obwohl der Produktions-Uplink geschlossen bleibt.'),
 ('S017','ENGINEER','typing','Der Engineer tippt; cyanfarbene Pakete laufen über das Laptop-Kabel zum OOB-Switch.'),
 ('S018','CONSOLE','bytes','Serielle Bytes laufen über das Console-Kabel – ohne Produktionsrouting.'),
 ('S019','AISLE','away_east','Vom Engineer weg: die Kamera folgt dem Kabel ins Rack und zieht durch den Warmgang davon.'),
 ('S020','LAPTOP','screen','Laptop: R-EDGE# steht, Produktionspfad down.'),
 ('S021','ENGINEER','hook','OUT OF BAND: Engineer, Laptop, Kabel und Rack in einer ruhigen Totale.'),
 ('S022','CONSOLE','ch7','Kanal 7 bleibt offen und trägt nur CLI.'),
 ('S023','FLY','fly_duct','Überflug entlang der gelben Glasfasertrasse: der grosse Weg schweigt, kein Paket.'),
 ('S024','LAPTOP','screen','Laptop: Antworten der Console kommen über Serial und OOB zurück.'),
 ('S025','BACK','both','Zweiter Hook von der Rackrückseite: OOB-Kabel unten, gelbe Produktionstrasse oben – zwei getrennte Wege.'),
 ('S026','CONSOLE','con','Das Console-Kabel endet am CON-Port, nicht am Datenport.'),
 ('S027','LAPTOP','screen','Laptop: Vorabbild aus dem Managementspeicher neben der aktuellen Konfiguration.'),
 ('S028','FRONT','port','Vorne wartet Gi0/0/1 weiter auf den gezielten Eingriff.'),
 ('S029','AISLE','front_to','Lange Fahrt vom NOC-Display über den Randgang und um die Ecke zurück zum Engineer.'),
 ('S030','LAPTOP','screen','Laptop: aktuelle Konfiguration über die Console lesen.'),
 ('S031','LAPTOP','screen','Laptop: shutdown an Gi0/0/1. B03.'),
 ('S032','LAPTOP','screen','Laptop: Diff aus dem Managementspeicher neben dem Plan. B03.'),
 ('S033','LAPTOP','screen','Laptop: genau ein Unterschied wird geprüft.'),
 ('S034','LAPTOP','screen','Laptop: no shutdown bei 147,88 s. B04.'),
 ('S035','FRONT','link','Vorne: Gi0/0/1 wird grün (Link), danach Line Protocol; die gelbe Trasse erwacht.'),
 ('S036','NOC','tiles','NOC-Display: LINK grün, ROUTE installiert, SERVICE noch offen. B05.'),
 ('S037','SERVICE','follow','Neuer Test P-O1 vom Client läuft durch R-EDGE und die Trasse zum Ziel.'),
 ('S038','SERVICE','server','P-O1-Antwort: HTTP 200 vom Server-Rack 198.51.100.20. B06.'),
 ('S039','AISLE','away_west','Vom Engineer weg durch den Warmgang und um die Westecke in die Halle.'),
 ('S040','LAPTOP','screen','Laptop: Rollback dokumentiert (Interface und no shutdown).'),
 ('S041','BACK','both','Cyan bleibt getrennt von der jetzt warm leuchtenden Produktionstrasse.'),
 ('S042','FLY','fly_duct_warm','Überflug zurück über die Trasse: jetzt laufen warme Pakete zum Nachbarn.'),
 ('S043','CONSOLE','bytes','Serielle Bytes und Prompt: die konkrete Technik des Zugangs.'),
 ('S044','BACK','label','Kabeletiketten «OOB · CON-07»: dieser Weg war vorher gebaut.'),
 ('S045','CONSOLE','ch7','Dokumentation fährt über Kanal 7 zurück zum Laptop.'),
 ('S046','FLY','fly_dc','Aufsteigender Überflug: alle vier Rechenzentren arbeiten, die Produktion reicht in die Tiefe.'),
 ('S047','LAPTOP','screen','Laptop: speichern nach den Tests. B07.'),
 ('S048','AISLE','hall_to','Hohe Fahrt über Kaltgang 2, um die Ecke und hinunter zum Engineer; Verkehr in der Trasse.'),
 ('S049','ENGINEER','low','Final OUT OF BAND: tiefe Totale mit Engineer, Rack und leuchtender Trasse.'),
 ('S050','LAPTOP','screen','Laptop: Console-Kanal 7 antwortet weiterhin.'),
 ('S051','FRONT','port','Vorne: Gi0/0/1 grün; der Diff ist archiviert, kein erneuter Ausfall.'),
 ('S052','AISLE','away_low','Tiefe Rückfahrt vom Engineer den Warmgang entlang.'),
 ('S053','SERVICE','follow','Bestätigungstest P-O2 startet.'),
 ('S054','SERVICE','follow','Die Antwort kehrt auf dem Produktionspfad zurück, nicht über die Console.'),
 ('S055','SERVICE','server','P-O2: HTTP 200, TLS geprüft.'),
 ('S056','NOC','tiles','NOC-Display: Link, Route und Service als drei abgeschlossene Nachweise.'),
 ('S057','FLY','fly_hot','Überflug über dem Warmgang, absinkend bis zum Engineer.'),
 ('S058','LAPTOP','screen','Laptop: Console bleibt erreichbar, Konfiguration gespeichert.'),
 ('S059','LAPTOP','screen','Laptop: CHG-2088 mit Ursache, Vorzustand, Rücknahme und beiden Tests. B07.'),
 ('S060','ENGINEER','phone','Das Telefon liegt still neben dem Engineer auf dem Boden.'),
 ('S061','FLY','zoom_out','Zoom aus allem heraus: vom Engineer hoch über die Halle, die vier Rechenzentren, durch die Etagen und das Dach …'),
 ('S062','FLY','zoom_out','… bis zur schlafenden Stadt (eine durchgehende Fahrt mit S061).'),
 ('S063','FLY','top','Zurück in die Halle von oben: gelbe Trasse und cyanfarbenes OOB-Kabel getrennt sichtbar.'),
 ('S064','ENGINEER','final','Langsame Fahrt zum Engineer und zum Console-Kabel; Blende ab 258,5 s.'),
]
NAME={'FLY':'Überflug / Zoom','AISLE':'Gang','FRONT':'Rackfront','BACK':'Rackrückseite','CONSOLE':'Console-Port','ENGINEER':'Engineer','LAPTOP':'Laptop','NOC':'NOC-Display','SERVICE':'Service-Reihe','STADT':'Stadt'}
orig=(root/'_revisions/ASTRA-DREHBUCH-original.md').read_text()
rows=re.findall(r'^\| (S\d{3}) \| ([\d.]+) \| ([\d.]+) \| (\w+) \|.*\| ([^|]*) \|\s*$',orig,re.M)
assert [r[0] for r in rows]==[s[0] for s in SHOTS],'shot ids differ'
fmt=lambda v:('%.4f'%v).rstrip('0').rstrip('.') if v!=int(v) else '%.1f'%v
cuts=',\n'.join(f" [{fmt(float(r[1]))},'{'config' if s[1]=='LAPTOP' else 'world'}','{s[1].lower()}','{s[2]}']" for r,s in zip(rows,SHOTS))
cfg=root/'src/render/config.js';c=cfg.read_text()
c=re.sub(r'const cuts=\[\n.*?\n\];',lambda m:'const cuts=[\n'+cuts+'\n];',c,flags=re.S)
cfg.write_text(c)
table='| Shot | Beginn s | Ende s | Ort | Kamera | Handlung | Lyric-/Event-Cues |\n| --- | ---: | ---: | --- | --- | --- | --- |\n'+'\n'.join(f'| {r[0]} | {r[1]} | {r[2]} | {s[1]} | {s[2]} | {s[3]} | {r[4].strip()} |' for r,s in zip(rows,SHOTS))
d=root/'ASTRA-DREHBUCH.md';t=d.read_text()
t=re.sub(r'<!-- shots -->.*?<!-- /shots -->',lambda m:'<!-- shots -->\n'+table+'\n<!-- /shots -->',t,flags=re.S)
d.write_text(t)
print(len(SHOTS),'Einstellungen geschrieben')
