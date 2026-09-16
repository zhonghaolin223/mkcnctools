"use client";

import Script from "next/script";
import Link from "next/link";
import { FormEvent, useRef, useState } from "react";
import { trackEvent } from "@/components/analytics";

declare global { interface Window { turnstile?: { reset: (element?: HTMLElement | string) => void } } }

const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();

export function InquiryForm({ productId, productName }: { productId?: number; productName?: string }) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const started = useRef(false);

  function noteStart() {
    if (started.current) return;
    started.current = true;
    trackEvent("form_start", { path: window.location.pathname, product_id: productId, product_name: productName });
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const params = new URLSearchParams(window.location.search);
    setState("sending"); setErrorMessage("");
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(data),
          turnstileToken: data.get("cf-turnstile-response") || "",
          productId,
          productName,
          sourceUrl: window.location.href,
          trafficSource: document.referrer || "direct",
          utmSource: params.get("utm_source") || "",
          utmMedium: params.get("utm_medium") || "",
          utmCampaign: params.get("utm_campaign") || "",
        }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "Unable to send enquiry");
      form.reset(); started.current = false; setState("sent");
      trackEvent("form_submit", { path: window.location.pathname, product_id: productId, product_name: productName });
      window.turnstile?.reset();
    } catch (error) {
      setState("error"); setErrorMessage(error instanceof Error ? error.message : "Unable to send enquiry");
    }
  }

  return <form className="contact-form buyer-identity-form" onSubmit={submit} onFocus={noteStart}>
    {turnstileSiteKey && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive"/>}
    <fieldset>
      <legend>Buyer identity</legend>
      <div className="form-grid">
        <label>Your name *<input required autoComplete="name" name="name" maxLength={120}/></label>
        <label>Job title<input autoComplete="organization-title" name="jobTitle" maxLength={120} placeholder="Purchasing manager"/></label>
        <label>Business email *<input required autoComplete="email" type="email" name="email" maxLength={254}/></label>
        <label>WhatsApp / phone<input autoComplete="tel" type="tel" name="phone" maxLength={80} placeholder="Include country code"/></label>
        <label>Company name *<input required autoComplete="organization" name="company" maxLength={200}/></label>
        <label>Company website<input autoComplete="url" type="url" name="companyWebsite" maxLength={500} placeholder="https://company.com"/></label>
        <label>Country / region *<input required autoComplete="country-name" name="country" maxLength={120}/></label>
        <label>Buyer type *<select required name="buyerType" defaultValue=""><option value="" disabled>Select buyer type</option><option value="distributor">Distributor</option><option value="importer-wholesaler">Importer / wholesaler</option><option value="manufacturer">Manufacturer / end user</option><option value="tool-dealer">Cutting-tool dealer</option><option value="procurement-agent">Procurement agent</option><option value="other">Other</option></select></label>
        <label>Preferred contact<select name="preferredContact" defaultValue="email"><option value="email">Email</option><option value="whatsapp">WhatsApp</option><option value="phone">Phone</option></select></label>
      </div>
    </fieldset>
    <fieldset>
      <legend>Sourcing requirement</legend>
      <div className="form-grid">
        <label>Inquiry type<select name="interest"><option>Standard product / MingKai brand</option><option>Private label / OEM</option><option>ODM / custom design</option><option>General business inquiry</option></select></label>
        <label>Expected quantity<input name="quantity" maxLength={120}/></label>
        <label className="form-full">Requirement details *<textarea required name="message" maxLength={6000} placeholder="Tell us the CNC tool, model or size, quantity and brand route you need. For custom tools, add drawing, material, application and target specification."/></label>
      </div>
    </fieldset>
    <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="honeypot"/>
    <label className="privacy-consent"><input required name="privacyConsent" type="checkbox"/> <span>I agree that MingKai may use these details to respond to my inquiry, as described in the <Link href="/privacy">privacy notice</Link>.</span></label>
    {turnstileSiteKey && <div className="cf-turnstile" data-sitekey={turnstileSiteKey}/>}
    <button className="button" disabled={state === "sending"} type="submit">{state === "sending" ? "Sending…" : "Send inquiry"}</button>
    {state === "sent" && <p className="notice">Thank you. Your enquiry has been securely recorded.</p>}
    {state === "error" && <p className="notice">{errorMessage}</p>}
  </form>;
}
