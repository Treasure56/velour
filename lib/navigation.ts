/** Site navigation, shared by the desktop navbar, mobile menu and (later) the footer. */

export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "Shop", href: "/shop" },
  { label: "Textures", href: "/textures" },
  { label: "Wigs", href: "/shop?category=wigs" },
  { label: "Hair Care", href: "/shop?category=hair-care" },
];

export const announcements = [
  "Worldwide shipping",
  "100% raw virgin hair",
  "Pay in instalments",
  "Free bonnet with every wig",
];
