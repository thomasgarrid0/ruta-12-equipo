import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("app-data");
  const url = new URL(req.url);

  if (req.method === "GET") {
    const key = url.searchParams.get("key");
    if (!key) return new Response("missing key", { status: 400 });
    const value = await store.get(key);
    if (value === null) return new Response(null, { status: 404 });
    return new Response(value, { headers: { "content-type": "text/plain; charset=utf-8" } });
  }

  if (req.method === "POST") {
    const { key, value } = await req.json();
    if (!key) return new Response("missing key", { status: 400 });
    await store.set(key, value);
    return new Response("ok");
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config = { path: "/api/store" };
