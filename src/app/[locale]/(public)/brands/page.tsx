import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    orderBy: { nameEn: "asc" },
  });

  return (
    <main className="container py-24">
      <h1 className="text-3xl font-bold mb-6">Brands</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {brands.map((brand) => (
          <div key={brand.id} className="rounded-2xl border bg-white p-4">
            <p className="font-semibold">{brand.nameEn}</p>
          </div>
        ))}
      </div>
    </main>
  );
}