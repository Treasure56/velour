"use client";

import { useEffect, useState, type RefObject } from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Button, Container } from "@/components/ui";
import { formatPrice } from "@/lib/currency";
import { EASE } from "@/lib/motion";

type StickyAddToBagProps = {
  /** The main Add to Bag button (wrapper) */
  targetRef: RefObject<HTMLDivElement | null>;
  name: string;
  thumb?: string;
  /** Selected option summary, e.g. '22" · 180%' */
  detail: string;
  price: number;
  /** Receives the clicked button (fly-to-bag starting point) */
  onAddToBag: (from: Element) => void;
  added: boolean;
};

/**
 * Slim bottom bar that slides up once the main Add to Bag button has scrolled out of view
 * (above the viewport), and hides again when that button returns or the footer arrives.
 */
export function StickyAddToBag({ targetRef, name, thumb, detail, price, onAddToBag, added }: StickyAddToBagProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = targetRef.current;
    const footer = document.querySelector("footer");
    if (!target) return;

    let pastButton = false;
    let footerInView = false;
    const apply = () => setVisible(pastButton && !footerInView);

    const buttonObserver = new IntersectionObserver(([entry]) => {
      pastButton = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      apply();
    });
    const footerObserver = new IntersectionObserver(([entry]) => {
      footerInView = entry.isIntersecting;
      apply();
    });
    buttonObserver.observe(target);
    if (footer) footerObserver.observe(footer);
    return () => {
      buttonObserver.disconnect();
      footerObserver.disconnect();
    };
  }, [targetRef]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {visible && (
          <motion.div
            key="sticky-add"
            data-sticky-add
            className="fixed inset-x-0 bottom-0 z-40 border-t border-champagne bg-cream/95 backdrop-blur-md"
            initial={{ y: "100%" }}
            animate={{ y: 0, transition: { duration: 0.5, ease: EASE.bezier } }}
            exit={{ y: "100%", transition: { duration: 0.35, ease: EASE.bezier } }}
          >
            <Container className="flex h-18 items-center gap-3 sm:gap-4">
              {thumb && (
                <div className="relative size-12 shrink-0 overflow-hidden rounded-sm bg-ivory">
                  <Image src={thumb} alt="" fill sizes="48px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif text-lg leading-tight">{name}</p>
                <p className="text-xs text-mocha tabular-nums">
                  {detail ? `${detail} · ` : ""}
                  {formatPrice(price)}
                </p>
              </div>
              <Button size="sm" onClick={(e) => onAddToBag(e.currentTarget)} className="shrink-0">
                {added ? "Added ✓" : "Add to Bag"}
              </Button>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
