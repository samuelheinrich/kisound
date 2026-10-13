# 04 Broadcast Storm – Audioanalyse

**Wichtigste Erkenntnisse:** 208.814 s, geschätzte 175.0 BPM (mittel), -12.7 LUFS und 0.0 dBTP. Letzte transkribierte Stimme bei 00:03:06.720; Audioende bei 00:03:28.814.

## Datei und Pegel

- Quelle: `04_Broadcast_Storm_1.0.wav`; SHA-256 `00a640de0f76551e27719ad0c4c0f106133fd26c4d33f4f7e3d5b71cbadec352`. Die Zuordnung stützt sich auf `source_audio`, Transkript-SHA und decodierte Dauer; noch keine finale Release-Auswahl.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 10023048 Samples je Kanal; Dauer 208.813500000 s.
- Sample-Peak -0.0 dBFS bei 00:01:59.331; pro Kanal [-0.066, -0.0] dBFS. True Peak 0.0 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -13.663 dBFS; Crest 13.663 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -12.7 LUFS; LRA 7.4 LU.
- Vollaussteuerungs-Kandidaten: 2; DC-Offset je Kanal [3.92e-05, -7.73e-05]; globale Stereo-Korrelation 0.9232. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 176.5 BPM; phasenoptimierte Rasterbewertung: 175.0 BPM. Empfohlen: 175.0 BPM; Alternativen [87.5, 350.0, 70.0, 140.0]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.029 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 176.5 BPM, 00:00:30.000–00:01:00.000: 176.5 BPM, 00:01:00.000–00:01:30.000: 176.5 BPM, 00:01:30.000–00:02:00.000: 176.5 BPM, 00:02:00.000–00:02:30.000: 176.5 BPM, 00:02:30.000–00:03:00.000: 176.5 BPM, 00:03:00.000–00:03:28.814: 176.5 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 51.87 % |
| bass_60_250 | 60–250 Hz | 26.91 % |
| lowmid_250_500 | 250–500 Hz | 6.94 % |
| mid_500_2000 | 500–2000 Hz | 9.09 % |
| presence_2000_6000 | 2000–6000 Hz | 2.56 % |
| high_6000_12000 | 6000–12000 Hz | 1.81 % |
| air_12000_20000 | 12000–20000 Hz | 0.81 % |

