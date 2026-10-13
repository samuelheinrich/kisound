# 02 · Active / Standby — Die Doppelanlage

Drehbuchfassung: 2026-10-04. Vollständige kreative und technische Vorlage für die spätere Umsetzung; Szenario und Bildausgaben sind simuliert. Aktueller Audio-Kandidat, noch keine finale Release-Auswahl. Originalton, Transkriptzeiten und Analysen werden unverändert verwendet.

## Verbindliche Quellen und Zeitbasis

- Audio: [02_Active_Standby_1.0.wav](02_Active_Standby_1.0.wav) · SHA-256 `42750eb28bf676ef697bc26cddb9c28ec62390336e462783111b69db2446c86c`.
- Transkript: [02_Active_Standby_Transkript.json](02_Active_Standby_Transkript.json) · SHA-256 `a3a1ccaba0e3d7604a47d5f666becbde8d2052ddc68a89b1cb2b0526e7ca71dc`.
- Analyse: [ASTRA-AUDIO-ANALYSE.json](../../../../videos/kisound/Network-Engineer-Album02/02_Active_Standby/ASTRA-AUDIO-ANALYSE.json) · SHA-256 `fa3360c56592a5136411f8bc53996b6ce8e52489934700b1ee0b6d5a472be405`.
- Exaktes Ende: **203.1735 s**, 9752328 Samples/Kanal bei 48000 Hz; Timecode 00:03:23.174 ist auf Millisekunden gerundet.
- Geschätztes Bewegungsraster: 134.0 BPM, Sicherheit mittel. Es ersetzt keine Gesangszeit. Keine SFX, Flatlines, Drops oder Stopps allein aus Promptwünschen voraussetzen.
- [Transkript-Prüfhinweise](../TRANSKRIPT-PRUEFUNG.md): automatische Zeiten, keine neue manuelle Hörprüfung. Mit **PRÜFEN** markierte Zeilen bleiben unsicher; ihre Bildhandlung ist vom unklaren Wortlaut unabhängig.

## Welt und Kamerasprache

Zwei identische Festungen stehen auf einer schwarzen Ebene: A links, kantige orange Kontur; B rechts, cyanfarbene Kontur. Eingravierte Buchstaben bleiben aus jeder Perspektive sichtbar. Die Maschinen erreichen hundert Meter Höhe, ihre Ports bilden auf Bodenniveau gerichtete Ein- und Ausfahrtsschächte. Zwischen ihnen schwebt ein enger, weisser Heartbeat-Tunnel; eine getrennt lesbare Sync-Spur trägt Zustandsplatten. Beide benutzen im Szenario dieselbe ausgefallene physische HA-Verbindung, bleiben funktional jedoch unterschiedliche Vorgänge.

Unter den Festungen liegen Session-Archive: nummerierte Glasplatten mit Tuple, TCP-Zustand und Sequenzstand. Sie sind keine Pakete, sondern Kopien von Zustand. Die gemeinsame Adresse steht als unbeweglicher Ring über dem Produktionsnetz. Nur der aktive Datenpfad darf diesen Ring im gesunden Betrieb bedienen. Während Split Brain treffen zwei gerichtete Pfade auf denselben Ring; seine Position ändert sich nicht.

Klinische grüne Monitorschrift und präzise weisse Statuslinien schneiden in dunkle Maschinenarchitektur. Die Kamera verwendet Spiegelachsen, nie vertauschte Links-rechts-Zuordnung. Beim Konflikt zeigt ein Split Screen beide lokalen Wahrheiten gleichzeitig. Nach dem Eingriff bleibt B rechts und übernimmt die Führung. Keine Körper, Gesichter oder Geister in den Geräten.

## Fachszenario

Zwei gleiche FortiGate-Geräte unter FortiOS 7.6.1 bilden FGCP A-P, group-id 22. Produktionsanschlüsse port1/port2 sind beiderseits vorhanden; gemeinsamer LAN-Endpunkt 192.0.2.1. Im Szenario gibt es nur eine funktionierende HA-Leitung ha1; ihr Ausfall trennt Heartbeat und laufende Session-Replikation. Das ist die konkrete Schwachstelle. session-pickup ist aktiviert; synchronisierte TCP-Sessions sind sichtbar, verlustfreie Übernahme wird nicht behauptet.

Anfang: A Primary/Active (priority 200), B Secondary/Standby (priority 100), override enable beiderseits, in-sync. port1/port2 werden für die HA-Gesundheit überwacht. Bei 89.10 s fällt ha1 aus. A lebt und verarbeitet weiter. B wartet auf das Ende des im Film beobachteten Detection-Timers bis 92.62 s; diese 3.52 s sind ein Szenariowert, kein dokumentierter Standardwert. Danach ist jedes Gerät aus seiner lokalen Sicht Primary. Beide erreichen noch das gemeinsame Produktions-L2; virtuelle MAC-/Adresskonflikte verursachen wechselnde Pfade und unterbrochene Sessions.

Ab 111.38 s werden ausschliesslich As zwei Produktionsanschlüsse über die angeschlossenen IOS-XE-Switches administrativ abgeschaltet. Das ist externes Fencing; nach Abschluss bei 113.26 s darf kein A-Paket mehr das Produktionsnetz erreichen. Zugriff über unabhängige Consoles bleibt. Während A isoliert ist, setzen die lokalen Consoles die gewünschte Wahlpräferenz: A priority 100, B priority 200, override enable auf beiden. ha1 wird bei 117.90 s repariert; B gewinnt bei der Rollenprüfung und ist Autorität für die erneute Zustandssynchronisation. Beide melden ab 125.58 s in-sync. Erst bei 132.04 s werden As Produktionslinks wieder freigegeben; B bleibt dank expliziter Präferenz Primary. Finale: A Standby, B Active; ein neuer End-to-End-Test bestätigt den Dienst. Weitere kurze Testflows im Outro verwenden denselben stabilen Pfad. Die kurz getrennten Archive werden nicht magisch vereinigt.

