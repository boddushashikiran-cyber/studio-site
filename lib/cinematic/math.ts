export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// Maps a value from one range to another, clamped to the output range.
export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  const t = clamp((value - inMin) / (inMax - inMin), 0, 1);
  return lerp(outMin, outMax, t);
}

// Smoothstep easing — gentle ease-in/ease-out, used throughout the
// cinematic scenes instead of linear interpolation so motion reads as
// physical rather than mechanical.
export function smoothStep(t: number): number {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
}

// Given a scroll progress (0-1) and a [start, end] window within that
// range, returns local progress (0-1) for just that window — the core
// primitive every per-phase animation in a cinematic scene is built on.
export function windowProgress(progress: number, start: number, end: number): number {
  return smoothStep(mapRange(progress, start, end, 0, 1));
}
