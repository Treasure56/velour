import { describeOptions, lineUnitPrice } from "@/lib/cart";
import type { ContactValues, ShippingValues } from "@/lib/checkout-schema";
import type { CartItem, CartTotals } from "@/types/cart";
import type { Order } from "@/types/order";

/** sessionStorage key for the last order (summary only, no payment details). */
export const ORDER_KEY = "velour-order";
/** Fired on window when the saved order changes in this tab (storage events only cover other tabs). */
export const ORDER_EVENT = "velour:order";

/** e.g. "VLR-48213" */
export const createOrderNumber = () => `VLR-${Math.floor(10_000 + Math.random() * 90_000)}`;

export function buildOrder(input: {
  number: string;
  createdAt: Date;
  contact: ContactValues;
  shipping: ShippingValues;
  items: CartItem[];
  totals: CartTotals;
  payment: Order["payment"];
}): Order {
  const { contact, shipping, totals } = input;
  return {
    number: input.number,
    createdAt: input.createdAt.toISOString(),
    email: contact.email,
    phone: contact.phone,
    items: input.items.map((item) => ({
      lineId: item.lineId,
      slug: item.slug,
      name: item.name,
      image: item.image,
      optionsLabel: describeOptions(item.options),
      quantity: item.quantity,
      price: lineUnitPrice(item, totals.codeActive),
      unitPrice: item.unitPrice,
    })),
    totals,
    address: {
      firstName: shipping.firstName,
      lastName: shipping.lastName,
      address: shipping.address,
      apartment: shipping.apartment,
      city: shipping.city,
      state: shipping.state,
      country: shipping.country,
    },
    shippingMethod: shipping.method,
    payment: input.payment,
    cartCleared: false,
  };
}

export function saveOrder(order: Order) {
  try {
    sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    /* Storage blocked (private mode): the confirmation page will send the shopper to /shop. */
  }
  window.dispatchEvent(new Event(ORDER_EVENT));
}

export function readOrderRaw(): string | null {
  try {
    return sessionStorage.getItem(ORDER_KEY);
  } catch {
    return null;
  }
}

export function parseOrder(raw: string | null): Order | null {
  if (!raw) return null;
  try {
    const order = JSON.parse(raw) as Order;
    return order?.number && Array.isArray(order.items) ? order : null;
  } catch {
    return null;
  }
}
