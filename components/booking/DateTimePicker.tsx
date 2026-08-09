"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { getUpcomingDates, TIME_SLOTS } from "@/lib/booking";

export default function DateTimePicker({
  date,
  timeSlot,
  onChange,
}: {
  date: string | null;
  timeSlot: string | null;
  onChange: (date: string, timeSlot: string) => void;
}) {
  const dates = getUpcomingDates(14);
  const [takenSlots, setTakenSlots] = useState<Set<string>>(new Set());
  const [justTaken, setJustTaken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedDate = date ?? dates[0].iso;

  // Load existing locks for the selected date, then listen for new
  // ones in real time so two people can't collide on the same slot.
  useEffect(() => {
    let active = true;
    setLoading(true);

    supabase
      .from("slot_locks")
      .select("time_slot")
      .eq("date", selectedDate)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Failed to load slot availability:", error.message);
        }
        setTakenSlots(new Set((data ?? []).map((r) => r.time_slot)));
        setLoading(false);
      });

    const channel = supabase
      .channel(`slot-locks-${selectedDate}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "slot_locks",
          filter: `date=eq.${selectedDate}`,
        },
        (payload) => {
          const slot = (payload.new as { time_slot: string }).time_slot;
          setTakenSlots((prev) => new Set(prev).add(slot));
          setJustTaken(slot);
          if (timeSlot === slot) {
            // The slot the user currently had selected just got taken
            // by someone else — clear their selection.
            onChange(selectedDate, "");
          }
          setTimeout(() => setJustTaken(null), 3000);
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  return (
    <div>
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2">
        {dates.map((d) => {
          const active = selectedDate === d.iso;
          return (
            <button
              key={d.iso}
              type="button"
              onClick={() => onChange(d.iso, "")}
              className={`flex min-w-[64px] flex-col items-center border px-3 py-3 font-mono text-xs transition-colors ${
                active
                  ? "border-amber bg-panel text-amber"
                  : "border-line text-boneDim hover:border-boneDim"
              }`}
            >
              <span className="tracking-widemono">{d.weekday.toUpperCase()}</span>
              <span className="mt-1 text-sm text-bone">{d.label}</span>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {justTaken && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 border border-amber bg-panel px-4 py-2 font-mono text-xs tracking-widemono text-amber"
          >
            {justTaken} was just booked by someone else — pick another slot.
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {TIME_SLOTS.map((slot) => {
          const taken = takenSlots.has(slot);
          const active = timeSlot === slot && !taken;
          return (
            <button
              key={slot}
              type="button"
              disabled={taken || loading}
              onClick={() => onChange(selectedDate, slot)}
              className={`border px-4 py-3 font-mono text-sm transition-colors ${
                taken
                  ? "cursor-not-allowed border-line text-boneDim/40 line-through"
                  : active
                  ? "border-amber bg-amber text-ink"
                  : "border-line text-bone hover:border-boneDim"
              }`}
            >
              {slot}
            </button>
          );
        })}
      </div>
    </div>
  );
}
