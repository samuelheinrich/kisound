# Layer 2 · Codebasiertes Musikvideo

Projekt und Browserplayer:
`0004_git/videos/kisound/Network-Engineer-Album01/01_Layer_2/`.

Abhängige Quellen in diesem Musikordner:

- Finale Auswahl: `01_Layer_2_1.0.txt` → `01_Layer_2_0.3-1.wav`.
- Audio-SHA-256: `15b1566f6863945032ca9ca508b26d71b86d594a8d81d9f5ffd2753a28800e8c`.
- Transkript: `01_Layer_2_Transkript.json`; SHA-256
  `0a685ffdf4c5d1ac8e6150830afb7e56e594ff9aa54d2abd3512cc5699e79fb1`.
- Coverreferenz: `01_Layer_2_cover.png`; Titel und Name werden im Video als Text gezeichnet.

Das Videoprojekt nutzt seine vorhandene ASTRA-Audioanalyse, das erweiterte ASTRA-Drehbuch
und `UMSETZUNG-CUES.md`/JSON. Das lokale Vorbereitungsskript prüft Audio und Transkript,
bevor es eine Audiokopie anlegt. Quellen nicht umbenennen oder verschieben, ohne diese
Zuordnung und das Videoprojekt anzupassen.

Start im Videoprojekt: `npm ci`, dann `npm run preview`.
Browseradresse: http://127.0.0.1:8128/. Erst Browserabnahme, dann ausdrücklich freigegebener Export.
