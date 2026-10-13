# 07 · QoS — Das Innere des Engpasses

Drehbuchfassung: 2026-10-04. Vollständige kreative und technische Vorlage für die spätere Umsetzung; Szenario und Bildausgaben sind simuliert. Aktueller Audio-Kandidat, noch keine finale Release-Auswahl. Originalton, Transkriptzeiten und Analysen werden unverändert verwendet.

## Verbindliche Quellen und Zeitbasis

- Audio: [07_QoS_1.0.wav](07_QoS_1.0.wav) · SHA-256 `2eb5c953db38d50aaeba2bb4d1c6fd761c8764dc961b52581308b7684e30c73f`.
- Transkript: [07_QoS_Transkript.json](07_QoS_Transkript.json) · SHA-256 `ec3d44d4d358ee75abe64e2c712dc00e4507fb719f5d841e11ed93065239b9a9`.
- Analyse: [ASTRA-AUDIO-ANALYSE.json](../../../../videos/kisound/Network-Engineer-Album02/07_QoS/ASTRA-AUDIO-ANALYSE.json) · SHA-256 `449678fb52aa3013ec37e735f01519dee2bc8b2ac6cbda56854232a195a34ed5`.
- Exaktes Ende: **239.0535 s**, 11474568 Samples/Kanal bei 48000 Hz; Timecode 00:03:59.054 ist auf Millisekunden gerundet.
- Geschätztes Bewegungsraster: 129.0 BPM, Sicherheit mittel. Es ersetzt keine Gesangszeit. Keine SFX, Flatlines, Drops oder Stopps allein aus Promptwünschen voraussetzen.
- [Transkript-Prüfhinweise](../TRANSKRIPT-PRUEFUNG.md): automatische Zeiten, keine neue manuelle Hörprüfung. Mit **PRÜFEN** markierte Zeilen bleiben unsicher; ihre Bildhandlung ist vom unklaren Wortlaut unabhängig.

## Welt und Kamerasprache

Die Halle ist eine elastische Maschine mit fester Geometrie. Zwei Eingangsrampen münden in eine Klassifizierung, danach liegen Markierungsstation, Policer, Queue-Schächte, Scheduler und der gemeinsame Ausgang. Dünne mintfarbene RTP-Träger bilden den dringlichen Flow; schwere violette TCP-Träger den Bulk-Transfer. Die weibliche Stimme ist durchgehend dem Echtzeitflow zugeordnet, die männliche dem Transfer. Geräte und Pakete tragen die Stimmen, keine menschlichen Figuren.

Der Engpass besitzt eine sichtbar angeschriebene Vertragskapazität von 100 Mbit/s. Die physische 1-Gbit/s-Portöffnung dahinter ist grösser, doch der gemeinsame 100-Mbit/s-Shaper bestimmt die verfügbare Langzeitrate. Token-Buckets sind Messbehälter mit Bit-Budget, keine Paketspeicher. Ein Policer lehnt nichtkonforme Träger an einer harten Kante ab. Der Shaper hält angenommene Träger in Queues und gibt später Scheduler-Gelegenheiten frei. So erhalten zwei ähnlich klingende Fachwörter räumlich verschiedene Folgen.

Acid-Bewegung verformt Lichtlinien, Federn und die Kamerabahn, niemals Headerwerte oder Queue-Reihenfolge. Die Kamera fährt durch den Ablauf und darf um den Scheduler kreisen, hält aber die Queues auf festen Seiten: RTP links, TCP rechts. Ruhige Counterflächen stehen an der Maschine. Bereits 0–13.30 s zeigen beide Rampen und den gemeinsamen Engpass die Figuren; ein fehlender gesungener Introtext wird nicht nachträglich eingefügt.

## Fachszenario

IOS XE MQC auf einem Router der ASR-1000-Familie, LAN Gi0/0/0, physischer Uplink Gi0/0/1 mit 1 Gbit/s und 100-Mbit/s-Vertragsrate. INGRESS klassifiziert ausschliesslich vertrauenswürdigen Labor-RTP von 192.0.2.10 nach 198.51.100.10 UDP/5004, markiert EF/46 und policet ihn auf 1 Mbit/s. Überschuss wird verworfen; für diesen Film gibt es keine Exceed-Remark-Aktion. TCP-Backup 192.0.2.11→198.51.100.50:443 liegt in class-default, erhält DSCP 0/Best Effort.

Am Ausgang klassifiziert CHILD nach EF: priority 1000 kbit/s für RTP; class-default erhält bandwidth remaining percent 100 mit fair-queue. PARENT formt das Aggregat auf shape average 100000000 und ruft CHILD auf. Die zwei Klassen teilen die Gesamtgrenze; EF ist keine automatische Behandlung ohne diese Policy. Die Markierung besteht ab dem ersten Chorus bereits. Das erste Bild zeigt eine vorangegangene FIFO-Beobachtung nur als ausdrücklich gespeicherten Vergleich; der aktive Pfad verwendet die dargestellte Policy.

Normaler RTP-Flow bietet 0.2 Mbit/s, Bulk im Beispiel mehr als die freie Kapazität. Im Verse 2 verliert ein früher Bulk-Testsegment Q-B17 durch endliche Pufferkapazität, sein TCP-Sender erzeugt Q-B18 als neue Retransmission mit demselben Bytebereich. Das illustriert TCP, behauptet keine RTP-Retransmission. Ab 88.88 s zeigt ein kontrollierter RTP-Burst den Policer: 1.2 Mbit/s angeboten, 1.0 konform, 0.2 Überschuss drop. Danach kehrt die RTP-Angebotsrate auf 0.2 zurück. Ab 104.14 s zeigt der aktive Parent-Shaper das Warten eines Bulk-Trägers und spätere Ausgabe innerhalb des gemeinsamen Token-Budgets. Das verlorene Policer-Paket wird nicht gepuffert.

Der Break verfolgt Classify→Mark→Queue und später Schedule→Shape→Send aus zwei Perspektiven desselben bestehenden Ablaufes. Die Eltern-Shaper-Freigabe und die Kind-Scheduler-Wahl werden zusammen gezeigt; die Worte schreiben keine neue Hardware-Reihenfolge vor. Im Final Chorus bestätigen RTP-Empfang und fortschreitende TCP-ACKs beide Dienste unter unveränderter Kapazität. Bulk läuft in verbleibenden Gelegenheiten, nicht erst nach Ende des Gesprächs.

