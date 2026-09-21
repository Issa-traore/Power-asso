import Link from "next/link";
import { requireOrganization } from "@/lib/guards";
import { prisma } from "@/lib/prisma";

const STATUS_LABEL: Record<string, string> = {
  TRIAL: "Essai",
  ACTIVE: "Actif",
  SUSPENDED: "Suspendu",
  CANCELED: "Annulé",
};

export default async function AdminDashboardPage() {
  const { organization } = await requireOrganization();
  const [sectionCount, mediaCount] = await Promise.all([
    prisma.section.count({ where: { organizationId: organization.id } }),
    prisma.media.count({ where: { organizationId: organization.id } }),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold">Bonjour, {organization.name}</h1>
      <p className="mt-1 text-sm text-neutral-500">Voici un aperçu de votre site et de votre abonnement.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-xs uppercase text-neutral-500">Statut du compte</div>
          <div className="mt-1 text-lg font-semibold">{STATUS_LABEL[organization.status] ?? organization.status}</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-xs uppercase text-neutral-500">Sections publiées</div>
          <div className="mt-1 text-lg font-semibold">{sectionCount}</div>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-xs uppercase text-neutral-500">Médias</div>
          <div className="mt-1 text-lg font-semibold">{mediaCount}</div>
        </div>
      </div>

      {organization.subscription && (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-xs uppercase text-neutral-500">Abonnement</div>
          <div className="mt-1 text-lg font-semibold">
            {organization.subscription.plan.name} — {organization.subscription.status}
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            Période en cours jusqu&apos;au {organization.subscription.currentPeriodEnd.toLocaleDateString("fr-FR")}
          </p>
          <Link href="/admin/billing" className="mt-3 inline-block text-sm font-medium text-neutral-900 underline">
            Gérer mon abonnement →
          </Link>
        </div>
      )}

      <div className="mt-6 flex gap-3">
        <Link href="/admin/site" className="rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white">
          Personnaliser ma page d&apos;accueil
        </Link>
        <Link href="/admin/media" className="rounded border border-neutral-300 px-4 py-2 text-sm font-semibold">
          Ajouter des images
        </Link>
      </div>
    </div>
  );
}
