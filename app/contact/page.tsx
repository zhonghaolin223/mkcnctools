import { PageHeader } from "@/components/page-header";
import { InquiryForm } from "@/components/inquiry-form";
import { WhatsAppButton } from "@/components/whatsapp-button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Request a CNC Cutting Tool Quote",
  description: "Request a quotation or discuss a CNC turning, milling, boring or drilling tool requirement with MingKai Precision Tools.",
  alternates: { canonical: "/contact" },
};
export default function ContactPage(){return <PageHeader eyebrow="CONTACT" title="Start a B2B conversation."><p>Tell us the CNC tool, size, quantity and brand route you need. We support MingKai-branded products, private label, OEM and ODM supply.</p><div id="whatsapp" className="quote-card"><strong>Get factory-direct pricing</strong><p>Send a product name, model, size, quantity or packaging request. Only non-standard customization requires a drawing, workpiece material, application and target specification.</p><WhatsAppButton message="Hello, I would like to discuss the CNC cutting tool I need." label="Open WhatsApp to Get a Quote" /></div><section className="contact-inquiry"><h2>Send a formal inquiry</h2><p>Use this form when you want us to keep your contact details and sourcing requirement in our inquiry system.</p><InquiryForm/></section><div className="empty-card"><strong>Prefer email?</strong><p>For product lists, drawings, specifications or formal communication, email <a href="mailto:zhong344675844@outlook.com">zhong344675844@outlook.com</a>.</p></div></PageHeader>}
