/**
 * 建置後將首個 stylesheet 改為非阻塞載入（media="print" onload="this.media='all'"），
 * 搭配 Layout 內聯的關鍵 CSS 以改善 FCP。
 */
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { readdirSync, statSync } from 'fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const distDir = join(__dirname, '..', 'dist');

const re = /<link rel="stylesheet" href="([^"]+)"\s*\/?>/;
const replacement = '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="$1"></noscript>';

function processDir(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      processDir(full);
    } else if (name.endsWith('.html')) {
      let html = readFileSync(full, 'utf8');
      if (re.test(html)) {
        html = html.replace(re, replacement);
        writeFileSync(full, html);
        console.log('[postbuild] non-blocking CSS:', full.replace(distDir, ''));
      }
    }
  }
}

processDir(distDir);
