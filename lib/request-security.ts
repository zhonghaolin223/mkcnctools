import { env } from "cloudflare:workers";

function clientAddress(request: Request) {
  return request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function enforceRateLimit(request: Request, scope: string, limit: number, windowSeconds: number) {
  if (!env.DB) return { allowed: true, retryAfter: 0 };
  const now = Math.floor(Date.now() / 1000);
  const windowStartedAt = Math.floor(now / windowSeconds) * windowSeconds;
  const fingerprint = await digest(`${scope}:${clientAddress(request)}`);
  const key = `${scope}:${fingerprint}:${windowStartedAt}`;
  const row = await env.DB.prepare(`
    INSERT INTO submission_limits (key, count, window_started_at, updated_at)
    VALUES (?, 1, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(key) DO UPDATE SET count = count + 1, updated_at = CURRENT_TIMESTAMP
    RETURNING count
  `).bind(key, windowStartedAt).first<{ count: number }>();
  const count = Number(row?.count || 1);
  return { allowed: count <= limit, retryAfter: Math.max(1, windowStartedAt + windowSeconds - now) };
}

export async function verifyTurnstile(request: Request, token: string) {
  const secret = env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return { ok: true, configured: false };
  if (!token) return { ok: false, configured: true };
  const form = new URLSearchParams({ secret, response: token, remoteip: clientAddress(request) });
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  if (!response.ok) return { ok: false, configured: true };
  const result = await response.json() as { success?: boolean };
  return { ok: result.success === true, configured: true };
}
