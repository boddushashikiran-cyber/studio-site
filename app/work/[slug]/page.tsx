import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CaseStudyContent from "@/components/work/CaseStudyContent";
import { PROJECTS, getProject } from "@/lib/projects";

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

        <CaseStudyContent project={project} />
      </main>
      <Footer />
    </>
  );
}
