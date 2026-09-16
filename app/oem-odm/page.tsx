import { PageHeader } from "@/components/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OEM & ODM CNC Cutting Tool Enquiries",
  description: "Discuss OEM or ODM CNC cutting-tool requirements for turning, milling, boring and drilling applications.",
  alternates: { canonical: "/oem-odm" },
};
export default function OemPage(){return <PageHeader eyebrow="OEM / ODM" title="Start with the CNC tool you need."><p>We can supply standard MingKai products, your own brand, private-label packaging, OEM production or ODM development.</p><div className="empty-card"><strong>What to send us</strong><p>For standard or private-label supply: tool type, model or size, quantity, packaging and brand request. For non-standard customization: drawing, workpiece material, application and target specification.</p></div></PageHeader>}
