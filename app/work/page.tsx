import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { PROJECTS } from "@/lib/projects";

export const metadata = {
  title: "Work — Kiran Studios",
};

export default function WorkPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-32 lg:px-12">
        <span className="mb-4 block font-mono text-xs tracking-widemono text-amber">
          SELECTED WORK
        </span>
        <h1 className="mb-16 max-w-2xl font-display text-4xl text-bone sm:text-5xl">
          Product, mobile, and brand work for teams who wanted software
          that feels considered.
        </h1>

        <div className="flex flex-col divide-y divide-line border-y border-line">
          {PROJECTS.map((p) => (
            <Link
              key={p.slug}
              href={`/work/${p.slug}`}
              className="group grid grid-cols-1 items-center gap-4 py-10 transition-colors hover:bg-panel sm:grid-cols-[80px_1fr_auto_auto] sm:gap-8 sm:px-4"
            >
              <div className="hidden aspect-square overflow-hidden border border-line sm:block">
                <img
                  src={p.coverImage}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>
              <h2 className="font-display text-2xl text-bone group-hover:text-amber sm:text-3xl">
                {p.title}
              </h2>
              <span className="font-mono text-xs tracking-widemono text-boneDim">
                {p.tags.join(" · ")}
              </span>
              <span className="font-mono text-xs tracking-widemono text-boneDim group-hover:text-amber">
                VIEW CASE STUDY &rarr;
              </span>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
