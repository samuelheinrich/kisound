# MTU – ASTRA-DREHBUCH

## Auftrag und Grundlage

Entwickle ein vollständig codebasiertes, cineastisches Musikvideo zum Track **MTU**. Dieses Dokument ist das kreative Drehbuch und die Grundlage für Szenen, Kamerafahrten und Animationen.

| Eigenschaft | Vorgabe |
| --- | --- |
| Audio laut Transkript | `08_MTU_0.2-2.wav` |
| Gesamtdauer | `00:02:19.000` – 139 Sekunden |
| Textgrundlage | `08_MTU_Transkript(1).txt` |
| Sprache des Tracks | Englisch |
| Zeitbezug | Absolut ab Beginn der WAV-Datei |
| Bildformat | 16:9; Vorschau 1920 × 1080, finales Ziel 3840 × 2160 |
| Bildrate | 30 fps, durchgehend konstant |
| Charakter | Eigenständiges künstlerisches Musikvideo über Paketgrösse, Engstellen und einen verborgenen Netzwerkfehler |

**Kein Selution-Bezug:** Keine Firmenlogos, Websites, Corporate-Farben, Werbeslogans oder Assets aus früheren Markenprojekten verwenden. `ASTRA` bezeichnet die gewünschte Drehbuchdatei und ist keine zusätzliche Marke im Film. Sichtbarer Tracktitel ist ausschliesslich **MTU**.

**Revision nach Analyse der Original-WAV:** Die Datei wurde signaltechnisch auf Tempo, Pegel, Frequenzverlauf, Transienten und Strukturwechsel untersucht. Grundlage der folgenden Anpassungen sind `ASTRA-AUDIO-ANALYSE.md` und die maschinenlesbare `ASTRA-AUDIO-ANALYSE.json`. Eine manuelle Hörprüfung oder sichere Erkennung jedes Instruments wird nicht behauptet. Die Transkriptzeiten bleiben unverändert.

Das Arbeitsraster beträgt **135 BPM** bei mittlerer Sicherheit, mit plausibler Halbzeit-Lesart von 67.5 BPM. Die tatsächliche Dauer ist **139.000166667 s**. Der Track erreicht **−13.3 LUFS**, etwa **−2.7 dBTP** und besitzt eine ausgeprägte Bassdominanz. Ein einzelner Sample-Peak steuert keinen grossen Bildwechsel.

### Verbindliche Änderungen gegenüber der ersten Fassung

| Audiozeit | Erkenntnis | Konsequenz für die Regie |
| --- | --- | --- |
| 00:16.010 | Starker Anstieg im bisherigen Aufbau | Teststrecke wird hier dynamisch, nicht erst zum Verse |
| 00:44.480–00:48.000 | Reduzierter Vorlauf, dann klarer Wiedereintritt | Kamera bis 48 s bündeln; Anflug zum Tor startet schon bei 48 s |
| 01:30.810 | Reduzierte, unterbrochene Passage | Frontale Messbilder und klare Zahlen statt Dauerrasen |
| 01:43.320–01:44.880 | Kurze Reduktion, dann Rückkehr des dichten Flusses | Paket-Neuaufbau in der Lücke, neuer Start bei 104.880 s |
| 01:59.120–02:02.640 | Temporäre Reduktion nach dem Gesang | Kurzer schwebender Zwischenmoment, noch kein Ende |
| 02:02.640–02:17.690 | Erneut anhaltender Antrieb | Letzte aktive Datenfahrt und Netzwerk-Totale |
| 02:17.690–02:19.000 | Letzter markanter Impuls, dann schneller Pegelabfall | Schlussdurchtritt auf den Impuls; Fade erst ab etwa 137.800 s |

Für die kontinuierlichen Bewegungen das geschätzte Raster nutzen, für harte Akzente die gemessenen Ereignisse. Das 4/4-Schema bleibt eine Arbeitsannahme. Strukturmarken haben eine grössere Zeitunsicherheit als Transienten. Keine starren Cuts auf jeden rechnerischen Beat erzwingen.

## 1. Leitidee: Die unsichtbare Grenze

Ein leuchtender Datenkörper rast durch eine gewaltige industrielle Netzwerkmaschine. Die Strecke scheint frei, die Anzeigen melden Erreichbarkeit, kleine Pakete passieren problemlos. Unser grosses Paket erreicht jedoch eine kaum sichtbare Grenze und verschwindet.

