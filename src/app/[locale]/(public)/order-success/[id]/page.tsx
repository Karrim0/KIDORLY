import { notFound } from "next/navigation";
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import { getSettings, SETTING_KEYS } from "@/lib/settings";
import { OrderSuccessClient } from "./order-success-client";
import type { Locale } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Order Confirmed — Kidorly",
  robots: { index: false }, // Don't index order pages
};

export default async function OrderSuccessPage({
  params: { locale, id },
}: {
  params: { locale: Locale; id: string };
}) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  const settings = await getSettings([
    SETTING_KEYS.WHATSAPP_NUMBER,
    SETTING_KEYS.PAYMENT_INSTRUCTIONS_EN,
    SETTING_KEYS.PAYMENT_INSTRUCTIONS_AR,
    SETTING_KEYS.PAYMENT_INSTRUCTIONS_DE,
    SETTING_KEYS.VODAFONE_NUMBER,
    SETTING_KEYS.INSTAPAY_ID,
  ]);

  return <OrderSuccessClient order={order} settings={settings} />;
}
