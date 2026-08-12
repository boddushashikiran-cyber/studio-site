"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Project } from "@/lib/projects";

const sections = [
  { key: "brief", label: "The Brief" },
  { key: "process", label: "The Process" },
  { key: "build", label: "The Build" },
  { key: "result", label: "The Result" },
] as const;

export default function CaseStudyContent({ project }: { project: Project }) {
  return (
    <>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-4 block font-mono text-xs tracking-widemono text-amber"
      >
        {project.tags.join(" · ")}
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mb-8 font-display text-4xl text-bone sm:text-5xl"
      >
        {project.title}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-16 max-w-2xl font-body text-lg leading-relaxed text-boneDim"
      >
        {project.overview}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="mb-16 aspect-video overflow-hidden border border-line bg-panel"
      >
        <img
          src={project.coverImage}
          alt={project.title}
          className="h-full w-full object-cover"
        />
      </motion.div>

      <div className="flex flex-col gap-16">
        {sections.map(({ key, label }, i) => (
          <motion.section
            key={key}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="border-t border-line pt-8"
          >
            <h2 className="mb-4 font-mono text-xs tracking-widemono text-boneDim">
              {label.toUpperCase()}
            </h2>
            <p className="max-w-2xl font-body text-lg leading-relaxed text-bone">
              {project[key]}
            </p>
          </motion.section>
        ))}

        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="border-t border-line pt-8"
        >
          <h2 className="mb-4 font-mono text-xs tracking-widemono text-boneDim">
            STACK
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((s, i) => (
              <motion.span
                key={s}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="border border-line px-3 py-1 font-mono text-xs text-boneDim"
              >
                {s}
              </motion.span>
            ))}
          </div>
        </motion.section>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-20 border-t border-line pt-10"
      >
        <Link
          href="/booking"
          className="inline-flex items-center gap-3 border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink"
        >
          START A PROJECT LIKE THIS
          <span aria-hidden>&rarr;</span>
        </Link>
      </motion.div>
    </>
  );
}