Die Geschichte entwickelt sich vom rätselhaften Scheitern über die Suche nach der Ursache bis zur Lösung: Die schmalste Stelle des Pfades bestimmt, was hindurchpasst. Zusätzliche Hüllen benötigen Platz. Erst als die Rückmeldung den Sender erreicht und dieser die Daten passend auf neue Pakete verteilt, beginnt der Verkehr zu fliessen.

**Emotionaler Verlauf:** Selbstvertrauen → Irritation → wiederholtes Scheitern → Untersuchung → Erkenntnis → kontrollierte Befreiung.

**Zentrales Bild:** Ein Paket passt nicht durch einen beleuchteten Messrahmen. Am Schluss passieren passend dimensionierte Pakete genau denselben Rahmen. Die Engstelle bleibt gleich – der Sender hat gelernt.

## 2. Eigenständige Bildsprache

### Welt

Eine dunkle, monumentale Maschine aus gebürstetem Metall, schwarzem Glas, Messgittern und frei schwebenden Leitungen. Kabelinnenräume gehen in Verkehrskorridore über. Router erscheinen als riesige Prüf- und Verteilanlagen. Die Welt besitzt Gewicht, Tiefe und klare räumliche Beziehungen.

Die engste Stelle ist ein rechteckiges Lichttor, das zunächst nahezu unsichtbar bleibt. Seine Messlinien werden erst während der Diagnose erkennbar. Hinter dem Tor liegt ein weiter, heller Datenraum.

### Wiederkehrende Elemente

| Element | Gestalt und Funktion |
| --- | --- |
| Leitpaket | Transparenter, kantiger Körper mit magentafarbenem Kern; im Inneren erkennbare Datenmodule |
| Kleine Testpakete | Kompakte cyanfarbene Körper; passieren die Engstelle mühelos |
| Header | Klar abgegrenzte vordere Zone des Datenkörpers |
| DF-Merkmal | Kleine leuchtende Klammer mit `DF=1`; signalisiert die unteilbare Hülle |
| MTU-Grenze | Rechteckiger Messrahmen mit festen Abmessungen und eingeblendeter Grenzzahl |
| Kapselung | Zusätzliche transparente Aussenhüllen; vergrössern das Transportobjekt |
| ICMP-Rückmeldung | Kleiner bernsteinfarbener Impuls mit einer klar erkennbaren Grenzinformation |
| Verdeckter Fehler | Schwarze Fläche im Pfad und eine gesperrte Rückmeldeverbindung |
| Erfolgreicher Datenstrom | Mehrere passend dimensionierte Körper mit weiterhin magentafarbenem Kern |

Die Farben codieren Funktionen. Rot erscheint punktuell beim Verwerfen, nicht als permanente Grundbeleuchtung. Der abschliessende Erfolg erhält weisses Licht mit cyanfarbenen Akzenten.

### Kamera und Rhythmus

Wechsle zwischen Paket-POV, seitlichen Verfolgungsfahrten, Makroaufnahmen und topologischer Übersicht. Die Aussenansichten sind entscheidend, damit Paketgrösse und Engstelle erkennbar bleiben.

Bei gescheiterten Übertragungen endet die Lichtspur abrupt. Nachfolgende Retransmits beginnen erneut am Sender; verworfene Pakete dürfen nicht wie unzerstörbare Figuren wieder vor demselben Tor auftauchen.

Keine durchgehenden Tunnelflüge, zufälligen Glitches oder dauerhaften Karaoke-Untertitel. Einzelne Begriffe und Zahlen gehören räumlich zur Maschine. Schnelle Akzente werden über Schnitt, Bewegung und Lichtverlagerung erzeugt; auf aggressive Vollbildblitze verzichten.

## 3. Gesamtdramaturgie

