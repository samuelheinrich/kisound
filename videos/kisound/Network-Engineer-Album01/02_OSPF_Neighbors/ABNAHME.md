# OSPF Neighbors · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme**.

## Geliefert

14 Kapitel, 62 Einstellungen, 89 redaktionelle Bild-/Protokollaktionen und 46 dokumentierte
Audio-Cues. Vier prozedurale 3D-Module: Atlas, Nachbarschaft, Datenbank und Routing.
OSPF / NEIGHBORS sowie SAMUEL HEINRICH am Anfang und Ende im Albumstil.
Multi-Area mit R7 als ABR, getrennten LSDBs, Type-3-Ankündigung, berechnetem SPF/ECMP,
Kostenänderung, Carrier-Ausfall und Wiederherstellung. Browserplayer mit Originalaudio.

## Nachweise

- **15/15 Funktionstests bestanden**: Quelle und Dauer, Timeline, Zustandsfolgen,
  DR/BDR-Beziehungen, Kosten 21/41, lokale SPF-Wurzeln, ECMP-Verteilung, Area-Grenzen,
  Linkausfall/-wiederherstellung, Cue-Konsistenz, Gating und zeitabhängiger Schluss.
- Vollständiger Browsercheck: **369 Zeitpositionen**, alle Schnittgrenzen,
  **9 pixelgleiche Wiederholungen nach Zeitsprüngen**, keine Browserfehler.
- **43 repräsentative Standbilder** des vollständigen Tracks.
- Gezielte Layout-Nachprüfung: **5 Positionen** einschliesslich beider
  Endpunkte der ABR-Einstellung; bestanden. Area-1-Präfix bleibt innerhalb des Bildes.
- Player: Play/Pause, Kapitelwahl, Frame-Schritt, Geschwindigkeit, Stumm, Schleife am Ende,
  Vollbild, Scrubbing, exaktes Audioende und Positionserhalt beim Auflösungswechsel bestanden.
- Natives **3840 × 2160**-Standbild prüft Titel, lokale Schriftdateien und Frame-Schnittstelle.
- Fünf kurze 720p-Wiedergabeproben: **60.3–61.1 fps** im lokalen Prüflauf.
  Das ist keine garantierte Bildrate anderer Geräte oder eines vollständigen 4K-Exports.
- 1080p- und 4K-Exportvorprüfung mit `--check` bestanden. Keine Videocodierung gestartet.
- SHA-256 der Original-WAV, Audiokopie, des Transkripts und der unveränderten Analyse bestätigt.

Maschinenberichte: `output/qa/browser-report.json`, `browser-report-layout.json` und
`browser-report-quick.json`. Standbilder, Kontaktübersicht, Browserplayer und 4K-Titelbild
liegen ebenfalls unter `output/qa`.

## Visuelle Kontrolle

Titel und Name, Init/Two-Way, Datenbankabgleich, Multi-Area, Kostenänderung, Linkausfall,
Single-Path-Weiterleitung und Browserplayer wurden anhand der lokalen Standbilder visuell geprüft.
Die Kontaktübersicht deckt den ganzen Film ab. Technische Panels halten ihre feste Breite von
26,6 %; die zentrale Demonstration bleibt daneben sichtbar. Erklärtexte bleiben innerhalb des Panels.
Schlussbild und Name stehen bis zum späten Akzent; die Blende beginnt erst bei 178,350 s.

Bei der Kontrolle wurden feste falsche Beschriftungen entfernt: COST 25 statt unverändertem COST 10,
SINGLE PATH statt ECMP nach der Berechnung, Type-3 PENDING vor abgeschlossenem Area-1-Abgleich.
Im Multi-Area-Modul endet lokale Information am ABR; neue Zusammenfassungen entstehen dort.
DBD/LSR/LSU/LSAck unterscheiden sich in Zeit, Richtung und Farbe; DBD enthält Header,
LSR fordert Information vom Peer, LSU liefert sie und LSAck läuft als Bestätigung zurück.

## Messungen, Inszenierung und Grenzen

Original: 8’691’887 Samples je Kanal / 48’000 Hz = **181,080979167 s**.
60 fps ergeben 10’865 Bilder; letztes Rasterbild bei 181,066666667 s.
BPM 136,2 sind geschätzt. Das Beat-Raster wird nicht zur Umzeitung der Lyrics genutzt.

Die 49 Gesangssegmente bleiben unverändert. Ihre Zeiten sind automatisch erzeugt;
es wurde **keine neue manuelle Hörverifizierung** durchgeführt. Standbild- und Signalprüfung
werden nicht als vollständige audiovisuelle Hörabnahme ausgegeben.

Netzwerkwerte sind vorgegebene Szenariowerte, Protokolltimer verdichtet. Routingkosten werden
berechnet, aber das Projekt ist kein vollständiger OSPF-Simulator und kein Netzwerkmitschnitt.
E044 bleibt im Original erhalten und startet keine Blende. E046 ist dort gerundet;
der Renderer verwendet die genaue Sampledauer.

## Übergabe

`npm run preview` öffnet **http://127.0.0.1:8130/** in Chrome. Play startet die Vorschau.
README enthält Einstiegspunkte, Bedienung, Quellen, Cues, Prüfungen und spätere Exportbefehle.
Das ursprüngliche Drehbuch ist einmal unter `_revisions` gesichert; keine `.bak`-Dateien angelegt.
Quellen, andere Trackprojekte und globale Renderwerkzeuge bleiben unverändert.

**Kein MP4 wurde erzeugt. Musikvideoexport erst nach ausdrücklicher Freigabe.**
