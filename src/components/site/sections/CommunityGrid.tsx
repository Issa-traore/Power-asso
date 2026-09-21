import Link from "next/link";
import { getIcon } from "@/lib/sections/icons";
import type { SectionContent } from "@/lib/sections/schema";

function Column({
  column,
  basePath,
  primaryColor,
}: {
  column: SectionContent<"COMMUNITY_GRID">["left"];
  basePath: string;
  primaryColor: string;
}) {
  return (
    <div>
      {column.heading && <h3 className="mb-4 text-lg font-bold">{column.heading}</h3>}
      {column.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={column.imageUrl} alt="" className="mb-4 h-40 w-full rounded-lg object-cover" />
      )}
      <ul className="space-y-4">
        {column.items.map((item, i) => {
          const Icon = getIcon(item.icon);
          return (
            <li key={i}>
              <Link href={`${basePath}${item.href}`} className="flex items-start gap-3 hover:opacity-80">
                <Icon className="mt-0.5 h-5 w-5 shrink-0" style={{ color: primaryColor }} />
                <div>
                  <div className="font-medium">{item.title}</div>
                  {item.description && <div className="text-sm text-neutral-600">{item.description}</div>}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      {column.cta && (
        <Link
          href={`${basePath}${column.cta.href}`}
          className="mt-4 inline-flex text-sm font-semibold"
          style={{ color: primaryColor }}
        >
          {column.cta.label} →
        </Link>
      )}
    </div>
  );
}

export function CommunityGrid({
  content,
  basePath,
  primaryColor,
}: {
  content: SectionContent<"COMMUNITY_GRID">;
  basePath: string;
  primaryColor: string;
}) {
  return (
    <section className="bg-neutral-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {content.heading && <h2 className="mb-10 text-2xl font-bold tracking-tight">{content.heading}</h2>}
        <div className="grid gap-10 lg:grid-cols-2">
          <Column column={content.left} basePath={basePath} primaryColor={primaryColor} />
          <Column column={content.right} basePath={basePath} primaryColor={primaryColor} />
        </div>
      </div>
    </section>
  );
}
