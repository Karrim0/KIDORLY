export const dynamic = "force-dynamic";
import { getTranslations } from "next-intl/server";
import { CategoryForm } from "@/components/admin/category-form";

export default async function NewCategoryPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: "admin" });
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t("newCategory")}</h1>
      <CategoryForm />
    </div>
  );
}
