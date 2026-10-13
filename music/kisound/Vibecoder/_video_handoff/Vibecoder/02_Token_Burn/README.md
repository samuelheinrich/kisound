# TOKEN BURN · Nur noch diese eine Änderung

Status: Drehbuch 1.0 und Produktionsdaten vorbereitet, Renderer noch offen.

- [Drehbuch](ASTRA-DREHBUCH.md): Geschichte, Bildwelt, Typografie, fachliche Zustände und Umsetzungsvorgaben.
- [Schnittliste DE/EN](SCHNITTLISTE.md): 58 Einstellungen mit konkreter Handlung, Kamera und Übergang.
- [Regiedaten](REGIE-CUES.json): dieselben Einstellungen als maschinenlesbare Grundlage.
- [Quellenmanifest](SOURCE-MANIFEST.json): Originaldateien, Hashes, Bildzahlen und Sprachzuordnung.

| Fassung | Zeitliste | Maschinenlesbare Daten | Analyse | ASR-Prüfung |
| --- | --- | --- | --- | --- |
| Deutsch | [SHOTLIST](variants/de/SHOTLIST.md) | [TIMELINE](variants/de/TIMELINE.json) · [KEYWORDS](variants/de/KEYWORDS.json) | [Bericht](variants/de/ASTRA-AUDIO-ANALYSE.md) · [JSON](variants/de/ASTRA-AUDIO-ANALYSE.json) · [Grafik](variants/de/ASTRA-AUDIO-ANALYSE.png) | [Prüfbericht](variants/de/TRANSKRIPT-PRUEFUNG.md) |
| Englisch | [SHOTLIST](variants/en/SHOTLIST.md) | [TIMELINE](variants/en/TIMELINE.json) · [KEYWORDS](variants/en/KEYWORDS.json) | [Bericht](variants/en/ASTRA-AUDIO-ANALYSE.md) · [JSON](variants/en/ASTRA-AUDIO-ANALYSE.json) · [Grafik](variants/en/ASTRA-AUDIO-ANALYSE.png) | [Prüfbericht](variants/en/TRANSKRIPT-PRUEFUNG.md) |

Der Film umfasst etwa **41 % reine 2D-Ansichten, 45 % 3D und 14 % Übergänge mit
beiden Ebenen**. Die Anteile ergeben sich aus den tatsächlichen Shot-Dauern.
Der Bogen führt vom nächtlichen Schreibtisch über sechs zunehmend räumliche
Titelbilder in den Morgen und endet mit einem weiteren abgesendeten Prompt.

`TIMELINE.json` ordnet jeden Lyric-Anfang und jedes kuratierte Analyseereignis
genau einer Einstellung zu. Eine Zeile darf über einen Schnitt hinausreichen;
ihre Quellzeit wird dadurch nicht gekürzt. Das Ereignis am WAV-Ende gehört zum
letzten Shot. Schnitte zwischen den Worten sind redaktionelle Entscheidungen.

`KEYWORDS.json` unterscheidet Stimme und sichtbare Titelhaltezeit. Die
Schreibweise TOKEN BURN folgt dem finalen Titel, während die automatische
Erkennung als Beleg erhalten bleibt. DE H04 liegt in einem Unterfenster von
Cue 32. Die markierten Anker vor der finalen Videoumsetzung am Audio prüfen.

Der nächste Produktionsschritt ist ein Animatic. `src/` und `assets/` sind dafür
vorbereitet. Es existiert noch kein `npm run dev`, keine installierte
Node-Abhängigkeit und keine Videodatei in diesem Projekt.
