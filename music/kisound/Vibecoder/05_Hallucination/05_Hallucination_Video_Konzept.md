# 05 · HALLUCINATION — Behauptung, Dokumentation und Test

Konzeptstand 0.1 für beide Sprachfassungen. Ruhige Untersuchung nach dem schnellen Feed. [Albumübersicht](../README.md).

## Szenario und Objekte

Eine Arbeitsfläche mit vier getrennten Bereichen: Antwort, versionierte Demo-Dokumentation, Testausgabe und Referenzseite. Das Projekt heisst im fiktiven Szenario SequencerDemo v0.1. Die Antwort behauptet einen Export-Aufruf `renderWave(pattern)` und verlinkt auf seine Dokumentation. Dieser Aufruf fehlt in der geprüften Demo-Version. Eine tatsächlich vorhandene Exportmöglichkeit wird erst nach dem Prüfen ausgewählt.

Die Beispiel-URL verwendet `example.invalid` und wird als dargestellter Text geführt. Die Referenzseite zeigt „Seite nicht gefunden / Page not found“. Die Aussage „lief schon letztes Jahr“ gehört zur unbestätigten Antwort und wird nicht als bewiesener Testlauf inszeniert.

## Abschnittsfolge

| Abschnitt | Sichtbare Handlung |
| --- | --- |
| Intro | Die Antwort behauptet, dass es funktioniert. Daneben öffnet sich die Frage nach dem Beleg. |
| Verse 1 | Ein Funktionsaufruf, ein Link und eine Referenz erscheinen in der ruhigen Antwort. Der Erzähler kopiert die Zeile in einen kleinen Test. Die Erfolgsbehauptung bleibt auf der Antwortfläche. |
| Chorus 1 | Dokumentation und Referenz werden geöffnet. Die Suche beginnt; die behauptete Funktion bekommt noch keine Erfolgsmarkierung. |
| Verse 2 | Die Funktionsliste der angegebenen Version enthält den Aufruf nicht. Der Test scheitert an diesem fehlenden Aufruf. Die Referenzseite wird nicht gefunden. Die Antwort verweist auf eine angeblich falsche Version; ihr Ton bleibt ruhig. |
| Chorus 2 / Instrumentalpassage | Antwort und Befunde stehen nebeneinander. Die Kamera bewegt sich langsamer; die bestätigten Ausgaben bleiben unverändert sichtbar. |
| Bridge | Die Version von Antwort, Dokumentation und Testumgebung wird ausdrücklich abgeglichen. Die nicht belegte Zeile wird aus dem Implementierungsplan entfernt. |
| Chorus 3 | Die Behauptung bleibt lesbar, die vorhandene Exportmöglichkeit wird anhand der geprüften Dokumentation ausgewählt. |
| Outro | Die Referenzseite schliesst sich. Der relevante Test und die überprüfte Funktionsliste bleiben stehen. |

## Technische Logik

Fehlender Aufruf und Versionsabgleich sind der Kern des Befunds. Eine nicht gefundene Webseite allein beweist keine fehlende Funktion. Die Geschichte bleibt auf diese Demo-Version begrenzt; sie behauptet nicht, dass der Name in keiner anderen Bibliothek existiert.

Die Dokumentation, Testausgabe und Modellantwort sind getrennte Artefakte. Der ruhige Klang der Antwort ändert die Ausgaben nicht. Die optische Reibung kann zunehmen, ohne die Texte zu verzerren oder erfundene zusätzliche Fehler einzubauen.
