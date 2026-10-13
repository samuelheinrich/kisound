# On Call — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV (aktueller Kandidat `01_On_Call_0.2.wav`).

60 Einstellungen (Schnittliste des Drehbuchs), 11 Kapitel, 268 Paketflüge (davon 22 benannte Test-/Diagnosepakete). Alle 41 Analyse-Events und 52 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Bass-Einsätze 30,5 · 90,8 · 120,9 · 169,7 · 199,6 s. Pegellücken 29,95–30,4 und 197,75–199,5 s. Eingriff (Binding entfernt) 146,82 s, derselbe Test ab 148,78 s, HTTP 200 bei 169,7 s, APP-B/APP-C/CTRL-D bei 179 / 180,6 / 182,2 s. Counter QUARANTINE Regel 10: 40 → 41. Schlussblende ab 210,8 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Nacht | Die Stadt schläft; ein einziges Fenster leuchtet. Telefon dunkel, Monitor in Bereitschaft. |
| C02 | 00:16.580 | Display wird hell | Alarm 02:17. INCIDENT-2042 erscheint neben dem Bereitschaftsnamen. Die Person setzt sich auf. |
| C03 | 00:30.020 | Rackgang | Diagnoseoberfläche offen. Durch den Monitor in den Rackgang bis an R-EDGE; die falsche ACL ist schon gebunden. |
| C04 | 00:44.560 | Alles ist weg | Ein ungenaues Ticket wird präzise: SITE-2, Client 192.0.2.10, Beginn nach CHG-2042. TEST-A: drei Dienste Timeout, CTRL-D antwortet. |
| C05 | 01:15.400 | Genauer fragen | Keine Änderung auf Verdacht. Client, Zeit und Ziel stehen fest; ein einzelner Diagnose-SYN wird vorbereitet. |
| C06 | 01:29.320 | Ich folg dem Signal | F-A1 in Zeitlupe durch R-EDGE: Port, Eingangsprüfung, gültige Route – Verwerfung an QUARANTINE Regel 10. |
| C07 | 02:00.120 | Die Spur | Drei Belege: Route korrekt, Binding falsch, Counter 40→41 samt Log. Gateway-Test ist kein Anwendungstest. |
| C08 | 02:15.680 | Erst verstehen | Diff gegen den Vorzustand, Vorschau, dann genau ein Eingriff: no ip access-group QUARANTINE out um 146,82 s. |
| C09 | 02:28.780 | Derselbe Test | Derselbe curl-Befehl, neue Verbindung F-A2: Handshake, TLS, HTTP 200. Danach APP-B, APP-C und CTRL-D. |
| C10 | 03:04.280 | Ticket geschlossen | Ursache, Eingriff, Verifikation. Telefon gesperrt, Fenster dunkel. |
| C11 | 03:19.040 | Die Stadt weiss nichts | Der geprüfte Serviceweg unter den Strassen, neue Transaktionen in den Diensthallen, Blende. |

## Einstellungen

| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:08.290 | city / crane | opening | – | E001, E002 | – |
| S002 | 00:08.290 | 00:16.580 | desk / enter | standby | – | E003 | – |
| S003 | 00:16.580 | 00:18.540 | desk / phone | alarm | – | E004 | L001 |
| S004 | 00:18.540 | 00:22.620 | city / window | sleep | – | E005 | L002 |
| S005 | 00:22.620 | 00:28.140 | screen / ortho | ticket | – | – | L003 |
| S006 | 00:28.140 | 00:30.020 | desk / side | upright | – | E006 | L004 |
| S007 | 00:30.020 | 00:37.290 | desk / over | open | – | E007, E008, E009 | – |
| S008 | 00:37.290 | 00:44.560 | router / aisle | enter | – | E010, E011 | – |
| S009 | 00:44.560 | 00:48.560 | desk / phone | vibrate | – | E012 | L005 |
| S010 | 00:48.560 | 00:52.280 | desk / coffee | coffee | – | – | L006 |
| S011 | 00:52.280 | 00:55.580 | screen / ortho | report | – | – | L007 |
| S012 | 00:55.580 | 00:58.700 | screen / ortho | fields | – | – | L008 |
| S013 | 00:58.700 | 01:02.680 | screen / ortho | fill | – | – | L009 |
| S014 | 01:02.680 | 01:06.160 | desk / over | test | – | – | L010 |
| S015 | 01:06.160 | 01:09.200 | screen / ortho | compare | – | E013 | L011 |
| S016 | 01:09.200 | 01:15.400 | router / dolly | paths | s:LOOKUP | – | L012 |
| S017 | 01:15.400 | 01:18.420 | desk / hands | still | – | E014, E015 | L013 |
| S018 | 01:18.420 | 01:21.420 | screen / ortho | coords | – | – | L014 |
| S019 | 01:21.420 | 01:24.780 | desk / hands | hover | – | – | L015 |
| S020 | 01:24.780 | 01:29.320 | router / flow | launch | f:FA1 | – | L016 |
| S021 | 01:29.320 | 01:31.160 | router / gate | port | f:FA1 | E016, E017 | L017 |
| S022 | 01:31.160 | 01:35.920 | screen / ortho | live | – | E018 | L018 |
| S023 | 01:35.920 | 01:39.180 | city / wide | fog | – | – | L019 |
| S024 | 01:39.180 | 01:41.780 | router / flow | parser | f:FA1 | E019 | L020 |
| S025 | 01:41.780 | 01:46.320 | router / dolly | route | f:FA1 | – | L021 |
| S026 | 01:46.320 | 01:51.920 | router / macro | drop | f:FA1 | – | L022 |
| S027 | 01:51.920 | 01:53.740 | desk / over | stay | – | – | L023 |
| S028 | 01:53.740 | 02:00.120 | router / side | axis | s:ACL10 | E020, E021 | L024 |
| S029 | 02:00.120 | 02:02.380 | router / dolly | evroute | s:LOOKUP | E022 | L025 |
| S030 | 02:02.380 | 02:04.140 | router / flow | gwtest | f:GW | – | L026 |
| S031 | 02:04.140 | 02:06.200 | router / macro | nexthop | f:RP1 | E023 | L027 |
| S032 | 02:06.200 | 02:08.000 | router / trace | trace | – | – | L028 |
| S033 | 02:08.000 | 02:09.940 | screen / ortho | diff | – | – | L029 |
| S034 | 02:09.940 | 02:11.780 | router / macro | counter | s:ACL10 | – | L030 |
| S035 | 02:11.780 | 02:13.220 | desk / over | norestart | – | – | L031 |
| S036 | 02:13.220 | 02:15.680 | router / side | isolate | s:ACL10 | – | L032 |
| S037 | 02:15.680 | 02:17.640 | screen / ortho | difference | – | E024, E025 | L033 |
| S038 | 02:17.640 | 02:19.400 | router / macro | measure | s:ACL10 | – | L034 |
| S039 | 02:19.400 | 02:20.900 | router / flow | replay | f:RP2 | – | L035 |
| S040 | 02:20.900 | 02:23.020 | screen / ortho | evidence | – | – | L036 |
| S041 | 02:23.020 | 02:25.220 | desk / hands | enter | – | – | L037 |
| S042 | 02:25.220 | 02:26.820 | screen / ortho | preview | – | E026 | L038 |
| S043 | 02:26.820 | 02:28.780 | router / macro | release | s:ACL10 | – | L039 |
| S044 | 02:28.780 | 02:33.520 | router / flow | fa2 | f:FA2 | – | L040 |
| S045 | 02:33.520 | 02:36.800 | router / gate | pass | f:FA2 | E027, E028, E029 | L041 |
| S046 | 02:36.800 | 02:40.200 | screen / ortho | tls | – | – | L042 |
| S047 | 02:40.200 | 02:43.980 | city / wide | datalight | – | – | L043 |
| S048 | 02:43.980 | 02:45.580 | router / hall | arrive | f:REQ | – | L044 |
| S049 | 02:45.580 | 02:49.880 | router / back | reply | f:RSP | – | – |
| S050 | 02:49.880 | 02:51.660 | desk / over | watch | – | – | L045 |
| S051 | 02:51.660 | 02:55.020 | screen / ortho | named | – | E030 | L046 |
| S052 | 02:55.020 | 02:57.460 | screen / ortho | attach | – | – | L047 |
| S053 | 02:57.460 | 03:04.280 | router / hall | verify | h:B | E031 | L048 |
| S054 | 03:04.280 | 03:07.460 | desk / coffee | exhale | – | E032 | L049 |
| S055 | 03:07.460 | 03:12.560 | screen / ortho | closed | – | – | L050 |
| S056 | 03:12.560 | 03:15.840 | desk / phone | lock | – | – | L051 |
| S057 | 03:15.840 | 03:19.040 | city / window | dark | – | E033 | L052 |
| S058 | 03:19.040 | 03:24.951 | city / pullback | service | – | E034, E035, E036, E037 | – |
| S059 | 03:24.951 | 03:30.862 | router / hall | transactions | h:A | E038, E039 | – |
| S060 | 03:30.862 | 03:36.774 | city / wide | end | – | E040, E041 | – |

## Test- und Diagnosepakete

