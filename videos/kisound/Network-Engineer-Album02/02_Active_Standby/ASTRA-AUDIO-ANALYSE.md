# 02 Active Standby – Audioanalyse

**Wichtigste Erkenntnisse:** 203.173 s, geschätzte 134.0 BPM (mittel), -14.1 LUFS und 0.1 dBTP. Letzte transkribierte Stimme bei 00:03:13.680; Audioende bei 00:03:23.174.

## Datei und Pegel

- Quelle: `02_Active_Standby_1.0.wav`; SHA-256 `42750eb28bf676ef697bc26cddb9c28ec62390336e462783111b69db2446c86c`. Die Zuordnung stützt sich auf `source_audio`, Transkript-SHA und decodierte Dauer; noch keine finale Release-Auswahl.
- WAV/PCM_16, 48000 Hz, 2 Kanäle, 16 Bit; 9752328 Samples je Kanal; Dauer 203.173500000 s.
- Sample-Peak 0.0 dBFS bei 00:03:10.549; pro Kanal [0.0, 0.0] dBFS. True Peak 0.1 dBTP (FFmpeg, 0.1 dB gerundet).
- Globales RMS -15.157 dBFS; Crest 15.157 dB = Sample-Peak minus Gesamt-RMS. Integrierte Lautheit -14.1 LUFS; LRA 6.5 LU.
- Vollaussteuerungs-Kandidaten: 5; DC-Offset je Kanal [3.88e-05, -7.9e-06]; globale Stereo-Korrelation 0.9182. Diese Werte belegen keine Verzerrungsfreiheit.

## BPM und Rhythmus

- Onset-Autokorrelation: 133.3 BPM; phasenoptimierte Rasterbewertung: 134.0 BPM. Empfohlen: 134.0 BPM; Alternativen [67.0, 268.0, 107.2, 80.4]. Sicherheit: mittel.
- Das Beat-Raster ist **synthetisch**; der Phasenursprung 0.261 s ist geschätzt. Gemessene Onsets stehen separat im JSON. Taktart und erste Zählzeit sind nicht sicher erkannt.
- Lokale Fenster: 00:00:00.000–00:00:30.000: 133.3 BPM, 00:00:30.000–00:01:00.000: 133.3 BPM, 00:01:00.000–00:01:30.000: 133.3 BPM, 00:01:30.000–00:02:00.000: 133.3 BPM, 00:02:00.000–00:02:30.000: 133.3 BPM, 00:02:30.000–00:03:00.000: 133.3 BPM, 00:03:00.000–00:03:23.173: 133.3 BPM. Schwankungen sind kein Nachweis eines Tempowechsels.

## Frequenzen und Oberwellen

Nyquist 24000 Hz; Messbereich 20–20000 Hz. Energieanteile beziehen sich auf quadratische FFT-Beträge der Mono-Summe, nicht auf wahrgenommene Lautheit.

| Band | Bereich | Energieanteil |
| --- | --- | ---: |
| sub_20_60 | 20–60 Hz | 40.91 % |
| bass_60_250 | 60–250 Hz | 34.97 % |
| lowmid_250_500 | 250–500 Hz | 10.22 % |
| mid_500_2000 | 500–2000 Hz | 11.56 % |
| presence_2000_6000 | 2000–6000 Hz | 1.51 % |
| high_6000_12000 | 6000–12000 Hz | 0.67 % |
| air_12000_20000 | 12000–20000 Hz | 0.16 % |

Mittlerer spektraler Schwerpunkt 528.3 Hz, 85-%-Rolloff 783.9 Hz. Auffällige Langzeit-Peaks: [46.9, 187.5, 363.3, 550.8, 281.2, 738.3, 457.0, 644.5, 832.0] Hz. Peaks können Oberwellenfamilien bilden; Grundtöne, Tonart, einzelne Instrumente und THD sind im polyphonen Mix nicht sicher ableitbar.

## Abschnittsweise Energieentwicklung

| Start–Ende | Abschnitt | RMS dBFS | Peak dBFS | Schwerpunkt Hz |
| --- | --- | ---: | ---: | ---: |
| 00:00:00.000–00:00:12.400 | Vorlauf | -22.35 | -5.13 | 529.0 |
| 00:00:12.400–00:00:25.580 | Intro | -20.17 | -3.56 | 703.4 |
| 00:00:25.580–00:00:39.140 | Instrumental | -15.92 | -3.86 | 269.4 |
| 00:00:39.140–00:01:07.420 | Verse 1 | -16.22 | -1.63 | 526.9 |
| 00:01:07.420–00:01:22.340 | Chorus | -16.86 | -1.68 | 748.0 |
| 00:01:22.340–00:01:29.100 | Instrumental | -13.95 | -3.57 | 288.1 |
| 00:01:29.100–00:01:42.740 | Verse 2 | -14.01 | -1.69 | 353.1 |
| 00:01:42.740–00:01:51.380 | Chorus | -16.67 | -2.17 | 552.0 |
| 00:01:51.380–00:02:19.860 | Verse 3 | -14.94 | -1.3 | 506.4 |
| 00:02:19.860–00:02:51.920 | Final Chorus | -14.84 | -1.63 | 468.9 |
| 00:02:51.920–00:03:09.660 | Instrumental | -12.08 | -1.03 | 456.3 |
| 00:03:09.660–00:03:13.680 | Outro – Wiederholung | -18.37 | 0.0 | 1153.8 |
| 00:03:13.680–00:03:23.174 | Instrumental | -12.4 | -1.74 | 995.1 |

