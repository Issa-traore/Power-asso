import { notFound } from "next/navigation";
import { getPublicOrganization, getTenantBasePath } from "@/lib/tenant";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { JoinForm } from "@/components/site/JoinForm";

export default async function AdhererPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ success?: string }>;
}) {
  const { slug } = await params;
  const { success } = await searchParams;
  const org = await getPublicOrganization(slug);
  if (!org || !org.settings) notFound();
  const basePath = await getTenantBasePath(slug);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader settings={org.settings} basePath={basePath} />
      <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <h1 className="text-2xl font-bold">Adhérer à {org.settings.siteName}</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Rejoignez l&apos;association pour accéder à l&apos;espace membre.
        </p>

        {success ? (
          <div className="mt-6 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800">
            Votre demande d&apos;adhésion a été enregistrée. Un administrateur va la valider.
          </div>
        ) : (
          <JoinForm slug={slug} primaryColor={org.settings.primaryColor} />
        )}
      </main>
      <SiteFooter settings={org.settings} basePath={basePath} />
    </div>
  );
}
