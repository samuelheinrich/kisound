# Blender-Werkzeuge für die kisound-Videos

Erzeugt aus einer deklarativen Recipe-JSON ein Blender-Master, prüft es und exportiert GLB plus einen
**Anker-Sidecar**, den der Three.js-Code liest. Getestet mit Blender 5.2.2 LTS.

Übernommen aus der Level-Pipeline in `public/globivonnairobi/tools/blender`: die Recipe-Schleife, die
Materialtabelle, die `_generated_signature`-Idempotenz, das Backup bei `--update`, das Merging pro
Material und der Validierungs-Gate vor dem Export. Nicht übernommen: Kollisionsgenerierung, der
SAT-Flächenlöser, die MCP-Brücke und sämtliche Level-Rezeptgeneratoren.

**Eine bewusste Abweichung:** die Quelle trägt eine `BASIS`-Matrix, die X spiegelt, weil Babylon ein
Linkshänder-System benutzt. Three.js ist wie glTF rechtshändig Y-up — hier gibt es deshalb **keine
BASIS**, `export_yup=True` ist die ganze Umrechnung. Die Matrix mitzukopieren würde jedes Asset spiegeln.

## Ablauf

```sh
cd videos/kisound/tools/blender
blender --background --python build_set.py -- recipes/port-macro.recipe.json
blender --background recipes/port-macro.blend --python preview_set.py -- /tmp/pm.png 900   # QA
blender --background recipes/port-macro.blend --python export_set.py
# im Film:
cd ../../Network-Engineer-Album01/09-last-hop && npm run sync-sets
```

`build_set.py --update` erhält Handarbeit am Master (Objekte, deren Signatur sich geändert hat,
werden übersprungen statt überschrieben), `--prune` entfernt zusätzlich Teile, die aus dem Recipe
verschwunden sind — aber nur, wenn sie unverändert sind.

Ausgabe landet in `videos/kisound/assets/sets/<id>/`: `<id>.glb`, `<id>.anchors.json`,
`validation.json`.

## Rollenteilung

Blender baut **ausschliesslich statische Geometrie**. Kamera, Animation, Licht, Post und Schnitt
bleiben in Three.js. Damit bleibt die Doktrin intakt, dass jedes Bild eine reine Funktion von `t` ist,
und es entsteht keine zweite Renderfarm.

## Anker — der eigentliche Gewinn

Der Sidecar gibt jedem benannten Punkt Position, Rotation und freie Attribute, alles schon in
Y-up-Koordinaten. Der Filmcode sagt dann:

```js
sets.at('port-macro', 'jack.port.01')   // Vector3
sets.cam('port-macro', 'macro')         // { pos, fov, look }
sets.path('port-macro', 'dive')         // Vector3[] – Flugbahn
sets.group('switch-48p', 'sw.led.')     // alle 48 LEDs in Reihenfolge
```

Konventionen: `<teil>.port.NN`, `<teil>.led.NN`, `<teil>.throat.NN`, `cam.<name>`, und Pfade als
`<name>.00`, `<name>.01`, … (der Loader sammelt sie zu einer Punktliste).

## Bausteine im Recipe

| `kind` | baut |
|---|---|
| `box` | Quader mit optionaler Fase |
| `cylinder` | Zylinder |
| `array` | N Kopien eines Quaders entlang einer Achse — Kontakte, Tasten, Rack-Einheiten, Fenster |
| `portRow` | Reihe **hohler** RJ45-Käfige: vier Wände plus Rückplatte, nach vorn offen, je Port drei Anker |
| `anchor` | einzelner benannter Punkt |
| `path` | Flugbahn als Punktliste |

`portRow` ist bewusst hohl. Ein massiver Quader mit dunklerem Deckel liest sich als Quader; ein Käfig
mit gefasten Wänden hat ein Inneres, in das die Kamera schauen kann und in dem die Kontakte sichtbar
sind — und genau das ist die Makroaufnahme bei Hop 1.

## Grenzen, die der Validator zieht

Dreiecksbudget pro Set (im Recipe), höchstens 8 Materialien, keine materiallosen oder leeren Meshes,
keine doppelten Ankernamen, und Anker dürfen nicht weit ausserhalb der Geometrie liegen — ausser
`cam.*` und Pfadpunkte, die dort hingehören. Der Export bricht bei `status: ERROR` ab.

Die Dreiecke werden am **evaluierten** Mesh gezählt, nicht am rohen: Fasen und Arrays sind Modifier,
und das Budget muss zählen, was tatsächlich ausgeliefert wird. Aus demselben Grund liest der
Merge-Pfad im Export `evaluated_get(depsgraph).to_mesh()` — läse er `obj.data`, gingen alle Fasen
still verloren.

## Die Achsenfalle

Die beiden Konventionswechsel zwischen Blender und Three.js sind die einzige Stelle, an der diese
Pipeline wirklich beissen kann. Beide sind in `common.py` gelöst und dort kommentiert:

1. **Positionen** gehen über `point()`: `(x, y, z) → (x, z, -y)`. Das ist eine Drehung, keine
   Spiegelung — genau der Unterschied zur Babylon-Vorlage mit ihrer `BASIS`-Matrix.
2. **Orientierungen** gehen über `orientation()`, und ein Komponententausch wie bei Positionen wäre
   falsch: ein Basiswechsel muss konjugiert werden, `C · R · C⁻¹`. Zusätzlich wird `FORWARD`
   einmultipliziert, weil die Blickachse eines Blender-Ankers dessen lokales **+Z** ist, das unter
   dem Basiswechsel zu **+Y** wird — während jedes Three.js-Objekt mit Richtung (Ebenennormale,
   Kameralinse) lokales +Z benutzt.

Ohne Punkt 2 stellt sich eine Bildschirm-Ebene flach statt aufrecht, und zwar so plausibel, dass es
erst am fertigen Bild auffällt.

Ein Anker beschreibt seine **Vorderseite** über +Z. Wer eine Fläche eines gedrehten Bauteils
referenziert, muss also die Fläche meinen, die der Zuschauer sieht, nicht die Rückseite des Bauteils.

## Sets

| Set | Inhalt | Budget | Dreiecke | Anker |
|---|---|---|---|---|
| `port-macro` | eine RJ45-Buchse, 8 Kontakte, Rastnase, 2 LEDs | 140 k | 780 | 17 |
| `switch-48p` | Access-Switch, 48 hohle Käfige in 2 Reihen, 4 SFP-Buchten | 400 k | 24 084 | 167 |
| `router-core` | 3HE-Chassis, 4 Linecards, Faser-Bulkhead, Lüfter | 300 k | 4 536 | 42 |
| `ap-ceiling` | Access Point: Kuppel, Montageplatte, Statusring | 60 k | 2 296 | 5 |
| `laptop` | Basis, Scharnier, Deckel, volles Tastenfeld, Bildschirmanker | 350 k | 7 960 | 9 |
| `office` | Tisch, Stuhl, Tasse, Kabel, Wand mit Fenster | 250 k | 580 | 8 |
| `rack-aisle` | zwei 42HE-Rahmen, bestückt, Kabelrinne, Bodenplatten | 200 k | 11 100 | 6 |
| `city-block` | fünf Türme mit Fensterrastern, Grundplatte, Mast | 300 k | 3 600 | 6 |

Zusammen rund 55 000 Dreiecke — weit unter den Budgets, weil alles Blockout mit Fasen ist und nichts
davon Nahaufnahme-Dichte braucht ausser `port-macro` und `switch-48p`.
