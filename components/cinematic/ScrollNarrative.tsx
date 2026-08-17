"use client";

import { useEffect, useRef, MutableRefObject } from "react";
import { windowProgress } from "@/lib/cinematic/math";

export type NarrativeState = {
  kicker: string;
  text: string;
  /** scroll progress window [start, end] this state is fully visible within */
  window: [number, number];
};

/**
 * Renders every state stacked in the same place, and imperatively
 * crossfades between them each frame based on scroll progress — reading
 * from a ref (no React state), matching the performance approach used
 * throughout the rest of the cinematic system.
 */
export function ScrollNarrative({
  progressRef,
  states,
  align = "left",
}: {
  progressRef: MutableRefObject<number>;
  states: NarrativeState[];
  align?: "left" | "right" | "center";
}) {
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      const progress = progressRef.current;

      states.forEach((state, i) => {
        const el = refs.current[i];
        if (!el) return;
        const [start, end] = state.window;
        // Fade in over the first 15% of the window, hold, fade out over
        // the last 15% — rather than a hard cut at the window edges.
        const span = end - start;
        const fadeIn = windowProgress(progress, start, start + span * 0.15);
        const fadeOut =
          1 - windowProgress(progress, end - span * 0.15, end);
        const visible = progress >= start && progress <= end;
        const opacity = visible ? Math.min(fadeIn, fadeOut) : 0;

        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${(1 - opacity) * 12}px)`;
        el.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      });

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progressRef, states]);

  const alignClass =
    align === "right"
      ? "items-end text-right right-8 lg:right-16"
      : align === "center"
      ? "items-center text-center left-1/2 -translate-x-1/2"
      : "items-start text-left left-8 lg:left-16";

  return (
    <div
      className={`pointer-events-none absolute top-1/2 flex w-full max-w-md -translate-y-1/2 flex-col ${alignClass} px-2`}
    >
      {states.map((state, i) => (
        <div
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          style={{ opacity: 0, position: i === 0 ? "relative" : "absolute" }}
          className="transition-none"
        >
          <span className="mb-3 block font-mono text-xs tracking-widemono text-amber">
            {state.kicker}
          </span>
          <p className="font-body text-lg leading-relaxed text-bone sm:text-xl">
            {state.text}
          </p>
        </div>
      ))}
    </div>
  );
}
