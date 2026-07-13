const { app, BrowserWindow, dialog } = require('electron') as typeof import('electron');
const { autoUpdater } = require('electron-updater') as typeof import('electron-updater');

app.whenReady().then(() => {
  if (!app.isPackaged) return;
  autoUpdater.autoDownload = true;
  autoUpdater.on('download-progress', (p) => BrowserWindow.getAllWindows()[0]?.webContents.send('media:progress', {
    id: 'app-update', title: 'Mise à jour de Clipéo', percent: p.percent,
    speed: `${(p.bytesPerSecond / 1048576).toFixed(1)} Mo/s`,
    eta: p.bytesPerSecond ? `${Math.max(0, Math.round((p.total - p.transferred) / p.bytesPerSecond))} s` : '…', status: 'downloading'
  }));
  autoUpdater.on('update-downloaded', async () => {
    const win = BrowserWindow.getAllWindows()[0];
    const result = await dialog.showMessageBox(win, { type: 'info', title: 'Mise à jour prête', message: 'La nouvelle version de Clipéo est prête.', buttons: ['Installer et redémarrer', 'Plus tard'], defaultId: 0 });
    if (result.response === 0) autoUpdater.quitAndInstall();
  });
  void autoUpdater.checkForUpdatesAndNotify();
});

require('./main.cjs');
