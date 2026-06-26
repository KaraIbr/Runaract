import { useEffect, useState } from "react";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav
        className={`flex w-full max-w-5xl items-center justify-between rounded-full border px-5 py-2.5 backdrop-blur-xl transition-all duration-500 ${
          scrolled
            ? "border-white/10 bg-ink/80 text-white shadow-editorial"
            : "border-white/15 bg-white/10 text-white"
        }`}
        style={{ boxShadow: scrolled ? "var(--shadow-editorial)" : "none" }}
      >
        <a href="#top" className="flex items-center gap-2 font-display font-bold tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-run-orange text-[11px] font-bold text-white">
            R
          </span>
          <span className="text-sm">Runnaract 2.0</span>
        </a>
      </nav>
    </header>
  );
}
