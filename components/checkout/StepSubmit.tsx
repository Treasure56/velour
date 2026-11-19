import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type StepSubmitProps = {
  children: ReactNode;
  busy?: boolean;
};

/** Full-width dark submit button. On phones it sticks to the bottom of the screen while the form is in view. */
export function StepSubmit({ children, busy = false }: StepSubmitProps) {
  return (
    <div className="sticky bottom-0 z-10 -mx-4 mt-8 border-t border-champagne bg-cream/95 px-4 py-3 backdrop-blur-md sm:-mx-8 sm:px-8 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
      <Button type="submit" variant="dark" size="lg" disabled={busy} aria-busy={busy || undefined} className="w-full">
        {children}
      </Button>
    </div>
  );
}
