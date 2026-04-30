import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BrandDetailClient } from "./brand-detail-client";

export default async function BrandPage({
  params,
}: {
  params: { slug: string };
}) {
  const brand = await prisma.brand.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        include: { category: true, brand: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!brand) notFound();

  return <BrandDetailClient brand={brand as any} />;
}
