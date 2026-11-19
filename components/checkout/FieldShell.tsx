import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type FieldShellProps = {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  className?: string;
};

/** Shared input look: 48px tall (tap-friendly), ivory fill, champagne border, espresso on focus. */
export const fieldClass = cn(
  "h-12 w-full rounded-none border border-champagne bg-ivory px-4 text-base text-espresso lg:text-sm",
  "placeholder:text-mocha/60 transition-colors duration-300",
  "focus-visible:border-espresso aria-invalid:border-error",
);

/** IDs for aria-describedby: the error when there is one, otherwise the hint. */
export const describedBy = (id: string, error?: string, hint?: string) =>
  error ? `${id}-error` : hint ? `${id}-hint` : undefined;

/** Label above, control, then the hint or error message below. */
export function FieldShell({ id, label, error, hint, optional, className, children }: FieldShellProps & { children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium">
        {label}
        {optional && <span className="ml-1 font-normal text-mocha">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-xs text-error">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-mocha">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
