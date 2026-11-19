import { Container, FadeUp, Section } from "@/components/ui";
import { NewsletterForm } from "./NewsletterForm";

/** The Velour Circle: centred sign-up on cream. */
export function Newsletter() {
  return (
    <Section spacing="lg" background="cream" aria-labelledby="newsletter-heading">
      <Container>
        <div className="mx-auto max-w-140 text-center">
          <FadeUp>
            <p className="eyebrow text-mocha">The Velour circle</p>
            <h2
              id="newsletter-heading"
              className="mt-4 font-serif text-[clamp(2.5rem,4.5vw,4rem)] font-light leading-[1.05] tracking-[-0.01em]"
            >
              Join the <em className="italic">circle.</em>
            </h2>
            <p className="mt-5 text-base text-mocha">
              Early access to new drops, hair care tips and 10% off your first order.
            </p>
          </FadeUp>

          <FadeUp delay={0.15} className="mt-10">
            <NewsletterForm />
            <p className="mt-3 text-xs text-mocha/70">No spam. Unsubscribe anytime.</p>
          </FadeUp>
        </div>
      </Container>
    </Section>
  );
}
