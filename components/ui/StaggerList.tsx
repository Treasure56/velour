"use client";

import type { ReactNode } from "react";
import { MotionConfig, motion, type Variants } from "framer-motion";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

type StaggerListProps = {
  className?: string;
  children: ReactNode;
};

/**
 * A <ul> whose <StaggerItem> children fade up one after another (0.1s apart) once the list
 * scrolls into view. Triggered by the list, not each item, so items that are clipped
 * (e.g. later cards in a horizontal carousel) are already visible when reached.
 */
export function StaggerList({ className, children }: StaggerListProps) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.ul
        className={className}
        variants={list}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {children}
      </motion.ul>
    </MotionConfig>
  );
}
