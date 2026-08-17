"use client";

import { useRef, ReactNode, MutableRefObject } from "react";
import { Canvas } from "@react-three/fiber";
import type { CameraProps } from "@react-three/fiber";
import { useScrollCinematic } from "@/lib/cinematic/useScrollCinematic";
import { useReducedMotion } from "@/lib/cinematic/useReducedMotion";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";

/**
 * The pinned wrapper used by every project's CinematicScene. Owns the
 * single ScrollTrigger instance (per the "don't create competing scroll
 * systems" rule) and hands scroll progress down two ways:
 *   - `progressRef`, read every frame inside the R3F tree via useFrame
 *   - `onProgress`, an optional callback for DOM overlay elements
 *     (title/description) that live outside the Canvas and can't use
 *     useFrame — write directly to refs inside this callback, never to
 *     React state, or every scroll tick becomes a re-render.
 *
 * `heightVh` controls how much scroll distance the whole sequence takes
 * — bigger number, slower/longer cinematic progression.
 */
export function CinematicSceneShell({
  heightVh = 400,
  cameraConfig,
  renderScene,
  renderOverlay,
  fallback,
}: {
  heightVh?: number;
  cameraConfig: CameraProps;
  renderScene: (progressRef: MutableRefObject<number>) => ReactNode;
  renderOverlay?: (progressRef: MutableRefObject<number>) => ReactNode;
  fallback: ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const progressRef = useScrollCinematic(
    wrapperRef,
    stickyRef,
    reducedMotion === false
  );

  if (reducedMotion === null) {
    // Unresolved — neutral placeholder only, to avoid flashing the full
    // motion sequence for reduced-motion users before this settles.
    return <div className="min-h-[60vh] bg-ink" />;
  }

  if (reducedMotion) {
    return <div className="relative bg-ink">{fallback}</div>;
  }

  return (
    <div ref={wrapperRef} style={{ height: `${heightVh}vh` }} className="relative">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-ink"
      >
        <div className="absolute inset-0">
          <CanvasErrorBoundary fallback={fallback}>
            <Canvas camera={cameraConfig} dpr={[1, 2]}>
              {renderScene(progressRef)}
            </Canvas>
          </CanvasErrorBoundary>
        </div>
        {renderOverlay && (
          <div className="relative z-10 h-full">{renderOverlay(progressRef)}</div>
        )}
      </div>
    </div>
  );
}
