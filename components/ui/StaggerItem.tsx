"use client";

import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.base, ease: EASE.bezier } },
};

/** <li> child of <StaggerList>. data-fade: forced visible by the <noscript> rule without JS. */
export function StaggerItem({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <motion.li data-fade className={className} variants={item}>
      {children}
    </motion.li>
  );
}
