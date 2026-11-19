"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

type FadeUpProps = {
  /** Seconds after entering the viewport */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/**
 * Fades content up once when it scrolls into view. Reduced motion: opacity only.
 * data-fade lets the <noscript> rule in the root layout force it visible without JS.
 */
export function FadeUp({ delay = 0, className, children }: FadeUpProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        data-fade
        className={className}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: DURATION.base, ease: EASE.bezier, delay }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
