import { HOME_COUNTRY, shippingMethods, type ShippingMethod, type ShippingMethodId } from "@/data/shipping";
import type { CartTotals } from "@/types/cart";

export const getShippingMethod = (id: string | null | undefined) =>
  shippingMethods.find((m) => m.id === id) ?? null;

/** Methods offered for an address: Lagos Express only in Lagos, DHL only outside Nigeria. */
export function availableShippingMethods(country: string, state: string): ShippingMethod[] {
  if (country !== HOME_COUNTRY) return shippingMethods.filter((m) => m.id === "international-dhl");
  return shippingMethods.filter(
    (m) => m.id === "nationwide-standard" || (m.id === "lagos-express" && state === "Lagos"),
  );
}

/** Cost of a method for this cart. `totals.shipping === 0` means the cart qualifies for free delivery. */
export const shippingCost = (method: ShippingMethod, totals: CartTotals) =>
  method.freeOverThreshold && totals.shipping === 0 ? 0 : method.price;

/**
 * Cart totals (from lib/cart) with the chosen delivery method added.
 * No method yet: shipping is null ("Calculated at next step") and the total excludes it.
 */
export function checkoutTotals(totals: CartTotals, methodId: ShippingMethodId | null): CartTotals {
  const method = getShippingMethod(methodId);
  if (!method) return { ...totals, shipping: null };
  const shipping = shippingCost(method, totals);
  return { ...totals, shipping, total: totals.total + shipping };
}

const addDays = (date: Date, days: number, workingDays: boolean) => {
  const d = new Date(date);
  let left = days;
  while (left > 0) {
    d.setDate(d.getDate() + 1);
    const weekend = d.getDay() === 0 || d.getDay() === 6;
    if (!workingDays || !weekend) left--;
  }
  return d;
};

/** Earliest and latest delivery dates for an order placed at `from`. */
export function estimatedDelivery(from: Date, method: ShippingMethod) {
  const [min, max] = method.deliveryDays;
  return { earliest: addDays(from, min, method.workingDays), latest: addDays(from, max, method.workingDays) };
}
