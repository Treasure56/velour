import { Check } from "lucide-react";

type CheckboxProps = {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

/** Square checkbox: thin espresso border, espresso fill with a cream tick when checked. Native input underneath. */
export function Checkbox({ label, checked, onChange }: CheckboxProps) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className="grid size-4 shrink-0 place-items-center border border-espresso transition-colors duration-200 peer-checked:bg-espresso peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-espresso peer-focus-visible:outline-solid"
      >
        <Check size={12} strokeWidth={2} className="text-cream opacity-0 group-has-checked:opacity-100" />
      </span>
      {label}
    </label>
  );
}
