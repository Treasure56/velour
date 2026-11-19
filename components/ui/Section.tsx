import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type Spacing = "sm" | "md" | "lg";
type Background = "cream" | "ivory" | "espresso";

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  spacing?: Spacing;
  background?: Background;
};

const spacingClasses: Record<Spacing, string> = {
  sm: "py-16 md:py-20",
  md: "py-24 md:py-32",
  lg: "py-32 md:py-48",
};

// Dark sections flip text and focus-ring colour so children stay legible.
const backgroundClasses: Record<Background, string> = {
  cream: "bg-cream text-espresso",
  ivory: "bg-ivory text-espresso",
  espresso: "bg-espresso text-cream [--focus-ring:var(--color-cream)]",
};

/** Consistent vertical rhythm with an optional brand surface. */
export function Section({ spacing = "md", background, className, ...props }: SectionProps) {
  return (
    <section
      className={cn(spacingClasses[spacing], background && backgroundClasses[background], className)}
      {...props}
    />
  );
}