| ID | Name | Art | Start | Ende | Ausgang | Header |
| --- | --- | --- | --- | --- | --- | --- |
| T0 | – | syn | 01:03.750 | 01:04.100 | drop | TCP SYN 192.0.2.10:50412 → 198.51.100.20:443 |
| T0R | – | syn | 01:04.750 | 01:05.100 | drop | TCP SYN 192.0.2.10:50412 → 198.51.100.20:443 |
| C0 | – | syn | 01:06.850 | 01:07.250 | deliver | TCP SYN 192.0.2.10:50418 → 203.0.113.40:443 |
| C0R | – | synack | 01:07.300 | 01:07.700 | deliver | → |
| FA1 | F-A1 | syn | 01:25.600 | 01:48.200 | drop | TCP SYN 192.0.2.10:51000 → 198.51.100.20:443 |
| GW | – | icmp | 02:02.450 | 02:03.400 | local | ICMP echo request 192.0.2.10 → 198.51.100.1 |
| GWR | – | icmp | 02:03.500 | 02:04.100 | deliver | ICMP echo reply 198.51.100.1 → 192.0.2.10 |
| RP1 | F-A1 · REPLAY | replay | 02:04.200 | 02:05.580 | drop | TCP SYN 192.0.2.10:51000 → 198.51.100.20:443 |
| RP2 | F-A1 · REPLAY | replay | 02:19.450 | 02:20.600 | drop | TCP SYN 192.0.2.10:51000 → 198.51.100.20:443 |
| FA2 | F-A2 | syn | 02:29.600 | 02:36.000 | deliver | TCP SYN 192.0.2.10:51001 → 198.51.100.20:443 |
| SA2 | – | synack | 02:36.050 | 02:37.800 | deliver | TCP SYN/ACK 198.51.100.20:443 → 192.0.2.10:51001 |
| TLS1 | – | tls | 02:37.900 | 02:39.000 | deliver | TLS 1.3 ClientHello  → |
| TLS2 | – | tls | 02:39.100 | 02:40.200 | deliver | TLS 1.3 ServerHello · Zertifikat  → |
| TLS3 | – | tls | 02:40.300 | 02:41.400 | deliver | TLS 1.3 Finished  → |
| REQ | TEST-A · GET | data | 02:41.900 | 02:44.300 | deliver | TLS 1.3 GET /health 192.0.2.10:51001 → 198.51.100.20:443 |
| RSP | TEST-A · HTTP 200 | data | 02:45.600 | 02:49.700 | deliver | TLS 1.3 HTTP 200 198.51.100.20:443 → 192.0.2.10:51001 |
| TB | – | data | 02:56.600 | 02:57.900 | deliver | TLS 1.3 GET /health  → |
| TBR | – | data | 02:58.200 | 02:59.000 | deliver | TLS 1.3 HTTP 200  → |
| TC | – | data | 02:58.200 | 02:59.600 | deliver | TLS 1.3 GET /health  → |
| TCR | – | data | 02:59.800 | 03:00.600 | deliver | TLS 1.3 HTTP 200  → |
| TD | – | data | 02:59.800 | 03:01.200 | deliver | TLS 1.3 GET /health  → |
| TDR | – | data | 03:01.400 | 03:02.200 | deliver | TLS 1.3 HTTP 200  → |

## Bildschirmtexte

**B01 · INCIDENT-2042** (22,62–72,42 s)
```
[ 22.62] INCIDENT-2042 | 02:17 | On Call
[ 22.62] Meldung: Alles ist weg
[ 59.60] Standort: SITE-2    Client: 192.0.2.10
[ 59.60] Beginn: nach CHG-2042
[ 66.30] APP-A/B/C: HTTPS timeout    CTRL-D: HTTPS 200
```

**B02 · client · TEST-A** (62,68–75,4 s)
```
[ 62.90] client$ curl --connect-timeout 2 --max-time 5 --resolve app-a.example:443:198.51.100.20 --write-out '\nHTTP %{http_code}\n' https://app-a.example/health
[ 65.75] curl: (28) Failed to connect to app-a.example port 443 after 2002 ms: Timeout was reached
[ 66.20] client$ curl --resolve ctrl.example:443:203.0.113.40 https://ctrl.example/health
[ 67.75] {"status":"ok"}
```

**P0 · R-EDGE · Vorher-Snapshot** (81,42–89,32 s)
```
[ 81.70] R-EDGE# show ip access-lists | include list|matches
[ 82.50] Extended IP access list MGMT-IN
[ 82.50]     10 permit tcp 10.99.0.0 0.0.0.255 any eq 22 (318 matches)
[ 82.50] Extended IP access list QUARANTINE
[ 82.50]     10 deny ip any 198.51.100.0 0.0.0.255 log (40 matches)
```

**P1 · client · Diagnose-SYN F-A1** (84,78–120,12 s)
```
[ 84.90] client$ sudo hping3 -S -p 443 -s 51000 -c 1 198.51.100.20
[ 85.60] HPING 198.51.100.20 (eth0 198.51.100.20): S set, 40 headers + 0 data bytes
[ 86.70] --- 198.51.100.20 hping statistic ---
[ 86.70] 1 packets transmitted, 0 packets received, 100% packet loss
```