## Kontinuität

Q-R1 gehört zu UDP/RTP, Q-B17 zu TCP. Weibliche und männliche Motivzuordnung tauscht nie. EF=46 bleibt sechs Bit DSCP; ein vollständiges DS-Feld bei ECN=0 wäre 0xb8, nicht dezimal 46. Best Effort DSCP=0. Klassifizierung und Markierung sind verschiedene Schritte.
Token-Bucket-Füllung ist Bit-Budget, Queue-Füllung eine Zahl angenommener Pakete/Bytes. Policer-Drop Q-RX ist endgültig; er wechselt nie zum Shaper-Puffer. Shaper-Träger Q-BS behält Identität beim Warten, wird später genau einmal ausgegeben. Retransmission Q-B18 ist ein neues Paket desselben TCP-Bytebereichs wie Q-B17.
Summe der langfristigen Ausgabe überschreitet 100 Mbit/s nicht; die physische 1-Gbit/s-Rate und mögliche kurze Bursts sind separat angeschrieben. Priorität preemptiert keinen bereits serialisierten Frame. Gewartete TCP-Frames bleiben innerhalb ihrer Flow-Reihenfolge. Final Chorus zeigt beide aktiven Klassen; kein neuer Policy-Change. Unsichere L024/L027/L031/L042/L043 bleiben markiert; keine Handlung beruht auf ihrer unklaren Worterkennung.

## Bildschirmtexte und Lesedauer

Die folgenden B-IDs sind vollständige Textbestände. Zeitfenster reservieren ihre Präsenz; Resultate erscheinen ausschliesslich nach den unten festgelegten Reveal-Zeiten. Ein vorhandener Konfigurationsauszug ist keine neu ausgeführte Änderung. Plattformprompt und Geräte-ID bleiben an jedem Terminal sichtbar. Hersteller-/Protokollnamen sind sachliche Beschriftungen ohne Logo.

B01 und B02 zeigen die schon aktive Policy; INGRESS, CHILD und PARENT liegen als getrennte Tabs vor. B02 nicht als neu eingegebene Änderung animieren. B03 baut Policer-Resultat bei 90.62 s auf, hält es bis 104.14 s; danach wechselt das aktive Tab auf Parent-Shaper und Queues. 1000/200 Pakete sind das abgeschlossene gleich grosse Paket-Testfenster, Raten die Burst-Langzeitwerte nach Budgetverbrauch. B04 zeigt beide aktiven Empfangsergebnisse erst 173.02–178.44 s; davor sind die Zeilen als erwartete Prüfkriterien markiert. Unsichere Sprachzeilen ändern keine Werte.

MQC-Ausgaben sind gekürzte, simulierte Ausschnitte; Tabellen-Raten sind abgeschlossene Messfenster nach Verbrauch des Burst-Budgets. Kurze Labels stehen mindestens 1.2 s auf der Gerätefläche. CLI-Seiten umfassen höchstens sechs nichtleere Zeilen und bleiben mindestens 4 s unverzerrt lesbar; umfangreiche Auszüge liegen in getrennten Tabs bzw. gleichzeitig auf getrennten Flächen. Der Kameraschnitt löscht den aktiven Bildschirmblock nicht. Typografie verdeckt keine Befunde. Im Bild kleine feste Kennzeichnung «Szenario / simulierte Werte», bei Messdarstellungen zusätzlich Capture-/Testfenster.

| Block | Verfügbare Bildzeit | Vollständiger Textbestand / Seitenhaltung |
| --- | --- | --- |
| B01 | 13.3000–40.9000 s | 1 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 5 Zeilen. |
| B02 | 31.2000–88.8800 s | 5 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 28 Zeilen. |
| B03 | 88.8800–126.1000 s | 3 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 16 Zeilen. |
| B04 | 151.1500–223.7400 s | 2 Seite(n)/Tabs; je Seite mindestens 4 s, Textbestand 8 Zeilen. |

### B01 · 13.3000–40.9000 s

```text
RTP: 192.0.2.10 -> 198.51.100.10 UDP dst 5004
DSCP EF = 46 | ECN 0 | DS-Feld 0xb8
Backup: 192.0.2.11 -> 198.51.100.50 TCP dst 443
DSCP Best Effort = 0
Physischer Port 1 Gbit/s | Vertrags-/Shaperrate 100 Mbit/s
```

### B02 · 31.2000–88.8800 s

```text
ip access-list extended RTP-TRUSTED
 permit udp host 192.0.2.10 host 198.51.100.10 eq 5004
class-map match-all REALTIME-IN
 match access-group name RTP-TRUSTED
class-map match-all EF-OUT
 match dscp ef
policy-map INGRESS
 class REALTIME-IN
  set dscp ef
  police cir 1000000 bc 31250
   conform-action transmit
   exceed-action drop
 class class-default
  set dscp default
policy-map CHILD
 class EF-OUT
  priority 1000
 class class-default
  bandwidth remaining percent 100
  fair-queue
policy-map PARENT
 class class-default
  shape average 100000000
  service-policy CHILD
interface GigabitEthernet0/0/0
 service-policy input INGRESS
interface GigabitEthernet0/0/1
 service-policy output PARENT
```

### B03 · 88.8800–126.1000 s

```text
R-QOS# show policy-map interface GigabitEthernet0/0/0 input
 Service-policy input: INGRESS
  Class-map: REALTIME-IN
   police:
    cir 1000000 bps, bc 31250 bytes
    conformed 1000 packets; actions: transmit
    exceeded 200 packets; actions: drop
Overlay Burst: angeboten 1.2 Mbit/s, konform 1.0, drop 0.2
Danach RTP-Angebot wieder 0.2 Mbit/s
R-QOS# show policy-map interface GigabitEthernet0/0/1 output
 Service-policy output: PARENT
  Class-map: class-default
   shape (average) cir 100000000
   Service-policy : CHILD
    Class-map: EF-OUT | Priority: 1000 kbps
    Class-map: class-default | bandwidth remaining 100%
```

### B04 · 151.1500–223.7400 s

