@AGENTS.md

# VELOUR Project Brief

Premium e-commerce site for **VELOUR**, a luxury hair extensions & wig brand. Follow this brief for every step. We build step by step; do not build ahead of the current step.

## Brand feel
- Luxury, editorial, calm, expensive. Think high-end fragrance or fashion house, NOT a typical loud hair-vendor site.
- Lots of white space, large serif typography, slow and smooth animations. Nothing bouncy or cheap.
- **Signature object:** a cream luxury shopping bag with the VELOUR logo. It appears throughout the site: hero, scroll story, cart icon, order confirmation.

## Tech stack
- Next.js (App Router) + TypeScript + Tailwind CSS
  - This is Next.js 16 / React 19 / Tailwind v4. Read `node_modules/next/dist/docs/` before writing Next code (see AGENTS.md).
  - Tailwind v4 has no `tailwind.config.js` by default: define theme tokens with `@theme` in `app/globals.css`.
- GSAP + ScrollTrigger for scroll animations (pin/scrub/story work)
- Framer Motion (`motion`) for UI/component animations and page transitions
- Lenis for smooth scrolling (synced with GSAP ticker / ScrollTrigger)
- Zustand for cart state, persisted to localStorage
- `next/image` and `next/font`

## Colours (Tailwind theme tokens)
| Token | Hex | Use |
|---|---|---|
| `espresso` | `#2B1A14` | main text, dark sections |
| `mocha` | `#6B4A3A` | secondary dark |
| `cream` | `#F4ECE1` | main background, the bag colour |
| `champagne` | `#D8C3A5` | accents, lines, hover states |
| `blush` | `#E9C9C1` | buttons, highlights |
| `ivory` | `#FBF8F3` | light surfaces / cards |

Check contrast (WCAG AA) on every button and form, especially espresso-on-blush and text on champagne.

## Typography
- **Display/headings:** Cormorant Garamond (light & regular, italic for emphasis)
- **Body/UI:** Manrope
- **Logo:** "VELOUR" in uppercase serif with wide letter-spacing
- Load via `next/font/google`, exposed as CSS variables mapped to Tailwind `font-display` / `font-sans`.
- Emphasis inside a headline = italic of the same serif, never a different family.

## Products (mock data in `/data/products.ts`)
- **Textures:** Raw Straight, Body Wave, Deep Wave, Kinky Curly
- **Categories:** Bundles, Wigs (frontal & closure), Closures/Frontals, Hair Care
- **Each product:** name, slug, category, texture, lengths (12"–30") with a price per length, images, description, rating
- **Currency:** Nigerian Naira (₦), defined in ONE config (`/lib/currency.ts`) so it can be switched. Never hardcode `₦` in components.

## Animation rules
**Subtle and refined, never overdone. Premium means restraint.**
- Motion only where it adds elegance: text reveals, image reveals, smooth scroll, gentle hovers.
- No bouncing, spinning, or flashy effects. No spring bounce, no overshoot eases (`back`, `elastic`).
- Durations 0.6–1s. Easing `power3.out` (GSAP) / `cubic-bezier(0.22, 1, 0.36, 1)` (CSS `ease-luxe`, Motion).
- Text reveals line-by-line from behind a mask (`<RevealText>`, GSAP SplitText).
- Images reveal with a clip-path wipe + scale 1.1 → 1 (`<RevealImage>`).
- Reveals play once.
- Everything respects `prefers-reduced-motion`: Lenis off, reveals show content immediately, hover fills snap.
- Must stay smooth on mobile: animate only `transform`/`opacity`/`clip-path`, no `window.addEventListener('scroll')`, native touch scrolling (Lenis `syncTouch: false`), `useGSAP` for cleanup.
- Every animation must have a reason (hierarchy, story, feedback, state change). Simple enter-on-view → Motion `whileInView`; pin/scrub → GSAP.
- Shared constants live in `lib/motion.ts` (mirrored as `--ease-luxe` in `app/globals.css`). Import GSAP from `lib/gsap.ts` so plugins are registered.

