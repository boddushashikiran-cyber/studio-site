"use client";

import { useMemo, MutableRefObject } from "react";
import { Environment } from "@react-three/drei";
import * as THREE from "three";
import { AssembledPart, scatterFrom } from "@/components/cinematic/AssembledPart";
import { DustField } from "@/components/cinematic/DustField";
import { CameraRig } from "@/components/cinematic/CameraRig";
import { CameraKeyframe } from "@/lib/cinematic/cameraPath";

/**
 * Five lost/found objects, built from primitives with warm, tactile
 * materials — distinct in mood and construction from Chronos's cold
 * steel. Structured so real foundit-*.glb assets (see
 * public/models/foundit/) can later replace any one part without
 * touching the assembly/camera logic.
 */

const METAL = { color: "#8a8a8a", metalness: 0.8, roughness: 0.35 };
const LEATHER = { color: "#3b2a1f", metalness: 0, roughness: 0.75 };
const PHONE_BODY = { color: "#1c1e22", metalness: 0.6, roughness: 0.3 };
const SCREEN = { color: "#E8A33D", emissive: "#E8A33D", emissiveIntensity: 0.6, roughness: 0.4 };
const CARD = { color: "#e8e4d8", metalness: 0, roughness: 0.6 };
const GLASS_FRAME = { color: "#2a2a2a", metalness: 0.5, roughness: 0.4 };

// Camera pushes through the scattered field toward the phone, which
// becomes the hero item — matching "one item enlarges" from the brief.
const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  { at: 0.0, azimuth: 0.4, elevation: 0.3, distance: 11 },
  { at: 0.35, azimuth: 0.15, elevation: 0.15, distance: 6.5 },
  { at: 0.6, azimuth: 0.0, elevation: 0.08, distance: 4.5 },
  { at: 0.85, azimuth: -0.1, elevation: 0.05, distance: 2.8 },
  { at: 1.0, azimuth: 0.0, elevation: 0.1, distance: 2.4 },
];

export default function FoundItObjects({
  progressRef,
}: {
  progressRef: MutableRefObject<number>;
}) {
  const parts = useMemo(
    () => ({
      key: scatterFrom(new THREE.Vector3(-2.2, 0.8, -1), new THREE.Euler(0.3, 0.4, 0)),
      wallet: scatterFrom(new THREE.Vector3(-1.4, -0.9, -0.5), new THREE.Euler(0.1, -0.3, 0.05)),
      phone: scatterFrom(new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0.15, 0)),
      idCard: scatterFrom(new THREE.Vector3(1.6, 0.6, -1.2), new THREE.Euler(0, -0.4, 0.1)),
      glasses: scatterFrom(new THREE.Vector3(1.2, -0.8, -0.8), new THREE.Euler(0.15, 0.2, 0)),
    }),
    []
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 4]} intensity={1.8} color="#fff2df" />
      <directionalLight position={[-3, -1, -2]} intensity={0.5} color="#7C6FFF" />
      <Environment preset="apartment" />

      <CameraRig progressRef={progressRef} keyframes={CAMERA_KEYFRAMES} />
      <DustField progressRef={progressRef} color="#cfc9ba" fadeOutWindow={[0.2, 0.4]} />

      {/* Key: bow + shaft + teeth, grouped as one compound object */}
      <AssembledPart part={parts.key} progressRef={progressRef}>
        <mesh position={[0, 0.35, 0]}>
          <torusGeometry args={[0.16, 0.045, 12, 24]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.06, 0.5, 0.03]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
        <mesh position={[0.08, -0.24, 0]}>
          <boxGeometry args={[0.1, 0.06, 0.03]} />
          <meshStandardMaterial {...METAL} />
        </mesh>
      </AssembledPart>

      {/* Wallet */}
      <AssembledPart part={parts.wallet} progressRef={progressRef}>
        <mesh>
          <boxGeometry args={[0.75, 0.55, 0.12]} />
          <meshStandardMaterial {...LEATHER} />
        </mesh>
        <mesh position={[0, 0, 0.065]}>
          <boxGeometry args={[0.6, 0.08, 0.01]} />
          <meshStandardMaterial color="#5a4530" metalness={0} roughness={0.7} />
        </mesh>
      </AssembledPart>

      {/* Phone: the hero object */}
      <AssembledPart part={parts.phone} progressRef={progressRef}>
        <mesh>
          <boxGeometry args={[0.55, 1.15, 0.07]} />
          <meshStandardMaterial {...PHONE_BODY} />
        </mesh>
        <mesh position={[0, 0, 0.04]}>
          <planeGeometry args={[0.48, 1.02]} />
          <meshStandardMaterial {...SCREEN} />
        </mesh>
      </AssembledPart>

      {/* ID card */}
      <AssembledPart part={parts.idCard} progressRef={progressRef}>
        <mesh>
          <boxGeometry args={[0.7, 0.44, 0.02]} />
          <meshStandardMaterial {...CARD} />
        </mesh>
        <mesh position={[-0.22, 0.05, 0.012]}>
          <circleGeometry args={[0.1, 24]} />
          <meshStandardMaterial color="#9a8f7a" roughness={0.6} />
        </mesh>
      </AssembledPart>

      {/* Glasses: two lenses + bridge + arms */}
      <AssembledPart part={parts.glasses} progressRef={progressRef}>
        <mesh position={[-0.22, 0, 0]}>
          <torusGeometry args={[0.16, 0.02, 8, 24]} />
          <meshStandardMaterial {...GLASS_FRAME} />
        </mesh>
        <mesh position={[0.22, 0, 0]}>
          <torusGeometry args={[0.16, 0.02, 8, 24]} />
          <meshStandardMaterial {...GLASS_FRAME} />
        </mesh>
        <mesh>
          <boxGeometry args={[0.1, 0.02, 0.02]} />
          <meshStandardMaterial {...GLASS_FRAME} />
        </mesh>
        <mesh position={[-0.42, 0, -0.15]} rotation={[0, 0.9, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshStandardMaterial {...GLASS_FRAME} />
        </mesh>
        <mesh position={[0.42, 0, -0.15]} rotation={[0, -0.9, 0]}>
          <boxGeometry args={[0.3, 0.02, 0.02]} />
          <meshStandardMaterial {...GLASS_FRAME} />
        </mesh>
      </AssembledPart>
    </>
  );
}
