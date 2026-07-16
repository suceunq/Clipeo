import { renameSync, existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs';

// The root package is ESM, while Electron sources are compiled as CommonJS.
// This package boundary prevents Electron from interpreting service .js files as ESM.
writeFileSync('dist-electron/package.json', JSON.stringify({ type: 'commonjs' }, null, 2));

for (const name of ['main', 'preload', 'bootstrap']) {
  const from = `dist-electron/electron/${name}.js`;
  const to = `dist-electron/electron/${name}.cjs`;
  if (!existsSync(from)) {
    throw new Error(`Fichier Electron compilé absent : ${from}`);
  }
  if (existsSync(to)) rmSync(to);
  renameSync(from, to);
}

const main = 'dist-electron/electron/main.cjs';
const source = readFileSync(main, 'utf8').replace(/["']preload\.js["']/g, '"preload.cjs"');
writeFileSync(main, source);

if (!source.includes('preload.cjs') || source.includes('preload.js')) {
  throw new Error('Référence preload Electron invalide après compilation. Installateur annulé.');
}

for (const name of ['main', 'preload', 'bootstrap']) {
  const file = `dist-electron/electron/${name}.cjs`;
  if (!existsSync(file)) throw new Error(`Fichier Electron final absent : ${file}`);
}
