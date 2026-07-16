import type { BrowserWindow } from "electron";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import type { ChildProcessWithoutNullStreams } from "node:child_process";
import type { DownloadProgress, DownloadRequest } from "../../shared/types";
import { binaries, friendlyError, spawnYtDlp } from "./ytdlp";
import { saveProgress } from "./history";

const active = new Map<string, { process: ChildProcessWithoutNullStreams; item: DownloadProgress }>();
const pending: Array<() => void> = [];
const maximumConcurrent = 2;
let running = 0;

function notify(win: BrowserWindow | null, item: DownloadProgress) {
  win?.webContents.send("media:progress", { ...item });
}

export async function queueDownload(request: DownloadRequest, win: BrowserWindow | null) {
  await mkdir(request.outputDir, { recursive: true });
  const item: DownloadProgress = { id: randomUUID(), title: request.title, percent: 0, speed: "—", eta: "—", status: "queued" };
  await saveProgress(item);
  notify(win, item);
  pending.push(() => start(request, item, win));
  drain();
  return { id: item.id };
}

function drain() {
  while (running < maximumConcurrent && pending.length) { running++; pending.shift()?.(); }
}

function start(request: DownloadRequest, item: DownloadProgress, win: BrowserWindow | null) {
  item.status = "downloading";
  void saveProgress(item); notify(win, item);
  const args = ["--newline", "--ffmpeg-location", binaries.ffmpeg(), "-o", join(request.outputDir, "%(title).180B [%(id)s].%(ext)s")];
  if (request.collection) args.push("--yes-playlist", "--playlist-end", String(request.maxItems), "--download-archive", join(request.outputDir, ".clipeo-archive.txt"), "--ignore-errors");
  else args.push("--no-playlist");
  if (request.mode === "video") args.push("-f", request.formatId ? `${request.formatId}+bestaudio/best` : "bv*+ba/best", "--merge-output-format", "mp4");
  else if (request.mode === "thumbnail") args.push("--skip-download", "--write-thumbnail", "--convert-thumbnails", "jpg");
  else args.push("-x", "--audio-format", request.mode, "--audio-quality", "0");
  args.push(request.url);
  const process = spawnYtDlp(args);
  active.set(item.id, { process, item });
  let lastSave = 0;
  process.stdout.on("data", (data) => {
    const match = String(data).match(/\[download\]\s+([\d.]+)%.*?at\s+([^\s]+).*?ETA\s+([^\s]+)/);
    if (!match) return;
    item.percent = +match[1]; item.speed = match[2]; item.eta = match[3]; notify(win, item);
    if (Date.now() - lastSave > 2000) { lastSave = Date.now(); void saveProgress(item); }
  });
  process.stderr.on("data", (data) => (item.message = String(data).slice(-500)));
  process.once("error", async (error) => { item.status = "error"; item.message = friendlyError(error); await finish(item, win); });
  process.once("close", async (code) => {
    if (item.status !== "cancelled" && item.status !== "error") item.status = code === 0 ? "done" : "error";
    if (item.status === "done") { item.percent = 100; item.message = undefined; }
    else if (item.status === "error") item.message = friendlyError(item.message || `Le téléchargement a échoué (${code}).`);
    await finish(item, win);
  });
}

async function finish(item: DownloadProgress, win: BrowserWindow | null) {
  if (!active.delete(item.id)) return;
  running = Math.max(0, running - 1);
  await saveProgress(item); notify(win, item); drain();
}

export async function cancelDownload(id: unknown, win: BrowserWindow | null) {
  if (typeof id !== "string") throw Error("Identifiant de téléchargement invalide.");
  const current = active.get(id);
  if (!current) return false;
  const { process, item } = current;
  item.status = "cancelled";
  item.message = "Téléchargement annulé.";
  process.kill();
  await saveProgress(item); notify(win, item);
  return true;
}
