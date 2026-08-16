"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ServiceType } from "@/lib/booking";
import ServiceSelect from "./ServiceSelect";
import DateTimePicker from "./DateTimePicker";
import BookingForm, { BookingDetails } from "./BookingForm";
import ConfirmationScreen from "./ConfirmationScreen";

const STEPS = ["Service", "Date & time", "Your details"] as const;

export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [service, setService] = useState<ServiceType | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [details, setDetails] = useState<BookingDetails>({
    name: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [privateCode, setPrivateCode] = useState<string | null>(null);

  const canAdvance =
    (step === 0 && service !== null) ||
    (step === 1 && date !== null && !!timeSlot) ||
    (step === 2 && details.name.trim() && details.email.trim());

  async function handleSubmit() {
    if (!service || !date || !timeSlot) return;
    setSubmitting(true);
    setError(null);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: details.name.trim(),
        email: details.email.trim(),
        service_type: service,
        date,
        time_slot: timeSlot,
        message: details.message.trim() || null,
      }),
    });

    setSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: "unknown" }));

      if (body.error === "slot_taken") {
        setError(
          "That slot was just taken by someone else. Please pick another time."
        );
        setTimeSlot(null);
        setStep(1);
      } else {
        setError(
          "Something went wrong saving your booking. Please try again."
        );
      }
      return;
    }

    const result = await res.json();
    setPrivateCode(result.privateCode ?? null);
    setConfirmed(true);
  }

  if (confirmed && date && timeSlot) {
    return (
      <ConfirmationScreen date={date} timeSlot={timeSlot} privateCode={privateCode} />
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div className="mb-12 flex items-center gap-4">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 items-center justify-center border font-mono text-[10px] ${
                  i === step
                    ? "border-amber text-amber"
                    : i < step
                    ? "border-boneDim text-boneDim"
                    : "border-line text-boneDim/40"
                }`}
              >
                {i + 1}
              </span>
              <span
                className={`hidden font-mono text-xs tracking-widemono sm:inline ${
                  i === step ? "text-bone" : "text-boneDim/60"
                }`}
              >
                {label.toUpperCase()}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="h-px w-8 bg-line" aria-hidden />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.3 }}
        >
          {step === 0 && (
            <ServiceSelect value={service} onSelect={setService} />
          )}
          {step === 1 && (
            <DateTimePicker
              date={date}
              timeSlot={timeSlot}
              onChange={(d, t) => {
                setDate(d);
                setTimeSlot(t || null);
              }}
            />
          )}
          {step === 2 && (
            <BookingForm value={details} onChange={setDetails} />
          )}
        </motion.div>
      </AnimatePresence>

      {error && (
        <p className="mt-6 border border-amber bg-panel px-4 py-3 font-mono text-xs text-amber">
          {error}
        </p>
      )}

      <div className="mt-10 flex justify-between border-t border-line pt-6">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="font-mono text-xs tracking-widemono text-boneDim transition-colors hover:text-amber disabled:opacity-0"
        >
          &larr; BACK
        </button>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            disabled={!canAdvance}
            onClick={() => setStep((s) => s + 1)}
            className="border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink disabled:cursor-not-allowed disabled:border-line disabled:text-boneDim/40 disabled:hover:bg-transparent"
          >
            CONTINUE &rarr;
          </button>
        ) : (
          <button
            type="button"
            disabled={!canAdvance || submitting}
            onClick={handleSubmit}
            className="border border-amber px-6 py-3 font-mono text-xs tracking-widemono text-amber transition-colors hover:bg-amber hover:text-ink disabled:cursor-not-allowed disabled:border-line disabled:text-boneDim/40 disabled:hover:bg-transparent"
          >
            {submitting ? "BOOKING…" : "CONFIRM BOOKING"}
          </button>
        )}
      </div>
    </div>
  );
}
