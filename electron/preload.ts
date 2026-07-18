import { contextBridge, ipcRenderer } from "electron";
contextBridge.exposeInMainWorld("clipeo", {
  analyze: (url: string) => ipcRenderer.invoke("media:analyze", url),
  chooseFolder: () => ipcRenderer.invoke("files:chooseFolder"),
  download: (request: unknown) => ipcRenderer.invoke("media:download", request),
  cancel: (id: string) => ipcRenderer.invoke("media:cancel", id),
  openFolder: (path: string) => ipcRenderer.invoke("files:openFolder", path),
  history: () => ipcRenderer.invoke("history:list"),
  clearHistory: () => ipcRenderer.invoke("history:clear"),
  getLocale: () => ipcRenderer.invoke("settings:getLocale"),
  setLocale: (locale: unknown) => ipcRenderer.invoke("settings:setLocale", locale),
  getUpdateState: () => ipcRenderer.invoke("update:getState"),
  checkForUpdates: () => ipcRenderer.invoke("update:check"),
  installUpdate: () => ipcRenderer.invoke("update:install"),
  onUpdateState: (callback: (value: unknown) => void) => {
    const listener = (_: unknown, value: unknown) => callback(value);
    ipcRenderer.on("update:state", listener);
    return () => ipcRenderer.removeListener("update:state", listener);
  },
  onProgress: (callback: (value: unknown) => void) => {
    const listener = (_: unknown, value: unknown) => callback(value);
    ipcRenderer.on("media:progress", listener);
    return () => ipcRenderer.removeListener("media:progress", listener);
  },
});