## Kontinuität

A bleibt orange/links/männliches Stimm-Motiv; B bleibt cyan/rechts/weibliches Stimm-Motiv. Sprecherzuordnung ist gestalterisch fest, bei ASR-Konflikten keine neue Geräteidentität ableiten. Active/Standby sind Rollen; CLI verwendet Primary/Secondary. Unterschiedliche Motive oder Flatline-SFX aus dem Prompt gelten nicht als Messbefund; kein Ton wird hinzugefügt.
S-17 existiert vor der Trennung synchron auf beiden. Nach 89.10 s können lokale Sessionänderungen abweichen; gesunde Synchronisation darf vor 125.58 s nicht angezeigt werden. Bei Wiedervereinigung führt Bs Zustand, Konfliktsessions können neu aufgebaut werden. Fencing erfolgt einmal an A, 111.38–113.26 s. Linkreparatur und Rollenprüfung sind weitere, getrennte Schritte.
Der erste Chorus zeigt A aktiv; der Schluss zeigt B aktiv. Kein späterer Hook löst eine weitere Wahl aus. Der Status im Split Brain wird in zwei einzelnen lokalen Terminals gezeigt; eine angeblich gemeinsame Clusteransicht wäre falsch. Datenpfad, Heartbeat und Zustandskopie haben durchgehend unterschiedliche Pfeilformen.

## Bildschirmtexte und Lesedauer

Die folgenden B-IDs sind vollständige Textbestände. Zeitfenster reservieren ihre Präsenz; Resultate erscheinen ausschliesslich nach den unten festgelegten Reveal-Zeiten. Ein vorhandener Konfigurationsauszug ist keine neu ausgeführte Änderung. Plattformprompt und Geräte-ID bleiben an jedem Terminal sichtbar. Hersteller-/Protokollnamen sind sachliche Beschriftungen ohne Logo.

B01 ist der gesunde Anfangsstatus. B02 zeigt ab 89.10 s nur As unveränderten lokalen Status und Bs Timer; Bs Primary-Zeile kommt erst bei 92.62 s. B03 zeigt die beiden Switch-Terminals nebeneinander, Befehle 111.38–113.26 s. B04 hält A/B als getrennte lokale Consoles; Präferenzänderungen sind vor der erneuten Wahl abgeschlossen, Endstatus erst 123.48 s. B05 zeigt Configuration Status in-sync ab 125.58 s; Session-Sync ist zusätzlich als eigener Bestätigungsbefund angeschrieben, nicht aus Konfigurations-Sync allein abgeleitet. B06 ist vor 132.04 s als VORSCHAU markiert, danach ausgeführt. Ab 171.92 s wird B05 als bereits bestätigter stabiler Status erneut gehalten.

FortiOS-Statusausgaben sind gekürzte, simulierte Ausschnitte; Gerätenamen ersetzen hier die langen Seriennummern, kein unveränderter Geräte-Dump. B03 wird auf zwei parallelen Terminalflächen gehalten (je ein Switch, mindestens 4 s); die zwei Seiten werden nicht in nur 6.52 s nacheinander abgespielt. Kurze Labels stehen mindestens 1.2 s auf der Gerätefläche. CLI-Seiten umfassen höchstens sechs nichtleere Zeilen und bleiben mindestens 4 s unverzerrt lesbar; umfangreiche Auszüge liegen in getrennten Tabs bzw. gleichzeitig auf getrennten Flächen. Der Kameraschnitt löscht den aktiven Bildschirmblock nicht. Typografie verdeckt keine Befunde. Im Bild kleine feste Kennzeichnung «Szenario / simulierte Werte», bei Messdarstellungen zusätzlich Capture-/Testfenster.

| Block | Verfügbare Bildzeit | Vollständiger Textbestand / Seitenhaltung |
| --- | --- | --- |
| B01 | 39.1400–67.4200 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 9 Zeilen. |
| B02 | 89.1000–111.3800 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 9 Zeilen. |
| B03 | 111.3800–117.9000 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 7 Zeilen. |
| B04 | 113.2600–125.5800 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 9 Zeilen. |
| B05 | 125.5800–139.8600 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 8 Zeilen. |
| B06 | 128.8200–139.8600 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |

### B01 · 39.1400–67.4200 s

```text
A # get system ha status
Mode: HA A-P
Group: 22
Primary   : A
Secondary : B
Configuration Status:
 A: in-sync
 B: in-sync
Szenario-Overlay: session-pickup ENABLED | S-17 repliziert
```

### B02 · 89.1000–111.3800 s

```text
A # get system ha status
Mode: HA A-P
Primary: A

B # get system ha status
Mode: HA A-P
Primary: B

LOKALE EINZELANSICHTEN — HA-Verbindung unterbrochen
A: Datenpfad offen    B: Datenpfad offen
Gemeinsame LAN-IP: 192.0.2.1
```

### B03 · 111.3800–117.9000 s

```text
SW-LAN# configure terminal
SW-LAN(config)# interface GigabitEthernet1/0/11
SW-LAN(config-if)# shutdown
SW-WAN# configure terminal
SW-WAN(config)# interface GigabitEthernet1/0/11
SW-WAN(config-if)# shutdown
Overlay: Nur die zwei Anschlüsse zu A isoliert
```

### B04 · 113.2600–125.5800 s

