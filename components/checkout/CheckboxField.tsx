import type { ComponentProps } from "react";

type CheckboxFieldProps = Omit<ComponentProps<"input">, "type"> & { label: string };

/** Native checkbox in espresso with a 44px-tall tap area. Spread `register()` onto it. */
export function CheckboxField({ label, ...input }: CheckboxFieldProps) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
      <input type="checkbox" className="size-4 shrink-0 accent-espresso" {...input} />
      {label}
    </label>
  );
}
