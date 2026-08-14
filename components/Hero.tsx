"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   HERO — "KIRAN STUDIOS" TITLE REVEAL

   Each letter of KIRAN starts scattered, blurred, and
   randomly rotated just off-frame, then converges into
   place with a fast, confident ease — a controlled
   "assembling" reveal in the spirit of Apple/Nike/Linear
   product pages. STUDIOS, the tagline, the CTA, and the
   scroll hint settle in right after.

   Deliberately dependency-light: no WebGL, no three.js, no
   per-frame shader work. Everything here is GSAP animating
   plain DOM transforms/opacity/filter, which is dramatically
   cheaper to run and has none of the failure modes (SSR
   crashes, null refs, shader edge cases) that a full 3D
   particle system carries.

   Respects prefers-reduced-motion: skips straight to the
   settled, static final state — no animation runs at all.
========================================================= */

const AMBER = "#E8A33D";
const BONE = "#ECEAE4";

const KIRAN_LETTERS = "KIRAN".split("");
const STUDIOS_LETTERS = "STUDIOS".split("");

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const kiranWrapRef = useRef<HTMLSpanElement>(null);
  const kiranLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const studiosLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const [, setSettled] = useState(false);

  // Decide reduced-motion before first paint, so users who prefer
  // reduced motion never see even a flash of the intro sequence.
  useLayoutEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    setReducedMotion(prefersReduced);
    if (prefersReduced) setSettled(true);
  }, []);

  // The entrance timeline. Only ever runs on the client, and only once
  // reducedMotion has definitely resolved to false — never while it's
  // still null/unknown, which is when these refs may not be attached yet.
  useEffect(() => {
    if (reducedMotion !== false) return;

    const letters = kiranLettersRef.current.filter(
      (el): el is HTMLSpanElement => el !== null
    );
    const studioLetters = studiosLettersRef.current.filter(
      (el): el is HTMLSpanElement => el !== null
    );
    if (letters.length === 0) return;

    gsap.set(letters, {
      opacity: 0,
      x: () => gsap.utils.random(-120, 120),
      y: () => gsap.utils.random(-60, 60),
      rotation: () => gsap.utils.random(-16, 16),
      filter: "blur(12px)",
    });

    const tl = gsap.timeline({ delay: 0.15 });

    tl.to(letters, {
      opacity: 1,
      x: 0,
      y: 0,
      rotation: 0,
      filter: "blur(0px)",
      duration: 1.05,
      ease: "expo.out",
      stagger: { each: 0.055, from: "random" },
    });

    if (studioLetters.length > 0) {
      tl.to(
        studioLetters,
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.035, ease: "power2.out" },
        "-=0.5"
      );
    }
    if (taglineRef.current) {
      tl.to(taglineRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.25");
    }
    if (ctaRef.current) {
      tl.to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.35");
    }
    if (scrollHintRef.current) {
      tl.to(scrollHintRef.current, { opacity: 1, duration: 0.6 }, "-=0.3");
    }
    tl.call(() => setSettled(true));

    return () => {
      tl.kill();
    };
  }, [reducedMotion]);

  // Post-intro: gentle scroll-linked fade/parallax.
  useEffect(() => {
    if (reducedMotion !== false) return;

    const targets = [kiranWrapRef.current, taglineRef.current, ctaRef.current].filter(
      (el): el is HTMLElement => el !== null
    );
    if (targets.length === 0) return;

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
    scrollTl.to(targets, { opacity: 0.15, yPercent: -12, ease: "none" }, 0);

    return () => {
      scrollTl.scrollTrigger?.kill();
      scrollTl.kill();
    };
  }, [reducedMotion]);

  if (reducedMotion === null) {
    // Briefly unknown on first render before useLayoutEffect resolves —
    // render nothing rather than guess, avoiding a flash of the wrong state.
    return <section ref={sectionRef} className="relative min-h-screen bg-ink" />;
  }

  return (
    <section ref={sectionRef} className="relative min-h-screen overflow-hidden bg-ink">
      {/* Ambient depth — plain CSS radial gradients, GPU-composited,
          effectively free to render (no per-frame JS/WebGL involved). */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="hero-glow hero-glow-a" />
        <div className="hero-glow hero-glow-b" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <span ref={kiranWrapRef} className="inline-flex">
          {KIRAN_LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                kiranLettersRef.current[i] = el;
              }}
              style={{
                opacity: reducedMotion ? 1 : 0,
                display: "inline-block",
                backgroundImage: `linear-gradient(120deg, #5a4726 15%, ${AMBER} 35%, #fbe6bc 50%, ${AMBER} 65%, #5a4726 85%)`,
                backgroundSize: "400% 100%",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                filter: "drop-shadow(0 0 30px rgba(232,163,61,0.3))",
              }}
              className={
                "font-display text-[20vw] leading-[0.9] tracking-tightest sm:text-[15vw] lg:text-[9vw]" +
                (reducedMotion ? "" : " hero-shimmer")
              }
            >
              {letter}
            </span>
          ))}
        </span>

        <span className="mt-2 flex gap-[0.35em] sm:mt-4">
          {STUDIOS_LETTERS.map((letter, i) => (
            <span
              key={i}
              ref={(el) => {
                studiosLettersRef.current[i] = el;
              }}
              style={{
                opacity: reducedMotion ? 1 : 0,
                transform: reducedMotion ? "none" : "translateY(10px)",
                color: BONE,
                textShadow: "0 0 28px rgba(124,111,255,0.35)",
              }}
              className="font-display text-base tracking-[0.3em] sm:text-xl lg:text-2xl"
            >
              {letter}
            </span>
          ))}
        </span>

        <p
          ref={taglineRef}
          style={{
            opacity: reducedMotion ? 1 : 0,
            transform: reducedMotion ? "none" : "translateY(16px)",
          }}
          className="mt-8 max-w-md font-body text-base text-boneDim sm:text-lg"
        >
          We design digital experiences that move people — a small studio
          building interactive, 3D-driven products for brands who want
          their site to feel like software, not a brochure.
        </p>

        <div
          ref={ctaRef}
          style={{
            opacity: reducedMotion ? 1 : 0,
            transform: reducedMotion ? "none" : "translateY(16px)",
          }}
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

      <style>{`
        .hero-glow {
          position: absolute;
          border-radius: 9999px;
          filter: blur(90px);
          opacity: 0.35;
          will-change: transform;
        }
        .hero-glow-a {
          top: 10%;
          left: 20%;
          width: 42vw;
          height: 42vw;
          background: radial-gradient(circle, ${AMBER} 0%, transparent 70%);
          animation: heroFloatA 16s ease-in-out infinite;
        }
        .hero-glow-b {
          bottom: 5%;
          right: 15%;
          width: 36vw;
          height: 36vw;
          background: radial-gradient(circle, #7c6fff 0%, transparent 70%);
          animation: heroFloatB 18s ease-in-out infinite;
        }
        @keyframes heroFloatA {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, 6%) scale(1.08); }
        }
        @keyframes heroFloatB {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-5%, -4%) scale(1.05); }
        }
        .hero-shimmer {
          background-position: 100% 0%;
          animation: heroShimmer 7s ease-in-out infinite;
          animation-delay: 1.4s;
        }
        @keyframes heroShimmer {
          0%, 15% { background-position: 100% 0%; }
          55% { background-position: 0% 0%; }
          100% { background-position: 0% 0%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-glow, .hero-shimmer { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
