import type { Metadata } from "next";
import { Suspense } from "react";
import { Shop, ShopSkeleton } from "@/components/shop";
import { products } from "@/data/products";
import type { ShopItem } from "@/lib/filter-products";
import { discountFor } from "@/lib/pricing";
import { resolveProductImages } from "@/lib/product-images";
import { getActivePromotion } from "@/lib/promotion";

export const metadata: Metadata = {
  title: "Shop",
  description: "Raw virgin hair wigs, bundles, closures and hair care. Ethically sourced, made to blend.",
};

/**
 * Product data (images, discounts) is prepared on the server; the URL-driven filtering runs in the
 * client <Shop>, which reads search params and so sits inside Suspense (the page shell stays static).
 */
export default async function ShopPage() {
  const promo = await getActivePromotion();
  const items: ShopItem[] = products.map((product) => ({
    product,
    images: resolveProductImages(product),
    discount: discountFor(product, promo),
  }));

  return (
    <Suspense fallback={<ShopSkeleton />}>
      <Shop items={items} saleActive={Boolean(promo)} />
    </Suspense>
  );
}
