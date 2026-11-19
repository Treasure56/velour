import Link from "next/link";
import { primaryNav } from "@/lib/navigation";
import { cn } from "@/lib/utils";

/** Desktop links. Hover: a hairline underline grows left to right and retracts to the right. */
export function NavLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-8 xl:gap-10", className)}>
      {primaryNav.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="group relative inline-block py-2 text-[0.6875rem] font-medium uppercase tracking-[0.2em]"
          >
            {link.label}
            <span
              aria-hidden
              className={cn(
                "absolute inset-x-0 bottom-1 h-px origin-right scale-x-0 bg-current",
                "transition-transform duration-500 ease-luxe",
                "group-hover:origin-left group-hover:scale-x-100",
                "group-focus-visible:origin-left group-focus-visible:scale-x-100",
                "motion-reduce:transition-none",
              )}
            />
          </Link>
        </li>
      ))}
    </ul>
  );
}
