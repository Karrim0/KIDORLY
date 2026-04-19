import prisma from "./prisma";

/** Get a single setting value */
export async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.siteSetting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

/** Get a setting parsed as JSON */
export async function getSettingJson<T = unknown>(key: string): Promise<T | null> {
  const val = await getSetting(key);
  if (!val) return null;
  try {
    return JSON.parse(val) as T;
  } catch {
    return null;
  }
}

/** Get multiple settings at once */
export async function getSettings(keys: string[]): Promise<Record<string, string>> {
  const settings = await prisma.siteSetting.findMany({
    where: { key: { in: keys } },
  });
  const map: Record<string, string> = {};
  for (const s of settings) map[s.key] = s.value;
  return map;
}

/** Upsert a setting */
export async function setSetting(key: string, value: string) {
  return prisma.siteSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

/** Get homepage section data */
export async function getHomepageSection<T = unknown>(sectionKey: string): Promise<T | null> {
  const section = await prisma.homepageSection.findUnique({
    where: { sectionKey },
  });
  if (!section) return null;
  try {
    return JSON.parse(section.data) as T;
  } catch {
    return null;
  }
}

/** Upsert homepage section */
export async function setHomepageSection(
  sectionKey: string,
  data: unknown,
  sortOrder?: number,
  visible?: boolean
) {
  return prisma.homepageSection.upsert({
    where: { sectionKey },
    update: {
      data: JSON.stringify(data),
      ...(sortOrder !== undefined && { sortOrder }),
      ...(visible !== undefined && { visible }),
    },
    create: {
      sectionKey,
      data: JSON.stringify(data),
      sortOrder: sortOrder ?? 0,
      visible: visible ?? true,
    },
  });
}

// Common setting keys
export const SETTING_KEYS = {
  WHATSAPP_NUMBER: "whatsapp_number",
  WHATSAPP_TEMPLATE_AR: "whatsapp_template_ar",
  WHATSAPP_TEMPLATE_EN: "whatsapp_template_en",
  WHATSAPP_TEMPLATE_DE: "whatsapp_template_de",
  VODAFONE_NUMBER: "vodafone_cash_number",
  INSTAPAY_ID: "instapay_id",
  PAYMENT_INSTRUCTIONS_AR: "payment_instructions_ar",
  PAYMENT_INSTRUCTIONS_EN: "payment_instructions_en",
  PAYMENT_INSTRUCTIONS_DE: "payment_instructions_de",
  SHIPPING_HURGHADA: "shipping_fee_hurghada",
  SHIPPING_CAIRO: "shipping_fee_cairo",
  SHIPPING_ALEXANDRIA: "shipping_fee_alexandria",
  GLOBAL_DISCOUNT: "global_discount_percentage",
  CONTACT_EMAIL: "contact_email",
  CONTACT_PHONE: "contact_phone",
  INSTAGRAM: "social_instagram",
  FACEBOOK: "social_facebook",
  TIKTOK: "social_tiktok",
  BRAND_NAME: "brand_name",
  LOGO_URL: "logo_url",
  SEO_TITLE_EN: "seo_title_en",
  SEO_TITLE_AR: "seo_title_ar",
  SEO_TITLE_DE: "seo_title_de",
  SEO_DESC_EN: "seo_desc_en",
  SEO_DESC_AR: "seo_desc_ar",
  SEO_DESC_DE: "seo_desc_de",
} as const;
