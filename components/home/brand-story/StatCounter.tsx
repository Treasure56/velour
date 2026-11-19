"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";

type StatCounterProps = {
  value: number;
  suffix?: string;
};

/**
 * Counts up from 0 to `value` once when scrolled into view. The final value is server-rendered
 * (correct without JS / with reduced motion); the count writes straight to the DOM, no re-renders.
 */
export function StatCounter({ value, suffix = "" }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  // Before it's in view (it starts off screen), reset to 0 so the count has somewhere to start.
  useEffect(() => {
    if (!reduced && !inView && ref.current) ref.current.textContent = `0${suffix}`;
  }, [reduced, inView, suffix]);

  useEffect(() => {
    if (reduced || !inView) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: EASE.bezier,
      onUpdate: (n) => {
        if (ref.current) ref.current.textContent = `${Math.round(n)}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [reduced, inView, value, suffix]);

  return (
    <span ref={ref} className="tabular-nums">
      {`${value}${suffix}`}
    </span>
  );
}
