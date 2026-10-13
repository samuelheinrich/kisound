# kisound

Musik, codebasierte Videos und die Website kisound.ch teilen sich dieses Repository.
Die Quellen liegen wie im Produktionsablauf unter `music/kisound/`,
`videos/kisound/` und `web/kisound/`. Relative Quellpfade zwischen diesen
Bereichen bleiben dadurch erhalten.

**Integrationsstand:** Musik und Video sind übernommen. Der Web-Import wartet
auf die Bestätigung der [Übergabe](docs/web-build-handoff.md) durch den
verantwortlichen Web-Build-Agenten.

| Bereich | Stand |
| --- | --- |
| Network Engineer Album 01 | fertig und veröffentlicht |
| Network Engineer Album 02 | musikalisch fertig; acht finale Tracks |
| Vibecoder | Album-Entwurf; TOKEN BURN und SHIP IT haben finale DE/EN-Fassungen und sind bereits auf der Website sichtbar |
| System-Engineer | Entwurf ohne finale Aufnahmen |
| SecOps | Entwurf ohne finale Aufnahmen |

Die Entwurfsordner bewahren ihre Varianten und Archive. Sie werden nicht in das
ältere Format der Network-Engineer-Alben umbenannt. Für finale Veröffentlichungen
sind die jeweiligen `album.yml` und finalen Prompts massgebend; für Entwürfe
beschreiben die Album-READMEs den Stand.

## Lokale Medien

Git enthält Text, Code und die für Website oder Videos benötigten Cover, Fonts
und 3D-Assets. Audio, Lizenz-PDFs, Renderdateien und Exportordner bleiben lokal.
[`media-inventory.tsv`](media-inventory.tsv) hält Pfad, Grösse und SHA-256 der
Musik- und Lizenzdateien fest. Nach dem Wiederherstellen dieser Dateien unter
denselben relativen Pfaden prüft `python3 tools/media_inventory.py --check` ihre
Vollständigkeit. Ein reiner Git-Checkout kann ohne diese Audiodateien keine
vollständige Website mit Ton bauen.

Die Website liest veröffentlichte Links aus den versionierten Tabellen
`xx_youtube/youtube_urls.md` und `xx_soundcloud/soundcloud_urls.md` der Alben.
Upload-Zustand, Caches und fertige Videos werden nicht versioniert.

## Arbeitsablauf

- Musik und Release-Verweise: [`music/kisound/`](music/kisound/README.md)
- Code-Videos und Produktionshandbuch: [`videos/kisound/`](videos/kisound/PRODUKTION.md)
- Website-Build und Veröffentlichung: `web/kisound/README.md`

Vor Änderungen oder einem Import im Web-Bereich erhält der verantwortliche
Web-Build-Agent eine konkrete Übergabe und bestätigt sie. Build und Check der
Website erfolgen erst danach; ein Deploy ist ein eigener Arbeitsschritt.
