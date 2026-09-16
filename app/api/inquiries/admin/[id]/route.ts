import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

const statuses = new Set(["new", "contacted", "quoted", "negotiating", "won", "lost", "spam"]);

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid inquiry" }, { status: 400 });
  try {
    const body = await request.json() as { status?: string; notes?: string };
    if (!body.status || !statuses.has(body.status)) return Response.json({ error: "Invalid inquiry status" }, { status: 400 });
    const [inquiry] = await getDb().update(inquiries).set({ status: body.status as "new" | "contacted" | "quoted" | "negotiating" | "won" | "lost" | "spam", notes: typeof body.notes === "string" ? body.notes.trim().slice(0, 4000) : "" }).where(eq(inquiries.id, id)).returning();
    return inquiry ? Response.json({ inquiry }) : Response.json({ error: "Inquiry not found" }, { status: 404 });
  } catch { return Response.json({ error: "Unable to update inquiry" }, { status: 503 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: "Invalid inquiry" }, { status: 400 });
  try { await getDb().delete(inquiries).where(eq(inquiries.id, id)); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "Unable to delete inquiry" }, { status: 503 }); }
}
