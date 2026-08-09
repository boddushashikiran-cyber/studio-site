"use client";

import { motion } from "framer-motion";

export type BookingDetails = {
  name: string;
  email: string;
  message: string;
};

export default function BookingForm({
  value,
  onChange,
}: {
  value: BookingDetails;
  onChange: (v: BookingDetails) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col gap-6"
    >
      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-widemono text-boneDim">
          NAME
        </span>
        <input
          required
          type="text"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          className="border border-line bg-transparent px-4 py-3 font-body text-bone outline-none focus:border-amber"
          placeholder="Jordan Rivera"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-widemono text-boneDim">
          EMAIL
        </span>
        <input
          required
          type="email"
          value={value.email}
          onChange={(e) => onChange({ ...value, email: e.target.value })}
          className="border border-line bg-transparent px-4 py-3 font-body text-bone outline-none focus:border-amber"
          placeholder="jordan@company.com"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-widemono text-boneDim">
          PROJECT DESCRIPTION
        </span>
        <textarea
          rows={4}
          value={value.message}
          onChange={(e) => onChange({ ...value, message: e.target.value })}
          className="resize-none border border-line bg-transparent px-4 py-3 font-body text-bone outline-none focus:border-amber"
          placeholder="What are you building, and what would a good outcome from this call look like?"
        />
      </label>
    </motion.div>
  );
}
