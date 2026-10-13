# 01 · On Call — Die Nacht hinter dem Display

Drehbuchfassung: 2026-10-04. Vollständige kreative und technische Vorlage für die spätere Umsetzung; Szenario und Bildausgaben sind simuliert. Aktueller Audio-Kandidat, noch keine finale Release-Auswahl. Originalton, Transkriptzeiten und Analysen werden unverändert verwendet.

## Verbindliche Quellen und Zeitbasis

- Audio: [01_On_Call_0.2.wav](01_On_Call_0.2.wav) · SHA-256 `6d10bbfdf8af4a390e4e12e9775a93b1bea7f2838d68f7bd75046ca0a290bcd1`.
- Transkript: [01_On_Call_Transkript.json](01_On_Call_Transkript.json) · SHA-256 `ff78db9388bafc6f2d1f78e8e35251d53c603c4df4c69eaa7a0905583c04934c`.
- Analyse: [ASTRA-AUDIO-ANALYSE.json](../../../../videos/kisound/Network-Engineer-Album02/01_On_Call/ASTRA-AUDIO-ANALYSE.json) · SHA-256 `59ed79830a1a0f4e815e267dcf2a490e29774769117a7ddfb77e35b981c50127`.
- Exaktes Ende: **216.7735 s**, 10405128 Samples/Kanal bei 48000 Hz; Timecode 00:03:36.774 ist auf Millisekunden gerundet.
- Geschätztes Bewegungsraster: 127.4 BPM, Sicherheit mittel. Es ersetzt keine Gesangszeit. Keine SFX, Flatlines, Drops oder Stopps allein aus Promptwünschen voraussetzen.
- [Transkript-Prüfhinweise](../TRANSKRIPT-PRUEFUNG.md): automatische Zeiten, keine neue manuelle Hörprüfung. Mit **PRÜFEN** markierte Zeilen bleiben unsicher; ihre Bildhandlung ist vom unklaren Wortlaut unabhängig.

## Welt und Kamerasprache

Die Stadt liegt unter einer kalten Glasglocke. In der Totalen sind Strassen fast schwarz, das Rechenzentrum ein niedriger, dauernd leuchtender Körper. Ein einziges Wohnungsfenster bildet den visuellen Gegenpol. Darin arbeitet eine namenlose Bereitschaftsperson: müde Augen, ruhige Hände, dunkles Shirt. Sie bleibt die einzige menschliche Hauptfigur des Albums. Keine Heldengeste; ihre Aufmerksamkeit ist die Kraft, die die Maschine lesbar macht.

Der Arbeitsplatz besteht aus Holz, kaltem Kaffee, Telefon und zwei Displays. Ein phosphorweisser Cursor wird beim Eintritt in das Display zu einer langen Lichtschiene. Sie führt durch den wirklichen Rackgang in eine um Grössenordnungen vergrösserte Router-Innenwelt: Ports als industrielle Schleusen, ein Routingraum mit verschiebbaren Präfixplatten, eine ACL-Kammer mit geordneten Regelblättern. Ein Paket ist ein flacher Träger mit sichtbarem Header und geschlossenem Nutzlastkern; nie ein menschlicher Stellvertreter.

Hinter der ACL liegen drei Diensthallen in einer gemeinsamen Serverzone. Ihre Mechanik steht still, obwohl alle Links leuchten. Der Vergleichsdienst liegt in einer anderen Zone, sein schmaler Weg läuft weiter. Cyan bezeichnet Beobachtung, Amber den Change, Rot die Verwerfung, ein gedämpftes Grün ausschliesslich bestätigte Tests. Die Kamera wird von der weiten Nacht über starre Arbeitsflächen zu präzisen Fahrten durch Ports immer enger. Nach dem Eingriff fährt sie dieselbe Achse in Gegenrichtung zurück.

## Fachszenario

Für die simulierten HTTPS-Tests ist die Labor-CA am Linux-Client bereits vertrauenswürdig installiert; curl prüft das Zertifikat regulär. Die Befehle erzeugen JSON und den tatsächlichen HTTP-Status als getrennte Ausgabezeilen.

IOS-XE-Router R-EDGE verbindet Client 192.0.2.10 über Gi0/0/0 mit Gi0/0/1 und Servernetz 198.51.100.0/24. APP-A .20, APP-B .21 und APP-C .22 sprechen HTTPS/443. Vergleichsdienst 203.0.113.40/443 liegt hinter Gi0/0/2. Kein NAT. Alle Links und Routen funktionieren.

Change CHG-2042 bindet die für eine fremde Zone gedachte ACL QUARANTINE irrtümlich ausgehend an Gi0/0/1. Ihre erste Regel verwirft Verkehr in das Servernetz. Vorzustand: dort kein ausgehendes IPv4-ACL-Binding; diese Aussage ist im gesicherten Diff belegt. Die Untersuchung beginnt mit einem ungenauen Ticket. Die Person ergänzt Standort, Client, Dienst und Beginn, wiederholt einen fest definierten HTTPS-Test und vergleicht den funktionierenden vierten Dienst. Ein erfolgreicher Gateway-Test ist kein erfolgreicher Anwendungstest.

Die Diagnose vereinigt drei Belege: korrektes Routing, falsche Interface-Bindung und steigender ACL-Counter samt passendem Log. In der Bridge entfernt sie genau diese Bindung bei 146.82 s, ohne die ACL zu löschen oder andere Interfaces zu ändern. Ab 148.78 s startet derselbe curl-Befehl vom selben Client auf dasselbe Ziel. Eine neue TCP-Verbindung erzeugt neue Frames, die Testparameter bleiben identisch. Die Antwort ist erst nach Handshake, TLS und HTTP bestätigt. Danach werden die drei Dienste und der Vergleich erneut geprüft und das Ticket geschlossen.

## Kontinuität

