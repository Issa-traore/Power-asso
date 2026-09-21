import { getIcon } from "@/lib/sections/icons";
import type { SectionContent } from "@/lib/sections/schema";

export function Stats({ content, secondaryColor }: { content: SectionContent<"STATS">; secondaryColor: string }) {
  return (
    <section className="py-6 text-white" style={{ background: secondaryColor }}>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6">
        {content.items.map((item, i) => {
          const Icon = getIcon(item.icon);
          return (
            <div key={i} className="flex items-center gap-3">
              <Icon className="h-7 w-7 shrink-0 opacity-80" />
              <div>
                <div className="text-xl font-bold">{item.value}</div>
                <div className="text-xs uppercase tracking-wide text-white/70">{item.label}</div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
