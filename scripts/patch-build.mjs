import { readFileSync, writeFileSync } from 'fs';
const p = new URL('../package.json', import.meta.url);
let s = readFileSync(p, 'utf8');
s = s.replace('"build":"astro build"', '"build":"astro build && node scripts/non-blocking-css.mjs"');
writeFileSync(p, s);
console.log('Updated package.json build script.');
