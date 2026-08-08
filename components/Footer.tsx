export default function Footer() {
  return (
    <footer className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-4 border-t border-line px-6 py-10 font-mono text-[10px] tracking-widemono text-boneDim sm:flex-row sm:items-center lg:px-12">
      <span>© {new Date().getFullYear()} HALFTONE STUDIO</span>
      <span>HYDERABAD · REMOTE</span>
    </footer>
  );
}
