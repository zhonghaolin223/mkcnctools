import Link from "next/link";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDb } from "@/db";
import { posts } from "@/db/schema";
import { WhatsAppButton } from "@/components/whatsapp-button";

export const dynamic = "force-dynamic";

async function loadPost(slug: string) {
  try {
    const [post] = await getDb().select().from(posts).where(eq(posts.slug, slug)).limit(1);
    return post?.status === "published" ? post : null;
  } catch { return null; }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await loadPost((await params).slug);
  if (!post) return { robots: { index: false, follow: false } };
  return { title: post.seoTitle || post.title, description: post.metaDescription || post.excerpt, alternates: { canonical: `/blog/${post.slug}` } };
}

export default async function BlogArticle({ params }: { params: Promise<{ slug: string }> }) {
  const post = await loadPost((await params).slug);
  if (!post) notFound();
  return <main className="subpage article-page"><Link href="/blog" className="back-link">← Back to insights</Link><p className="eyebrow">MINGKAI INSIGHTS</p><h1>{post.title}</h1>{post.publishedAt && <time dateTime={post.publishedAt}>{new Date(post.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</time>}<p className="article-excerpt">{post.excerpt}</p><div className="article-content">{post.content.split(/\n{2,}/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div><div className="article-cta"><div><p className="eyebrow">READY TO DISCUSS A TOOLING REQUIREMENT?</p><h2>Talk directly with our team on WhatsApp.</h2></div><WhatsAppButton message={`Hello, I have read “${post.title}” and would like to discuss a CNC cutting tool requirement.`} label="Get a Quote" /></div></main>;
}