```text
A # config system ha
A (ha) # set priority 100
A (ha) # set override enable
A (ha) # end
B # config system ha
B (ha) # set priority 200
B (ha) # set override enable
B (ha) # end
Overlay: lokale Consoles | HA-Leitung repariert | Wahl: B
```

### B05 · 125.5800–139.8600 s

```text
B # get system ha status
Mode: HA A-P
Primary   : B
Secondary : A
Configuration Status:
 A: in-sync
 B: in-sync
Overlay: Session-Sync S-17 bestätigt; A-Links erst ab 132.04 s freigegeben
```

### B06 · 128.8200–139.8600 s

```text
SW-LAN(config)# interface GigabitEthernet1/0/11
SW-LAN(config-if)# no shutdown
SW-WAN(config)# interface GigabitEthernet1/0/11
SW-WAN(config-if)# no shutdown
Overlay ab 132.04 s: Links A up | A Secondary | B Primary
```

## Vollständige Schnittliste

Intervalle sind halboffen [Beginn, Ende); nur das letzte endet am exakten Audioschluss. Sekunden mit vier Dezimalstellen sind die Schnittquelle. L-IDs entsprechen unverändert den Analyse-Lyrics; deren Gesangsfenster steht separat in der Cue-Spalte. Eine Einstellung hält gegebenenfalls nach Gesangsende weiter. Instrumentalzeilen haben keine Lyrics. Sichtbarer Zustand und Verarbeitung stehen in der Handlung; B-IDs verweisen auf die Textbestände. E-IDs gehören jeweils genau einer Einstellung, ihre Akzente stehen im Eventregister.

