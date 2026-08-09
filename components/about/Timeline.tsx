"use client";

import { motion } from "framer-motion";

const milestones = [
  {
    year: "Y1",
    title: "Studio founded",
    detail: "Started taking on client work alongside a handful of internal product experiments.",
  },
  {
    year: "Y1",
    title: "First 3D-led site shipped",
    detail: "Lumen's rebrand became the template for how we approach WebGL work: concept before code.",
  },
  {
    year: "Y2",
    title: "10th project shipped",
    detail: "Crossed into mobile with Fieldnote, our first React Native build.",
  },
  {
    year: "Y2",
    title: "Booking system went live",
    detail: "Replaced our own contact form with the same real-time booking flow we now build for clients.",
  },
];

export default function Timeline() {
  return (
    <div className="flex flex-col">
      {milestones.map((m, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="grid grid-cols-[56px_1fr] gap-6 border-l border-line py-6 pl-6"
        >
          <span className="font-mono text-xs tracking-widemono text-amber">
            {m.year}
          </span>
          <div>
            <h3 className="mb-1 font-display text-lg text-bone">{m.title}</h3>
            <p className="font-body text-sm text-boneDim">{m.detail}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
