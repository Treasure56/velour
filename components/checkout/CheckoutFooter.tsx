import Link from "next/link";

const links = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Returns", href: "/returns" },
];

/** The checkout's only footer: one slim line of policy links. */
export function CheckoutFooter() {
  return (
    <footer className="border-t border-champagne bg-cream">
      <nav aria-label="Policies" className="flex items-center justify-center gap-3 py-5 text-xs text-mocha">
        {links.map((link, i) => (
          <span key={link.href} className="flex items-center gap-3">
            {i > 0 && <span aria-hidden>·</span>}
            <Link href={link.href} className="underline-offset-4 hover:text-espresso hover:underline">
              {link.label}
            </Link>
          </span>
        ))}
      </nav>
    </footer>
  );
}
