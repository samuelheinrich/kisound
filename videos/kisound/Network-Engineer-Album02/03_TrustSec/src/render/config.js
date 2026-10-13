// Network Engineer 02 · Track 03 "Cisco TrustSec" – central configuration: timing, shots, palette, text rules.
// The audio is the finished MP3 from the music repository (see src/tools/prepare.mjs); nothing here generates sound.
// Tempo and bar grid are measured from the audio (assets/audio/analysis.json), shot times are seconds of the MP3.
// No DOM access in this file: src/tools/prepare.mjs imports it in Node.

export const FPS = 60, DURATION = 288, FRAMES = FPS * DURATION;

// Animatic mode: every shot is a labelled sketch (zones/sketch.js) with the shot card on top. Off with ?animatic=0.
export const ANIMATIC = false;

// Colour language. Every Security Group has one colour; permit/deny are reserved for the policy decision.
export const PAL = {
  bg: '#04070b', grid: '#0f2a3a', text: '#e6f1f7', dim: '#6f8796',
  employee: '#1ec8ff', // SGT 10 – the hero client
  server: '#ffb020', // SGT 20
  printer: '#ff6fc8', // SGT 30
  phone: '#a07bff', // SGT 40
  unknown: '#8a949e', // SGT 0 – no identity
  permit: '#3fe08a', deny: '#ff3b3b', query: '#ffc857', ise: '#e8f7ff',
};

// Measured beat grid (src/tools/prepare.mjs checks that assets/audio/analysis.json still agrees).
export const GRID = { bpm: 140.298, beat0: 0.0962 };
export const BEAT = 60 / GRID.bpm;
// start of bar n (1-based) + beats – the drops of the track sit exactly on bar lines
export const bar = (n, beats = 0) => +(GRID.beat0 + ((n - 1) * 4 + beats) * BEAT).toFixed(4);

// Security Groups (matrix order) and the SGACL policy: POLICY[src][dst] = 1 permit, 0 deny
export const GROUPS = [
  { sgt: 10, key: 'employee', name: 'EMPLOYEE', device: 'laptop' },
  { sgt: 20, key: 'server', name: 'SERVER', device: 'server' },
  { sgt: 30, key: 'printer', name: 'PRINTER', device: 'printer' },
  { sgt: 40, key: 'phone', name: 'PHONE', device: 'phone' },
  { sgt: 0, key: 'unknown', name: 'UNKNOWN', device: null },
];
export const POLICY = [
  [1, 1, 1, 1, 0],
  [1, 1, 1, 1, 0],
  [0, 1, 0, 0, 0],
  [0, 1, 0, 1, 0],
  [0, 0, 0, 0, 0],
];

