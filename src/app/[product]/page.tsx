import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "@/components/product/ProductPage";
import { PRODUCTS, productBySlug } from "@/lib/nav";
import { productContent } from "@/lib/products";

/* Product pages for products in development: /dos, /stacionar, /pobytove, /sluzby-a-pomocky */
export const dynamicParams = false;

export function generateStaticParams() {
  return PRODUCTS.filter((p) => p.status === "dev").map((p) => ({ product: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[product]">): Promise<Metadata> {
  const { product: slug } = await params;
  const product = productBySlug(slug);
  const content = productContent(slug);
  if (!product || !content) return {};
  return {
    title: `${product.name} | ${product.statusLabel}`,
    description: content.hero.lead,
    alternates: { canonical: product.href },
  };
}

export default async function Page({ params }: PageProps<"/[product]">) {
  const { product: slug } = await params;
  const product = productBySlug(slug);
  const content = productContent(slug);
  if (!product || !content || product.status !== "dev") notFound();
  return <ProductPage product={product} content={content} />;
}
