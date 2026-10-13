# Out of Band — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV `08_Out_of_Band_1.0.wav`.

64 Einstellungen (Schnittliste des Drehbuchs), 11 Kapitel, 11 benannte Flüge (dazu 219 Management- und 197 normale Produktionspakete). Alle 44 Analyse-Events und 52 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Bass-Einsätze 30,75 · 46,05 · 106,95 · 137,45 · 198,45 · 244,15 s. Pegellücken 22,2–22,3, 243,85–243,95 s. Blende ab 258,5 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Kein Login | Gi0/0/1 ist seit Filmbeginn administrativ down; In-band-SSH bleibt ohne Antwort. |
| C02 | 00:22.580 | Der getrennte Weg | Hinter dem Rack: Managementtrasse, Console-Server und serieller Kanal 7 – schon vorher gebaut. |
| C03 | 00:46.200 | SSH wartet | Timeout auf dem Produktionspfad, Dashboard steht still, CHG-2088 als Ursache. |
| C04 | 01:06.780 | Console | SSH zum Console-Server im Managementnetz, picocom 9600/8N1, R-EDGE# über Kanal 7. |
| C05 | 01:30.080 | Out of Band | Eine Tür bleibt offen: der schmale Weg, während der grosse Weg schweigt. |
| C06 | 01:57.800 | Vorabbild | Gesichertes Pre-Change-Abbild im Managementspeicher, aktuelle Konfiguration über die Console. |
| C07 | 02:16.320 | Rücknahme | Diff + shutdown, gezielt no shutdown bei 147,88 s; erst Link, dann Route. |
| C08 | 02:38.880 | Service-Test | P-O1 vom Client bis zum Ziel: TLS geprüft, HTTP 200. |
| C09 | 02:46.980 | Vorher gebaut | Backup, Rollback, getrennter Zugang; speichern erst nach den Tests. |
| C10 | 03:16.880 | Final Chorus | Offener Uplink, P-O2 bestätigt erneut; die Console bleibt erreichbar. |
| C11 | 03:49.640 | Die Stadt schläft | Dokumentiert, das Telefon liegt still, die Stadt schläft weiter. |

## Meilensteine

| Name | Zeit |
| --- | --- |
| inband | 00:08.480, 00:09.480, 00:11.480, 00:46.200, 00:47.200, 00:49.200, 00:53.200 |
| timeout | 00:56.000 |
| mgmtSsh | 01:06.780 |
| picocom | 01:08.600 |
| ready | 01:10.300 |
| prompt | 01:11.060 |
| image | 01:57.800 |
| showRun | 02:16.320 |
| diff | 02:20.400 |
| noShut | 02:27.880 |
| shutterOpen | 02:28.900 |
| linkUp | 02:30.480 |
| lineUp | 02:31.480 |
| route | 02:33.840 |
| po1 | 02:38.880 |
| po1Srv | 02:41.200 |
| po1Ok | 02:43.480 |
| traffic | 02:46.980 |
| trafficFull | 03:09.840 |
| save | 03:02.800 |
| saved | 03:06.000 |
| po2 | 03:32.060 |
| po2Srv | 03:33.960 |
| po2Back | 03:36.600 |
| po2Ok | 03:38.640 |
| po2Doc | 03:41.060 |
| phone | 03:56.200 |
| city | 04:00.340 |

## Flüge