```text
Szenario-Messfenster (keine garantierten Produktwerte)
RTP angeboten/empfangen: 0.2 Mbit/s
Bulk nutzt verbleibende Freigaben; ACK-Bytes steigen
Gemeinsame langfristige Ausgabe: <= 100 Mbit/s
RTP-Queue-Beispiel: 2 Pakete | Bulk-Queue-Beispiel: 48 Pakete
Policer-Drop Q-RX: endgültig
Shaper-Paket Q-BS: später ausgegeben
Policy INGRESS / CHILD / PARENT unverändert
```

## Vollständige Schnittliste

Intervalle sind halboffen [Beginn, Ende); nur das letzte endet am exakten Audioschluss. Sekunden mit vier Dezimalstellen sind die Schnittquelle. L-IDs entsprechen unverändert den Analyse-Lyrics; deren Gesangsfenster steht separat in der Cue-Spalte. Eine Einstellung hält gegebenenfalls nach Gesangsende weiter. Instrumentalzeilen haben keine Lyrics. Sichtbarer Zustand und Verarbeitung stehen in der Handlung; B-IDs verweisen auf die Textbestände. E-IDs gehören jeweils genau einer Einstellung, ihre Akzente stehen im Eventregister.

| Shot | Beginn s | Ende s | Schauplatz | Handlung / sichtbarer Zustand | Kamera | Übergang am Ende | Lyric-/Event-Cues |
| --- | ---: | ---: | --- | --- | --- | --- | --- |
| S001 | 0.0000 | 6.6500 | HALLE | Beide Rampen bei 0 s sichtbar: RTP links mint, TCP rechts violett; unter ihnen ein datierter FIFO-Vergleich mit Jitter. | 24-mm-Fahrt von den zwei Rampen zum einzigen gemeinsamen Ausgang. | Eine feste Rampenkante verbindet den Anschluss. | Instrumental; E001 |
| S002 | 6.6500 | 13.3000 | CLASS | Aktive INGRESS- und CHILD/PARENT-Policy zeigen; RTP EF/46, Bulk BE/0, beide schon vor 13.30 s im Bild. | Orthogonale 50-mm-Nahaufnahme von Match-Feldern und Markierungsstempel. | Headerfeld führt zum passenden Queue-Eingang. | Instrumental |
| S003 | 13.3000 | 15.4800 | HALLE | Chorusauftakt öffnet beide bereits klassifizierten Verkehrsarten und den gemeinsamen 100-Mbit/s-Engpass. | 24-mm-Fahrt von den zwei Rampen zum einzigen gemeinsamen Ausgang. | Eine feste Rampenkante verbindet den Anschluss. | L001 · Chorus · 13.3000–14.9400 s · «Quality of Service.»; E002 |
| S004 | 15.4800 | 20.9200 | CLASS | EF/46 und Best Effort/0 stehen an verschiedenen Headern, nicht als gleiche Warteklasse. B01. | Orthogonale 50-mm-Nahaufnahme von Match-Feldern und Markierungsstempel. | Headerfeld führt zum passenden Queue-Eingang. | L002 · Chorus · 15.4800–18.5800 s · «Nicht alles gleich.» |
| S005 | 20.9200 | 22.5200 | SCHED | Bei neuer Freigabe wählt der Scheduler einen wartenden RTP-Träger, ein schon gesendeter Frame wird nicht unterbrochen. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L003 · Chorus · 20.9200–22.4400 s · «Echtzeit zuerst,» |
| S006 | 22.5200 | 28.3800 | QUEUE | TCP-Träger bleibt in seiner Queue und rückt nach, sobald Kapazität frei ist. | 35-mm-Dolly zwischen linker RTP- und rechter TCP-Queue. | Paket-ID bleibt über Warte- und Ausgangsperspektive erhalten. | L004 · Chorus · 22.5200–26.1000 s · «was warten kann, reiht sich ein.» |
| S007 | 28.3800 | 31.2000 | HALLE | QUALITY OF SERVICE spannt beide Rampen und den einzigen Ausgang zusammen. | 24-mm-Fahrt von den zwei Rampen zum einzigen gemeinsamen Ausgang. | Eine feste Rampenkante verbindet den Anschluss. | L005 · Chorus · 28.3800–29.9000 s · «Quality of Service.» |
| S008 | 31.2000 | 35.2400 | SCHED | Vertragsgrenze 100 Mbit/s bleibt fest; Markierungen verbreitern den Ausgang nicht. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L006 · Chorus · 31.2000–33.9000 s · «Wir teilen diesen Draht.» |
| S009 | 35.2400 | 38.4800 | CLASS | Class-Map liest den vertrauenswürdigen Match und setzt den EF-Kontext; keine unbegrenzte Vertrauensannahme. | Orthogonale 50-mm-Nahaufnahme von Match-Feldern und Markierungsstempel. | Headerfeld führt zum passenden Queue-Eingang. | L007 · Chorus · 35.2400–37.4600 s · «Die Klasse setzt den Rahmen,» |
| S010 | 38.4800 | 40.9000 | SCHED | Die aktive Policy verbindet Parent-Shaper und Child-Scheduler in einer Maschine. B02. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L008 · Chorus · 38.4800–40.9000 s · «die Policy hält den Takt.» |
| S011 | 40.9000 | 46.6333 | QUEUE | Ein RTP-Paket vom Eingang zur kleinen Queue verfolgen; danach denselben Blick auf Bulk ausweiten. | 35-mm-Dolly zwischen linker RTP- und rechter TCP-Queue. | Paket-ID bleibt über Warte- und Ausgangsperspektive erhalten. | Instrumental; E003; E004 |
| S012 | 46.6333 | 52.3667 | SCHED | Freigabe vom Parent-Shaper und Auswahl des Child-Schedulers von oben sichtbar verbinden. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | Instrumental; E005 |
| S013 | 52.3667 | 58.1000 | TCP | Datierte Bulk-Verlustprobe als gespeicherten Vorbefund vorbereiten; aktive Policy bleibt bestehen. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | Instrumental |
| S014 | 58.1000 | 61.5000 | TCP | Backup-Träger Q-B17 zeigt einen konkreten TCP-Bytebereich und schreitet zum gemeinsamen Engpass. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | L009 · Verse 2 · 58.1000–60.6200 s · «Ich trag die Dateien Stück für Stück,»; E006; E007; E008 |
| S015 | 61.5000 | 65.3800 | TCP | Seq=24001 Len=1200 und spätere ACK-Werte messen den fortschreitenden Transfer. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | L010 · Verse 2 · 61.5000–63.6400 s · «TCP zählt meine Bytes.» |
| S016 | 65.3800 | 68.6000 | QUEUE | Im gespeicherten Verlustfenster fällt Q-B17 bei voller endlicher TCP-Queue aus; aktive Vergleichsebene ist datiert. | 35-mm-Dolly zwischen linker RTP- und rechter TCP-Queue. | Paket-ID bleibt über Warte- und Ausgangsperspektive erhalten. | L011 · Verse 2 · 65.3800–67.0800 s · «Geht ein Segment verloren,» |
| S017 | 68.6000 | 72.7000 | TCP | Q-B18 entsteht als neuer Retransmission-Frame mit gleichem Bytebereich, neuer Frame-ID. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | L012 · Verse 2 · 68.6000–71.0600 s · «schick ich es noch mal auf die Reise.»; E009 |
| S018 | 72.7000 | 76.0400 | QUEUE | Bulk fordert nur verbleibende Bediengelegenheiten; es gibt keine absolute EF-Ausgabesperre für TCP. | 35-mm-Dolly zwischen linker RTP- und rechter TCP-Queue. | Paket-ID bleibt über Warte- und Ausgangsperspektive erhalten. | L013 · Verse 2 · 72.7000–76.0400 s · «Gib mir den Anteil, der mir bleibt,» |
| S019 | 76.0400 | 80.1000 | SCHED | TCP wartet auf eine freie Gelegenheit, RTP erhält seine priorisierte Behandlung. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L014 · Verse 2 · 76.0400–78.3800 s · «ich muss nicht vor dir durch die Tür.» |
| S020 | 80.1000 | 83.4000 | ZIEL | Mintfarbener RTP-Frame erreicht seinen Empfänger zeitgerecht; keine menschliche Figur übernimmt die Rolle. | 32-mm-Fahrt vom gemeinsamen Ausgang zu zwei getrennten Empfangspanels. | Bestätigter Empfang verbindet Schnitt zum betreffenden Flow. | L015 · Verse 2 · 80.1000–82.6600 s · «Du brauchst den Satz im Augenblick,»; E010; E011 |
| S021 | 83.4000 | 88.8800 | TCP | Violetter Backupflow zählt neu bestätigte Bytes, beide Verkehrsarten laufen weiter. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | L016 · Verse 2 · 83.4000–85.7800 s · «ich brauch den Rest der Strecke hier.»; E012 |
| S022 | 88.8800 | 90.6200 | POLICE | Kontrollierter RTP-Burst leert das Policer-Budget; Überschuss beginnt an der harten Kante. B03. | Starre Seitenansicht des Token-Buckets und seiner Drop-Kante. | Drop schneidet zum Verlustcounter, konformer Frame fährt weiter. | L017 · Bridge · 88.8800–90.6200 s · «Policing zieht die Grenze.»; E013 |
| S023 | 90.6200 | 95.4800 | POLICE | Konform sendet, exceed drop verwirft Q-RX endgültig; die Policy verwendet hier keine Remark-Aktion. | Starre Seitenansicht des Token-Buckets und seiner Drop-Kante. | Drop schneidet zum Verlustcounter, konformer Frame fährt weiter. | L018 · Bridge · 90.6200–93.0200 s · «Zu viel wird markiert oder fällt.» |
| S024 | 95.4800 | 97.9400 | POLICE | Q-RX hat keinen Warteplatz, sein Verlustcounter wächst sofort. | Starre Seitenansicht des Token-Buckets und seiner Drop-Kante. | Drop schneidet zum Verlustcounter, konformer Frame fährt weiter. | L019 · Bridge · 95.4800–97.8600 s · «Kein Warten auf den nächsten Platz,» |
| S025 | 97.9400 | 104.1400 | CLASS | Die konkrete Policy zeigt exceed-action drop; Text, Counter und Innenmechanik stimmen überein. | Orthogonale 50-mm-Nahaufnahme von Match-Feldern und Markierungsstempel. | Headerfeld führt zum passenden Queue-Eingang. | L020 · Bridge · 97.9400–100.6200 s · «wenn diese Policy es so bestellt.» |
| S026 | 104.1400 | 107.0400 | QUEUE | Parent-Shaper hält angenommenen Bulk-Träger Q-BS bis zum verfügbaren Bit-Budget zurück. | 35-mm-Dolly zwischen linker RTP- und rechter TCP-Queue. | Paket-ID bleibt über Warte- und Ausgangsperspektive erhalten. | L021 · Bridge · 104.1400–107.0400 s · «Shaping hält den Überschuss zurück,» |
| S027 | 107.0400 | 111.0800 | QUEUE | Q-BS liegt unverändert im TCP-Puffer, der Policer-Drop bleibt im getrennten Verlustarchiv. | 35-mm-Dolly zwischen linker RTP- und rechter TCP-Queue. | Paket-ID bleibt über Warte- und Ausgangsperspektive erhalten. | L022 · Bridge · 107.0400–111.0800 s · «im Puffer wartet mein Paket.» |
| S028 | 111.0800 | 113.6800 | SCHED | Token replenishment öffnet Ausgabegelegenheiten in geglätteter mittlerer Rate. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L023 · Bridge · 111.0800–113.6800 s · «Es glättet meinen Strom,» |
| S029 | 113.6800 | 117.1200 | QUEUE | Q-BS verlässt seine Queue genau einmal, wenn Parent-Freigabe und Scheduler-Wahl zusammenpassen. | 35-mm-Dolly zwischen linker RTP- und rechter TCP-Queue. | Paket-ID bleibt über Warte- und Ausgangsperspektive erhalten. | L024 · Bridge · 113.6800–117.1200 s · «bis der nächste Anteil geht.» · **PRÜFEN**; E014 |
| S030 | 117.1200 | 126.1000 | POLICE | Q-RX endgültig verworfen neben Q-BS gepuffert/ausgegeben als zwei unabhängige Vorgänge vergleichen. | Starre Seitenansicht des Token-Buckets und seiner Drop-Kante. | Drop schneidet zum Verlustcounter, konformer Frame fährt weiter. | Instrumental; E015 |
| S031 | 126.1000 | 127.8400 | CLASS | CLASSIFY liest UDP/5004 und vertrauenswürdige Endpunkte; der Frame ist noch unmarkiert. | Orthogonale 50-mm-Nahaufnahme von Match-Feldern und Markierungsstempel. | Headerfeld führt zum passenden Queue-Eingang. | L025 · Break · 126.1000–126.9800 s · «Classify.»; E016; E017 |
| S032 | 127.8400 | 129.7800 | CLASS | MARK setzt DSCP 46 auf demselben neuen RTP-Frame. | Orthogonale 50-mm-Nahaufnahme von Match-Feldern und Markierungsstempel. | Headerfeld führt zum passenden Queue-Eingang. | L026 · Break · 127.8400–128.5400 s · «Mark.»; E018 |
| S033 | 129.7800 | 130.4800 | QUEUE | QUEUE legt den konformen RTP-Frame links ab, ohne den Header erneut zu ändern. | 35-mm-Dolly zwischen linker RTP- und rechter TCP-Queue. | Paket-ID bleibt über Warte- und Ausgangsperspektive erhalten. | L027 · Break · 129.7800–130.4800 s · «Queue.» · **PRÜFEN** |
| S034 | 130.4800 | 133.1400 | SCHED | Nächste freie Ausgabegelegenheit bedient diesen dringlichen RTP-Frame. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L028 · Break · 130.4800–133.1400 s · «Mein Wort muss jetzt hinaus.» |
| S035 | 133.1400 | 141.1000 | TCP | Den Bulk-Frame über seine Queue bis zur nächsten zulässigen Bediengelegenheit verfolgen. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | Instrumental; E019 |
| S036 | 141.1000 | 142.7200 | SCHED | SCHEDULE zeigt die Wahl aus den wartenden Kind-Queues. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L029 · Break · 141.1000–141.8200 s · «Schedule.» |
| S037 | 142.7200 | 143.6400 | SCHED | SHAPE zeigt dazu das übergeordnete 100-Mbit/s-Token-Budget; keine zweite Klassifizierung. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L030 · Break · 142.7200–143.4200 s · «Shape.» |
| S038 | 143.6400 | 145.2000 | HALLE | SEND serialisiert den gewählten neuen Träger durch den gemeinsamen physischen Port. | 24-mm-Fahrt von den zwei Rampen zum einzigen gemeinsamen Ausgang. | Eine feste Rampenkante verbindet den Anschluss. | L031 · Break · 143.6400–145.2000 s · «Send.» · **PRÜFEN** |
| S039 | 145.2000 | 151.1500 | TCP | Bulk bekommt folgende verbleibende Gelegenheiten und sendet weitere bestätigbare Bytes. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | L032 · Break · 145.2000–149.0800 s · «Ich nutze, was noch bleibt.»; E020 |
| S040 | 151.1500 | 152.7000 | HALLE | Final-Hook öffnet dieselbe Hallenachse mit ruhiger Queue-Belegung. | 24-mm-Fahrt von den zwei Rampen zum einzigen gemeinsamen Ausgang. | Eine feste Rampenkante verbindet den Anschluss. | L033 · Final Chorus · 151.1500–152.7000 s · «Quality of Service.»; E021; E022 |
| S041 | 152.7000 | 158.9300 | CLASS | EF/46 und BE/0 bleiben verschieden behandelt, dieselben Policy-Namen bleiben aktiv. | Orthogonale 50-mm-Nahaufnahme von Match-Feldern und Markierungsstempel. | Headerfeld führt zum passenden Queue-Eingang. | L034 · Final Chorus · 152.7000–156.3600 s · «Nicht alles gleich.»; E023 |
| S042 | 158.9300 | 160.0600 | SCHED | RTP wird bei freier Gelegenheit gewählt; eine laufende Serialisierung endet zuvor. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L035 · Final Chorus · 158.9300–160.0600 s · «Echtzeit zuerst,» |
| S043 | 160.0600 | 165.9400 | QUEUE | TCP rückt danach um einen Platz vor und bleibt innerhalb seines Flows geordnet. | 35-mm-Dolly zwischen linker RTP- und rechter TCP-Queue. | Paket-ID bleibt über Warte- und Ausgangsperspektive erhalten. | L036 · Final Chorus · 160.0600–163.7600 s · «was warten kann, reiht sich ein.»; E024 |
| S044 | 165.9400 | 169.0000 | HALLE | QUALITY OF SERVICE markiert nun den bestätigten gemeinsamen Betrieb. | 24-mm-Fahrt von den zwei Rampen zum einzigen gemeinsamen Ausgang. | Eine feste Rampenkante verbindet den Anschluss. | L037 · Final Chorus · 165.9400–167.7600 s · «Quality of Service.» |
| S045 | 169.0000 | 173.0200 | SCHED | Vertragsgrenze bleibt 100 Mbit/s, kein breiterer Ausgang entsteht im Finale. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | L038 · Final Chorus · 169.0000–171.5400 s · «Wir teilen diesen Draht.»; E025 |
| S046 | 173.0200 | 176.4200 | ZIEL | RTP-Empfang zeigt vollständige Beispielsequenz und geringe Queue-Verzögerung. B04. | 32-mm-Fahrt vom gemeinsamen Ausgang zu zwei getrennten Empfangspanels. | Bestätigter Empfang verbindet Schnitt zum betreffenden Flow. | L039 · Final Chorus · 173.0200–175.0600 s · «Dein Satz kommt wieder klar,» |
| S047 | 176.4200 | 178.4400 | TCP | ACK-Werte steigen während des laufenden Gesprächs; «danach» bedeutet folgende Bediengelegenheiten. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | L040 · Final Chorus · 176.4200–178.4400 s · «mein Transfer läuft danach.»; E026 |
| S048 | 178.4400 | 186.8200 | SCHED | Mehrere neue RTP-/TCP-Träger bedienen; Parent-Budget und 100-Mbit/s-Langzeitrate sichtbar halten. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Freigabeimpuls führt zum gemeinsamen Ausgang. | Instrumental; E027; E028 |
| S049 | 186.8200 | 195.2000 | ZIEL | RTP-Empfang und wachsende TCP-ACKs an zwei getrennten Zielen gleichzeitig zeigen. | 32-mm-Fahrt vom gemeinsamen Ausgang zu zwei getrennten Empfangspanels. | Bestätigter Empfang verbindet Schnitt zum betreffenden Flow. | Instrumental |
| S050 | 195.2000 | 196.8200 | ZIEL | Weibliche Frage liegt am RTP-Empfangs-/Rückkanal, kein neuer Ausfall wird ausgelöst. | 32-mm-Fahrt vom gemeinsamen Ausgang zu zwei getrennten Empfangspanels. | Bestätigter Empfang verbindet Schnitt zum betreffenden Flow. | L041 · Outro · 195.2000–196.8200 s · «Hörst du mich?»; E029 |
| S051 | 196.8200 | 203.7700 | ZIEL | RTP-Sequenz am Empfänger prüfen; keine Sprachzeile erfinden. | 32-mm-Fahrt vom gemeinsamen Ausgang zu zwei getrennten Empfangspanels. | Bestätigter Empfang verbindet Schnitt zum betreffenden Flow. | Instrumental; E030; E031; E032 |
| S052 | 203.7700 | 210.7200 | TCP | Parallel steigt der Transferfortschritt; Onset 208.481 s akzentuiert ein neues ACK. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | Instrumental; E033 |
| S053 | 210.7200 | 215.9800 | ZIEL | Unsichere Antwort «Klar und deutlich»: bestätigte RTP-Testanzeige bleibt stehen, keine neue technische Funktion. | 32-mm-Fahrt vom gemeinsamen Ausgang zu zwei getrennten Empfangspanels. | Bestätigter Empfang verbindet Schnitt zum betreffenden Flow. | L042 · Outro · 210.7200–212.1200 s · «Klar und deutlich.» · **PRÜFEN**; E034 |
| S054 | 215.9800 | 222.3400 | TCP | Männlicher Transferflow arbeitet weiter und zählt bestätigte Bytes, ohne Voice-Rolle zu wechseln. | Makrofahrt entlang Sequenzbereich und ACK-Linie. | Bytebereich als Match Cut zum neuen Retransmission-Frame. | L043 · Outro · 215.9800–219.2800 s · «Mein Transfer läuft noch.» · **PRÜFEN** |
| S055 | 222.3400 | 223.7400 | HALLE | PASST verbindet beide Empfangspanels mit derselben unveränderten gemeinsamen Rate. | 24-mm-Fahrt von den zwei Rampen zum einzigen gemeinsamen Ausgang. | Eine feste Rampenkante verbindet den Anschluss. | L044 · Outro · 222.3400–223.7400 s · «Passt.» |
| S056 | 223.7400 | 231.3968 | HALLE | Durch die Halle zurück zu beiden Eingangsrampen fahren; Rollen und Markierungen bleiben stabil. | 24-mm-Fahrt von den zwei Rampen zum einzigen gemeinsamen Ausgang. | Eine feste Rampenkante verbindet den Anschluss. | Instrumental; E035; E036; E037; E038 |
| S057 | 231.3968 | 239.0535 | SCHED | Ab 233.1 s visuelle Blende auf den weiterhin einzigen gemeinsamen Ausgang. | Langsame 28-mm-Orbitfahrt um Freigabe und Scheduler, Seitenzuordnung bleibt sichtbar. | Endbild bis 239.0535 s; dann Schwarz mit Dateiende. | Instrumental; E039; E040; E041; E042 |

