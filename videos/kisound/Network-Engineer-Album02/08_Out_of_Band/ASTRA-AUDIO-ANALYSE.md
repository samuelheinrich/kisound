# 08 Out of Band – Audioanalyse

**Wichtigste Erkenntnisse:** 264.413 s, geschätzte 126.0 BPM (mittel), -12.4 LUFS und 0.1 dBTP. Letzte transkribierte Stimme bei 00:04:03.560; Audioende bei 00:04:24.414.

## Datei und Pegel

- Quelle: `08_Out_of_Band_1.0.wav`; SHA-256 `9139796abf25839d0b7a85ee57042ebe0e1f524d5f8c0f61073e9b2b42a2427c`. Die Zuordnung stützt sich auf `source_audio`, Transkript-SHA und decodierte Dauer; noch keine finale Release-Auswahl.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 12691848 Samples je Kanal; Dauer 264.413500000 s.
- Sample-Peak 0.0 dBFS bei 00:04:18.649; pro Kanal [-0.0, 0.0] dBFS. True Peak 0.1 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -13.812 dBFS; Crest 13.812 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -12.4 LUFS; LRA 6.3 LU.
- Vollaussteuerungs-Kandidaten: 5; DC-Offset je Kanal [-2.06e-05, -8.9e-06]; globale Stereo-Korrelation 0.8303. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 125.0 BPM; phasenoptimierte Rasterbewertung: 126.0 BPM. Empfohlen: 126.0 BPM; Alternativen [63.0, 252.0, 84.0, 100.8]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.238 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 166.7 BPM, 00:00:30.000–00:01:00.000: 125.0 BPM, 00:01:00.000–00:01:30.000: 125.0 BPM, 00:01:30.000–00:02:00.000: 125.0 BPM, 00:02:00.000–00:02:30.000: 125.0 BPM, 00:02:30.000–00:03:00.000: 125.0 BPM, 00:03:00.000–00:03:30.000: 125.0 BPM, 00:03:30.000–00:04:00.000: 125.0 BPM, 00:04:00.000–00:04:24.413: 125.0 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 35.08 % |
| bass_60_250 | 60–250 Hz | 38.24 % |
| lowmid_250_500 | 250–500 Hz | 13.43 % |
| mid_500_2000 | 500–2000 Hz | 9.98 % |
| presence_2000_6000 | 2000–6000 Hz | 1.13 % |
| high_6000_12000 | 6000–12000 Hz | 1.65 % |
| air_12000_20000 | 12000–20000 Hz | 0.48 % |

