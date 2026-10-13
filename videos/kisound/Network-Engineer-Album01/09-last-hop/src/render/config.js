// Every timing, colour and piece of on-screen text for "Last Hop". See DREHBUCH.md.
export const FPS = 60;
export const DURATION = 295;            // audio is 294.721 s; prepare.mjs checks ±0.5 s
export const FRAMES = FPS * DURATION;
export const ANIMATIC = false;          // ?animatic=1 shows the shot cards

// Measured by prepare.mjs from the WAV (autocorrelation, 100 Hz onsets); it warns when a new
// measurement drifts from this. NOTE: this track does not sit on a rigid grid — the ACF peak is
// 4.2 BPM wide and the detected kicks are a median 44 ms off the grid. GRID is therefore only a
// guide (bar counter, animatic); cuts snap to the measured kick onsets instead, see snapShots().
export const GRID = { bpm: 131.746, beat0: 0.3623 };
export const BEAT = 60 / GRID.bpm;
export const bar = (n, beats = 0) => +(GRID.beat0 + ((n - 1) * 4 + beats) * BEAT).toFixed(4);

// Palette. Keys are referenced by name across zones; the arc is cyan (outbound) → amber (homeward).
export const PAL = {
  bg: '#05080e', grid: '#0d2233', text: '#dbe9f4', dim: '#6d8496',
  cyan: '#1ea8ff', cyanHot: '#8fe4ff',
  amber: '#ff7a18', amberHot: '#ffd08a',
  ok: '#3fe08a', warn: '#ffc857', down: '#ff3b3b', dawn: '#ffb37a',
};

// The nine hops. `ttl` is the value AFTER the hop; L2 nodes do not decrement.
export const HOPS = [
  { n: 1, node: 'acc-sw-01', port: 'Gi1/0/24', ip: null, l3: false, ttl: 64, rtt: 0.31 },
  { n: 2, node: 'dist-rtr-01', ip: '10.24.0.1', l3: true, ttl: 63, rtt: 0.88 },
  { n: 3, node: 'core-rtr-01', ip: '10.0.0.1', l3: true, ttl: 62, rtt: 1.42 },
  { n: 4, node: 'edge-fw-01', ip: '198.51.100.1', l3: true, ttl: 61, rtt: 2.61 },
  { n: 5, node: 'ix-fra-01', ip: '203.0.113.9', l3: true, ttl: 60, rtt: 6.20 },
  { n: 6, node: 'ix-zrh-01', ip: '203.0.113.10', l3: true, ttl: 63, rtt: 7.05 },
  { n: 7, node: 'core-rtr-02', ip: '10.0.0.2', l3: true, ttl: 62, rtt: 8.11 },
  { n: 8, node: 'acc-sw-07', port: 'Gi1/0/7', ip: null, l3: false, ttl: 62, rtt: 8.60 },
  { n: 9, node: 'wlan-client', ip: '192.168.1.254', l3: false, ttl: 62, rtt: 8.94, last: true },
];

// Canon from the track-09 cover artwork – these numbers are binding, see DREHBUCH.md §2.
export const DEST = { ip: '192.168.1.254', mac: '00:1A:2B:3C:4D:5E', hops: 9, ttl: 62, rtt: 8.94 };

// Blender sets loaded before the first frame (built by videos/kisound/tools/blender)
export const SETS = ['port-macro', 'switch-48p', 'router-core', 'ap-ceiling', 'laptop', 'office', 'rack-aisle', 'city-block'];

export const ENDCARD = { artist: 'Samuel Heinrich', album: 'Network Engineer', track: 'Track 09 · Last Hop' };
export const TITLE = 'LAST HOP';

export const TRANS = {
  cut: { pre: 0, post: 0, flash: 0 },
  dive: { pre: 0.06, post: 0.2, flash: 0.5 },
  fade: { pre: 0.25, post: 0.35, flash: 0, black: 1 },
  turn: { pre: 0.12, post: 0.3, flash: 0.35 },   // the 180° at the far-end server
  snap: { pre: 0.02, post: 0.08, flash: 0.8 },   // colour flip / drop
};

export const QUALITY = { shutter: 0.5 / FPS, bloom: 0.08, grain: 0.018 };

