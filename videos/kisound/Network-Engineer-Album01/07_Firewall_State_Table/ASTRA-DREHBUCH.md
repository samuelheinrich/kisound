# 07 Firewall State Table – Drehbuch (überarbeitete Fassung)

Grundlage war der ASTRA-Vorschlag vom 28.09. (unverändert gesichert unter
`_revisions/ASTRA-DREHBUCH-original.md`). Diese Fassung ist die Vorlage für den umgesetzten Code;
die genaue Schnittliste mit Event- und Lyric-IDs steht in `UMSETZUNG-CUES.md` (aus dem Code erzeugt).

## Leitidee: Die Mauer, das Tor, die Tabelle

Eine Mauer aus glühenden Ziegeln (wie auf dem Cover) trennt *inside* (10.0.0.0/24 und eine DMZ
172.16.0.0/24) von *outside*. In der Mauer steht ein Mandala-Tor: fünf Policy-Ringe (Regeln 1–5,
von oben nach unten, first match), dahinter eine rote Membran für das implizite Deny. Über dem Tor hängt
die **State Table** als Anzeigetafel, an der Innenseite läuft die **Logsäule**. Vor dem Tor auf der
Aussenseite sitzt das **NAT-Prisma** (eine öffentliche Adresse 203.0.113.10), im Tor der **DPI-Strahl**.

Neue Sessions durchlaufen die Ringe, der passende Ring leuchtet. Alles, was danach zur Session gehört
(SYN-ACK, ACK, Daten, FIN), nimmt den bernsteinfarbenen **State-Fast-Path** durch die Mitte, ohne die
Policy erneut zu fragen. Ein Scanner von aussen klopft immer wieder und stirbt am impliziten Deny. Ab
„Write the rule and lock it“ steht Regel 0 (Blocklist) und er stirbt schon an der Aussenseite.

Zweiter Raum ist ein **Kontrollraum** mit sechs lesbaren Tafeln aus demselben Modell: State Table,
Policy mit Trefferzählern, Paket (5-Tupel), TCP-Leiterdiagramm, Log und NAT.

## Was gegenüber dem Vorschlag geändert wurde

- **Szenen statt Wiederholung:** Der Vorschlag nutzte viermal dasselbe „Adressprisma“ und legte Handlung
  oft neben die Textzeilen (z. B. Chorus-Bild in einem Instrumentalteil). Jetzt hat jede Zeile ihr
  eigenes, fachlich passendes Bild.
- **Struktur aus dem Bass:** Der rollende Psy-Bass setzt in Breakdowns aus. Die Wiedereinsätze (24,95 ·
  45,65 · 84,95 · 105,25 · 126,35 · 167,75 · 195,25 · 215,55 · 229,05 s) tragen die grossen Wechsel.
  Der „Drop it“-Chant beginnt ohne Bass (77,5–85,5 s), wie ein Ritual vor dem Tor.
- **State vs. Policy sauber getrennt:** Nur das erste Paket einer Session wird gegen die Regeln geprüft;
  Rückpakete finden ihre Zeile in der Tabelle. Ein ACK ohne Session („No match, knock it“) findet keine
  Zeile und wird verworfen.
- **TCP und UDP richtig:** TCP-Einträge laufen SYN_SENT → SYN_RECV → ESTABLISHED → FIN_WAIT →
  TIME_WAIT. UDP hat keinen Handshake: Der Syslog-Strom bekommt nie eine Antwort („U-D-P moving with no
  reply“), der Eintrag bleibt UNREPLIED und läuft 30 s nach dem letzten Paket ab, sichtbar im Outro.
- **NAT konkret:** Source NAT (PAT) auf 203.0.113.10, Destination NAT 203.0.113.10:443 → DMZ
  172.16.0.80, **NAT-Reflection** als Hairpin (ein Inside-Client erreicht die DMZ über die öffentliche
  Adresse, das Paket biegt am Prisma zurück). Inside-Adressen erscheinen ausserhalb nie.
