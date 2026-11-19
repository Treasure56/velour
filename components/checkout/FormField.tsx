import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { FieldShell, describedBy, fieldClass, type FieldShellProps } from "./FieldShell";

type FormFieldProps = FieldShellProps &
  Omit<ComponentProps<"input">, "id" | "className"> & {
    /** Shown inside the field on the right, e.g. the detected card brand */
    adornment?: ReactNode;
  };

/** Labelled text input. Spread react-hook-form's `register()` (or a Controller `field`) onto it. */
export function FormField({ id, label, error, hint, optional, className, adornment, ...input }: FormFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <div className="relative">
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(id, error, hint)}
          className={cn(fieldClass, adornment ? "pr-24" : undefined)}
          {...input}
        />
        {adornment && (
          <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">{adornment}</span>
        )}
      </div>
    </FieldShell>
  );
}
