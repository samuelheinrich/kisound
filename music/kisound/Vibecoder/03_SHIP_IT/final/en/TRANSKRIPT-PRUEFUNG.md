# SHIP IT · EN – Transkriptprüfung

55 Cues, 40 Prüfmarkierungen, 18 nicht ausreichend zugeordnete Promptzeilen.

Quelle: `../03_SHIP_IT_suno-v3_50_50_exakt_off_EN.wav` · SHA-256 `fd70e12809ce18389d194a1f3829c98deced25b1c24ade5a24ae81ecf2b05408` · 120.680000 s.

Modell: `mlx-community/whisper-large-v3-mlx (curated full and short windows)`, Laufzeit `MLX GPU / mlx-whisper`. Keine vollständigen Lyrics als ASR-Prompt; keine manuelle Hörprüfung. Rohdaten stehen unter `asr/whisper-large-v3-curated.json`. Vokabularhinweis: `Commit it, ship it, build, check, live, album three.`.

Der Turbo-Durchlauf ohne Vokabularhinweis wurde im jeweils gleichen Zeitfenster zum Textvergleich herangezogen. Unter 75 % Textähnlichkeit entsteht eine zusätzliche Prüfmarkierung. Beide Modelle gehören zur Whisper-Familie; ihre Übereinstimmung ist keine unabhängige Hörbestätigung.

Zeilenzeiten stammen aus den ersten/letzten tatsächlichen ASR-Wortgrenzen. Monotone Wortausrichtung berücksichtigt die Refrainfolge. Der Lyrics-Wortlaut wird bei mindestens 85 % Wortankern, beiden Randankern und mindestens 82 % Textähnlichkeit übernommen; bei 65–85 % Wortankern gilt die strengere Textähnlichkeit von 90 %. Wiederholte Hook-Zeilen werden in ihrer gesungenen Reihenfolge abgeglichen. Diese Grenzwerte sind Heuristiken, keine akustischen Konfidenzen. Unzugeordnete Wörter bleiben als markierter Rohtext erhalten; fehlende Zeilen erhalten keine erfundenen Zeiten.

Alle automatischen Zeiten bleiben vorläufig. JSON, SRT und TXT enthalten dieselbe Cueliste. Das JSON erhält auch Rohtext, Wortzeiten, Änderungen und Prüffelder.

