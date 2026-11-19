import type { ShippingMethodId } from "@/data/shipping";
import type { CardBrand } from "@/lib/card";
import type { PaymentMethodId } from "@/lib/payment";
import type { CartTotals } from "@/types/cart";

export type OrderItem = {
  lineId: string;
  slug: string;
  name: string;
  image?: string;
  /** e.g. '22" · 180% density' */
  optionsLabel: string;
  quantity: number;
  /** Unit price charged */
  price: number;
  /** Original unit price (differs from `price` when the promo code applied) */
  unitPrice: number;
};

export type OrderAddress = {
  firstName: string;
  lastName: string;
  address: string;
  apartment: string;
  city: string;
  state: string;
  country: string;
};

/**
 * The only thing saved after payment (sessionStorage). Card payments keep the brand and last
 * four digits for display; the full number is never stored.
 */
export type Order = {
  number: string;
  /** ISO date */
  createdAt: string;
  email: string;
  phone: string;
  items: OrderItem[];
  totals: CartTotals;
  address: OrderAddress;
  shippingMethod: ShippingMethodId;
  payment: { method: PaymentMethodId; brand?: CardBrand | null; last4?: string };
  /** Set once the confirmation page has emptied the bag and the checkout state */
  cartCleared: boolean;
};
