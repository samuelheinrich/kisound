# 02 · Active / Standby — Die Doppelanlage (überarbeitete Fassung für den Live-Code)

Grundlage ist die ASTRA-Vorlage vom 4. Oktober 2026 (unverändert unter `_revisions/ASTRA-DREHBUCH-original.md`,
Original im Musik-Repo `02_Active_Standby/ASTRA-DREHBUCH.md`). Übernommen werden **die 56 Einstellungen mit allen
Startzeiten** (im Test gegen die Vorlage geprüft), das Fachszenario, die Objekt-IDs (A, B, ha1, S-17, 192.0.2.1),
die Bildschirmtexte B01–B06 und alle Zustandszeiten. Diese Fassung hält fest, was für die Umsetzung präzisiert
wurde. Vollständige Zeiten: `UMSETZUNG-CUES.md` (aus dem Code erzeugt).

## Quellen

Finale Release-WAV `02_Active_Standby_1.0.wav`, SHA-256 `42750eb2…c86c`, 9 752 328 Samples = 203,1735 s,
60 fps = 12 191 Bilder. Transkript-SHA `a3a1ccab…71dc`. Lyric-Zeiten automatisch, keine Hörprüfung; Prüfmarkierungen
L015, L022, L023, L027, L033, L035, L038, L041–L044 bleiben, die Bildhandlung hängt nicht am Wortlaut.

## Räume im Code

| Schauplatz der Vorlage | Zone | Umsetzung |
| --- | --- | --- |
| ADRESSE, A, B, HA | `hall` | Rechenzentrumshalle nach dem Cover: zwei monumentale FortiGates stehen sich im Gang gegenüber – A links (orange Kontur, Buchstabe A), B rechts (cyan). Statusanzeige auf jeder Front (Rolle, priority, ha1, Sync, Ports, Peer-Timer). Zwischen ihnen hoch oben **ha1** als weisser Tunnel mit zwei getrennten Bahnen: Heartbeat-Ringe oben, S-17-Zustandsplatten unten. Der Adressring 192.0.2.1 hängt über SW-LAN und den LAN-Clients (−z), SW-WAN und WAN liegen bei +z. |
| ARCHIV | `archive` | Unter den Geräten zwei Session-Archive aus nummerierten Glasplatten; S-17 vorne mit Tuple, Zustand, Sequenz und Herkunft (lokal / Kopie / Resync). Eine Sync-Brücke trägt Kopien nur in der gesunden Richtung. |
| CONSOLE | `console` | Zwei getrennte lokale Consoles nebeneinander (A links, B rechts; bei B03/B06 SW-LAN links, SW-WAN rechts), darunter je eine EKG-Heartbeat-Spur. Nie eine gemeinsame Clusteransicht im Split Brain. |

Durchgehend: A orange/links/tiefe Stimme, B cyan/rechts/klare Stimme. Die Kamera schaut immer Richtung LAN (−z),
links und rechts werden nie getauscht. Datenpfad (flache Träger), Heartbeat (Ringe) und Zustandskopie (Glasplatten)
haben unterschiedliche Formen. Ein klinischer Heartbeat-Monitor (Overlay, unten rechts) zeigt „B ← A“ und „A ← B“.

## Präzisierungen

1. **Heartbeat-Takt:** ein Heartbeat pro Takt des geschätzten Rasters (134 BPM, Ursprung 0,261 s), in beide
   Richtungen – ein Szenariowert, kein FortiOS-Standard. Kein Heartbeat ist über den Bruch hinweg unterwegs.
2. **Flatline als Zustand:** Die Analyse zeigt einen schmalbandigen Ton um 555 Hz (Monitor-Motiv) in Intro und
   Refrains, aber keinen messbar dominanten Dauerton nach 89,10 s. Die Flatline erscheint daher als **fehlender
   Heartbeat-Empfang** auf dem Monitor (rote Nulllinie bis 117,90 s), nicht als behaupteter Klang.
3. **Peer-Timer:** B zählt 89,10 → 92,62 s sichtbar herunter (Statusanzeige, B02); erst dann Primary.
4. **Split Brain sichtbar gemacht:** Zwischen 92,62 und 112,1 s bedienen beide den Adressring (Ring flackert
   orange/cyan, rote Aura). Die Switches lernen die virtuelle MAC an zwei Ports (MAC-Flap-Meldung im Log);
   Antworten, die beim jeweils anderen Gerät landen, finden keinen Session-Eintrag und sterben (14 unterbrochene
   Sessions, rot).
5. **Fencing präzise:** SW-LAN Gi1/0/11 (A port1) aus bei 112,1 s, SW-WAN Gi1/0/11 (A port2) bei 113,26 s – danach
   läuft kein Paket mehr durch A (Test). Ein Request, der beim Abschalten noch in A wäre, geht an B.
6. **Präferenzen vor der Reparatur:** A priority 100 bei 114,0 s, B priority 200 bei 115,9 s (lokale Consoles,
   B04); ha1 up 117,90 s; die Rollen wechseln erst mit dem bestätigten Wahlergebnis 123,48 s.
7. **S-17:** Kopien A→B bei 15,9 / 40,4 / 50,6 / 78,2 s; im Split Brain lokale Fortschreibungen an A (95,2 /
   109,4 s) und B (97,6 / 109,9 s) mit abweichenden Sequenzen (rot); Resync mit B als Autorität endet 125,58 s –
   As Split-Brain-Stände werden verworfen; danach Kopien B→A (129,9 / 151,7 / 173,3 s).
8. **B05 erneut ab 171,92 s** als eigener Block (B05R) auf beiden Consoles: B Primary, A Secondary, in-sync
   (in S052 über acht Sekunden gleichzeitig lesbar).
9. **Kinetische Wörter** nur ACTIVE/STANDBY/SPLIT BRAIN aus Refrain, Final Chorus und Outro, jeweils auf der Seite
   des Geräts (A links orange, B rechts cyan, Split Brain rot) mit einer Zeile Erklärung. Titel im Coverstil.
10. **Musikalische Wendepunkte aus der Messung:** Bass-Einsätze 25,4 · 82,7 · 111,3 (Fencing) · 161,5 (Active) ·
    194,0 s; Pegellücke 81,45–82,55 s (Abdunkelung vor dem Bruch), leichte Abdunkelung 190,25–192,45 s;
    Blende ab 197,2 s.
