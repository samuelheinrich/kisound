# Active / Standby · Browservorschau

**Code und interaktive Vorschau. Kein Videoexport ohne Freigabe.**

Codebasiertes Musikvideo zu Track 02 von Network Engineer 02. Zwei gleiche FortiGates (FGCP A-P, group 22) teilen
die LAN-Adresse 192.0.2.1. A trägt den Verkehr, B hört den Heartbeat und hält den Session-Stand. Bei 89,10 s bricht
die einzige HA-Leitung ha1: B wird nach 3,52 s ebenfalls Primary – Split Brain. Nur As Produktionsanschlüsse werden
an den Switches abgeschaltet, die Präferenzen neu gesetzt, ha1 repariert; B gewinnt die Wahl, ist Autorität für den
Resync, und A kommt als Standby zurück.

Drei Räume: **Halle** (Geräte, ha1, Adressring, Netz), **Archive** (Session-Tabellen, S-17) und **Consoles**.
12 Kapitel, 56 Einstellungen nach dem Drehbuch, unverändertes Originalaudio.

## Start

```sh
cd "/Users/samuel.heinrich/0004_git/videos/kisound/Network-Engineer-Album02/02_Active_Standby"
npm ci --ignore-scripts   # nur falls node_modules fehlt
npm run prepare           # prüft WAV/Transkript per SHA-256 und kopiert das Audio
npm run preview           # http://127.0.0.1:8152/
```

Einstiege: `?t=0` Halle · `?t=14` S-17 entsteht · `?t=23.7` Heartbeat · `?t=67.4` Active/Standby · `?t=82.3` ha1
freigestellt · `?t=89.1` Bruch · `?t=91.3` Peer-Timer · `?t=92.6` B Primary · `?t=102.7` Split Brain · `?t=105.9`
Consoles · `?t=108.8` S-17 weicht ab · `?t=111.4` Fencing · `?t=117.9` Reparatur · `?t=120.4` Präferenzen/Wahl ·
`?t=125.6` Resync · `?t=132.3` A-Links frei · `?t=139.9` B Active · `?t=171.9` TCP-Test · `?t=180.8` Consoles stabil.
`?res=720`, `?debug=1`, `?w=1920&h=1080&t=104` wie bei den anderen Stücken.

## Quellen und Timing

- Finale WAV laut `02_Active_Standby_1.0.txt`: `02_Active_Standby_1.0.wav`,
  SHA-256 `42750eb28bf676ef697bc26cddb9c28ec62390336e462783111b69db2446c86c`.
- 48 kHz, 9 752 328 Samples = **203,1735 s**; 60 fps = 12 191 Bilder. Transkript-SHA `a3a1ccab…71dc`.
- Analyse `ASTRA-AUDIO-ANALYSE.json/.md/.png` (unverändert), 134 BPM geschätzt.
- Drehbuch: `ASTRA-DREHBUCH.md` (Präzisierungen), Original unter `_revisions/`. Cues: `UMSETZUNG-CUES.md`/`.json`.
- Bass-Einsätze 25,4 · 82,7 · 111,3 · 161,5 · 194,0 s; Pegellücken 81,45–82,55 und 190,25–192,45 s; Blende ab 197,2 s.

## Fachliche Leitplanken (Tests)

Rollen und Zeitpunkte auf den Gesangszeilen (L017, L019); Split Brain genau solange beide weiterleiten; Fencing nur
an A, danach nichts mehr durch A; Präferenzen vor der Reparatur, Wahl danach, B gewinnt; Heartbeat und Sync nur über
intaktes ha1, Sync folgt dem Primary; S-17 synchron → abweichend → B autoritativ; unterbrochene Sessions nur im
Split Brain und nur beim Gerät ohne Session; lokale Consoles zeigen nie den Status des anderen Geräts; Ergebnisse
erst nach ihrem Ereignis; Adressen aus Dokumentations-/privaten Bereichen.

## Prüfen und Export

```sh
npm run check           # 14 Modell- und Timeline-Tests
npm run check:browser   # Standbilder, Schnittgrenzen, Determinismus, Player, 4K-Still
kisound-render 4k --check   # Export nur prüfen; Render erst nach Freigabe
```
