"use client";

import { useRef, useEffect, useLayoutEffect, useMemo, useState } from "react";
import type { MutableRefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   CINEMATIC HERO — "KIRAN STUDIOS" TITLE REVEAL

   Sequence: black screen -> ambient dust -> light sweep ->
   particles converge into the KIRAN silhouette -> dissolve
   into crisp chrome typography (the "impact") -> STUDIOS
   settles in below -> tagline/CTA appear -> hero becomes a
   normal, interactive, scrollable section.

   Colors reuse the site's existing tokens only (amber/violet/
   ink/bone) so this mingles with the rest of the site rather
   than introducing a new palette.

   Respects prefers-reduced-motion: skips the whole sequence
   and renders the settled, static final state immediately,
   with no WebGL canvas mounted at all.
========================================================= */

const AMBER = "#E8A33D";
const VIOLET = "#7C6FFF";
const BONE = "#ECEAE4";

/* ---------- pure helpers (no DOM access — safe at module scope) ---------- */

function generateScatterPositions(count: number): Float32Array {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const radius = 3.2 + Math.random() * 4.5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.55;
    positions[i * 3 + 2] = radius * Math.cos(phi) * 0.8 - 1.5;
  }
  return positions;
}

function generateRandoms(count: number): Float32Array {
  const arr = new Float32Array(count);
  for (let i = 0; i < count; i++) arr[i] = Math.random();
  return arr;
}

