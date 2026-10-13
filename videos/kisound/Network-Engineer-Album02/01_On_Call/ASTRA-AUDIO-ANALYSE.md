# 01 On Call – Audioanalyse

**Wichtigste Erkenntnisse:** 216.774 s, geschätzte 127.4 BPM (mittel), -13.0 LUFS und -0.3 dBTP. Letzte transkribierte Stimme bei 00:03:19.040; Audioende bei 00:03:36.774.

## Datei und Pegel

- Quelle: `01_On_Call_1.0.wav`; SHA-256 `6d10bbfdf8af4a390e4e12e9775a93b1bea7f2838d68f7bd75046ca0a290bcd1`. Die Zuordnung stützt sich auf `source_audio`, Transkript-SHA und decodierte Dauer; noch keine finale Release-Auswahl.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 10405128 Samples je Kanal; Dauer 216.773500000 s.
- Sample-Peak -0.316 dBFS bei 00:03:18.463; pro Kanal [-1.604, -0.316] dBFS. True Peak -0.3 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -14.419 dBFS; Crest 14.103 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.0 LUFS; LRA 6.2 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [4.55e-05, 9.1e-06]; globale Stereo-Korrelation 0.9027. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 127.7 BPM; phasenoptimierte Rasterbewertung: 127.4 BPM. Empfohlen: 127.4 BPM; Alternativen [63.7, 254.8, 85.2, 73.4]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.353 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 127.7 BPM, 00:00:30.000–00:01:00.000: 127.7 BPM, 00:01:00.000–00:01:30.000: 127.7 BPM, 00:01:30.000–00:02:00.000: 127.7 BPM, 00:02:00.000–00:02:30.000: 127.7 BPM, 00:02:30.000–00:03:00.000: 127.7 BPM, 00:03:00.000–00:03:30.000: 127.7 BPM, 00:03:30.000–00:03:36.774: 127.7 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 29.59 % |
| bass_60_250 | 60–250 Hz | 44.33 % |
| lowmid_250_500 | 250–500 Hz | 11.31 % |
| mid_500_2000 | 500–2000 Hz | 11.24 % |
| presence_2000_6000 | 2000–6000 Hz | 1.73 % |
| high_6000_12000 | 6000–12000 Hz | 1.48 % |
| air_12000_20000 | 12000–20000 Hz | 0.33 % |

