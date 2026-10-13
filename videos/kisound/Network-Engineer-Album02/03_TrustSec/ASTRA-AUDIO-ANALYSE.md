# 03 TrustSec – Audioanalyse

**Wichtigste Erkenntnisse:** 288.000 s, geschätzte 138.0 BPM (mittel), -13.9 LUFS und -2.2 dBTP. Letzte transkribierte Stimme bei 00:04:33.120; Audioende bei 00:04:48.000.

## Datei und Pegel

- Quelle: `03_TrustSec_1.0.wav`; SHA-256 `602a77e3cfbd16ef0097dbe8619c9af74d20fb86c0523749f301c4e89383661d`. Finale Release-Datei laut STATUS: Final und RELEASE AUDIO im 1.0-Prompt; Transkript-SHA und decodierte Dauer geprüft.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 13824000 Samples je Kanal; Dauer 288.000000000 s.
- Sample-Peak -2.342 dBFS bei 00:04:22.431; pro Kanal [-2.669, -2.342] dBFS. True Peak -2.2 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -15.433 dBFS; Crest 13.091 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.9 LUFS; LRA 3.6 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-6.82e-05, 0.0002677]; globale Stereo-Korrelation 0.8344. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 139.5 BPM; phasenoptimierte Rasterbewertung: 138.0 BPM. Empfohlen: 138.0 BPM; Alternativen [69.0, 276.0, 92.0, 140.2]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.109 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 139.5 BPM, 00:00:30.000–00:01:00.000: 69.0 BPM, 00:01:00.000–00:01:30.000: 69.0 BPM, 00:01:30.000–00:02:00.000: 69.0 BPM, 00:02:00.000–00:02:30.000: 139.5 BPM, 00:02:30.000–00:03:00.000: 69.8 BPM, 00:03:00.000–00:03:30.000: 139.5 BPM, 00:03:30.000–00:04:00.000: 139.5 BPM, 00:04:00.000–00:04:30.000: 139.5 BPM, 00:04:30.000–00:04:48.000: 139.5 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 38.95 % |
| bass_60_250 | 60–250 Hz | 43.27 % |
| lowmid_250_500 | 250–500 Hz | 2.52 % |
| mid_500_2000 | 500–2000 Hz | 5.74 % |
| presence_2000_6000 | 2000–6000 Hz | 5.92 % |
| high_6000_12000 | 6000–12000 Hz | 2.95 % |
| air_12000_20000 | 12000–20000 Hz | 0.64 % |

