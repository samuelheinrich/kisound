# Multicast · Abnahme der Browserfassung V2 (Stadion)

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Geliefert

17 Kapitel, 100 Einstellungen (22 POV-Fahrten zu 22 verschiedenen Sitzen), drei prozedurale 3D-Module
(Stadion, Vergleich, Segment), Browserplayer mit Originalaudio. Netzszenario mit 288 Clients, 28 VLANs,
17 Routern; vordere Hälfte zuerst, Verse-2-Join über den Core-Ring, SPT-Wechsel dreier Stadionseiten.
V1 (Amphitheater) ist unter `_revisions/code-v1-arena.tar.gz` gesichert. Enthalten: Register/Register-Stop, erster Join auf
dem Drop, Unicast/Anycast/Multicast, IGMP-Report/Snooping/Querier, PIM-Hellos, Join zum RP, Shared Tree,
Hook mit neun Schlagwörtern, SPT-Switchover, Leave mit Group-Specific Query, Flooding gegen Snooping,
drei stille Segmente, Schlusstitel und Blende am gemessenen Endabfall.

## Nachweise

- **17/17 Modell- und Timeline-Tests** (`npm run check`): Quelle/Dauer/Bildraster, lückenlose Schnitte,
  alle 53 Events und 63 Lyric-Segmente genau einmal zugeordnet, keine Daten über R1 vor dem ersten Join,
  erster Strom auf 31,30 s und Ankunft nach E010, konsistenter Fahrplan, keine Weiterleitung ohne Mitglieder,
  jeder Zustand wird nach dem Join gespeist, SPT ohne Empfangslücke, Leave entfernt nur einen Port,
  PIM-Joins treffen exakt beim Weiterleitungsbeginn ein, Zeitdeterminismus, Hook-Wörter, Blende, Syslog-Takt; neu in V2: Stadiongrösse und stille Segmente, Join über den
  Core-Ring, SPT dreier Cores ohne Empfangslücke, jede POV-Fahrt endet an einem empfangenden Sitz der
  verlangten Zone und kein Weg wiederholt sich.
- **Browsercheck bestanden** (`npm run check:browser`): 106 Standbilder (Mitte jeder Einstellung plus
  Schlüsselmomente), 562 Zeitpositionen (jede Sekunde und alle Schnittgrenzen ±1 ms) ohne Fehler,
  10 pixelgleiche Wiederholungen nach Zeitsprüngen, Player (Play/Pause, Kapitel, Einzelbild, Tempo, Stumm,
  Schleife am Ende, Debug, Vollbild, Scrubbing, Auflösungswechsel mit Positionserhalt), natives
  3840 × 2160-Standbild, `FRAMES` 15 637.
- Fünf kurze Wiedergabeproben (720p) lokal bei **60,3–61,8 fps**; keine Zusage für andere Geräte oder den Export.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.
- SHA-256 von WAV, Audiokopie und Transkript gegen die Analyse geprüft (`npm run prepare`).

Berichte und Bilder: `output/qa/browser-report.json`, `output/qa/frame-*.png`, `output/qa/title-4k.png`,
`output/qa/browser-player.png`.

## Visuelle Kontrolle

Alle 100 Einstellungen über Kontaktbögen gesichtet. In V2 korrigiert: Licht und Material der Ränge,
näher geführte Totalen, Vogelperspektive entlang der Längsachse, dunklere Aussenfassade, Ride-Kamera
höher und mit Halt vor dem Sitz, Innenraum-Ziele nicht als Ride (zu kurzer Weg), Ziel unter R5 aus dem
stillen Innenraum-Segment herausgenommen.

## Grenzen

Lyric-Zeiten sind automatisch erzeugt; **keine neue Hörprüfung**. Standbilder und Signalprüfungen
ersetzen keine audiovisuelle Abnahme in Echtzeit. Das Netz ist ein redaktionelles Szenario mit
verdichteten Zeiten, kein Mitschnitt.

**Musikvideoexport erst nach ausdrücklicher Freigabe.**
