"use client";

import { useRef, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, Text3D, Float } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

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
  const coordRef = useRef<HTMLSpanElement>(null);

  return (
    <div
      className="relative aspect-square w-full max-w-[520px] border border-line"
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (((e.clientX - rect.left) / rect.width) * 2 - 1).toFixed(2);
        const y = (((e.clientY - rect.top) / rect.height) * 2 - 1).toFixed(2);
        if (coordRef.current) {
          coordRef.current.textContent = `X ${x} · Y ${y}`;
        }
      }}
    >
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
      <span
        ref={coordRef}
        className="absolute bottom-3 left-3 font-mono text-[10px] tracking-widemono text-boneDim"
      >
        X 0.00 · Y 0.00
      </span>
      <span className="absolute bottom-3 right-3 font-mono text-[10px] tracking-widemono text-amber">
        KIRAN.STUDIOS
      </span>

      {children}
    </div>
  );
}

const HEADLINE_LINES = ["We design digital", "experiences that", "move people"];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const paraRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const animatable = [
      eyebrowRef.current,
      ...lineRefs.current,
      paraRef.current,
      ctaRef.current,
      viewportRef.current,
    ].filter(Boolean);

    if (reducedMotion) {
      // Skip the choreography entirely — just show the final state.
      gsap.set(animatable, { clearProps: "all" });
      return;
    }

    // Cinematic entrance: headline lines slide up from behind a mask,
    // the viewport frame opens like a camera aperture via clip-path.
    gsap.set(lineRefs.current, { yPercent: 110 });
    gsap.set([eyebrowRef.current, paraRef.current, ctaRef.current], {
      opacity: 0,
      y: 16,
    });
    gsap.set(viewportRef.current, {
      clipPath: "inset(42% 42% 42% 42%)",
      opacity: 0,
    });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.5 }, 0.05)
      .to(
        lineRefs.current,
        { yPercent: 0, duration: 0.9, stagger: 0.12 },
        0.15
      )
      .to(
        viewportRef.current,
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.1,
          ease: "power3.inOut",
        },
        0.3
      )
      .to(paraRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.75)
      .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, 0.9);

    // Scroll-linked exit: hero content recedes as the visitor scrolls
    // past it, using only transform/opacity for performance.
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    scrollTl
      .to(
        [eyebrowRef.current, ...lineRefs.current, paraRef.current, ctaRef.current],
        { yPercent: -18, opacity: 0.25, ease: "none" },
        0
      )
      .to(
        viewportRef.current,
        { yPercent: -8, scale: 0.94, opacity: 0.35, ease: "none" },
        0
      );

    return () => {
      tl.kill();
      scrollTl.scrollTrigger?.kill();
      scrollTl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative mx-auto flex min-h-screen max-w-[1400px] flex-col justify-center gap-12 px-6 pt-24 lg:flex-row lg:items-center lg:gap-8 lg:px-12"
    >
      <div className="lg:w-[58%]">
        <span
          ref={eyebrowRef}
          className="mb-6 inline-block font-mono text-xs tracking-widemono text-amber"
        >
          KIRAN STUDIOS — DESIGN &amp; DEVELOPMENT
        </span>

        <h1 className="font-display text-[13vw] leading-[0.95] tracking-tightest text-bone sm:text-[7vw] lg:text-[4.6vw]">
          {HEADLINE_LINES.map((line, i) => (
            <span key={i} className="block overflow-hidden">
              <span
                ref={(el) => {
                  lineRefs.current[i] = el;
                }}
                className="block"
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <p
          ref={paraRef}
          className="mt-8 max-w-md font-body text-base text-boneDim sm:text-lg"
        >
          A small studio building interactive, 3D-driven products for
          brands who want their site to feel like software, not a
          brochure.
        </p>

        <div ref={ctaRef} className="mt-10">
          <MagneticButton
            href="/booking"
            className="inline-flex items-center gap-3 border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink"
          >
            BOOK A FREE CONSULTATION
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </MagneticButton>
        </div>
      </div>

      <div ref={viewportRef} className="lg:w-[42%]">
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
