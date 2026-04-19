import { getTranslations } from "next-intl/server";
import { FAQClient } from "./faq-client";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: "faq" });
  return {
    title: `${t("title")} — Kidorly`,
    description: t("subtitle"),
  };
}

export default function FAQPage() {
  return <FAQClient />;
}
