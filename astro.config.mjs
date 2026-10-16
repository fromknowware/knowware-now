import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import securityHeaders from './integrations/security-headers.mjs';
import readerGate from './integrations/reader-gate.mjs';

export default defineConfig({
  site: 'https://knowware.press',
  output: 'static',
  compressHTML: true,
  integrations: [
    sitemap({ filter: (page) => !/\/read\/(\d{2}|x)\/full\/?$/.test(page) }),
    securityHeaders(),
    readerGate(),
  ],
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
