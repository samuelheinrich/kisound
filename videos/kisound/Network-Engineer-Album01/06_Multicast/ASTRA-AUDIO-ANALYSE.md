# 06 Multicast – Audioanalyse

**Wichtigste Erkenntnisse:** 260.600 s, geschätzte 132.6 BPM (mittel), -13.6 LUFS und -1.3 dBTP. Letzte transkribierte Stimme bei 00:03:29.700; Audioende bei 00:04:20.600.

## Datei und Pegel

- Quelle: `06_Multicast_0.1-1.wav`; SHA-256 `7d0f87a9f23017511848df85b035a20b14761e8da550f196064183032780794e`. Die Zuordnung stützt sich auf `RELEASE AUDIO`, Transkript-SHA und Dauer.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 12508808 Samples je Kanal; Dauer 260.600166667 s.
- Sample-Peak -1.393 dBFS bei 00:00:23.796; pro Kanal [-1.751, -1.393] dBFS. True Peak -1.3 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -14.538 dBFS; Crest 13.146 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.6 LUFS; LRA 2.5 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-0.0002764, 5.62e-05]; globale Stereo-Korrelation 0.95. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 133.3 BPM; phasenoptimierte Rasterbewertung: 132.6 BPM. Empfohlen: 132.6 BPM; Alternativen [66.3, 265.2, 134.6, 88.6]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.038 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 133.3 BPM, 00:00:30.000–00:01:00.000: 133.3 BPM, 00:01:00.000–00:01:30.000: 133.3 BPM, 00:01:30.000–00:02:00.000: 133.3 BPM, 00:02:00.000–00:02:30.000: 133.3 BPM, 00:02:30.000–00:03:00.000: 133.3 BPM, 00:03:00.000–00:03:30.000: 67.4 BPM, 00:03:30.000–00:04:00.000: 67.4 BPM, 00:04:00.000–00:04:20.600: 67.4 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 49.23 % |
| bass_60_250 | 60–250 Hz | 38.63 % |
| lowmid_250_500 | 250–500 Hz | 2.54 % |
| mid_500_2000 | 500–2000 Hz | 4.03 % |
| presence_2000_6000 | 2000–6000 Hz | 2.68 % |
| high_6000_12000 | 6000–12000 Hz | 2.31 % |
| air_12000_20000 | 12000–20000 Hz | 0.58 % |

