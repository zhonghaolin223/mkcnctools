import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
export async function GET() { const auth = await requireAdminApi(); if (auth.response) return auth.response; try { return Response.json({ inquiries: await getDb().select().from(inquiries).orderBy(desc(inquiries.createdAt)).limit(100) }); } catch { return Response.json({ error: "Inquiry service unavailable" }, { status: 503 }); } }
