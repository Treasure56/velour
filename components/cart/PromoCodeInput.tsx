"use client";

import { useId, useState, type FormEvent } from "react";
import { holidayPromotion } from "@/data/promotions";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart";

/**
 * "Have a promo code?" link that expands into an input + Apply. Valid: "VELOURXMAS applied, 15% off ✓"
 * with Remove. Invalid: a short friendly message.
 */
export function PromoCodeInput({ codeActive }: { codeActive: boolean }) {
  const appliedCode = useCartStore((s) => s.appliedCode);
  const applyCode = useCartStore((s) => s.applyCode);
  const removeCode = useCartStore((s) => s.removeCode);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const inputId = useId();
  const errorId = useId();

  if (codeActive && appliedCode) {
    return (
      <p className="flex items-center justify-between gap-3 text-xs">
        <span>
          {appliedCode} applied, {holidayPromotion.discount}% off ✓
        </span>
        <button
          type="button"
          onClick={removeCode}
          aria-label={`Remove promo code ${appliedCode}`}
          className="text-mocha underline underline-offset-4 hover:text-espresso"
        >
          Remove
        </button>
      </p>
    );
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const result = applyCode(value);
    if (result.ok) {
      setValue("");
      setError("");
    } else {
      setError(result.error);
    }
  };

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="text-xs text-mocha underline underline-offset-4 hover:text-espresso"
      >
        Have a promo code?
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-500 ease-luxe motion-reduce:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <form onSubmit={onSubmit} className="flex gap-2 pt-3" noValidate>
            <label htmlFor={inputId} className="sr-only">
              Promo code
            </label>
            <input
              id={inputId}
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError("");
              }}
              autoComplete="off"
              spellCheck={false}
              placeholder="Enter code"
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className="h-10 min-w-0 flex-1 border border-champagne bg-transparent px-3 text-sm uppercase tracking-[0.1em] placeholder:normal-case placeholder:tracking-normal placeholder:text-mocha/70 focus-visible:border-espresso focus-visible:outline-none"
            />
            <button
              type="submit"
              className="h-10 border border-espresso px-4 text-[0.6875rem] font-medium uppercase tracking-[0.2em] transition-colors duration-300 hover:bg-espresso hover:text-cream"
            >
              Apply
            </button>
          </form>
          <p id={errorId} aria-live="polite" className="mt-1.5 min-h-4 text-xs text-mocha">
            {error}
          </p>
        </div>
      </div>
    </div>
  );
}