| Shot | Beginn s | Ende s | Schauplatz | Handlung / sichtbarer Zustand | Kamera | Übergang am Ende | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| S001 | 0.0000 | 6.2000 | ADRESSE | Beide Festungen aus grosser Höhe, gemeinsamer LAN-Ring vor ihnen; nur A führt einen durchgehenden Datenstrom. | Symmetrische 24-mm-Totale mit Adressring in der Mitte. | Harter Schnitt bei Wechsel der lokalen Statusansicht. | Instrumental; E001; E002; E003 |
| S002 | 6.2000 | 12.4000 | A | Unter As Fassade hinein bis zu den geöffneten port1/port2-Schleusen fahren. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | Instrumental |
| S003 | 12.4000 | 13.9600 | A | A verarbeitet einen TCP-Flow; sein Produktionsausgang ist offen, B bleibt ohne Nutzdaten-Ausgabe. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L001 · Intro · 12.4000–13.9600 s · «Ich trag den Traffic.»; E004 |
| S004 | 13.9600 | 23.7200 | ARCHIV | S-17 entsteht an A; eine lesbare Zustandskopie fährt auf der Sync-Spur nach B. | Makro auf S-17, dann Fahrt durch parallel geordnete Zustandsplatten. | Tuple als Match Cut zwischen den Archiven. | Instrumental; E005 |
| S005 | 23.7200 | 25.5800 | HA | Ein Heartbeat passiert ha1 und wird von B empfangen; keine Sessionplatte wird dafür gehalten. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Anschluss entlang der Heartbeat-Achse. | L002 · Intro · 23.7200–25.5800 s · «Ich hör deinen Puls.»; E006; E007 |
| S006 | 25.5800 | 32.3600 | HA | Heartbeat und Session-Sync als getrennte Bahnen im selben physischen ha1-Tunnel zeigen. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Anschluss entlang der Heartbeat-Achse. | Instrumental; E008 |
| S007 | 32.3600 | 39.1400 | ARCHIV | In Bs Speicher den identischen Tuple ablesen; das Archiv reicht weit unter die Festung. | Makro auf S-17, dann Fahrt durch parallel geordnete Zustandsplatten. | Tuple als Match Cut zwischen den Archiven. | Instrumental; E009 |
| S008 | 39.1400 | 42.8400 | ARCHIV | S-17 wird vom A-Archiv zum B-Archiv kopiert, Tuple und Zustand stimmen überein. B01. | Makro auf S-17, dann Fahrt durch parallel geordnete Zustandsplatten. | Tuple als Match Cut zwischen den Archiven. | L003 · Verse 1 · 39.1400–41.9200 s · «Die Sessions laufen, unser Sync steht.»; E010 |
| S009 | 42.8400 | 46.4000 | HA | Ein neuer Puls zeigt A→B Lebendigkeit, der Empfangszähler wächst. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Anschluss entlang der Heartbeat-Achse. | L004 · Verse 1 · 42.8400–45.2800 s · «Ein Heartbeat sagt dir: Ich bin hier.» |
| S010 | 46.4000 | 49.5400 | A | Der Flow läuft durch port1, Sessionprüfung und port2 in As geöffnetem Datenpfad. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L005 · Verse 1 · 46.4000–48.7200 s · «Ich halte unsern Datenpfad,» |
| S011 | 49.5400 | 53.4800 | ARCHIV | Bs S-17 erhält die nächste Zustandsänderung; die Datenpakete selbst bleiben auf A. | Makro auf S-17, dann Fahrt durch parallel geordnete Zustandsplatten. | Tuple als Match Cut zwischen den Archiven. | L006 · Verse 1 · 49.5400–52.2400 s · «du hältst den Stand von mir.» |
| S012 | 53.4800 | 57.2400 | B | B liest seinen synchronisierten Sessioneintrag, der Produktionsausgang bleibt im Standby. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L007 · Verse 1 · 53.4800–55.7800 s · «Die Flows sind auch bei mir bekannt.» |
| S013 | 57.2400 | 60.4800 | HA | Ein Empfangsmarker an B bestätigt den Puls von A. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Anschluss entlang der Heartbeat-Achse. | L008 · Verse 1 · 57.2400–59.4600 s · «Dein Heartbeat hält uns im Kontakt.» |
| S014 | 60.4800 | 64.1000 | B | Bs Steuerraum bleibt beleuchtet; Standby ist ein laufendes Gerät. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L009 · Verse 1 · 60.4800–63.1200 s · «Ich bleibe wach und hör dich an.» |
| S015 | 64.1000 | 67.4200 | B | Reservepfad und Sessionarchiv liegen bereit, ohne Verkehr zum Adressring zu senden. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L010 · Verse 1 · 64.1000–66.8000 s · «Bereit, wenn ich übernehmen kann.»; E011 |
| S016 | 67.4200 | 70.4400 | A | ACTIVE erscheint direkt auf A; nur As Datenkanal leuchtet. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L011 · Chorus · 67.4200–68.4800 s · «Active.»; E012 |
| S017 | 70.4400 | 74.2400 | B | STANDBY erscheint direkt auf B; Bs Sync-Speicher ist sichtbar. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L012 · Chorus · 70.4400–71.9400 s · «Standby.»; E013 |
| S018 | 74.2400 | 77.5200 | ADRESSE | Ein einziger Pfad durch A erreicht den unveränderten gemeinsamen Adressring. | Symmetrische 24-mm-Totale mit Adressring in der Mitte. | Harter Schnitt bei Wechsel der lokalen Statusansicht. | L013 · Chorus · 74.2400–75.8800 s · «Einer trägt,» |
| S019 | 77.5200 | 79.1000 | ARCHIV | Bs vorbereitete Zustandsplatten stehen parallel zu As arbeitendem Archiv. | Makro auf S-17, dann Fahrt durch parallel geordnete Zustandsplatten. | Tuple als Match Cut zwischen den Archiven. | L014 · Chorus · 77.5200–79.1000 s · «einer steht bereit.»; E014 |
| S020 | 79.1000 | 81.2200 | HA | Der Heartbeat-Tunnel bleibt intakt; der kurze Statushinweis kommt aus dem Empfang. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Anschluss entlang der Heartbeat-Achse. | L015 · Chorus · 79.1000–80.8200 s · «Dein Heartbeat sagt:» · **PRÜFEN** |
| S021 | 81.2200 | 82.3400 | A | A bleibt physisch und logisch aktiv; keine zusätzliche Wahl wird ausgelöst. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L016 · Chorus · 81.2200–82.3400 s · «Ich bin noch hier.»; E015; E016 |
| S022 | 82.3400 | 89.1000 | HA | ha1 und seine einzelne physische Verbindung freistellen; eine Klemmstelle kündigt die Ursache an, Empfang läuft noch. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Anschluss entlang der Heartbeat-Achse. | Instrumental; E017 |
| S023 | 89.1000 | 91.2600 | HA | Bei 89.10 s bricht ha1; der Heartbeat-Empfang stoppt, As Produktionsports bleiben offen. B02. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Anschluss entlang der Heartbeat-Achse. | L017 · Verse 2 · 89.1000–91.2200 s · «Dein Heartbeat fehlt, der Link ist weg.»; E018; E019 |
| S024 | 91.2600 | 92.6200 | B | Bs beobachteter Detection-Timer läuft bis 92.62 s aus; sein letztes Peer-Signal bleibt datiert. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L018 · Verse 2 · 91.2600–92.6200 s · «Der letzte Check läuft aus.» |
| S025 | 92.6200 | 94.5800 | B | Bei 92.62 s wechselt B lokal zu Primary; sein Datenpfad öffnet sich. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L019 · Verse 2 · 92.6200–94.4800 s · «Ich schalte um, ich bin jetzt Active.» |
| S026 | 94.5800 | 96.1400 | A | A sendet weiterhin über port2; es hat keinen Beleg für einen eigenen Ausfall. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L020 · Verse 2 · 94.5800–96.1400 s · «Doch du sendest weiter raus.» |
| S027 | 96.1400 | 99.6600 | ADRESSE | Bs neu geöffneter Pfad trifft auf denselben Ring wie As noch aktiver Pfad. | Symmetrische 24-mm-Totale mit Adressring in der Mitte. | Harter Schnitt bei Wechsel der lokalen Statusansicht. | L021 · Verse 2 · 96.1400–98.9400 s · «Mein Datenpfad ist immer offen.»; E020 |
| S028 | 99.6600 | 102.7400 | A | As lokale Console zeigt weiterhin Primary; B ist dort kein sichtbarer Peer. B02. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L022 · Verse 2 · 99.6600–102.5600 s · «Ich bin noch da. Ich bin Active.» · **PRÜFEN** |
| S029 | 102.7400 | 105.9400 | ADRESSE | SPLIT BRAIN spannt sich zwischen zwei gegeneinander laufenden Flüssen. | Symmetrische 24-mm-Totale mit Adressring in der Mitte. | Harter Schnitt bei Wechsel der lokalen Statusansicht. | L023 · Chorus · 102.7400–104.8600 s · «Split Brain.» · **PRÜFEN**; E021; E022 |
| S030 | 105.9400 | 107.3400 | CONSOLE | Lokale Ansicht A: Primary und lokale Ansicht B: Primary stehen gleichzeitig im Split Screen. B02. | Starre, unverkippte Frontansicht zweier getrennter Console-Flächen. | Geteiltes Bild bleibt nach dem Schnitt gleich orientiert. | L024 · Chorus · 105.9400–107.0200 s · «Beide Active.» |
| S031 | 107.3400 | 108.8200 | ADRESSE | Beide Pfade beanspruchen 192.0.2.1; das gemeinsame Objekt wird nicht dupliziert. | Symmetrische 24-mm-Totale mit Adressring in der Mitte. | Harter Schnitt bei Wechsel der lokalen Statusansicht. | L025 · Chorus · 107.3400–108.8000 s · «Eine Adresse.» |
| S032 | 108.8200 | 111.3800 | ARCHIV | Zwei lokale S-17-Fortschreibungen weichen auseinander; Sync-Leitung bleibt dunkel. | Makro auf S-17, dann Fahrt durch parallel geordnete Zustandsplatten. | Tuple als Match Cut zwischen den Archiven. | L026 · Chorus · 108.8200–110.5800 s · «Kein gemeinsamer Takt.»; E023 |
| S033 | 111.3800 | 113.2600 | A | Ab 111.38 s schliessen die externen Switchports zu A; bei 113.26 s ist die Isolation beider Produktionsanschlüsse vollständig. B03. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L027 · Verse 3 · 111.3800–113.2600 s · «Mein Datenpfad wird isoliert.» · **PRÜFEN**; E024; E025 |
| S034 | 113.2600 | 117.9000 | A | As Ausgang bleibt geschlossen; die lokale Rolle wird erst nach Wiedervereinigung Secondary. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L028 · Verse 3 · 113.2600–116.8200 s · «Ich gebe meine Führung ab.» |
| S035 | 117.9000 | 120.4400 | HA | Bei 117.90 s ist ha1 wieder verbunden; die Kamera folgt einem bestätigten Empfangspuls. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Anschluss entlang der Heartbeat-Achse. | L029 · Verse 3 · 117.9000–120.4400 s · «Der Link steht wieder zwischen uns.» |
| S036 | 120.4400 | 125.5800 | CONSOLE | Isoliertes A bekommt priority 100, B priority 200; die erneute Wahl bestätigt B als Primary. B04. | Starre, unverkippte Frontansicht zweier getrennter Console-Flächen. | Geteiltes Bild bleibt nach dem Schnitt gleich orientiert. | L030 · Verse 3 · 120.4400–123.4800 s · «Wir prüfen unsre Rollen neu.»; E026 |
| S037 | 125.5800 | 128.8200 | ARCHIV | Bs autoritativer Zustand ersetzt veraltete Peer-Einträge; beide Prüfungen melden in-sync. B05. | Makro auf S-17, dann Fahrt durch parallel geordnete Zustandsplatten. | Tuple als Match Cut zwischen den Archiven. | L031 · Verse 3 · 125.5800–128.8200 s · «Dein Puls ist wieder da, der Sync steht.»; E027 |
| S038 | 128.8200 | 132.2600 | B | B trägt den Produktionsflow allein; A wird erst nach dieser Verifikation wieder angeschlossen. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L032 · Verse 3 · 128.8200–132.0400 s · «Ein Pfad trägt unsern Traffic jetzt.» |
| S039 | 132.2600 | 135.1400 | A | Nach Freigabe bei 132.04 s stehen As Ports up, seine Rolle bleibt Secondary/Standby. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L033 · Verse 3 · 132.2600–135.1400 s · «Du hältst als Standby unsern Stand.» · **PRÜFEN** |
| S040 | 135.1400 | 139.8600 | B | Die Führung liegt sichtbar bei B; A empfängt nun Bs Pulse und Zustandskopien. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L034 · Verse 3 · 135.1400–139.7800 s · «Ich führe, während du mich hörst.»; E028 |
| S041 | 139.8600 | 142.4200 | B | Der Final-Hook ACTIVE liegt auf Bs cyanfarbener Fassade. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L035 · Final Chorus · 139.8600–140.1800 s · «Active.» · **PRÜFEN**; E029; E030 |
| S042 | 142.4200 | 146.6600 | B | Ein neuer Testflow läuft durch B und empfängt eine Zielantwort. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L036 · Final Chorus · 142.4200–143.7600 s · «Ich trag den Traffic.» |
| S043 | 146.6600 | 147.3400 | A | STANDBY liegt auf der weiterhin orangefarbenen A-Fassade. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L037 · Final Chorus · 146.6600–147.3400 s · «Standby.» |
| S044 | 147.3400 | 150.7200 | ARCHIV | A hält jetzt Bs Zustand bereit; Pfeilrichtung des Sync ist B→A. | Makro auf S-17, dann Fahrt durch parallel geordnete Zustandsplatten. | Tuple als Match Cut zwischen den Archiven. | L038 · Final Chorus · 147.3400–150.7200 s · «Ich halte mich bereit.» · **PRÜFEN** |
| S045 | 150.7200 | 156.0600 | ARCHIV | Den umgekehrten Sync B→A an einem neuen Sessionstand verfolgen. | Makro auf S-17, dann Fahrt durch parallel geordnete Zustandsplatten. | Tuple als Match Cut zwischen den Archiven. | Instrumental |
| S046 | 156.0600 | 161.4000 | ADRESSE | Über die wieder offenen A-Ports hinweg zum gemeinsamen Ring fahren; nur B sendet Nutzdaten. | Symmetrische 24-mm-Totale mit Adressring in der Mitte. | Harter Schnitt bei Wechsel der lokalen Statusansicht. | Instrumental |
| S047 | 161.4000 | 163.6400 | B | Erneutes ACTIVE bestätigt den bestehenden B-Zustand, ohne Rollenwechsel. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L039 · Final Chorus · 161.4000–161.8600 s · «Active.»; E031 |
| S048 | 163.6400 | 167.0600 | A | Erneutes STANDBY bestätigt A als Reservegerät mit offenen physischen Ports. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L040 · Final Chorus · 163.6400–165.3600 s · «Standby.» |
| S049 | 167.0600 | 170.3000 | ADRESSE | Ein klarer Produktionspfad durch B trägt den gemeinsamen Ring. | Symmetrische 24-mm-Totale mit Adressring in der Mitte. | Harter Schnitt bei Wechsel der lokalen Statusansicht. | L041 · Final Chorus · 167.0600–168.3800 s · «Ein klarer Pfad.» · **PRÜFEN** |
| S050 | 170.3000 | 171.9200 | HA | Beiderseitiger Empfang wächst; ha1 bleibt sichtbar intakt. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Anschluss entlang der Heartbeat-Achse. | L042 · Final Chorus · 170.3000–171.9200 s · «Dein Puls ist wieder da.» · **PRÜFEN**; E032 |
| S051 | 171.9200 | 180.7900 | B | Kontrollierter neuer TCP-Test auf B, SYN, SYN/ACK und ACK werden als neue Frames geführt. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | Instrumental; E033; E034 |
| S052 | 180.7900 | 189.6600 | CONSOLE | B Primary und A Secondary mit in-sync gleichzeitig mindestens acht Sekunden lesbar halten. B05. | Starre, unverkippte Frontansicht zweier getrennter Console-Flächen. | Geteiltes Bild bleibt nach dem Schnitt gleich orientiert. | Instrumental; E035 |
| S053 | 189.6600 | 192.4000 | B | Outro-ACTIVE leuchtet auf B; ein neuer kleiner Flow passiert denselben stabilen Pfad. | Gerader 35-mm-Dolly an cyan markierter B-Fassade; B bleibt rechts. | Schnitt über das unveränderte B-Emblem. | L043 · Outro – Wiederholung · 189.6600–190.5400 s · «Active.» · **PRÜFEN**; E036 |
| S054 | 192.4000 | 193.6800 | A | Outro-STANDBY leuchtet auf A; das Archiv bleibt synchron, kein Nutzdatenpfad wird aktiv. | Gerader 35-mm-Dolly an orange markierter A-Fassade; A bleibt links. | Schnitt über das unveränderte A-Emblem. | L044 · Outro – Wiederholung · 192.4000–193.6800 s · «Standby.» · **PRÜFEN**; E037; E038 |
| S055 | 193.6800 | 198.4268 | ADRESSE | Von den Archiveschächten heraus in die Totalenachse; B führt weiter. | Symmetrische 24-mm-Totale mit Adressring in der Mitte. | Harter Schnitt bei Wechsel der lokalen Statusansicht. | Instrumental; E039; E040; E041 |
| S056 | 198.4268 | 203.1735 | HA | Bei 197.2 s visuelle Blende beginnen; Pulsbahn und B-Datenpfad bleiben bis zuletzt geordnet. | Seitliche 50-mm-Fahrt entlang der weissen Verbindung A→B. | Endbild bis 203.1735 s; dann Schwarz mit Dateiende. | Instrumental; E042; E043; E044 |

