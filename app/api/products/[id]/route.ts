import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { productCategories, productMedia, products, productSpecifications } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";
import { normalizedProduct } from "@/lib/product-input";

async function productId(params: Promise<{ id: string }>) {
  const id = Number((await params).id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  const id = await productId(params); if (!id) return Response.json({ error: "Invalid product" }, { status: 400 });
  try {
    const db = getDb(); const [product] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
    const [categories, media, specifications] = await Promise.all([
      db.select({ id: productCategories.categoryId }).from(productCategories).where(eq(productCategories.productId, id)),
      db.select({ id: productMedia.mediaId }).from(productMedia).where(eq(productMedia.productId, id)).orderBy(asc(productMedia.sortOrder)),
      db.select({ label: productSpecifications.label, value: productSpecifications.value }).from(productSpecifications).where(eq(productSpecifications.productId, id)).orderBy(asc(productSpecifications.sortOrder)),
    ]);
    return Response.json({ product: { ...product, categoryIds: categories.map((item) => item.id), mediaIds: media.map((item) => item.id), specifications } });
  } catch { return Response.json({ error: "Unable to load product" }, { status: 503 }); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  const id = await productId(params); if (!id) return Response.json({ error: "Invalid product" }, { status: 400 });
  try {
    const body = await request.json() as Record<string, unknown>;
    if (body.action === "archive") {
      const [product] = await getDb().update(products).set({ status: "archived", indexable: false, updatedAt: new Date().toISOString() }).where(eq(products.id, id)).returning();
      return product ? Response.json({ product }) : Response.json({ error: "Product not found" }, { status: 404 });
    }
    const input = normalizedProduct(body);
    if (!input) return Response.json({ error: "A name and URL-safe slug are required" }, { status: 400 });
    const db = getDb();
    const [product] = await db.update(products).set({ ...input.values, coverMediaId: input.mediaIds[0] ?? null, updatedAt: new Date().toISOString() }).where(eq(products.id, id)).returning();
    if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
    await db.batch([db.delete(productCategories).where(eq(productCategories.productId, id)), db.delete(productMedia).where(eq(productMedia.productId, id)), db.delete(productSpecifications).where(eq(productSpecifications.productId, id))]);
    const operations = [
      ...input.categoryIds.map((categoryId) => db.insert(productCategories).values({ productId: id, categoryId })),
      ...input.mediaIds.map((mediaId, sortOrder) => db.insert(productMedia).values({ productId: id, mediaId, sortOrder })),
      ...input.specifications.map((item, sortOrder) => db.insert(productSpecifications).values({ productId: id, label: item.label.trim().slice(0, 100), value: item.value.trim().slice(0, 500), sortOrder })),
    ];
    if (operations.length) await db.batch(operations);
    return Response.json({ product });
  } catch (error) {
    const text = error instanceof Error ? error.message : String(error);
    if (text.includes("UNIQUE")) return Response.json({ error: "该 URL Slug 已存在，请更换后再保存。" }, { status: 409 });
    return Response.json({ error: "Unable to update product" }, { status: 503 });
  }
}

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  const id = await productId(params); if (!id) return Response.json({ error: "Invalid product" }, { status: 400 });
  try {
    const db = getDb(); const [source] = await db.select().from(products).where(eq(products.id, id)).limit(1);
    if (!source) return Response.json({ error: "Product not found" }, { status: 404 });
    const slug = `${source.slug}-copy-${Date.now().toString(36).slice(-6)}`;
    const [copy] = await db.insert(products).values({ name: `${source.name} Copy`, slug, model: source.model, sku: source.sku ? `${source.sku}-COPY` : "", status: "draft", summary: source.summary, description: source.description, priceLabel: source.priceLabel, moq: source.moq, customization: source.customization, seoTitle: source.seoTitle, metaDescription: source.metaDescription, indexable: false, coverMediaId: source.coverMediaId }).returning();
    const [categories, media, specs] = await Promise.all([db.select().from(productCategories).where(eq(productCategories.productId, id)), db.select().from(productMedia).where(eq(productMedia.productId, id)), db.select().from(productSpecifications).where(eq(productSpecifications.productId, id))]);
    const operations = [...categories.map((item) => db.insert(productCategories).values({ productId: copy.id, categoryId: item.categoryId })), ...media.map((item) => db.insert(productMedia).values({ productId: copy.id, mediaId: item.mediaId, sortOrder: item.sortOrder })), ...specs.map((item) => db.insert(productSpecifications).values({ productId: copy.id, label: item.label, value: item.value, sortOrder: item.sortOrder }))];
    if (operations.length) await db.batch(operations);
    return Response.json({ product: copy }, { status: 201 });
  } catch { return Response.json({ error: "Unable to copy product" }, { status: 503 }); }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi(); if (auth.response) return auth.response;
  const id = await productId(params); if (!id) return Response.json({ error: "Invalid product" }, { status: 400 });
  try { await getDb().delete(products).where(eq(products.id, id)); return Response.json({ ok: true }); }
  catch { return Response.json({ error: "Unable to delete product" }, { status: 503 }); }
}
