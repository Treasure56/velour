import type { SocialName } from "@/data/footer";

/**
 * Thin line social marks (lucide no longer ships brand logos). 24px grid, stroke 1.25,
 * currentColor, so they match the rest of the icon set.
 */
export function SocialIcon({ name, size = 18 }: { name: SocialName; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14 3.5v11a3.5 3.5 0 1 1-3.5-3.5" />
          <path d="M14 3.5c.5 2.6 2.3 4.3 5 4.6" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M4 20l1.2-3.7A8.4 8.4 0 1 1 8.4 19l-4.4 1z" />
          <path d="M9.3 8.6c.2 2.6 3.2 5.6 5.8 5.9l1-1.2-1.7-.9-.8.8c-1-.4-2.2-1.6-2.6-2.6l.8-.8-.9-1.7-1.6.5z" />
        </svg>
      );
    case "pinterest":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M11.4 9c2.6-.9 4.6.6 4.1 2.8-.4 2-2.6 2.7-3.9 1.7" />
          <path d="M11.8 9.4 9.6 20" />
        </svg>
      );
  }
}
