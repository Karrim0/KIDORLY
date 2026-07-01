"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { categorySchema, categoryUpdateSchema } from "@/lib/validations";

function parseSaleDate(value: unknown) {
  if (!value) return null;
  if (typeof value !== "string") return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function cleanIdArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

function prepareProductPayload(data: Record<string, unknown>) {
  const {
    collectionIds,
    tagIds,
    ageGroupIds,
    saleEndsAt,
    ...rest
  } = data;

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

async function assertValidCategoryParent(
  categoryId: string,
  parentId?: string | null
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
        "Invalid parent category. This would create a category loop."
      );
    }

    const parent = await prisma.category.findUnique({
      where: { id: currentParentId },
      select: { parentId: true },
    });

    currentParentId = parent?.parentId ?? null;
  }

  throw new Error("Category tree is too deep.");
}

export async function createProduct(data: Record<string, unknown>) {
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

  revalidatePath("/", "layout");
  return product;
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
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

  revalidatePath("/", "layout");
  return product;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });

  revalidatePath("/", "layout");
}

export async function createCategory(data: Record<string, unknown>) {
  const parsed = categorySchema.parse(data);

  const category = await prisma.category.create({
    data: parsed,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/categories", "page");

  return category;
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  const parsed = categoryUpdateSchema.parse(data);

  await assertValidCategoryParent(id, parsed.parentId);

  const category = await prisma.category.update({
    where: { id },
    data: parsed,
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/categories", "page");

  return category;
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/", "layout");
  revalidatePath("/admin/categories", "page");
}