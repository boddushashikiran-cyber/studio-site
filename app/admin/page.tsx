import { supabaseAdmin } from "@/lib/supabaseAdmin";
import BookingsList from "@/components/admin/BookingsList";

export const metadata = {
  title: "Admin — Kiran Studios",
};

// Always fetch fresh — this page shows live booking data, never cache it.
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const { data, error } = await supabaseAdmin
    .from("bookings")
    .select("id, created_at, name, email, service_type, date, time_slot, message, status")
    .order("date", { ascending: true })
    .order("time_slot", { ascending: true });

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-32">
        <p className="border border-amber bg-panel px-4 py-3 font-mono text-xs text-amber">
          Couldn&apos;t load bookings: {error.message}. Check that
          SUPABASE_SERVICE_ROLE_KEY is set correctly in your environment
          variables.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16 lg:px-0">
      <span className="mb-4 block font-mono text-xs tracking-widemono text-amber">
        ADMIN
      </span>
      <h1 className="mb-12 font-display text-3xl text-bone sm:text-4xl">
        Bookings
      </h1>

      <BookingsList initialBookings={data ?? []} />
    </main>
  );
}
