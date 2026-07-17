import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import type { Metadata, Viewport } from "next";
import { Outfit, Cairo } from "next/font/google";
import { locales, isRtl, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit", display: "swap" });
const cairo = Cairo({ subsets: ["arabic"], variable: "--font-cairo", display: "swap" });

const copy = {
  ar: {
    title: "كيدورلي — منتجات أطفال مميزة في مصر",
    description: "عربيات أطفال وسكوترات ومنتجات مختارة بعناية، مع توصيل لجميع محافظات مصر.",
  },
  en: {
    title: "Kidorly — Premium Kids Products in Egypt",
    description: "Strollers, scooters and carefully selected kids products, delivered across Egypt.",
  },
  de: {
    title: "Kidorly — Premium-Kinderprodukte in Ägypten",
    description: "Kinderwagen, Scooter und ausgewählte Kinderprodukte mit Lieferung in ganz Ägypten.",
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const content = copy[locale] || copy.en;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const socialImage = new URL("/images/hero.webp", baseUrl).toString();

  return {
    metadataBase: new URL(baseUrl),
    title: content.title,
    description: content.description,
    icons: { icon: "/favicon.svg" },
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      siteName: "Kidorly",
      locale,
      title: content.title,
      description: content.description,
      images: [{ url: socialImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.description,
      images: [socialImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ff6b6b",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const messages = await getMessages();
  const rtl = isRtl(locale);
  return (
    <html lang={locale} dir={rtl ? "rtl" : "ltr"} suppressHydrationWarning>
      <body
        className={cn(
          outfit.variable,
          cairo.variable,
          rtl ? "font-arabic" : "font-sans",
          "min-h-screen bg-background antialiased",
        )}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
