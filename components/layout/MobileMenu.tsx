"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";
import { Search, User, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { primaryNav } from "@/lib/navigation";
import { DURATION, EASE } from "@/lib/motion";
import { Logo } from "./Logo";

type MobileMenuProps = {
  open: boolean;
  /** Must be stable (useCallback) */
  onClose: () => void;
};

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DURATION.slow, ease: EASE.bezier } },
};

/** Full-screen cream menu for < 1024px. Focus is trapped, Esc closes, page scroll is locked. */
export function MobileMenu({ open, onClose }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, open, onClose);
  useScrollLock(open);

  // Close if the viewport grows to desktop while open.
  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onChange = () => desktop.matches && onClose();
    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, [open, onClose]);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            ref={panelRef}
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-[60] flex flex-col bg-cream text-espresso lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: DURATION.fast, ease: EASE.bezier } }}
            exit={{ opacity: 0, transition: { duration: 0.4, ease: EASE.bezier } }}
          >
            <Container className="grid h-16 shrink-0 grid-cols-[1fr_auto_1fr] items-center">
              <button
                type="button"
                data-autofocus
                onClick={onClose}
                aria-label="Close menu"
                className="-ml-3 grid size-11 place-items-center"
              >
                <X aria-hidden size={22} strokeWidth={1.25} />
              </button>
              <Logo onClick={onClose} />
              <span />
            </Container>

            <Container className="flex flex-1 flex-col justify-between overflow-y-auto pb-10 pt-10">
              <nav aria-label="Menu links">
                <motion.ul variants={list} initial="hidden" animate="show" className="grid gap-2">
                  {primaryNav.map((link) => (
                    <motion.li key={link.href} variants={item}>
                      <Link
                        href={link.href}
                        onClick={onClose}
                        className="block py-1 font-serif text-h1 font-light"
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </motion.ul>
              </nav>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5, duration: DURATION.base, ease: EASE.bezier } }}
                className="mt-12 grid gap-6 border-t border-champagne pt-8"
              >
                <div className="flex gap-8">
                  <Link href="/search" onClick={onClose} className="eyebrow flex items-center gap-3 py-2">
                    <Search aria-hidden size={18} strokeWidth={1.25} />
                    Search
                  </Link>
                  <Link href="/account" onClick={onClose} className="eyebrow flex items-center gap-3 py-2">
                    <User aria-hidden size={18} strokeWidth={1.25} />
                    Account
                  </Link>
                </div>
                <p className="text-small text-mocha">Worldwide shipping on every order.</p>
              </motion.div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
