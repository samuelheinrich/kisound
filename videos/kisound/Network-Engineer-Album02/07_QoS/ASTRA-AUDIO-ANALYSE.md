# 07 QoS – Audioanalyse

**Wichtigste Erkenntnisse:** 239.054 s, geschätzte 129.0 BPM (mittel), -12.8 LUFS und 0.0 dBTP. Letzte transkribierte Stimme bei 00:03:43.740; Audioende bei 00:03:59.054.

## Datei und Pegel

- Quelle: `07_QoS_1.0.wav`; SHA-256 `2eb5c953db38d50aaeba2bb4d1c6fd761c8764dc961b52581308b7684e30c73f`. Die Zuordnung stützt sich auf `source_audio`, Transkript-SHA und decodierte Dauer; noch keine finale Release-Auswahl.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 11474568 Samples je Kanal; Dauer 239.053500000 s.
- Sample-Peak -0.0 dBFS bei 00:02:58.026; pro Kanal [-0.173, -0.0] dBFS. True Peak 0.0 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -13.954 dBFS; Crest 13.954 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -12.8 LUFS; LRA 6.4 LU.
- Vollaussteuerungs-Kandidaten: 1; DC-Offset je Kanal [3.4e-06, -5e-07]; globale Stereo-Korrelation 0.9515. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 127.7 BPM; phasenoptimierte Rasterbewertung: 129.0 BPM. Empfohlen: 129.0 BPM; Alternativen [64.5, 258.0, 86.0, 172.0]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.116 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 171.4 BPM, 00:00:30.000–00:01:00.000: 127.7 BPM, 00:01:00.000–00:01:30.000: 127.7 BPM, 00:01:30.000–00:02:00.000: 127.7 BPM, 00:02:00.000–00:02:30.000: 127.7 BPM, 00:02:30.000–00:03:00.000: 127.7 BPM, 00:03:00.000–00:03:30.000: 127.7 BPM, 00:03:30.000–00:03:59.054: 127.7 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 40.59 % |
| bass_60_250 | 60–250 Hz | 32.26 % |
| lowmid_250_500 | 250–500 Hz | 12.29 % |
| mid_500_2000 | 500–2000 Hz | 11.26 % |
| presence_2000_6000 | 2000–6000 Hz | 1.86 % |
| high_6000_12000 | 6000–12000 Hz | 1.48 % |
| air_12000_20000 | 12000–20000 Hz | 0.26 % |