// Shots: zone + mode + time window. Vocal-led boundaries are snapped to the nearest beat at load time
// (timeline.js → snapShots); boundaries given with bar() sit on the drops. in: transition INTO the shot.
// e: energy 0..1.2 (kick punch, camera shake). label/note: the animatic card.
export const SHOTS = [
  { id: 'intro_dark', t: [0, 8.01], zone: 'switch', mode: 'intro', e: 0.15, motif: 'employee', in: 'fade', label: 'Access-Switch im Dunkeln', note: 'Kamera gleitet an den Ports entlang, eine LED glimmt. Titel dekodiert sich.' },
  { id: 'intro_connect', t: [8.01, 11.85], zone: 'switch', mode: 'connect', e: 0.3, motif: 'employee', in: 'cut', label: 'Client connected', note: 'Stecker rastet auf dem Beat in Port 7, Link-LED springt an.' },
  { id: 'intro_request', t: [11.85, 15.4], zone: 'ise', mode: 'request', e: 0.3, motif: 'ise', in: 'dive', label: 'EAPOL → ISE', note: 'Lichtpuls vom Switch zum Monolithen am Horizont.' },
  { id: 'intro_scan', t: [15.4, 22.48], zone: 'ise', mode: 'scan', e: 0.35, motif: 'query', in: 'cut', label: 'ISE-Scan · Who are you?', note: 'Scan-Ringe, frontal bei der Frage.' },
  { id: 'intro_verified', t: [22.48, 27.3], zone: 'ise', mode: 'card', e: 0.4, motif: 'permit', in: 'cut', label: 'Identity verified', note: 'ID-Karte baut sich auf.' },
  { id: 'intro_tag', t: [27.3, bar(18)], zone: 'closeup', mode: 'tag', e: 0.5, motif: 'employee', in: 'cut', label: 'SGT assigned', note: 'SGT-Ring schnappt zu – Drop.' },
  { id: 'launch', t: [bar(18), 41.21], zone: 'fabric', mode: 'launch', e: 1, motif: 'employee', in: 'dive', label: 'Start durch die Fabric', note: 'POV-Flug, Lichtpulse auf der Kick.' },
  { id: 'v1_dot1x', t: [41.21, 48.46], zone: 'ise', mode: 'triangle', e: 0.7, motif: 'ise', in: 'cut', label: '802.1X-Dreieck', note: 'Client – Switch – ISE.' },
  { id: 'v1_profile', t: [48.46, 55.17], zone: 'ise', mode: 'profile', e: 0.7, motif: 'permit', in: 'cut', label: 'Profil', note: 'Gerät, Nutzer, Rolle rasten ein.' },
  { id: 'v1_ip', t: [55.17, 62.26], zone: 'closeup', mode: 'ip', e: 0.7, motif: 'employee', in: 'cut', label: 'IP wechselt – SGT bleibt', note: 'IP-Label rattert, Ring stabil.' },
  { id: 'prehook', t: [62.26, bar(42)], zone: 'closeup', mode: 'stamps', e: 0.6, motif: 'permit', in: 'cut', label: 'Pre-Hook · vier Stempel', note: 'Pro Logzeile ein Stempel.' },
  { id: 'hook1_a', t: [bar(42), 76.52], zone: 'closeup', mode: 'hook', lvl: 1, e: 1, motif: 'employee', in: 'dive', label: 'Hook · Know the client', note: 'Hook-Grundbild.' },
  { id: 'hook1_b', t: [76.52, 83.86], zone: 'fabric', mode: 'devices', e: 1, motif: 'phone', in: 'cut', label: 'Vier Clients', note: 'Geräte bekommen ihre Gruppenfarben.' },
  { id: 'hook1_c', t: [83.86, bar(54)], zone: 'matrix', mode: 'teaser', e: 1, motif: 'permit', in: 'dive', label: 'Die Policy zählt', note: 'Flug an der Matrix entlang.' },
  { id: 'v2_groups', t: [bar(54), 97.82], zone: 'fabric', mode: 'groups', e: 0.8, motif: 'printer', in: 'cut', label: 'Vier Gruppen', note: 'Inseln formieren sich.' },
  { id: 'v2_inline', t: [97.82, 105.12], zone: 'closeup', mode: 'inline', e: 0.8, motif: 'employee', in: 'dive', label: 'Inline-Tagging', note: 'Frame klappt auf: DMAC | SMAC | CMD SGT | Type | Payload.' },
  { id: 'v2_islands', t: [105.12, 112.89], zone: 'fabric', mode: 'islands', e: 0.8, motif: 'server', in: 'cut', label: 'Source ↔ Destination', note: 'Lichtbahn zwischen zwei Inseln.' },
  { id: 'matrix_permit', t: [112.89, bar(74)], zone: 'matrix', mode: 'permit', e: 0.5, motif: 'permit', in: 'dive', label: 'SGACL · permit', note: 'Zeile → Spalte → Zelle → Gate.' },
  { id: 'hook2_a', t: [bar(74), 132.2], zone: 'closeup', mode: 'hook', lvl: 2, e: 1.1, motif: 'employee', in: 'cut', label: 'Hook 2', note: 'Einschlag bei 2:06.7.' },
  { id: 'hook2_b', t: [132.2, 139.46], zone: 'fabric', mode: 'flow', e: 1.1, motif: 'employee', in: 'dive', label: 'Identität bestimmt den Ort', note: 'Schneller Flug, Pakete sortieren sich nach Farbe.' },
  { id: 'hook2_c', t: [139.46, 146.52], zone: 'matrix', mode: 'traffic', e: 1.1, motif: 'permit', in: 'cut', label: 'Matrix in Aktion', note: 'Viele Flows, Zellen im Takt.' },
  { id: 'break_unknown', t: [146.52, bar(91)], zone: 'ise', mode: 'unknown', e: 0.4, motif: 'unknown', in: 'fade', label: 'Unknown Endpoint', note: 'Scan-Ringe brechen.' },
  { id: 'break_nomatch', t: [bar(91), 163.66], zone: 'matrix', mode: 'nomatch', e: 0.9, motif: 'unknown', in: 'cut', label: 'SGT 0 · kein Match', note: 'Die Unknown-Zeile bleibt dunkel.' },
  { id: 'break_deny', t: [163.66, 172.1], zone: 'matrix', mode: 'deny', e: 0.9, motif: 'deny', in: 'cut', label: 'Access denied', note: 'Rote Zelle, Paket zerschellt.' },
  { id: 'dialog', t: [172.1, 183.7], zone: 'ise', mode: 'dialog', e: 0.9, motif: 'query', in: 'cut', label: 'Verhör', note: 'Frage gegen Glitch.' },
  { id: 'dialog_out', t: [183.7, bar(110)], zone: 'switch', mode: 'outside', e: 0.5, motif: 'deny', in: 'cut', label: 'Stay outside', note: 'Port wird rot, Kamera zieht weg.' },
  { id: 'v3_known', t: [bar(110), 194.96], zone: 'ise', mode: 'known', e: 1, motif: 'employee', in: 'fade', label: 'Bekannter Client', note: 'Scan gelingt, Farbe kehrt zurück.' },
  { id: 'v3_return', t: [194.96, 201.36], zone: 'fabric', mode: 'return', e: 1, motif: 'employee', in: 'dive', label: 'Die Policy sagt wohin', note: 'Flug zum Ziel.' },
  { id: 'v3_gate', t: [201.36, bar(123)], zone: 'matrix', mode: 'gate', e: 1, motif: 'permit', in: 'cut', label: 'Identität öffnet das Gate', note: 'Die IP bleibt draussen.' },
  { id: 'build', t: [bar(123), bar(128)], zone: 'overview', mode: 'build', e: 0.7, motif: 'permit', in: 'cut', label: 'Build · Status', note: 'Fünf Checks, Kamera steigt.' },
  { id: 'final_hook', t: [bar(128), 235.5], zone: 'overview', mode: 'final', e: 1.2, motif: 'employee', in: 'dive', label: 'Final Hook', note: 'Das segmentierte Netz in voller Fahrt.' },
  { id: 'final_deny', t: [235.5, bar(147)], zone: 'overview', mode: 'deny', e: 1.2, motif: 'deny', in: 'cut', label: 'Unknown prallt ab', note: 'Zweimal rot, das Netz läuft weiter.' },
  { id: 'outro_run', t: [bar(147), 258.14], zone: 'fabric', mode: 'victory', e: 1.1, motif: 'permit', in: 'dive', label: 'Siegesrunde', note: 'Flug durch das grüne Netz.' },
  { id: 'outro_matrix', t: [258.14, bar(157)], zone: 'matrix', mode: 'allgreen', e: 1.1, motif: 'permit', in: 'cut', label: 'Alle Policies aktiv', note: 'Die Matrix leuchtet komplett.' },
  { id: 'outro_title', t: [bar(157), bar(161)], zone: 'closeup', mode: 'title', e: 0.3, motif: 'employee', in: 'fade', label: 'Titel', note: 'Das Paket allein im Dunkeln.' },
  { id: 'fin_1', t: [bar(161), bar(162)], zone: 'closeup', mode: 'hook', lvl: 3, e: 1.2, motif: 'employee', in: 'dive', label: 'Finale 1/6', note: 'Montage: ein Schnitt pro Takt.' },
  { id: 'fin_2', t: [bar(162), bar(163)], zone: 'fabric', mode: 'flow', e: 1.2, motif: 'employee', in: 'cut', label: 'Finale 2/6', note: '' },
  { id: 'fin_3', t: [bar(163), bar(164)], zone: 'matrix', mode: 'allgreen', e: 1.2, motif: 'permit', in: 'cut', label: 'Finale 3/6', note: '' },
  { id: 'fin_4', t: [bar(164), bar(165)], zone: 'ise', mode: 'known', e: 1.2, motif: 'employee', in: 'cut', label: 'Finale 4/6', note: '' },
  { id: 'fin_5', t: [bar(165), bar(166)], zone: 'switch', mode: 'outro', e: 1.2, motif: 'permit', in: 'cut', label: 'Finale 5/6', note: '' },
  { id: 'fin_6', t: [bar(166), bar(167)], zone: 'overview', mode: 'end', e: 1.2, motif: 'employee', in: 'cut', label: 'Finale 6/6', note: 'Rückzug über das ganze Netz.' },
  { id: 'endcard', t: [bar(167), DURATION], zone: 'void', mode: 'end', e: 0, motif: 'employee', in: 'cut', label: 'Endcard', note: 'Musik stoppt, Schwarz, Credits.' },
];

