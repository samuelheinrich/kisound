// Timing-only module for the shared export preflight. The browser receives ?lang=en.
import {VARIANTS,FPS} from './config.js';
export {FPS};
export const DURATION=VARIANTS.en.samples/48000;
export const FRAMES=Math.ceil(DURATION*FPS);