export const CHAPTERS = [
  ['Intro', 0], ['Titel', 20.84], ['Verse 1', 34.46], ['Pre-Chorus', 61.28],
  ['Chorus 1', 80.72], ['Verse 2', 109.4], ['Hook', 139.14], ['Bridge', 157.18],
  ['Build', 187.22], ['Final Chorus', 207.56], ['Outro', 236.26], ['Rückzug', 251.6],
];

// ---------------------------------------------------------------------------
// SHOTS – the 16 scenes of DREHBUCH.md §5, broken into cuts.
// t: [start, end] seconds (gap-free, snapped to the beat grid at load)
// zone/mode: which set and which state · e: energy 0..1.2 · motif: PAL key for the
// transition flash · in: TRANS key · label/note: animatic card only.
// ---------------------------------------------------------------------------
export const SHOTS = [
  // S01 · Trägersignal
  { id: 's01_carrier', t: [0, 3.06], zone: 'sketch', mode: 'carrier', e: 0.1, motif: 'cyan', in: 'fade',
    label: 'Trägersignal', note: 'Schwarz. Eine dunkelcyane Linie, kaum sichtbar. Bei 2.4 s ein erster Impuls von links.' },

  // S02 · Intro – das ferne Ziel
  { id: 's02_route', t: [3.06, 6.88], zone: 'sketch', mode: 'route', e: 0.2, motif: 'cyan', in: 'cut',
    label: 'Every route has an ending', note: 'Die Linie wird zur Route, zieht in die Tiefe. Das Ende bleibt ausserhalb des Bildes.' },
  { id: 's02_shore', t: [6.88, 12.36], zone: 'sketch', mode: 'shore', e: 0.25, motif: 'amber', in: 'cut',
    label: 'Every signal finds a shore', note: 'Perspektive öffnet nach oben: dunkler Ozean, Seekabel, am Horizont der erste warme Punkt.' },
  { id: 's02_noise', t: [12.36, 17.78], zone: 'sketch', mode: 'noise', e: 0.35, motif: 'cyan', in: 'cut',
    label: 'After all the noise', note: 'Hunderte fremde Ströme, kalt und richtungslos. Nur unser Faden ist scharf.' },
  { id: 's02_gap', t: [17.78, 20.84], zone: 'sketch', mode: 'gap', e: 0.3, motif: 'amber', in: 'cut',
    label: 'there is one hop more', note: 'Rückzug: die ganze Route als Linie – und am Ende fehlt ein Stück. Das Ziel dahinter glimmt.' },

  // S03 · Aufstieg und Titel
  { id: 's03_rise', t: [20.84, 28.5], zone: 'sketch', mode: 'rise', e: 0.5, motif: 'cyan', in: 'dive',
    label: 'Aufstieg', note: 'Über die Landschaft: Zugangsknoten, Core-Achse, entfernte Rechenzentren, Bodenraster.' },
  { id: 's03_title', t: [28.5, 32.2], zone: 'sketch', mode: 'title', e: 0.7, motif: 'cyanHot', in: 'cut',
    label: 'TITEL', note: 'Kanten der Topologie ordnen sich zu LAST HOP und zerfallen wieder.' },
  { id: 's03_plunge', t: [32.2, 34.46], zone: 'sketch', mode: 'plunge', e: 0.9, motif: 'cyanHot', in: 'cut',
    label: 'Sturz in den Port', note: 'Kamera stürzt auf einen aktiven Anschluss zu, Wechsel in die Paketperspektive.' },

  // S04 · Verse 1a – Hops 1 bis 3
  { id: 's04_hop1', t: [34.46, 36.76], zone: 'sketch', mode: 'hop1', e: 0.8, motif: 'cyan', in: 'dive',
    label: 'HOP 1 · acc-sw-01', note: 'Makro RJ45: acht Kontakte, Verriegelung, Port-LED. Durch die Buchse in die Leiterbahn. TTL 64.' },
  { id: 's04_hop2', t: [36.76, 38.36], zone: 'sketch', mode: 'hop2', e: 0.85, motif: 'cyan', in: 'cut',
    label: 'HOP 2 · dist-rtr-01', note: 'Enge Bahnen öffnen in die Switching Fabric – breite Halle aus Licht. TTL 63.' },
  { id: 's04_hop3', t: [38.36, 41.92], zone: 'sketch', mode: 'hop3', e: 0.8, motif: 'cyan', in: 'cut',
    label: 'HOP 3 · core-rtr-01', note: 'Fast leere Glasfaserstrecke. Nur Geschwindigkeit und Abstand. TTL 62.' },
  { id: 's04_fw', t: [41.92, 49.44], zone: 'sketch', mode: 'firewall', e: 0.7, motif: 'ok', in: 'cut',
    label: 'HOP 4 · edge-fw-01', note: 'Schleuse. Regelprüfung wird Zeile für Zeile abgearbeitet, bis eine Regel grün wird. TTL 61.' },

  // S05 · Verse 1b – Hops 4 und 5
  { id: 's05_table', t: [49.44, 53.18], zone: 'sketch', mode: 'table', e: 0.75, motif: 'cyan', in: 'dive',
    label: 'Routing-Tabelle', note: 'Wand aus Einträgen im Raum, ruhig und lesbar. Kamera fährt daran entlang.' },
  { id: 's05_prefix', t: [53.18, 57.54], zone: 'sketch', mode: 'prefix', e: 0.85, motif: 'cyanHot', in: 'cut',
    label: 'HOP 5 · ix-fra-01', note: 'Ein Präfix leuchtet: 203.0.113.0/24, metric 20. Der Ausgang öffnet sich. TTL 60.' },
  { id: 's05_bright', t: [57.54, 61.28], zone: 'sketch', mode: 'bright', e: 0.6, motif: 'amber', in: 'cut',
    label: 'keeps the destination bright', note: 'Blick entlang der Strecke. Am Ende winzig der warme Punkt. 3.5 s ohne Schnitt.' },

  // S06 · Pre-Chorus – die Kehre
  { id: 's06_hopbyhop', t: [61.28, 67.62], zone: 'sketch', mode: 'hopbyhop', e: 0.8, motif: 'cyan', in: 'dive',
    label: 'Hop by hop', note: 'Die Topologie zeichnet sich selbst, Knoten für Knoten.' },
  { id: 's06_linkbylink', t: [67.62, 71.28], zone: 'sketch', mode: 'linkbylink', e: 0.85, motif: 'cyan', in: 'cut',
    label: 'Link by link', note: 'Verbindungen setzen sich im Takt zu einer Lichtbrücke zusammen.' },
  { id: 's06_ttl', t: [71.28, 74.18], zone: 'sketch', mode: 'ttl', e: 0.7, motif: 'warn', in: 'cut',
    label: 'TTL falling', note: 'Nahaufnahme des TTL-Bands: 60. Erstes Mal, dass die Kamera es ernst nimmt.' },
  { id: 's06_turn', t: [74.18, 80.72], zone: 'sketch', mode: 'turn', e: 1.0, motif: 'amber', in: 'turn',
    label: 'DIE KEHRE', note: 'Ferner Server. Paket läuft hinein, kommt amber-gesäumt und mit TTL 64 heraus. 180°-Schwenk endet auf dem Drop.' },

  // S07 · Chorus 1 – die Vorausberechnung (Einstellungen A–F, kehren in S13 wieder)
  { id: 's07_A', t: [80.72, 82.88], zone: 'sketch', mode: 'chorusA', e: 1.2, motif: 'cyanHot', in: 'snap', predict: true,
    label: 'A · Topologie (PREDICTED)', note: 'Weitwinkel auf die Topologie, ein Puls läuft durch. Stottert, Zeitstempel läuft vor.' },
  { id: 's07_B', t: [82.88, 84.4], zone: 'sketch', mode: 'chorusB', e: 1.1, motif: 'amber', in: 'cut', predict: true,
    label: 'B · Zielmarkierung', note: 'Der Pin vom Cover schliesst sich um den Lichtkern.' },
  { id: 's07_C', t: [84.4, 85.7], zone: 'sketch', mode: 'chorusC', e: 1.1, motif: 'cyan', in: 'cut', predict: true,
    label: 'C · Match Cut Buchse', note: 'Reale Netzwerkbuchse → die Landschaft in ihrem Inneren.' },
  { id: 's07_D', t: [85.7, 87.9], zone: 'sketch', mode: 'chorusD', e: 1.0, motif: 'amber', in: 'cut', predict: true,
    label: 'D · Funkraum', note: 'Wellen im leeren Zimmer, ohne Gerät.' },
  { id: 's07_E', t: [87.9, 89.74], zone: 'sketch', mode: 'chorusE', e: 1.1, motif: 'cyanHot', in: 'cut', predict: true,
    label: 'E · Die ganze Strecke', note: 'Hop 1 bis 9 als eine zusammenhängende Linie.' },
  { id: 's07_F', t: [89.74, 92.04], zone: 'sketch', mode: 'chorusF', e: 1.0, motif: 'amber', in: 'cut', predict: true,
    label: 'F · Notebook (abgeschnitten)', note: 'Notebook von hinten, Drahtgitter. Der Schnitt kommt zu früh.' },
  { id: 's07_heart', t: [92.04, 100.82], zone: 'sketch', mode: 'heartbeat', e: 1.0, motif: 'cyanHot', in: 'cut', predict: true,
    label: 'Herzschlag', note: 'Puls auf dem Kick-Raster durch Ports, Leitungen, Knoten – zeitversetzt nach Entfernung.' },
  { id: 's07_out', t: [100.82, 109.4], zone: 'sketch', mode: 'dissolve', e: 0.5, motif: 'cyan', in: 'cut',
    label: 'Vision löst sich auf', note: 'Rückzug in Streifen. Zurück auf der realen Strecke zwischen Hop 5 und 6 – dunkler als vorher.' },

  // S08 · Verse 2a – die Rückblende (entsättigt, Zeitstempel Mar 14 03:11:07)
  { id: 's08_storms', t: [109.4, 112.2], zone: 'sketch', mode: 'storms', e: 0.6, motif: 'warn', in: 'fade', flash: true,
    label: 'RÜCKBLENDE · storms', note: 'Warteschlangen wachsen, Puffer laufen voll, warn-gelb. Entsättigt, Rauschen.' },
  { id: 's08_withdraw', t: [112.2, 115.82], zone: 'sketch', mode: 'withdraw', e: 0.55, motif: 'down', in: 'cut', flash: true,
    label: 'routes that disappeared', note: 'Eintrag wird gestrichen, vor uns endet die Strecke im Nichts. BGP neighbor Down.' },
  { id: 's08_timeout', t: [115.82, 119.88], zone: 'sketch', mode: 'timeout', e: 0.5, motif: 'dim', in: 'cut', flash: true,
    label: 'queries without answers', note: 'Anfragen laufen hinaus, kommen nicht zurück. Markierungen verblassen. * * *' },
  { id: 's08_death', t: [119.88, 123.9], zone: 'sketch', mode: 'death', e: 0.9, motif: 'down', in: 'cut', flash: true,
    label: 'TTL EXCEEDED', note: 'Paket schleift zwischen zwei Routern, TTL rast 24 17 9 3 0. Kern erlischt. Zwei Sekunden fast leeres Bild.' },

  // S09 · Verse 2b – Konvergenz (harter Schnitt in die Gegenwart)
  { id: 's09_green', t: [123.9, 127.3], zone: 'sketch', mode: 'green', e: 0.8, motif: 'ok', in: 'snap',
    label: 'returns to green NOW', note: 'Ersatzpfad aktiv, Statusanzeigen kippen der Reihe nach auf ok. Farbe kehrt zurück.' },
  { id: 's09_breathe', t: [127.3, 131.18], zone: 'sketch', mode: 'breathe', e: 0.85, motif: 'cyan', in: 'cut',
    label: 'the backbone breathes', note: 'Breiter Lichtpuls durch die Hauptverbindungen. Unser Paket unversehrt, TTL 64.' },
  { id: 's09_layers', t: [131.18, 134.24], zone: 'sketch', mode: 'layers', e: 0.8, motif: 'cyanHot', in: 'cut',
    label: 'All the layers', note: 'Vier transparente Ebenen richten sich übereinander aus: Signal, Frame, Paket, Segment.' },
  { id: 's09_meet', t: [134.24, 139.14], zone: 'sketch', mode: 'meet', e: 0.85, motif: 'cyan', in: 'cut',
    label: 'all the paths meet', note: 'Ebenen fallen zusammen, Nebenströme münden geordnet in die Hauptstrecke.' },

  // S10 · Hook – der Farbumschlag
  { id: 's10_hop6', t: [139.14, 140.2], zone: 'sketch', mode: 'hop6', e: 1.0, motif: 'cyan', in: 'snap',
    label: 'HOP 6 · ix-zrh-01', note: 'One more hop. TTL 63.' },
  { id: 's10_light', t: [140.2, 141.3], zone: 'sketch', mode: 'light', e: 1.0, motif: 'cyanHot', in: 'cut',
    label: 'One more light', note: 'Ein Link leuchtet auf, der vorher dunkel war.' },
  { id: 's10_curve', t: [141.3, 144.96], zone: 'sketch', mode: 'curve', e: 1.05, motif: 'amber', in: 'cut',
    label: 'One more route', note: 'Weite Kurve gibt erstmals den Blick auf das Zielnetz frei.' },
  { id: 's10_flip', t: [144.96, 146.4], zone: 'sketch', mode: 'flip', e: 1.2, motif: 'amber', in: 'snap',
    label: 'DER FARBUMSCHLAG', note: 'Destination comes alive: die Route kippt von hinten nach vorn cyan→amber in 0.8 s.' },
  { id: 's10_city', t: [146.4, 157.18], zone: 'sketch', mode: 'city', e: 0.7, motif: 'amber', in: 'cut',
    label: 'Stadt bei Nacht', note: 'Erster Ausflug aus der Hardware: Gebäude, wenige Fenster, eines warm. Danach zurück hinein.' },

  // S11 · Bridge – das Netz trägt
  { id: 's11_console', t: [157.18, 160.82], zone: 'sketch', mode: 'console', e: 0.4, motif: 'ok', in: 'fade',
    label: 'No alarm in the console', note: 'Reduzierte Monitoringansicht. Alles still, nur der Cursor blinkt.' },
  { id: 's11_loss', t: [160.82, 165.06], zone: 'sketch', mode: 'loss', e: 0.45, motif: 'ok', in: 'cut',
    label: 'No loss in the stream', note: 'Messstelle, gleichmässige Impulse, Zähler 0.00%.' },
  { id: 's11_sfp', t: [165.06, 168.2], zone: 'sketch', mode: 'sfp', e: 0.5, motif: 'cyanHot', in: 'cut',
    label: 'Every link is holding', note: 'Makro SFP-Modul: das Glas, das Licht darin.' },
  { id: 's11_ports', t: [168.2, 170.92], zone: 'sketch', mode: 'ports', e: 0.5, motif: 'ok', in: 'cut',
    label: 'Every route is clean', note: 'Makro Kabelstrang, Port-Reihe, alle LEDs grün.' },
  { id: 's11_l1l4', t: [170.92, 173.78], zone: 'sketch', mode: 'l1l4', e: 0.6, motif: 'cyan', in: 'cut',
    label: 'HOP 7 · layer one to four', note: 'Die vier Ebenen aus S09, diesmal einzeln durchfahren. TTL 62.' },
  { id: 's11_air', t: [173.78, 177.28], zone: 'sketch', mode: 'air', e: 0.65, motif: 'amber', in: 'cut',
    label: 'wireless air to core', note: 'Eine durchgehende Fahrt Funkraum → AP → Switch → Core. Rückwärts, als Vorschau.' },
  { id: 's11_moving', t: [177.28, 181.28], zone: 'sketch', mode: 'moving', e: 0.6, motif: 'cyan', in: 'cut',
    label: 'the network keeps moving', note: 'Weit über der Stadt, Verkehr als Adernetz.' },
  { id: 's11_dawn', t: [181.28, 187.22], zone: 'sketch', mode: 'dawn', e: 0.5, motif: 'dawn', in: 'cut',
    label: 'fades into the dawn', note: 'Horizont wird hell, dawn mischt sich in die Palette. Sechs Sekunden ohne Schnitt.' },

  // S12 · Build
  { id: 's12_build', t: [187.22, 205.9], zone: 'sketch', mode: 'build', e: 0.9, motif: 'amber', in: 'dive',
    label: 'BUILD (20 s, ein Zug)', note: 'Der Film sammelt seine Motive ein: Strecke, Router, Datenautobahn, Buchse – je ein Wimpernschlag.' },
  { id: 's12_hold', t: [205.9, 207.56], zone: 'sketch', mode: 'hold', e: 0.3, motif: 'dim', in: 'cut',
    label: 'RUHEMOMENT', note: 'Alles friert für zwei Zählzeiten. Nur das TTL-Band dreht sich weiter.' },

  // S13 · Final Chorus – der neunte Hop (Folge A–F wie S07, echt und zu Ende)
  { id: 's13_A', t: [207.56, 211.46], zone: 'sketch', mode: 'chorusA', e: 1.2, motif: 'amberHot', in: 'snap',
    label: 'A/B · echt', note: 'Topologie, Puls, der Pin schliesst sich – und bleibt.' },
  { id: 's13_C', t: [211.46, 215.06], zone: 'sketch', mode: 'chorusC', e: 1.15, motif: 'amber', in: 'cut',
    label: 'C/D · HOP 8 + Funkstrecke', note: 'Match Cut in die Buchse, acc-sw-07 lernt 00:1A:2B:3C:4D:5E. Dann verlässt das Paket das Kabel.' },
  { id: 's13_E', t: [215.06, 219.02], zone: 'sketch', mode: 'chorusE', e: 1.2, motif: 'amberHot', in: 'cut',
    label: 'E · HOP 9', note: 'Die Welle erreicht die Antenne im Deckel. Gesamtansicht: alle neun Hops als eine Linie.' },
  { id: 's13_F', t: [219.02, 228.04], zone: 'sketch', mode: 'arrival', e: 1.1, motif: 'amberHot', in: 'cut',
    label: 'F · durch das Gerät', note: 'Antenne, Bus, Speicher, Renderer, Bildschirm. Das Drahtgitter wird echtes Gerät.' },
  { id: 's13_room', t: [228.04, 236.26], zone: 'sketch', mode: 'room', e: 0.7, motif: 'dawn', in: 'cut',
    label: 'Der Raum', note: 'Kamera tritt aus dem Bildschirm zurück: Schreibtisch, Fenster, erstes Morgenlicht. Waveform pulst auf dem Kick.' },

  // S14 · Outro – die Antwort, und der Rückzug durch die Massstäbe.
  // Der Rückzug liegt jetzt HIER, nicht am Schluss: der Film soll auf dem Laptop enden, nicht auf
  // einer Topologie. Wir verlassen den Schreibtisch, während die Antwort landet, und kommen zurück.
  { id: 's14_ack', t: [236.26, 240.4], zone: 'sketch', mode: 'ack', e: 0.5, motif: 'ok', in: 'cut',
    label: 'The last hop answers', note: 'Bestätigungsimpuls zurück ins Netz – nur als kurzes Aufblitzen der Port-LED.' },
  { id: 's14_pullout', t: [240.4, 248], zone: 'sketch', mode: 'pullout', e: 0.45, motif: 'dawn', in: 'cut',
    label: 'RÜCKZUG (ein Zug)', note: 'The signal lands. Die Kamera hebt vom Schreibtisch ab: Raum, Gebäude, Stadt, Küste.' },
  { id: 's14_topology', t: [248, 256], zone: 'sketch', mode: 'topology', e: 0.4, motif: 'amber', in: 'cut',
    label: 'Die Linie vom Cover', note: 'The route is silent. Stadt wird Topologie, die Route liegt als eine Linie darin. Neun Knoten leuchten.' },

  // S15 · Zurück an den Schreibtisch – das Schlussbild des Films
  { id: 's15_descend', t: [256, 262], zone: 'sketch', mode: 'descend', e: 0.4, motif: 'dawn', in: 'cut',
    label: 'Rückkehr', note: 'The album ends. Die Kamera kommt aus der Topologie zurück auf das eine Gerät.' },
  { id: 's15_room', t: [262, 282], zone: 'sketch', mode: 'room', e: 0.35, motif: 'dawn', in: 'fade',
    label: 'DER RAUM', note: 'Der Laptop im Morgenlicht, die Waveform pulst auf dem Kick. Zwanzig Sekunden ohne Schnitt.' },

  // S16 · Schlusskarte, über dem Laptop statt auf Schwarz
  { id: 'endcard', t: [282, DURATION], zone: 'sketch', mode: 'room', e: 0.2, motif: 'dawn', in: 'cut',
    label: 'SCHLUSSKARTE', note: 'Ping-Statistik über dem stehenden Bild. Letztes Bild des Films: der Laptop.' },
];

