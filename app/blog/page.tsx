import { PageHeader } from "@/components/page-header";
import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { posts } from "@/db/schema";

export const metadata: Metadata = {
  title: "CNC Cutting Tool Resources",
  description: "Technical articles, sourcing guides and application notes for CNC turning, milling, boring and drilling tools.",
  alternates: { canonical: "/blog" },
};
export const dynamic = "force-dynamic";

export default async function BlogPage(){
  let entries: typeof posts.$inferSelect[] = [];
  try { entries = await getDb().select().from(posts).where(eq(posts.status, "published")).orderBy(desc(posts.publishedAt), desc(posts.createdAt)); } catch { /* The page remains available before database setup. */ }
  return <PageHeader eyebrow="MINGKAI INSIGHTS" title="Machining knowledge for better sourcing decisions."><p>Technical notes, application guides and sourcing checklists for B2B CNC cutting-tool buyers.</p>{entries.length ? <div className="blog-grid">{entries.map((post) => <article className="blog-card" key={post.id}><p className="eyebrow">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "INSIGHT"}</p><h2>{post.title}</h2><p>{post.excerpt}</p><Link className="text-button" href={`/blog/${post.slug}`}>Read article</Link></article>)}</div> : <div className="empty-card"><strong>Insights are being prepared.</strong><p>Technical articles are created in 中文后台 → 博客管理, then published with an SEO-ready English URL.</p></div>}</PageHeader>
}