## Hook- und Wortakzente

Eintritt ist der unveränderte Anfang des Gesangscues. Mehrwort-Hooks erscheinen als zusammenhängende Phrase, da keine gesicherten Wortzeitmarken vorliegen. Betonung: erstes Hauptwort gross/kräftig, übrige Wörter 80% dieser Höhe. Haltezeit reicht bis Gesangsende; unter 1.2 s lange Sprachcues bleiben als kleine technische Karte weiter lesbar, der grosse Wortakzent endet rechtzeitig vor dem nächsten Cue. Der erste gemessene Onset innerhalb des Cues steuert nur einen Kontur-/Bewegungsimpuls (Messunsicherheit ±0.04 s), keinen behaupteten Wortanfang. Keine nachträgliche Quantisierung.

| Lyric | Wort / Betonung | Eintritt s | Ende grosser Akzent s | Haltezeit s | Gemessener Onset s | Bildhandlung |
| --- | --- | ---: | ---: | ---: | --- | --- |
| L001 | QUALITY OF SERVICE · kräftiger Eintritt, ruhiger Halt | 13.3000 | 14.9400 | 1.6400 | 13.3610 | Chorusauftakt öffnet beide bereits klassifizierten Verkehrsarten und den gemeinsamen 100-Mbit/s-Engpass. |
| L005 | QUALITY OF SERVICE · kräftiger Eintritt, ruhiger Halt | 28.3800 | 29.9000 | 1.5200 | 28.4710 | QUALITY OF SERVICE spannt beide Rampen und den einzigen Ausgang zusammen. |
| L025 | CLASSIFY · kräftiger Eintritt, ruhiger Halt | 126.1000 | 126.9800 | 0.8800 | 126.1510 | CLASSIFY liest UDP/5004 und vertrauenswürdige Endpunkte; der Frame ist noch unmarkiert. |
| L026 | MARK · kräftiger Eintritt, ruhiger Halt | 127.8400 | 128.5400 | 0.7000 | 128.0110 | MARK setzt DSCP 46 auf demselben neuen RTP-Frame. |
| L027 | QUEUE · kräftiger Eintritt, ruhiger Halt | 129.7800 | 130.4800 | 0.7000 | 129.8710 | QUEUE legt den konformen RTP-Frame links ab, ohne den Header erneut zu ändern. |
| L029 | SCHEDULE · kräftiger Eintritt, ruhiger Halt | 141.1000 | 141.8200 | 0.7200 | 141.1610 | SCHEDULE zeigt die Wahl aus den wartenden Kind-Queues. |
| L030 | SHAPE · kräftiger Eintritt, ruhiger Halt | 142.7200 | 143.4200 | 0.7000 | 142.7810 | SHAPE zeigt dazu das übergeordnete 100-Mbit/s-Token-Budget; keine zweite Klassifizierung. |
| L031 | SEND · kräftiger Eintritt, ruhiger Halt | 143.6400 | 145.2000 | 1.5600 | 143.7210 | SEND serialisiert den gewählten neuen Träger durch den gemeinsamen physischen Port. |
| L033 | QUALITY OF SERVICE · kräftiger Eintritt, ruhiger Halt | 151.1500 | 152.7000 | 1.5500 | 151.1510 | Final-Hook öffnet dieselbe Hallenachse mit ruhiger Queue-Belegung. |
| L037 | QUALITY OF SERVICE · kräftiger Eintritt, ruhiger Halt | 165.9400 | 167.7600 | 1.8200 | 166.0410 | QUALITY OF SERVICE markiert nun den bestätigten gemeinsamen Betrieb. |
| L044 | PASST · kräftiger Eintritt, ruhiger Halt | 222.3400 | 223.7400 | 1.4000 | 222.4410 | PASST verbindet beide Empfangspanels mit derselben unveränderten gemeinsamen Rate. |