TEST-A bezeichnet das Testrezept, F-A1 den SYN vor der Korrektur, F-A2 den neuen SYN danach. F-A1 wird endgültig verworfen und darf nie wieder auftauchen. F-A2 ist kein wiederbelebter Frame. Der Clientport ist vor dem Eingriff 51000, danach 51001. Die späteren Vor-Eingriff-Blicke auf F-A1 sind als aufgezeichnete Spur/Replay markiert: erneute Perspektive, kein weiterer Transport des schon verworfenen Originals. In beiden Fällen bleibt Ziel .20:443 identisch.
Die ACL ist von Filmbeginn bis 146.82 s gebunden. Der Counter 40→41 gehört zum kontrollierten Diagnose-SYN; weitere sichtbare Tests tragen eigene Zählstände. Nach dem Entfernen wächst dieser Counter auf Gi0/0/1 nicht mehr. Die Verwaltung erfolgt über einen unabhängigen Zugang; der durch die ACL betroffene Datenpfad transportiert keine erfolgreichen Terminalantworten.
Rot bleibt bei den drei Diensten bestehen, bis der jeweilige Service-Test erfolgreich abgeschlossen ist. Der Final Chorus verfolgt den nun zugelassenen Pfad; er wiederholt keinen Ausfall. Die Stadt behält Nachtzustand und Perspektive bis zum Ende.

## Bildschirmtexte und Lesedauer

Die folgenden B-IDs sind vollständige Textbestände. Zeitfenster reservieren ihre Präsenz; Resultate erscheinen ausschliesslich nach den unten festgelegten Reveal-Zeiten. Ein vorhandener Konfigurationsauszug ist keine neu ausgeführte Änderung. Plattformprompt und Geräte-ID bleiben an jedem Terminal sichtbar. Hersteller-/Protokollnamen sind sachliche Beschriftungen ohne Logo.

B01 ergänzt Felder erst bei L009. B02 zeigt zuerst den Timeout und dann den separaten Vergleichserfolg. B03 ist eine stehende Beweiskarte: Route bei 120.12 s, Binding bei 124.14 s, Log/41 matches erst 129.94 s; Counter-Vergleich 40→41 bleibt darunter stehen. B04 zeigt einen gespeicherten Diff. B05 ist bis 146.82 s als VORSCHAU bezeichnet, erst dann ausgeführt. B06 hält den exakt identischen curl-Befehl ab 148.78 s; Antwort-/HTTP-Zeile erst bei 165.58 s, vier abgeschlossene Ergebnisse erst 177.46 s. B07 ist erst nach Abschluss sichtbar.

CLI-Ausgaben sind gekürzte, simulierte Ausschnitte; Auslassungen enthalten keine zusätzliche Handlung. Kurze Labels stehen mindestens 1.2 s auf der Gerätefläche. CLI-Seiten umfassen höchstens sechs nichtleere Zeilen und bleiben mindestens 4 s unverzerrt lesbar; umfangreiche Auszüge liegen in getrennten Tabs bzw. gleichzeitig auf getrennten Flächen. Der Kameraschnitt löscht den aktiven Bildschirmblock nicht. Typografie verdeckt keine Befunde. Im Bild kleine feste Kennzeichnung «Szenario / simulierte Werte», bei Messdarstellungen zusätzlich Capture-/Testfenster.

| Block | Verfügbare Bildzeit | Vollständiger Textbestand / Seitenhaltung |
| --- | --- | --- |
| B01 | 16.5800–72.4200 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |
| B02 | 62.6800–75.4000 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 4 Zeilen. |
| B03 | 120.1200–143.0200 s | 3 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 13 Zeilen. |
| B04 | 128.0000–146.8200 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 4 Zeilen. |
| B05 | 143.0200–153.5200 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 4 Zeilen. |
| B06 | 148.7800–184.2800 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 6 Zeilen. |
| B07 | 187.4600–192.5600 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 4 Zeilen. |

### B01 · 16.5800–72.4200 s

```text
INCIDENT-2042 | 02:17 | On Call
Meldung: Alles ist weg
Standort: SITE-2    Client: 192.0.2.10
Beginn: nach CHG-2042
APP-A/B/C: HTTPS timeout    CTRL-D: HTTPS 200
```

### B02 · 62.6800–75.4000 s

```text
client$ curl --connect-timeout 3 --max-time 5 --resolve app-a.example:443:198.51.100.20 --write-out '\nHTTP %{http_code}\n' https://app-a.example/health
curl: (28) Failed to connect to app-a.example port 443 ... Timeout was reached
client$ curl --resolve ctrl.example:443:203.0.113.40 https://ctrl.example/health
{"status":"ok"}
```

### B03 · 120.1200–143.0200 s

```text
R-EDGE# show ip route 198.51.100.20
Routing entry for 198.51.100.0/24
  Known via "connected", distance 0, metric 0
  * directly connected, via GigabitEthernet0/0/1
R-EDGE# show running-config interface GigabitEthernet0/0/1
interface GigabitEthernet0/0/1
 ip address 198.51.100.1 255.255.255.0
 ip access-group QUARANTINE out
R-EDGE# show ip access-lists QUARANTINE
Extended IP access list QUARANTINE
 10 deny ip any 198.51.100.0 0.0.0.255 log (41 matches)
 20 permit ip any any
%SEC-6-IPACCESSLOGP: list QUARANTINE denied tcp 192.0.2.10(51000) -> 198.51.100.20(443), 1 packet
```

### B04 · 128.0000–146.8200 s

```text
CHG-2042 | R-EDGE | interface Gi0/0/1
VORHER: kein ausgehendes IPv4-ACL-Binding
+ ip access-group QUARANTINE out
Befund: falsche Zone, korrekte Route, passender deny-Counter
```

### B05 · 143.0200–153.5200 s

