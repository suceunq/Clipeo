import { app } from "electron";
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { join } from "node:path";

const dev = !app.isPackaged;
export const binaries = {
  ytdlp: () => dev ? join(__dirname, "..", "..", "..", "resources", "yt-dlp.exe") : join(process.resourcesPath, "bin", "yt-dlp.exe"),
  deno: () => dev ? join(__dirname, "..", "..", "..", "resources", "deno.exe") : join(process.resourcesPath, "bin", "deno.exe"),
  ffmpeg: () => dev ? join(__dirname, "..", "..", "..", "node_modules", "ffmpeg-static") : join(process.resourcesPath, "bin"),
};

export function spawnYtDlp(args: string[]): ChildProcessWithoutNullStreams {
  return spawn(binaries.ytdlp(), ["--js-runtimes", `deno:${binaries.deno()}`, ...args], { windowsHide: true });
}

export function runYtDlp(args: string[]) {
  return new Promise<string>((resolve, reject) => {
    const process = spawnYtDlp(args);
    let output = "", error = "";
    process.stdout.on("data", (data) => (output += data));
    process.stderr.on("data", (data) => (error += data));
    process.once("error", (cause) => reject(Error(`Impossible de démarrer le moteur multimédia : ${cause.message}`)));
    process.once("close", (code) => code === 0 ? resolve(output) : reject(Error(error.slice(-1200) || `Le moteur multimédia a échoué (${code}).`)));
  });
}

export function friendlyError(value: unknown) {
  const text = value instanceof Error ? value.message : String(value);
  if (/Unsupported URL/i.test(text)) return "Cette adresse ou cette plateforme n’est pas prise en charge.";
  if (/Private video|login|Sign in/i.test(text)) return "Ce contenu nécessite une connexion ou n’est pas public.";
  if (/not available|unavailable/i.test(text)) return "Ce contenu n’est pas disponible.";
  if (/ENOSPC/i.test(text)) return "L’espace disque disponible est insuffisant.";
  return text.replace(/^Error invoking remote method '[^']+': Error: /, "").slice(-500);
}
