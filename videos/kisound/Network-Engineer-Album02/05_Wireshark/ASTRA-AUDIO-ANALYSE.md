# 05 Wireshark – Audioanalyse

**Wichtigste Erkenntnisse:** 195.733 s, geschätzte 108.0 BPM (gering), -13.5 LUFS und 0.0 dBTP. Letzte transkribierte Stimme bei 00:03:15.060; Audioende bei 00:03:15.734.

## Datei und Pegel

- Quelle: `05_Wireshark_1.0.wav`; SHA-256 `243d6ab2160abfa883bfb86a53a73019e406f6f63986de0ebb3659570e83128c`. Die Zuordnung stützt sich auf `source_audio`, Transkript-SHA und decodierte Dauer; noch keine finale Release-Auswahl.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 9395208 Samples je Kanal; Dauer 195.733500000 s.
- Sample-Peak 0.0 dBFS bei 00:01:19.642; pro Kanal [-0.0, 0.0] dBFS. True Peak 0.0 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -15.236 dBFS; Crest 15.236 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.5 LUFS; LRA 8.8 LU.
- Vollaussteuerungs-Kandidaten: 3; DC-Offset je Kanal [5.3e-06, 1.15e-05]; globale Stereo-Korrelation 0.828. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 72.3 BPM; phasenoptimierte Rasterbewertung: 108.0 BPM. Empfohlen: 108.0 BPM; Alternativen [54.0, 216.0, 72.0, 86.4]. Sicherheit: gering.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.185 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 107.1 BPM, 00:00:30.000–00:01:00.000: 72.3 BPM, 00:01:00.000–00:01:30.000: 107.1 BPM, 00:01:30.000–00:02:00.000: 72.3 BPM, 00:02:00.000–00:02:30.000: 72.3 BPM, 00:02:30.000–00:03:00.000: 107.1 BPM, 00:03:00.000–00:03:15.733: 72.3 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 24.17 % |
| bass_60_250 | 60–250 Hz | 53.28 % |
| lowmid_250_500 | 250–500 Hz | 9.40 % |
| mid_500_2000 | 500–2000 Hz | 8.43 % |
| presence_2000_6000 | 2000–6000 Hz | 2.70 % |
| high_6000_12000 | 6000–12000 Hz | 1.67 % |
| air_12000_20000 | 12000–20000 Hz | 0.35 % |

