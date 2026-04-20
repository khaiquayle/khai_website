"use client";

import { useEffect, useRef, useState } from "react";

type NavLink = {
  href: string;
  label: string;
};

type StickyNavProps = {
  brand: string;
  mobileBrand?: string;
  links: NavLink[];
};

const TOP_THRESHOLD = 40;
const DESKTOP_DELTA = 8;

export default function StickyNav({
  brand,
  mobileBrand = "Khai Quayle | Dev",
  links,
}: StickyNavProps) {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (mediaQuery.matches) {
        const delta = currentScrollY - lastScrollY.current;
        if (currentScrollY < TOP_THRESHOLD) {
          setIsVisible(true);
        } else if (delta > DESKTOP_DELTA) {
          setIsVisible(false);
        } else if (delta < -DESKTOP_DELTA) {
          setIsVisible(true);
        }
      } else {
        setIsVisible(currentScrollY < TOP_THRESHOLD);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-4 left-1/2 z-30 w-[calc(100%-3rem)] max-w-5xl -translate-x-1/2 rounded-3xl border border-white/10 bg-black/50 px-4 py-3 backdrop-blur transition-all duration-300 ease-out md:rounded-full md:bg-black/20 md:px-6 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-3 opacity-0"
      }`}
    >
      <div className="flex flex-col items-center gap-1.5 text-center md:flex-row md:justify-between md:gap-6 md:text-left">
        <a
          className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-100"
          href="#top"
        >
          <span className="md:hidden">{mobileBrand}</span>
          <span className="hidden md:inline">{brand}</span>
        </a>

        <div className="flex flex-nowrap items-center justify-center gap-x-3 text-[0.7rem] text-neutral-300 md:gap-6 md:text-sm">
          {links.map((link) => (
            <a
              key={link.href}
              className="underline decoration-white/30 underline-offset-4 transition hover:text-white hover:decoration-white md:no-underline"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