Mittlerer spektraler Schwerpunkt 710.1 Hz, 85-%-Rolloff 1161.1 Hz. Auffällige Langzeit-Peaks: [46.9, 257.8, 351.6, 433.6, 527.3, 304.7, 703.1, 609.4, 785.2] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:13.300 | Vorlauf | -21.12 | -4.35 | 631.5 |
| 00:00:13.300–00:00:40.900 | Chorus | -18.45 | -2.22 | 806.1 |
| 00:00:40.900–00:00:58.100 | Instrumental | -14.4 | -1.94 | 500.4 |
| 00:00:58.100–00:01:28.880 | Verse 2 | -14.14 | -2.15 | 715.4 |
| 00:01:28.880–00:01:57.120 | Bridge | -15.95 | -0.17 | 825.7 |
| 00:01:57.120–00:02:06.100 | Instrumental | -19.4 | -1.09 | 695.1 |
| 00:02:06.100–00:02:31.150 | Break | -14.79 | -0.35 | 979.6 |
| 00:02:31.150–00:02:58.440 | Final Chorus | -11.82 | -0.0 | 644.0 |
| 00:02:58.440–00:03:15.200 | Instrumental | -12.69 | -0.28 | 506.6 |
| 00:03:15.200–00:03:43.740 | Outro | -11.99 | -0.97 | 654.4 |
| 00:03:43.740–00:03:59.054 | Instrumental | -11.3 | -1.01 | 710.0 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:13.300 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E003 | 00:00:40.900 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E004 | 00:00:44.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.0 dB | Beide Flows und ihre Warteschlangen öffnen |
| E005 | 00:00:49.871 | transient | Spektraler Anstieg, relative Stärke 2.59 | Queue oder Traffic-Klasse kurz hervorheben |
| E006 | 00:00:58.100 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:00:58.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB | Beide Flows und ihre Warteschlangen öffnen |
| E008 | 00:01:00.101 | transient | Spektraler Anstieg, relative Stärke 2.37 | Queue oder Traffic-Klasse kurz hervorheben |
| E009 | 00:01:09.871 | transient | Spektraler Anstieg, relative Stärke 2.31 | Queue oder Traffic-Klasse kurz hervorheben |
| E010 | 00:01:20.571 | transient | Spektraler Anstieg, relative Stärke 2.49 | Queue oder Traffic-Klasse kurz hervorheben |
| E011 | 00:01:22.100 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.1 dB | Engpass und einzelne Queue sichtbar halten |
| E012 | 00:01:28.011 | transient | Spektraler Anstieg, relative Stärke 2.48 | Queue oder Traffic-Klasse kurz hervorheben |
| E013 | 00:01:28.880 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E014 | 00:01:54.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.0 dB | Engpass und einzelne Queue sichtbar halten |
| E015 | 00:01:57.120 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E016 | 00:02:06.100 | section_boundary | Beginn Break; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E017 | 00:02:07.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.1 dB | Engpass und einzelne Queue sichtbar halten |
| E018 | 00:02:08.900 | level_gap | 100-ms-RMS -38.6 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E019 | 00:02:20.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.9 dB | Engpass und einzelne Queue sichtbar halten |
| E020 | 00:02:25.691 | transient | Spektraler Anstieg, relative Stärke 2.28 | Queue oder Traffic-Klasse kurz hervorheben |
| E021 | 00:02:31.150 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E022 | 00:02:31.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.0 dB | Beide Flows und ihre Warteschlangen öffnen |
| E023 | 00:02:36.851 | transient | Spektraler Anstieg, relative Stärke 2.58 | Queue oder Traffic-Klasse kurz hervorheben |
| E024 | 00:02:43.361 | transient | Spektraler Anstieg, relative Stärke 2.28 | Queue oder Traffic-Klasse kurz hervorheben |
| E025 | 00:02:50.801 | transient | Spektraler Anstieg, relative Stärke 2.32 | Queue oder Traffic-Klasse kurz hervorheben |
| E026 | 00:02:58.251 | transient | Spektraler Anstieg, relative Stärke 2.30 | Queue oder Traffic-Klasse kurz hervorheben |
| E027 | 00:02:58.440 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E028 | 00:03:01.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.5 dB | Beide Flows und ihre Warteschlangen öffnen |
| E029 | 00:03:15.200 | section_boundary | Beginn Outro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E030 | 00:03:17.100 | level_gap | 100-ms-RMS -40.5 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E031 | 00:03:17.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +9.5 dB | Beide Flows und ihre Warteschlangen öffnen |
| E032 | 00:03:17.781 | transient | Spektraler Anstieg, relative Stärke 2.40 | Queue oder Traffic-Klasse kurz hervorheben |
| E033 | 00:03:28.481 | transient | Spektraler Anstieg, relative Stärke 2.35 | Queue oder Traffic-Klasse kurz hervorheben |
| E034 | 00:03:32.200 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.9 dB | Beide Flows und ihre Warteschlangen öffnen |
| E035 | 00:03:43.740 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E036 | 00:03:43.740 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E037 | 00:03:43.831 | transient | Spektraler Anstieg, relative Stärke 2.63 | Queue oder Traffic-Klasse kurz hervorheben |
| E038 | 00:03:44.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.8 dB | Beide Flows und ihre Warteschlangen öffnen |
| E039 | 00:03:53.100 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E040 | 00:03:53.131 | transient | Spektraler Anstieg, relative Stärke 2.46 | Queue oder Traffic-Klasse kurz hervorheben |
| E041 | 00:03:57.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -35.6 dB | Engpass und einzelne Queue sichtbar halten |
| E042 | 00:03:59.054 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1803 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 2 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:43.740; danach läuft das Originalaudio bis 00:03:59.054. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt den aktuellen Audio-Kandidaten. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Keine Videos oder Drehbücher wurden erzeugt.
Audioformat: WAV; decodierte Dauer 239.053500000 s; Containerdauer 239.053500000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatisch erstellt; Hörprüfung offener Text- und Zeitkonflikte aus TRANSKRIPT-PRUEFUNG.md steht aus.
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Network-Engineer-Album02/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L024 | 00:01:53.680–00:01:57.120 | bis der nächste Anteil geht. | review_required |
| L027 | 00:02:09.780–00:02:10.480 | Queue. | review_required |
| L031 | 00:02:23.640–00:02:25.200 | Send. | review_required |
| L042 | 00:03:30.720–00:03:32.120 | Klar und deutlich. | review_required |
| L043 | 00:03:35.980–00:03:39.280 | Mein Transfer läuft noch. | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
