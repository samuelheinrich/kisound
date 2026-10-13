# Active / Standby — Schnitt- und Cue-Zuordnung

Automatisch erzeugt aus `src/render/config.js` und `src/render/model.js` (`npm run cues`). Zeiten beziehen sich auf die Original-WAV `02_Active_Standby_1.0.wav`.

56 Einstellungen (Schnittliste des Drehbuchs), 12 Kapitel, 419 Paketflüge, 774 Heartbeats, 8 Zustandskopien, 14 im Split Brain unterbrochene Sessions. Alle 44 Analyse-Events und 44 Lyric-Segmente sind genau einer Einstellung zugeordnet.

Ablauf: ha1 down 89,1 s · B Primary 92,62 s · A port1 aus 112,1 s · A port2 aus 113,26 s · ha1 up 117,9 s · Wahl B 123,48 s · in-sync 125,58 s · A-Links frei 132,04 s.
Bass-Einsätze 25,4 · 82,7 · 111,3 · 161,5 · 194 s. Pegellücken 81,45–82,55 und 190,25–192,45 s. Schlussblende ab 197,2 s.

## Kapitel

| ID | Start | Titel | Handlung |
| --- | --- | --- | --- |
| C01 | 00:00.000 | Gemeinsame Adresse | Zwei gleiche FortiGates, eine LAN-Adresse 192.0.2.1. Nur A trägt den Datenstrom. |
| C02 | 00:12.400 | Ich trag den Traffic | A verarbeitet die Flows; S-17 entsteht und wird als Zustandskopie nach B synchronisiert. |
| C03 | 00:23.720 | Heartbeat und Sync | ha1 trägt zwei getrennte Vorgänge: Heartbeat und Session-Sync. B hört zu und hält den Stand. |
| C04 | 01:07.420 | Active · Standby | A Primary/Active, B Secondary/Standby. Die einzige HA-Leitung ha1 wird freigestellt. |
| C05 | 01:29.100 | Der Link ist weg | ha1 bricht. A arbeitet weiter; Bs Peer-Timer läuft 3,52 s aus. |
| C06 | 01:32.620 | Beide Active | B wird lokal Primary. Zwei Datenpfade treffen auf denselben Adressring; Sessions brechen. |
| C07 | 01:51.380 | Isoliert | Externes Fencing: nur As zwei Produktionsanschlüsse werden an den Switches abgeschaltet. Präferenzen neu gesetzt. |
| C08 | 01:57.900 | Rollen neu | ha1 repariert, Wahl: B Primary. Bs Zustand ist Autorität für die Synchronisation. |
| C09 | 02:05.580 | Ein Pfad | in-sync. As Links erst nach der Prüfung wieder frei; A bleibt Secondary. |
| C10 | 02:19.860 | Active · Standby, neu | B Active, A Standby. Neuer Testflow durch B, Sync jetzt B→A. |
| C11 | 02:51.920 | Neuer Test | Kontrollierter TCP-Test durch B; beide Consoles: B Primary, A Secondary, in-sync. |
| C12 | 03:09.660 | Klarer Pfad | Outro: Active auf B, Standby auf A. Blende. |

## Einstellungen