## Hook- und Wortakzente

Eintritt ist der unveränderte Anfang des Gesangscues. Mehrwort-Hooks erscheinen als zusammenhängende Phrase, da keine gesicherten Wortzeitmarken vorliegen. Betonung: erstes Hauptwort gross/kräftig, übrige Wörter 80% dieser Höhe. Haltezeit reicht bis Gesangsende; unter 1.2 s lange Sprachcues bleiben als kleine technische Karte weiter lesbar, der grosse Wortakzent endet rechtzeitig vor dem nächsten Cue. Der erste gemessene Onset innerhalb des Cues steuert nur einen Kontur-/Bewegungsimpuls (Messunsicherheit ±0.04 s), keinen behaupteten Wortanfang. Keine nachträgliche Quantisierung.

| Lyric | Wort / Betonung | Eintritt s | Ende grosser Akzent s | Haltezeit s | Gemessener Onset s | Bildhandlung |
| --- | --- | ---: | ---: | ---: | --- | --- |
| L011 | ACTIVE · kräftiger Eintritt, ruhiger Halt | 67.4200 | 68.4800 | 1.0600 | 67.6410 | ACTIVE erscheint direkt auf A; nur As Datenkanal leuchtet. |
| L012 | STANDBY · kräftiger Eintritt, ruhiger Halt | 70.4400 | 71.9400 | 1.5000 | 70.5410 | STANDBY erscheint direkt auf B; Bs Sync-Speicher ist sichtbar. |
| L023 | SPLIT BRAIN · kräftiger Eintritt, ruhiger Halt | 102.7400 | 104.8600 | 2.1200 | 102.7810 | SPLIT BRAIN spannt sich zwischen zwei gegeneinander laufenden Flüssen. |
| L035 | ACTIVE · kräftiger Eintritt, ruhiger Halt | 139.8600 | 140.1800 | 0.3200 | 139.9510 | Der Final-Hook ACTIVE liegt auf Bs cyanfarbener Fassade. |
| L037 | STANDBY · kräftiger Eintritt, ruhiger Halt | 146.6600 | 147.3400 | 0.6800 | 146.6710 | STANDBY liegt auf der weiterhin orangefarbenen A-Fassade. |
| L039 | ACTIVE · kräftiger Eintritt, ruhiger Halt | 161.4000 | 161.8600 | 0.4600 | 161.4410 | Erneutes ACTIVE bestätigt den bestehenden B-Zustand, ohne Rollenwechsel. |
| L040 | STANDBY · kräftiger Eintritt, ruhiger Halt | 163.6400 | 165.3600 | 1.7200 | 163.6810 | Erneutes STANDBY bestätigt A als Reservegerät mit offenen physischen Ports. |
| L043 | ACTIVE · kräftiger Eintritt, ruhiger Halt | 189.6600 | 190.5400 | 0.8800 | 189.7710 | Outro-ACTIVE leuchtet auf B; ein neuer kleiner Flow passiert denselben stabilen Pfad. |
| L044 | STANDBY · kräftiger Eintritt, ruhiger Halt | 192.4000 | 193.6800 | 1.2800 | 192.5610 | Outro-STANDBY leuchtet auf A; das Archiv bleibt synchron, kein Nutzdatenpfad wird aktiv. |

