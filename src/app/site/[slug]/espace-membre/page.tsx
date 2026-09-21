import { notFound } from "next/navigation";
import { getPublicOrganization, getTenantBasePath } from "@/lib/tenant";
import { getMemberSession } from "@/lib/member-auth";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { MemberLoginForm } from "@/components/site/MemberLoginForm";
import { logoutMember } from "@/lib/actions/member-actions";

export default async function EspaceMembrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const org = await getPublicOrganization(slug);
  if (!org || !org.settings) notFound();
  const basePath = await getTenantBasePath(slug);
  const session = await getMemberSession();
  const isMember = session?.organizationId === org.id;

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader settings={org.settings} basePath={basePath} />
      <main className="mx-auto max-w-md px-4 py-16 sm:px-6">
        {isMember ? (
          <div>
            <h1 className="text-2xl font-bold">Bienvenue, {session!.fullName}</h1>
            <p className="mt-2 text-sm text-neutral-600">Vous êtes connecté à l&apos;espace membre de {org.settings.siteName}.</p>
            <form action={logoutMember.bind(null, slug)} className="mt-6">
              <button type="submit" className="rounded border border-neutral-300 px-4 py-2 text-sm font-medium">
                Se déconnecter
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold">Espace membre</h1>
            <p className="mt-2 text-sm text-neutral-600">Connectez-vous avec vos identifiants d&apos;adhérent.</p>
            <MemberLoginForm slug={slug} primaryColor={org.settings.primaryColor} />
          </div>
        )}
      </main>
      <SiteFooter settings={org.settings} basePath={basePath} />
    </div>
  );
}
