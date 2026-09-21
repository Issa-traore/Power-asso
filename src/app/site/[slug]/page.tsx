import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPublicOrganization, getTenantBasePath } from "@/lib/tenant";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SectionRenderer } from "@/components/site/SectionRenderer";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const org = await getPublicOrganization(slug);
  if (!org?.settings) return {};
  return {
    title: org.settings.siteName,
    description: org.settings.tagline ?? undefined,
  };
}

export default async function TenantHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getPublicOrganization(slug);

  if (!org || !org.settings) notFound();

  const basePath = await getTenantBasePath(slug);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader settings={org.settings} basePath={basePath} />
      <main>
        {org.sections.map((section) => (
          <SectionRenderer key={section.id} section={section} settings={org.settings!} basePath={basePath} />
        ))}
      </main>
      <SiteFooter settings={org.settings} basePath={basePath} />
    </div>
  );
}
