import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  onClick?: () => void;
};

/** VELOUR wordmark. Leading padding equals the tracking so the word sits optically centred. */
export function Logo({ className, onClick }: LogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label="VELOUR home"
      className={cn(
        "font-serif text-[1.375rem] font-normal uppercase leading-none tracking-[0.34em] pl-[0.34em] lg:text-[1.75rem]",
        className,
      )}
    >
      Velour
    </Link>
  );
}
