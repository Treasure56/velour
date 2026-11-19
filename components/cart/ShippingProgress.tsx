"use client";

import { shippingConfig } from "@/data/shipping";
import { formatPrice } from "@/lib/currency";
import type { CartTotals } from "@/types/cart";

/** "You're ₦45,000 away from free delivery" with a thin champagne bar that fills smoothly. */
export function ShippingProgress({ totals }: { totals: CartTotals }) {
  const threshold = shippingConfig.freeShippingThreshold;
  const unlocked = totals.amountToFreeShipping === 0;
  const progress = Math.min(1, (threshold - totals.amountToFreeShipping) / threshold);

  return (
    <div>
      <p aria-live="polite" className="text-xs">
        {unlocked ? (
          "You've unlocked free delivery ✦"
        ) : (
          <>
            You&apos;re <span className="font-medium tabular-nums">{formatPrice(totals.amountToFreeShipping)}</span> away
            from free delivery
          </>
        )}
      </p>
      <div aria-hidden className="mt-2.5 h-0.5 overflow-hidden rounded-full bg-champagne/30">
        <div
          className="h-full origin-left bg-champagne transition-transform duration-700 ease-luxe motion-reduce:transition-none"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
