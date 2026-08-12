import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BookingWizard from "@/components/booking/BookingWizard";

export const metadata = {
  title: "Book a consultation — Kiran Studios",
};

// Availability data is live and per-visit — don't statically cache this page.
export const dynamic = "force-dynamic";

export default function BookingPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32 lg:px-0">
        <span className="mb-4 block font-mono text-xs tracking-widemono text-amber">
          FREE CONSULTATION
        </span>
        <h1 className="mb-12 font-display text-3xl text-bone sm:text-4xl">
          Let's talk about your project
        </h1>
        <BookingWizard />
      </main>
      <Footer />
    </>
  );
}
