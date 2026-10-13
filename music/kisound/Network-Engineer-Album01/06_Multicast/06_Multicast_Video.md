# Multicast · Codebasiertes Musikvideo

Projekt und Browserplayer:
`0004_git/videos/kisound/Network-Engineer-Album01/06_Multicast/`.

Abhängige Quellen in diesem Musikordner:

- Finale Auswahl: `06_Multicast_1.0.txt` → `06_Multicast_0.1-1.wav`.
- Audio-SHA-256: `7d0f87a9f23017511848df85b035a20b14761e8da550f196064183032780794e`.
- Transkript: `06_Multicast_Transkript.json`; SHA-256
  `def8f0c83bcb6d421e6fd9717b77e3520c11b8c41c8611fb6cc5a949e8223cc4`.
- Coverreferenz: `06_Multicast_cover.png`; Titel und Name werden im Video als Text gezeichnet.

Das Videoprojekt nutzt seine vorhandene ASTRA-Audioanalyse, das überarbeitete ASTRA-Drehbuch
(Original unter `_revisions/`) und `UMSETZUNG-CUES.md`/JSON. Das Vorbereitungsskript prüft Audio,
Transkript und die Release-Auswahl im Prompt, bevor es eine Audiokopie anlegt. Quellen nicht umbenennen
oder verschieben, ohne diese Zuordnung und das Videoprojekt anzupassen.

Start im Videoprojekt: `npm ci`, `npm run prepare`, dann `npm run preview`.
Browseradresse: http://127.0.0.1:8136/. Erst Browserabnahme, dann ausdrücklich freigegebener Export.
