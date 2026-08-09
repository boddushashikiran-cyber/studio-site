import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata = {
  title: "Contact — Kiran Studios",
};

export const dynamic = "force-dynamic";

const links = [
  { label: "Email", href: "mailto:hello@kiranstudios.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Dribbble", href: "https://dribbble.com" },
];

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 pb-24 pt-32 lg:grid-cols-[1fr_1fr] lg:px-12">
        <div>
          <span className="mb-4 block font-mono text-xs tracking-widemono text-amber">
            GENERAL INQUIRIES
          </span>
          <h1 className="mb-6 font-display text-4xl text-bone sm:text-5xl">
            Not ready to book a call? Tell us anyway.
          </h1>
          <p className="mb-12 max-w-md font-body text-boneDim">
            If your project isn't fully scoped yet, a quick message works
            better than a calendar slot — we'll follow up with questions
            before suggesting a time to talk.
          </p>

          <div className="flex flex-wrap gap-6 border-t border-line pt-8">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="font-mono text-xs tracking-widemono text-boneDim transition-colors hover:text-amber"
              >
                {l.label.toUpperCase()} &rarr;
              </a>
            ))}
          </div>
        </div>

        <div>
          <ContactForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
