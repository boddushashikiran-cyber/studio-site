"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Text3D, Float } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

/* ---------------------------------------------------------
   The 3D object: an extruded "KIRAN STUDIOS" wordmark that
   eases its rotation toward the cursor position, wrapped in
   a slow ambient float. Lives inside the bracketed "viewport"
   frame — the hero's signature element.
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
            height={0.18}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.015}
            bevelSegments={4}
          >
            KIRAN
            <meshStandardMaterial
              color="#E8A33D"
              emissive="#E8A33D"
              emissiveIntensity={0.2}
              roughness={0.3}
              metalness={0.5}
            />
          </Text3D>
        </Center>

        <Center bottom position={[0, -0.35, 0]}>
          <Text3D
            font="/fonts/helvetiker_bold.typeface.json"
            size={0.32}
            height={0.12}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.015}
            bevelSize={0.01}
            bevelSegments={4}
            letterSpacing={0.04}
          >
            STUDIOS
            <meshStandardMaterial
              color="#7C6FFF"
              emissive="#7C6FFF"
              emissiveIntensity={0.15}
              roughness={0.35}
              metalness={0.5}
            />
          </Text3D>
        </Center>
      </group>
    </Float>
  );
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#E8A33D" />
      <pointLight position={[-4, -2, -3]} intensity={25} color="#7C6FFF" />
    </>
  );
}

/* ---------------------------------------------------------
   Viewport chrome: corner ticks + live mono coordinate
   readout, framed like a render-viewport UI a studio
   would actually use.
--------------------------------------------------------- */
function ViewportFrame({ children }: { children: React.ReactNode }) {
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
    <section className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center gap-12 px-6 pt-24 lg:flex-row lg:items-center lg:gap-8 lg:px-12">
      <div className="lg:w-[58%]">
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

      <div className="lg:w-[42%]">
        <ViewportFrame>
          <Canvas camera={{ position: [0, 0, 6], fov: 40 }} dpr={[1, 1.5]}>
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
