"use client";

import { trackEvent } from "@/components/analytics";

const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8617688603879").replace(/\D/g, "");

export function WhatsAppButton({ className = "button", message = "Hello, I would like to discuss a cutting tool requirement.", label = "Get a Quote", trackingContext }: { className?: string; message?: string; label?: string; trackingContext?: string }) {
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("whatsapp_click", { configured: true, path: window.location.pathname, label, context: trackingContext || "通用报价入口" })}>{label} <span aria-hidden="true">→</span></a>;
}
