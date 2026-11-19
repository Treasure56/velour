"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";
import { Button, Container, RevealText } from "@/components/ui";
import { EASE } from "@/lib/motion";

// Fades start as the headline's lines are rising, so it reads "headline, then the rest".
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.9, ease: EASE.bezier, delay: 0.55 + i * 0.1 },
  }),
};

type HeroContentProps = {
  /** Flips true when the loader lifts (or straight away when it is skipped). */
  play: boolean;
};

export function HeroContent({ play }: HeroContentProps) {
  const state = play ? "show" : "hidden";

  return (
    <MotionConfig reducedMotion="user">
      <Container>
        <div className="max-w-md lg:max-w-[40rem]">
          <motion.p
            data-hero-fade
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate={state}
            className="eyebrow text-mocha"
          >
            The raw hair collection
          </motion.p>

          <RevealText as="h1" play={play} className="mt-5 font-serif text-hero font-light lg:mt-7">
            Hair that moves
            <br />
            like <em className="italic">silk.</em>
          </RevealText>

          <motion.p
            data-hero-fade
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate={state}
            className="mt-6 max-w-[26.25rem] text-body-lg text-mocha lg:mt-8"
          >
            Ethically sourced, 100% raw virgin hair. Made to blend, built to last.
          </motion.p>

          <motion.div
            data-hero-fade
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate={state}
            className="mt-9 flex flex-col gap-3 lg:mt-10 lg:flex-row lg:gap-4"
          >
            <Button href="/shop" size="lg" className="w-full lg:w-auto">
              Shop the Collection
            </Button>
            <Button href="/textures" variant="outline" size="lg" className="w-full lg:w-auto">
              Find Your Texture
            </Button>
          </motion.div>
        </div>
      </Container>
    </MotionConfig>
  );
}
