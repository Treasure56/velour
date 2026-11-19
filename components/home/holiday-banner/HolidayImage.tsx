"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/lib/gsap";
import { DURATION, EASE } from "@/lib/motion";
import type { Promotion } from "@/data/promotions";
import { cn } from "@/lib/utils";

// Eight tiny champagne points, mostly over the bokeh on the right. [top, left, seconds, delay]
const SPARKLES: [string, string, number, number][] = [
  ["9%", "52%", 6.5, 0],
  ["18%", "88%", 7.5, 1.6],
  ["31%", "71%", 5.5, 3.1],
  ["14%", "63%", 8, 4.4],
  ["44%", "93%", 6, 2.2],
  ["6%", "79%", 7, 5.3],
  ["38%", "57%", 8.5, 0.9],
  ["24%", "96%", 6.5, 3.8],
];

type HolidayImageProps = {
  image: Promotion["image"];
  className?: string;
};

/**
 * Campaign image. Enters with a gentle 1.06 → 1 settle, then drifts 1 → 1.03 over 12s and back
 * while the section is on screen (paused off screen). The image itself is never filtered or
 * recoloured; only its wrapper is scaled. Reduced motion: completely still, no sparkles.
 */
export function HolidayImage({ image, className }: HolidayImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = ref.current;
      const media = root?.querySelector("[data-holiday-media]");
      if (!root || !media) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let entered = false;
        let inView = false;
        const drift = gsap.to(media, { scale: 1.03, duration: 12, ease: "sine.inOut", repeat: -1, yoyo: true, paused: true });

        gsap.fromTo(
          media,
          { scale: 1.06 },
          {
            scale: 1,
            duration: DURATION.slow,
            ease: EASE.gsap,
            scrollTrigger: { trigger: root, start: "top 80%", once: true },
            onComplete: () => {
              entered = true;
              if (inView) drift.play();
            },
          },
        );

        ScrollTrigger.create({
          trigger: root,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            inView = self.isActive;
            if (!entered) return;
            if (inView) drift.play();
            else drift.pause();
          },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <div data-holiday-media className="absolute inset-0 will-change-transform">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          quality={90}
          sizes="(min-width: 1024px) 75vw, 135vw"
          className="object-cover object-[88%_top] lg:object-center"
        />
      </div>

      {/* Desktop: espresso fade over the image's empty left edge only, so it melts into the section. */}
      <div aria-hidden className="fade-espresso-right absolute inset-0 hidden lg:block" />

      <div aria-hidden className="pointer-events-none absolute inset-0 motion-reduce:hidden">
        {SPARKLES.map(([top, left, seconds, delay], i) => (
          <span
            key={i}
            className="absolute size-1 animate-twinkle rounded-full bg-champagne opacity-0 shadow-[0_0_8px_2px_rgb(216_195_165/0.55)]"
            style={{ top, left, animationDuration: `${seconds}s`, animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}
