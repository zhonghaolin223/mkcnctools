import Link from "next/link";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="MingKai Precision Tools home">
        <img src="/assets/brand-mark.png" alt="MingKai brand mark" />
        <span>MINGKAI<br /><em>PRECISION TOOLS</em></span>
      </Link>
      <nav aria-label="Main navigation">
        <Link href="/products">Products</Link>
        <Link href="/oem-odm">OEM / ODM</Link>
        <Link href="/factory">Factory</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/about">About</Link>
      </nav>
      <details className="mobile-menu">
        <summary aria-label="Open navigation menu">Menu</summary>
        <nav aria-label="Mobile navigation">
          <Link href="/products">Products</Link>
          <Link href="/oem-odm">OEM / ODM</Link>
          <Link href="/factory">Factory</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/about">About</Link>
        </nav>
      </details>
      <WhatsAppButton className="header-cta" label="Get a Quote" message="Hello, I would like factory-direct pricing for CNC cutting tools." />
    </header>
  );
}
