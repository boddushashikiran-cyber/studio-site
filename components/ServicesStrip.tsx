"use client";

import { motion } from "framer-motion";

const services = [
  {
    code: "01",
    name: "Web Design",
    detail: "Interfaces built around the story your product is telling.",
  },
  {
    code: "02",
    name: "Development",
    detail: "Fast, accessible builds on Next.js, shipped on Vercel.",
  },
  {
    code: "03",
    name: "3D / Animation",
    detail: "WebGL scenes and motion systems that react, not just play.",
  },
  {
    code: "04",
    name: "UI / UX",
    detail: "Flows tested against real tasks, not just wireframes.",
  },
];

export default function ServicesStrip() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
      <div className="mb-12 flex items-baseline justify-between border-b border-line pb-6">
        <h2 className="font-display text-2xl text-bone sm:text-3xl">
          What we do
        </h2>
        <span className="font-mono text-xs tracking-widemono text-boneDim">
          04 SERVICES
        </span>
      </div>

      <div className="grid grid-cols-1 gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        {services.map((s, i) => (
          <motion.div
            key={s.code}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ y: -6 }}
            className="group flex min-h-[220px] flex-col justify-between bg-ink p-6 transition-colors hover:bg-panel"
          >
            <span className="font-mono text-xs text-amber">{s.code}</span>
            <div>
              <h3 className="mb-2 font-display text-xl text-bone">
                {s.name}
              </h3>
              <p className="font-body text-sm text-boneDim">{s.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
