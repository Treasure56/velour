export type FooterLink = { label: string; href: string };
export type SocialName = "instagram" | "tiktok" | "whatsapp" | "pinterest";

export const footer = {
  tagline: "Luxury raw hair, made to blend and built to last.",
  // Replace the hrefs with Velour's real profiles before launch.
  social: [
    { name: "instagram", label: "Instagram", href: "https://www.instagram.com/" },
    { name: "tiktok", label: "TikTok", href: "https://www.tiktok.com/" },
    { name: "whatsapp", label: "WhatsApp", href: "https://wa.me/" },
    { name: "pinterest", label: "Pinterest", href: "https://www.pinterest.com/" },
  ] satisfies { name: SocialName; label: string; href: string }[],
  columns: [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/shop" },
        { label: "Wigs", href: "/shop?category=wigs" },
        { label: "Bundles", href: "/shop?category=bundles" },
        { label: "Closures & Frontals", href: "/shop?category=closures" },
        { label: "Hair Care", href: "/shop?category=hair-care" },
        { label: "Christmas Sale", href: "/shop?sale=1" },
      ],
    },
    {
      title: "Help",
      links: [
        { label: "Shipping", href: "/shipping" },
        { label: "Returns & Exchanges", href: "/returns" },
        { label: "FAQ", href: "/faq" },
        { label: "Hair Care Guide", href: "/hair-care-guide" },
        { label: "Track Order", href: "/track-order" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Our Story", href: "/our-story" },
        { label: "Contact Us", href: "/contact" },
        { label: "Wholesale", href: "/wholesale" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ] satisfies { title: string; links: FooterLink[] }[],
  payments: ["Visa", "Mastercard", "Verve", "Bank Transfer"],
  credit: "Designed by [YOUR NAME]",
};
