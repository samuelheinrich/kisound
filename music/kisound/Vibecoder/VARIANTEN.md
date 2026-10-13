# Vibecoder · Varianten V1–V3 und Ersatztracks E1–E10

Arbeitsstand 9. Oktober 2026 · Entwürfe, noch keine Aufnahmen.

Für jeden offenen Track (01, 03, 04, 05, 06) gibt es drei neue Varianten unter `NN_Track/suno-V1..V3/`.
Zehn mögliche Ersatztracks sind archiviert unter `../xx_archive/Vibecoder/E1..E10_*/`. Jede Fassung hat `de/` und `en/` mit
`lyrics.txt` (Lyrics-Feld), `style.txt` (Styles-Feld, Schema wie TOKEN BURN, ≤ 1000 Zeichen) und
`settings.txt` (Platzhalter). TOKEN BURN bleibt unverändert final; die bisherigen `suno-0.1`-Entwürfe bleiben liegen.

Leitlinien: elektronisch, bassbetont, kein simpler Techno, jede Fassung in einem anderen Subgenre.
Jede Strophe beschreibt reale, zeigbare Dinge (Befehle, Fehlermeldungen, Dateien, Geräte, Messwerte),
die sich später im Code-Video als konkrete Objekte und Zustandswechsel umsetzen lassen.

## Varianten der bestehenden Tracks

