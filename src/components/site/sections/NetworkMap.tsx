import Link from "next/link";
import { getIcon } from "@/lib/sections/icons";
import type { SectionContent } from "@/lib/sections/schema";

export function NetworkMap({
  content,
  basePath,
  primaryColor,
}: {
  content: SectionContent<"NETWORK_MAP">;
  basePath: string;
  primaryColor: string;
}) {
  return (
    <section className="grid gap-0 bg-neutral-950 text-white lg:grid-cols-[2fr_1fr]">
      <div className="p-10">
        {content.heading && <h2 className="text-xl font-bold">{content.heading}</h2>}
        <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {content.stats.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={i} className="flex items-center gap-2">
                <Icon className="h-6 w-6 opacity-80" />
                <div>
                  <div className="text-lg font-bold">{item.value}</div>
                  <div className="text-[11px] uppercase tracking-wide text-white/60">{item.label}</div>
                </div>
              </div>
            );
          })}
        </div>
        {content.mapImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={content.mapImageUrl} alt="" className="mt-6 max-h-64 w-full object-contain opacity-90" />
        )}
      </div>
      <div className="bg-neutral-900 p-10">
        {content.sideHeading && <h3 className="text-lg font-bold">{content.sideHeading}</h3>}
        {content.sideText && <p className="mt-2 text-sm text-white/70">{content.sideText}</p>}
        {content.primaryCta && (
          <Link
            href={`${basePath}${content.primaryCta.href}`}
            className="mt-4 inline-flex rounded px-4 py-2 text-sm font-semibold text-white"
            style={{ background: primaryColor }}
          >
            {content.primaryCta.label}
          </Link>
        )}
        <ul className="mt-6 space-y-3 text-sm">
          {content.links.map((link, i) => {
            const Icon = getIcon(link.icon);
            return (
              <li key={i}>
                <Link href={`${basePath}${link.href}`} className="flex items-center gap-2 text-white/80 hover:text-white">
                  <Icon className="h-4 w-4" />
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
