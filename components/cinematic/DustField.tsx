"use client";

import { useMemo, MutableRefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { windowProgress } from "@/lib/cinematic/math";

export function DustField({
  progressRef,
  color = "#ECEAE4",
  count = 220,
  fadeOutWindow = [0.15, 0.35] as [number, number],
  spread = { x: 8, y: 5, z: 6 },
}: {
  progressRef: MutableRefObject<number>;
  color?: string;
  count?: number;
  fadeOutWindow?: [number, number];
  spread?: { x: number; y: number; z: number };
}) {
  const { geometry, material } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread.x;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread.y;
      positions[i * 3 + 2] = (Math.random() - 0.5) * spread.z;
      randoms[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    const c = new THREE.Color(color);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 1 },
        uPixelRatio: { value: 1 },
        uColor: { value: c },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        attribute float aRandom;
        varying float vRandom;
        void main() {
          vRandom = aRandom;
          vec3 pos = position;
          pos.x += sin(uTime * 0.2 + aRandom * 20.0) * 0.3;
          pos.y += cos(uTime * 0.18 + aRandom * 15.0) * 0.25;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = (1.5 + aRandom * 1.5) * uPixelRatio * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform float uOpacity;
        uniform vec3 uColor;
        varying float vRandom;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.0, d) * (0.2 + vRandom * 0.3) * uOpacity;
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, color]);

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uOpacity.value =
      1 - windowProgress(progressRef.current, fadeOutWindow[0], fadeOutWindow[1]);
  });

  return <points geometry={geometry} material={material} />;
}