## Eventregister: gemessene Akzente und Transkriptgrenzen

Die Zuordnung übernimmt ID, Zeitpunkt und Typ, nicht image_action aus der Analyse. Audio-Akzente ändern nur Inszenierung; Fachzustände folgen dem Szenario. End-Events sind in der Quelle teilweise auf drei Dezimalstellen gerundet und gehören dennoch zur letzten Einstellung.

| Event | Quellenzeit s | Typ / Unsicherheit s | Shot / Raum | Konkrete Verwendung |
| --- | ---: | --- | --- | --- |
| E001 | 0.0000 | start / ±0 | S001 / HALLE | Raum bei Dateianfang öffnen; Ausgangszustand gilt bereits. Bezug: Beide Rampen bei 0 s sichtbar: RTP links mint, TCP rechts violett; unter ihnen ein datierter FIFO-Vergleich mit Jitter. |
| E002 | 13.3000 | section_boundary / ±0.35 | S003 / HALLE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Chorusauftakt öffnet beide bereits klassifizierten Verkehrsarten und den gemeinsamen 100-Mbit/s-Engpass. |
| E003 | 40.9000 | section_boundary / ±0.35 | S011 / QUEUE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Ein RTP-Paket vom Eingang zur kleinen Queue verfolgen; danach denselben Blick auf Bulk ausweiten. |
| E004 | 44.3000 | energy_rise / ±0.5 | S011 / QUEUE | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Ein RTP-Paket vom Eingang zur kleinen Queue verfolgen; danach denselben Blick auf Bulk ausweiten. |
| E005 | 49.8710 | transient / ±0.04 | S012 / SCHED | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Freigabe vom Parent-Shaper und Auswahl des Child-Schedulers von oben sichtbar verbinden. |
| E006 | 58.1000 | section_boundary / ±0.35 | S014 / TCP | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Backup-Träger Q-B17 zeigt einen konkreten TCP-Bytebereich und schreitet zum gemeinsamen Engpass. |
| E007 | 58.9000 | energy_rise / ±0.5 | S014 / TCP | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Backup-Träger Q-B17 zeigt einen konkreten TCP-Bytebereich und schreitet zum gemeinsamen Engpass. |
| E008 | 60.1010 | transient / ±0.04 | S014 / TCP | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Backup-Träger Q-B17 zeigt einen konkreten TCP-Bytebereich und schreitet zum gemeinsamen Engpass. |
| E009 | 69.8710 | transient / ±0.04 | S017 / TCP | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Q-B18 entsteht als neuer Retransmission-Frame mit gleichem Bytebereich, neuer Frame-ID. |
| E010 | 80.5710 | transient / ±0.04 | S020 / ZIEL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Mintfarbener RTP-Frame erreicht seinen Empfänger zeitgerecht; keine menschliche Figur übernimmt die Rolle. |
| E011 | 82.1000 | energy_fall / ±0.5 | S020 / ZIEL | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Mintfarbener RTP-Frame erreicht seinen Empfänger zeitgerecht; keine menschliche Figur übernimmt die Rolle. |
| E012 | 88.0110 | transient / ±0.04 | S021 / TCP | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Violetter Backupflow zählt neu bestätigte Bytes, beide Verkehrsarten laufen weiter. |
| E013 | 88.8800 | section_boundary / ±0.35 | S022 / POLICE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Kontrollierter RTP-Burst leert das Policer-Budget; Überschuss beginnt an der harten Kante. B03. |
| E014 | 114.9000 | energy_fall / ±0.5 | S029 / QUEUE | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Q-BS verlässt seine Queue genau einmal, wenn Parent-Freigabe und Scheduler-Wahl zusammenpassen. |
| E015 | 117.1200 | section_boundary / ±0.35 | S030 / POLICE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Q-RX endgültig verworfen neben Q-BS gepuffert/ausgegeben als zwei unabhängige Vorgänge vergleichen. |
| E016 | 126.1000 | section_boundary / ±0.35 | S031 / CLASS | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: CLASSIFY liest UDP/5004 und vertrauenswürdige Endpunkte; der Frame ist noch unmarkiert. |
| E017 | 127.6000 | energy_fall / ±0.5 | S031 / CLASS | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: CLASSIFY liest UDP/5004 und vertrauenswürdige Endpunkte; der Frame ist noch unmarkiert. |
| E018 | 128.9000 | level_gap / ±0.1 | S032 / CLASS | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: MARK setzt DSCP 46 auf demselben neuen RTP-Frame. |
| E019 | 140.9000 | energy_fall / ±0.5 | S035 / TCP | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Den Bulk-Frame über seine Queue bis zur nächsten zulässigen Bediengelegenheit verfolgen. |
| E020 | 145.6910 | transient / ±0.04 | S039 / TCP | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Bulk bekommt folgende verbleibende Gelegenheiten und sendet weitere bestätigbare Bytes. |
| E021 | 151.1500 | section_boundary / ±0.35 | S040 / HALLE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Final-Hook öffnet dieselbe Hallenachse mit ruhiger Queue-Belegung. |
| E022 | 151.9000 | energy_rise / ±0.5 | S040 / HALLE | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Final-Hook öffnet dieselbe Hallenachse mit ruhiger Queue-Belegung. |
| E023 | 156.8510 | transient / ±0.04 | S041 / CLASS | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: EF/46 und BE/0 bleiben verschieden behandelt, dieselben Policy-Namen bleiben aktiv. |
| E024 | 163.3610 | transient / ±0.04 | S043 / QUEUE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: TCP rückt danach um einen Platz vor und bleibt innerhalb seines Flows geordnet. |
| E025 | 170.8010 | transient / ±0.04 | S045 / SCHED | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Vertragsgrenze bleibt 100 Mbit/s, kein breiterer Ausgang entsteht im Finale. |
| E026 | 178.2510 | transient / ±0.04 | S047 / TCP | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: ACK-Werte steigen während des laufenden Gesprächs; «danach» bedeutet folgende Bediengelegenheiten. |
| E027 | 178.4400 | section_boundary / ±0.35 | S048 / SCHED | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Mehrere neue RTP-/TCP-Träger bedienen; Parent-Budget und 100-Mbit/s-Langzeitrate sichtbar halten. |
| E028 | 181.7000 | energy_rise / ±0.5 | S048 / SCHED | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Mehrere neue RTP-/TCP-Träger bedienen; Parent-Budget und 100-Mbit/s-Langzeitrate sichtbar halten. |
| E029 | 195.2000 | section_boundary / ±0.35 | S050 / ZIEL | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Weibliche Frage liegt am RTP-Empfangs-/Rückkanal, kein neuer Ausfall wird ausgelöst. |
| E030 | 197.1000 | level_gap / ±0.1 | S051 / ZIEL | Kurzer Kontrastakzent im Umfeld der aktiven Oberfläche; kein Ausfall allein aus der Pegellücke. Bezug: RTP-Sequenz am Empfänger prüfen; keine Sprachzeile erfinden. |
| E031 | 197.5000 | energy_rise / ±0.5 | S051 / ZIEL | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: RTP-Sequenz am Empfänger prüfen; keine Sprachzeile erfinden. |
| E032 | 197.7810 | transient / ±0.04 | S051 / ZIEL | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: RTP-Sequenz am Empfänger prüfen; keine Sprachzeile erfinden. |
| E033 | 208.4810 | transient / ±0.04 | S052 / TCP | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Parallel steigt der Transferfortschritt; Onset 208.481 s akzentuiert ein neues ACK. |
| E034 | 212.2000 | energy_rise / ±0.5 | S053 / ZIEL | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Unsichere Antwort «Klar und deutlich»: bestätigte RTP-Testanzeige bleibt stehen, keine neue technische Funktion. |
| E035 | 223.7400 | section_boundary / ±0.35 | S056 / HALLE | Abschnittswechsel durch den angegebenen Kamerablick bzw. die weitergeführte Handlung zeigen; Quelle ist Transkript. Bezug: Durch die Halle zurück zu beiden Eingangsrampen fahren; Rollen und Markierungen bleiben stabil. |
| E036 | 223.7400 | last_vocal_end / ±0.5 | S056 / HALLE | Gesangsbezogene Typografie beenden; die folgende Instrumentalhandlung führt den Zustand weiter. Bezug: Durch die Halle zurück zu beiden Eingangsrampen fahren; Rollen und Markierungen bleiben stabil. |
| E037 | 223.8310 | transient / ±0.04 | S056 / HALLE | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Durch die Halle zurück zu beiden Eingangsrampen fahren; Rollen und Markierungen bleiben stabil. |
| E038 | 224.0000 | energy_rise / ±0.5 | S056 / HALLE | Die in dieser Einstellung vorhandenen Prozessbahnen stärker beleuchten; keine neue technische Zustandsänderung. Bezug: Durch die Halle zurück zu beiden Eingangsrampen fahren; Rollen und Markierungen bleiben stabil. |
| E039 | 233.1000 | fade_candidate / ±0.3 | S057 / SCHED | Gemessenen Endabfall als visuellen Blendenhinweis nutzen; technisch bestätigten Zustand halten. Bezug: Ab 233.1 s visuelle Blende auf den weiterhin einzigen gemeinsamen Ausgang. |
| E040 | 233.1310 | transient / ±0.04 | S057 / SCHED | Ein kurzer Konturimpuls am gerade verfolgten Objekt; kein zusätzlicher SFX und kein erfundener Paketvorgang. Bezug: Ab 233.1 s visuelle Blende auf den weiterhin einzigen gemeinsamen Ausgang. |
| E041 | 237.6000 | energy_fall / ±0.5 | S057 / SCHED | Umgebungslicht zurücknehmen, aktive Befund-/Headerfläche stabil lesbar halten. Bezug: Ab 233.1 s visuelle Blende auf den weiterhin einzigen gemeinsamen Ausgang. |
| E042 | 239.0540 | end / ±2.0833333333333333e-05 | S057 / SCHED | Bild bis zum samplegenauen Audioende abschliessen; gerundete Eventzeit erzeugt keine Überlänge. Bezug: Ab 233.1 s visuelle Blende auf den weiterhin einzigen gemeinsamen Ausgang. |

## Referenz und Übergabeprüfung

[Cisco: Applying QoS Features Using the MQC](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/qos_mqc/configuration/xe-16-12/qos-mqc-xe-16-12-book/qos-intro.html) ist die Referenz für Class-/Policy-Maps und Shaper mit Child-Policy. Die Laborwerte, angebotenen Raten und Ausgabeausschnitte sind simuliert.

Geprüft: 57 lückenlose Einstellungen von 0 bis 239.0535 s; alle 44 Lyric-Cues mit eigener Bildhandlung und unveränderten Fenstern; alle 42 Events genau einmal zugeordnet; 11 konkret getimte Wortakzente. Audio-/Transkript-SHA und Sampledauer passen zur Analyse. Prüfmarkierungen: L024, L027, L031, L042, L043.

Die Vorlage ist auf Dokumentebene geprüft. Eine spätere Umsetzung prüft diese Zustände im Animatic und in gerenderten Standbildern; hier entstehen noch kein Szenencode, keine Assets und kein Video.