## Design system (built in step 1)
- Tokens: `app/globals.css` (`@theme`): colours, `ease-luxe`, fluid type scale `text-display`, `text-h1`…`text-h4`, `text-body-lg`, `text-body`, `text-small`, and the `eyebrow` utility. Fonts: `font-serif` (Cormorant) / `font-sans` (Manrope).
- UI primitives in `components/ui`: `Button` (primary/dark/outline, sm/md/lg, button or link), `RevealText`, `RevealImage`, `Container`, `Section` (spacing sm/md/lg, background cream/ivory/espresso).
- Smooth scroll: `components/layout/SmoothScroll.tsx`; `useLenis()` gives the instance (e.g. `lenis.stop()` while a drawer is open).
- Focus ring colour comes from `--focus-ring`; dark sections set it to cream.
- Prices: always `formatPrice()` from `lib/currency.ts`. Media: always from `lib/media.ts`.
- Reference page: `/style-guide`.

## Site chrome (built in step 2)
- Route groups (step 13): `app/layout.tsx` (root) = fonts, skip link, `<SmoothScroll>`, `<CartHydration />`. `app/(site)/layout.tsx` wraps every store page in `SiteChrome` (navbar + announcement bar → `<main id="main">` → footer + cart drawer/quick add/fly-to-bag). `app/(checkout)/layout.tsx` = minimal checkout chrome. `app/not-found.tsx` renders its own `SiteChrome`. New store pages go in `app/(site)/`. Pages must NOT render their own `<main>`.
- The header is `position: fixed` and overlays the page: 36px announcement bar + 64px nav (72px at `lg`). A page's first section is either a full-bleed hero that sits under the transparent header, or has at least ~7rem top padding.
- Header states: transparent at top → past 50px cream/blur surface + champagne hairline and the announcement bar slides away → hidden on scroll down, back on scroll up (0.4s).
- Nav links and announcement messages live in `lib/navigation.ts`.
- Overlays (menus, drawers): use `useFocusTrap` and `useScrollLock` from `/hooks`, render outside the transformed header, z-index above 50.

## Home hero (built in step 3)
- `components/home/hero`: `Hero` (layout + scroll parallax), `HeroVideo`, `HeroContent`, `Loader`, `ScrollIndicator`.
- Media in `lib/media.ts` (`hero`). Master film `public/media/video/hero video.mp4` is the source only; never reference it from code.
- Video: poster `<Image preload unoptimized>` is the LCP; `<video>` mounts client-side only when `useCanAutoplayVideo()` (no reduced motion, no Data Saver) and fades in on `playing`. `<source media="(max-width: 1023px)">` serves the 720×720 mobile crop.
- Intro loader: once per session (`sessionStorage` key in `lib/intro.ts`). An inline `<head>` script sets `data-intro-seen` so it never flashes on repeat visits. `RevealText` has a `play` prop for content that must wait for the loader.
- Cream fades over media: `fade-cream-up`, `fade-cream-down`, `fade-cream-right` utilities (eased multi-stop; plain two-stop gradients band over dark hair).
- Nav icons over the film: the hair behind them keeps moving (dark strands ↔ pale background), so no single icon colour works. While the header is transparent over `[data-hero]` (desktop), the icon group gets a frosted cream pill (globals.css, via `:has`); it fades out when the header turns solid.

