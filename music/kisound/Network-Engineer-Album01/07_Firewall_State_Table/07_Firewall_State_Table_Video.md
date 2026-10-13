# Firewall State Table · Codebasiertes Musikvideo

Projekt und Browserplayer:
`0004_git/videos/kisound/Network-Engineer-Album01/07_Firewall_State_Table/`.

Abhängige Quellen in diesem Musikordner:

- Finale Auswahl: `07_Firewall_State_Table_1.0.txt` → `07_Firewall_State_Table_0.4-2.wav`.
- Audio-SHA-256: `6fcc83f53b3146a4754354b9dfd7c8644de53bf57c992aadb76a9fc9a62f754d`.
- Transkript: `07_Firewall_State_Table_Transkript.json`; SHA-256
  `f4b5839e4691fc9a09338a6f99475d08dddab08fd4720317a9f7613d708712ff`.
- Coverreferenz: `07_Firewall_State_Table_cover.png`; Titel und Name werden im Video als Text gezeichnet.

Das Videoprojekt nutzt seine vorhandene ASTRA-Audioanalyse, das überarbeitete ASTRA-Drehbuch
(Original unter `_revisions/`) und `UMSETZUNG-CUES.md`/JSON. Das Vorbereitungsskript prüft Audio,
Transkript und die Release-Auswahl im Prompt, bevor es eine Audiokopie anlegt. Quellen nicht umbenennen
oder verschieben, ohne diese Zuordnung und das Videoprojekt anzupassen.

Start im Videoprojekt: `npm ci`, `npm run prepare`, dann `npm run preview`.
Browseradresse: http://127.0.0.1:8137/. Erst Browserabnahme, dann ausdrücklich freigegebener Export.
