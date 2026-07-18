import { app, BrowserWindow, dialog, ipcMain, shell, Menu } from "electron";
import { join, resolve } from "node:path";
import type { MediaInfo } from "../shared/types";
import { runYtDlp, friendlyError } from "./services/ytdlp";
import { secureUrl, validateDownloadRequest } from "./services/validation";
import { cancelDownload, queueDownload } from "./services/download-manager";
import { clearHistory, listHistory, markInterrupted } from "./services/history";
import { dismissWelcome, getAppSettings, getDonationUrl, getLocaleSettings, setLocalePreference } from "./services/settings";
import { translate as t } from "../shared/i18n";

let win: BrowserWindow | null = null;
const dev = !app.isPackaged;

app.on("web-contents-created", (_event, contents) => contents.on("context-menu", (_e, p) => {
  const items: Electron.MenuItemConstructorOptions[] = [];
  if (p.isEditable) items.push(
    { label: t("context.undo"), role: "undo", enabled: p.editFlags.canUndo }, { label: t("context.redo"), role: "redo", enabled: p.editFlags.canRedo },
    { type: "separator" }, { label: t("context.cut"), role: "cut", enabled: p.editFlags.canCut }, { label: t("context.copy"), role: "copy", enabled: p.editFlags.canCopy },
    { label: t("context.paste"), role: "paste", enabled: p.editFlags.canPaste }, { type: "separator" }, { label: t("context.selectAll"), role: "selectAll" },
  ); else if (p.selectionText) items.push({ label: t("context.copy"), role: "copy" });
  if (p.linkURL?.startsWith("https://")) items.push({ type: "separator" }, { label: t("context.openLink"), click: () => void shell.openExternal(p.linkURL) });
  if (items.length) Menu.buildFromTemplate(items).popup();
}));

function createWindow() {
  win = new BrowserWindow({ width: 1180, height: 780, minWidth: 900, minHeight: 620, backgroundColor: "#090d14", webPreferences: {
    preload: join(__dirname, "preload.cjs"), sandbox: true, contextIsolation: true, nodeIntegration: false,
  }});
  win.webContents.setWindowOpenHandler(({ url }) => { if (url.startsWith("https://")) void shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (event) => event.preventDefault());
  win.webContents.session.setPermissionRequestHandler((_webContents, _permission, callback) => callback(false));
  void (dev ? win.loadURL("http://localhost:5173") : win.loadFile(join(__dirname, "..", "..", "dist", "index.html")));
}

app.whenReady().then(async () => {
  await markInterrupted();
  Menu.setApplicationMenu(null);
  createWindow();
  ipcMain.handle("media:analyze", async (_event, raw: unknown): Promise<MediaInfo> => {
    try {
      const url = secureUrl(raw);
      const probe = JSON.parse(await runYtDlp(["--dump-single-json", "--flat-playlist", "--playlist-end", "201", "--skip-download", url]));
      const entries = Array.isArray(probe.entries) ? probe.entries.filter(Boolean) : [];
      const isCollection = entries.length > 0;
      const data = isCollection ? probe : JSON.parse(await runYtDlp(["--dump-single-json", "--no-playlist", "--skip-download", url]));
      const formats = (data.formats ?? []).filter((format: any) => format.vcodec && format.vcodec !== "none" && format.height).map((format: any) => ({
        id: String(format.format_id), label: `${format.height}p${format.fps ? ` · ${format.fps} fps` : ""} · ${format.ext}`,
        height: format.height ?? null, ext: format.ext ?? "", fps: format.fps ?? null, size: format.filesize ?? format.filesize_approx ?? null,
      })).sort((a: any, b: any) => b.height - a.height);
      return { url, title: data.title ?? t("media.untitled"), author: data.uploader ?? data.channel ?? "", duration: data.duration ?? 0,
        thumbnail: typeof data.thumbnail === "string" && data.thumbnail.startsWith("https://") ? data.thumbnail : null,
        platform: data.extractor_key ?? "", formats: [...new Map(formats.map((format: any) => [`${format.height}-${format.ext}`, format])).values()] as any,
        isCollection, itemCount: isCollection ? Number(data.playlist_count ?? data.n_entries ?? entries.length) || null : null };
    } catch (error) { throw Error(friendlyError(error)); }
  });
  ipcMain.handle("files:chooseFolder", async () => { const result = await dialog.showOpenDialog(win!, { properties: ["openDirectory", "createDirectory"] }); return result.canceled ? null : result.filePaths[0]; });
  ipcMain.handle("files:openFolder", async (_event, path: unknown) => { if (typeof path !== "string" || !path.trim()) throw Error(t("error.invalidFolder")); await shell.openPath(resolve(path)); });
  ipcMain.handle("history:list", listHistory);
  ipcMain.handle("history:clear", clearHistory);
  ipcMain.handle("media:download", async (_event, raw: unknown) => queueDownload(validateDownloadRequest(raw), win));
  ipcMain.handle("media:cancel", (_event, id: unknown) => cancelDownload(id, win));
  ipcMain.handle("settings:getLocale", getLocaleSettings);
  ipcMain.handle("settings:setLocale", (_event, locale: unknown) => setLocalePreference(locale));
  ipcMain.handle("settings:getApp", getAppSettings);
  ipcMain.handle("welcome:dismiss", (_event, value: unknown) => dismissWelcome(value));
  ipcMain.handle("donation:open", async () => { await shell.openExternal(await getDonationUrl()); return true; });
});

app.on("window-all-closed", () => { if (process.platform !== "darwin") app.quit(); });
