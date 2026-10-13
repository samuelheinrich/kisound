# TOKEN BURN · DE – Transkriptprüfung

47 Cues, 25 Prüfmarkierungen, 10 nicht ausreichend zugeordnete Promptzeilen.

Quelle: `../../suno-0.1/de/Token Burn - DE.wav` · SHA-256 `966d9277add83aae86221f708dc00efd286b8b83c8e2afa1739847613781c9de` · 245.933500 s.

Modell: `mlx-community/whisper-large-v3-mlx`, CPU via PyTorch/Transformers. Keine vollständigen Lyrics als ASR-Prompt; keine manuelle Hörprüfung. Rohdaten stehen unter `asr/whisper-large-v3.json`. Vokabularhinweis: `Token Burn, Prompt, Build, Export, Screen.`.

Der Turbo-Durchlauf ohne Vokabularhinweis wurde im jeweils gleichen Zeitfenster zum Textvergleich herangezogen. Unter 75 % Textähnlichkeit entsteht eine zusätzliche Prüfmarkierung. Beide Modelle gehören zur Whisper-Familie; ihre Übereinstimmung ist keine unabhängige Hörbestätigung.

Zeilenzeiten stammen aus den ersten/letzten tatsächlichen ASR-Wortgrenzen. Monotone Wortausrichtung berücksichtigt die Refrainfolge. Der Lyrics-Wortlaut wird bei mindestens 85 % Wortankern, beiden Randankern und mindestens 82 % Textähnlichkeit übernommen; bei 65–85 % Wortankern gilt die strengere Textähnlichkeit von 90 %. Token Burn wird als zusammenhängender Titel behandelt. Diese Grenzwerte sind Heuristiken, keine akustischen Konfidenzen. Unzugeordnete Wörter bleiben als markierter Rohtext erhalten; fehlende Zeilen erhalten keine erfundenen Zeiten.

Alle automatischen Zeiten bleiben vorläufig. JSON, SRT und TXT enthalten dieselbe Cueliste. Das JSON erhält auch Rohtext, Wortzeiten, Änderungen und Prüffelder.

| Cue | Zeit | Anzeige | ASR | Prüfgrund |
| --- | --- | --- | --- | --- |
| 3 | 00:00:28.560–00:00:31.140 | Die Uhr zeigt eins, der Build ist da, | Die Uhr zeigt einst Der Build ist da | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 8 | 00:00:46.260–00:00:49.700 | wir stelln die Speicherlogik um. | wir stellen die Speicherlogik um | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 15 | 00:01:18.660–00:01:19.900 | Token Burn. | Token Burn | Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 17 | 00:01:25.740–00:01:27.020 | Token Burn. | Token Burn | Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 18 | 00:01:29.140–00:01:29.980 | dass ich den... | dass ich den... | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 19 | 00:01:30.320–00:01:32.100 | Am nächsten Stand hier seh | Am nächsten Stand hier seh | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 21 | 00:01:36.160–00:01:40.840 | nur dieser eine muss was sein | nur dieser eine muss was sein | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 22 | 00:01:55.080–00:01:57.800 | Die Uhr zeigt drei, der Raum bleibt klein, | Die Uhr zeigt bei der Raum bleibt klein | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 23 | 00:01:58.680–00:01:59.440 | auf meinem Screen | auf meinem Screen | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 24 | 00:02:00.540–00:02:04.560 | Pass nein nein ein Nutzbord fehlt der nächste | Pass nein nein ein Nutzbord fehlt der nächste | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 25 | 00:02:04.560–00:02:04.940 | Lauf | Lauf | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 26 | 00:02:05.480–00:02:08.580 | Und meine letzte Frage auf | Und meine letzte Frage auf | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 28 | 00:02:12.100–00:02:15.820 | die nächste Frage längst zur Hand. | Die nächste Frage längst um Hand | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. Lyrics-Zeile aus Turbo-Wortzeiten ergänzt; large-v3 konnte sie nicht ausreichend zuordnen. |
| 29 | 00:02:15.960–00:02:19.280 | Ich wollte früher fertig sein, | ich wollte für fertig sein | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. Lyrics-Zeile aus Turbo-Wortzeiten ergänzt; large-v3 konnte sie nicht ausreichend zuordnen. |
| 31 | 00:02:22.260–00:02:23.220 | Token Burn. | Token Burn | Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 32 | 00:02:25.820–00:02:30.340 | Noch ein Punkt bevor ich geh tot Burn | Noch ein Punkt bevor ich geh tot Burn | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 33 | 00:02:32.600–00:02:35.540 | dass ich den nächsten Stand hier seh | dass ich den nächsten Stand hier seh | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 34 | 00:02:36.160–00:02:39.040 | Ein Tab geht zu, zwei kommen rein, | Ein Papp geht zu zwei kommen rein | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 38 | 00:02:58.660–00:03:01.320 | Der Satz von vorhin bleibt bei mir: | Der Satz von vorhin Bleib bei mir | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 40 | 00:03:08.460–00:03:09.100 | Token Burn. | Toten Burn | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 41 | 00:03:11.680–00:03:14.380 | Noch ein Punkt bevor ich geh | Noch ein Punkt bevor ich geh | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 42 | 00:03:15.180–00:03:16.520 | Token Burn. | Toten Burn | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 44 | 00:03:22.060–00:03:24.920 | Ein Tab geht zu, zwei kommen rein, | Ein Tag geht zu zwei kommen rein | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 45 | 00:03:25.540–00:03:29.980 | Und dieser Einer muss noch sein | Und dieser Einer muss noch sein | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 46 | 00:03:35.600–00:03:40.720 | Ein letzter Prompt steht jetzt bereit. | Ein letzter Boom steht jetzt bereit | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |

## Nicht ausreichend zugeordnete Promptzeilen

- Chorus 1: Bis ich den nächsten Stand hier seh. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 1: nur dieser eine muss noch sein. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Verse 2: auf meinem Screen passt mehr hinein. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Verse 2: Ein Export fehlt, der nächste Lauf — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Verse 2: nimmt meine letzte Frage auf. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: Noch ein Prompt, bevor ich geh. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: Token Burn. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: Bis ich den nächsten Stand hier seh. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: Noch ein Prompt, bevor ich geh. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: nur dieser eine muss noch sein. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.

## Ausgeschlossene ASR-Einträge

- `00:04:02.100–00:04:02.100` Burn: ASR kopiert den Vokabularhinweis mit zusammengefallenen Wortgrenzen; kein belegter Gesang.
- `00:04:03.420–00:04:03.420` Prompt: ASR kopiert den Vokabularhinweis mit zusammengefallenen Wortgrenzen; kein belegter Gesang.
- `00:04:03.720–00:04:04.560` Build: ASR kopiert den Vokabularhinweis mit zusammengefallenen Wortgrenzen; kein belegter Gesang.
- `00:04:04.560–00:04:04.560` Export: ASR kopiert den Vokabularhinweis mit zusammengefallenen Wortgrenzen; kein belegter Gesang.
- `00:04:04.560–00:04:04.560` Screen: ASR kopiert den Vokabularhinweis mit zusammengefallenen Wortgrenzen; kein belegter Gesang.

5 Wörter mit nicht verwendbarer Einzelzeit ausgeschlossen; Belege im JSON. Separate Satzzeichen werden nicht als eigene Wörter angezeigt. Bei einer anderen WAV beide Ergebnisse neu erzeugen.