| ID | Art | Bedeutung | Quelle → Ziel | Start | Ende | Ausgang |
| --- | --- | --- | --- | --- | --- | --- |
| SYN-1 | syn | SYN → 10.0.12.1:22 | 198.51.100.10 → 10.0.12.1 | 00:08.480 | 00:09.780 | drop |
| SYN-2 | syn | SYN → 10.0.12.1:22 | 198.51.100.10 → 10.0.12.1 | 00:09.480 | 00:10.780 | drop |
| SYN-3 | syn | SYN → 10.0.12.1:22 | 198.51.100.10 → 10.0.12.1 | 00:11.480 | 00:12.780 | drop |
| SYN-4 | syn | SYN → 10.0.12.1:22 | 198.51.100.10 → 10.0.12.1 | 00:46.200 | 00:47.500 | drop |
| SYN-5 | syn | SYN → 10.0.12.1:22 | 198.51.100.10 → 10.0.12.1 | 00:47.200 | 00:48.500 | drop |
| SYN-6 | syn | SYN → 10.0.12.1:22 | 198.51.100.10 → 10.0.12.1 | 00:49.200 | 00:50.500 | drop |
| SYN-7 | syn | SYN → 10.0.12.1:22 | 198.51.100.10 → 10.0.12.1 | 00:53.200 | 00:54.500 | drop |
| P-O1 | req | P-O1 · HTTPS GET /health | 192.0.2.10 → 198.51.100.20:443 | 02:38.880 | 02:41.200 | deliver |
| P-O1R | resp | P-O1 · HTTP 200 · TLS geprüft | 198.51.100.20:443 → 192.0.2.10 | 02:41.200 | 02:43.480 | deliver |
| P-O2 | req | P-O2 · Bestätigungstest | 192.0.2.10 → 198.51.100.20:443 | 03:32.060 | 03:33.960 | deliver |
| P-O2R | resp | P-O2 · HTTP 200 | 198.51.100.20:443 → 192.0.2.10 | 03:33.960 | 03:36.600 | deliver |

## Einstellungen

| Shot | Start | Ende | Raum / Station | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:08.480 | world / fly | E001, E002, E003 | – |
| S002 | 00:08.480 | 00:10.420 | world / front | E004, E005 | L001 |
| S003 | 00:10.420 | 00:14.460 | world / service | – | L002 |
| S004 | 00:14.460 | 00:18.480 | world / front | – | L003 |
| S005 | 00:18.480 | 00:22.580 | world / back | – | L004 |
| S006 | 00:22.580 | 00:30.453 | world / fly | E006, E007 | – |
| S007 | 00:30.453 | 00:38.327 | world / aisle | E008 | – |
| S008 | 00:38.327 | 00:46.200 | world / console | E009 | – |
| S009 | 00:46.200 | 00:48.180 | world / service | E010 | L005 |
| S010 | 00:48.180 | 00:52.680 | world / noc | – | L006 |
| S011 | 00:52.680 | 00:56.480 | config / laptop | – | L007 |
| S012 | 00:56.480 | 01:00.080 | world / front | – | L008 |
| S013 | 01:00.080 | 01:03.360 | world / aisle | – | L009 |
| S014 | 01:03.360 | 01:06.780 | world / back | E011 | L010 |
| S015 | 01:06.780 | 01:11.060 | world / console | – | L011 |
| S016 | 01:11.060 | 01:15.300 | config / laptop | E012 | L012 |
| S017 | 01:15.300 | 01:18.020 | world / engineer | E013 | L013 |
| S018 | 01:18.020 | 01:22.600 | world / console | – | L014 |
| S019 | 01:22.600 | 01:25.840 | world / aisle | – | L015 |
| S020 | 01:25.840 | 01:30.080 | config / laptop | E014 | L016 |
| S021 | 01:30.080 | 01:31.980 | world / engineer | E015, E016 | L017 |
| S022 | 01:31.980 | 01:35.860 | world / console | – | L018 |
| S023 | 01:35.860 | 01:40.040 | world / fly | – | L019 |
| S024 | 01:40.040 | 01:45.160 | config / laptop | E017 | L020 |
| S025 | 01:45.160 | 01:47.380 | world / back | – | L021 |
| S026 | 01:47.380 | 01:51.160 | world / console | E018 | L022 |
| S027 | 01:51.160 | 01:54.680 | config / laptop | – | L023 |
| S028 | 01:54.680 | 01:57.800 | world / front | – | L024 |
| S029 | 01:57.800 | 02:07.060 | world / aisle | E019, E020 | – |
| S030 | 02:07.060 | 02:16.320 | config / laptop | E021, E022 | – |
| S031 | 02:16.320 | 02:20.260 | config / laptop | E023 | L025 |
| S032 | 02:20.260 | 02:24.100 | config / laptop | E024 | L026 |
| S033 | 02:24.100 | 02:27.880 | config / laptop | – | L027 |
| S034 | 02:27.880 | 02:30.480 | config / laptop | – | L028 |
| S035 | 02:30.480 | 02:35.080 | world / front | E025 | L029 |
| S036 | 02:35.080 | 02:38.880 | world / noc | – | L030 |
| S037 | 02:38.880 | 02:43.480 | world / service | E026 | L031 |
| S038 | 02:43.480 | 02:46.980 | world / service | E027 | L032 |
| S039 | 02:46.980 | 02:49.320 | world / aisle | E028 | L033 |
| S040 | 02:49.320 | 02:50.860 | config / laptop | – | L034 |
| S041 | 02:50.860 | 02:53.000 | world / back | – | L035 |
| S042 | 02:53.000 | 02:54.800 | world / fly | – | L036 |
| S043 | 02:54.800 | 02:57.080 | world / console | – | L037 |
| S044 | 02:57.080 | 02:58.640 | world / back | – | L038 |
| S045 | 02:58.640 | 03:00.540 | world / console | E029 | L039 |
| S046 | 03:00.540 | 03:02.800 | world / fly | – | L040 |
| S047 | 03:02.800 | 03:09.840 | config / laptop | E030 | – |
| S048 | 03:09.840 | 03:16.880 | world / aisle | – | – |
| S049 | 03:16.880 | 03:19.820 | world / engineer | E031, E032 | L041 |
| S050 | 03:19.820 | 03:23.600 | config / laptop | – | L042 |
| S051 | 03:23.600 | 03:26.600 | world / front | – | L043 |
| S052 | 03:26.600 | 03:32.060 | world / aisle | – | L044 |
| S053 | 03:32.060 | 03:33.960 | world / service | – | L045 |
| S054 | 03:33.960 | 03:38.640 | world / service | – | L046 |
| S055 | 03:38.640 | 03:41.060 | world / service | – | L047 |
| S056 | 03:41.060 | 03:45.300 | world / noc | – | L048 |
| S057 | 03:45.300 | 03:49.640 | world / fly | E033, E034 | – |
| S058 | 03:49.640 | 03:52.200 | config / laptop | E035 | L049 |
| S059 | 03:52.200 | 03:56.200 | config / laptop | – | L050 |
| S060 | 03:56.200 | 04:00.340 | world / engineer | – | L051 |
| S061 | 04:00.340 | 04:03.560 | world / fly | – | L052 |
| S062 | 04:03.560 | 04:10.511 | world / fly | E036, E037, E038, E039, E040 | – |
| S063 | 04:10.511 | 04:17.462 | world / fly | E041 | – |
| S064 | 04:17.462 | 04:24.413 | world / engineer | E042, E043, E044 | – |

