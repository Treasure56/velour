import { Button } from "@/components/ui/Button";

/** Thin-line Velour bag, "Your bag is empty." and a way back to the shop. */
export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <svg aria-hidden viewBox="0 0 120 120" className="size-28 text-champagne" fill="none" stroke="currentColor" strokeWidth={1}>
        <path d="M46 44v-8a14 14 0 0 1 28 0v8" strokeLinecap="round" />
        <path d="M26 44h68l-6 62H32z" strokeLinejoin="round" />
        <text x="60" y="80" textAnchor="middle" fontSize="8" letterSpacing="2.4" fill="currentColor" stroke="none" fontFamily="var(--font-serif), serif">
          VELOUR
        </text>
      </svg>
      <p className="mt-6 font-serif text-3xl font-light">
        Your bag is <em className="italic">empty.</em>
      </p>
      <Button href="/shop" onClick={onNavigate} className="mt-8">
        Shop the Collection
      </Button>
    </div>
  );
}
