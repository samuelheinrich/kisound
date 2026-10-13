# VIBECODER · DE – Audioanalyse

**Wichtigste Erkenntnisse:** 216.240 s, geschätzte 133.0 BPM (mittel), -14.8 LUFS und -2.8 dBTP. Letzte transkribierte Stimme bei 00:03:35.200; Audioende bei 00:03:36.240.

## Datei und Pegel

- Quelle: `01_Vibecoder_suno-0.1_50_50_exakt_off_DE.wav`; SHA-256 `2a32ee2e01c429f1a051cfe913448576d7e6615930567220aca48feada845d97`. Finale Release-Datei laut STATUS: Final und RELEASE AUDIO im 1.0-Prompt; Transkript-SHA und decodierte Dauer geprüft.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 10379520 Samples je Kanal; Dauer 216.240000000 s.
- Sample-Peak -2.757 dBFS bei 00:02:52.026; pro Kanal [-2.826, -2.757] dBFS. True Peak -2.8 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -15.49 dBFS; Crest 12.733 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -14.8 LUFS; LRA 5.9 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-0.0001475, -9.54e-05]; globale Stereo-Korrelation 0.9415. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 133.3 BPM; phasenoptimierte Rasterbewertung: 133.0 BPM. Empfohlen: 133.0 BPM; Alternativen [66.5, 266.0, 76.0, 106.4]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.15 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 133.3 BPM, 00:00:30.000–00:01:00.000: 133.3 BPM, 00:01:00.000–00:01:30.000: 133.3 BPM, 00:01:30.000–00:02:00.000: 133.3 BPM, 00:02:00.000–00:02:30.000: 133.3 BPM, 00:02:30.000–00:03:00.000: 133.3 BPM, 00:03:00.000–00:03:30.000: 133.3 BPM, 00:03:30.000–00:03:36.240: 133.3 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 56.85 % |
| bass_60_250 | 60–250 Hz | 26.26 % |
| lowmid_250_500 | 250–500 Hz | 7.79 % |
| mid_500_2000 | 500–2000 Hz | 5.41 % |
| presence_2000_6000 | 2000–6000 Hz | 1.69 % |
| high_6000_12000 | 6000–12000 Hz | 1.40 % |
| air_12000_20000 | 12000–20000 Hz | 0.60 % |

