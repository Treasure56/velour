import type { ReactNode } from "react";
import { CartDrawer, FlyToBag, QuickAddModal } from "@/components/cart";
import { AnnouncementBar } from "./AnnouncementBar";
import { Footer } from "./footer";
import { Navbar } from "./Navbar";

/**
 * The full store chrome: announcement bar + navbar, page, footer, and the bag overlays.
 * Used by the (site) layout and the 404 page. The checkout has its own minimal chrome.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar announcement={<AnnouncementBar />} />
      <main id="main">{children}</main>
      <Footer />
      <CartDrawer />
      <QuickAddModal />
      <FlyToBag />
    </>
  );
}
