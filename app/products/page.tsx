import Link from "next/link";
import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { PageHeader } from "@/components/page-header";
import { ProductGrid } from "@/components/product-grid";
import { getDb } from "@/db";
import { categories } from "@/db/schema";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "CNC Cutting Tools for Turning, Milling, Boring & Drilling",
  description: "Browse CNC cutting tools for turning, milling, boring and drilling. Review product specifications and request a quotation for your metalworking application.",
  alternates: { canonical: "/products" },
};

async function CategoryDirectory() {
  try {
    const rows = await getDb().select().from(categories).where(eq(categories.navigationVisible, true)).orderBy(asc(categories.sortOrder), asc(categories.name));
    if (!rows.length) return null;
    return <nav className="category-directory" aria-label="Product categories">{rows.map((category) => <Link key={category.id} href={`/product-categories/${category.slug}`}>{category.name}<span aria-hidden="true">→</span></Link>)}</nav>;
  } catch { return null; }
}

export default function ProductsPage() {
  return <PageHeader className="products-page" backgroundVideoSrc="/assets/products-background.mp4" backgroundVideoStart={10} eyebrow="CNC CUTTING TOOLS" title="Precision Tools for Metalworking">
    <p>Browse CNC cutting tools for turning, milling, boring and drilling applications. Choose a category or open a product to review specifications and request a quotation.</p>
    <CategoryDirectory/>
    <ProductGrid/>
  </PageHeader>;
}
