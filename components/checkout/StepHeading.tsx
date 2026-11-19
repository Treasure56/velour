import type { ReactNode } from "react";

/** Step title. Focusable (not tabbable) so it can take focus after a step change. */
export function StepHeading({ children }: { children: ReactNode }) {
  return (
    <h2 tabIndex={-1} data-step-heading className="font-serif text-[1.75rem] font-light leading-tight outline-none">
      {children}
    </h2>
  );
}
