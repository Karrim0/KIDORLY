"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";

const optionalText = z
  .union([z.string(), z.null(), z.undefined()])
  .transform((value) => {
    if (typeof value !== "string") return null;
    return value.trim() || null;
  });

const collectionSchema = z.object({
  slug: z.string().trim().min(1).max(160),
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  nameDe: z.string().trim().min(1),
  descriptionAr: optionalText,
  descriptionEn: optionalText,
  descriptionDe: optionalText,
  image: optionalText,
  banner: optionalText,
  type: z.enum(["MARKETING", "SEASONAL", "SYSTEM"]),
  visible: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
});

const ageGroupSchema = z.object({
  slug: z.string().trim().min(1).max(160),
  nameAr: z.string().trim().min(1),
  nameEn: z.string().trim().min(1),
  nameDe: z.string().trim().min(1),
  image: optionalText,
  banner: optionalText,
  minAgeMonths: z.number().int().min(0).max(240).nullable(),
  maxAgeMonths: z.number().int().min(0).max(240).nullable(),
  visible: z.boolean(),
  featured: z.boolean(),
  sortOrder: z.coerce.number().int().min(0).max(9999),
}).refine(
  (data) =>
    data.minAgeMonths == null ||
    data.maxAgeMonths == null ||
    data.minAgeMonths <= data.maxAgeMonths,
  { message: "Minimum age must be less than or equal to maximum age" },
);

export type CollectionAdminInput = z.input<typeof collectionSchema>;
export type AgeGroupAdminInput = z.input<typeof ageGroupSchema>;

function revalidateCatalog() {
  revalidatePath("/", "layout");
}

export async function saveCollection(
  id: string | null,
  input: CollectionAdminInput,
) {
  await requireAdmin();
  const data = collectionSchema.parse(input);

  const collection = id
    ? await prisma.collection.update({ where: { id }, data })
    : await prisma.collection.create({ data });

  revalidateCatalog();
  return collection;
}

export async function deleteCollection(id: string) {
  await requireAdmin();
  await prisma.collection.delete({ where: { id } });
  revalidateCatalog();
}

export async function saveAgeGroup(
  id: string | null,
  input: AgeGroupAdminInput,
) {
  await requireAdmin();
  const data = ageGroupSchema.parse(input);

  const ageGroup = id
    ? await prisma.ageGroup.update({ where: { id }, data })
    : await prisma.ageGroup.create({ data });

  revalidateCatalog();
  return ageGroup;
}

export async function deleteAgeGroup(id: string) {
  await requireAdmin();
  await prisma.ageGroup.delete({ where: { id } });
  revalidateCatalog();
}
