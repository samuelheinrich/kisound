#!/usr/bin/env python3
"""Build the editorial shot list and machine-readable cues from one source."""

from __future__ import annotations

import hashlib
import json
import math
import wave
from pathlib import Path


ROOT = Path(__file__).resolve().parent
MUSIC = ROOT / "../../../../music/kisound/Vibecoder/01_Vibecoder"
CHAPTERS = [
    ("01 · Auftakt: Wer baut hier?", "intro", 4,
     [0, 2.8, 5.5, 7.2, 8], [0, 3, 8.7, 10.4, 11]),
    ("02 · Vorlauf: Die erste Blockade", "prelude", 4,
     [8, 11, 14.5, 18, 21], [11, 16, 22, 27, 32]),
    ("03 · Acht Uhr: Export und zwei Beweise", "verse_1", 7,
     [21, 24.58, 28.14, 30, 31.66, 33.4, 35.14, 36],
     [32, 34.26, 39.48, 40.6, 42.44, 43.7, 44.9, 46]),
    ("04 · Auftrag: Was sehe ich wirklich?", "build", 5,
     [36, 39.18, 40.9, 42.62, 46.52, 49],
     [46, 49.26, 51, 52.72, 56.22, 59.5]),
    ("05 · Refrain eins: Sagen, bauen, prüfen, korrigieren", "drop_1", 8,
     [49, 53.94, 58.06, 63.2, 65.28, 68.36, 71.68, 77.62, 80],
     [59.5, 64.38, 67.12, 71.62, 74.32, 76, 79.3, 82.4, 83]),
    ("06 · Instrumental: Der freie Platz", "break", 5,
     [80, 82.5, 85, 88, 90.5, 93], [83, 88, 93, 99, 105, 111]),
    ("07 · Mittag und Abend: Der eigene Takt", "verse_2", 9,
     [93, 96.64, 100.4, 103.86, 107.44, 110.9, 114.86, 116.3, 118.14, 121.9],
     [111, 113.82, 117.4, 120.96, 124.38, 128.92, 132.56, 134.36, 138.58, 139.5]),
    ("08 · Refrain zwei: Ein Werkzeug muss bestehen", "drop_2", 8,
     [121.9, 123, 126.22, 130.2, 133.64, 137.48, 140.62, 143.86, 145],
     [139.5, 142.62, 146.08, 149.84, 153.04, 157.16, 160.52, 163.56, 165]),
    ("09 · Bridge: Der Einwand", "bridge", 6,
     [145, 147.14, 150.48, 151.56, 154.98, 156.4, 157.8],
     [165, 167.12, 170.86, 172.74, 174.44, 177.34, 183]),
    ("10 · Finale: Die drei Ergebnisse greifen ineinander", "final_drop", 10,
     [157.8, 162.34, 165.46, 169.48, 170.5, 173.02, 175.3, 178.98, 180.62, 187.34, 190],
     [183, 191.42, 195.04, 198.4, 200.36, 203.74, 207.7, 212.18, 214.82, 221.68, 227]),
    ("11 · Ausklang: Ein Verfahren, kein Zauber", "outro", 6,
     [190, 194.92, 202.46, 204.18, 209, 215.2, 216.24],
     [227, 233.06, 236.3, 238.8, 241.66, 243.98, 244.76]),
]
FIRST_SHOT = {
    "intro": "Der unbewegte Cursor",
    "prelude": "Drei offene Bedürfnisse",
    "verse_1": "08:00 · Export hängt",
    "build": "Neue Coder, anderer Takt",
    "drop_1": "Erster Ruf: VIBECODER",
    "break": "Ein leerer Takt",
    "verse_2": "Kein Track trifft den Takt",
    "drop_2": "Zweiter Ruf, neue Aufgabe",
    "bridge": "„Du weißt nicht …“",
    "final_drop": "VIBECODER als Bauwerk",
    "outro": "Prompt",
}

