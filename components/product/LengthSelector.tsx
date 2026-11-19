"use client";

import { useId } from "react";
import type { LengthOption } from "@/types/product";

export const optionPill =
  "inline-flex h-9 min-w-11 cursor-pointer items-center justify-center rounded-full border border-champagne px-3.5 text-[0.8125rem] tabular-nums transition-colors duration-300 hover:border-espresso peer-checked:border-espresso peer-checked:bg-espresso peer-checked:text-cream peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-espresso peer-focus-visible:outline-solid motion-reduce:transition-none";

type LengthSelectorProps = {
  lengths: LengthOption[];
  value: number | null;
  onChange: (inches: number) => void;
};

/** Length pills (native radios underneath: arrow keys work). Selected = espresso fill. */
export function LengthSelector({ lengths, value, onChange }: LengthSelectorProps) {
  const name = useId(); // unique group: the page and the quick-add modal can both be open
  return (
    <fieldset>
      <legend className="text-xs font-medium uppercase tracking-[0.18em]">
        Length: <span className="text-mocha">{value}&quot;</span>
      </legend>
      <div className="mt-2.5 flex flex-wrap gap-1.5">
        {lengths.map((l) => (
          <label key={l.inches}>
            <input
              type="radio"
              name={name}
              value={l.inches}
              checked={value === l.inches}
              onChange={() => onChange(l.inches)}
              className="peer sr-only"
            />
            <span className={optionPill}>{l.inches}&quot;</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
