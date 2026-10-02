"use client";

import { useEffect, useRef, useState } from "react";

const NAV_ITEMS = [
  { label: "Home", href: "#top" },
  { label: "Expertise", href: "#expertise" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Journey", href: "#journey" },
  { label: "Showcase", href: "#showcase" },
  { label: "Contact", href: "#contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("#top");

  /** Sliding pill behind the active nav link — measured from the DOM so it
   * tracks each label's real width instead of a fixed guess. */
  const navRef = useRef<HTMLElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  useEffect(() => {
    const measure = () => {
      const nav = navRef.current;
      const link = linkRefs.current[active];
      if (!nav || !link) return;
      const navRect = nav.getBoundingClientRect();
      const linkRect = link.getBoundingClientRect();
      setIndicator({ left: linkRect.left - navRect.left, width: linkRect.width });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.querySelector(item.href)).filter(
      (el): el is Element => el !== null
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4 sm:top-6">
      <div className="glass-card flex w-full items-center justify-between gap-2 rounded-full px-3 py-2 sm:w-auto sm:px-4 md:inline-flex">
        <nav ref={navRef} className="relative hidden items-center gap-1 md:flex">
          {indicator && (
            <span
              aria-hidden
              className="absolute inset-y-0 rounded-full border border-white/70 transition-[left,width] duration-300 ease-out"
              style={{ left: indicator.left, width: indicator.width }}
            />
          )}
          {NAV_ITEMS.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                ref={(el) => {
                  linkRefs.current[item.href] = el;
                }}
                href={item.href}
                data-cursor-hover
                className={`mono-tel relative z-10 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
                  isActive ? "text-white" : "text-text-muted hover:text-neon"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        <div className="hidden h-5 w-px bg-border md:block" />

        <a
          href="#top"
          data-cursor-hover
          className="mono-tel flex h-8 w-8 items-center justify-center rounded-full border border-border-strong text-xs text-neon md:hidden"
        >
          EG
        </a>

        <button
          type="button"
          data-cursor-hover
          onClick={scrollToTop}
          aria-label="Back to top"
          className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border-strong text-neon transition-colors hover:bg-neon hover:text-bg md:flex"
        >
          <span className="text-sm">↑</span>
        </button>

        <button
          type="button"
          data-cursor-hover
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-full border border-border-strong md:hidden"
        >
          <span
            className={`h-px w-4 bg-neon transition-transform duration-200 ${menuOpen ? "translate-y-[3.5px] rotate-45" : ""}`}
          />
          <span
            className={`h-px w-4 bg-neon transition-transform duration-200 ${menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`}
          />
        </button>
      </div>

      {menuOpen && (
        <nav className="glass-card absolute inset-x-4 top-[calc(100%+8px)] flex flex-col gap-1 rounded-3xl p-3 md:hidden">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              data-cursor-hover
              onClick={() => setMenuOpen(false)}
              className={`mono-tel rounded-full px-4 py-3 text-sm uppercase tracking-[0.15em] transition-colors ${
                active === item.href
                  ? "border border-white/70 text-white"
                  : "border border-transparent text-text-muted hover:text-neon"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
