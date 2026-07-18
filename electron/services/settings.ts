import { app } from "electron";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { normalizeLocale, setI18nLocale, supportedLocales, translate as t, type AppLocale } from "../../shared/i18n";
import type { AppSettings, LocalePreference, LocaleSettings, WelcomeDismissal } from "../../shared/types";

interface StoredSettings { language?: LocalePreference; welcomeNever?: boolean; welcomeAfter?: number; }
interface DistributionConfig { donationUrl?: string; }
const settingsPath = () => join(app.getPath("userData"), "settings.json");
const configPath = () => app.isPackaged ? join(process.resourcesPath, "config.json") : join(__dirname, "..", "..", "..", "resources", "config.json");
let preference: LocalePreference = "system";

async function readSettings(): Promise<StoredSettings> { try { return JSON.parse(await readFile(settingsPath(), "utf8")); } catch { return {}; } }
async function writeSettings(patch: Partial<StoredSettings>) { const current = await readSettings(); await writeFile(settingsPath(), JSON.stringify({ ...current, ...patch }, null, 2), "utf8"); }
async function readDistributionConfig(): Promise<DistributionConfig> { try { return JSON.parse(await readFile(configPath(), "utf8")); } catch { return {}; } }

export function validateDonationUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) throw Error(t("error.invalidDonationUrl"));
  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();
    if (url.protocol !== "https:" || !(host === "paypal.me" || host === "paypal.com" || host.endsWith(".paypal.com"))) throw new Error();
    return url.toString();
  } catch {
    throw Error(t("error.invalidDonationUrl"));
  }
}

export async function initializeLocale(): Promise<LocaleSettings> {
  const saved = await readSettings();
  if (saved.language === "system" || supportedLocales.includes(saved.language as AppLocale)) preference = saved.language as LocalePreference;
  return applyLocale();
}
function applyLocale(): LocaleSettings { const locale = preference === "system" ? normalizeLocale(app.getLocale()) : preference; setI18nLocale(locale); return { locale, preference }; }
export function getLocaleSettings() { return applyLocale(); }
export async function setLocalePreference(value: unknown): Promise<LocaleSettings> {
  if (value !== "system" && !supportedLocales.includes(value as AppLocale)) throw Error(t("error.invalidLocale"));
  preference = value as LocalePreference; await writeSettings({ language: preference }); return applyLocale();
}

export async function getAppSettings(): Promise<AppSettings> {
  const saved = await readSettings();
  return { showWelcome: !saved.welcomeNever };
}
export async function getDonationUrl() { const config = await readDistributionConfig(); return validateDonationUrl(config.donationUrl || "https://www.paypal.com/donate/"); }
export async function dismissWelcome(value: unknown) {
  if (value !== "later" && value !== "never") throw Error(t("error.invalidWelcomeChoice"));
  const choice = value as WelcomeDismissal;
  await writeSettings(choice === "never" ? { welcomeNever: true, welcomeAfter: undefined } : { welcomeNever: false, welcomeAfter: undefined });
  return true;
}
