"use client";

import { useRef } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/hooks/useCart";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { useScrollLock } from "@/hooks/useScrollLock";
import { EASE } from "@/lib/motion";
import { useCartStore } from "@/store/cart";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { PromoCodeInput } from "./PromoCodeInput";
import { ShippingProgress } from "./ShippingProgress";

/**
 * Right-hand bag drawer (440px desktop, full width mobile) over a dimmed, slightly blurred backdrop.
 * Mounted once in the (site) layout. The saved cart is loaded by CartHydration (root layout).
 */
export function CartDrawer() {
  const isOpen = useCartStore((s) => s.isDrawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const { items, totals } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, isOpen, closeDrawer);
  useScrollLock(isOpen);

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              aria-hidden
              onClick={closeDrawer}
              className="fixed inset-0 z-60 bg-espresso/40 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.5 } }}
              exit={{ opacity: 0, transition: { duration: 0.4 } }}
            />
            <motion.div
              key="panel"
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cart-drawer-title"
              className="fixed inset-y-0 right-0 z-61 flex w-full flex-col bg-cream text-espresso sm:w-110"
              initial={{ x: "100%" }}
              animate={{ x: 0, transition: { duration: 0.5, ease: EASE.bezier } }}
              exit={{ x: "100%", transition: { duration: 0.45, ease: EASE.bezier } }}
            >
              <div className="flex h-18 shrink-0 items-center justify-between border-b border-champagne px-6">
                <h2 id="cart-drawer-title" className="font-serif text-[1.75rem] font-light">
                  Your Bag <span className="text-lg text-mocha tabular-nums">({totals.itemCount})</span>
                </h2>
                <button
                  type="button"
                  data-autofocus
                  onClick={closeDrawer}
                  aria-label="Close bag"
                  className="-mr-3 grid size-11 place-items-center"
                >
                  <X aria-hidden size={20} strokeWidth={1.25} />
                </button>
              </div>

              {items.length === 0 ? (
                <EmptyCart onNavigate={closeDrawer} />
              ) : (
                <>
                  <div className="shrink-0 border-b border-champagne px-6 py-4">
                    <ShippingProgress totals={totals} />
                  </div>

                  <ul data-lenis-prevent className="flex-1 overflow-y-auto overscroll-contain px-6">
                    <AnimatePresence initial>
                      {items.map((item, i) => (
                        <motion.li
                          key={item.lineId}
                          layout
                          className="overflow-hidden border-b border-champagne/60"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE.bezier, delay: 0.15 + i * 0.06 } }}
                          exit={{ opacity: 0, x: 40, height: 0, transition: { duration: 0.4, ease: EASE.bezier } }}
                          transition={{ layout: { duration: 0.4, ease: EASE.bezier } }}
                        >
                          <div className="py-5">
                            <CartItem item={item} codeActive={totals.codeActive} onNavigate={closeDrawer} />
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>

                  <div className="shrink-0 border-t border-champagne px-6 pb-6 pt-5">
                    <PromoCodeInput codeActive={totals.codeActive} />
                    <div className="mt-4">
                      <CartSummary totals={totals} />
                    </div>
                    <Button href="/checkout" variant="dark" onClick={closeDrawer} className="mt-5 w-full">
                      Checkout
                    </Button>
                    <Link
                      href="/cart"
                      onClick={closeDrawer}
                      className="mt-3 block text-center text-xs underline underline-offset-4 hover:text-mocha"
                    >
                      View Bag
                    </Link>
                    <p className="mt-3 text-center text-[0.6875rem] text-mocha">
                      Secure checkout · Pay in instalments available
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
