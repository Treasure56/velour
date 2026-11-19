"use client";

import { useState } from "react";
import { getSalePrice, getUnitPrice } from "@/lib/pricing";
import type { Product } from "@/types/product";

export const MIN_QTY = 1;
export const MAX_QTY = 10;

/**
 * Selection state for the product page: length, density and quantity, plus the live unit price.
 * Defaults: the shortest length and the lowest-priced density.
 */
export function useProductOptions(product: Product, discount: number | null) {
  const { lengths, densities = [] } = product.options;

  const [inches, setInches] = useState<number | null>(
    lengths.length ? Math.min(...lengths.map((l) => l.inches)) : null,
  );
  const [density, setDensity] = useState<string | null>(
    densities.length ? [...densities].sort((a, b) => a.priceAddOn - b.priceAddOn)[0].label : null,
  );
  const [quantity, setQuantityRaw] = useState(MIN_QTY);
  const setQuantity = (q: number) => setQuantityRaw(Math.min(MAX_QTY, Math.max(MIN_QTY, q)));

  const price = getUnitPrice(product, { inches, density });
  const salePrice = getSalePrice(price, discount);

  return {
    inches,
    setInches,
    density,
    setDensity,
    quantity,
    setQuantity,
    /** Regular unit price for the current selection */
    price,
    /** Unit price after any live promotion */
    salePrice,
    onSale: salePrice < price,
  };
}

export type ProductOptions = ReturnType<typeof useProductOptions>;
