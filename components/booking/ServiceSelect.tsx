"use client";

import { motion } from "framer-motion";
import { SERVICES, ServiceType } from "@/lib/booking";

export default function ServiceSelect({
  value,
  onSelect,
}: {
  value: ServiceType | null;
  onSelect: (s: ServiceType) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {SERVICES.map((s, i) => {
        const active = value === s.id;
        return (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className={`flex flex-col items-start gap-2 border p-6 text-left transition-colors ${
              active
                ? "border-amber bg-panel"
                : "border-line hover:border-boneDim"
            }`}
            aria-pressed={active}
          >
            <span className="font-mono text-xs tracking-widemono text-amber">
              {active ? "SELECTED" : "SELECT"}
            </span>
            <span className="font-display text-lg text-bone">{s.label}</span>
            <span className="font-body text-sm text-boneDim">{s.blurb}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
