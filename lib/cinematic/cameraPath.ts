import { clamp, lerp, smoothStep } from "./math";

export type CameraKeyframe = {
  at: number; // scroll progress (0-1) this keyframe is reached at
  azimuth: number; // radians, horizontal orbit angle
  elevation: number; // radians, vertical angle
  distance: number; // camera distance from target
};

/**
 * Given a sorted list of keyframes and a progress value, finds the two
 * bracketing keyframes and interpolates between them — the same idea
 * as a CSS/GSAP keyframe timeline, but for orbit-camera spherical
 * coordinates instead of DOM properties.
 */
export function getCameraSpherical(
  progress: number,
  keyframes: CameraKeyframe[]
): { azimuth: number; elevation: number; distance: number } {
  const p = clamp(progress, 0, 1);

  if (p <= keyframes[0].at) return keyframes[0];
  if (p >= keyframes[keyframes.length - 1].at) {
    return keyframes[keyframes.length - 1];
  }

  let lower = keyframes[0];
  let upper = keyframes[keyframes.length - 1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (p >= keyframes[i].at && p <= keyframes[i + 1].at) {
      lower = keyframes[i];
      upper = keyframes[i + 1];
      break;
    }
  }

  const localT = smoothStep(
    (p - lower.at) / Math.max(0.0001, upper.at - lower.at)
  );

  return {
    azimuth: lerp(lower.azimuth, upper.azimuth, localT),
    elevation: lerp(lower.elevation, upper.elevation, localT),
    distance: lerp(lower.distance, upper.distance, localT),
  };
}

/** Converts orbit spherical coordinates around a target into a world position. */
export function sphericalToPosition(
  azimuth: number,
  elevation: number,
  distance: number
): [number, number, number] {
  const x = distance * Math.cos(elevation) * Math.sin(azimuth);
  const y = distance * Math.sin(elevation);
  const z = distance * Math.cos(elevation) * Math.cos(azimuth);
  return [x, y, z];
}
