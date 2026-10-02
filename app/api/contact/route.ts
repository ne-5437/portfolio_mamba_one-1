/**
 * Contact form sink. Inserts into the Supabase `messages` table via its REST
 * API, so no SDK dependency is needed. The table's RLS policy allows INSERT
 * only — the key here can write messages but never read them back.
 *
 * Env (server-only, set in .env.local and in Vercel → Settings → Env Vars):
 *   SUPABASE_URL       https://<project-ref>.supabase.co
 *   SUPABASE_ANON_KEY  the project's anon / publishable key
 */

const MAX_NAME = 100;
const MAX_MESSAGE = 4000;

// In-memory per-IP throttle. Resets whenever the serverless instance recycles —
// that's fine here: the goal is blunting scripted spam bursts, not a hard quota.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Opportunistic cleanup so `hits` doesn't grow unbounded on a long-lived instance.
  for (const [key, entry] of hits) {
    if (entry.resetAt <= now) hits.delete(key);
  }

  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return Response.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) {
    return Response.json({ error: "Contact form is not configured." }, { status: 503 });
  }

  let body: { name?: unknown; message?: unknown; website?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: real visitors never see or fill the hidden `website` field.
  // Pretend success so bots don't learn to adapt.
  if (typeof body.website === "string" && body.website.length > 0) {
    return Response.json({ ok: true });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!name || !message || name.length > MAX_NAME || message.length > MAX_MESSAGE) {
    return Response.json({ error: "Please enter a name and a message." }, { status: 400 });
  }

  const res = await fetch(`${url}/rest/v1/messages`, {
    method: "POST",
    headers: {
      apikey: key,
      // Legacy anon keys are JWTs and also go in Authorization; the newer
      // `sb_publishable_…` keys are not JWTs and must only go in `apikey`.
      ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}),
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ name, message }),
  });

  if (!res.ok) {
    console.error("Supabase insert failed", res.status, await res.text());
    return Response.json({ error: "Could not send right now. Please email instead." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