- **DPI mit echtem Ergebnis:** Ein sauberer HTTP-Download passiert, die harmlose **EICAR-Testdatei**
  löst die IPS-Signatur aus, das Paket stirbt im DPI-Strahl und die Session wird zurückgesetzt („permit
  clean or close the gate“).
- **Break als Begriffsfolge im Kontrollraum:** SYN, ACK, Session match liegen auf echten Paketen einer
  schnellen Session (146,95 · 148,81 · 150,44 s), dann Deny, Permit, Log, Source NAT, Destination NAT,
  TCP, UDP.
- **Outro:** Sessions schliessen mit FIN, UDP läuft ab, die Tabelle leert sich; in der Pegellücke
  228,4 s fällt das Licht kurz ab; am Ende steht wieder *default deny*.
- **60 fps** wie die übrigen Album-01-Videos.

## Bildsprache

- **Farben:** Obsidian; inside blau, outside rötlich; Mauer mit orange glühenden Fugen. Neue Pakete
  weiss (Policy), State-Pakete bernstein, UDP cyan, Deny rot, NAT violett, Permit grün.
- **Psy-Elemente:** Zwei Punktspiralen im Boden und die Mandala-Bögen drehen sich im 142-BPM-Raster
  (eine Umdrehung pro 8 Schläge), Helligkeit folgt dem Sub-Bass; in Breakdowns wird es ruhiger.
- **Kinetische Wörter** für Hook, Final Hook und Break, jeweils mit einer Zeile Erklärung.
- **Titel** FIREWALL / STATE TABLE / SAMUEL HEINRICH: 1,2–9,4 s und 243,6–253,6 s.

## Ablauf

| Zeit | Kapitel | Inhalt |
| --- | --- | --- |
| 0:00 | Default deny | Mauer, ruhendes Tor, Titel. „Session open“: die erste Zeile; „State is known“: SYN-ACK; ein einzelnes Paket stirbt auf 23,15 s. |
| 0:24 | Verkehr | Bass: Sessions öffnen, Tabelle füllt sich, DNS mit Antwort, Scanner klopft. |
| 0:50 | Policy und State | Default deny, Regelkette, 5-Tupel, ein falsches Paket, Handshake, UDP-Syslog ohne Antwort, Tabelle entscheidet. |
| 1:10 | NAT und Inspection | Source NAT am Prisma, Destination NAT zur DMZ, DPI liest mit, Permit oder Deny. |
| 1:18 | Drop it · Log it · Block it | Scanner-Welle, Logsäule, ACK ohne Session, Regel 0 wird geschrieben. |
| 1:36 | Least privilege | Tor dreht sich; von oben nur wenige offene Wege; App-ID; jede Session hinterlässt eine Logzeile. |
| 2:03 | Übersetzung | Blocklist schneidet den Scanner ab, Hairpin-NAT, inside local / outside global, DPI: sauber vs. EICAR. |
| 2:26 | Break | SYN · ACK · Session match · Deny · Permit · Log · Source NAT · Destination NAT · TCP · UDP. |
| 2:44 | Rausch | Volle Fahrt, alle Sessions aktiv. |
| 3:03 | Lock it | Scanner stirbt sofort an Regel 0; Tabelle und Policy im Kontrollraum. |
| 3:15 | Sessions schliessen | FIN, Ablauf, Lichtabfall in der Pegellücke, letzte Fahrt, Titel, Blende ab 256,8 s. |

## Technische Leitplanken

- ACL/Policy und State Table sind getrennte Konzepte; NAT ist getrennt vom Regelentscheid.
- Eine SYN/ACK-Folge gilt nur für TCP; UDP wird nur über Timeout verfolgt.
- Zeiten sind verdichtet (z. B. TIME_WAIT 4 s statt Minuten), Adressen stammen aus Dokumentationsbereichen,
  EICAR ist die standardisierte, harmlose Antivirus-Testdatei.
- Lyric-Zeiten unverändert aus dem automatischen Transkript, 142 BPM geschätzt (mittlere Sicherheit).
