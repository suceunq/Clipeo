import { renameSync, existsSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
for (const name of ['main', 'preload']) {
  const from = `dist-electron/electron/${name}.js`;
  const to = `dist-electron/electron/${name}.cjs`;
  if (existsSync(to)) rmSync(to);
  renameSync(from, to);
}
const main = 'dist-electron/electron/main.cjs';
writeFileSync(main, readFileSync(main, 'utf8').replace("'preload.js'", "'preload.cjs'"));