**B03 · R-EDGE · Belege** (120,12–143,02 s, Seiten ab 120,12 / 124,14 / 129,94 s)
```
[120.30] R-EDGE# show ip route 198.51.100.20
[120.90] Routing entry for 198.51.100.0/24
[120.90]   Known via "connected", distance 0, metric 0
[120.90]   * directly connected, via GigabitEthernet0/0/1
[124.30] R-EDGE# show running-config interface GigabitEthernet0/0/1
[125.00] interface GigabitEthernet0/0/1
[125.00]  ip address 198.51.100.1 255.255.255.0
[125.00]  ip access-group QUARANTINE out
[130.10] R-EDGE# show ip access-lists QUARANTINE
[130.80] Extended IP access list QUARANTINE
[130.80]  10 deny ip any 198.51.100.0 0.0.0.255 log (41 matches)
[130.80]  20 permit ip any any
[131.20] %SEC-6-IPACCESSLOGP: list QUARANTINE denied tcp 192.0.2.10(51000) -> 198.51.100.20(443), 1 packet
[131.80] Vorher-Snapshot: 40 matches → +1 = F-A1
```

**B04 · CHG-2042 · Diff** (128–146,82 s)
```
[128.00] CHG-2042 | R-EDGE | interface Gi0/0/1
[128.00] VORHER: kein ausgehendes IPv4-ACL-Binding
[128.00] + ip access-group QUARANTINE out
[135.68] Befund: falsche Zone, korrekte Route, passender deny-Counter
```

**B05 · R-EDGE · Änderung** (143,02–153,52 s)
```
[143.10] R-EDGE# configure terminal
[143.60] R-EDGE(config)# interface GigabitEthernet0/0/1
[144.30] R-EDGE(config-if)# no ip access-group QUARANTINE out
[147.30] R-EDGE(config-if)# end
```

**B06 · client · TEST-A wiederholt** (148,78–184,28 s)
```
[148.85] client$ curl --connect-timeout 2 --max-time 5 --resolve app-a.example:443:198.51.100.20 --write-out '\nHTTP %{http_code}\n' https://app-a.example/health
[169.70] {"status":"ok"}
[169.70] HTTP 200
[170.20] TEST-A: HTTP 200 | Zertifikat geprüft | Client 192.0.2.10
[179.00] APP-B: HTTP 200
[182.80] QUARANTINE Regel 10: 41 matches (unverändert)
```

**B07 · INCIDENT-2042** (187,46–192,56 s)
```
[187.60] INCIDENT-2042 | geschlossen
[187.60] Ursache: QUARANTINE an falschem Ausgang gebunden
[187.60] Eingriff: Binding an Gi0/0/1 zurückgenommen
[187.60] Verifikation: TEST-A und APP-B/C/CTRL-D erfolgreich
```

## Router-Log

| Zeit | Tag | Meldung |
| --- | --- | --- |
| 00:37.600 | link | Gi0/0/0, Gi0/0/1, Gi0/0/2 up/up · 198.51.100.0/24 connected |
| 01:04.100 | acl | %SEC-6-IPACCESSLOGP: list QUARANTINE denied tcp 192.0.2.10(50412) -> 198.51.100.20(443), 1 packet |
| 01:25.600 | test | client: hping3 -S -p 443 -s 51000 -c 1 → F-A1 gesendet |
| 01:48.200 | acl | %SEC-6-IPACCESSLOGP: list QUARANTINE denied tcp 192.0.2.10(51000) -> 198.51.100.20(443), 1 packet |
| 02:03.400 | test | ping 198.51.100.1: Antwort vom Router selbst – Vergleichstest, kein Anwendungstest |
| 02:26.820 | cfg | %SYS-5-CONFIG_I: Configured from console by oncall on vty0 (10.99.0.15) |
| 02:27.400 | cfg | Gi0/0/1: kein ausgehendes ACL-Binding · ACL QUARANTINE bleibt gespeichert |
| 02:29.600 | test | client: curl TEST-A → app-a.example · neue Verbindung F-A2, Port 51001 |
| 02:34.190 | flow | F-A2 passiert Gi0/0/1 out · kein ACL-Treffer |
| 02:37.800 | test | SYN/ACK von 198.51.100.20:443 · TCP verbunden |
| 02:41.400 | test | TLS 1.3 · Zertifikat app-a.example geprüft (Labor-CA) |
| 02:44.300 | flow | GET /health erreicht APP-A |
| 02:49.700 | ok | HTTP 200 · {"status":"ok"} · TEST-A bestanden |
| 02:59.000 | ok | APP-B HTTP 200 |
| 03:00.600 | ok | APP-C HTTP 200 |
| 03:02.200 | ok | CTRL-D HTTP 200 |
