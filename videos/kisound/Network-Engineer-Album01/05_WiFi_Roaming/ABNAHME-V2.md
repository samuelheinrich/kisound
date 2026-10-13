# WiFi Roaming V2 — Browserprüfung

Status: **bereit zur visuellen Freigabe durch den Nutzer**. Kein Videoexport der Revision.

- 13 automatisierte Modell-/Timeline-Tests bestanden.
- 442 Zeitpositionen einschliesslich Schnittgrenzen ohne JavaScript-Fehler geprüft.
- 99 Browser-Standbilder: alle Einstellungen, DFS-Zustände, EAPOL-Schritte und Schlussblende.
- Visuelle Kontrolle über Kontaktbögen und grosse Stichproben; keine vollständige Hörprüfung.
- An sechs Zeitpositionen pixelidentische Ergebnisse nach beliebigen Vor-/Rückwärtssprüngen.
- Play/Pause, Kapitelsprung, Einzelbild, Geschwindigkeit, Stummschaltung und Audioende geprüft.
- Sieben kurze Wiedergabeproben bei 1080p lagen lokal bei rund 60 fps. Dies ist keine
  Garantie für andere Rechner oder eine über die gesamte Laufzeit gemessene Bildrate.
- Alte MP4 per SHA-256 unverändert: `adcb89ed07cb94292f682180b96d9a7ef8fa42a5e1568752c20f5b9170cc467d`.

Details: `output/qa-v2/browser-report.json`, Kontaktbögen `output/qa-v2/contact-v2-1.jpg`
bis `contact-v2-3.jpg`. Cue-Tabelle: `UMSETZUNG-CUES.md`.

Die neue Fassung enthält 88 Einstellungen, den langen Gang ohne Figur, zwölf zusätzliche
Endgeräte, DATA/ACK-Frame-Flüge, MU-MIMO, Radar/DFS, Frequenzansichten, RSSI/SNR-App,
RTS/CTS, 802.11k/v-Action-Frames und den vierteiligen WPA2-Handshake. Signalwerte und
Protokollzeiten sind ausdrücklich redaktionelle Illustrationen.

Offen: gestalterisches Feedback und ausdrückliche Freigabe vor einem neuen Videoexport.
