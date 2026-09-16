import { env } from "cloudflare:workers";
import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { media } from "@/db/schema";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) { try { const id = Number((await params).id); if (!Number.isInteger(id) || !env.BUCKET) return new Response("Not found", { status: 404 }); const [record] = await getDb().select().from(media).where(eq(media.id, id)).limit(1); if (!record) return new Response("Not found", { status: 404 }); const object = await env.BUCKET.get(record.key); if (!object) return new Response("Not found", { status: 404 }); return new Response(object.body, { headers: { "content-type": record.mimeType, "cache-control": "public, max-age=31536000, immutable" } }); } catch { return new Response("Not found", { status: 404 }); } }
