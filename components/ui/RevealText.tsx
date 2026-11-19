"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/lib/gsap";
import { DURATION, EASE, REVEAL_START, STAGGER } from "@/lib/motion";

type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

type RevealTextProps = {
  as?: Tag;
  /** Seconds before the reveal starts once in view */
  delay?: number;
  /**
   * Manual control. Leave undefined to reveal on scroll into view.
   * When provided, the text stays hidden while false and reveals immediately once true
   * (e.g. a hero headline waiting for the intro loader).
   */
  play?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * Reveals text line by line from behind a mask when it scrolls into view. Plays once.
 * Lines re-split on resize / font load; a finished reveal stays finished.
 * Reduced motion: text is shown as-is, never split.
 */
export function RevealText({ as = "h2", delay = 0, play, className, children }: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const Component = as as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (play === false) return; // stays hidden (CSS) until play flips to true

        const split = SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "reveal-line",
          autoSplit: true,
          onSplit(self) {
            gsap.set(el, { visibility: "visible" });
            // Returning the tween lets SplitText sync progress when it re-splits.
            return gsap.from(self.lines, {
              yPercent: 140, // clears the mask's descender padding even at tight display line-heights
              duration: DURATION.slow,
              ease: EASE.gsap,
              stagger: STAGGER.lines,
              delay,
              scrollTrigger:
                play === undefined ? { trigger: el, start: REVEAL_START, once: true } : undefined,
            });
          },
        });
        return () => split.revert();
      });
    },
    { scope: ref, dependencies: [delay, play] },
  );

  return (
    <Component ref={ref} data-reveal="text" className={className}>
      {children}
    </Component>
  );
}
