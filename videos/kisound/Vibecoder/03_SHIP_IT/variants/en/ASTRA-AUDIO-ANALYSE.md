# SHIP IT · EN – Audioanalyse

**Wichtigste Erkenntnisse:** 120.680 s, geschätzte 140.0 BPM (mittel), -15.7 LUFS und -3.4 dBTP. Letzte transkribierte Stimme bei 00:02:00.080; Audioende bei 00:02:00.680.

## Datei und Pegel

- Quelle: `03_SHIP_IT_suno-v3_50_50_exakt_off_EN.wav`; SHA-256 `fd70e12809ce18389d194a1f3829c98deced25b1c24ade5a24ae81ecf2b05408`. Finale Release-Datei laut STATUS: Final und RELEASE AUDIO im 1.0-Prompt; Transkript-SHA und decodierte Dauer geprüft.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 5792640 Samples je Kanal; Dauer 120.680000000 s.
- Sample-Peak -3.383 dBFS bei 00:01:34.088; pro Kanal [-3.963, -3.383] dBFS. True Peak -3.4 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -16.848 dBFS; Crest 13.465 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -15.7 LUFS; LRA 7.0 LU.
- Vollaussteuerungs-Kandidaten: 0; DC-Offset je Kanal [-0.0001336, 0.0002806]; globale Stereo-Korrelation 0.9605. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 139.5 BPM; phasenoptimierte Rasterbewertung: 140.0 BPM. Empfohlen: 140.0 BPM; Alternativen [70.0, 280.0, 93.4, 70.0]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.036 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 139.5 BPM, 00:00:30.000–00:01:00.000: 139.5 BPM, 00:01:00.000–00:01:30.000: 139.5 BPM, 00:01:30.000–00:02:00.000: 139.5 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 36.77 % |
| bass_60_250 | 60–250 Hz | 44.67 % |
| lowmid_250_500 | 250–500 Hz | 8.05 % |
| mid_500_2000 | 500–2000 Hz | 5.38 % |
| presence_2000_6000 | 2000–6000 Hz | 3.14 % |
| high_6000_12000 | 6000–12000 Hz | 1.62 % |
| air_12000_20000 | 12000–20000 Hz | 0.38 % |

