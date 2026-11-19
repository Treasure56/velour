"use client";

import { AnimatedPrice } from "@/components/ui/AnimatedPrice";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { CartTotals } from "@/types/cart";

type CartSummaryProps = {
  totals: CartTotals;
  /** Shipping text while the cost isn't known yet */
  pendingShippingLabel?: string;
  /** Larger total (checkout) */
  large?: boolean;
};

/** Subtotal, Discount (when a code applies), Shipping, Total. Figures roll when they change. */
export function CartSummary({ totals, pendingShippingLabel = "Calculated at checkout", large = false }: CartSummaryProps) {
  return (
    <dl className="grid gap-2 text-sm">
      <div className="flex justify-between">
        <dt className="text-mocha">Subtotal</dt>
        <dd>
          <AnimatedPrice value={totals.subtotal} />
        </dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between">
          <dt className="text-mocha">Discount</dt>
          <dd className="rounded-sm bg-blush px-1.5 tabular-nums">−{formatPrice(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-mocha">Shipping</dt>
        <dd>
          {totals.shipping === null ? (
            pendingShippingLabel
          ) : totals.shipping === 0 ? (
            "Free"
          ) : (
            <AnimatedPrice value={totals.shipping} />
          )}
        </dd>
      </div>
      <div className="mt-2 flex items-baseline justify-between border-t border-champagne pt-3">
        <dt className="text-xs font-medium uppercase tracking-[0.18em]">Total</dt>
        <dd>
          <AnimatedPrice value={totals.total} className={cn("font-serif", large ? "text-[2rem] font-light" : "text-2xl")} />
        </dd>
      </div>
    </dl>
  );
}