# title | zone | mode | action | camera | transition. Every change earns a new
# dramatic fact; this data is shared by the two independently timed versions.
SCENES = """
Der unbewegte Cursor|room|3D|Kühler Morgen am Arbeitsplatz. Die Uhr steht auf 08:00; im Laptopfenster wartet ein Export bei 99 Prozent. Der orange Cursor pulst als einziges warmes Licht.|Weite vom Fenster bis zur starren Fortschrittskante; Silhouette nur in der Schulter.|Monitorrahmen deckungsgleich in die 2D-Fläche.
VIBE als Versprechen|type|2D|Vier ruhige Buchstaben VIBE erscheinen auf der stillstehenden Exportlinie, noch ohne Triumph. Rechts bleibt Platz für das fehlende CODER.|Frontale typografische Einstellung, dann Stille im Bild.|Die Exportlinie wird zur Grundlinie der Wortmarke.
Ich bin Vibecoder|type|2D+3D|Auf dem ersten gesungenen Titel ergänzt CODER in Orange die Marke. Nur die Kanten von CODER bekommen eine flache Tiefe; die Arbeit hinter der Schrift bleibt sichtbar.|Frontal für mindestens einen lesbaren Schlag, dann wenige Grad seitlich.|Die orange Unterkante zieht sich als Cursor zusammen.
Zurück zum Problem|screen|2D|Die Marke schrumpft zu einer kleinen Projektmarke. Export 99 Prozent bleibt rot; es gibt noch keinen PASS-Stempel.|Statischer, klar lesbarer Bildschirm.|Cursor fährt auf die fehlerhafte Statuszeile.
Drei offene Bedürfnisse|project|2D+3D|Der Bildschirm klappt entlang seiner eigenen oberen Kante in drei räumliche Felder: Export, Klang, Werkzeug. Nur Export ist aktiv; die anderen tragen noch Fragezeichen.|Kleine Parallaxe über exakt gleiche Ecken der Karten.|Exportkarte liegt wieder orthogonal vor uns.
Ein Signal ohne Antwort|screen|2D|Ein Request geht in die Exportfunktion und kommt ohne Abschlussstatus zurück. Die orange Linie stoppt sichtbar vor dem Ziel; keine willkürlichen Codezeichen.|Nah auf Input, fehlenden Output und Wartesymbol.|Das Wartesymbol wird zum Uhrpunkt.
Der Tag rückt näher|room|3D|Uhr und kalter Becher rahmen denselben 99-Prozent-Stand. In EN bekommen Mausbewegung, Dateiansicht und das erste prüfbare Beispiel mehr Zeit; DE bleibt knapper.|Halbtotaler Blick über die rechte Hand, ohne Sprung in der Raumachse.|Hand legt den Cursor auf die Exportkarte.
Ein klarer Auftrag|screen|2D|Die Person formuliert ein enges Ziel: Der Track-Katalog-Export soll nach fertiger Datei COMPLETE setzen; der Test soll Katalogzeilen und Status prüfen. Die Bedingung bleibt gross genug zum Lesen.|Frontansicht, drei Textzeilen statt Terminalrauschen.|Die Worte Datei und Status werden zwei Testfelder.
08:00 · Export hängt|room|3D|Die gesungene Uhrzeit landet auf der realen Uhr. Am Monitor bleibt der Export sichtbar stecken; die Hand stoppt über dem Touchpad.|Harter Schnitt zur bereits etablierten Totalen.|Uhrziffer wird kreisförmiger Ladeindikator.
Kalter Kaffee, echte Frist|desk|3D|Nah am kalten Becher und einer sachlichen Karte „Abgabe heute“. Die Frist erhöht den Einsatz, ohne künstliche Katastrophe.|Kurzer Blick vom Becher zur kleinen Fristkarte.|Kartenkante auf Eingabefeld matchen.
Prompt rein|screen|2D|Der präzise Auftrag wird abgesendet. Eingang und erwarteter Ausgang stehen nebeneinander; die Person bestimmt, was geprüft wird.|Orthogonal, grosse Schrift und stiller Cursor.|Sendelinie wird zu einer markierten Änderung.
Skript und Daten|screen|2D+3D|Die eine fehlende Statuszuweisung wird im Diff ergänzt. Daneben gehen zwei Datensätze durch dieselbe Funktion; ihre Rechtecke bleiben beim flachen Raumschwenk an Ort.|Seitfahrt um höchstens 12 Grad, Vergleich bleibt lesbar.|Zwei Datensätze landen auf Testfeld A und B.
Test A: Datei|screen|2D|Test A prüft, ob die Katalogdatei existiert und die erwarteten Trackzeilen enthält. Erst nach dem Vergleich kippt A auf grün.|Fest auf Input, Soll und Ist.|Grüne Kante läuft zum zweiten Feld.
Test B: Status|screen|2D|Test B prüft COMPLETE nach Dateischluss. Der Status wechselt erst jetzt auf grün; der 99-Prozent-Balken erreicht sein Ende.|Kurzer Halt, damit zwei unterschiedliche Belege erkennbar sind.|Grüne Testkarten drehen zum nächsten Auftrag.
Die nächste Idee|project|2D+3D|Exportkarte wird als erledigte Karte an ihren Platz geschoben. Aus ihrer orangefarbenen Unterkante wächst der freie Steckplatz für Klang, ohne einen neuen Erfolg zu behaupten.|Räumlicher Zug auf die zweite leere Stelle.|Steckplatz wird Agentfenster.
Neue Coder, anderer Takt|room|3D|Keine Armee von Robotern: ein Mensch spezifiziert, ein Agent arbeitet im Seitenfenster. Der neue Takt ist ihre sichtbare Abfolge.|Zweierkomposition aus Hand und Agentfenster.|Handbewegung löst einen 2D-Auftrag aus.
Was fehlt?|screen|2D|Die Person markiert die fehlende Bedingung in der Exportvariante und schreibt eine konkrete Rückgabeaufforderung. Kein generisches „mach besser“ erscheint.|Makro auf Markierung und Satz.|Markierung wird Kante des Ausführungspfads.
Die Blackbox|project|2D+3D|Input, Agent, Datei und Tests sind vier erkennbare Stationen. Im Zentrum bleibt eine dunkle, opake Schicht; sie wird nicht mit erfundenen Innereien gefüllt.|Kamera gleitet entlang der Stationskanten; Zentrum bleibt ruhig.|Orange Linie verbindet nur beobachtbare Stationen.
Ich sehe den Weg|project|3D|Die Linie macht Ursache und Wirkung sichtbar: Auftrag hinein, Diff heraus, Testantwort zurück. Die unbekannte Mitte bleibt matt, obwohl der Pfad räumlich lesbar ist.|Halbkreis um die erhaltene 2D-Projektion, keine freien Flüge.|Kamera hält vor der opaken Mitte an.
Nicht jeden Draht|screen|2D|Ein kleines „?“ bleibt an der Mitte. Die Person bestätigt nur die Resultate, die sie prüfen kann. Diese Ehrlichkeit bereitet die spätere Konfrontation vor.|Rückkehr in exakt denselben Bildschirmzustand.|Das Fragezeichen bleibt im Rand, während die Hook startet.
Erster Ruf: VIBECODER|type|2D|Auf der ersten Hook sitzt VIBE weiss über CODER orange. Darunter laufen die vier Schritte SPEC, BUILD, TEST, FIX als noch ungefüllte Felder.|Frontal und unverrückt, Titel bekommt echte Lesezeit.|Titelunterkante wird Ablaufleiste.
Sagen und bauen|screen|2D|SPEC erhält den klaren Wunsch; BUILD zeigt nur die tatsächlich geänderte Zeile. Ein wiederholter Titelruf erscheint kurz als kleine Projektmarke, bevor der Blick zum Test zurückkehrt.|Zwei enge Einstellungen, eine gemeinsame Bildachse.|Diffkante wird Prüflinie.
Testen und korrigieren|screen|2D|Ein zusätzlicher Exportfall scheitert. Der fehlerhafte Status wird zurückgegeben, die Korrektur erscheint, derselbe Test läuft erneut. Grün nur nach PASS.|Ein rotes Feld, ein Diff, derselbe Test; keine Kleinschrift.|Testkarte steht vor dem Hooktitel.
Zweiter Ruf: mehr Tiefe|type|2D+3D|Die zuvor flache CODER-Kante wird zu einem niedrigen Relief. Durch die offenen Buchstaben ist genau die reparierte Exportansicht zu sehen.|Seitfahrt an der ersten Letterkante, danach wieder frontal.|Orange Kontur landet auf Exportkarte.
Der Rückweg gehört dazu|project|3D|Fehlerkarte fährt sichtbar zum Auftrag zurück, dann als korrigierter Stand wieder vor. Die Rückrichtung ist genauso klar wie die erste Lieferung.|Seitliche Totale des vierteiligen Pfads.|Die Karte legt sich auf einen echten Diff.
Diff, Test, Commit|screen|2D|Drei unterscheidbare Belege: Änderung, reproduzierbarer Check, lokaler Git-Commit. Die Versionskarte erscheint erst nach PASS; sie behauptet keinen Upload.|Drei Schnitte entlang einer gemeinsamen orangefarbenen Achse.|Die Achse zeigt auf einen zweiten freien Steckplatz.
Ein kleiner neuer Funke|desk|3D|Die Hand tippt neben „Klang“ eine kurze Frage. Export bleibt mit grünem Zustand auf dem Monitor; der Becher rückt ein Stück aus dem Weg.|Über Schulter, ruhigerer Bildausschnitt nach der dichten Hook.|Cursor blinkt auf der Frage.
Erster Beweis steht|room|3D|Der Export ist offen und abgenommen. Durch das Fenster wird das Licht wärmer. Die Person schiebt den Stuhl zurück und hört einen Moment zu.|Langsamer Atemzug in der Totale.|Sonnenkante löst die Exportkante ab.
Ein leerer Takt|project|3D|Der Export steht links als fertige Karte. Die mittlere Klangkarte ist leer; die orange Linie geht zu ihr, während der Raum auf Mittag wechselt.|Tiefe aus den drei Steckplätzen, kein neuer Ort.|Kamera taucht durch die leere Klangkarte.
Die Auswahl passt nicht|screen|2D|Drei Kandidaten aus dem geprüften Katalog werden kurz verglichen, keiner trägt den benötigten Takt. Kein Fremdtrack ist zu hören; der finale Song bleibt alleinige Tonspur.|Rhythmische Blickwechsel mit festen lesbaren Kartentiteln.|Letzte Karte klappt als leeres Raster um.
Das Raster wartet|screen|2D|Vier Reihen eines einfachen Sequencers sind leer. Der Cursor zeichnet eine einzige orangene Taktlinie; EN erhält zusätzliche, klar unterschiedliche Schritte während der längeren Pause.|Orthogonal auf Raster, dann erste flache Schräglage.|Rasterfeld wird als flacher Raumkörper sichtbar.
Ein Motiv entsteht|project|2D+3D|Punkte auf der Taktlinie werden zu flachen Plättchen. Die Originalmusik steuert ihre Bewegung; die Szene behauptet keinen neu hörbaren Song im Song.|Dolly entlang der Plättchen, gleiche IDs wie im 2D-Raster.|Plättchen sinken zurück auf die Oberfläche.
Mittag|room|3D|Die Uhr zeigt 12:00, Licht fällt anders durch dasselbe Fenster. Die Klangkarte ist nun die aktive Aufgabe; Export bleibt sichtbar fertig.|Gleiche Kameraachse wie um acht, andere Lichtlage.|Fensterschatten matcht auf Taktstrich.
Kein Track trifft den Takt|screen|2D|Der Cursor legt drei Kandidaten über eine Soll-Markierung. Ihre Betonungen sitzen sichtbar daneben; die Karten verlassen nacheinander die Arbeitsfläche.|Frontal, jeder Vergleich nur einen kurzen Blick lang.|Die Soll-Markierung bleibt als leeres Notenraster.
Ich schreibe den Sound|screen|2D|Ein klarer Patternvorschlag mit vier Reihen entsteht. Der Cursor setzt einzelne Schritte; Arrangement und Tonhöhen werden nicht als exakte Transkription behauptet.|Makro auf Hand und Raster, keine unlesbaren Codekolonnen.|Aktive Schritte heben sich vom Raster ab.
Mein Beat trägt weiter|project|2D+3D|Dieselben Step-IDs stehen als kleine Körper im Raum. Eine orange Linie läuft durch die belegten Felder, später in der App als Navigationspfad wiedererkennbar.|Seitlicher Tracking Shot im Tempo der Musik, ohne behauptetes Beatgrid.|Kamera unterquert die Bassreihe.
Der Bass bekommt Gewicht|project|3D|Nur bei real gemessener Tieftonenergie neigt sich die Bassreihe minimal nach vorn; die übrigen Reihen bleiben stabil. Der Song bleibt Originalton.|Bodennah, kontrollierte Verschiebung statt Wackelkamera.|Bassreihe wird zur unteren Bildschirmkante.
Abend, voller Store|room|3D|Uhr und Fenster springen filmisch auf den Abend. Viele App-Kacheln sind vorhanden, aber keine hat die gewünschte einfache Kombination aus Track, Ausgabe und Status.|Totale zum selben Tisch; dann auf die Kacheln.|Eine leere Kachel bleibt in der Mitte.
Ein Auftrag für die App|screen|2D|Die Person formuliert: Track aus dem Katalog wählen, Paketexport starten, Ergebnis sehen. Die drei Zustände werden als klarer Ablauf gezeichnet; die neue Klangkarte ist der Testtrack.|Orthogonal, drei grosse Knoten.|Knoten werden zur Oberfläche.
Ein Screen geht auf|screen|2D+3D|Genau ein Screen entfaltet sich entlang seiner Rahmenkante in den Raum; Trackkarte, Knopf und Statusfeld bleiben identische Objekte.|Kurze seitliche Bewegung, dann frontal für Lesbarkeit.|Rahmen verriegelt in der Bildschirmfläche.
Ein Knopf, ein Flow|screen|2D|Der Knopf startet Export und zeigt laufend statt fertig. Drei orange Kanten verbinden Auswahl, Aktion und Ergebnis.|Ein einziger Klick und sichtbare Reaktion.|Statusfeld nimmt den Raum des Hooktitels ein.
Mein eigenes Tool|room|3D|Die App ist erstmals benutzbar. Die Person hält inne; ein Reload ist der noch ausstehende Beweis. Export und Klang sind weiterhin sichtbar, aber nicht als neuer Erfolg überhöht.|Über Schulter, kurze offene Erwartung.|Finger löst den Reload aus.
Zweiter Ruf, neue Aufgabe|type|2D+3D|Beim ersten Reload verliert die App die Auswahl. VIBE/CODER erscheint davor als flach extrudierte Marke; ein roter Statuspunkt auf der App dahinter verhindert voreiligen Triumph.|Frontale Titelphase, dann Seitblick auf das rote Feld.|Rotpunkt durchbricht die ruhige Titelfläche.
Sagen und bauen, erneut|screen|2D|Die Anforderung „Auswahl nach Reload behalten“ wird ergänzt. Der Agent speichert eine Track-ID, zunächst unter einem falschen Schlüssel; diese konkrete Änderung erhält Farbe.|Harter, gut lesbarer Vorher-nachher-Schnitt.|Die Track-ID wandert in einen Speicherslot.
Reload entlarvt den Fehler|screen|2D|Der zweite Reload liest einen anderen Schlüssel und springt wieder auf die falsche Auswahl. Der vorher sichtbare Track bleibt als Soll-Karte daneben: der Mangel ist ohne Fachwissen erkennbar.|Split zwischen Soll und Ist, identische Bildgrössen.|Ist-Karte fährt entlang der Rückleitung.
Korrektur auf dem Rückweg|project|2D+3D|Die falsch geladene ID fährt als orange Karte durch den Raum zurück zum Agentfenster. Dort wird die Speicherzuordnung korrigiert; die Linie folgt demselben Pfad rückwärts.|Ununterbrochene Kamerafahrt an der Pfadkante.|Korrekturkarte wird zum neuen Testinput.
Gleicher Test, neuer Stand|screen|2D|Wieder dieselbe Trackwahl, wieder Reload. Diesmal bleibt Auswahl samt Status erhalten. Der Test wechselt nach Vergleich auf grün.|Zwei identische Frames vor und nach Reload machen den Unterschied überprüfbar.|Grünes Feld dockt am bestehenden Screen an.
Der eine funktionierende Flow|project|3D|Trackkarte, Startknopf und Ergebnisfeld bilden nun einen kurzen begehbaren Pfad. Exportdatei und Klangkarte liefern die realen Eingaben dieses Tools.|Fahrt vom ersten Artefakt durch die App bis zum Ergebnis.|Pfad wird zur Grundlinie eines neuen Titels.
Diff, Test, Commit II|screen|2D|App-Diff, Reload-Check und gespeicherter Stand erhalten eigene Felder. Drei fertige Artefakte stehen jetzt mit Namen da, nicht als anonyme grüne Häkchen.|Frontale Inventur, drei Karten mit gleicher Massstäblichkeit.|Ein fremder Kommentar deckt einen Teil der Karten ab.
Der Einwand kündigt sich an|room|3D|Am Rand des Monitors erscheint ein fremder Kommentar. Die Person dreht sich zu ihm; die drei fertigen Karten bleiben im selben Bild. Der Refrain räumt für den Dialog Platz.|Langsame Fahrt auf die Spiegelung im dunklen Display.|Spiegelung wird typografischer Dialograum.
„Du weißt nicht …“|room|3D|Am Rand des Monitors erscheint die zugeordnete Nachricht des Hardcoders. Die Person sieht hin. Hinter der Schrift liegt die immer noch opake Agentmitte; es gibt keine erfundene zweite Stimme.|Fahrt auf die Spiegelung im Display, dann Halt auf der Nachricht.|Spiegelung wird typografischer Dialograum.
„Nicht alles.“|room|3D|Die Person nickt knapp. Die Mitte bleibt dunkel; weder Film noch Figur behaupten vollständige Kenntnis. Daneben bleiben die drei überprüfbaren Resultate.|Nah auf Schulter und Hand, keine Lippenanimation.|Hand weist auf Testkarte.
Der sichtbare Beleg|project|2D+3D|Input, Ausgabe und Tests werden nacheinander hell. In EN kann der nächste Einwand bereits darüber einsetzen; die Belege bleiben dabei lesbar und das Zentrum opak.|Fahrt entlang dreier Punkte, endet bewusst vor der Mitte.|Lücke wird zum leeren Buchstabenraum.
„Das nennst du Code?“|type|2D|Die zweite Nachricht nimmt den leeren Raum ein. Sie drückt den Titel klein, kann aber die grünen Belege nicht verdecken.|Seitlich versetzte Typografie; keine Karikatur.|Der Cursor zieht die Nachricht beiseite.
„Ich bau’s trotzdem.“|room|3D|Die Antwort gehört der Hand: Sie legt die drei fertigen Karten nebeneinander. Die Entscheidung ist körperlich und konkret, ohne zusätzliche Rechtfertigungsrede.|Kamera zieht vom Tisch in die Halbtotale.|Kartenkanten bilden eine einzige orange Schiene.
Die eine Schiene|project|2D+3D|Die drei Karten rasten an derselben orangenen Linie ein. Im längeren EN-Übergang wird der Pfad vom ersten Input bis zum dritten Ergebnis einmal lesbar; der kommende Bass öffnet erst danach den Raum.|Eine durchgehende Fahrt entlang aller drei Kanten.|Schiene bildet die Grundlinie des finalen Titels.
VIBECODER als Bauwerk|type|2D+3D|Zum finalen Hook wird aus VIBE und CODER erstmals eine ganze räumliche Wortmarke. Durch ihre offenen Buchstaben sieht man die drei eigenen Werkzeuge. Der längere EN-Zwischenraum führt die Kamera durch diese Buchstaben.|Tiefe Kamera, dann frontal lesbare Endlage.|Buchstaben werden Tor zu den Artefakten.
Die neue Generation ist laut|project|3D|Mehrere Arbeitsweisen werden als Nachbarplätze sichtbar; der Blick bleibt bei unserer Person. Die Lautstärke gehört der Musik und der grösseren Arbeitsfläche, nicht erfundenen Stimmen.|Weite Erweiterung um den vertrauten Tisch.|Orange Schiene führt zum ersten Beleg.
Export trägt Klang|project|2D+3D|Die geprüfte Katalogdatei liefert erst die verglichenen Kandidaten und jetzt das Format für die neue Klangkarte. Ihre Datei-ID bleibt beim Dimensionswechsel gleich; der sichtbare Pfad löst den frühen 99-Prozent-Stopp ein.|Seitfahrt mit Match auf die linke Kartenkante.|Dateikante wird Sequencer-Grundlinie.
Klang trägt App|project|3D|Die Klangkarte wird in der App gewählt. Genau derselbe Trackname erscheint auf räumlicher Karte und 2D-Screen. Der Bassimpuls bewegt nur die lange orange Verbindung.|Fahrt entlang der Verbindung, kein Kameraschütteln.|Verbindung biegt ins App-Fenster.
Bass durch drei Werkzeuge|project|3D|Die tiefe Energie läuft als kontrollierter Impuls von Export über Klang zur App. Die drei Zustände bleiben unverändert; der Bass macht nur ihre Verbindung körperlich spürbar.|Bodennah an der gemeinsamen Linie entlang, ohne Kameraschütteln.|Die Linie endet am offenen Slot.
Ein Wunsch, ein Prompt, ein Build|screen|2D+3D|Eine kleine neue Idee erscheint: zuletzt genutzten Track beim Öffnen vorwählen. Sie entsteht aus dem funktionierenden Tool und bleibt ein offener nächster Schritt. EN zeigt an der unsicheren Gesangsstelle keinen wörtlichen Text.|Lesbarer Zweizeiler, dann 15 Grad um den offenen Slot; keine vorgetäuschte Fertigmeldung.|Offener Slot gibt Platz für Bassbewegung.
Rollen, ohne zu flackern|project|3D|Bassreihe, Exportlinie und App-Pfad laufen als eine zusammenhängende Orangebahn durch den Raum. Tieftonenergie verändert Höhe und Licht sanft; keine Bildblitze.|Lange bodennahe Fahrt mit drei erkennbaren Stationen.|Bahn führt zurück zu VIBE/CODER.
Letzter Ruf im ganzen Raum|type|3D|Die Wortmarke steht nun fest im Raum. Auf den Buchstabenflächen erscheinen kurz echte Zustände: Export fertig, Klangkarte gewählt, App-Reload bestanden.|Halbtotale und kurze Frontansicht, Zustände während des Lesens ruhig.|Schrift gibt den Tisch wieder frei.
Drei Perspektiven, ein Stand|room|3D|Ein Dreifachblick zeigt Bildschirm, räumliche Karten und Hand. Alle tragen dieselben IDs und Zustände. Die grossen Karten falten sich am Ende an den Monitor zurück; kein Schnitt springt auf eine ältere Version.|Drei auf Akzente gesetzte Blickwinkel, dann Rückfahrt auf die alte Raumachse.|Letzter Blick hält auf der Hand.
22:00, das Cover wird lebendig|room|3D|Die Uhr zeigt 22:00. Die Anordnung erinnert jetzt an das Cover: dunkler Tisch, orange Cursor, Becher, kleine Projektpaneele; alle drei Artefakte sind aber nachvollziehbar entstanden.|Ruhige bildfüllende Komposition, wenige Sekunden Luft.|Cursor zoomt in die vier Worte des Ablaufs.
Prompt|screen|2D|Der neue Wunsch steht als Eingabe offen. Die gesungene Viererformel wird auf ihrem tatsächlichen Cue als ganzer kurzer Ablauf sichtbar; einzelne Wörter werden nicht auf spätere, ungesungene Sekunden verteilt.|Frontansicht, vier klare Schritte statt Untertitelwand.|Orange Linie zum Startknopf.
Run|screen|2D+3D|Der Auftrag läuft. Der Pfad hebt sich nur wenig aus der Fläche; Export, Klang und App bleiben als bereits geprüfte Basis erkennbar. Bei der nächsten gesungenen Formel läuft derselbe Ablauf weiter.|Seitliche Miniaturfahrt, danach zurück zum Screen.|Laufende Linie endet im Check-Feld.
Check|screen|2D|Der neue Stand wird mit demselben Reload-Test verglichen. Ein Ergebnis darf nur nach sichtbarem Vergleich markiert werden; gesungene Wiederholungen erhalten neue Blickwinkel statt neue Behauptungen.|Feste Soll-Ist-Anordnung, kurze Blickwechsel.|Testfeld zieht sich zum vierteiligen Ablauf zurück.
Go|room|3D|Die Person entscheidet sich für den nächsten Schritt. Der Film kann enden, obwohl die Arbeit weitergeht. Im EN-Ausklang bleibt zusätzlicher Raum für einen Blick auf alle drei Artefakte.|Rückfahrt vom Monitor über Hand und Becher zum Fenster.|Lichtpunkt des Cursors bleibt im Fenster.
Ein letzter Puls|room|3D|Auf die letzte gesungene Wiederholung antwortet nur ein warmer Puls entlang der Schiene. Kein zusätzlicher Text wird erfunden; DE und EN verwenden ihren eigenen letzten Stimmeinsatz.|Aussenansicht des einen beleuchteten Fensters.|Puls fällt mit dem gemessenen Ausklang ab.
Ende bei Sampleende|room|3D|Das Fensterlicht erlischt erst am tatsächlichen Audioende. Eine kleine orange Stelle bleibt bis zum letzten hörbaren Rest stehen, dann Schwarz.|Statische Totale; kein vorzeitiger Abspann.|Schwarz exakt am jeweiligen WAV-Ende.
""".strip().splitlines()


