import { kv } from "@vercel/kv";
import { now } from "../../../../lib/time";


export async function GET(req, { params }) {
  const key = `paste:${params.id}`;
  const paste = await kv.hgetall(key);

  if (!paste || !paste.content) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = now(req);

  if (paste.expires_at && currentTime >= Number(paste.expires_at)) {
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  const views = await kv.hincrby(key, "views", 1);

  if (paste.max_views !== null && views > Number(paste.max_views)) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.max_views !== null ? Number(paste.max_views) - views : null,
    expires_at: paste.expires_at
      ? new Date(Number(paste.expires_at)).toISOString()
      : null
  });
}