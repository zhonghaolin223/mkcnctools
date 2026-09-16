import { PageHeader } from "@/components/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CNC Cutting Tool Workshop & Warehouse",
  description: "View workshop and warehouse imagery supplied by MingKai Precision Tools for B2B cutting-tool sourcing discussions.",
  alternates: { canonical: "/factory" },
};
export default function FactoryPage(){return <PageHeader eyebrow="FACTORY & WAREHOUSE" title="See the supplied factory imagery."><p>Images below are supplied by the company. This page does not infer certifications, production capacity, employee counts or other unconfirmed statements.</p><div className="warehouse-images"><img src="/assets/workshop.jpg" alt="Workshop supplied by MingKai"/><img src="/assets/warehouse-1.jpg" alt="Warehouse supplied by MingKai"/><img src="/assets/warehouse-2.jpg" alt="Warehouse supplied by MingKai"/></div></PageHeader>}
