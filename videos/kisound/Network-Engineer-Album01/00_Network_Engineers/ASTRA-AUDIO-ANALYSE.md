# 00 Network Engineers – Audioanalyse

**Wichtigste Erkenntnisse:** 207.520 s, geschätzte 126.0 BPM (mittel), -14.8 LUFS und -2.9 dBTP. Letzte transkribierte Stimme bei 00:02:43.180; Audioende bei 00:03:27.520.

## Datei und Pegel

- Quelle: `00_Network_Engineers_0.4-1.wav`; SHA-256 `f898d546962be52a08ffac6af68f08f550975de15956fe06c4a9e8c6b33dd5b5`. Die Zuordnung stützt sich auf `RELEASE AUDIO`, Transkript-SHA und Dauer.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 9960968 Samples je Kanal; Dauer 207.520166667 s.
- Sample-Peak -2.901 dBFS bei 00:02:09.533; pro Kanal [-3.749, -2.901] dBFS. True Peak -2.9 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -15.919 dBFS; Crest 13.018 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -14.8 LUFS; LRA 3.6 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-9.84e-05, 0.0001554]; globale Stereo-Korrelation 0.9053. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 125.0 BPM; phasenoptimierte Rasterbewertung: 126.0 BPM. Empfohlen: 126.0 BPM; Alternativen [63.0, 252.0, 72.0, 100.8]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.198 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 166.7 BPM, 00:00:30.000–00:01:00.000: 125.0 BPM, 00:01:00.000–00:01:30.000: 125.0 BPM, 00:01:30.000–00:02:00.000: 125.0 BPM, 00:02:00.000–00:02:30.000: 125.0 BPM, 00:02:30.000–00:03:00.000: 125.0 BPM, 00:03:00.000–00:03:27.520: 125.0 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 45.80 % |
| bass_60_250 | 60–250 Hz | 36.99 % |
| lowmid_250_500 | 250–500 Hz | 3.97 % |
| mid_500_2000 | 500–2000 Hz | 6.61 % |
| presence_2000_6000 | 2000–6000 Hz | 3.51 % |
| high_6000_12000 | 6000–12000 Hz | 2.58 % |
| air_12000_20000 | 12000–20000 Hz | 0.55 % |

Mittlerer spektraler Schwerpunkt 986.9 Hz, 85-%-Rolloff 1738.3 Hz. Auffällige Langzeit-Peaks: [46.9, 128.9, 175.8, 257.8, 515.6] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:08.720 | Vorlauf | -20.94 | -4.29 | 774.4 |
| 00:00:08.720–00:00:22.820 | Intro | -18.24 | -3.4 | 1539.5 |
| 00:00:22.820–00:00:44.280 | Instrumental | -15.99 | -3.67 | 745.9 |
| 00:00:44.280–00:00:59.360 | Verse | -14.95 | -3.95 | 799.7 |
| 00:00:59.360–00:01:15.520 | Pre-Chorus | -19.18 | -3.73 | 1118.5 |
| 00:01:15.520–00:01:35.000 | Chorus | -15.25 | -3.34 | 856.1 |
| 00:01:35.000–00:01:48.160 | Break | -14.69 | -3.07 | 1109.8 |
| 00:01:48.160–00:02:12.160 | Instrumental | -15.98 | -2.9 | 1371.0 |
| 00:02:12.160–00:02:27.940 | Verse 2 | -18.92 | -3.17 | 1641.4 |
| 00:02:27.940–00:02:43.180 | Final Chorus | -15.24 | -3.53 | 735.7 |
| 00:02:43.180–00:03:27.520 | Instrumental | -14.67 | -3.52 | 660.8 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Original-WAV | Bildwelt öffnen |
| E002 | 00:00:08.720 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E003 | 00:00:11.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.6 dB | Stadtverbindungen und Kameraraum öffnen |
| E004 | 00:00:15.211 | transient | Spektraler Anstieg, relative Stärke 2.43 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E005 | 00:00:20.400 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.5 dB | Warnanzeigen zurücknehmen und die Nachtwache in Nahaufnahme halten |
| E006 | 00:00:22.820 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:00:30.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.1 dB | Stadtverbindungen und Kameraraum öffnen |
| E008 | 00:00:30.691 | transient | Spektraler Anstieg, relative Stärke 2.34 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E009 | 00:00:37.351 | transient | Spektraler Anstieg, relative Stärke 2.24 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E010 | 00:00:44.021 | transient | Spektraler Anstieg, relative Stärke 2.42 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E011 | 00:00:44.280 | section_boundary | Beginn Verse; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E012 | 00:00:45.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.9 dB | Stadtverbindungen und Kameraraum öffnen |
| E013 | 00:00:58.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.4 dB | Warnanzeigen zurücknehmen und die Nachtwache in Nahaufnahme halten |
| E014 | 00:00:59.360 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E015 | 00:01:15.520 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E016 | 00:01:15.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.9 dB | Stadtverbindungen und Kameraraum öffnen |
| E017 | 00:01:31.161 | transient | Spektraler Anstieg, relative Stärke 2.35 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E018 | 00:01:35.000 | section_boundary | Beginn Break; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:01:41.161 | transient | Spektraler Anstieg, relative Stärke 2.38 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E020 | 00:01:48.160 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E021 | 00:01:49.731 | transient | Spektraler Anstieg, relative Stärke 2.21 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E022 | 00:01:57.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.1 dB | Stadtverbindungen und Kameraraum öffnen |
| E023 | 00:01:59.731 | transient | Spektraler Anstieg, relative Stärke 2.26 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E024 | 00:02:12.111 | transient | Spektraler Anstieg, relative Stärke 2.22 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E025 | 00:02:12.160 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E026 | 00:02:12.500 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.0 dB | Warnanzeigen zurücknehmen und die Nachtwache in Nahaufnahme halten |
| E027 | 00:02:13.800 | level_gap | 100-ms-RMS -38.6 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E028 | 00:02:27.940 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E029 | 00:02:34.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.8 dB | Stadtverbindungen und Kameraraum öffnen |
| E030 | 00:02:43.180 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E031 | 00:02:43.180 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E032 | 00:02:50.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.5 dB | Stadtverbindungen und Kameraraum öffnen |
| E033 | 00:02:51.991 | transient | Spektraler Anstieg, relative Stärke 2.24 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E034 | 00:02:58.301 | transient | Spektraler Anstieg, relative Stärke 3.18 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E035 | 00:02:58.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.6 dB | Stadtverbindungen und Kameraraum öffnen |
| E036 | 00:03:08.781 | transient | Spektraler Anstieg, relative Stärke 2.24 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E037 | 00:03:15.681 | transient | Spektraler Anstieg, relative Stärke 2.45 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E038 | 00:03:21.600 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E039 | 00:03:22.111 | transient | Spektraler Anstieg, relative Stärke 2.23 | Statuspunkt der Leitwarte einmal aufleuchten lassen |
| E040 | 00:03:26.100 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -11.7 dB | Warnanzeigen zurücknehmen und die Nachtwache in Nahaufnahme halten |
| E041 | 00:03:27.520 | end | Ende der Original-WAV | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1160 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 1 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:02:43.180; danach läuft das Originalaudio bis 00:03:27.520. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der Original-WAV. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.
