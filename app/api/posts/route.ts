import { desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { posts } from "@/db/schema";
import { requireAdminApi } from "@/lib/admin-auth";

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export async function GET(request: Request) {
  try {
    const preview = new URL(request.url).searchParams.get("preview") === "1";
    if (preview) {
      const auth = await requireAdminApi();
      if (auth.response) return auth.response;
    }
    const rows = await getDb().select().from(posts).where(preview ? undefined : eq(posts.status, "published")).orderBy(desc(posts.publishedAt), desc(posts.createdAt));
    return Response.json({ posts: rows });
  } catch {
    return Response.json({ error: "文章服务暂不可用" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (auth.response) return auth.response;
  try {
    const body = await request.json() as Record<string, unknown>;
    const title = typeof body.title === "string" ? body.title.trim() : "";
    const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
    if (!title || !slugPattern.test(slug)) return Response.json({ error: "请填写文章标题和合规的 URL Slug。" }, { status: 400 });
    const status = body.status === "published" ? "published" : "draft";
    const [post] = await getDb().insert(posts).values({
      title: title.slice(0, 180), slug, status,
      excerpt: typeof body.excerpt === "string" ? body.excerpt.trim().slice(0, 420) : "",
      content: typeof body.content === "string" ? body.content.trim().slice(0, 20000) : "",
      seoTitle: typeof body.seoTitle === "string" ? body.seoTitle.trim().slice(0, 180) : "",
      metaDescription: typeof body.metaDescription === "string" ? body.metaDescription.trim().slice(0, 320) : "",
      publishedAt: status === "published" ? new Date().toISOString() : null,
    }).returning();
    return Response.json({ post }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message.includes("UNIQUE")) return Response.json({ error: "该文章 Slug 已存在，请更换后重试。" }, { status: 409 });
    return Response.json({ error: "文章保存失败，请稍后重试。" }, { status: 503 });
  }
}
