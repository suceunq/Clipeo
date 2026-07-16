import { resolve } from "node:path";
import type { DownloadMode, DownloadRequest } from "../../shared/types";

const modes = new Set<DownloadMode>(["video", "mp3", "m4a", "wav", "thumbnail"]);

export function secureUrl(raw: unknown) {
  if (typeof raw !== "string" || raw.length > 4096) throw Error("L’URL fournie est invalide.");
  const value = new URL(raw.trim());
  if (value.protocol !== "https:" || value.username || value.password)
    throw Error("Seules les URL HTTPS sans identifiants sont acceptées.");
  return value.toString();
}

export function validateDownloadRequest(raw: unknown): DownloadRequest {
  if (!raw || typeof raw !== "object") throw Error("Demande de téléchargement invalide.");
  const value = raw as Record<string, unknown>;
  const mode = value.mode as DownloadMode;
  if (!modes.has(mode)) throw Error("Format de téléchargement invalide.");
  if (typeof value.outputDir !== "string" || !value.outputDir.trim() || value.outputDir.length > 1024)
    throw Error("Dossier de destination invalide.");
  if (typeof value.title !== "string" || !value.title.trim() || value.title.length > 500)
    throw Error("Titre du média invalide.");
  if (value.formatId !== undefined && (typeof value.formatId !== "string" || !/^[\w.-]+$/.test(value.formatId)))
    throw Error("Qualité vidéo invalide.");
  const maxItems = value.maxItems === undefined ? 50 : Number(value.maxItems);
  if (!Number.isFinite(maxItems)) throw Error("Limite de collection invalide.");
  return {
    url: secureUrl(value.url),
    title: value.title,
    mode,
    formatId: value.formatId as string | undefined,
    outputDir: resolve(value.outputDir),
    collection: value.collection === true,
    maxItems: Math.min(1000, Math.max(1, Math.trunc(maxItems))),
  };
}
