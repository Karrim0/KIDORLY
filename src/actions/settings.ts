"use server";

import { setSetting, setHomepageSection } from "@/lib/settings";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

const homepageLayoutSchema = z.array(
  z.object({
    sectionKey: z.enum([
      "categories",
      "featured_products",
      "collections",
      "age_groups",
      "partners",
      "experience",
    ]),
    sortOrder: z.number().int().min(0).max(9999),
    visible: z.boolean(),
  }),
).length(6);

export async function updateSetting(key: string, value: string) {
  await requireAdmin();
  await setSetting(key, value);
  revalidatePath("/", "layout");
}

export async function updateSettings(settings: Record<string, string>) {
  await requireAdmin();
  for (const [key, value] of Object.entries(settings)) {
    await setSetting(key, value);
  }
  revalidatePath("/", "layout");
}

export async function updateHomepageSectionAction(
  sectionKey: string,
  data: unknown,
  sortOrder?: number,
  visible?: boolean
) {
  await requireAdmin();
  await setHomepageSection(sectionKey, data, sortOrder, visible);
  revalidatePath("/", "layout");
}

export async function updateHomepageLayoutAction(input: unknown) {
  await requireAdmin();
  const sections = homepageLayoutSchema.parse(input);

  await prisma.$transaction(
    sections.map((section) =>
      prisma.homepageSection.upsert({
        where: { sectionKey: section.sectionKey },
        update: {
          sortOrder: section.sortOrder,
          visible: section.visible,
        },
        create: {
          sectionKey: section.sectionKey,
          data: "{}",
          sortOrder: section.sortOrder,
          visible: section.visible,
        },
      }),
    ),
  );

  revalidatePath("/", "layout");
}
