# VIBECODER 01 · Web-Release vom 15. Oktober 2026

## Freigabe und Umfang

Der Nutzer gab die Veröffentlichung auf kisound.ch frei und übertrug die
Web-Build-Abnahme in dieser Sitzung an den ausführenden Agenten. Veröffentlicht
werden die finalen DE- und EN-Audios sowie der geprüfte Live-Code-Film.
Die übrigen Vibecoder-Tracks behalten ihren bisherigen Status.

`music/kisound/Vibecoder/album.yml` markiert Track 01 als Final und hält die
beiden Release-Varianten fest. `web/kisound/site.config.json` enthält einen
neuen Interactive-Eintrag für `01_Vibecoder` mit sprachgetrennten Standbildern
bei 159,29 s (DE) und 186,44 s (EN). Der Film liefert für den Fassungsschalter
je eine `variants/<lang>/TIMELINE.json` mit 72 Shot-Starts.

## Abnahme

- Original-WAVs gegen ihre finalen SHA-256-Werte und Laufzeiten geprüft:
  DE 216,24 s, EN 244,76 s. `npm run prepare`, `npm run cues` und beide
  Exportprüfungen bestanden; es wurde kein MP4 gerendert.
- Film: 23 Tests bestanden; vollständiger Browsercheck für DE und EN mit je
  72 Einstellungen, 434 beziehungsweise 462 Zeitpunkten, zwölf
  Bilddeterminismus-Vergleichen und ohne Browserfehler bestanden.
- Website: `npm run build` erzeugte 50 Seiten. `npm run check -- --only
  vibecoder/01-vibecoder` bestand mit 29 geprüften Seiten, zwei
  Audio-Messungen mit je 0 ms Versatz, beiden Live-Code-Fassungen,
  mobilen und eingebetteten Ansichten und einem korrekten DE/EN-Szenenwechsel.

## Veröffentlichung und öffentliche Kontrolle

Der FTPS-Probelauf zeigte 138 neue oder geänderte Dateien von 547 lokalen
Build-Dateien. Der Live-Deploy übertrug alle 138. `--prune` wurde nicht
verwendet; ältere Assets blieben auf dem Server. Anschliessend wurden
[Trackseite](https://kisound.ch/vibecoder/01-vibecoder/) und
[Live-Code](https://kisound.ch/vibecoder/01-vibecoder/live/) im öffentlichen
Browser geprüft: DE und EN laden fehlerfrei, wählen die passende Fassung,
lesen je 72 Cues und die korrekte Audiodauer. Die Wiedergabe startet mit
laufendem Audiokontext.

Das fehlende Albumcover und die fehlende Postadresse bleiben als bestehende
Hinweise dokumentiert; das Trackcover ist vorhanden und wird angezeigt.