| Zeitraum | Abschnitt | Bildidee | Entwicklung |
| --- | --- | --- | --- |
| 00:00.000–00:12.800 | Intro | Ein zu grosser Datenkörper vor einer unsichtbaren Grenze | Rätsel etablieren |
| 00:12.800–00:23.280 | Aufbau | Kamera erkundet den Pfad; kleine Pakete passieren | Widerspruch zeigen |
| 00:23.280–00:37.020 | Verse | Header, DF und der erste klar sichtbare Drop | Problem konkretisieren |
| 00:37.020–00:43.700 | Pre-Chorus | Kleine und grosse Tests im direkten Vergleich | Diagnose beginnen |
| 00:43.700–00:48.000 | Übergang | Engstelle wird vermessen | Refrain vorbereiten |
| 00:48.000–01:01.580 | Chorus-Vorlauf und Chorus | Monumentales MTU-Tor, wiederholtes Scheitern | Kernmotiv zuspitzen |
| 01:01.580–01:16.000 | Hook | DF-Klammer und erste Idee einer kleineren Sendung | Lösungsrichtung zeigen |
| 01:16.000–01:30.520 | Verse 2 | Kapselung und blockierte ICMP-Rückmeldung | Ursache offenlegen |
| 01:30.520–01:44.880 | Break | Grössenvergleich, Rückmeldung, neuer Sendeversuch | Lösung umsetzen |
| 01:44.880–01:57.800 | Final-Vorlauf und Final Chorus | Passende Pakete durchqueren denselben Pfad | Befreiung |
| 01:57.800–02:19.000 | Instrumentales Finale | Kurze Reduktion, erneute Datenfahrt, spätes Schlussmotiv | Energie bis zum tatsächlichen Ausklang halten |

## 4. Detailliertes Drehbuch

### Szene 01 · 00:00.000–00:12.800 · Die Grenze

**00:00.000–00:02.140 – «Size matters on the wire.»**

Aus der Dunkelheit taucht eine einzelne, seitlich beleuchtete Verbindung auf. Die Kamera gleitet dicht an ihrer Oberfläche entlang und wechselt in einen abstrahierten Innenraum. Ein grosser Datenkörper zieht an uns vorbei. Seine Grösse wird durch nah vorbeiziehende Messstreben fühlbar.

**00:03.880–00:05.660 – «Too large to pass.»**

Das Paket nähert sich einer Öffnung. Frontal wirkt der Weg frei; eine kurze Seitenansicht verrät, dass seine Kontur über die zulässige Grenze hinausragt. Eine dünne rote Linie zeichnet den Überstand nach.

**00:07.440–00:09.180 – «Too quiet to fail.»**

Ein früherer grosser Sendeversuch verliert hinter einer dunklen Fläche seine Lichtspur. Am Sender bleibt die Anzeige ohne hilfreiche Rückmeldung. Kein Feuerball, keine dramatische Fehlermeldung: Das Schweigen ist das Problem.

**00:11.380–00:12.800 – «The packet waits.»**

Ein neuer Datenkörper steht in einer Sendewarteschlange. Sein Kern pulsiert, während die Kamera langsam um die stillstehende Struktur fährt. Das Warten gehört zur Senderseite, nicht zu einem bereits verworfenen Paket.

### Szene 02 · 00:12.800–00:23.280 · Alles scheint erreichbar

Die Kamera zieht in eine Übersicht zurück: Sender, mehrere Verbindungen, ein Router mit Engstelle und ein entfernter Empfänger.

Kleine cyanfarbene Pakete durchqueren die gesamte Strecke. Antwortimpulse kehren zurück. Der Pfad wirkt funktionsfähig.

Wir folgen einem kleinen Testpaket durch dieselbe Öffnung, an der der grosse Versuch gescheitert ist. Für wenige Sekunden erscheint der Titel **MTU**, aufgebaut aus den Messlinien des Tores. Danach verschwindet die Typografie wieder in der Architektur.

**Audio-Cue 00:16.010:** Auf den gemessenen kräftigen Einsatz wechselt die ruhige Übersicht in eine klare Beschleunigung. Ab ungefähr 00:22.000 Bewegung wieder zurücknehmen, damit die folgenden Header-Details lesbar bleiben.

### Szene 03 · 00:23.280–00:37.020 · Ein Byte zu viel

**00:23.280–00:26.540 – «M-T-U … one byte too heavy»**

Eine abstrahierte Prüfstation zeigt eine feste Grenze von `1400 B` für das IP-Paket. Ein Testkörper mit `1401 B` erreicht den Rahmen. Die Kamera zoomt auf ein einziges zusätzliches Datenmodul, das den Überstand repräsentiert. Die Vergrösserung ist bewusst schematisch.

**00:26.920–00:29.700 – «Payload loaded, header tight …»**

Explosionsansicht des Pakets: Header vorne, Datenmodule dahinter. Alle Komponenten rasten in ihre Position. Die Kamera fährt entlang des fertig aufgebauten Körpers und folgt ihm zum Router.

**00:30.880–00:33.240 – «D-F bit says do not break …»**

Die Markierung `DF=1` leuchtet auf. Eine geometrische Klammer umschliesst den Körper. Angedeutete Teilungslinien bleiben geschlossen. Es erfolgt keine Fragmentierung.

