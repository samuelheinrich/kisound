#!/usr/bin/env python3
"""Build distinct, audio-linked film scripts after the analysis JSON exists."""
import argparse
import json
from pathlib import Path
from analyse import TARGET, TRACKS, tc, backup

STORIES = {
'00_Network_Engineers': {
 'title':'Die Nachtwache der Verbindung', 'idea':'Ein Dienst bleibt erreichbar, weil unsichtbare Menschen Störungen erkennen, eingrenzen und gemeinsam beheben. Die Kamera wechselt zwischen Alltag und der Nachtwache im Netzbetrieb.',
 'arc':'stille Verantwortung → erste Unruhe → koordinierte Diagnose → Rückkehr des Dienstes → aktive Wache bis zum letzten Ton',
 'palette':'Nachtblau, matte Displays, bernsteinfarbene Warnungen, erst nach stabiler Verbindung zurückkehrendes Grün.',
 'motifs':'Ein schmaler Lichtfaden durch Wohnungen, Rechenzentrum und Funkzelle; Hände an Patchfeldern; langsam wandernde Statuspunkte.',
 'beats':['Vor dem ersten Login: leerer Arbeitsplatz und ruhende Displays; ein einzelner Überwachungspunkt lebt.','Eine nächtliche Stadt öffnet sich in voneinander getrennten Nutzerszenen; Lichtfäden verbinden sie mit der Leitwarte.','Im Rack erscheinen Uplinks und Reservepfade; die Nachtcrew prüft Anzeigen und bleibt als handelnde Figur sichtbar.','Warnlichter sammeln sich. Die Crew korreliert Alarme statt blind Kabel zu ziehen.','Die Ursache wird auf einer Topologie isoliert; ein alternativer Pfad trägt den Datenstrom.','Im Break erhalten Link, Route, Port und Paket je ein eigenes knappes grafisches Zeichen.','Die Nutzersicht und Leitwarte werden im Wechsel montiert; Fehlerbehebung wird zu Teamarbeit.','Der Dienst ist wieder stabil, aber die Überwachung bleibt wach.','Instrumentales Finale: weite Stadtansicht mit weiter pulsierenden Verbindungen; Abschluss erst mit gemessenem Endabfall.'],
 'camera':'Wechsel von beobachtenden Totalen zu ruhigen Hand- und Display-Nahaufnahmen; beim Energieanstieg eine einzige weite Kranfahrt.',
 'tech':'Ein Alarm ist noch keine Ursache. Failover verwendet einen vorhandenen alternativen Pfad; ein verworfenes Paket wird nicht rückwirkend repariert.',
 'assets':'Leitwarte, Rack, Stadtminiaturen, unabhängige Statusanzeigen, abstrahierte Topologie, Lichtfaden, Figuren-Silhouetten.'},
'01_Layer_2': {
 'title':'Die Stadt der Frames', 'idea':'Eine flache, geometrische Stadt lernt, welche MAC-Adresse an welchem Port erreichbar ist. VLANs sind räumlich getrennte Bezirke; eine Schleife bedroht ihre Ordnung.',
 'arc':'Orientierung → Lernen → anwachsende Schleife → Blockierung → klare Weiterleitung',
 'palette':'Petrol und Kupfer; VLAN 10 cyan, VLAN 30 violett; Schleifenwarnung als schmales Rot.',
 'motifs':'MAC-Tabelle als beleuchtete Fassadenmatrix, Ethernet-Frames als flache Karten, Porttore mit klaren Zuständen.',
 'beats':['Zwei Schichten der Stadt liegen zwischen Kabel und Routinghorizont.','Ein unbekannter Ziel-MAC führt zu vorsichtigem Flooding innerhalb eines VLANs; die Quelladresse wird gelernt.','Lernende Tabelle füllt sich; bekannte Unicast-Frames finden gezielt ihren Ausgang.','Zwei VLAN-Bezirke werden über einen Trunk mit sichtbar markierten Tags verbunden.','Eine redundante Schleife vervielfältigt Kopien; das Bild verdichtet sich, ohne einen Routerfehler zu behaupten.','BPDUs wählen eine Baumstruktur; ein Port stoppt den Weiterleitungspfad der Schleife.','Im Bridge-Teil erscheinen BPDU, Trunk, Access Port und MAC Move als vier mechanische Nahaufnahmen.','Die Reprise zeigt den nun stabilen Weg aus anderer Kameraposition.','Instrumentaler Ausklang: geordnete Frame-Ströme bleiben bis zum realen Audioende in Bewegung.'],
 'camera':'Isometrische Stadttotalen, senkrechte Fahrten entlang von Portfassaden, harte orthogonale Schnitte bei gemessenen Transienten.',
 'tech':'MAC-Lernen nutzt Quelladressen. Unbekannter Unicast und Broadcast bleiben im jeweiligen VLAN. Ein Access Port und ein 802.1Q-Trunk erhalten unterschiedliche Darstellung. Spanning Tree blockiert Schleifenpfade.',
 'assets':'Switch-Stadt, MAC-Matrix, Porttore, VLAN-Bezirke, Trunk-Brücke, BPDU-Signale, Frame-Karten.'},
'02_OSPF_Neighbors': {
 'title':'Der Atlas wird gemeinsam gezeichnet', 'idea':'Router als Kartografen ergänzen einen gemeinsamen Netzatlas. Aus Hello, Nachbarschaft und Link-State-Information entsteht eine neue Route.',
 'arc':'vereinzelte Knoten → Nachbarschaft → Rollenklärung → Datenbankabgleich → Konvergenz',
 'palette':'Tiefes Ultramarin, topografische Linien in Eisblau, warme Orangeakzente für neue LSAs.',
 'motifs':'Kartenblätter, benachbarte Knoten, Linkkosten als Gewichte, ein entstehender kürzester Pfad.',
 'beats':['Eine leere Karte zeigt Links ohne bekannte Gegenstelle.','Hello-Signale treffen benachbarte Router auf derselben Verbindung.','Die Nachbarschaftsbeziehung wird sichtbar; Zustände bleiben beschriftet, ohne aus jedem Two-Way ein Full zu machen.','Auf einem Mehrzugangssegment werden DR und BDR als besondere Rollen dargestellt.','Kartenblätter synchronisieren sich, bis die Topologie konsistent erscheint.','LSAs tragen Änderungen durch den Bereich; der Atlas wird neu gezeichnet.','SPF markiert beste Wege und bei gleichen Kosten mehrere mögliche nächste Hops.','Eine spätere Änderung führt zu neuer Berechnung und beruhigter Karte.','Instrumentales Ende: Der Atlas bleibt lebendig, bis die Musik tatsächlich ausklingt.'],
 'camera':'Schwebende Kartografie mit Tiefenstaffelung; Knoten-Nahaufnahmen bei Call-and-Response, weite Topologie bei anhaltendem Energieanstieg.',
 'tech':'DR/BDR nur auf geeignetem Mehrzugangsnetz zeigen. Two-Way ist nicht automatisch Full. LSAs beschreiben Link-State-Information; SPF berechnet Wege aus der Datenbank. ECMP nur bei gleichen Kosten.',
 'assets':'Topologiekarte, Routerknoten, Hello-Impulse, Kartenblätter, DR/BDR-Plaketten, SPF-Pfadleuchten.'},
'03_Its_Always_DNS': {
 'title':'Der Fall des verschwundenen Namens', 'idea':'Ein Detektivfall über eine funktionierende IP-Verbindung und eine fehlerhafte Namensauflösung. Hinweise sind Cache, TTL, Antworten und Zonenansichten.',
 'arc':'falscher Alarm → Ausschlussdiagnose → DNS-Spur → widersprüchliche Antworten → Auflösung mit ironischem Nachhall',
 'palette':'Dunkles Aktenblau, Papierweiss, gelbe Suchmarken, leuchtendes Magenta für widersprüchliche DNS-Antworten.',
 'motifs':'Fallakte, Lupe, Fragezettel mit Hostname, Antwortumschläge, Sanduhr für TTL.',
 'beats':['Ein Nutzer meldet «Network down»; die Fallakte öffnet sich.','Ping und Route liefern Hinweise, die IP-Erreichbarkeit belegen, aber keinen Namensfehler ausschliessen.','Kabel, Port und Firewall erscheinen als überprüfte Spuren.','Die Lupe findet den fehlenden Hostnamen; erste DNS-Abfrage wird sichtbar.','Antwort und TTL werden als Umschlag und Sanduhr inszeniert.','Veralteter Cache und uneinheitliche Ansichten verschiedener Resolver bilden ein Spiegellabyrinth.','NXDOMAIN erscheint als echte negative Antwort, nicht als verschwundenes Paket.','Eine gezielte neue Abfrage klärt die aktuelle Antwort; die Akte wird geschlossen.','Die lange musikalische Reprise dreht den Fall noch einmal aus Nutzersicht; keine erfundenen Textzeilen einblenden.','Bis zum Audioende bleibt die Namenskarte aktiv; Schluss nur bei tatsächlichem Ausklang.'],
 'camera':'Noir-Makros über Akten und Displays; Kamerafahrt entlang der Abfragekette; rhythmische Jump-Cuts nur auf gemessene Transienten.',
 'tech':'DNS-Namensauflösung und IP-Erreichbarkeit getrennt darstellen. TTL beschreibt Cache-Lebensdauer. NXDOMAIN bedeutet, dass der abgefragte Name nicht existiert; ein Timeout ist ein anderer Befund. Cache-Flush ist nicht automatisch die dauerhafte Fehlerbehebung.',
 'assets':'Fallakte, DNS-Fragezettel, Resolver-Schreibtische, Cache-Regal, TTL-Sanduhr, Zonen-Spiegel, Antwortumschläge.'},
'04_Destination_Unreachable': {
 'title':'Die Spur verliert sich', 'idea':'Ein Signal verschwindet auf dem Weg zum Ziel. Ein visuelles Ermittlungsprotokoll zeigt jeden gemessenen Hop und die Grenzen dessen, was ein fehlender Reply beweist.',
 'arc':'Sendung → Schweigen → Spurensuche → mehrere mögliche Ursachen → offenes, präzises Ende',
 'palette':'Graphit, Nebelgrau, kaltes Cyan; Fehlermeldungen nur als kurze rote Zeichen.',
 'motifs':'Wachsende Hop-Nummern, verblassende Wegmarken, schwarzer leerer Kartenraum, unvollständige Antwortzettel.',
 'beats':['Ein Zielpunkt glimmt hinter Nebel; ein erster Prüfimpuls startet.','ICMP-Meldungen und fehlende Antworten werden als verschiedene Karten abgelegt.','Ein Paket überquert bekannte Knoten und verschwindet hinter einer Grenze.','Traceroute erhöht seine TTL schrittweise; jeder antwortende Hop hinterlässt eine Markierung.','Ein Stern auf der Karte bedeutet fehlende Antwort auf diesen Probe, nicht zwingend ein defekter Router.','Ein fehlender Präfix oder Filter wird als prüfbare Hypothese gezeigt.','Die zweite Suche vergleicht Pfad- und Rückwegspuren; die Ursache bleibt nur so bestimmt wie die Daten.','Finale: Die Landschaft wird weiter abgefahren, während die Stimme abklingt.','Das tatsächlich lange Ende erhält aktive Kamera- und Lichtbewegung bis zum letzten Audioabschnitt.'],
 'camera':'Langsame Noir-Trackingfahrt entlang einer Karte; kurze ruhige Standbilder bei Lücken; einzelne markante Onsets als neue Hop-Stempel.',
 'tech':'ICMP Destination Unreachable, Time Exceeded und fehlende Antwort unterscheiden. Ein fehlender Traceroute-Hop beweist keinen Paketverlust für gesamten Transit. TTL wird pro Hop reduziert.',
 'assets':'Nebelkarte, Hop-Stempel, TTL-Zähler, ICMP-Karten, Ziellicht, Diagnosefäden.'},
'05_WiFi_Roaming': {
 'title':'Durch die Funkräume', 'idea':'Eine mobile Figur durchquert Räume mit überlappenden Funkzellen. Ihre Entscheidung zum Wechsel steht im Zentrum, nicht ein Paketflug durch Kabel.',
 'arc':'Verbindung → schwächeres Signal → zögernder Client → Scan und Wechsel → neuer stabiler Raum',
 'palette':'Warme Innenräume mit cyanfarbenen Funkflächen; störende Überlappung in gebrochenem Gelb; Radarereignis als kurzes Rot.',
 'motifs':'Funkwellen als transparente Räume, Signalbalken, Beacon-Lichtpunkte, Türschwellen.',
 'beats':['Die Figur verbindet sich in einem ruhigen Eingangsraum.','Sie geht in den Flur; die alte Zelle wird schwächer, bleibt aber noch erreichbar.','Ein überlappender Kanal erzeugt visuelles Rauschen und macht die Entscheidung dringlich.','Beacons aus dem nächsten Raum werden sichtbar; der Client prüft Alternativen.','An der Tür erfolgt der Wechsel der Assoziation; dieselbe SSID kann an mehreren APs erscheinen.','Eine DFS-Unterbrechung wird als eigener, kurzer Kanalwechsel gezeigt.','Im zweiten Vers werden Wände, Meetingräume und Empfangsqualität räumlich lesbar.','Probe und Antwort sind einzelne Funkwechsel, anschliessend folgt die neue Verbindung.','Der Final Chorus zeigt eine flüssige Bewegung durch mehrere Räume.','Instrumentales Ende: Die Figur bleibt in Bewegung, solange die Musik Energie trägt.'],
 'camera':'Stete Seitwärtsfahrt auf Augenhöhe, kreisende Sicht in der Funkzelle, kurze Draufsicht für Überlappung; Wechselimpulse auf gemessene Cues.',
 'tech':'Der Client trifft die Roaming-Entscheidung; RSSI und SNR sind verschiedene Grössen. Gleiche SSID kann mehrere BSSIDs haben. DFS-Radar kann einen Kanalwechsel auslösen. Captive Portal ist nicht Bestandteil des eigentlichen 802.11-Roamings.',
 'assets':'Mobile Figur, AP-Leuchten, Funkraum-Shader, Beacon-Punkte, BSSID-Markierungen, Türschwellen, Kanalplan.'},
'06_Multicast': {
 'title':'Ein Signal für die Zuhörer', 'idea':'Eine Bühne sendet einen einzigen Strom, der sich an Verzweigungen nur dorthin fortsetzt, wo Empfänger einer Gruppe beigetreten sind.',
 'arc':'eine Quelle → erste Zuhörer → geordnete Verteilung → Grenzübertritt → lebendige, selektive Gemeinschaft',
 'palette':'Schwarzblau mit smaragdgrünen Empfangsgruppen; Quellsignal in warmem Weiss; ungenutzte Äste bleiben dunkel.',
 'motifs':'Bühnenlicht, Zuhörersitze, Gruppenring, Verzweigungsbaum, an- und abmeldende Plätze.',
 'beats':['Eine Quelle beginnt vor leeren Reihen zu senden.','Einzelne Empfänger melden Interesse an; nur ihre Sitzplätze leuchten.','Unicast, Anycast und Multicast erscheinen als drei klar getrennte Bühnenbilder.','IGMP-Meldungen markieren Mitgliedschaft im lokalen Netz.','Der Chorus öffnet einen Verteilbaum zu mehreren interessierten Empfängern.','Router erweitern den Weg mit PIM über Netzgrenzen.','Ein Rendezvous-Punkt erscheint nur als möglicher Bestandteil eines PIM-SM-Szenarios.','Join, Leave und Query verändern die Gruppe; unbestellte Äste bleiben dunkel.','Im Bridge wird die selektive Verteilung als weite Totale sichtbar.','Finale und Outro führen Antworten des Queriers bis zum echten Endabfall weiter.'],
 'camera':'Von der einsamen Bühnenfront in eine Vogelperspektive über verzweigte Sitzreihen; beim anhaltenden Energieanstieg wächst die Kamera räumlich mit.',
 'tech':'IGMP signalisiert lokale Gruppenmitgliedschaft; PIM organisiert Multicast-Routing zwischen Routern. Ein RP ist für bestimmte PIM-SM-Phasen relevant, nicht für jede Multicast-Variante. Uninteressierte Segmente nicht als reguläre Empfänger zeigen.',
 'assets':'Signalbühne, Sitzgruppen, Mitgliedschaftsringe, Routerzweige, PIM-Wege, Querier-Licht, optionaler RP-Knoten.'},
'07_Firewall_State_Table': {
 'title':'Das Gedächtnis des Tors', 'idea':'Eine Sicherheitsarchitektur entscheidet anhand von Regel, Richtung und Verbindungszustand. Das Tor merkt sich erlaubte Sessions und erkennt unpassende Rückkehrer.',
 'arc':'geschlossene Grenze → geregelter Einlass → komplexere Übersetzung → Bedrohungsdruck → nachvollziehbarer Zustand',
 'palette':'Obsidian, klares Weiss für Regeln, Bernstein für erlaubte Zustände, knappes Rot für Deny.',
 'motifs':'Transparente Zustandskarten, Regelzeilen, Eingangs- und Ausgangstore, Protokollspuren.',
 'beats':['Eine geschlossene Grenzlinie zeigt «default deny» als Ausgangslage.','Ein erster Verbindungswunsch erhält einen Regelentscheid.','Quelle, Ziel, Port und Richtung erscheinen als getrennte Angaben.','Erlaubte Session legt eine Zustandskarte an; passende Rückpakete können zugeordnet werden.','NAT verändert Adressdarstellung, nicht automatisch die Sicherheitsentscheidung.','Unpassende oder unerwartete Pakete werden verworfen und nachvollziehbar protokolliert.','Im Chorus tritt Least Privilege als wenige präzise geöffnete Wege auf.','SYN und ACK erscheinen in korrekter Reihenfolge einer TCP-Sitzung.','Die finale Hook zeigt eine wachsende, aber lesbare State Table.','Das instrumentale Ende führt aktive Sessions und Logs bis zum Audioende fort.'],
 'camera':'Symmetrische Architektur, frontale Regel-Nahaufnahmen und seitliche Durchfahrten; kurze präzise Cuts bei Drop/Log-Cues.',
 'tech':'Stateful Inspection ordnet Verkehr einer Verbindung zu; ACL und State Table sind unterschiedliche Konzepte. NAT, Policy und Logging getrennt darstellen. Eine SYN/ACK-Folge nicht als generelle Regel für jedes Protokoll ausgeben.',
 'assets':'Torarchitektur, Policy-Tafel, State-Karten, NAT-Prismen, Log-Schrift, TCP-Sitzungsmarker.'}
}

