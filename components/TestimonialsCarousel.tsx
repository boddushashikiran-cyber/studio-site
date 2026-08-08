"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    quote:
      "Kiran Studios rebuilt our product site in three weeks and it finally feels like the product itself.",
    name: "Nathi Krithin",
    role: "Founder, Codeduelz",
  },
  {
    quote:
      "Clear communication from kickoff to launch",
    name: "Spoorthy",
    role: "Student, Texas Womens University",
  },
  {
    quote:
      "Fast, opinionated, and they pushed back when we asked for the wrong thing.",
    name: "Narayana Chandra Bose",
    role: "Student, Bits Pilani",
  },
];

export default function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const current = testimonials[index];

  function go(dir: 1 | -1) {
    setIndex((i) => (i + dir + testimonials.length) % testimonials.length);
  }

  return (
    <section className="mx-auto max-w-[1400px] px-6 py-24 lg:px-12">
      <div className="border-t border-line pt-16">
        <div className="relative min-h-[160px]">
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4 }}
            >
              <p className="max-w-2xl font-display text-xl text-bone sm:text-2xl">
                &ldquo;{current.quote}&rdquo;
              </p>
              <footer className="mt-6 font-mono text-xs tracking-widemono text-boneDim">
                {current.name} — {current.role}
              </footer>
            </motion.blockquote>
          </AnimatePresence>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={() => go(-1)}
            className="border border-line px-4 py-2 font-mono text-xs text-boneDim transition-colors hover:border-amber hover:text-amber"
            aria-label="Previous testimonial"
          >
            &larr; PREV
          </button>
          <button
            onClick={() => go(1)}
            className="border border-line px-4 py-2 font-mono text-xs text-boneDim transition-colors hover:border-amber hover:text-amber"
            aria-label="Next testimonial"
          >
            NEXT &rarr;
          </button>
        </div>
      </div>
    </section>
  );
}
