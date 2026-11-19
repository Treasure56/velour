import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

type RadioCardProps = Omit<ComponentProps<"input">, "type" | "title"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Right-hand side: price, card badges… */
  aside?: ReactNode;
  selected: boolean;
  /** Extra content revealed under the selected card (card fields, bank details…) */
  children?: ReactNode;
};

/** Selectable card: thin champagne border, espresso border when selected. Native radio inside. */
export function RadioCard({ title, description, aside, selected, children, ...input }: RadioCardProps) {
  return (
    <div
      className={cn(
        "border bg-ivory/70 transition-colors duration-300 motion-reduce:transition-none",
        selected ? "border-espresso" : "border-champagne",
      )}
    >
      <label className="flex min-h-15 cursor-pointer items-center gap-4 px-4 py-3.5">
        <input type="radio" className="size-4 shrink-0 accent-espresso" {...input} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium">{title}</span>
          {description && <span className="mt-0.5 block text-xs text-mocha">{description}</span>}
        </span>
        {aside && <span className="shrink-0 text-sm tabular-nums">{aside}</span>}
      </label>
      {selected && children && <div className="border-t border-champagne/70 px-4 pb-5 pt-4">{children}</div>}
    </div>
  );
}