LYRIC_ACTIONS = {
 '00_Network_Engineers':[('alarms','Warnlichter sammeln sich; die Nachtcrew korreliert die Meldungen in der Leitwarte.'),('failover','Ein vorhandener Reservepfad übernimmt den Datenstrom.'),('packets move','Die Karte zeigt wieder durchgehenden Verkehr zwischen Nutzern und Dienst.')],
 '01_Layer_2':[('mac table','Die Quelladresse wird sichtbar in die MAC-Tabelle eingetragen.'),('v-lan','Zwei VLAN-Bezirke werden sauber getrennt und auf dem Trunk markiert.'),('bpdu','BPDUs markieren die Baumwahl; ein Schleifenpfad geht in Blockierung.')],
 '02_OSPF_Neighbors':[('hello','Zwei direkte Nachbarn tauschen Hello-Signale auf einem Link.'),('are you dr','Die Rollen DR und BDR werden nur auf dem gezeigten Mehrzugangssegment geklärt.'),('lsa','Ein Link-State-Kartenblatt wird an die Nachbarn weitergegeben.'),('spf','Der Atlas berechnet und markiert einen neuen kürzesten Weg.')],
 '03_Its_Always_DNS':[('ping','Ping- und Routing-Hinweise werden in der Fallakte abgelegt.'),('check the cable','Kabel, Port und Firewall werden als getrennte Spuren überprüft.'),('cache is old','Ein veralteter Cache steht einem aktuellen Resolver gegenüber; die TTL-Sanduhr läuft.'),('nxdom','Eine negative DNS-Antwort erscheint klar als NXDOMAIN-Karte.'),('flush it','Der Cache wird gezielt geleert und dieselbe Frage neu gestellt.'),('its always dns','Der fehlende Hostname wird im Zentrum der Fallakte sichtbar.')],
 '04_Destination_Unreachable':[('traceroute','Die TTL der Prüfpakete wächst; antwortende Hops hinterlassen Stempel.'),('ttl expired','Ein Time-Exceeded-Zettel markiert einen antwortenden Hop.'),('where did the packet','Die Nebelkarte lässt den Pfad an der ungeklärten Stelle offen.')],
 '05_WiFi_Roaming':[('sticky client','Die mobile Figur hält zu lange an der schwächer werdenden Zelle fest.'),('beacon','Beacons aus dem nächsten Raum eröffnen eine neue Wahl.'),('probe request','Eine Probe-Anfrage und die passende Antwort gehen als getrennte Funksignale über die Türschwelle.'),('roam','Die Figur löst die alte Zuordnung und baut die neue Funkbeziehung auf.')],
 '06_Multicast':[('i-g-m-p','Interessierte Empfänger melden ihre Gruppenmitgliedschaft lokal an.'),('p-i-m','Der Verteilbaum erweitert sich zwischen Routern auf interessierte Netze.'),('join','Ein Gruppenring leuchtet für neu beigetretene Zuhörer auf.'),('querier','Der Querier fragt, welche Zuhörer weiterhin Mitglied sind.')],
 '07_Firewall_State_Table':[('default deny','Die Grenze bleibt geschlossen, bis eine explizite Regel einen Weg öffnet.'),('nat','Ein Adressprisma zeigt die Übersetzung getrennt vom Regelentscheid.'),('s-y-n','Ein TCP-SYN eröffnet den möglichen Sitzungsaufbau; die Zustandskarte wartet auf passende Folgepakete.'),('state table','Die Zustandskarten werden lesbar in einer zeitlich geordneten Tabelle geführt.'),('drop it','Ein nicht passendes Paket wird am Tor verworfen und protokolliert.')]
}

