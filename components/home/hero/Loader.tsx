"use client";

import { useEffect, useRef } from "react";
import { gsap, useGSAP, REDUCED_MOTION } from "@/lib/gsap";
import { EASE } from "@/lib/motion";
import { INTRO_SEEN_KEY } from "@/lib/intro";
import { useLenis } from "@/components/layout/SmoothScroll";

const LETTERS = "VELOUR".split("");

function readSeen() {
  try {
    return sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markSeen() {
  try {
    sessionStorage.setItem(INTRO_SEEN_KEY, "1");
  } catch {
    /* storage unavailable: the intro may show again, which is harmless */
  }
}

type LoaderProps = {
  /** Called as the loader starts lifting, or immediately when it is skipped. Must be stable. */
  onReveal: () => void;
};

/**
 * First-visit intro (~1.6s): VELOUR letters fade up one by one, then the cream panel lifts away.
 * Shown once per session; skipped for reduced motion. The hero video loads underneath meanwhile.
 */
export function Loader({ onReveal }: LoaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const playingRef = useRef(false);

  // Lenis is created after first mount; stop it as soon as it exists if the intro is running.
  useEffect(() => {
    lenisRef.current = lenis;
    if (playingRef.current) lenis?.stop();
  }, [lenis]);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (readSeen() || window.matchMedia(REDUCED_MOTION).matches) {
        gsap.set(el, { display: "none" });
        onReveal();
        return;
      }

      playingRef.current = true;
      document.documentElement.style.overflow = "hidden";
      lenisRef.current?.stop();

      const unlock = () => {
        if (!playingRef.current) return;
        playingRef.current = false;
        document.documentElement.style.overflow = "";
        lenisRef.current?.start();
      };

      gsap
        .timeline({
          onComplete: () => {
            unlock();
            gsap.set(el, { display: "none" });
          },
        })
        .fromTo(
          el.querySelectorAll("[data-letter]"),
          { opacity: 0, yPercent: 40 },
          { opacity: 1, yPercent: 0, duration: 0.5, ease: EASE.gsap, stagger: 0.06 },
        )
        .to(el, { yPercent: -100, duration: 0.75, ease: "power3.inOut" }, "+=0.05")
        // Start the hero reveal while the panel is lifting so the two read as one movement.
        // Only now is the intro "seen": an interrupted intro (unmount) replays next time.
        .call(
          () => {
            markSeen();
            onReveal();
          },
          [],
          "<0.3",
        );

      // Unmounted mid-intro (navigation, React dev double-mount): never leave the page locked.
      return unlock;
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      data-loader
      aria-hidden
      className="fixed inset-0 z-80 grid place-items-center bg-cream text-espresso will-change-transform"
    >
      <p className="flex pl-[0.34em] font-serif text-[2.5rem] font-light uppercase leading-none tracking-[0.34em] lg:text-6xl">
        {LETTERS.map((letter, i) => (
          <span key={i} data-letter className="inline-block">
            {letter}
          </span>
        ))}
      </p>
    </div>
  );
}