Mittlerer spektraler Schwerpunkt 822.7 Hz, 85-%-Rolloff 1364.3 Hz. Auffällige Langzeit-Peaks: [46.9, 128.9, 175.8, 257.8, 527.3] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:09.660 | Vorlauf | -22.72 | -3.36 | 761.1 |
| 00:00:09.660–00:00:22.300 | Intro | -21.21 | -3.36 | 931.7 |
| 00:00:22.300–00:00:43.960 | Instrumental | -15.17 | -2.13 | 932.7 |
| 00:00:43.960–00:01:06.520 | Verse | -14.03 | -0.46 | 649.2 |
| 00:01:06.520–00:01:26.520 | Pre-Chorus | -18.51 | -0.91 | 1154.1 |
| 00:01:26.520–00:01:50.540 | Chorus | -13.26 | -0.51 | 834.0 |
| 00:01:50.540–00:02:17.380 | Break | -12.93 | -0.0 | 623.8 |
| 00:02:17.380–00:02:22.480 | Instrumental | -11.39 | -0.72 | 657.7 |
| 00:02:22.480–00:02:46.560 | Verse 2 | -13.81 | -0.12 | 933.5 |
| 00:02:46.560–00:03:06.720 | Final Chorus | -10.88 | -0.26 | 727.2 |
| 00:03:06.720–00:03:28.814 | Instrumental | -11.75 | -0.07 | 854.5 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:07.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.1 dB | Verkehrswege reduzieren und Trennpunkt hervorheben |
| E003 | 00:00:09.660 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E004 | 00:00:21.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.1 dB | Mehrfach umlaufende Frame-Wege sichtbar machen |
| E005 | 00:00:22.300 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E006 | 00:00:32.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.5 dB | Mehrfach umlaufende Frame-Wege sichtbar machen |
| E007 | 00:00:39.611 | transient | Spektraler Anstieg, relative Stärke 2.18 | Einen Frame-Impuls im Loop hervorheben |
| E008 | 00:00:43.960 | section_boundary | Beginn Verse; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E009 | 00:00:56.071 | transient | Spektraler Anstieg, relative Stärke 2.27 | Einen Frame-Impuls im Loop hervorheben |
| E010 | 00:01:02.071 | transient | Spektraler Anstieg, relative Stärke 2.44 | Einen Frame-Impuls im Loop hervorheben |
| E011 | 00:01:03.300 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -6.3 dB | Verkehrswege reduzieren und Trennpunkt hervorheben |
| E012 | 00:01:06.520 | section_boundary | Beginn Pre-Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E013 | 00:01:26.520 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E014 | 00:01:27.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.6 dB | Mehrfach umlaufende Frame-Wege sichtbar machen |
| E015 | 00:01:34.471 | transient | Spektraler Anstieg, relative Stärke 2.40 | Einen Frame-Impuls im Loop hervorheben |
| E016 | 00:01:42.701 | transient | Spektraler Anstieg, relative Stärke 2.26 | Einen Frame-Impuls im Loop hervorheben |
| E017 | 00:01:49.500 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.0 dB | Mehrfach umlaufende Frame-Wege sichtbar machen |
| E018 | 00:01:50.071 | transient | Spektraler Anstieg, relative Stärke 2.09 | Einen Frame-Impuls im Loop hervorheben |
| E019 | 00:01:50.540 | section_boundary | Beginn Break; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E020 | 00:01:56.411 | transient | Spektraler Anstieg, relative Stärke 2.69 | Einen Frame-Impuls im Loop hervorheben |
| E021 | 00:02:01.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.7 dB | Verkehrswege reduzieren und Trennpunkt hervorheben |
| E022 | 00:02:11.900 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +5.8 dB | Mehrfach umlaufende Frame-Wege sichtbar machen |
| E023 | 00:02:15.611 | transient | Spektraler Anstieg, relative Stärke 2.69 | Einen Frame-Impuls im Loop hervorheben |
| E024 | 00:02:17.380 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E025 | 00:02:22.480 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E026 | 00:02:22.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -3.1 dB | Verkehrswege reduzieren und Trennpunkt hervorheben |
| E027 | 00:02:27.101 | transient | Spektraler Anstieg, relative Stärke 2.79 | Einen Frame-Impuls im Loop hervorheben |
| E028 | 00:02:33.600 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.2 dB | Mehrfach umlaufende Frame-Wege sichtbar machen |
| E029 | 00:02:40.301 | transient | Spektraler Anstieg, relative Stärke 2.58 | Einen Frame-Impuls im Loop hervorheben |
| E030 | 00:02:44.000 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.6 dB | Verkehrswege reduzieren und Trennpunkt hervorheben |
| E031 | 00:02:46.560 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E032 | 00:02:48.531 | transient | Spektraler Anstieg, relative Stärke 2.34 | Einen Frame-Impuls im Loop hervorheben |
| E033 | 00:03:01.381 | transient | Spektraler Anstieg, relative Stärke 2.19 | Einen Frame-Impuls im Loop hervorheben |
| E034 | 00:03:06.720 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E035 | 00:03:06.720 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E036 | 00:03:08.241 | transient | Spektraler Anstieg, relative Stärke 2.28 | Einen Frame-Impuls im Loop hervorheben |
| E037 | 00:03:17.331 | transient | Spektraler Anstieg, relative Stärke 2.40 | Einen Frame-Impuls im Loop hervorheben |
| E038 | 00:03:22.900 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E039 | 00:03:27.200 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -41.8 dB | Verkehrswege reduzieren und Trennpunkt hervorheben |
| E040 | 00:03:28.814 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1067 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 0 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:06.720; danach läuft das Originalaudio bis 00:03:28.814. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt den aktuellen Audio-Kandidaten. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Keine Videos oder Drehbücher wurden erzeugt.
Audioformat: WAV; decodierte Dauer 208.813500000 s; Containerdauer 208.813500000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatisch erstellt; Hörprüfung offener Text- und Zeitkonflikte aus TRANSKRIPT-PRUEFUNG.md steht aus.
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Network-Engineer-Album02/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L017 | 00:01:28.080–00:01:30.940 | Kein Root, kein Pfad. | review_required |
| L020 | 00:01:38.280–00:01:39.560 | Es flutet, | review_required |
| L025 | 00:01:50.540–00:01:51.820 | Loop. | review_required |
| L026 | 00:01:59.400–00:02:00.100 | Flood. | review_required |
| L027 | 00:02:00.840–00:02:01.560 | Flood. | review_required |
| L029 | 00:02:15.980–00:02:17.380 | Yes. | review_required |
| L030 | 00:02:22.480–00:02:24.980 | Management weg, kein Login mehr, | review_required |
| L032 | 00:02:27.920–00:02:30.660 | Blocking State, der niemals kam, | review_required |
| L041 | 00:02:54.340–00:02:55.620 | Spür den Schaden. | review_required |
| L042 | 00:02:57.160–00:02:58.500 | Ein Port down, | review_required |
| L044 | 00:03:01.700–00:03:04.480 | das Netz lernt, | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
