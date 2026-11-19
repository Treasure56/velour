import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { CartHydration } from "@/components/cart";
import { SmoothScroll } from "@/components/layout";
import { introSeenScript } from "@/lib/intro";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Absolute base for Open Graph image URLs. Set NEXT_PUBLIC_SITE_URL to the live domain in production.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "VELOUR",
    template: "%s | VELOUR",
  },
  description: "Luxury hair extensions and wigs.",
};

export const viewport: Viewport = {
  themeColor: "#F4ECE1", // cream
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the intro script below may add data-intro-seen before hydration.
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introSeenScript }} />
        {/* Without JS: reveals never stay hidden and the intro loader never shows. */}
        <noscript>
          <style>{`[data-reveal]{visibility:visible!important;clip-path:none!important}[data-loader]{display:none!important}[data-hero-fade],[data-fade]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:bg-espresso focus:px-5 focus:py-3 focus:text-cream"
        >
          Skip to content
        </a>
        {/* Route groups add the chrome: (site) = navbar + footer, (checkout) = minimal header. */}
        <SmoothScroll>{children}</SmoothScroll>
        <CartHydration />
      </body>
    </html>
  );
}
