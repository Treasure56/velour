"use client";

import type { ReactNode } from "react";
import { useAddToBag } from "@/hooks/useAddToBag";
import { toCartItem } from "@/lib/cart";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/product";

type QuickAddButtonProps = {
  product: Product;
  image?: string;
  discount: number | null;
  className?: string;
  children: ReactNode;
};

/**
 * Card "Quick add". Products without options are added straight away (with the fly-to-bag);
 * products with length/density options open the QuickAddModal.
 */
export function QuickAddButton({ product, image, discount, className, children }: QuickAddButtonProps) {
  const addToBag = useAddToBag();
  const openQuickAdd = useCartStore((s) => s.openQuickAdd);
  const hasOptions = product.options.lengths.length > 0 || (product.options.densities?.length ?? 0) > 0;

  return (
    <button
      type="button"
      aria-label={`Quick add ${product.name}`}
      aria-haspopup={hasOptions ? "dialog" : undefined}
      className={className}
      onClick={(e) => {
        if (hasOptions) openQuickAdd({ product, image, discount });
        else void addToBag(toCartItem(product, { inches: null, density: null }, 1, image, discount), e.currentTarget);
      }}
    >
      {children}
    </button>
  );
}