## Kuratierte Cues

| ID | Zeit | Typ | Beobachtung | Bildaktion |
| --- | --- | --- | --- | --- |
| E001 | 00:00:00.000 | start | Beginn der Audioquelle | Bildwelt öffnen |
| E002 | 00:00:00.100 | level_gap | 100-ms-RMS -89.1 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E003 | 00:00:01.600 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -2.6 dB | Synchronisationsweg isolieren; Flatline nicht aus Onset allein ableiten |
| E004 | 00:00:12.400 | section_boundary | Beginn Intro; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E005 | 00:00:14.300 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.8 dB | Rollen und Verbindung beider Geräte räumlich öffnen |
| E006 | 00:00:25.321 | transient | Spektraler Anstieg, relative Stärke 2.14 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E007 | 00:00:25.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +4.3 dB | Rollen und Verbindung beider Geräte räumlich öffnen |
| E008 | 00:00:25.580 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E009 | 00:00:39.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.0 dB | Rollen und Verbindung beider Geräte räumlich öffnen |
| E010 | 00:00:39.140 | section_boundary | Beginn Verse 1; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E011 | 00:01:05.171 | transient | Spektraler Anstieg, relative Stärke 2.17 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E012 | 00:01:07.420 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E013 | 00:01:10.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -5.5 dB | Synchronisationsweg isolieren; Flatline nicht aus Onset allein ableiten |
| E014 | 00:01:18.601 | transient | Spektraler Anstieg, relative Stärke 2.20 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E015 | 00:01:21.400 | level_gap | 100-ms-RMS -39.8 dBFS | Kurz Licht zurücknehmen; danach wieder öffnen |
| E016 | 00:01:22.200 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +8.9 dB | Rollen und Verbindung beider Geräte räumlich öffnen |
| E017 | 00:01:22.340 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E018 | 00:01:29.100 | section_boundary | Beginn Verse 2; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E019 | 00:01:31.141 | transient | Spektraler Anstieg, relative Stärke 2.24 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E020 | 00:01:37.411 | transient | Spektraler Anstieg, relative Stärke 2.68 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E021 | 00:01:42.740 | section_boundary | Beginn Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E022 | 00:01:43.681 | transient | Spektraler Anstieg, relative Stärke 2.22 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E023 | 00:01:50.200 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.6 dB | Rollen und Verbindung beider Geräte räumlich öffnen |
| E024 | 00:01:51.380 | section_boundary | Beginn Verse 3; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E025 | 00:01:51.741 | transient | Spektraler Anstieg, relative Stärke 2.61 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E026 | 00:02:01.591 | transient | Spektraler Anstieg, relative Stärke 2.41 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E027 | 00:02:06.800 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -4.3 dB | Synchronisationsweg isolieren; Flatline nicht aus Onset allein ableiten |
| E028 | 00:02:16.400 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +2.3 dB | Rollen und Verbindung beider Geräte räumlich öffnen |
| E029 | 00:02:19.860 | section_boundary | Beginn Final Chorus; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E030 | 00:02:19.951 | transient | Spektraler Anstieg, relative Stärke 2.06 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E031 | 00:02:42.781 | transient | Spektraler Anstieg, relative Stärke 2.02 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E032 | 00:02:50.841 | transient | Spektraler Anstieg, relative Stärke 2.33 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E033 | 00:02:51.920 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E034 | 00:02:55.100 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +3.6 dB | Rollen und Verbindung beider Geräte räumlich öffnen |
| E035 | 00:03:01.591 | transient | Spektraler Anstieg, relative Stärke 2.50 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E036 | 00:03:09.660 | section_boundary | Beginn Outro – Wiederholung; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E037 | 00:03:13.000 | energy_rise | Geglätteter RMS-Verlauf ändert sich über 1 s um +8.6 dB | Rollen und Verbindung beider Geräte räumlich öffnen |
| E038 | 00:03:13.231 | transient | Spektraler Anstieg, relative Stärke 2.54 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E039 | 00:03:13.680 | section_boundary | Beginn Instrumental; Abschnittsgrenze aus Transkript | Neues Kapitel oder Kameraposition einführen |
| E040 | 00:03:13.680 | last_vocal_end | Ende der letzten übernommenen Gesangszeile | Instrumentales Ende aktiv weiterführen |
| E041 | 00:03:17.200 | fade_candidate | Endpegel fällt gegenüber dem Vorlauf um mehr als 10 dB | Schlussblende frühestens hier einsetzen |
| E042 | 00:03:19.501 | transient | Spektraler Anstieg, relative Stärke 2.13 | Statusimpuls am HA-Paar zeigen; kein belegter Heartbeat-SFX |
| E043 | 00:03:21.700 | energy_fall | Geglätteter RMS-Verlauf ändert sich über 1 s um -29.8 dB | Synchronisationsweg isolieren; Flatline nicht aus Onset allein ableiten |
| E044 | 00:03:23.174 | end | Ende der Audioquelle | Bild bei Audioende schliessen |

