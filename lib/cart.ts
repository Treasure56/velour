import { holidayPromotion, type Promotion } from "@/data/promotions";
import { shippingConfig } from "@/data/shipping";
import { getSalePrice, getUnitPrice, type ProductSelection } from "@/lib/pricing";
import type { CartItem, CartItemInput, CartTotals } from "@/types/cart";
import type { Product } from "@/types/product";

export const MAX_LINE_QTY = 10;
export const clampQty = (q: number) => Math.min(MAX_LINE_QTY, Math.max(1, Math.round(q)));

/** Same product + same options = same line. */
export const makeLineId = (item: Pick<CartItem, "productId" | "options">) =>
  [item.productId, item.options.length ?? "", item.options.density ?? ""].join("|");

/** Is the promotion switched on and not yet ended? (Client-side check: pass the current time.) */
export const isPromotionLive = (now: number, promotion: Promotion = holidayPromotion) =>
  promotion.active && now < Date.parse(promotion.endDate);

const isEligible = (category: string, promotion: Promotion = holidayPromotion) =>
  (promotion.categories as readonly string[]).includes(category);

export type PromoCheck = { ok: true; code: string } | { ok: false; error: string };

/** Validate a code typed by the shopper against the promotions config. */
export function validatePromoCode(input: string, now: number, promotion: Promotion = holidayPromotion): PromoCheck {
  const code = input.trim().toUpperCase();
  if (!code) return { ok: false, error: "Please enter a code." };
  if (code !== promotion.code) return { ok: false, error: "That code isn't recognised. Please check and try again." };
  if (!isPromotionLive(now, promotion)) return { ok: false, error: "Sorry, this code has expired." };
  return { ok: true, code };
}

/** True when this line gets the promo-code discount. */
export const lineDiscounted = (item: Pick<CartItem, "category">, codeActive: boolean) =>
  codeActive && isEligible(item.category);

/** Unit price to display/charge for a line (sale price when the code applies to it). */
export const lineUnitPrice = (item: Pick<CartItem, "category" | "unitPrice">, codeActive: boolean) =>
  lineDiscounted(item, codeActive) ? getSalePrice(item.unitPrice, holidayPromotion.discount) : item.unitPrice;

/** All cart totals. `now` is passed in so this stays pure and testable. */
export function cartTotals(items: CartItem[], appliedCode: string | null, now: number): CartTotals {
  const codeActive = appliedCode === holidayPromotion.code && isPromotionLive(now);
  let itemCount = 0;
  let subtotal = 0;
  let afterDiscount = 0;
  for (const item of items) {
    itemCount += item.quantity;
    subtotal += item.unitPrice * item.quantity;
    afterDiscount += lineUnitPrice(item, codeActive) * item.quantity;
  }
  const discount = subtotal - afterDiscount;
  const free = items.length > 0 && afterDiscount >= shippingConfig.freeShippingThreshold;
  return {
    itemCount,
    subtotal,
    discount,
    shipping: free ? 0 : null,
    total: afterDiscount,
    amountToFreeShipping: Math.max(0, shippingConfig.freeShippingThreshold - afterDiscount),
    codeActive,
  };
}

export const EMPTY_TOTALS: CartTotals = {
  itemCount: 0,
  subtotal: 0,
  discount: 0,
  shipping: null,
  total: 0,
  amountToFreeShipping: shippingConfig.freeShippingThreshold,
  codeActive: false,
};

/** Build a cart line from a product and the shopper's selection. */
export function toCartItem(
  product: Product,
  selection: ProductSelection,
  quantity: number,
  image: string | undefined,
  discount: number | null,
): CartItemInput {
  const unitPrice = getUnitPrice(product, selection);
  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    image,
    category: product.category,
    options: {
      ...(selection.inches !== null ? { length: selection.inches } : {}),
      ...(selection.density !== null ? { density: selection.density } : {}),
      ...(product.options.laceType ? { laceType: product.options.laceType } : {}),
    },
    unitPrice,
    salePrice: discount ? getSalePrice(unitPrice, discount) : null,
    quantity: clampQty(quantity),
  };
}

/** e.g. '22" · 180% density' */
export const describeOptions = (o: CartItem["options"]) =>
  [o.length ? `${o.length}"` : null, o.density ? `${o.density} density` : null].filter(Boolean).join(" · ");
