"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";
import { EASE } from "@/lib/motion";

const LETTERS = "VELOUR".split("");

const word: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const letter: Variants = {
  hidden: { opacity: 0, y: "0.12em" },
  show: { opacity: 1, y: 0, transition: { duration: 1, ease: EASE.bezier } },
};

/**
 * Huge, faint VELOUR spanning the container exactly: letters are spread edge to edge and the
 * size is in container-query units, so it always fills the width. Letters fade up once in view.
 */
export function FooterWordmark() {
  return (
    <div aria-hidden className="@container select-none overflow-hidden">
      <MotionConfig reducedMotion="user">
        <motion.p
          variants={word}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="flex justify-between font-serif text-[22cqw] font-light leading-[0.78] text-cream/9"
        >
          {LETTERS.map((l, i) => (
            <motion.span key={i} variants={letter} className="inline-block">
              {l}
            </motion.span>
          ))}
        </motion.p>
      </MotionConfig>
    </div>
  );
}
