import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { QuickAddButton } from "@/components/cart/QuickAddButton";
import { categoryLabel, getFromPrice, textureLabel } from "@/data/products";
import type { ResolvedProductImages } from "@/lib/product-images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { ProductCardImage } from "./ProductCardImage";
import { ProductPrice } from "./ProductPrice";
import { ProductRating } from "./ProductRating";

type ProductCardProps = {
  product: Product;
  /** From resolveProductImages(): missing files are omitted and show a placeholder. */
  images: ResolvedProductImages;
  /** Live promotion discount (%), or null. */
  discount: number | null;
  sizes?: string;
  /** Load the image immediately (cards visible on first paint). */
  eager?: boolean;
  className?: string;
};

const pill = "rounded-full px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.14em]";

/**
 * Reusable product card. The product name link is stretched over the whole card, so the card is a
 * single link to /product/[slug]; "Quick add" sits above it as its own button (no nested interactive elements).
 * Desktop: quick add slides up on hover/focus. Mobile: always-visible bag button.
 */
export function ProductCard({
  product,
  images,
  discount,
  sizes = "(min-width: 1024px) 22vw, (min-width: 640px) 38vw, 75vw",
  eager = false,
  className,
}: ProductCardProps) {
  const { name, slug, texture, category, badges, options, rating, reviewCount } = product;
  const href = `/product/${slug}`;
  const label = texture ? `${textureLabel[texture]} ${categoryLabel[category]}` : categoryLabel[category];

  return (
    <article className={cn("group/card relative", className)}>
      <div className="relative aspect-4/5 overflow-hidden rounded-sm bg-ivory">
        <ProductCardImage name={name} main={images.main} hover={images.hover} sizes={sizes} eager={eager} />

        {(badges.length > 0 || discount) && (
          <div className="pointer-events-none absolute left-3 top-3 z-20 flex flex-wrap gap-1.5">
            {badges.map((badge) => (
              <span key={badge} className={cn(pill, "bg-cream text-espresso")}>
                {badge}
              </span>
            ))}
            {discount ? <span className={cn(pill, "bg-blush text-espresso")}>-{discount}%</span> : null}
          </div>
        )}

        <QuickAddButton
          product={product}
          image={images.main}
          discount={discount}
          className={cn(
            "absolute bottom-3 right-3 z-20 grid size-10 place-items-center rounded-full bg-cream text-espresso",
            "lg:left-3 lg:flex lg:size-auto lg:h-11 lg:items-center lg:justify-center lg:gap-2 lg:rounded-none lg:bg-cream/95",
            "lg:text-[0.6875rem] lg:font-medium lg:uppercase lg:tracking-[0.2em]",
            "lg:translate-y-[calc(100%+0.75rem)] lg:transition-transform lg:duration-500 lg:ease-luxe",
            "lg:group-hover/card:translate-y-0 lg:focus-visible:translate-y-0 motion-reduce:transition-none",
          )}
        >
          <ShoppingBag aria-hidden size={16} strokeWidth={1.25} />
          <span aria-hidden className="hidden lg:inline">
            Quick add
          </span>
        </QuickAddButton>
      </div>

      <div className="mt-4">
        <h3 className="font-serif text-[1.375rem] font-normal leading-tight">
          <Link
            href={href}
            className={cn(
              "focus-visible:outline-none",
              // Stretched link: the whole card is clickable; its focus ring outlines the card.
              "after:absolute after:inset-0 after:z-10 after:rounded-sm after:content-['']",
              "focus-visible:after:outline-solid focus-visible:after:outline-[1.5px] focus-visible:after:outline-offset-[-1.5px] focus-visible:after:outline-(--focus-ring)",
            )}
          >
            {name}
          </Link>
        </h3>
        <p className="mt-1.5 text-xs uppercase tracking-[0.18em] text-mocha">{label}</p>
        <ProductPrice
          price={getFromPrice(product)}
          discount={discount}
          from={options.lengths.length > 1}
          className="mt-2.5"
        />
        <ProductRating rating={rating} reviewCount={reviewCount} className="mt-2" />
      </div>
    </article>
  );
}
