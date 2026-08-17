"use client";

import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    code: "REN_05",
    name: "Web Design",
    detail: "Interfaces built around the story your product is telling.",
  },
  {
    code: "REN_06",
    name: "Development",
    detail: "Fast, accessible builds on Next.js, shipped on Vercel.",
  },
  {
    code: "REN_07",
    name: "3D / Animation",
    detail: "WebGL scenes and motion systems that react, not just play.",
  },
  {
    code: "REN_08",
    name: "UI / UX",
    detail: "Flows tested against real tasks, not just wireframes.",
  },
];

// Matches Tailwind's `lg` breakpoint — below this, the horizontal pin
// is skipped entirely and the reel becomes a normal vertical stack.
// This is a deliberate mobile layout, not the desktop one shrunk down.
const PIN_BREAKPOINT = 1024;

export default function ServicesStrip() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinEnabled, setPinEnabled] = useState(false);

  useEffect(() => {
    setPinEnabled(window.innerWidth >= PIN_BREAKPOINT);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (!pinEnabled || reducedMotion || !wrapperRef.current || !trackRef.current) {
      return;
    }

    const wrapper = wrapperRef.current;
    const track = trackRef.current;

    const getScrollAmount = () =>
      Math.max(0, track.scrollWidth - window.innerWidth);

    const scrollTween = gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: "none",
    });

    const st = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: () => `+=${getScrollAmount()}`,
      pin: true,
      animation: scrollTween,
      scrub: 1,
      invalidateOnRefresh: true,
    });

    return () => {
      st.kill();
      scrollTween.kill();
    };
  }, [pinEnabled]);

  return (
    <section
      ref={wrapperRef}
      className="relative overflow-hidden border-t border-line lg:h-screen"
    >
      <div
        ref={trackRef}
        className="flex flex-col gap-px bg-line px-6 py-16 lg:h-full lg:w-max lg:flex-row lg:items-stretch lg:gap-px lg:px-12 lg:py-0"
      >
        <div className="flex shrink-0 flex-col justify-center bg-ink py-8 lg:w-[36vw] lg:pr-16">
          <span className="mb-4 font-mono text-xs tracking-widemono text-amber">
            04 SERVICES / SCRUB TO VIEW
          </span>
          <h2 className="font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
            What we do, frame by frame.
          </h2>
        </div>

        {services.map((s) => (
          <div
            key={s.code}
            className="group relative flex shrink-0 flex-col justify-between border border-line bg-ink p-8 lg:w-[38vw] lg:p-12"
          >
            {["-top-px -left-px", "-top-px -right-px border-l-0", "-bottom-px -left-px border-t-0", "-bottom-px -right-px border-t-0 border-l-0"].map(
              (pos, i) => (
                <span
                  key={i}
                  className={`absolute h-2.5 w-2.5 border border-amber/60 ${pos}`}
                  aria-hidden
                />
              )
            )}
            <div className="flex items-start justify-between">
              <span className="font-mono text-xs tracking-widemono text-boneDim">
                {s.code}
              </span>
              <span className="font-mono text-xs tracking-widemono text-boneDim/50">
                LIVE
              </span>
            </div>
            <div>
              <h3 className="mb-3 font-display text-3xl text-bone transition-colors group-hover:text-amber sm:text-4xl">
                {s.name}
              </h3>
              <p className="max-w-sm font-body text-base text-boneDim">
                {s.detail}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
