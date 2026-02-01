import { kv } from "@vercel/kv";

export async function GET() {
  try {
    const hasKvUrl = Boolean(process.env.KV_URL);
    const hasKvRest = Boolean(process.env.KV_REST_API_URL);

    if (!hasKvUrl || !hasKvRest) {
      return Response.json({
        ok: false,
        reason: "KV env vars missing",
        hasKvUrl,
        hasKvRest
      }, { status: 500 });
    }

    await kv.ping();

    return Response.json({
      ok: true,
      kv: "connected"
    });
  } catch (e) {
    return Response.json({
      ok: false,
      error: e.message
    }, { status: 500 });
  }
}
