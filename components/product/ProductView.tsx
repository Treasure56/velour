import { notFound } from "next/navigation";
import { Container } from "@/components/ui";
import { getProduct } from "@/data/products";
import { discountFor } from "@/lib/pricing";
import { getGalleryImages, resolveProductImages } from "@/lib/product-images";
import { getActivePromotion } from "@/lib/promotion";
import { ProductBreadcrumb } from "./ProductBreadcrumb";
import { ProductGallery } from "./ProductGallery";
import { ProductInfo } from "./ProductInfo";
import { RelatedProducts } from "./RelatedProducts";

/**
 * The whole product page for one slug: resolves the product from the route params (404 if unknown),
 * then lays out breadcrumb, gallery, info column and related products.
 */
export async function ProductView({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const promotion = await getActivePromotion();
  const discount = discountFor(product, promotion);
  const images = resolveProductImages(product);

  return (
    <>
      <Container size="narrow" className="pt-32 lg:pt-36">
        <ProductBreadcrumb product={product} />
        <div className="mt-6 grid gap-10 lg:mt-8 lg:grid-cols-[minmax(0,32rem)_25rem] lg:justify-center lg:gap-12 xl:grid-cols-[minmax(0,32rem)_27rem] xl:gap-20">
          <ProductGallery images={getGalleryImages(images)} name={product.name} />
          <ProductInfo
            product={product}
            discount={discount}
            promoCode={discount ? (promotion?.code ?? null) : null}
            thumb={images.main}
          />
        </div>
      </Container>
      <RelatedProducts product={product} promotion={promotion} />
    </>
  );
}
