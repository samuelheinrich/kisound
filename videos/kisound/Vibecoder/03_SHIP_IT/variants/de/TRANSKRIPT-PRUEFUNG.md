# SHIP IT · DE – Transkriptprüfung

39 Cues, 32 Prüfmarkierungen, 28 nicht ausreichend zugeordnete Promptzeilen.

Quelle: `../03_SHIP_IT_suno-v3_50_50_exakt_off_DE.wav` · SHA-256 `689d662c3d10ba9bd08c787315635ff4bba6d97f8a5db54343486dd4c7958259` · 155.960000 s.

Modell: `mlx-community/whisper-large-v3-mlx (curated full and short windows)`, Laufzeit `MLX GPU / mlx-whisper`. Keine vollständigen Lyrics als ASR-Prompt; keine manuelle Hörprüfung. Rohdaten stehen unter `asr/whisper-large-v3-curated.json`. Vokabularhinweis: `Commit it, ship it, build, check, live, album drei.`.

Der Turbo-Durchlauf ohne Vokabularhinweis wurde im jeweils gleichen Zeitfenster zum Textvergleich herangezogen. Unter 75 % Textähnlichkeit entsteht eine zusätzliche Prüfmarkierung. Beide Modelle gehören zur Whisper-Familie; ihre Übereinstimmung ist keine unabhängige Hörbestätigung.

Zeilenzeiten stammen aus den ersten/letzten tatsächlichen ASR-Wortgrenzen. Monotone Wortausrichtung berücksichtigt die Refrainfolge. Der Lyrics-Wortlaut wird bei mindestens 85 % Wortankern, beiden Randankern und mindestens 82 % Textähnlichkeit übernommen; bei 65–85 % Wortankern gilt die strengere Textähnlichkeit von 90 %. Wiederholte Hook-Zeilen werden in ihrer gesungenen Reihenfolge abgeglichen. Diese Grenzwerte sind Heuristiken, keine akustischen Konfidenzen. Unzugeordnete Wörter bleiben als markierter Rohtext erhalten; fehlende Zeilen erhalten keine erfundenen Zeiten.

Alle automatischen Zeiten bleiben vorläufig. JSON, SRT und TXT enthalten dieselbe Cueliste. Das JSON erhält auch Rohtext, Wortzeiten, Änderungen und Prüffelder.

| Cue | Zeit | Anzeige | ASR | Prüfgrund |
| --- | --- | --- | --- | --- |
| 1 | 00:00:08.360–00:00:09.780 | Album drei geht raus. | Album drei geht raus. | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 2 | 00:00:22.140–00:00:23.540 | Album 3 geht raus | Album 3 geht raus | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 4 | 00:00:30.260–00:00:33.760 | npm run build, die Seiten stehen nach kurzer Zeit. | NPM Run, Bild, die Seiten stehen nach kurzer Zeit | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 6 | 00:00:36.940–00:00:40.380 | ein Cover fehlt, der Dateiname nicht so, wie er war. | Ein Cover fehlt, der dat die Name nicht so wie er war | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 7 | 00:00:40.380–00:00:44.700 | Ein Unterstrich zu viel, ich benenn die Datei zurück, | Ein Unterstrich, zu viel Ich bin in die Datei zurück | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 9 | 00:00:51.320–00:00:54.440 | Komedische B -B -B -Budget -Live | Komedische B -B -B -Budget -Live | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 10 | 00:00:55.120–00:00:56.620 | Komedische B -B -B -B | Komedische B -B -B -B | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 11 | 00:00:56.820–00:00:58.220 | Album drei. | -Album -Drei | Lyrics-Zeile aus Turbo-Wortzeiten ergänzt; large-v3 konnte sie nicht ausreichend zuordnen. |
| 12 | 00:00:58.340–00:01:01.440 | Link geht raus, die Seite lebt | Link geht raus, die Seite lebt | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 13 | 00:01:01.440–00:01:05.000 | Play gedrückt, und der Bass still | Play gedrückt, und der Bass still | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 14 | 00:01:07.000–00:01:10.340 | Schlecht live, komm mit den Schippen mit den | Schlecht live, komm mit den Schippen mit den | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 15 | 00:01:10.340–00:01:11.540 | Albumen rein | Albumen rein | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 16 | 00:01:12.000–00:01:15.340 | Der Lied geht raus, die Seite lebt | Der Lied geht raus, die Seite lebt | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 17 | 00:01:15.340–00:01:16.480 | Play gedrückt | Play gedrückt | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 18 | 00:01:17.000–00:01:18.660 | Und der Bass still | Und der Bass still | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 22 | 00:01:28.700–00:01:31.280 | Data Reload und Album 3 steht da, der | Data Reload und Album 3 steht da, der | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 23 | 00:01:31.280–00:01:32.260 | Bass knallt | Bass knallt | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 25 | 00:01:35.380–00:01:38.780 | die Lyrics bleiben im Original, so wie ich sie gemacht. | Die Lyrics bleiben im Mord So wie ich sie gemacht | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 26 | 00:01:38.780–00:01:42.240 | Comedy Shippe -Pippe -Pippe -Pippe Check live | Comedy Shippe -Pippe -Pippe -Pippe Check live | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 27 | 00:01:42.920–00:01:45.620 | Comedy Shippe -Pippe -Pippe Album 3 | Comedy Shippe -Pippe -Pippe Album 3 | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 28 | 00:01:45.620–00:01:49.140 | Der Link geht raus, die Seite leer | Der Link geht raus, die Seite leer | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 29 | 00:01:49.140–00:01:50.720 | Kegel drückt | Kegel drückt | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 30 | 00:01:50.720–00:01:52.960 | Und der Bass steht | Und der Bass steht | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 31 | 00:01:53.000–00:01:53.620 | Tracks. | Tricks, | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 32 | 00:01:53.680–00:01:54.240 | Covers. | Cover, | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 33 | 00:01:54.400–00:01:58.440 | Doppelbild, Tische, Pro, Lilo, Lilo, Bäh, Bäh, Bäh, | Doppelbild, Tische, Pro, Lilo, Lilo, Bäh, Bäh, Bäh, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 34 | 00:01:58.520–00:01:58.980 | Almen. | Almen. | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 35 | 00:02:00.280–00:02:04.760 | Tricks, Cover, Doppelbild, Tische, Pro, Lilo, Lilo, Bäh, | Tricks, Cover, Doppelbild, Tische, Pro, Lilo, Lilo, Bäh, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 36 | 00:02:04.900–00:02:05.720 | Bäh, Bäh, Almen. | Bäh, Bäh, Almen. | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 37 | 00:02:17.500–00:02:20.280 | Und der Bastel | Und der Bastel | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 38 | 00:02:30.600–00:02:32.620 | Nächste Zeit und nächste | Nächste Zeit und nächste | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 39 | 00:02:32.620–00:02:34.000 | Komm' auf | Komm' auf | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |

