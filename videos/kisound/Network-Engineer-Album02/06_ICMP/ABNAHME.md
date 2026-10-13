# ICMP · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Nachweise

- **12/12 Modell- und Timeline-Tests**: Quelle/Dauer, 81 Startzeiten gleich der Vorlage, Orte gleich dem überarbeiteten Drehbuch, reale Orte und Laufzeiten (Zürich–Frankfurt–New York, 92,4 ms, Hops dort, wo sie wirklich sind), alle Events
  und 75 Lyrics im Drehbuch-Shot, Bass/Lücken/hartes Ende, Type/Code aller sieben ICMP-Meldungen, jede Fehlerantwort vom
  meldenden Knoten zu H mit Zitat, PMTUD ohne Schrumpfen, Traceroute-Probes und Reveal bei Ankunft, Redirect erst nach
  Prüfung, Seitenregeln, Wörter, Adressen, Log-Abstand, Determinismus.
- **Browsercheck bestanden**: 91 Standbilder, 461 Zeitpositionen, 12 pixelgleiche Wiederholungen, Player, 4K-Still,
  `FRAMES` 13 007; Wiedergabe lokal 60,3–62,1 fps.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.

## Visuelle Kontrolle

Fassung «Realwelt» (5.10.2026, nach Rückmeldung «fiktive Router und abstrakte Pakete zu dürftig»): Büro in Zürich,
Laptop-Desktop mit tcpdump, Weltkugel mit Natural-Earth-Küsten, Rechenzentrum New York (Rack-Generator aus Out of
Band übernommen, andere Halle). Alle 81 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Fensteraussicht zu nah
(See und Alpen verdeckt), Regal-Kamera zu nah und immer gleich, Beschriftungen zu gross, Frankfurt-Nahaufnahme zu
nah an der Erdtextur, Desktop-Zooms schnitten Text ab, leeres Terminal am Anfang (jetzt `ip addr`/`ip route`),
Rechenzentrum zu dunkel. Browsercheck wartet jetzt bis 2,5 s auf den Wiedergabestart statt starr 650 ms.

## Grenzen

Lyric-Zeiten automatisch, keine Hörprüfung. RTT-Werte, IP-IDs und Paketzeiten sind Szenariowerte.