def digest(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for block in iter(lambda: f.read(1024 * 1024), b""):
            h.update(block)
    return h.hexdigest()


def tm(seconds: float) -> str:
    minutes, sec = divmod(seconds, 60)
    return f"{int(minutes):02}:{sec:06.3f}"


def main() -> None:
    assert sum(ch[2] for ch in CHAPTERS) == len(SCENES) == 72
    parsed = []
    for line in SCENES:
        parts = line.split("|")
        assert len(parts) == 6, line
        parsed.append(parts)

    inputs = {}
    duration = {}
    for lang in ("de", "en"):
        final = MUSIC / "final"
        audio = final / f"01_Vibecoder_suno-0.1_50_50_exakt_off_{lang.upper()}.wav"
        with wave.open(str(audio)) as wav:
            assert wav.getframerate() == 48000 and wav.getnchannels() == 2
            samples = wav.getnframes()
        duration[lang] = samples / 48000
        paths = {
            "audio": audio,
            "transcript": final / lang / "01_Vibecoder_Transkript.json",
            "prompt": final / lang / "01_Vibecoder_1.0.txt",
            "analysis": final / lang / "ASTRA-AUDIO-ANALYSE.json",
            "review": final / lang / "TRANSKRIPT-PRUEFUNG.md",
            "cover": MUSIC / "01_Vibecoder_cover.png",
        }
        inputs[lang] = {
            "duration_s": duration[lang],
            "samples_per_channel": samples,
            "frames_60fps": math.ceil(duration[lang] * 60),
            "inputs": {k: {"path": str(p.relative_to(ROOT)), "sha256": digest(p)}
                       for k, p in paths.items()},
        }

    shots = []
    idx = 0
    for label, key, count, de_cuts, en_cuts in CHAPTERS:
        assert len(de_cuts) == len(en_cuts) == count + 1
        for i in range(count):
            title, zone, mode, action, camera, transition = parsed[idx]
            if i == 0:
                assert title == FIRST_SHOT[key], (key, title)
            shots.append({
                "id": f"S{idx + 1:03}",
                "chapter": key,
                "starts_s": {"de": de_cuts[i], "en": en_cuts[i]},
                "ends_s": {"de": de_cuts[i + 1], "en": en_cuts[i + 1]},
                "zone": zone,
                "mode": mode,
                "title": title,
                "action": action,
                "camera": camera,
                "transition": transition,
            })
            idx += 1
    for lang in ("de", "en"):
        assert shots[0]["starts_s"][lang] == 0
        assert abs(shots[-1]["ends_s"][lang] - duration[lang]) < 0.000001
        for a, b in zip(shots, shots[1:]):
            assert a["ends_s"][lang] == b["starts_s"][lang]
            assert a["ends_s"][lang] > a["starts_s"][lang]

        transcript = json.loads((MUSIC / "final" / lang / "01_Vibecoder_Transkript.json").read_text())
        analysis = json.loads((MUSIC / "final" / lang / "ASTRA-AUDIO-ANALYSE.json").read_text())
        for shot in shots:
            lo, hi = shot["starts_s"][lang], shot["ends_s"][lang]
            shot.setdefault("cues", {})[lang] = [s["id"] for s in transcript["segments"]
                                                    if lo <= s["start"] < hi]
            shot.setdefault("events", {})[lang] = [e["id"] for e in analysis["events"]
                                                      if lo <= e["time_s"] < hi or
                                                      (shot is shots[-1] and e["time_s"] == hi)]
        assert sorted(i for s in shots for i in s["cues"][lang]) == sorted(s["id"] for s in transcript["segments"])
        assert sorted(i for s in shots for i in s["events"][lang]) == sorted(e["id"] for e in analysis["events"])

    manifest = {
        "schema": "kisound.video.screenplay.sources.v1",
        "album": "Vibecoder", "track": "01_Vibecoder", "path_base": "project_root",
        "fps": 60, "variants": inputs,
    }
    cues = {
        "schema": "kisound.video.screenplay.v1",
        "status": "authored screenplay, not implemented",
        "timing_note": "DE and EN are independent; cue IDs belong to the shot containing cue start. ASR timings are provisional.",
        "shots": shots,
    }
    (ROOT / "SOURCE-MANIFEST.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    (ROOT / "REGIE-CUES.json").write_text(json.dumps(cues, ensure_ascii=False, indent=2) + "\n")

    lines = ["# 01 · VIBECODER — Schnittliste", "",
             "72 Einstellungen pro Sprachfassung. DE und EN benutzen dieselbe Dramaturgie mit eigenen Schnittzeiten.",
             "Ein Cue gehört zur Einstellung seines Beginns; sein gesungener Ausklang kann über den Schnitt reichen.",
             "Zeiten sind redaktionelle Schnittvorschläge, keine manuell gehörten Wortgrenzen. Die ASR-Prüfstellen bleiben offen.", ""]
    offset = 0
    for label, key, count, *_ in CHAPTERS:
        lines += [f"## {label}", "", "| ID | DE | EN | Raum | Bildaktion und Anschluss |", "| --- | --- | --- | --- | --- |"]
        for shot in shots[offset:offset + count]:
            lo = shot["starts_s"]; hi = shot["ends_s"]
            action = f"**{shot['title']}.** {shot['action']} Kamera: {shot['camera']} Anschluss: {shot['transition']}"
            lines.append(f"| {shot['id']} | {tm(lo['de'])}–{tm(hi['de'])} | {tm(lo['en'])}–{tm(hi['en'])} | {shot['zone']} · {shot['mode']} | {action} |")
        lines += [""]
        offset += count
    lines += ["## Verbindliche Lesart", "",
              "- **Rot** bezeichnet einen konkreten fehlgeschlagenen Vergleich, **Grün** einen sichtbar bestandenen Test. Weder Farbe noch PASS dürfen früher erscheinen.",
              "- Die Bildschirmobjekte behalten beim Wechsel nach 3D ihre ID, Grösse, Position am gemeinsamen Übergabeframe und ihren Zustand.",
              "- Gesangszeilen werden nicht vollständig als Untertitel eingeblendet. Die Zeile entscheidet die Aktion; typografische Einsätze sind bewusst knapp.",
              "- Die EN-Stelle 03:23.740–03:27.700 erhält ohne Hörfreigabe keinen wörtlichen Text im Bild. Die Bildaktion in S062 bleibt semantisch lesbar.",
              "- Alle Cue- und Event-Zuordnungen stehen in [REGIE-CUES.json](REGIE-CUES.json); Quellhashes in [SOURCE-MANIFEST.json](SOURCE-MANIFEST.json).", ""]
    (ROOT / "SCHNITTLISTE.md").write_text("\n".join(lines))
    print(f"Built {len(shots)} shots, DE {duration['de']:.2f}s, EN {duration['en']:.2f}s")


if __name__ == "__main__":
    main()
