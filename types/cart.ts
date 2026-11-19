import type { ProductCategory } from "@/types/product";

export type CartItemOptions = {
  /** Inches */
  length?: number;
  density?: string;
  laceType?: string;
};

export type CartItem = {
  /** productId + selected options: same product with the same options = one line */
  lineId: string;
  productId: string;
  slug: string;
  name: string;
  image?: string;
  category: ProductCategory;
  options: CartItemOptions;
  /** Original unit price (Naira) */
  unitPrice: number;
  /** Promotional unit price at the time it was added, if a promotion applied (display hint only) */
  salePrice: number | null;
  quantity: number;
};

/** What callers pass to addItem (the store derives lineId and merges quantities). */
export type CartItemInput = Omit<CartItem, "lineId">;

export type CartTotals = {
  itemCount: number;
  /** Sum of original prices */
  subtotal: number;
  /** Promo-code discount (0 when no valid code is applied) */
  discount: number;
  /** 0 = free; null = calculated at checkout */
  shipping: number | null;
  /** subtotal - discount (+ shipping when known) */
  total: number;
  amountToFreeShipping: number;
  /** True when a valid promo code is applied to a live promotion */
  codeActive: boolean;
};
