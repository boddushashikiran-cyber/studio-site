"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function CTASection() {
  return (
    <section className="mx-auto max-w-[1400px] px-6 py-32 lg:px-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-start justify-between gap-8 border-t border-line pt-16 lg:flex-row lg:items-end"
      >
        <h2 className="max-w-xl font-display text-4xl leading-[1.05] text-bone sm:text-5xl">
          Have a project worth building right?
        </h2>
        <Link
          href="/booking"
          className="inline-flex shrink-0 items-center gap-3 border border-amber px-8 py-4 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink"
        >
          BOOK A FREE CONSULTATION
          <span aria-hidden>&rarr;</span>
        </Link>
      </motion.div>
    </section>
  );
}
