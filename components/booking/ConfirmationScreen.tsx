"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function ConfirmationScreen({
  date,
  timeSlot,
}: {
  date: string;
  timeSlot: string;
}) {
  const prettyDate = new Date(date + "T00:00:00").toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const particles = Array.from({ length: 10 });

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="relative mb-8 h-24 w-24">
        {particles.map((_, i) => {
          const angle = (i / particles.length) * Math.PI * 2;
          return (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-amber"
              initial={{ x: 0, y: 0, opacity: 1 }}
              animate={{
                x: Math.cos(angle) * 70,
                y: Math.sin(angle) * 70,
                opacity: 0,
              }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            />
          );
        })}

        <svg viewBox="0 0 100 100" className="relative h-24 w-24">
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="#E8A33D"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
          <motion.path
            d="M28 52 L44 68 L74 34"
            fill="none"
            stroke="#E8A33D"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="font-display text-2xl text-bone sm:text-3xl"
      >
        Call booked
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.85, duration: 0.5 }}
        className="mt-3 max-w-sm font-body text-sm text-boneDim"
      >
        {prettyDate} at {timeSlot}. A confirmation is on its way to your
        inbox — we'll follow up if anything needs to move.
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-10"
      >
        <Link
          href="/"
          className="border border-line px-6 py-3 font-mono text-xs tracking-widemono text-boneDim transition-colors hover:border-amber hover:text-amber"
        >
          BACK TO HOME
        </Link>
      </motion.div>
    </div>
  );
}
