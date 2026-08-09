"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const projects = [
  {
    slug: "foundit-campus",
    title: "FoundIt Campus",
    tags: "Product · Web App",
    note: "REN_02",
  },
  {
    slug: "the-nightshift",
    title: "The Nightshift",
    tags: "Music · Band Site",
    note: "REN_03",
  },
  {
    slug: "chronos-watches",
    title: "Chronos",
    tags: "E-Commerce · Product",
    note: "REN_04",
  },
];

export default function WorkPreview() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
      <div className="mb-12 flex items-baseline justify-between border-b border-line pb-6">
        <h2 className="font-display text-2xl text-bone sm:text-3xl">
          Selected work
        </h2>
        <Link
          href="/work"
          className="font-mono text-xs tracking-widemono text-amber hover:underline"
        >
          VIEW ALL &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
          >
            <Link href={`/work/${p.slug}`} className="group block">
              <div className="relative mb-4 aspect-[4/3] overflow-hidden border border-line bg-panel">
                <div
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-panel to-panelLight transition-transform duration-700 ease-out group-hover:scale-110"
                  aria-hidden
                >
                  <span className="font-mono text-xs tracking-widemono text-boneDim">
                    {p.note}
                  </span>
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <h3 className="font-display text-lg text-bone group-hover:text-amber">
                  {p.title}
                </h3>
              </div>
              <p className="font-mono text-xs tracking-widemono text-boneDim">
                {p.tags}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
