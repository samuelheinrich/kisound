# QoS · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Nachweise

- **12/12 Modell- und Timeline-Tests**: Quelle/Dauer, 57 Startzeiten und Stationen gleich der Vorlage, alle Events
  und 44 Lyrics im Drehbuch-Shot, Bass/Lücken/Fade, Policer (Burst 1,2 → 1,0 konform, Q-RX genau bei 90,62 s, nie
  gepuffert), Scheduler (ein Server, EF strikt zuerst, nicht unterbrechend, Bulk FIFO, keine Live-Tail-Drops,
  Bulk-Queue ≈ 48 bei 173,02 s), TCP (Q-B17 nur im gespeicherten Fenster, Q-B18 neuer Frame Seq 24001 Len 1200,
  ACK 24001 → 25201), Shaper (Q-BS wartet ab 103,96 s, geht genau einmal in S029), Break (Q-RN Classify/Mark/Queue,
  nichts überholt), Seitenregeln, Stimmen, Wörter, Adressen, Log-Abstand, Determinismus.
- **Browsercheck bestanden**: 71 Standbilder, 412 Zeitpositionen, 12 pixelgleiche Wiederholungen, Player, 4K-Still,
  `FRAMES` 14 344; Wiedergabe lokal 60,2–60,9 fps.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.

## Visuelle Kontrolle

Alle 57 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Zielkamera fuhr durch die Portfläche (orange
Überstrahlung), Totale zu weit hinten, CLASSIFY-Leser zu hell, ferne Beschriftungen im Header-Band (werden jetzt
ausgeblendet), Schatten-Träger Q-B17 zu dunkel. Dabei gefunden und behoben: Label-Ausblendung nutzte die Kameramatrix
des Vorframes (Determinismus).

## Grenzen

Lyric-Zeiten automatisch, keine Hörprüfung. Raten, Token-Bucket-Grössen, Queue-Längen und Zähler sind Szenariowerte;
ein Träger steht für eine Paketgruppe (Zeitlupe).
