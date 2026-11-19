import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button, Container, RevealImage, RevealText, Section } from "@/components/ui";
import { placeholders } from "@/lib/media";
import { formatPrice } from "@/lib/currency";

export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

const colours = [
  { name: "Espresso", token: "espresso", hex: "#2B1A14", role: "Main text, dark sections", swatch: "bg-espresso", dark: true },
  { name: "Mocha", token: "mocha", hex: "#6B4A3A", role: "Secondary dark", swatch: "bg-mocha", dark: true },
  { name: "Cream", token: "cream", hex: "#F4ECE1", role: "Main background, the bag", swatch: "bg-cream", dark: false },
  { name: "Champagne", token: "champagne", hex: "#D8C3A5", role: "Accents, lines, hover", swatch: "bg-champagne", dark: false },
  { name: "Blush", token: "blush", hex: "#E9C9C1", role: "Buttons, highlights", swatch: "bg-blush", dark: false },
  { name: "Ivory", token: "ivory", hex: "#FBF8F3", role: "Light surfaces, cards", swatch: "bg-ivory", dark: false },
];

const typeScale: { label: string; spec: string; sample: ReactNode }[] = [
  {
    label: "Display",
    spec: "Cormorant 300 · text-display",
    sample: <p className="font-serif text-display font-light">Velour</p>,
  },
  {
    label: "Heading 1",
    spec: "Cormorant 300 · text-h1",
    // Samples are <p> so the page keeps a single h1 and an ordered outline.
    sample: <p className="font-serif text-h1 font-light">Hair, considered.</p>,
  },
  {
    label: "Heading 2",
    spec: "Cormorant 400 · text-h2",
    sample: <p className="font-serif text-h2">Raw Straight, Body Wave</p>,
  },
  {
    label: "Heading 3",
    spec: "Cormorant 400 · text-h3",
    sample: <p className="font-serif text-h3">Frontal and closure wigs</p>,
  },
  {
    label: "Heading 4",
    spec: "Cormorant 500 · text-h4",
    sample: <p className="font-serif text-h4 font-medium">Care for every length</p>,
  },
  {
    label: "Italic emphasis",
    spec: "Cormorant 300 italic",
    sample: (
      <p className="font-serif text-h2 font-light">
        The art of <em className="italic">effortless</em> volume
      </p>
    ),
  },
  {
    label: "Body",
    spec: "Manrope 400 · text-body",
    sample: (
      <p className="max-w-[60ch] text-body">
        Ethically sourced, single-donor hair, cut and finished by hand. Every bundle is chosen to hold its
        texture wash after wash, so it moves like your own.
      </p>
    ),
  },
  {
    label: "Body large",
    spec: "Manrope 400 · text-body-lg",
    sample: (
      <p className="max-w-[60ch] text-body-lg">
        A quieter way to wear luxury: lengths from twelve to thirty inches, in four signature textures.
      </p>
    ),
  },
  {
    label: "Small",
    spec: "Manrope 400 · text-small",
    sample: (
      <p className="text-small text-mocha">
        Complimentary delivery within Lagos on orders over {formatPrice(250000)}.
      </p>
    ),
  },
  {
    label: "Eyebrow",
    spec: "Manrope 500 · eyebrow",
    sample: <p className="eyebrow">New season · Body Wave</p>,
  },
];

const variants = ["primary", "dark", "outline"] as const;
const sizes = ["sm", "md", "lg"] as const;

function GroupHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <header className="mb-12 md:mb-16">
      <p className="eyebrow mb-4 opacity-70">{eyebrow}</p>
      <h2 className="text-h2 font-light">{title}</h2>
    </header>
  );
}

function ButtonMatrix() {
  return (
    <div className="grid gap-10">
      {variants.map((variant) => (
        <div key={variant} className="grid gap-4 md:grid-cols-[10rem_1fr] md:items-center">
          <p className="eyebrow opacity-70">{variant}</p>
          <div className="flex flex-wrap items-center gap-4">
            {sizes.map((size) => (
              <Button key={size} variant={variant} size={size}>
                Shop {size}
              </Button>
            ))}
          </div>
        </div>
      ))}
      <div className="grid gap-4 md:grid-cols-[10rem_1fr] md:items-center">
        <p className="eyebrow opacity-70">As link</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button href="/style-guide#motion" variant="outline">
            See motion
          </Button>
          <Button disabled>Disabled</Button>
        </div>
      </div>
    </div>
  );
}

