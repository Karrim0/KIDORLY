"use client";

import { useLocale, useTranslations } from "next-intl";
import { FileCheck2, LockKeyhole, RotateCcw, Truck } from "lucide-react";
import type { Locale } from "@/lib/i18n";

const policyCopy: Record<Locale, Record<"privacy" | "terms" | "shipping" | "returns", string[]>> = {
  ar: {
    privacy: [
      "نجمع فقط البيانات اللازمة لتنفيذ طلبك والتواصل معك: الاسم، رقم الهاتف، المحافظة، المدينة وعنوان التوصيل أو بيانات الفندق.",
      "نستخدم بياناتك لتأكيد الطلب والتوصيل وخدمة ما بعد البيع فقط، ولا نبيعها أو نشاركها لأغراض إعلانية مع أطراف أخرى.",
      "عمليات Vodafone Cash وInstaPay تتم من خلال مقدمي الخدمة، ولا نخزن كلمات مرور أو بيانات دخول للدفع.",
    ],
    terms: [
      "المنتجات والأسعار والعروض تخضع للتوفر، ويظهر السعر النهائي بالجنيه المصري قبل تأكيد الطلب.",
      "يراجع فريقنا الطلب ويؤكده عبر واتساب. لا يعتبر الطلب نهائيًا قبل التأكيد وتوافر المنتج.",
      "نعرض بيانات وصور المنتجات بأكبر دقة ممكنة، وقد توجد فروق بسيطة في اللون بسبب الشاشة أو تحديثات الشركة المصنعة.",
    ],
    shipping: [
      "نوصل لجميع محافظات مصر، وتظهر رسوم الشحن بوضوح في ملخص الطلب قبل الإرسال.",
      "مدة التوصيل تعتمد على مكانك وتوفر المنتج، ويؤكدها فريقنا معك عبر واتساب.",
      "للتوصيل للفنادق، تأكد من قبول الاستقبال للطرود واكتب اسم الضيف وبيانات الحجز بشكل صحيح.",
    ],
    returns: [
      "تواصل معنا فورًا إذا وصل المنتج تالفًا أو مختلفًا عن الطلب، مع الاحتفاظ بالتغليف وصور واضحة للحالة.",
      "تعتمد أهلية الاستبدال أو الاسترجاع على حالة المنتج وطبيعته وتعليمات الشركة المصنعة، وسنوضح لك الخيارات قبل تنفيذ الإجراء.",
      "لا تستخدم المنتج أو تزيل ملحقاته إذا كنت تريد طلب استبدال أو استرجاع.",
    ],
  },
  en: {
    privacy: [
      "We collect only what is needed to fulfil and support your order: name, phone number, governorate, city, and delivery address or hotel details.",
      "Your data is used for order confirmation, delivery, and after-sales support. We do not sell it or share it with third parties for advertising.",
      "Vodafone Cash and InstaPay transactions are handled by their providers; Kidorly does not store payment passwords or account credentials.",
    ],
    terms: [
      "Products, prices, and promotions are subject to availability. Your final total is shown in Egyptian Pounds before you place the order.",
      "Our team reviews and confirms orders through WhatsApp. An order is final only after confirmation and an availability check.",
      "We aim to show accurate product details and images; minor colour differences may occur because of screens or manufacturer updates.",
    ],
    shipping: [
      "We deliver across Egypt. The applicable shipping fee is shown clearly in your order summary before submission.",
      "Delivery time depends on your location and product availability and is confirmed with you through WhatsApp.",
      "For hotel delivery, please confirm that reception accepts parcels and enter the guest and booking details accurately.",
    ],
    returns: [
      "Contact us promptly if an item arrives damaged or differs from your order, and keep the packaging with clear photos of the condition.",
      "Exchange or return eligibility depends on the product condition, type, and manufacturer guidance. We will explain the available options before proceeding.",
      "Do not use the product or remove its accessories if you intend to request an exchange or return.",
    ],
  },
  de: {
    privacy: [
      "Wir erfassen nur die Daten, die für Bestellung und Support nötig sind: Name, Telefonnummer, Gouvernement, Stadt sowie Lieferadresse oder Hoteldaten.",
      "Die Daten werden nur für Bestätigung, Lieferung und Kundenservice genutzt. Wir verkaufen sie nicht und geben sie nicht zu Werbezwecken weiter.",
      "Vodafone-Cash- und InstaPay-Zahlungen werden von den jeweiligen Anbietern verarbeitet; Kidorly speichert keine Zahlungskennwörter oder Zugangsdaten.",
    ],
    terms: [
      "Produkte, Preise und Aktionen gelten vorbehaltlich Verfügbarkeit. Der Endbetrag wird vor dem Absenden in ägyptischen Pfund angezeigt.",
      "Unser Team prüft und bestätigt Bestellungen per WhatsApp. Eine Bestellung ist erst nach Bestätigung und Verfügbarkeitsprüfung verbindlich.",
      "Wir bemühen uns um genaue Bilder und Angaben; je nach Bildschirm oder Hersteller-Update sind leichte Farbabweichungen möglich.",
    ],
    shipping: [
      "Wir liefern in ganz Ägypten. Die Versandkosten werden vor dem Absenden klar in der Bestellübersicht angezeigt.",
      "Die Lieferzeit hängt von Standort und Verfügbarkeit ab und wird per WhatsApp bestätigt.",
      "Bei Hotellieferungen bitte vorher klären, ob die Rezeption Pakete annimmt, und Gästedaten korrekt angeben.",
    ],
    returns: [
      "Melde dich zeitnah, wenn ein Artikel beschädigt oder abweichend ankommt. Bewahre Verpackung und aussagekräftige Fotos auf.",
      "Ob Umtausch oder Rückgabe möglich ist, hängt von Zustand, Produktart und Herstellervorgaben ab. Wir erläutern die Optionen vorab.",
      "Benutze den Artikel nicht und entferne kein Zubehör, wenn du Umtausch oder Rückgabe beantragen möchtest.",
    ],
  },
};

export function PoliciesClient() {
  const t = useTranslations("policies");
  const locale = useLocale() as Locale;
  const sections = [
    { key: "privacy" as const, icon: LockKeyhole },
    { key: "terms" as const, icon: FileCheck2 },
    { key: "shipping" as const, icon: Truck },
    { key: "returns" as const, icon: RotateCcw },
  ];

  return (
    <main className="page-safe-top bg-gradient-to-b from-brand-coral/5 via-white to-white pb-16">
      <div className="container max-w-4xl">
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <p className="text-xs font-black uppercase tracking-[.16em] text-brand-coral">Kidorly care</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">{t("title")}</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{t("intro")}</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {sections.map(({ key, icon: Icon }) => (
            <section key={key} className="rounded-[1.6rem] border border-slate-100 bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,.07)] sm:p-6">
              <div className="mb-4 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-coral/10 text-brand-coral"><Icon className="h-5 w-5" /></span>
                <h2 className="text-lg font-black text-slate-950">{t(key)}</h2>
              </div>
              <ul className="space-y-3 text-sm leading-6 text-slate-600">
                {policyCopy[locale][key].map((paragraph) => (
                  <li key={paragraph} className="relative ps-5 before:absolute before:start-0 before:top-[.65rem] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand-sky">{paragraph}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
