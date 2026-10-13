# 06 ICMP – Audioanalyse

**Wichtigste Erkenntnisse:** 216.774 s, geschätzte 128.0 BPM (mittel), -14.3 LUFS und 0.0 dBTP. Letzte transkribierte Stimme bei 00:03:19.620; Audioende bei 00:03:36.774.

## Datei und Pegel

- Quelle: `06_ICMP_1.0.wav`; SHA-256 `1acad3bf8ff6addcf656e2b92cb0273c123230c70dfb2ce3b36f1a5b780ac823`. Die Zuordnung stützt sich auf `source_audio`, Transkript-SHA und decodierte Dauer; noch keine finale Release-Auswahl.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 10405128 Samples je Kanal; Dauer 216.773500000 s.
- Sample-Peak -0.0 dBFS bei 00:02:23.181; pro Kanal [-0.744, -0.0] dBFS. True Peak 0.0 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -15.464 dBFS; Crest 15.463 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -14.3 LUFS; LRA 6.6 LU.
- Vollaussteuerungs-Kandidaten: 3; DC-Offset je Kanal [7.7e-06, -1.2e-06]; globale Stereo-Korrelation 0.8778. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 127.7 BPM; phasenoptimierte Rasterbewertung: 128.0 BPM. Empfohlen: 128.0 BPM; Alternativen [64.0, 256.0, 102.4, 96.0]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.195 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 127.7 BPM, 00:00:30.000–00:01:00.000: 127.7 BPM, 00:01:00.000–00:01:30.000: 127.7 BPM, 00:01:30.000–00:02:00.000: 127.7 BPM, 00:02:00.000–00:02:30.000: 127.7 BPM, 00:02:30.000–00:03:00.000: 127.7 BPM, 00:03:00.000–00:03:30.000: 127.7 BPM, 00:03:30.000–00:03:36.774: 127.7 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 44.53 % |
| bass_60_250 | 60–250 Hz | 33.23 % |
| lowmid_250_500 | 250–500 Hz | 8.33 % |
| mid_500_2000 | 500–2000 Hz | 9.72 % |
| presence_2000_6000 | 2000–6000 Hz | 1.82 % |
| high_6000_12000 | 6000–12000 Hz | 1.80 % |
| air_12000_20000 | 12000–20000 Hz | 0.56 % |