| Track | Var. | Genre · BPM | Stimme | Hook | Inhalt und Bildmotive |
| --- | --- | --- | --- | --- | --- |
| 01 VIBECODER | [V1](01_Vibecoder/suno-V1/) | UK Bass House / Rap-Electro · 126 | tiefer rauer Rap | Tags im Netz, nachts im Terminal | Tag: AP-Cluster, ISE Access-Reject, IPsec Phase 2 down. Nacht: Codex, Drag-and-Drop-Upload hängt bei 99 %, Diff, Revert. |
| | [V2](01_Vibecoder/suno-V2/) | Nu-Skool Breaks / Big Beat · 132 | rauer Sprechgesang | Vibecoder. Bau's dir selbst. | Projektmontage: Pi mit Kamera und Servos, Grundriss → 3D-Haus, Blender-Modell liegt in Babylon auf der Seite, Mac-App für Transfers. |
| | [V3](01_Vibecoder/suno-V3/) | Grime / UK Bass · 140 | schneller Rap | Ich sag's, er baut's, ich test's, er fixt's | Arbeitsschleife: Approval-Abfrage, localhost:3000, Layout bricht, Screenshot, 400-Zeilen-Diff, Stacktrace, kleiner Commit. |
| 03 SHIP IT | [V1](03_SHIP_IT/suno-V1/) | EBM / Industrial Electro · 128 | eine tiefe raue Stimme | Sign it. Notarize. Staple. Release. | macOS-Release: Archive, Developer ID, notarytool „Invalid“ (Hardened Runtime fehlt), „Accepted“, stapler, DMG, Gatekeeper. |
| | [V2](03_SHIP_IT/suno-V2/) | Neurofunk DnB · 174 | eine tiefe raue Stimme | Rot. Rot. Grün. Merge. Tag. Deploy. | CI-Pipeline: Lint rot (unbenutzte Variable), Test rot (UTC-Zeitstempel), vier grüne Haken, Healthcheck 200, Rollback bereit. |
| | [V3](03_SHIP_IT/suno-V3/) | Hard Phonk / Industrial Bass · 140 | eine tiefe raue Stimme | Build. Check. Live. Album drei. | Album-Release auf der eigenen Website: build, check findet umbenanntes Cover, Deploy, Cache, harter Reload, DE/EN-Prüfung. |
| 04 AI SLOP | [V1](04_AI_Slop/suno-V1/) | UK Garage / Speed Garage · 134 | helle Frauenstimme | Take vierzig, Variante zwei | Eigene Musik-Takes: zwei Songs pro Klick, Sängerin singt „Chorus“, Dateien `_0.3-2`, Lizenz-PDFs, Cover mit verdrehtem Buchstaben. |
| | [V2](04_AI_Slop/suno-V2/) | Nu-Disco / Electro-Funk · 118 | helle Frauenstimme | Lila Verlauf und ein Raketen-Emoji | Landingpage-Floskeln: Preiskarten, generierte Testimonials, Warteliste statt Produkt, eigene README mit Rakete. |
| | [V3](04_AI_Slop/suno-V3/) | Jersey Club · 140 | helle Frauenstimme | Plus dreitausend, minus zwölf | Code-Slop: ein Sortierknopf, 14 Dateien, `formatDate2`, Kommentar über jeder Zeile, `console.log`, Löschen bis zehn Zeilen. |
| 05 HALLUCINATION | [V1](05_Hallucination/suno-V1/) | Dark Trip-Hop / Dub · 90 | naher Bariton | Invalid input detected | Erfundener Switch-Befehl: `% Invalid input detected at '^' marker`, Kontexthilfe `?`, Command Reference, `show running-config`. |
| | [V2](05_Hallucination/suno-V2/) | Deep Dubstep / Halftime · 140 | naher Bariton | Vier null vier, bis jemand ihn nimmt | Erfundenes Paket: `npm install` → E404, drei Wochen später registriert, Postinstall mit curl, Name aus `package.json` gestrichen. |
| | [V3](05_Hallucination/suno-V3/) | Midtempo Bass / Industrial Downtempo · 100 | naher Bariton | Ein grüner Haken ohne Test | Behaupteter Testerfolg: „All tests passed“, Runner zeigt 0 passing / 3 skipped, `expect(true)`, echte Tests, Exit-Code 0. |
| 06 CONTEXT WINDOW | [V1](06_Context_Window/suno-V1/) | Future Garage / Ambient Bass · 130 | weiblicher Alt | Du siehst nur, was ins Fenster passt | Kontextanzeige 90 → 95 %, Zusammenfassung verliert einen Grund, verworfenes Paket kommt zurück, Regel in `AGENTS.md`. |
| | [V2](06_Context_Window/suno-V2/) | Liquid DnB · 172 | weiblicher Alt | Es liegt im Log, es liegt bei mir | Neue Sitzung am Morgen: leerer Chat, `git log` mit Commit-Texten und Uhrzeiten, „Initial commit“. |
| | [V3](06_Context_Window/suno-V3/) | Ambient Dub / Downtempo Breaks · 84 | weiblicher Alt | Was oben rausfällt, siehst du nicht | Erster Satz rutscht oben aus dem Fenster; eigene Erinnerung: blaues Konsolenkabel, 9600 Baud, vergessene Kundennamen. |

## Ersatztracks

