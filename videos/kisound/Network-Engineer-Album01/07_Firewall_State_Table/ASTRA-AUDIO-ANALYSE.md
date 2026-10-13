# 07 Firewall State Table – Audioanalyse

**Wichtigste Erkenntnisse:** 259.321 s, geschätzte 142.0 BPM (mittel), -13.2 LUFS und -1.8 dBTP. Letzte transkribierte Stimme bei 00:03:15.000; Audioende bei 00:04:19.321.

## Datei und Pegel

- Quelle: `07_Firewall_State_Table_0.4-2.wav`; SHA-256 `6fcc83f53b3146a4754354b9dfd7c8644de53bf57c992aadb76a9fc9a62f754d`. Die Zuordnung stützt sich auf `RELEASE AUDIO`, Transkript-SHA und Dauer.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 12447407 Samples je Kanal; Dauer 259.320979167 s.
- Sample-Peak -1.779 dBFS bei 00:00:02.390; pro Kanal [-1.906, -1.779] dBFS. True Peak -1.8 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -13.781 dBFS; Crest 12.001 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.2 LUFS; LRA 4.1 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-0.0002041, -2.9e-05]; globale Stereo-Korrelation 0.9535. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 142.9 BPM; phasenoptimierte Rasterbewertung: 142.0 BPM. Empfohlen: 142.0 BPM; Alternativen [71.0, 284.0, 142.0, 113.6]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.352 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 142.9 BPM, 00:00:30.000–00:01:00.000: 142.9 BPM, 00:01:00.000–00:01:30.000: 142.9 BPM, 00:01:30.000–00:02:00.000: 142.9 BPM, 00:02:00.000–00:02:30.000: 142.9 BPM, 00:02:30.000–00:03:00.000: 142.9 BPM, 00:03:00.000–00:03:30.000: 142.9 BPM, 00:03:30.000–00:04:00.000: 142.9 BPM, 00:04:00.000–00:04:19.321: 142.9 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 53.36 % |
| bass_60_250 | 60–250 Hz | 34.77 % |
| lowmid_250_500 | 250–500 Hz | 3.10 % |
| mid_500_2000 | 500–2000 Hz | 4.34 % |
| presence_2000_6000 | 2000–6000 Hz | 2.65 % |
| high_6000_12000 | 6000–12000 Hz | 1.52 % |
| air_12000_20000 | 12000–20000 Hz | 0.26 % |

