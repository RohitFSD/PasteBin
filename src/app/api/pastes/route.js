import { kv } from "@vercel/kv";
import crypto from "crypto";

export async function POST(req) {
  const { content, ttl_seconds, max_views } = await req.json();

  if (!content || typeof content !== "string") {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  if (ttl_seconds && ttl_seconds < 1) {
    return Response.json({ error: "Invalid ttl" }, { status: 400 });
  }

  if (max_views && max_views < 1) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const id = crypto.randomUUID().slice(0, 8);
  const now = Date.now();

  const paste = {
    id,
    content,
    created_at: now,
    expires_at: ttl_seconds ? now + ttl_seconds * 1000 : null,
    max_views: max_views ?? null,
    views: 0
  };

  await kv.hset(`paste:${id}`, paste);

  return Response.json({
    id,
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${id}`
  });
}