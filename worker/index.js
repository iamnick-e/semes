/**
 * Semes play count worker
 * Cloudflare Workers + KV — free tier handles this easily.
 *
 * Deploy:
 *   1. Sign up at https://dash.cloudflare.com (free)
 *   2. npm install -g wrangler
 *   3. wrangler login
 *   4. wrangler kv:namespace create COUNTS  ← paste the id into wrangler.toml
 *   5. wrangler deploy
 *   6. Copy the worker URL into COUNTS_API in docs/index.html
 */

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url  = new URL(request.url);
    const slug = url.pathname.replace(/^\/+|\/+$/g, ''); // trim slashes

    // GET / → return all counts as { slug: count, ... }
    if (!slug && request.method === 'GET') {
      const list   = await env.COUNTS.list();
      const counts = {};
      await Promise.all(
        list.keys.map(async k => {
          counts[k.name] = parseInt(await env.COUNTS.get(k.name) || '0');
        })
      );
      return json(counts);
    }

    // GET /:slug → return { count }
    if (slug && request.method === 'GET') {
      const count = parseInt(await env.COUNTS.get(slug) || '0');
      return json({ count });
    }

    // POST /:slug → increment and return { count }
    if (slug && request.method === 'POST') {
      const current = parseInt(await env.COUNTS.get(slug) || '0');
      const next    = current + 1;
      await env.COUNTS.put(slug, String(next));
      return json({ count: next });
    }

    return new Response('Not found', { status: 404, headers: CORS });
  },
};

function json(data) {
  return new Response(JSON.stringify(data), {
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
}
