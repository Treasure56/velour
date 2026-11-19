import { Button } from "@/components/ui";

/** Shown when no products match the filters. */
export function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="mx-auto max-w-md py-20 text-center lg:py-28">
      <p className="font-serif text-3xl font-light italic lg:text-4xl">Nothing matches, yet.</p>
      <p className="mt-3 text-sm text-mocha">Try removing a filter.</p>
      <Button variant="outline" onClick={onClear} className="mt-8">
        Clear filters
      </Button>
    </div>
  );
}
