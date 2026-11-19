import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline";
type Size = "sm" | "md" | "lg";

type BaseProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & { href?: undefined };

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

/**
 * Each variant: resting surface + text, and the colour that fills up from the bottom on hover.
 * The fill is a pseudo-element translated on the Y axis (GPU-composited, interruptible CSS transition).
 */
const variants: Record<Variant, string> = {
  // Champagne is the brand's hover colour; it reads on cream and on espresso sections alike.
  primary: "bg-blush text-espresso before:bg-champagne",
  // Faint cream inset keeps the edge legible when this sits on an espresso section.
  dark: "bg-espresso text-cream shadow-[inset_0_0_0_1px_rgb(244_236_225/0.14)] before:bg-mocha",
  // Inherits text colour so it reads on both light and dark sections.
  outline:
    "bg-transparent text-current shadow-[inset_0_0_0_1px_var(--color-champagne)] before:bg-champagne hover:text-espresso focus-visible:text-espresso",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-[0.6875rem]",
  md: "h-12 px-8 text-xs",
  lg: "h-14 px-10 text-[0.8125rem]",
};

const base = cn(
  "group relative isolate inline-flex select-none items-center justify-center gap-3 overflow-hidden",
  "font-sans font-medium uppercase tracking-[0.18em] whitespace-nowrap",
  "transition-[color,scale] duration-700 ease-luxe active:scale-[0.96] active:duration-150",
  // Fill layer
  "before:absolute before:inset-0 before:-z-10 before:translate-y-full before:content-['']",
  "before:transition-transform before:duration-700 before:ease-luxe",
  "hover:before:translate-y-0 focus-visible:before:translate-y-0",
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
  "motion-reduce:before:transition-none motion-reduce:transition-none motion-reduce:active:scale-100",
);

export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", className, children, ...rest } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if (rest.href !== undefined) {
    const { href, ...anchorProps } = rest as ButtonAsLink;
    const isExternal = /^(https?:|mailto:|tel:)/.test(href);

    if (isExternal) {
      return (
        <a href={href} className={classes} {...anchorProps}>
          {children}
        </a>
      );
    }

    return (
      <Link href={href} className={classes} {...anchorProps}>
        {children}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
