import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PROJECTS, getProject } from "@/lib/projects";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const project = getProject(params.slug);
  return { title: project ? `${project.title} — Kiran Studios` : "Case study" };
}

const sections = [
  { key: "brief", label: "The Brief" },
  { key: "process", label: "The Process" },
  { key: "build", label: "The Build" },
  { key: "result", label: "The Result" },
] as const;

export default function CaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = getProject(params.slug);
  if (!project) notFound();

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-0">
        <Link
          href="/work"
          className="mb-8 inline-block font-mono text-xs tracking-widemono text-boneDim hover:text-amber"
        >
          &larr; ALL WORK
        </Link>

        <span className="mb-4 block font-mono text-xs tracking-widemono text-amber">
          {project.tags.join(" · ")}
        </span>
        <h1 className="mb-16 font-display text-4xl text-bone sm:text-5xl">
          {project.title}
        </h1>

        <div className="mb-16 flex aspect-video items-center justify-center border border-line bg-panel">
          <span className="font-mono text-xs tracking-widemono text-boneDim">
            {project.note}
          </span>
        </div>

        <div className="flex flex-col gap-16">
          {sections.map(({ key, label }) => (
            <section key={key} className="border-t border-line pt-8">
              <h2 className="mb-4 font-mono text-xs tracking-widemono text-boneDim">
                {label.toUpperCase()}
              </h2>
              <p className="max-w-2xl font-body text-lg leading-relaxed text-bone">
                {project[key]}
              </p>
            </section>
          ))}

          <section className="border-t border-line pt-8">
            <h2 className="mb-4 font-mono text-xs tracking-widemono text-boneDim">
              STACK
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((s) => (
                <span
                  key={s}
                  className="border border-line px-3 py-1 font-mono text-xs text-boneDim"
                >
                  {s}
                </span>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-20 border-t border-line pt-10">
          <Link
            href="/booking"
            className="inline-flex items-center gap-3 border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink"
          >
            START A PROJECT LIKE THIS
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
