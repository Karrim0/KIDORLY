import { getTranslations } from "next-intl/server";
import { getSettings, SETTING_KEYS } from "@/lib/settings";
import { ContactClient } from "./contact-client";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: `${t("title")} — Kidorly` };
}

export default async function ContactPage() {
  const settings = await getSettings([
    SETTING_KEYS.WHATSAPP_NUMBER,
    SETTING_KEYS.CONTACT_EMAIL,
    SETTING_KEYS.CONTACT_PHONE,
    SETTING_KEYS.INSTAGRAM,
    SETTING_KEYS.FACEBOOK,
    SETTING_KEYS.TIKTOK,
  ]);
  return <ContactClient settings={settings} />;
}
