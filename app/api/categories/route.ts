import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

export async function GET(request: Request) {
  try {
    const preview = new URL(request.url).searchParams.get("preview") === "1";
    if (preview) { const auth = await requireAdminApi(); if (auth.response) return auth.response; }
    const db = getDb();
    const rows = preview ? await db.select().from(categories).orderBy(asc(categories.sortOrder), asc(categories.name)) : await db.select().from(categories).where(eq(categories.navigationVisible, true)).orderBy(asc(categories.sortOrder), asc(categories.name));
    return Response.json({ categories: rows });
  } catch { return Response.json({ error: "Category service unavailable" }, { status: 503 }); }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return Response.json({ error: "A name and URL-safe slug are required" }, { status: 400 });
    const [category] = await getDb().insert(categories).values({ name, slug, description: typeof body.description === "string" ? body.description.trim() : "", parentId: typeof body.parentId === "number" ? body.parentId : null, navigationVisible: body.navigationVisible !== false, sortOrder: typeof body.sortOrder === "number" ? body.sortOrder : 0, seoTitle: typeof body.seoTitle === "string" ? body.seoTitle.trim() : "", metaDescription: typeof body.metaDescription === "string" ? body.metaDescription.trim() : "" }).returning();
    return Response.json({ category }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) return Response.json({ error: "This category URL already exists" }, { status: 409 });
    return Response.json({ error: "Unable to save category" }, { status: 503 });
  }
}
