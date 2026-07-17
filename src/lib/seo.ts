import { locales, type Locale } from "@/lib/i18n";

export function localizedAlternates(locale: Locale, path = "") {
  const normalizedPath = path.startsWith("/") || !path ? path : `/${path}`;

  return {
    canonical: `/${locale}${normalizedPath}`,
    languages: {
      ...Object.fromEntries(locales.map((item) => [item, `/${item}${normalizedPath}`])),
      "x-default": `/ar${normalizedPath}`,
    },
  };
}