// Runs ONLY from inside a useEffect (client-only) — never at render time,
// since it touches `document` and would break server-side rendering.
function sampleTextTargets(
  text: string,
  targetCount: number,
  canvasWidth: number,
  canvasHeight: number,
  fontPx: number
): Float32Array {
  const positions = new Float32Array(targetCount * 3);
  const canvas = document.createElement("canvas");
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return positions;

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.fillStyle = "#fff";
  ctx.font = `700 ${fontPx}px "Space Grotesk", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

  const { data } = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
  const candidates: number[] = [];
  const step = 3;
  for (let y = 0; y < canvasHeight; y += step) {
    for (let x = 0; x < canvasWidth; x += step) {
      const idx = (y * canvasWidth + x) * 4;
      if (data[idx] > 128) candidates.push(x, y);
    }
  }

  const pairCount = candidates.length / 2;
  if (pairCount === 0) return positions;

  const scale = 1 / 150;
  for (let i = 0; i < targetCount; i++) {
    const candidateIndex = ((i * 97) % pairCount) * 2;
    const px = candidates[candidateIndex] ?? canvasWidth / 2;
    const py = candidates[candidateIndex + 1] ?? canvasHeight / 2;
    positions[i * 3] = (px - canvasWidth / 2) * scale;
    positions[i * 3 + 1] = -(py - canvasHeight / 2) * scale + 0.3;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 0.5;
  }
  return positions;
}

/* ---------- shared animation state, read every frame inside Canvas ---------- */

type HeroMotionState = {
  progress: number; // 0 = scattered dust, 1 = fully converged into letterforms
  dissolve: number; // 0 = particles visible, 1 = fully dissolved (crisp text takes over)
  lightX: number; // x-position of the implied light sweep
  cameraZ: number;
  pointerX: number;
  pointerY: number;
};

function createTitleField(particleCount: number) {
  const geometry = new THREE.BufferGeometry();
  const start = generateScatterPositions(particleCount);
  const target = new Float32Array(start); // placeholder until real sampling runs client-side
  const randoms = generateRandoms(particleCount);

  geometry.setAttribute("position", new THREE.BufferAttribute(start.slice(), 3));
  geometry.setAttribute("aStart", new THREE.BufferAttribute(start, 3));
  geometry.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uProgress: { value: 0 },
      uDissolve: { value: 0 },
      uTime: { value: 0 },
      uSize: { value: 5.5 },
      uPixelRatio: { value: 1 },
      uLightX: { value: -8 },
      uColorA: { value: new THREE.Color(AMBER) },
      uColorB: { value: new THREE.Color(VIOLET) },
    },
    vertexShader: `
      uniform float uProgress;
      uniform float uTime;
      uniform float uSize;
      uniform float uPixelRatio;
      uniform float uLightX;
      attribute vec3 aStart;
      attribute vec3 aTarget;
      attribute float aRandom;
      varying float vRandom;
      varying float vLightFactor;

      void main() {
        vRandom = aRandom;

        float delay = aRandom * 0.5;
        float p = clamp((uProgress - delay) / max(0.0001, 1.0 - delay), 0.0, 1.0);
        p = p * p * (3.0 - 2.0 * p);

        vec3 pos = mix(aStart, aTarget, p);

        float wander = (1.0 - p) * 0.5;
        pos.x += sin(uTime * 0.5 + aRandom * 12.0) * wander;
        pos.y += cos(uTime * 0.4 + aRandom * 10.0) * wander * 0.8;
        pos.z += sin(uTime * 0.35 + aRandom * 9.0) * wander;

        vLightFactor = smoothstep(3.0, 0.0, abs(pos.x - uLightX));

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = uSize * uPixelRatio * (280.0 / -mvPosition.z) * (0.55 + 0.6 * aRandom);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform vec3 uColorA;
      uniform vec3 uColorB;
      uniform float uProgress;
      uniform float uDissolve;
      varying float vRandom;
      varying float vLightFactor;

      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d);

        vec3 color = mix(uColorB, uColorA, vRandom);
        color += vLightFactor * 0.9;

        float baseAlpha = (0.22 + 0.75 * uProgress) * (1.0 - uDissolve);
        gl_FragColor = vec4(color, alpha * baseAlpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return { geometry, material };
}

function createDustField(count: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 15;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    randoms[i] = Math.random();
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

  const material = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uPixelRatio: { value: 1 } },
    vertexShader: `
      uniform float uTime;
      uniform float uPixelRatio;
      attribute float aRandom;
      varying float vRandom;
      void main() {
        vRandom = aRandom;
        vec3 pos = position;
        pos.x += sin(uTime * 0.15 + aRandom * 20.0) * 0.5;
        pos.y += cos(uTime * 0.12 + aRandom * 18.0) * 0.35;
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = (1.4 + aRandom * 1.6) * uPixelRatio * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying float vRandom;
      void main() {
        vec2 uv = gl_PointCoord - 0.5;
        float d = length(uv);
        if (d > 0.5) discard;
        float alpha = smoothstep(0.5, 0.0, d) * (0.12 + vRandom * 0.22);
        gl_FragColor = vec4(0.92, 0.91, 0.89, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return { geometry, material };
}

/* ---------- runs inside <Canvas>: the only place useFrame/useThree are valid ---------- */

function SceneRig({
  titleMaterial,
  dustMaterial,
  motionRef,
}: {
  titleMaterial: THREE.ShaderMaterial;
  dustMaterial: THREE.ShaderMaterial;
  motionRef: React.MutableRefObject<HeroMotionState>;
}) {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const m = motionRef.current;

    titleMaterial.uniforms.uProgress.value = m.progress;
    titleMaterial.uniforms.uDissolve.value = m.dissolve;
    titleMaterial.uniforms.uTime.value = t;
    titleMaterial.uniforms.uLightX.value = m.lightX;
    dustMaterial.uniforms.uTime.value = t;

    camera.position.z = m.cameraZ;
    camera.position.x += (m.pointerX * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (m.pointerY * 0.25 - camera.position.y) * 0.03;
    camera.lookAt(0, 0.3, 0);
  });

  return null;
}

const PARTICLE_COUNT_DESKTOP = 2400;
const PARTICLE_COUNT_MOBILE = 800;
const DUST_COUNT_DESKTOP = 260;
const DUST_COUNT_MOBILE = 90;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const kiranRef = useRef<HTMLSpanElement>(null);
  const studiosLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [settled, setSettled] = useState(false);
  const settledRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const motionRef = useRef<HeroMotionState>({
    progress: 0,
    dissolve: 0,
    lightX: -8,
    cameraZ: 9,
    pointerX: 0,
    pointerY: 0,
  });

  // Decide reduced-motion + viewport size before first paint, so users who
  // prefer reduced motion never see even a flash of the intro sequence.
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReducedMotion(prefersReduced);
    setIsDesktop(window.innerWidth >= 1024);
    if (prefersReduced) setSettled(true);
  }, []);

  const particleCount = isDesktop ? PARTICLE_COUNT_DESKTOP : PARTICLE_COUNT_MOBILE;
  const dustCount = isDesktop ? DUST_COUNT_DESKTOP : DUST_COUNT_MOBILE;

  const { titleField, dustField } = useMemo(() => {
    if (reducedMotion) return { titleField: null, dustField: null };
    return {
      titleField: createTitleField(particleCount),
      dustField: createDustField(dustCount),
    };
  }, [reducedMotion, particleCount, dustCount]);

  // The cinematic timeline itself — only runs when motion is allowed and
  // the particle field actually exists.
  useEffect(() => {
    if (reducedMotion || !titleField) return;

    titleField.material.uniforms.uPixelRatio.value = Math.min(
      window.devicePixelRatio || 1,
      2
    );
    if (dustField) {
      dustField.material.uniforms.uPixelRatio.value = Math.min(
        window.devicePixelRatio || 1,
        2
      );
    }

    let cancelled = false;

    (async () => {
      try {
        await document.fonts?.ready;
      } catch {
        /* proceed regardless — a fallback font shape is fine here */
      }
      if (cancelled) return;

      const sampled = sampleTextTargets(
        "KIRAN",
        particleCount,
        isDesktop ? 1400 : 900,
        isDesktop ? 460 : 340,
        isDesktop ? 300 : 190
      );
      const targetAttr = titleField.geometry.getAttribute(
        "aTarget"
      ) as THREE.BufferAttribute;
      targetAttr.array.set(sampled);
      targetAttr.needsUpdate = true;

      runTimeline();
    })();

    function runTimeline() {
      const m = motionRef.current;
      const tl = gsap.timeline();

      // Phase 1-2: near-silence, only ambient dust visible (already drifting).
      tl.to({}, { duration: 0.9 });

      // Phase 3: the light sweep passes through the darkness.
      tl.to(
        m,
        { lightX: 8, duration: 2.0, ease: "power1.inOut" },
        0.7
      );

      // Phase 4-5: particles converge into the KIRAN silhouette while the
      // camera slowly pulls back to reveal scale.
      tl.to(
        m,
        { progress: 1, duration: 2.1, ease: "power2.inOut" },
        1.3
      );
      tl.to(
        m,
        { cameraZ: 6.2, duration: 2.6, ease: "power2.out" },
        1.2
      );

      // Impact: particles dissolve as the crisp chrome typography takes over.
      tl.to(m, { dissolve: 1, duration: 0.7, ease: "power1.in" }, 3.5);
      tl.to(
        kiranRef.current,
        { opacity: 1, duration: 0.5, ease: "power2.out" },
        3.55
      );
      if (kiranRef.current) {
        tl.fromTo(
          kiranRef.current,
          { backgroundPosition: "100% 0%" },
          { backgroundPosition: "0% 0%", duration: 1.1, ease: "power2.inOut" },
          3.6
        );
        tl.fromTo(
          kiranRef.current,
          { scale: 0.96 },
          { scale: 1, duration: 0.5, ease: "back.out(1.6)" },
          3.55
        );
      }

      // STUDIOS settles in below, restrained letter-by-letter.
      const letters = studiosLettersRef.current.filter(Boolean);
      tl.to(
        letters,
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: "power2.out" },
        4.3
      );

      // Calm: tagline, CTA, scroll hint settle in — the hero becomes a
      // normal, interactive section from here on.
      tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6 }, 4.9)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, 5.05)
        .to(scrollHintRef.current, { opacity: 1, duration: 0.6 }, 5.3)
        .to(m, { cameraZ: 6.5, duration: 1.2, ease: "power1.out" }, 4.6)
        .call(() => setSettled(true), [], 5.6);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, titleField, dustField, particleCount, isDesktop]);

  useEffect(() => {
    settledRef.current = settled;
  }, [settled]);

  // Post-intro: subtle pointer parallax + scroll-linked continuation.
  useEffect(() => {
    if (reducedMotion) return;

    function handlePointerMove(e: PointerEvent) {
      if (!settledRef.current) return;
      motionRef.current.pointerX = (e.clientX / window.innerWidth - 0.5) * 2;
      motionRef.current.pointerY = (e.clientY / window.innerHeight - 0.5) * 2;
    }
    window.addEventListener("pointermove", handlePointerMove);

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    scrollTl.to(
      motionRef.current,
      { cameraZ: 8.5, ease: "none" },
      0
    );
    scrollTl.to(
      [kiranRef.current, taglineRef.current, ctaRef.current],
      { opacity: 0.15, yPercent: -12, ease: "none" },
      0
    );

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      scrollTl.scrollTrigger?.kill();
      scrollTl.kill();
    };
  }, [reducedMotion]);

  if (reducedMotion === null) {
    // Briefly unknown on first render before useLayoutEffect resolves —
    // render nothing rather than guess, avoiding a flash of the wrong state.
    return <section ref={sectionRef} className="relative min-h-screen bg-ink" />;
  }

  const wrapperClass = settled
    ? "relative z-0 flex h-full flex-col items-center justify-center px-6"
    : "fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink px-6";

  return (
    <section ref={sectionRef} className="relative min-h-screen bg-ink">
      <div className={wrapperClass}>
        {!reducedMotion && titleField && dustField && (
          <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 9], fov: 38 }} dpr={[1, 2]}>
              <points geometry={dustField.geometry} material={dustField.material} />
              <points geometry={titleField.geometry} material={titleField.material} />
              <SceneRig
                titleMaterial={titleField.material}
                dustMaterial={dustField.material}
                motionRef={motionRef}
              />
            </Canvas>
          </div>
        )}

        <div className="relative z-10 flex flex-col items-center text-center">
          <span
            ref={kiranRef}
            style={{
              opacity: reducedMotion ? 1 : 0,
              backgroundImage: `linear-gradient(120deg, #5a4726 15%, ${AMBER} 35%, #fbe6bc 50%, ${AMBER} 65%, #5a4726 85%)`,
              backgroundSize: "250% 100%",
              backgroundPosition: reducedMotion ? "0% 0%" : "100% 0%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              filter: `drop-shadow(0 0 44px rgba(232,163,61,0.35))`,
            }}
            className="font-display text-[20vw] leading-[0.9] tracking-tightest sm:text-[15vw] lg:text-[9vw]"
          >
            KIRAN
          </span>

          <span className="mt-2 flex gap-[0.35em] sm:mt-4">
            {"STUDIOS".split("").map((letter, i) => (
              <span
                key={i}
                ref={(el) => {
                  studiosLettersRef.current[i] = el;
                }}
                style={{
                  opacity: reducedMotion ? 1 : 0,
                  transform: reducedMotion ? "none" : "translateY(10px)",
                  color: BONE,
                  textShadow: `0 0 28px rgba(124,111,255,0.35)`,
                }}
                className="font-display text-base tracking-[0.3em] sm:text-xl lg:text-2xl"
              >
                {letter}
              </span>
            ))}
          </span>

          <p
            ref={taglineRef}
            style={{ opacity: reducedMotion ? 1 : 0, transform: reducedMotion ? "none" : "translateY(16px)" }}
            className="mt-8 max-w-md font-body text-base text-boneDim sm:text-lg"
          >
            We design digital experiences that move people — a small studio
            building interactive, 3D-driven products for brands who want
            their site to feel like software, not a brochure.
          </p>

          <div
            ref={ctaRef}
            style={{ opacity: reducedMotion ? 1 : 0, transform: reducedMotion ? "none" : "translateY(16px)" }}
            className="mt-10"
          >
            <MagneticButton
              href="/booking"
              className="inline-flex items-center gap-3 border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink"
            >
              BOOK A FREE CONSULTATION
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </MagneticButton>
          </div>
        </div>

        <div
          ref={scrollHintRef}
          style={{ opacity: reducedMotion ? 1 : 0 }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
        >
          <span className="font-mono text-[10px] tracking-widemono text-boneDim">
            SCROLL
          </span>
          <span className="h-8 w-px bg-line" />
        </div>
      </div>

    </section>
  );
}
