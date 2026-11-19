"use client";

import { useCallback, useRef, useState } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";
import { HeroContent } from "./HeroContent";
import { HeroVideo } from "./HeroVideo";
import { Loader } from "./Loader";
import { ScrollIndicator } from "./ScrollIndicator";

/**
 * Full-height film hero. Desktop: video fills the section, copy sits left over a cream fade.
 * Mobile (< lg): video on top (65svh, below the header), copy underneath on cream.
 * Scroll: video eases to 1.05 while the copy drifts up slightly faster (gentle parallax).
 * data-hero tells the navbar it sits over the film (icons get a frosted pill, see globals.css).
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [introDone, setIntroDone] = useState(false);
  const reveal = useCallback(() => setIntroDone(true), []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const scroll = { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-media]", { scale: 1.05, ease: "none", scrollTrigger: { ...scroll } });
        gsap.to("[data-hero-content]", { y: -70, ease: "none", scrollTrigger: { ...scroll } });
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      data-hero
      aria-label="Introduction"
      className="relative overflow-hidden bg-cream lg:h-svh lg:min-h-160"
    >
      <Loader onReveal={reveal} />

      {/* Media. Mobile starts below the fixed header so the logo never sits over the face. */}
      <div data-hero-media className="relative mt-25 h-[65svh] lg:absolute lg:inset-0 lg:mt-0 lg:h-auto">
        <HeroVideo />
        <div aria-hidden className="fade-cream-down absolute inset-x-0 top-0 h-6 lg:hidden" />
        <div aria-hidden className="fade-cream-right absolute inset-0 hidden lg:block" />
        <div aria-hidden className="fade-cream-up absolute inset-x-0 bottom-0 h-1/2 lg:h-60" />
      </div>

      {/* Copy. Desktop: vertically centred in the space below the 108px header. */}
      <div
        data-hero-content
        className="relative z-10 -mt-16 pb-20 lg:absolute lg:inset-0 lg:mt-0 lg:flex lg:items-center lg:pb-0 lg:pt-27"
      >
        <HeroContent play={introDone} />
      </div>

      <div
        className={cn(
          "absolute inset-x-0 bottom-10 z-10 hidden transition-opacity delay-1000 duration-1000 ease-luxe lg:block",
          introDone ? "opacity-100" : "opacity-0",
        )}
      >
        <Container>
          <ScrollIndicator />
        </Container>
      </div>
    </section>
  );
}