**00:33.760–00:35.300 – «Silent drop in the middle lane»**

Der Router verwirft den zu grossen Körper. Seine Spur bricht ab. Eine kleine Rückmeldung wird erzeugt, verschwindet jedoch auf einer seitlichen Rückleitung hinter einer gesperrten Filterfläche. Nur kurz zeigen; die genaue Ursache wird später enthüllt.

**00:35.640–00:37.020 – «users only feel the pain»**

Harter räumlicher Wechsel zu einem neutralen Bildschirm: Ein Transfer bleibt stehen, ein Ladeindikator wartet. Keine Marke und keine echte Website. Eine Hand liegt regungslos neben dem Trackpad; eine aufwendige Figur ist nicht erforderlich.

### Szene 04 · 00:37.020–00:43.700 · Kleine Tests täuschen

Die kurzen Lyrics erhalten klare, bereits vorbereitete Motive, damit keine unlesbaren Miniszenerien entstehen.

| Gesangszeit | Bildaktion |
| --- | --- |
| 00:37.020–00:37.960 · «Ping goes through» | Kleines Testpaket passiert; Antwortlicht kehrt zurück. |
| 00:38.120–00:38.600 · «large one dies» | Grosses Paket verschwindet an der Grenze. |
| 00:38.940–00:39.840 · «Small test passes» | Derselbe kleine Test passiert erneut. |
| 00:40.000–00:40.360 · «truth still hides» | Rückfahrt: Die Engstelle liegt hinter einer dunklen Gehäusefläche. |
| 00:40.660–00:41.540 · «Trace the path» | Der gesamte Pfad wird als räumliches Drahtmodell sichtbar. |
| 00:41.760–00:42.120 · «lower the size» | Am Sender wird ein kleinerer Testkörper vorbereitet. |
| 00:42.540–00:43.700 · «watch the hidden fault arise» | Die Grenzfläche erscheint deutlich im Drahtmodell. |

Die Untersuchung visualisiert mehrere Tests. Ein gewöhnlicher Traceroute wird nicht als automatische MTU-Messung dargestellt.

### Szene 05 · 00:43.700–00:48.000 · Das Tor bekommt einen Namen

Die Messlinien lösen sich aus dem Drahtmodell und werden zur realen Architektur einer riesigen Prüfhalle. Die Kamera fährt unter dem Paket hindurch und richtet sich frontal auf das MTU-Tor aus.

Zulässige Kontur und Paketkontur liegen kurz übereinander. Der Unterschied ist sofort verständlich. Der Impuls um **00:43.980** verriegelt den Rahmen. Ab ungefähr **00:44.480** reduziert sich die Textur: Die Kamera hält die Spannung mit einer konzentrierten Annäherung. Der nächste grosse Anflug startet auf dem gemessenen Einsatz **00:48.000**, nicht erst auf der späteren Gesangszeile.

### Szene 06 · 00:48.000–01:01.580 · Erster Chorus

**00:48.000–00:49.340 – Instrumentaler Einsatz vor dem Gesang**

Auf den starken Transienten öffnet sich die monumentale Toransicht. Das Paket beschleunigt; der gesamte Raum reagiert mit einem bassgesteuerten Lichtpuls. Die Buchstaben werden erst auf den folgenden Gesang aktiviert.

**00:49.340–00:50.880 – «M-T-U. Can you pass it through?»**

Die Buchstaben M, T und U erscheinen nacheinander als massive Lichtzeichen oberhalb des Tores. Die Kamera rast mit dem grossen Paket darauf zu und wechselt unmittelbar vor der Grenze in eine seitliche Ansicht. Der Versuch scheitert.

**00:52.520–00:54.380 – «M-T-U. The packet knows the truth.»**

Makroaufnahme des Headers und der Grössenanzeige. Dann der direkte Schnitt auf die kleinere Grenzzahl am Ausgang. Das Verhältnis erklärt das Scheitern ohne zusätzliche Texttafel.

**00:54.980–00:57.460 – «Too big to ride, too small to see»**

Zunächst wirkt das Paket riesig neben der Öffnung. Ein extremer Rückzug zeigt, wie winzig diese einzelne Engstelle in der gesamten Infrastruktur ist.

**00:58.080–01:00.900 – «find the path …»**

Die Kamera verfolgt die vorhandene Route als leuchtende Linie. Der Pfad ist bekannt; seine nutzbare Grösse muss verstanden werden. Keine magisch auftauchende Ausweichroute löst das Problem.

