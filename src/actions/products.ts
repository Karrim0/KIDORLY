"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { categorySchema, categoryUpdateSchema } from "@/lib/validations";
import { requireAdmin } from "@/lib/auth";

function parseSaleDate(value: unknown) {
  if (!value) return null;
  if (typeof value !== "string") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function cleanIdArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return Array.from(
    new Set(
      value
        .filter((item): item is string => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );
}

function prepareProductPayload(data: Record<string, unknown>) {
  const { collectionIds, tagIds, ageGroupIds, saleEndsAt, ...rest } = data;

  return {
    productData: {
      ...(rest as any),
      saleEndsAt: parseSaleDate(saleEndsAt),
    },
    collectionIds: cleanIdArray(collectionIds),
    tagIds: cleanIdArray(tagIds),
    ageGroupIds: cleanIdArray(ageGroupIds),
  };
}

function extractRelatedCategoryIds(data: Record<string, unknown>) {
  const { relatedCategoryIds, ...categoryData } = data;

  return {
    categoryData,
    relatedCategoryIds: cleanIdArray(relatedCategoryIds),
    hasRelatedCategoryIds: Object.prototype.hasOwnProperty.call(
      data,
      "relatedCategoryIds",
    ),
  };
}

async function assertValidCategoryParent(
  categoryId: string,
  parentId?: string | null,
) {
  if (!parentId) return;

  if (categoryId === parentId) {
    throw new Error("Category cannot be its own parent.");
  }

  let currentParentId: string | null = parentId;

  for (let depth = 0; depth < 30; depth += 1) {
    if (!currentParentId) return;

    if (currentParentId === categoryId) {
      throw new Error(
        "Invalid parent category. This would create a category loop.",
      );
    }

    const parent: { parentId: string | null } | null =
      await prisma.category.findUnique({
        where: { id: currentParentId },
        select: { parentId: true },
      });

    currentParentId = parent?.parentId ?? null;
  }

  throw new Error("Category tree is too deep.");
}

function revalidateCatalog() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/categories", "page");
  revalidatePath("/shop", "page");
}

export async function createProduct(data: Record<string, unknown>) {
  await requireAdmin();
  const { productData, collectionIds, tagIds, ageGroupIds } =
    prepareProductPayload(data);

  const product = await prisma.product.create({
    data: {
      ...productData,

      collections: {
        create: collectionIds.map((collectionId) => ({
          collection: {
            connect: { id: collectionId },
          },
        })),
      },

      tags: {
        create: tagIds.map((tagId) => ({
          tag: {
            connect: { id: tagId },
          },
        })),
      },

      ageGroups: {
        create: ageGroupIds.map((ageGroupId) => ({
          ageGroup: {
            connect: { id: ageGroupId },
          },
        })),
      },
    },
  });

  revalidateCatalog();

  return product;
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  await requireAdmin();
  const { productData, collectionIds, tagIds, ageGroupIds } =
    prepareProductPayload(data);

  const product = await prisma.product.update({
    where: { id },
    data: {
      ...productData,

      collections: {
        deleteMany: {},
        create: collectionIds.map((collectionId) => ({
          collection: {
            connect: { id: collectionId },
          },
        })),
      },

      tags: {
        deleteMany: {},
        create: tagIds.map((tagId) => ({
          tag: {
            connect: { id: tagId },
          },
        })),
      },

      ageGroups: {
        deleteMany: {},
        create: ageGroupIds.map((ageGroupId) => ({
          ageGroup: {
            connect: { id: ageGroupId },
          },
        })),
      },
    },
  });

  revalidateCatalog();

  return product;
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });

  revalidateCatalog();
}

export async function createCategory(data: Record<string, unknown>) {
  await requireAdmin();
  const { categoryData, relatedCategoryIds } = extractRelatedCategoryIds(data);
  const parsed = categorySchema.parse(categoryData);

  const category = await prisma.category.create({
    data: {
      ...parsed,

      relatedTo:
        relatedCategoryIds.length > 0
          ? {
              connect: relatedCategoryIds.map((relatedCategoryId) => ({
                id: relatedCategoryId,
              })),
            }
          : undefined,
    },
  });

  revalidateCatalog();

  return category;
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  await requireAdmin();
  const { categoryData, relatedCategoryIds, hasRelatedCategoryIds } =
    extractRelatedCategoryIds(data);

  const parsed = categoryUpdateSchema.parse(categoryData);

  await assertValidCategoryParent(id, parsed.parentId);

  const safeRelatedCategoryIds = relatedCategoryIds.filter(
    (relatedCategoryId) => relatedCategoryId !== id,
  );

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...parsed,

      ...(hasRelatedCategoryIds
        ? {
            relatedTo: {
              set: [],
              connect: safeRelatedCategoryIds.map((relatedCategoryId) => ({
                id: relatedCategoryId,
              })),
            },
          }
        : {}),
    },
  });

  revalidateCatalog();

  return category;
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await prisma.category.delete({
    where: { id },
  });

  revalidateCatalog();
}
