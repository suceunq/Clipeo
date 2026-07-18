import { app } from "electron";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { normalizeLocale, setI18nLocale, supportedLocales, translate as t, type AppLocale } from "../../shared/i18n";
import type { LocalePreference, LocaleSettings } from "../../shared/types";

const settingsPath = () => join(app.getPath("userData"), "settings.json");
let preference: LocalePreference = "system";

export async function initializeLocale(): Promise<LocaleSettings> {
  try {
    const saved = JSON.parse(await readFile(settingsPath(), "utf8")) as { language?: unknown };
    if (saved.language === "system" || supportedLocales.includes(saved.language as AppLocale)) preference = saved.language as LocalePreference;
  } catch { /* First launch or unreadable settings: use the system locale. */ }
  return applyLocale();
}

function applyLocale(): LocaleSettings {
  const locale = preference === "system" ? normalizeLocale(app.getLocale()) : preference;
  setI18nLocale(locale);
  return { locale, preference };
}

export function getLocaleSettings() { return applyLocale(); }

export async function setLocalePreference(value: unknown): Promise<LocaleSettings> {
  if (value !== "system" && !supportedLocales.includes(value as AppLocale)) throw Error(t("error.invalidLocale"));
  preference = value as LocalePreference;
  await writeFile(settingsPath(), JSON.stringify({ language: preference }, null, 2), "utf8");
  return applyLocale();
}
