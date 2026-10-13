// Time model of the film: the measured beat grid, the audio envelopes and the authored on-screen messages.
// Everything is a pure function of t, so the renderer can draw any frame in any order. No DOM access here.
//
// Difference to the TrustSec film: that transcript carried English computer-voice system messages next to the
// sung German lines, so the overlay could be fed straight from it. Here all 54 transcript segments are sung
// English lyrics and nothing else, so the on-screen text is authored in config.MESSAGES. The transcript is
// used for timing anchors only — no sung word can reach the screen, because none is ever marked shown.
import { FPS, SHOTS, MESSAGES } from './config.js';

export class Timeline {
  constructor(transcript, analysis) {
    // every transcript segment is a lyric: kept for timing anchors, never rendered
    this.segments = transcript.segments.map((s) => ({
      id: s.id, start: s.start, end: s.end, text: s.text, section: s.section, kind: 'lyric',
    }));
    this.sections = transcript.sections || [];
    // the authored log lines, sorted and decorated with a duration
    this.shown = MESSAGES.map((m, i) => ({ ...m, id: `m${i}`, start: m.t, end: m.t + 5.0 }))
      .sort((a, b) => a.start - b.start);
    this.a = analysis;
    this.beatLen = 60 / analysis.bpm;
    this.beat0 = analysis.beat0;
    this.kicks = analysis.kicks;
    this.byId = new Map(this.segments.map((s) => [s.id, s]));
    this.bySection = new Map(this.sections.map((s) => [s.title, s]));
  }
  // transcript segment by id — zones sync their events to the voice with it
  seg(id) { return this.byId.get(id); }
  // section by title ('Intro', 'Verse 1', 'Pre-Chorus', 'Chorus', 'Verse 2', 'Hook', 'Bridge', 'Final Chorus', 'Outro')
  section(title) { return this.bySection.get(title); }
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
  messagesAround(t, before = 12, after = 0) { return this.shown.filter((s) => s.start <= t + after && s.end >= t - before); }
  // the traceroute panel: every hop whose message has already fired
  hopsSoFar(t) { return this.shown.filter((m) => m.hop && m.start <= t).map((m) => m.hop); }
}

// Snap shot boundaries to the music. On a rigidly quantised track the computed beat grid is enough,
// but this one breathes: the autocorrelation peak is 4.2 BPM wide and the detected kicks sit a median
// 44 ms off the grid. So a cut snaps to the nearest measured KICK ONSET (an exact time in the audio),
// and only falls back to the grid where no kick is close. Returns new shot objects; the config stays untouched.
export function snapShots(timeline, maxKick = 0.16, maxBeats = 0.3) {
  const kicks = timeline.kicks;
  const nearestKick = (t) => {
    let lo = 0, hi = kicks.length - 1, best = null;
    while (lo <= hi) { const m = (lo + hi) >> 1; if (kicks[m] <= t) { best = kicks[m]; lo = m + 1; } else hi = m - 1; }
    const next = kicks[Math.min(kicks.length - 1, lo)];
    if (best == null) return next;
    return Math.abs(next - t) < Math.abs(best - t) ? next : best;
  };
  const last = SHOTS[SHOTS.length - 1].t[1];
  const snap = (t) => {
    if (t <= 0 || t >= last) return t;
    const k = nearestKick(t);
    if (Math.abs(k - t) <= maxKick) return +k.toFixed(4);
    const b = timeline.nearestBeat(t);
    return Math.abs(b - t) <= maxBeats * timeline.beatLen ? +b.toFixed(4) : t;
  };
  const out = SHOTS.map((s) => ({ ...s, t: [snap(s.t[0]), snap(s.t[1])] }));
  for (let i = 1; i < out.length; i++) out[i].t[0] = out[i - 1].t[1]; // keep the list gap-free
  return out;
}
