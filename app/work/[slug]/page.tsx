import { notFound } from "next/navigation";
import Link from "next/link";
import type { ComponentType } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseStudyContent from "@/components/work/CaseStudyContent";
import { PROJECTS, getProject } from "@/lib/projects";
import ChronosCinematicScene from "@/components/cinematic/chronos/ChronosCinematicScene";
import FoundItCinematicScene from "@/components/cinematic/foundit/FoundItCinematicScene";
import NightshiftCinematicScene from "@/components/cinematic/nightshift/NightshiftCinematicScene";

// Each project gets its own distinct scroll-driven cinematic sequence,
// inserted above the existing case study content (which is untouched
// below). Slugs not in this map simply skip straight to the existing
// content, so adding a new project never requires building a scene.
const CINEMATIC_SCENES: Record<string, ComponentType> = {
  "chronos-watches": ChronosCinematicScene,
  "foundit-campus": FoundItCinematicScene,
  "the-nightshift": NightshiftCinematicScene,
};

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

// Next.js 16: params is a Promise and must be awaited — synchronous
// access silently returns undefined instead of throwing, which is
// exactly what caused every case study link to 404.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  return { title: project ? `${project.title} — Kiran Studios` : "Case study" };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const CinematicScene = CINEMATIC_SCENES[slug];

  return (
    <>
      <Nav />
      {CinematicScene && <CinematicScene />}
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-0">
        <Link
          href="/work"
          className="mb-8 inline-block font-mono text-xs tracking-widemono text-boneDim hover:text-amber"
        >
          &larr; ALL WORK
        </Link>

        <CaseStudyContent project={project} />
      </main>
      <Footer />
    </>
  );
}