```text
R-EDGE# configure terminal
R-EDGE(config)# interface GigabitEthernet0/0/1
R-EDGE(config-if)# no ip access-group QUARANTINE out
R-EDGE(config-if)# end
```

### B06 · 148.7800–184.2800 s

```text
client$ curl --connect-timeout 3 --max-time 5 --resolve app-a.example:443:198.51.100.20 --write-out '\nHTTP %{http_code}\n' https://app-a.example/health
{"status":"ok"}
HTTP 200
TEST-A: HTTP 200 | Zertifikat geprüft | Client 192.0.2.10
APP-B: HTTP 200    APP-C: HTTP 200    CTRL-D: HTTP 200
QUARANTINE Regel 10: 41 matches (unverändert)
```

### B07 · 187.4600–192.5600 s

```text
INCIDENT-2042 | geschlossen
Ursache: QUARANTINE an falschem Ausgang gebunden
Eingriff: Binding an Gi0/0/1 zurückgenommen
Verifikation: TEST-A und APP-B/C/CTRL-D erfolgreich
```

## Vollständige Schnittliste

Intervalle sind halboffen [Beginn, Ende); nur das letzte endet am exakten Audioschluss. Sekunden mit vier Dezimalstellen sind die Schnittquelle. L-IDs entsprechen unverändert den Analyse-Lyrics; deren Gesangsfenster steht separat in der Cue-Spalte. Eine Einstellung hält gegebenenfalls nach Gesangsende weiter. Instrumentalzeilen haben keine Lyrics. Sichtbarer Zustand und Verarbeitung stehen in der Handlung; B-IDs verweisen auf die Textbestände. E-IDs gehören jeweils genau einer Einstellung, ihre Akzente stehen im Eventregister.

