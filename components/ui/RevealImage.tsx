"use client";

import { useRef, type ReactNode } from "react";
import Image, { type ImageProps } from "next/image";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { DURATION, EASE, REVEAL_START } from "@/lib/motion";
import { cn } from "@/lib/utils";

type RevealImageProps = ImageProps & {
  /** Seconds before the reveal starts once in view */
  delay?: number;
  /** Classes for the clipping wrapper (set aspect ratio / size here when using `fill`) */
  wrapperClassName?: string;
  /** Rendered over the image and revealed with it (e.g. a video that uses the image as its poster) */
  overlay?: ReactNode;
  /**
   * Gentle parallax inside the frame: total travel in px (e.g. 30 = ±15px) while the frame
   * scrolls past. The image is oversized by this amount so no edge ever shows. Use with `fill`.
   */
  parallax?: number;
};

/**
 * next/image with a clip-path wipe (bottom to top) while the image settles from 1.1 to 1 scale.
 * Plays once. Optional in-frame parallax. Reduced motion: image is shown as-is, still.
 */
export function RevealImage({
  delay = 0,
  wrapperClassName,
  className,
  alt,
  overlay,
  parallax = 0,
  ...imageProps
}: RevealImageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = el?.querySelector("[data-reveal-inner]");
      const drift = el?.querySelector("[data-reveal-parallax]");
      if (!el || !inner) return;

      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        if (drift && parallax > 0) {
          gsap.fromTo(
            drift,
            { y: -parallax / 2 },
            {
              y: parallax / 2,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        }

        gsap
          .timeline({
            delay,
            defaults: { duration: DURATION.slow, ease: EASE.gsap },
            scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
            // Drop the clip entirely afterwards so the wrapper is a plain box again.
            onComplete: () => gsap.set(el, { clipPath: "none" }),
          })
          .fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" })
          .fromTo(inner, { scale: 1.1 }, { scale: 1 }, 0);
      });
    },
    { scope: ref, dependencies: [delay, parallax] },
  );

  const content = (
    <div data-reveal-inner className="relative size-full">
      <Image alt={alt} className={cn("h-full w-full object-cover", className)} {...imageProps} />
      {overlay}
    </div>
  );

  return (
    <div ref={ref} data-reveal="image" className={cn("relative overflow-hidden", wrapperClassName)}>
      {parallax > 0 ? (
        <div
          data-reveal-parallax
          className="absolute inset-x-0"
          style={{ top: -parallax / 2, bottom: -parallax / 2 }}
        >
          {content}
        </div>
      ) : (
        content
      )}
    </div>
  );
}