Bis **01:01.580** richtet sich die Kamera wieder auf die DF-Klammer aus.

### Szene 07 · 01:01.580–01:16.000 · Don't fragment

**01:01.580–01:03.980 – «Don't fragment. Can't fragment.»**

Zwei Perspektiven derselben Klammer: zuerst das gesetzte DF-Merkmal, dann die geschlossenen Teilungsfugen. Präzise mechanische Bewegung, ohne Bruch oder Explosion.

**01:05.400–01:08.700 – «Path too narrow. Packet stranded.»**

Top-down-Ansicht eines breiten Korridors, der am Routerausgang eine kleinere zulässige Kontur besitzt. Ein verworfener Versuch wird als verblassender Umriss markiert. Der Sender wartet auf verwertbare Information.

**01:08.700–01:09.600 – Wiederholung «Don't fragment. Can't fragment.»**

Sehr kurze, rhythmisch abgestimmte Detailbilder von Header und Klammer. Die einmal erklärte Bildsprache reicht aus.

**01:12.460–01:15.600 – «Lower the size. Understand it.»**

Am Sender erscheint eine transparente Vorschau: Dieselben Datenmodule könnten auf mehrere kleinere neue Pakete verteilt werden. Diese Lösung bleibt zunächst als Drahtmodell sichtbar. Bis **01:16.000** fährt die Kamera in die äussere Hülle hinein.

### Szene 08 · 01:16.000–01:30.520 · Die verborgenen Hüllen

**01:16.000–01:19.680 – «Tunnel overhead … encapsulation»**

Wir wechseln in eine technische Explosionsansicht. Ein Datenkörper erhält eine zusätzliche transparente Transporthülle. Das innere Paket bleibt gleich gross, aber die äussere Kontur wächst. Die freie Reserve zur nächsten Grenzfläche wird kleiner.

**01:19.780–01:23.440 – «V-P-N wraps it, M-P-L-S too …»**

Zwei aufeinanderfolgende Beispiele zeigen die Idee: zuerst eine VPN-Hülle, danach eine separate Transportstrecke mit Label-Markierungen. Sie sind als alternative Anschauungsbilder gestaltet, nicht als Behauptung einer universellen Kapselungskette.

Verwende in dieser Passage keine pauschalen Overhead-Zahlen. Die konkreten Transportvarianten bleiben stilisiert. Die Bildaussage lautet: Zusätzliche Verpackung benötigt zusätzliche Kapazität.

**01:23.600–01:26.940 – «Discovery … ICMP should carry the code»**

Zurück zum Hauptpfad: Beim gescheiterten Versuch erzeugt der Router einen kleinen bernsteinfarbenen Rückmeldeimpuls. Eine kurze, lesbare Markierung zeigt `ICMP / MTU 1400`.

**01:27.240–01:30.520 – «If the message never comes back …»**

Die Kamera folgt ausschliesslich diesem Impuls rückwärts. Jetzt sehen wir deutlich die Filterfläche, an der er blockiert wird. Der Sender erfährt nichts von der Grenze und sendet erneut zu gross. Die Hauptstrecke zeigt eine schwarze Lücke, obwohl ihre kleinen Tests weiter funktionieren.

### Szene 09 · 01:30.520–01:44.880 · Vermessen, verstehen, neu senden

Der Break ist die grafisch präziseste Szene. Zahlen und Körper stehen frontal und gut lesbar im Raum. Die Messung zeigt ab etwa **01:30.810** mehr Pegellücken und weniger kontinuierlichen Tieftondruck. Nutze diese Offenheit für gezielte Einzelbewegungen. Bei **01:37.760** setzt ein starker Transient einen Akzent auf die engste Pfadgrenze.

| Gesangszeit | Bildaktion |
| --- | --- |
| 01:30.520–01:31.500 · «Fourteen hundred» | Ein mit `1400 B` beschrifteter IP-Testkörper passt in die Grenzkontur. |
| 01:31.700–01:32.840 · «Fifteen hundred» | Ein `1500 B` grosser IP-Testkörper überragt dieselbe Kontur. |
| 01:33.740–01:34.960 · «Jumbo frame» | Kurzer Wechsel zu einem getrennten L2-Grössenvergleich: Ein deutlich grösserer Frame fährt durch eine entsprechend ausgelegte Demonstrationsstrecke. Kein Jumbo-Frame durch das 1400-B-Tor. |
| 01:34.960–01:36.340 · «Do not fragment» | Zurück zur Hauptszene; die DF-Markierung bleibt aktiv. |
| 01:36.740–01:38.920 · «Path M-T-U» | Mehrere Grenzrahmen erscheinen entlang des Pfades. Der kleinste wird hervorgehoben. |
| 01:38.920–01:40.320 · «ICMP too big» | Die Filterregel für die notwendige Rückmeldung wird gezielt freigegeben. Der bernsteinfarbene Impuls erreicht den Sender. |
| 01:42.560–01:44.360 · «Reduce and retry» | Der Sender verteilt den Datenstrom auf neue, passend dimensionierte Pakete. Die Vorschau aus der Hook wird real. |

