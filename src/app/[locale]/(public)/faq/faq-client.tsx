"use client";

import { useLocale, useTranslations } from "next-intl";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { HelpCircle, MessageCircle, ShieldCheck, Truck } from "lucide-react";

const faqData = {
  en: [
    {
      q: "How does ordering work?",
      a: "Browse our products, add items to your cart, and complete the checkout form. After placing your order, we’ll confirm the details with you through WhatsApp.",
    },
    {
      q: "Do you deliver across Egypt?",
      a: "Yes, delivery is available across Egypt. Shipping time and cost may vary depending on your location, and we’ll confirm everything after your order is placed.",
    },
    {
      q: "Do you deliver to homes and hotels?",
      a: "Yes. You can choose home delivery or hotel delivery during checkout. For hotel delivery, please add the hotel name, guest name, and room number if available.",
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept Cash on Delivery, Vodafone Cash, and InstaPay. Payment details are confirmed through WhatsApp after placing your order.",
    },
    {
      q: "How much is shipping?",
      a: "Shipping is currently fixed at EGP 200 across Egypt, unless a different shipping offer is announced.",
    },
    {
      q: "How long does delivery take?",
      a: "Delivery time depends on your location and product availability. We’ll confirm the expected delivery time with you through WhatsApp.",
    },
    {
      q: "Can I return or exchange a product?",
      a: "Please contact us through WhatsApp as soon as possible if you have any issue with your order. We’ll review the case and help you find the best solution.",
    },
    {
      q: "Are your products genuine?",
      a: "Yes. Our products are sourced from trusted suppliers and brands, and we care about checking quality before delivery.",
    },
  ],
  ar: [
    {
      q: "إزاي أعمل طلب؟",
      a: "تصفح المنتجات، ضيف اللي محتاجه للسلة، وكمل بيانات الطلب في صفحة الدفع. بعد تأكيد الطلب، هنراجع التفاصيل معاك من خلال واتساب.",
    },
    {
      q: "هل التوصيل متاح لكل مصر؟",
      a: "نعم، التوصيل متاح لكل محافظات مصر. مدة التوصيل وتكلفة الشحن ممكن تختلف حسب المكان، وهنأكد التفاصيل معاك بعد الطلب.",
    },
    {
      q: "هل فيه توصيل للبيت والفنادق؟",
      a: "نعم. تقدر تختار توصيل للبيت أو توصيل للفندق أثناء إتمام الطلب. في حالة الفندق، اكتب اسم الفندق واسم الضيف ورقم الغرفة لو متاح.",
    },
    {
      q: "إيه طرق الدفع المتاحة؟",
      a: "متاح الدفع عند الاستلام، فودافون كاش، وإنستا باي. تفاصيل الدفع بيتم تأكيدها معاك من خلال واتساب بعد الطلب.",
    },
    {
      q: "الشحن بكام؟",
      a: "الشحن حاليًا ثابت 200 ج.م لكل مصر، إلا لو تم الإعلان عن عرض شحن مختلف.",
    },
    {
      q: "التوصيل بياخد وقت قد إيه؟",
      a: "مدة التوصيل بتختلف حسب مكانك وتوفر المنتج. هنأكد معاك مدة التوصيل المتوقعة من خلال واتساب.",
    },
    {
      q: "ينفع أرجع أو أبدل المنتج؟",
      a: "لو عندك أي مشكلة في الطلب، تواصل معنا على واتساب في أسرع وقت. هنراجع الحالة ونساعدك نوصل لأفضل حل.",
    },
    {
      q: "هل المنتجات أصلية؟",
      a: "نعم، المنتجات من موردين وبراندات موثوقة، وبنهتم بمراجعة الجودة قبل التوصيل.",
    },
  ],
  de: [
    {
      q: "Wie funktioniert die Bestellung?",
      a: "Stöbere in unseren Produkten, lege Artikel in den Warenkorb und fülle das Checkout-Formular aus. Nach der Bestellung bestätigen wir die Details über WhatsApp.",
    },
    {
      q: "Liefern Sie in ganz Ägypten?",
      a: "Ja, Lieferung ist in ganz Ägypten verfügbar. Lieferzeit und Versandkosten können je nach Standort variieren und werden nach der Bestellung bestätigt.",
    },
    {
      q: "Liefern Sie nach Hause und an Hotels?",
      a: "Ja. Du kannst beim Checkout Lieferung nach Hause oder Hotellieferung auswählen. Für Hotellieferung gib bitte Hotelname, Gastname und Zimmernummer an, falls verfügbar.",
    },
    {
      q: "Welche Zahlungsmethoden akzeptieren Sie?",
      a: "Wir akzeptieren Barzahlung bei Lieferung, Vodafone Cash und InstaPay. Zahlungsdetails werden nach der Bestellung über WhatsApp bestätigt.",
    },
    {
      q: "Wie hoch sind die Versandkosten?",
      a: "Die Versandkosten betragen derzeit 200 EGP in ganz Ägypten, sofern kein anderes Versandangebot angekündigt wird.",
    },
    {
      q: "Wie lange dauert die Lieferung?",
      a: "Die Lieferzeit hängt von deinem Standort und der Produktverfügbarkeit ab. Wir bestätigen die voraussichtliche Lieferzeit über WhatsApp.",
    },
    {
      q: "Kann ich ein Produkt zurückgeben oder umtauschen?",
      a: "Wenn es ein Problem mit deiner Bestellung gibt, kontaktiere uns bitte so schnell wie möglich über WhatsApp. Wir prüfen den Fall und helfen dir weiter.",
    },
    {
      q: "Sind Ihre Produkte original?",
      a: "Ja. Unsere Produkte stammen von vertrauenswürdigen Lieferanten und Marken, und wir achten vor der Lieferung auf die Qualität.",
    },
  ],
};

