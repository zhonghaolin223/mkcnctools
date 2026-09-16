"use client";

import { trackEvent } from "@/components/analytics";

const number = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8617688603879").replace(/\D/g, "");

export function FloatingWhatsApp() {
  const href = `https://wa.me/${number}?text=${encodeURIComponent("Hello, I would like to discuss a cutting tool requirement.")}`;
  return <a className="floating-whatsapp" href={href} target="_blank" rel="noopener noreferrer" aria-label="Chat with MingKai on WhatsApp" title="Chat on WhatsApp" onClick={() => trackEvent("whatsapp_click", { configured: true, placement: "floating", path: window.location.pathname, context: "悬浮 WhatsApp 按钮" })}><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2A12.7 12.7 0 0 0 5.2 22.6L3.5 28.5l6-1.6A12.8 12.8 0 1 0 16 3.2Zm0 23.1c-2 0-4-.6-5.6-1.8l-.4-.2-3.5.9.9-3.4-.2-.4A10.5 10.5 0 1 1 16 26.3Zm5.8-7.9c-.3-.2-2.1-1-2.4-1.1-.3-.1-.6-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.8.1-2.3-1.1-3.8-2.1-5.3-4.8-.2-.4 0-.6.1-.8l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.5 0-.7l-1.1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.3 0-.7.1-1 .5-.4.4-1.3 1.3-1.3 3.2s1.3 3.7 1.5 4c.2.3 2.5 3.9 6.2 5.4.9.4 1.6.6 2.2.7.9.3 1.8.2 2.4.1.7-.1 2.1-.9 2.4-1.8.3-.9.3-1.6.2-1.8-.1-.2-.3-.3-.6-.5Z" /></svg><span>Chat on WhatsApp</span></a>;
}