Die grössere Sendung wird nicht mitten im Netz auseinandergeschnitten. Alle Datenmodule bleiben erhalten und werden am Sender neu zugeordnet. Die kurze Reduktion ab ungefähr **01:43.320** lässt den Neuaufbau gross und ruhig erscheinen. Bis **01:44.880** steht der erste neue Körper bereit; Kamera und Bildausschnitt entsprechen dem ersten Chorus. Sein Start erfolgt auf dem gemessenen Wiedereintritt bei **01:44.880**.

### Szene 10 · 01:44.880–01:57.800 · Final Chorus: Jetzt passt es

**01:44.880–01:45.700:** Die neu erzeugten Pakete starten auf den musikalischen Wiedereintritt. Der Flug setzt bereits vor dem gesungenen «M-T-U» ein; den entscheidenden Durchtritt auf die anschliessende Zeile legen.

**01:45.700–01:47.920 – «M-T-U. Can you pass it through?»**

Wiederholung der Anfahrt aus dem ersten Chorus, mit derselben Torgrösse und Kameraposition. Diesmal passiert der Körper die Grenze. Die Kamera fliegt mit ihm hindurch und entdeckt den zuvor verborgenen Raum dahinter.

**01:49.240–01:51.260 – «M-T-U. The packet knows the truth.»**

Kurzer Rückblick auf die passenden Konturen. Eine ganze Folge neuer Pakete durchquert den Pfad, jedes mit dem bekannten magentafarbenen Datenkern.

**01:51.860–01:54.520 – «Too big to ride, too small to see»**

Als kurze Erinnerung liegt der alte, zu grosse Umriss transparent über der Szene. Er löst sich auf, während der neue Datenfluss weiterläuft. Kein erneuter Ausfall nach der Lösung.

**01:54.960–01:57.800 – «find the path … where the frame runs free»**

Die Kamera zieht in eine weite Gesamtansicht. Der gleiche Pfad, der zuvor eine schwarze Lücke besass, ist jetzt durchgehend aktiv. Am Empfänger fügen sich die übertragenen Datenmodule zu einem vollständigen abstrakten Bild zusammen.

### Szene 11 · 01:57.800–02:19.000 · Instrumentales Finale

Die Musik bleibt nach der letzten transkribierten Zeile aktiv. Diesen Abschnitt nicht als langen ruhigen Fade gestalten.

**01:57.800–01:59.120**

Die erfolgreiche Datenfahrt läuft weiter. Die Kamera verfolgt mehrere passende Pakete durch die bekannte Engstelle. Der Transfer beim Empfänger wird abgeschlossen.

**01:59.120–02:02.640**

Der gemessene Energieabfall gibt Raum für einen schwebenden Moment: nahe Einstellung des Rahmens, klare Konturen, langsam vorbeiziehende Daten. Keine Schwarzblende. Der Blick richtet sich auf die Strecke für einen letzten Anlauf.

**02:02.640–02:13.240**

Auf den deutlichen Wiedereintritt beschleunigt die Kamera erneut. Eine lange zusammenhängende Fahrt zeigt die vollständig funktionierende Infrastruktur. Mehrere Datenströme durchqueren die passenden Grenzen. Der stärkste gemessene 3-Sekunden-Lautheitsbereich liegt sogar zwischen 02:09.500 und 02:12.500: Hier eine aktive weite Totale mit Lichtbewegung zeigen.

**02:13.240–02:17.690**

Die Kamera ordnet sich zunehmend frontal zum letzten Tor. Der Titel **MTU** und klein **REDUCE AND RETRY** werden in die weiterhin lebendige Architektur integriert. Datenverkehr und Basspulse bleiben sichtbar; kein starres Schlussbild ab 02:13.

**02:17.690–02:19.000**