// ---------------------------------------------------------------------------
// MESSAGES – the on-screen text. Written, NOT derived from the transcript: the
// transcript of this track is 54 sung lines and nothing else (DREHBUCH.md §3.5).
// Nothing sung ever reaches the screen.
//   t      when it appears
//   tag    syslog facility, rendered as %TAG
//   text   the message
//   status info | ok | warn | down | query  → colour
//   hop    optional: also writes a line into the traceroute panel
// ---------------------------------------------------------------------------
export const MESSAGES = [
  { t: 3.06, tag: 'SYS-5-RESTART', text: 'route lookup initiated for 192.168.1.254', status: 'info' },
  { t: 8.2, tag: 'DNS-6-RESOLVED', text: '192.168.1.254 · 1 answer', status: 'info' },
  { t: 13.4, tag: 'IP-6-TXPATH', text: 'default gateway 10.24.0.1 selected', status: 'info' },
  { t: 18.6, tag: 'ICMP-4-UNREACH', text: 'final hop not yet resolved', status: 'warn' },
  { t: 22.4, tag: 'TOPO-6-DISCOVER', text: 'adjacency database loaded · 9 hops projected', status: 'info' },

  { t: 34.8, tag: 'LINK-3-UPDOWN', text: 'Gi1/0/24 changed state to up', status: 'ok', hop: 1 },
  { t: 37.0, tag: 'ROUTE-6-HOP', text: 'dist-rtr-01 · ttl 63', status: 'info', hop: 2 },
  { t: 38.6, tag: 'ROUTE-6-HOP', text: 'core-rtr-01 · ttl 62', status: 'info', hop: 3 },
  { t: 42.4, tag: 'FW-6-INSPECT', text: 'session 0x4f2a evaluated against 1284 rules', status: 'query' },
  { t: 46.8, tag: 'FW-6-PERMIT', text: 'rule 0912 permit tcp any host 203.0.113.9 eq 443', status: 'ok', hop: 4 },

  { t: 49.8, tag: 'RIB-6-LOOKUP', text: 'longest prefix match in progress', status: 'query' },
  { t: 53.6, tag: 'RIB-6-SELECT', text: '203.0.113.0/24 via ix-fra-01 metric 20', status: 'ok', hop: 5 },
  { t: 58.2, tag: 'IP-6-FORWARD', text: 'destination bright · 5 of 9 hops', status: 'info' },

  { t: 62.0, tag: 'TOPO-6-PATH', text: 'path drawn hop by hop', status: 'info' },
  { t: 71.6, tag: 'IP-4-TTL', text: 'ttl 60 remaining', status: 'warn' },
  { t: 74.6, tag: 'HTTP-6-RESPONSE', text: '200 OK · 1 packet · ttl reset to 64', status: 'ok' },
  { t: 77.2, tag: 'IP-6-REVERSE', text: 'return path engaged', status: 'ok' },

  { t: 81.2, tag: 'SYS-6-PREDICT', text: 'arrival predicted · not yet observed', status: 'query' },
  { t: 93.0, tag: 'SYS-6-HEARTBEAT', text: 'keepalive 129.99 bpm', status: 'info' },
  { t: 101.4, tag: 'SYS-6-PREDICT', text: 'projection discarded · resuming live path', status: 'warn' },

  { t: 110.0, tag: 'QUEUE-4-CONGEST', text: 'output queue 92% on core-rtr-01', status: 'warn', past: true },
  { t: 112.6, tag: 'BGP-5-ADJCHANGE', text: 'neighbor 203.0.113.9 Down · hold timer expired', status: 'down', past: true },
  { t: 116.2, tag: 'ICMP-4-TIMEOUT', text: 'request timed out · * * *', status: 'down', past: true },
  { t: 120.4, tag: 'IP-3-TTLEXPIRED', text: 'ttl exceeded in transit · packet discarded', status: 'down', past: true },

  { t: 124.3, tag: 'BGP-5-ADJCHANGE', text: 'neighbor 203.0.113.10 Up', status: 'ok' },
  { t: 127.8, tag: 'RIB-6-CONVERGE', text: 'converged in 1842 ms · all routes clean', status: 'ok' },
  { t: 131.6, tag: 'OSI-6-STACK', text: 'L1 L2 L3 L4 aligned', status: 'info' },

  { t: 139.4, tag: 'ROUTE-6-HOP', text: 'ix-zrh-01 · ttl 63', status: 'info', hop: 6 },
  { t: 145.2, tag: 'SYS-6-DEST', text: 'destination network is alive', status: 'ok' },

  { t: 157.6, tag: 'SYS-6-CLEAN', text: 'no alarms in console', status: 'ok' },
  { t: 161.2, tag: 'STAT-6-LOSS', text: 'packet loss 0.00% over 10000 samples', status: 'ok' },
  { t: 165.4, tag: 'SFP-6-DOM', text: 'rx -4.1 dBm · tx -2.8 dBm · nominal', status: 'ok' },
  { t: 171.3, tag: 'ROUTE-6-HOP', text: 'core-rtr-02 · ttl 62', status: 'info', hop: 7 },
  { t: 174.2, tag: 'DOT11-6-ASSOC', text: 'ap-02 radio 1 ready · -47 dBm', status: 'ok' },
  { t: 181.7, tag: 'SYS-6-DAWN', text: 'uptime 2y 114d · still forwarding', status: 'info' },

  { t: 208.0, tag: 'IP-6-ARRIVING', text: 'final approach · 2 hops remaining', status: 'info' },
  { t: 211.8, tag: 'MAC-6-LEARN', text: '00:1A:2B:3C:4D:5E on Gi1/0/7 vlan 10', status: 'ok', hop: 8 },
  { t: 215.4, tag: 'DOT11-6-TXPKT', text: 'unicast to 00:1A:2B:3C:4D:5E · mcs 11 · 1 attempt', status: 'ok', hop: 9 },
  { t: 219.4, tag: 'IP-6-DELIVER', text: '192.168.1.254 · ttl 62 · 8.94 ms', status: 'ok' },
  { t: 229.0, tag: 'APP-6-RENDER', text: 'stream ready · 09 Last Hop', status: 'ok' },

  { t: 236.6, tag: 'TCP-6-ACK', text: 'ack 1 · window 65535', status: 'ok' },
  { t: 240.8, tag: 'SYS-6-STATUS', text: '192.168.1.254 REACHABLE', status: 'ok' },
  { t: 244.0, tag: 'SYS-6-QUIET', text: 'trace complete · instrumentation off', status: 'info' },
  { t: 249.7, tag: 'ALBUM-6-END', text: '10 of 10 tracks delivered', status: 'ok' },
];