def lyric_action(name,lyrics,default):
    joined=' '.join(x['text'].lower() for x in lyrics)
    for needle,action in LYRIC_ACTIONS[name]:
        if needle in joined: return action
    return default

def choose_boundaries(data):
    dur=data['summary']['duration_s']; starts=[0.0]
    for s in data['sections']:
        t=s['start_s']
        if t-starts[-1]>=10 and dur-t>=5: starts.append(t)
    last=max((l['end_s'] for l in data['lyrics']['segments']),default=0)
    if last-starts[-1]>=9 and dur-last>=4: starts.append(last)
    if dur-starts[-1]<5 and len(starts)>1: starts.pop()
    starts=sorted(set(starts+[dur])); expanded=[starts[0]]
    structure=[e['time_s'] for e in data['events'] if e['type'] in {'energy_rise','energy_fall','fade_candidate'}]
    for end in starts[1:]:
        while end-expanded[-1]>27:
            goal=expanded[-1]+20
            choices=[t for t in structure if expanded[-1]+12<t<min(end-8,expanded[-1]+27)]
            cut=min(choices,key=lambda t:abs(t-goal)) if choices else goal
            expanded.append(round(cut,3))
        expanded.append(end)
    return expanded

def main():
    ap=argparse.ArgumentParser();ap.add_argument('tracks',nargs='*',default=TRACKS);args=ap.parse_args()
    for name in args.tracks:
        if name not in TRACKS: raise SystemExit(f'Nicht freigegebener Track: {name}')
        p=TARGET/name/'ASTRA-AUDIO-ANALYSE.json'
        if not p.exists(): continue
        d=json.loads(p.read_text()); st=STORIES[name]; bounds=choose_boundaries(d); events=d['events']; lyrics=d['lyrics']['segments']; dur=d['summary']['duration_s']
        conf={'mittel':'mittlerer','gering':'geringer','hoch':'hoher'}[d['tempo']['confidence']]
        lines=[f'# {name.replace("_"," ")} – ASTRA-DREHBUCH','',f'## Leitidee und emotionaler Verlauf','',st['idea'], '',f'**Verlauf:** {st["arc"]}.', '', '## Bildsprache und wiederkehrende Motive','',f'**Farbe und Material:** {st["palette"]}', '',f'**Motive:** {st["motifs"]}', '',f'**Kamera:** {st["camera"]}', '', '## Grundlage und Synchronisation','',f'Originalaudio `{d["source"]["filename"]}`, SHA-256 `{d["source"]["sha256"]}`. Dauer {tc(dur)}. Die zugehörige Analyse misst {d["summary"]["integrated_lufs"]} LUFS, {d["summary"]["true_peak_dbtp_rounded"]} dBTP und empfiehlt ein geschätztes Raster von {d["tempo"]["recommended_bpm"]} BPM mit {conf} Sicherheit.','', 'Gesangszeiten stammen unverändert aus dem vorhandenen automatisch erzeugten Transkript. Eine manuelle Hörprüfung wird nicht behauptet. Gemessene Ereignisse und redaktionelle Bildideen bleiben im JSON durch `origin` unterscheidbar. Keine sichtbaren Firmenzeichen oder ASTRA-Marke im Film.','', '## Vollständige Szenenübersicht','', '| Szene | Start–Ende | Bildhandlung | Audio- und Textanker | Event-IDs |','| --- | --- | --- | --- | --- |']
        scene_rows=[]
        for i,(a,b) in enumerate(zip(bounds,bounds[1:])):
            beatidx=min(len(st['beats'])-1,round(i*(len(st['beats'])-1)/max(1,len(bounds)-2))); action=st['beats'][beatidx]
            ls=[x for x in lyrics if a<=x['start_s']<b]; action=lyric_action(name,ls,action); es=[e for e in events if a<=e['time_s']<b and e['type'] in {'transient','energy_rise','energy_fall','section_boundary','fade_candidate','level_gap'}]
            anchor=' / '.join(x['text'] for x in ls[:2]) if ls else 'Instrumental, keine Textzeile belegt'
            ids=', '.join(e['id'] for e in es[:4]) or '—'; scene_rows.append((i+1,a,b,action,anchor,es,ls));lines.append(f'| {i+1:02d} | {tc(a)}–{tc(b)} | {action} | {anchor} | {ids} |')
        lines+=['','## Regie, Kamera und Übergänge','']
        for num,a,b,action,anchor,es,ls in scene_rows:
            major=[e for e in es if e['type'] in {'energy_rise','energy_fall','section_boundary','fade_candidate'}]
            impact=[e for e in es if e['type']=='transient']
            cam='Langsame räumliche Fahrt, deren Richtung am Szenenanfang festgelegt ist.' if num%3==1 else ('Seitliche Verfolgung mit lesbarer Tiefe und ruhigem Horizont.' if num%3==2 else 'Kurze Nahaufnahme, danach Öffnung zur Übersicht.')
            lines+=[f'### Szene {num:02d} · {tc(a)}–{tc(b)}','',f'**Aktion:** {action}', '',f'**Kamera:** {cam} {st["camera"]}', '',f'**Textbezug:** {anchor} '+('Weitere Zeilen: '+' / '.join(x['text'] for x in ls[2:5]) if len(ls)>2 else ''),'']
            if major: lines.append('**Struktur-Cues:** '+'; '.join(f'{e["id"]} bei {e["timecode"]}: {e["observation"]}. {e["image_action"]}' for e in major[:3])+'.')
            else: lines.append('**Struktur:** Die Szene folgt ihrem gemessenen Pegelverlauf ohne behaupteten neuen Songteil.')
            lines.append('')
            if impact: lines.append('**Einzelimpuls:** '+f'{impact[0]["id"]} bei {impact[0]["timecode"]} als prägnante Licht- oder Formaktion. Der Onset ist keiner bestimmten Klangquelle zugeordnet.')
            else: lines.append('**Einzelimpulse:** Nur bei tatsächlich gemessenen Onsets dezente Sekundärbewegung.')
            lines+=['',f'**Übergang:** Bei {tc(b)} in die nächste Perspektive überführen; bei anhaltender Energie Bewegung weiterlaufen lassen.','']
        lastv=max((x['end_s'] for x in lyrics),default=0); tail=[e for e in events if e['time_s']>=lastv and e['type'] in {'energy_rise','energy_fall','fade_candidate','end'}]
        lines+=['## Instrumentale Passagen und tatsächliches Ende','',f'Die letzte übernommene Gesangszeile endet bei {tc(lastv)}. Der Tonträger läuft bis {tc(dur)}. Zwischen Gesangsabschnitten und danach bleiben die Bildhandlungen der jeweiligen Szenen aktiv; keine pauschale Schlussblende am letzten Wort.','', 'Späte Mess-Cues: '+('; '.join(f'{e["id"]} {e["timecode"]} {e["type"]}' for e in tail) if tail else 'keine zusätzlichen Struktur-Cues')+'. Schlussbild erst bei einem nachgewiesenen Endabfall auflösen; sonst bis kurz vor das Audioende aktiv halten.','', '## Assets und wiederverwendbare Module','',st['assets'], '', 'Wiederverwendbare Code-Module: Szenenkamera mit vorgegebenem Pfad, Audio-Kurven-Interpolator, Event-Trigger, Text-/Status-Overlay, deterministisches Partikelfeld und Abschlussblende. Die Geometrie, Farben und Metaphern bleiben trackspezifisch.','', '## Technische Leitplanken','',st['tech'], '', 'Lyrics sind gestalterische Quelle, keine automatische fachliche Wahrheit. Textzitate nur aus den im Analyse-JSON enthaltenen `lyrics.segments` verwenden; dort ausgeschlossene Quellsegmente nicht ins Bild übernehmen. Messwerte nicht als sichtbare Netzwerk-Telemetrie ausgeben.','', '## Deterministisches Rendering','', 'Videozeit `t = frame_index / fps`, empfohlen 30 fps bei konstantem Raster. Audio bleibt unverändert und beginnt bei t=0. Für jeden Frame 100-ms-Steuerwerte linear interpolieren; schnelle Impulse aus `events` oder `onsets` nur einmal bei `round(time_s*fps)` auslösen. Zufall ausschliesslich aus festem Track-Seed und stabilen Objekt-IDs ableiten. Bewegungszustände aus absoluter Zeit berechnen, damit Reihenfolge und Parallelisierung identische Frames ergeben. Bei der finalen Audioeinbettung das Original-WAV und seine volle Dauer behalten.','', '## Abnahme','',f'- Szene 1 beginnt bei 00:00:00.000; die letzte Szene endet exakt bei {tc(dur)}.','- Alle Tabellen-Event-IDs existieren im Analyse-JSON und ihre Zeiten liegen innerhalb der Szene.','- Gesungene Zitate stammen aus den zugeordneten Transkriptsegmenten; überlappende oder als Abschnittsname markierte Segmente erscheinen nicht.','- Grosse Wechsel folgen anhaltenden Energie- oder Abschnitts-Cues; einzelne Onsets steuern nur einzelne Aktionen.','- Die technische Darstellung folgt den obigen Leitplanken, ohne Firmenwerbung oder Logos.','- Das instrumentale Ende bleibt bis zur gemessenen Schlussentwicklung gestaltet.','']
        dest=TARGET/name/'ASTRA-DREHBUCH.md'; backup(dest);dest.write_text('\n'.join(lines),encoding='utf-8');print(name, 'Drehbuch',len(scene_rows),'Szenen',flush=True)
if __name__=='__main__': main()
