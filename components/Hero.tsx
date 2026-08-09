"use client";

import { useRef, useState, useMemo, useEffect, Suspense } from "react";
import type { ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Text3D, Float, Environment, ContactShadows } from "@react-three/drei";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import * as THREE from "three";

/* ---------------------------------------------------------
   The 3D object: an extruded "KIRAN STUDIOS" wordmark that
   eases its rotation toward the cursor position, wrapped in
   a slow ambient float. Physical material + environment
   lighting give it real reflections instead of flat shading.
--------------------------------------------------------- */
function Logo3D() {
  const groupRef = useRef<THREE.Group>(null);
  const target = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    target.current.x = state.pointer.y * 0.35;
    target.current.y = state.pointer.x * 0.5;

    if (groupRef.current) {
      groupRef.current.rotation.x +=
        (target.current.x - groupRef.current.rotation.x) * 0.04;
      groupRef.current.rotation.y +=
        (target.current.y - groupRef.current.rotation.y) * 0.04;
    }
  });

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.5}>
      <group ref={groupRef}>
        <Center top position={[0, 0.35, 0]}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.62}
            height={0.2}
            curveSegments={24}
            bevelEnabled
            bevelThickness={0.025}
            bevelSize={0.018}
            bevelSegments={8}
            castShadow
          >
            KIRAN
            <meshPhysicalMaterial
              color="#E8A33D"
              emissive="#E8A33D"
              emissiveIntensity={0.08}
              roughness={0.22}
              metalness={0.85}
              clearcoat={1}
              clearcoatRoughness={0.1}
              reflectivity={1}
              envMapIntensity={1.4}
            />
          </Text3D>
        </Center>

        <Center bottom position={[0, -0.35, 0]}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.32}
            height={0.14}
            curveSegments={24}
            bevelEnabled
            bevelThickness={0.018}
            bevelSize={0.012}
            bevelSegments={8}
            letterSpacing={0.04}
            castShadow
          >
            STUDIOS
            <meshPhysicalMaterial
              color="#7C6FFF"
              emissive="#7C6FFF"
              emissiveIntensity={0.06}
              roughness={0.28}
              metalness={0.8}
              clearcoat={1}
              clearcoatRoughness={0.15}
              reflectivity={1}
              envMapIntensity={1.2}
            />
          </Text3D>
        </Center>
      </group>

      {/* soft contact shadow beneath the wordmark for grounding */}
      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.45}
        scale={6}
        blur={2.4}
        far={2}
        color="#050505"
      />
    </Float>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 4, 4]} intensity={35} color="#E8A33D" castShadow />
      <pointLight position={[-4, -2, -3]} intensity={22} color="#7C6FFF" />
      <spotLight
        position={[0, 5, 3]}
        angle={0.4}
        penumbra={1}
        intensity={18}
        color="#ffffff"
      />
      {/* environment map drives the realistic reflections on the clearcoat material */}
      <Environment preset="city" environmentIntensity={0.6} />
    </>
  );
}

/* ---------------------------------------------------------
   Ambient background: soft glowing color blobs. They drift on
   their own slow loop, and translate opposite to the cursor —
   as the 3D logo turns toward the pointer, these drift away
   from it, giving the scene a layered, parallax depth cue.
--------------------------------------------------------- */
type OrbConfig = {
  color: string;
  size: number;
  top: string;
  left: string;
  parallax: number;
  drift: { x: number[]; y: number[] };
  duration: number;
};

