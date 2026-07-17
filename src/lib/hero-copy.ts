export type HeroCopyField = "title" | "subtitle" | "cta";

const COPY_LIMITS: Record<HeroCopyField, { min: number; max: number }> = {
  title: { min: 8, max: 72 },
  subtitle: { min: 16, max: 180 },
  cta: { min: 5, max: 28 },
};

const PLACEHOLDER_WORDS = new Set([
  "kareem",
  "karim",
  "test",
  "testing",
  "testo",
  "apple",
  "كريم",
  "تست",
  "تيستو",
  "اختبار",
  "تفاح",
]);

export function sanitizeHeroCopy(
  value: unknown,
  field: HeroCopyField,
  fallback: string,
) {
  if (typeof value !== "string") return fallback;

  const cleaned = value.replace(/\s+/g, " ").trim();
  const normalizedWords = cleaned
    .toLocaleLowerCase("en")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);
  const limits = COPY_LIMITS[field];
  const containsPlaceholder = normalizedWords.some((word) =>
    PLACEHOLDER_WORDS.has(word),
  );

  return !containsPlaceholder &&
    cleaned.length >= limits.min &&
    cleaned.length <= limits.max
    ? cleaned
    : fallback;
}
