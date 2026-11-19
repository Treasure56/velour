import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, FadeUp, StaggerItem, StaggerList } from "@/components/ui";
import { textures } from "@/data/textures";
import { publicFileExists } from "@/lib/public-file";
import { TextureCard } from "./TextureCard";

// Mobile: 78vw cards in a snap carousel. Tablet: 2×2. Desktop: 4 in a row.
const CARD_SIZES = "(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 78vw";

export function ShopByTexture() {
  // Only pass hover videos that actually exist, so cards never request a missing file.
  const items = textures.map((t) => ({
    ...t,
    video: t.video && publicFileExists(t.video) ? t.video : undefined,
  }));

  return (
    <section aria-labelledby="shop-by-texture" className="overflow-x-clip bg-cream py-24 lg:py-36">
      <Container>
        <FadeUp className="mb-10 flex items-end justify-between gap-6 lg:mb-14">
          <div>
            <p className="eyebrow text-mocha">Shop by texture</p>
            <h2
              id="shop-by-texture"
              className="mt-4 font-serif text-[clamp(2.5rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.01em]"
            >
              Find your <em className="italic">texture</em>.
            </h2>
          </div>
          <Link
            href="/shop"
            className="group mb-2 inline-flex shrink-0 items-center gap-2 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em]"
          >
            View all
            <ArrowRight
              aria-hidden
              size={14}
              strokeWidth={1.25}
              className="transition-transform duration-500 ease-luxe group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </FadeUp>

        <StaggerList className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 scrollbar-none sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4 [&::-webkit-scrollbar]:hidden">
          {items.map((texture) => (
            <StaggerItem key={texture.slug} className="w-[78vw] shrink-0 snap-start sm:w-auto">
              <TextureCard texture={texture} sizes={CARD_SIZES} />
            </StaggerItem>
          ))}
        </StaggerList>
      </Container>
    </section>
  );
}