## Transienten, Lücken und Ausklang

1483 gemessene Onset-Kandidaten mit 10-ms-Raster; ihre Zeitunsicherheit ist etwa ±40 ms. 2 kurze Pegellücken als Kandidaten. Instrumentale Einsätze und Endpassagen sind über die RMS-Abschnitte und Struktur-Cues zu beurteilen. Der letzte Gesang endet bei 00:03:13.680; danach läuft das Originalaudio bis 00:03:23.174. Ein Fade wird nur bei anhaltendem Endabfall als Kandidat markiert.

## Audioabhängige Animation

RMS steuert die globale Aktivität mit 200–400 ms Glättung. Pro Band unabhängig normierte `*_drive`-Werte steuern Material, Licht und Partikel; das Pegel-Gate hält leise Passagen ruhig. Starke gemessene Transienten lösen einzelne Aktionen aus, anhaltende Pegeländerungen grössere Raumwechsel. Kamerawege folgen den Szenen, nicht jedem synthetischen Beat.

## Methoden, Grenzen und JSON-Schema

`astra.audio.analysis.v1` enthält `source`, `summary`, `tempo`, `spectrum`, `sections`, `events`, `onsets`, `lyrics`, `features_100ms`, `loudness_100ms`, `methods`, `limitations`. Alle Zeiten beginnen bei Sample 0 der unveränderten Audioquelle. `features_100ms.rows` hat Spalten gemäss `columns`; Zeitstempel ist die Fenstermitte. `loudness_100ms` verwendet das Fensterende. Ein fehlender Lautheitswert ist `null`.

Die Momentary-Lautheit benutzt 400-ms-Fenster, Short-term 3-s-Fenster aus FFmpeg EBU R128. Der True Peak ist auf 0.1 dB gerundet. Die 10-ms-Onset-Auflösung bedeutet nicht 10-ms-Genauigkeit. Die Spektralanalyse nutzt die Mono-Summe und ein 4096-Sample-Hann-Fenster mit 50-ms-Hop. Frequenzauflösung und überlagerte Quellen begrenzen Interpretationen.

Übernommene Transkriptzeiten wurden nicht verschoben. 0 offensichtlich doppelte, stark überlappende oder als Abschnittsname erkannte Quellsegmente sind im JSON mit Grund aufgeführt. Es fand keine manuelle Hörprüfung statt.

## Produktionsstand und Transkript-Prüfbedarf

Diese Analyse beschreibt den aktuellen Audio-Kandidaten. Bei einer neuen Aufnahme Analyse und Transkript neu erstellen. Keine Videos oder Drehbücher wurden erzeugt.
Audioformat: WAV; decodierte Dauer 203.173500000 s; Containerdauer 203.173500000 s; Differenz +0.000000000 s.
Alle Zeiten beziehen sich auf den Beginn der decodierten Originalquelle ohne Beschnitt oder zusätzliches Offset. Bei MP3 verarbeitet FFmpeg vorhandene Encoder-Delay-/Padding-Angaben; ein späterer anderer Decoder muss denselben Zeitbezug prüfen.
Transkriptstatus: Automatisch erstellt; Hörprüfung offener Text- und Zeitkonflikte aus TRANSKRIPT-PRUEFUNG.md steht aus.
Quellbericht: `/Users/samuel.heinrich/0004_git/music/kisound/Network-Engineer-Album02/TRANSKRIPT-PRUEFUNG.md`. `review_required` und weitere ASR-Prüffelder bleiben im JSON pro Lyric erhalten.

| Lyric | Zeit | Text | Prüfmarkierung |
| --- | --- | --- | --- |
| L015 | 00:01:19.100–00:01:20.820 | Dein Heartbeat sagt: | review_required |
| L022 | 00:01:39.660–00:01:42.560 | Ich bin noch da. Ich bin Active. | review_required |
| L023 | 00:01:42.740–00:01:44.860 | Split Brain. | review_required |
| L027 | 00:01:51.380–00:01:53.260 | Mein Datenpfad wird isoliert. | review_required |
| L033 | 00:02:12.260–00:02:15.140 | Du hältst als Standby unsern Stand. | review_required |
| L035 | 00:02:19.860–00:02:20.180 | Active. | review_required |
| L038 | 00:02:27.340–00:02:30.720 | Ich halte mich bereit. | review_required |
| L041 | 00:02:47.060–00:02:48.380 | Ein klarer Pfad. | review_required |
| L042 | 00:02:50.300–00:02:51.920 | Dein Puls ist wieder da. | review_required |
| L043 | 00:03:09.660–00:03:10.540 | Active. | review_required |
| L044 | 00:03:12.400–00:03:13.680 | Standby. | review_required |

Bildaktionen sind Vorschläge für den späteren Video-Agent. Die Messung erkennt keine einzelnen Instrumente, Stimmen oder spezifischen SFX.
