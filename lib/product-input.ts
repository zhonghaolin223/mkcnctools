export function normalizedProduct(body: Record<string, unknown>) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
  if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return null;
  const status = body.status === "published" ? "published" as const : body.status === "archived" ? "archived" as const : "draft" as const;
  return {
    values: { name, slug, status, model: typeof body.model === "string" ? body.model.trim() : "", sku: typeof body.sku === "string" ? body.sku.trim() : "", summary: typeof body.summary === "string" ? body.summary.trim() : "", description: typeof body.description === "string" ? body.description.trim() : "", priceLabel: typeof body.priceLabel === "string" && body.priceLabel.trim() ? body.priceLabel.trim().slice(0, 120) : "Contact for Quote", moq: typeof body.moq === "string" ? body.moq.trim() : "", customization: typeof body.customization === "string" ? body.customization.trim() : "", seoTitle: typeof body.seoTitle === "string" ? body.seoTitle.trim() : "", metaDescription: typeof body.metaDescription === "string" ? body.metaDescription.trim() : "", indexable: status === "published" },
    mediaIds: Array.isArray(body.mediaIds) ? body.mediaIds.filter((id): id is number => Number.isInteger(id)).slice(0, 12) : [],
    categoryIds: Array.isArray(body.categoryIds) ? body.categoryIds.filter((id): id is number => Number.isInteger(id)).slice(0, 8) : [],
    specifications: Array.isArray(body.specifications) ? body.specifications.filter((item): item is { label: string; value: string } => Boolean(item && typeof item.label === "string" && typeof item.value === "string" && item.label.trim() && item.value.trim())).slice(0, 40) : [],
  };
}
