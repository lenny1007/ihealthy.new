import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';


// https://astro.build/config
export default defineConfig({
  site: 'https://ihealthy.com.tw',
  integrations: [mdx(), sitemap()],
  redirects: {
    '/lutein-is-suffieciency/': '/lutein-is-sufficiency/',
    '/how-to-prevent-or-sooth-wrinkles/': '/how-to-prevent-or-soothe-wrinkles/',
  },
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
