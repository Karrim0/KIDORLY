import { getTranslations } from "next-intl/server";
import { getSettings, SETTING_KEYS } from "@/lib/settings";
import { CheckoutClient } from "./checkout-client";
import type { Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: `${t("title")} — Kidorly` };
}

export default async function CheckoutPage() {
  const settings = await getSettings([
    SETTING_KEYS.SHIPPING_ALL_EGYPT,
    SETTING_KEYS.SHIPPING_DEFAULT,
    SETTING_KEYS.SHIPPING_HURGHADA,
    SETTING_KEYS.SHIPPING_CAIRO,
    SETTING_KEYS.SHIPPING_ALEXANDRIA,
  ]);

  const shippingFees = {
    ALL_EGYPT: parseFloat(settings[SETTING_KEYS.SHIPPING_ALL_EGYPT] || settings[SETTING_KEYS.SHIPPING_DEFAULT] || "200"),
    DEFAULT: parseFloat(settings[SETTING_KEYS.SHIPPING_DEFAULT] || "200"),
    HURGHADA: parseFloat(settings[SETTING_KEYS.SHIPPING_HURGHADA] || "50"),
    CAIRO: parseFloat(settings[SETTING_KEYS.SHIPPING_CAIRO] || "80"),
    ALEXANDRIA: parseFloat(settings[SETTING_KEYS.SHIPPING_ALEXANDRIA] || "80"),
  };

  return <CheckoutClient shippingFees={shippingFees} />;
}