function Orb({
  config,
  springX,
  springY,
  reduceMotion,
}: {
  config: OrbConfig;
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
  reduceMotion: boolean;
}) {
  const x = useTransform(springX, (v) => v * config.parallax);
  const y = useTransform(springY, (v) => v * config.parallax);

  return (
    <motion.div
      className="absolute rounded-full mix-blend-screen"
      style={{
        top: config.top,
        left: config.left,
        width: config.size,
        height: config.size,
        x: reduceMotion ? 0 : x,
        y: reduceMotion ? 0 : y,
      }}
    >
      <motion.div
        className="h-full w-full rounded-full blur-[90px]"
        style={{
          background: `radial-gradient(circle at 35% 35%, ${config.color}55, ${config.color}00 70%)`,
        }}
        animate={
          reduceMotion
            ? undefined
            : { x: config.drift.x, y: config.drift.y, opacity: [0.55, 0.85, 0.6, 0.55] }
        }
        transition={{
          duration: config.duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

function AmbientOrbs() {
  const prefersReducedMotion = useReducedMotion();
  const reduceMotion = Boolean(prefersReducedMotion);

  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { stiffness: 40, damping: 20, mass: 0.6 });
  const springY = useSpring(mvY, { stiffness: 40, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (reduceMotion) return;

    const handlePointerMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mvX.set(nx);
      mvY.set(ny);
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [reduceMotion, mvX, mvY]);

  const orbs: OrbConfig[] = [
    {
      color: "#E8A33D",
      size: 480,
      top: "8%",
      left: "58%",
      parallax: -70,
      drift: { x: [0, 24, -10, 0], y: [0, -18, 14, 0] },
      duration: 22,
    },
    {
      color: "#7C6FFF",
      size: 420,
      top: "48%",
      left: "6%",
      parallax: -50,
      drift: { x: [0, -20, 16, 0], y: [0, 20, -12, 0] },
      duration: 26,
    },
    {
      color: "#E8A33D",
      size: 260,
      top: "70%",
      left: "44%",
      parallax: -35,
      drift: { x: [0, 14, -18, 0], y: [0, -10, 16, 0] },
      duration: 18,
    },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {orbs.map((orb, i) => (
        <Orb key={i} config={orb} springX={springX} springY={springY} reduceMotion={reduceMotion} />
      ))}
    </div>
  );
}

/* ---------------------------------------------------------
   Viewport chrome: corner ticks + live mono coordinate
   readout, framed like a render-viewport UI a studio
   would actually use.
--------------------------------------------------------- */
function ViewportFrame({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  return (
    <div
      className="relative aspect-square w-full max-w-[520px] border border-line"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (((e.clientX - rect.left) / rect.width) * 2 - 1).toFixed(2);
        const y = (((e.clientY - rect.top) / rect.height) * 2 - 1).toFixed(2);
        setCoords({ x: Number(x), y: Number(y) });
      }}
    >
      {/* corner ticks */}
      {["-top-px -left-px", "-top-px -right-px border-l-0", "-bottom-px -left-px border-t-0", "-bottom-px -right-px border-t-0 border-l-0"].map(
        (pos, i) => (
          <span
            key={i}
            className={`absolute h-3 w-3 border border-amber ${pos}`}
            aria-hidden
          />
        )
      )}

      <span className="absolute left-3 top-3 font-mono text-[10px] tracking-widemono text-boneDim">
        VIEW_01 / RENDER
      </span>
      <span className="absolute right-3 top-3 font-mono text-[10px] tracking-widemono text-boneDim">
        LIVE
      </span>
      <span className="absolute bottom-3 left-3 font-mono text-[10px] tracking-widemono text-boneDim">
        X {coords.x.toFixed(2)} · Y {coords.y.toFixed(2)}
      </span>
      <span className="absolute bottom-3 right-3 font-mono text-[10px] tracking-widemono text-amber">
        KIRAN.STUDIOS
      </span>

      {children}
    </div>
  );
}

/* ---------------------------------------------------------
   Headline: word-by-word reveal on load.
--------------------------------------------------------- */
function KineticHeadline() {
  const words = useMemo(
    () => "We design digital experiences that move people".split(" "),
    []
  );

  return (
    <h1 className="font-display text-[13vw] leading-[0.95] tracking-tightest text-bone sm:text-[7vw] lg:text-[4.6vw]">
      {words.map((word, i) => (
        <span key={i} className="mr-[0.25em] inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            initial={{ y: "110%" }}
            animate={{ y: "0%" }}
            transition={{
              duration: 0.8,
              delay: 0.15 + i * 0.06,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

export default function Hero() {
  return (
    <section className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center gap-12 overflow-hidden px-6 pt-24 lg:flex-row lg:items-center lg:gap-8 lg:px-12">
      <AmbientOrbs />

      <div className="relative lg:w-[58%]">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-block font-mono text-xs tracking-widemono text-amber"
        >
          KIRAN STUDIOS — DESIGN &amp; DEVELOPMENT
        </motion.span>

        <KineticHeadline />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.75 }}
          className="mt-8 max-w-md font-body text-base text-boneDim sm:text-lg"
        >
          A small studio building interactive, 3D-driven products for
          brands who want their site to feel like software, not a
          brochure.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
          className="mt-10"
        >
          <a
            href="/booking"
            className="inline-flex items-center gap-3 border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink"
          >
            BOOK A FREE CONSULTATION
            <span aria-hidden>&rarr;</span>
          </a>
        </motion.div>
      </div>

      <div className="relative lg:w-[42%]">
        <ViewportFrame>
          <Canvas
            camera={{ position: [0, 0, 6], fov: 40 }}
            dpr={[1, 2]}
            shadows
            gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          >
            <Lights />
            <Suspense fallback={null}>
              <Logo3D />
            </Suspense>
          </Canvas>
        </ViewportFrame>
      </div>
    </section>
  );
}
