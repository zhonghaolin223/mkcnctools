import { getDb } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { enforceRateLimit } from "@/lib/request-security";

const allowedEvents = new Set(["page_view", "whatsapp_click", "product_view", "category_view", "form_start", "form_submit", "contact_click"]);

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
    const rateLimit = await enforceRateLimit(request, "analytics", 240, 3600);
    if (!rateLimit.allowed) return Response.json({ error: "Rate limit exceeded" }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } });
    const body = await request.json() as { name?: string; payload?: unknown };
    const name = body.name?.trim();
    if (!name || !allowedEvents.has(name)) return Response.json({ error: "Invalid event name" }, { status: 400 });
    const payload = JSON.stringify(body.payload ?? {});
    if (payload.length > 1200) return Response.json({ error: "Event payload too large" }, { status: 400 });
    await getDb().insert(analyticsEvents).values({ name, payload });
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Event service unavailable" }, { status: 503 });
  }
}
