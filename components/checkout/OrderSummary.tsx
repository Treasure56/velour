"use client";

import { CartSummary } from "@/components/cart/CartSummary";
import { PromoCodeInput } from "@/components/cart/PromoCodeInput";
import { describeOptions, lineUnitPrice } from "@/lib/cart";
import type { CartItem, CartTotals } from "@/types/cart";
import { SummaryItem } from "./SummaryItem";

type OrderSummaryProps = {
  items: CartItem[];
  /** Checkout totals (shipping included once a method is chosen) */
  totals: CartTotals;
};

/** Items, promo code, then Subtotal / Discount / Shipping / Total. All figures come from lib/cart + lib/shipping. */
export function OrderSummary({ items, totals }: OrderSummaryProps) {
  return (
    <div>
      <ul className="grid gap-5">
        {items.map((item) => (
          <li key={item.lineId}>
            <SummaryItem
              name={item.name}
              image={item.image}
              optionsLabel={describeOptions(item.options)}
              quantity={item.quantity}
              price={lineUnitPrice(item, totals.codeActive) * item.quantity}
              originalPrice={item.unitPrice * item.quantity}
            />
          </li>
        ))}
      </ul>
      <div className="mt-6 border-t border-champagne pt-5">
        <PromoCodeInput codeActive={totals.codeActive} />
      </div>
      <div className="mt-4">
        <CartSummary totals={totals} pendingShippingLabel="Calculated at next step" large />
      </div>
    </div>
  );
}
