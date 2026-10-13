# Wireshark · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Nachweise

- **10/10 Modell- und Timeline-Tests**: Quelle/Dauer, 61 Startzeiten gleich der Vorlage, alle 40 Events und 52 Lyrics
  im Drehbuch-Shot, Bass/Lücken/Endabfall (letztes Wort lesbar), O-101 nur BEFORE und an der Queue verworfen, O-102 in
  beiden, AFTER ohne Retransmission-Label, Mirror-Kopien nur zu den Analyzern, Zähler 3800 → 3818 und Delta 0 im Versuch,
  Filter blenden aus statt zu löschen, Resultate nach dem Test, TLS verschlüsselt, Capture gestoppt, Seitenregeln,
  Wörter, Adressen, Log-Abstand, Determinismus.
- **Browsercheck bestanden**: 70 Standbilder, 380 Zeitpositionen, 12 pixelgleiche Wiederholungen, Player, 4K-Still,
  `FRAMES` 11 745; Wiedergabe lokal 60,4–61,8 fps.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.

## Visuelle Kontrolle

Alle 61 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Mirror-IDs der Wiedergaben überschrieben die Originale,
zu wenige Drops im Messfenster, Rackraum zu dunkel und Glas-Switches unsichtbar, „fehlt“ statt „ausstehend“ beim neuen Test.

## Grenzen

Lyric-Zeiten automatisch, keine Hörprüfung. PCAP-Zeilen, Zähler und Raten sind gekürzte, simulierte Werte.