export default function StyleGuidePage() {
  return (
    <div>
      {/* Intro */}
      <Section spacing="lg">
        <Container>
          <p className="eyebrow mb-6 text-mocha">Design system</p>
          <RevealText as="h1" className="text-display font-light">
            Style guide
          </RevealText>
          <p className="mt-8 max-w-[52ch] text-body-lg text-mocha">
            The colours, type, buttons and motion that make up VELOUR. Everything here is built from shared
            tokens, so a change in one place carries across the site.
          </p>
        </Container>
      </Section>

      {/* Colour */}
      <Section background="ivory">
        <Container>
          <GroupHeading eyebrow="Colour" title="A warm, quiet palette" />
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
            {colours.map((c) => (
              <li key={c.token}>
                <div
                  className={`${c.swatch} aspect-[4/5] w-full ${
                    c.dark ? "" : "shadow-[inset_0_0_0_1px_rgb(43_26_20/0.08)]"
                  }`}
                />
                <p className="mt-4 font-serif text-h4">{c.name}</p>
                <p className="mt-1 text-small tabular-nums text-mocha">{c.hex}</p>
                <p className="mt-1 text-small text-mocha">{c.role}</p>
                <p className="mt-2 eyebrow opacity-60">{c.token}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* Typography */}
      <Section>
        <Container>
          <GroupHeading eyebrow="Typography" title="Cormorant Garamond and Manrope" />
          <dl className="divide-y divide-champagne/60 border-y border-champagne/60">
            {typeScale.map((t) => (
              <div key={t.label} className="grid gap-4 py-10 md:grid-cols-[14rem_1fr] md:gap-12">
                <dt>
                  <p className="eyebrow">{t.label}</p>
                  <p className="mt-2 text-small text-mocha">{t.spec}</p>
                </dt>
                <dd className="min-w-0">{t.sample}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>

      {/* Buttons */}
      <Section background="ivory" spacing="md">
        <Container>
          <GroupHeading eyebrow="Buttons" title="On a light surface" />
          <ButtonMatrix />
        </Container>
      </Section>
      <Section background="espresso" spacing="md">
        <Container>
          <GroupHeading eyebrow="Buttons" title="On a dark surface" />
          <ButtonMatrix />
        </Container>
      </Section>

      {/* Motion */}
      <Section id="motion" spacing="lg">
        <Container>
          <GroupHeading eyebrow="Motion" title="Reveals, played once" />
          <p className="max-w-[52ch] text-body text-mocha">
            Scroll slowly. Headings rise line by line from behind a mask, images open with a soft wipe as they
            settle into place. With reduced motion turned on, everything simply appears.
          </p>

          <div className="mt-[30vh] grid gap-16 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-7">
              <RevealImage
                src={placeholders.portrait02.src}
                alt={placeholders.portrait02.alt}
                fill
                sizes="(min-width: 768px) 55vw, 100vw"
                wrapperClassName="aspect-[4/5] w-full"
              />
            </div>
            <div className="flex flex-col justify-end md:col-span-4 md:col-start-9">
              <p className="eyebrow mb-6 text-mocha">RevealText · h2</p>
              <RevealText as="h2" className="text-h1 font-light">
                Made to move like it was always <em className="italic">yours.</em>
              </RevealText>
              <RevealText as="p" delay={0.2} className="mt-8 max-w-[40ch] text-body text-mocha">
                A paragraph using the same reveal with a short delay, so it follows the heading rather than
                arriving with it.
              </RevealText>
            </div>
          </div>

          <div className="mt-[30vh] grid gap-16 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5 md:col-start-2">
              <RevealImage
                src={placeholders.square01.src}
                alt={placeholders.square01.alt}
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                wrapperClassName="aspect-square w-full"
              />
            </div>
            <div className="md:col-span-5 md:col-start-8 md:mt-48">
              <RevealImage
                src={placeholders.portrait01.src}
                alt={placeholders.portrait01.alt}
                fill
                delay={0.15}
                sizes="(min-width: 768px) 40vw, 100vw"
                wrapperClassName="aspect-[4/5] w-full"
              />
            </div>
          </div>
        </Container>
      </Section>

      <Section background="espresso" spacing="lg">
        <Container>
          <RevealText as="h2" className="mx-auto max-w-[16ch] text-center text-display font-light">
            Quiet <em className="italic">luxury,</em> by the inch.
          </RevealText>
          <div className="mt-24">
            <RevealImage
              src={placeholders.landscape02.src}
              alt={placeholders.landscape02.alt}
              fill
              sizes="100vw"
              wrapperClassName="aspect-[3/2] w-full md:aspect-[21/9]"
            />
          </div>
        </Container>
      </Section>
    </div>
  );
}
