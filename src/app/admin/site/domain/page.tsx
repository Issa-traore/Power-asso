import Link from "next/link";
import { requireOrgSession } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { DomainManager } from "@/components/admin/DomainManager";

export default async function AdminDomainPage() {
  const session = await requireOrgSession();
  const org = await prisma.organization.findUniqueOrThrow({
    where: { id: session.organizationId },
    include: { subscription: { include: { plan: true } } },
  });

  const hasCustomDomainFeature = Boolean(
    (org.subscription?.plan.features as { customDomain?: boolean } | null)?.customDomain,
  );
  const baseDomain = process.env.APP_BASE_DOMAIN || "localhost";

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">Domaine personnalisé</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Utilisez un nom de domaine que vous avez acheté chez un registrar externe (OVH, Namecheap, Google Domains...)
        plutôt que votre sous-domaine <code>{org.slug}.{baseDomain}</code>.
      </p>

      <div className="mt-6">
        {hasCustomDomainFeature ? (
          <DomainManager
            customDomain={org.customDomain}
            status={org.customDomainStatus}
            baseDomain={baseDomain}
          />
        ) : (
          <div className="rounded-lg border border-dashed border-neutral-300 bg-white p-6 text-center">
            <p className="text-sm text-neutral-600">
              Le domaine personnalisé est réservé aux forfaits supérieurs.
            </p>
            <Link href="/admin/billing" className="mt-3 inline-block rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
              Voir les forfaits
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