// Chapter markers in the player (keys 1–9 jump to the first nine)
export const CHAPTERS = [
  ['Intro', 0], ['Drop', bar(18)], ['Strophe 1', 41.21], ['Hook 1', bar(42)], ['Strophe 2', bar(54)], ['Permit', 112.89],
  ['Hook 2', bar(74)], ['Unknown', 146.52], ['Dialog', 172.1], ['Strophe 3', bar(110)], ['Build', bar(123)], ['Final Hook', bar(128)],
  ['Outro', bar(147)], ['Finale', bar(161)],
];

// ---- on-screen text: ONLY the computer voice (system messages). Sung German lines and the hook are never shown.
// classify() in timeline.js decides per transcript segment; these overrides win over its rules.
export const KIND_OVERRIDES = {}; // e.g. { 17: 'lyric' } hides "Access aligned."
// Text corrections for obvious transcription errors, by segment id. Only fill in after listening to the MP3.
export const TEXT_FIX = { 83: 'Access denied.' }; // 4:05.6 – transcript said "Access defined.", confirmed by ear

// Log-line styling: IOS-style syslog tag per message, chosen by the first matching rule.
export const LOG_TAGS = [
  [/client connected/i, 'AUTHMGR-5-START'],
  [/identity requested/i, 'DOT1X-5-REQUEST'],
  [/who are you|what is your role/i, 'ISE-4-QUERY'],
  [/^unknown\.?$/i, 'ENDPOINT'],
  [/unknown|no identity|no trusted/i, 'DOT1X-4-FAIL'],
  [/identity (verified|confirmed|known)/i, 'DOT1X-5-SUCCESS'],
  [/ISE|role/i, 'ISE-6-AUTHZ'],
  [/SGT-ACL|access|policy/i, 'CTS-6-SGACL'],
  [/SGT/i, 'CTS-5-SGT'],
  [/protected|stay outside/i, 'CTS-6-ENFORCE'],
];
// status colour of a log line
export const statusOf = (text) =>
  /\?/.test(text) ? 'query'
    : /denied|unknown|no identity|no trusted|no access|stay outside/i.test(text) ? 'deny'
      : /verified|confirmed|assigned|permitted|matched|active|enforced|protected|known|aligned|defined|detected|connected|control/i.test(text) ? 'permit'
        : 'info';

// credits on the end card (artist/album as in music/kisound/Network-Engineer-Album02/album.yml)
export const ENDCARD = { artist: 'Samuel Heinrich', album: 'Network Engineer 02', track: 'Track 03 · TrustSec' };

// transitions (seconds around the cut). Flashes only at 'dive' cuts – never strobing on the beat.
export const TRANS = { dive: { pre: 0.06, post: 0.2, flash: 0.5 }, cut: { pre: 0, post: 0, flash: 0 }, fade: { pre: 0.25, post: 0.35, flash: 0, black: 1 } };

// render quality (motion blur via ?mb=…)
export const QUALITY = { shutter: 0.5 / FPS, bloom: 0.08, grain: 0.018 };
