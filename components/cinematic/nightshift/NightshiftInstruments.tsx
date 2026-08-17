"use client";

import { useMemo, MutableRefObject } from "react";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { AssembledPart, ScatterPart } from "@/components/cinematic/AssembledPart";
import { DustField } from "@/components/cinematic/DustField";
import { CameraRig } from "@/components/cinematic/CameraRig";
import { CameraKeyframe } from "@/lib/cinematic/cameraPath";

/**
 * Three instruments — guitar, keyboard, microphone — built from
 * primitives with warm stage-lit materials, distinct from both
 * Chronos's cold steel and FoundIt's neutral tones. Unlike the other
 * two scenes, entry directions are deliberate rather than
 * omnidirectional scatter (guitar from the left, keyboard rising from
 * below, mic descending from above), matching the brief's staggered
 * "instruments appear from different directions" choreography.
 * Structured so real guitar.glb / keyboard.glb / microphone.glb assets
 * (see public/models/nightshift/) can later replace any part.
 */

const WOOD = { color: "#6b4226", metalness: 0, roughness: 0.6 };
const WOOD_DARK = { color: "#2a1a10", metalness: 0, roughness: 0.5 };
const KEY_WHITE = { color: "#eee8db", metalness: 0, roughness: 0.4 };
const KEY_BLACK = { color: "#151515", metalness: 0, roughness: 0.35 };
const CHROME = { color: "#d4d4d4", metalness: 1, roughness: 0.2 };

// Camera settles on an overview of the composition, then pushes in
// close on the microphone — the "one instrument becomes hero" beat.
const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { at: 0.0, azimuth: 0.2, elevation: 0.35, distance: 13 },
  { at: 0.35, azimuth: 0.1, elevation: 0.2, distance: 8 },
  { at: 0.6, azimuth: 0.0, elevation: 0.12, distance: 6 },
  { at: 0.85, azimuth: 0.3, elevation: 0.08, distance: 3 },
  { at: 1.0, azimuth: 0.35, elevation: 0.1, distance: 2.4 },
];

const guitarPart: ScatterPart = {
  scatterPos: new THREE.Vector3(-9, 0.6, -1.5),
  scatterRot: new THREE.Euler(0.1, 1.2, -0.2),
  finalPos: new THREE.Vector3(-1.6, -0.3, 0),
  finalRot: new THREE.Euler(0, 0.35, 0.08),
};

const keyboardPart: ScatterPart = {
  scatterPos: new THREE.Vector3(0, -7, -1),
  scatterRot: new THREE.Euler(-0.3, 0, 0),
  finalPos: new THREE.Vector3(0, -1.3, 0.9),
  finalRot: new THREE.Euler(-0.18, 0, 0),
};

const micPart: ScatterPart = {
  scatterPos: new THREE.Vector3(1, 5, 2),
  scatterRot: new THREE.Euler(0.4, 0, 0.3),
  finalPos: new THREE.Vector3(1.7, 0.4, 0.4),
  finalRot: new THREE.Euler(0, 0, 0),
};

export default function NightshiftInstruments({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const keys = useMemo(
    () =>
      Array.from({ length: 14 }, (_, i) => ({
        x: -1.3 + i * 0.2,
        black: i % 7 === 2 || i % 7 === 4 || i % 7 === 6,
      })),
    []
  );

  return (
    <>
      <ambientLight intensity={0.35} />
      <spotLight
        position={[2, 6, 4]}
        angle={0.5}
        penumbra={0.6}
        intensity={3}
        color="#E8A33D"
      />
      <directionalLight position={[-4, 2, -3]} intensity={0.5} color="#7C6FFF" />
      <Environment preset="night" />

      <CameraRig progressRef={progressRef} keyframes={CAMERA_KEYFRAMES} target={[0.4, -0.2, 0.2]} />
      <DustField progressRef={progressRef} color="#b8a98f" fadeOutWindow={[0.25, 0.45]} count={180} />

      {/* Guitar: body + neck + headstock */}
      <AssembledPart part={guitarPart} progressRef={progressRef} windowEnd={0.38}>
        <mesh scale={[1.3, 1.6, 0.32]}>
          <cylinderGeometry args={[1, 1, 0.5, 32]} />
          <meshStandardMaterial {...WOOD} />
        </mesh>
        <mesh position={[0, 1.9, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[2.2, 0.16, 0.12]} />
          <meshStandardMaterial {...WOOD_DARK} />
        </mesh>
        <mesh position={[0, 3.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[0.4, 0.3, 0.14]} />
          <meshStandardMaterial {...WOOD_DARK} />
        </mesh>
      </AssembledPart>

      {/* Keyboard: body + individual keys */}
      <AssembledPart part={keyboardPart} progressRef={progressRef} windowEnd={0.4}>
        <mesh position={[0, -0.08, -0.15]}>
          <boxGeometry args={[3.2, 0.18, 0.7]} />
          <meshStandardMaterial {...WOOD_DARK} />
        </mesh>
        {keys.map((k, i) => (
          <mesh key={i} position={[k.x, 0.02, k.black ? -0.15 : 0.05]}>
            <boxGeometry args={[0.17, 0.05, k.black ? 0.3 : 0.55]} />
            <meshStandardMaterial {...(k.black ? KEY_BLACK : KEY_WHITE)} />
          </mesh>
        ))}
      </AssembledPart>

      {/* Microphone: the hero object */}
      <AssembledPart part={micPart} progressRef={progressRef} windowEnd={0.35}>
        <mesh position={[0, 0.35, 0]}>
          <sphereGeometry args={[0.16, 24, 24]} />
          <meshStandardMaterial {...CHROME} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.5, 16]} />
          <meshStandardMaterial {...CHROME} />
        </mesh>
      </AssembledPart>
    </>
  );
}
