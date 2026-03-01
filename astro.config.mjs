import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

/** 將首個 stylesheet 改為非阻塞載入，搭配內聯關鍵 CSS 改善 FCP */
function nonBlockingCss() {
  return {
    name: 'non-blocking-css',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return html.replace(
          /<link rel="stylesheet" href="([^"]+)"\s*\/?>/,
          '<link rel="stylesheet" href="$1" media="print" onload="this.media=\'all\'"><noscript><link rel="stylesheet" href="$1"></noscript>'
        );
      },
    },
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://ihealthy.com.tw',
  integrations: [mdx(), sitemap()],
  redirects: {
    '/lutein-is-suffieciency/': '/lutein-is-sufficiency/',
    '/how-to-prevent-or-sooth-wrinkles/': '/how-to-prevent-or-soothe-wrinkles/',
  },
  vite: {
    plugins: [tailwindcss(), nonBlockingCss()],
  },
});
