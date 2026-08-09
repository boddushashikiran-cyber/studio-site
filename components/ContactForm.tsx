"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setStatus("idle");

    const { error } = await supabase.from("inquiries").insert({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    setSubmitting(false);
    setStatus(error ? "error" : "sent");
    if (!error) {
      setName("");
      setEmail("");
      setMessage("");
    }
  }

  if (status === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="border border-amber bg-panel p-8"
      >
        <h3 className="mb-2 font-display text-xl text-bone">Message sent</h3>
        <p className="font-body text-sm text-boneDim">
          We read every inquiry and reply within a couple of business days.
          If it's urgent, book a call instead.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-widemono text-boneDim">
          NAME
        </span>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-line bg-transparent px-4 py-3 font-body text-bone outline-none focus:border-amber"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-widemono text-boneDim">
          EMAIL
        </span>
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-line bg-transparent px-4 py-3 font-body text-bone outline-none focus:border-amber"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-widemono text-boneDim">
          MESSAGE
        </span>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="resize-none border border-line bg-transparent px-4 py-3 font-body text-bone outline-none focus:border-amber"
        />
      </label>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-amber bg-panel px-4 py-3 font-mono text-xs text-amber"
          >
            Something went wrong sending that. Please try again.
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={submitting}
        className="self-start border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? "SENDING…" : "SEND MESSAGE"}
      </button>
    </form>
  );
}
