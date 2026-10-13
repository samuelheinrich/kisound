// Time model of the film: transcript segments (what is said when), measured beat grid and audio envelopes.
// Everything is a pure function of t, so the renderer can draw any frame in any order. No DOM access here.
import { FPS, SHOTS, KIND_OVERRIDES, TEXT_FIX } from './config.js';

const HOOK = /^(trustsec|know the client|\w+ the flow)\.?$/i;
const GERMAN = /[äöüß]|\b(der|die|das|den|dem|ein|eine|und|oder|mit|hier|dort|jeder|allein|nicht|nur|kein|keine|wer|was|wohin|dich|deine|dein|sein|kennt|rolle|bekannt\w*|zugriff|ziel|gilt|zählt|geht|steht|bereit|definiertes|spiel)\b/i;

// kind per segment: 'title' (big typography), 'system' (log line), 'hook' and 'lyric' (sung – never shown)
export function classify(segments) {
  return segments.map((s) => {
    const text = TEXT_FIX[s.id] ?? s.text;
    let kind = /^cisco trustsec\.?$/i.test(text) ? 'title' : HOOK.test(text) ? 'hook' : GERMAN.test(text) || /^Strophe/.test(s.section) ? 'lyric' : 'system';
    kind = KIND_OVERRIDES[s.id] ?? kind;
    return { id: s.id, start: s.start, end: s.end, text, section: s.section, kind };
  });
}

export class Timeline {
  constructor(transcript, analysis) {
    this.segments = classify(transcript.segments);
    this.shown = this.segments.filter((s) => s.kind === 'system' || s.kind === 'title');
    this.a = analysis;
    this.beatLen = 60 / analysis.bpm;
    this.beat0 = analysis.beat0;
    this.kicks = analysis.kicks;
    this.byId = new Map(this.segments.map((s) => [s.id, s]));
  }
  // transcript segment by id ({ start, end, text, kind }) – zones sync their events to the voice with it
  seg(id) { return this.byId.get(id); }
  // local 0..1 progress between two absolute times
  span(t, a, b) { return Math.min(1, Math.max(0, (t - a) / (b - a))); }
  // beat grid: continuous beat count b (0 = the measured downbeat), bar / beat-in-bar, phase 0..1 inside the beat
  beat(t) {
    const b = (t - this.beat0) / this.beatLen, i = Math.floor(b);
    return { b, index: i, phase: b - i, bar: Math.floor(i / 4) + 1, inBar: ((i % 4) + 4) % 4 };
  }
  nearestBeat(t) { return this.beat0 + Math.round((t - this.beat0) / this.beatLen) * this.beatLen; }
  // envelope 0..1 ('rms' | 'low' | 'high'), linear between frames
  env(name, t) {
    const e = this.a.env[name], x = t * FPS, i = Math.max(0, Math.min(e.length - 2, Math.floor(x))), f = Math.min(1, Math.max(0, x - i));
    return (e[i] * (1 - f) + e[i + 1] * f) / 255;
  }
  // decaying pulse from the most recent kick onset (1 at the kick, ~0 after 0.3 s)
  kick(t, decay = 0.11) {
    const k = this.kicks; let lo = 0, hi = k.length - 1, j = -1;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (k[m] <= t) { j = m; lo = m + 1; } else hi = m - 1; }
    return j < 0 ? 0 : Math.exp(-(t - k[j]) / decay);
  }
  segmentsAround(t, before = 12, after = 0) { return this.shown.filter((s) => s.start <= t + after && s.end >= t - before); }
}

// Snap shot boundaries to the nearest beat when they are within `maxBeats` of it (vocal onsets sit a little before
// or after the beat; cuts land on it). Returns new shot objects, the config stays untouched.
export function snapShots(timeline, maxBeats = 0.35) {
  const snap = (t) => {
    if (t <= 0 || t >= SHOTS[SHOTS.length - 1].t[1]) return t;
    const n = timeline.nearestBeat(t);
    return Math.abs(n - t) <= maxBeats * timeline.beatLen ? +n.toFixed(4) : t;
  };
  const out = SHOTS.map((s) => ({ ...s, t: [snap(s.t[0]), snap(s.t[1])] }));
  for (let i = 1; i < out.length; i++) out[i].t[0] = out[i - 1].t[1]; // keep the list gap-free
  return out;
}
