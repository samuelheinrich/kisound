# 09 Last Hop — codebasiertes Musikvideo

Dieser Track bekommt ein handgebautes Video statt des animierten Cover-Videos aus
`script/build_album_videos.rb`.

**Projekt:** `0004_git/videos/kisound/Network-Engineer-Album01/09-last-hop/`
(Node + Three.js, Drehbuch in `DREHBUCH.md`, Technik in `README.md`)

## Dateien, von denen das Video abhängt

| Datei | Rolle |
|---|---|
| `09_Last_Hop_0.1-1.wav` | Die Release-WAV. Verbindliche Zeitachse, wird nicht neu erzeugt. |
| `09_Last_Hop_Transkript.json` | Zeitanker und der sha256 der WAV. |
| `09_Last_Hop_cover.png` | Kanon für Palette, Zieladresse, MAC und Hop-Zahl. |

**Nicht umbenennen oder verschieben, ohne das Videoprojekt anzupassen.** `src/tools/prepare.mjs`
liest diese Dateien über einen relativen Pfad und prüft den sha256 der WAV gegen das Transkript;
bei einer Abweichung bricht der Lauf ab.

Die MP3 in `xx_mp3/` ist **nicht** die Quelle — der Hash im Transkript ist der der WAV.

## Verbindliche Werte aus dem Cover

`HOP COUNT 09` · Ziel `192.168.1.254` · MAC `00:1A:2B:3C:4D:5E` · `STATUS REACHABLE` ·
Farbverlauf der Route cyan → amber.

## Gemessenes Raster

131.746 BPM, erster Taktbeginn 0.3623 s (Autokorrelation, 100 Hz Onsets). Der Track sitzt nicht auf
einem starren Raster — die Schnitte rasten auf die gemessenen Kick-Onsets. Details im README des
Videoprojekts.
