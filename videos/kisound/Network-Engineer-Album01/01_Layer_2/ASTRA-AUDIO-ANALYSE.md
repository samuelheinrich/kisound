# 01 Layer 2 – Audioanalyse

**Wichtigste Erkenntnisse:** 209.960 s, geschätzte 128.0 BPM (mittel), -13.4 LUFS und -2.2 dBTP. Letzte transkribierte Stimme bei 00:02:51.760; Audioende bei 00:03:29.960.

## Datei und Pegel

- Quelle: `01_Layer_2_0.3-1.wav`; SHA-256 `15b1566f6863945032ca9ca508b26d71b86d594a8d81d9f5ffd2753a28800e8c`. Die Zuordnung stützt sich auf `RELEASE AUDIO`, Transkript-SHA und Dauer.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 10078088 Samples je Kanal; Dauer 209.960166667 s.
- Sample-Peak -2.273 dBFS bei 00:00:39.007; pro Kanal [-2.713, -2.273] dBFS. True Peak -2.2 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -14.186 dBFS; Crest 11.913 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.4 LUFS; LRA 4.6 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-4.98e-05, -6.97e-05]; globale Stereo-Korrelation 0.9513. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 127.7 BPM; phasenoptimierte Rasterbewertung: 128.0 BPM. Empfohlen: 128.0 BPM; Alternativen [64.0, 256.0, 102.4, 85.4]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.312 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 127.7 BPM, 00:00:30.000–00:01:00.000: 127.7 BPM, 00:01:00.000–00:01:30.000: 127.7 BPM, 00:01:30.000–00:02:00.000: 127.7 BPM, 00:02:00.000–00:02:30.000: 127.7 BPM, 00:02:30.000–00:03:00.000: 127.7 BPM, 00:03:00.000–00:03:29.960: 127.7 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 47.32 % |
| bass_60_250 | 60–250 Hz | 42.24 % |
| lowmid_250_500 | 250–500 Hz | 2.80 % |
| mid_500_2000 | 500–2000 Hz | 3.89 % |
| presence_2000_6000 | 2000–6000 Hz | 2.29 % |
| high_6000_12000 | 6000–12000 Hz | 1.17 % |
| air_12000_20000 | 12000–20000 Hz | 0.29 % |