## Eventregister: gemessene Akzente und Transkriptgrenzen

Die Zuordnung übernimmt ID, Zeitpunkt und Typ, nicht image_action aus der Analyse. Audio-Akzente ändern nur Inszenierung; Fachzustände folgen dem Szenario. End-Events sind in der Quelle teilweise auf drei Dezimalstellen gerundet und gehören dennoch zur letzten Einstellung.

| Event | Quellenzeit s | Typ / Unsicherheit s | Shot / Raum | Konkrete Verwendung |
| --- | ---: | --- | --- | --- |
| E001 | 0.0000 | start / ±0 | S001 / ADRESSE | Raum bei Dateianfang öffnen; Ausgangszustand gilt bereits. Bezug: Beide Festungen aus grosser Höhe, gemeinsamer LAN-Ring vor ihnen; nur A führt einen durchgehenden Datenstrom. |
| E002 | 0.1000 | level_gap / ±0.1 | S001 / ADRESSE | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: Beide Festungen aus grosser Höhe, gemeinsamer LAN-Ring vor ihnen; nur A führt einen durchgehenden Datenstrom. |
| E003 | 1.6000 | energy_fall / ±0.5 | S001 / ADRESSE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Beide Festungen aus grosser Höhe, gemeinsamer LAN-Ring vor ihnen; nur A führt einen durchgehenden Datenstrom. |
| E004 | 12.4000 | section_boundary / ±0.35 | S003 / A | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: A verarbeitet einen TCP-Flow; sein Produktionsausgang ist offen, B bleibt ohne Nutzdaten-Ausgabe. |
| E005 | 14.3000 | energy_rise / ±0.5 | S004 / ARCHIV | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: S-17 entsteht an A; eine lesbare Zustandskopie fährt auf der Sync-Spur nach B. |
| E006 | 25.3210 | transient / ±0.04 | S005 / HA | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Ein Heartbeat passiert ha1 und wird von B empfangen; keine Sessionplatte wird dafür gehalten. |
| E007 | 25.4000 | energy_rise / ±0.5 | S005 / HA | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Ein Heartbeat passiert ha1 und wird von B empfangen; keine Sessionplatte wird dafür gehalten. |
| E008 | 25.5800 | section_boundary / ±0.35 | S006 / HA | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Heartbeat und Session-Sync als getrennte Bahnen im selben physischen ha1-Tunnel zeigen. |
| E009 | 39.0000 | energy_rise / ±0.5 | S007 / ARCHIV | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: In Bs Speicher den identischen Tuple ablesen; das Archiv reicht weit unter die Festung. |
| E010 | 39.1400 | section_boundary / ±0.35 | S008 / ARCHIV | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: S-17 wird vom A-Archiv zum B-Archiv kopiert, Tuple und Zustand stimmen überein. B01. |
| E011 | 65.1710 | transient / ±0.04 | S015 / B | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Reservepfad und Sessionarchiv liegen bereit, ohne Verkehr zum Adressring zu senden. |
| E012 | 67.4200 | section_boundary / ±0.35 | S016 / A | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: ACTIVE erscheint direkt auf A; nur As Datenkanal leuchtet. |
| E013 | 70.8000 | energy_fall / ±0.5 | S017 / B | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: STANDBY erscheint direkt auf B; Bs Sync-Speicher ist sichtbar. |
| E014 | 78.6010 | transient / ±0.04 | S019 / ARCHIV | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Bs vorbereitete Zustandsplatten stehen parallel zu As arbeitendem Archiv. |
| E015 | 81.4000 | level_gap / ±0.1 | S021 / A | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: A bleibt physisch und logisch aktiv; keine zusätzliche Wahl wird ausgelöst. |
| E016 | 82.2000 | energy_rise / ±0.5 | S021 / A | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: A bleibt physisch und logisch aktiv; keine zusätzliche Wahl wird ausgelöst. |
| E017 | 82.3400 | section_boundary / ±0.35 | S022 / HA | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: ha1 und seine einzelne physische Verbindung freistellen; eine Klemmstelle kündigt die Ursache an, Empfang läuft noch. |
| E018 | 89.1000 | section_boundary / ±0.35 | S023 / HA | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Bei 89.10 s bricht ha1; der Heartbeat-Empfang stoppt, As Produktionsports bleiben offen. B02. |
| E019 | 91.1410 | transient / ±0.04 | S023 / HA | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Bei 89.10 s bricht ha1; der Heartbeat-Empfang stoppt, As Produktionsports bleiben offen. B02. |
| E020 | 97.4110 | transient / ±0.04 | S027 / ADRESSE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Bs neu geöffneter Pfad trifft auf denselben Ring wie As noch aktiver Pfad. |
| E021 | 102.7400 | section_boundary / ±0.35 | S029 / ADRESSE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: SPLIT BRAIN spannt sich zwischen zwei gegeneinander laufenden Flüssen. |
| E022 | 103.6810 | transient / ±0.04 | S029 / ADRESSE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: SPLIT BRAIN spannt sich zwischen zwei gegeneinander laufenden Flüssen. |
| E023 | 110.2000 | energy_rise / ±0.5 | S032 / ARCHIV | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Zwei lokale S-17-Fortschreibungen weichen auseinander; Sync-Leitung bleibt dunkel. |
| E024 | 111.3800 | section_boundary / ±0.35 | S033 / A | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Ab 111.38 s schliessen die externen Switchports zu A; bei 113.26 s ist die Isolation beider Produktionsanschlüsse vollständig. B03. |
| E025 | 111.7410 | transient / ±0.04 | S033 / A | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Ab 111.38 s schliessen die externen Switchports zu A; bei 113.26 s ist die Isolation beider Produktionsanschlüsse vollständig. B03. |
| E026 | 121.5910 | transient / ±0.04 | S036 / CONSOLE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Isoliertes A bekommt priority 100, B priority 200; die erneute Wahl bestätigt B als Primary. B04. |
| E027 | 126.8000 | energy_fall / ±0.5 | S037 / ARCHIV | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Bs autoritativer Zustand ersetzt veraltete Peer-Einträge; beide Prüfungen melden in-sync. B05. |
| E028 | 136.4000 | energy_rise / ±0.5 | S040 / B | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Die Führung liegt sichtbar bei B; A empfängt nun Bs Pulse und Zustandskopien. |
| E029 | 139.8600 | section_boundary / ±0.35 | S041 / B | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Der Final-Hook ACTIVE liegt auf Bs cyanfarbener Fassade. |
| E030 | 139.9510 | transient / ±0.04 | S041 / B | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Der Final-Hook ACTIVE liegt auf Bs cyanfarbener Fassade. |
| E031 | 162.7810 | transient / ±0.04 | S047 / B | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Erneutes ACTIVE bestätigt den bestehenden B-Zustand, ohne Rollenwechsel. |
| E032 | 170.8410 | transient / ±0.04 | S050 / HA | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Beiderseitiger Empfang wächst; ha1 bleibt sichtbar intakt. |
| E033 | 171.9200 | section_boundary / ±0.35 | S051 / B | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Kontrollierter neuer TCP-Test auf B, SYN, SYN/ACK und ACK werden als neue Frames geführt. |
| E034 | 175.1000 | energy_rise / ±0.5 | S051 / B | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Kontrollierter neuer TCP-Test auf B, SYN, SYN/ACK und ACK werden als neue Frames geführt. |
| E035 | 181.5910 | transient / ±0.04 | S052 / CONSOLE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: B Primary und A Secondary mit in-sync gleichzeitig mindestens acht Sekunden lesbar halten. B05. |
| E036 | 189.6600 | section_boundary / ±0.35 | S053 / B | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Outro-ACTIVE leuchtet auf B; ein neuer kleiner Flow passiert denselben stabilen Pfad. |
| E037 | 193.0000 | energy_rise / ±0.5 | S054 / A | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Outro-STANDBY leuchtet auf A; das Archiv bleibt synchron, kein Nutzdatenpfad wird aktiv. |
| E038 | 193.2310 | transient / ±0.04 | S054 / A | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Outro-STANDBY leuchtet auf A; das Archiv bleibt synchron, kein Nutzdatenpfad wird aktiv. |
| E039 | 193.6800 | section_boundary / ±0.35 | S055 / ADRESSE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Von den Archiveschächten heraus in die Totalenachse; B führt weiter. |
| E040 | 193.6800 | last_vocal_end / ±0.5 | S055 / ADRESSE | Gesangsbezogene Typografie beenden; die folgende Instrumentalhandlung führt den Zustand weiter. Bezug: Von den Archiveschächten heraus in die Totalenachse; B führt weiter. |
| E041 | 197.2000 | fade_candidate / ±0.3 | S055 / ADRESSE | Gemessenen Endabfall als visuellen Blendenhinweis nutzen; technisch bestätigten Zustand halten. Bezug: Von den Archiveschächten heraus in die Totalenachse; B führt weiter. |
| E042 | 199.5010 | transient / ±0.04 | S056 / HA | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Bei 197.2 s visuelle Blende beginnen; Pulsbahn und B-Datenpfad bleiben bis zuletzt geordnet. |
| E043 | 201.7000 | energy_fall / ±0.5 | S056 / HA | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Bei 197.2 s visuelle Blende beginnen; Pulsbahn und B-Datenpfad bleiben bis zuletzt geordnet. |
| E044 | 203.1730 | end / ±2.0833333333333333e-05 | S056 / HA | Bild bis zum samplegenauen Audioende abschliessen; gerundete Eventzeit erzeugt keine Überlänge. Bezug: Bei 197.2 s visuelle Blende beginnen; Pulsbahn und B-Datenpfad bleiben bis zuletzt geordnet. |