Mittlerer spektraler Schwerpunkt 721.4 Hz, 85-%-Rolloff 1199.5 Hz. Auffällige Langzeit-Peaks: [46.9, 152.3, 105.5, 210.9, 304.7, 410.2, 515.6] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:08.000 | Intro | -22.76 | -5.52 | 600.4 |
| 00:00:08.000–00:00:21.000 | Instrumentaler Vorlauf | -21.04 | -5.27 | 647.0 |
| 00:00:21.000–00:00:36.000 | Verse 1 | -16.71 | -5.82 | 509.8 |
| 00:00:36.000–00:00:49.000 | Build | -20.73 | -4.23 | 994.2 |
| 00:00:49.000–00:01:20.000 | Drop 1 | -16.47 | -2.83 | 880.4 |
| 00:01:20.000–00:01:33.000 | Instrumental Break | -14.72 | -4.91 | 538.9 |
| 00:01:33.000–00:02:01.900 | Verse 2 | -15.89 | -3.54 | 766.4 |
| 00:02:01.900–00:02:25.000 | Drop 2 | -14.73 | -3.06 | 476.8 |
| 00:02:25.000–00:02:37.800 | Bridge | -20.62 | -3.06 | 1157.8 |
| 00:02:37.800–00:03:10.000 | Final Drop | -13.35 | -2.76 | 738.2 |
| 00:03:10.000–00:03:36.240 | Outro | -13.14 | -2.88 | 619.3 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:06.200 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.8 dB | Prompt-, Test- und Prototypansicht öffnen |
| E003 | 00:00:08.000 | section_boundary | Beginn Instrumentaler Vorlauf; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E004 | 00:00:21.000 | section_boundary | Beginn Verse 1; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:36.000 | section_boundary | Beginn Build; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E006 | 00:00:36.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.9 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E007 | 00:00:49.000 | section_boundary | Beginn Drop 1; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E008 | 00:00:49.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +7.6 dB | Prompt-, Test- und Prototypansicht öffnen |
| E009 | 00:00:52.921 | transient | Spektraler Anstieg, relative Stärke 2.15 | Cursor- oder Bassimpuls hervorheben |
| E010 | 00:01:06.001 | transient | Spektraler Anstieg, relative Stärke 2.13 | Cursor- oder Bassimpuls hervorheben |
| E011 | 00:01:13.671 | transient | Spektraler Anstieg, relative Stärke 2.21 | Cursor- oder Bassimpuls hervorheben |
| E012 | 00:01:19.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.9 dB | Prompt-, Test- und Prototypansicht öffnen |
| E013 | 00:01:20.000 | section_boundary | Beginn Instrumental Break; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E014 | 00:01:29.011 | transient | Spektraler Anstieg, relative Stärke 2.64 | Cursor- oder Bassimpuls hervorheben |
| E015 | 00:01:31.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.8 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E016 | 00:01:33.000 | section_boundary | Beginn Verse 2; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E017 | 00:01:47.961 | transient | Spektraler Anstieg, relative Stärke 2.13 | Cursor- oder Bassimpuls hervorheben |
| E018 | 00:02:01.900 | section_boundary | Beginn Drop 2; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:02:02.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +9.1 dB | Prompt-, Test- und Prototypansicht öffnen |
| E020 | 00:02:04.651 | transient | Spektraler Anstieg, relative Stärke 2.10 | Cursor- oder Bassimpuls hervorheben |
| E021 | 00:02:12.771 | transient | Spektraler Anstieg, relative Stärke 2.09 | Cursor- oder Bassimpuls hervorheben |
| E022 | 00:02:23.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.3 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E023 | 00:02:24.051 | transient | Spektraler Anstieg, relative Stärke 2.36 | Cursor- oder Bassimpuls hervorheben |
| E024 | 00:02:25.000 | section_boundary | Beginn Bridge; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E025 | 00:02:37.800 | section_boundary | Beginn Final Drop; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E026 | 00:02:38.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +8.1 dB | Prompt-, Test- und Prototypansicht öffnen |
| E027 | 00:02:43.901 | transient | Spektraler Anstieg, relative Stärke 2.16 | Cursor- oder Bassimpuls hervorheben |
| E028 | 00:02:51.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.9 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E029 | 00:02:52.921 | transient | Spektraler Anstieg, relative Stärke 2.30 | Cursor- oder Bassimpuls hervorheben |
| E030 | 00:02:59.241 | transient | Spektraler Anstieg, relative Stärke 2.03 | Cursor- oder Bassimpuls hervorheben |
| E031 | 00:03:07.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.4 dB | Prompt-, Test- und Prototypansicht öffnen |
| E032 | 00:03:10.000 | section_boundary | Beginn Outro; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E033 | 00:03:12.771 | transient | Spektraler Anstieg, relative Stärke 2.05 | Cursor- oder Bassimpuls hervorheben |
| E034 | 00:03:19.541 | transient | Spektraler Anstieg, relative Stärke 2.13 | Cursor- oder Bassimpuls hervorheben |
| E035 | 00:03:21.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -13.1 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E036 | 00:03:23.400 | level_gap | 100-ms-RMS -39.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E037 | 00:03:29.011 | transient | Spektraler Anstieg, relative Stärke 2.32 | Cursor- oder Bassimpuls hervorheben |
| E038 | 00:03:30.300 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E039 | 00:03:34.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -12.7 dB | Arbeitsraum und ruhigen Cursor zeigen |
| E040 | 00:03:35.200 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E041 | 00:03:36.240 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1301 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 1 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:35.200; danach läuft das Originalaudio bis 00:03:36.240. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt die finale Release-Datei. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Dieser Analyselauf erzeugt keine Videos oder Drehbücher.
Audioformat: WAV; decodierte Dauer 216.240000000 s; Containerdauer 216.240000000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Zwei lokale Whisper-Läufe plus unabhängige kurze Fenster; redaktioneller Lyrics-Abgleich ohne manuelle Hörprüfung. Markierte Stellen vor finalen Untertiteln prüfen.
Quellbericht: `/Users/samuel.heinrich/0004_git/kisound/music/kisound/Vibecoder/01_Vibecoder/final/de/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L002 | 00:00:21.120–00:00:24.580 | Acht Uhr. Export hängt fest. | review_required |
| L003 | 00:00:24.580–00:00:28.140 | Kaffee kalt. Die Uhr macht Stress. | review_required |
| L004 | 00:00:28.140–00:00:31.660 | Prompt rein. Skript an. Daten klar. | review_required |
| L008 | 00:00:42.620–00:00:48.080 | Unter der Haube: Blackbox-Schicht. Ich seh den Weg. | review_required |
| L009 | 00:00:48.080–00:00:49.560 | Die Drähte nicht. | review_required |
| L010 | 00:00:49.580–00:00:53.940 | Ich bin Vibecoder! Ich sag's, er baut's, ich test's, er fixt's. | review_required |
| L011 | 00:00:56.380–00:00:58.060 | Ich bin Vibecoder! | review_required |
| L013 | 00:01:03.200–00:01:05.280 | Ich bin Vibecoder! | review_required |
| L014 | 00:01:05.480–00:01:08.400 | Ich sag's, er baut's, ich test's, er fixt's. | review_required |
| L015 | 00:01:08.360–00:01:11.680 | Ein Diff, ein Test, ein Commit, und die nächste Idee blitzt. | review_required |
| L016 | 00:01:17.620–00:01:19.700 | Ich bin Vibecoder! | review_required |
| L018 | 00:01:36.640–00:01:40.400 | Ich schreib den Sound, der heute knallt. | review_required |
| L020 | 00:01:43.860–00:01:47.440 | der Bass rollt mit von Ort zu Ort. | review_required |
| L021 | 00:01:47.440–00:01:50.900 | Abends. App gesucht. Store voll. | review_required |
| L025 | 00:02:01.960–00:02:03.000 | Ich bin Vibecoder! | review_required |
| L026 | 00:02:03.000–00:02:06.220 | Ich sag's, er baut's, ich test's, er fixt's. | review_required |
| L027 | 00:02:06.220–00:02:10.200 | Ich bin Vibecoder! | review_required |
| L029 | 00:02:15.900–00:02:17.480 | Ich bin Vibecoder! | review_required |
| L030 | 00:02:17.480–00:02:20.500 | Ich sag's, er baut's, ich test's, er fixt's. | review_required |
| L031 | 00:02:20.620–00:02:23.860 | Ein Diff, ein Test, ein Commit, und die nächste Idee blitzt. | review_required |
| L036 | 00:02:37.840–00:02:39.400 | Ich bin Vibecoder! | review_required |
| L037 | 00:02:42.340–00:02:45.220 | Die neue Generation ist laut. | review_required |
| L038 | 00:02:45.460–00:02:46.260 | Ich bin Vibecoder! | review_required |
| L039 | 00:02:49.480–00:02:53.020 | Bass rollt durch. Bass rollt durch. Bass rollt durch. Bass rollt durch. | review_required |
| L040 | 00:02:53.020–00:02:55.300 | Ein Wunsch. Ein Prompt. Ein neuer Build. | review_required |
| L041 | 00:02:55.300–00:02:58.980 | Lass ihn rollen. Lass ihn rollen. Rollen, rollen, rollen, rollen. | review_required |
| L042 | 00:02:58.980–00:03:00.620 | Ich bin Vibecoder! | review_required |
| L043 | 00:03:03.840–00:03:07.340 | Bass rollt durch. Bass rollt durch. Bass rollt durch. Bass rollt durch. | review_required |
| L044 | 00:03:10.400–00:03:11.520 | Prompt. Run. Check. Go. | review_required |
| L045 | 00:03:13.800–00:03:14.920 | Bass rollt durch. | review_required |
| L046 | 00:03:22.460–00:03:24.180 | Prompt. Run. Check. Go. | review_required |
| L047 | 00:03:31.880–00:03:35.200 | Prompt. Run. Check. Go. | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
