// In-memory stand-in for the CLAIMS KV binding, shared by the reader and list tests.
// list() returns keys in sorted order like Cloudflare KV; expirationTtl is recorded, not enforced.
export function fakeKV() {
  const m = new Map();
  const ttl = new Map();
  return {
    m,
    ttl,
    async get(k) { return m.has(k) ? m.get(k) : null; },
    async put(k, v, opts = {}) { m.set(k, v); if (opts.expirationTtl) ttl.set(k, opts.expirationTtl); },
    async delete(k) { m.delete(k); ttl.delete(k); },
    async list({ prefix = '', limit = 1000 } = {}) {
      const all = [...m.keys()].filter((k) => k.startsWith(prefix)).sort();
      return { keys: all.slice(0, limit).map((name) => ({ name })), list_complete: all.length <= limit };
    },
  };
}

// Replaces global fetch for the duration of a test; records Resend calls. Returns { calls, restore }.
export function mockResend({ ok = true, status = 200 } = {}) {
  const real = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, init) => {
    calls.push({ url: String(url), body: init?.body ? JSON.parse(init.body) : null });
    return new Response(JSON.stringify({ id: 'test' }), { status: ok ? 200 : status });
  };
  return { calls, restore: () => { globalThis.fetch = real; } };
}
