"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(data: Record<string, unknown>) {
  const product = await prisma.product.create({ data: data as any });
  revalidatePath("/", "layout");
  return product;
}

export async function updateProduct(id: string, data: Record<string, unknown>) {
  const product = await prisma.product.update({ where: { id }, data: data as any });
  revalidatePath("/", "layout");
  return product;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath("/", "layout");
}

export async function createCategory(data: Record<string, unknown>) {
  const category = await prisma.category.create({ data: data as any });
  revalidatePath("/", "layout");
  return category;
}

export async function updateCategory(id: string, data: Record<string, unknown>) {
  const category = await prisma.category.update({ where: { id }, data: data as any });
  revalidatePath("/", "layout");
  return category;
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath("/", "layout");
}
