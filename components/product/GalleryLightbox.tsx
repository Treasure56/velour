"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { EASE } from "@/lib/motion";

type GalleryLightboxProps = {
  images: string[];
  name: string;
  /** Open image index, or null when closed */
  index: number | null;
  onChange: (index: number) => void;
  /** Must be stable (useCallback) */
  onClose: () => void;
};

const SWIPE = 50;
const arrow =
  "absolute top-1/2 z-10 grid size-12 -translate-y-1/2 place-items-center rounded-full border border-champagne bg-cream/80 text-espresso transition-colors duration-300 hover:bg-champagne/40";

/** Full-screen cream lightbox: arrows, keyboard (← → Esc), swipe on touch, focus trapped. */
export function GalleryLightbox({ images, name, index, onChange, onClose }: GalleryLightboxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const open = index !== null;
  useFocusTrap(ref, open, onClose);
  useScrollLock(open);

  const go = (step: number) => {
    if (index === null) return;
    onChange((index + step + images.length) % images.length);
  };

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, images.length, onChange]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={`${name} images`}
            className="fixed inset-0 z-70 flex flex-col bg-cream text-espresso"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE.bezier } }}
            exit={{ opacity: 0, transition: { duration: 0.3 } }}
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-8">
              <p className="text-xs tabular-nums tracking-[0.2em] text-mocha">
                {index + 1} / {images.length}
              </p>
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                aria-label="Close"
                className="-mr-3 grid size-11 place-items-center"
              >
                <X aria-hidden size={22} strokeWidth={1.25} />
              </button>
            </div>

            <div
              className="relative flex-1 touch-pan-y select-none"
              onPointerDown={(e) => (startX.current = e.clientX)}
              onPointerUp={(e) => {
                if (startX.current === null) return;
                const dx = e.clientX - startX.current;
                startX.current = null;
                if (Math.abs(dx) > SWIPE) go(dx < 0 ? 1 : -1);
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={index}
                  className="absolute inset-0 m-4 sm:m-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { duration: 0.4, ease: EASE.bezier } }}
                  exit={{ opacity: 0, transition: { duration: 0.2 } }}
                >
                  <Image
                    src={images[index]}
                    alt={`${name}, image ${index + 1} of ${images.length}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button type="button" onClick={() => go(-1)} aria-label="Previous image" className={`${arrow} left-4 sm:left-8`}>
                    <ArrowLeft aria-hidden size={18} strokeWidth={1.25} />
                  </button>
                  <button type="button" onClick={() => go(1)} aria-label="Next image" className={`${arrow} right-4 sm:right-8`}>
                    <ArrowRight aria-hidden size={18} strokeWidth={1.25} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
