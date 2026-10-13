# 07 · QoS — Zwei Flows, ein Draht (überarbeitete Fassung für den Live-Code)

Grundlage ist die ASTRA-Vorlage vom 4. Oktober 2026 (unverändert unter `_revisions/ASTRA-DREHBUCH-original.md`).
Übernommen werden **die 57 Einstellungen mit Startzeiten und Stationen** (im Test gegen die Vorlage geprüft), das
Szenario (IOS XE MQC, INGRESS / CHILD / PARENT, RTP EF/46, Backup BE/0, 100-Mbit/s-Shaper hinter dem 1-Gbit/s-Port),
die benannten Träger Q-R1, Q-B17, Q-B18, Q-RX, Q-BS und die Bildschirmtexte B01–B04.
Vollständige Zeiten: `UMSETZUNG-CUES.md`.

## Quellen

Finale WAV `07_QoS_1.0.wav`, SHA-256 `2eb5c953…c73f`, 11 474 568 Samples = 239,0535 s, 60 fps = 14 344 Bilder.
Transkript-SHA `ec3d44d4d358…`. Lyric-Zeiten automatisch; fünf Prüfmarkierungen (L024, L027, L031, L042, L043) bleiben.

## Raum im Code

Alle Stationen der Vorlage (HALLE, CLASS, QUEUE, SCHED, POLICE, TCP, ZIEL) liegen in **einer** Maschinenhalle
(`zones/hall.js`); die Station bestimmt die Kamera. Blick stromabwärts: RTP-Rampe links, Backup-Rampe rechts.
Reihenfolge: CLASSIFY-Portal → MARK-Stempel → Policer (Token-Bucket als Bit-Budget, harte Drop-Kante, Verlustarchiv)
nur auf der RTP-Spur → kurze Priority-Queue links / endliche Bulk-Queue (64 Plätze) rechts → CHILD-Scheduler (Arm zeigt
auf die gewählte Queue) → PARENT-Shaper-Ring (100 Mbit/s Vertrag) → grösserer 1-Gbit/s-Port → zwei getrennte
Empfangspanels (RTP-Frames, TCP-ACK).

## Präzisierungen

1. **Farben nach Cover statt mint/violett:** RTP blau (links, Stimme A), Backup orange (rechts, Stimme B); rot nur für
   den Policer-Drop, amber für Budgets.
2. **Deterministische Simulation:** Ein Träger steht für eine Paketgruppe (Zeitlupe). RTP alle 0,6 s (0,2 Mbit/s),
   Burst 88,92–96,08 s alle 0,1 s (1,2 Mbit/s). Token-Bucket 3,75 Träger, Nachfüllung 1/0,12 s (1,0 Mbit/s): der erste
   Überschuss **Q-RX** trifft die Kante genau bei 90,62 s; danach sind 5 von 6 Trägern konform. TCP ist ACK-getaktet
   (Fenster 69), bietet also mehr als die freie Kapazität an; die Bulk-Queue hält dadurch ~48 Pakete (B04-Beispiel)
   ohne Live-Tail-Drop. Ein Server mit Shaper-Rate, EF strikt zuerst, laufende Serialisierung wird nie unterbrochen.
3. **Q-B17 nur im gespeicherten Fenster:** 52,37–68,6 s schwebt eine datierte Vergleichsebene über der Bulk-Queue
   (64/64 voll); Q-B17 (Seq 24001, Len 1200) fällt dort bei 65,6 s. **Q-B18** startet live bei 68,66 s als neuer Frame
   mit demselben Bytebereich. Der TCP-Empfänger zeigt ab 58,1 s ACK 24001 (wartet, SACK) und springt bei Ankunft von
   Q-B18 (83,2 s) auf 25201.
4. **Q-BS:** angenommen 103,96 s, wartet mit Identität und Platznummer, verlässt die Queue genau einmal bei 114,4 s
   (in S029).
5. **Break:** Q-RN ist ein neuer RTP-Frame: CLASSIFY bei 126,1 s (noch unmarkiert), MARK bei 127,84 s (DSCP 46), QUEUE
   bei 129,78 s, ausgegeben 129,86 s. Der reguläre RTP-Strom pausiert dafür, nichts überholt. SCHEDULE / SHAPE / SEND
   zeigen dieselbe laufende Ausgabe aus drei Blickwinkeln (Scheduler-Arm, Shaper-Ring, Port), keine neue Reihenfolge.
6. **B04:** vor 173,02 s als «erwartet» markierte Prüfkriterien, ab 173,02 s die Ergebnisse; ≤ 6 Zeilen pro Seite.
   B03 fasst «police:» und «cir … bc …» in eine Zeile, damit die Seite sechs Zeilen hat.
7. **Kinetische Wörter:** QUALITY OF SERVICE (silber, beide Stimmen), CLASSIFY/MARK/QUEUE (blau, links),
   SCHEDULE/SHAPE/SEND und PASST (orange, rechts), jeweils mit einer Zeile Erklärung.
8. Musik: Bass-Einsätze 44,85 · 134,15 · 152,75 · 182,55 · 197,35 · 212,25 · 223,85 s; Pegellücken leicht abgedunkelt;
   Blende ab 233,1 s (gemessener Fade).
