"use client";

import { CinematicSceneShell } from "@/components/cinematic/CinematicSceneShell";
import { ScrollNarrative, NarrativeState } from "@/components/cinematic/ScrollNarrative";
import FoundItObjects from "./FoundItObjects";
import { getProject } from "@/lib/projects";

// Reuses the project's REAL existing copy, split into scroll windows —
// nothing here is invented narrative text.
function useNarrativeStates(): NarrativeState[] {
  const project = getProject("foundit-campus");
  if (!project) return [];

  return [
    { kicker: "FOUNDIT CAMPUS", text: project.overview, window: [0.0, 0.28] },
    { kicker: "THE BRIEF", text: project.brief, window: [0.28, 0.48] },
    { kicker: "THE PROCESS", text: project.process, window: [0.48, 0.68] },
    { kicker: "THE BUILD", text: project.build, window: [0.68, 0.86] },
    { kicker: "THE RESULT", text: project.result, window: [0.86, 1.0] },
  ];
}

function FoundItFallback() {
  const project = getProject("foundit-campus");
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <span className="mb-4 font-mono text-xs tracking-widemono text-amber">
        FOUNDIT CAMPUS
      </span>
      <h2 className="mb-6 max-w-xl font-display text-3xl text-bone sm:text-4xl">
        {project?.overview}
      </h2>
    </div>
  );
}

export default function FoundItCinematicScene() {
  const states = useNarrativeStates();

  return (
    <CinematicSceneShell
      heightVh={450}
      cameraConfig={{ position: [0, 0, 11], fov: 38 }}
      fallback={<FoundItFallback />}
      renderScene={(progressRef) => <FoundItObjects progressRef={progressRef} />}
      renderOverlay={(progressRef) => (
        <ScrollNarrative progressRef={progressRef} states={states} align="right" />
      )}
    />
  );
}
