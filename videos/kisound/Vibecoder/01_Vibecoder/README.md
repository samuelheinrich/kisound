# VIBECODER

Status: Drehbuch und Schnittlisten für DE und EN ausgearbeitet; Video noch nicht umgesetzt.
Musikstand: DE und EN final.

**Drehbuch:** [Der sichtbare Weg](ASTRA-DREHBUCH.md) ·
[72 Einstellungen je Fassung](SCHNITTLISTE.md) ·
[maschinenlesbare Regie-Cues](REGIE-CUES.json) ·
[Quellmanifest](SOURCE-MANIFEST.json).
`build_screenplay.py` erzeugt Schnittliste, Regie-Cues und Manifest aus der
redaktionellen Einstellungsliste und prüft beide Laufzeiten sowie Cue-Zuordnungen.

Quelle im Musik-Repo: `../../../../music/kisound/Vibecoder/01_Vibecoder/`.
Audiozuordnung, Zeitmarken, Transkripte und Analysen liegen sprachgetrennt unter
`../../../../music/kisound/Vibecoder/01_Vibecoder/final/de/` und `en/`.
Die beiden Fassungen haben eigene Laufzeiten und dürfen nicht durch Umrechnung
einer gemeinsamen Timeline ersetzt werden. Die Umsetzung folgt dem Drehbuch;
ASR-Prüfstellen bleiben vor finaler Worttypografie und Untertiteln hörpflichtig.

| Fassung | Dauer | Tempo-Schätzung | Lautheit | Transkript | Messbericht | Prüfstellen |
| --- | ---: | ---: | ---: | --- | --- | --- |
| DE | 3:36.240 | 133 BPM | −14,8 LUFS | [JSON](../../../../music/kisound/Vibecoder/01_Vibecoder/final/de/01_Vibecoder_Transkript.json) · [SRT](../../../../music/kisound/Vibecoder/01_Vibecoder/final/de/01_Vibecoder_Transkript.srt) | [Audioanalyse](../../../../music/kisound/Vibecoder/01_Vibecoder/final/de/ASTRA-AUDIO-ANALYSE.md) | [Prüfbericht](../../../../music/kisound/Vibecoder/01_Vibecoder/final/de/TRANSKRIPT-PRUEFUNG.md) |
| EN | 4:04.760 | 133 BPM | −14,9 LUFS | [JSON](../../../../music/kisound/Vibecoder/01_Vibecoder/final/en/01_Vibecoder_Transkript.json) · [SRT](../../../../music/kisound/Vibecoder/01_Vibecoder/final/en/01_Vibecoder_Transkript.srt) | [Audioanalyse](../../../../music/kisound/Vibecoder/01_Vibecoder/final/en/ASTRA-AUDIO-ANALYSE.md) | [Prüfbericht](../../../../music/kisound/Vibecoder/01_Vibecoder/final/en/TRANSKRIPT-PRUEFUNG.md) |

Der englische Lyrics-Text wurde vor der Analyse korrigiert. Die EN-Final-Drop-
Zeile um 03:24–03:28 bleibt im Transkript als unsicher markiert. Alle Messzeiten
beginnen bei Sample 0 der jeweiligen unveränderten 48-kHz-Stereo-WAV. Das
Beatraster ist geschätzt; für gesangsgenaue Schnitte gelten die Cue-Zeiten.

Quellen des Drehbuchs: je Fassung den 1.0-Quellbeleg, das Transkript, den
`TRANSKRIPT-PRUEFUNG.md`-Bericht und `ASTRA-AUDIO-ANALYSE.json/.md/.png` lesen.
Die automatische ASR ist keine manuelle Hörfreigabe; markierte Textstellen
vor Untertiteln und finalem Filmschnitt anhand der jeweiligen WAV prüfen.

`src/render/` und `src/tools/` reservieren den bestehenden Codevideo-Aufbau;
`assets/` und `output/qa/` bleiben bis zur Umsetzung leer.
