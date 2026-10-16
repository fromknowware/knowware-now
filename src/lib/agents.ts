// Shared wording for everything machine-readable. One place, so the page,
// llms.txt, the manifest, the Markdown files and the API all say the same
// thing about voices, terms and the human principal.
import { SITE_URL } from '../config';

export {
  SYNTHESIS_DISCLOSURE, UNTRUSTED_NOTICE, PRINCIPAL_RULE, TERMS_VERSION, TERMS_URL, TERMS, CONTENT_SIGNAL, WORK, LICENSES,
} from '../../lib/site-facts.mjs';
import { SYNTHESIS_DISCLOSURE, UNTRUSTED_NOTICE } from '../../lib/site-facts.mjs';

export const ENDPOINTS = {
  llms: `${SITE_URL}/llms.txt`,
  llmsFull: `${SITE_URL}/llms-full.txt`,
  manifest: `${SITE_URL}/.well-known/knowware.json`,
  agentsPage: `${SITE_URL}/agents`,
  agentsMarkdown: `${SITE_URL}/agents.md`,
};

// Front matter that travels with any Markdown we hand to a machine.
export function frontMatter(fields: Record<string, string | number | boolean>): string {
  const lines = Object.entries(fields).map(([k, v]) =>
    typeof v === 'string' ? `${k}: ${JSON.stringify(v)}` : `${k}: ${v}`,
  );
  return `---\n${lines.join('\n')}\n---\n`;
}

export function disclosureBlock(): string {
  return [`> **Synthesized text.** ${SYNTHESIS_DISCLOSURE}`, `> **Untrusted third-party text.** ${UNTRUSTED_NOTICE}`].join('\n');
}
