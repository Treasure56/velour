"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart";

/** Loads the saved cart from localStorage once, after hydration (the store uses skipHydration). Root layout. */
export function CartHydration() {
  useEffect(() => {
    void useCartStore.persist.rehydrate();
  }, []);
  return null;
}
