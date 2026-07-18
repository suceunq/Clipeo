const { app, BrowserWindow, dialog } = require('electron') as typeof import('electron');
const { autoUpdater } = require('electron-updater') as typeof import('electron-updater');
const { initializeLocale } = require('./services/settings.js') as typeof import('./services/settings');
const { translate: t } = require('../shared/i18n.js') as typeof import('../shared/i18n');

app.whenReady().then(async () => {
  await initializeLocale();
  require('./main.cjs');
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.on('download-progress', (progress) => BrowserWindow.getAllWindows()[0]?.webContents.send('media:progress', {
    id: 'app-update', title: t('update.title'), percent: progress.percent,
    speed: t('unit.speed', { speed: (progress.bytesPerSecond / 1048576).toFixed(1) }),
    eta: progress.bytesPerSecond ? t('unit.seconds', { seconds: Math.max(0, Math.round((progress.total - progress.transferred) / progress.bytesPerSecond)) }) : '…', status: 'downloading'
  }));
  autoUpdater.on('update-downloaded', async () => {
    const win = BrowserWindow.getAllWindows()[0];
    const result = await dialog.showMessageBox(win, {
      type: 'info', title: t('update.readyTitle'), message: t('update.readyMessage'),
      buttons: [t('update.install'), t('update.later')], defaultId: 0,
    });
    if (result.response === 0) autoUpdater.quitAndInstall();
  });
  void autoUpdater.checkForUpdatesAndNotify();
});
