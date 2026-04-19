import prisma from "@/lib/prisma";
import { locales } from "@/lib/i18n";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://kidorly.com";

export async function GET() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ select: { slug: true, updatedAt: true } }),
  ]);

  const staticPages = ["", "/shop", "/offers", "/contact", "/faq", "/policies"];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

  // Static pages for each locale
  for (const page of staticPages) {
    for (const locale of locales) {
      xml += `
  <url>
    <loc>${BASE_URL}/${locale}${page}</loc>
    <changefreq>${page === "" ? "daily" : "weekly"}</changefreq>
    <priority>${page === "" ? "1.0" : "0.8"}</priority>
    ${locales
      .map(
        (l) =>
          `<xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}${page}" />`
      )
      .join("\n    ")}
  </url>`;
    }
  }

  // Product pages
  for (const product of products) {
    for (const locale of locales) {
      xml += `
  <url>
    <loc>${BASE_URL}/${locale}/product/${product.slug}</loc>
    <lastmod>${product.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
    ${locales
      .map(
        (l) =>
          `<xhtml:link rel="alternate" hreflang="${l}" href="${BASE_URL}/${l}/product/${product.slug}" />`
      )
      .join("\n    ")}
  </url>`;
    }
  }

  // Category pages
  for (const cat of categories) {
    for (const locale of locales) {
      xml += `
  <url>
    <loc>${BASE_URL}/${locale}/category/${cat.slug}</loc>
    <lastmod>${cat.updatedAt.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    }
  }

  xml += `\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
