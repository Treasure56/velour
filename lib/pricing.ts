import { getFromPrice } from "@/data/products";
import { holidayPromotion, type Promotion } from "@/data/promotions";
import type { Product } from "@/types/product";

export type ProductSelection = {
  /** Selected length, or null for products without lengths */
  inches: number | null;
  /** Selected density label, or null for products without densities */
  density: string | null;
};

/**
 * Regular (pre-discount) price for one unit of a product with the given options:
 * the length's price (or the product's single price) plus the density add-on.
 */
export function getUnitPrice(product: Product, { inches, density }: ProductSelection): number {
  const lengthPrice = product.options.lengths.find((l) => l.inches === inches)?.price;
  const base = lengthPrice ?? product.price ?? getFromPrice(product);
  const addOn = product.options.densities?.find((d) => d.label === density)?.priceAddOn ?? 0;
  return base + addOn;
}

/**
 * Discount (%) of the current promotion if it's switched on, otherwise null.
 * The end date is enforced on the server by getActivePromotion() (lib/promotion.ts): sections pass
 * its result down explicitly, so an ended sale stops showing everywhere at the same time.
 */
export const promotionDiscount = (): number | null =>
  holidayPromotion.active ? holidayPromotion.discount : null;

/** Discount (%) for one product under a live promotion, or null if the product isn't included. */
export function discountFor(product: Product, promotion: Promotion | null): number | null {
  if (!promotion) return null;
  return (promotion.categories as readonly string[]).includes(product.category) ? promotion.discount : null;
}

/** Price after the promotion discount, rounded to the nearest ₦100. Unchanged when there's no sale. */
export function getSalePrice(price: number, discount: number | null = promotionDiscount()): number {
  if (!discount) return price;
  return Math.round((price * (1 - discount / 100)) / 100) * 100;
}
