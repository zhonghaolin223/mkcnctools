import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { analyticsEvents } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

type WhatsAppPayload = { path?: unknown; label?: unknown; context?: unknown };

function readPayload(value: string): WhatsAppPayload {
  try { return JSON.parse(value) as WhatsAppPayload; } catch { return {}; }
}

export async function GET() {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  try {
    const rows = await getDb().select().from(analyticsEvents).where(eq(analyticsEvents.name, "whatsapp_click")).orderBy(desc(analyticsEvents.createdAt)).limit(1000);
    const now = Date.now();
    const dayStart = new Date(); dayStart.setHours(0, 0, 0, 0);
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;
    const sources = new Map<string, { count: number; latestAt: string }>();
    let today = 0; let last7Days = 0;
    for (const row of rows) {
      const timestamp = Date.parse(row.createdAt);
      if (!Number.isNaN(timestamp) && timestamp >= dayStart.getTime()) today += 1;
      if (!Number.isNaN(timestamp) && timestamp >= sevenDaysAgo) last7Days += 1;
      const payload = readPayload(row.payload);
      const context = typeof payload.context === "string" && payload.context ? payload.context : "通用报价入口";
      const path = typeof payload.path === "string" && payload.path ? payload.path : "未知页面";
      const key = `${context} · ${path}`;
      const current = sources.get(key) || { count: 0, latestAt: row.createdAt };
      current.count += 1;
      if (row.createdAt > current.latestAt) current.latestAt = row.createdAt;
      sources.set(key, current);
    }
    return Response.json({ total: rows.length, today, last7Days, sources: [...sources.entries()].map(([source, value]) => ({ source, ...value })).sort((a, b) => b.count - a.count).slice(0, 20) });
  } catch {
    return Response.json({ error: "WhatsApp 统计暂不可用" }, { status: 503 });
  }
}
