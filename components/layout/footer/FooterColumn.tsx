"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import type { FooterLink } from "@/data/footer";
import { cn } from "@/lib/utils";

type FooterColumnProps = {
  title: string;
  links: FooterLink[];
};

const titleClass = "font-sans text-xs font-medium uppercase tracking-[0.2em] text-champagne";

/**
 * Link column. Desktop: always open with a plain title. Mobile: an accordion that opens and
 * closes smoothly (grid-rows 0fr ↔ 1fr); closed links are hidden from focus.
 */
export function FooterColumn({ title, links }: FooterColumnProps) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-champagne/20 lg:border-none">
      <h2 className={cn(titleClass, "hidden lg:block")}>{title}</h2>
      <h2 className="lg:hidden">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className={cn(titleClass, "flex w-full items-center justify-between py-5")}
        >
          {title}
          {open ? (
            <Minus aria-hidden size={16} strokeWidth={1.25} />
          ) : (
            <Plus aria-hidden size={16} strokeWidth={1.25} />
          )}
        </button>
      </h2>

      <div
        id={panelId}
        className={cn(
          "grid transition-[grid-template-rows,visibility] duration-500 ease-luxe motion-reduce:transition-none",
          "lg:visible lg:grid-rows-[1fr] lg:transition-none",
          open ? "visible grid-rows-[1fr]" : "invisible grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <ul className="space-y-3 pb-6 lg:mt-6 lg:pb-0">
            {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="group relative inline-block text-sm text-cream/75 transition-colors duration-300 hover:text-cream motion-reduce:transition-none"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-500 ease-luxe group-hover:scale-x-100 motion-reduce:transition-none"
                />
              </Link>
            </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
