import { Container, FadeUp } from "@/components/ui";
import type { Promotion } from "@/data/promotions";
import { products } from "@/data/products";
import { discountFor } from "@/lib/pricing";
import { resolveProductImages } from "@/lib/product-images";
import type { Product } from "@/types/product";
import { ProductCard } from "./ProductCard";

/** Four other products: same texture first, then same category, then anything else. */
function pickRelated(product: Product, count = 4): Product[] {
  const others = products.filter((p) => p.id !== product.id);
  const score = (p: Product) => (p.texture && p.texture === product.texture ? 2 : 0) + (p.category === product.category ? 1 : 0);
  return [...others].sort((a, b) => score(b) - score(a)).slice(0, count);
}

/** "You may also love." Grid of four on desktop, a swipeable row on mobile. Reuses ProductCard. */
export function RelatedProducts({ product, promotion }: { product: Product; promotion: Promotion | null }) {
  const related = pickRelated(product);

  return (
    <section aria-labelledby="related-heading" className="overflow-x-clip py-20 lg:py-28">
      <Container size="narrow">
        <FadeUp>
          <h2
            id="related-heading"
            className="font-serif text-[clamp(2rem,3vw,2.75rem)] font-light leading-[1.05] tracking-[-0.01em]"
          >
            You may also <em className="italic">love.</em>
          </h2>
        </FadeUp>
        <ul className="-mx-4 mt-10 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 scrollbar-none sm:gap-4 lg:mx-0 lg:mt-14 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {related.map((p) => (
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
