"use client";

import { useLayoutEffect, useState } from "react";

/**
 * Returns null until resolved (during SSR and the first client render,
 * before layout effects run), then true/false. Callers must treat null
 * as "not yet known" and render a neutral placeholder — never treat it
 * as equivalent to false, or animation setup can run against DOM nodes
 * that don't exist yet in the unresolved render.
 */
export function useReducedMotion(): boolean | null {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  return reducedMotion;
}