Mittlerer spektraler Schwerpunkt 674.8 Hz, 85-%-Rolloff 1037.9 Hz. Auffällige Langzeit-Peaks: [58.6, 187.5, 117.2, 234.4, 703.1, 468.8, 351.6, 574.2, 937.5] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:11.780 | Vorlauf | -25.16 | -9.31 | 491.8 |
| 00:00:11.780–00:00:33.220 | Intro | -20.12 | -0.18 | 504.9 |
| 00:00:33.220–00:01:10.340 | Verse 1 | -15.12 | -0.68 | 510.2 |
| 00:01:10.340–00:01:29.320 | Pre-Chorus | -19.21 | 0.0 | 908.4 |
| 00:01:29.320–00:01:45.940 | Chorus | -14.53 | -1.95 | 712.1 |
| 00:01:45.940–00:02:04.680 | Verse 2 | -14.32 | -1.93 | 624.0 |
| 00:02:04.680–00:02:22.720 | Bridge | -16.84 | -2.02 | 1109.4 |
| 00:02:22.720–00:02:39.160 | Final Chorus | -14.16 | -1.81 | 780.7 |
| 00:02:39.160–00:02:48.220 | Instrumental | -13.0 | -1.23 | 484.7 |
| 00:02:48.220–00:03:15.060 | Outro | -12.49 | -0.0 | 638.0 |
| 00:03:15.060–00:03:15.734 | Instrumental | -32.3 | -13.23 | 2823.7 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:11.780 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E003 | 00:00:17.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB | Capture und zugehörigen TCP-Stream öffnen |
| E004 | 00:00:24.081 | transient | Spektraler Anstieg, relative Stärke 2.36 | Eine Trace-Zeile hervorheben |
| E005 | 00:00:33.220 | section_boundary | Beginn Verse 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E006 | 00:00:34.081 | transient | Spektraler Anstieg, relative Stärke 2.50 | Eine Trace-Zeile hervorheben |
| E007 | 00:00:35.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.1 dB | Capture und zugehörigen TCP-Stream öffnen |
| E008 | 00:00:40.751 | transient | Spektraler Anstieg, relative Stärke 2.44 | Eine Trace-Zeile hervorheben |
| E009 | 00:00:49.641 | transient | Spektraler Anstieg, relative Stärke 2.48 | Eine Trace-Zeile hervorheben |
| E010 | 00:00:59.641 | transient | Spektraler Anstieg, relative Stärke 2.44 | Eine Trace-Zeile hervorheben |
| E011 | 00:01:10.340 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E012 | 00:01:10.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.6 dB | Auf einen widersprüchlichen Befund konzentrieren |
| E013 | 00:01:11.861 | transient | Spektraler Anstieg, relative Stärke 2.57 | Eine Trace-Zeile hervorheben |
| E014 | 00:01:19.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.5 dB | Auf einen widersprüchlichen Befund konzentrieren |
| E015 | 00:01:22.971 | transient | Spektraler Anstieg, relative Stärke 2.65 | Eine Trace-Zeile hervorheben |
| E016 | 00:01:27.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.6 dB | Capture und zugehörigen TCP-Stream öffnen |
| E017 | 00:01:29.320 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E018 | 00:01:30.751 | transient | Spektraler Anstieg, relative Stärke 2.31 | Eine Trace-Zeile hervorheben |
| E019 | 00:01:44.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -12.9 dB | Auf einen widersprüchlichen Befund konzentrieren |
| E020 | 00:01:45.940 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E021 | 00:01:46.100 | level_gap | 100-ms-RMS -46.2 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E022 | 00:02:04.100 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.3 dB | Auf einen widersprüchlichen Befund konzentrieren |
| E023 | 00:02:04.680 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E024 | 00:02:22.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -8.2 dB | Auf einen widersprüchlichen Befund konzentrieren |
| E025 | 00:02:22.720 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E026 | 00:02:28.521 | transient | Spektraler Anstieg, relative Stärke 2.36 | Eine Trace-Zeile hervorheben |
| E027 | 00:02:37.411 | transient | Spektraler Anstieg, relative Stärke 2.59 | Eine Trace-Zeile hervorheben |
| E028 | 00:02:38.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -11.6 dB | Auf einen widersprüchlichen Befund konzentrieren |
| E029 | 00:02:39.160 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E030 | 00:02:44.081 | transient | Spektraler Anstieg, relative Stärke 2.44 | Eine Trace-Zeile hervorheben |
| E031 | 00:02:48.220 | section_boundary | Beginn Outro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E032 | 00:02:56.551 | transient | Spektraler Anstieg, relative Stärke 2.38 | Eine Trace-Zeile hervorheben |
| E033 | 00:02:57.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.6 dB | Capture und zugehörigen TCP-Stream öffnen |
| E034 | 00:03:05.191 | transient | Spektraler Anstieg, relative Stärke 2.39 | Eine Trace-Zeile hervorheben |
| E035 | 00:03:09.800 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E036 | 00:03:14.071 | transient | Spektraler Anstieg, relative Stärke 2.76 | Eine Trace-Zeile hervorheben |
| E037 | 00:03:14.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -20.8 dB | Auf einen widersprüchlichen Befund konzentrieren |
| E038 | 00:03:15.060 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E039 | 00:03:15.060 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E040 | 00:03:15.734 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

941 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 1 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:15.060; danach läuft das Originalaudio bis 00:03:15.734. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt den aktuellen Audio-Kandidaten. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Keine Videos oder Drehbücher wurden erzeugt.
Audioformat: WAV; decodierte Dauer 195.733500000 s; Containerdauer 195.733500000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatisch erstellt; Hörprüfung offener Text- und Zeitkonflikte aus TRANSKRIPT-PRUEFUNG.md steht aus.
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Network-Engineer-Album02/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L003 | 00:00:24.960–00:00:26.540 | Capture läuft. | review_required |
| L004 | 00:00:26.540–00:00:31.000 | Zeig mir die Spur. | review_required |
| L006 | 00:00:36.140–00:00:40.140 | der Server sei bereit. | review_required |
| L008 | 00:00:44.500–00:00:48.960 | doch keine passt zum Bild. | review_required |
| L014 | 00:01:13.460–00:01:15.520 | Den richtigen Stream. | review_required |
| L015 | 00:01:18.040–00:01:21.020 | Ich blende fremde Frames aus, | review_required |
| L017 | 00:01:29.320–00:01:30.180 | Wireshark. | review_required |
| L021 | 00:01:37.160–00:01:38.860 | Wireshark. | review_required |
| L025 | 00:01:45.940–00:01:48.780 | Der Request geht raus, dann Stille, | review_required |
| L033 | 00:02:04.680–00:02:06.480 | TLS hält seinen Inhalt zu, | review_required |
| L041 | 00:02:22.720–00:02:23.380 | Wireshark. | review_required |
| L045 | 00:02:31.660–00:02:32.360 | Wireshark. | review_required |
| L049 | 00:02:48.220–00:02:50.260 | Capture stoppen. | review_required |
| L050 | 00:02:52.380–00:02:53.400 | Spur sichern. | review_required |
| L051 | 00:02:53.500–00:02:57.040 | Nicht nur «geht wieder». | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
