"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { formatPrice } from "@/lib/currency";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

type AnimatedPriceProps = {
  value: number;
  className?: string;
};

/** A price that rolls softly to its new value (new figure rises in, old one rises away). */
export function AnimatedPrice({ value, className }: AnimatedPriceProps) {
  return (
    <MotionConfig reducedMotion="user">
      <span className="relative inline-flex overflow-hidden align-bottom">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            className={cn("tabular-nums", className)}
            initial={{ opacity: 0, y: "60%" }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE.bezier } }}
            exit={{ opacity: 0, y: "-60%", transition: { duration: 0.3 } }}
          >
            {formatPrice(value)}
          </motion.span>
        </AnimatePresence>
      </span>
    </MotionConfig>
  );
}
