# TOKEN BURN · DE – Audioanalyse

**Wichtigste Erkenntnisse:** 245.934 s, geschätzte 136.0 BPM (mittel), -13.0 LUFS und 0.3 dBTP. Letzte transkribierte Stimme bei 00:03:47.840; Audioende bei 00:04:05.934.

## Datei und Pegel

- Quelle: `Token Burn - DE.wav`; SHA-256 `966d9277add83aae86221f708dc00efd286b8b83c8e2afa1739847613781c9de`. Finale Release-Datei laut STATUS: Final und RELEASE AUDIO im 1.0-Prompt; Transkript-SHA und decodierte Dauer geprüft.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 11804808 Samples je Kanal; Dauer 245.933500000 s.
- Sample-Peak 0.0 dBFS bei 00:02:17.215; pro Kanal [-0.595, 0.0] dBFS. True Peak 0.3 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -14.318 dBFS; Crest 14.318 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -13.0 LUFS; LRA 6.3 LU.
- Vollaussteuerungs-Kandidaten: 4; DC-Offset je Kanal [-2.8e-06, 2.73e-05]; globale Stereo-Korrelation 0.9334. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 136.4 BPM; phasenoptimierte Rasterbewertung: 136.0 BPM. Empfohlen: 136.0 BPM; Alternativen [68.0, 272.0, 108.8, 90.6]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.221 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 136.4 BPM, 00:00:30.000–00:01:00.000: 136.4 BPM, 00:01:00.000–00:01:30.000: 136.4 BPM, 00:01:30.000–00:02:00.000: 136.4 BPM, 00:02:00.000–00:02:30.000: 68.2 BPM, 00:02:30.000–00:03:00.000: 68.2 BPM, 00:03:00.000–00:03:30.000: 68.2 BPM, 00:03:30.000–00:04:00.000: 136.4 BPM, 00:04:00.000–00:04:05.934: 136.4 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 33.20 % |
| bass_60_250 | 60–250 Hz | 39.55 % |
| lowmid_250_500 | 250–500 Hz | 10.72 % |
| mid_500_2000 | 500–2000 Hz | 13.61 % |
| presence_2000_6000 | 2000–6000 Hz | 1.35 % |
| high_6000_12000 | 6000–12000 Hz | 1.18 % |
| air_12000_20000 | 12000–20000 Hz | 0.38 % |

