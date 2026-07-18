export interface MediaFormat {
  id: string;
  label: string;
  height: number | null;
  ext: string;
  fps: number | null;
  size: number | null;
}
export interface MediaInfo {
  url: string;
  title: string;
  author: string;
  duration: number;
  thumbnail: string | null;
  platform: string;
  formats: MediaFormat[];
  isCollection: boolean;
  itemCount: number | null;
}
export type DownloadMode = "video" | "mp3" | "m4a" | "wav" | "thumbnail";
export type { AppLocale } from "./i18n";
export type LocalePreference = import("./i18n").AppLocale | "system";
export interface LocaleSettings {
  locale: import("./i18n").AppLocale;
  preference: LocalePreference;
}
export interface AppSettings {
  donationUrl: string;
  showWelcome: boolean;
}
export type WelcomeDismissal = "later" | "never";
export type UpdatePhase = "idle" | "checking" | "available" | "downloading" | "ready" | "upToDate" | "error";
export interface UpdateState {
  phase: UpdatePhase;
  currentVersion: string;
  availableVersion?: string;
  percent?: number;
  message?: string;
}
export interface DownloadRequest {
  url: string;
  title: string;
  mode: DownloadMode;
  formatId?: string;
  outputDir: string;
  collection?: boolean;
  maxItems?: number;
}
export interface DownloadProgress {
  id: string;
  title: string;
  percent: number;
  speed: string;
  eta: string;
  status: "queued" | "downloading" | "done" | "error" | "cancelled" | "interrupted";
  message?: string;
}
