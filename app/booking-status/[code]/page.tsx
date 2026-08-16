import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const metadata = {
  title: "Your booking — Kiran Studios",
};

// Always live — this is one person's private, current booking status.
export const dynamic = "force-dynamic";

const SERVICE_LABELS: Record<string, string> = {
  "web-design": "Web Design",
  development: "Development",
  branding: "Branding",
  "3d-animation": "3D / Animation",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default async function BookingStatusPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const { data: booking } = await supabaseAdmin
    .from("bookings")
    .select("name, service_type, date, time_slot, message, status")
    .eq("private_code", code)
    .single();

  if (!booking) notFound();

  const prettyDate = new Date(booking.date + "T00:00:00").toLocaleDateString(
    "en-US",
    { weekday: "long", month: "long", day: "numeric" }
  );

  return (
    <>
      <Nav />
      <main className="mx-auto max-w-2xl px-6 pb-24 pt-32 lg:px-0">
        <span className="mb-4 block font-mono text-xs tracking-widemono text-amber">
          YOUR BOOKING
        </span>
        <h1 className="mb-10 font-display text-3xl text-bone sm:text-4xl">
          Hi {booking.name}
        </h1>

        <div className="border border-line bg-panel p-8">
          <div className="mb-6 flex items-center justify-between border-b border-line pb-6">
            <span className="font-mono text-xs tracking-widemono text-boneDim">
              STATUS
            </span>
            <span className="border border-amber px-3 py-1 font-mono text-xs tracking-widemono text-amber">
              {STATUS_LABELS[booking.status] || booking.status}
            </span>
          </div>

          <dl className="flex flex-col gap-4">
            <div className="flex justify-between">
              <dt className="font-mono text-xs tracking-widemono text-boneDim">
                SERVICE
              </dt>
              <dd className="font-body text-bone">
                {SERVICE_LABELS[booking.service_type] || booking.service_type}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-mono text-xs tracking-widemono text-boneDim">
                DATE &amp; TIME
              </dt>
              <dd className="font-body text-bone">
                {prettyDate} · {booking.time_slot}
              </dd>
            </div>
            {booking.message && (
              <div className="flex flex-col gap-2 border-t border-line pt-4">
                <dt className="font-mono text-xs tracking-widemono text-boneDim">
                  YOUR NOTE
                </dt>
                <dd className="font-body text-sm text-boneDim">
                  {booking.message}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <p className="mt-8 font-body text-sm text-boneDim">
          Need to change something? Reply to your confirmation email, or{" "}
          <Link href="/contact" className="text-amber hover:underline">
            get in touch
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