Mittlerer spektraler Schwerpunkt 683.8 Hz, 85-%-Rolloff 1105.5 Hz. Auffällige Langzeit-Peaks: [46.9, 175.8, 351.6, 257.8, 691.4, 527.3, 609.4, 433.6, 304.7, 785.2, 867.2] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:09.180 | Vorlauf | -22.69 | -6.76 | 657.7 |
| 00:00:09.180–00:00:14.140 | Intro | -21.98 | -4.19 | 1111.5 |
| 00:00:14.140–00:00:28.560 | Instrumental | -14.77 | -3.29 | 301.3 |
| 00:00:28.560–00:00:56.560 | Verse 1 | -16.86 | -1.21 | 647.6 |
| 00:00:56.560–00:01:03.040 | Instrumental | -13.74 | -1.93 | 392.7 |
| 00:01:03.040–00:01:18.660 | Pre-Chorus | -17.84 | -0.87 | 708.5 |
| 00:01:18.660–00:01:40.840 | Chorus 1 | -12.44 | -0.27 | 501.7 |
| 00:01:40.840–00:01:55.080 | Instrumental | -14.08 | -0.94 | 592.9 |
| 00:01:55.080–00:02:22.260 | Verse 2 | -12.78 | 0.0 | 633.8 |
| 00:02:22.260–00:02:44.280 | Chorus 2 | -13.14 | -0.16 | 663.2 |
| 00:02:44.280–00:02:51.580 | Instrumental | -16.57 | -2.12 | 556.0 |
| 00:02:51.580–00:03:08.460 | Bridge | -17.5 | -0.88 | 1004.8 |
| 00:03:08.460–00:03:29.980 | Chorus 3 | -12.92 | -0.44 | 834.3 |
| 00:03:29.980–00:03:35.600 | Instrumental | -11.44 | -1.22 | 583.2 |
| 00:03:35.600–00:03:47.840 | Outro | -16.45 | -1.3 | 1211.1 |
| 00:03:47.840–00:04:05.934 | Instrumental | -13.24 | 0.0 | 704.5 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:09.180 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E003 | 00:00:13.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.7 dB | Prompt-, Build- und Exportansicht öffnen |
| E004 | 00:00:14.140 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:14.200 | level_gap | 100-ms-RMS -37.7 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E006 | 00:00:28.560 | section_boundary | Beginn Verse 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E007 | 00:00:56.560 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E008 | 00:00:59.771 | transient | Spektraler Anstieg, relative Stärke 1.97 | Token- oder Cursorimpuls hervorheben |
| E009 | 00:01:03.040 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E010 | 00:01:03.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.9 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E011 | 00:01:18.660 | section_boundary | Beginn Chorus 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E012 | 00:01:18.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.3 dB | Prompt-, Build- und Exportansicht öffnen |
| E013 | 00:01:21.831 | transient | Spektraler Anstieg, relative Stärke 2.43 | Token- oder Cursorimpuls hervorheben |
| E014 | 00:01:28.891 | transient | Spektraler Anstieg, relative Stärke 2.67 | Token- oder Cursorimpuls hervorheben |
| E015 | 00:01:36.900 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.3 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E016 | 00:01:39.481 | transient | Spektraler Anstieg, relative Stärke 2.43 | Token- oder Cursorimpuls hervorheben |
| E017 | 00:01:40.840 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E018 | 00:01:50.511 | transient | Spektraler Anstieg, relative Stärke 1.91 | Token- oder Cursorimpuls hervorheben |
| E019 | 00:01:54.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.5 dB | Prompt-, Build- und Exportansicht öffnen |
| E020 | 00:01:55.080 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E021 | 00:01:58.011 | transient | Spektraler Anstieg, relative Stärke 3.08 | Token- oder Cursorimpuls hervorheben |
| E022 | 00:02:07.721 | transient | Spektraler Anstieg, relative Stärke 2.40 | Token- oder Cursorimpuls hervorheben |
| E023 | 00:02:08.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.0 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E024 | 00:02:13.901 | transient | Spektraler Anstieg, relative Stärke 2.43 | Token- oder Cursorimpuls hervorheben |
| E025 | 00:02:21.900 | level_gap | 100-ms-RMS -36.8 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E026 | 00:02:22.260 | section_boundary | Beginn Chorus 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E027 | 00:02:22.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +8.6 dB | Prompt-, Build- und Exportansicht öffnen |
| E028 | 00:02:33.311 | transient | Spektraler Anstieg, relative Stärke 1.91 | Token- oder Cursorimpuls hervorheben |
| E029 | 00:02:41.251 | transient | Spektraler Anstieg, relative Stärke 2.04 | Token- oder Cursorimpuls hervorheben |
| E030 | 00:02:44.280 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E031 | 00:02:50.800 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.0 dB | Prompt-, Build- und Exportansicht öffnen |
| E032 | 00:02:51.580 | section_boundary | Beginn Bridge; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E033 | 00:03:02.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.9 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E034 | 00:03:08.460 | section_boundary | Beginn Chorus 3; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E035 | 00:03:21.841 | transient | Spektraler Anstieg, relative Stärke 2.07 | Token- oder Cursorimpuls hervorheben |
| E036 | 00:03:29.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.2 dB | Prompt-, Build- und Exportansicht öffnen |
| E037 | 00:03:29.980 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E038 | 00:03:35.600 | section_boundary | Beginn Outro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E039 | 00:03:36.841 | transient | Spektraler Anstieg, relative Stärke 2.28 | Token- oder Cursorimpuls hervorheben |
| E040 | 00:03:44.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -9.6 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E041 | 00:03:47.840 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E042 | 00:03:47.840 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E043 | 00:03:47.871 | transient | Spektraler Anstieg, relative Stärke 2.13 | Token- oder Cursorimpuls hervorheben |
| E044 | 00:04:00.000 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E045 | 00:04:01.551 | transient | Spektraler Anstieg, relative Stärke 1.94 | Token- oder Cursorimpuls hervorheben |
| E046 | 00:04:04.500 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -12.6 dB | Uhr, Kaffee und aktiven Cursor ruhig zeigen |
| E047 | 00:04:05.934 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1789 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 2 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:47.840; danach läuft das Originalaudio bis 00:04:05.934. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt die finale Release-Datei. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Dieser Analyselauf erzeugt keine Videos oder Drehbücher.
Audioformat: WAV; decodierte Dauer 245.933500000 s; Containerdauer 245.933500000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatische ASR mit Lyrics-Abgleich; keine manuelle Hörprüfung; markierte Stellen vor Video-Endabnahme prüfen
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Vibecoder/02_Token_Burn/final/de/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L003 | 00:00:28.560–00:00:31.140 | Die Uhr zeigt eins, der Build ist da, | review_required |
| L008 | 00:00:46.260–00:00:49.700 | wir stelln die Speicherlogik um. | review_required |
| L015 | 00:01:18.660–00:01:19.900 | Token Burn. | review_required |
| L017 | 00:01:25.740–00:01:27.020 | Token Burn. | review_required |
| L018 | 00:01:29.140–00:01:29.980 | dass ich den... | review_required |
| L019 | 00:01:30.320–00:01:32.100 | Am nächsten Stand hier seh | review_required |
| L021 | 00:01:36.160–00:01:40.840 | nur dieser eine muss was sein | review_required |
| L022 | 00:01:55.080–00:01:57.800 | Die Uhr zeigt drei, der Raum bleibt klein, | review_required |
| L023 | 00:01:58.680–00:01:59.440 | auf meinem Screen | review_required |
| L024 | 00:02:00.540–00:02:04.560 | Pass nein nein ein Nutzbord fehlt der nächste | review_required |
| L025 | 00:02:04.560–00:02:04.940 | Lauf | review_required |
| L026 | 00:02:05.480–00:02:08.580 | Und meine letzte Frage auf | review_required |
| L028 | 00:02:12.100–00:02:15.820 | die nächste Frage längst zur Hand. | review_required |
| L029 | 00:02:15.960–00:02:19.280 | Ich wollte früher fertig sein, | review_required |
| L031 | 00:02:22.260–00:02:23.220 | Token Burn. | review_required |
| L032 | 00:02:25.820–00:02:30.340 | Noch ein Punkt bevor ich geh tot Burn | review_required |
| L033 | 00:02:32.600–00:02:35.540 | dass ich den nächsten Stand hier seh | review_required |
| L034 | 00:02:36.160–00:02:39.040 | Ein Tab geht zu, zwei kommen rein, | review_required |
| L038 | 00:02:58.660–00:03:01.320 | Der Satz von vorhin bleibt bei mir: | review_required |
| L040 | 00:03:08.460–00:03:09.100 | Token Burn. | review_required |
| L041 | 00:03:11.680–00:03:14.380 | Noch ein Punkt bevor ich geh | review_required |
| L042 | 00:03:15.180–00:03:16.520 | Token Burn. | review_required |
| L044 | 00:03:22.060–00:03:24.920 | Ein Tab geht zu, zwei kommen rein, | review_required |
| L045 | 00:03:25.540–00:03:29.980 | Und dieser Einer muss noch sein | review_required |
| L046 | 00:03:35.600–00:03:40.720 | Ein letzter Prompt steht jetzt bereit. | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
