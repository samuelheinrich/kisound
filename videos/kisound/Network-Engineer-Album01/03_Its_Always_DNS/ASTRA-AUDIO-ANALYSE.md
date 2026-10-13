# 03 Its Always DNS – Audioanalyse

**Wichtigste Erkenntnisse:** 261.200 s, geschätzte 127.0 BPM (mittel), -13.6 LUFS und -2.6 dBTP. Letzte transkribierte Stimme bei 00:04:20.840; Audioende bei 00:04:21.200.

## Datei und Pegel

- Quelle: `03_Its_Always_DNS_0.3-2.wav`; SHA-256 `b68aaccb7fddb1eea9241f6bc8f2a91ba30ad532e72355a1ac4309338ec294c4`. Die Zuordnung stützt sich auf `RELEASE AUDIO`, Transkript-SHA und Dauer.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 12537608 Samples je Kanal; Dauer 261.200166667 s.
- Sample-Peak -2.614 dBFS bei 00:02:08.733; pro Kanal [-3.003, -2.614] dBFS. True Peak -2.6 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -14.317 dBFS; Crest 11.704 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.6 LUFS; LRA 3.7 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-0.0001492, 2.38e-05]; globale Stereo-Korrelation 0.8982. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 127.7 BPM; phasenoptimierte Rasterbewertung: 127.0 BPM. Empfohlen: 127.0 BPM; Alternativen [63.5, 254.0, 168.0, 84.8]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.079 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 127.7 BPM, 00:00:30.000–00:01:00.000: 127.7 BPM, 00:01:00.000–00:01:30.000: 127.7 BPM, 00:01:30.000–00:02:00.000: 127.7 BPM, 00:02:00.000–00:02:30.000: 127.7 BPM, 00:02:30.000–00:03:00.000: 125.0 BPM, 00:03:00.000–00:03:30.000: 125.0 BPM, 00:03:30.000–00:04:00.000: 125.0 BPM, 00:04:00.000–00:04:21.200: 125.0 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 48.46 % |
| bass_60_250 | 60–250 Hz | 41.79 % |
| lowmid_250_500 | 250–500 Hz | 4.72 % |
| mid_500_2000 | 500–2000 Hz | 2.25 % |
| presence_2000_6000 | 2000–6000 Hz | 1.48 % |
| high_6000_12000 | 6000–12000 Hz | 1.06 % |
| air_12000_20000 | 12000–20000 Hz | 0.23 % |

