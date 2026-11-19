import { Container } from "@/components/ui/Container";
import { footer } from "@/data/footer";
import { FooterBottom } from "./FooterBottom";
import { FooterColumn } from "./FooterColumn";
import { FooterWordmark } from "./FooterWordmark";
import { SocialIcon } from "./SocialIcon";

/**
 * Site footer on espresso: brand + socials, three link columns (accordions on mobile),
 * a faint full-width wordmark, then the bottom row.
 */
export function Footer() {
  return (
    <footer className="bg-espresso pb-8 pt-24 text-cream [--focus-ring:var(--color-cream)] lg:pt-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-10">
          <div>
            <p className="font-serif text-3xl uppercase leading-none tracking-[0.34em]">
              Velour
            </p>
            <p className="mt-5 max-w-xs text-sm text-cream/75">{footer.tagline}</p>
            <ul className="mt-7 flex gap-3">
              {footer.social.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Velour on ${s.label}`}
                    className="grid size-10 place-items-center rounded-full border border-champagne/40 text-cream/80 transition-colors duration-300 hover:border-champagne hover:text-cream motion-reduce:transition-none"
                  >
                    <SocialIcon name={s.name} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:contents">
            {footer.columns.map((column) => (
              <FooterColumn key={column.title} title={column.title} links={column.links} />
            ))}
          </div>
        </div>

        {/* Desktop divider (on mobile the last accordion's hairline already closes the block). */}
        <div aria-hidden className="mt-24 hidden h-px bg-champagne/20 lg:block" />

        <div className="mt-10 lg:mt-14">
          <FooterWordmark />
        </div>

        <div className="mt-10 lg:mt-14">
          <FooterBottom />
        </div>
      </Container>
    </footer>
  );
}