## Bildschirmtexte

**B01 · Produktionspfad (prod-client 198.51.100.10)** (46,2–60,08 s)
```
[ 46.30] In-band-Versuch (Produktionspfad)
[ 46.40] prod-client$ ssh ops@10.0.12.1
[ 48.18] Dashboard: letzter erfolgreicher Abruf vor CHG-2088
[ 52.68] Gi0/0/1 administratively down
[ 56.00] ssh: connect to host 10.0.12.1 port 22: Connection timed out
```

**B02 · Managementstation 10.99.0.10 → Console-Server** (66,78–90,08 s)
```
[ 66.90] management$ ssh consoleops@10.99.0.20
[ 68.60] console$ picocom --baud 9600 --databits 8 --parity n --stopbits 1 /dev/ttyUSB7
[ 70.30] Terminal ready
[ 71.06] R-EDGE#
[ 75.30] Overlay: SSH im separaten Managementnetz; danach seriell 9600/8N1
[ 78.02] Kanal 7 -> R-EDGE Console
```

**B03 · Console (Kanal 7) und Managementspeicher** (136,32–147,88 s)
```
[136.40] R-EDGE# show running-config interface GigabitEthernet0/0/1
[137.40] interface GigabitEthernet0/0/1
[137.40]  ip address 10.0.12.1 255.255.255.252
[137.40]  shutdown
[140.40] Change-Diff CHG-2088 (Managementstation, gespeicherte Dateien)
[140.40] interface GigabitEthernet0/0/1
[140.40] + shutdown
[141.00] Vorabbild: Interface aktiv; Route via 10.0.12.2 unverändert
```

