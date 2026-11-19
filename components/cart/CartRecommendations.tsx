import { ProductCard } from "@/components/product/ProductCard";
import { Container } from "@/components/ui/Container";
import { FadeUp } from "@/components/ui/FadeUp";
import { bestsellers } from "@/data/products";
import { discountFor } from "@/lib/pricing";
import { resolveProductImages } from "@/lib/product-images";
import { getActivePromotion } from "@/lib/promotion";

/**
 * Server-only (reads the file system for images): "You may also love." with four bestsellers.
 * Import it by path, not from the cart barrel, which client components also use.
 */
export async function CartRecommendations() {
  const promotion = await getActivePromotion();

  return (
    <section aria-labelledby="cart-recs-heading" className="overflow-x-clip py-20 lg:py-28">
      <Container size="narrow">
        <FadeUp>
          <h2
            id="cart-recs-heading"
            className="font-serif text-[clamp(2rem,3vw,2.75rem)] font-light leading-[1.05] tracking-[-0.01em]"
          >
            You may also <em className="italic">love.</em>
          </h2>
        </FadeUp>
        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 scrollbar-none sm:gap-4 lg:mx-0 lg:mt-14 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {bestsellers.slice(0, 4).map((p) => (
            <li key={p.id} className="w-[70vw] shrink-0 snap-start sm:w-[42vw] lg:w-auto">
              <ProductCard
                product={p}
                images={resolveProductImages(p)}
                discount={discountFor(p, promotion)}
                sizes="(min-width: 1200px) 260px, (min-width: 1024px) 22vw, 70vw"
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
