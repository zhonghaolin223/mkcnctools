import { and, desc, eq, inArray } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, productCategories, productMedia, products, productSpecifications } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { normalizedProduct } from "@/lib/product-input";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const preview = url.searchParams.get("preview") === "1";
    if (preview) { const auth = await requireAdminApi(); if (auth.response) return auth.response; }
    const db = getDb();
    if (preview) return Response.json({ products: await db.select().from(products).orderBy(desc(products.updatedAt)) });
    const categorySlug = url.searchParams.get("category")?.trim();
    if (!categorySlug) return Response.json({ products: await db.select().from(products).where(eq(products.status, "published")).orderBy(desc(products.updatedAt)) });
    const [category] = await db.select({ id: categories.id }).from(categories).where(eq(categories.slug, categorySlug)).limit(1);
    if (!category) return Response.json({ products: [] });
    const links = await db.select({ productId: productCategories.productId }).from(productCategories).where(eq(productCategories.categoryId, category.id));
    if (!links.length) return Response.json({ products: [] });
    return Response.json({ products: await db.select().from(products).where(and(eq(products.status, "published"), inArray(products.id, links.map((item) => item.productId)))).orderBy(desc(products.updatedAt)) });
  } catch { return Response.json({ error: "Product service unavailable" }, { status: 503 }); }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  try {
    const input = normalizedProduct(await request.json() as Record<string, unknown>);
    if (!input) return Response.json({ error: "A name and URL-safe slug are required" }, { status: 400 });
    const db = getDb();
    const [product] = await db.insert(products).values({ ...input.values, coverMediaId: input.mediaIds[0] ?? null }).returning();
    const operations = [
      ...input.categoryIds.map((categoryId) => db.insert(productCategories).values({ productId: product.id, categoryId })),
      ...input.mediaIds.map((mediaId, sortOrder) => db.insert(productMedia).values({ productId: product.id, mediaId, sortOrder })),
      ...input.specifications.map((item, sortOrder) => db.insert(productSpecifications).values({ productId: product.id, label: item.label.trim().slice(0, 100), value: item.value.trim().slice(0, 500), sortOrder })),
    ];
    if (operations.length) await db.batch(operations);
    return Response.json({ product }, { status: 201 });
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    if (text.includes("UNIQUE")) return Response.json({ error: "该 URL Slug 已存在，请更换后再保存。" }, { status: 409 });
    console.error("product create failed", error); return Response.json({ error: "Unable to save product" }, { status: 503 });
  }
}
