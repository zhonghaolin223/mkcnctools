# Deployment and configuration

## Cloudflare account deployment

This build is a Cloudflare Worker with a static asset bundle. In the destination account, create one D1 database and one R2 bucket, apply the four SQL files in `drizzle/` in order, then set the Worker bindings to `DB` and `BUCKET`. Upload the contents of `dist/` (the Worker entrypoint is `dist/server/index.js` and assets are in `dist/client/`).

For `mkcnctools.com` purchased through NameSilo, either delegate the domain to the two Cloudflare nameservers shown after adding the zone, or keep NameSilo DNS and create the exact CNAME/A records Cloudflare provides for the Worker custom domain. DNS changes are made in NameSilo, not in this source package.

## Required before public launch

1. Keep `NEXT_PUBLIC_SITE_URL=https://mkcnctools.com`; the same domain is also the safe source-code default for canonical URLs.
2. Confirm the published email address and verified WhatsApp Business number.
3. Protect `/admin` and `/api/admin/*` with a Cloudflare Access application, then set the secret `ADMIN_EMAILS` to the allowed Access email(s). The Worker accepts the Access authenticated-email header as well as the managed preview sign-in headers.
4. Bind the production D1 database and R2 bucket, then apply every migration in `drizzle/` in order.
5. Configure the Turnstile site/secret keys before opening the inquiry form to public traffic.
6. Add GA4 and/or Clarity IDs only after the final privacy and cookie handling are reviewed.

## Already completed in source

- Product/category create, edit, duplicate, archive/delete, media ordering and draft preview are available in the Chinese admin.
- Product and category SEO pages, canonical URLs, sitemap entries and structured data are generated.
- Formal inquiries retain buyer name, role, company, website, country, buyer type, preferred contact method, consent time, product context and UTM/referrer data; the CRM can update status and notes.
- WhatsApp quote clicks and form events are recorded in first-party analytics, with optional GA4/Clarity forwarding.
- Public inquiry/event APIs use origin checks and durable D1 rate limits; inquiry submissions support a honeypot and server-verified Turnstile.

## Pre-launch preview and product upload

1. Keep the site private and open `/admin`.
2. Sign in with the protected preview account.
3. Add a category, upload product images, then create the product as **草稿**.
4. Review it at the product URL; set it to **已发布** only when the English content and images are ready.
5. Regenerate the source archive after each approved change. Do not bind a custom domain until this preview and content-upload review is complete.

## Data and notifications

- Contact submissions are stored in D1 in `inquiries`; WhatsApp chat content is intentionally not copied. Configure an email or CRM webhook separately if immediate notification is needed.
- GA4 recommended events: `generate_lead`, `whatsapp_click`, `product_view`, `category_view`, `form_start`, `form_submit`.
- Submit the final-domain sitemap to Google Search Console after the site is public.

## Security checklist

- Use HTTPS only and select one canonical hostname.
- Protect `/admin`, uploads and content-write APIs with server-side access control.
- Keep D1/R2 bindings server-side; do not expose write credentials in browser code.
- Keep Turnstile keys secret, retain the D1 rate-limit table, and review limits after real traffic begins.
