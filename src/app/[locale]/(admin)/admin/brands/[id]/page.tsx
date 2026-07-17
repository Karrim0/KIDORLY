import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { BrandForm } from "@/components/admin/brand-form";

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const brand = await prisma.brand.findUnique({ where: { id } });
  if (!brand) notFound();

  return <BrandForm brand={brand as any} />;
}
