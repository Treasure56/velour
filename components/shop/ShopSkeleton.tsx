import { Container } from "@/components/ui";

/** Static placeholder for the moment before the URL filters are read on the client. */
export function ShopSkeleton() {
  return (
    <div aria-hidden className="pt-36 lg:pt-44">
      <Container>
        <div className="h-3 w-24 bg-champagne/40" />
        <p className="mt-5 font-serif text-[clamp(2.75rem,5vw,4.5rem)] font-light leading-[1.05]">
          The <em className="italic">Collection.</em>
        </p>
        <div className="mt-8 h-6 lg:mt-10" />
      </Container>
      <div className="mt-8 h-16 border-b border-champagne lg:mt-10" />
      <Container className="grid grid-cols-2 gap-x-3 gap-y-10 pb-24 pt-10 sm:gap-x-4 lg:grid-cols-3 lg:pt-14 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="aspect-4/5 rounded-sm bg-ivory" />
        ))}
      </Container>
    </div>
  );
}
