import type { Metadata } from "next";
import { ProductView } from "@/components/product";
import { getProduct, products } from "@/data/products";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

/**
 * Wait for the product before sending anything, so an unknown slug returns a real 404 (not a
 * streamed 200 + noindex). Every real product is prerendered and its links prefetch the full static
 * page, so navigating between products stays instant. (`dynamicParams` isn't available with
 * Cache Components, hence this instead.)
 */
export const instant = false;

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | VELOUR`,
      description: product.description,
      images: [{ url: product.images.main, alt: product.name }],
    },
  };
}

export default function ProductPage({ params }: PageProps<"/product/[slug]">) {
  return <ProductView params={params} />;
}
