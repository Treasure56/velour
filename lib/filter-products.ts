import { getFromPrice } from "@/data/products";
import { getSalePrice } from "@/lib/pricing";
import type { ResolvedProductImages } from "@/lib/product-images";
import type { Product, ProductCategory, ProductTexture } from "@/types/product";

/** One product as the shop page receives it from the server. */
export type ShopItem = {
  product: Product;
  images: ResolvedProductImages;
  /** Live promotion discount for this product (%), or null */
  discount: number | null;
};

export type CategoryKey = "all" | ProductCategory;
export type SortKey = "featured" | "bestsellers" | "newest" | "price-asc" | "price-desc";
export type LengthRange = "8-12" | "14-18" | "20-24" | "26-30";

export type ShopFilters = {
  category: CategoryKey;
  textures: ProductTexture[];
  lengths: LengthRange[];
  priceMin: number | null;
  priceMax: number | null;
  onSale: boolean;
  sort: SortKey;
};

export const CATEGORIES: { key: CategoryKey; label: string }[] = [
  { key: "all", label: "All" },
  { key: "wigs", label: "Wigs" },
  { key: "bundles", label: "Bundles" },
  { key: "closures", label: "Closures & Frontals" },
  { key: "hair-care", label: "Hair Care" },
];

export const TEXTURES: { key: ProductTexture; label: string }[] = [
  { key: "straight", label: "Straight" },
  { key: "body-wave", label: "Body Wave" },
  { key: "deep-wave", label: "Deep Wave" },
  { key: "kinky-curly", label: "Kinky Curly" },
];

export const LENGTHS: { key: LengthRange; label: string; min: number; max: number }[] = [
  { key: "8-12", label: '8"–12"', min: 8, max: 12 },
  { key: "14-18", label: '14"–18"', min: 14, max: 18 },
  { key: "20-24", label: '20"–24"', min: 20, max: 24 },
  { key: "26-30", label: '26"–30"', min: 26, max: 30 },
];

export const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "bestsellers", label: "Bestsellers" },
  { key: "newest", label: "Newest" },
  { key: "price-asc", label: "Price: Low to High" },
  { key: "price-desc", label: "Price: High to Low" },
];

export const DEFAULT_FILTERS: ShopFilters = {
  category: "all",
  textures: [],
  lengths: [],
  priceMin: null,
  priceMax: null,
  onSale: false,
  sort: "featured",
};

// ─── URL <-> filters ───────────────────────────────────────────────
// /shop?category=wigs&texture=body-wave,straight&length=20-24&min=100000&max=400000&sale=1&sort=price-asc

const list = <T extends string>(value: string | null, allowed: readonly T[]): T[] =>
  (value ?? "").split(",").filter((v): v is T => (allowed as readonly string[]).includes(v));

const num = (value: string | null) => {
  const n = Number(value);
  return value && Number.isFinite(n) && n >= 0 ? n : null;
};

export function parseFilters(params: URLSearchParams): ShopFilters {
  const category = params.get("category");
  const sort = params.get("sort");
  return {
    category: CATEGORIES.some((c) => c.key === category) ? (category as CategoryKey) : "all",
    textures: list(params.get("texture"), TEXTURES.map((t) => t.key)),
    lengths: list(params.get("length"), LENGTHS.map((l) => l.key)),
    priceMin: num(params.get("min")),
    priceMax: num(params.get("max")),
    onSale: params.has("sale"),
    sort: SORTS.some((s) => s.key === sort) ? (sort as SortKey) : "featured",
  };
}

/** Query string for the filters (defaults omitted), without the leading "?". */
export function serializeFilters(f: ShopFilters): string {
  const params = new URLSearchParams();
  if (f.category !== "all") params.set("category", f.category);
  if (f.textures.length) params.set("texture", f.textures.join(","));
  if (f.lengths.length) params.set("length", f.lengths.join(","));
  if (f.priceMin !== null) params.set("min", String(f.priceMin));
  if (f.priceMax !== null) params.set("max", String(f.priceMax));
  if (f.onSale) params.set("sale", "1");
  if (f.sort !== "featured") params.set("sort", f.sort);
  return params.toString().replaceAll("%2C", ",");
}

/** How many refining filters (not category or sort) are active. */
export const activeFilterCount = (f: ShopFilters) =>
  f.textures.length + f.lengths.length + (f.priceMin !== null || f.priceMax !== null ? 1 : 0) + (f.onSale ? 1 : 0);

// ─── Filtering + sorting ───────────────────────────────────────────

/** The price a shopper sees on the card: lowest price, after any live discount. */
export const shopPrice = (item: ShopItem) => getSalePrice(getFromPrice(item.product), item.discount);

/** Lowest and highest shop price across items, rounded outward to the slider step (₦5,000). */
export function priceBounds(items: ShopItem[]): [number, number] {
  const prices = items.map(shopPrice);
  const step = 5_000;
  return [Math.max(step, Math.floor(Math.min(...prices) / step) * step), Math.ceil(Math.max(...prices) / step) * step];
}

function matches(item: ShopItem, f: ShopFilters): boolean {
  const { product } = item;
  if (f.category !== "all" && product.category !== f.category) return false;
  if (f.textures.length && (!product.texture || !f.textures.includes(product.texture))) return false;
  if (f.lengths.length) {
    const ranges = LENGTHS.filter((l) => f.lengths.includes(l.key));
    const fits = product.options.lengths.some((o) => ranges.some((r) => o.inches >= r.min && o.inches <= r.max));
    if (!fits) return false;
  }
  const price = shopPrice(item);
  if (f.priceMin !== null && price < f.priceMin) return false;
  if (f.priceMax !== null && price > f.priceMax) return false;
  if (f.onSale && !item.discount) return false;
  return true;
}

const sorters: Record<SortKey, (a: ShopItem, b: ShopItem) => number> = {
  featured: () => 0, // keep catalogue order
  bestsellers: (a, b) =>
    Number(b.product.isBestseller) - Number(a.product.isBestseller) || b.product.reviewCount - a.product.reviewCount,
  newest: (a, b) => b.product.createdAt.localeCompare(a.product.createdAt),
  "price-asc": (a, b) => shopPrice(a) - shopPrice(b),
  "price-desc": (a, b) => shopPrice(b) - shopPrice(a),
};

/** Items matching the filters, in the chosen order. */
export function filterProducts(items: ShopItem[], f: ShopFilters): ShopItem[] {
  return items.filter((item) => matches(item, f)).sort(sorters[f.sort]);
}
