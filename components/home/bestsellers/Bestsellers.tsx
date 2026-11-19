import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, FadeUp, Section } from "@/components/ui";
import { ProductCard } from "@/components/product";
import { bestsellers } from "@/data/products";
import { discountFor } from "@/lib/pricing";
import { resolveProductImages } from "@/lib/product-images";
import { getActivePromotion } from "@/lib/promotion";
import { BestsellersSlider } from "./BestsellersSlider";

/** Bestsellers slider on cream. Cards and copy render on the server; only the slider is client. */
export async function Bestsellers() {
  const promo = await getActivePromotion();

  const slides = bestsellers.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      images={resolveProductImages(product)}
      discount={discountFor(product, promo)}
    />
  ));

  return (
    <Section spacing="md" aria-labelledby="bestsellers-heading" className="overflow-x-clip">
      <Container>
        <BestsellersSlider
          header={
            <FadeUp>
              <p className="eyebrow text-mocha">Bestsellers</p>
              <h2
                id="bestsellers-heading"
                className="mt-4 font-serif text-[clamp(2.5rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.01em]"
              >
                Loved by <em className="italic">many</em>.
              </h2>
            </FadeUp>
          }
          viewAll={
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em]"
            >
              View all
              <ArrowRight
                aria-hidden
                size={14}
                strokeWidth={1.25}
                className="transition-transform duration-500 ease-luxe group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          }
          slides={slides}
        />
      </Container>
    </Section>
  );
}