Mittlerer spektraler Schwerpunkt 638.2 Hz, 85-%-Rolloff 992.3 Hz. Auffällige Langzeit-Peaks: [46.9, 175.8, 257.8, 386.7, 785.2, 527.3, 585.9, 468.8, 703.1] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:08.480 | Vorlauf | -22.04 | -6.04 | 575.7 |
| 00:00:08.480–00:00:22.580 | Intro | -21.52 | -3.64 | 775.4 |
| 00:00:22.580–00:00:46.200 | Instrumental | -15.93 | -3.15 | 364.9 |
| 00:00:46.200–00:01:15.300 | Verse 1 | -14.38 | -1.31 | 526.8 |
| 00:01:15.300–00:01:30.080 | Pre-Chorus | -14.73 | -0.3 | 612.8 |
| 00:01:30.080–00:01:57.800 | Chorus | -15.14 | -0.6 | 737.0 |
| 00:01:57.800–00:02:16.320 | Instrumental | -13.13 | -0.57 | 571.2 |
| 00:02:16.320–00:02:46.980 | Verse 2 | -12.14 | -0.0 | 704.5 |
| 00:02:46.980–00:03:02.800 | Bridge | -17.13 | -1.1 | 1094.1 |
| 00:03:02.800–00:03:16.880 | Instrumental | -13.49 | -1.32 | 477.7 |
| 00:03:16.880–00:03:49.640 | Final Chorus | -11.92 | -0.27 | 578.6 |
| 00:03:49.640–00:04:03.560 | Outro | -14.82 | -0.95 | 728.6 |
| 00:04:03.560–00:04:24.414 | Instrumental | -11.32 | 0.0 | 759.2 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:00.100 | level_gap | 100-ms-RMS -88.3 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:01.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.0 dB | Getrennten Managementpfad räumlich öffnen |
| E004 | 00:00:08.480 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:09.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.5 dB | Console und letzten Change in Nahaufnahme halten |
| E006 | 00:00:22.580 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:00:22.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB | Getrennten Managementpfad räumlich öffnen |
| E008 | 00:00:30.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.1 dB | Getrennten Managementpfad räumlich öffnen |
| E009 | 00:00:44.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.4 dB | Getrennten Managementpfad räumlich öffnen |
| E010 | 00:00:46.200 | section_boundary | Beginn Verse 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E011 | 00:01:03.571 | transient | Spektraler Anstieg, relative Stärke 2.45 | Console-Status kurz hervorheben |
| E012 | 00:01:14.051 | transient | Spektraler Anstieg, relative Stärke 2.44 | Console-Status kurz hervorheben |
| E013 | 00:01:15.300 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E014 | 00:01:29.291 | transient | Spektraler Anstieg, relative Stärke 3.01 | Console-Status kurz hervorheben |
| E015 | 00:01:30.080 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E016 | 00:01:31.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.4 dB | Console und letzten Change in Nahaufnahme halten |
| E017 | 00:01:41.200 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.3 dB | Getrennten Managementpfad räumlich öffnen |
| E018 | 00:01:49.291 | transient | Spektraler Anstieg, relative Stärke 2.69 | Console-Status kurz hervorheben |
| E019 | 00:01:57.800 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E020 | 00:01:57.861 | transient | Spektraler Anstieg, relative Stärke 2.95 | Console-Status kurz hervorheben |
| E021 | 00:02:08.341 | transient | Spektraler Anstieg, relative Stärke 2.55 | Console-Status kurz hervorheben |
| E022 | 00:02:15.011 | transient | Spektraler Anstieg, relative Stärke 2.68 | Console-Status kurz hervorheben |
| E023 | 00:02:16.320 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E024 | 00:02:23.581 | transient | Spektraler Anstieg, relative Stärke 2.97 | Console-Status kurz hervorheben |
| E025 | 00:02:31.201 | transient | Spektraler Anstieg, relative Stärke 2.68 | Console-Status kurz hervorheben |
| E026 | 00:02:41.681 | transient | Spektraler Anstieg, relative Stärke 3.01 | Console-Status kurz hervorheben |
| E027 | 00:02:43.500 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.1 dB | Console und letzten Change in Nahaufnahme halten |
| E028 | 00:02:46.980 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E029 | 00:02:59.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.4 dB | Getrennten Managementpfad räumlich öffnen |
| E030 | 00:03:02.800 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E031 | 00:03:16.880 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E032 | 00:03:18.361 | transient | Spektraler Anstieg, relative Stärke 2.54 | Console-Status kurz hervorheben |
| E033 | 00:03:48.371 | transient | Spektraler Anstieg, relative Stärke 2.50 | Console-Status kurz hervorheben |
| E034 | 00:03:49.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.7 dB | Console und letzten Change in Nahaufnahme halten |
| E035 | 00:03:49.640 | section_boundary | Beginn Outro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E036 | 00:04:03.560 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E037 | 00:04:03.560 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E038 | 00:04:03.900 | level_gap | 100-ms-RMS -39.5 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E039 | 00:04:04.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +9.4 dB | Getrennten Managementpfad räumlich öffnen |
| E040 | 00:04:04.091 | transient | Spektraler Anstieg, relative Stärke 2.71 | Console-Status kurz hervorheben |
| E041 | 00:04:15.051 | transient | Spektraler Anstieg, relative Stärke 2.79 | Console-Status kurz hervorheben |
| E042 | 00:04:18.500 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E043 | 00:04:23.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -42.3 dB | Console und letzten Change in Nahaufnahme halten |
| E044 | 00:04:24.414 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1789 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 2 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:04:03.560; danach läuft das Originalaudio bis 00:04:24.414. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt den aktuellen Audio-Kandidaten. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Keine Videos oder Drehbücher wurden erzeugt.
Audioformat: WAV; decodierte Dauer 264.413500000 s; Containerdauer 264.413500000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatisch erstellt; Hörprüfung offener Text- und Zeitkonflikte aus TRANSKRIPT-PRUEFUNG.md steht aus.
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Network-Engineer-Album02/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L001 | 00:00:08.480–00:00:10.420 | Kein Login. | review_required |
| L002 | 00:00:10.420–00:00:14.020 | Keine Antwort. | review_required |
| L003 | 00:00:14.460–00:00:18.180 | Das Netz ist weg. | review_required |
| L004 | 00:00:18.480–00:00:22.580 | Der andere Weg bleibt. | review_required |
| L017 | 00:01:30.080–00:01:31.720 | Out of Band. | review_required |
| L020 | 00:01:40.040–00:01:43.220 | komm ich hier noch an. | review_required |
| L021 | 00:01:45.160–00:01:46.960 | Out of Band. | review_required |
| L048 | 00:03:41.060–00:03:45.300 | und das Netz trägt wieder. | review_required |
| L049 | 00:03:49.640–00:03:52.200 | Console bleibt erreichbar. | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
