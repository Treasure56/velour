import type { ReactNode } from "react";

export type ReviewRow = {
  label: string;
  value: ReactNode;
  onEdit: () => void;
};

/** Compact recap of earlier steps (Contact, Ship to, Method) with an Edit link each. */
export function StepReview({ rows }: { rows: ReviewRow[] }) {
  return (
    <dl className="divide-y divide-champagne/70 border border-champagne bg-ivory/70 px-4 text-sm">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center gap-4 py-2">
          <dt className="w-16 shrink-0 text-xs text-mocha">{row.label}</dt>
          <dd className="min-w-0 flex-1 break-words">{row.value}</dd>
          <dd className="shrink-0">
            <button
              type="button"
              onClick={row.onEdit}
              aria-label={`Edit ${row.label.toLowerCase()}`}
              className="min-h-11 text-xs underline underline-offset-4 hover:text-mocha"
            >
              Edit
            </button>
          </dd>
        </div>
      ))}
    </dl>
  );
}
