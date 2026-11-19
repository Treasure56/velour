import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";

type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  /** narrow = 75rem (product pages); default = 90rem */
  size?: "default" | "narrow";
};

/** Max-width wrapper with responsive side padding (16px on phones). */
export function Container({ size = "default", className, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-8 lg:px-12 xl:px-16",
        size === "narrow" ? "max-w-300" : "max-w-360",
        className,
      )}
      {...props}
    />
  );
}
