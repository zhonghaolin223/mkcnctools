import { BackgroundVideo } from "@/components/background-video";
import { WhatsAppButton } from "@/components/whatsapp-button";

export function PageHeader({ eyebrow, title, children, className = "", backgroundVideoSrc, backgroundVideoStart }: { eyebrow: string; title: string; children: React.ReactNode; className?: string; backgroundVideoSrc?: string; backgroundVideoStart?: number }) {
  return <main className={`subpage ${className}`}>{backgroundVideoSrc && <BackgroundVideo src={backgroundVideoSrc} startAt={backgroundVideoStart} />}<div className="page-header-content"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><div>{children}</div><p><WhatsAppButton className="text-button" label="Get a Quote" /></p></div></main>;
}
