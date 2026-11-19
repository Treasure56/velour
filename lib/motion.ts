/**
 * Shared motion language. GSAP, Motion (framer-motion) and CSS all read from here
 * so every animation on the site moves the same way.
 * Premium means restraint: subtle, 0.6–1s, no bounce.
 */

export const EASE = {
  /** GSAP ease string */
  gsap: "power3.out",
  /** CSS / Tailwind (also exposed as the `ease-luxe` utility) */
  css: "cubic-bezier(0.22, 1, 0.36, 1)",
  /** Motion (framer-motion) cubic-bezier array */
  bezier: [0.22, 1, 0.36, 1] as const,
} as const;

/** Seconds */
export const DURATION = {
  fast: 0.6,
  base: 0.8,
  slow: 1,
} as const;

export const STAGGER = {
  lines: 0.08,
} as const;

/** ScrollTrigger start position used by every in-view reveal */
export const REVEAL_START = "top 85%";
