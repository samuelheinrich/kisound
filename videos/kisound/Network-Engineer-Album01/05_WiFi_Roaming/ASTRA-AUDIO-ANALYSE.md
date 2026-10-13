# 05 WiFi Roaming – Audioanalyse

**Wichtigste Erkenntnisse:** 176.881 s, geschätzte 87.0 BPM (mittel), -13.1 LUFS und -2.1 dBTP. Letzte transkribierte Stimme bei 00:02:42.560; Audioende bei 00:02:56.881.

## Datei und Pegel

- Quelle: `05_WiFi_Roaming_0.3-1.wav`; SHA-256 `eb8554d1bed1f9eac7033c3f21a8274f725eaadf6cd5e7a1366beaa9a3396afa`. Die Zuordnung stützt sich auf `RELEASE AUDIO`, Transkript-SHA und Dauer.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 8490287 Samples je Kanal; Dauer 176.880979167 s.
- Sample-Peak -2.142 dBFS bei 00:00:09.327; pro Kanal [-2.169, -2.142] dBFS. True Peak -2.1 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -14.147 dBFS; Crest 12.005 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.1 LUFS; LRA 4.6 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-0.0002657, 0.0001411]; globale Stereo-Korrelation 0.9296. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 87.0 BPM; phasenoptimierte Rasterbewertung: 87.0 BPM. Empfohlen: 87.0 BPM; Alternativen [43.5, 174.0, 174.0, 116.0]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.345 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 87.0 BPM, 00:00:30.000–00:01:00.000: 87.0 BPM, 00:01:00.000–00:01:30.000: 87.0 BPM, 00:01:30.000–00:02:00.000: 87.0 BPM, 00:02:00.000–00:02:30.000: 87.0 BPM, 00:02:30.000–00:02:56.881: 87.0 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 53.48 % |
| bass_60_250 | 60–250 Hz | 30.15 % |
| lowmid_250_500 | 250–500 Hz | 2.27 % |
| mid_500_2000 | 500–2000 Hz | 5.87 % |
| presence_2000_6000 | 2000–6000 Hz | 4.62 % |
| high_6000_12000 | 6000–12000 Hz | 2.95 % |
| air_12000_20000 | 12000–20000 Hz | 0.65 % |

Mittlerer spektraler Schwerpunkt 1080.0 Hz, 85-%-Rolloff 1983.3 Hz. Auffällige Langzeit-Peaks: [46.9, 128.9, 175.8] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:12.180 | Intro | -19.77 | -2.14 | 1468.2 |
| 00:00:12.180–00:00:33.240 | Instrumental | -15.54 | -3.55 | 889.1 |
| 00:00:33.240–00:00:43.720 | Verse | -14.96 | -3.8 | 1260.3 |
| 00:00:43.720–00:00:55.420 | Pre-Chorus | -14.94 | -3.45 | 1198.6 |
| 00:00:55.420–00:01:06.280 | Chorus | -13.89 | -3.23 | 975.1 |
| 00:01:06.280–00:01:17.540 | Hook | -13.89 | -3.04 | 1093.6 |
| 00:01:17.540–00:01:28.200 | Instrumental | -13.27 | -3.15 | 1058.5 |
| 00:01:28.200–00:01:50.960 | Verse 2 | -15.58 | -3.12 | 1261.8 |
| 00:01:50.960–00:02:01.680 | Break | -16.63 | -3.49 | 1413.6 |
| 00:02:01.680–00:02:15.860 | Final Chorus | -14.08 | -2.65 | 1271.0 |
| 00:02:15.860–00:02:42.560 | Outro | -12.05 | -2.48 | 819.1 |
| 00:02:42.560–00:02:56.881 | Instrumental | -12.1 | -2.4 | 654.6 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Original-WAV | Bildwelt öffnen |
| E002 | 00:00:01.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.4 dB | Figur in der schwachen Funkzelle kurz zögern lassen |
| E003 | 00:00:04.491 | transient | Spektraler Anstieg, relative Stärke 2.08 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E004 | 00:00:11.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.5 dB | Funkraum und seitliche Kamerafahrt erweitern |
| E005 | 00:00:12.180 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E006 | 00:00:22.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB | Funkraum und seitliche Kamerafahrt erweitern |
| E007 | 00:00:32.081 | transient | Spektraler Anstieg, relative Stärke 2.15 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E008 | 00:00:33.240 | section_boundary | Beginn Verse; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E009 | 00:00:38.801 | transient | Spektraler Anstieg, relative Stärke 2.04 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E010 | 00:00:43.720 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E011 | 00:00:49.321 | transient | Spektraler Anstieg, relative Stärke 2.12 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E012 | 00:00:55.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB | Funkraum und seitliche Kamerafahrt erweitern |
| E013 | 00:00:55.420 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E014 | 00:00:59.491 | transient | Spektraler Anstieg, relative Stärke 2.06 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E015 | 00:01:06.280 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E016 | 00:01:06.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.4 dB | Funkraum und seitliche Kamerafahrt erweitern |
| E017 | 00:01:10.011 | transient | Spektraler Anstieg, relative Stärke 2.07 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E018 | 00:01:17.540 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:01:17.941 | transient | Spektraler Anstieg, relative Stärke 2.15 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E020 | 00:01:18.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB | Funkraum und seitliche Kamerafahrt erweitern |
| E021 | 00:01:27.500 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.8 dB | Figur in der schwachen Funkzelle kurz zögern lassen |
| E022 | 00:01:28.200 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E023 | 00:01:34.841 | transient | Spektraler Anstieg, relative Stärke 2.22 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E024 | 00:01:50.960 | section_boundary | Beginn Break; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E025 | 00:02:01.680 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E026 | 00:02:03.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.0 dB | Figur in der schwachen Funkzelle kurz zögern lassen |
| E027 | 00:02:05.181 | transient | Spektraler Anstieg, relative Stärke 2.25 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E028 | 00:02:14.841 | transient | Spektraler Anstieg, relative Stärke 2.05 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E029 | 00:02:15.860 | section_boundary | Beginn Outro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E030 | 00:02:22.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.2 dB | Figur in der schwachen Funkzelle kurz zögern lassen |
| E031 | 00:02:23.121 | transient | Spektraler Anstieg, relative Stärke 2.07 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E032 | 00:02:33.811 | transient | Spektraler Anstieg, relative Stärke 2.52 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E033 | 00:02:35.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.0 dB | Funkraum und seitliche Kamerafahrt erweitern |
| E034 | 00:02:40.541 | transient | Spektraler Anstieg, relative Stärke 2.64 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E035 | 00:02:42.560 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E036 | 00:02:42.560 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E037 | 00:02:45.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.3 dB | Funkraum und seitliche Kamerafahrt erweitern |
| E038 | 00:02:50.371 | transient | Spektraler Anstieg, relative Stärke 3.25 | Einen Beacon-Lichtpunkt an der Tür aufblitzen lassen |
| E039 | 00:02:50.900 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E040 | 00:02:55.400 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -11.6 dB | Figur in der schwachen Funkzelle kurz zögern lassen |
| E041 | 00:02:56.881 | end | Ende der Original-WAV | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1060 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 0 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:02:42.560; danach läuft das Originalaudio bis 00:02:56.881. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der Original-WAV. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 1 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.
