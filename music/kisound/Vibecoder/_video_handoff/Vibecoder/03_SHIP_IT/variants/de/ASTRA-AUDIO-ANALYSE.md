# SHIP IT · DE – Audioanalyse

**Wichtigste Erkenntnisse:** 155.960 s, geschätzte 70.0 BPM (mittel), -14.8 LUFS und -2.9 dBTP. Letzte transkribierte Stimme bei 00:02:34.000; Audioende bei 00:02:35.960.

## Datei und Pegel

- Quelle: `03_SHIP_IT_suno-v3_50_50_exakt_off_DE.wav`; SHA-256 `689d662c3d10ba9bd08c787315635ff4bba6d97f8a5db54343486dd4c7958259`. Finale Release-Datei laut STATUS: Final und RELEASE AUDIO im 1.0-Prompt; Transkript-SHA und decodierte Dauer geprüft.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 7486080 Samples je Kanal; Dauer 155.960000000 s.
- Sample-Peak -2.895 dBFS bei 00:01:18.634; pro Kanal [-2.895, -2.904] dBFS. True Peak -2.9 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -16.708 dBFS; Crest 13.813 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -14.8 LUFS; LRA 6.1 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [2.41e-05, 4.35e-05]; globale Stereo-Korrelation 0.8514. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 139.5 BPM; phasenoptimierte Rasterbewertung: 70.0 BPM. Empfohlen: 70.0 BPM; Alternativen [35.0, 140.0, 140.0, 93.6]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.643 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 139.5 BPM, 00:00:30.000–00:01:00.000: 69.8 BPM, 00:01:00.000–00:01:30.000: 139.5 BPM, 00:01:30.000–00:02:00.000: 139.5 BPM, 00:02:00.000–00:02:30.000: 70.6 BPM, 00:02:30.000–00:02:35.960: 139.5 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 34.37 % |
| bass_60_250 | 60–250 Hz | 28.47 % |
| lowmid_250_500 | 250–500 Hz | 11.45 % |
| mid_500_2000 | 500–2000 Hz | 17.77 % |
| presence_2000_6000 | 2000–6000 Hz | 5.75 % |
| high_6000_12000 | 6000–12000 Hz | 1.88 % |
| air_12000_20000 | 12000–20000 Hz | 0.32 % |

Mittlerer spektraler Schwerpunkt 930.8 Hz, 85-%-Rolloff 1567.4 Hz. Auffällige Langzeit-Peaks: [46.9, 128.9, 187.5, 492.2, 246.1, 375.0, 738.3, 550.8, 433.6, 293.0, 996.1, 1113.3] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:27.160 | Intro | -20.76 | -5.69 | 797.3 |
| 00:00:27.160–00:00:51.320 | Verse 1 | -19.26 | -3.99 | 1049.8 |
| 00:00:51.320–00:01:18.660 | Chorus 1 | -16.55 | -2.89 | 838.0 |
| 00:01:18.660–00:01:38.780 | Verse 2 | -17.14 | -2.89 | 1160.9 |
| 00:01:38.780–00:01:53.000 | Chorus 2 | -19.9 | -3.64 | 1122.7 |
| 00:01:53.000–00:02:06.000 | Bridge | -12.95 | -4.72 | 592.1 |
| 00:02:06.000–00:02:30.600 | Chorus 3 / instrumental | -14.6 | -3.13 | 1006.6 |
| 00:02:30.600–00:02:35.960 | Outro | -15.2 | -4.5 | 688.9 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:00.100 | level_gap | 100-ms-RMS -86.5 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:06.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.4 dB | Build-, Check- und Live-Ansicht öffnen |
| E004 | 00:00:15.631 | transient | Spektraler Anstieg, relative Stärke 1.91 | Commit- oder Coverimpuls hervorheben |
| E005 | 00:00:22.491 | transient | Spektraler Anstieg, relative Stärke 1.66 | Commit- oder Coverimpuls hervorheben |
| E006 | 00:00:27.160 | section_boundary | Beginn Verse 1; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:00:34.061 | transient | Spektraler Anstieg, relative Stärke 1.82 | Commit- oder Coverimpuls hervorheben |
| E008 | 00:00:41.771 | transient | Spektraler Anstieg, relative Stärke 1.93 | Commit- oder Coverimpuls hervorheben |
| E009 | 00:00:51.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.8 dB | Build-, Check- und Live-Ansicht öffnen |
| E010 | 00:00:51.320 | section_boundary | Beginn Chorus 1; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E011 | 00:00:51.631 | transient | Spektraler Anstieg, relative Stärke 1.89 | Commit- oder Coverimpuls hervorheben |
| E012 | 00:01:01.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.2 dB | Trackliste und Browser ruhig zeigen |
| E013 | 00:01:05.200 | level_gap | 100-ms-RMS -36.2 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E014 | 00:01:05.341 | transient | Spektraler Anstieg, relative Stärke 2.81 | Commit- oder Coverimpuls hervorheben |
| E015 | 00:01:16.051 | transient | Spektraler Anstieg, relative Stärke 2.48 | Commit- oder Coverimpuls hervorheben |
| E016 | 00:01:17.100 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.5 dB | Trackliste und Browser ruhig zeigen |
| E017 | 00:01:18.660 | section_boundary | Beginn Verse 2; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E018 | 00:01:26.331 | transient | Spektraler Anstieg, relative Stärke 2.12 | Commit- oder Coverimpuls hervorheben |
| E019 | 00:01:30.400 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.8 dB | Trackliste und Browser ruhig zeigen |
| E020 | 00:01:35.321 | transient | Spektraler Anstieg, relative Stärke 2.12 | Commit- oder Coverimpuls hervorheben |
| E021 | 00:01:38.780 | section_boundary | Beginn Chorus 2; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E022 | 00:01:38.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.2 dB | Trackliste und Browser ruhig zeigen |
| E023 | 00:01:46.871 | transient | Spektraler Anstieg, relative Stärke 1.95 | Commit- oder Coverimpuls hervorheben |
| E024 | 00:01:52.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.1 dB | Build-, Check- und Live-Ansicht öffnen |
| E025 | 00:01:53.000 | section_boundary | Beginn Bridge; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E026 | 00:01:53.291 | transient | Spektraler Anstieg, relative Stärke 2.60 | Commit- oder Coverimpuls hervorheben |
| E027 | 00:02:04.411 | transient | Spektraler Anstieg, relative Stärke 2.55 | Commit- oder Coverimpuls hervorheben |
| E028 | 00:02:06.000 | section_boundary | Beginn Chorus 3 / instrumental; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E029 | 00:02:06.500 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.0 dB | Trackliste und Browser ruhig zeigen |
| E030 | 00:02:20.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.4 dB | Build-, Check- und Live-Ansicht öffnen |
| E031 | 00:02:20.631 | transient | Spektraler Anstieg, relative Stärke 2.95 | Commit- oder Coverimpuls hervorheben |
| E032 | 00:02:30.000 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E033 | 00:02:30.600 | section_boundary | Beginn Outro; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E034 | 00:02:32.141 | transient | Spektraler Anstieg, relative Stärke 2.67 | Commit- oder Coverimpuls hervorheben |
| E035 | 00:02:34.000 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E036 | 00:02:34.400 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -8.7 dB | Trackliste und Browser ruhig zeigen |
| E037 | 00:02:35.960 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

