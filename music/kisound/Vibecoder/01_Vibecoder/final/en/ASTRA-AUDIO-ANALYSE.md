# VIBECODER · EN – Audioanalyse

**Wichtigste Erkenntnisse:** 244.760 s, geschätzte 133.0 BPM (mittel), -14.9 LUFS und -3.4 dBTP. Letzte transkribierte Stimme bei 00:04:03.980; Audioende bei 00:04:04.760.

## Datei und Pegel

- Quelle: `01_Vibecoder_suno-0.1_50_50_exakt_off_EN.wav`; SHA-256 `0ec442b9fa84de0a6b0e781f625597192015839555d1c27d60e649df6463d514`. Finale Release-Datei laut STATUS: Final und RELEASE AUDIO im 1.0-Prompt; Transkript-SHA und decodierte Dauer geprüft.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 11748480 Samples je Kanal; Dauer 244.760000000 s.
- Sample-Peak -3.378 dBFS bei 00:03:48.502; pro Kanal [-3.471, -3.378] dBFS. True Peak -3.4 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -15.676 dBFS; Crest 12.299 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -14.9 LUFS; LRA 5.5 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-0.000236, -7.52e-05]; globale Stereo-Korrelation 0.9313. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 66.7 BPM; phasenoptimierte Rasterbewertung: 133.0 BPM. Empfohlen: 133.0 BPM; Alternativen [66.5, 266.0, 106.4, 76.0]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.226 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 133.3 BPM, 00:00:30.000–00:01:00.000: 133.3 BPM, 00:01:00.000–00:01:30.000: 133.3 BPM, 00:01:30.000–00:02:00.000: 66.7 BPM, 00:02:00.000–00:02:30.000: 133.3 BPM, 00:02:30.000–00:03:00.000: 66.7 BPM, 00:03:00.000–00:03:30.000: 133.3 BPM, 00:03:30.000–00:04:00.000: 133.3 BPM, 00:04:00.000–00:04:04.760: 133.3 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 52.75 % |
| bass_60_250 | 60–250 Hz | 24.72 % |
| lowmid_250_500 | 250–500 Hz | 7.38 % |
| mid_500_2000 | 500–2000 Hz | 10.97 % |
| presence_2000_6000 | 2000–6000 Hz | 2.67 % |
| high_6000_12000 | 6000–12000 Hz | 1.11 % |
| air_12000_20000 | 12000–20000 Hz | 0.39 % |

