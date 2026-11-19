"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";

const DRAW = 1.2;

/**
 * The signature moment, kept quiet: the Velour bag outline draws itself in, a champagne bow
 * appears on the handle, then the bag settles with a tiny drop. Reduced motion: final state.
 */
export function BagAnimation({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const draw = (delay = 0) =>
    reduced
      ? { initial: false as const }
      : {
          initial: { pathLength: 0, opacity: 0 },
          animate: { pathLength: 1, opacity: 1 },
          transition: { pathLength: { duration: DRAW, ease: EASE.bezier, delay }, opacity: { duration: 0.2, delay } },
        };
  const appear = (delay: number) =>
    reduced
      ? { initial: false as const }
      : { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.6, ease: EASE.bezier, delay } };

  return (
    <motion.svg
      viewBox="0 0 120 140"
      role="img"
      aria-label="A Velour shopping bag tied with a ribbon"
      className={cn("h-32 w-28 text-espresso sm:h-36 sm:w-32", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.1}
      strokeLinecap="round"
      strokeLinejoin="round"
      initial={reduced ? false : { y: -6 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: EASE.bezier, delay: DRAW + 0.35 }}
    >
      {/* Bag body and handle */}
      <motion.path d="M22 52 H98 L104 132 H16 Z" {...draw()} />
      <motion.path d="M44 52 V44 C44 26 76 26 76 44 V52" {...draw(0.15)} />
      {/* Wordmark */}
      <motion.text
        x="60"
        y="96"
        textAnchor="middle"
        className="font-serif"
        fontSize="9"
        letterSpacing="3"
        fill="currentColor"
        stroke="none"
        {...appear(DRAW * 0.75)}
      >
        VELOUR
      </motion.text>
      {/* Ribbon bow on the handle */}
      <motion.g
        className="text-champagne"
        stroke="currentColor"
        strokeWidth={1.4}
        style={{ transformOrigin: "60px 30px" }}
        {...(reduced
          ? { initial: false as const }
          : {
              initial: { opacity: 0, scale: 0.85 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.6, ease: EASE.bezier, delay: DRAW },
            })}
      >
        <path d="M60 30 C54 22 46 24 48 30 C50 35 56 33 60 30 Z" fill="currentColor" fillOpacity={0.35} />
        <path d="M60 30 C66 22 74 24 72 30 C70 35 64 33 60 30 Z" fill="currentColor" fillOpacity={0.35} />
        <path d="M59 31 L55 42 M61 31 L65 42" />
        <circle cx="60" cy="30" r="1.8" fill="currentColor" />
      </motion.g>
    </motion.svg>
  );
}
