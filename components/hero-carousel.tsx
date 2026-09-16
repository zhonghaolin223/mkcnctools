"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WhatsAppButton } from "@/components/whatsapp-button";

const slides = [1, 2, 3, 4, 5].map((number) => ({ src: `/assets/hero-${number}.png`, alt: `Machining tools hero slide ${number}` }));

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  useEffect(() => { const timer = window.setInterval(() => setActive((index) => (index + 1) % slides.length), 6500); return () => window.clearInterval(timer); }, []);
  return <section className="hero" aria-label="Featured cutting tool imagery">
    {slides.map((slide, index) => <img key={slide.src} src={slide.src} alt={slide.alt} className={index === active ? "is-active" : ""} />)}
    <div className="hero-shade" />
    <div className="hero-content"><p className="eyebrow">FACTORY-DIRECT CNC CUTTING TOOLS</p><h1>Tell us the CNC tool you need.</h1><p>Browse standard turning, milling, boring and drilling tools, or speak directly with MingKai about our brand, private label, OEM and ODM supply.</p><div className="hero-actions"><WhatsAppButton message="Hello, I would like to discuss the CNC cutting tool I need." label="Get Factory-Direct Pricing"/><Link className="button button-ghost" href="/products">Browse Products</Link></div></div>
    <div className="hero-dots" role="tablist" aria-label="Hero images">{slides.map((slide, index) => <button key={slide.src} type="button" onClick={() => setActive(index)} aria-label={`Show slide ${index + 1}`} aria-selected={index === active} className={index === active ? "active" : ""} />)}</div>
  </section>;
}