Mittlerer spektraler Schwerpunkt 584.8 Hz, 85-%-Rolloff 866.2 Hz. Auffällige Langzeit-Peaks: [58.6, 140.6, 234.4, 691.4, 351.6, 304.7, 410.2, 550.8, 468.8, 621.1, 832.0] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:16.580 | Vorlauf | -20.08 | -4.33 | 497.2 |
| 00:00:16.580–00:00:30.020 | Intro | -19.98 | -2.55 | 1163.9 |
| 00:00:30.020–00:00:44.560 | Instrumental | -14.29 | -3.89 | 300.8 |
| 00:00:44.560–00:01:15.400 | Verse 1 | -15.06 | -3.1 | 618.2 |
| 00:01:15.400–00:01:29.320 | Pre-Chorus | -17.57 | -2.68 | 617.6 |
| 00:01:29.320–00:02:00.120 | Chorus | -14.16 | -2.09 | 511.5 |
| 00:02:00.120–00:02:15.680 | Verse 2 | -13.39 | -1.47 | 613.7 |
| 00:02:15.680–00:02:33.520 | Bridge | -12.79 | -2.0 | 528.6 |
| 00:02:33.520–00:03:04.280 | Final Chorus | -13.45 | -1.17 | 517.5 |
| 00:03:04.280–00:03:19.040 | Outro | -14.79 | -0.32 | 743.3 |
| 00:03:19.040–00:03:36.774 | Instrumental | -12.21 | -1.03 | 567.4 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:01.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.2 dB | Ticket und Einzelbefund in Nahaufnahme halten |
| E003 | 00:00:11.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.7 dB | Diagnosespur zum nächsten Prüfpunkt öffnen |
| E004 | 00:00:16.580 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:22.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.2 dB | Diagnosespur zum nächsten Prüfpunkt öffnen |
| E006 | 00:00:28.700 | level_gap | 100-ms-RMS -38.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E007 | 00:00:30.020 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E008 | 00:00:30.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +8.4 dB | Diagnosespur zum nächsten Prüfpunkt öffnen |
| E009 | 00:00:30.461 | transient | Spektraler Anstieg, relative Stärke 2.13 | Alarmdisplay kurz aufleuchten lassen |
| E010 | 00:00:38.481 | transient | Spektraler Anstieg, relative Stärke 2.21 | Alarmdisplay kurz aufleuchten lassen |
| E011 | 00:00:43.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.0 dB | Ticket und Einzelbefund in Nahaufnahme halten |
| E012 | 00:00:44.560 | section_boundary | Beginn Verse 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E013 | 00:01:06.761 | transient | Spektraler Anstieg, relative Stärke 2.15 | Alarmdisplay kurz aufleuchten lassen |
| E014 | 00:01:15.400 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E015 | 00:01:15.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.3 dB | Ticket und Einzelbefund in Nahaufnahme halten |
| E016 | 00:01:29.320 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E017 | 00:01:30.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.1 dB | Diagnosespur zum nächsten Prüfpunkt öffnen |
| E018 | 00:01:32.671 | transient | Spektraler Anstieg, relative Stärke 2.14 | Alarmdisplay kurz aufleuchten lassen |
| E019 | 00:01:39.731 | transient | Spektraler Anstieg, relative Stärke 2.12 | Alarmdisplay kurz aufleuchten lassen |
| E020 | 00:01:56.661 | transient | Spektraler Anstieg, relative Stärke 2.35 | Alarmdisplay kurz aufleuchten lassen |
| E021 | 00:01:56.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.7 dB | Ticket und Einzelbefund in Nahaufnahme halten |
| E022 | 00:02:00.120 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E023 | 00:02:05.581 | transient | Spektraler Anstieg, relative Stärke 2.39 | Alarmdisplay kurz aufleuchten lassen |
| E024 | 00:02:15.680 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E025 | 00:02:16.371 | transient | Spektraler Anstieg, relative Stärke 2.61 | Alarmdisplay kurz aufleuchten lassen |
| E026 | 00:02:26.691 | transient | Spektraler Anstieg, relative Stärke 2.58 | Alarmdisplay kurz aufleuchten lassen |
| E027 | 00:02:33.520 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E028 | 00:02:34.191 | transient | Spektraler Anstieg, relative Stärke 2.42 | Alarmdisplay kurz aufleuchten lassen |
| E029 | 00:02:34.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.7 dB | Ticket und Einzelbefund in Nahaufnahme halten |
| E030 | 00:02:52.441 | transient | Spektraler Anstieg, relative Stärke 2.32 | Alarmdisplay kurz aufleuchten lassen |
| E031 | 00:03:04.131 | transient | Spektraler Anstieg, relative Stärke 2.36 | Alarmdisplay kurz aufleuchten lassen |
| E032 | 00:03:04.280 | section_boundary | Beginn Outro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E033 | 00:03:16.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -9.0 dB | Ticket und Einzelbefund in Nahaufnahme halten |
| E034 | 00:03:19.040 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E035 | 00:03:19.040 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E036 | 00:03:19.300 | level_gap | 100-ms-RMS -35.8 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E037 | 00:03:19.551 | transient | Spektraler Anstieg, relative Stärke 2.80 | Alarmdisplay kurz aufleuchten lassen |
| E038 | 00:03:27.021 | transient | Spektraler Anstieg, relative Stärke 2.24 | Alarmdisplay kurz aufleuchten lassen |
| E039 | 00:03:30.800 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E040 | 00:03:35.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -30.9 dB | Ticket und Einzelbefund in Nahaufnahme halten |
| E041 | 00:03:36.774 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1511 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 2 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:19.040; danach läuft das Originalaudio bis 00:03:36.774. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt den aktuellen Audio-Kandidaten. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Keine Videos oder Drehbücher wurden erzeugt.
Audioformat: WAV; decodierte Dauer 216.773500000 s; Containerdauer 216.773500000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatisch erstellt; Hörprüfung offener Text- und Zeitkonflikte aus TRANSKRIPT-PRUEFUNG.md steht aus.
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Network-Engineer-Album02/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L014 | 00:01:18.420–00:01:21.420 | Genauer fragen. | review_required |
| L018 | 00:01:31.160–00:01:34.500 | Display wird hell. | review_required |
| L020 | 00:01:39.180–00:01:41.780 | ich folg dem Signal. | review_required |
| L021 | 00:01:41.780–00:01:45.920 | On Call. | review_required |
| L022 | 00:01:46.320–00:01:49.820 | Noch keine Antwort. | review_required |
| L024 | 00:01:53.740–00:01:56.980 | bis ich die Ursache hab. | review_required |
| L051 | 00:03:12.560–00:03:14.160 | Display wird dunkel. | review_required |
| L052 | 00:03:15.840–00:03:19.040 | Die Stadt weiss nichts davon. | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
