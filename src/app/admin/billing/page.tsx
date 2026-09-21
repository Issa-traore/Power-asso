import { requireOrgSession } from "@/lib/guards";
import { prisma } from "@/lib/prisma";
import { startCheckout } from "@/lib/actions/billing-actions";

const STATUS_LABEL: Record<string, string> = {
  TRIALING: "Essai",
  ACTIVE: "Actif",
  PAST_DUE: "Paiement en retard",
  CANCELED: "Annulé",
  INCOMPLETE: "En attente de paiement",
};

function formatAmount(cents: number, currency: string) {
  return `${(cents / 100).toLocaleString("fr-FR")} ${currency}`;
}

export default async function AdminBillingPage() {
  const session = await requireOrgSession();
  const [subscription, plans, payments] = await Promise.all([
    prisma.subscription.findUnique({ where: { organizationId: session.organizationId }, include: { plan: true } }),
    prisma.plan.findMany({ where: { isActive: true }, orderBy: { priceCents: "asc" } }),
    prisma.payment.findMany({ where: { organizationId: session.organizationId }, orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold">Abonnement</h1>

      {subscription && (
        <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5">
          <div className="text-xs uppercase text-neutral-500">Forfait actuel</div>
          <div className="mt-1 text-lg font-semibold">
            {subscription.plan.name} — {STATUS_LABEL[subscription.status] ?? subscription.status}
          </div>
          <p className="mt-1 text-sm text-neutral-500">
            Fin de période : {subscription.currentPeriodEnd.toLocaleDateString("fr-FR")}
          </p>
        </div>
      )}

      <h2 className="mt-8 text-sm font-semibold uppercase text-neutral-500">Forfaits disponibles</h2>
      <div className="mt-3 grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => {
          const features = plan.features as { maxSections?: number; customDomain?: boolean; storageMb?: number };
          const isCurrent = subscription?.planId === plan.id && subscription.status === "ACTIVE";
          return (
            <div key={plan.id} className="flex flex-col rounded-xl border border-neutral-200 bg-white p-5">
              <div className="font-semibold">{plan.name}</div>
              <div className="mt-1 text-2xl font-bold">
                {formatAmount(plan.priceCents, plan.currency)}
                <span className="text-sm font-normal text-neutral-500">/{plan.interval === "YEARLY" ? "an" : "mois"}</span>
              </div>
              <ul className="mt-3 flex-1 space-y-1 text-sm text-neutral-600">
                <li>{features.maxSections ?? "∞"} sections</li>
                <li>{features.storageMb ?? "∞"} Mo de stockage</li>
                <li>{features.customDomain ? "Domaine personnalisé" : "Sous-domaine inclus"}</li>
              </ul>
              <form action={startCheckout.bind(null, plan.id)} className="mt-4">
                <button
                  type="submit"
                  disabled={isCurrent}
                  className="w-full rounded bg-neutral-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
                >
                  {isCurrent ? "Forfait actif" : "Choisir ce forfait"}
                </button>
              </form>
            </div>
          );
        })}
      </div>

      <h2 className="mt-8 text-sm font-semibold uppercase text-neutral-500">Historique des paiements</h2>
      <div className="mt-3 overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-xs uppercase text-neutral-500">
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Montant</th>
              <th className="px-4 py-2">Statut</th>
              <th className="px-4 py-2">Moyen</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">{p.createdAt.toLocaleDateString("fr-FR")}</td>
                <td className="px-4 py-2">{formatAmount(p.amountCents, p.currency)}</td>
                <td className="px-4 py-2">{p.status}</td>
                <td className="px-4 py-2">{p.provider}</td>
              </tr>
            ))}
            {payments.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-neutral-500" colSpan={4}>
                  Aucun paiement pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
