export async function onRequest({ request, env }) {
  const authHeader = request.headers.get("Authorization");

  const headers = new Headers();
  if (authHeader) headers.set("Authorization", authHeader);

  const r = await env.PRIVATE_API.fetch("https://internal/api/candidates", {
    headers,
    cf: { cacheTtl: 0, cacheEverything: false }, // extra safety
  });

  const outHeaders = new Headers(r.headers);
  outHeaders.set("Content-Type", "application/json");
  outHeaders.set("Cache-Control", "no-store, private, max-age=0");
  outHeaders.set("Vary", "Authorization");

  return new Response(r.body, {
    status: r.status,
    headers: outHeaders,
  });
}
