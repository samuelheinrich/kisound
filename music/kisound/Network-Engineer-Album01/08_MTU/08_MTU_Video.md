# MTU · Codebasiertes Musikvideo

Projekt und Browserplayer:
`0004_git/videos/kisound/Network-Engineer-Album01/08_MTU/`.

Abhängige Quellen in diesem Musikordner:

- Finale Auswahl: `08_MTU_1.0.txt` → `08_MTU_0.2-2.wav`.
- Audio-SHA-256: `23491387e4f9c2740fafcc48bde924377e5de66f63fc423ae743d02fde03e75d`.
- Transkript: `08_MTU_Transkript.json`; SHA-256
  `e4e28e0e9c421c226e84999da448e9714cdcd7ad11caccd4cf5cabe9813ac1da`. Das Videoprojekt liest daraus
  auch die Abschnitte der Lyric-Zeilen (Test gegen das Transkript).
- Coverreferenz: `08_MTU_cover.png`; Titel und Name werden im Video als Text gezeichnet.

Das Videoprojekt nutzt seine vorhandene ASTRA-Audioanalyse, das überarbeitete ASTRA-Drehbuch
(Original unter `_revisions/`) und `UMSETZUNG-CUES.md`/JSON. Das Vorbereitungsskript prüft Audio,
Transkript und die Release-Auswahl im Prompt, bevor es eine Audiokopie anlegt. Quellen nicht umbenennen
oder verschieben, ohne diese Zuordnung und das Videoprojekt anzupassen.

Start im Videoprojekt: `npm ci`, `npm run prepare`, dann `npm run preview`.
Browseradresse: http://127.0.0.1:8138/. Erst Browserabnahme, dann ausdrücklich freigegebener Export.