713 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 2 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:02:34.000; danach läuft das Originalaudio bis 00:02:35.960. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt die finale Release-Datei. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Dieser Analyselauf erzeugt keine Videos oder Drehbücher.
Audioformat: WAV; decodierte Dauer 155.960000000 s; Containerdauer 155.960000000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatische ASR mit Lyrics-Abgleich; keine manuelle Hörprüfung; markierte Stellen vor Video-Endabnahme prüfen
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Vibecoder/03_SHIP_IT/final/de/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L001 | 00:00:08.360–00:00:09.780 | Album drei geht raus. | review_required |
| L002 | 00:00:22.140–00:00:23.540 | Album 3 geht raus | review_required |
| L004 | 00:00:30.260–00:00:33.760 | npm run build, die Seiten stehen nach kurzer Zeit. | review_required |
| L006 | 00:00:36.940–00:00:40.380 | ein Cover fehlt, der Dateiname nicht so, wie er war. | review_required |
| L007 | 00:00:40.380–00:00:44.700 | Ein Unterstrich zu viel, ich benenn die Datei zurück, | review_required |
| L009 | 00:00:51.320–00:00:54.440 | Komedische B -B -B -Budget -Live | review_required |
| L010 | 00:00:55.120–00:00:56.620 | Komedische B -B -B -B | review_required |
| L011 | 00:00:56.820–00:00:58.220 | Album drei. | review_required |
| L012 | 00:00:58.340–00:01:01.440 | Link geht raus, die Seite lebt | review_required |
| L013 | 00:01:01.440–00:01:05.000 | Play gedrückt, und der Bass still | review_required |
| L014 | 00:01:07.000–00:01:10.340 | Schlecht live, komm mit den Schippen mit den | review_required |
| L015 | 00:01:10.340–00:01:11.540 | Albumen rein | review_required |
| L016 | 00:01:12.000–00:01:15.340 | Der Lied geht raus, die Seite lebt | review_required |
| L017 | 00:01:15.340–00:01:16.480 | Play gedrückt | review_required |
| L018 | 00:01:17.000–00:01:18.660 | Und der Bass still | review_required |
| L022 | 00:01:28.700–00:01:31.280 | Data Reload und Album 3 steht da, der | review_required |
| L023 | 00:01:31.280–00:01:32.260 | Bass knallt | review_required |
| L025 | 00:01:35.380–00:01:38.780 | die Lyrics bleiben im Original, so wie ich sie gemacht. | review_required |
| L026 | 00:01:38.780–00:01:42.240 | Comedy Shippe -Pippe -Pippe -Pippe Check live | review_required |
| L027 | 00:01:42.920–00:01:45.620 | Comedy Shippe -Pippe -Pippe Album 3 | review_required |
| L028 | 00:01:45.620–00:01:49.140 | Der Link geht raus, die Seite leer | review_required |
| L029 | 00:01:49.140–00:01:50.720 | Kegel drückt | review_required |
| L030 | 00:01:50.720–00:01:52.960 | Und der Bass steht | review_required |
| L031 | 00:01:53.000–00:01:53.620 | Tracks. | review_required |
| L032 | 00:01:53.680–00:01:54.240 | Covers. | review_required |
| L033 | 00:01:54.400–00:01:58.440 | Doppelbild, Tische, Pro, Lilo, Lilo, Bäh, Bäh, Bäh, | review_required |
| L034 | 00:01:58.520–00:01:58.980 | Almen. | review_required |
| L035 | 00:02:00.280–00:02:04.760 | Tricks, Cover, Doppelbild, Tische, Pro, Lilo, Lilo, Bäh, | review_required |
| L036 | 00:02:04.900–00:02:05.720 | Bäh, Bäh, Almen. | review_required |
| L037 | 00:02:17.500–00:02:20.280 | Und der Bastel | review_required |
| L038 | 00:02:30.600–00:02:32.620 | Nächste Zeit und nächste | review_required |
| L039 | 00:02:32.620–00:02:34.000 | Komm' auf | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