| Cue | Zeit | Anzeige | ASR | Prüfgrund |
| --- | --- | --- | --- | --- |
| 1 | 00:00:00.000–00:00:06.960 | Made it, ship it, build, check, live, made | Made it, ship it, build, check, live, made | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 2 | 00:00:06.960–00:00:10.400 | it, ship it, album three. | it, ship it, album three. | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 3 | 00:00:10.680–00:00:13.120 | Can free em run, em tring, add a | Can free em run, em tring, add a | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 4 | 00:00:13.120–00:00:13.800 | steady pace. | steady pace. | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 8 | 00:00:24.220–00:00:24.980 | covers missing. | covers missing. | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 9 | 00:00:25.200–00:00:27.560 | The filing changed, so it's not here. | The filing changed, so it's not here. | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 12 | 00:00:33.960–00:00:35.000 | Committed, ship it | Committed, ship it | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 13 | 00:00:35.000–00:00:36.560 | Go check live | Go check live | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 14 | 00:00:37.400–00:00:38.400 | Committed, ship it | Committed, ship it | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 15 | 00:00:38.400–00:00:39.920 | Album, album three | Album, album three | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 16 | 00:00:39.920–00:00:41.700 | The link goes three, | The link goes three, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 18 | 00:00:44.040–00:00:45.380 | Ah, ah, ah | Ah, ah, ah | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 19 | 00:00:45.380–00:00:47.380 | Hit play, the bass comes in at last | Hit play, the bass comes in at last | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 20 | 00:00:48.380–00:00:51.560 | Deploy to live, the uploader counts each file, | Deploy to live the upload accounts Each file | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 23 | 00:00:57.600–00:01:01.000 | hard reload, album three is up, the bass hits bold. | hard reload Album 3 is up, the bass hits bold | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 25 | 00:01:05.180–00:01:08.660 | the lyrics keep their language, just the way I wrote them to. | The lyrics keep their language just the way I wrote them too | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 26 | 00:01:10.020–00:01:12.600 | Committed, ship it, they'll check live | Committed, ship it, they'll check live | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 27 | 00:01:13.460–00:01:14.800 | Committed, ship it, album, | Committed, ship it, album, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 28 | 00:01:14.960–00:01:16.940 | Album three. | album 3 The | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 29 | 00:01:16.940–00:01:17.700 | link goes out, | link goes out, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 30 | 00:01:17.780–00:01:19.440 | The link goes out, the page loads fast, | the link goes out, the page holds fast | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 31 | 00:01:23.000–00:01:24.480 | Last, best, best, best | Last, best, best, best | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 32 | 00:01:24.480–00:01:25.200 | Tracks, | Tracks, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Überlappende ASR-Zeitgrenze; keine automatische Verschiebung. |
| 33 | 00:01:25.020–00:01:25.340 | Tracks. | Tracks | Überlappende ASR-Zeitgrenze; keine automatische Verschiebung. Lyrics-Zeile aus Turbo-Wortzeiten ergänzt; large-v3 konnte sie nicht ausreichend zuordnen. Überlappende ASR-Zeitgrenze; keine automatische Verschiebung. |
| 35 | 00:01:26.400–00:01:26.720 | Build, | Build, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 37 | 00:01:27.200–00:01:27.480 | check, | check, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 39 | 00:01:27.960–00:01:28.460 | Deploy, | Deploy, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 41 | 00:01:28.960–00:01:29.240 | reload, | reload, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 43 | 00:01:29.740–00:01:30.080 | Play. | Play, | Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 44 | 00:01:30.200–00:01:30.700 | play, play | play, play | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 45 | 00:01:30.700–00:01:31.420 | Committed shipping | Committed shipping | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 46 | 00:01:32.000–00:01:33.160 | Bill check live | Bill check live | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 47 | 00:01:34.020–00:01:34.980 | Committed, ship it | Committed, ship it | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 48 | 00:01:34.980–00:01:35.500 | Album, | Album, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 49 | 00:01:35.520–00:01:36.480 | Album three. | album three | Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 50 | 00:01:36.480–00:01:38.260 | The link goes out, | The link goes out, | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 51 | 00:01:38.360–00:01:40.020 | The link goes out, the page loads fast, | the link goes out The page rolls fast | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 52 | 00:01:41.700–00:01:43.880 | Hit play, the bass comes in at last | Hit play, the bass comes in at last | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 53 | 00:01:47.740–00:01:48.700 | Commit and shoot it | Commit and shoot it | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 55 | 00:01:59.400–00:02:00.080 | Album three | Album three | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |

## Auswahl der ASR-Fenster

Lange Wiederholungsfehler der 30-s-ASR wurden anhand unabhängiger kurzer Läufe auf derselben unveränderten WAV ersetzt. Keine manuelle Hörprüfung. Alle ersetzten Segmente sind dokumentiert.

2 volle Segmente wurden durch kürzere Gegenfenster ersetzt oder ausgeschlossen; Belege im Roh-JSON.

## Nicht ausreichend zugeordnete Promptzeilen

- Intro: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Intro: Album three goes out. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Verse 1: a cover's missing, the filename changed, so it's not here. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: Build. Check. Live. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: Album three. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: I hit play, the bass comes in at last. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: Build. Check. Live. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: I hit play, the bass comes in at last. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Bridge: Album three. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: Build. Check. Live. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: I hit play, the bass comes in at last. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Outro: COMMIT IT. SHIP IT. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.

## Ausgeschlossene ASR-Einträge

Keine.

0 Wörter mit nicht verwendbarer Einzelzeit ausgeschlossen; Belege im JSON. Separate Satzzeichen werden nicht als eigene Wörter angezeigt. Bei einer anderen WAV beide Ergebnisse neu erzeugen.

## Songform für das Drehbuch

Abschnittsgrenzen sind redaktionelle Schnittanker; ASR-Wortzeiten bleiben unverändert.

| Abschnitt | Start | Ende |
| --- | ---: | ---: |
| Intro | 0.000 s | 14.080 s |
| Verse 1 | 14.080 s | 33.960 s |
| Chorus 1 | 33.960 s | 48.380 s |
| Verse 2 | 48.380 s | 70.020 s |
| Chorus 2 | 70.020 s | 83.000 s |
| Bridge | 83.000 s | 90.700 s |
| Chorus 3 | 90.700 s | 107.740 s |
| Outro | 107.740 s | 120.680 s |
