"use server";

import { setSetting, setHomepageSection } from "@/lib/settings";
import { revalidatePath } from "next/cache";

export async function updateSetting(key: string, value: string) {
  await setSetting(key, value);
  revalidatePath("/", "layout");
}

export async function updateSettings(settings: Record<string, string>) {
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
  await setHomepageSection(sectionKey, data, sortOrder, visible);
  revalidatePath("/", "layout");
}
