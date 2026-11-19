"use client";

import { useHydrated } from "@/hooks/useHydrated";
import { useNow } from "@/hooks/useNow";
import { EMPTY_TOTALS, cartTotals } from "@/lib/cart";
import { useCartStore } from "@/store/cart";

/**
 * Cart items and totals for UI. Before hydration it returns an empty cart, so it is safe to render
 * during prerendering (server and first client render match).
 */
export function useCart() {
  const hydrated = useHydrated();
  const now = useNow();
  const items = useCartStore((s) => s.items);
  const appliedCode = useCartStore((s) => s.appliedCode);

  return {
    hydrated,
    items: hydrated ? items : [],
    appliedCode: hydrated ? appliedCode : null,
    totals: hydrated ? cartTotals(items, appliedCode, now) : EMPTY_TOTALS,
  };
}
