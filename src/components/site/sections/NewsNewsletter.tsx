import Link from "next/link";
import type { SectionContent } from "@/lib/sections/schema";

export function NewsNewsletter({
  content,
  basePath,
  primaryColor,
}: {
  content: SectionContent<"NEWS_NEWSLETTER">;
  basePath: string;
  primaryColor: string;
}) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {content.heading && <h2 className="mb-8 text-2xl font-bold tracking-tight">{content.heading}</h2>}
        <div className="grid gap-6 lg:grid-cols-[2fr_1fr_1fr]">
          <div className="grid gap-6 sm:grid-cols-2">
            {content.articles.map((article, i) => (
              <Link key={i} href={`${basePath}${article.href}`} className="group overflow-hidden rounded-xl border border-neutral-200">
                {article.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.imageUrl} alt="" className="h-40 w-full object-cover" />
                )}
                <div className="p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: primaryColor }}>
                    {article.tag}
                  </span>
                  {article.date && <span className="ml-2 text-[11px] text-neutral-500">{article.date}</span>}
                  <h3 className="mt-2 font-semibold group-hover:underline">{article.title}</h3>
                  {article.excerpt && <p className="mt-1 text-sm text-neutral-600">{article.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>

          <div className="rounded-xl bg-neutral-100 p-6">
            <span className="inline-block rounded bg-emerald-600 px-2 py-1 text-[11px] font-semibold uppercase text-white">
              {content.newsletterBadge}
            </span>
            {content.newsletterHeading && <h3 className="mt-3 font-semibold">{content.newsletterHeading}</h3>}
            {content.newsletterText && <p className="mt-2 text-sm text-neutral-600">{content.newsletterText}</p>}
            <form className="mt-4 space-y-2">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                className="w-full rounded border border-neutral-300 px-3 py-2 text-sm"
              />
              <button
                type="submit"
                className="w-full rounded px-3 py-2 text-sm font-semibold text-white"
                style={{ background: primaryColor }}
              >
                {content.newsletterButtonLabel}
              </button>
            </form>
          </div>

          <div className="relative flex items-end overflow-hidden rounded-xl bg-neutral-900 p-6 text-white">
            {content.quoteImageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={content.quoteImageUrl} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
            )}
            <p className="relative text-lg font-semibold italic">“{content.quoteText}”</p>
          </div>
        </div>
      </div>
    </section>
  );
}
