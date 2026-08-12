"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong.");
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-line bg-panel p-8"
      >
        <span className="mb-2 block font-mono text-xs tracking-widemono text-amber">
          ADMIN
        </span>
        <h1 className="mb-8 font-display text-2xl text-bone">
          Studio dashboard
        </h1>

        <label className="mb-6 flex flex-col gap-2">
          <span className="font-mono text-xs tracking-widemono text-boneDim">
            PASSWORD
          </span>
          <input
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            className="border border-line bg-transparent px-4 py-3 font-body text-bone outline-none focus:border-amber"
          />
        </label>

        {error && (
          <p className="mb-6 border border-amber bg-ink px-4 py-3 font-mono text-xs text-amber">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "CHECKING…" : "LOG IN"}
        </button>
      </form>
    </main>
  );
}