Mittlerer spektraler Schwerpunkt 801.5 Hz, 85-%-Rolloff 1260.0 Hz. Auffällige Langzeit-Peaks: [46.9, 152.3, 257.8, 351.6, 515.6, 691.4, 304.7, 609.4, 785.2] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:07.580 | Vorlauf | -22.19 | -5.07 | 607.1 |
| 00:00:07.580–00:00:19.660 | Intro | -21.77 | -4.52 | 1056.2 |
| 00:00:19.660–00:00:25.760 | Instrumental | -16.04 | -4.74 | 332.1 |
| 00:00:25.760–00:01:00.600 | Verse 1 | -16.35 | -0.11 | 774.5 |
| 00:01:00.600–00:01:15.620 | Chorus | -16.0 | -0.93 | 748.7 |
| 00:01:15.620–00:01:38.080 | Verse 2 | -15.91 | -0.93 | 1116.6 |
| 00:01:38.080–00:01:52.660 | Hook | -16.67 | -1.65 | 921.7 |
| 00:01:52.660–00:02:16.540 | Verse 3 | -15.19 | -1.37 | 1046.1 |
| 00:02:16.540–00:02:32.200 | Chorus | -13.88 | -0.0 | 660.7 |
| 00:02:32.200–00:02:49.620 | Verse 4 | -17.44 | -1.79 | 1065.8 |
| 00:02:49.620–00:03:04.780 | Final Chorus | -13.37 | -0.91 | 719.0 |
| 00:03:04.780–00:03:10.640 | Instrumental | -13.43 | -1.17 | 343.2 |
| 00:03:10.640–00:03:19.620 | Outro | -15.35 | -0.54 | 615.1 |
| 00:03:19.620–00:03:36.774 | Instrumental | -12.83 | -1.55 | 325.4 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:00.100 | level_gap | 100-ms-RMS -88.3 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:01.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.6 dB | Pfad und zugehörige ICMP-Rückmeldung öffnen |
| E004 | 00:00:07.580 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:16.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.7 dB | Pfad und zugehörige ICMP-Rückmeldung öffnen |
| E006 | 00:00:19.660 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:00:25.760 | section_boundary | Beginn Verse 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E008 | 00:00:26.451 | transient | Spektraler Anstieg, relative Stärke 2.45 | Signal oder Rückmeldung am Pfad hervorheben |
| E009 | 00:00:59.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.3 dB | Pfad und zugehörige ICMP-Rückmeldung öffnen |
| E010 | 00:01:00.600 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E011 | 00:01:13.331 | transient | Spektraler Anstieg, relative Stärke 2.60 | Signal oder Rückmeldung am Pfad hervorheben |
| E012 | 00:01:14.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.6 dB | Auf einen einzelnen Pfadtest konzentrieren |
| E013 | 00:01:14.600 | level_gap | 100-ms-RMS -42.3 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E014 | 00:01:15.620 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E015 | 00:01:29.400 | level_gap | 100-ms-RMS -40.2 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E016 | 00:01:30.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.7 dB | Pfad und zugehörige ICMP-Rückmeldung öffnen |
| E017 | 00:01:31.141 | transient | Spektraler Anstieg, relative Stärke 2.85 | Signal oder Rückmeldung am Pfad hervorheben |
| E018 | 00:01:38.080 | section_boundary | Beginn Hook; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:01:40.051 | transient | Spektraler Anstieg, relative Stärke 2.51 | Signal oder Rückmeldung am Pfad hervorheben |
| E020 | 00:01:45.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.7 dB | Pfad und zugehörige ICMP-Rückmeldung öffnen |
| E021 | 00:01:47.081 | transient | Spektraler Anstieg, relative Stärke 2.50 | Signal oder Rückmeldung am Pfad hervorheben |
| E022 | 00:01:52.660 | section_boundary | Beginn Verse 3; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E023 | 00:02:02.081 | transient | Spektraler Anstieg, relative Stärke 2.66 | Signal oder Rückmeldung am Pfad hervorheben |
| E024 | 00:02:05.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -8.7 dB | Auf einen einzelnen Pfadtest konzentrieren |
| E025 | 00:02:06.300 | level_gap | 100-ms-RMS -41.7 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E026 | 00:02:13.331 | transient | Spektraler Anstieg, relative Stärke 2.55 | Signal oder Rückmeldung am Pfad hervorheben |
| E027 | 00:02:16.540 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E028 | 00:02:16.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +6.0 dB | Pfad und zugehörige ICMP-Rückmeldung öffnen |
| E029 | 00:02:21.771 | transient | Spektraler Anstieg, relative Stärke 2.58 | Signal oder Rückmeldung am Pfad hervorheben |
| E030 | 00:02:27.861 | transient | Spektraler Anstieg, relative Stärke 2.66 | Signal oder Rückmeldung am Pfad hervorheben |
| E031 | 00:02:31.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.4 dB | Auf einen einzelnen Pfadtest konzentrieren |
| E032 | 00:02:31.500 | level_gap | 100-ms-RMS -47.9 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E033 | 00:02:32.200 | section_boundary | Beginn Verse 4; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E034 | 00:02:44.600 | level_gap | 100-ms-RMS -35.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E035 | 00:02:47.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.6 dB | Pfad und zugehörige ICMP-Rückmeldung öffnen |
| E036 | 00:02:48.021 | transient | Spektraler Anstieg, relative Stärke 2.41 | Signal oder Rückmeldung am Pfad hervorheben |
| E037 | 00:02:49.620 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E038 | 00:02:58.331 | transient | Spektraler Anstieg, relative Stärke 2.46 | Signal oder Rückmeldung am Pfad hervorheben |
| E039 | 00:03:02.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -8.5 dB | Auf einen einzelnen Pfadtest konzentrieren |
| E040 | 00:03:03.300 | level_gap | 100-ms-RMS -39.7 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E041 | 00:03:04.780 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E042 | 00:03:10.521 | transient | Spektraler Anstieg, relative Stärke 2.62 | Signal oder Rückmeldung am Pfad hervorheben |
| E043 | 00:03:10.640 | section_boundary | Beginn Outro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E044 | 00:03:17.081 | transient | Spektraler Anstieg, relative Stärke 2.71 | Signal oder Rückmeldung am Pfad hervorheben |
| E045 | 00:03:19.620 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E046 | 00:03:19.620 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E047 | 00:03:26.461 | transient | Spektraler Anstieg, relative Stärke 2.71 | Signal oder Rückmeldung am Pfad hervorheben |
| E048 | 00:03:32.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.8 dB | Auf einen einzelnen Pfadtest konzentrieren |
| E049 | 00:03:36.774 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1258 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 7 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:19.620; danach läuft das Originalaudio bis 00:03:36.774. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

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
| L004 | 00:00:16.660–00:00:19.660 | Hör hin. | review_required |
| L011 | 00:00:49.360–00:00:51.660 | Ein Ping sagt nicht, ob deine App auch will. | review_required |
| L026 | 00:01:26.620–00:01:28.600 | Fragmentation Needed. | review_required |
| L037 | 00:01:48.320–00:01:49.880 | Mehr als ein Ping. | review_required |
| L039 | 00:01:56.960–00:02:00.020 | die TTL läuft unterwegs aus. | review_required |
| L046 | 00:02:11.780–00:02:13.100 | Ein Fehler hat dir mehr zu sagen | review_required |
| L074 | 00:03:11.800–00:03:15.780 | Du kennst jetzt mehr. | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