Mittlerer spektraler Schwerpunkt 823.2 Hz, 85-%-Rolloff 1470.5 Hz. Auffällige Langzeit-Peaks: [46.9, 93.8, 140.6, 199.2] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:11.380 | Intro | -15.18 | -2.43 | 755.8 |
| 00:00:11.380–00:00:24.040 | Intro | -17.53 | -1.39 | 926.2 |
| 00:00:24.040–00:00:38.280 | Instrumental | -15.9 | -3.72 | 790.8 |
| 00:00:38.280–00:01:07.580 | Verse | -13.98 | -3.1 | 655.0 |
| 00:01:07.580–00:01:21.480 | Pre-Chorus | -13.72 | -3.81 | 804.6 |
| 00:01:21.480–00:01:36.380 | Chorus | -13.66 | -3.14 | 973.7 |
| 00:01:36.380–00:01:49.760 | Instrumental | -14.71 | -2.98 | 674.9 |
| 00:01:49.760–00:02:08.580 | Verse 2 | -14.26 | -3.31 | 845.0 |
| 00:02:08.580–00:02:14.940 | Hook | -19.25 | -3.24 | 2301.2 |
| 00:02:14.940–00:02:29.000 | Instrumental | -13.46 | -3.51 | 809.3 |
| 00:02:29.000–00:02:46.720 | Bridge | -15.17 | -3.73 | 744.5 |
| 00:02:46.720–00:02:48.180 | Chorus | -15.14 | -4.0 | 806.1 |
| 00:02:48.180–00:02:50.940 | Chorus | -14.34 | -3.82 | 1075.6 |
| 00:02:50.940–00:02:53.400 | Chorus | -14.28 | -3.54 | 1070.0 |
| 00:02:53.400–00:02:55.540 | Chorus | -14.44 | -3.83 | 863.4 |
| 00:02:55.540–00:03:00.040 | Chorus | -14.26 | -3.03 | 1029.0 |
| 00:03:00.040–00:03:02.320 | Chorus | -16.52 | -4.12 | 2379.7 |
| 00:03:02.320–00:03:17.180 | Instrumental | -13.77 | -2.75 | 659.2 |
| 00:03:17.180–00:03:29.700 | Outro | -14.22 | -3.09 | 754.9 |
| 00:03:29.700–00:04:20.600 | Instrumental | -14.55 | -1.84 | 708.3 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Original-WAV | Bildwelt öffnen |
| E002 | 00:00:00.200 | level_gap | 100-ms-RMS -96.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:01.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.5 dB | Unbestellte Zweige verdunkeln und Bühne verkleinern |
| E004 | 00:00:03.191 | transient | Spektraler Anstieg, relative Stärke 3.13 | Einen Zuhörersitz als Mitglied markieren |
| E005 | 00:00:11.351 | transient | Spektraler Anstieg, relative Stärke 2.48 | Einen Zuhörersitz als Mitglied markieren |
| E006 | 00:00:11.380 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:00:21.311 | transient | Spektraler Anstieg, relative Stärke 3.05 | Einen Zuhörersitz als Mitglied markieren |
| E008 | 00:00:23.400 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.3 dB | Unbestellte Zweige verdunkeln und Bühne verkleinern |
| E009 | 00:00:24.040 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E010 | 00:00:33.071 | transient | Spektraler Anstieg, relative Stärke 2.42 | Einen Zuhörersitz als Mitglied markieren |
| E011 | 00:00:38.280 | section_boundary | Beginn Verse; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E012 | 00:00:43.011 | transient | Spektraler Anstieg, relative Stärke 2.45 | Einen Zuhörersitz als Mitglied markieren |
| E013 | 00:00:57.451 | transient | Spektraler Anstieg, relative Stärke 2.24 | Einen Zuhörersitz als Mitglied markieren |
| E014 | 00:01:06.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB | Verteilbaum zu weiteren interessierten Sitzen öffnen |
| E015 | 00:01:07.580 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E016 | 00:01:21.100 | level_gap | 100-ms-RMS -37.9 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E017 | 00:01:21.480 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E018 | 00:01:21.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.2 dB | Verteilbaum zu weiteren interessierten Sitzen öffnen |
| E019 | 00:01:24.481 | transient | Spektraler Anstieg, relative Stärke 2.35 | Einen Zuhörersitz als Mitglied markieren |
| E020 | 00:01:31.681 | transient | Spektraler Anstieg, relative Stärke 2.24 | Einen Zuhörersitz als Mitglied markieren |
| E021 | 00:01:36.380 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E022 | 00:01:37.971 | transient | Spektraler Anstieg, relative Stärke 2.41 | Einen Zuhörersitz als Mitglied markieren |
| E023 | 00:01:47.851 | transient | Spektraler Anstieg, relative Stärke 2.47 | Einen Zuhörersitz als Mitglied markieren |
| E024 | 00:01:49.760 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E025 | 00:01:50.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.0 dB | Verteilbaum zu weiteren interessierten Sitzen öffnen |
| E026 | 00:02:04.001 | transient | Spektraler Anstieg, relative Stärke 2.24 | Einen Zuhörersitz als Mitglied markieren |
| E027 | 00:02:08.580 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E028 | 00:02:14.940 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E029 | 00:02:15.200 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.7 dB | Verteilbaum zu weiteren interessierten Sitzen öffnen |
| E030 | 00:02:15.651 | transient | Spektraler Anstieg, relative Stärke 2.34 | Einen Zuhörersitz als Mitglied markieren |
| E031 | 00:02:29.000 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E032 | 00:02:43.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.2 dB | Verteilbaum zu weiteren interessierten Sitzen öffnen |
| E033 | 00:02:46.720 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E034 | 00:02:48.180 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E035 | 00:02:50.940 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E036 | 00:02:53.400 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E037 | 00:02:55.540 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E038 | 00:03:00.040 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E039 | 00:03:01.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.7 dB | Verteilbaum zu weiteren interessierten Sitzen öffnen |
| E040 | 00:03:02.320 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E041 | 00:03:10.641 | transient | Spektraler Anstieg, relative Stärke 2.24 | Einen Zuhörersitz als Mitglied markieren |
| E042 | 00:03:17.180 | section_boundary | Beginn Outro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E043 | 00:03:17.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.5 dB | Unbestellte Zweige verdunkeln und Bühne verkleinern |
| E044 | 00:03:18.100 | level_gap | 100-ms-RMS -36.7 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E045 | 00:03:29.700 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E046 | 00:03:29.700 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E047 | 00:03:30.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.5 dB | Verteilbaum zu weiteren interessierten Sitzen öffnen |
| E048 | 00:03:49.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.4 dB | Verteilbaum zu weiteren interessierten Sitzen öffnen |
| E049 | 00:04:08.951 | transient | Spektraler Anstieg, relative Stärke 2.27 | Einen Zuhörersitz als Mitglied markieren |
| E050 | 00:04:14.700 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E051 | 00:04:19.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -14.5 dB | Unbestellte Zweige verdunkeln und Bühne verkleinern |
| E052 | 00:04:19.800 | level_gap | 100-ms-RMS -36.1 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E053 | 00:04:20.600 | end | Ende der Original-WAV | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1613 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 4 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:29.700; danach läuft das Originalaudio bis 00:04:20.600. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der Original-WAV. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 6 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.
