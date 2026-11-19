"use client";

import { useEffect } from "react";
import { useLenis } from "@/components/layout/SmoothScroll";

/** Locks page scroll (native and Lenis) while `locked` is true. */
export function useScrollLock(locked: boolean) {
  const lenis = useLenis();

  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    lenis?.stop();

    return () => {
      html.style.overflow = previous;
      lenis?.start();
    };
  }, [locked, lenis]);
}
