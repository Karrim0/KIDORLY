"use client";

import { useLocale, useTranslations } from "next-intl";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqData = {
  en: [
    { q: "How does ordering work?", a: "Simply browse our products, add items to your cart, and complete the checkout form. After placing your order, you'll be connected with us on WhatsApp to confirm and arrange payment." },
    { q: "Which cities do you deliver to?", a: "We currently deliver to Hurghada, Cairo, and Alexandria. Hurghada orders can be delivered to homes or hotels." },
    { q: "Do you deliver to hotels?", a: "Yes! We offer hotel delivery in Hurghada, which is perfect for tourists. Just provide your hotel name, guest name, and room number at checkout." },
    { q: "What payment methods do you accept?", a: "We accept Cash on Delivery, Vodafone Cash, and InstaPay. Payment is finalized through WhatsApp after placing your order." },
    { q: "How long does delivery take?", a: "Delivery times vary by city and product availability. We'll confirm the expected delivery time when you contact us on WhatsApp." },
    { q: "Can I return or exchange a product?", a: "Please contact us on WhatsApp within 24 hours of receiving your order if you have any issues. We'll work with you to find a solution." },
    { q: "Are your products genuine?", a: "Yes, all our products are sourced from trusted suppliers and brands. We ensure quality before every delivery." },
  ],
  ar: [
    { q: "كيف يتم الطلب؟", a: "تصفح منتجاتنا، أضف العناصر إلى سلتك، وأكمل نموذج الشراء. بعد تقديم الطلب، سيتم توصيلك بنا عبر واتساب لتأكيد الطلب وترتيب الدفع." },
    { q: "ما المدن التي توصّلون إليها؟", a: "نوصّل حالياً إلى الغردقة والقاهرة والإسكندرية. طلبات الغردقة يمكن توصيلها للمنازل أو الفنادق." },
    { q: "هل توصّلون للفنادق؟", a: "نعم! نقدم خدمة التوصيل للفنادق في الغردقة، وهي مثالية للسياح. فقط أدخل اسم الفندق واسم الضيف ورقم الغرفة." },
    { q: "ما طرق الدفع المتاحة؟", a: "نقبل الدفع عند الاستلام، فودافون كاش، وإنستاباي. يتم إتمام الدفع عبر واتساب." },
    { q: "كم يستغرق التوصيل؟", a: "تختلف مدة التوصيل حسب المدينة وتوفر المنتج. سنؤكد وقت التوصيل المتوقع عند التواصل معك عبر واتساب." },
    { q: "هل يمكنني إرجاع المنتج؟", a: "يرجى التواصل معنا عبر واتساب خلال 24 ساعة من استلام طلبك. سنعمل معك لإيجاد حل." },
    { q: "هل منتجاتكم أصلية؟", a: "نعم، جميع منتجاتنا من موردين وعلامات تجارية موثوقة. نتأكد من الجودة قبل كل توصيل." },
  ],
  de: [
    { q: "Wie funktioniert die Bestellung?", a: "Stöbern Sie in unseren Produkten, legen Sie Artikel in den Warenkorb und füllen Sie das Bestellformular aus. Nach der Bestellung werden Sie über WhatsApp mit uns verbunden." },
    { q: "In welche Städte liefern Sie?", a: "Wir liefern derzeit nach Hurghada, Kairo und Alexandria. In Hurghada liefern wir auch an Hotels." },
    { q: "Liefern Sie an Hotels?", a: "Ja! Wir bieten Hotellieferung in Hurghada an — perfekt für Touristen. Geben Sie einfach den Hotelnamen, Gastnamen und die Zimmernummer an." },
    { q: "Welche Zahlungsmethoden akzeptieren Sie?", a: "Wir akzeptieren Nachnahme, Vodafone Cash und InstaPay. Die Zahlung wird über WhatsApp abgewickelt." },
    { q: "Wie lange dauert die Lieferung?", a: "Die Lieferzeit variiert je nach Stadt und Produktverfügbarkeit. Wir bestätigen die voraussichtliche Lieferzeit per WhatsApp." },
    { q: "Kann ich ein Produkt zurückgeben?", a: "Bitte kontaktieren Sie uns innerhalb von 24 Stunden nach Erhalt über WhatsApp. Wir finden gemeinsam eine Lösung." },
    { q: "Sind Ihre Produkte original?", a: "Ja, alle unsere Produkte stammen von vertrauenswürdigen Lieferanten und Marken. Wir garantieren Qualität." },
  ],
};

export function FAQClient() {
  const locale = useLocale();
  const t = useTranslations("faq");
  const faqs = faqData[locale as keyof typeof faqData] || faqData.en;

  return (
    <div className="container py-16 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-3">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="bg-white rounded-2xl border px-6">
            <AccordionTrigger className="text-start font-semibold hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
