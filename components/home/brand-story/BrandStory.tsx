import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, FadeUp, RevealImage, Section } from "@/components/ui";
import { brandStory } from "@/data/brand-story";
import { StatCounter } from "./StatCounter";

/**
 * Brand story on ivory: craft image left (reveal + gentle in-frame parallax), copy and three
 * counting stats right.
 */
export function BrandStory() {
  const { eyebrow, heading, body, link, stats, image } = brandStory;

  return (
    <Section background="ivory" spacing="lg" aria-labelledby="brand-story-heading">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <RevealImage
          src={image.src}
          alt={image.alt}
          fill
          parallax={30}
          sizes="(min-width: 1024px) 45vw, 100vw"
          wrapperClassName="aspect-4/5 w-full rounded-sm"
        />

        <FadeUp className="max-w-120">
          <p className="eyebrow text-mocha">{eyebrow}</p>
          <h2
            id="brand-story-heading"
            className="mt-4 font-serif text-[clamp(2.5rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.01em]"
          >
            {heading.lead} <em className="italic">{heading.emphasis}</em>
          </h2>
          <p className="mt-6 text-base text-mocha">{body}</p>
          <Link
            href={link.href}
            className="group mt-7 inline-flex items-center gap-2 py-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em]"
          >
            {link.label}
            <ArrowRight
              aria-hidden
              size={14}
              strokeWidth={1.25}
              className="transition-transform duration-500 ease-luxe group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>

          <dl className="mt-10 grid grid-cols-3 divide-x divide-champagne border-t border-champagne pt-8">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 first:pl-0 last:pr-0">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="font-serif text-5xl font-light leading-none">
                  <StatCounter value={stat.value} suffix={stat.suffix} />
                </dd>
                <dd aria-hidden className="mt-2 text-xs uppercase tracking-[0.18em] text-mocha">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </FadeUp>
      </Container>
    </Section>
  );
}
