"use client";

import Script from "next/script";
import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const gaId = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID?.trim();
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.trim();

export function trackEvent(name: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, payload }) });
  window.gtag?.("event", name === "inquiry_submit" ? "generate_lead" : name, payload);
  window.clarity?.("event", name);
}

export function AnalyticsTracker() {
  useEffect(() => { trackEvent("page_view", { path: window.location.pathname, referrer: document.referrer || "direct" }); }, []);
  return <>
    {gaId && <><Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive"/><Script id="ga4-init" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag('js',new Date());gtag('config','${gaId}',{send_page_view:false});`}</Script></>}
    {clarityId && <Script id="clarity-init" strategy="afterInteractive">{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src='https://www.clarity.ms/tag/'+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,'clarity','script','${clarityId}');`}</Script>}
  </>;
}
