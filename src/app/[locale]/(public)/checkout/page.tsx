import { getTranslations } from "next-intl/server";
import { getSettings, SETTING_KEYS } from "@/lib/settings";
import { CheckoutClient } from "./checkout-client";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params: { locale } }: { params: { locale: Locale } }) {
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: `${t("title")} — Kidorly` };
}

export default async function CheckoutPage({ params: { locale } }: { params: { locale: Locale } }) {
  const settings = await getSettings([
    SETTING_KEYS.SHIPPING_HURGHADA,
    SETTING_KEYS.SHIPPING_CAIRO,
    SETTING_KEYS.SHIPPING_ALEXANDRIA,
  ]);

  const shippingFees = {
    HURGHADA: parseFloat(settings[SETTING_KEYS.SHIPPING_HURGHADA] || "50"),
    CAIRO: parseFloat(settings[SETTING_KEYS.SHIPPING_CAIRO] || "80"),
    ALEXANDRIA: parseFloat(settings[SETTING_KEYS.SHIPPING_ALEXANDRIA] || "80"),
  };

  return <CheckoutClient shippingFees={shippingFees} />;
}