| Nr. | Titel | Genre · BPM | Stimme | Hook | Inhalt und Bildmotive |
| --- | --- | --- | --- | --- | --- |
| [E1](../xx_archive/Vibecoder/E1_Prompt_Injection/) | PROMPT INJECTION | Dark Electroclash · 124 | kühle Frauenstimme | Weisse Schrift auf weissem Grund | Versteckter Text in einer Doku-Seite, Agent will `curl POST` mit `.env`, Ablehnen, Quelltext, Sandbox ohne Netz, Default Deny. |
| [E2](../xx_archive/Vibecoder/E2_429/) | 429 | Glitch Hop · 110 | lockerer Halbrap | Eins, zwei, vier, acht, sechzehn | 500 Requests parallel, HTTP 429, `Retry-After`, exponentielles Backoff mit Jitter wie bei TCP, Queue mit vier parallelen Anfragen. |
| [E3](../xx_archive/Vibecoder/E3_Works_On_My_Machine/) | WORKS ON MY MACHINE | UK Bassline · 138 | Duett Rap / Gesang | Mein Rechner ist nicht die Welt | Zwei Laptops: `Utils` vs. `utils` (Gross-/Kleinschreibung unter Linux), fehlende `.env`, Node 18 vs. 22, Dockerfile, `docker compose up`. |
| [E4](../xx_archive/Vibecoder/E4_Git_Bisect/) | GIT BISECT | Detroit Electro · 128 | methodische Männerstimme | Vierundsechzig, zweiunddreissig, sechzehn, acht | 64 Commits halbiert in sechs Tests, „refactor: simplify config“ setzt Timeout 30 → 3 s, `git revert`, Regressionstest. |
| [E5](../xx_archive/Vibecoder/E5_Birdlaser/) | BIRDLASER | Progressive Psytrance · 138 | ruhige Männerstimme | Bild. Rahmen. Pan. Tilt. | Pi-Kamera, Erkennungsrahmen „bird 0.91“, Plastiktüte 0.6, Schwelle 0.7, Servo-Zittern durch Software-PWM, Lichtpunkt neben dem Vogel. |
| [E6](../xx_archive/Vibecoder/E6_Heatmap/) | HEATMAP | Progressive Breaks · 128 | warme Männerstimme | Grün, wo das Signal noch trägt | Grundriss → 3D, Wanddämpfung (Beton 12 dB, Gipskarton 3 dB), −67 dBm, Kanäle 1/6/11, Messung vor Ort findet Metallschrank. |
| [E7](../xx_archive/Vibecoder/E7_Show_Me_The_Log/) | ZEIG MIR DAS LOG / SHOW ME THE LOG | Electronic Trap / Bass-Rap · 145 | tiefer Rap | Nicht „sollte“, nicht „vielleicht“ | ISE Access-Reject, FortiGate debug flow Policy 0, Port err-disabled durch BPDU Guard; nachts TypeError Zeile 42 in falscher Datei. |
| [E8](../xx_archive/Vibecoder/E8_Allow/) | ALLOW | UK Rave / Breakbeat Hardcore · 145 | Männerstimme, Crowd-Ruf | Allow? Yes. Always. | Approval-Dialoge, „Immer erlauben“, `git reset --hard` löscht zwei Stunden ohne Commit, Sandbox, Allowlist, kleine Commits. |
| [E9](../xx_archive/Vibecoder/E9_Local_Model/) | LOCAL MODEL | Darksynth / Synthwave · 112 | tiefe warme Männerstimme | Keine Cloud. Nur mein Gerät. | Kundenkonfig bleibt lokal: 8B-Modell 4 Bit, `ollama run`, Lüfter, 40 Tokens/s, falsch gelesene ACL, WLAN aus und trotzdem Antwort. |
| [E10](../xx_archive/Vibecoder/E10_Z-Up/) | Z-UP | Chiptune-Bass / Bitpop · 140 | helle Frauenstimme | Dreh die Welt um neunzig Grad | Blender → Babylon: +Y-Up-Haken, fehlende Textur, GLB, invertierte Normalen mit Backface Culling, Recalculate Outside. |

## Fachliche Anmerkungen

- Persönliche Bezüge (Region Basel, 20 Jahre Netzwerk, Cisco/Fortinet/ISE, TransferBuddy, Birdlaser, Babylon/Blender,
  Grundriss-WLAN-Simulation, lokale Modelle) sind eingearbeitet; der Arbeitgeber wird bewusst nicht genannt.
- Kundendaten, Domains und Zugangsdaten bleiben generisch; Videos zeigen keine echten Schlüssel oder Konfigurationen.
- Zahlen sind Szenariowerte (Dämpfung, Tokens/s, Commit-Anzahl), keine Messungen. Für die Videos gelten sie als Darstellungswerte.
- BIRDLASER: der Lichtpunkt landet neben dem Vogel auf Geländer oder Dach, nie auf dem Tier.
