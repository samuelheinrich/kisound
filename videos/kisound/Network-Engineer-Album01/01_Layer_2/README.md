# Layer 2 · Browservorschau

Vollständiges codebasiertes Musikvideo: eine abstrakte Netzwerkwelt lernt Adressen,
trennt VLANs, gerät in eine Schleife und findet zu sauberer Weiterleitung zurück.
22 Kapitel, vier 3D-Räume und unverändertes Originalaudio. Die erste Abnahme erfolgt im Browser.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Network-Engineer-Album01/01_Layer_2"
npm ci
npm run preview
```

Der Befehl öffnet Google Chrome unter **http://127.0.0.1:8128/**. Play startet Ton und Bild.
Server beenden: `Ctrl+C`. Alternativer Port: `npm run preview -- 8129`.
`npm run serve` startet den Server ohne automatisches Öffnen.

- `/?res=720`: kleinere Vorschau; Standard ist 1080p.
- `/?t=19.5`: ARP; `?t=42.9`: 802.1Q; `?t=70.5`: L2TPv3.
- `/?t=84`: Loop-Demo; `?t=106.9`: STP-Wiederherstellung.
- `/?t=171.76`: LLDP; `?t=178.5`: LACP; `?t=202.341`: Schlusstext.
- `/?debug=1`: Kapitel, Einstellung, Event- und Lyric-IDs.
- `/?w=1920&h=1080&t=43.8`: deterministisches Einzelbild ohne Player.

Play/Pause mit Leertaste; Pfeile bewegen eine Sekunde, Shift+Pfeil ein Bild auf dem 60-fps-Raster.
Home/End springen zum Originalanfang/-ende. Das Auswahlfeld enthält alle 22 Kapitel.
L/M/F/D schalten Schleife, Stumm, Vollbild und Cue-Diagnose. Geschwindigkeit, Lautstärke,
Auflösung und Scrubbing sind im Player verfügbar. Der Auflösungswechsel erhält die Position.

## Bildstil und Titel

Dunkle petrolfarbene 3D-Räume, Cyan, Violett, sparsame bernsteinfarbene Kontrollsignale
und rote Frame-Kopien im Fehlerzustand. Die Kamera setzt rechtwinklige Schnitte und kurze
Verfolgungen; ARP, Tagging und Kapselung erhalten lesbare Haltepunkte. Es gibt keine Figuren.

Michroma, Space Grotesk und JetBrains Mono sind lokal samt OFL-Lizenzen eingebunden.
**LAYER 2** und **SAMUEL HEINRICH** greifen die Titel der beiden Referenzvideos auf:
metallisches Weiss/Cyan, gesperrter Name und zwei bernsteinfarbene Linien.
Anfangstitel 0,650–8,400 s; Schlusstext ab 202,341 s. Die Netzwerkwelt bleibt dahinter aktiv.
Kein sichtbares ASTRA-Branding, keine Firmenlogos, keine gesungenen Untertitel.

Ein technisches Hauptpanel nimmt höchstens 26,6 % der Bildbreite ein. Die Kamera verschiebt
die Demonstration nach rechts. Syslogs erscheinen als maximal drei kurze Meldungen unten.
Die Meldungen und Netzwerkdaten stammen aus dem redaktionellen Szenario, nicht aus einem
Netzwerkmitschnitt oder aus als Netzwerkzahlen umgedeuteten Audiomessungen.

## Quellen und Timing

- Release-WAV: `01_Layer_2_0.3-1.wav`, gemäss finalem Musikprompt.
- SHA-256: `15b1566f6863945032ca9ca508b26d71b86d594a8d81d9f5ffd2753a28800e8c`.
- 48 kHz, Stereo, 16 Bit; **10’078’088 Samples je Kanal**.
- Exakte Originaldauer: **209,960166667 s**.
- Transkript-SHA-256: `0a685ffdf4c5d1ac8e6150830afb7e56e594ff9aa54d2abd3512cc5699e79fb1`.
- Audioanalyse: `astra.audio.analysis.v1`; geschätzte 128 BPM mit mittlerer Sicherheit.
- 60 fps ergeben **12’598 Bilder**. Letztes Rasterbild: 209,950 s.
  Die spätere Bildspur reicht bis 209,966667 s; der Originalton behält seine genaue Dauer.

`npm run prepare` prüft WAV und Transkript und stellt eine lokale Audiokopie bereit.
`LAYER_2_SOURCE` kann auf einen anderen lokalen Quellordner zeigen; die Prüfsummen müssen passen.
`assets/manifest.json` dokumentiert Quelle, Analyse, Transkript und Schriften.

Vorhandene Analyse und Transkript werden nicht verändert. Die Gesangszeiten sind automatisch
erzeugt, nicht manuell hörverifiziert. Die Umsetzung behauptet keine neue Hörprüfung.

Die Reprise-Grenze E030 bei 125,080 s widerspricht L020 (119,420–133,620 s).
Sie bleibt in der Quelle erhalten und steuert weder Schnitt noch Instrumentalbeginn.
Bei 71,300 s liegt eine kurze RMS-Lücke vor dem kräftigen Anstieg: Licht zurücknehmen,
dann öffnen. VLAN **3** ersetzt die ältere VLAN-30-Angabe entsprechend den Lyrics.

Die letzte transkribierte Stimme endet bei 171,760 s. Weitere 38,200166667 s Musik sind aktiv
gestaltet. Die Analyse zeigt keinen anhaltenden Schlussabfall, deshalb bleibt der Film bis zum
letzten Frame aktiv und endet ohne vorzeitige Blende oder angehängte Titeltafel.

## Technische Darstellung

MAC-Lernen benutzt Quelladresse und VLAN; die Zieladresse wird zur Portwahl nachgeschlagen.
Der ARP-Cache des Hosts bleibt von der Switch-MAC-Tabelle getrennt. Die ARP-Anfrage bleibt in
VLAN 10, die gezeigte Antwort ist Unicast. Unknown Unicast wird gesondert beschriftet;
der FDB-Eintrag wurde dafür redaktionell gealtert, während der Host-ARP-Cache bestehen bleibt.

802.1Q fügt vier Byte zwischen Source MAC und EtherType ein. Die Demonstration verwendet
getaggte Trunks für VLAN 10/3 und ungetaggte Access-Ausgänge. Native-VLAN-Ausnahmen sind
nicht Teil der Szene. Die sichtbaren Frame-Felder sind schematisch, keine vollständige Bitdarstellung.

Die drei Switches besitzen eine physische Dreiecksverbindung. SW-01 hat die niedrigste Bridge-ID;
SW-03 P26 ist der redundante blockierte Port. Von 84 bis 106,900 s ist **STP für die Loop-Demo aus**.
Danach erscheinen Listening und Learning; ab 113 s ist die Weiterleitung wieder schleifenfrei.
Protokolltimer sind für die Inszenierung verdichtet. Blocking unterbricht die Nutzdatenweiterleitung,
nicht den physischen Link oder den Empfang von BPDUs. Klassische STP-Zustände werden nicht mit
RSTP-Rollen vermischt. Die Darstellung ist ein vorgegebener Ablauf, kein vollständiger Netzwerksimulator.

L2TP ist hier ausdrücklich **L2TPv3** für Ethernet-Pseudowires über IP (Protokoll 115).
Kontrollverbindung und Sitzung gehen dem Nutzdatentransport voraus. MAC-Adressen und inneres
VLAN bleiben erhalten; Ethernet-FCS wird lokal neu erzeugt. Es wird keine Verschlüsselung gezeigt.
LLDP meldet direkte Nachbarn. LACP bündelt zwei physische Mitglieder zu einem logischen Link;
die dargestellte Verteilung hält einen Flow auf einem festen Mitglied. Ein einzelner Flow erhält
nicht die addierte Geschwindigkeit beider Links. Die Remote-Tunneladressen sind Dokumentationsadressen.

Primärquellen: [ARP / RFC 826](https://www.rfc-editor.org/rfc/rfc826.html),
[802.1Q](https://www.cisco.com/c/en/us/support/docs/lan-switching/8021q/17056-741-4.html),
[STP](https://www.cisco.com/c/en/us/td/docs/routers/ios/config/17-x/lan-wan/b-lan-wan/m_lsw-span-tree-prot.html),
[Ethernet über L2TPv3 / RFC 4719](https://www.rfc-editor.org/rfc/rfc4719.html),
[LLDP](https://www.alliedtelesis.com/sites/default/files/documents/configuration-guides/lldp_feature_overview_guide.pdf),
[Link-Verteilung](https://www.cisco.com/c/en/us/support/docs/lan-switching/etherchannel/12023-4.html).

## Architektur und Wiederaufnahme beim Rendern

Die vier Räume sind Topologie, Frame-Inspektor, Kontrollmatrix und Tunnel.
Geometrie entsteht prozedural in Three.js 0.180.0. Alle Assets bleiben lokal; keine CDN-Imports.
Die Audio-Steuerwerte werden aus der Analyse interpoliert. Nur Band-Drives erhalten einen
festen vorwärts/rückwärts angewendeten Tiefpass von 100 ms; veröffentlichte Messwerte bleiben erhalten.
Starke Onsets setzen lokale Akzente. Kamerawege und Szenenwechsel sind vorgegeben.
Das geschätzte Beat-Raster wird nicht als sichere Takt- oder Kick-Erkennung verwendet.

Filmzustand, Kamera, Instanzen, Protokollzustände und Syslogs sind Funktionen der absoluten Zeit.
Kein zustandsabhängiger Einmal-Trigger, keine fortlaufende Physiksimulation und kein Zufall ohne Seed.
Die begrenzten Instanzpools verhindern unbegrenzt anwachsende Frame-Kopien in der Loop-Demo.
`window.renderFrame(n)` darf direkt bei beliebigen absoluten Bildnummern aufgerufen werden.

```js
window.renderTime(79);
window.renderFrame(4740);
window.FILM; // FPS, FRAMES, W, H, DURATION
window.__ready;
window.__error;
window.player.seek(171.76);
```

## Prüfen

```sh
npm run check
npm run check:browser
npm run export:check -- --resolution 1080p
npm run export:check -- --resolution 4k
```

Die Browserprüfung erstellt Standbilder und `output/qa/browser-report.json`, prüft Timeline,
Bildgleichheit nach Zeitsprüngen, Player und ein 4K-Standbild. Das ist kein Videoexport.
Der technische Prüfbericht und die visuelle Kontrolle stehen in `ABNAHME.md`.
Die vollständige Schnittliste mit E-/L-/V-Zuordnung steht in `UMSETZUNG-CUES.md` und JSON.

## Später exportieren

Nach ausdrücklicher Freigabe lässt sich das fertige Video selbst starten:

```sh
kisound-render 1080p
# oder
kisound-render 4k
```

Alternativ `npm run export:1080p` beziehungsweise `npm run export:4k`.
Diese Befehle starten den vollständigen Export. Die Quelle bleibt unverändert;
H.264-Bild und AAC-Audio landen mit Zeitstempel, Log und Manifest unter `output/`.
Der globale Export erstellt standardmässig 20-s-Abschnitte mit jeweils frischem Chrome.
Bei einem Abbruch den genannten Arbeitsordner übernehmen:

```sh
kisound-render --resume "/Pfad/zum/kisound-export-ABC123"
```

Bei Wiederaufnahme keine neue Auflösung angeben und Projektdateien nicht verändern.
Ein `--check` prüft Voraussetzungen, Quellen und Konfiguration, ohne einen Render zu starten.
Details und weitere Encoderoptionen: zentrales kisound-README und `kisound-render --help`.

**Diese Umsetzung liefert die Browserfassung. Ein vollständiger Musikvideoexport wurde nicht gestartet.**
