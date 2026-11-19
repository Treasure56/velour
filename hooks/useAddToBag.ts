"use client";

import { useCallback } from "react";
import { useFlyToBag } from "@/hooks/useFlyToBag";
import { useCartStore } from "@/store/cart";
import type { CartItemInput } from "@/types/cart";

/**
 * The one add-to-bag flow used everywhere: add the line, fly the image to the bag icon, then open
 * the drawer. Pass `openDrawer: false` to skip the drawer (e.g. Buy Now goes to checkout instead).
 */
export function useAddToBag() {
  const addItem = useCartStore((s) => s.addItem);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const fly = useFlyToBag();

  return useCallback(
    async (input: CartItemInput, from: Element | null, options: { openDrawer?: boolean; animate?: boolean } = {}) => {
      addItem(input);
      if (options.animate !== false) await fly(from, input.image);
      if (options.openDrawer !== false) openDrawer();
    },
    [addItem, openDrawer, fly],
  );
}
