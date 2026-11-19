import type { DensityOption, LengthOption, Product, ProductCategory, ProductTexture } from "@/types/product";

/** Even lengths from `from` to `to` inches, price rising by `step` per 2 inches. */
function lengths(from: number, to: number, startPrice: number, step: number): LengthOption[] {
  const out: LengthOption[] = [];
  for (let inches = from, price = startPrice; inches <= to; inches += 2, price += step) {
    out.push({ inches, price });
  }
  return out;
}

const wigDensities: DensityOption[] = [
  { label: "150%", priceAddOn: 0 },
  { label: "180%", priceAddOn: 45_000 },
  { label: "250%", priceAddOn: 120_000 },
];

/**
 * Image paths for a product folder: /media/products/[slug]/main.jpg and hover.jpg.
 * New products currently pass ANOTHER product's slug to reuse its (dummy) photos; each such call
 * is marked `imageSource:`. To give a product its own photos, add them under its own slug and
 * change the argument to that slug.
 */
function images(slug: string): Product["images"] {
  const main = `/media/products/${slug}/main.jpg`;
  const hover = `/media/products/${slug}/hover.jpg`;
  return { main, hover, gallery: [main, hover] };
}

export const products: Product[] = [
  // ─── Original eight ───────────────────────────────────────────────
  {
    id: "p-001",
    slug: "silk-straight-frontal-wig",
    name: "Silk Straight Frontal Wig",
    category: "wigs",
    texture: "straight",
    description:
      "Glass-smooth raw straight hair on an undetectable 13x4 HD lace frontal. Pre-plucked, bleached knots, ready to wear.",
    details: ["100% raw virgin hair", "13x4 HD lace frontal", "Pre-plucked hairline", "Adjustable band and combs", "Can be dyed and heat styled"],
    images: images("silk-straight-frontal-wig"),
    options: { lengths: lengths(12, 30, 285_000, 45_000), densities: wigDensities, laceType: "13x4 HD lace frontal" },
    rating: 4.9,
    reviewCount: 214,
    badges: ["Bestseller"],
    isBestseller: true,
    createdAt: "2025-09-14",
  },
  {
    id: "p-002",
    slug: "body-wave-closure-wig",
    name: "Body Wave Closure Wig",
    category: "wigs",
    texture: "body-wave",
    description: "Soft, voluminous body waves on a 5x5 HD lace closure. Beginner friendly and quick to install.",
    details: ["100% raw virgin hair", "5x5 HD lace closure", "Glueless fit", "Holds curl and blowout"],
    images: images("body-wave-closure-wig"),
    options: { lengths: lengths(12, 30, 245_000, 40_000), densities: wigDensities, laceType: "5x5 HD lace closure" },
    rating: 4.8,
    reviewCount: 187,
    badges: ["Bestseller"],
    isBestseller: true,
    createdAt: "2025-10-02",
  },
  {
    id: "p-003",
    slug: "deep-wave-frontal-wig",
    name: "Deep Wave Frontal Wig",
    category: "wigs",
    texture: "deep-wave",
    description: "Defined, glossy deep waves with a 13x4 HD lace frontal for a natural hairline and versatile parting.",
    details: ["100% raw virgin hair", "13x4 HD lace frontal", "Pre-plucked hairline", "Low-shedding, tangle-resistant"],
    images: images("deep-wave-frontal-wig"),
    options: { lengths: lengths(12, 30, 295_000, 45_000), densities: wigDensities, laceType: "13x4 HD lace frontal" },
    rating: 4.8,
    reviewCount: 156,
    badges: ["Bestseller"],
    isBestseller: true,
    createdAt: "2025-11-20",
  },
  {
    id: "p-004",
    slug: "kinky-curly-wig",
    name: "Kinky Curly Wig",
    category: "wigs",
    texture: "kinky-curly",
    description: "Full, springy kinky curls that blend with natural 4A-4B textures. Bold volume, soft to the touch.",
    details: ["100% raw virgin hair", "13x4 transparent lace frontal", "Natural-looking density", "Wash-and-go friendly"],
    images: images("kinky-curly-wig"),
    options: { lengths: lengths(12, 30, 275_000, 42_000), densities: wigDensities, laceType: "13x4 transparent lace frontal" },
    rating: 4.7,
    reviewCount: 98,
    badges: ["New"],
    isBestseller: false,
    createdAt: "2026-10-18",
  },
  {
    id: "p-005",
    slug: "raw-straight-bundles",
    name: "Raw Straight Bundles (3)",
    category: "bundles",
    texture: "straight",
    description: "Three single-donor raw straight bundles with full ends from root to tip. Enough for a complete install.",
    details: ["3 bundles, 100g each", "Single-donor raw hair", "Double-weft, minimal shedding", "Lasts 2+ years with care"],
    images: images("raw-straight-bundles"),
    options: { lengths: lengths(12, 30, 165_000, 30_000) },
    rating: 4.9,
    reviewCount: 301,
    badges: ["Bestseller"],
    isBestseller: true,
    createdAt: "2025-08-03",
  },
  {
    id: "p-006",
    slug: "body-wave-bundle-deal",
    name: "Body Wave Bundle Deal + Closure",
    category: "bundles",
    texture: "body-wave",
    description: "Three body wave bundles with a matching 5x5 HD lace closure, colour-matched and ready to sew in.",
    details: ["3 bundles + 5x5 HD closure", "Single-donor raw hair", "Colour-matched set", "Free part closure"],
    images: images("body-wave-bundle-deal"),
    options: { lengths: lengths(12, 30, 215_000, 35_000), laceType: "5x5 HD lace closure" },
    rating: 4.8,
    reviewCount: 142,
    badges: ["Bestseller"],
    isBestseller: true,
    createdAt: "2026-01-12",
  },
  {
    id: "p-007",
    slug: "silk-press-bob-wig",
    name: "Silk Press Bob Wig",
    category: "wigs",
    texture: "straight",
    description: "A sharp, silk-pressed bob with a blunt finish on a 5x5 HD lace closure. Polished from day one.",
    details: ["100% raw virgin hair", "5x5 HD lace closure", "Blunt cut, pre-styled", "Glueless fit"],
    images: images("silk-press-bob-wig"),
    options: { lengths: lengths(8, 12, 165_000, 20_000), densities: wigDensities, laceType: "5x5 HD lace closure" },
    rating: 4.8,
    reviewCount: 119,
    badges: ["Bestseller"],
    isBestseller: true,
    createdAt: "2026-02-25",
  },
  {
    id: "p-008",
    slug: "silk-shine-serum",
    name: "Velour Silk Shine Serum",
    category: "hair-care",
    texture: null,
    description: "A weightless argan and camellia serum that restores shine and tames frizz on raw hair and wigs.",
    details: ["50ml", "Argan and camellia oils", "Heat protection up to 230°C", "Safe for coloured hair"],
    images: images("silk-shine-serum"), // imageSource: dummy copies of the Velour bag photos (bag-story)
    options: { lengths: [] },
    price: 38_000,
    rating: 4.7,
    reviewCount: 76,
    badges: [],
    isBestseller: false,
    createdAt: "2026-03-30",
  },

  // ─── Wigs ─────────────────────────────────────────────────────────
  {
    id: "p-009",
    slug: "glueless-straight-wig",
    name: "Glueless Straight Wig",
    category: "wigs",
    texture: "straight",
    description: "Wear-and-go raw straight hair on a pre-cut 6x4 HD lace. No glue, no fuss, a flawless hairline in minutes.",
    details: ["100% raw virgin hair", "6x4 glueless HD lace", "Pre-cut lace, pre-plucked", "Elastic band fit"],
    images: images("silk-straight-frontal-wig"), // imageSource: silk-straight-frontal-wig
    options: { lengths: lengths(12, 26, 230_000, 38_000), densities: wigDensities, laceType: "6x4 glueless HD lace" },
    rating: 4.8,
    reviewCount: 64,
    badges: ["New"],
    isBestseller: false,
    createdAt: "2026-10-28",
  },
  {
    id: "p-010",
    slug: "body-wave-frontal-wig-30",
    name: "Body Wave Frontal Wig 30\"",
    category: "wigs",
    texture: "body-wave",
    description: "Waist-length body waves on a 13x4 HD lace frontal. Maximum drama, effortless movement.",
    details: ["100% raw virgin hair", "30 inches", "13x4 HD lace frontal", "Pre-plucked hairline"],
    images: images("body-wave-closure-wig"), // imageSource: body-wave-closure-wig
    options: { lengths: [{ inches: 30, price: 720_000 }], densities: wigDensities, laceType: "13x4 HD lace frontal" },
    rating: 4.9,
    reviewCount: 41,
    badges: [],
    isBestseller: false,
    createdAt: "2026-09-12",
  },
  {
    id: "p-011",
    slug: "deep-wave-glueless-wig",
    name: "Deep Wave Glueless Wig",
    category: "wigs",
    texture: "deep-wave",
    description: "Glossy deep waves on a pre-cut glueless lace. Defined curls you can wear straight out of the box.",
    details: ["100% raw virgin hair", "6x4 glueless HD lace", "Pre-cut lace", "Elastic band fit"],
    images: images("deep-wave-frontal-wig"), // imageSource: deep-wave-frontal-wig
    options: { lengths: lengths(12, 26, 255_000, 40_000), densities: wigDensities, laceType: "6x4 glueless HD lace" },
    rating: 4.7,
    reviewCount: 22,
    badges: ["New"],
    isBestseller: false,
    createdAt: "2026-11-05",
  },
  {
    id: "p-012",
    slug: "curly-bob-wig",
    name: "Curly Bob Wig",
    category: "wigs",
    texture: "kinky-curly",
    description: "A playful chin-length curly bob on a 5x5 HD closure. Full shape, zero heat needed.",
    details: ["100% raw virgin hair", "5x5 HD lace closure", "Pre-shaped cut", "Glueless fit"],
    images: images("kinky-curly-wig"), // imageSource: kinky-curly-wig
    options: { lengths: lengths(8, 12, 185_000, 20_000), densities: wigDensities, laceType: "5x5 HD lace closure" },
    rating: 4.8,
    reviewCount: 57,
    badges: [],
    isBestseller: false,
    createdAt: "2026-08-19",
  },
  {
    id: "p-013",
    slug: "layered-straight-wig",
    name: "Layered Straight Wig",
    category: "wigs",
    texture: "straight",
    description: "Soft face-framing layers on raw straight hair with a 13x4 HD lace frontal. Movement without volume loss.",
    details: ["100% raw virgin hair", "13x4 HD lace frontal", "Face-framing layers", "Pre-plucked hairline"],
    images: images("silk-straight-frontal-wig"), // imageSource: silk-straight-frontal-wig
    options: { lengths: lengths(14, 28, 310_000, 42_000), densities: wigDensities, laceType: "13x4 HD lace frontal" },
    rating: 4.8,
    reviewCount: 88,
    badges: [],
    isBestseller: false,
    createdAt: "2026-06-02",
  },
  {
    id: "p-014",
    slug: "side-part-body-wave-wig",
    name: "Side Part Body Wave Wig",
    category: "wigs",
    texture: "body-wave",
    description: "A deep side part and glamorous body waves on a 13x4 HD lace frontal. Old Hollywood, made easy.",
    details: ["100% raw virgin hair", "13x4 HD lace frontal", "Deep side part", "Holds curl for days"],
    images: images("body-wave-bundle-deal"), // imageSource: body-wave-bundle-deal
    options: { lengths: lengths(12, 26, 265_000, 40_000), densities: wigDensities, laceType: "13x4 HD lace frontal" },
    rating: 4.9,
    reviewCount: 36,
    badges: [],
    isBestseller: false,
    createdAt: "2026-10-10",
  },

  // ─── Bundles ──────────────────────────────────────────────────────
  {
    id: "p-015",
    slug: "deep-wave-bundles",
    name: "Deep Wave Bundles (3)",
    category: "bundles",
    texture: "deep-wave",
    description: "Three single-donor deep wave bundles with defined, uniform ripples from root to tip.",
    details: ["3 bundles, 100g each", "Single-donor raw hair", "Double-weft", "Curl pattern holds after washing"],
    images: images("deep-wave-frontal-wig"), // imageSource: deep-wave-frontal-wig
    options: { lengths: lengths(12, 30, 175_000, 32_000) },
    rating: 4.8,
    reviewCount: 122,
    badges: [],
    isBestseller: false,
    createdAt: "2026-04-14",
  },
  {
    id: "p-016",
    slug: "kinky-curly-bundles",
    name: "Kinky Curly Bundles (3)",
    category: "bundles",
    texture: "kinky-curly",
    description: "Three kinky curly bundles that blend seamlessly with natural hair. Big, soft, defined volume.",
    details: ["3 bundles, 100g each", "Single-donor raw hair", "Double-weft", "Blends with 4A-4B textures"],
    images: images("kinky-curly-wig"), // imageSource: kinky-curly-wig
    options: { lengths: lengths(12, 26, 180_000, 32_000) },
    rating: 4.7,
    reviewCount: 69,
    badges: [],
    isBestseller: false,
    createdAt: "2026-05-21",
  },
  {
    id: "p-017",
    slug: "straight-bundle-deal-frontal",
    name: "Straight Bundle Deal + Frontal",
    category: "bundles",
    texture: "straight",
    description: "Three raw straight bundles with a matching 13x4 HD lace frontal for a complete, seamless install.",
    details: ["3 bundles + 13x4 HD frontal", "Single-donor raw hair", "Colour-matched set", "Pre-plucked frontal"],
    images: images("raw-straight-bundles"), // imageSource: raw-straight-bundles
    options: { lengths: lengths(12, 30, 255_000, 38_000), laceType: "13x4 HD lace frontal" },
    rating: 4.9,
    reviewCount: 93,
    badges: [],
    isBestseller: false,
    createdAt: "2026-07-08",
  },
  {
    id: "p-018",
    slug: "deep-wave-bundle-deal-closure",
    name: "Deep Wave Bundle Deal + Closure",
    category: "bundles",
    texture: "deep-wave",
    description: "Three deep wave bundles with a matching 5x5 HD lace closure, colour-matched and ready to sew in.",
    details: ["3 bundles + 5x5 HD closure", "Single-donor raw hair", "Colour-matched set", "Free part closure"],
    images: images("deep-wave-frontal-wig"), // imageSource: deep-wave-frontal-wig
    options: { lengths: lengths(12, 30, 225_000, 36_000), laceType: "5x5 HD lace closure" },
    rating: 4.8,
    reviewCount: 47,
    badges: [],
    isBestseller: false,
    createdAt: "2026-09-30",
  },

  // ─── Closures & Frontals ──────────────────────────────────────────
  {
    id: "p-019",
    slug: "straight-5x5-hd-closure",
    name: "Straight 5x5 HD Closure",
    category: "closures",
    texture: "straight",
    description: "An invisible 5x5 HD lace closure in raw straight hair. Free part, pre-plucked, bleached knots.",
    details: ["5x5 HD lace", "Free part", "Pre-plucked, bleached knots", "Matches Velour straight bundles"],
    images: images("silk-straight-frontal-wig"), // imageSource: silk-straight-frontal-wig
    options: { lengths: lengths(12, 20, 85_000, 12_000), laceType: "5x5 HD lace closure" },
    rating: 4.8,
    reviewCount: 110,
    badges: [],
    isBestseller: false,
    createdAt: "2026-03-11",
  },
  {
    id: "p-020",
    slug: "body-wave-13x4-hd-frontal",
    name: "Body Wave 13x4 HD Frontal",
    category: "closures",
    texture: "body-wave",
    description: "Ear-to-ear 13x4 HD lace frontal in body wave. Melts into every skin tone for a natural hairline.",
    details: ["13x4 HD lace", "Ear-to-ear coverage", "Pre-plucked hairline", "Matches Velour body wave bundles"],
    images: images("body-wave-closure-wig"), // imageSource: body-wave-closure-wig
    options: { lengths: lengths(12, 22, 120_000, 15_000), laceType: "13x4 HD lace frontal" },
    rating: 4.7,
    reviewCount: 84,
    badges: [],
    isBestseller: false,
    createdAt: "2026-02-19",
  },
  {
    id: "p-021",
    slug: "deep-wave-5x5-closure",
    name: "Deep Wave 5x5 Closure",
    category: "closures",
    texture: "deep-wave",
    description: "A 5x5 HD lace closure in deep wave, made to finish a deep wave install flawlessly.",
    details: ["5x5 HD lace", "Free part", "Pre-plucked", "Matches Velour deep wave bundles"],
    images: images("deep-wave-frontal-wig"), // imageSource: deep-wave-frontal-wig
    options: { lengths: lengths(12, 20, 90_000, 12_000), laceType: "5x5 HD lace closure" },
    rating: 4.8,
    reviewCount: 18,
    badges: ["New"],
    isBestseller: false,
    createdAt: "2026-11-12",
  },

  // ─── Hair care ────────────────────────────────────────────────────
  {
    id: "p-022",
    slug: "silk-bonnet",
    name: "Velour Silk Bonnet",
    category: "hair-care",
    texture: null,
    description: "A pure mulberry silk bonnet that protects your hair and wigs overnight. Less friction, less frizz.",
    details: ["100% mulberry silk", "Adjustable band", "Fits long hair and wigs", "Hand wash"],
    images: images("silk-shine-serum"), // imageSource: silk-shine-serum (dummy bag photos)
    options: { lengths: [] },
    price: 18_000,
    rating: 4.9,
    reviewCount: 203,
    badges: [],
    isBestseller: false,
    createdAt: "2026-07-30",
  },
  {
    id: "p-023",
    slug: "hydrating-mask",
    name: "Velour Hydrating Mask",
    category: "hair-care",
    texture: null,
    description: "A rich weekly mask with shea and hyaluronic acid that brings softness back to raw hair.",
    details: ["200ml", "Shea butter and hyaluronic acid", "For bundles, wigs and natural hair", "Sulphate-free"],
    images: images("silk-shine-serum"), // imageSource: silk-shine-serum (dummy bag photos)
    options: { lengths: [] },
    price: 32_000,
    rating: 4.8,
    reviewCount: 51,
    badges: ["New"],
    isBestseller: false,
    createdAt: "2026-10-22",
  },
  {
    id: "p-024",
    slug: "wide-tooth-comb",
    name: "Velour Wide-Tooth Comb",
    category: "hair-care",
    texture: null,
    description: "A smooth, seamless wide-tooth comb that detangles gently without snagging or shedding.",
    details: ["Seamless finish", "Wide teeth for curls and waves", "Anti-static", "Travel size"],
    images: images("silk-shine-serum"), // imageSource: silk-shine-serum (dummy bag photos)
    options: { lengths: [] },
    price: 9_500,
    rating: 4.7,
    reviewCount: 97,
    badges: [],
    isBestseller: false,
    createdAt: "2026-05-05",
  },
];

export const bestsellers = products.filter((p) => p.isBestseller);

export const getProduct = (slug: string) => products.find((p) => p.slug === slug);

/** Lowest price a product can be bought for (shortest length, base density, or its single price). */
export function getFromPrice(product: Product): number {
  if (product.options.lengths.length === 0) return product.price ?? 0;
  return Math.min(...product.options.lengths.map((l) => l.price));
}

export const textureLabel: Record<ProductTexture, string> = {
  straight: "Straight",
  "body-wave": "Body Wave",
  "deep-wave": "Deep Wave",
  "kinky-curly": "Kinky Curly",
};

export const categoryLabel: Record<ProductCategory, string> = {
  wigs: "Wig",
  bundles: "Bundles",
  closures: "Closure",
  "hair-care": "Hair Care",
};
