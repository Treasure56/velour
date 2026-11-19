import { cn } from "@/lib/utils";

/** "Scroll" label with a hairline that a short stroke travels down, slowly and endlessly. */
export function ScrollIndicator({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("flex items-center gap-4 text-mocha", className)}>
      <span className="relative h-12 w-px overflow-hidden bg-champagne">
        <span className="absolute inset-0 animate-scroll-line bg-espresso motion-reduce:animate-none motion-reduce:opacity-0" />
      </span>
      <span className="eyebrow">Scroll</span>
    </div>
  );
}