Mittlerer spektraler Schwerpunkt 1024.2 Hz, 85-%-Rolloff 1668.2 Hz. Auffällige Langzeit-Peaks: [58.6, 117.2, 328.1, 234.4] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:14.080 | Intro | -18.24 | -5.53 | 858.3 |
| 00:00:14.080–00:00:33.960 | Verse 1 | -17.35 | -5.39 | 854.9 |
| 00:00:33.960–00:00:48.380 | Chorus 1 | -16.15 | -4.97 | 865.8 |
| 00:00:48.380–00:01:10.020 | Verse 2 | -18.72 | -5.15 | 1269.2 |
| 00:01:10.020–00:01:23.000 | Chorus 2 | -15.69 | -4.45 | 850.9 |
| 00:01:23.000–00:01:30.700 | Bridge | -16.07 | -4.54 | 1117.3 |
| 00:01:30.700–00:01:47.740 | Chorus 3 | -17.45 | -3.38 | 1412.4 |
| 00:01:47.740–00:02:00.680 | Outro | -14.86 | -3.87 | 875.0 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:01.100 | level_gap | 100-ms-RMS -47.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:03.300 | level_gap | 100-ms-RMS -53.9 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E004 | 00:00:03.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +10.0 dB | Build-, Check- und Live-Ansicht öffnen |
| E005 | 00:00:04.311 | transient | Spektraler Anstieg, relative Stärke 2.47 | Commit- oder Coverimpuls hervorheben |
| E006 | 00:00:11.900 | level_gap | 100-ms-RMS -49.5 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E007 | 00:00:13.900 | level_gap | 100-ms-RMS -76.5 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E008 | 00:00:14.080 | section_boundary | Beginn Verse 1; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E009 | 00:00:14.171 | transient | Spektraler Anstieg, relative Stärke 2.00 | Commit- oder Coverimpuls hervorheben |
| E010 | 00:00:14.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +16.0 dB | Build-, Check- und Live-Ansicht öffnen |
| E011 | 00:00:22.741 | transient | Spektraler Anstieg, relative Stärke 2.35 | Commit- oder Coverimpuls hervorheben |
| E012 | 00:00:30.300 | level_gap | 100-ms-RMS -37.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E013 | 00:00:31.271 | transient | Spektraler Anstieg, relative Stärke 1.34 | Commit- oder Coverimpuls hervorheben |
| E014 | 00:00:31.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.6 dB | Build-, Check- und Live-Ansicht öffnen |
| E015 | 00:00:33.960 | section_boundary | Beginn Chorus 1; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E016 | 00:00:37.311 | transient | Spektraler Anstieg, relative Stärke 2.33 | Commit- oder Coverimpuls hervorheben |
| E017 | 00:00:43.311 | transient | Spektraler Anstieg, relative Stärke 2.42 | Commit- oder Coverimpuls hervorheben |
| E018 | 00:00:46.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -8.6 dB | Trackliste und Browser ruhig zeigen |
| E019 | 00:00:47.900 | level_gap | 100-ms-RMS -39.2 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E020 | 00:00:48.380 | section_boundary | Beginn Verse 2; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E021 | 00:00:49.900 | level_gap | 100-ms-RMS -48.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E022 | 00:00:52.741 | transient | Spektraler Anstieg, relative Stärke 2.03 | Commit- oder Coverimpuls hervorheben |
| E023 | 00:00:59.601 | transient | Spektraler Anstieg, relative Stärke 2.43 | Commit- oder Coverimpuls hervorheben |
| E024 | 00:01:00.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -7.9 dB | Trackliste und Browser ruhig zeigen |
| E025 | 00:01:01.200 | level_gap | 100-ms-RMS -38.1 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E026 | 00:01:05.000 | level_gap | 100-ms-RMS -43.9 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E027 | 00:01:08.800 | level_gap | 100-ms-RMS -48.7 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E028 | 00:01:09.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +9.7 dB | Build-, Check- und Live-Ansicht öffnen |
| E029 | 00:01:10.020 | section_boundary | Beginn Chorus 2; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E030 | 00:01:11.171 | transient | Spektraler Anstieg, relative Stärke 2.57 | Commit- oder Coverimpuls hervorheben |
| E031 | 00:01:20.171 | transient | Spektraler Anstieg, relative Stärke 2.75 | Commit- oder Coverimpuls hervorheben |
| E032 | 00:01:21.500 | level_gap | 100-ms-RMS -37.3 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E033 | 00:01:23.000 | section_boundary | Beginn Bridge; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E034 | 00:01:23.500 | level_gap | 100-ms-RMS -41.1 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E035 | 00:01:24.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +10.9 dB | Build-, Check- und Live-Ansicht öffnen |
| E036 | 00:01:28.741 | transient | Spektraler Anstieg, relative Stärke 2.69 | Commit- oder Coverimpuls hervorheben |
| E037 | 00:01:30.700 | section_boundary | Beginn Chorus 3; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E038 | 00:01:35.600 | level_gap | 100-ms-RMS -72.5 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E039 | 00:01:37.700 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +19.8 dB | Build-, Check- und Live-Ansicht öffnen |
| E040 | 00:01:40.741 | transient | Spektraler Anstieg, relative Stärke 2.46 | Commit- oder Coverimpuls hervorheben |
| E041 | 00:01:42.100 | level_gap | 100-ms-RMS -43.0 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E042 | 00:01:44.500 | level_gap | 100-ms-RMS -37.4 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E043 | 00:01:47.740 | section_boundary | Beginn Outro; redaktionelle Songform aus ASR und Musik | Neues Kapitel oder Kameraposition einführen |
| E044 | 00:01:49.311 | transient | Spektraler Anstieg, relative Stärke 2.73 | Commit- oder Coverimpuls hervorheben |
| E045 | 00:01:51.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.0 dB | Trackliste und Browser ruhig zeigen |
| E046 | 00:01:53.800 | level_gap | 100-ms-RMS -79.2 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E047 | 00:01:54.700 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E048 | 00:01:58.741 | transient | Spektraler Anstieg, relative Stärke 3.09 | Commit- oder Coverimpuls hervorheben |
| E049 | 00:01:59.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -19.0 dB | Trackliste und Browser ruhig zeigen |
| E050 | 00:01:59.300 | level_gap | 100-ms-RMS -75.1 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E051 | 00:02:00.080 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E052 | 00:02:00.680 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