Mittlerer spektraler Schwerpunkt 708.8 Hz, 85-%-Rolloff 1128.5 Hz. Auffällige Langzeit-Peaks: [46.9, 128.9, 175.8, 257.8, 527.3, 351.6, 785.2, 433.6, 691.4] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:11.000 | Intro | -22.97 | -4.17 | 753.3 |
| 00:00:11.000–00:00:32.000 | Instrumentaler Vorlauf | -18.79 | -6.27 | 561.4 |
| 00:00:32.000–00:00:46.000 | Verse 1 | -17.49 | -6.14 | 456.2 |
| 00:00:46.000–00:00:59.500 | Build | -19.15 | -4.63 | 1124.3 |
| 00:00:59.500–00:01:23.000 | Drop 1 | -16.23 | -3.98 | 956.7 |
| 00:01:23.000–00:01:51.000 | Instrumental Break | -15.92 | -4.84 | 592.4 |
| 00:01:51.000–00:02:19.500 | Verse 2 | -14.95 | -3.5 | 839.4 |
| 00:02:19.500–00:02:45.000 | Drop 2 | -15.84 | -3.47 | 865.5 |
| 00:02:45.000–00:03:03.000 | Bridge | -17.03 | -4.91 | 438.5 |
| 00:03:03.000–00:03:47.000 | Final Drop | -13.78 | -3.55 | 684.9 |
| 00:03:47.000–00:04:04.760 | Outro | -13.35 | -3.38 | 496.7 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:00.100 | level_gap | 100-ms-RMS -90.2 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:11.000 | section_boundary | Beginn Instrumentaler Vorlauf; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E004 | 00:00:32.000 | section_boundary | Beginn Verse 1; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:46.000 | section_boundary | Beginn Build; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E006 | 00:00:59.500 | section_boundary | Beginn Drop 1; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:01:01.200 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.5 dB | Prompt-, Test- und Prototypansicht öffnen |
| E008 | 00:01:02.931 | transient | Spektraler Anstieg, relative Stärke 2.47 | Cursor- oder Bassimpuls hervorheben |
| E009 | 00:01:10.151 | transient | Spektraler Anstieg, relative Stärke 2.33 | Cursor- oder Bassimpuls hervorheben |
| E010 | 00:01:13.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.3 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E011 | 00:01:22.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.9 dB | Prompt-, Test- und Prototypansicht öffnen |
| E012 | 00:01:23.000 | section_boundary | Beginn Instrumental Break; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E013 | 00:01:49.851 | transient | Spektraler Anstieg, relative Stärke 2.36 | Cursor- oder Bassimpuls hervorheben |
| E014 | 00:01:51.000 | section_boundary | Beginn Verse 2; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E015 | 00:01:57.971 | transient | Spektraler Anstieg, relative Stärke 2.84 | Cursor- oder Bassimpuls hervorheben |
| E016 | 00:02:04.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.7 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E017 | 00:02:06.091 | transient | Spektraler Anstieg, relative Stärke 2.60 | Cursor- oder Bassimpuls hervorheben |
| E018 | 00:02:14.211 | transient | Spektraler Anstieg, relative Stärke 2.68 | Cursor- oder Bassimpuls hervorheben |
| E019 | 00:02:19.500 | section_boundary | Beginn Drop 2; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E020 | 00:02:21.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.4 dB | Prompt-, Test- und Prototypansicht öffnen |
| E021 | 00:02:26.841 | transient | Spektraler Anstieg, relative Stärke 2.70 | Cursor- oder Bassimpuls hervorheben |
| E022 | 00:02:34.511 | transient | Spektraler Anstieg, relative Stärke 2.54 | Cursor- oder Bassimpuls hervorheben |
| E023 | 00:02:36.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.0 dB | Prompt-, Test- und Prototypansicht öffnen |
| E024 | 00:02:45.000 | section_boundary | Beginn Bridge; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E025 | 00:02:57.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.1 dB | Prompt-, Test- und Prototypansicht öffnen |
| E026 | 00:03:03.000 | section_boundary | Beginn Final Drop; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E027 | 00:03:05.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.1 dB | Prompt-, Test- und Prototypansicht öffnen |
| E028 | 00:03:06.091 | transient | Spektraler Anstieg, relative Stärke 2.71 | Cursor- oder Bassimpuls hervorheben |
| E029 | 00:03:18.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.2 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E030 | 00:03:19.171 | transient | Spektraler Anstieg, relative Stärke 2.54 | Cursor- oder Bassimpuls hervorheben |
| E031 | 00:03:26.391 | transient | Spektraler Anstieg, relative Stärke 2.73 | Cursor- oder Bassimpuls hervorheben |
| E032 | 00:03:34.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.8 dB | Prompt-, Test- und Prototypansicht öffnen |
| E033 | 00:03:36.321 | transient | Spektraler Anstieg, relative Stärke 2.29 | Cursor- oder Bassimpuls hervorheben |
| E034 | 00:03:46.241 | transient | Spektraler Anstieg, relative Stärke 3.04 | Cursor- oder Bassimpuls hervorheben |
| E035 | 00:03:47.000 | section_boundary | Beginn Outro; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E036 | 00:03:49.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.0 dB | Prompt-, Test- und Prototypansicht öffnen |
| E037 | 00:03:55.261 | transient | Spektraler Anstieg, relative Stärke 2.76 | Cursor- oder Bassimpuls hervorheben |
| E038 | 00:03:58.800 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E039 | 00:04:02.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -10.6 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E040 | 00:04:03.600 | level_gap | 100-ms-RMS -37.5 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E041 | 00:04:03.980 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E042 | 00:04:04.760 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1288 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 2 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:04:03.980; danach läuft das Originalaudio bis 00:04:04.760. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt die finale Release-Datei. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Dieser Analyselauf erzeugt keine Videos oder Drehbücher.
Audioformat: WAV; decodierte Dauer 244.760000000 s; Containerdauer 244.760000000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Zwei lokale Whisper-Läufe plus unabhängige kurze Fenster; redaktioneller Lyrics-Abgleich ohne manuelle Hörprüfung. Markierte Stellen vor finalen Untertiteln prüfen.
Quellbericht: `/Users/samuel.heinrich/0004_git/kisound/music/kisound/Vibecoder/01_Vibecoder/final/en/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L001 | 00:00:08.700–00:00:10.980 | I'm a vibe coder. | review_required |
| L002 | 00:00:32.300–00:00:34.260 | 8am the export froze | review_required |
| L004 | 00:00:39.480–00:00:41.500 | Prompt in. Script runs. Rows align. | review_required |
| L005 | 00:00:42.440–00:00:44.900 | Two, two, two checks green. Next idea's mine. | review_required |
| L006 | 00:00:45.860–00:00:49.260 | New coders. New pulse. | review_required |
| L007 | 00:00:49.260–00:00:52.720 | One line, one build, the room wakes up. | review_required |
| L010 | 00:00:59.500–00:01:01.420 | I am a vibe coder | review_required |
| L011 | 00:01:01.420–00:01:04.380 | I say it, he builds it, I test it, he makes it right. | review_required |
| L012 | 00:01:04.900–00:01:07.120 | I am a vibe coder | review_required |
| L013 | 00:01:08.320–00:01:11.620 | If it fails, send it back till it's running tight. | review_required |
| L014 | 00:01:11.620–00:01:14.320 | I am a vibe coder | review_required |
| L015 | 00:01:15.700–00:01:19.300 | I say it, he builds it, I test it, he makes it right. | review_required |
| L016 | 00:01:19.300–00:01:22.400 | A diff, a test, a commit, and the next idea takes flight. | review_required |
| L017 | 00:01:51.480–00:01:53.820 | No track at noon can match my pace. | review_required |
| L018 | 00:01:55.120–00:01:57.400 | I write a sound to fill the space. | review_required |
| L019 | 00:01:57.400–00:02:00.960 | My own beat drives me through the block, | review_required |
| L020 | 00:02:02.060–00:02:04.380 | low end rolling round the clock. | review_required |
| L021 | 00:02:05.340–00:02:08.920 | Night falls. Store full. Nothing fits. | review_required |
| L023 | 00:02:12.560–00:02:15.620 | A screen lights up. One button works. | review_required |
| L025 | 00:02:19.740–00:02:22.620 | I am a vibe coder | review_required |
| L026 | 00:02:22.620–00:02:26.080 | I see it, he builds it. I test it, he makes it right. | review_required |
| L027 | 00:02:26.080–00:02:29.840 | I'm a Vibecoder! I'm a Vibecoder! | review_required |
| L028 | 00:02:29.940–00:02:33.040 | If it fails, send it back till it’s running tight. | review_required |
| L029 | 00:02:33.520–00:02:37.160 | I, I, I'm a Vibecoder. I'm a Vibecoder. | review_required |
| L031 | 00:02:40.520–00:02:43.560 | A diff, a test, a commit, and the next idea takes flight. | review_required |
| L032 | 00:02:45.280–00:02:47.120 | You don't know what's beneath | review_required |
| L033 | 00:02:48.180–00:02:50.860 | Not all of it. I know what I need. | review_required |
| L036 | 00:03:03.860–00:03:06.040 | I'm a vibe coder | review_required |
| L038 | 00:03:18.400–00:03:20.360 | I'm a vibe coder | review_required |
| L039 | 00:03:20.360–00:03:23.440 | Bass rolls on. Bass rolls on. | review_required |
| L040 | 00:03:23.740–00:03:27.700 | Break it down. Let it go. | review_required |
| L041 | 00:03:27.700–00:03:32.180 | Let it roll. Let it roll. Let it roll. Let it roll. | review_required |
| L042 | 00:03:32.620–00:03:34.820 | I'm a vibe coder | review_required |
| L043 | 00:03:38.180–00:03:41.680 | Bass rolls on. Bass rolls on. | review_required |
| L044 | 00:03:47.800–00:03:53.060 | Prompt. Run. Check. Go. | review_required |
| L045 | 00:03:54.640–00:03:56.300 | Bass rolls on. | review_required |
| L046 | 00:04:01.660–00:04:03.980 | Prompt. Run. Check. Go. | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
