"use client";

import { useRef, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { windowProgress, lerp } from "@/lib/cinematic/math";

export type ScatterPart = {
  finalPos: THREE.Vector3;
  finalRot: THREE.Euler;
  scatterPos: THREE.Vector3;
  scatterRot: THREE.Euler;
};

/** Generates a random scatter position/rotation for a given final pose. */
export function scatterFrom(
  finalPos: THREE.Vector3,
  finalRot: THREE.Euler,
  spread: { x: number; y: number; z: number } = { x: 6, y: 4, z: 5 }
): ScatterPart {
  return {
    finalPos,
    finalRot,
    scatterPos: new THREE.Vector3(
      (Math.random() - 0.5) * spread.x,
      (Math.random() - 0.5) * spread.y + 1,
      (Math.random() - 0.5) * spread.z - 1
    ),
    scatterRot: new THREE.Euler(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    ),
  };
}

/**
 * Wraps any mesh/group so it eases from a scattered pose to its final
 * pose over `windowStart`-`windowEnd` of scroll progress. Used for every
 * physical part across every project's cinematic scene.
 */
export function AssembledPart({
  part,
  progressRef,
  windowStart = 0,
  windowEnd = 0.32,
  children,
}: {
  part: ScatterPart;
  progressRef: MutableRefObject<number>;
  windowStart?: number;
  windowEnd?: number;
  children: React.ReactNode;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!ref.current) return;
    const t = windowProgress(progressRef.current, windowStart, windowEnd);
    ref.current.position.lerpVectors(part.scatterPos, part.finalPos, t);
    ref.current.rotation.set(
      lerp(part.scatterRot.x, part.finalRot.x, t),
      lerp(part.scatterRot.y, part.finalRot.y, t),
      lerp(part.scatterRot.z, part.finalRot.z, t)
    );
  });

  return <group ref={ref}>{children}</group>;
}