export function FAQClient() {
  const locale = useLocale();
  const t = useTranslations("faq");

  const faqs = faqData[locale as keyof typeof faqData] || faqData.en;

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/60 to-white">
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-coral/10 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-[420px] h-72 w-72 rounded-full bg-brand-sky/10 blur-3xl" />

      <div className="container relative page-safe-top pb-14 sm:pb-16">
        <section className="mx-auto max-w-3xl">
          {/* Header */}
          <div className="mb-6 overflow-hidden rounded-[2rem] border border-gray-100 bg-white/85 p-6 text-center shadow-[0_14px_44px_rgba(15,23,42,0.09)] ring-1 ring-black/[0.03] backdrop-blur-sm sm:p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-coral/10 text-brand-coral">
              <HelpCircle className="h-8 w-8" />
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl md:text-4xl">
              {t("title")}
            </h1>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {t("subtitle")}
            </p>

            <div className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-2">
              <div className="rounded-2xl bg-gray-50 px-3 py-3">
                <Truck className="mx-auto mb-1 h-4 w-4 text-brand-sky" />
                <p className="text-[11px] font-bold text-muted-foreground">
                  {t("delivery")}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 px-3 py-3">
                <MessageCircle className="mx-auto mb-1 h-4 w-4 text-emerald-600" />
                <p className="text-[11px] font-bold text-muted-foreground">
                  {t("support")}
                </p>
              </div>

              <div className="rounded-2xl bg-gray-50 px-3 py-3">
                <ShieldCheck className="mx-auto mb-1 h-4 w-4 text-brand-coral" />
                <p className="text-[11px] font-bold text-muted-foreground">
                  {t("quality")}
                </p>
              </div>
            </div>
          </div>

          {/* Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`faq-${index}`}
                className="overflow-hidden rounded-3xl border border-gray-100 bg-white px-4 shadow-[0_10px_30px_rgba(15,23,42,0.07)] ring-1 ring-black/[0.02] data-[state=open]:border-brand-coral/20 sm:px-5"
              >
                <AccordionTrigger className="py-4 text-start text-sm font-extrabold leading-relaxed text-gray-950 hover:no-underline sm:text-base">
                  {faq.q}
                </AccordionTrigger>

                <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      </div>
    </main>
  );
}