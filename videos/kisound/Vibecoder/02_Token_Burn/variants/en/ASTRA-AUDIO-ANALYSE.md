# TOKEN BURN · EN – Audioanalyse

**Wichtigste Erkenntnisse:** 250.800 s, geschätzte 136.4 BPM (mittel), -14.6 LUFS und -3.4 dBTP. Letzte transkribierte Stimme bei 00:03:54.340; Audioende bei 00:04:10.800.

## Datei und Pegel

- Quelle: `Token Burn - EN.wav`; SHA-256 `c1cec711e9be337b18ea64cbf9e16a027207e095e1843ef6a516b404680ba73d`. Finale Release-Datei laut STATUS: Final und RELEASE AUDIO im 1.0-Prompt; Transkript-SHA und decodierte Dauer geprüft.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 12038400 Samples je Kanal; Dauer 250.800000000 s.
- Sample-Peak -3.364 dBFS bei 00:02:51.268; pro Kanal [-3.373, -3.364] dBFS. True Peak -3.4 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -15.95 dBFS; Crest 12.586 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -14.6 LUFS; LRA 5.0 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-0.0002051, -4.37e-05]; globale Stereo-Korrelation 0.9435. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 136.4 BPM; phasenoptimierte Rasterbewertung: 136.4 BPM. Empfohlen: 136.4 BPM; Alternativen [68.2, 272.8, 90.8, 109.4]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.22 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 136.4 BPM, 00:00:30.000–00:01:00.000: 136.4 BPM, 00:01:00.000–00:01:30.000: 136.4 BPM, 00:01:30.000–00:02:00.000: 136.4 BPM, 00:02:00.000–00:02:30.000: 136.4 BPM, 00:02:30.000–00:03:00.000: 136.4 BPM, 00:03:00.000–00:03:30.000: 136.4 BPM, 00:03:30.000–00:04:00.000: 69.0 BPM, 00:04:00.000–00:04:10.800: 139.5 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 30.85 % |
| bass_60_250 | 60–250 Hz | 42.87 % |
| lowmid_250_500 | 250–500 Hz | 9.45 % |
| mid_500_2000 | 500–2000 Hz | 13.01 % |
| presence_2000_6000 | 2000–6000 Hz | 1.88 % |
| high_6000_12000 | 6000–12000 Hz | 1.53 % |
| air_12000_20000 | 12000–20000 Hz | 0.40 % |

