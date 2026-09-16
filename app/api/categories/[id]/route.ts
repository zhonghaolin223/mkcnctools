import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

async function categoryId(params: Promise<{ id: string }>) { const id = Number((await params).id); return Number.isInteger(id) && id > 0 ? id : null; }

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  const id = await categoryId(params); if (!id) return Response.json({ error: "Invalid category" }, { status: 400 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return Response.json({ error: "A name and URL-safe slug are required" }, { status: 400 });
    const [category] = await getDb().update(categories).set({ name, slug, description: typeof body.description === "string" ? body.description.trim() : "", parentId: typeof body.parentId === "number" && body.parentId !== id ? body.parentId : null, navigationVisible: body.navigationVisible !== false, sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0, seoTitle: typeof body.seoTitle === "string" ? body.seoTitle.trim() : "", metaDescription: typeof body.metaDescription === "string" ? body.metaDescription.trim() : "" }).where(eq(categories.id, id)).returning();
    return category ? Response.json({ category }) : Response.json({ error: "Category not found" }, { status: 404 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) return Response.json({ error: "This category URL already exists" }, { status: 409 });
    return Response.json({ error: "Unable to update category" }, { status: 503 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  const id = await categoryId(params); if (!id) return Response.json({ error: "Invalid category" }, { status: 400 });
  try { await getDb().delete(categories).where(eq(categories.id, id)); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "Unable to delete category" }, { status: 503 }); }
}
