import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDb } from "@/db";
import { media, productMedia, products, productSpecifications } from "@/db/schema";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { InquiryForm } from "@/components/inquiry-form";
import { ViewTracker } from "@/components/view-tracker";
import { getChatGPTUser } from "@/app/chatgpt-auth";
import { SITE_URL } from "@/lib/site-url";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const [product] = await getDb().select().from(products).where(eq(products.slug, slug)).limit(1);
    if (!product || product.status !== "published" || !product.indexable) return { robots: { index: false, follow: false } };

    const title = product.seoTitle || product.name;
    const description = product.metaDescription || product.summary || `${product.name} for CNC metalworking applications. Request product specifications and a quotation from MingKai Precision Tools.`;
    return {
      title,
      description,
      alternates: { canonical: `/products/${product.slug}` },
      openGraph: { type: "website", title, description },
    };
  } catch {
    return { robots: { index: false, follow: false } };
  }
}

async function loadProduct(slug: string, allowPreview = false) {
  try {
    const db = getDb();
    const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
    if (!product || (!allowPreview && product.status !== "published")) return { product: null, gallery: [], specifications: [] };
    const [gallery, specifications] = await Promise.all([
      db.select({ id: media.id, altText: media.altText, fileName: media.fileName }).from(productMedia).innerJoin(media, eq(productMedia.mediaId, media.id)).where(eq(productMedia.productId, product.id)).orderBy(asc(productMedia.sortOrder)),
      db.select().from(productSpecifications).where(eq(productSpecifications.productId, product.id)).orderBy(asc(productSpecifications.sortOrder)),
    ]);
    return { product, gallery, specifications };
  } catch {
    return null;
  }
}

export default async function ProductDetail({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ preview?: string }> }) {
  const { slug } = await params;
  const allowPreview = (await searchParams).preview === "1" && Boolean(await getChatGPTUser());
  const result = await loadProduct(slug, allowPreview);
  if (result?.product === null) notFound();
  if (!result) return <main className="subpage"><p className="eyebrow">PRODUCT CENTRE</p><h1>Product catalogue is being prepared.</h1><p>Please return once product data is published, or send an enquiry now.</p><WhatsAppButton label="Ask on WhatsApp" /></main>;

  const { product, gallery, specifications } = result;
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary || product.description || undefined,
    sku: product.sku || undefined,
    image: gallery.length ? gallery.map((item) => `${SITE_URL}/api/media/${item.id}`) : undefined,
    brand: { "@type": "Brand", name: "MingKai Precision Tools" },
  };
  return <main className="subpage product-detail"><ViewTracker name="product_view" payload={{ product_id: product.id, product_name: product.name, path: `/products/${product.slug}` }}/><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }} />{allowPreview && product.status !== "published" && <p className="notice">Administrator preview — this product is not visible to public visitors.</p>}<p className="eyebrow">{product.priceLabel || "FACTORY DIRECT"}</p><h1>{product.name}</h1><p>{product.summary || "Product information is available on request."}</p>{gallery.length > 0 && <div className="product-gallery">{gallery.map((item) => <img key={item.id} src={`/api/media/${item.id}`} alt={item.altText || item.fileName}/>)}</div>}{product.description && <section><h2>Product overview</h2><p>{product.description}</p></section>}{specifications.length > 0 && <section><h2>Specifications</h2><dl className="specifications">{specifications.map((specification) => <div key={specification.id}><dt>{specification.label}</dt><dd>{specification.value}</dd></div>)}</dl></section>}<div className="quote-card"><strong>{product.priceLabel || "Factory-direct pricing"}</strong><p>{product.moq && `MOQ: ${product.moq}. `}{product.customization && `Customisation: ${product.customization}. `}Request this tool for your own brand, private label or a custom requirement. A drawing is only needed for non-standard customization.</p><div className="contact-actions"><WhatsAppButton message={`Hello, I would like a quote for ${product.name}.`} label="Get a Quote on WhatsApp" trackingContext={product.name} /></div></div><section className="contact-inquiry"><h2>Send a formal product inquiry</h2><p>Leave your business details if you want this request saved in our inquiry system.</p><InquiryForm productId={product.id} productName={product.name}/></section></main>;
}
