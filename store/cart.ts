"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { clampQty, makeLineId, validatePromoCode, type PromoCheck } from "@/lib/cart";
import type { CartItem, CartItemInput } from "@/types/cart";
import type { Product } from "@/types/product";

/** Product waiting in the quick-add modal (products with options). */
export type QuickAddTarget = { product: Product; image?: string; discount: number | null };

type CartState = {
  // Persisted
  items: CartItem[];
  appliedCode: string | null;
  // UI only
  isDrawerOpen: boolean;
  quickAdd: QuickAddTarget | null;

  addItem: (input: CartItemInput) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  applyCode: (code: string) => PromoCheck;
  removeCode: () => void;
  openQuickAdd: (target: QuickAddTarget) => void;
  closeQuickAdd: () => void;
};

/**
 * Cart store (localStorage "velour-cart"). Only items and the applied code persist.
 * skipHydration: the cart is read from storage after mount (see useHydrated) so server and first
 * client render always match.
 */
export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      appliedCode: null,
      isDrawerOpen: false,
      quickAdd: null,

      addItem: (input) =>
        set((state) => {
          const lineId = makeLineId(input);
          const existing = state.items.find((i) => i.lineId === lineId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.lineId === lineId ? { ...i, ...input, lineId, quantity: clampQty(i.quantity + input.quantity) } : i,
              ),
            };
          }
          return { items: [...state.items, { ...input, lineId, quantity: clampQty(input.quantity) }] };
        }),

      removeItem: (lineId) => set((state) => ({ items: state.items.filter((i) => i.lineId !== lineId) })),

      updateQuantity: (lineId, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.lineId === lineId ? { ...i, quantity: clampQty(quantity) } : i)),
        })),

      clearCart: () => set({ items: [], appliedCode: null }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      applyCode: (code) => {
        const result = validatePromoCode(code, Date.now());
        if (result.ok) set({ appliedCode: result.code });
        return result;
      },
      removeCode: () => set({ appliedCode: null }),

      openQuickAdd: (target) => set({ quickAdd: target }),
      closeQuickAdd: () => set({ quickAdd: null }),
    }),
    {
      name: "velour-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, appliedCode: state.appliedCode }),
      skipHydration: true,
    },
  ),
);
