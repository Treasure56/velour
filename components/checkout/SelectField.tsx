import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { FieldShell, describedBy, fieldClass, type FieldShellProps } from "./FieldShell";

type SelectFieldProps = FieldShellProps &
  Omit<ComponentProps<"select">, "id" | "className"> & {
    options: readonly string[];
    /** First, empty option, e.g. "Select state" */
    placeholder?: string;
  };

/** Labelled native select (native = the phone's own picker on mobile). */
export function SelectField({ id, label, error, hint, optional, className, options, placeholder, ...select }: SelectFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <div className="relative">
        <select
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(fieldClass, "appearance-none pr-10")}
          {...select}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden
          size={16}
          strokeWidth={1.25}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2"
        />
      </div>
    </FieldShell>
  );
}