| Shot | Beginn s | Ende s | Schauplatz | Handlung / sichtbarer Zustand | Kamera | Übergang am Ende | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| S001 | 0.0000 | 8.2900 | STADT | Vom Stadtrand über Stromtrassen zum leuchtenden Rechenzentrum; nur ein Wohnungsfenster antwortet optisch. | Langsame Kranfahrt vom Dachniveau zum einzelnen Fenster; 28 mm. | Schnitt entlang einer vertikalen Lichtkante. | Instrumental; E001; E002 |
| S002 | 8.2900 | 16.5800 | TISCH | Durch das Fenster an den Tisch fahren; Telefon dunkel, Monitor im Bereitschaftszustand. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | Instrumental; E003 |
| S003 | 16.5800 | 18.5400 | TISCH | Das Telefon hebt den dunklen Tisch als Rechteck aus der Nacht; die Person öffnet die Augen. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L001 · Intro · 16.5800–18.3200 s · «Display wird hell.»; E004 |
| S004 | 18.5400 | 22.6200 | STADT | Hinter dem einzelnen Fenster bleiben sämtliche Fassaden dunkel; niemand reagiert auf den Alarm. | Langsame Kranfahrt vom Dachniveau zum einzelnen Fenster; 28 mm. | Schnitt entlang einer vertikalen Lichtkante. | L002 · Intro · 18.5400–22.4000 s · «Die Stadt schläft weiter.»; E005 |
| S005 | 22.6200 | 28.1400 | TICKET | INCIDENT-2042 erscheint neben dem Bereitschaftsnamen; der Cursor steht noch unter der unklaren Meldung. B01. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L003 · Intro · 22.6200–25.5800 s · «Ein Name auf dem Screen.» |
| S006 | 28.1400 | 30.0200 | TISCH | Die Person setzt sich aufrecht hin und nimmt den vorhandenen Bereitschaftsarbeitsplatz in Betrieb. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L004 · Intro · 28.1400–30.0200 s · «Ich bin erreichbar.»; E006 |
| S007 | 30.0200 | 37.2900 | TISCH | Die Person öffnet die Diagnoseoberfläche und legt das Telefon neben die Tastatur. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | Instrumental; E007; E008; E009 |
| S008 | 37.2900 | 44.5600 | PORT | Durch den Monitor in den Rackgang und bis an R-EDGE fahren; die falsche ACL ist bereits gebunden. | Tiefe 24-mm-Fahrt in Flussrichtung; links Eingang, rechts Ausgang. | Headerkante führt in die nächste Schleuse. | Instrumental; E010; E011 |
| S009 | 44.5600 | 48.5600 | TISCH | Das vibrierende Telefon wandert wenige Millimeter über die Holzmaserung, die Hand stoppt es. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L005 · Verse 1 · 44.5600–47.1600 s · «Das Telefon tanzt auf dem Holz,»; E012 |
| S010 | 48.5600 | 52.2800 | TISCH | Fokus vom unberührten kalten Kaffee zur wachen Spiegelung im Monitor. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L006 · Verse 1 · 48.5600–51.0000 s · «der Kaffee von gestern ist kalt.» |
| S011 | 52.2800 | 55.5800 | TICKET | Die Meldung «Alles ist weg» steht über drei noch unbestimmten roten Dienstfeldern. B01. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L007 · Verse 1 · 52.2800–54.6400 s · «Im Ticket steht: «Alles ist weg»,» |
| S012 | 55.5800 | 58.7000 | TICKET | Leere Felder für Standort und Fehler werden nacheinander sichtbar; nichts wird automatisch ergänzt. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L008 · Verse 1 · 55.5800–58.7000 s · «kein Standort, kein Fehler, kein Halt.» |
| S013 | 58.7000 | 62.6800 | TICKET | Antworten ergänzen SITE-2, Client .10 und Beginn nach CHG-2042; die Suchmenge schrumpft. B01. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L009 · Verse 1 · 58.7000–62.6800 s · «Ich frag: Seit wann? Ich frag: Für wen?» |
| S014 | 62.6800 | 66.1600 | TISCH | Die Person schiebt den Screenshot zur Seite und öffnet den echten Testlauf TEST-A. B02. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L010 · Verse 1 · 62.6800–66.1600 s · «Ein Screenshot ersetzt keinen Test.» |
| S015 | 66.1600 | 69.2000 | TICKET | APP-A, APP-B und APP-C bleiben rot; CTRL-D .40 zeigt eine empfangene HTTPS-Antwort. B02. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L011 · Verse 1 · 66.1600–69.2000 s · «Drei Dienste rot, ein vierter grün,»; E013 |
| S016 | 69.2000 | 75.4000 | ROUTE | Drei Lichtschienen vereinigen sich vor Gi0/0/1; der vierte Weg biegt vorher ab. | Seitlicher Dolly entlang der Präfixplatten, 35 mm. | Anschluss auf den markierten Ausgang. | L012 · Verse 1 · 69.2000–72.4200 s · «ich suche den Punkt, der sie verbindet.» |
| S017 | 75.4000 | 78.4200 | TISCH | Die Person nimmt die Hand vom Telefon und hält den Blick auf einem einzigen Befund. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L013 · Pre-Chorus · 75.4000–77.7600 s · «Nicht lauter werden.»; E014; E015 |
| S018 | 78.4200 | 81.4200 | TICKET | Client, Zeit und Ziel werden als drei feste Koordinaten eingerahmt, nicht als neue Vermutung. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L014 · Pre-Chorus · 78.4200–81.4200 s · «Genauer fragen.» · **PRÜFEN** |
| S019 | 81.4200 | 84.7800 | TISCH | Über der Terminaltaste bleibt die Hand ruhig; die Konfiguration ist noch unverändert. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L015 · Pre-Chorus · 81.4200–84.6600 s · «Bevor ich etwas ändere,» |
| S020 | 84.7800 | 89.3200 | PORT | F-A1 wird am Client gestartet und erhält seinen Header; die Kamera sinkt hinter ihn. B03. | Tiefe 24-mm-Fahrt in Flussrichtung; links Eingang, rechts Ausgang. | Headerkante führt in die nächste Schleuse. | L016 · Pre-Chorus · 84.7800–87.8600 s · «will ich den Fehler sehen.» |
| S021 | 89.3200 | 91.1600 | PORT | ON CALL steht am Eingang zur Routerwelt; F-A1 erreicht die intakte Portschleuse. | Tiefe 24-mm-Fahrt in Flussrichtung; links Eingang, rechts Ausgang. | Headerkante führt in die nächste Schleuse. | L017 · Chorus · 89.3200–90.8600 s · «On Call.»; E016; E017 |
| S022 | 91.1600 | 95.9200 | TICKET | Das Display öffnet eine Live-Spur; kein grünes Service-Ergebnis erscheint vorzeitig. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L018 · Chorus · 91.1600–94.5000 s · «Display wird hell.» · **PRÜFEN**; E018 |
| S023 | 95.9200 | 99.1800 | STADT | Über dem Rechenzentrum schiebt sich der Nachtnebel weiter, ohne sichtbare Störung der Stadt. | Langsame Kranfahrt vom Dachniveau zum einzelnen Fenster; 28 mm. | Schnitt entlang einer vertikalen Lichtkante. | L019 · Chorus · 95.9200–98.7600 s · «Die Stadt schläft weiter,» |
| S024 | 99.1800 | 101.7800 | PORT | F-A1 passiert Parser und Eingangsprüfung, sein Ziel .20:443 bleibt lesbar. | Tiefe 24-mm-Fahrt in Flussrichtung; links Eingang, rechts Ausgang. | Headerkante führt in die nächste Schleuse. | L020 · Chorus · 99.1800–101.7800 s · «ich folg dem Signal.» · **PRÜFEN**; E019 |
| S025 | 101.7800 | 106.3200 | ROUTE | Der On-Call-Blick wird zur seitlichen Fahrt an der gültigen Serverroute entlang. | Seitlicher Dolly entlang der Präfixplatten, 35 mm. | Anschluss auf den markierten Ausgang. | L021 · Chorus · 101.7800–105.9200 s · «On Call.» · **PRÜFEN** |
| S026 | 106.3200 | 111.9200 | ACL | F-A1 bleibt an Regel 10 hängen; der Payloadkern wird vollständig verworfen, Antwortweg bleibt leer. | Makrofahrt parallel zur Regelplatte, dann starre Seitenansicht. | Harter Schnitt auf Regelnummer bzw. Counter. | L022 · Chorus · 106.3200–109.8200 s · «Noch keine Antwort.» · **PRÜFEN** |
| S027 | 111.9200 | 113.7400 | TISCH | Die Person hält das Terminal offen, statt die fehlende Antwort als Endpunkt der Arbeit zu behandeln. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L023 · Chorus · 111.9200–113.4800 s · «Doch ich bleib dran,» |
| S028 | 113.7400 | 120.1200 | ACL | Regel, Interface und Testziel werden erstmals in einer gemeinsamen Achse sichtbar. | Makrofahrt parallel zur Regelplatte, dann starre Seitenansicht. | Harter Schnitt auf Regelnummer bzw. Counter. | L024 · Chorus · 113.7400–116.9800 s · «bis ich die Ursache hab.» · **PRÜFEN**; E020; E021 |
| S029 | 120.1200 | 122.3800 | ROUTE | Linkstatus und Präfix stehen grün; ihre Pfeile führen trotzdem in die fehlerhafte ACL-Kammer. B03. | Seitlicher Dolly entlang der Präfixplatten, 35 mm. | Anschluss auf den markierten Ausgang. | L025 · Verse 2 · 120.1200–122.2600 s · «Die Route steht, der Link ist da,»; E022 |
| S030 | 122.3800 | 124.1400 | PORT | Ein separater Gateway-Test erhält Antwort; die Grafik benennt ihn ausdrücklich als Vergleichstest. | Tiefe 24-mm-Fahrt in Flussrichtung; links Eingang, rechts Ausgang. | Headerkante führt in die nächste Schleuse. | L026 · Verse 2 · 122.3800–124.1400 s · «der erste Test geht sauber durch.» |
| S031 | 124.1400 | 126.2000 | ACL | Der HTTPS-SYN erreicht den nächsten Verarbeitungsschritt und endet am falschen Binding. | Makrofahrt parallel zur Regelplatte, dann starre Seitenansicht. | Harter Schnitt auf Regelnummer bzw. Counter. | L027 · Verse 2 · 124.1400–126.1200 s · «Am nächsten Hop verstummt der Flow,»; E023 |
| S032 | 126.2000 | 128.0000 | PORT | Die Kamera fährt die Stationen rückwärts ab: Eingang, Lookup, Ausgangs-ACL; keine Strecke wird übersprungen. | Tiefe 24-mm-Fahrt in Flussrichtung; links Eingang, rechts Ausgang. | Headerkante führt in die nächste Schleuse. | L028 · Verse 2 · 126.2000–128.0000 s · «ich zieh die Spur durch jeden Sprung.» |
| S033 | 128.0000 | 129.9400 | TICKET | CHG-2042 öffnet den Diff der heute gesetzten Interface-Bindung. B04. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L029 · Verse 2 · 128.0000–129.8000 s · «Ein Change von heute, frisch im Log,» |
| S034 | 129.9400 | 131.7800 | ACL | Der zur Probe passende Counter wechselt 40→41 auf QUARANTINE, Ausgang Gi0/0/1. B03. | Makrofahrt parallel zur Regelplatte, dann starre Seitenansicht. | Harter Schnitt auf Regelnummer bzw. Counter. | L030 · Verse 2 · 129.9400–131.7000 s · «ein Counter steigt am falschen Port.» |
| S035 | 131.7800 | 133.2200 | TISCH | Der Pointer verlässt die Neustart-Schaltfläche und bleibt auf dem Interface-Diff. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L031 · Verse 2 · 131.7800–133.2000 s · «Kein Neustart auf Verdacht,» |
| S036 | 133.2200 | 135.6800 | ACL | Nur Regel 10 und das falsche Binding bleiben beleuchtet; andere Regeln werden räumlich zurückgenommen. | Makrofahrt parallel zur Regelplatte, dann starre Seitenansicht. | Harter Schnitt auf Regelnummer bzw. Counter. | L032 · Verse 2 · 133.2200–135.0000 s · «ich grenze ein und prüfe dort.» |
| S037 | 135.6800 | 137.6400 | TICKET | Vorzustand ohne Ausgangs-ACL und aktuelles QUARANTINE-Binding stehen nebeneinander. B04. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L033 · Bridge · 135.6800–137.2600 s · «Da ist der Unterschied.»; E024; E025 |
| S038 | 137.6400 | 139.4000 | ACL | Eine dünne Messlinie verbindet genau diese Diff-Zeile mit der Stelle der Verwerfung. | Makrofahrt parallel zur Regelplatte, dann starre Seitenansicht. | Harter Schnitt auf Regelnummer bzw. Counter. | L034 · Bridge · 137.6400–139.4000 s · «Da fängt die Spur an.» |
| S039 | 139.4000 | 140.9000 | PORT | Die aufgezeichnete kontrollierte Probe wird neben ihrer Counter-Zunahme gelesen; kein zusätzlicher SYN wird erzeugt. | Tiefe 24-mm-Fahrt in Flussrichtung; links Eingang, rechts Ausgang. | Headerkante führt in die nächste Schleuse. | L035 · Bridge · 139.4000–140.9000 s · «Ein Test bestätigt,» |
| S040 | 140.9000 | 143.0200 | TICKET | Die Beweiskarte ordnet Log, Binding und Match-Zunahme demselben Test zu. B03/B04. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L036 · Bridge · 140.9000–143.0200 s · «was das Ticket nicht sagen kann.» |
| S041 | 143.0200 | 145.2200 | TISCH | Finger auf Enter, Terminalzeile fertig eingegeben; der Eingriff ist noch nicht ausgeführt. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L037 · Bridge · 143.0200–145.1600 s · «Die Hand liegt auf der Taste.» |
| S042 | 145.2200 | 146.8200 | TICKET | Die Änderungsvorschau enthält nur no ip access-group QUARANTINE out. B05. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L038 · Bridge · 145.2200–146.8200 s · «Der nächste Schritt steht fest.»; E026 |
| S043 | 146.8200 | 148.7800 | ACL | Bei 146.82 s löst sich allein die Ausgangsbindung; die gespeicherte ACL bleibt im Regelarchiv. B05. | Makrofahrt parallel zur Regelplatte, dann starre Seitenansicht. | Harter Schnitt auf Regelnummer bzw. Counter. | L039 · Bridge · 146.8200–148.7600 s · «Erst verstehen, dann verändern.» |
| S044 | 148.7800 | 153.5200 | PORT | Bei 148.78 s entsteht F-A2: neues TCP-Paket, derselbe Service-Test TEST-A. B06. | Tiefe 24-mm-Fahrt in Flussrichtung; links Eingang, rechts Ausgang. | Headerkante führt in die nächste Schleuse. | L040 · Bridge · 148.7800–150.1400 s · «Dann derselbe Test.» |
| S045 | 153.5200 | 156.8000 | PORT | Der Final-Hook öffnet den nun freien Ausgang, F-A2 passiert die frühere Sperrstelle. | Tiefe 24-mm-Fahrt in Flussrichtung; links Eingang, rechts Ausgang. | Headerkante führt in die nächste Schleuse. | L041 · Final Chorus · 153.5200–154.7000 s · «On Call.»; E027; E028; E029 |
| S046 | 156.8000 | 160.2000 | TICKET | Das Testdisplay empfängt SYN/ACK und TLS-Fortschritt; noch kein Abschluss vor dem HTTP-Status. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L042 · Final Chorus · 156.8000–158.3400 s · «Display wird hell.» |
| S047 | 160.2000 | 163.9800 | STADT | Gleiche Totale wie im ersten Refrain, ein Datenlicht zieht unbemerkt unter den Strassen entlang. | Langsame Kranfahrt vom Dachniveau zum einzelnen Fenster; 28 mm. | Schnitt entlang einer vertikalen Lichtkante. | L043 · Final Chorus · 160.2000–162.5600 s · «Die Stadt schläft weiter,» |
| S048 | 163.9800 | 165.5800 | DIENST | F-A2 erreicht APP-A; die Antwort wird im Dienst erzeugt und zur Rückreise vorbereitet. | Vom Empfangstor in die Halle, 32 mm; Antwortfahrt zurück. | Antwortlicht als Match Cut zum Testdisplay. | L044 · Final Chorus · 163.9800–165.5800 s · «ich folg dem Signal.» |
| S049 | 165.5800 | 169.8800 | DIENST | Die HTTP-Antwort verlässt APP-A über den unveränderten Rückweg; Header und Antwortkörper bleiben getrennte Schichten. | Vom Empfangstor in die Halle, 32 mm; Antwortfahrt zurück. | Antwortlicht als Match Cut zum Testdisplay. | Instrumental |
| S050 | 169.8800 | 171.6600 | TISCH | Die Person folgt dem eingehenden Antwortindikator mit den Augen, ruhig und konzentriert. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L045 · Final Chorus · 169.8800–170.8400 s · «On Call.» |
| S051 | 171.6600 | 175.0200 | TICKET | Ursache steht nun als «falsches ACL-Binding nach CHG-2042» über dem belegten Diff. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L046 · Final Chorus · 171.6600–173.7400 s · «Jetzt hat der Fehler einen Namen.»; E030 |
| S052 | 175.0200 | 177.4600 | TICKET | Testartefakte werden an INCIDENT-2042 angehängt; die Spur bleibt prüfbar. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L047 · Final Chorus · 175.0200–177.4400 s · «Ich halte die Spur,» |
| S053 | 177.4600 | 184.2800 | DIENST | APP-A antwortet 200; APP-B und APP-C werden separat grün, CTRL-D bleibt erreichbar. B06. | Vom Empfangstor in die Halle, 32 mm; Antwortfahrt zurück. | Antwortlicht als Match Cut zum Testdisplay. | L048 · Final Chorus · 177.4600–181.1600 s · «bis der Service wieder läuft.»; E031 |
| S054 | 184.2800 | 187.4600 | TISCH | Leerer Stuhlrand und kalter Kaffee füllen das Bild; nur die Person atmet aus. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L049 · Outro · 184.2800–187.4600 s · «Kein Applaus im leeren Zimmer.»; E032 |
| S055 | 187.4600 | 192.5600 | TICKET | INCIDENT-2042 schliesst mit Ursache, Eingriff und vier Prüfergebnissen. B07. | Orthogonale 70-mm-Fahrt an der Displayfläche; Schrift unverzerrt. | Cursorlinie als Match Cut zur Lichtschiene. | L050 · Outro · 187.4600–191.5200 s · «Nur ein Ticket, das sich schliesst.» |
| S056 | 192.5600 | 195.8400 | TISCH | Telefon sperrt seinen Bildschirm; das Terminal bleibt für Dokumentation zunächst offen. | Ruhige 50-mm-Nahaufnahme auf Augen-/Handhöhe; Fokus von Objekt zu Display. | Blickanschluss zum Display; keine hektische Montage. | L051 · Outro · 192.5600–194.1600 s · «Display wird dunkel.» · **PRÜFEN** |
| S057 | 195.8400 | 199.0400 | STADT | Das einzelne Fenster wird dunkel, Strassen und Dächer behalten ihren unveränderten Schlaf. | Langsame Kranfahrt vom Dachniveau zum einzelnen Fenster; 28 mm. | Schnitt entlang einer vertikalen Lichtkante. | L052 · Outro · 195.8400–199.0400 s · «Die Stadt weiss nichts davon.» · **PRÜFEN**; E033 |
| S058 | 199.0400 | 204.9512 | STADT | Vom Fenster zurück zur Stadt; der freie Serviceweg bleibt unter dem Strassenniveau sichtbar. | Langsame Kranfahrt vom Dachniveau zum einzelnen Fenster; 28 mm. | Schnitt entlang einer vertikalen Lichtkante. | Instrumental; E034; E035; E036; E037 |
| S059 | 204.9512 | 210.8623 | DIENST | In drei Diensthallen laufen neue Transaktionen; keine Rückkehr zum verworfenen F-A1. | Vom Empfangstor in die Halle, 32 mm; Antwortfahrt zurück. | Antwortlicht als Match Cut zum Testdisplay. | Instrumental; E038; E039 |
| S060 | 210.8623 | 216.7735 | STADT | Bei 210.8 s beginnt die visuelle Blende zum unveränderten Audioende; letzte Lichtlinie ist der geprüfte Pfad. | Langsame Kranfahrt vom Dachniveau zum einzelnen Fenster; 28 mm. | Endbild bis 216.7735 s; dann Schwarz mit Dateiende. | Instrumental; E040; E041 |

