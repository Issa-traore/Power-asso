import { getIcon } from "@/lib/sections/icons";
import type { SectionContent } from "@/lib/sections/schema";

export function Features({ content, primaryColor }: { content: SectionContent<"FEATURES">; primaryColor: string }) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {content.heading && (
          <h2 className="mb-10 text-center text-2xl font-bold tracking-tight">{content.heading}</h2>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, i) => {
            const Icon = getIcon(item.icon);
            return (
              <div key={i} className="rounded-xl border border-neutral-200 p-6 text-center shadow-sm">
                <div
                  className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
                  style={{ background: `${primaryColor}1a`, color: primaryColor }}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="font-semibold">{item.title}</div>
                {item.description && <p className="mt-2 text-sm text-neutral-600">{item.description}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
