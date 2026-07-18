const { app, BrowserWindow, ipcMain } = require('electron') as typeof import('electron');
const { autoUpdater } = require('electron-updater') as typeof import('electron-updater');
const { appendFile, mkdir, readFile, writeFile } = require('node:fs/promises') as typeof import('node:fs/promises');
const { join } = require('node:path') as typeof import('node:path');
const { initializeLocale } = require('./services/settings.js') as typeof import('./services/settings');
const { translate: t } = require('../shared/i18n.js') as typeof import('../shared/i18n');
import type { ReleaseNotes, UpdateState } from '../shared/types';

let updateState: UpdateState = { phase: 'idle', currentVersion: app.getVersion() };
let checking = false;
let releaseNotes: ReleaseNotes | null = null;
const updateDir = () => join(app.getPath('userData'), 'updates');
const transactionPath = () => join(updateDir(), 'transaction.json');
const logPath = () => join(updateDir(), 'updater.log');

async function log(level: string, message: unknown) {
  try { await mkdir(updateDir(), { recursive: true }); await appendFile(logPath(), `${new Date().toISOString()} [${level}] ${String(message)}\n`, 'utf8'); } catch { /* journal non bloquant */ }
}
const updaterLogger = { info: (v: unknown) => void log('INFO', v), warn: (v: unknown) => void log('WARN', v), error: (v: unknown) => void log('ERROR', v), debug: (v: unknown) => void log('DEBUG', v) };

function notesText(value: unknown) {
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.map((item: { version?: string; note?: string | null }) => `${item.version ? `## ${item.version}\n` : ''}${item.note ?? ''}`).join('\n\n');
  return '';
}
async function recoverTransaction() {
  try {
    const transaction = JSON.parse(await readFile(transactionPath(), 'utf8')) as ReleaseNotes & { fromVersion: string; status: string };
    if (transaction.version === app.getVersion() && transaction.status === 'installing') {
      releaseNotes = transaction;
      await writeFile(transactionPath(), JSON.stringify({ ...transaction, status: 'installed', installedAt: new Date().toISOString() }, null, 2));
      await log('INFO', `Mise à jour ${transaction.fromVersion} -> ${transaction.version} validée`);
    } else if (transaction.status === 'installing') {
      await log('WARN', `Installation ${transaction.version} non appliquée; version ${app.getVersion()} conservée (rollback)`);
      await writeFile(transactionPath(), JSON.stringify({ ...transaction, status: 'rolledBack' }, null, 2));
    }
  } catch { /* aucune transaction précédente */ }
}
function publishUpdateState(patch: Partial<UpdateState>) {
  updateState = { ...updateState, ...patch, currentVersion: app.getVersion() };
  for (const window of BrowserWindow.getAllWindows()) window.webContents.send('update:state', updateState);
  return updateState;
}
async function checkForUpdates() {
  if (!app.isPackaged) return publishUpdateState({ phase: 'error', message: t('update.packagedOnly') });
  if (checking || updateState.phase === 'downloading' || updateState.phase === 'ready') return updateState;
  checking = true;
  publishUpdateState({ phase: 'checking', message: undefined, percent: undefined });
  try { await autoUpdater.checkForUpdates(); } catch (error) { await log('ERROR', error); publishUpdateState({ phase: 'error', message: t('update.checkError') }); }
  finally { checking = false; }
  return updateState;
}

app.whenReady().then(async () => {
  await initializeLocale();
  await recoverTransaction();
  require('./main.cjs');
  ipcMain.handle('update:getState', () => updateState);
  ipcMain.handle('update:check', checkForUpdates);
  ipcMain.handle('update:getReleaseNotes', () => { const result = releaseNotes; releaseNotes = null; return result; });
  ipcMain.handle('update:install', () => false);
  if (!app.isPackaged) return;

  autoUpdater.logger = updaterLogger;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on('checking-for-update', () => publishUpdateState({ phase: 'checking', message: undefined }));
  autoUpdater.on('update-available', (info) => { void log('INFO', `Version ${info.version} disponible`); publishUpdateState({ phase: 'available', availableVersion: info.version, message: undefined }); });
  autoUpdater.on('update-not-available', () => publishUpdateState({ phase: 'upToDate', availableVersion: undefined, percent: undefined, message: undefined }));
  autoUpdater.on('download-progress', (progress) => publishUpdateState({ phase: 'downloading', percent: progress.percent, message: undefined }));
  autoUpdater.on('error', (error) => {
    void log('ERROR', error);
    publishUpdateState({ phase: 'error', message: t('update.checkError') });
    setTimeout(() => void checkForUpdates(), 15 * 60 * 1000).unref();
  });
  autoUpdater.on('update-downloaded', async (info) => {
    const transaction = { fromVersion: app.getVersion(), version: info.version, notes: notesText(info.releaseNotes), status: 'installing', downloadedAt: new Date().toISOString() };
    await mkdir(updateDir(), { recursive: true });
    await writeFile(transactionPath(), JSON.stringify(transaction, null, 2), 'utf8');
    await log('INFO', `Téléchargement ${info.version} vérifié; installation silencieuse`);
    publishUpdateState({ phase: 'ready', availableVersion: info.version, percent: 100, message: undefined });
    setTimeout(() => autoUpdater.quitAndInstall(true, true), 750).unref();
  });
  setTimeout(() => void checkForUpdates(), 4000).unref();
  const interval = setInterval(() => void checkForUpdates(), 60 * 60 * 1000);
  interval.unref();
});
