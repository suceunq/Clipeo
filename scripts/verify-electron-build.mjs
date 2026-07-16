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

const boundary = 'dist-electron/package.json';
if (!existsSync(boundary)) {
  throw new Error('Build Electron invalide : la frontière CommonJS est absente.');
}
const packageType = JSON.parse(readFileSync(boundary, 'utf8')).type;
if (packageType !== 'commonjs') {
  throw new Error('Build Electron invalide : les services Electron ne sont pas déclarés CommonJS.');
}

for (const name of ['ytdlp', 'validation', 'download-manager', 'history']) {
  const service = `${directory}/services/${name}.js`;
  if (!existsSync(service) || !readFileSync(service, 'utf8').includes('exports')) {
    throw new Error(`Build Electron invalide : service CommonJS absent ou incorrect (${service}).`);
  }
}

console.log('Build Electron vérifié : preload sécurisé présent et correctement référencé.');
