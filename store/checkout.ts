"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ShippingMethodId } from "@/data/shipping";
import type { ContactValues, ShippingValues } from "@/lib/checkout-schema";

export const CHECKOUT_STEPS = ["contact", "shipping", "payment"] as const;
export type CheckoutStep = (typeof CHECKOUT_STEPS)[number];

type CheckoutState = {
  step: CheckoutStep;
  contact: ContactValues | null;
  shipping: ShippingValues | null;
  /** Chosen delivery method, kept live so the summary updates before Continue */
  shippingMethod: ShippingMethodId | null;

  goTo: (step: CheckoutStep) => void;
  saveContact: (contact: ContactValues) => void;
  saveShipping: (shipping: ShippingValues) => void;
  setShippingMethod: (method: ShippingMethodId | null) => void;
  reset: () => void;
};

const initial = { step: "contact", contact: null, shipping: null, shippingMethod: null } as const;

/**
 * Checkout progress (sessionStorage "velour-checkout"): contact, address and delivery method only.
 * Payment fields are NEVER part of this store; they live in the payment form's memory.
 */
export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      ...initial,
      goTo: (step) => set({ step }),
      saveContact: (contact) => set({ contact, step: "shipping" }),
      saveShipping: (shipping) => set({ shipping, shippingMethod: shipping.method, step: "payment" }),
      setShippingMethod: (shippingMethod) => set({ shippingMethod }),
      reset: () => set(initial),
    }),
    {
      name: "velour-checkout",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ step, contact, shipping, shippingMethod }) => ({ step, contact, shipping, shippingMethod }),
      skipHydration: true,
    },
  ),
);

/** The step to show: never past a step whose details are missing (e.g. after a manual reload). */
export function resolveStep(state: Pick<CheckoutState, "step" | "contact" | "shipping">): CheckoutStep {
  if (!state.contact) return "contact";
  if (state.step === "payment" && !state.shipping) return "shipping";
  return state.step;
}
