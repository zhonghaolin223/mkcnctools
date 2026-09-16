import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import { categories } from "@/db/schema";
import { PageHeader } from "@/components/page-header";
import { ProductGrid } from "@/components/product-grid";
import { ViewTracker } from "@/components/view-tracker";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

async function loadCategory(slug: string) {
  const [category] = await getDb().select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return category;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const category = await loadCategory((await params).slug);
    if (!category || !category.navigationVisible) return { robots: { index: false, follow: false } };
    const title = category.seoTitle || `${category.name} | CNC Cutting Tools`;
    const description = category.metaDescription || category.description || `Browse ${category.name} from MingKai Precision Tools and request a factory-direct quotation.`;
    return { title, description, alternates: { canonical: `/product-categories/${category.slug}` }, openGraph: { type: "website", title, description } };
  } catch { return { robots: { index: false, follow: false } }; }
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await loadCategory(slug).catch(() => null);
  if (!category || !category.navigationVisible) notFound();
  const schema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Products", item: `${SITE_URL}/products` }, { "@type": "ListItem", position: 2, name: category.name, item: `${SITE_URL}/product-categories/${category.slug}` }] };
  return <PageHeader eyebrow="PRODUCT CATEGORY" title={category.name}>
    <ViewTracker name="category_view" payload={{ category_id: category.id, category_name: category.name, path: `/product-categories/${category.slug}` }}/>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}/>
    <p>{category.description || `Explore ${category.name} and discuss your machining application with our team.`}</p>
    <ProductGrid categorySlug={category.slug}/>
  </PageHeader>;
}
