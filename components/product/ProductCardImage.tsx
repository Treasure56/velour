import Image from "next/image";

type ProductCardImageProps = {
  name: string;
  /** Only passed when the file exists (see lib/product-images.ts). */
  main?: string;
  hover?: string;
  sizes: string;
  /** Load immediately (for cards visible on first paint, e.g. the first grid row). */
  eager?: boolean;
};

/**
 * Main image, crossfading to the hover image on hover-capable devices (0.6s, no zoom).
 * Without a main image: a champagne-tinted block with the product name in Cormorant italic.
 * Images are decorative here; the card's link carries the product name.
 */
export function ProductCardImage({ name, main, hover, sizes, eager = false }: ProductCardImageProps) {
  if (!main) {
    return (
      <div aria-hidden className="absolute inset-0 grid place-items-center bg-champagne/45 p-6 text-center">
        <span className="font-serif text-2xl italic leading-snug text-mocha">{name}</span>
      </div>
    );
  }

  return (
    <>
      <Image src={main} alt="" fill sizes={sizes} loading={eager ? "eager" : undefined} className="object-cover" />
      {hover && (
        <Image
          src={hover}
          alt=""
          fill
          sizes={sizes}
          className="object-cover opacity-0 transition-opacity duration-600 ease-luxe motion-reduce:transition-none [@media(hover:hover)]:group-hover/card:opacity-100"
        />
      )}
    </>
  );
}
