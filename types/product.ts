export type ProductCategory = "wigs" | "bundles" | "closures" | "hair-care";

export type ProductTexture = "straight" | "body-wave" | "deep-wave" | "kinky-curly";

export type LengthOption = {
  inches: number;
  /** Naira, whole units */
  price: number;
};

export type DensityOption = {
  label: "150%" | "180%" | "250%";
  /** Added to the length price, Naira */
  priceAddOn: number;
};

export type ProductBadge = "Bestseller" | "New";

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  texture: ProductTexture | null;
  description: string;
  details: string[];
  images: {
    main: string;
    hover: string;
    gallery: string[];
  };
  options: {
    /** Empty for products sold at a single price (see `price`). */
    lengths: LengthOption[];
    densities?: DensityOption[];
    laceType?: string;
  };
  /** Single price for products without length options (e.g. hair care). */
  price?: number;
  rating: number;
  reviewCount: number;
  badges: ProductBadge[];
  isBestseller: boolean;
  /** ISO date the product was added (used for "Newest" sorting). */
  createdAt: string;
};
