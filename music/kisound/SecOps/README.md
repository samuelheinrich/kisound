# SecOps

Entwurf 0.1 · 10. Oktober 2026 · Samuel Heinrich

Das Security-Team von innen: Nachtschicht im SOC, SIEM-Korrelation, Phishing-Übung, echter Klick,
Fehlalarm, Pentest, Incident Response und Nachbesprechung. Die Tracks 04, 08, 11 und 12 bilden zusammen
einen Vorfallbogen vom Klick bis zur Lessons-Learned-Runde. Jeder Track zeigt Verteidigung und Abläufe aus
Sicht des Teams, keine Angriffsanleitungen. Zwölf Vorschläge, jeweils mit eigenständiger deutscher und
englischer Fassung.

Struktur je Track: `NN_Track/suno-0.1/de|en/` mit `lyrics.txt`, `style.txt` (Schema wie TOKEN BURN,
≤ 1000 Zeichen) und `settings.txt` (kopierbarer Titel plus Suno-Platzhalter). Noch keine Aufnahmen,
kein `album.yml`, kein Cover.

| Nr. | Titel | Genre · BPM | Stimme | Hook | Inhalt und Bildmotive |
| --- | --- | --- | --- | --- | --- |
| 01 | [SOC](01_SOC/) | Dark Electro / Industrial Bass · 125 | tiefe Männerstimme, weibliche Systemstimme | S-O-C. Wir schlafen nicht. | Schichtübergabe, Queue nach Schweregrad, Impossible Travel Basel → São Paulo, Word startet kodierte PowerShell, Host isoliert. |
| 02 | [SIEM](02_SIEM/) | Neurofunk DnB · 174 | schneller Rap | Aus Rauschen wird Information | Logquellen, Normalisierung, Regel „eine Quelle, 50 Konten“, Password Spraying am VPN-Portal, verwaistes Praktikumskonto ohne MFA. |
| 03 | [PHISHING CAMPAIGN](03_Phishing_Campaign/) | Electroclash · 124 | kühle Frauenstimme | Wir werfen den Köder aus | Eigene Übungsmail (Paketdienst), Dashboard mit 800 Empfängern, 112 Klicks, Lernseite, 64 Meldungen über den Melde-Button. |
| 04 | [CLICK](04_Click/) | Midtempo Bass · 105 | ruhige Erzählstimme | Ein Klick, und die Tür geht auf | Rechnungsmail, gefälschte Login-Seite, MFA-Push bestätigt, Weiterleitungsregel in den RSS-Ordner, Reset, Token-Widerruf, Purge. |
| 05 | [FALSE POSITIVE](05_False_Positive/) | Ghetto Funk / Breaks · 115 | selbstironischer Halbrap | Kein Angriff, nur ich | EDR-Alarm um drei auf Sams Laptop: das eigene Backup-Skript mit Base64, schmale Ausnahme nach Hash und Signer statt Ordner. |
| 06 | [PENTEST](06_Pentest/) | Dark Trip-Hop / Breaks · 92 | leise nahe Männerstimme | Ich bin der Angreifer, den ihr bestellt | Scope und Notfallkontakt, vergessener Testserver, Drucker mit Standardpasswort, SMB Signing, LLMNR, Bericht mit CVSS, Retest. |
| 07 | [MFA FATIGUE](07_MFA_Fatigue/) | Hard Techno · 150 | Systemstimme und Männerstimme | Genehmigen? Nein. | Push-Anfragen um 02:13, dreissigmal ablehnen, „Das war ich nicht“, Number Matching. |
| 08 | [CONTAINMENT](08_Containment/) | EBM / Industrial · 128 | kommandierende raue Stimme | Isolieren. Eindämmen. | Beacon alle 60 s, Speicherabbild vor jedem Neustart, EDR-Isolation, ISE-Quarantäne am Switchport, Firewall-Block, Phasen. |
| 09 | [ZERO DAY](09_Zero_Day/) | Cinematic Dubstep · 140 | tiefe ernste Männerstimme | Kein Patch, nur ein Plan | Advisory 9.8 ohne Patch, eigene VPN-Gateways betroffen, Portal aus, IPS-Signatur, IOC-Suche, Patch an Tag sechs. |
| 10 | [THREAT HUNT](10_Threat_Hunt/) | Dark Progressive Psy · 145 | geflüsterte Männerstimme | Hypothese. Abfrage. Spur. | Hypothese Persistenz, Event-ID 4698 über 300 Server, Aufgabe „Updater“ aus AppData, Übergabe an Incident Response. |
| 11 | [RANSOMWARE](11_Ransomware/) | Dark Trap / Industrial Bass · 145 | Frauenstimme (Notiz), Männer-Rap | Wir zahlen nicht | Freitag 18:40, `.locked`, Shares trennen, Backup-Server in der Domäne mitverschlüsselt, Band und unveränderbare Kopie halten. |
| 12 | [LESSONS LEARNED](12_Lessons_Learned/) | Future Garage · 130 | weiblicher Alt | Was lief gut? Was nicht? | Whiteboard-Zeitachse, 11 Minuten bis zur Isolation, schuldfreie Nachbesprechung, Backup aus der Domäne, Admin-Tiering, Dank ans Lager. |

## Anmerkungen

- Persönliche Bezüge: Basel, Sams eigenes Skript in FALSE POSITIVE, ISE, FortiGate/Firewall und die eigenen VPN-Gateways.
  Arbeitgeber, Kunden und Hersteller werden nicht genannt.
- Das Passwort in SIEM („Herbst zwanzig sechsundzwanzig“) ist ein typisches Spraying-Muster und kein echtes Passwort.
- Mechanismen entsprechen dem realen Verhalten: Impossible Travel, Password Spraying, Postfachregeln bei Mail-Übernahme,
  Number Matching, Event-ID 4698, EDR-Isolation, ISE-Quarantäne (ANC), Schutz durch Offline- und unveränderbare Backups.
- Zahlen sind Szenariowerte, keine Messdaten.
