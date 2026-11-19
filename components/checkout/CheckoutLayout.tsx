"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/react/shallow";
import { useCart } from "@/hooks/useCart";
import { useHydrated } from "@/hooks/useHydrated";
import { checkoutTotals } from "@/lib/shipping";
import { resolveStep, useCheckoutStore } from "@/store/checkout";
import { CheckoutFlow } from "./CheckoutFlow";
import { CheckoutSkeleton } from "./CheckoutSkeleton";
import { MobileSummary } from "./MobileSummary";
import { OrderSummary } from "./OrderSummary";

/**
 * Desktop: form left (58%, cream) | sticky order summary right (42%, ivory, champagne rule).
 * Mobile: collapsible summary bar, then the form. An empty bag is sent back to /cart.
 */
export function CheckoutLayout() {
  const router = useRouter();
  const { hydrated, items, totals } = useCart();
  const checkoutHydrated = useHydrated(useCheckoutStore);
  const progress = useCheckoutStore(useShallow((s) => ({ step: s.step, contact: s.contact, shipping: s.shipping })));
  const shippingMethod = useCheckoutStore((s) => s.shippingMethod);

  // Checkout progress lives in sessionStorage; read it after hydration (skipHydration).
  useEffect(() => {
    void useCheckoutStore.persist.rehydrate();
  }, []);

  const ready = hydrated && checkoutHydrated;
  const empty = ready && items.length === 0;
  useEffect(() => {
    if (empty) router.replace("/cart");
  }, [empty, router]);

  if (!ready || empty) return <CheckoutSkeleton />;

  const summaryTotals = checkoutTotals(totals, shippingMethod);

  return (
    <div className="flex-1 lg:grid lg:grid-cols-[58fr_42fr]">
      <MobileSummary items={items} totals={summaryTotals} />

      <section aria-labelledby="checkout-title" className="px-4 pb-10 pt-8 sm:px-8 lg:px-12 lg:pb-20 lg:pt-12 xl:pr-20">
        <div className="mx-auto max-w-xl lg:ml-auto lg:mr-0">
          <h1 id="checkout-title" className="sr-only">
            Checkout
          </h1>
          <CheckoutFlow step={resolveStep(progress)} items={items} cartTotals={totals} />
        </div>
      </section>

      <aside aria-label="Order summary" className="hidden border-l border-champagne bg-ivory lg:block">
        <div className="sticky top-0 max-w-md px-12 py-12 xl:px-16">
          <h2 className="mb-8 font-serif text-2xl font-light">Order summary</h2>
          <OrderSummary items={items} totals={summaryTotals} />
        </div>
      </aside>
    </div>
  );
}
