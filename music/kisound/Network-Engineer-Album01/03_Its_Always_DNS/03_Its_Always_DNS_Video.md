# It’s Always DNS · Codebasiertes Musikvideo

Projekt und Browserplayer:
`0004_git/videos/kisound/Network-Engineer-Album01/03_Its_Always_DNS/`.

Abhängige Quellen in diesem Musikordner:

- Finale Auswahl: `03_Its_Always_DNS_1.0.txt` → `03_Its_Always_DNS_0.3-2.wav`.
- Audio-SHA-256: `b68aaccb7fddb1eea9241f6bc8f2a91ba30ad532e72355a1ac4309338ec294c4`.
- Transkript: `03_Its_Always_DNS_Transkript.json`; SHA-256
  `0646a267b0c894ff086ad765274b9d884f90c273fd0ab9ae6e4a7ed8b66591b1`.
- Coverreferenz: `03_Its_Always_DNS_cover.png`; Titel und Name werden im Video als Text gezeichnet.

Das Videoprojekt nutzt seine vorhandene ASTRA-Audioanalyse, das überarbeitete ASTRA-Drehbuch
(Original unter `_revisions/`) und `UMSETZUNG-CUES.md`/JSON. Das Vorbereitungsskript prüft Audio,
Transkript und die Release-Auswahl im Prompt, bevor es eine Audiokopie anlegt. Quellen nicht umbenennen
oder verschieben, ohne diese Zuordnung und das Videoprojekt anzupassen.

Start im Videoprojekt: `npm ci`, `npm run prepare`, dann `npm run preview`.
Browseradresse: http://127.0.0.1:8133/. Erst Browserabnahme, dann ausdrücklich freigegebener Export.
