"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger, REDUCED_MOTION } from "@/lib/gsap";

const LenisContext = createContext<Lenis | null>(null);

/** Current Lenis instance, or null when smooth scroll is off (reduced motion / SSR). */
export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Gentle smooth scroll driven by GSAP's ticker so Lenis and ScrollTrigger
 * share one animation frame and never drift apart.
 * Touch devices keep native scrolling (syncTouch off) for the best mobile feel.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia(REDUCED_MOTION);
    let instance: Lenis | null = null;

    const tick = (time: number) => instance?.raf(time * 1000);

    const stop = () => {
      gsap.ticker.remove(tick);
      instance?.destroy();
      instance = null;
      setLenis(null);
    };

    const start = () => {
      instance = new Lenis({
        lerp: 0.1, // gentle, settles quickly (not floaty)
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        autoRaf: false,
        anchors: true,
      });
      instance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      setLenis(instance);
    };

    const apply = () => {
      stop();
      if (!reduced.matches) start();
      ScrollTrigger.refresh();
    };

    gsap.ticker.lagSmoothing(0);
    apply();
    reduced.addEventListener("change", apply);

    return () => {
      reduced.removeEventListener("change", apply);
      stop();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
