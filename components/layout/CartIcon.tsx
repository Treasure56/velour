"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

/**
 * Bag icon with the live item count (blush badge, hidden at 0). Opens the cart drawer.
 * data-cart-icon / data-cart-badge are the fly-to-bag landing targets.
 */
export function CartIcon({ className }: { className?: string }) {
  const { totals } = useCart();
  const openDrawer = useCartStore((s) => s.openDrawer);
  const count = totals.itemCount;
  const label = `Open bag, ${count} ${count === 1 ? "item" : "items"}`;

  return (
    <button
      type="button"
      data-cart-icon
      onClick={openDrawer}
      aria-label={label}
      className={cn("relative grid size-11 place-items-center", className)}
    >
      <ShoppingBag aria-hidden size={20} strokeWidth={1.25} />
      <span
        data-cart-badge
        aria-hidden
        className={cn(
          "absolute right-1 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-blush px-1 text-[0.5625rem] font-semibold leading-none tabular-nums text-espresso transition-opacity duration-300",
          count === 0 && "opacity-0",
        )}
      >
        {count}
      </span>
    </button>
  );
}