## Auswahl der ASR-Fenster

Lange Wiederholungsfehler der 30-s-ASR wurden anhand unabhängiger kurzer Läufe auf derselben unveränderten WAV ersetzt. Keine manuelle Hörprüfung. Alle ersetzten Segmente sind dokumentiert.

8 volle Segmente wurden durch kürzere Gegenfenster ersetzt oder ausgeschlossen; Belege im Roh-JSON.

## Nicht ausreichend zugeordnete Promptzeilen

- Intro: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Intro: Album drei geht raus. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: Build. Check. Live. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: Der Link geht raus, die Seite lädt, — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: Play gedrückt, und der Bass steht. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Verse 2: harter Reload, und Album drei steht da. Der Bass knallt. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: Build. Check. Live. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: Album drei. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: Der Link geht raus, die Seite lädt, — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: Play gedrückt, und der Bass steht. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Bridge: Build. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Bridge: Check. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Bridge: Deploy. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Bridge: Reload. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Bridge: Play. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Bridge: Album drei. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: Build. Check. Live. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: Album drei. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: Der Link geht raus, die Seite lädt, — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: Play gedrückt, und der Bass steht. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Outro: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Outro: Nächstes Album. Nächster Commit. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.

## Ausgeschlossene ASR-Einträge

Keine.

0 Wörter mit nicht verwendbarer Einzelzeit ausgeschlossen; Belege im JSON. Separate Satzzeichen werden nicht als eigene Wörter angezeigt. Bei einer anderen WAV beide Ergebnisse neu erzeugen.

## Songform für das Drehbuch

Abschnittsgrenzen sind redaktionelle Schnittanker; ASR-Wortzeiten bleiben unverändert. DE Chorus 3 enthält längere instrumentale Fläche und wenig belastbaren Gesang.

| Abschnitt | Start | Ende |
| --- | ---: | ---: |
| Intro | 0.000 s | 27.160 s |
| Verse 1 | 27.160 s | 51.320 s |
| Chorus 1 | 51.320 s | 78.660 s |
| Verse 2 | 78.660 s | 98.780 s |
| Chorus 2 | 98.780 s | 113.000 s |
| Bridge | 113.000 s | 126.000 s |
| Chorus 3 / instrumental | 126.000 s | 150.600 s |
| Outro | 150.600 s | 155.960 s |
