# 04 Destination Unreachable – Audioanalyse

**Wichtigste Erkenntnisse:** 259.801 s, geschätzte 132.0 BPM (mittel), -13.5 LUFS und -1.7 dBTP. Letzte transkribierte Stimme bei 00:04:15.940; Audioende bei 00:04:19.801.

## Datei und Pegel

- Quelle: `04_Destination_Unreachable_0.3-1.wav`; SHA-256 `883d8e9f06995b5c82548cfb54a74ecf08ae89f825a1f92ab8613dd1807ef9c3`. Die Zuordnung stützt sich auf `RELEASE AUDIO`, Transkript-SHA und Dauer.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 12470447 Samples je Kanal; Dauer 259.800979167 s.
- Sample-Peak -1.752 dBFS bei 00:04:06.702; pro Kanal [-2.427, -1.752] dBFS. True Peak -1.7 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -14.336 dBFS; Crest 12.584 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.5 LUFS; LRA 3.6 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-2.94e-05, 0.0002112]; globale Stereo-Korrelation 0.8912. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 65.9 BPM; phasenoptimierte Rasterbewertung: 132.0 BPM. Empfohlen: 132.0 BPM; Alternativen [66.0, 264.0, 88.0, 105.6]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.0 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 133.3 BPM, 00:00:30.000–00:01:00.000: 133.3 BPM, 00:01:00.000–00:01:30.000: 65.9 BPM, 00:01:30.000–00:02:00.000: 65.9 BPM, 00:02:00.000–00:02:30.000: 65.9 BPM, 00:02:30.000–00:03:00.000: 65.9 BPM, 00:03:00.000–00:03:30.000: 65.9 BPM, 00:03:30.000–00:04:00.000: 65.9 BPM, 00:04:00.000–00:04:19.801: 65.9 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 45.95 % |
| bass_60_250 | 60–250 Hz | 43.25 % |
| lowmid_250_500 | 250–500 Hz | 2.58 % |
| mid_500_2000 | 500–2000 Hz | 3.86 % |
| presence_2000_6000 | 2000–6000 Hz | 2.70 % |
| high_6000_12000 | 6000–12000 Hz | 1.28 % |
| air_12000_20000 | 12000–20000 Hz | 0.39 % |

Mittlerer spektraler Schwerpunkt 613.2 Hz, 85-%-Rolloff 1028.5 Hz. Auffällige Langzeit-Peaks: [46.9, 93.8, 140.6, 199.2] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:03.660 | Pulse | -14.83 | -4.5 | 396.6 |
| 00:00:03.660–00:00:30.740 | Pulse | -15.59 | -3.01 | 442.5 |
| 00:00:30.740–00:00:45.360 | Spoken | -18.91 | -2.81 | 929.1 |
| 00:00:45.360–00:01:09.360 | Hook | -14.82 | -3.27 | 494.6 |
| 00:01:09.360–00:01:21.720 | Instrumental | -13.92 | -3.8 | 743.7 |
| 00:01:21.720–00:01:50.180 | Verse 2 | -14.89 | -2.98 | 1135.6 |
| 00:01:50.180–00:02:02.820 | Break | -17.11 | -3.58 | 591.3 |
| 00:02:02.820–00:02:12.340 | Instrumental | -15.47 | -4.1 | 446.5 |
| 00:02:12.340–00:02:36.620 | Final Hook | -13.47 | -3.87 | 355.0 |
| 00:02:36.620–00:02:43.800 | Instrumental | -13.7 | -3.76 | 818.2 |
| 00:02:43.800–00:04:15.940 | Finale | -13.25 | -1.75 | 440.5 |
| 00:04:15.940–00:04:19.801 | Instrumental | -22.45 | -4.7 | 3483.7 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Original-WAV | Bildwelt öffnen |
| E002 | 00:00:00.200 | level_gap | 100-ms-RMS -240.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:00.901 | transient | Spektraler Anstieg, relative Stärke 2.27 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E004 | 00:00:01.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -18.8 dB | Kamerafahrt an einer unvollständigen Antwort anhalten |
| E005 | 00:00:03.660 | section_boundary | Beginn Pulse; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E006 | 00:00:07.261 | transient | Spektraler Anstieg, relative Stärke 2.40 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E007 | 00:00:30.740 | section_boundary | Beginn Spoken; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E008 | 00:00:32.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.9 dB | Kamerafahrt an einer unvollständigen Antwort anhalten |
| E009 | 00:00:45.360 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E010 | 00:00:51.351 | transient | Spektraler Anstieg, relative Stärke 2.31 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E011 | 00:00:58.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB | Weitere Pfadmarken in der Landschaft sichtbar machen |
| E012 | 00:01:09.360 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E013 | 00:01:20.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.1 dB | Kamerafahrt an einer unvollständigen Antwort anhalten |
| E014 | 00:01:21.720 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E015 | 00:01:24.081 | transient | Spektraler Anstieg, relative Stärke 2.38 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E016 | 00:01:48.500 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.7 dB | Kamerafahrt an einer unvollständigen Antwort anhalten |
| E017 | 00:01:50.180 | section_boundary | Beginn Break; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E018 | 00:02:02.820 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:02:03.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.4 dB | Weitere Pfadmarken in der Landschaft sichtbar machen |
| E020 | 00:02:11.351 | transient | Spektraler Anstieg, relative Stärke 2.53 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E021 | 00:02:12.340 | section_boundary | Beginn Final Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E022 | 00:02:18.621 | transient | Spektraler Anstieg, relative Stärke 2.22 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E023 | 00:02:34.100 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.0 dB | Kamerafahrt an einer unvollständigen Antwort anhalten |
| E024 | 00:02:36.620 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E025 | 00:02:43.800 | section_boundary | Beginn Finale; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E026 | 00:02:47.261 | transient | Spektraler Anstieg, relative Stärke 2.25 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E027 | 00:02:54.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.0 dB | Weitere Pfadmarken in der Landschaft sichtbar machen |
| E028 | 00:02:58.171 | transient | Spektraler Anstieg, relative Stärke 2.36 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E029 | 00:03:07.721 | transient | Spektraler Anstieg, relative Stärke 2.20 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E030 | 00:03:16.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.8 dB | Weitere Pfadmarken in der Landschaft sichtbar machen |
| E031 | 00:03:29.081 | transient | Spektraler Anstieg, relative Stärke 2.39 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E032 | 00:03:40.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.6 dB | Weitere Pfadmarken in der Landschaft sichtbar machen |
| E033 | 00:03:49.301 | transient | Spektraler Anstieg, relative Stärke 2.54 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E034 | 00:03:49.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.6 dB | Weitere Pfadmarken in der Landschaft sichtbar machen |
| E035 | 00:03:55.901 | transient | Spektraler Anstieg, relative Stärke 2.49 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E036 | 00:04:04.081 | transient | Spektraler Anstieg, relative Stärke 2.64 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E037 | 00:04:11.351 | transient | Spektraler Anstieg, relative Stärke 2.41 | Einen neuen Hop-Stempel auf die Nebelkarte setzen |
| E038 | 00:04:13.900 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E039 | 00:04:15.940 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E040 | 00:04:15.940 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E041 | 00:04:18.400 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -71.1 dB | Kamerafahrt an einer unvollständigen Antwort anhalten |
| E042 | 00:04:19.801 | end | Ende der Original-WAV | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1247 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 1 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:04:15.940; danach läuft das Originalaudio bis 00:04:19.801. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der Original-WAV. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.