Mittlerer spektraler Schwerpunkt 626.4 Hz, 85-%-Rolloff 992.9 Hz. Auffällige Langzeit-Peaks: [46.9, 128.9, 175.8] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:09.940 | Intro | -20.07 | -1.78 | 1457.1 |
| 00:00:09.940–00:00:24.000 | Intro | -20.09 | -2.87 | 1001.3 |
| 00:00:24.000–00:00:50.600 | Instrumental | -13.88 | -3.14 | 456.9 |
| 00:00:50.600–00:01:10.740 | Verse | -12.91 | -3.85 | 633.2 |
| 00:01:10.740–00:01:18.640 | Pre-Hook | -13.13 | -3.72 | 628.0 |
| 00:01:18.640–00:01:36.460 | Hook | -14.27 | -3.36 | 705.9 |
| 00:01:36.460–00:01:51.240 | Chorus | -14.31 | -2.71 | 758.0 |
| 00:01:51.240–00:02:03.500 | Chorus | -13.38 | -3.33 | 751.0 |
| 00:02:03.500–00:02:10.440 | Instrumental | -13.45 | -3.76 | 576.5 |
| 00:02:10.440–00:02:26.920 | Verse 2 | -13.54 | -3.23 | 605.2 |
| 00:02:26.920–00:02:44.780 | Break | -15.78 | -3.58 | 850.7 |
| 00:02:44.780–00:03:03.100 | Instrumental | -13.07 | -2.33 | 465.9 |
| 00:03:03.100–00:03:15.000 | Final Hook | -13.02 | -2.76 | 581.4 |
| 00:03:15.000–00:04:19.321 | Instrumental | -12.88 | -2.77 | 418.3 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Original-WAV | Bildwelt öffnen |
| E002 | 00:00:01.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -7.5 dB | Regelzeile und Deny-Tor in Nahaufnahme isolieren |
| E003 | 00:00:09.940 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E004 | 00:00:13.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.0 dB | Erlaubte Verbindungswege der Halle öffnen |
| E005 | 00:00:22.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +8.5 dB | Erlaubte Verbindungswege der Halle öffnen |
| E006 | 00:00:23.151 | transient | Spektraler Anstieg, relative Stärke 2.17 | Eine Zustandskarte am Tor einrasten lassen |
| E007 | 00:00:24.000 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E008 | 00:00:30.761 | transient | Spektraler Anstieg, relative Stärke 2.32 | Eine Zustandskarte am Tor einrasten lassen |
| E009 | 00:00:43.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.1 dB | Erlaubte Verbindungswege der Halle öffnen |
| E010 | 00:00:45.551 | transient | Spektraler Anstieg, relative Stärke 2.28 | Eine Zustandskarte am Tor einrasten lassen |
| E011 | 00:00:50.600 | section_boundary | Beginn Verse; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E012 | 00:00:52.731 | transient | Spektraler Anstieg, relative Stärke 2.12 | Eine Zustandskarte am Tor einrasten lassen |
| E013 | 00:00:59.491 | transient | Spektraler Anstieg, relative Stärke 2.17 | Eine Zustandskarte am Tor einrasten lassen |
| E014 | 00:01:07.521 | transient | Spektraler Anstieg, relative Stärke 2.28 | Eine Zustandskarte am Tor einrasten lassen |
| E015 | 00:01:10.740 | section_boundary | Beginn Pre-Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E016 | 00:01:15.131 | transient | Spektraler Anstieg, relative Stärke 2.22 | Eine Zustandskarte am Tor einrasten lassen |
| E017 | 00:01:18.640 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E018 | 00:01:24.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.9 dB | Erlaubte Verbindungswege der Halle öffnen |
| E019 | 00:01:27.381 | transient | Spektraler Anstieg, relative Stärke 2.23 | Eine Zustandskarte am Tor einrasten lassen |
| E020 | 00:01:36.460 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E021 | 00:01:40.481 | transient | Spektraler Anstieg, relative Stärke 2.15 | Eine Zustandskarte am Tor einrasten lassen |
| E022 | 00:01:41.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.5 dB | Erlaubte Verbindungswege der Halle öffnen |
| E023 | 00:01:51.240 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E024 | 00:02:03.500 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E025 | 00:02:04.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.5 dB | Erlaubte Verbindungswege der Halle öffnen |
| E026 | 00:02:10.440 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E027 | 00:02:26.920 | section_boundary | Beginn Break; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E028 | 00:02:44.780 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E029 | 00:02:47.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.4 dB | Erlaubte Verbindungswege der Halle öffnen |
| E030 | 00:02:48.931 | transient | Spektraler Anstieg, relative Stärke 2.09 | Eine Zustandskarte am Tor einrasten lassen |
| E031 | 00:03:03.100 | section_boundary | Beginn Final Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E032 | 00:03:12.171 | transient | Spektraler Anstieg, relative Stärke 2.10 | Eine Zustandskarte am Tor einrasten lassen |
| E033 | 00:03:12.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.1 dB | Regelzeile und Deny-Tor in Nahaufnahme isolieren |
| E034 | 00:03:15.000 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E035 | 00:03:15.000 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E036 | 00:03:24.001 | transient | Spektraler Anstieg, relative Stärke 2.04 | Eine Zustandskarte am Tor einrasten lassen |
| E037 | 00:03:34.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.8 dB | Erlaubte Verbindungswege der Halle öffnen |
| E038 | 00:03:35.411 | transient | Spektraler Anstieg, relative Stärke 2.22 | Eine Zustandskarte am Tor einrasten lassen |
| E039 | 00:03:48.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.4 dB | Erlaubte Verbindungswege der Halle öffnen |
| E040 | 00:03:48.400 | level_gap | 100-ms-RMS -36.2 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E041 | 00:03:48.511 | transient | Spektraler Anstieg, relative Stärke 2.22 | Eine Zustandskarte am Tor einrasten lassen |
| E042 | 00:04:13.400 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E043 | 00:04:17.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -30.3 dB | Regelzeile und Deny-Tor in Nahaufnahme isolieren |
| E044 | 00:04:19.321 | end | Ende der Original-WAV | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1581 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 1 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:15.000; danach läuft das Originalaudio bis 00:04:19.321. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der Original-WAV. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 4 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.
