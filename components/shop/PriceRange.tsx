"use client";

import { formatPrice } from "@/lib/currency";

const STEP = 5_000;

type PriceRangeProps = {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

/** Two-thumb price slider (two native range inputs on one track), values shown in ₦. */
export function PriceRange({ min, max, value, onChange }: PriceRangeProps) {
  const [lo, hi] = value;
  const pct = (n: number) => ((n - min) / (max - min || 1)) * 100;

  return (
    <div>
      <div className="relative h-6">
        <div aria-hidden className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-champagne" />
        <div
          aria-hidden
          className="absolute top-1/2 h-px -translate-y-1/2 bg-espresso"
          style={{ left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }}
        />
        <input
          type="range"
          aria-label="Minimum price"
          aria-valuetext={formatPrice(lo)}
          min={min}
          max={max}
          step={STEP}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - STEP), hi])}
          className="range-thumb absolute inset-0 w-full"
        />
        <input
          type="range"
          aria-label="Maximum price"
          aria-valuetext={formatPrice(hi)}
          min={min}
          max={max}
          step={STEP}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + STEP)])}
          className="range-thumb absolute inset-0 w-full"
        />
      </div>
      <div className="mt-3 flex justify-between text-sm tabular-nums">
        <span>{formatPrice(lo)}</span>
        <span>{formatPrice(hi)}</span>
      </div>
    </div>
  );
}
