# Broadcast Storm · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Nachweise

- **12/12 Modell- und Timeline-Tests**: Quelle/Dauer, 58 Startzeiten gleich der Vorlage, alle 40 Events und 45 Lyrics
  im Drehbuch-Shot, Bass-Einsätze/Beat-Bruch/Blende gegen die Analyse, Ring zu auf „Falscher Port“ und einmal offen,
  pro Broadcast genau zwei Ringkopien ohne Rücksendung durch den Eingangsport, kein Überleben nach dem Port-down,
  MAC-Flaps nur bei geschlossenem Ring, verzögerte Erholung, Tests und Management erst nach ihrer Prüfung,
  Seitenregeln, Wörter, Adressen, Log-Abstand, Determinismus.
- **Browsercheck bestanden**: 67 Standbilder, 384 Zeitpositionen, 12 pixelgleiche Wiederholungen, Player, 4K-Still,
  `FRAMES` 12 529; Wiedergabe lokal 60,3–62,4 fps.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.

## Visuelle Kontrolle

Alle 58 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Sturm überstrahlte zu weissen Flächen (Kopien und
Queue-Karten zu hell, Bloom), Switches zu dunkel, Totale zu weit, MAC-Tafel angeschnitten, Console-Kopfzeile unter
dem Overlay.

## Grenzen

Lyric-Zeiten automatisch, keine Hörprüfung. Raten, Zähler, CPU-Werte und das Ringtempo sind Szenariowerte.
