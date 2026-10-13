# System Engineer

Entwurf 0.1 · 10. Oktober 2026 · Samuel Heinrich

Fortsetzung von *Network Engineer*: eine Schicht höher, bei Servern, Clients, Verzeichnisdienst und Betrieb.
Jeder Track nimmt einen Begriff aus dem IT-Alltag und erzählt einen konkreten, technisch korrekten Fall.
Dazu gehören Befehle, Fehlermeldungen und Zahlen, die sich im Video als reale Objekte zeigen lassen.
Zwölf Vorschläge, jeweils mit eigenständiger deutscher und englischer Fassung.

Struktur je Track: `NN_Track/suno-0.1/de|en/` mit `lyrics.txt` (Lyrics-Feld), `style.txt` (Styles-Feld,
Schema Genre/Tempo/Sound/Vocals/Vibe/Mood/Ablauf/Hinweise, ≤ 1000 Zeichen) und `settings.txt`
(kopierbarer Titel plus Suno-Platzhalter). Noch keine Aufnahmen, kein `album.yml`, kein Cover.

| Nr. | Titel | Genre · BPM | Stimme | Hook | Inhalt und Bildmotive |
| --- | --- | --- | --- | --- | --- |
| 01 | [SERVICEDESK](01_Servicedesk/) | Bass House · 126 | Duett Ansage / Sprechgesang | Haben Sie es schon neu gestartet? | Warteschlange „Anrufer Nummer sieben“, gesperrtes Konto, Netzwerkkabel am Boden, volles Postfach, Wissensdatenbank. |
| 02 | [WARTUNGSFENSTER / MAINTENANCE WINDOW](02_Wartungsfenster/) | Melodic Techno · 122 | tiefe ruhige Männerstimme | Vier Stunden Zeit, ein Weg zurück | Samstag 22–02 Uhr, Change und Rollback-Plan, Hosts nacheinander leeren und patchen, NIC-Treiber zurückrollen, Change um 01:47 zu. |
| 03 | [REGISTRY](03_Registry/) | Robotic Electro · 128 | trockene Männerstimme, Vocoder-Hook | H-Key Local Machine | regedit, Export vor jeder Änderung, DWORD 0 → 1, Tippfehler „Polices“ erzeugt neuen Schlüssel, `reg query`, Verteilung per GPO. |
| 04 | [PATCH TUESDAY](04_Patch_Tuesday/) | Hardgroove · 138 | kräftiger Halbrap, Gruppenruf | Test. Pilot. Rollout. | Zweiter Dienstag, 19 Uhr Schweizer Zeit, Ringe 0–2, Known Issue mit Registry-Workaround, Compliance-Report mit vergessenen Geräten. |
| 05 | [RESTORE](05_Restore/) | Big Beat / Breakbeat · 130 | energische Männerstimme | Drei. Zwei. Eins. | 700 grüne Backup-Mails, Restore-Test im isolierten Netz, Laufwerk D fehlt im Job, 3-2-1, Band im Tresor, unveränderbare Kopie. |
| 06 | [GROUP POLICY](06_Group_Policy/) | UK Garage · 132 | helle freche Frauenstimme | L. S. D. O. U. | `gpresult /r` „Verweigert (Sicherheit)“, Leserecht für Computer, blockierte Vererbung, 90 Minuten + Zufall bis 30. |
| 07 | [TIME SKEW](07_Time_Skew/) | Progressive Psytrance · 140 | ruhige Männerstimme | Fünf Minuten, mehr nicht | Kerberos-Toleranz 5 Minuten, Uhr 7 Minuten vor, „Local CMOS Clock“, Host-Sync aus, PDC fragt externen Zeitserver. |
| 08 | [DISK FULL](08_Disk_Full/) | Heavy Dubstep · 140 | müde, dann wache Männerstimme | No space left on device | `/var` 100 %, `du -sh`, 40 GB Debug-Log, gelöschte Datei noch offen (`lsof +L1`), Dienstneustart, logrotate. |
| 09 | [SNAPSHOT](09_Snapshot/) | Darksynth · 105 | dunkle Frauenstimme | Kein Backup, nur ein Weg zurück | Snapshot „vor Update“ seit 14 Monaten, 600 GB Delta, VM friert ein (Retry/Cancel), Konsolidierung über Nacht, Report. |
| 10 | [UPTIME](10_Uptime/) | Industrial Techno · 130 | tiefe ernste Männerstimme | Tausendvierhundert Tage | Server im Keller mit Zettel „Nicht ausschalten!“, Umzug, RAID-Akku leer, fsck, Dienst nur manuell gestartet, `systemctl enable`. |
| 11 | [PRINT SPOOLER](11_Print_Spooler/) | Nu-Disco / Electro-Funk · 120 | helle spöttische Frauenstimme | net stop spooler | 37 Jobs, „Fehler – Wird gedruckt“, `System32\spool\PRINTERS`, SHD/SPL löschen, Testseite, Papierstau in Fach zwei. |
| 12 | [RUNBOOK](12_Runbook/) | Liquid DnB · 172 | warme Männerstimme | Für den, der nach mir kommt | 03:12 Pikett, Cluster-Failover, eigenes Runbook von vor zwei Jahren, Quorum-Disk, Schritt sieben ergänzt. |

## Anmerkungen

- Keine Überschneidung mit den Network-Engineer-Titeln oder deren archivierten Themen.
- Die Titel sind in beiden Sprachen gleich. Nur WARTUNGSFENSTER heisst in der englischen Fassung MAINTENANCE WINDOW.
- Persönliche Bezüge: Pikett, zwanzig Jahre, eigenes Runbook. Arbeitgeber und Kunden werden nicht genannt.
- Zahlen sind Szenariowerte. Befehle, Fehlermeldungen und Mechanismen entsprechen dem realen Verhalten:
  Kerberos-Toleranz, GPO-Reihenfolge LSDOU, gelöschte offene Dateien, Snapshot-Konsolidierung und Spooler-Ordner.
