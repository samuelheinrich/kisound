# Destination Unreachable · Codebasiertes Musikvideo

Projekt und Browserplayer:
`0004_git/videos/kisound/Network-Engineer-Album01/04_Destination_Unreachable/`.

Abhängige Quellen in diesem Musikordner:

- Finale Auswahl: `04_Destination_Unreachable_1.0.txt` → `04_Destination_Unreachable_0.3-1.wav`.
- Audio-SHA-256: `883d8e9f06995b5c82548cfb54a74ecf08ae89f825a1f92ab8613dd1807ef9c3`.
- Transkript: `04_Destination_Unreachable_Transkript.json`; SHA-256
  `94773efae00f3623833f4ff13f5a21bc3d23e7742a419357ab4ea11e4c1974a2`.
- Coverreferenz: `04_Destination_Unreachable_cover.png` (Zieladresse 203.0.113.45 und Traceroute-Bild
  übernommen); Titel und Name werden im Video als Text gezeichnet.

Das Videoprojekt nutzt seine vorhandene ASTRA-Audioanalyse, das überarbeitete ASTRA-Drehbuch
(Original unter `_revisions/`) und `UMSETZUNG-CUES.md`/JSON. Das Vorbereitungsskript prüft Audio,
Transkript und die Release-Auswahl im Prompt, bevor es eine Audiokopie anlegt. Quellen nicht umbenennen
oder verschieben, ohne diese Zuordnung und das Videoprojekt anzupassen.

Start im Videoprojekt: `npm ci`, `npm run prepare`, dann `npm run preview`.
Browseradresse: http://127.0.0.1:8141/. Erst Browserabnahme, dann ausdrücklich freigegebener Export.