513 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 17 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:02:00.080; danach läuft das Originalaudio bis 00:02:00.680. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 1 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt die finale Release-Datei. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Dieser Analyselauf erzeugt keine Videos oder Drehbücher.
Audioformat: WAV; decodierte Dauer 120.680000000 s; Containerdauer 120.680000000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatische ASR mit Lyrics-Abgleich; keine manuelle Hörprüfung; markierte Stellen vor Video-Endabnahme prüfen
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Vibecoder/03_SHIP_IT/final/en/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L001 | 00:00:00.000–00:00:06.960 | Made it, ship it, build, check, live, made | review_required |
| L002 | 00:00:06.960–00:00:10.400 | it, ship it, album three. | review_required |
| L003 | 00:00:10.680–00:00:13.120 | Can free em run, em tring, add a | review_required |
| L004 | 00:00:13.120–00:00:13.800 | steady pace. | review_required |
| L008 | 00:00:24.220–00:00:24.980 | covers missing. | review_required |
| L009 | 00:00:25.200–00:00:27.560 | The filing changed, so it's not here. | review_required |
| L012 | 00:00:33.960–00:00:35.000 | Committed, ship it | review_required |
| L013 | 00:00:35.000–00:00:36.560 | Go check live | review_required |
| L014 | 00:00:37.400–00:00:38.400 | Committed, ship it | review_required |
| L015 | 00:00:38.400–00:00:39.920 | Album, album three | review_required |
| L016 | 00:00:39.920–00:00:41.700 | The link goes three, | review_required |
| L018 | 00:00:44.040–00:00:45.380 | Ah, ah, ah | review_required |
| L019 | 00:00:45.380–00:00:47.380 | Hit play, the bass comes in at last | review_required |
| L020 | 00:00:48.380–00:00:51.560 | Deploy to live, the uploader counts each file, | review_required |
| L023 | 00:00:57.600–00:01:01.000 | hard reload, album three is up, the bass hits bold. | review_required |
| L025 | 00:01:05.180–00:01:08.660 | the lyrics keep their language, just the way I wrote them to. | review_required |
| L026 | 00:01:10.020–00:01:12.600 | Committed, ship it, they'll check live | review_required |
| L027 | 00:01:13.460–00:01:14.800 | Committed, ship it, album, | review_required |
| L028 | 00:01:14.960–00:01:16.940 | Album three. | review_required |
| L029 | 00:01:16.940–00:01:17.700 | link goes out, | review_required |
| L030 | 00:01:17.780–00:01:19.440 | The link goes out, the page loads fast, | review_required |
| L031 | 00:01:23.000–00:01:24.480 | Last, best, best, best | review_required |
| L032 | 00:01:24.480–00:01:25.200 | Tracks, | review_required |
| L034 | 00:01:26.400–00:01:26.720 | Build, | review_required |
| L036 | 00:01:27.200–00:01:27.480 | check, | review_required |
| L038 | 00:01:27.960–00:01:28.460 | Deploy, | review_required |
| L040 | 00:01:28.960–00:01:29.240 | reload, | review_required |
| L042 | 00:01:29.740–00:01:30.080 | Play. | review_required |
| L043 | 00:01:30.200–00:01:30.700 | play, play | review_required |
| L044 | 00:01:30.700–00:01:31.420 | Committed shipping | review_required |
| L045 | 00:01:32.000–00:01:33.160 | Bill check live | review_required |
| L046 | 00:01:34.020–00:01:34.980 | Committed, ship it | review_required |
| L047 | 00:01:34.980–00:01:35.500 | Album, | review_required |
| L048 | 00:01:35.520–00:01:36.480 | Album three. | review_required |
| L049 | 00:01:36.480–00:01:38.260 | The link goes out, | review_required |
| L050 | 00:01:38.360–00:01:40.020 | The link goes out, the page loads fast, | review_required |
| L051 | 00:01:41.700–00:01:43.880 | Hit play, the bass comes in at last | review_required |
| L052 | 00:01:47.740–00:01:48.700 | Commit and shoot it | review_required |
| L054 | 00:01:59.400–00:02:00.080 | Album three | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