## Hook- und Wortakzente

Eintritt ist der unveränderte Anfang des Gesangscues. Mehrwort-Hooks erscheinen als zusammenhängende Phrase, da keine gesicherten Wortzeitmarken vorliegen. Betonung: erstes Hauptwort gross/kräftig, übrige Wörter 80% dieser Höhe. Haltezeit reicht bis Gesangsende; unter 1.2 s lange Sprachcues bleiben als kleine technische Karte weiter lesbar, der grosse Wortakzent endet rechtzeitig vor dem nächsten Cue. Der erste gemessene Onset innerhalb des Cues steuert nur einen Kontur-/Bewegungsimpuls (Messunsicherheit ±0.04 s), keinen behaupteten Wortanfang. Keine nachträgliche Quantisierung.

| Lyric | Wort / Betonung | Eintritt s | Ende grosser Akzent s | Haltezeit s | Gemessener Onset s | Bildhandlung |
| --- | --- | ---: | ---: | ---: | --- | --- |
| L017 | ON CALL · kräftiger Eintritt, ruhiger Halt | 89.3200 | 90.8600 | 1.5400 | 89.3810 | ON CALL steht am Eingang zur Routerwelt; F-A1 erreicht die intakte Portschleuse. |
| L021 | ON CALL · kräftiger Eintritt, ruhiger Halt | 101.7800 | 105.9200 | 4.1400 | 101.8510 | Der On-Call-Blick wird zur seitlichen Fahrt an der gültigen Serverroute entlang. |
| L041 | ON CALL · kräftiger Eintritt, ruhiger Halt | 153.5200 | 154.7000 | 1.1800 | 153.6010 | Der Final-Hook öffnet den nun freien Ausgang, F-A2 passiert die frühere Sperrstelle. |
| L045 | ON CALL · kräftiger Eintritt, ruhiger Halt | 169.8800 | 170.8400 | 0.9600 | 169.9910 | Die Person folgt dem eingehenden Antwortindikator mit den Augen, ruhig und konzentriert. |