| Shot | Start | Ende | Raum / Kamera | Modus | Ziel | Audio-Cues | Lyrics |
| --- | --- | --- | --- | --- | --- | --- | --- |
| S001 | 00:00.000 | 00:06.200 | hall / wide | opening | – | E001, E002, E003 | – |
| S002 | 00:06.200 | 00:12.400 | hall / facadeA | enterA | – | – | – |
| S003 | 00:12.400 | 00:13.960 | hall / facadeA | flowA | f:F0 | E004 | L001 |
| S004 | 00:13.960 | 00:23.720 | archive / macro | create | – | E005 | – |
| S005 | 00:23.720 | 00:25.580 | hall / ha | pulse | – | E006, E007 | L002 |
| S006 | 00:25.580 | 00:32.360 | hall / ha | lanes | – | E008 | – |
| S007 | 00:32.360 | 00:39.140 | archive / macro | readB | – | E009 | – |
| S008 | 00:39.140 | 00:42.840 | archive / macro | copy | – | E010 | L003 |
| S009 | 00:42.840 | 00:46.400 | hall / ha | pulse2 | – | – | L004 |
| S010 | 00:46.400 | 00:49.540 | hall / facadeA | path | – | – | L005 |
| S011 | 00:49.540 | 00:53.480 | archive / macro | update | – | – | L006 |
| S012 | 00:53.480 | 00:57.240 | hall / facadeB | readB | – | – | L007 |
| S013 | 00:57.240 | 01:00.480 | hall / ha | rx | – | – | L008 |
| S014 | 01:00.480 | 01:04.100 | hall / facadeB | awake | – | – | L009 |
| S015 | 01:04.100 | 01:07.420 | hall / facadeB | ready | – | E011 | L010 |
| S016 | 01:07.420 | 01:10.440 | hall / facadeA | active | – | E012 | L011 |
| S017 | 01:10.440 | 01:14.240 | hall / facadeB | standby | – | E013 | L012 |
| S018 | 01:14.240 | 01:17.520 | hall / wide | onepath | – | – | L013 |
| S019 | 01:17.520 | 01:19.100 | archive / macro | parallel | – | E014 | L014 |
| S020 | 01:19.100 | 01:21.220 | hall / ha | intact | – | – | L015 |
| S021 | 01:21.220 | 01:22.340 | hall / facadeA | still | – | E015, E016 | L016 |
| S022 | 01:22.340 | 01:29.100 | hall / ha | clamp | – | E017 | – |
| S023 | 01:29.100 | 01:31.260 | hall / ha | break | – | E018, E019 | L017 |
| S024 | 01:31.260 | 01:32.620 | hall / facadeB | timer | – | – | L018 |
| S025 | 01:32.620 | 01:34.580 | hall / facadeB | takeover | – | – | L019 |
| S026 | 01:34.580 | 01:36.140 | hall / facadeA | sends | – | – | L020 |
| S027 | 01:36.140 | 01:39.660 | hall / wide | twopaths | – | E020 | L021 |
| S028 | 01:39.660 | 01:42.740 | hall / facadeA | localA | – | – | L022 |
| S029 | 01:42.740 | 01:45.940 | hall / wide | split | – | E021, E022 | L023 |
| S030 | 01:45.940 | 01:47.340 | console / front | both | – | – | L024 |
| S031 | 01:47.340 | 01:48.820 | hall / wide | address | – | – | L025 |
| S032 | 01:48.820 | 01:51.380 | archive / macro | diverge | – | E023 | L026 |
| S033 | 01:51.380 | 01:53.260 | hall / facadeA | fence | – | E024, E025 | L027 |
| S034 | 01:53.260 | 01:57.900 | hall / facadeA | fenced | – | – | L028 |
| S035 | 01:57.900 | 02:00.440 | hall / ha | repair | – | – | L029 |
| S036 | 02:00.440 | 02:05.580 | console / front | prefs | – | E026 | L030 |
| S037 | 02:05.580 | 02:08.820 | archive / macro | resync | – | E027 | L031 |
| S038 | 02:08.820 | 02:12.260 | hall / facadeB | onepath | – | – | L032 |
| S039 | 02:12.260 | 02:15.140 | hall / facadeA | release | – | – | L033 |
| S040 | 02:15.140 | 02:19.860 | hall / facadeB | leads | – | E028 | L034 |
| S041 | 02:19.860 | 02:22.420 | hall / facadeB | active2 | – | E029, E030 | L035 |
| S042 | 02:22.420 | 02:26.660 | hall / facadeB | test | f:T1 | – | L036 |
| S043 | 02:26.660 | 02:27.340 | hall / facadeA | standby2 | – | – | L037 |
| S044 | 02:27.340 | 02:30.720 | archive / macro | syncBA | – | – | L038 |
| S045 | 02:30.720 | 02:36.060 | archive / macro | syncBA2 | – | – | – |
| S046 | 02:36.060 | 02:41.400 | hall / wide | clear | – | – | – |
| S047 | 02:41.400 | 02:43.640 | hall / facadeB | active3 | – | E031 | L039 |
| S048 | 02:43.640 | 02:47.060 | hall / facadeA | standby3 | – | – | L040 |
| S049 | 02:47.060 | 02:50.300 | hall / wide | clearpath | – | – | L041 |
| S050 | 02:50.300 | 02:51.920 | hall / ha | pulse3 | – | E032 | L042 |
| S051 | 02:51.920 | 03:00.790 | hall / facadeB | tcptest | f:T2 | E033, E034 | – |
| S052 | 03:00.790 | 03:09.660 | console / front | final | – | E035 | – |
| S053 | 03:09.660 | 03:12.400 | hall / facadeB | outroB | – | E036 | L043 |
| S054 | 03:12.400 | 03:13.680 | hall / facadeA | outroA | – | E037, E038 | L044 |
| S055 | 03:13.680 | 03:18.427 | hall / wide | out | – | E039, E040, E041 | – |
| S056 | 03:18.427 | 03:23.173 | hall / ha | end | – | E042, E043, E044 | – |

## Zustandskopien S-17

| ID | Richtung | Start | Ankunft | seq |
| --- | --- | --- | --- | --- |
| Y1 | A→B | 00:15.900 | 00:18.100 | 1840023 |
| Y2 | A→B | 00:40.400 | 00:42.600 | 1840211 |
| Y3 | A→B | 00:50.600 | 00:52.800 | 1840512 |
| Y4 | A→B | 01:18.200 | 01:20.400 | 1840733 |
| YR | B→A (Resync) | 02:03.180 | 02:05.580 | 1840702 |
| Y5 | B→A | 02:09.900 | 02:12.100 | 1840815 |
| Y6 | B→A | 02:31.700 | 02:33.900 | 1841002 |
| Y7 | B→A | 02:53.300 | 02:55.500 | 1841120 |

## Bildschirmtexte

