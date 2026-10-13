# Firewall State Table · Abnahme der Browserfassung

Status: **technisch geprüft; bereit zur kreativen Browserabnahme. Kein MP4 erzeugt.**

## Geliefert

11 Kapitel, 93 Einstellungen (25 im Kontrollraum, 21 POV-Fahrten), zwei prozedurale 3D-Räume (Mauer mit
Tor, Kontrollraum), Browserplayer mit Originalaudio. Firewall-Szenario mit 24 Sessions (TCP, UDP,
DNAT, Hairpin, IPS) und 216 Paketflügen, davon 25 verworfen (implizites Deny, ACK ohne Session,
Blocklist, IPS). Enthalten: erste Session auf „Session open“, einzelnes Paket stirbt auf dem Transienten,
Policy-Ringe und State-Fast-Path, Scanner-Wellen, Regel 0 auf „Write the rule and lock it“, Source/
Destination NAT, NAT-Reflection, DPI mit sauberem Download und EICAR-Reset, Break-Handshake auf den Zeilen,
UDP-Ablauf im Outro, Lichtabfall in der Pegellücke, Titel, Rückkehr zu default deny.

## Nachweise

- **14/14 Modell- und Timeline-Tests** (`npm run check`): Quelle/Dauer/Bildraster, lückenlose Schnitte
  und Kapitel, alle 44 Events und 59 Lyric-Segmente genau einmal zugeordnet, Bass-Einsätze und Pegellücke
  gegen die Analyse, Policy nur für das erste Paket jeder Session, TCP-Reihenfolge und Zustandsfolge,
  UDP ohne Antwort mit 30-s-Ablauf im Bild, Drops an implizitem Deny bzw. Blocklist, ACK ohne Session,
  Regel 0 auf der Zeile, Hook- und Break-Zeitpunkte, keine Inside-Adresse ausserhalb des NAT, DNAT und
  Hairpin zur DMZ, IPS-Drop und Reset, Tabelle leert sich, kinetische Wörter, Kameraziele,
  Dokumentationsadressen, Log-Abstand, Zeitdeterminismus.
- **Browsercheck bestanden** (`npm run check:browser`): 100 Standbilder (Mitte jeder Einstellung plus
  Schlüsselmomente), 540 Zeitpositionen (jede Sekunde und alle Schnittgrenzen ±1 ms) ohne Fehler,
  12 pixelgleiche Wiederholungen nach Zeitsprüngen, Player (Play/Pause, Kapitel, Einzelbild, Tempo,
  Stumm, Schleife am Ende, Debug, Vollbild, Scrubbing, Auflösungswechsel mit Positionserhalt), natives
  3840 × 2160-Standbild, `FRAMES` 15 560.
- Fünf kurze Wiedergabeproben (720p) lokal bei **60,2–61,2 fps**; keine Zusage für andere Geräte oder den Export.
- Exportvorprüfung `kisound-render 4k --check` bestanden; kein Render gestartet.
- SHA-256 von WAV, Audiokopie und Transkript gegen die Analyse geprüft (`npm run prepare`).

## Visuelle Kontrolle

Alle 93 Einstellungen über Kontaktbögen gesichtet. Korrigiert: Tafeln im Kontrollraum überlappten
(Radius 11 → 20, Kamera näher), Pakete und Halos zu grell und zu gross, Deny-Membranen und DPI-Ring nur
noch beim Ereignis sichtbar, Ride-Kamera weiter hinter dem Paket, Orbit nur auf der Innenseite (vorher
teils in der Mauer), Chant-Wörter im Kontrollraum unterhalb der Tafelmitte.

## Grenzen

Lyric-Zeiten sind automatisch erzeugt; **keine neue Hörprüfung**. Standbilder und Signalprüfungen
ersetzen keine audiovisuelle Abnahme in Echtzeit. Das Firewall-Geschehen ist ein redaktionelles
Szenario mit verdichteten Zeiten, kein Mitschnitt.

**Musikvideoexport erst nach ausdrücklicher Freigabe.**
