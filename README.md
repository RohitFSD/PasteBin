# Pastebin Lite

Minimal Pastebin-like app built with Next.js and Redis (Vercel KV).

## Run locally
npm install
npm run dev

## Persistence
Uses Vercel KV (Redis) for persistent storage.

## Notes
- API reads count as views
- HTML views do not increment views
- Supports deterministic time via TEST_MODE