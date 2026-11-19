import { SiteChrome } from "@/components/layout";
import { Button, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <SiteChrome>
      <Container size="narrow" className="flex min-h-[70dvh] flex-col items-center justify-center pb-24 pt-40 text-center">
        <h1 className="font-serif text-[clamp(2.25rem,4vw,3.25rem)] font-light leading-[1.05]">
          Page not <em className="italic">found.</em>
        </h1>
        <p className="mt-4 max-w-sm text-mocha">The page you were looking for has moved or no longer exists.</p>
        <Button href="/shop" className="mt-8">
          Shop the Collection
        </Button>
      </Container>
    </SiteChrome>
  );
}