export const STATUS_COL = { info: 'text', ok: 'ok', warn: 'warn', down: 'down', query: 'cyan' };

// ---------------------------------------------------------------------------
// Derived state – one source of truth for the overlay and every zone.
// ---------------------------------------------------------------------------
export const TURN_T = 74.6;            // the far-end server: a new packet is born, TTL back to 64
export const FLIP_T = 144.96;          // "Destination comes alive" – the route turns cyan → amber
export const FLIP_LEN = 0.8;
export const BURN = [119.88, 123.0];   // flashback only: an older packet burns its TTL to 0
export const SILENT_T = 243.68;        // "The route is silent." – instrumentation fades out

const TTL_EVENTS = [
  ...MESSAGES.filter((m) => m.hop).map((m) => ({ t: m.t, ttl: HOPS[m.hop - 1].ttl })),
  { t: TURN_T, ttl: 64 },
].sort((a, b) => a.t - b.t);

// TTL shown on the band and in the HUD. Decrements at routers only; resets at the turn.
export function ttlAt(t) {
  if (t >= BURN[0] && t < BURN[1]) {           // the memory, not our packet
    const k = (t - BURN[0]) / (BURN[1] - BURN[0]);
    return Math.max(0, Math.round(58 * (1 - k) ** 2.2));
  }
  let ttl = 64;
  for (const e of TTL_EVENTS) { if (e.t > t) break; ttl = e.ttl; }
  return ttl;
}
// 0 = outbound cyan, 1 = homeward amber
export function warmth(t) { return Math.min(1, Math.max(0, (t - FLIP_T) / FLIP_LEN)); }
// how many hops have been reached by t
export function hopsAt(t) { return MESSAGES.filter((m) => m.hop && m.t <= t).length; }
