# 05 · Wireshark — Vom Port in den Mitschnitt (überarbeitete Fassung für den Live-Code)

Grundlage ist die ASTRA-Vorlage vom 4. Oktober 2026 (unverändert unter `_revisions/ASTRA-DREHBUCH-original.md`).
Übernommen werden **die 61 Einstellungen mit allen Startzeiten** (im Test gegen die Vorlage geprüft), das Szenario
(SW-A/SW-B, 100-Mbit/s-Uplink, SPAN auf beiden Seiten, O-101/O-102, kontrollierter Versuch 139,80 s, neuer Test
142,72 s) und die Bildschirmtexte B01–B07. Vollständige Zeiten und PCAP-Zeilen: `UMSETZUNG-CUES.md`.

## Quellen

Finale WAV `05_Wireshark_1.0.wav`, SHA-256 `243d6ab2…128c`, 9 395 208 Samples = 195,7335 s, 60 fps = 11 745 Bilder.
Transkript-SHA `88d44275…70c0`. Lyric-Zeiten automatisch; 108 BPM mit geringer Sicherheit (nur Bewegungsraster).

## Räume im Code

| Schauplatz | Zone | Umsetzung |
| --- | --- | --- |
| RACK, SPAN, ZIEL, QUEUE | `net` | Dunkler Rackraum: Client → SW-A (Glas, SPAN-Abzweig Gi1/0/24, Ausgangsqueue Gi1/0/48 mit Drop-Zähler) → 100-Mbit/s-Uplink → SW-B (SPAN) → APP. Bulk-Quelle an Gi1/0/8, Vergleichsclient nur über SW-B, zwei Analyzer. Originale weiss, Mirror-Kopien cyan auf gestrichelten Captureleitungen. |
| LISTE | `gui` | Analysefenster BEFORE: Filterleiste (grün bei gültigem Displayfilter), Paketliste mit Färbung (Retransmission schwarz/rot, RST rot), Protokollbaum, Bytes (TLS schraffiert), Statusleiste. |
| VERGLEICH | `compare` | BEFORE links, AFTER rechts, gemeinsame Zeitachse; darunter ein Streifen, welcher Bytebereich in welchem Mitschnitt liegt. |
| DETAIL | `layers` | Ethernet, IPv4, TCP als Glasschichten; TLS bleibt ein schraffierter, geschlossener Kern mit Schloss. |

## Präzisierungen

1. **PCAP-Plausibilität:** O-101 (Seq=12001) wird nach RTO 250 ms als O-102 wiederholt, erst danach folgt Seq=13201.
   So zeigt AFTER den Bytebereich genau einmal und **ohne** Retransmission-Label (AFTER hat das Original nie
   gesehen) – im Test geprüft.
2. **Zähler:** 18 Output-Drops im Messfenster (17 Bulk-Frames und O-101, alle vor 62 s), 3800 → 3818; während des
   kontrollierten Versuchs kein neuer Drop. Capture-Drops beider Analyzer 0.
3. **Wiedergaben:** S029 (O-101) und S033 (O-102) zeigen gespeicherte Ereignisse, im Bild als „Wiedergabe aus dem
   Mitschnitt“ markiert, nicht gezählt. Die gemessene Pegellücke 105,95–106,25 s fällt genau auf
   „Der Request geht raus, dann Stille“ – dort verliert sich O-101 an der Queue.
4. **Sichtgrenze BEFORE** wird in S033 als Fläche hinter der Queue gezeigt; die Queue trägt bis zum Befund (137,30 s)
   die Markierung „Hypothese“, danach „Befund“.
5. **Neuer Test:** SYN 51001 passiert die Queue in S046, Antwort trifft genau bei 157,26 s am Client ein (HTTP 200 –
   lokales Clientergebnis). Im Vergleichsstreifen stehen fehlende Antworten bis dahin als „ausstehend“, nicht als
   Fehler.
6. **Schluss:** Der gemessene Endabfall ab 189,8 s dunkelt nur das Umfeld ab; „Auch: Warum.“ (193,34–195,06 s) bleibt
   auf der Queue lesbar, die Blende folgt danach.
7. **Kinetische Wörter:** die vier „Wireshark“-Hooks im Titelstil (WIRE silbern, SHARK blau) mit einer Zeile Erklärung.
8. Musik: Bass-Einsätze 35,85 · 89,15 · 146,95 · 178,05 s; weitere kurze Lücken 143,45 und 159,25 s.