**B01 · HA-Status · gesund** (39,14–67,42 s)
```
[ 39.30] A   A # get system ha status
[ 40.00] A   Mode: HA A-P
[ 40.00] A   Group: 22
[ 40.00] A   Primary   : A
[ 40.00] A   Secondary : B
[ 53.60] A   Configuration Status:
[ 53.60] A    A: in-sync
[ 53.60] A    B: in-sync
[ 54.20] ov  Szenario-Overlay: session-pickup ENABLED | S-17 repliziert
```

**B02 · lokale Einzelansichten** (89,1–111,38 s)
```
[ 89.30] A   A # get system ha status
[ 90.00] A   Mode: HA A-P
[ 90.00] A   Primary: A
[ 89.60] B   B # get system ha status
[ 90.30] B   Mode: HA A-P
[ 90.30] B   PEER_TIMER
[ 92.62] B   Primary: B
[ 89.50] ov  LOKALE EINZELANSICHTEN — HA-Verbindung unterbrochen
[ 92.62] ov  A: Datenpfad offen    B: Datenpfad offen
[ 92.62] ov  Gemeinsame LAN-IP: 192.0.2.1
```

**B03 · Fencing an den Switches** (111,38–117,9 s)
```
[111.45] SWL SW-LAN# configure terminal
[111.70] SWL SW-LAN(config)# interface GigabitEthernet1/0/11
[111.95] SWL SW-LAN(config-if)# shutdown
[112.35] SWW SW-WAN# configure terminal
[112.60] SWW SW-WAN(config)# interface GigabitEthernet1/0/11
[112.95] SWW SW-WAN(config-if)# shutdown
[113.26] ov  Overlay: Nur die zwei Anschlüsse zu A isoliert
```

**B04 · lokale Consoles · Präferenz** (113,26–125,58 s)
```
[113.50] A   A # config system ha
[113.80] A   A (ha) # set priority 100
[114.40] A   A (ha) # set override enable
[115.00] A   A (ha) # end
[115.40] B   B # config system ha
[115.70] B   B (ha) # set priority 200
[116.30] B   B (ha) # set override enable
[116.90] B   B (ha) # end
[113.50] ov  Overlay: lokale Consoles
[117.90] ov  HA-Leitung repariert
[123.48] ov  Wahl: B Primary · A Secondary
```

**B05 · HA-Status · neu** (125,58–139,86 s)
```
[125.70] B   B # get system ha status
[126.40] B   Mode: HA A-P
[126.40] B   Primary   : B
[126.40] B   Secondary : A
[130.10] B   Configuration Status:
[130.10] B    A: in-sync
[130.10] B    B: in-sync
[130.60] ov  Overlay: Session-Sync S-17 bestätigt; A-Links erst ab 132.04 s freigegeben
```

**B06 · Links von A freigeben** (128,82–139,86 s)
```
[129.00] SWL SW-LAN(config)# interface GigabitEthernet1/0/11
[129.50] SWL SW-LAN(config-if)# no shutdown
[130.20] SWW SW-WAN(config)# interface GigabitEthernet1/0/11
[130.70] SWW SW-WAN(config-if)# no shutdown
[132.04] ov  Overlay ab 132.04 s: Links A up | A Secondary | B Primary
```

**B05R · HA-Status · stabil (B05 erneut)** (171,92–193,68 s)
```
[172.10] A   A # get system ha status
[172.80] A   Primary   : B
[172.80] A   Secondary : A
[172.80] A   Configuration Status: in-sync
[172.40] B   B # get system ha status
[173.10] B   Primary   : B
[173.10] B   Secondary : A
[173.10] B   Configuration Status: in-sync
```

## Log

| Zeit | Tag | Meldung |
| --- | --- | --- |
| 01:29.100 | ha | ha1: link down (A und B) |
| 01:29.700 | ha | B: kein Heartbeat von A – Peer-Timer 3,52 s (Szenario) |
| 01:32.620 | ha | B: kein Peer – B wird Primary (lokale Sicht) |
| 01:33.600 | sw | %SW_MATM-4-MACFLAP_NOTIF: Host 0009.0f09.1600 in vlan 10 is flapping between port Gi1/0/11 and port Gi1/0/12 |
| 01:36.900 | warn | Antworten ohne Session-Eintrag verworfen – Tabellen von A und B laufen auseinander |
| 01:52.100 | cfg | SW-LAN: Gi1/0/11 (A port1) administratively down |
| 01:53.260 | cfg | SW-WAN: Gi1/0/11 (A port2) administratively down – A isoliert |
| 01:55.100 | cfg | A: priority 100, override enable (lokale Console) |
| 01:57.000 | cfg | B: priority 200, override enable (lokale Console) |
| 01:57.900 | ha | ha1: link up – Heartbeat beidseitig |
| 02:03.480 | ha | Wahl: B Primary (priority 200), A Secondary |
| 02:05.580 | ok | Configuration in-sync · Session-Sync S-17 bestätigt (B → A) |
| 02:12.040 | cfg | SW-LAN/SW-WAN: Gi1/0/11 up – A Secondary, kein Datenpfad |
| 02:26.000 | ok | Testflow über B: Zielantwort erhalten |
| 03:00.100 | ok | TCP-Test über B: SYN, SYN/ACK, ACK – verbunden |
