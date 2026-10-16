import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import securityHeaders from './integrations/security-headers.mjs';
import readerGate from './integrations/reader-gate.mjs';
import agentMarkdown from './integrations/agent-markdown.mjs';

export default defineConfig({
  site: 'https://knowware.press',
  output: 'static',
  compressHTML: true,
  integrations: [
    sitemap({ filter: (page) => !/\/read\/(\d{2}|x)\/full\/?$/.test(page) }),
    agentMarkdown(),
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
    // Browsers and feed readers get a real 301 from public/_redirects on
    // Cloudflare Pages; this is the static fallback elsewhere.
    '/feed': '/feed.xml',
  },
});
