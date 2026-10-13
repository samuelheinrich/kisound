# TOKEN BURN · EN – Transkriptprüfung

46 Cues, 14 Prüfmarkierungen, 5 nicht ausreichend zugeordnete Promptzeilen.

Quelle: `../../suno-0.1/en/Token Burn - EN.wav` · SHA-256 `c1cec711e9be337b18ea64cbf9e16a027207e095e1843ef6a516b404680ba73d` · 250.800000 s.

Modell: `mlx-community/whisper-large-v3-mlx`, CPU via PyTorch/Transformers. Keine vollständigen Lyrics als ASR-Prompt; keine manuelle Hörprüfung. Rohdaten stehen unter `asr/whisper-large-v3.json`. Vokabularhinweis: `Token Burn, Prompt, Build, Export, Screen.`.

Der Turbo-Durchlauf ohne Vokabularhinweis wurde im jeweils gleichen Zeitfenster zum Textvergleich herangezogen. Unter 75 % Textähnlichkeit entsteht eine zusätzliche Prüfmarkierung. Beide Modelle gehören zur Whisper-Familie; ihre Übereinstimmung ist keine unabhängige Hörbestätigung.

Zeilenzeiten stammen aus den ersten/letzten tatsächlichen ASR-Wortgrenzen. Monotone Wortausrichtung berücksichtigt die Refrainfolge. Der Lyrics-Wortlaut wird bei mindestens 85 % Wortankern, beiden Randankern und mindestens 82 % Textähnlichkeit übernommen; bei 65–85 % Wortankern gilt die strengere Textähnlichkeit von 90 %. Token Burn wird als zusammenhängender Titel behandelt. Diese Grenzwerte sind Heuristiken, keine akustischen Konfidenzen. Unzugeordnete Wörter bleiben als markierter Rohtext erhalten; fehlende Zeilen erhalten keine erfundenen Zeiten.

Alle automatischen Zeiten bleiben vorläufig. JSON, SRT und TXT enthalten dieselbe Cueliste. Das JSON erhält auch Rohtext, Wortzeiten, Änderungen und Prüffelder.

| Cue | Zeit | Anzeige | ASR | Prüfgrund |
| --- | --- | --- | --- | --- |
| 7 | 00:01:00.200–00:01:02.820 | I reload once; the bass goes mute, | I reload once the base goes mute | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 13 | 00:01:30.160–00:01:31.320 | The text gets long | The text gets long | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 19 | 00:01:50.820–00:01:54.220 | One tab shuts, two more appear, | One tap shuts two more appear | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. Lyrics-Zeile aus Turbo-Wortzeiten ergänzt; large-v3 konnte sie nicht ausreichend zuordnen. |
| 21 | 00:02:03.320–00:02:08.340 | It's three o'clock, the room stays small, | It's 3 o 'clock the room stays small | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 28 | 00:02:29.620–00:02:32.740 | now there's one more thing to achieve. | Now this is my One more thing to achieve | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. Mindestens ein Wort hat eine zusammengefallene DTW-Zeitgrenze. Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 29 | 00:02:33.000–00:02:33.720 | Token Burn. | Token Burn | Turbo-Gegenprüfung im gleichen Zeitfenster weicht deutlich ab. |
| 33 | 00:02:46.900–00:02:49.680 | One death shots two more appear | One death shots two more appear | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 36 | 00:03:05.660–00:03:08.020 | another answer, minutes pass. | Another answer minutes past | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 39 | 00:03:18.560–00:03:19.240 | Talking burn | Talking burn | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 41 | 00:03:25.580–00:03:26.400 | Talking burn | Talking burn | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |
| 42 | 00:03:28.680–00:03:31.580 | One more thing I need to know. | One more thing I need to know | Mindestens ein Wort hat eine zusammengefallene DTW-Zeitgrenze. |
| 43 | 00:03:32.420–00:03:35.800 | One tab shuts, two more appear, | One tap shuts two more appear | ASR weicht vom finalen Lyrics-Text ab; Wortlaut am Audio prüfen. |
| 44 | 00:03:36.040–00:03:38.420 | I said I'd leave. I'm still right here. | I said I'd leave I'm still right here | Mindestens ein Wort hat eine zusammengefallene DTW-Zeitgrenze. |
| 46 | 00:03:52.580–00:03:54.340 | I'm pressing send I'm not quite done | I'm pressing send I'm not quite done | ASR-Zusatz oder unzureichende Lyrics-Zuordnung; Wortlaut und Abschnitt am Audio prüfen. |

## Nicht ausreichend zugeordnete Promptzeilen

- Pre-Chorus: The night gets short, the text gets long, — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 2: One tab shuts, two more appear, — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: Token Burn. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Chorus 3: Token Burn. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.
- Outro: I press on Send. I'm not quite done. — Keine ausreichend zuordenbare vollständige Zeile in beiden Modellläufen; Rohtext bleibt markiert.

## Ausgeschlossene ASR-Einträge

- `00:01:28.460–00:01:28.740` Thank: Kurze ASR-Floskel ohne Lyrics- oder Turbo-Beleg; möglicher Halluzinationsrest, nicht als Untertitel übernommen.
- `00:01:28.740–00:01:28.740` you: Kurze ASR-Floskel ohne Lyrics- oder Turbo-Beleg; möglicher Halluzinationsrest, nicht als Untertitel übernommen.
- `00:04:03.120–00:04:03.140` Thank: Kurze ASR-Floskel ohne Lyrics- oder Turbo-Beleg; möglicher Halluzinationsrest, nicht als Untertitel übernommen.
- `00:04:03.140–00:04:03.160` you: Kurze ASR-Floskel ohne Lyrics- oder Turbo-Beleg; möglicher Halluzinationsrest, nicht als Untertitel übernommen.

4 Wörter mit nicht verwendbarer Einzelzeit ausgeschlossen; Belege im JSON. Separate Satzzeichen werden nicht als eigene Wörter angezeigt. Bei einer anderen WAV beide Ergebnisse neu erzeugen.
