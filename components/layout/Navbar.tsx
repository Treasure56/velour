"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useMotionValueEvent, useScroll } from "framer-motion";
import { Menu, Search, User } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SHOW_NAV_EVENT } from "@/lib/events";
import { cn } from "@/lib/utils";
import { CartIcon } from "./CartIcon";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

const SOLID_AFTER = 50; // px scrolled before the bar turns cream
const HIDE_AFTER = 160; // px scrolled before scroll-down hides the header
const DELTA = 4; // ignore tiny scroll jitter

const iconButton = "grid size-11 place-items-center";

type NavbarProps = {
  /** Rendered above the nav inside the same fixed header (the AnnouncementBar). */
  announcement?: ReactNode;
};

/**
 * Fixed header: announcement bar + nav, transparent over the hero.
 * - Past 50px: cream, blurred surface with a champagne hairline fades in, and the announcement bar slides away.
 * - Scrolling down hides the header; scrolling up brings it back (0.4s).
 * - data-solid lets CSS put a frosted pill behind the icons while they sit over the hero film (globals.css).
 */
export function Navbar({ announcement }: NavbarProps) {
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > SOLID_AFTER);
    const delta = y - (scrollY.getPrevious() ?? 0);
    if (Math.abs(delta) < DELTA) return;
    setHidden(delta > 0 && y > HIDE_AFTER);
  });

  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const headerHidden = hidden && !menuOpen;

  // Other parts of the site can ask the navbar to come back (e.g. before fly-to-bag targets the bag icon).
  useEffect(() => {
    const show = () => setHidden(false);
    window.addEventListener(SHOW_NAV_EVENT, show);
    return () => window.removeEventListener(SHOW_NAV_EVENT, show);
  }, []);

  // Publish the state on <html> so sticky bars (e.g. the shop filter bar) can follow the navbar.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-nav-hidden", headerHidden);
  }, [headerHidden]);

  return (
    <>
      <header
        data-solid={solid}
        className={cn(
          "fixed inset-x-0 top-0 z-50 text-espresso transition-transform duration-400 ease-luxe motion-reduce:transition-none",
          headerHidden ? "-translate-y-full" : solid && announcement ? "-translate-y-9" : "translate-y-0",
        )}
      >
        {announcement}

        <div className="relative">
          {/* Solid surface: opacity-only fade keeps it cheap on mobile. */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-0 border-b border-champagne/80 bg-cream/85 backdrop-blur-md",
              "transition-opacity duration-500 ease-luxe motion-reduce:transition-none",
              solid ? "opacity-100" : "opacity-0",
            )}
          />

          <Container className="relative grid h-16 grid-cols-[1fr_auto_1fr] items-center lg:h-18">
            <nav aria-label="Main" className="flex items-center">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                className={cn(iconButton, "-ml-3 lg:hidden")}
              >
                <Menu aria-hidden size={22} strokeWidth={1.25} />
              </button>
              <NavLinks className="hidden lg:flex" />
            </nav>

            <Logo />

            <div
              data-nav-icons
              className="-mr-3 flex items-center justify-end justify-self-end rounded-full transition-[background-color,backdrop-filter] duration-500 ease-luxe motion-reduce:transition-none"
            >
              <Link href="/search" aria-label="Search" className={cn(iconButton, "hidden lg:grid")}>
                <Search aria-hidden size={20} strokeWidth={1.25} />
              </Link>
              <Link href="/account" aria-label="Account" className={cn(iconButton, "hidden lg:grid")}>
                <User aria-hidden size={20} strokeWidth={1.25} />
              </Link>
              <CartIcon />
            </div>
          </Container>
        </div>
      </header>

      {/* Sibling of the header: a transformed parent would break position: fixed. */}
      <MobileMenu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
