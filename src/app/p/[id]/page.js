import { kv } from "@vercel/kv";
import { now } from "../../../lib/time";

export default async function PastePage({ params }) {
  const paste = await kv.hgetall(`paste:${params.id}`);

  if (!paste || !paste.content) {
    return <h1>404 – Paste not found</h1>;
  }

  const currentTime = now({ headers: new Headers() });

  if (paste.expires_at && currentTime >= Number(paste.expires_at)) {
    return <h1>404 – Paste expired</h1>;
  }

  if (paste.max_views !== null && Number(paste.views) >= Number(paste.max_views)) {
    return <h1>404 – Paste unavailable</h1>;
  }

  return (
    <pre style={{ whiteSpace: "pre-wrap", padding: 20 }}>
      {paste.content}
    </pre>
  );
}