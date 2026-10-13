# WiFi Roaming V3 — Browserprüfung

**Bereit zur visuellen Prüfung. Kein Video der Revision gerendert.**

- 15 Modell- und Timeline-Tests bestanden.
- 442 Zeitpositionen mit Schnittgrenzen geprüft, ohne JavaScript-Fehler.
- 114 Standbilder der Vollprüfung, einschliesslich Kurven, drei Roams und RSSI-Grenzen.
- Anschliessende Layoutnachprüfung: 17 weitere Standbilder der endgültigen Geometrie.
- Pixelgleichheit nach Zeitsprüngen an sechs Positionen geprüft.
- Playersteuerung und Original-Audioende geprüft.
- Sieben kurze 1080p-Wiedergabeproben lokal mit rund 60 fps; keine Zusage für andere Hardware.
- Graphen und 3D-Inhalte über Kontaktbögen und grosse Standbilder visuell kontrolliert.
- Keine neue vollständige Hörprüfung.
- Vorhandene V1-MP4 per SHA-256 als unverändert bestätigt.

## Gezielte Ansicht

- 43,72–47,92 s: erste 90-Grad-Kurve.
- 60,68–65,82 s: -72 dBm, rote Wiederholungen, Wechsel AP-01 → AP-02 und Erholung.
- 77,54–83,10 s: kleines DFS-Panel neben sichtbarer Radarantenne und AP-Zelle.
- 91,56 s: Grossraumbüro mit Arbeitsplätzen und durchgehendem Gang.
- 118,70 s: AP-02 → AP-03 nach dem vierteiligen Handshake.
- 153,66 s: AP-03 → AP-04.

Die Welt hat fünf rechtwinklige Kurven und drei Grossraumbüros. Endgerät, Funkpfade,
RSSI-Anzeige, BSSID und Lageplan bleiben synchron. -67 dBm ist das gewählte Szenarioziel,
-72 dBm der verspätete Wechsel mit roten Retransmits; keine universellen RF-Grenzwerte.

Berichte: `output/qa-v3/browser-report.json`, `output/qa-v3/layout-report.json`.
Kontaktbögen: `output/qa-v3/contact-v3-1.jpg` bis `contact-v3-4.jpg`; die finalen
Layoutstichproben stehen in `output/qa-v3/contact-layout.jpg`.

[Browser](http://127.0.0.1:8127/?v=3) · [Verspäteter Roam](http://127.0.0.1:8127/?v=3&t=60.68)

Offen: gestalterisches Feedback und ausdrückliche Freigabe vor einem Videoexport.