Mittlerer spektraler Schwerpunkt 689.4 Hz, 85-%-Rolloff 1078.0 Hz. Auffällige Langzeit-Peaks: [46.9, 152.3, 351.6, 257.8, 527.3, 703.1, 433.6, 785.2, 609.4, 304.7, 867.2] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:12.680 | Vorlauf | -22.12 | -6.5 | 661.6 |
| 00:00:12.680–00:00:17.760 | Intro | -24.75 | -5.79 | 1379.0 |
| 00:00:17.760–00:00:45.240 | Instrumental | -17.62 | -6.34 | 416.5 |
| 00:00:45.240–00:01:14.500 | Verse 1 | -16.32 | -5.5 | 562.2 |
| 00:01:14.500–00:01:21.320 | Instrumental | -15.69 | -6.46 | 453.5 |
| 00:01:21.320–00:01:36.480 | Pre-Chorus | -19.29 | -5.13 | 962.7 |
| 00:01:36.480–00:01:57.000 | Chorus 1 | -16.36 | -5.4 | 709.8 |
| 00:01:57.000–00:02:03.320 | Instrumental | -17.57 | -5.22 | 762.0 |
| 00:02:03.320–00:02:33.000 | Verse 2 | -15.71 | -3.87 | 864.6 |
| 00:02:33.000–00:02:53.080 | Chorus 2 | -14.74 | -3.36 | 854.0 |
| 00:02:53.080–00:03:02.300 | Instrumental | -16.3 | -3.77 | 467.0 |
| 00:03:02.300–00:03:18.560 | Bridge | -14.89 | -3.37 | 838.4 |
| 00:03:18.560–00:03:38.420 | Chorus 3 | -14.15 | -3.85 | 699.3 |
| 00:03:38.420–00:03:45.640 | Instrumental | -15.1 | -4.07 | 474.4 |
| 00:03:45.640–00:03:54.340 | Outro | -13.77 | -3.7 | 798.5 |
| 00:03:54.340–00:04:10.800 | Instrumental | -14.35 | -4.22 | 479.1 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:00.100 | level_gap | 100-ms-RMS -90.5 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:01.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.9 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E004 | 00:00:12.680 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:14.500 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -9.5 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E006 | 00:00:17.760 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:00:38.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.1 dB | Prompt-, Build- und Exportansicht öffnen |
| E008 | 00:00:45.240 | section_boundary | Beginn Verse 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E009 | 00:01:13.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.6 dB | Prompt-, Build- und Exportansicht öffnen |
| E010 | 00:01:14.500 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E011 | 00:01:21.320 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E012 | 00:01:36.480 | section_boundary | Beginn Chorus 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E013 | 00:01:36.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.9 dB | Prompt-, Build- und Exportansicht öffnen |
| E014 | 00:01:41.381 | transient | Spektraler Anstieg, relative Stärke 2.08 | Token- oder Cursorimpuls hervorheben |
| E015 | 00:01:56.351 | transient | Spektraler Anstieg, relative Stärke 2.36 | Token- oder Cursorimpuls hervorheben |
| E016 | 00:01:57.000 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E017 | 00:01:58.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.8 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E018 | 00:02:03.320 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:02:09.551 | transient | Spektraler Anstieg, relative Stärke 2.67 | Token- oder Cursorimpuls hervorheben |
| E020 | 00:02:15.711 | transient | Spektraler Anstieg, relative Stärke 2.12 | Token- oder Cursorimpuls hervorheben |
| E021 | 00:02:22.741 | transient | Spektraler Anstieg, relative Stärke 2.44 | Token- oder Cursorimpuls hervorheben |
| E022 | 00:02:31.521 | transient | Spektraler Anstieg, relative Stärke 2.44 | Token- oder Cursorimpuls hervorheben |
| E023 | 00:02:33.000 | section_boundary | Beginn Chorus 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E024 | 00:02:33.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.0 dB | Prompt-, Build- und Exportansicht öffnen |
| E025 | 00:02:39.421 | transient | Spektraler Anstieg, relative Stärke 2.68 | Token- oder Cursorimpuls hervorheben |
| E026 | 00:02:47.100 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.4 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E027 | 00:02:52.141 | transient | Spektraler Anstieg, relative Stärke 2.50 | Token- oder Cursorimpuls hervorheben |
| E028 | 00:02:53.080 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E029 | 00:03:01.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.0 dB | Prompt-, Build- und Exportansicht öffnen |
| E030 | 00:03:02.221 | transient | Spektraler Anstieg, relative Stärke 2.56 | Token- oder Cursorimpuls hervorheben |
| E031 | 00:03:02.300 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E032 | 00:03:12.100 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.5 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E033 | 00:03:14.031 | transient | Spektraler Anstieg, relative Stärke 2.77 | Token- oder Cursorimpuls hervorheben |
| E034 | 00:03:18.560 | section_boundary | Beginn Chorus 3; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E035 | 00:03:20.581 | transient | Spektraler Anstieg, relative Stärke 2.13 | Token- oder Cursorimpuls hervorheben |
| E036 | 00:03:31.931 | transient | Spektraler Anstieg, relative Stärke 2.40 | Token- oder Cursorimpuls hervorheben |
| E037 | 00:03:38.420 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E038 | 00:03:45.640 | section_boundary | Beginn Outro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E039 | 00:03:46.200 | level_gap | 100-ms-RMS -38.7 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E040 | 00:03:46.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.5 dB | Prompt-, Build- und Exportansicht öffnen |
| E041 | 00:03:48.931 | transient | Spektraler Anstieg, relative Stärke 2.16 | Token- oder Cursorimpuls hervorheben |
| E042 | 00:03:54.340 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E043 | 00:03:54.340 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E044 | 00:03:56.331 | transient | Spektraler Anstieg, relative Stärke 2.38 | Token- oder Cursorimpuls hervorheben |
| E045 | 00:04:04.800 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E046 | 00:04:09.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -19.6 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E047 | 00:04:10.800 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1868 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 2 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:54.340; danach läuft das Originalaudio bis 00:04:10.800. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt die finale Release-Datei. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Dieser Analyselauf erzeugt keine Videos oder Drehbücher.
Audioformat: WAV; decodierte Dauer 250.800000000 s; Containerdauer 250.800000000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatische ASR mit Lyrics-Abgleich; keine manuelle Hörprüfung; markierte Stellen vor Video-Endabnahme prüfen
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Vibecoder/02_Token_Burn/final/en/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L007 | 00:01:00.200–00:01:02.820 | I reload once; the bass goes mute, | review_required |
| L013 | 00:01:30.160–00:01:31.320 | The text gets long | review_required |
| L019 | 00:01:50.820–00:01:54.220 | One tab shuts, two more appear, | review_required |
| L021 | 00:02:03.320–00:02:08.340 | It's three o'clock, the room stays small, | review_required |
| L028 | 00:02:29.620–00:02:32.740 | now there's one more thing to achieve. | review_required |
| L029 | 00:02:33.000–00:02:33.720 | Token Burn. | review_required |
| L033 | 00:02:46.900–00:02:49.680 | One death shots two more appear | review_required |
| L036 | 00:03:05.660–00:03:08.020 | another answer, minutes pass. | review_required |
| L039 | 00:03:18.560–00:03:19.240 | Talking burn | review_required |
| L041 | 00:03:25.580–00:03:26.400 | Talking burn | review_required |
| L042 | 00:03:28.680–00:03:31.580 | One more thing I need to know. | review_required |
| L043 | 00:03:32.420–00:03:35.800 | One tab shuts, two more appear, | review_required |
| L044 | 00:03:36.040–00:03:38.420 | I said I'd leave. I'm still right here. | review_required |
| L046 | 00:03:52.580–00:03:54.340 | I'm pressing send I'm not quite done | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
