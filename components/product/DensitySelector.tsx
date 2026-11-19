"use client";

import { useId } from "react";
import { formatPrice } from "@/lib/currency";
import type { DensityOption } from "@/types/product";
import { optionPill } from "./LengthSelector";

type DensitySelectorProps = {
  densities: DensityOption[];
  value: string | null;
  onChange: (label: string) => void;
};

/** Density pills with their add-on price, e.g. "180% +₦45,000". */
export function DensitySelector({ densities, value, onChange }: DensitySelectorProps) {
  const name = useId();
  return (
    <fieldset>
      <legend className="text-xs font-medium uppercase tracking-[0.18em]">
        Density: <span className="text-mocha">{value}</span>
      </legend>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {densities.map((d) => (
          <label key={d.label}>
            <input
              type="radio"
              name={name}
              value={d.label}
              checked={value === d.label}
              onChange={() => onChange(d.label)}
              className="peer sr-only"
            />
            <span className={optionPill}>
              {d.label}
              {d.priceAddOn > 0 && <span className="ml-1.5 opacity-70">+{formatPrice(d.priceAddOn)}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
