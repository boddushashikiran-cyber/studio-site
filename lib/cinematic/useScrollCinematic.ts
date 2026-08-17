"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pins `wrapperRef`'s content for the full height of the wrapper, and
 * continuously reports scroll progress (0 at top, 1 at bottom) into
 * `progressRef.current` — read every frame inside R3F via useFrame,
 * not via React state, so scroll-driven animation never triggers a
 * re-render.
 *
 * Scrolling back up naturally reverses progress, since it's a direct
 * read of ScrollTrigger's own position — nothing about this is a
 * one-shot "animate in" effect.
 */
export function useScrollCinematic(
  wrapperRef: React.RefObject<HTMLElement | null>,
  stickyRef: React.RefObject<HTMLElement | null>,
  enabled: boolean
) {
  const progressRef = useRef(0);

  useEffect(() => {
    if (!enabled || !wrapperRef.current || !stickyRef.current) return;

    const st = ScrollTrigger.create({
      trigger: wrapperRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: stickyRef.current,
      scrub: true,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    return () => {
      st.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, wrapperRef, stickyRef]);

  return progressRef;
}
