"use client";

import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/currency";
import { EASE } from "@/lib/motion";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";
import { EmptyCart } from "./EmptyCart";
import { PromoCodeInput } from "./PromoCodeInput";
import { ShippingProgress } from "./ShippingProgress";

/**
 * /cart: line items (table-like on desktop) + sticky summary card; on mobile a sticky
 * "Checkout · ₦xxx" bar. Renders a quiet placeholder until the saved cart has loaded.
 */
export function CartPageView() {
  const { hydrated, items, totals } = useCart();

  return (
    <Container size="narrow" className="pt-32 lg:pt-36">
      <h1 className="font-serif text-[clamp(2.25rem,4vw,3.25rem)] font-light leading-[1.05]">
        Your <em className="italic">Bag.</em>
        {hydrated && items.length > 0 && (
          <span className="ml-3 align-middle font-sans text-sm text-mocha tabular-nums">({totals.itemCount})</span>
        )}
      </h1>

      {!hydrated ? (
        <div aria-hidden className="mt-10 h-64 rounded-sm bg-ivory/60" />
      ) : items.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="mt-10 grid gap-10 pb-28 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-14 lg:pb-0">
          <div>
            <div className="hidden grid-cols-[6.5rem_1fr_auto_8rem] gap-6 border-b border-champagne pb-3 text-[0.6875rem] uppercase tracking-[0.2em] text-mocha sm:grid">
              <span className="col-span-2">Product</span>
              <span>Quantity</span>
              <span className="text-right">Total</span>
            </div>
            <MotionConfig reducedMotion="user">
              <ul>
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.li
                      key={item.lineId}
                      layout
                      className="overflow-hidden border-b border-champagne/60"
                      exit={{ opacity: 0, x: 40, height: 0, transition: { duration: 0.4, ease: EASE.bezier } }}
                      transition={{ layout: { duration: 0.4, ease: EASE.bezier } }}
                    >
                      <div className="py-6">
                        <CartItem item={item} codeActive={totals.codeActive} variant="page" />
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            </MotionConfig>
          </div>

          <aside className="h-fit rounded-sm border border-champagne bg-ivory p-6 lg:sticky lg:top-[calc(var(--sticky-top)+2rem)] lg:transition-[top] lg:duration-400">
            <ShippingProgress totals={totals} />
            <div className="mt-6">
              <PromoCodeInput codeActive={totals.codeActive} />
            </div>
            <div className="mt-4">
              <CartSummary totals={totals} />
            </div>
            <Button href="/checkout" variant="dark" className="mt-6 hidden w-full lg:inline-flex">
              Checkout
            </Button>
            <p className="mt-3 hidden text-center text-[0.6875rem] text-mocha lg:block">
              Secure checkout · Pay in instalments available
            </p>
          </aside>
        </div>
      )}

      {hydrated && items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-champagne bg-cream/95 p-4 backdrop-blur-md lg:hidden">
          <Button href="/checkout" variant="dark" className="w-full">
            Checkout · {formatPrice(totals.total)}
          </Button>
        </div>
      )}
    </Container>
  );
}
