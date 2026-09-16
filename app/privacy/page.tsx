import { PageHeader } from "@/components/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Notice", description: "How MingKai Precision Tools handles website and business inquiry information." };
export default function PrivacyPage(){return <PageHeader eyebrow="PRIVACY" title="Privacy notice.">
  <p>Dongguan Mingkai Hardware Cutting Tools Co., Ltd. uses the information submitted through mkcnctools.com to answer product, quotation, OEM/ODM and business enquiries.</p>
  <section><h2>Information we collect</h2><p>The inquiry form may collect your name, job title, business email, telephone or WhatsApp number, company name, company website, country or region, buyer type, product interest, expected quantity and the details you choose to provide.</p></section>
  <section><h2>How we use it</h2><p>We use this information to identify your business, respond through your preferred contact channel, prepare quotations, discuss technical requirements and manage follow-up in our internal inquiry system. We do not copy WhatsApp chat content into the website CRM.</p></section>
  <section><h2>Service providers and retention</h2><p>Website hosting, security, analytics and communication providers may process limited information only where needed to operate these services. Inquiry records are retained only for business follow-up, recordkeeping and legitimate operational needs, then removed when no longer required.</p></section>
  <section><h2>Your choices</h2><p>You may ask us to correct or delete your inquiry information, or stop follow-up communication, by emailing <a href="mailto:zhong344675844@outlook.com">zhong344675844@outlook.com</a>. Opening WhatsApp is subject to WhatsApp’s own privacy terms.</p></section>
  <p className="privacy-review-note"><strong>Last updated:</strong> September 14, 2026. This notice must be reviewed against the company’s final hosting, analytics and advertising configuration before public launch.</p>
</PageHeader>}
