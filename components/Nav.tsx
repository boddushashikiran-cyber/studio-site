import Link from "next/link";

const links = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Nav() {
  return (
    <header className="fixed left-0 right-0 top-0 z-40 flex items-center justify-between px-6 py-6 lg:px-12">
      <Link href="/" className="font-display text-sm tracking-tightest text-bone">
        KIRAN STUDIOS
      </Link>
      <nav className="hidden gap-8 sm:flex">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="font-mono text-xs tracking-widemono text-boneDim transition-colors hover:text-amber"
          >
            {l.label.toUpperCase()}
          </Link>
        ))}
      </nav>
      <Link
        href="/booking"
        className="border border-line px-4 py-2 font-mono text-[10px] tracking-widemono text-bone transition-colors hover:border-amber hover:text-amber"
      >
        BOOK A CALL
      </Link>
    </header>
  );
}
