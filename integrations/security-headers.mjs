// Writes dist/_headers for Cloudflare Pages after build.
// The CSP allows only same-origin scripts plus sha256 hashes of the exact
// inline scripts Astro emitted, so any injected inline script is blocked.
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/gi;
const DATA_TYPES = /type\s*=\s*["']?(application\/(ld\+)?json)/i;

async function htmlFiles(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await htmlFiles(full)));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

export default function securityHeaders() {
  let projectRoot;
  return {
    name: 'knowware-security-headers',
    hooks: {
      'astro:config:done': ({ config }) => {
        projectRoot = fileURLToPath(config.root);
      },
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(dir);
        const hashes = new Set();
        for (const file of await htmlFiles(root)) {
          const html = await readFile(file, 'utf8');
          for (const [, attrs, body] of html.matchAll(INLINE_SCRIPT)) {
            if (DATA_TYPES.test(attrs) || !body.trim()) continue;
            hashes.add(`'sha256-${createHash('sha256').update(body).digest('base64')}'`);
          }
        }

        const csp = [
          "default-src 'self'",
          `script-src 'self' ${[...hashes].sort().join(' ')}`.trim(),
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data:",
          "font-src 'self'",
          "connect-src 'self'",
          "manifest-src 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
          "base-uri 'self'",
          "object-src 'none'",
          'upgrade-insecure-requests',
        ].join('; ');

        const pageHeaders = {
          'Content-Security-Policy': csp,
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=()',
          'Cross-Origin-Opener-Policy': 'same-origin',
          'Cross-Origin-Resource-Policy': 'same-origin',
        };

        // Pages Functions responses don't get _headers, so functions import these.
        const generated = join(projectRoot, 'lib/generated');
        await mkdir(generated, { recursive: true });
        await writeFile(join(generated, 'page-headers.js'), `export default ${JSON.stringify(pageHeaders, null, 2)};\n`);

        const headers = `/*
${Object.entries(pageHeaders).map(([k, v]) => `  ${k}: ${v}`).join('\n')}

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/.well-known/security.txt
  Content-Type: text/plain; charset=utf-8

/feed.xml
  Content-Type: application/atom+xml; charset=utf-8
`;
        await writeFile(join(root, '_headers'), headers);
        logger.info(`_headers written (${hashes.size} inline script hash${hashes.size === 1 ? '' : 'es'})`);
      },
    },
  };
}
