// Moves the built full-chapter pages out of the static output and into a
// module that the /read/:slug/full Pages Function serves to signed-up readers.
// Must run after security-headers so those pages' inline scripts are hashed.
import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

export default function readerGate() {
  let projectRoot;
  return {
    name: 'knowware-reader-gate',
    hooks: {
      'astro:config:done': ({ config }) => {
        projectRoot = fileURLToPath(config.root);
      },
      'astro:build:done': async ({ dir, logger }) => {
        const readDir = join(fileURLToPath(dir), 'read');
        const chapters = {};
        for (const entry of await readdir(readDir, { withFileTypes: true })) {
          if (!entry.isDirectory() || !/^(0[1-9]|x)$/.test(entry.name)) continue;
          const fullDir = join(readDir, entry.name, 'full');
          try {
            chapters[entry.name] = await readFile(join(fullDir, 'index.html'), 'utf8');
          } catch {
            continue;
          }
          await rm(fullDir, { recursive: true, force: true });
        }
        if (Object.keys(chapters).length !== 10) {
          throw new Error(`reader-gate: expected 10 full chapters (9 + capstone), found ${Object.keys(chapters).length}`);
        }
        const generated = join(projectRoot, 'lib/generated');
        await mkdir(generated, { recursive: true });
        await writeFile(join(generated, 'full-chapters.js'), `export default ${JSON.stringify(chapters)};\n`);
        logger.info('10 full chapters moved behind /read/:slug/full');
      },
    },
  };
}
