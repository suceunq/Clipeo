import { app } from "electron";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DownloadProgress } from "../../shared/types";
import { translate as t } from "../../shared/i18n";

const path = () => join(app.getPath("userData"), "history.json");
let operationQueue = Promise.resolve();

export async function listHistory(): Promise<DownloadProgress[]> {
  try { return JSON.parse(await readFile(path(), "utf8")); } catch { return []; }
}

function write(items: DownloadProgress[]) {
  return writeFile(path(), JSON.stringify(items.slice(0, 200), null, 2), "utf8");
}

export async function saveProgress(item: DownloadProgress) {
  operationQueue = operationQueue.then(async () => {
    const items = await listHistory();
    const index = items.findIndex((value) => value.id === item.id);
    if (index < 0) items.unshift(item); else items[index] = item;
    await write(items);
  });
  await operationQueue;
}

export async function clearHistory() { operationQueue = operationQueue.then(() => write([])); await operationQueue; }

export async function markInterrupted() {
  operationQueue = operationQueue.then(async () => {
    const items = await listHistory();
    let changed = false;
    for (const item of items) if (item.status === "queued" || item.status === "downloading") {
      item.status = "interrupted"; item.message = t("download.interruptedMessage"); changed = true;
    }
    if (changed) await write(items);
  });
  await operationQueue;
}
