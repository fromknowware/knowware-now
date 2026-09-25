import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://knowware.press',
  output: 'static',
  integrations: [sitemap()],
  build: {
    format: 'directory',
  },
  redirects: {
    '/read.html': '/read',
    '/order.html': '/order',
    '/rules.html': '/rules',
    '/colophon.html': '/colophon',
    '/contribute.html': '/contribute',
  },
});
