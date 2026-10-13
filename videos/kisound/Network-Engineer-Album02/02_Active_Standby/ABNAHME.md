# Active / Standby · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Geliefert

12 Kapitel, 56 Einstellungen (Schnittliste des Drehbuchs), drei prozedurale Räume (Halle, Archive, Consoles),
Browserplayer mit Originalaudio. Szenario: 774 Heartbeats, 8 Zustandskopien von S-17 (inklusive Resync), Produktions-
flows mit 14 im Split Brain unterbrochenen Sessions, zwei Testflows durch B, Fencing an zwei Switchports, Präferenz-
änderung, Wahl, Freigabe. Statusanzeigen auf beiden Geräten, Heartbeat-Monitor, Consoles B01–B06 und B05R.

## Nachweise

- **14/14 Modell- und Timeline-Tests** (`npm run check`): Quelle/Dauer/Bildraster, lückenlose Schnitte, 56 Startzeiten
  gleich der Vorlage, alle 44 Events und 44 Lyric-Segmente genau einmal und im Drehbuch-Shot, Bass/Lücken/Blende,
  Rollen- und Fencing-Logik, Präferenzen und Wahl, Heartbeat/Sync nur über intaktes ha1, S-17-Verlauf, Session-
  Abbrüche, lokale Consoles und Reveal-Regeln, kinetische Wörter auf dem richtigen Gerät, Kameraziele, Adressen,
  Log-Abstand, Zeitdeterminismus.
- **Browsercheck bestanden**: 67 Standbilder, 373 Zeitpositionen (jede Sekunde und alle Schnittgrenzen ±1 ms) ohne
  Fehler, 12 pixelgleiche Wiederholungen, Player-Funktionen, natives 3840 × 2160-Standbild, `FRAMES` 12 191.
  Wiedergabeproben lokal 60,2–61,8 fps.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.

## Visuelle Kontrolle

Alle 56 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Totale über der Hallendecke, HA-Kamera mit dem
Adressring genau hinter dem Tunnel, Fassadenfahrten zu nah an der Statusanzeige, Archiv-Kamera ohne S-17 im Bild,
Testflows ausserhalb des Bildes, Wörter über den Statusanzeigen, Pakete direkt unter der Split-Brain-Kamera.

## Grenzen

Lyric-Zeiten automatisch, keine Hörprüfung. Heartbeat-Takt, Peer-Timer und Sequenzwerte sind Szenariowerte.
Gerätenamen ersetzen Seriennummern; Ausgaben sind gekürzte, simulierte Ausschnitte.
