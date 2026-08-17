"use client";

import { CinematicSceneShell } from "@/components/cinematic/CinematicSceneShell";
import { ScrollNarrative, NarrativeState } from "@/components/cinematic/ScrollNarrative";
import ChronosWatch from "./ChronosWatch";
import { getProject } from "@/lib/projects";

// Reuses the project's REAL existing copy, split into scroll windows —
// nothing here is invented narrative text.
function useNarrativeStates(): NarrativeState[] {
  const project = getProject("chronos-watches");
  if (!project) return [];

  return [
    { kicker: "CHRONOS", text: project.overview, window: [0.0, 0.28] },
    { kicker: "THE BRIEF", text: project.brief, window: [0.28, 0.48] },
    { kicker: "THE PROCESS", text: project.process, window: [0.48, 0.68] },
    { kicker: "THE BUILD", text: project.build, window: [0.68, 0.86] },
    { kicker: "THE RESULT", text: project.result, window: [0.86, 1.0] },
  ];
}

function ChronosFallback() {
  const project = getProject("chronos-watches");
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 font-mono text-xs tracking-widemono text-amber">
        CHRONOS
      </span>
      <h2 className="mb-6 max-w-xl font-display text-3xl text-bone sm:text-4xl">
        {project?.overview}
      </h2>
    </div>
  );
}

export default function ChronosCinematicScene() {
  const states = useNarrativeStates();

  return (
    <CinematicSceneShell
      heightVh={450}
      cameraConfig={{ position: [0, 1, 9], fov: 35 }}
      fallback={<ChronosFallback />}
      renderScene={(progressRef) => <ChronosWatch progressRef={progressRef} />}
      renderOverlay={(progressRef) => (
        <ScrollNarrative progressRef={progressRef} states={states} align="left" />
      )}
    />
  );
}