Mittlerer spektraler Schwerpunkt 1025.7 Hz, 85-%-Rolloff 1782.7 Hz. Auffällige Langzeit-Peaks: [46.9, 117.2, 234.4] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:03.670 | Vorlauf | -19.93 | -4.25 | 987.1 |
| 00:00:03.670–00:00:28.660 | Intro – Systemmeldungen | -20.46 | -3.09 | 1611.5 |
| 00:00:28.660–00:00:41.210 | Instrumental | -15.41 | -3.47 | 725.0 |
| 00:00:41.210–00:01:02.260 | Strophe 1 – Identität und Zugriff | -15.83 | -3.34 | 1193.2 |
| 00:01:02.260–00:01:09.590 | Pre-Hook – Rollenzuweisung | -17.9 | -3.93 | 1565.6 |
| 00:01:09.590–00:01:30.880 | Hook 1 | -15.63 | -2.87 | 1398.9 |
| 00:01:30.880–00:01:52.890 | Strophe 2 – Gruppen und Policy | -15.81 | -3.13 | 1141.3 |
| 00:01:52.890–00:02:05.240 | Systemmeldungen – Zugriff erlaubt | -18.42 | -3.15 | 1938.1 |
| 00:02:05.240–00:02:26.520 | Hook 2 | -15.14 | -2.67 | 967.0 |
| 00:02:26.520–00:02:52.100 | Break – Unbekannte Identität | -15.77 | -3.86 | 871.7 |
| 00:02:52.100–00:03:07.930 | Dialog – Zugriff verweigert | -14.72 | -2.75 | 851.0 |
| 00:03:07.930–00:03:29.490 | Strophe 3 – Bekannter Client | -14.34 | -2.75 | 779.9 |
| 00:03:29.490–00:03:41.770 | Build – Systemmeldungen | -14.42 | -3.44 | 692.4 |
| 00:03:41.770–00:04:11.800 | Final Hook | -14.19 | -2.53 | 712.8 |
| 00:04:11.800–00:04:33.120 | Outro – Systemmeldungen | -13.99 | -2.34 | 851.1 |
| 00:04:33.120–00:04:48.000 | Instrumental | -14.68 | -2.75 | 394.6 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:00.200 | level_gap | 100-ms-RMS -97.3 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:01.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -8.4 dB | Zugriff auf eine Policy-Entscheidung konzentrieren |
| E004 | 00:00:03.670 | section_boundary | Beginn Intro – Systemmeldungen; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:05.131 | transient | Spektraler Anstieg, relative Stärke 2.22 | Tag oder Policy-Zeile kurz hervorheben |
| E006 | 00:00:10.300 | level_gap | 100-ms-RMS -48.8 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E007 | 00:00:10.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +8.0 dB | Traffic-Pfad und Policy-Prüfung öffnen |
| E008 | 00:00:13.900 | level_gap | 100-ms-RMS -43.1 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E009 | 00:00:16.300 | level_gap | 100-ms-RMS -36.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E010 | 00:00:27.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.9 dB | Traffic-Pfad und Policy-Prüfung öffnen |
| E011 | 00:00:28.660 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E012 | 00:00:31.421 | transient | Spektraler Anstieg, relative Stärke 2.53 | Tag oder Policy-Zeile kurz hervorheben |
| E013 | 00:00:38.811 | transient | Spektraler Anstieg, relative Stärke 2.50 | Tag oder Policy-Zeile kurz hervorheben |
| E014 | 00:00:41.210 | section_boundary | Beginn Strophe 1 – Identität und Zugriff; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E015 | 00:00:44.901 | transient | Spektraler Anstieg, relative Stärke 2.63 | Tag oder Policy-Zeile kurz hervorheben |
| E016 | 00:00:53.161 | transient | Spektraler Anstieg, relative Stärke 2.41 | Tag oder Policy-Zeile kurz hervorheben |
| E017 | 00:01:02.260 | section_boundary | Beginn Pre-Hook – Rollenzuweisung; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E018 | 00:01:09.590 | section_boundary | Beginn Hook 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:01:09.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.6 dB | Traffic-Pfad und Policy-Prüfung öffnen |
| E020 | 00:01:12.721 | transient | Spektraler Anstieg, relative Stärke 2.27 | Tag oder Policy-Zeile kurz hervorheben |
| E021 | 00:01:18.811 | transient | Spektraler Anstieg, relative Stärke 2.27 | Tag oder Policy-Zeile kurz hervorheben |
| E022 | 00:01:29.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.3 dB | Zugriff auf eine Policy-Entscheidung konzentrieren |
| E023 | 00:01:30.880 | section_boundary | Beginn Strophe 2 – Gruppen und Policy; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E024 | 00:01:30.981 | transient | Spektraler Anstieg, relative Stärke 2.37 | Tag oder Policy-Zeile kurz hervorheben |
| E025 | 00:01:52.500 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.0 dB | Zugriff auf eine Policy-Entscheidung konzentrieren |
| E026 | 00:01:52.890 | section_boundary | Beginn Systemmeldungen – Zugriff erlaubt; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E027 | 00:01:59.011 | transient | Spektraler Anstieg, relative Stärke 2.31 | Tag oder Policy-Zeile kurz hervorheben |
| E028 | 00:02:00.500 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.8 dB | Zugriff auf eine Policy-Entscheidung konzentrieren |
| E029 | 00:02:05.240 | section_boundary | Beginn Hook 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E030 | 00:02:26.520 | section_boundary | Beginn Break – Unbekannte Identität; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E031 | 00:02:28.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.9 dB | Zugriff auf eine Policy-Entscheidung konzentrieren |
| E032 | 00:02:30.100 | level_gap | 100-ms-RMS -39.1 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E033 | 00:02:32.181 | transient | Spektraler Anstieg, relative Stärke 2.25 | Tag oder Policy-Zeile kurz hervorheben |
| E034 | 00:02:48.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.4 dB | Zugriff auf eine Policy-Entscheidung konzentrieren |
| E035 | 00:02:52.100 | section_boundary | Beginn Dialog – Zugriff verweigert; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E036 | 00:03:07.930 | section_boundary | Beginn Strophe 3 – Bekannter Client; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E037 | 00:03:17.441 | transient | Spektraler Anstieg, relative Stärke 2.34 | Tag oder Policy-Zeile kurz hervorheben |
| E038 | 00:03:29.490 | section_boundary | Beginn Build – Systemmeldungen; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E039 | 00:03:41.770 | section_boundary | Beginn Final Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E040 | 00:03:50.861 | transient | Spektraler Anstieg, relative Stärke 2.49 | Tag oder Policy-Zeile kurz hervorheben |
| E041 | 00:04:09.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.6 dB | Traffic-Pfad und Policy-Prüfung öffnen |
| E042 | 00:04:11.800 | section_boundary | Beginn Outro – Systemmeldungen; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E043 | 00:04:12.251 | transient | Spektraler Anstieg, relative Stärke 2.22 | Tag oder Policy-Zeile kurz hervorheben |
| E044 | 00:04:33.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.5 dB | Traffic-Pfad und Policy-Prüfung öffnen |
| E045 | 00:04:33.120 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E046 | 00:04:33.120 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E047 | 00:04:35.341 | transient | Spektraler Anstieg, relative Stärke 2.35 | Tag oder Policy-Zeile kurz hervorheben |
| E048 | 00:04:42.000 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E049 | 00:04:44.400 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -50.5 dB | Zugriff auf eine Policy-Entscheidung konzentrieren |
| E050 | 00:04:48.000 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1413 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 5 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:04:33.120; danach läuft das Originalaudio bis 00:04:48.000. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt die finale Release-Datei. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Dieser Analyselauf erzeugt keine Videos oder Drehbücher.
Audioformat: WAV; decodierte Dauer 288.000000000 s; Containerdauer 288.000000000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Historisches automatisches TrustSec-Transkript; in diesem Lauf nicht erneut bewertet.
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Network-Engineer-Album02/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| – | – | Keine expliziten Prüfmarkierungen; keine manuelle Hörprüfung | – |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
