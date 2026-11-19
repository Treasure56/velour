import type { Product } from "@/types/product";
import { publicFileExists } from "@/lib/public-file";

export type ResolvedProductImages = {
  main?: string;
  hover?: string;
};

/**
 * Server-only: keep only the product images that exist in /public, so cards render an elegant
 * placeholder instead of requesting a missing file (no broken images, no 404s).
 */
export function resolveProductImages(product: Product): ResolvedProductImages {
  const { main, hover } = product.images;
  return {
    main: publicFileExists(main) ? main : undefined,
    hover: publicFileExists(hover) ? hover : undefined,
  };
}

/**
 * Product page gallery. DUMMY for now: [main, hover, main, hover] (hover falls back to main) so the
 * gallery looks full. When real gallery photos exist, return the product's own
 * `product.images.gallery` (filtered with publicFileExists) here instead; nothing else changes.
 */
export function getGalleryImages(images: ResolvedProductImages): string[] {
  if (!images.main) return [];
  const hover = images.hover ?? images.main;
  return [images.main, hover, images.main, hover];
}
