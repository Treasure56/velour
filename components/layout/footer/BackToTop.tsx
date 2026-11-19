"use client";

import { ArrowUp } from "lucide-react";
import { useLenis } from "@/components/layout/SmoothScroll";

/** Smooth-scrolls to the top with Lenis (native smooth scroll / instant with reduced motion). */
export function BackToTop() {
  const lenis = useLenis();

  const toTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
      return;
    }
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      className="group inline-flex items-center gap-2 py-2 text-xs uppercase tracking-[0.2em] text-cream/60 transition-colors duration-300 hover:text-cream motion-reduce:transition-none"
    >
      Back to top
      <ArrowUp
        aria-hidden
        size={14}
        strokeWidth={1.25}
        className="transition-transform duration-500 ease-luxe group-hover:-translate-y-0.5 motion-reduce:transition-none"
      />
    </button>
  );
}