Mittlerer spektraler Schwerpunkt 626.1 Hz, 85-%-Rolloff 951.9 Hz. Auffällige Langzeit-Peaks: [46.9, 93.8, 140.6, 199.2] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:15.080 | Vorlauf | -18.45 | -4.29 | 783.0 |
| 00:00:15.080–00:00:30.580 | Verse | -17.32 | -4.12 | 737.1 |
| 00:00:30.580–00:00:38.680 | Pre-Chorus | -15.15 | -3.01 | 771.9 |
| 00:00:38.680–00:00:48.120 | Hook | -16.03 | -3.01 | 1212.6 |
| 00:00:48.120–00:00:59.580 | Chorus | -12.84 | -3.32 | 325.3 |
| 00:00:59.580–00:01:08.020 | Instrumental | -13.95 | -3.55 | 477.6 |
| 00:01:08.020–00:01:23.400 | Verse 2 | -12.6 | -3.52 | 386.1 |
| 00:01:23.400–00:01:31.260 | Bridge | -16.3 | -3.6 | 743.9 |
| 00:01:31.260–00:01:38.200 | Final Hook | -14.12 | -3.36 | 519.7 |
| 00:01:38.200–00:01:48.580 | Final Chorus | -16.06 | -3.02 | 773.4 |
| 00:01:48.580–00:02:00.420 | Final Chorus | -13.74 | -3.11 | 540.2 |
| 00:02:00.420–00:03:21.800 | Instrumental | -13.38 | -2.61 | 672.4 |
| 00:03:21.800–00:03:25.200 | Reprise – Hook | -15.58 | -4.35 | 802.7 |
| 00:03:25.200–00:03:26.140 | Hook | -15.03 | -4.74 | 658.1 |
| 00:03:26.140–00:03:27.160 | Hook | -14.69 | -4.01 | 565.9 |
| 00:03:27.160–00:03:27.820 | Instrumental | -13.7 | -4.36 | 290.1 |
| 00:03:27.820–00:03:28.940 | Hook | -14.14 | -4.93 | 674.4 |
| 00:03:28.940–00:03:29.500 | Instrumental | -14.05 | -4.69 | 685.0 |
| 00:03:29.500–00:03:30.640 | Instrumental | -14.93 | -4.66 | 868.7 |
| 00:03:30.640–00:03:31.320 | Instrumental | -14.68 | -4.6 | 237.2 |
| 00:03:31.320–00:03:34.840 | Hook | -15.2 | -3.86 | 1071.9 |
| 00:03:34.840–00:03:37.760 | Chorus | -13.97 | -3.23 | 391.3 |
| 00:03:37.760–00:03:39.660 | Reprise – Chorus | -14.46 | -3.66 | 495.9 |
| 00:03:39.660–00:03:42.440 | Reprise – Chorus | -13.69 | -3.97 | 301.3 |
| 00:03:42.440–00:03:45.660 | Chorus | -13.98 | -3.23 | 431.9 |
| 00:03:45.660–00:03:46.820 | Chorus | -15.55 | -4.01 | 372.7 |
| 00:03:46.820–00:03:49.000 | Instrumental | -17.24 | -4.28 | 571.0 |
| 00:03:49.000–00:03:55.300 | Instrumental | -13.84 | -4.09 | 396.7 |
| 00:03:55.300–00:03:59.260 | Verse 2 | -14.95 | -3.55 | 418.5 |
| 00:03:59.260–00:04:03.040 | Verse 2 | -15.4 | -4.24 | 424.4 |
| 00:04:03.040–00:04:07.140 | Verse 2 | -15.39 | -4.1 | 510.6 |
| 00:04:07.140–00:04:10.620 | Verse 2 | -16.52 | -4.14 | 507.2 |
| 00:04:10.620–00:04:11.380 | Bridge | -16.12 | -5.78 | 577.8 |
| 00:04:11.380–00:04:18.200 | Bridge | -15.25 | -4.24 | 558.2 |
| 00:04:18.200–00:04:19.240 | Hook | -14.4 | -4.5 | 270.9 |
| 00:04:19.240–00:04:20.360 | Hook | -14.97 | -4.54 | 630.0 |
| 00:04:20.360–00:04:20.840 | Hook | -14.71 | -5.88 | 569.0 |
| 00:04:20.840–00:04:21.200 | Instrumental | -16.3 | -5.96 | 383.9 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Original-WAV | Bildwelt öffnen |
| E002 | 00:00:00.100 | level_gap | 100-ms-RMS -96.4 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:15.080 | section_boundary | Beginn Verse; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E004 | 00:00:30.580 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:36.400 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.8 dB | Fallakte auf einen einzelnen Resolver konzentrieren |
| E006 | 00:00:38.680 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:00:40.241 | transient | Spektraler Anstieg, relative Stärke 2.71 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E008 | 00:00:46.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.9 dB | Abfragekette und Suchlicht räumlich öffnen |
| E009 | 00:00:48.120 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E010 | 00:00:48.271 | transient | Spektraler Anstieg, relative Stärke 2.65 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E011 | 00:00:57.251 | transient | Spektraler Anstieg, relative Stärke 2.51 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E012 | 00:00:59.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.6 dB | Fallakte auf einen einzelnen Resolver konzentrieren |
| E013 | 00:00:59.580 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E014 | 00:01:06.221 | transient | Spektraler Anstieg, relative Stärke 2.56 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E015 | 00:01:08.020 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E016 | 00:01:17.081 | transient | Spektraler Anstieg, relative Stärke 2.56 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E017 | 00:01:23.100 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -10.6 dB | Fallakte auf einen einzelnen Resolver konzentrieren |
| E018 | 00:01:23.400 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:01:24.400 | level_gap | 100-ms-RMS -54.8 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E020 | 00:01:26.400 | level_gap | 100-ms-RMS -57.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E021 | 00:01:31.260 | section_boundary | Beginn Final Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E022 | 00:01:34.071 | transient | Spektraler Anstieg, relative Stärke 2.46 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E023 | 00:01:38.200 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E024 | 00:01:47.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.9 dB | Abfragekette und Suchlicht räumlich öffnen |
| E025 | 00:01:48.580 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E026 | 00:02:00.420 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E027 | 00:02:01.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +37.7 dB | Abfragekette und Suchlicht räumlich öffnen |
| E028 | 00:02:04.241 | transient | Spektraler Anstieg, relative Stärke 2.85 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E029 | 00:02:09.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -56.8 dB | Fallakte auf einen einzelnen Resolver konzentrieren |
| E030 | 00:02:12.800 | level_gap | 100-ms-RMS -38.3 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E031 | 00:02:13.661 | transient | Spektraler Anstieg, relative Stärke 2.58 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E032 | 00:02:21.251 | transient | Spektraler Anstieg, relative Stärke 3.08 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E033 | 00:02:27.891 | transient | Spektraler Anstieg, relative Stärke 2.49 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E034 | 00:02:31.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.0 dB | Abfragekette und Suchlicht räumlich öffnen |
| E035 | 00:02:35.481 | transient | Spektraler Anstieg, relative Stärke 2.73 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E036 | 00:02:44.491 | transient | Spektraler Anstieg, relative Stärke 2.57 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E037 | 00:02:50.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -8.4 dB | Fallakte auf einen einzelnen Resolver konzentrieren |
| E038 | 00:02:52.700 | level_gap | 100-ms-RMS -40.8 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E039 | 00:02:54.800 | level_gap | 100-ms-RMS -40.8 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E040 | 00:03:00.211 | transient | Spektraler Anstieg, relative Stärke 2.77 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E041 | 00:03:21.800 | section_boundary | Beginn Reprise – Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E042 | 00:03:25.200 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E043 | 00:03:26.140 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E044 | 00:03:27.160 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E045 | 00:03:27.820 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E046 | 00:03:28.940 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E047 | 00:03:29.500 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E048 | 00:03:30.100 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.9 dB | Fallakte auf einen einzelnen Resolver konzentrieren |
| E049 | 00:03:30.640 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E050 | 00:03:31.320 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E051 | 00:03:31.500 | level_gap | 100-ms-RMS -50.3 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E052 | 00:03:34.840 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E053 | 00:03:37.760 | section_boundary | Beginn Reprise – Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E054 | 00:03:39.660 | section_boundary | Beginn Reprise – Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E055 | 00:03:42.440 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E056 | 00:03:45.660 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E057 | 00:03:46.820 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E058 | 00:03:47.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +13.9 dB | Abfragekette und Suchlicht räumlich öffnen |
| E059 | 00:03:49.000 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E060 | 00:03:53.521 | transient | Spektraler Anstieg, relative Stärke 2.46 | Einen DNS-Antwortumschlag auf die Fallakte schlagen |
| E061 | 00:03:55.300 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E062 | 00:03:59.260 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E063 | 00:04:03.040 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E064 | 00:04:07.140 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E065 | 00:04:08.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.1 dB | Fallakte auf einen einzelnen Resolver konzentrieren |
| E066 | 00:04:10.300 | level_gap | 100-ms-RMS -35.7 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E067 | 00:04:10.620 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E068 | 00:04:11.380 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E069 | 00:04:18.200 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E070 | 00:04:19.240 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E071 | 00:04:20.360 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E072 | 00:04:20.840 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E073 | 00:04:20.840 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E074 | 00:04:21.200 | end | Ende der Original-WAV | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1195 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 8 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:04:20.840; danach läuft das Originalaudio bis 00:04:21.200. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der Original-WAV. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 28 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.
