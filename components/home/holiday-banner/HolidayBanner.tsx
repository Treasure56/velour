import { Button, Container, FadeUp, RevealText } from "@/components/ui";
import { getActivePromotion } from "@/lib/promotion";
import { HolidayImage } from "./HolidayImage";
import { PromoCode } from "./PromoCode";

/**
 * Christmas campaign moment directly below the hero. Renders nothing when the sale is
 * switched off or over (see data/promotions.ts).
 * Desktop: compact espresso band (40vw, 480–620px). The 16:9 image is height-fitted and set 7%
 * past the right edge, so the model on the right bleeds slightly off the page (editorial crop,
 * by request); its empty left edge fades into espresso behind the copy.
 * Mobile: 4:3 image framed on the models, copy below on espresso.
 */
export async function HolidayBanner() {
  const promo = await getActivePromotion();
  if (!promo) return null;

  return (
    <section
      aria-label="Christmas sale"
      className="relative overflow-hidden bg-espresso text-cream [--focus-ring:var(--color-cream)] lg:h-[clamp(480px,40vw,620px)]"
    >
      <HolidayImage
        image={promo.image}
        className="aspect-4/3 w-full lg:absolute lg:inset-y-0 lg:-right-[7%] lg:aspect-video lg:h-full lg:w-auto lg:max-w-full"
      />

      <div className="relative z-10 py-10 lg:flex lg:h-full lg:items-center lg:py-12">
        <Container>
          <div className="max-w-md">
            <FadeUp>
              <p className="eyebrow text-champagne">{promo.eyebrow}</p>
            </FadeUp>

            <RevealText
              as="h2"
              className="mt-3 font-serif text-[clamp(2.25rem,3.6vw,3.5rem)] font-light leading-[1.05] tracking-[-0.01em]"
            >
              {promo.headline.first}
              <br />
              {promo.headline.second} <em className="italic">{promo.headline.emphasis}</em>
            </RevealText>

            <FadeUp delay={0.25} className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <p className="font-serif text-[clamp(2rem,3vw,2.75rem)] font-light italic leading-none text-champagne">
                {promo.discount}% OFF
              </p>
              <p className="text-base text-cream/80">{promo.subtext}</p>
            </FadeUp>

            <FadeUp delay={0.35} className="mt-7 flex flex-col gap-3 sm:flex-row">
              <PromoCode code={promo.code} className="w-full sm:w-auto" />
              <Button href={promo.ctaLink} className="w-full sm:w-auto">
                {promo.ctaLabel}
              </Button>
            </FadeUp>
          </div>
        </Container>
      </div>
    </section>
  );
}
