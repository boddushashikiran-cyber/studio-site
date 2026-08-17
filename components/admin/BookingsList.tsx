"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export type AdminBooking = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  service_type: string;
  date: string;
  time_slot: string;
  message: string | null;
  status: string;
};

export default function BookingsList({
  initialBookings,
}: {
  initialBookings: AdminBooking[];
}) {
  const [bookings, setBookings] = useState(initialBookings);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  async function handleDelete(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/bookings/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (res.ok) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  }

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  if (bookings.length === 0) {
    return (
      <div>
        <div className="mb-8 flex items-center justify-between">
          <p className="font-mono text-xs tracking-widemono text-boneDim">
            NO UPCOMING BOOKINGS
          </p>
          <button
            onClick={handleLogout}
            className="font-mono text-xs tracking-widemono text-boneDim hover:text-amber"
          >
            LOG OUT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <span className="font-mono text-xs tracking-widemono text-boneDim">
          {bookings.length} BOOKING{bookings.length === 1 ? "" : "S"}
        </span>
        <button
          onClick={handleLogout}
          className="font-mono text-xs tracking-widemono text-boneDim hover:text-amber"
        >
          LOG OUT
        </button>
      </div>

      <div className="flex flex-col divide-y divide-line border-y border-line">
        {bookings.map((b) => (
          <div
            key={b.id}
            className="grid grid-cols-1 gap-4 py-6 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-start sm:gap-6"
          >
            <div>
              <p className="font-display text-lg text-bone">{b.name}</p>
              <p className="font-mono text-xs text-boneDim">{b.email}</p>
            </div>

            <div>
              <p className="font-mono text-xs tracking-widemono text-amber">
                {b.service_type.toUpperCase()}
              </p>
              <p className="font-body text-sm text-boneDim">
                {new Date(b.date + "T00:00:00").toLocaleDateString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {b.time_slot}
              </p>
            </div>

            <div>
              {b.message ? (
                <p className="line-clamp-3 font-body text-sm text-boneDim">
                  {b.message}
                </p>
              ) : (
                <p className="font-mono text-xs text-boneDim/50">
                  No message
                </p>
              )}
            </div>

            <button
              onClick={() => handleDelete(b.id)}
              disabled={deletingId === b.id}
              className="justify-self-start border border-line px-4 py-2 font-mono text-xs tracking-widemono text-boneDim transition-colors hover:border-amber hover:text-amber disabled:opacity-50 sm:justify-self-end"
            >
              {deletingId === b.id ? "REMOVING…" : "REMOVE"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
