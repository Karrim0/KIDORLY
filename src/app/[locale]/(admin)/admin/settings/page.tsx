import { getSettings, SETTING_KEYS } from "@/lib/settings";
import { SettingsClient } from "./settings-client";

export default async function AdminSettingsPage() {
  const allKeys = Object.values(SETTING_KEYS);
  const settings = await getSettings(allKeys);
  return <SettingsClient settings={settings} />;
}
