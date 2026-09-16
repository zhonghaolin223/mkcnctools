import { HeroCarousel } from "@/components/hero-carousel";
import { WhatsAppButton } from "@/components/whatsapp-button";
import Link from "next/link";

const solutions = [
  { name: "Turning Tools", detail: "For precision turning applications", slug: "turning" },
  { name: "Milling Tools", detail: "For efficient milling operations", slug: "milling" },
  { name: "Boring Tools", detail: "For controlled internal machining", slug: "boring" },
  { name: "Drilling Tools", detail: "For dependable holemaking", slug: "drilling" },
];

export default function Home() {
  return (
    <main>
      <HeroCarousel />

      <section className="intro section" aria-labelledby="intro-title">
        <video className="intro-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
          <source src="/assets/aluminum-milling-tool.mp4" type="video/mp4" />
        </video>
        <div className="intro-copy">
          <p className="eyebrow">MINGKAI CNC CUTTING TOOLS</p>
          <h2 id="intro-title">CNC Cutting Tools for Turning, Milling, Boring &amp; Drilling</h2>
          <p>MingKai Precision Tools helps overseas B2B buyers source the CNC tools they need. Browse standard products or tell us the tool, size, quantity and brand route you prefer — our own brand, OEM or ODM.</p>
          <div className="text-links"><Link href="/products">Explore CNC Cutting Tools</Link><WhatsAppButton className="inline-link" label="Request a Tooling Quote" /></div>
        </div>
      </section>

      <section className="solutions section" aria-labelledby="solutions-title">
        <div className="section-heading"><div><p className="eyebrow">PRODUCT DIRECTIONS</p><h2 id="solutions-title">Explore cutting-tool applications</h2></div><Link href="/products">View product centre →</Link></div>
        <div className="solution-grid">
          {solutions.map((solution, index) => <Link className="solution-card" href={`/products?application=${solution.slug}`} key={solution.slug}>
            <span>0{index + 1}</span><h3>{solution.name}</h3><p>{solution.detail}</p><b>Explore →</b>
          </Link>)}
        </div>
        <p className="asset-note">Product-category images will be added from the supplied “6–10” image set when it is available in the project library.</p>
      </section>

      <section className="buyer-guide section" aria-labelledby="buyer-guide-title">
        <div><p className="eyebrow">FOR B2B BUYERS</p><h2 id="buyer-guide-title">Start with the tool you need.</h2></div>
        <ol>
          <li><strong>Tell us the tool or result you need.</strong><span>Share the tool type, size, machine or machining result. OEM/ODM and MingKai-branded supply are welcome.</span></li>
          <li><strong>Choose a sourcing route.</strong><span>Pick a standard product, request our brand, or discuss private-label packaging for your market.</span></li>
          <li><strong>Add details only when needed.</strong><span>For a non-standard custom tool, send the drawing, workpiece material, application and target specification.</span></li>
        </ol>
      </section>

      <section className="capability-band">
        <div><p className="eyebrow">B2B INQUIRY</p><h2>Tell us which CNC tool you need.</h2><p>Standard product, MingKai brand, private label, OEM or ODM — send the tool type, size and quantity. Detailed drawings are only needed for non-standard customization.</p></div>
        <WhatsAppButton className="button button-light" label="Get a Quote" message="Hello, I would like to discuss a CNC cutting tool requirement." />
      </section>

      <section className="factory section" aria-labelledby="factory-title">
        <div className="workshop-marquee" aria-label="MingKai production workshop images scrolling from right to left"><div className="workshop-marquee-track"><img src="/assets/workshop.jpg" alt="Production workshop supplied by MingKai" /><img src="/assets/workshop.jpg" alt="" aria-hidden="true" /></div></div>
        <div className="factory-copy factory-profile"><p id="factory-title">MingKai Tools: Your Global Partner for Precision CNC Cutting & Deep Hole Drilling Solutions<br />For 17 years, MingKai Tools (Dongguan Xingjie CNC Tool Co.) has engineered premium CNC cutting tools and deep hole drill bits trusted worldwide. Operating from a 10,000 sqm advanced facility with 80+ multi-axis CNC centers and rigorous 100% inspection, we guarantee unmatched precision and durability. Enjoy fast delivery from extensive stock, OEM branding, or fully customized non-standard tool designs. Experience the MingKai difference – where proven quality meets global capability.</p></div>
      </section>

      <section className="warehouse-grid section" aria-labelledby="warehouse-title">
        <div className="section-heading"><div><p className="eyebrow">WAREHOUSE & INVENTORY</p><h2 id="warehouse-title">Real supplied warehouse imagery</h2></div><Link href="/factory">Factory & warehouse →</Link></div>
        <div className="warehouse-images"><img src="/assets/warehouse-1.jpg" alt="Warehouse image 1 supplied by MingKai" /><img src="/assets/warehouse-2.jpg" alt="Warehouse image 2 supplied by MingKai" /></div>
      </section>

      <section className="trust section">
        <div><p className="eyebrow">QUALITY DOCUMENTATION</p><h2>Certificates & Technical Documentation</h2><p>Review the certificate materials supplied by MingKai. For documentation relevant to your sourcing or machining requirement, contact our team.</p><WhatsAppButton className="text-button" label="Discuss your requirement" /></div>
        <div className="certificate-marquee" aria-label="Certificate materials scrolling from right to left"><div className="certificate-marquee-track"><img src="/assets/certificate.jpg" alt="Certificate materials supplied by MingKai" /><img src="/assets/certificate.jpg" alt="" aria-hidden="true" /></div></div>
      </section>

      <section className="whatsapp-panel section">
        <p className="eyebrow">FAST RESPONSE CHANNEL</p><h2>Prefer WhatsApp?</h2><p>Message MingKai directly with the CNC tool, quantity or brand route you need. Add drawings and application details when a custom tool is required.</p>
        <WhatsAppButton label="Start on WhatsApp" />
      </section>

      <section className="faq section" aria-labelledby="faq-title">
        <p className="eyebrow">BUYER QUESTIONS</p><h2 id="faq-title">Frequently asked questions</h2>
        <div className="faq-grid">
          <article><h3>Which cutting-tool applications are covered?</h3><p>The website is organised around turning, milling, boring and drilling tool discussions for metalworking applications. Confirmed products will appear in the product centre.</p></article>
          <article><h3>What should a quotation enquiry include?</h3><p>Start with the CNC tool type, model or size, expected quantity and whether you need MingKai branding, private label, OEM or ODM. For a custom tool, add the drawing, workpiece material, application and target specification.</p></article>
          <article><h3>Can I see product parameters before I enquire?</h3><p>Yes. When a product is published, its English page can show the images, description, dynamic parameters and the route to request a quote. Unconfirmed products are not displayed as catalogue claims.</p></article>
        </div>
      </section>
    </main>
  );
}
