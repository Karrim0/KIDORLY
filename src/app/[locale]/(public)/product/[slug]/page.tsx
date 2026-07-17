import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ProductDetailClient } from "./product-detail-client";
import type { Locale } from "@/lib/i18n";
import { localizedAlternates } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { getTranslated } from "@/lib/utils";

interface Props { params: Promise<{ locale: Locale; slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await prisma.product.findUnique({ where: { slug } });
  if (!product) return {};
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const titleKey = `seoTitle${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof product;
  const descKey = `seoDesc${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof product;
  const nameKey = `name${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof product;
  const title = (product[titleKey] as string) || `${product[nameKey]} — Kidorly`;
  const description = (product[descKey] as string) ||
    (product[`shortDesc${locale.charAt(0).toUpperCase() + locale.slice(1)}` as keyof typeof product] as string) ||
    String(product[nameKey]);
  const primaryImage = product.images?.[0]
    ? new URL(product.images[0], baseUrl).toString()
    : undefined;
  const images = primaryImage
    ? [{ url: primaryImage, alt: String(product[nameKey]) }]
    : undefined;
  const productUrl = new URL(`/${locale}/product/${slug}`, baseUrl).toString();

  return {
    title,
    description,
    alternates: localizedAlternates(locale, `/product/${slug}`),
    openGraph: { title, description, url: productUrl, type: "website", images },
    twitter: { card: "summary_large_image", title, description, images: primaryImage ? [primaryImage] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true, brand: true },
  });
  if (!product) notFound();

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      availability: "AVAILABLE",
    },
    include: { category: true, brand: true },
    take: 4,
  });

  const name = getTranslated(product, "name", locale);
  const description = getTranslated(product, "shortDesc", locale) || getTranslated(product, "description", locale) || name;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kidorly.com";

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name,
          description,
          image: product.images,
          sku: product.id,
          brand: product.brand ? { "@type": "Brand", name: getTranslated(product.brand, "name", locale) } : undefined,
          offers: {
            "@type": "Offer",
            url: `${baseUrl}/${locale}/product/${slug}`,
            priceCurrency: "EGP",
            price: product.price,
            availability: product.availability === "AVAILABLE" ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            itemCondition: "https://schema.org/NewCondition",
          },
        }}
      />
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  );
}
