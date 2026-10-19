// Connects to the Knowware MCP server with the official MCP TypeScript client.
// Not a dependency of this repo; install it where you run this:
//   npm i @modelcontextprotocol/client            (v2, spec 2026-07-28)
//   KNOWWARE_AGENT_TOKEN=kwa_... node examples/mcp-client.mjs [https://knowware.systems/mcp]
// Without a token only the public tools work. A person mints the token at /agents.
import { Client, StreamableHTTPClientTransport } from '@modelcontextprotocol/client';

const url = process.argv[2] || 'https://knowware.systems/mcp';
const token = process.env.KNOWWARE_AGENT_TOKEN;
const client = new Client({ name: 'knowware-mcp-example', version: '1.0.0' }, { versionNegotiation: { mode: 'auto' } });
await client.connect(new StreamableHTTPClientTransport(new URL(url), token ? { requestInit: { headers: { Authorization: `Bearer ${token}` } } } : {}));

console.log('server:', client.getServerVersion()?.name, '| protocol:', client.getNegotiatedProtocolVersion?.());
console.log('instructions:', client.getInstructions());
const { tools } = await client.listTools();
console.log('tools:', tools.map((t) => t.name).join(', '));

const text = (r) => r.content[0].text;
console.log('\ndefine_term:', JSON.parse(text(await client.callTool({ name: 'define_term', arguments: { term: 'knowware' } }))).senses[0]);
const preview = JSON.parse(text(await client.callTool({ name: 'read_preview', arguments: { slug: '01' } })));
console.log('read_preview:', preview.notice, `(synthesized: ${preview.synthesized})`);
const full = await client.callTool({ name: 'read_chapter', arguments: { slug: '01' } });
console.log('read_chapter:', full.isError ? `refused: ${text(full)}` : `ok for ${JSON.parse(text(full)).principal.label}`);
await client.close();
