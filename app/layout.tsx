import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";
import { AnalyticsTracker } from "@/components/analytics";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { SITE_URL } from "@/lib/site-url";

export const metadata: Metadata = {
  title: { default: "CNC Cutting Tools for Turning, Milling, Boring & Drilling | MingKai", template: "%s | MingKai Precision Tools" },
  description: "Source CNC cutting tools for turning, milling, boring and drilling. Discuss metalworking applications, review specifications and request a B2B quotation from MingKai.",
  keywords: ["CNC cutting tools", "turning tools", "milling tools", "boring tools", "drilling tools", "U drill", "indexable drill", "metalworking tools"],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: { type: "website", locale: "en_US", siteName: "MingKai Precision Tools", title: "CNC Cutting Tools for Turning, Milling, Boring & Drilling | MingKai", description: "Explore CNC cutting tools and discuss metalworking applications with MingKai Precision Tools." },
  twitter: { card: "summary", title: "CNC Cutting Tools | MingKai Precision Tools", description: "Turning, milling, boring and drilling tools for B2B metalworking enquiries." },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", name: "Dongguan Mingkai Hardware Cutting Tools Co., Ltd.", alternateName: "MingKai Precision Tools", url: SITE_URL, logo: `${SITE_URL}/assets/brand-mark.png`, description: "English-language B2B contact and catalogue platform for metalworking cutting-tool requirements." },
    { "@type": "WebSite", name: "MingKai Precision Tools", url: SITE_URL, inLanguage: "en" },
    { "@type": "WebPage", name: "CNC Cutting Tools for Turning, Milling, Boring & Drilling", url: SITE_URL, inLanguage: "en", about: ["CNC cutting tools", "turning tools", "milling tools", "boring tools", "drilling tools", "U drill", "metalworking"] },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Script id="organization-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} /><AnalyticsTracker/><div className="page-shell"><SiteHeader />{children}<footer><div className="footer-brand">MINGKAI <span>PRECISION TOOLS</span></div><div><h3>Explore</h3><Link href="/products">Products</Link><Link href="/oem-odm">OEM / ODM</Link><Link href="/factory">Factory</Link><Link href="/blog">Blog</Link></div><div><h3>Contact</h3><WhatsAppButton className="footer-whatsapp" label="Get a quote" /><a href="mailto:zhong344675844@outlook.com">zhong344675844@outlook.com</a><Link href="/privacy">Privacy</Link></div><div><h3>For operators</h3><Link href="/admin">中文后台</Link><Link href="/sitemap.xml">Sitemap</Link></div><p className="footer-note">© {new Date().getFullYear()} Dongguan Mingkai Hardware Cutting Tools Co., Ltd. WhatsApp is the preferred channel for quotations and technical discussions.</p></footer></div><FloatingWhatsApp/></body></html>;
}
