const { app, BrowserWindow, dialog, ipcMain } = require('electron') as typeof import('electron');
const { autoUpdater } = require('electron-updater') as typeof import('electron-updater');
const { initializeLocale } = require('./services/settings.js') as typeof import('./services/settings');
const { translate: t } = require('../shared/i18n.js') as typeof import('../shared/i18n');
import type { UpdateState } from '../shared/types';

let updateState: UpdateState = { phase: 'idle', currentVersion: app.getVersion() };
let checking = false;

function publishUpdateState(patch: Partial<UpdateState>) {
  updateState = { ...updateState, ...patch, currentVersion: app.getVersion() };
  for (const window of BrowserWindow.getAllWindows()) window.webContents.send('update:state', updateState);
  return updateState;
}

async function checkForUpdates() {
  if (!app.isPackaged) return publishUpdateState({ phase: 'error', message: t('update.packagedOnly') });
  if (checking || updateState.phase === 'downloading') return updateState;
  checking = true;
  publishUpdateState({ phase: 'checking', message: undefined, percent: undefined });
  try { await autoUpdater.checkForUpdates(); }
  catch { publishUpdateState({ phase: 'error', message: t('update.checkError') }); }
  finally { checking = false; }
  return updateState;
}

app.whenReady().then(async () => {
  await initializeLocale();
  require('./main.cjs');

  ipcMain.handle('update:getState', () => updateState);
  ipcMain.handle('update:check', checkForUpdates);
  ipcMain.handle('update:install', () => {
    if (updateState.phase !== 'ready') return false;
    setImmediate(() => autoUpdater.quitAndInstall());
    return true;
  });

  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.on('checking-for-update', () => publishUpdateState({ phase: 'checking', message: undefined }));
  autoUpdater.on('update-available', (info) => publishUpdateState({ phase: 'available', availableVersion: info.version, message: undefined }));
  autoUpdater.on('update-not-available', () => publishUpdateState({ phase: 'upToDate', availableVersion: undefined, percent: undefined, message: undefined }));
  autoUpdater.on('download-progress', (progress) => {
    publishUpdateState({ phase: 'downloading', percent: progress.percent, message: undefined });
    BrowserWindow.getAllWindows()[0]?.webContents.send('media:progress', {
      id: 'app-update', title: t('update.title'), percent: progress.percent,
      speed: t('unit.speed', { speed: (progress.bytesPerSecond / 1048576).toFixed(1) }),
      eta: progress.bytesPerSecond ? t('unit.seconds', { seconds: Math.max(0, Math.round((progress.total - progress.transferred) / progress.bytesPerSecond)) }) : '…', status: 'downloading'
    });
  });
  autoUpdater.on('error', () => publishUpdateState({ phase: 'error', message: t('update.checkError') }));
  autoUpdater.on('update-downloaded', async (info) => {
    publishUpdateState({ phase: 'ready', availableVersion: info.version, percent: 100, message: undefined });
    const window = BrowserWindow.getAllWindows()[0];
    const result = await dialog.showMessageBox(window, {
      type: 'info', title: t('update.readyTitle'), message: t('update.readyMessage'),
      buttons: [t('update.install'), t('update.later')], defaultId: 0,
    });
    if (result.response === 0) autoUpdater.quitAndInstall();
  });

  void checkForUpdates();
  const interval = setInterval(() => void checkForUpdates(), 4 * 60 * 60 * 1000);
  interval.unref();
});