## Shop by Texture (built in step 5)
- `components/home/textures`: `ShopByTexture` (server) + `TextureCard` (client, hover video). No marquee (removed at the user's request).
- Data in `data/textures.ts`; media paths in `lib/media.ts` (`textures`): `/media/textures/<slug>.jpg|.mp4`. All four are real photos supplied by the user. Hover videos are optional: `lib/public-file.ts` checks they exist at render time; missing ones are never rendered or requested.
- In-view animation primitives in `components/ui`: `FadeUp` (single block) and `StaggerList` + `StaggerItem` (lists; triggered by the list so carousel items that start clipped are already visible).

## Holiday banner (built in step 4, after step 5)
- Homepage order: see "Products + Bestsellers" below.
- `components/home/holiday-banner`: `HolidayBanner` (async server), `HolidayImage` (client: 1.06 → 1 entry, 12s Ken Burns while in view, 8 CSS sparkles), `PromoCode` (copy with "Copied ✓" for 2s). Countdown removed at the user's request.
- All sale details, including the campaign image, live in `data/promotions.ts` (exception to the media-manifest rule so the whole sale is edited in one place). `active: false` or a past `endDate` hides the banner AND its announcement-bar message.
- `lib/promotion.ts` `getActivePromotion()` uses `"use cache"` + `cacheLife("hours")`: Cache Components forbids reading the clock during prerender, so the live check is cached and refreshed hourly (an ended sale disappears within an hour).
- Compact by request: band height `clamp(480px, 40vw, 620px)`; the 16:9 image is height-fitted and set 7% past the right edge so the model in cream bleeds off the page (user likes this crop); its empty left edge fades into espresso (`fade-espresso-right`). Mobile: 4:3 image.
- `next.config.ts` `images.qualities: [75, 90]` (Next 16 allowlist; the banner uses 90).
- The announcement message uses an em-dash because the user asked for that exact text (overrides the anti-slop em-dash rule for this message only).

## The Velour Experience / bag story (step 6)
- Removed entirely at the user's request (it felt like too much). Not on the homepage; components and data deleted. Its photos remain unused in `/public/media/bag-story/`. Do not rebuild it unless asked.

## Products + Bestsellers (built in step 7)
- Homepage order: see "Brand Story" below.
- `types/product.ts`; `data/products.ts` (8 products, `bestsellers`, `getProduct`, `getFromPrice`, texture/category labels). Single-price products (serum) use `price` with empty `lengths`.
- Product images at `/media/products/<slug>/main.jpg|hover.jpg`, made from the user's own photos (texture, bag and holiday images; the bob photo for the bob wig; one crop of the holiday image for the body wave bundle deal). The serum has no photo yet and shows the placeholder. `lib/product-images.ts` (server) drops missing files so cards show a champagne placeholder with the name in Cormorant italic, never a broken image.
- `lib/pricing.ts` `getSalePrice(price, discount)`: sections pass `discount` from `getActivePromotion()` so an ended sale stops showing everywhere at once. Rounds to the nearest ₦100.
- `components/product`: `ProductCard` (stretched name link = whole card; separate "Quick add" link above it, no nested links), `ProductCardImage` (crossfade on hover devices), `ProductPrice`, `ProductRating`. Server-compatible; reuse everywhere.
- `components/home/bestsellers`: `Bestsellers` (async server), `BestsellersSlider` (client, Embla: 4 / 2.5 / 1.3 cards, arrows via `useSyncExternalStore`, progress line, focus scrolls slide into view), `SliderControls`.

## Brand Story (built in step 8)
- Homepage order: see "Newsletter + Footer" below.
- `components/home/brand-story`: `BrandStory` (server, ivory) with `craft.jpg` (user photo, `lib/media.ts` `brandStory`) via `RevealImage parallax={30}`, copy from `data/brand-story.ts`, `StatCounter` (client, counts up once in view; final value server-rendered).
- `RevealImage` now takes `parallax` (px of in-frame travel; image oversized so no edge shows).
- Trust Badges and Testimonials were built and then removed entirely at the user's request. Do not rebuild unless asked.

## Newsletter + Footer (built in step 9)
- Homepage order (set by the user): `Hero` → `ShopByTexture` → `HolidayBanner` → `Bestsellers` → `BrandStory` → `Newsletter`. The `Footer` is in the root layout (every page).
- `components/home/newsletter`: `Newsletter` (server, cream) + `NewsletterForm` (client: bottom-border input, validation, ~800ms loading, fade to thank-you). Submit logic in `lib/newsletter.ts` (mock; swap in a Route Handler/Server Action for Mailchimp/Klaviyo, keys server-side only).
- `components/layout/footer`: `Footer`, `FooterColumn` (accordion < lg), `FooterBottom` (async), `FooterWordmark` (fills width via `cqw` + justify-between, letters fade up once), `SocialIcon` (hand-drawn: lucide v1 has no brand logos), `BackToTop` (Lenis). Links in `data/footer.ts` (social hrefs and "Designed by [YOUR NAME]" are placeholders).
- `lib/year.ts`: footer year via `"use cache"` + `cacheLife("days")`. Cache Components rejects `new Date()` during prerender even in Client Components.

## Shop page (built in step 10)
- `/shop` = `app/shop/page.tsx` (server: resolves images + per-product discounts) → `<Suspense fallback={<ShopSkeleton/>}>` → client `components/shop/Shop.tsx` (reads the URL, so it must stay inside Suspense; the page shell stays static).
- Filters/sort live in the URL: `?category=&texture=a,b&length=8-12,20-24&min=&max=&sale=1&sort=`. Logic is pure in `lib/filter-products.ts`; `hooks/useShopFilters.ts` updates the URL with native `history.pushState` (tabs, sort) / `replaceState` (filters), which Next syncs with `useSearchParams` (shallow, no reload, no server round-trip).
- Nav/footer category links use `/shop?category=...`; `?sale=1` = On Sale. Homepage texture cards use `/shop?texture=...`.
- `components/shop`: `ShopHeader` (tabs, `layoutId` underline), `FilterBar` (sticky at `--sticky-top`, which the Navbar sets via `data-nav-hidden` on `<html>`), `FilterDrawer` (+ `FilterGroup`, `Checkbox`, `PriceRange`), `ActiveFilters`, `SortSelect` (+ mobile `SortSheet`), `ProductGrid` (Motion layout + AnimatePresence, 12 per page), `EmptyState`.
- 24 products; new ones reuse other products' dummy photos, marked `imageSource:` in `data/products.ts`. Hair care uses copies of the bag photos. Expect a dev-only Next LCP warning while photos are shared between products (it matches images by URL); it goes away with unique photos.
- Promotion applies only to `holidayPromotion.categories` (wigs, bundles, closures): use `discountFor(product, promo)` from `lib/pricing.ts`.

## Product page (built in step 11)
- `/product/[slug]` = `app/product/[slug]/page.tsx`: `generateStaticParams` (all products prerendered), `generateMetadata` (title, description, OG image; `metadataBase` in the root layout from `NEXT_PUBLIC_SITE_URL`), renders `ProductView` (resolves the product, `notFound()` for unknown slugs).
- `export const instant = false` on purpose: it keeps unknown slugs a real 404 (Suspense would stream a 200 + noindex) and `dynamicParams` isn't available with Cache Components. Real products stay instant (static + prefetched).
- `components/product`: `ProductGallery` (desktop stacked 4:5 + `GalleryThumbnails` + cursor zoom; mobile Embla + dots), `GalleryLightbox`, `ProductInfo` (client; sticky column that scrolls to its end if taller than the screen, via `--info-h`; live price roll; `handleAddToBag` is the hook-up point for the cart), `LengthSelector`/`DensitySelector` (native radios as pills), `QuantityStepper`, `ProductActions`, `ProductAccordion` (rating link opens Reviews via the `product:open-section` event), `StickyAddToBag`, `RelatedProducts` (server), `ProductBreadcrumb`.
- Selection state: `hooks/useProductOptions.ts`; prices: `getUnitPrice` in `lib/pricing.ts`. Gallery is DUMMY `[main, hover, main, hover]` from `getGalleryImages()` in `lib/product-images.ts` (swap for real gallery photos there).
- Accordion copy and SAMPLE reviews: `data/product-content.ts`.
- Compact by request: product page uses `<Container size="narrow">` (75rem), columns `minmax(0,32rem) | 25rem` (27rem at xl), centred (main image ~445px wide), name `clamp(1.75rem,2.6vw,2.5rem)`, 36px pills, medium buttons. Keep it this size.
- Client components must import `ProductCard` from `@/components/product/ProductCard`, not the barrel (the barrel also exports server-only components that touch the file system).

## Cart (built in step 12)
- Store: `store/cart.ts` (Zustand `persist`, key `velour-cart`, persists `items` + `appliedCode` only, `skipHydration: true`; `CartDrawer` calls `persist.rehydrate()` on mount). Types in `types/cart.ts`. Lines merge by `lineId` (productId|length|density), qty clamped 1-10.
- Pure logic in `lib/cart.ts` (unit tested, `npm test` = Vitest): `cartTotals`, `validatePromoCode`, `toCartItem`, `describeOptions`. Free-delivery threshold in `data/shipping.ts`.
- Pricing: items are stored at ORIGINAL prices plus their `salePrice`. Sale prices (and the Discount row) apply only while the VELOURXMAS code is applied, the promotion is live and the category is eligible; serum/hair care is never discounted. Subtotal = original prices, Total = after discount, free shipping is judged on the total.
- UI reads the cart via `hooks/useCart.ts` (empty until hydrated, so SSR matches; clock from `hooks/useNow.ts` because render can't call `Date.now()`). `hooks/useHydrated.ts` for anything else persisted.
- Adding: `hooks/useAddToBag.ts` (add → fly → open drawer). `hooks/useFlyToBag.ts` flies a 60px round thumbnail into `[data-cart-icon]` (outer X / inner Y curve, 700ms), dips the icon and pops `[data-cart-badge]`; if the navbar is hidden it fires `SHOW_NAV_EVENT` (`lib/events.ts`) first. Reduced motion: no flight, just the badge.
- `components/cart`: `CartDrawer`, `CartItem` (drawer/page variants), `CartSummary`, `ShippingProgress`, `PromoCodeInput`, `EmptyCart`, `QuickAddButton` (adds directly when a product has no options, otherwise opens `QuickAddModal`), `QuickAddModal`, `FlyToBag` (the flight layer), `CartPageView`. `CartDrawer`, `QuickAddModal`, `FlyToBag` are mounted once in the root layout. `CartRecommendations` is server-only and NOT in the barrel (import by path).
- `/cart` = `app/cart/page.tsx` (noindex): `CartPageView` + `CartRecommendations` (4 bestsellers, "You may also love."). Desktop sticky summary card; mobile fixed "Checkout · total" bar.
- Buy Now adds without animation and goes to `/checkout`. `components/ui/AnimatedPrice` rolls prices on change (cart + product page).

## Checkout + Order confirmation (built in step 13, DEMO: no real payments)
- `/checkout` = `app/(checkout)/checkout/page.tsx` → client `CheckoutLayout` (empty bag → `router.replace("/cart")`). Header: blush demo notice, Back to bag, logo, Secure checkout; footer is one line (Privacy · Terms · Returns).
- Steps (one page): `CheckoutFlow` + `CheckoutSteps` + `ContactStep` / `ShippingStep` / `PaymentStep`. react-hook-form + zod (`lib/checkout-schema.ts`, zod 4 + `@hookform/resolvers`). Phone: Nigerian (stored as `+234 803 123 4567`) or any `+` international number.
- `store/checkout.ts` (sessionStorage `velour-checkout`, skipHydration): step, contact, shipping, live `shippingMethod`. NEVER payment fields. Card values live only in the payment form (`shouldUnregister`); after payment only brand + last 4 are kept, in the order.
- Shipping: methods, countries, 36 states + FCT in `data/shipping.ts`; logic in `lib/shipping.ts` (`availableShippingMethods`, `checkoutTotals` = `cartTotals` + method cost, free for Lagos/Nationwide when the bag qualifies, `estimatedDelivery`). Tests: `lib/checkout.test.ts`.
- Payment: `lib/payment.ts` `processPayment()` is the ONE place to plug in Paystack (mock: 2s, always succeeds). Card helpers `lib/card.ts`; bank details + instalment count in `data/payment.ts`.
- `/order/success` = `app/(site)/order/success/page.tsx` → `components/order` (`OrderConfirmation`, `BagAnimation`, `OrderTimeline`, `OrderDetails`). The order summary is saved to sessionStorage `velour-order` (`lib/order.ts`, read via `hooks/useOrder.ts`); the page empties the bag + checkout once (`cartCleared`). No order → `/shop`.
- Shared: `CartSummary` takes `pendingShippingLabel` / `large`; `SummaryItem` (thumbnail + qty badge) is used by checkout and confirmation; `components/ui/CopyButton` + `lib/clipboard.ts`; `--color-error` (#9A3324, AA on cream) is for form errors only.
- `useHydrated(store?)` works for any persisted store. Only touch `store.persist` inside callbacks: it doesn't exist on the server.
- Dev: with Cache Components, Next keeps the previous route's layout in the DOM (hidden) after client navigation, so `querySelector` can find a hidden navbar on `/checkout`. Check visibility in tests.

## Dev gotcha
- If a new Tailwind class or `@utility`/`@theme` token is missing in `next dev` (but present in `next build`), the Turbopack dev cache is stale: stop the dev server, delete `.next/dev`, restart.
- After replacing an image file under the same name, `next/image` keeps serving the old optimised copy: delete `.next/dev/cache/images` (dev) or `.next/cache/images` (prod) and reload.

## Assets
- Hero video and images will be AI-generated later. Use tasteful placeholders for now.
- All media lives under `/public/media/...` and every path is referenced from ONE manifest (`/lib/media.ts`) so files can be swapped without touching components.

## Anti-slop rules (from `design-taste-frontend`)
The brief explicitly names Cormorant Garamond and the cream/espresso palette, so the skill's serif and beige-palette overrides apply. Everything else in that skill still holds, notably:
- No em-dashes (`—`) in any site copy, alt text, or button labels. Use a hyphen or rewrite.
- No 3-equal-column feature card rows, no section-number eyebrows ("01 / ..."), no scroll cues, no decorative dot/hairline grids, no locale/time strips.
- Hero holds one focused message + CTA; trust strips and feature bullets go in sections below.
- `min-h-[100dvh]` instead of `h-screen` for full-height sections. CSS Grid over flex percentage math.
- No div-built fake product mockups; use real (placeholder) imagery.

## Skills playbook
Use these installed skills at the matching step (invoke via the Skill tool):

| When | Skill(s) |
|---|---|
| Any new page/section design | `design-taste-frontend` (primary anti-slop gate), `high-end-visual-design`, `minimalist-ui`, `frontend-design` |
| Component polish, hover states, spacing, radii, icons | `better-ui`, `ui-ux-pro-max` |
| Framer Motion work (transitions, gestures, `whileInView`) | `motion` |
| React/Next architecture & performance | `vercel-react-best-practices`, `vercel-composition-patterns` |
| Cart store, pricing, currency logic | `tdd` (test-first) |
| Seeing a change working in the browser | `run` |
| After each step | `web-design-guidelines` (a11y/UX audit), `simplify`, `code-review` |
| Checkout / forms / any user input | `security-review` |
| Generating site imagery & design references | `imagegen-frontend-web` (one reference image per section), `social-media-skills:image-prompt` → `nano-banana` / `flux`, `anthropic-skills:flow-fashion-realism` (model/hair photography) |
| Generating the hero video | `social-media-skills:ai-video` → `veo-3` / `kling` / `runway` |
| Revisiting built pages later | `redesign-existing-projects` |

Not used: `shadcn` (its defaults conflict with the bespoke editorial look); video/YouTube/social-publishing skills unless we move to marketing.

## Folder structure (rule for every step)
Every section of the site gets its own folder inside `/components`, holding its own components. **Page files stay clean: they only import and arrange section components.**

```
/components
  /ui              → shared building blocks (Button, RevealText, RevealImage, Container, Section)
  /layout          → AnnouncementBar, Navbar, MobileMenu, Footer, SmoothScroll, PageTransition
  /home
    /hero          → Hero.tsx, HeroVideo.tsx, HeroContent.tsx, Loader.tsx
    /textures      → ShopByTexture.tsx, TextureCard.tsx, TextureMarquee.tsx
    /bag-story     → BagStory.tsx, BagScene.tsx, BundleLabel.tsx
    /bestsellers   → Bestsellers.tsx, ProductRow.tsx
    /brand-story   → BrandStory.tsx, StatCounter.tsx
    /trust         → TrustBadges.tsx, TrustBadge.tsx
    /testimonials  → Testimonials.tsx, TestimonialQuote.tsx, UGCCard.tsx
    /newsletter    → Newsletter.tsx
  /product         → ProductCard.tsx, ProductGallery.tsx, LengthSelector.tsx, etc.
  /shop            → FilterBar.tsx, FilterDrawer.tsx, ProductGrid.tsx
  /cart            → CartDrawer.tsx, CartItem.tsx, ShippingProgress.tsx, FlyToBag.tsx
  /checkout        → CheckoutSteps.tsx, OrderSummary.tsx, ShippingForm.tsx, etc.
/lib               → shared logic: gsap.ts, motion.ts, utils.ts (cn), currency.ts, media.ts
/hooks             → custom hooks
/data              → mock data (products.ts)
/store             → Zustand cart state
```

- Each section folder has an `index.ts` that exports its main section component (`/ui` and `/layout` export all their components). Import from the folder: `import { Hero } from "@/components/home/hero"`.
- One component per file. If a component grows past ~150 lines, split it into smaller components in the same folder.
- Create a folder only when we build that section; no empty placeholder folders.

## Working agreement
- Build one step at a time; confirm scope before each step.
- Keep components small and typed; shared tokens, easings, currency and media paths each live in one place.
- Verify each step in the browser (desktop + mobile width, reduced-motion on) before calling it done.