Auf dem letzten markanten Onset passiert ein passend dimensionierter Lichtkörper den Rahmen. Ungefähr ab **02:17.800** folgt die Bildhelligkeit dem schnellen tatsächlichen Pegelabfall. Der Film endet mit dem Audio auf Schwarz. Kein zusätzlicher Jingle und keine Verlängerung.

## 5. Technische Leitplanken für die Darstellung

Die folgenden Punkte dienen der visuellen Konsistenz; sie müssen nicht als Lehrtext eingeblendet werden.

- Die Hauptgeschichte verwendet IPv4, passend zum DF-Bit. Bei zu grossem Paket und gesetztem DF zeigt sie Verwerfen plus eine erzeugte ICMP-Rückmeldung, deren Rückweg zunächst blockiert ist. Die passende IPv4-Bezeichnung lautet **Destination Unreachable – Fragmentation Needed**, Type 3 / Code 4. Die Lyric «ICMP too big» bleibt unverändert; kein IPv6-Type-2-Overlay in dieser Szene. [1]
- `1400 B` und `1500 B` beziehen sich in der Hauptszene auf die gesamte IP-Paketlänge inklusive IP-Header. Diese Zahlen nicht als Anwendungsnutzlast oder vollständige Ethernet-Frame-Länge beschriften. Die `1400 B` sind ein illustratives Szenario, keine Empfehlung. [1]
- Die Engstelle bleibt bei der Lösung unverändert. Der Sender berücksichtigt die erkannte Pfadgrenze und erzeugt kleinere Pakete. Eine Darstellung von TCP-Neusegmentierung darf nicht als IP-Fragmentierung im Router beschriftet werden. [1]
- Kleine erfolgreiche Tests können neben scheiternden grossen Übertragungen bestehen. Die visuelle Störung betrifft in dieser Geschichte die fehlende PMTU-Rückmeldung; sie ist weder ein vollständiger Leitungsausfall noch zwangsläufig ein Bandbreitenproblem. [2]
- Paketgrössen sind als räumliche Metapher dargestellt. Reale Bytes sind keine mechanischen Transportblöcke. Unterschiedliche Grössen müssen trotzdem in allen wiederkehrenden Einstellungen konsistent bleiben.
- Zeige eine gezielte Freigabe der relevanten Rückmeldung, nicht das Abschalten einer gesamten Firewall. Die Filmhandlung kombiniert diese Korrektur mit anschliessender Anpassung am Sender.

### Fachliche Referenzen

