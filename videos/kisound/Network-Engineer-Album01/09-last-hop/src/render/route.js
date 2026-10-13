// The route as an actual flight path, not a straight line down Z.
//
// This is the backbone of the film's motion. Three things follow from it:
//   · a hop is a direction change — the frame enters a node and leaves on a different heading,
//     which is what makes a hop legible as an event instead of a passing ring;
//   · the frame advances CONTINUOUSLY along the path, so the world streams towards the camera
//     and things in the distance actually arrive, instead of sliding past sideways;
//   · the corridor in space.js is built along this same curve, so the tunnel bends with the route.
//
// Progress is a piecewise-linear map from time to arc length, pinned so the frame reaches node n
// exactly when that hop's message fires. Pure function of t, like everything else.
import { HOPS, MESSAGES, DURATION } from './config.js';
import { splineFlight, V, clamp } from './core.js';

const LEG = 42;                       // distance between hops along the route
export const Z_START = 26;

// Each hop sits off the previous heading, so the path zig-zags through the machine city. The
// offsets are fixed, not random: the same route has to read the same in the premonition chorus
// and in the final chorus (DREHBUCH.md §4.5).
const OFF = [
  [0, 0], [9, 3], [-11, -2], [7, 5], [-8, 2],
  [12, -3], [-6, 4], [10, 1], [-9, -2], [4, 3],
];

export const NODES = [V(OFF[0][0], 1.6 + OFF[0][1], Z_START)];
for (let i = 0; i < HOPS.length; i++) {
  const [x, y] = OFF[i + 1];
  NODES.push(V(x, 1.6 + y, Z_START - (i + 1) * LEG));
}
// a run-out past the last hop so the curve has somewhere to end and the arrival can overshoot
NODES.push(V(OFF[9][0] * 0.4, 2.2, Z_START - (HOPS.length + 1) * LEG));

export const FLIGHT = splineFlight(NODES, { tension: 0.35 });

// arc-length fraction of each node, measured on the real curve rather than assumed even
export const NODE_U = (() => {
  const out = [];
  const N = 4000;
  let best = NODES.map(() => ({ u: 0, d: Infinity }));
  for (let i = 0; i <= N; i++) {
    const u = i / N, p = FLIGHT.at(u);
    NODES.forEach((n, k) => { const d = p.distanceToSquared(n); if (d < best[k].d) best[k] = { u, d }; });
  }
  for (const b of best) out.push(b.u);
  return out;
})();

// when the frame is at each node: hop messages pin the middle, the ends are the film's own
export const NODE_T = (() => {
  const hops = MESSAGES.filter((m) => m.hop).sort((a, b) => a.t - b.t).map((m) => m.t);
  return [0, ...hops, DURATION];
})();

// time -> arc-length fraction, linear between the pinned nodes
export function routeU(t) {
  const T = NODE_T, U = NODE_U;
  if (t <= T[0]) return U[0];
  for (let i = 1; i < T.length; i++) {
    if (t <= T[i]) {
      const k = (t - T[i - 1]) / Math.max(1e-6, T[i] - T[i - 1]);
      return U[i - 1] + (U[i] - U[i - 1]) * k;
    }
  }
  return U[U.length - 1];
}

export const routePos = (t) => FLIGHT.at(routeU(t));
export const routeDir = (t) => FLIGHT.tangent(routeU(t));
export const nodePos = (n) => NODES[n].clone();

// how close t is to arriving at node n, 1 at the node and falling off over `w` seconds
export function nodeHit(t, n, w = 0.9) {
  const dt = Math.abs(t - NODE_T[n]);
  return clamp(1 - dt / w);
}
