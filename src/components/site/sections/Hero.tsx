import Link from "next/link";
import type { SectionContent } from "@/lib/sections/schema";

export function Hero({
  content,
  basePath,
  primaryColor,
}: {
  content: SectionContent<"HERO">;
  basePath: string;
  primaryColor: string;
}) {
  return (
    <section className="relative isolate flex min-h-[560px] items-center overflow-hidden bg-neutral-900 text-white">
      {content.backgroundImageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={content.backgroundImageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6">
        <div className="max-w-2xl">
          {content.eyebrow && (
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest" style={{ color: primaryColor }}>
              {content.eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl">
            {content.titleLine1}
            {content.titleLine2 && <span className="block">{content.titleLine2}</span>}
            {content.titleHighlight && (
              <span className="block" style={{ color: primaryColor }}>
                {content.titleHighlight}
              </span>
            )}
          </h1>
          {content.description && <p className="mt-5 max-w-xl text-lg text-white/85">{content.description}</p>}
          <div className="mt-8 flex flex-wrap gap-3">
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
      </div>
    </section>
  );
}
