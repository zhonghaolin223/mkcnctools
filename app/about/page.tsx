import { PageHeader } from "@/components/page-header";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About MingKai Precision Tools",
  description: "Learn about MingKai Precision Tools and start a B2B discussion for CNC turning, milling, boring and drilling tools.",
  alternates: { canonical: "/about" },
};
export default function AboutPage(){return <PageHeader eyebrow="ABOUT MINGKAI" title="A B2B contact point for cutting-tool sourcing."><p>Dongguan Mingkai Hardware Cutting Tools Co., Ltd. is the named operator of this website. The site is structured for global B2B buyers seeking turning, milling, boring and drilling tool discussions.</p><p>Company history, address, contacts and verified capability details can be maintained in 后台 → 网站设置 before publication.</p></PageHeader>}
