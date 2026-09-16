# MingKai Precision Tools — BUILD_SPEC

## Project definition

An English B2B lead-generation website for Dongguan Mingkai Hardware Cutting Tools Co., Ltd., with a Simplified Chinese management experience. It is not an online cart or checkout site. The primary conversions are `Request a Quote`, contact form submission and WhatsApp click after the business number is confirmed.

## Buyer and positioning

The public site is written for overseas B2B buyers researching turning, milling, boring and drilling tool applications. It deliberately does not claim certification scope, capacity, employee count, patent ownership, export footprint or commercial terms unless the company later supplies verifiable information.

## Sitemap

| Route | Purpose |
|---|---|
| `/` | English B2B homepage and conversion entry points |
| `/products` | Data-driven category and product listing; intentionally empty until real products are published |
| `/products/[category]` | Future dynamic category template |
| `/products/[product]` | Future dynamic product detail template with specifications and enquiry context |
| `/oem-odm` | Requirement-led OEM/ODM enquiry page |
| `/factory` | Supplied workshop and warehouse imagery |
| `/about` | Company identity without unverified claims |
| `/blog` | SEO resource area |
| `/contact` | Inquiry form and WhatsApp setup point |
| `/privacy` | Publication-blocking legal notice placeholder |
| `/admin` | Simplified Chinese administration experience |

## Image map

| Provided asset | Implemented location |
|---|---|
| 首页最上面轮播图 1–5 | Homepage hero carousel |
| 生产车间图 | Homepage workshop section; Factory page |
| 仓库图片 1–2 | Homepage warehouse section; Factory page |
| 证书.jpg | Homepage documentation section |
| 商标.png | Header brand mark |
| 6–10 产品/品类入口 images | Reserved pending the original files being supplied to this workspace |
| 11 WhatsApp image | Reserved pending the original file and business number |

## Content and SEO rules

- English page copy uses a professional B2B tone and CTA language: Request a Quote, Discuss a Requirement, Contact Us.
- Each product, category, page and blog entry has editable slug, SEO title, meta description and index setting.
- Product specifications are label/value rows, not a fixed list of fields.
- `robots.txt`, XML sitemap, semantic headings, canonical-ready metadata, 404 page and image ALT fields are included.
- Do not publish the `example.com` URLs, placeholder email or legal notice. Set the final domain and contact data first.

## Data model

Cloudflare D1 stores categories, products, product-category relations, dynamic product specifications, media metadata, posts, pages, inquiries, site settings and analytics events. Cloudflare R2 stores uploaded media files. Indexes support category sorting, product publication lookups, product specifications, inquiry queues and blog publication.

## Acceptance conditions

1. The final domain, verified contacts, WhatsApp number and privacy notice are supplied.
2. Database migration is deployed before enabling forms or admin content edits.
3. Category/product images 6–10 and WhatsApp creative 11 are added to the media library and mapped in the CMS.
4. Publicly visible demo records are removed or retained only in draft status.
