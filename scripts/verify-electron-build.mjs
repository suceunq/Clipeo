import { existsSync, readFileSync } from 'node:fs';

const directory = 'dist-electron/electron';
const required = ['bootstrap.cjs', 'main.cjs', 'preload.cjs'];

for (const name of required) {
  const path = `${directory}/${name}`;
  if (!existsSync(path)) throw new Error(`Build Electron incomplet : ${path} est absent.`);
}

const main = readFileSync(`${directory}/main.cjs`, 'utf8');
if (!main.includes('preload.cjs')) {
  throw new Error('Build Electron invalide : main.cjs ne charge pas preload.cjs.');
}
if (main.includes('preload.js')) {
  throw new Error('Build Electron invalide : une ancienne référence preload.js subsiste.');
}

const preload = readFileSync(`${directory}/preload.cjs`, 'utf8');
if (!preload.includes('contextBridge') || !preload.includes('clipeo')) {
  throw new Error('Build Electron invalide : le pont sécurisé Clipéo est incomplet.');
}

console.log('Build Electron vérifié : preload sécurisé présent et correctement référencé.');
