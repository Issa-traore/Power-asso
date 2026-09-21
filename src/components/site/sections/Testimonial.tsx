import type { SectionContent } from "@/lib/sections/schema";

export function Testimonial({ content }: { content: SectionContent<"TESTIMONIAL"> }) {
  return (
    <section className="relative overflow-hidden bg-neutral-900 py-16 text-white">
      {content.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={content.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      )}
      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-2xl font-semibold italic">“{content.quote}”</p>
        {content.author && <p className="mt-4 text-sm text-white/70">{content.author}</p>}
      </div>
    </section>
  );
}
