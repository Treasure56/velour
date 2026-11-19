import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { FieldShell, describedBy, fieldClass, type FieldShellProps } from "./FieldShell";

type TextareaFieldProps = FieldShellProps & Omit<ComponentProps<"textarea">, "id" | "className">;

/** Labelled multi-line field (delivery notes). */
export function TextareaField({ id, label, error, hint, optional, className, ...textarea }: TextareaFieldProps) {
  return (
    <FieldShell id={id} label={label} error={error} hint={hint} optional={optional} className={className}>
      <textarea
        id={id}
        rows={3}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        className={cn(fieldClass, "h-auto resize-y py-3")}
        {...textarea}
      />
    </FieldShell>
  );
}
