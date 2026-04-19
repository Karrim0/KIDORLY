"use client";

import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";

export function PoliciesClient() {
  const t = useTranslations("policies");

  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-3xl font-bold mb-10 text-center">{t("title")}</h1>

      {/* Privacy */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t("privacy")}</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
          <p>At Kidorly, we are committed to protecting your personal information. We collect only the data necessary to process your order: your name, phone number, city, and delivery address or hotel details.</p>
          <p>Your information is used exclusively for order fulfillment and communication through WhatsApp. We do not sell, share, or distribute your personal data to any third parties.</p>
          <p>Payment information shared via Vodafone Cash or InstaPay is handled directly through those platforms. We do not store payment credentials.</p>
          <p>By placing an order with Kidorly, you consent to the collection and use of your information as described in this policy.</p>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Terms */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">{t("terms")}</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
          <p>By using the Kidorly website and placing an order, you agree to these terms and conditions.</p>
          <p>All products listed on our website are subject to availability. Prices are displayed in Egyptian Pounds (EGP) and may change without prior notice.</p>
          <p>Orders are confirmed through WhatsApp after checkout. An order is only finalized once confirmed by our team.</p>
          <p>Products are sourced upon order confirmation. Delivery times depend on product availability and your location.</p>
          <p>We reserve the right to cancel or refuse any order if the product is unavailable or if we suspect fraudulent activity.</p>
          <p>Product images are for illustration purposes. Actual products may vary slightly in color or design.</p>
        </div>
      </section>

      <Separator className="my-8" />

      {/* Shipping */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{t("shipping")}</h2>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-3">
          <p>We deliver to Hurghada, Cairo, and Alexandria. Shipping fees vary by city and are displayed at checkout.</p>
          <p>In Hurghada, we offer both home delivery and hotel delivery — perfect for tourists visiting the Red Sea.</p>
          <p>Delivery times are communicated through WhatsApp after order confirmation. Standard delivery typically takes 2-5 business days depending on the city and product availability.</p>
          <p>Please ensure someone is available to receive the order at the provided address or hotel. For hotel deliveries, please confirm with the hotel reception that packages can be received on your behalf.</p>
          <p>If you need to change your delivery address after placing an order, please contact us immediately through WhatsApp.</p>
        </div>
      </section>
    </div>
  );
}
