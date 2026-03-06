/**
 * 建置後處理：將首個 stylesheet 改為非阻塞載入（media=print + onload），改善 FCP。
 * 執行時機：npm run build 之後（見 package.json）
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { readdirSync, statSync } from 'fs';

const distDir = join(process.cwd(), 'dist');

function findHtmlFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) findHtmlFiles(full, files);
    else if (e.name.endsWith('.html')) files.push(full);
  }
  return files;
}

const re = /<link rel="stylesheet" href="([^"]+)"(\s*\/?)>/;
const replacement = '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'"$2><noscript><link rel="stylesheet" href="$1"$2></noscript>';

const htmlFiles = findHtmlFiles(distDir);
let count = 0;
for (const file of htmlFiles) {
  let html = readFileSync(file, 'utf8');
  const newHtml = html.replace(re, (match) => {
    count++;
    return replacement;
  });
  if (newHtml !== html) writeFileSync(file, newHtml);
}
console.log(`[non-blocking-css] Processed ${count} stylesheet(s) across ${htmlFiles.length} HTML file(s).`);
