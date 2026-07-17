import { getTranslations } from "next-intl/server";
import { PoliciesClient } from "./policies-client";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "policies" });
  return {
    title: `${t("title")} — Kidorly`,
  };
}

export default function PoliciesPage() {
  return <PoliciesClient />;
}
