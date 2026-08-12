"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    slug: "foundit-campus",
    title: "FoundIt Campus",
    tags: "Product · Web App",
    coverImage: "/covers/foundit.svg",
  },
  {
    slug: "the-nightshift",
    title: "The Nightshift",
    tags: "Music · Band Site",
    coverImage: "/covers/nightshift.svg",
  },
  {
    slug: "chronos-watches",
    title: "Chronos",
    tags: "E-Commerce · Product",
    coverImage: "/covers/chronos.svg",
  },
];

export default function WorkPreview() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section className="relative mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
      <div className="mb-4 flex items-baseline justify-between border-b border-line pb-6">
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

      <div onMouseLeave={() => setHovered(null)}>
        {projects.map((p, i) => (
          <motion.div
            key={p.slug}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
          >
            <Link
              href={`/work/${p.slug}`}
              onMouseEnter={() => setHovered(p.slug)}
              className="group flex items-center justify-between border-b border-line py-8 transition-colors sm:py-10"
            >
              <div className="flex items-baseline gap-6">
                <span className="font-mono text-xs text-boneDim/50">
                  0{i + 1}
                </span>
                <h3 className="font-display text-3xl text-bone transition-colors group-hover:text-amber sm:text-5xl">
                  {p.title}
                </h3>
              </div>
              <div className="flex items-center gap-6">
                <span className="hidden font-mono text-xs tracking-widemono text-boneDim sm:inline">
                  {p.tags}
                </span>
                <ArrowUpRight
                  size={22}
                  strokeWidth={1.5}
                  className="text-boneDim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-amber"
                />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Floating preview image that clip-path wipes in beside the
          cursor's row — desktop only; on mobile this never mounts,
          since hover has no meaning on touch. */}
      <div className="pointer-events-none absolute right-6 top-1/2 hidden h-64 w-80 -translate-y-1/2 lg:block lg:right-12">
        <AnimatePresence>
          {hovered && (
            <motion.div
              key={hovered}
              initial={{ clipPath: "inset(50% 50% 50% 50%)", opacity: 0 }}
              animate={{ clipPath: "inset(0% 0% 0% 0%)", opacity: 1 }}
              exit={{ clipPath: "inset(50% 50% 50% 50%)", opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 overflow-hidden border border-line"
            >
              <img
                src={projects.find((p) => p.slug === hovered)?.coverImage}
                alt=""
                className="h-full w-full object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
