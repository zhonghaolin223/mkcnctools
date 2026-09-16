import type { MetadataRoute } from "next";
import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { categories, posts, products } from "@/db/schema";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/products", "/oem-odm", "/factory", "/about", "/blog", "/contact", "/privacy"];
  const staticEntries = routes.map((route) => ({ url: `${SITE_URL}${route}`, lastModified: new Date(), changeFrequency: route === "" ? "weekly" as const : "monthly" as const, priority: route === "" ? 1 : .7 }));
  try {
    const [publishedProducts, publishedPosts, publicCategories] = await Promise.all([getDb().select({ slug: products.slug, updatedAt: products.updatedAt }).from(products).where(and(eq(products.status, "published"), eq(products.indexable, true))), getDb().select({ slug: posts.slug, publishedAt: posts.publishedAt, createdAt: posts.createdAt }).from(posts).where(eq(posts.status, "published")), getDb().select({ slug: categories.slug }).from(categories).where(eq(categories.navigationVisible, true))]);
    return [...staticEntries, ...publicCategories.map((category) => ({ url: `${SITE_URL}/product-categories/${category.slug}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: .8 })), ...publishedProducts.map((product) => ({ url: `${SITE_URL}/products/${product.slug}`, lastModified: new Date(product.updatedAt), changeFrequency: "monthly" as const, priority: .8 })), ...publishedPosts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: new Date(post.publishedAt || post.createdAt), changeFrequency: "monthly" as const, priority: .7 }))];
  } catch {
    return staticEntries;
  }
}