## Eventregister: gemessene Akzente und Transkriptgrenzen

Die Zuordnung übernimmt ID, Zeitpunkt und Typ, nicht image_action aus der Analyse. Audio-Akzente ändern nur Inszenierung; Fachzustände folgen dem Szenario. End-Events sind in der Quelle teilweise auf drei Dezimalstellen gerundet und gehören dennoch zur letzten Einstellung.

| Event | Quellenzeit s | Typ / Unsicherheit s | Shot / Raum | Konkrete Verwendung |
| --- | ---: | --- | --- | --- |
| E001 | 0.0000 | start / ±0 | S001 / STADT | Raum bei Dateianfang öffnen; Ausgangszustand gilt bereits. Bezug: Vom Stadtrand über Stromtrassen zum leuchtenden Rechenzentrum; nur ein Wohnungsfenster antwortet optisch. |
| E002 | 1.6000 | energy_fall / ±0.5 | S001 / STADT | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Vom Stadtrand über Stromtrassen zum leuchtenden Rechenzentrum; nur ein Wohnungsfenster antwortet optisch. |
| E003 | 11.0000 | energy_rise / ±0.5 | S002 / TISCH | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Durch das Fenster an den Tisch fahren; Telefon dunkel, Monitor im Bereitschaftszustand. |
| E004 | 16.5800 | section_boundary / ±0.35 | S003 / TISCH | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Das Telefon hebt den dunklen Tisch als Rechteck aus der Nacht; die Person öffnet die Augen. |
| E005 | 22.4000 | energy_rise / ±0.5 | S004 / STADT | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Hinter dem einzelnen Fenster bleiben sämtliche Fassaden dunkel; niemand reagiert auf den Alarm. |
| E006 | 28.7000 | level_gap / ±0.1 | S006 / TISCH | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Die Person setzt sich aufrecht hin und nimmt den vorhandenen Bereitschaftsarbeitsplatz in Betrieb. |
| E007 | 30.0200 | section_boundary / ±0.35 | S007 / TISCH | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Die Person öffnet die Diagnoseoberfläche und legt das Telefon neben die Tastatur. |
| E008 | 30.4000 | energy_rise / ±0.5 | S007 / TISCH | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Die Person öffnet die Diagnoseoberfläche und legt das Telefon neben die Tastatur. |
| E009 | 30.4610 | transient / ±0.04 | S007 / TISCH | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die Person öffnet die Diagnoseoberfläche und legt das Telefon neben die Tastatur. |
| E010 | 38.4810 | transient / ±0.04 | S008 / PORT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Durch den Monitor in den Rackgang und bis an R-EDGE fahren; die falsche ACL ist bereits gebunden. |
| E011 | 43.2000 | energy_fall / ±0.5 | S008 / PORT | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Durch den Monitor in den Rackgang und bis an R-EDGE fahren; die falsche ACL ist bereits gebunden. |
| E012 | 44.5600 | section_boundary / ±0.35 | S009 / TISCH | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Das vibrierende Telefon wandert wenige Millimeter über die Holzmaserung, die Hand stoppt es. |
| E013 | 66.7610 | transient / ±0.04 | S015 / TICKET | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: APP-A, APP-B und APP-C bleiben rot; CTRL-D .40 zeigt eine empfangene HTTPS-Antwort. B02. |
| E014 | 75.4000 | section_boundary / ±0.35 | S017 / TISCH | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Die Person nimmt die Hand vom Telefon und hält den Blick auf einem einzigen Befund. |
| E015 | 75.6000 | energy_fall / ±0.5 | S017 / TISCH | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Die Person nimmt die Hand vom Telefon und hält den Blick auf einem einzigen Befund. |
| E016 | 89.3200 | section_boundary / ±0.35 | S021 / PORT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: ON CALL steht am Eingang zur Routerwelt; F-A1 erreicht die intakte Portschleuse. |
| E017 | 90.5000 | energy_rise / ±0.5 | S021 / PORT | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: ON CALL steht am Eingang zur Routerwelt; F-A1 erreicht die intakte Portschleuse. |
| E018 | 92.6710 | transient / ±0.04 | S022 / TICKET | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Das Display öffnet eine Live-Spur; kein grünes Service-Ergebnis erscheint vorzeitig. |
| E019 | 99.7310 | transient / ±0.04 | S024 / PORT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: F-A1 passiert Parser und Eingangsprüfung, sein Ziel .20:443 bleibt lesbar. |
| E020 | 116.6610 | transient / ±0.04 | S028 / ACL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Regel, Interface und Testziel werden erstmals in einer gemeinsamen Achse sichtbar. |
| E021 | 116.8000 | energy_fall / ±0.5 | S028 / ACL | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Regel, Interface und Testziel werden erstmals in einer gemeinsamen Achse sichtbar. |
| E022 | 120.1200 | section_boundary / ±0.35 | S029 / ROUTE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Linkstatus und Präfix stehen grün; ihre Pfeile führen trotzdem in die fehlerhafte ACL-Kammer. B03. |
| E023 | 125.5810 | transient / ±0.04 | S031 / ACL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der HTTPS-SYN erreicht den nächsten Verarbeitungsschritt und endet am falschen Binding. |
| E024 | 135.6800 | section_boundary / ±0.35 | S037 / TICKET | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Vorzustand ohne Ausgangs-ACL und aktuelles QUARANTINE-Binding stehen nebeneinander. B04. |
| E025 | 136.3710 | transient / ±0.04 | S037 / TICKET | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Vorzustand ohne Ausgangs-ACL und aktuelles QUARANTINE-Binding stehen nebeneinander. B04. |
| E026 | 146.6910 | transient / ±0.04 | S042 / TICKET | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Die Änderungsvorschau enthält nur no ip access-group QUARANTINE out. B05. |
| E027 | 153.5200 | section_boundary / ±0.35 | S045 / PORT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Der Final-Hook öffnet den nun freien Ausgang, F-A2 passiert die frühere Sperrstelle. |
| E028 | 154.1910 | transient / ±0.04 | S045 / PORT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der Final-Hook öffnet den nun freien Ausgang, F-A2 passiert die frühere Sperrstelle. |
| E029 | 154.2000 | energy_fall / ±0.5 | S045 / PORT | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Der Final-Hook öffnet den nun freien Ausgang, F-A2 passiert die frühere Sperrstelle. |
| E030 | 172.4410 | transient / ±0.04 | S051 / TICKET | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Ursache steht nun als «falsches ACL-Binding nach CHG-2042» über dem belegten Diff. |
| E031 | 184.1310 | transient / ±0.04 | S053 / DIENST | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: APP-A antwortet 200; APP-B und APP-C werden separat grün, CTRL-D bleibt erreichbar. B06. |
| E032 | 184.2800 | section_boundary / ±0.35 | S054 / TISCH | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Leerer Stuhlrand und kalter Kaffee füllen das Bild; nur die Person atmet aus. |
| E033 | 196.8000 | energy_fall / ±0.5 | S057 / STADT | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Das einzelne Fenster wird dunkel, Strassen und Dächer behalten ihren unveränderten Schlaf. |
| E034 | 199.0400 | section_boundary / ±0.35 | S058 / STADT | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Vom Fenster zurück zur Stadt; der freie Serviceweg bleibt unter dem Strassenniveau sichtbar. |
| E035 | 199.0400 | last_vocal_end / ±0.5 | S058 / STADT | Gesangsbezogene Typografie beenden; die folgende Instrumentalhandlung führt den Zustand weiter. Bezug: Vom Fenster zurück zur Stadt; der freie Serviceweg bleibt unter dem Strassenniveau sichtbar. |
| E036 | 199.3000 | level_gap / ±0.1 | S058 / STADT | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Vom Fenster zurück zur Stadt; der freie Serviceweg bleibt unter dem Strassenniveau sichtbar. |
| E037 | 199.5510 | transient / ±0.04 | S058 / STADT | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Vom Fenster zurück zur Stadt; der freie Serviceweg bleibt unter dem Strassenniveau sichtbar. |
| E038 | 207.0210 | transient / ±0.04 | S059 / DIENST | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: In drei Diensthallen laufen neue Transaktionen; keine Rückkehr zum verworfenen F-A1. |
| E039 | 210.8000 | fade_candidate / ±0.3 | S059 / DIENST | Gemessenen Endabfall als visuellen Blendenhinweis nutzen; technisch bestätigten Zustand halten. Bezug: In drei Diensthallen laufen neue Transaktionen; keine Rückkehr zum verworfenen F-A1. |
| E040 | 215.3000 | energy_fall / ±0.5 | S060 / STADT | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Bei 210.8 s beginnt die visuelle Blende zum unveränderten Audioende; letzte Lichtlinie ist der geprüfte Pfad. |
| E041 | 216.7740 | end / ±2.0833333333333333e-05 | S060 / STADT | Bild bis zum samplegenauen Audioende abschliessen; gerundete Eventzeit erzeugt keine Überlänge. Bezug: Bei 210.8 s beginnt die visuelle Blende zum unveränderten Audioende; letzte Lichtlinie ist der geprüfte Pfad. |

## Referenz und Übergabeprüfung

[Cisco: IP Access Lists](https://www.cisco.com/c/en/us/support/docs/security/ios-firewall/23602-confaccesslists.html) belegt Interface-Bindung, ACL-Prüfung und Match-Counter. Konkrete Topologie, Change und Bildausgaben sind ein redaktionelles Szenario.

Geprüft: 60 lückenlose Einstellungen von 0 bis 216.7735 s; alle 52 Lyric-Cues mit eigener Bildhandlung und unveränderten Fenstern; alle 41 Events genau einmal zugeordnet; 4 konkret getimte Wortakzente. Audio-/Transkript-SHA und Sampledauer passen zur Analyse. Prüfmarkierungen: L014, L018, L020, L021, L022, L024, L051, L052.

Die Vorlage ist auf Dokumentebene geprüft. Eine spätere Umsetzung prüft diese Zustände im Animatic und in gerenderten Standbildern; hier entstehen noch kein Szenencode, keine Assets und kein Video.
