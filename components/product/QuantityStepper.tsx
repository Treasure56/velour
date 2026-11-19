"use client";

import { useId } from "react";
import { Minus, Plus } from "lucide-react";
import { MAX_QTY, MIN_QTY } from "@/hooks/useProductOptions";
import { cn } from "@/lib/utils";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  /** Visible label (defaults to "Quantity"); `hideLabel` keeps it for screen readers only */
  label?: string;
  hideLabel?: boolean;
  size?: "md" | "sm";
};

/** Minimal − 1 + stepper, 1 to 10. */
export function QuantityStepper({ value, onChange, label = "Quantity", hideLabel = false, size = "md" }: QuantityStepperProps) {
  const labelId = useId();
  const step = cn(
    "grid place-items-center transition-opacity duration-200 disabled:cursor-not-allowed disabled:opacity-30",
    size === "sm" ? "size-8" : "size-9",
  );

  return (
    <div>
      <p id={labelId} className={hideLabel ? "sr-only" : "text-xs font-medium uppercase tracking-[0.18em]"}>
        {label}
      </p>
      <div
        role="group"
        aria-labelledby={labelId}
        className={cn("flex w-fit items-center border border-champagne", !hideLabel && "mt-2.5")}
      >
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          disabled={value <= MIN_QTY}
          aria-label="Decrease quantity"
          className={step}
        >
          <Minus aria-hidden size={size === "sm" ? 12 : 14} strokeWidth={1.25} />
        </button>
        <output aria-live="polite" className={cn("text-center tabular-nums", size === "sm" ? "w-7 text-xs" : "w-9 text-sm")}>
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          disabled={value >= MAX_QTY}
          aria-label="Increase quantity"
          className={step}
        >
          <Plus aria-hidden size={size === "sm" ? 12 : 14} strokeWidth={1.25} />
        </button>
      </div>
    </div>
  );
}
