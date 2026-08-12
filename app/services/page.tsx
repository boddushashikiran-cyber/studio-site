import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Services — Kiran Studios",
};

const services = [
  {
    code: "01",
    name: "Web Design",
    detail:
      "Full interface design, from information architecture through to a finished, animatable UI in Figma. We design in the browser's constraints, not around them.",
    startingAt: "$4,500",
    includes: ["Design system + tokens", "Full-site wireframes", "High-fidelity UI", "Interactive prototype"],
  },
  {
    code: "02",
    name: "Development",
    detail:
      "Front-end build on Next.js or your framework of choice, wired to your CMS or backend, deployed and handed off with documentation your team can actually use.",
    startingAt: "$6,000",
    includes: ["Responsive build", "CMS or Supabase integration", "Performance pass", "Deployment + handoff docs"],
  },
  {
    code: "03",
    name: "3D / Animation",
    detail:
      "WebGL scenes, motion systems, and interaction design for products where a static screenshot can't do the idea justice.",
    startingAt: "$3,500",
    includes: ["Concept + storyboard", "3D asset production", "R3F / Three.js implementation", "Performance tuning across devices"],
  },
  {
    code: "04",
    name: "UI / UX",
    detail:
      "Research-backed flows and interaction design, tested against real tasks before a single pixel is polished.",
    startingAt: "$2,800",
    includes: ["User flow mapping", "Usability testing", "Interaction specs", "Design QA during build"],
  },
];

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-[1400px] px-6 pb-24 pt-32 lg:px-12">
        <span className="mb-4 block font-mono text-xs tracking-widemono text-amber">
          SERVICES
        </span>
        <h1 className="mb-16 max-w-2xl font-display text-4xl text-bone sm:text-5xl">
          Four ways to work with us, and a starting point for each.
        </h1>

        <div className="flex flex-col divide-y divide-line border-y border-line">
          {services.map((s) => (
            <div
              key={s.code}
              className="grid grid-cols-1 gap-6 py-12 lg:grid-cols-[80px_1fr_280px]"
            >
              <span className="font-mono text-sm text-amber">{s.code}</span>

              <div>
                <h2 className="mb-3 font-display text-2xl text-bone sm:text-3xl">
                  {s.name}
                </h2>
                <p className="max-w-xl font-body text-base text-boneDim">
                  {s.detail}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <span className="font-mono text-xs tracking-widemono text-boneDim">
                    STARTING AT
                  </span>
                  <p className="font-display text-2xl text-bone">
                    {s.startingAt}
                  </p>
                </div>
                <ul className="flex flex-col gap-1">
                  {s.includes.map((item) => (
                    <li
                      key={item}
                      className="font-mono text-xs text-boneDim before:mr-2 before:content-['—']"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-start gap-6 border-t border-line pt-16 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-md font-body text-boneDim">
            Most projects combine two or more of these. Tell us what you're
            building on a call and we'll scope it properly.
          </p>
          <Link
            href="/booking"
            className="inline-flex shrink-0 items-center gap-3 border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink"
          >
            BOOK A FREE CONSULTATION
            <span aria-hidden>&rarr;</span>
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