## Referenz und Übergabeprüfung

[Fortinet: Troubleshoot an HA formation, FortiOS 7.6.1](https://docs.fortinet.com/document/fortigate/7.6.1/administration-guide/946059/troubleshoot-an-ha-formation) beschreibt Split Brain durch fehlende Heartbeat-Kommunikation und die Prüfung mit get system ha status. Recovery-Reihenfolge und Timer sind für diesen Film festgelegte Szenariowerte. [FortiOS 7.6.1 CLI: config system ha](https://docs.fortinet.com/document/fortigate/7.6.1/cli-reference/857448677/config-system-ha) belegt priority, override und session-pickup.

Geprüft: 56 lückenlose Einstellungen von 0 bis 203.1735 s; alle 44 Lyric-Cues mit eigener Bildhandlung und unveränderten Fenstern; alle 44 Events genau einmal zugeordnet; 9 konkret getimte Wortakzente. Audio-/Transkript-SHA und Sampledauer passen zur Analyse. Prüfmarkierungen: L015, L022, L023, L027, L033, L035, L038, L041, L042, L043, L044.

Die Vorlage ist auf Dokumentebene geprüft. Eine spätere Umsetzung prüft diese Zustände im Animatic und in gerenderten Standbildern; hier entstehen noch kein Szenencode, keine Assets und kein Video.
