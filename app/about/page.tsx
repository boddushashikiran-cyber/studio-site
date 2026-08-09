import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Timeline from "@/components/about/Timeline";

export const metadata = {
  title: "About — Kiran Studios",
};

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-0">
        <span className="mb-4 block font-mono text-xs tracking-widemono text-amber">
          ABOUT THE STUDIO
        </span>
        <h1 className="mb-10 font-display text-4xl text-bone sm:text-5xl">
          We build the sites we wished more studios shipped.
        </h1>

        <div className="flex flex-col gap-6 font-body text-lg leading-relaxed text-boneDim">
          <p>
            Kiran Studios started as a small, opinionated studio for teams tired
            of choosing between a site that looks good and one that
            actually performs. We design and build in the same room —
            literally the same person, some weeks — so nothing gets lost
            in the handoff between a mockup and a working product.
          </p>
          <p>
            We take on a small number of projects at a time. That's not a
            humblebrag about being selective; it's the only way the 3D
            work, the motion, and the engineering underneath all stay this
            considered.
          </p>
        </div>

        <div className="mt-20 border-t border-line pt-16">
          <h2 className="mb-10 font-mono text-xs tracking-widemono text-boneDim">
            MILESTONES
          </h2>
          <Timeline />
        </div>
      </main>
      <Footer />
    </>
  );
}
