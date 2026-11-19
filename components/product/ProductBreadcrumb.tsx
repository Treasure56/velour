import Link from "next/link";
import { CATEGORIES } from "@/lib/filter-products";
import type { Product } from "@/types/product";

/** Home / Shop / Category / Product, every part a link. */
export function ProductBreadcrumb({ product }: { product: Product }) {
  const category = CATEGORIES.find((c) => c.key === product.category);
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...(category ? [{ label: category.label, href: `/shop?category=${category.key}` }] : []),
    { label: product.name, href: `/product/${product.slug}` },
  ];

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-mocha">
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={c.href} className="flex gap-2">
              <Link
                href={c.href}
                aria-current={last ? "page" : undefined}
                className={last ? "text-espresso" : "hover:text-espresso"}
              >
                {c.label}
              </Link>
              {!last && <span aria-hidden>/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
