"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { AnimatedPrice } from "@/components/ui/AnimatedPrice";
import { FadeUp } from "@/components/ui/FadeUp";
import { useAddToBag } from "@/hooks/useAddToBag";
import { useProductOptions } from "@/hooks/useProductOptions";
import { toCartItem } from "@/lib/cart";
import { formatPrice } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";
import { DensitySelector } from "./DensitySelector";
import { LengthSelector } from "./LengthSelector";
import { OPEN_SECTION_EVENT, ProductAccordion } from "./ProductAccordion";
import { ProductActions } from "./ProductActions";
import { QuantityStepper } from "./QuantityStepper";
import { StickyAddToBag } from "./StickyAddToBag";

type ProductInfoProps = {
  product: Product;
  /** Live promotion discount for this product (%), or null */
  discount: number | null;
  /** Promo code shown in the sale note */
  promoCode: string | null;
  thumb?: string;
};

const pill = "rounded-full px-2.5 py-1 text-[0.625rem] font-medium uppercase tracking-[0.14em]";

/**
 * Right-hand column: badges, name, rating, live price, description, option selectors, actions and
 * the accordion. Sticky on desktop; if it's taller than the screen it scrolls until its end is in
 * view, then sticks (top = min(nav offset, viewport - own height), via --info-h).
 */
export function ProductInfo({ product, discount, promoCode, thumb }: ProductInfoProps) {
  const options = useProductOptions(product, discount);
  const { lengths, densities, laceType } = product.options;

  const columnRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = columnRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => el.style.setProperty("--info-h", `${el.offsetHeight}px`));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // ── Add to Bag ──────────────────────────────────────────────────
  const [added, setAdded] = useState(false);
  const addedTimer = useRef<number | undefined>(undefined);
  const addButtonRef = useRef<HTMLDivElement>(null);

  const addToBag = useAddToBag();
  const router = useRouter();
  const { inches, density, quantity } = options;
  const cartLine = useCallback(
    () => toCartItem(product, { inches, density }, quantity, thumb, discount),
    [product, inches, density, quantity, thumb, discount],
  );

  /** Add with the current selection, fly the image to the bag, then open the drawer. */
  const handleAddToBag = useCallback(
    (from: Element | null) => {
      setAdded(true);
      window.clearTimeout(addedTimer.current);
      addedTimer.current = window.setTimeout(() => setAdded(false), 1500);
      void addToBag(cartLine(), from);
    },
    [addToBag, cartLine],
  );

  /** Add and go straight to checkout. */
  const handleBuyNow = useCallback(() => {
    void addToBag(cartLine(), null, { animate: false, openDrawer: false });
    router.push("/checkout");
  }, [addToBag, cartLine, router]);

  const detail = [options.inches ? `${options.inches}"` : null, options.density].filter(Boolean).join(" · ");

  return (
    <>
      <div
        ref={columnRef}
        className="lg:sticky lg:self-start"
        style={{ top: "min(calc(var(--sticky-top) + 2rem), calc(100svh - var(--info-h, 0px) - 2rem))" }}
      >
        <FadeUp>
          {(product.badges.length > 0 || discount) && (
            <div className="mb-4 flex flex-wrap gap-1.5">
              {product.badges.map((b) => (
                <span key={b} className={cn(pill, "border border-champagne bg-ivory")}>
                  {b}
                </span>
              ))}
              {discount ? <span className={cn(pill, "bg-blush")}>-{discount}%</span> : null}
            </div>
          )}

          <h1 className="font-serif text-[clamp(1.75rem,2.6vw,2.5rem)] font-light leading-[1.1] tracking-[-0.01em]">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-xs text-mocha">
            <span className="flex gap-0.5" aria-hidden>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={12}
                  strokeWidth={1.25}
                  className={i < Math.round(product.rating) ? "fill-espresso stroke-espresso" : "fill-none stroke-mocha/60"}
                />
              ))}
            </span>
            <span className="sr-only">Rated {product.rating} out of 5.</span>
            <a
              href="#reviews"
              onClick={() => window.dispatchEvent(new CustomEvent(OPEN_SECTION_EVENT, { detail: "reviews" }))}
              className="underline-offset-4 hover:text-espresso hover:underline"
            >
              ({product.reviewCount} reviews)
            </a>
          </div>

          {/* Live price: the new figure rolls up as the old one rolls away */}
          <div className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <AnimatedPrice value={options.salePrice} className="font-serif text-2xl" />
            {options.onSale && <s className="text-sm text-mocha/60 tabular-nums">{formatPrice(options.price)}</s>}
          </div>
          <p aria-live="polite" className="sr-only">
            Price {formatPrice(options.salePrice)}
          </p>

          {options.onSale && promoCode && (
            <p className="mt-3 inline-block rounded-sm bg-blush/60 px-3 py-1.5 text-xs">
              {discount}% off with code {promoCode}, applied at checkout
            </p>
          )}

          <p className="mt-4 text-sm leading-relaxed text-mocha">{product.description}</p>

          <div aria-hidden className="my-6 h-px bg-champagne" />

          <div className="grid gap-5">
            {lengths.length > 0 && (
              <LengthSelector lengths={lengths} value={options.inches} onChange={options.setInches} />
            )}
            {densities && densities.length > 0 && (
              <DensitySelector densities={densities} value={options.density} onChange={options.setDensity} />
            )}
            {laceType && (
              <p className="text-xs font-medium uppercase tracking-[0.18em]">
                Lace: <span className="font-normal normal-case tracking-normal text-mocha">{laceType}</span>
              </p>
            )}
            <QuantityStepper value={options.quantity} onChange={options.setQuantity} />
          </div>

          <div className="mt-7">
            <ProductActions
              onAddToBag={handleAddToBag}
              onBuyNow={handleBuyNow}
              added={added}
              addButtonRef={addButtonRef}
            />
          </div>

          <div className="mt-8">
            <ProductAccordion product={product} />
          </div>
        </FadeUp>
      </div>

      <StickyAddToBag
        targetRef={addButtonRef}
        name={product.name}
        thumb={thumb}
        detail={detail}
        price={options.salePrice}
        onAddToBag={handleAddToBag}
        added={added}
      />
    </>
  );
}
