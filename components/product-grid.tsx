"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { WhatsAppButton } from "@/components/whatsapp-button";

type Product = { id: number; name: string; slug: string; summary: string; priceLabel: string; moq: string; customization: string; coverMediaId: number | null };

export function ProductGrid({ categorySlug }: { categorySlug?: string }) {
  const [products, setProducts] = useState<Product[] | null>(null);
  useEffect(() => { const query = categorySlug ? `?category=${encodeURIComponent(categorySlug)}` : ""; void fetch(`/api/products${query}`).then(async (response) => response.ok ? response.json() as Promise<{ products: Product[] }> : { products: [] }).then((data) => setProducts(data.products)).catch(() => setProducts([])); }, [categorySlug]);
  if (products === null) return <div className="empty-card">Loading catalogue…</div>;
  if (!products.length) return <div className="empty-card"><strong>Tell us the CNC tool you need.</strong><p>Share the tool type, model or size, quantity and preferred brand route. Drawings and application details are only needed for non-standard customization.</p><WhatsAppButton /></div>;
  return <div className="product-grid">{products.map((product) => <article className="product-card" key={product.id}>{product.coverMediaId ? <img src={`/api/media/${product.coverMediaId}`} alt={product.name} /> : <div className="product-image-empty">Product image to be confirmed</div>}<div className="product-card-body"><p className="product-badge">{product.priceLabel || "Factory Direct"}</p><h2>{product.name}</h2><p>{product.summary || "Share your machining application for a tailored recommendation."}</p><dl className="product-facts"><div><dt>MOQ</dt><dd>{product.moq || "Ask us"}</dd></div><div><dt>Service</dt><dd>{product.customization || "Custom options"}</dd></div></dl><div className="product-actions"><Link className="text-button" href={`/products/${product.slug}`}>View details</Link><WhatsAppButton className="product-quote" message={`Hello, I would like a quote for ${product.name}.`} label="Quote This Tool" trackingContext={product.name} /></div></div></article>)}</div>;
}