1. [RFC 1191 – Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc1191), insbesondere Protokollablauf und Routerverhalten.
2. [RFC 2923 – TCP Problems with Path MTU Discovery](https://www.rfc-editor.org/rfc/rfc2923), insbesondere PMTUD-Black-Hole-Verhalten.

## 6. Asset- und Szenenliste für den Video-Agenten

| Modul | Benötigte Varianten und Animationen |
| --- | --- |
| Datenkörper | Kleine Tests, zu grosse Versuche, passende neue Pakete; parametrisierte Grösse |
| Paketinneres | Header, einzelne Datenmodule, DF-Klammer, optional kurze Beschriftungen |
| Sender | Warteschlange, Paketaufbau, wiederholte Versuche, Anpassung der Paketgrösse |
| Router und Grenztor | Feste Grössenrahmen, Drop-Effekt, Erzeugung einer Rückmeldung |
| Pfad | Mehrere Links, feste Engstelle, Vorwärts- und Rückmeldepfad |
| Filterfläche | Gesperrte und gezielt freigegebene ICMP-Rückmeldung |
| Transportbeispiele | VPN-Aussenhülle und separate MPLS-Label-Darstellung |
| Empfänger | Eingehende Pakete, Datenzusammenbau, Bestätigung |
| Nutzeransicht | Neutraler Bildschirm mit stockendem und später abgeschlossenem Transfer |
| Typografie | MTU, DF=1, Grössenlabels, ICMP / MTU 1400, REDUCE AND RETRY |

Es reichen wenige sorgfältig gestaltete, wiederverwendbare Räume. Abwechslung entsteht aus Massstab, Zustand, Perspektive und Licht; jede Strophe benötigt keine neue Welt.

## 7. Umsetzung als codebasiertes Video

1. Prüfe den vorhandenen Projektaufbau und die verfügbaren 3D-Werkzeuge. Wähle einen reproduzierbaren Workflow, etwa Blender mit Python oder eine bestehende Three.js-Renderpipeline. Begründe die Auswahl knapp.
2. Verwende die analysierte Datei `08_MTU_0.2-2.wav` unverändert als Master-Audio. Kein neues Musikstück erzeugen, kein Tempo verändern und keine zusätzlichen Stimmen einfügen. Zusätzliche Geräusche sind für dieses Musikvideo nicht erforderlich.
3. Übertrage die Szenen in eine zentrale Timeline mit Start, Ende, Kamera, Objektzuständen und Cue-Ereignissen. Die oben angegebenen Gesangseinsätze sind Anker; harte Schnitte sind nicht bei jeder Zeile erforderlich.
4. Lade `ASTRA-AUDIO-ANALYSE.json`. Nutze `events` für Hauptaktionen, `onsets` für kurze Akzente und `features_100ms` für kontinuierliche Steuerung. Die `lyrics` stammen weiterhin unverändert aus dem Transkript. Überprüfe die Haupt-Cues beim Abspielen der Animatic. Stelle Tempo und Audio nicht künstlich auf ein perfektes Raster um.
5. Baue zuerst eine komplette Animatic über 139 Sekunden. Paketgrössen, Engstelle, blockierte Rückmeldung und Lösung müssen bereits mit einfacher Geometrie verständlich sein.
6. Entwickle danach Materialien, Licht, feine Geometrie und Effekte. Halte Zufallseffekte deterministisch. Jeder Frame muss unabhängig vom vorherigen Frame korrekt aus der Zeitposition berechnet werden können.
7. Verwende Parameter für Paketgrösse, Grenzgrösse, Header, Hüllen und Nutzdaten. Unterscheide die Geometrie eines IP-Pakets vom separaten Jumbo-Frame-Beispiel.
8. Rendere zunächst die kritischen Einstellungen: Grössenvergleich, Drop, ICMP-Blockierung, Neuaufbau am Sender und erfolgreicher Durchflug. Prüfe insbesondere, dass das Tor im Finale nicht unbemerkt grösser geworden ist.
9. Berechne Audio-Steuerkurven mit Attack/Release vorab, sodass sie auch bei beliebiger Renderreihenfolge identisch bleiben. Nutze Bass hauptsächlich für Licht und Objektaktivität; die Hauptkamera bleibt dramaturgisch geführt. Rendere die vollständige Vorschau und prüfe sie in Bewegung. Erst danach folgt die finale Fassung. Bei 30 fps umfassen 139 Sekunden genau 4170 Frames mit den Indizes 0 bis 4169; der letzte Frame endet bei 139 Sekunden.
10. Liefere den Film als MP4 mit H.264, eine kleinere Vorschau, den vollständigen Szenencode beziehungsweise die Projektdateien sowie eine README mit Renderbefehlen. Die WAV dauert 139.000166667 s, nur acht Samples länger als das Transkript. Verwende 4170 Bildframes für nominell 139 s, erhalte das Originalaudio und vermeide wegen der 0.167-ms-Differenz einen zusätzlichen Standbildframe.

## 8. Abnahmekriterien

- Die Geschichte ist ohne eingeblendete Lehrtexte verständlich: Kleine Pakete gehen durch, grosse scheitern, die Rückmeldung fehlt, passende neue Pakete lösen das Problem.
- Die beiden Refrains zeigen erkennbar dieselbe Engstelle mit unterschiedlichem Ausgang.
- DF bleibt konsistent; die Lösung wird nicht als verbotene Fragmentierung am Router gezeigt.
- Bei der Anpassung verschwinden keine Nutzdaten. Sie werden am Sender auf neue Pakete verteilt.
- Die Hauptszene und die Kapselungsbeispiele verwenden keine widersprüchlichen Grössenbeschriftungen.
- Schnelle Lyrics erhalten klar erkennbare Motive statt hektischer, unlesbarer Infotafeln.
- Alle Zeitbereiche bis 02:19.000 sind gestaltet. Ab 02:02.640 bleibt die Bildwelt bis zum letzten Impuls aktiv; der schnelle Endfade beginnt erst ungefähr bei 02:17.800.
- Die instrumentalen Einsätze bei 00:48.000 und 01:44.880 werden nicht durch ein ausschliessliches Warten auf die Gesangszeiten verpasst.
- Der originale Track bleibt unverändert und bildet die zeitliche Grundlage.
- Kein Selution-Material und keine andere Firmenwerbung erscheinen im Film.
- Das Ergebnis wirkt wie ein Musikvideo mit Spannung und Auflösung, getragen von der visuellen Idee einer unsichtbaren Grössengrenze.
