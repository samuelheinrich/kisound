# OSPF Neighbors · Browservorschau

Vollständiges codebasiertes Musikvideo: Ein schwebender Netzwerkatlas entdeckt Nachbarn,
gleicht Datenbanken ab, berechnet Wege und verbindet zwei Areas. Eine Kostenänderung und
ein Linkausfall führen zu Konvergenz und wiederhergestelltem ECMP. 14 Kapitel, 62 Einstellungen,
vier Szenenmodule und unverändertes Originalaudio. Die erste Abnahme erfolgt im Browser.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/kisound/videos/kisound/Network-Engineer-Album01/02_OSPF_Neighbors"
npm ci
npm run preview
```

Die Vorschau öffnet Google Chrome unter **http://127.0.0.1:8130/**. Play startet Audio und Bild.
Server beenden: `Ctrl+C`. Alternativer Port: `npm run preview -- 8131`.
`npm run serve` startet ohne automatisches Öffnen.

- `/?res=720`: kleinere Vorschau; Standard 1080p.
- `/?t=23.16`: Hello / Init; `?t=33.86`: Two-Way.
- `/?t=36.98`: DR/BDR; `?t=47.88`: Datenbankabgleich.
- `/?t=62.38`: Multi-Area; `?t=74.7`: ABR und Type-3.
- `/?t=79.7`: ECMP; `?t=94.3`: Kostenänderung.
- `/?t=132.68`: Linkausfall; `?t=160.8`: Wiederherstellung.
- `/?t=172`: Schlusstext; `?t=178.35`: tatsächlicher Endabfall.
- `/?debug=1`: Kapitel-, Einstellungs-, Event- und Lyric-IDs.
- `/?w=1920&h=1080&t=80`: Einzelbild ohne Player für deterministische QA.

Leertaste = Play/Pause; Pfeile = eine Sekunde; Shift+Pfeil = ein Bild auf dem 60-fps-Raster.
Home/End = Anfang/Ende. L/M/F/D = Schleife/Stumm/Vollbild/Cue-Diagnose.
Kapitelwahl, Geschwindigkeit, Lautstärke, Scrubbing und Auflösungswechsel sind im Player enthalten.
Der Auflösungswechsel erhält die Position.

## Bildwelt, Titel und Lesbarkeit

Petrol und Ultramarin, Cyan für Area 0, Violett für Area 1, bernsteinfarbene Kontrollsignale,
grüne Bestätigung und rote Linkstörung. Prozedurale Routerinseln auf räumlichen Kartenflächen,
LSA-Karten und gleichwertige Pfadleuchten. Weite, treibende Fahrten und gezielte Paketverfolgungen
wechseln mit lesbaren technischen Haltepunkten. Keine Figuren, Firmenlogos oder ASTRA-Titel im Bild.

**OSPF / NEIGHBORS** erscheinen zweizeilig in Michroma, metallischem Weiss und Cyan.
**SAMUEL HEINRICH** steht gesperrt darunter mit zwei bernsteinfarbenen Linien.
Die Gestaltung übernimmt die lokale Titeltechnik von Layer 2. Michroma, Space Grotesk und
JetBrains Mono liegen samt OFL-Lizenzen unter `assets/fonts`.

Anfangstitel: 0,650–7,600 s. Schlusstext: 169,500–171,000 s einblenden.
Die Welt bleibt darunter aktiv. Ab 178,350 s werden Bild und Titel gemeinsam ausgeblendet.
Ein Hauptpanel belegt 26,6 % der Bildbreite; die Kamera verschiebt die Handlung daneben.
Maximal drei Syslogs stehen unten. Netzwerkdaten und Meldungen sind redaktionelle Szenariowerte,
keine Aufzeichnung eines echten Netzes und keine umgedeuteten Audiomessungen.

## Quellen und Timing

- Finale WAV gemäss Musikprompt: `02_OSPF_Neighbors_0.3-1.wav`.
- SHA-256: `56fa0fd69fb22b27208f72069b7fd59b34aa74f597c2a78ff0d05bca6639790d`.
- 48 kHz, Stereo, 16 Bit; **8’691’887 Samples je Kanal**.
- Exakte Dauer: **181,080979167 s**.
- Transkript-SHA-256: `61ba3340518105b2fcc19f4194f873217285838d7d561675a56991e0bee58b3d`.
- Analyse: `astra.audio.analysis.v1`; geschätzte 136,2 BPM, mittlere Sicherheit.
- 60 fps, **10’865 Bilder**. Letztes Rasterbild: 181,066666667 s.
  Eine spätere Bildspur reicht bis 181,083333333 s; das Originalaudio behält seine genaue Dauer.

`npm run prepare` prüft WAV und Transkript und stellt eine bytegleiche lokale Audiokopie bereit.
`OSPF_SOURCE` kann auf einen anderen lokalen Quellordner zeigen; die Prüfsummen müssen passen.
`assets/manifest.json` dokumentiert Quelle, Analyse, Transkript und Schriftprüfsummen.
Originalaudio, Analyse und Transkript werden nicht verändert. Die 49 englischen Gesangssegmente
sind automatisch erzeugt und nicht manuell hörverifiziert. Es werden keine gesungenen Untertitel eingeblendet.

Die letzte transkribierte Stimme endet bei 168,880 s. Danach folgen **12,200979167 s** Instrumental.
E044 (175,100 s) bleibt als Fade-Kandidat in der Originalanalyse erhalten, startet aber keine Blende.
Der globale Sample-Peak liegt erst bei 178,224813 s; von 174,700 bis 178,300 s steigt die Energie nochmals an.
Der anschliessende RMS-Verlauf fällt anhaltend ab. **178,350 s** ist die dokumentierte redaktionelle
Blendenentscheidung auf dieser Messgrundlage. E046 enthält eine gerundete Endzeit; nur die Umsetzung
verwendet die genaue Sampledauer. Es wird keine neue Hörprüfung behauptet.

## Technisches Szenario

OSPFv2 mit normalen Area 0 und Area 1. Keine NBMA-, Stub-/NSSA- oder externe Routing-Demo.
Die Darstellung ist ein vorgegebener Ablauf mit berechnetem Routinggraphen, kein vollständiger OSPF-Simulator.
Timer, Zustandsfolgen und Reaktionszeiten sind für den Film zeitlich verdichtet.

Area 0: R1–R2–R4 und R1–R3–R4 sind Punkt-zu-Punkt-Wege mit je zwei Links der Kosten 10.
Das passive Zielnetz 192.0.2.0/24 an R4 kostet 1; R1 berechnet **21** mit Next Hops R2/R3.
Kosten R1–R2 steigen bei 94,300 s von 10 auf 25; ab 95,980 s bleibt R3 ausgewählt.
Bei 118,500 s werden die Kosten auf 10 zurückgesetzt; ECMP ist ab 121,680 s wieder vorhanden.

R4, R5, R6 und R7 teilen ein Broadcastsegment. R4 ist DR (Priorität 100), R5 BDR (50),
R6 und R7 DROTHER (1). R6/R7 bleiben Two-Way; Nachbarpaare zu DR/BDR erreichen Full.
Die Outro-Wörter wechseln das betrachtete Nachbarpaar und setzen keine Full-Nachbarschaft zurück.
DR/BDR-Rollen ändern sich in dieser Geschichte nicht. Nutzdaten R6 → R7 laufen direkt über das
geteilte Ethernetsegment und müssen den DR nicht als Zwischenrouter passieren.

R7 ist ABR mit getrennten Datenbanken. R7–R8 in Area 1 kostet 10, das passive Zielnetz
198.51.100.0/24 an R8 kostet 1. Ab 73,200 s kündigt R7 das Präfix mit Type-3-Metrik **11** an.
R1 addiert die Kosten zum ABR und erhält **41**. Type-1/2-LSAs bleiben in ihrer Area;
am ABR entstehen neue Type-3-LSAs. Die zwei LSDBs enthalten unterschiedliche lokale Topologien.
Der Broadcast-Netzknoten im Berechnungsgraphen ist ein logischer Netzvertex, kein zusätzlicher Router:
Router → Netz hat Interfacekosten 10, Netz → Router Kosten 0.

DBD (OSPF-Pakettyp 2) vergleicht LSA-Header. LSR (3) fordert fehlende oder neuere Information,
LSU (4) liefert LSAs und LSAck (5) bestätigt. OSPF-Pakettyp und LSA-Typ sind verschiedene Felder.
ExStart: R2 hat gegenüber R1 die höhere Router-ID und übernimmt die primäre DBD-Rolle.
Hello zeigt Router-ID, Area und Nachbarliste; MTU ist kein Hello-Feld. Two-Way bestätigt,
dass die eigene Router-ID im empfangenen Hello vorkommt. Es ist kein TCP-Handshake.

Bei 132,700 s fällt der Carrier von R2–R4 aus, die Nachbarschaft wird Down. Routing und
Weiterleitung werden nach der inszenierten LSDB-/SPF-Phase ab 138 s angepasst. Zuvor bleibt
kurz die alte Routingtabelle sichtbar, Pakete auf dem betroffenen Weg enden am ausgefallenen Link.
Ab 160,800 s kommt der Link zurück; Init, Two-Way, ExStart, Exchange, Loading und Full folgen.
Ab 164 s sind beide gleichwertigen Wege wieder installiert.

SPF wird mit lokaler Wurzel berechnet; R1 und R4 besitzen unterschiedliche Bäume.
ECMP wird als beispielhafte stabile Verteilung pro Flow dargestellt, nicht als Aufspaltung eines
Pakets. OSPF liefert die gleichwertigen Wege; die Weiterleitung übernimmt die Verteilung.

Primärquellen: [RFC 2328](https://www.rfc-editor.org/rfc/rfc2328.html),
[OSPF-Nachbarzustände](https://www.cisco.com/c/en/us/support/docs/ip/open-shortest-path-first-ospf/13685-13.html),
[CEF / Load Balancing](https://www.cisco.com/c/en/us/support/docs/ip/express-forwarding-cef/18285-loadbal-cef.html).

## Architektur, Cues und Wiederaufnahme

Vier Three.js-Module: Atlas, Nachbarschaft, Datenbank und Routing. Geometrie und Karten sind
prozedural. Alle Abhängigkeiten und Assets liegen lokal; keine Laufzeit-CDNs.
Kamera, Pakete, Zustände und Syslogs sind Funktionen absoluter Videozeit. Begrenzte Instanzpools
verhindern Speicherwachstum. Keine kumulative Simulation oder zustandsabhängigen Einmal-Trigger.

Die 100-ms-Analysewerte werden interpoliert. Nur Band-Drives werden mit einem festen
vorwärts/rückwärts angewendeten 100-ms-Tiefpass geglättet; Messwerte bleiben unverändert.
Das RMS-Gate begrenzt Aktivität in leisen Passagen. Onsets steuern Akzente und identifizieren
keine Instrumente. Das synthetische Beat-Raster wird nicht zum Verschieben von Lyrics benutzt.

```js
window.renderTime(80);
window.renderFrame(4800);
window.FILM; // FPS, FRAMES, W, H, DURATION
window.__ready;
window.__error;
window.player.seek(132.68);
```

`UMSETZUNG-CUES.md/json` dokumentiert Kapitel, 62 Einstellungen, 46 Audio-Cues und
89 redaktionelle Bild-/Protokollaktionen. E- und L-IDs verweisen auf die Analyse, V-IDs auf die Inszenierung.
`npm run cues` erzeugt Cues und das konkrete Drehbuch erneut aus Code und Quelldaten.
Das ursprüngliche Drehbuch ist einmal unter `_revisions` gesichert; keine `.bak`-Sammlung.

## Prüfen

```sh
npm run check
npm run check:browser
npm run export:check -- --resolution 1080p
npm run export:check -- --resolution 4k
```

Der Browsercheck prüft alle Schnittgrenzen, Positionen im gesamten Track, Bildgleichheit nach
Zeitsprüngen, Playerbedienung und ein natives 4K-Standbild. Standbilder und Kontaktübersicht
liegen unter `output/qa`. Ergebnisse und Grenzen stehen in `ABNAHME.md`.
`npm run check:browser -- --quick` prüft den ersten Ausschnitt sowie Player und Schnittstelle.
Diese Prüfungen erstellen kein Musikvideo.

## Später exportieren

Erst nach eigener Abnahme und ausdrücklicher Freigabe:

```sh
kisound-render 1080p
# oder
kisound-render 4k
```

Alternativ `npm run export:1080p` / `npm run export:4k`.
Der globale Export arbeitet standardmässig in 20-s-Abschnitten mit frischem Chrome,
Checkpoint und Wiederholungen. Logs, Manifest und MP4 liegen unter `output/`.
Bei einem Abbruch den gemeldeten Arbeitsordner verwenden:

```sh
kisound-render --resume "/Pfad/zum/kisound-export-ABC123"
```

Keine andere Auflösung angeben und Projektdateien während eines Exports oder vor seiner
Wiederaufnahme nicht verändern. `--check` startet keinen Render. Weitere Optionen stehen
im zentralen kisound-README und unter `kisound-render --help`.

**Geliefert wird die Browserfassung. Ein vollständiger Musikvideoexport wurde nicht gestartet.**
