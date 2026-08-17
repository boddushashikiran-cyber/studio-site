"use client";

import { useMemo, MutableRefObject } from "react";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { AssembledPart, scatterFrom, ScatterPart } from "@/components/cinematic/AssembledPart";
import { DustField } from "@/components/cinematic/DustField";
import { CameraRig } from "@/components/cinematic/CameraRig";
import { CameraKeyframe } from "@/lib/cinematic/cameraPath";

/**
 * A procedurally-built watch, not a sculpted model — built from
 * primitives with real PBR materials (metalness/roughness/clearcoat)
 * so it reads as premium rather than a placeholder shape. Structured
 * so a real chronos-watch.glb (see public/models/chronos/) can later
 * replace the parts below without touching the assembly or camera logic.
 */

const STEEL = { color: "#c9cdd3", metalness: 1, roughness: 0.18, clearcoat: 0.6, clearcoatRoughness: 0.2 };
const DIAL = { color: "#12141a", metalness: 0.3, roughness: 0.35 };
const GOLD_ACCENT = { color: "#E8A33D", metalness: 0.9, roughness: 0.25 };
const STRAP = { color: "#1a1512", metalness: 0, roughness: 0.85 };

const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { at: 0.0, azimuth: 0.3, elevation: 0.5, distance: 9 },
  { at: 0.3, azimuth: 0.0, elevation: 0.15, distance: 4.2 }, // front
  { at: 0.45, azimuth: 0.7, elevation: 0.15, distance: 3.8 }, // 3/4
  { at: 0.6, azimuth: 1.5, elevation: 0.05, distance: 3.5 }, // side
  { at: 0.75, azimuth: Math.PI, elevation: 0.1, distance: 3.8 }, // back
  { at: 0.9, azimuth: 0.6, elevation: 0.25, distance: 3.2 }, // 3/4 close
  { at: 1.0, azimuth: 0.35, elevation: 0.3, distance: 3.6 },
];

export default function ChronosWatch({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const parts = useMemo(() => {
    const indices = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      return scatterFrom(
        new THREE.Vector3(Math.sin(angle) * 0.82, Math.cos(angle) * 0.82, 0.06),
        new THREE.Euler(0, 0, -angle)
      );
    });

    return {
      case: scatterFrom(new THREE.Vector3(0, 0, 0), new THREE.Euler(Math.PI / 2, 0, 0)),
      dial: scatterFrom(new THREE.Vector3(0, 0, 0.09), new THREE.Euler(0, 0, 0)),
      crown: scatterFrom(new THREE.Vector3(1.05, 0, 0), new THREE.Euler(0, 0, Math.PI / 2)),
      hourHand: scatterFrom(new THREE.Vector3(0, 0, 0.12), new THREE.Euler(0, 0, -Math.PI * 0.35)),
      minuteHand: scatterFrom(new THREE.Vector3(0, 0, 0.13), new THREE.Euler(0, 0, Math.PI * 0.85)),
      strapTop: scatterFrom(new THREE.Vector3(0, 1.35, -0.02), new THREE.Euler(0, 0, 0)),
      strapBottom: scatterFrom(new THREE.Vector3(0, -1.35, -0.02), new THREE.Euler(0, 0, 0)),
      indices,
    };
  }, []);

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} intensity={2.2} color="#fff5e6" />
      <directionalLight position={[-4, -2, -3]} intensity={0.6} color="#7C6FFF" />
      <pointLight position={[0, 0, 4]} intensity={1.2} color="#E8A33D" />
      <Environment preset="studio" />

      <CameraRig progressRef={progressRef} keyframes={CAMERA_KEYFRAMES} />
      <DustField progressRef={progressRef} color="#d8d5cc" />

      <AssembledPart part={parts.case} progressRef={progressRef}>
        <mesh>
          <cylinderGeometry args={[1, 1, 0.22, 64]} />
          <meshPhysicalMaterial {...STEEL} />
        </mesh>
      </AssembledPart>

      <AssembledPart part={parts.dial} progressRef={progressRef}>
        <mesh>
          <circleGeometry args={[0.92, 64]} />
          <meshStandardMaterial {...DIAL} side={THREE.DoubleSide} />
        </mesh>
      </AssembledPart>

      <AssembledPart part={parts.crown} progressRef={progressRef}>
        <mesh>
          <cylinderGeometry args={[0.09, 0.09, 0.18, 16]} />
          <meshPhysicalMaterial {...STEEL} />
        </mesh>
      </AssembledPart>

      <AssembledPart part={parts.hourHand} progressRef={progressRef}>
        <mesh position={[0, 0.22, 0]}>
          <boxGeometry args={[0.045, 0.44, 0.02]} />
          <meshStandardMaterial {...GOLD_ACCENT} />
        </mesh>
      </AssembledPart>

      <AssembledPart part={parts.minuteHand} progressRef={progressRef}>
        <mesh position={[0, 0.32, 0]}>
          <boxGeometry args={[0.035, 0.64, 0.02]} />
          <meshStandardMaterial {...GOLD_ACCENT} />
        </mesh>
      </AssembledPart>

      <AssembledPart part={parts.strapTop} progressRef={progressRef}>
        <mesh>
          <boxGeometry args={[0.55, 1.1, 0.12]} />
          <meshStandardMaterial {...STRAP} />
        </mesh>
      </AssembledPart>

      <AssembledPart part={parts.strapBottom} progressRef={progressRef}>
        <mesh>
          <boxGeometry args={[0.55, 1.1, 0.12]} />
          <meshStandardMaterial {...STRAP} />
        </mesh>
      </AssembledPart>

      {parts.indices.map((part, i) => (
        <AssembledPart key={i} part={part} progressRef={progressRef}>
          <mesh>
            <boxGeometry args={[0.05, 0.14, 0.02]} />
            <meshStandardMaterial {...GOLD_ACCENT} />
          </mesh>
        </AssembledPart>
      ))}
    </>
  );
}
