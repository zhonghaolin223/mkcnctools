import { getDb } from "@/db";
import { inquiries } from "@/db/schema";
import { enforceRateLimit, verifyTurnstile } from "@/lib/request-security";

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

const buyerTypes = new Set(["distributor", "importer-wholesaler", "manufacturer", "tool-dealer", "procurement-agent", "other"]);
const contactMethods = new Set(["email", "whatsapp", "phone"]);

function validWebsite(value: string) {
  if (!value) return true;
  try { const url = new URL(value); return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname); }
  catch { return false; }
}

export async function POST(request: Request) {
  try {
    const origin = request.headers.get("origin");
    if (origin && origin !== new URL(request.url).origin) return Response.json({ error: "Invalid origin" }, { status: 403 });
    const rateLimit = await enforceRateLimit(request, "inquiry", 5, 3600);
    if (!rateLimit.allowed) return Response.json({ error: "Too many enquiries. Please try again later." }, { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } });

    const body = await request.json() as Record<string, unknown>;
    if (clean(body.website, 100)) return Response.json({ ok: true }, { status: 201 });
    const turnstile = await verifyTurnstile(request, clean(body.turnstileToken, 2048));
    if (!turnstile.ok) return Response.json({ error: "Security verification failed. Please try again." }, { status: 400 });

    const name = clean(body.name, 120);
    const email = clean(body.email, 254);
    const company = clean(body.company, 200);
    const country = clean(body.country, 120);
    const buyerType = clean(body.buyerType, 80);
    const preferredContact = clean(body.preferredContact, 30) || "email";
    const companyWebsite = clean(body.companyWebsite, 500);
    const phone = clean(body.phone, 80);
    const message = clean(body.message, 6000);
    const consentGiven = body.privacyConsent === "on" || body.privacyConsent === true;
    if (!name || !email || !company || !country || !buyerTypes.has(buyerType) || !message || !/^\S+@\S+\.\S+$/.test(email)) return Response.json({ error: "Complete all required buyer and company details" }, { status: 400 });
    if (!contactMethods.has(preferredContact) || ((preferredContact === "whatsapp" || preferredContact === "phone") && !phone)) return Response.json({ error: "Add a phone number for your preferred contact method" }, { status: 400 });
    if (!validWebsite(companyWebsite)) return Response.json({ error: "Enter a valid company website starting with http:// or https://" }, { status: 400 });
    if (!consentGiven) return Response.json({ error: "Please accept the privacy notice" }, { status: 400 });
    const productId = Number(body.productId);
    const sourceUrl = clean(body.sourceUrl, 1000) || new URL(request.url).origin;
    const [inquiry] = await getDb().insert(inquiries).values({
      name,
      email,
      message,
      company,
      jobTitle: clean(body.jobTitle, 120),
      phone,
      country,
      companyWebsite,
      buyerType,
      preferredContact,
      privacyConsentAt: new Date().toISOString(),
      quantity: clean(body.quantity, 120),
      interest: clean(body.interest, 200),
      productId: Number.isInteger(productId) && productId > 0 ? productId : null,
      productName: clean(body.productName, 250),
      sourceUrl,
      trafficSource: clean(body.trafficSource, 250),
      utmSource: clean(body.utmSource, 250),
      utmMedium: clean(body.utmMedium, 250),
      utmCampaign: clean(body.utmCampaign, 250),
    }).returning();
    return Response.json({ inquiry }, { status: 201 });
  } catch (error) {
    console.error("inquiry create failed", error);
    return Response.json({ error: "Inquiry service is temporarily unavailable" }, { status: 503 });
  }
}