Mittlerer spektraler Schwerpunkt 584.1 Hz, 85-%-Rolloff 922.1 Hz. Auffällige Langzeit-Peaks: [46.9, 128.9, 175.8, 222.7] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:19.500 | Intro | -20.85 | -3.4 | 992.5 |
| 00:00:19.500–00:00:38.940 | Instrumental | -15.55 | -2.71 | 828.5 |
| 00:00:38.940–00:00:46.620 | Verse | -14.0 | -2.27 | 581.6 |
| 00:00:46.620–00:00:53.800 | Pre-Chorus | -14.72 | -3.69 | 612.8 |
| 00:00:53.800–00:01:01.300 | Chorus | -13.69 | -3.69 | 932.4 |
| 00:01:01.300–00:01:10.500 | Bridge | -14.04 | -3.07 | 847.0 |
| 00:01:10.500–00:01:59.420 | Instrumental | -13.21 | -3.07 | 454.5 |
| 00:01:59.420–00:02:05.080 | Intro – Reprise | -13.57 | -3.89 | 403.0 |
| 00:02:05.080–00:02:13.620 | Instrumental | -13.86 | -3.83 | 382.1 |
| 00:02:13.620–00:02:22.500 | Intro | -14.33 | -4.25 | 388.9 |
| 00:02:22.500–00:02:30.160 | Verse | -14.82 | -4.61 | 489.2 |
| 00:02:30.160–00:02:37.020 | Pre-Chorus | -15.97 | -4.46 | 710.0 |
| 00:02:37.020–00:02:45.920 | Chorus | -14.75 | -4.33 | 652.6 |
| 00:02:45.920–00:02:51.760 | Bridge | -14.67 | -4.72 | 508.4 |
| 00:02:51.760–00:03:29.960 | Instrumental | -13.04 | -2.73 | 389.9 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Original-WAV | Bildwelt öffnen |
| E002 | 00:00:02.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +10.6 dB | Mehr Portfassaden und VLAN-Wege sichtbar machen |
| E003 | 00:00:12.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.0 dB | Mehr Portfassaden und VLAN-Wege sichtbar machen |
| E004 | 00:00:18.711 | transient | Spektraler Anstieg, relative Stärke 2.19 | Einen Frame an einem Porttor einrasten lassen |
| E005 | 00:00:19.500 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E006 | 00:00:21.100 | level_gap | 100-ms-RMS -37.7 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E007 | 00:00:21.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.1 dB | Mehr Portfassaden und VLAN-Wege sichtbar machen |
| E008 | 00:00:30.211 | transient | Spektraler Anstieg, relative Stärke 2.81 | Einen Frame an einem Porttor einrasten lassen |
| E009 | 00:00:31.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.8 dB | Frame-Verkehr reduzieren und MAC-Matrix hervorheben |
| E010 | 00:00:38.940 | section_boundary | Beginn Verse; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E011 | 00:00:39.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.7 dB | Mehr Portfassaden und VLAN-Wege sichtbar machen |
| E012 | 00:00:46.620 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E013 | 00:00:53.800 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E014 | 00:00:54.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.4 dB | Mehr Portfassaden und VLAN-Wege sichtbar machen |
| E015 | 00:00:56.461 | transient | Spektraler Anstieg, relative Stärke 2.39 | Einen Frame an einem Porttor einrasten lassen |
| E016 | 00:01:01.300 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E017 | 00:01:03.021 | transient | Spektraler Anstieg, relative Stärke 2.38 | Einen Frame an einem Porttor einrasten lassen |
| E018 | 00:01:10.500 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:01:11.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +8.7 dB | Mehr Portfassaden und VLAN-Wege sichtbar machen |
| E020 | 00:01:11.300 | level_gap | 100-ms-RMS -46.3 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E021 | 00:01:11.461 | transient | Spektraler Anstieg, relative Stärke 2.36 | Einen Frame an einem Porttor einrasten lassen |
| E022 | 00:01:24.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.0 dB | Mehr Portfassaden und VLAN-Wege sichtbar machen |
| E023 | 00:01:29.831 | transient | Spektraler Anstieg, relative Stärke 2.24 | Einen Frame an einem Porttor einrasten lassen |
| E024 | 00:01:46.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -14.6 dB | Frame-Verkehr reduzieren und MAC-Matrix hervorheben |
| E025 | 00:01:47.900 | level_gap | 100-ms-RMS -37.8 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E026 | 00:01:48.591 | transient | Spektraler Anstieg, relative Stärke 2.50 | Einen Frame an einem Porttor einrasten lassen |
| E027 | 00:01:58.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.5 dB | Frame-Verkehr reduzieren und MAC-Matrix hervorheben |
| E028 | 00:01:59.420 | section_boundary | Beginn Intro – Reprise; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E029 | 00:02:00.311 | transient | Spektraler Anstieg, relative Stärke 2.50 | Einen Frame an einem Porttor einrasten lassen |
| E030 | 00:02:05.080 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E031 | 00:02:13.620 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E032 | 00:02:15.781 | transient | Spektraler Anstieg, relative Stärke 2.29 | Einen Frame an einem Porttor einrasten lassen |
| E033 | 00:02:22.500 | section_boundary | Beginn Verse; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E034 | 00:02:26.561 | transient | Spektraler Anstieg, relative Stärke 2.25 | Einen Frame an einem Porttor einrasten lassen |
| E035 | 00:02:30.160 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E036 | 00:02:34.531 | transient | Spektraler Anstieg, relative Stärke 2.21 | Einen Frame an einem Porttor einrasten lassen |
| E037 | 00:02:37.020 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E038 | 00:02:37.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.0 dB | Mehr Portfassaden und VLAN-Wege sichtbar machen |
| E039 | 00:02:45.920 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E040 | 00:02:51.760 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E041 | 00:02:51.760 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E042 | 00:02:52.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.6 dB | Mehr Portfassaden und VLAN-Wege sichtbar machen |
| E043 | 00:02:54.691 | transient | Spektraler Anstieg, relative Stärke 2.22 | Einen Frame an einem Porttor einrasten lassen |
| E044 | 00:03:22.341 | transient | Spektraler Anstieg, relative Stärke 2.23 | Einen Frame an einem Porttor einrasten lassen |
| E045 | 00:03:29.371 | transient | Spektraler Anstieg, relative Stärke 2.23 | Einen Frame an einem Porttor einrasten lassen |
| E046 | 00:03:29.960 | end | Ende der Original-WAV | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

949 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 3 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:02:51.760; danach läuft das Originalaudio bis 00:03:29.960. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der Original-WAV. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 1 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.