**B04 · Console (Kanal 7) · gezielte Rücknahme** (147,88–155,08 s)
```
[147.88] R-EDGE# configure terminal
[147.88] R-EDGE(config)# interface GigabitEthernet0/0/1
[147.88] R-EDGE(config-if)# no shutdown
[148.60] R-EDGE(config-if)# end
[150.48] %LINK-3-UPDOWN: Interface GigabitEthernet0/0/1, changed state to up
[151.48] %LINEPROTO-5-UPDOWN: Line protocol on Interface GigabitEthernet0/0/1, changed state to up
```

**B05 · Console (Kanal 7) · Link, dann Route** (150,48–158,88 s)
```
[151.70] R-EDGE# show ip interface brief
[152.30] GigabitEthernet0/0/1  10.0.12.1  YES manual  up  up
[152.80] R-EDGE# show ip route 198.51.100.20
[153.84] Routing entry for 198.51.100.0/24
[153.84]   Known via "static", distance 1, metric 0
[153.84]   * 10.0.12.2
[154.60] Routing entry for 198.51.100.0/24
[154.60]   Known via "static", distance 1, metric 0
[154.60]   * 10.0.12.2
[154.60] Overlay: LINK bestätigt -> ROUTE installiert -> SERVICE noch prüfen
```

**B06 · Client 192.0.2.10 · Service-Test P-O1** (158,88–170,86 s)
```
[158.98] client$ curl --connect-timeout 3 --max-time 5 --resolve app.example:443:198.51.100.20 --write-out '\nHTTP %{http_code}\n' https://app.example/health
[163.48] {"status":"ok"}
[163.48] HTTP 200
[163.88] P-O1: HTTP 200 | TLS-Zertifikat geprüft
[164.28] Client 192.0.2.10 -> 198.51.100.20:443
[164.28] Kein Datenverkehr über Console-Kanal 7
```

**B07 · Console (Kanal 7) · speichern und dokumentieren** (182,8–243,56 s)
```
[182.90] R-EDGE# copy running-config startup-config
[184.00] Destination filename [startup-config]?
[184.80] Building configuration...
[186.00] [OK]
[189.90] CHG-2088 | Rücknahme dokumentiert
[190.30] Gi0/0/1: no shutdown | Route via 10.0.12.2 installiert
[221.06] P-O1 erfolgreich | P-O2 im Finale erneut HTTP 200
[190.70] Management 10.99.0.20 / Console Kanal 7 weiterhin erreichbar
```

## Log

| Zeit | Tag | Meldung |
| --- | --- | --- |
| 00:08.480 | prod | SSH 198.51.100.10 → 10.0.12.1: keine Antwort (Gi0/0/1 down) |
| 00:18.480 | mgmt | Managementnetz 10.99.0.0/24 unabhängig vorhanden |
| 00:46.200 | prod | ssh ops@10.0.12.1 · SYN ohne Antwort |
| 00:56.000 | prod | Connection timed out |
| 01:06.780 | mgmt | SSH 10.99.0.10 → 10.99.0.20 (Console-Server) |
| 01:08.600 | con | picocom /dev/ttyUSB7 · 9600 8N1 · Kanal 7 |
| 01:11.060 | con | R-EDGE# über Kanal 7 erreichbar |
| 01:57.800 | mgmt | Vorabbild R-EDGE vor CHG-2088 gefunden |
| 02:16.320 | con | show running-config Gi0/0/1 → shutdown |
| 02:20.400 | mgmt | Diff CHG-2088: + shutdown (einzige Abweichung) |
| 02:27.880 | con | no shutdown an Gi0/0/1 |
| 02:30.480 | link | Gi0/0/1 changed state to up |
| 02:31.480 | link | Line protocol up |
| 02:33.840 | route | 198.51.100.0/24 via 10.0.12.2 installiert |
| 02:38.880 | svc | P-O1 192.0.2.10 → 198.51.100.20:443 |
| 02:43.480 | ok | P-O1 HTTP 200 · TLS geprüft |
| 03:02.800 | con | copy running-config startup-config |
| 03:06.000 | ok | [OK] · CHG-2088 dokumentiert |
| 03:32.060 | svc | P-O2 Bestätigungstest |
| 03:38.640 | ok | P-O2 HTTP 200 |
| 03:49.640 | con | Console Kanal 7 weiterhin erreichbar |
