import Link from "next/link";
import type { SectionContent } from "@/lib/sections/schema";

export function CtaFooter({
  content,
  basePath,
  primaryColor,
  secondaryColor,
}: {
  content: SectionContent<"CTA_FOOTER">;
  basePath: string;
  primaryColor: string;
  secondaryColor: string;
}) {
  return (
    <section className="relative overflow-hidden py-16 text-white" style={{ background: secondaryColor }}>
      {content.backgroundImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={content.backgroundImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" />
      )}
      <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center">
        <div>
          <h2 className="text-2xl font-bold">{content.heading}</h2>
          {content.text && <p className="mt-2 max-w-xl text-white/80">{content.text}</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`${basePath}${content.primaryCta.href}`}
            className="rounded px-6 py-3 text-sm font-semibold text-white"
            style={{ background: primaryColor }}
          >
            {content.primaryCta.label}
          </Link>
          {content.secondaryCta && (
            <Link
              href={`${basePath}${content.secondaryCta.href}`}
              className="rounded border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              {content.secondaryCta.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
